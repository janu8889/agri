import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ContractTemplate from "@/models/contractTemplate";
import { DEFAULT_TEMPLATE } from "@/lib/contracts/defaultTemplate";
import { cleanTemplate } from "@/lib/contracts/template";
import { validMutationOrigin } from "@/lib/contracts/http";

export async function GET() { try { await dbConnect(); return NextResponse.json(await ContractTemplate.findOne({ active: true }).sort({ version: -1 }).lean() || DEFAULT_TEMPLATE,{headers:{"Cache-Control":"no-store, private"}}); } catch (error) { console.error("Contract template load failed:", error); return NextResponse.json({ error: "Database connection failed. Check MongoDB Atlas network access and try again." }, { status: 503 }); } }
export async function PUT(request) {
  if (!validMutationOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  await dbConnect(); const cleaned = cleanTemplate(await request.json()); const latest = await ContractTemplate.findOne().sort({ version: -1 }).lean();
  const created = await ContractTemplate.create({ ...cleaned, version: (latest?.version || 0) + 1 });
  if (created.active) await ContractTemplate.updateMany({ _id: { $ne: created._id } }, { $set: { active: false } });
  return NextResponse.json({ template: created }, { status: 201 });
}
export async function PATCH(request) {
  if (!validMutationOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    await dbConnect();
    const body=await request.json(),active=await ContractTemplate.findOne({active:true}).sort({version:-1}).lean(),base=active||DEFAULT_TEMPLATE;
    const cleaned=cleanTemplate({...base,company:{...(base.company||{}),...(body.company||{})},sellerRepresentative:{...(base.sellerRepresentative||{}),...(body.sellerRepresentative||{})}});
    const latest=await ContractTemplate.findOne().sort({version:-1}).select("version").lean(),created=await ContractTemplate.create({...cleaned,version:(latest?.version||0)+1,active:true});
    await ContractTemplate.updateMany({_id:{$ne:created._id}},{$set:{active:false}});
    return NextResponse.json({template:created},{status:201,headers:{"Cache-Control":"no-store, private"}});
  } catch (error) {
    console.error("Seller defaults update failed:",error);
    return NextResponse.json({error:"Seller defaults could not be saved."},{status:500});
  }
}
