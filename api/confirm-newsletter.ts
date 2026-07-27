import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "edge" };

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  "https://ommkmxahqxakoixoiiux.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = "https://www.breakfast-time.fr";

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return Response.redirect(`${BASE_URL}/carte`, 302);
  }

  const { data: subscriber, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, confirmed")
    .eq("confirm_token", token)
    .single();

  if (error || !subscriber) {
    return Response.redirect(`${BASE_URL}/carte`, 302);
  }

  if (subscriber.confirmed) {
    return Response.redirect(`${BASE_URL}/carte`, 302);
  }

  await supabase
    .from("newsletter_subscribers")
    .update({ confirmed: true, confirmed_at: new Date().toISOString() })
    .eq("confirm_token", token);

  const emailHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@1&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#f2ede4;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:580px;margin:0 auto;padding:32px 16px 48px;">

    <div style="text-align:center;margin-bottom:28px;">
      <img src="https://www.breakfast-time.fr/logo.png" alt="Breakfast Time" width="52" style="display:inline-block;height:auto;" />
    </div>

    <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
      <div style="height:5px;background:linear-gradient(90deg,#3a3a0a,#DFF057);"></div>
      <div style="padding:44px 40px 40px;">

        <div style="text-align:center;margin-bottom:28px;">
          <span style="display:inline-block;background:#f2ede4;color:#3a3a0a;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;padding:7px 18px;border-radius:50px;">
            Bienvenue
          </span>
        </div>

        <h1 style="margin:0 0 20px;text-align:center;font-size:36px;font-weight:400;font-style:italic;color:#1e1e06;line-height:1.2;font-family:'DM Serif Display',Georgia,serif;">
          Bienvenue !
        </h1>
        <p style="margin:0 0 36px;text-align:center;font-size:15px;color:#6b6b4a;line-height:1.7;">
          On prépare chaque matin des petits-déjeuners et brunchs livrés directement chez vous — viennoiseries fraîches, bagel, tartines, menu anglais, burrito, bowl, boissons... — en 30 à 45 minutes sur toute la Côte d'Azur.
        </p>

        <div style="border-top:1px solid #eee8da;margin-bottom:32px;"></div>

        <div style="background:#f2ede4;border-radius:14px;padding:24px;text-align:center;margin-bottom:36px;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#9a9478;">Pour vous seulement</p>
          <p style="margin:0 0 10px;font-size:28px;font-weight:800;letter-spacing:5px;color:#1e1e06;">BIENVENUE10</p>
          <p style="margin:0;font-size:13px;color:#9a9478;">-10% sur votre première commande · valable 30 jours</p>
        </div>

        <div style="text-align:center;">
          <a href="https://www.breakfast-time.fr/carte"
             style="display:inline-block;background-color:#DFF057;color:#1e1e06;text-decoration:none;font-weight:800;font-size:15px;padding:16px 40px;border-radius:50px;letter-spacing:0.2px;">
            Commander maintenant →
          </a>
        </div>

      </div>
    </div>

    <div style="margin-top:24px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#b0a98a;line-height:1.7;">
        Livraison 7j/7 · 8h–15h · Alpes-Maritimes<br/>
        <span style="color:#c8c0a4;">© 2026 Breakfast Time</span>
      </p>
    </div>

  </div>
</body>
</html>`;

  await resend.emails.send({
    from: "Breakfast Time <contact@breakfast-time.fr>",
    to: subscriber.email,
    subject: "Votre cadeau de bienvenue ☀️",
    html: emailHtml,
  });

  await resend.emails.send({
    from: "Breakfast Time <contact@breakfast-time.fr>",
    to: "contact@breakfast-time.fr",
    subject: `Nouvelle inscription newsletter confirmée — ${subscriber.email}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #3a3a0a;">Nouvelle inscription newsletter confirmée</h2>
        <p><strong>Email :</strong> ${subscriber.email}</p>
        <p style="font-size: 12px; color: #999;">Confirmée le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</p>
      </div>
    `,
  });

  return Response.redirect(`${BASE_URL}/carte?newsletter=confirmee`, 302);
}
