export const config = { runtime: "edge" };

import { createClient } from "@supabase/supabase-js";
import { createUberDelivery, type DeliveryOrder } from "./_lib/delivery-providers";

const supabase = createClient(
  "https://ommkmxahqxakoixoiiux.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function saveTrackingUrl(commandeId: string, trackingUrl: string) {
  if (!trackingUrl) return;
  await supabase.from("commandes").update({ tracking_url: trackingUrl }).eq("id", commandeId);
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { order, commandeId } = (await req.json()) as { order: DeliveryOrder; commandeId?: string };

    const uber = await createUberDelivery(order);

    if (commandeId) {
      await saveTrackingUrl(commandeId, uber.tracking_url);
    }

    return new Response(
      JSON.stringify({ provider: "uber", tracking_url: uber.tracking_url, delivery_id: uber.delivery_id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Livraison Uber Direct — échec:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
