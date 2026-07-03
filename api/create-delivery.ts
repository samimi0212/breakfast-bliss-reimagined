export const config = { runtime: "edge" };

import { createClient } from "@supabase/supabase-js";
import { createUberDelivery, createStuartDelivery, type DeliveryOrder } from "./_lib/delivery-providers";

const supabase = createClient(
  "https://ommkmxahqxakoixoiiux.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function recordPendingUberDelivery(commandeId: string, deliveryId: string, order: DeliveryOrder) {
  await supabase.from("pending_deliveries").insert({
    commande_id: commandeId,
    provider: "uber",
    uber_delivery_id: deliveryId,
    order_payload: order,
    status: "pending",
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { order, commandeId } = (await req.json()) as { order: DeliveryOrder; commandeId?: string };

    try {
      const uber = await createUberDelivery(order);

      if (commandeId) {
        await recordPendingUberDelivery(commandeId, uber.delivery_id, order);
      }

      return new Response(
        JSON.stringify({ provider: "uber", tracking_url: uber.tracking_url, delivery_id: uber.delivery_id }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (uberErr) {
      console.error("Uber Direct error, bascule sur Stuart:", uberErr);

      const stuart = await createStuartDelivery(order);
      return new Response(
        JSON.stringify({ provider: "stuart", tracking_url: stuart.tracking_url, job_id: stuart.job_id }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error: any) {
    console.error("Livraison — échec Uber et Stuart:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
