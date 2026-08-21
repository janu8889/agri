import mongoose from "mongoose";

const ContractAssetSchema = new mongoose.Schema({
  publicId: { type: String, required: true, unique: true, index: true },
  kind: { type: String, enum: ["logo", "signature"], required: true },
  contentType: { type: String, enum: ["image/png", "image/jpeg", "image/webp"], required: true },
  data: { type: Buffer, required: true, select: false },
  size: { type: Number, required: true },
  representativeName: { type: String, trim: true },
  label: { type: String, trim: true },
  lastUsedAt: Date,
  usageCount: { type: Number, default: 0 },
  archivedAt: Date,
}, { timestamps: true });

if (process.env.NODE_ENV === "development" && mongoose.models.ContractAsset && !mongoose.models.ContractAsset.schema.path("archivedAt")) {
  mongoose.models.ContractAsset.schema.add({ archivedAt: Date });
}

export default mongoose.models.ContractAsset || mongoose.model("ContractAsset", ContractAssetSchema);
