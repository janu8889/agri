import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ["agriculture", "construction", "attachments"], required: true },
  price: { type: Number, required: true },
  year: { type: Number, required: true },
  manufacturer: { type: String, required: true, trim: true },
  fuel: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  condition: { type: String, enum: ["New", "Used"], default: "Used" },
  hours: { type: Number, default: 0 },
  description: { type: String, trim: true },
  loader: { type: String, default: "" },
  backhoe: { type: String, default: "" },
  cab: { type: String, default: "" },
  engineHorsepower: { type: Number, default: 0 },
  drive: { type: String, default: "" },
  transmissionType: { type: String, default: "" },
  stockNumber: {
    type: Number,
    unique: true,
    default: () => Math.floor(100000 + Math.random() * 900000),
  },  
  imgs: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});


export default mongoose.models.Product || mongoose.model("Product", productSchema);