export const config = { runtime: "edge" };

import { createClient } from "@supabase/supabase-js";
import {
  getUberDeliveryStatus,
  cancelUberDelivery,
  createStuartDelivery,
  type DeliveryOrder,
} from "./_lib/delivery-providers";

const supabase = createClient(
  "https://ommkmxahqxakoixoiiux.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FALLBACK_DELAY_MS = 5 * 60 * 1000;

// Statuts Uber Direct qui indiquent qu'un livreur a bien été assigné
const ASSIGNED_STATUSES = ["pickup", "pickup_complete", "dropoff", "delivered"];

export default async function handler(req: Request): Promise<Response> {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.DELIVERY_CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: pending, error } = await supabase
    .from("pending_deliveries")
    .select("*")
    .eq("status", "pending");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const results: any[] = [];

  for (const row of pending || []) {
    try {
      const status = await getUberDeliveryStatus(row.uber_delivery_id);
      const assigned = !!status.courier || ASSIGNED_STATUSES.includes(status.status);

      if (assigned) {
        await supabase
          .from("pending_deliveries")
          .update({ status: "resolved", resolved_at: new Date().toISOString() })
          .eq("id", row.id);
        results.push({ id: row.id, result: "resolved" });
        continue;
      }

      const ageMs = Date.now() - new Date(row.created_at).getTime();
      if (ageMs < FALLBACK_DELAY_MS) {
        results.push({ id: row.id, result: "still_waiting" });
        continue;
      }

      // Pas de livreur Uber après 5 min : on annule et on bascule sur Stuart
      await cancelUberDelivery(row.uber_delivery_id);
      const stuart = await createStuartDelivery(row.order_payload as DeliveryOrder);

      if (row.commande_id) {
        await supabase
          .from("commandes")
          .update({ tracking_url: stuart.tracking_url })
          .eq("id", row.commande_id);
      }

      await supabase
        .from("pending_deliveries")
        .update({ status: "fallback_done", resolved_at: new Date().toISOString() })
        .eq("id", row.id);

      results.push({ id: row.id, result: "fallback_to_stuart" });
    } catch (err: any) {
      console.error(`check-pending-deliveries — erreur sur ${row.id}:`, err);
      await supabase
        .from("pending_deliveries")
        .update({ status: "failed", resolved_at: new Date().toISOString() })
        .eq("id", row.id);
      results.push({ id: row.id, result: "failed", error: err.message });
    }
  }

  return new Response(JSON.stringify({ checked: results.length, results }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
