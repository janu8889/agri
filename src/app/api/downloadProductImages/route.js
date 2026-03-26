import fs from "fs";
import path from "path";
import axios from "axios";
import Product from "../../../../models/product"; // modelul mongoose deja existent
import dbConnect from "../../../../lib/dbConnect";
import { NextResponse } from "next/server";

// Extrage public_id din URL Cloudinary
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
  const publicId = extractPublicId(url);
  if (!publicId) return;

  const filePath = path.join(process.cwd(), "images", publicId + ".webp");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const res = await axios({ url, method: "GET", responseType: "stream" });
  const writer = fs.createWriteStream(filePath);
  res.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
}

export async function POST(req) {
  try {
    await dbConnect(); // <-- asigură conexiunea

    const { productIds } = await req.json();
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return new Response(JSON.stringify({ error: "Missing productIds array" }), { status: 400 });
    }

    let downloaded = 0;

    for (const id of productIds) {
      const doc = await Product.findById(id).lean();
      if (!doc || !doc.imgs || !Array.isArray(doc.imgs)) continue;

      for (const imgUrl of doc.imgs) {
        await downloadImage(imgUrl);
        downloaded++;
      }
    }

    return new Response(JSON.stringify({ ok: true, message: `Downloaded ${downloaded} images!` }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error", details: err.message }), { status: 500 });
  }
}