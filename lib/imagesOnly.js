import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.v2.config({
  cloud_name: 'dsvtepgci',
  api_key: '942645887267512',
  api_secret: '9Y-bUDQwipvMv25tXXkVWTtKqTY',
});

// -----------------------------
// Get images from folder
// -----------------------------
function getImages(folder) {
  return fs
    .readdirSync(folder)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map((f) => path.join(folder, f))
    .sort();
}

// -----------------------------
// Upload image to Cloudinary
// -----------------------------
async function uploadImage(filePath, publicId) {
  const result = await cloudinary.v2.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });

  return result.secure_url;
}

// -----------------------------
// Upload all images from folder
// -----------------------------
export async function uploadFolder(data) {
  const files = getImages(data.imgFolder);

  if (!files.length) {
    console.log("❌ No images found");
    return [];
  }

  const uploadedImages = [];

  for (const file of files) {
    const fileName = path.basename(file, path.extname(file));

    const publicId = `products/${data.name
      .toLowerCase()
      .replace(/\s+/g, "_")}_${fileName}`;

    const url = await uploadImage(file, publicId);

    uploadedImages.push(url);
    console.log("✅ Uploaded:", url);
  }

  console.log("\nAll uploaded:");
  console.log(uploadedImages);

  return uploadedImages;
}

// -----------------------------
// RUN
// -----------------------------
await uploadFolder({
  name: "2018 YANMAR VIO55-6A",
  imgFolder:
    "/home/lucky/Downloads/photos",
});