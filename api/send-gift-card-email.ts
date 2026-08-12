import { Resend } from "resend";

export const config = { runtime: "edge" };

const resend = new Resend(process.env.RESEND_API_KEY);

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { recipientEmail, cardFrom, cardTo, amount, code, expiresAt, pdfBase64 } = await req.json();

    if (!recipientEmail || !cardFrom || !cardTo || !code || !pdfBase64) {
      return new Response(JSON.stringify({ error: "Champs manquants" }), { status: 400 });
    }

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
        <div style="display:inline-block;background:#DFF057;color:#3a3a0a;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;padding:5px 18px;border-radius:50px;margin-bottom:22px;">
          Carte cadeau
        </div>
        <h1 style="margin:0 0 10px;font-size:26px;font-weight:700;color:#2a2a08;line-height:1.2;">Vous avez reçu un brunch !</h1>
        <p style="margin:0;font-size:15px;color:#7a7a50;line-height:1.6;">De la part de ${esc(cardFrom)}, pour ${esc(cardTo)}.</p>
      </div>
      <div style="margin:0 32px 24px;">
        <div style="background:#f9f7f0;border-radius:14px;padding:20px 24px;">
          ${amount ? `<p style="margin:0 0 10px;font-size:15px;color:#2a2a08;"><strong>Montant :</strong> ${esc(amount)}</p>` : ""}
          <p style="margin:0 0 10px;font-size:15px;color:#2a2a08;"><strong>Code :</strong> ${esc(code)}</p>
          <p style="margin:0;font-size:15px;color:#2a2a08;"><strong>Valable jusqu'au :</strong> ${esc(expiresAt)}</p>
        </div>
      </div>
      <div style="padding:0 32px 28px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#999;">Le visuel de votre carte cadeau est joint à cet email en PDF.</p>
      </div>
      <div style="padding:0 40px 28px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#bbb;">
          Une question ? <a href="mailto:contact@breakfast-time.fr" style="color:#3a3a0a;font-weight:600;text-decoration:none;">contact@breakfast-time.fr</a>
        </p>
      </div>
    </div>
    <div style="background:#3a3a0a;border-radius:16px;padding:22px 32px;margin-top:14px;text-align:center;">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:0.3px;">© 2026 Breakfast Time — Livraison dans les Alpes-Maritimes</p>
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
