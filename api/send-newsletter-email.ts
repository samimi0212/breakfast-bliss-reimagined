import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "edge" };

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  "https://ommkmxahqxakoixoiiux.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = "https://www.breakfast-time.fr";

function normalizeEmail(raw: string): string {
  const email = raw.trim().toLowerCase();
  const [local, domain] = email.split("@");
  if (domain === "gmail.com" || domain === "googlemail.com") {
    const withoutTag = local.split("+")[0];
    const withoutDots = withoutTag.replace(/\./g, "");
    return `${withoutDots}@gmail.com`;
  }
  return email;
}

async function sendConfirmationEmail(email: string, confirmToken: string) {
  const confirmUrl = `${BASE_URL}/api/confirm-newsletter?token=${confirmToken}`;

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
            Une dernière étape
          </span>
        </div>

        <h1 style="margin:0 0 20px;text-align:center;font-size:32px;font-weight:400;font-style:italic;color:#1e1e06;line-height:1.2;font-family:'DM Serif Display',Georgia,serif;">
          Confirmez votre inscription
        </h1>
        <p style="margin:0 0 36px;text-align:center;font-size:15px;color:#6b6b4a;line-height:1.7;">
          Pour recevoir votre code promo de bienvenue et nos actualités, confirmez que c'est bien vous en cliquant ci-dessous.
        </p>

        <div style="text-align:center;margin-bottom:8px;">
          <a href="${confirmUrl}"
             style="display:inline-block;background-color:#DFF057;color:#1e1e06;text-decoration:none;font-weight:800;font-size:15px;padding:16px 40px;border-radius:50px;letter-spacing:0.2px;">
            Confirmer mon inscription →
          </a>
        </div>

        <p style="margin:24px 0 0;text-align:center;font-size:12px;color:#b0a98a;">
          Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement cet email.
        </p>

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
    to: email,
    subject: "Confirmez votre inscription à la newsletter",
    html: emailHtml,
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { email, website } = await req.json();

    if (website) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Adresse email invalide" }), { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);

    const { data: inserted, error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: normalizedEmail })
      .select("confirm_token")
      .single();

    if (dbError) {
      if (dbError.code === "23505") {
        const { data: existing } = await supabase
          .from("newsletter_subscribers")
          .select("confirmed, confirm_token")
          .eq("email", normalizedEmail)
          .single();

        if (!existing || existing.confirmed) {
          return new Response(JSON.stringify({ error: "already_subscribed" }), { status: 409 });
        }

        await sendConfirmationEmail(normalizedEmail, existing.confirm_token);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
      console.error("DB error:", dbError);
      return new Response(JSON.stringify({ error: "Erreur base de données" }), { status: 500 });
    }

    await sendConfirmationEmail(normalizedEmail, inserted.confirm_token);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Newsletter error:", error);
    return new Response(JSON.stringify({ error: "Échec de l'inscription" }), { status: 500 });
  }
}
