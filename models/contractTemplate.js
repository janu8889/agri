import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logoUrl: String,
  company: { name: String, legalName: String, address: String, cityStateZip: String, phone: String, email: String, website: String },
  deliveryReceiptText: String,
  buyerDeclarations: [String],
  introduction: String,
  terms: [{ number: Number, title: String, body: String, _id: false }],
  confirmationText: String,
  witnessText: String,
  sellerRepresentative: { name: String, signatureUrl: String, signedDate: String },
  warrantyOptions: [String],
  warrantyDisclaimer: String,
  active: { type: Boolean, default: true },
  version: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.models.ContractTemplate || mongoose.model("ContractTemplate", TemplateSchema);
