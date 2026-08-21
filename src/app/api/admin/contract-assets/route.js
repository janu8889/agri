import { NextResponse } from "next/server";
import crypto from "node:crypto";
import mongoose from "mongoose";
import { validMutationOrigin } from "@/lib/contracts/http";
import dbConnect from "@/lib/dbConnect";
import ContractAsset from "@/models/contractAsset";
import ContractTemplate from "@/models/contractTemplate";
import { DEFAULT_TEMPLATE } from "@/lib/contracts/defaultTemplate";
import { BUILTIN_SELLER_SIGNATURE_URL, rememberSellerSignature } from "@/lib/contracts/sellerSignatures";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_BYTES = 3 * 1024 * 1024;

export async function GET() {
  await dbConnect();
  const [assets,template]=await Promise.all([ContractAsset.find({kind:"signature",archivedAt:null}).select("publicId representativeName label size usageCount lastUsedAt createdAt").sort({lastUsedAt:-1,createdAt:-1}).lean(),ContractTemplate.findOne({active:true}).sort({version:-1}).select("sellerRepresentative").lean()]);
  const current=template?.sellerRepresentative||DEFAULT_TEMPLATE.sellerRepresentative;
  const uploaded=assets.map(x=>({...x,url:`/api/contract-assets/${x.publicId}`,name:x.representativeName||x.label||"Seller Representative",isDefault:`/api/contract-assets/${x.publicId}`===current.signatureUrl,builtin:false}));
  return NextResponse.json({items:[{_id:"builtin-seller-signature",url:BUILTIN_SELLER_SIGNATURE_URL,name:"Daniel R. Petrov",label:"Built-in signature",usageCount:0,lastUsedAt:null,createdAt:null,isDefault:current.signatureUrl===BUILTIN_SELLER_SIGNATURE_URL,builtin:true},...uploaded]},{headers:{"Cache-Control":"no-store, private"}});
}

export async function POST(request) {
  if (!validMutationOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = await request.json();
      if (body.action === "set-default") return setDefaultSellerSignature(body);
      if (body.action === "delete") return archiveSellerSignature(body);
      return NextResponse.json({ error: "Action not allowed." }, { status: 409 });
    }
    const form = await request.formData();
    const file = form.get("file");
    const kind = form.get("kind") === "signature" ? "signature" : "logo";
    const representativeName=String(form.get("representativeName")||"").trim().slice(0,200);
    if (!file || typeof file.arrayBuffer !== "function") return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    if (!ALLOWED.has(file.type) || file.size > MAX_BYTES) return NextResponse.json({ error: "Use a PNG, JPG, or WEBP image up to 3 MB." }, { status: 422 });
    const data = Buffer.from(await file.arrayBuffer());
    if (!matchesImageSignature(data, file.type)) return NextResponse.json({ error: "The selected file is not a valid image." }, { status: 422 });
    await dbConnect();
    const publicId = crypto.randomBytes(24).toString("base64url");
    await ContractAsset.create({ publicId, kind, contentType: file.type, data, size: data.length, representativeName:kind==="signature"?representativeName:"" });
    return NextResponse.json({ url: `/api/contract-assets/${publicId}`, publicId });
  } catch (error) {
    console.error("Contract asset upload failed:", error);
    return NextResponse.json({ error: "The image could not be uploaded." }, { status: 500 });
  }
}

export async function PATCH(request){
  if (!validMutationOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  try{return await setDefaultSellerSignature(await request.json())}catch(error){console.error("Default seller signature update failed:",error);return NextResponse.json({error:"The default signature could not be changed."},{status:500})}
}

async function setDefaultSellerSignature(body){
  const url=String(body.url||"");
  await dbConnect();
  if(url!==BUILTIN_SELLER_SIGNATURE_URL){const publicId=url.match(/^\/api\/contract-assets\/([A-Za-z0-9_-]{32})$/)?.[1],asset=publicId?await ContractAsset.findOne({publicId,kind:"signature",archivedAt:null}):null;if(!asset)return NextResponse.json({error:"Signature not found."},{status:404})}
  await rememberSellerSignature({name:String(body.name||"Seller Representative"),signatureUrl:url},false);
  return NextResponse.json({ok:true,defaultUrl:url});
}

async function archiveSellerSignature(body){
  if(body.id==="builtin-seller-signature")return NextResponse.json({error:"The built-in fallback signature cannot be deleted."},{status:409});
  const id=String(body.id||"");
  if(!mongoose.isValidObjectId(id))return NextResponse.json({error:"Signature not found."},{status:404});
  await dbConnect();
  const asset=await ContractAsset.findOneAndUpdate({_id:id,kind:"signature",archivedAt:null},{$set:{archivedAt:new Date()}},{new:false}).lean();
  if(!asset)return NextResponse.json({error:"Signature not found."},{status:404});
  const url=`/api/contract-assets/${asset.publicId}`,template=await ContractTemplate.findOne({active:true}).sort({version:-1}).select("sellerRepresentative");
  const defaultReset=template?.sellerRepresentative?.signatureUrl===url;
  if(defaultReset)await rememberSellerSignature({name:"Daniel R. Petrov",signatureUrl:BUILTIN_SELLER_SIGNATURE_URL},false);
  return NextResponse.json({ok:true,deletedId:id,defaultReset});
}

function matchesImageSignature(buffer, contentType) {
  if (contentType === "image/png") return buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (contentType === "image/jpeg") return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (contentType === "image/webp") return buffer.length > 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  return false;
}
