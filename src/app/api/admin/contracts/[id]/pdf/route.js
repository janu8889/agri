import { NextResponse } from "next/server";
import mongoose from "mongoose";
import sharp from "sharp";
import dbConnect from "@/lib/dbConnect";
import Contract from "@/models/contract";
import ContractAsset from "@/models/contractAsset";
import { generateContractPdf } from "@/lib/contracts/pdf";
import { sellerSignaturePublicId } from "@/lib/contracts/sellerSignatures";

export const runtime = "nodejs";
export async function GET(request,{params}){const {id}=await params;if(!mongoose.isValidObjectId(id))return NextResponse.json({error:"Not found."},{status:404});await dbConnect();const version=request.nextUrl.searchParams.get("version")==="signed"?"signed":"unsigned";const c=await Contract.findById(id).select("+signature -audit");if(!c)return NextResponse.json({error:"Not found."},{status:404});if(version==="signed"&&c.status!=="signed")return NextResponse.json({error:"The contract is not signed."},{status:409});const includeSeller=request.nextUrl.searchParams.get("seller")!=="false",[sellerSignature,logo]=await Promise.all([includeSeller?loadContractImage(c.templateSnapshot?.sellerRepresentative?.signatureUrl,"signature"):null,loadContractImage(c.templateSnapshot?.logoUrl,"logo")]),pdf=generateContractPdf(c.toObject(),{signed:version==="signed",includeSeller,sellerSignature,logo});const safe=String(c.orderNumber||"contract").replace(/[^A-Za-z0-9_-]/g,"-");return new NextResponse(new Uint8Array(pdf),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="contract-${safe}-${version}.pdf"`,"Cache-Control":"no-store, private","Pragma":"no-cache","X-Content-Type-Options":"nosniff"}})}

async function loadContractImage(url,kind){const publicId=sellerSignaturePublicId(url);if(!publicId)return null;const asset=await ContractAsset.findOne({publicId,kind}).select("+data").lean();if(!asset?.data)return null;try{const {data,info}=await sharp(Buffer.from(asset.data)).flatten({background:"#fff"}).toColourspace("srgb").jpeg({quality:94,chromaSubsampling:"4:4:4"}).toBuffer({resolveWithObject:true});return{data,width:info.width,height:info.height}}catch{return null}}
