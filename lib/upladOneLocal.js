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
  name: "2021 JOHN DEERE 3046R",
  category: "agriculture",
  price: 17160,
  year: 2021,
  manufacturer: "JOHN DEERE",
  model: "3046R",
  hours: 740,
  description:
    `2021 John Deere 3046R, 46 HP, 3-cylinder Yanmar diesel engine with turbo and glow plugs, MFWD 4x4 with 3-range hydrostatic transmission, showing 740 hours, equipped with JD 320R quick-attach loader, factory joystick with 3rd function, 6’ quick-attach bucket, JD style carrier and grill guard, deluxe automotive-style cruise control with Load Match, Speed Match and Motion Match, electronic throttle, power steering and differential lock, rear hydraulic SCV, 540 PTO and mid PTO, 3-point hitch with top link and stabilizer bars, R4 tires with 15x19.5 rear tires at 80% (rear tires loaded) and 25x8.50-14 front tires at 70%, full cab with heat and AC, two doors, front and rear wiper, front and rear work lights, deluxe air ride seat, tilt steering wheel, radio, sun visor, rearview mirror and cup holder, with JD Limited Basic Warranty valid until 12-19-2027 (2,000-hour limit).`,
  engineHorsepower: 46,
  imgFolder:
    "/home/lucky/Downloads/us/Machinery/Utila/agri/2021 JOHN DEERE 3046R - $42,900/Poze/m",
});

// -----------------------------
// disconnect
// -----------------------------
await mongoose.disconnect();