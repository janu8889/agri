import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Contract from "@/models/contract";
import { cleanContractInput, validateContractInput, validMutationOrigin } from "@/lib/contracts/http";
import { getActiveTemplate, cleanTemplate } from "@/lib/contracts/template";
import { generatePublicToken, hashToken, stableHash } from "@/lib/contracts/security";
import { rememberSellerSignature } from "@/lib/contracts/sellerSignatures";

export async function GET(request) {
  try {
    await dbConnect();
    const now=new Date();
    await Contract.updateMany({status:{$in:["ready","viewed"]},linkExpiresAt:{$ne:null,$lte:now}},{$set:{status:"expired"},$push:{audit:{event:"expired",actor:"system",detail:"Expiration synchronized while loading Admin Contracts",at:now}}});
    const p = request.nextUrl.searchParams; const page = Math.max(1, Number(p.get("page")) || 1), limit = 10; const filter = {};
    if (["draft","ready","viewed","signed","revoked","expired"].includes(p.get("status"))) filter.status = p.get("status");
    const q = p.get("q")?.trim(); if (q) { const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); filter.$or = ["orderNumber","buyer.name","buyer.company","buyer.email","buyer.phonePrimary","equipment.make","equipment.model","equipment.serialNumber","equipmentItems.make","equipmentItems.model","equipmentItems.serialNumber"].map((key) => ({ [key]: { $regex: escaped, $options: "i" } })); }
    const sortKey = p.get("sort") === "signedAt" ? "signedAt" : "createdAt", direction = p.get("dir") === "asc" ? 1 : -1;
    const [items, total] = await Promise.all([Contract.find(filter).select("-templateSnapshot -signature -tokenHash -auditIp -auditUserAgent -audit").sort({ [sortKey]: direction }).skip((page - 1) * limit).limit(limit).lean(), Contract.countDocuments(filter)]);
    const response=NextResponse.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });response.headers.set("Cache-Control","no-store");return response;
  } catch (error) {
    console.error("Contract list failed:", error);
    return NextResponse.json({ error: "Database connection failed. Check MongoDB Atlas network access and try again." }, { status: 503 });
  }
}
async function createContract(request) {
  if (!validMutationOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  await dbConnect(); const body = await request.json(); const input = cleanContractInput(body); const errors = validateContractInput(input); if (errors.length) return NextResponse.json({ error: "Validation failed.", errors }, { status: 422 });
  const source = body.templateSnapshot ? cleanTemplate(body.templateSnapshot) : cleanTemplate(await getActiveTemplate()); if (source.terms.length !== 14) return NextResponse.json({ error: "The contract must contain all 14 terms sections." }, { status: 422 });
  const token = body.generateLink ? generatePublicToken() : null; const status = token ? "ready" : "draft"; const snapshot = structuredClone(source); delete snapshot._id; delete snapshot.createdAt; delete snapshot.updatedAt;
  const linkTemplate=["site","paper"].includes(body.linkTemplate)?body.linkTemplate:"paper";
  const contract = new Contract({ ...input, equipmentItems:undefined, linkTemplate, templateSnapshot: snapshot, templateVersion: source.version || 1, snapshotHash: stableHash(snapshot), status, tokenHash: token ? hashToken(token) : undefined, tokenValue:token||undefined, audit: [{ event: "created", actor: "admin", detail: `Template version ${source.version || 1}` }, ...(token ? [{ event: "link_generated", actor: "admin" }] : [])] });
  contract.set("equipmentItems",input.equipmentItems);
  await contract.save();
  await rememberSellerSignature(snapshot.sellerRepresentative);
  return NextResponse.json({ contract: { id: contract._id, status: contract.status }, publicUrl: token ? `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || request.nextUrl.origin}/contract/${token}` : null }, { status: 201 });
}

export async function POST(request) {
  try {
    return await createContract(request);
  } catch (error) {
    console.error("Contract creation failed:", error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? error.message : "The contract could not be saved." },
      { status: 500 },
    );
  }
}
