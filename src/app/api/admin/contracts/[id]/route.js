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
import { contractDuplicateData } from "@/lib/contracts/duplicate";

const validId = (id) => mongoose.isValidObjectId(id);
async function persistSigningLink(contract,token,event,detail){const tokenHash=hashToken(token),set={tokenHash,tokenValue:token,status:"ready",snapshotHash:stableHash(contract.templateSnapshot),viewedAt:null};if(contract.linkExpiresAt&&contract.linkExpiresAt<=new Date())set.linkExpiresAt=null;const result=await Contract.collection.updateOne({_id:contract._id},{$set:set,$unset:{signedLinkTokenHash:"",signedLinkTokenValue:""},$push:{audit:{event,actor:"admin",detail,at:new Date()}}});if(result.matchedCount!==1)throw new Error("The contract disappeared while its signing link was being saved.");const stored=await Contract.collection.findOne({_id:contract._id},{projection:{tokenHash:1,tokenValue:1}});if(!stored?.tokenValue||stored.tokenHash!==tokenHash||stored.tokenValue!==token)throw new Error("The active signing link could not be verified after saving.");}
export async function GET(_request, { params }) { const { id } = await params; if (!validId(id)) return NextResponse.json({ error: "Not found." }, { status: 404 }); await dbConnect(); const c = await Contract.findById(id).select("-tokenHash -signature -auditIp -auditUserAgent -audit").lean(); return c ? NextResponse.json(c) : NextResponse.json({ error: "Not found." }, { status: 404 }); }
export async function PUT(request, { params }) {
  try {
    if (!validMutationOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 }); const { id } = await params; if (!validId(id)) return NextResponse.json({ error: "Not found." }, { status: 404 }); await dbConnect();
    const existing = await Contract.findById(id); if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 }); if (existing.status === "signed") return NextResponse.json({ error: "Signed contracts are read-only." }, { status: 409 });
    const raw = await request.json(); const clean = cleanContractInput(raw); const errors = validateContractInput(clean); if (errors.length) return NextResponse.json({ error: "Validation failed.", errors }, { status: 422 });
    const previousSignatureUrl=existing.templateSnapshot?.sellerRepresentative?.signatureUrl||"";existing.set(clean);existing.set("equipmentItems",clean.equipmentItems); if (raw.templateSnapshot && ["draft","expired"].includes(existing.status)) { existing.templateSnapshot = cleanTemplate(raw.templateSnapshot); existing.snapshotHash = stableHash(existing.templateSnapshot); existing.markModified("templateSnapshot"); } existing.audit.push({ event: "edited", actor: "admin" }); await existing.save();const rep=existing.templateSnapshot?.sellerRepresentative;if(rep?.signatureUrl&&rep.signatureUrl!==previousSignatureUrl)await rememberSellerSignature(rep);return NextResponse.json({ ok: true });
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
    return NextResponse.json({error:"This older active URL is still valid for the client, but its exact value is no longer retrievable. Copy active link never creates or replaces links; only Replace signing link can do that.",code:"ACTIVE_LINK_UNAVAILABLE"},{status:409});
  }
  if (body.action === "copy-signed") { if(c.status!=="signed")return NextResponse.json({error:"Only a signed contract link can be copied with this action."},{status:409});const origin=process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/,"")||request.nextUrl.origin,stored=await Contract.collection.findOne({_id:c._id},{projection:{tokenHash:1,tokenValue:1,signedLinkTokenHash:1,signedLinkTokenValue:1}});if(stored?.tokenValue&&hashToken(stored.tokenValue)===stored.tokenHash)return NextResponse.json({publicUrl:`${origin}/contract/${stored.tokenValue}`,signed:true,original:true});if(stored?.signedLinkTokenValue&&hashToken(stored.signedLinkTokenValue)===stored.signedLinkTokenHash)return NextResponse.json({publicUrl:`${origin}/contract/${stored.signedLinkTokenValue}`,signed:true,archived:true});return NextResponse.json({error:"This older signed URL is no longer retrievable. Copy signed link never creates or replaces links."},{status:409}) }
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
  if (body.action === "reactivate-expired") {
    if(c.status!=="expired")return NextResponse.json({error:"Only an expired contract can be reactivated with this action."},{status:409});
    const origin=process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/,"")||request.nextUrl.origin;
    if(body.mode==="new"){
      const token=generatePublicToken();
      await persistSigningLink(c,token,"expired_contract_reactivated","New signing link generated; previous link invalidated");
      return NextResponse.json({publicUrl:`${origin}/contract/${token}`,status:"ready",newLink:true,previousLinkInvalidated:true});
    }
    if(body.mode==="same"){
      const stored=await Contract.collection.findOne({_id:c._id},{projection:{tokenHash:1,tokenValue:1}});
      if(!stored?.tokenValue||hashToken(stored.tokenValue)!==stored.tokenHash)return NextResponse.json({error:"The original link cannot be recovered for this older contract. Choose Generate New Link instead."},{status:409});
      const reactivated=await Contract.collection.updateOne({_id:c._id,status:"expired",tokenHash:stored.tokenHash},{$set:{status:"ready",viewedAt:null,linkExpiresAt:null},$push:{audit:{event:"expired_contract_reactivated",actor:"admin",detail:"Existing signing link retained; expired deadline cleared",at:new Date()}}});
      if(reactivated.modifiedCount!==1)return NextResponse.json({error:"The contract changed before it could be reactivated. Refresh and try again."},{status:409});
      return NextResponse.json({publicUrl:`${origin}/contract/${stored.tokenValue}`,status:"ready",sameLink:true});
    }
    return NextResponse.json({error:"Choose whether to keep the same link or generate a new link."},{status:422});
  }
  if (body.action === "regenerate") { const active=["ready","viewed"].includes(c.status),allowed=active||["revoked","expired"].includes(c.status);if(!allowed)return NextResponse.json({error:"A new signing link cannot be created for this contract status."},{status:409});if(active&&body.confirmReplace!==true)return NextResponse.json({error:"Replacing an active client link requires explicit confirmation."},{status:422});const token=generatePublicToken(),detail=active?"Previous client link invalidated":"New link issued after revocation or expiry";await persistSigningLink(c,token,active?"link_replaced":"link_reissued",detail);return NextResponse.json({publicUrl:`${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/,"")||request.nextUrl.origin}/contract/${token}`,previousLinkInvalidated:active}) }
  if (body.action === "duplicate") { const obj=contractDuplicateData(c.toObject());obj.templateSnapshot=cleanTemplate(obj.templateSnapshot);obj.snapshotHash=stableHash(obj.templateSnapshot);obj.audit=[{event:"created",actor:"admin",detail:`Duplicated from contract ${c._id}`}];const items=obj.equipmentItems||[obj.equipment];delete obj.equipmentItems;if(obj.equipment){delete obj.equipment.descriptionHtml;delete obj.equipment.price}const copy=new Contract(obj);copy.set("equipmentItems",items);await copy.save();return NextResponse.json({id:copy._id},{status:201}); }
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
