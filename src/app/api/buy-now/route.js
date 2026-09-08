// // src/app/api/buy-now/route.js
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const token = process.env.TELEGRAM_BOT_TOKEN;
//     const chatId = process.env.TELEGRAM_CHAT_ID;

//     const body = await req.json();
//     const {
//       fullName,
//       email,
//       phone,
//       message
//     } = body;

//     if (
//       !fullName || !phone || !email
//     ) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const text = `
// BUY NOW
// fullName ${fullName}
// phone: ${phone}
// email: ${email}
// message: ${message}
// `;

//     const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ chat_id: chatId, text: text })
//     });

//     const data = await tgRes.json();

//     return NextResponse.json({ ok: true, telegram: data });

//   } catch (err) {
//     return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, phone, message } = body;

    if (!fullName || !phone || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const text = `
BUY NOW LEAD

Full Name: ${fullName}
Phone: ${phone}
Email: ${email}
Message: ${message || "-"}
`;


    // =========================
    // 2. EMAIL (GMAIL + NODEMAILER)
    // =========================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO, // unde vrei să primești mailul
      subject: "BUY NOW LEAD",
      text,
    });

    // =========================
    // RESPONSE
    // =========================
    return NextResponse.json({
      ok: true,
      telegram: telegramData,
      email: "sent",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
