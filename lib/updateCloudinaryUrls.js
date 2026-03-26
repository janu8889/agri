// lib/updateCloudinaryUrls.js
import mongoose from "mongoose";
import Product from "../models/product.js"; // asigură-te că calea e corectă

// --- CONFIG MONGO ---
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://jansumeni_db_user:Kg5RGgBqCPbS6csn@cluster0.xfnwlcr.mongodb.net/jansumeni?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

await mongoose.connect(MONGODB_URI, { bufferCommands: false });

// --- SCHIMBA CLOUD NAME ---
const OLD_CLOUD = "dt8xieeaj";
const NEW_CLOUD = "dsvtepgci";

async function updateProductCloudUrls(productIds) {
  if (!Array.isArray(productIds) || productIds.length === 0) return;

  for (const id of productIds) {
    const product = await Product.findById(id);
    if (!product) {
      console.log(`Product not found: ${id}`);
      continue;
    }

    if (!Array.isArray(product.imgs) || product.imgs.length === 0) {
      console.log(`No images for product: ${id}`);
      continue;
    }

    // Update URL-urile
    product.imgs = product.imgs.map(url => url.replace(OLD_CLOUD, NEW_CLOUD));
    await product.save();

    console.log(`Updated product ${id}, ${product.imgs.length} images.`);
  }

  console.log("All done!");
}

// --- EXEMPLE DE RULEZARE ---
// Poți pune unul sau mai multe ID-uri aici
const productIds = [
'699ee6f2c49eeb380bcfba90',
'699ee737c49eeb380bcfba92',
'699ee768c49eeb380bcfba94',
'699ee7b5c49eeb380bcfba96',
'699ee7fac49eeb380bcfba98',
'699ee847c49eeb380bcfba9a',
'699ee888c49eeb380bcfba9c',
];

await updateProductCloudUrls(productIds);

await mongoose.disconnect();