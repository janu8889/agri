import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ContractTemplate from "@/models/contractTemplate";
import { DEFAULT_TEMPLATE } from "@/lib/contracts/defaultTemplate";
import { cleanTemplate } from "@/lib/contracts/template";
import { validMutationOrigin } from "@/lib/contracts/http";

export async function GET() { try { await dbConnect(); return NextResponse.json(await ContractTemplate.findOne({ active: true }).sort({ version: -1 }).lean() || DEFAULT_TEMPLATE); } catch (error) { console.error("Contract template load failed:", error); return NextResponse.json({ error: "Database connection failed. Check MongoDB Atlas network access and try again." }, { status: 503 }); } }
export async function PUT(request) {
  if (!validMutationOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  await dbConnect(); const cleaned = cleanTemplate(await request.json()); const latest = await ContractTemplate.findOne().sort({ version: -1 }).lean();
  const created = await ContractTemplate.create({ ...cleaned, version: (latest?.version || 0) + 1 });
  if (created.active) await ContractTemplate.updateMany({ _id: { $ne: created._id } }, { $set: { active: false } });
  return NextResponse.json({ template: created }, { status: 201 });
}
