// // src/app/api/buy-now/route.js
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const token = '7594221274:AAHhvlVReiGLUAbAhePSW6cq0CEW6_5i80s';
//     const chatId = '-5263521263';

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
        user: "messaging.4006218@gmail.com",
        pass: "zxkm fosn zsts hbji",
      },
    });

    await transporter.sendMail({
      from: `messaging.4006218@gmail.com`,
      to: "sales@sandwequipments.com", // unde vrei să primești mailul
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