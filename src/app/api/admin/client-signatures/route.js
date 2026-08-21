import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ClientSignature from "@/models/clientSignature";
import { normalizeEmail } from "@/lib/contracts/security";

export async function GET(request){const raw=request.nextUrl.searchParams.get("email"),email=normalizeEmail(raw);await dbConnect();const filter=raw?{normalizedEmail:email}:{};const items=await ClientSignature.find(filter).select("+strokeData clientName clientEmail signatureType typedName sourceContractId consentAcceptedAt lastUsedAt usageCount revokedAt createdAt").sort({lastUsedAt:-1,createdAt:-1}).limit(250).lean();return NextResponse.json({items},{headers:{"Cache-Control":"no-store, private"}})}
