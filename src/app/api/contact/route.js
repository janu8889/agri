import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { fullName, email, phone, message, contactTime } = await req.json();

    if (!fullName || !email || !contactTime || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const token = '7594221274:AAHhvlVReiGLUAbAhePSW6cq0CEW6_5i80s';
    const chatId = '892718536';

    const text = `
CONTACT US FORM
fullName: ${fullName}
Email: ${email}
ContactTime: ${contactTime}
Phone: ${phone}
Message: ${message}
`;

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    const data = await tgRes.json();

    return NextResponse.json({ ok: true, telegram: data });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}