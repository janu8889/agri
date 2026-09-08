import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Product from "../models/product.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// -----------------------------
// connect MongoDB
// -----------------------------
await mongoose.connect(
  process.env.MONGODB_URI,
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
  name: "2012 JOHN DEERE 7200R",
  category: "agriculture",
  price: 47650,
  year: 2012,
  manufacturer: "JOHN DEERE",
  model: "7200R",
  hours: 2231,
  description:
    `2012 John Deere 7200R with 2,231.2 accurate and verified hours. Powered by a John Deere PSX 6.8L 6-cylinder, 24-valve turbocharged and aftercooled diesel engine producing 200 HP, with 220 HP maximum output, 165 PTO HP, and 154.77 drawbar HP. The tractor features MFWD, differential lock, and a 20-speed partial powershift transmission with left-hand reverser and 20 forward/20 reverse speeds. Equipped with a cab featuring air conditioning, heater, air-ride seat, instructor seat, AM/FM radio, 7" color display, flashing beacon light, external mirrors, and GPS-ready capability. The rear setup includes a 1,000 RPM PTO with 1 3/8" shaft, three rear hydraulic remote valves, rear 3-point hitch, quick hitch, top link, and drawbar with hammer strap and pin. It also has 20 front weights totaling 2,000 lbs and two rear wheel weights totaling 1,000 lbs. Tire setup includes 380/85R34 front singles at approximately 60%, 380/90R50 rear duals with the main tires around 60% and duals around 70%. With an estimated operating weight of 26,080 lbs and a 115.2" wheelbase, this tractor is operable, very well maintained, and has been stored indoors when not in use.`,
  engineHorsepower: 200,
  imgFolder:
    "/home/lucky/Downloads/us/Machinery/Utila/Tractoare 2/2012 JOHN DEERE 7200R - $119,000/Poze/m",
});

// -----------------------------
// disconnect
// -----------------------------
await mongoose.disconnect();