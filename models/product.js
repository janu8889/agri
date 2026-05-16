import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // Required fields
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ["agriculture", "construction", "attachments"], required: true },
  price: { type: Number, required: true },
  year: { type: Number, required: true },
  manufacturer: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },

  // Optional core fields
  hours: { type: Number, default: 0 },
  description: { type: String, trim: true },
  engineHorsepower: { type: Number, default: 0 },
  
  stockNumber: {
    type: Number,
    unique: true,
    default: () => Math.floor(100000 + Math.random() * 900000),
  },
  imgs: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model("Product", productSchema); 