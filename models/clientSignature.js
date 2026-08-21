import mongoose from "mongoose";

const ClientSignatureSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  normalizedEmail: { type: String, required: true, lowercase: true, index: true },
  signatureType: { type: String, enum: ["drawn", "typed_consent"], required: true },
  strokeData: { type: [[[Number]]], select: false },
  typedName: String,
  sourceContractId: { type: mongoose.Schema.Types.ObjectId, required: true },
  consentText: String,
  consentAcceptedAt: Date,
  lastUsedAt: Date,
  usageCount: { type: Number, default: 0 },
  revokedAt: Date,
  audit: [{ event: String, at: { type: Date, default: Date.now }, actor: String, contractId: mongoose.Schema.Types.ObjectId, _id: false }],
  auditIp: { type: String, select: false },
  auditUserAgent: { type: String, select: false },
}, { timestamps: true });

export default mongoose.models.ClientSignature || mongoose.model("ClientSignature", ClientSignatureSchema);
