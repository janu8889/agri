import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Contract from "@/models/contract";
import ClientSignature from "@/models/clientSignature";
import { cleanContractInput, validateContractInput, validMutationOrigin } from "@/lib/contracts/http";
import { cleanTemplate } from "@/lib/contracts/template";
import { generatePublicToken, hashToken, stableHash } from "@/lib/contracts/security";
import { sendSignedNotification } from "@/lib/contracts/notify";
import { rememberSellerSignature } from "@/lib/contracts/sellerSignatures";

const validId = (id) => mongoose.isValidObjectId(id);
async function persistSigningLink(contract,token,event,detail){const tokenHash=hashToken(token),set={tokenHash,tokenValue:token,status:"ready",snapshotHash:stableHash(contract.templateSnapshot),viewedAt:null};if(contract.linkExpiresAt&&contract.linkExpiresAt<=new Date())set.linkExpiresAt=null;const result=await Contract.collection.updateOne({_id:contract._id},{$set:set,$unset:{signedLinkTokenHash:"",signedLinkTokenValue:""},$push:{audit:{event,actor:"admin",detail,at:new Date()}}});if(result.matchedCount!==1)throw new Error("The contract disappeared while its signing link was being saved.");const stored=await Contract.collection.findOne({_id:contract._id},{projection:{tokenHash:1,tokenValue:1}});if(!stored?.tokenValue||stored.tokenHash!==tokenHash||stored.tokenValue!==token)throw new Error("The active signing link could not be verified after saving.");}
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
  if (["copy-active","copy-original"].includes(body.action)) {
    if(!["ready","viewed"].includes(c.status))return NextResponse.json({error:"Only an active signing link can be copied."},{status:409});
    const origin=process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/,"")||request.nextUrl.origin,stored=await Contract.collection.findOne({_id:c._id},{projection:{tokenHash:1,tokenValue:1,signedLinkTokenHash:1,signedLinkTokenValue:1}});
    if(stored?.tokenValue&&hashToken(stored.tokenValue)===stored.tokenHash)return NextResponse.json({publicUrl:`${origin}/contract/${stored.tokenValue}`,active:true,original:true});
    if(stored?.signedLinkTokenValue&&hashToken(stored.signedLinkTokenValue)===stored.signedLinkTokenHash)return NextResponse.json({publicUrl:`${origin}/contract/${stored.signedLinkTokenValue}`,active:true,alias:true});
    const aliasToken=generatePublicToken(),aliasHash=hashToken(aliasToken),created=await Contract.collection.updateOne({_id:c._id,status:{$in:["ready","viewed"]},signedLinkTokenValue:{$exists:false}},{$set:{signedLinkTokenHash:aliasHash,signedLinkTokenValue:aliasToken},$push:{audit:{event:"active_link_copy_alias_created",actor:"admin",detail:"Original URL remains valid but was not retrievable",at:new Date()}}});
    if(created.modifiedCount===1)return NextResponse.json({publicUrl:`${origin}/contract/${aliasToken}`,active:true,alias:true,created:true});
    const current=await Contract.collection.findOne({_id:c._id},{projection:{signedLinkTokenHash:1,signedLinkTokenValue:1}});if(!current?.signedLinkTokenValue||hashToken(current.signedLinkTokenValue)!==current.signedLinkTokenHash)return NextResponse.json({error:"A copyable access link could not be saved. The client's original link was not changed."},{status:409});return NextResponse.json({publicUrl:`${origin}/contract/${current.signedLinkTokenValue}`,active:true,alias:true});
  }
  if (body.action === "copy-signed") { if(c.status!=="signed")return NextResponse.json({error:"Only a signed contract link can be copied with this action."},{status:409});const origin=process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/,"")||request.nextUrl.origin,stored=await Contract.collection.findOne({_id:c._id},{projection:{tokenHash:1,tokenValue:1,signedLinkTokenHash:1,signedLinkTokenValue:1}});if(stored?.tokenValue&&hashToken(stored.tokenValue)===stored.tokenHash)return NextResponse.json({publicUrl:`${origin}/contract/${stored.tokenValue}`,signed:true,original:true});if(stored?.signedLinkTokenValue&&hashToken(stored.signedLinkTokenValue)===stored.signedLinkTokenHash)return NextResponse.json({publicUrl:`${origin}/contract/${stored.signedLinkTokenValue}`,signed:true,archived:true});const archiveToken=generatePublicToken(),archiveHash=hashToken(archiveToken),updated=await Contract.collection.updateOne({_id:c._id,status:"signed",signedLinkTokenValue:{$exists:false}},{$set:{signedLinkTokenHash:archiveHash,signedLinkTokenValue:archiveToken},$push:{audit:{event:"signed_status_link_created",actor:"admin",detail:"Original URL was not retrievable",at:new Date()}}});if(updated.modifiedCount!==1){const current=await Contract.collection.findOne({_id:c._id},{projection:{signedLinkTokenHash:1,signedLinkTokenValue:1}});if(!current?.signedLinkTokenValue||hashToken(current.signedLinkTokenValue)!==current.signedLinkTokenHash)return NextResponse.json({error:"The signed status link could not be saved. Please try again."},{status:409});return NextResponse.json({publicUrl:`${origin}/contract/${current.signedLinkTokenValue}`,signed:true,archived:true})}return NextResponse.json({publicUrl:`${origin}/contract/${archiveToken}`,signed:true,archived:true,created:true}) }
  if (body.action === "unsign") {
    if(c.status!=="signed")return NextResponse.json({error:"Only a signed contract can be unsigned."},{status:409});
    if(!c.tokenHash)return NextResponse.json({error:"This contract has no original signing link to reactivate, so its signature was not changed."},{status:409});
    const nextStatus=c.viewedAt?"viewed":"ready",savedSignatureId=c.savedSignatureId,reusedSignatureId=c.reusedSignatureId,previousSigner=c.signerName||"Unknown signer",notificationWasSent=c.notification?.status==="sent";
    const unsigned=await Contract.findOneAndUpdate({_id:c._id,status:"signed"},{$set:{status:nextStatus,"notification.status":"pending","notification.error":""},$unset:{signedAt:"",signature:"",signerName:"",acceptedTerms:"",signatureMethod:"",typedSignatureConsent:"",signatureConsentText:"",savedSignatureId:"",auditIp:"",auditUserAgent:"",integrityHash:"",linkExpiresAt:"","notification.lastAttemptAt":""},$push:{audit:{event:"signature_invalidated",actor:"admin",detail:`Signer: ${previousSigner}; original signing link reactivated${notificationWasSent?"; notification email had already been sent":""}`,at:new Date()}}},{new:true});
    if(!unsigned)return NextResponse.json({error:"The contract changed before the signature could be removed. Refresh and try again."},{status:409});
    await reverseSavedSignatureUse(savedSignatureId,reusedSignatureId,c._id);
    return NextResponse.json({ok:true,status:nextStatus,linkReactivated:true,notificationWasSent});
  }
  if (body.action === "revoke" && ["ready","viewed"].includes(c.status)) { c.status = "revoked"; c.tokenValue=undefined;c.audit.push({ event: "revoked", actor: "admin" }); await c.save(); return NextResponse.json({ ok: true }); }
  if (body.action === "set-link-template" && ["site", "paper"].includes(body.template)) { c.linkTemplate = body.template; c.audit.push({ event: "link_template_changed", actor: "admin", detail: body.template }); await c.save(); return NextResponse.json({ ok: true, linkTemplate: c.linkTemplate }); }
  if (body.action === "generate") { if(c.status!=="draft")return NextResponse.json({error:"This contract already has or had a signing link. Use the explicit replacement action."},{status:409});const token=generatePublicToken();await persistSigningLink(c,token,"link_generated","");return NextResponse.json({publicUrl:`${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/,"")||request.nextUrl.origin}/contract/${token}`}) }
  if (body.action === "regenerate") { const active=["ready","viewed"].includes(c.status),allowed=active||["revoked","expired"].includes(c.status);if(!allowed)return NextResponse.json({error:"A new signing link cannot be created for this contract status."},{status:409});if(active&&body.confirmReplace!==true)return NextResponse.json({error:"Replacing an active client link requires explicit confirmation."},{status:422});const token=generatePublicToken(),detail=active?"Previous client link invalidated":"New link issued after revocation or expiry";await persistSigningLink(c,token,active?"link_replaced":"link_reissued",detail);return NextResponse.json({publicUrl:`${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/,"")||request.nextUrl.origin}/contract/${token}`,previousLinkInvalidated:active}) }
  if (body.action === "duplicate") { const obj = c.toObject(); for (const k of ["_id","createdAt","updatedAt","signedAt","viewedAt","signature","signerName","acceptedTerms","auditIp","auditUserAgent","integrityHash","tokenHash","tokenValue","signedLinkTokenHash","signedLinkTokenValue"]) delete obj[k]; obj.status = "draft"; obj.audit = [{ event: "created", actor: "admin", detail: "Duplicated contract" }]; const copy = await Contract.create(obj); return NextResponse.json({ id: copy._id }, { status: 201 }); }
  if (body.action === "retry-notification" && c.status === "signed") { const claimed=await Contract.findOneAndUpdate({_id:c._id,status:"signed","notification.status":"failed"},{$set:{"notification.status":"pending","notification.lastAttemptAt":new Date(),"notification.error":""},$push:{audit:{event:"notification_retry_started",actor:"admin",at:new Date()}}},{new:true}).select("+auditIp +auditUserAgent");if(!claimed)return NextResponse.json({error:"This notification was already sent or another delivery attempt is in progress."},{status:409});try{await sendSignedNotification(claimed);await Contract.updateOne({_id:claimed._id,"notification.status":"pending"},{$set:{"notification.status":"sent","notification.lastAttemptAt":new Date(),"notification.error":""},$inc:{"notification.attempts":1},$push:{audit:{event:"notification_retried",actor:"admin",detail:"Delivery succeeded",at:new Date()}}});return NextResponse.json({ok:true,status:"sent"})}catch{await Contract.updateOne({_id:claimed._id,"notification.status":"pending"},{$set:{"notification.status":"failed","notification.lastAttemptAt":new Date(),"notification.error":"Delivery failed; retry is available in admin."},$inc:{"notification.attempts":1},$push:{audit:{event:"notification_retried",actor:"admin",detail:"Delivery failed",at:new Date()}}});return NextResponse.json({ok:false,status:"failed",error:"Email delivery failed. Check the SMTP settings and try again."},{status:502})} }
  return NextResponse.json({ error: "Action not allowed." }, { status: 409 });
  } catch (error) {
    console.error("Contract action failed:", error);
    return NextResponse.json({ error: process.env.NODE_ENV === "development" ? error.message : "The contract action could not be completed." }, { status: 500 });
  }
}

async function reverseSavedSignatureUse(savedSignatureId,reusedSignatureId,contractId){
  try{
    if(savedSignatureId){const saved=await ClientSignature.findOne({_id:savedSignatureId,sourceContractId:contractId}).select("usageCount");if(saved){if((saved.usageCount||0)<=1){await Contract.updateMany({$or:[{reusedSignatureId:saved._id},{savedSignatureId:saved._id}]},{$unset:{reusedSignatureId:"",savedSignatureId:""}});await ClientSignature.deleteOne({_id:saved._id})}else await ClientSignature.updateOne({_id:saved._id,usageCount:{$gt:0}},{$inc:{usageCount:-1},$push:{audit:{event:"contract_unsigned",actor:"admin",contractId}}})}}
    if(reusedSignatureId&&String(reusedSignatureId)!==String(savedSignatureId))await ClientSignature.updateOne({_id:reusedSignatureId,usageCount:{$gt:0}},{$inc:{usageCount:-1},$push:{audit:{event:"contract_unsigned",actor:"admin",contractId}}});
  }catch(error){console.error("Saved signature cleanup after unsign failed:",error)}
}
