import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import ClientSignature from "@/models/clientSignature";
import Contract from "@/models/contract";
import { validMutationOrigin } from "@/lib/contracts/http";

export async function POST(request,{params}){
  try{
    if(!validMutationOrigin(request))return NextResponse.json({error:"Invalid request origin."},{status:403});
    const{id}=await params;
    if(!mongoose.isValidObjectId(id))return NextResponse.json({error:"Not found."},{status:404});
    const body=await request.json();
    await dbConnect();
    const sig=await ClientSignature.findById(id);
    if(!sig)return NextResponse.json({error:"Not found."},{status:404});
    if(body.action==="delete"){
      await Contract.updateMany({$or:[{reusedSignatureId:sig._id},{savedSignatureId:sig._id}]},{$unset:{reusedSignatureId:"",savedSignatureId:""}});
      const result=await ClientSignature.deleteOne({_id:sig._id});
      if(result.deletedCount!==1)return NextResponse.json({error:"The signature was not deleted."},{status:409});
      return NextResponse.json({ok:true,deletedId:id});
    }
    if(body.action==="revoke"){
      if(!sig.revokedAt){sig.revokedAt=new Date();sig.audit.push({event:"revoked",actor:"admin"});await sig.save()}
      return NextResponse.json({ok:true});
    }
    if(body.action==="attach"&&mongoose.isValidObjectId(body.contractId)){
      if(sig.revokedAt)return NextResponse.json({error:"This saved signature is revoked."},{status:409});
      const contract=await Contract.findOne({_id:body.contractId,status:"draft","buyer.email":sig.normalizedEmail});
      if(!contract)return NextResponse.json({error:"The draft email must exactly match the saved signature email."},{status:409});
      contract.reusedSignatureId=sig._id;
      contract.audit.push({event:"signature_reuse_authorized",actor:"admin",detail:`Source contract ${sig.sourceContractId}`});
      await contract.save();
      sig.audit.push({event:"reuse_authorized",actor:"admin",contractId:contract._id});
      await sig.save();
      return NextResponse.json({ok:true,sourceContractId:sig.sourceContractId});
    }
    return NextResponse.json({error:"Action not allowed."},{status:409});
  }catch(error){
    console.error("Saved client signature action failed:",error);
    return NextResponse.json({error:"The saved signature action could not be completed."},{status:500});
  }
}
