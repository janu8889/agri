import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Contract from "@/models/contract";
import ClientSignature from "@/models/clientSignature";
import { hashToken, normalizeEmail, sanitizeText, signingIntegrityPayload, stableHash, validateSignature, validateSigningRequest } from "@/lib/contracts/security";
import { TYPED_CONSENT_TEXT } from "@/lib/contracts/signature";
import { clientIp, publicHeaders, rateLimited, validMutationOrigin } from "@/lib/contracts/http";
import { sendSignedNotification } from "@/lib/contracts/notify";

export async function POST(request, { params }) {
  const ip = clientIp(request);
  if (rateLimited(`sign:${ip}`, 8, 10 * 60_000)) return reply({ error: "Too many signing attempts." }, 429);
  if (!validMutationOrigin(request)) return reply({ error: "Request could not be verified." }, 403);
  const { token } = await params;
  let body; try { body = await request.json(); } catch { return reply({ error: "Invalid request." }, 400); }
  const validation=validateSigningRequest(body),signerName=sanitizeText(body.signerName,200),method=validation.method;if(!validation.ok)return reply({error:validation.error},422);
  await dbConnect(); const now = new Date(), tokenHash = hashToken(token);
  const candidate = await Contract.findOne({ $or: [{ tokenHash }, { signedLinkTokenHash: tokenHash }] }).select("+tokenHash +signedLinkTokenHash +signature");
  if (!candidate) return reply({ error: "This link is unavailable." }, 404);
  if (candidate.linkExpiresAt && candidate.linkExpiresAt <= now) { await Contract.updateOne({_id:candidate._id,status:{$in:["ready","viewed"]}},{$set:{status:"expired"},$push:{audit:{event:"expired",actor:"system",detail:"Expiration synchronized during signing attempt",at:now}}}); return reply({ error: "This agreement has expired." }, 410); }
  let reusedAsset=null,signature=method === "drawn" ? body.signature : undefined;
  if(method==="drawn"&&body.reuseSavedSignature===true&&candidate.reusedSignatureId){reusedAsset=await ClientSignature.findOne({_id:candidate.reusedSignatureId,normalizedEmail:normalizeEmail(candidate.buyer.email),revokedAt:null}).select("+strokeData");if(!reusedAsset||!validateSignature(reusedAsset.strokeData))return reply({error:"The authorized saved signature is unavailable."},409);signature=reusedAsset.strokeData}
  const consentText = method === "typed_consent" ? TYPED_CONSENT_TEXT : sanitizeText(body.signatureConsentText || TYPED_CONSENT_TEXT, 500);
  const signingData = { ...candidate.toObject(), signerName, signedAt: now, signatureMethod: method, signature, typedSignatureConsent: true, signatureConsentText: consentText, signatureConsentVersion: 1 };
  const integrityHash = stableHash(signingIntegrityPayload(signingData));
  const matchedTokenField=candidate.tokenHash===tokenHash?"tokenHash":"signedLinkTokenHash";
  const signed = await Contract.findOneAndUpdate({ _id: candidate._id, [matchedTokenField]:tokenHash, status: { $in: ["ready", "viewed"] }, signedAt: null, $or: [{ linkExpiresAt: null }, { linkExpiresAt: { $gt: now } }] }, { $set: { status: "signed", signedAt: now, signerName, signature, signatureMethod: method, typedSignatureConsent: true, signatureConsentText: consentText, signatureConsentVersion: 1, acceptedTerms: true, auditIp: ip, auditUserAgent: sanitizeText(request.headers.get("user-agent"), 500), integrityHash, "notification.status": "pending" }, $push: { audit: { event: "signed", at: now, actor: "client", detail: `${method}; template version ${candidate.templateVersion}` } } }, { new: true }).select("+signature +auditIp +auditUserAgent");
  if (!signed) return reply({ error: "This agreement is no longer eligible for signing." }, 409);
  try { if(reusedAsset){reusedAsset.lastUsedAt=now;reusedAsset.usageCount+=1;reusedAsset.audit.push({event:"reused",actor:"client",contractId:signed._id});await reusedAsset.save()}else{const saved = await ClientSignature.create({ clientName: signed.buyer.name, clientEmail: signed.buyer.email, normalizedEmail: normalizeEmail(signed.buyer.email), signatureType: method, strokeData: signature, typedName: signerName, sourceContractId: signed._id, consentText, consentAcceptedAt: now, lastUsedAt: now, usageCount: 1, auditIp: ip, auditUserAgent: sanitizeText(request.headers.get("user-agent"), 500), audit: [{ event: "created", actor: "client", contractId: signed._id }] }); await Contract.updateOne({ _id: signed._id, savedSignatureId: null }, { $set: { savedSignatureId: saved._id } })} } catch { /* signed contract remains authoritative */ }
  try { await sendSignedNotification(signed); await Contract.updateOne({ _id: signed._id }, { $set: { "notification.status": "sent", "notification.lastAttemptAt": new Date(), "notification.error": "" }, $inc: { "notification.attempts": 1 } }); } catch { await Contract.updateOne({ _id: signed._id }, { $set: { "notification.status": "failed", "notification.lastAttemptAt": new Date(), "notification.error": "Delivery failed; retry is available in admin." }, $inc: { "notification.attempts": 1 } }); }
  return reply({ ok: true });
}
function reply(body, status = 200) { return publicHeaders(NextResponse.json(body, { status })); }
