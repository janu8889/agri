import ContractAsset from "@/models/contractAsset";
import ContractTemplate from "@/models/contractTemplate";
import { DEFAULT_TEMPLATE } from "./defaultTemplate";

export const BUILTIN_SELLER_SIGNATURE_URL="/contract-seller-signature.png";

export function sellerSignaturePublicId(url=""){
  return String(url).match(/^\/api\/contract-assets\/([A-Za-z0-9_-]{32})$/)?.[1]||"";
}

export async function rememberSellerSignature(rep={},incrementUsage=true){
  const signatureUrl=String(rep.signatureUrl||"").trim();
  if(!signatureUrl)return;
  const name=String(rep.name||"").trim()||"Seller Representative";
  let template=await ContractTemplate.findOne({active:true}).sort({version:-1});
  if(!template){
    template=await ContractTemplate.create({...DEFAULT_TEMPLATE,sellerRepresentative:{name,signatureUrl,signedDate:""},version:1,active:true});
  }else{
    template.sellerRepresentative={...(template.sellerRepresentative?.toObject?.()||template.sellerRepresentative||{}),name,signatureUrl,signedDate:""};
    await template.save();
  }
  const publicId=sellerSignaturePublicId(signatureUrl);
  if(publicId){
    const update={$set:{representativeName:name,lastUsedAt:new Date()}};
    if(incrementUsage)update.$inc={usageCount:1};
    await ContractAsset.updateOne({publicId,kind:"signature"},update);
  }
}
