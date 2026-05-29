import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Auto from "../models/product.js";

cloudinary.v2.config({
  cloud_name: 'dsvtepgci',
  api_key: '942645887267512',
  api_secret: '9Y-bUDQwipvMv25tXXkVWTtKqTY',
});

// -----------------------------
// connect MongoDB
// -----------------------------
await mongoose.connect(
  "mongodb+srv://jansumeni_db_user:Kg5RGgBqCPbS6csn@cluster0.xfnwlcr.mongodb.net/jansumeni?retryWrites=true&w=majority",
  { bufferCommands: false }
);

// -----------------------------
// get images from folder
// -----------------------------
function getImages(folder) {
  return fs
    .readdirSync(folder)
    .filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i))
    .map(f => path.join(folder, f))
    .sort();
}

// -----------------------------
// upload local file
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
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
  });
}

// -----------------------------
// CREATE SINGLE PRODUCT
// -----------------------------
async function createSingleProduct(data) {
  const files = getImages(data.imgFolder);

  if (!files.length) {
    console.log("❌ No images found");
    return;
  }

  const uploadedImages = [];

  for (let file of files) {
    const fileName = path.basename(file, path.extname(file));

    const publicId =
      "products/" +
      data.name.toLowerCase().replace(/\s+/g, "_") +
      "_" +
      fileName;

    const url = await uploadImage(file, publicId);

    uploadedImages.push(url);

    console.log("Uploaded:", url);
  }

  const product = await Auto.create({
    name: data.name,
    category: data.category,
    price: data.price,
    year: data.year,
    manufacturer: data.manufacturer,
    model: data.model,
    hours: data.hours || 0,
    description: data.description,
    engineHorsepower: data.engineHorsepower || 0,
    imgs: uploadedImages,
  });

  console.log("✅ PRODUCT CREATED:", product._id);
}

// -----------------------------
// 1 SINGUR PRODUS (EXEMPLU)
// -----------------------------
await createSingleProduct({
  name: "2015 NEW HOLLAND T4.90",
  category: "agriculture",
  price: 21960,
  year: 2015,
  manufacturer: "NEW HOLLAND",
  model: "T4.90",
  hours: 1380,
  description:
    `This 2015 New Holland T4.90 is a clean 4x4 utility tractor with cab, heat, and AC, designed for reliable daily farm work. Powered by an 86 HP turbo diesel engine with 73 PTO HP, it delivers strong and efficient performance for haying, feeding, and loader work.

Equipped with a 12/12 transmission and power shuttle, it allows smooth forward/reverse direction changes without clutching for improved productivity. It also features a NH 655 TL quick-attach loader with factory joystick control and a 6-foot bucket, making it highly versatile for material handling.

With 1,380 hours, rear hydraulic remotes, 540 PTO, differential lock, and loaded rear tires for added traction, this tractor is built for dependable field performance. The enclosed cab includes an air ride seat, work lights, wipers, and radio for operator comfort in all conditions.

Simple, strong, and ready to work, this T4.90 is a solid all-around farm tractor.`,
  engineHorsepower: 86,
  imgFolder:
    "/home/lucky/Downloads/us/Machinery/Utila/agri/2015 NEW HOLLAND T4.90 - $54,900/Poze",
});

// -----------------------------
// disconnect
// -----------------------------
await mongoose.disconnect();