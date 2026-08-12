import { Resend } from "resend";

export const config = { runtime: "edge" };

const resend = new Resend(process.env.RESEND_API_KEY);

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const BASE_URL = "https://www.breakfast-time.fr";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { recipientEmail, cardFrom, cardTo, message, amount, code, expiresAt, pdfBase64 } = await req.json();

    if (!recipientEmail || !cardFrom || !cardTo || !code || !pdfBase64) {
      return new Response(JSON.stringify({ error: "Champs manquants" }), { status: 400 });
    }

    const viewParams = new URLSearchParams({
      from: cardFrom,
      to: cardTo,
      code,
      expiresAt: expiresAt ?? "",
      ...(message ? { message } : {}),
      ...(amount ? { amount } : {}),
    });
    const viewUrl = `${BASE_URL}/carte-cadeau/voir?${viewParams.toString()}`;

    const emailHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Votre carte cadeau — Breakfast Time</title>
</head>
<body style="margin:0;padding:0;background-color:#f2ede4;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:28px 16px 44px;">
    <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.07);">
      <div style="height:5px;background:linear-gradient(90deg,#3a3a0a 0%,#DFF057 100%);"></div>
      <div style="padding:36px 40px 28px;text-align:center;">
        <img src="${BASE_URL}/logo.png" alt="Breakfast Time" style="height:48px;margin-bottom:24px;" />
        <div style="display:inline-block;background:#DFF057;color:#3a3a0a;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;padding:5px 18px;border-radius:50px;margin-bottom:22px;">
          Carte cadeau
        </div>
        <h1 style="margin:0 0 10px;font-size:26px;font-weight:700;color:#2a2a08;line-height:1.2;">Une surprise vous attend !</h1>
        <p style="margin:0;font-size:15px;color:#7a7a50;line-height:1.6;">De la part de ${esc(cardFrom)}.</p>
      </div>
      <div style="text-align:center;padding:8px 32px 28px;">
        <a href="${viewUrl}" style="display:inline-block;background:#DFF057;color:#2a2a08;text-decoration:none;font-weight:700;font-size:14px;padding:15px 36px;border-radius:50px;letter-spacing:0.2px;">
          Cliquez ici pour afficher votre cadeau →
        </a>
      </div>
      <div style="padding:0 40px 28px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#bbb;">
          Une question ? <a href="mailto:contact@breakfast-time.fr" style="color:#3a3a0a;font-weight:600;text-decoration:none;">contact@breakfast-time.fr</a>
        </p>
      </div>
    </div>
    <div style="background:#3a3a0a;border-radius:16px;padding:22px 32px;margin-top:14px;text-align:center;">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:0.3px;">© 2026 Breakfast Time</p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: "Breakfast Time <contact@breakfast-time.fr>",
      to: recipientEmail,
      subject: "Votre carte cadeau Breakfast Time",
      html: emailHtml,
      attachments: [
        {
          filename: "carte-cadeau-breakfast-time.pdf",
          content: pdfBase64,
        },
      ],
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error("Gift card email error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
