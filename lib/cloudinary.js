import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "Root",
  api_key: process.env.CLOUDINARY_KEY || "372747324631496",
  api_secret: process.env.CLOUDINARY_SECRET || "YoIOwRmocJ2S3261MZJ2f2Lr5po",
});

export default cloudinary;