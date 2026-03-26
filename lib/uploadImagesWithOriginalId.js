import cloudinary from "cloudinary";
import axios from "axios";
import Product from "../models/product.js";
import mongoose from "mongoose";

cloudinary.v2.config({
  cloud_name: 'dsvtepgci',
  api_key: '942645887267512',
  api_secret: '9Y-bUDQwipvMv25tXXkVWTtKqTY',
});

// Connect la MongoDB
await mongoose.connect('mongodb+srv://jansumeni_db_user:Kg5RGgBqCPbS6csn@cluster0.xfnwlcr.mongodb.net/jansumeni?retryWrites=true&w=majority', { bufferCommands: false });

function extractPublicId(url) {
  try {
    const parts = url.split("/upload/")[1];
    const withoutVersion = parts.replace(/v\d+\//, "");
    return withoutVersion.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

async function downloadImage(url) {
  const res = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer",
  });
  return res.data;
}

async function uploadImageToCloudinary(buffer, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
}

async function reuploadProductImages(productId) {
  const product = await Product.findById(productId).lean();
  if (!product || !product.imgs?.length) return;

  for (let imgUrl of product.imgs) {
    const publicId = extractPublicId(imgUrl);
    if (!publicId) continue;

    const buffer = await downloadImage(imgUrl);
    const newUrl = await uploadImageToCloudinary(buffer, publicId);
    console.log("Uploaded:", newUrl);
  }

  console.log("Done uploading product:", productId);
}

// Exemplu: rulezi pentru un array de ID-uri
const productIds = [
'699ee6f2c49eeb380bcfba90',
'699ee737c49eeb380bcfba92',
'699ee768c49eeb380bcfba94',
'699ee7b5c49eeb380bcfba96',
'699ee7fac49eeb380bcfba98',
'699ee847c49eeb380bcfba9a',
'699ee888c49eeb380bcfba9c',
];

for (let id of productIds) {
  await reuploadProductImages(id);
}

await mongoose.disconnect();

