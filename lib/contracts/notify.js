import nodemailer from "nodemailer";

export async function sendSignedNotification(contract) {
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "";
  await transporter.sendMail({ from: process.env.MAIL_FROM, to: process.env.CONTRACT_NOTIFICATION_EMAIL, subject: `Contract signed: ${contract.orderNumber}`, text: [`Client: ${contract.buyer.name}`, `Email: ${contract.buyer.email}`, `Order: ${contract.orderNumber}`, `Equipment: ${contract.equipment.make} ${contract.equipment.model}`, `Signed (UTC): ${contract.signedAt.toISOString()}`, `Admin: ${base}/admin/contracts/${contract._id}`].join("\n") });
}
