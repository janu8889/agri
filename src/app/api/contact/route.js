// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { fullName, email, phone, message } = await req.json();

//     if (!fullName || !email || !phone) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const token = '7594221274:AAHhvlVReiGLUAbAhePSW6cq0CEW6_5i80s';
//     const chatId = '-5263521263';

//     const text = `
//       CONTACT US FORM
//       fullName: ${fullName}
//       Email: ${email}
//       Phone: ${phone}
//       Message: ${message}
// `;


//     const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ chat_id: chatId, text })
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
    const { fullName, email, phone, message } = await req.json();

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const text = `
CONTACT US FORM

Full Name: ${fullName}
Email: ${email}
Phone: ${phone}
Message: ${message || "-"}
`;

    // =========================
    // EMAIL CONFIG (GMAIL)
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
      to: "sales@centralnewholland.com",
      subject: "📩 New Contact Form Submission",
      text,
    });

    return NextResponse.json({ ok: true, email: "sent" });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}