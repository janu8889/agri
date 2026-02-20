import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ["agri", "construction", "attachments"], required: true },
  price: { type: Number, required: true },
  year: { type: Number, required: true },
  manufacturer: { type: String, required: true, trim: true },
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
  stockNumber: { type: Number, unique: true },
  imgs: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

// Generează stockNumber random dacă nu există deja
productSchema.pre("save", function (next) {
  if (!this.stockNumber) {
    this.stockNumber = Math.floor(100000 + Math.random() * 900000); // număr random 6 cifre
  }
  next();
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);