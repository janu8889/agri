import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Product from "../models/product.js";

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

  const product = await Product.create({
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
  name: "2022 JOHN DEERE 5075E",
  category: "agriculture",
  price: 17800,
  year: 2022,
  manufacturer: "JOHN DEERE",
  model: "5075E",
  hours: 1818,
  description:
    `2022 John Deere 5075E utility tractor with 1,818 hours, equipped with MFWD (4WD) and a 12F/12R PowrReverser transmission for smooth direction changes and efficient loader operation. Features a JD 520M loader, loader prep package, dual mid valves with factory joystick control, and 540/540E rear PTO. Includes standard cab, wide R1 agricultural tires, and English operator's manual and decal kit. Tire sizes are 16.9-28 rear and 9.5-24 front. A versatile tractor well suited for farming, hay, livestock, loader work, and general utility applications.`,
  engineHorsepower: 75,
  imgFolder:
    "/home/lucky/Downloads/us/Machinery/Utila/agri/2022 JOHN DEERE 5075E - $42,800/Poze/m",
});

// -----------------------------
// disconnect
// -----------------------------
await mongoose.disconnect();