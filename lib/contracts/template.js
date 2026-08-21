import ContractTemplate from "@/models/contractTemplate";
import { DEFAULT_TEMPLATE } from "./defaultTemplate";
import { sanitizeText } from "./security";

export async function getActiveTemplate() {
  const found = await ContractTemplate.findOne({ active: true }).sort({ version: -1 }).lean();
  return found || DEFAULT_TEMPLATE;
}
export function cleanTemplate(raw) {
  const base = raw || {}; const company = base.company || {}; const rep = base.sellerRepresentative || {};
  return { name: sanitizeText(base.name, 200) || DEFAULT_TEMPLATE.name, logoUrl: sanitizeText(base.logoUrl, 500), company: Object.fromEntries(["name","legalName","address","cityStateZip","phone","email","website"].map((k) => [k, sanitizeText(company[k], 300)])), deliveryReceiptText: sanitizeText(base.deliveryReceiptText), buyerDeclarations: (base.buyerDeclarations || []).slice(0, 20).map((x) => sanitizeText(x, 1000)), introduction: sanitizeText(base.introduction), terms: (base.terms || []).slice(0, 14).map((x, i) => ({ number: i + 1, title: sanitizeText(x.title, 200), body: sanitizeText(x.body) })), confirmationText: sanitizeText(base.confirmationText), witnessText: sanitizeText(base.witnessText), sellerRepresentative: { name: sanitizeText(rep.name, 200), signatureUrl: sanitizeText(rep.signatureUrl, 500), signedDate: sanitizeText(rep.signedDate, 30) }, warrantyOptions: (base.warrantyOptions || []).slice(0, 10).map((x) => sanitizeText(x, 300)), warrantyDisclaimer: sanitizeText(base.warrantyDisclaimer), active: base.active !== false };
}
