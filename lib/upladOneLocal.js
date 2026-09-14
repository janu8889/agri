import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Product from "../models/product.js";

cloudinary.v2.config({
  cloud_name: "dsvtepgci",
  api_key: 942645887267512,
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
  name: "2023 JOHN DEERE 6105E",
  category: "agriculture",
  price: 27980,
  year: 2023,
  manufacturer: "JOHN DEERE",
  model: "6105E",
  hours: 1481,
  description:
    `Clean 2023 John Deere 6105E with 1,481 hours, 105 engine HP, and 89 PTO HP. This MFWD tractor features a cab with heat and A/C, air suspension seat, buddy seat, AM/FM radio, mirrors, and GreenStar/GPS-ready capability. The 24-speed power shuttle transmission provides 24 forward and 12 reverse speeds, with differential lock and 540/1000 RPM rear PTO. Hydraulic equipment includes three rear remotes, mid-mount hydraulics, joystick control, rear 3-point hitch, and top link. The tractor is equipped with a John Deere 563 loader and 74" Euro Global hydraulic quick-attach bucket, plus a front grill guard and front weight block. Radial tires are in excellent condition, with 14.9R24 fronts at 90% and 18.4R38 rears at 95%. Factory emissions warranty is included through October 6, 2028, or 3,000 hours, whichever comes first. A versatile late-model tractor ready for daily farm and loader work.`,
  engineHorsepower: 105,
  imgFolder:
    "/home/lucky/Downloads/us/Machinery/Utila/agri/2023 JOHN DEERE 6105E - $69,800/Poze/m",
});

// -----------------------------
// disconnect
// -----------------------------
await mongoose.disconnect();