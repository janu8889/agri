import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Contract from "@/models/contract";
import { hashToken } from "@/lib/contracts/security";
import { clientIp, publicHeaders, rateLimited } from "@/lib/contracts/http";
import { contractSellerDisplayName } from "@/lib/contracts/company";

export async function GET(request, { params }) {
  const { token } = await params; const ip = clientIp(request); if (rateLimited(`view:${ip}`, 60)) return publicHeaders(NextResponse.json({ error: "Too many requests." }, { status: 429 }));
  await dbConnect(); const contract = await Contract.findOne({ tokenHash: hashToken(token) }).select("-tokenHash -signature -auditIp -auditUserAgent -notification -integrityHash");
  if (!contract) return publicHeaders(NextResponse.json({ error: "This link is unavailable." }, { status: 404 }));
  if (contract.status === "signed") return stateReply(contract, "signed");
  if (contract.status === "revoked") return stateReply(contract, "revoked");
  if (contract.linkExpiresAt && contract.linkExpiresAt <= new Date()) { if (contract.status !== "expired") await Contract.updateOne({ _id: contract._id, status: { $in: ["ready","viewed"] } }, { $set: { status: "expired" }, $push: { audit: { event: "expired", actor: "system" } } }); return stateReply(contract, "expired"); }
  if (contract.status === "ready") await Contract.updateOne({ _id: contract._id, status: "ready" }, { $set: { status: "viewed", viewedAt: new Date() }, $push: { audit: { event: "viewed", actor: "client" } } });
  const obj = contract.toObject(); obj.hasAuthorizedSavedSignature = Boolean(obj.reusedSignatureId); obj.id = undefined; obj._id = undefined; obj.__v = undefined; obj.audit = undefined; obj.reusedSignatureId = undefined; obj.savedSignatureId = undefined; return publicHeaders(NextResponse.json({ contract: obj }));
}

function stateReply(contract, state) {
  return publicHeaders(NextResponse.json({ state, sellerDisplayName: contractSellerDisplayName(contract) }, { status: 410 }));
}
