import dbConnect from "../../../../lib/dbConnect";
import Product from "../../../../models/product";
import cloudinary from "../../../../lib/cloudinary";
import { NextResponse } from "next/server";
import { Readable } from "stream";

const validCategories = ["agri", "construction", "attachments"];
const validConditions = ["New", "Used"];

function normalizeNumber(value) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    await dbConnect();

    // 1️⃣ Cream produs fără imagini
    const product = await Product.create({
      name: formData.get("name")?.trim(),
      category: formData.get("category"),
      price: normalizeNumber(formData.get("price")),
      year: normalizeNumber(formData.get("year")),
      manufacturer: formData.get("manufacturer")?.trim(),
      model: formData.get("model")?.trim(),
      condition: formData.get("condition") || "Used",
      hours: normalizeNumber(formData.get("hours")),
      description: formData.get("description") || "",
      loader: formData.get("loader") || "",
      backhoe: formData.get("backhoe") || "",
      cab: formData.get("cab") || "",
      engineHorsepower: normalizeNumber(formData.get("engineHorsepower")),
      drive: formData.get("drive") || "",
      transmissionType: formData.get("transmissionType") || "",
      stockNumber: normalizeNumber(formData.get("stockNumber")),
      imgs: [],
    });

    const productId = product._id.toString();

    // 2️⃣ Upload imagini în Cloudinary
    const files = formData.getAll("imgs");
    const uploadedImages = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `products/${productId}`,
            format: "webp", // 🔥 convertim automat în webp
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        Readable.from(buffer).pipe(stream);
      });

      uploadedImages.push(result.secure_url);
    }

    // 3️⃣ Salvăm linkurile în Mongo
    product.imgs = uploadedImages;
    await product.save();

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Eroare la crearea produsului." },
      { status: 500 }
    );
  }
}