// lib/replaceAutoImages.js

import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Auto from "../models/product.js";

// -----------------------------
// CLOUDINARY CONFIG      cloud_name: process.env.CLOUD_NAME,,
// -----------------------------
cloudinary.v2.config({
  cloud_name: "",
  api_key: ,
  api_secret: "",
});

// -----------------------------
// MONGODB CONFIG
// -----------------------------
await mongoose.connect(
  "",
  { bufferCommands: false }
);
// -----------------------------
// GET IMAGES FROM FOLDER
// -----------------------------
function getImages(folder) {
  if (!fs.existsSync(folder)) {
    throw new Error(`❌ Folder not found: ${folder}`);
  }

  return fs
    .readdirSync(folder)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);

      return numA - numB;
    })
    .map((file) => path.join(folder, file));
}

// -----------------------------
// UPLOAD IMAGE
// -----------------------------
function uploadImage(filePath, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      filePath,
      {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

// -----------------------------
// EXTRACT CLOUDINARY PUBLIC ID
// FROM URL
// -----------------------------
function getCloudinaryPublicId(url) {
  try {
    const parsedUrl = new URL(url);

    // Exemplu:
    // https://res.cloudinary.com/dsvtepgci/image/upload/v123456/products/car_1.jpg

    const uploadIndex = parsedUrl.pathname.indexOf("/upload/");

    if (uploadIndex === -1) {
      console.log("⚠️ Not a Cloudinary upload URL:", url);
      return null;
    }

    let publicPath = parsedUrl.pathname.substring(
      uploadIndex + "/upload/".length
    );

    // Elimină transformările dacă există
    // ex: /c_fill,w_500,q_auto/v123/products/car.jpg
    const parts = publicPath.split("/");

    while (
      parts.length &&
      (
        parts[0].includes(",") ||
        parts[0].startsWith("c_") ||
        parts[0].startsWith("w_") ||
        parts[0].startsWith("h_") ||
        parts[0].startsWith("q_") ||
        parts[0].startsWith("f_") ||
        parts[0].startsWith("dpr_") ||
        parts[0].startsWith("ar_")
      )
    ) {
      parts.shift();
    }

    // Elimină versiunea v123456
    if (parts[0] && /^v\d+$/.test(parts[0])) {
      parts.shift();
    }

    publicPath = parts.join("/");

    // Elimină extensia
    publicPath = publicPath.replace(/\.[^/.]+$/, "");

    return publicPath;
  } catch (error) {
    console.log("⚠️ Could not parse Cloudinary URL:", url);
    return null;
  }
}

// -----------------------------
// DELETE OLD CLOUDINARY IMAGE
// -----------------------------
async function deleteCloudinaryImage(url) {
  const publicId = getCloudinaryPublicId(url);

  if (!publicId) {
    return;
  }

  try {
    const result = await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: "image",
      type: "upload",
      invalidate: true,
    });

    console.log(`🗑️ Deleted old image: ${publicId}`, result.result);
  } catch (error) {
    console.error(
      `❌ Failed deleting old image: ${publicId}`,
      error.message
    );
  }
}

// -----------------------------
// REPLACE PRODUCT IMAGES
// -----------------------------
async function replaceProductImages({
  productId,
  imgFolder,
}) {
  console.log("\n==============================");
  console.log("START REPLACE IMAGES");
  console.log("==============================");

  console.log("Product ID:", productId);
  console.log("Image folder:", imgFolder);

  // -----------------------------
  // FIND EXISTING PRODUCT
  // -----------------------------
  const product = await Auto.findById(productId);

  if (!product) {
    throw new Error(`❌ Product not found: ${productId}`);
  }

  console.log(`✅ Product found: ${product.name}`);

  // -----------------------------
  // SAVE OLD URLS
  // -----------------------------
  const oldImages = Array.isArray(product.imgs)
    ? [...product.imgs]
    : [];

  console.log(`🖼️ Old images: ${oldImages.length}`);

  // -----------------------------
  // GET NEW LOCAL IMAGES
  // -----------------------------
  const files = getImages(imgFolder);

  if (!files.length) {
    throw new Error("❌ No images found in folder");
  }

  console.log(`📁 New images found: ${files.length}`);

  // -----------------------------
  // UPLOAD NEW IMAGES
  // -----------------------------
  const uploadedImages = [];

  for (const file of files) {
    const fileName = path.basename(
      file,
      path.extname(file)
    );

    const random = Math.random()
      .toString(36)
      .slice(2, 7);

    const timestamp = Date.now();

    const safeName = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    const publicId =
      `products/${safeName}_${fileName}_${timestamp}_${random}`;

    console.log(`⬆️ Uploading: ${file}`);

    const result = await uploadImage(
      file,
      publicId
    );

    uploadedImages.push(result.secure_url);

    console.log(`✅ Uploaded: ${result.secure_url}`);
  }

  // -----------------------------
  // UPDATE EXISTING MONGODB DOC
  // -----------------------------
  product.imgs = uploadedImages;

  await product.save();

  console.log(
    `✅ MongoDB updated with ${uploadedImages.length} new images`
  );

  // -----------------------------
  // DELETE OLD CLOUDINARY IMAGES
  // -----------------------------
  console.log("\n🗑️ Deleting old Cloudinary images...");

  for (const oldUrl of oldImages) {
    await deleteCloudinaryImage(oldUrl);
  }

  console.log("\n==============================");
  console.log("✅ ALL DONE");
  console.log("==============================");

  console.log("Product:", product._id);
  console.log("Old images:", oldImages.length);
  console.log("New images:", uploadedImages.length);
}

// -----------------------------
// RUN
// -----------------------------

await replaceProductImages({
  productId: "6a7a1ca7aa3e05ea81669fac",

  imgFolder:
    "/home/lucky/Downloads/Telegram Desktop/2022 JOHN DEERE 5075E - $42,800/Poze",
});

// -----------------------------
// DISCONNECT
// -----------------------------

await mongoose.disconnect();

console.log("🔌 MongoDB disconnected");