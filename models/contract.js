import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema({ event: String, at: { type: Date, default: Date.now }, actor: String, detail: String }, { _id: false });
const WarrantySchema = new mongoose.Schema({
  type: String,
  text: String,
  expiresAt: Date,
  manufacturer: Boolean,
  trial: Boolean,
  other: Boolean,
}, { _id: false });
const EquipmentSchema = new mongoose.Schema({
  make: String,
  model: { type: String, required: true },
  year: String,
  serialNumber: String,
  hours: String,
  description: String,
  descriptionHtml: String,
  images: [String],
  price: Number,
}, { _id: false });
const ContractSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, trim: true, index: true }, orderDate: Date, deliveryDate: Date,
  buyer: { name: { type: String, required: true }, company: String, address: String, cityStateZip: String, phonePrimary: String, phoneSecondary: String, email: { type: String, required: true, lowercase: true }, contact: String },
  deliveryAddress: String,
  equipment: { type: EquipmentSchema, required: true },
  equipmentItems: { type: [EquipmentSchema], default: undefined },
  pricing: { subtotal: Number, taxes: Number, shipping: Number, total: Number, currency: { type: String, default: "USD" }, totalOverridden: Boolean, equipmentPricingMode: { type: String, enum: ["subtotal", "per_item"], default: "subtotal" } },
  seller: { name: String, legalName: String, address: String, cityStateZip: String, phone: String, email: String, representativeName: String },
  deliveryChecks: { deliveryCompleted: Boolean, buyerInspected: Boolean, manualsGiven: Boolean, safetyExplained: Boolean, maintenanceExplained: Boolean },
  warranty: { type: WarrantySchema, default: () => ({}) },
  templateSnapshot: { type: mongoose.Schema.Types.Mixed, required: true }, templateVersion: Number, snapshotHash: String,
  linkTemplate: { type: String, enum: ["site", "paper"], default: "paper" },
  status: { type: String, enum: ["draft", "ready", "viewed", "signed", "revoked", "expired"], default: "draft", index: true },
  tokenHash: { type: String, select: false, index: true, sparse: true }, tokenValue: { type: String, select: false },
  signedLinkTokenHash: { type: String, select: false, index: true, sparse: true }, signedLinkTokenValue: { type: String, select: false },
  linkExpiresAt: Date, viewedAt: Date, signedAt: Date,
  signerName: String, signature: { type: [[[Number]]], select: false }, acceptedTerms: Boolean,
  signatureMethod: { type: String, enum: ["drawn", "typed_consent"] },
  typedSignatureConsent: Boolean,
  signatureConsentText: String,
  signatureConsentVersion: { type: Number, default: 1 },
  savedSignatureId: mongoose.Schema.Types.ObjectId,
  reusedSignatureId: mongoose.Schema.Types.ObjectId,
  auditIp: { type: String, select: false }, auditUserAgent: { type: String, select: false }, audit: [AuditSchema],
  integrityHash: String,
  notification: { status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" }, attempts: { type: Number, default: 0 }, lastAttemptAt: Date, error: String },
}, { timestamps: true, strict: "throw" });

ContractSchema.index({ "buyer.name": "text", "buyer.email": "text", "buyer.phonePrimary": "text", orderNumber: "text", "equipment.make": "text", "equipment.model": "text" });

// Fast Refresh keeps Mongoose models globally. Extend the cached model in-place;
// deleting it here races with parallel route compilation and causes intermittent
// "Schema hasn't been registered" 500 responses in development.
if (mongoose.models.Contract) {
  if (!mongoose.models.Contract.schema.path("signatureMethod")) mongoose.models.Contract.schema.add({
    signatureMethod: { type: String, enum: ["drawn", "typed_consent"] },
    typedSignatureConsent: Boolean,
    signatureConsentText: String,
    signatureConsentVersion: { type: Number, default: 1 },
    savedSignatureId: mongoose.Schema.Types.ObjectId,
    reusedSignatureId: mongoose.Schema.Types.ObjectId,
  });
  const cachedLinkTemplate=mongoose.models.Contract.schema.path("linkTemplate");
  if (!cachedLinkTemplate) mongoose.models.Contract.schema.add({
    linkTemplate: { type: String, enum: ["site", "paper"], default: "paper" },
  });
  else cachedLinkTemplate.default("paper");
  if (!mongoose.models.Contract.schema.path("tokenValue")) mongoose.models.Contract.schema.add({
    tokenValue: { type: String, select: false },
  });
  if (!mongoose.models.Contract.schema.path("signedLinkTokenHash")) mongoose.models.Contract.schema.add({
    signedLinkTokenHash: { type: String, select: false, index: true, sparse: true },
    signedLinkTokenValue: { type: String, select: false },
  });
  const cachedEquipment=mongoose.models.Contract.schema.path("equipment")?.schema;
  if(cachedEquipment){
    if(!cachedEquipment.path("descriptionHtml"))cachedEquipment.add({descriptionHtml:String});
    if(!cachedEquipment.path("price"))cachedEquipment.add({price:Number});
  }else{
    // Before EquipmentSchema existed, equipment was declared as nested paths.
    // Add the new dotted paths to that cached shape during Fast Refresh.
    if(!mongoose.models.Contract.schema.path("equipment.descriptionHtml"))mongoose.models.Contract.schema.add({"equipment.descriptionHtml":String});
    if(!mongoose.models.Contract.schema.path("equipment.price"))mongoose.models.Contract.schema.add({"equipment.price":Number});
  }
  if(!mongoose.models.Contract.schema.path("equipmentItems"))mongoose.models.Contract.schema.add({equipmentItems:{type:[EquipmentSchema],default:undefined}});
  const cachedPricing=mongoose.models.Contract.schema.path("pricing")?.schema;
  if(cachedPricing){
    if(!cachedPricing.path("equipmentPricingMode"))cachedPricing.add({equipmentPricingMode:{type:String,enum:["subtotal","per_item"],default:"subtotal"}});
  }else if(!mongoose.models.Contract.schema.path("pricing.equipmentPricingMode"))mongoose.models.Contract.schema.add({"pricing.equipmentPricingMode":{type:String,enum:["subtotal","per_item"],default:"subtotal"}});
  const warrantySchema=mongoose.models.Contract.schema.path("warranty")?.schema;
  if(warrantySchema&&!warrantySchema.path("manufacturer"))warrantySchema.add({manufacturer:Boolean,trial:Boolean,other:Boolean});
}

export default mongoose.models.Contract || mongoose.model("Contract", ContractSchema);
