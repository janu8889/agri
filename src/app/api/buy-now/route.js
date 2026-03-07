// src/app/api/buy-now/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = '7594221274:AAHhvlVReiGLUAbAhePSW6cq0CEW6_5i80s';
    const chatId = '892718536';

    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      message
    } = body;

    if (
      !fullName || !phone || !email
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const text = `
BUY NOW
fullName ${fullName}
phone: ${phone}
email: ${email}
message: ${message}
`;

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text })
    });

    const data = await tgRes.json();

    return NextResponse.json({ ok: true, telegram: data });

  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}