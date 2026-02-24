import dbConnect from "../../../../lib/dbConnect";
import Product from "../../../../models/product";
import { NextResponse } from "next/server";

const numericFields = ["price", "year", "hours", "engineHorsepower"];

function normalizeNumber(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function POST(request) {
  try {
    const body = await request.json();
    await dbConnect();

    const productData = {};

    Object.keys(Product.schema.paths).forEach((key) => {
      if (["__v", "createdAt", "_id"].includes(key)) return; // nu atingem _id

      if (numericFields.includes(key)) {
        productData[key] = normalizeNumber(body[key]);
      } else if (key === "imgs") {
        productData[key] = Array.isArray(body[key]) ? body[key] : [];
      } else {
        // Lasăm default Mongoose să se aplice
        if (body[key] !== undefined) productData[key] = body[key];
      }
    });

    const product = await Product.create(productData);
console.log(product);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err) {
    console.error("Eroare server:", err);
    return NextResponse.json({ error: "Eroare la crearea produsului." }, { status: 500 });
  }
}