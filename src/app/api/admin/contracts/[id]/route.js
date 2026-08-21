import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Contract from "@/models/contract";
import { cleanContractInput, validateContractInput, validMutationOrigin } from "@/lib/contracts/http";
import { cleanTemplate } from "@/lib/contracts/template";
import { generatePublicToken, hashToken, stableHash } from "@/lib/contracts/security";
import { sendSignedNotification } from "@/lib/contracts/notify";
import { rememberSellerSignature } from "@/lib/contracts/sellerSignatures";

const validId = (id) => mongoose.isValidObjectId(id);
async function persistSigningLink(contract,token,event,detail){const tokenHash=hashToken(token),set={tokenHash,tokenValue:token,status:"ready",snapshotHash:stableHash(contract.templateSnapshot),viewedAt:null};if(contract.linkExpiresAt&&contract.linkExpiresAt<=new Date())set.linkExpiresAt=null;const result=await Contract.collection.updateOne({_id:contract._id},{$set:set,$push:{audit:{event,actor:"admin",detail,at:new Date()}}});if(result.matchedCount!==1)throw new Error("The contract disappeared while its signing link was being saved.");const stored=await Contract.collection.findOne({_id:contract._id},{projection:{tokenHash:1,tokenValue:1}});if(!stored?.tokenValue||stored.tokenHash!==tokenHash||stored.tokenValue!==token)throw new Error("The active signing link could not be verified after saving.");}
export async function GET(_request, { params }) { const { id } = await params; if (!validId(id)) return NextResponse.json({ error: "Not found." }, { status: 404 }); await dbConnect(); const c = await Contract.findById(id).select("-tokenHash -signature -auditIp -auditUserAgent -audit").lean(); return c ? NextResponse.json(c) : NextResponse.json({ error: "Not found." }, { status: 404 }); }
export async function PUT(request, { params }) {
  try {
    if (!validMutationOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 }); const { id } = await params; if (!validId(id)) return NextResponse.json({ error: "Not found." }, { status: 404 }); await dbConnect();
    const existing = await Contract.findById(id); if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 }); if (existing.status === "signed") return NextResponse.json({ error: "Signed contracts are read-only." }, { status: 409 });
    const raw = await request.json(); const clean = cleanContractInput(raw); const errors = validateContractInput(clean); if (errors.length) return NextResponse.json({ error: "Validation failed.", errors }, { status: 422 });
    const previousSignatureUrl=existing.templateSnapshot?.sellerRepresentative?.signatureUrl||"";Object.assign(existing, clean); if (raw.templateSnapshot && existing.status === "draft") { existing.templateSnapshot = cleanTemplate(raw.templateSnapshot); existing.snapshotHash = stableHash(existing.templateSnapshot); existing.markModified("templateSnapshot"); } existing.audit.push({ event: "edited", actor: "admin" }); await existing.save();const rep=existing.templateSnapshot?.sellerRepresentative;if(rep?.signatureUrl&&rep.signatureUrl!==previousSignatureUrl)await rememberSellerSignature(rep);return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contract update failed:", error);
    return NextResponse.json({ error: process.env.NODE_ENV === "development" ? error.message : "The contract could not be updated." }, { status: 500 });
  }
}
export async function DELETE(request, { params }) {
  try {
    if (!validMutationOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    const { id } = await params;
    if (!validId(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });
    await dbConnect();
    const deleted = await Contract.findByIdAndDelete(id);
    return deleted
      ? NextResponse.json({ ok: true, deletedId: id, status: deleted.status })
      : NextResponse.json({ error: "Not found." }, { status: 404 });
  } catch (error) {
    console.error("Contract deletion failed:", error);
    return NextResponse.json({ error: process.env.NODE_ENV === "development" ? error.message : "The contract could not be deleted." }, { status: 500 });
  }
}
export async function POST(request, { params }) {
  try {
  if (!validMutationOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 }); const { id } = await params; await dbConnect(); const body = await request.json(); const c = validId(id) ? await Contract.findById(id).select("+tokenHash +tokenValue") : null; if (!c) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (["copy-active","copy-original"].includes(body.action)) { if(!["ready","viewed"].includes(c.status))return NextResponse.json({error:"Only an active signing link can be copied."},{status:409});const stored=await Contract.collection.findOne({_id:c._id},{projection:{tokenHash:1,tokenValue:1}});if(!stored?.tokenValue||hashToken(stored.tokenValue)!==stored.tokenHash)return NextResponse.json({error:"This older active link was not stored in a retrievable form. Replace it once to make the new active link copyable.",code:"ACTIVE_LINK_UNAVAILABLE"},{status:409});return NextResponse.json({publicUrl:`${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/,"")||request.nextUrl.origin}/contract/${stored.tokenValue}`,active:true}) }
  if (body.action === "revoke" && ["ready","viewed"].includes(c.status)) { c.status = "revoked"; c.tokenValue=undefined;c.audit.push({ event: "revoked", actor: "admin" }); await c.save(); return NextResponse.json({ ok: true }); }
  if (body.action === "set-link-template" && ["site", "paper"].includes(body.template)) { c.linkTemplate = body.template; c.audit.push({ event: "link_template_changed", actor: "admin", detail: body.template }); await c.save(); return NextResponse.json({ ok: true, linkTemplate: c.linkTemplate }); }
  if (body.action === "generate") { if(c.status!=="draft")return NextResponse.json({error:"This contract already has or had a signing link. Use the explicit replacement action."},{status:409});const token=generatePublicToken();await persistSigningLink(c,token,"link_generated","");return NextResponse.json({publicUrl:`${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/,"")||request.nextUrl.origin}/contract/${token}`}) }
  if (body.action === "regenerate") { const active=["ready","viewed"].includes(c.status),allowed=active||["revoked","expired"].includes(c.status);if(!allowed)return NextResponse.json({error:"A new signing link cannot be created for this contract status."},{status:409});if(active&&body.confirmReplace!==true)return NextResponse.json({error:"Replacing an active client link requires explicit confirmation."},{status:422});const token=generatePublicToken(),detail=active?"Previous client link invalidated":"New link issued after revocation or expiry";await persistSigningLink(c,token,active?"link_replaced":"link_reissued",detail);return NextResponse.json({publicUrl:`${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/,"")||request.nextUrl.origin}/contract/${token}`,previousLinkInvalidated:active}) }
  if (body.action === "duplicate") { const obj = c.toObject(); for (const k of ["_id","createdAt","updatedAt","signedAt","viewedAt","signature","signerName","acceptedTerms","auditIp","auditUserAgent","integrityHash","tokenHash","tokenValue"]) delete obj[k]; obj.status = "draft"; obj.audit = [{ event: "created", actor: "admin", detail: "Duplicated contract" }]; const copy = await Contract.create(obj); return NextResponse.json({ id: copy._id }, { status: 201 }); }
  if (body.action === "retry-notification" && c.status === "signed") { try { await sendSignedNotification(c); c.notification.status = "sent"; c.notification.error = ""; } catch { c.notification.status = "failed"; c.notification.error = "Delivery failed; retry is available in admin."; } c.notification.attempts += 1; c.notification.lastAttemptAt = new Date(); c.audit.push({ event: "notification_retried", actor: "admin" }); await c.save(); return NextResponse.json({ ok: c.notification.status === "sent", status: c.notification.status }, { status: c.notification.status === "sent" ? 200 : 502 }); }
  return NextResponse.json({ error: "Action not allowed." }, { status: 409 });
  } catch (error) {
    console.error("Contract action failed:", error);
    return NextResponse.json({ error: process.env.NODE_ENV === "development" ? error.message : "The contract action could not be completed." }, { status: 500 });
  }
}
