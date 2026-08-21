import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ContractAsset from "@/models/contractAsset";

export async function GET(_request, { params }) {
  const { publicId } = await params;
  if (!/^[A-Za-z0-9_-]{32}$/.test(publicId)) return new NextResponse(null, { status: 404 });
  await dbConnect();
  const asset = await ContractAsset.findOne({ publicId }).select("+data contentType");
  if (!asset?.data) return new NextResponse(null, { status: 404 });
  return new NextResponse(new Uint8Array(asset.data), {
    headers: {
      "Content-Type": asset.contentType,
      "Content-Length": String(asset.data.length),
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
      "X-Robots-Tag": "noindex, noarchive",
    },
  });
}
