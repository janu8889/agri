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
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map(f => path.join(folder, f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
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
    miles: data.miles, 
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
  name: "2012 Mack Pinnacle CHU613",
  category: "dump",
  price:  35970,
  year: 2022,
  manufacturer: "Mack",
  model: "Pinnacle CHU613",
  hours: 0,
  miles: 30560,
  description:
    ` 2012 Mack Pinnacle CHU613 tandem axle dump truck powered by a Mack MP8-415C 12.8L diesel engine producing 415 HP and equipped with an engine brake, paired with a 13-speed Eaton-Fuller manual transmission and differential lock. This Class 8 truck has only 30,560 miles and features a brand-new 14-foot steel end-dump body with a rectangular body shape, manual tarp, Camelback suspension, tandem rear axles, and a 56,000 lb gross vehicle weight. The chassis is equipped with a 12,000 lb front axle and 44,000 lb tandem rear axles, 11R24.5 tires, aluminum wheels, drum brakes, and a set-back axle configuration. The truck features a conventional standard cab with left-hand drive, power locks, vinyl upholstery, and air conditioning in good condition. The exterior is finished in white, and the truck is configured for demanding construction, hauling, and commercial applications. Available customization options include electric tarps, bed liners, airlift axles, pintle hitches, new tires, and paint services, with shipping also available. With its low mileage, powerful Mack diesel engine, heavy-duty tandem axle configuration, new steel dump body, and versatile customization options, this Mack Pinnacle CHU613 is well suited for construction, aggregate hauling, municipal work, excavation, and other demanding heavy-duty applications. `,
  engineHorsepower: 415,
  imgFolder:
    "/home/lucky/Downloads/us/Machinery/Dump Trucks/2012 MACK PINNACLE CHU613 - $59,990/Poze/m"
});

// -----------------------------
// disconnect
// -----------------------------
await mongoose.disconnect();