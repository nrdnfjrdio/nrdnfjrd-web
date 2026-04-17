import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_EMAIL ?? "lengsoe@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { name, company, email, phone } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "nrdnfjrd.io <noreply@nrdnfjrd.io>",
      to: TO_EMAIL,
      subject: `Ny henvendelse fra ${name} — ${company ?? "ukendt virksomhed"}`,
      text: `
Navn: ${name}
Virksomhed: ${company ?? "—"}
Email: ${email}
Telefon: ${phone ?? "—"}
      `.trim(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
