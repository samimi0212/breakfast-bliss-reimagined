export const config = { runtime: "edge" };

import { getUberToken, getStuartToken } from "./_lib/delivery-providers";

const PICKUP_ADDRESS = "371 chemin des Prés, 06410 Biot, France";
const UBER_API_BASE = "https://sandbox-api.uber.com/v1/customers";
const STUART_API_BASE = "https://api.sandbox.stuart.com/v2";

async function quoteUber(dropoffAddress: string) {
  const token = await getUberToken();
  const customerId = process.env.UBER_CUSTOMER_ID;
  const res = await fetch(`${UBER_API_BASE}/${customerId}/delivery_quotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      pickup_address: PICKUP_ADDRESS,
      dropoff_address: dropoffAddress,
    }),
  });
  const data: any = await res.json();
  if (!res.ok) throw new Error(data.message || JSON.stringify(data));
  return data;
}

async function quoteStuart(dropoffAddress: string) {
  const token = await getStuartToken();
  const res = await fetch(`${STUART_API_BASE}/jobs/pricing`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      job: {
        pickups: [{ address: PICKUP_ADDRESS }],
        dropoffs: [{ address: dropoffAddress, package_type: "small" }],
      },
    }),
  });
  const data: any = await res.json();
  if (!res.ok) throw new Error(data.message || JSON.stringify(data));
  return data;
}

const TEST_ADDRESSES = [
  { label: "Antibes centre", address: "Place Nationale, 06600 Antibes, France" },
  { label: "Biot village", address: "Place des Arcades, 06410 Biot, France" },
  { label: "Valbonne village", address: "Place des Arcades, 06560 Valbonne, France" },
  { label: "Sophia Antipolis", address: "1047 Route des Dolines, 06560 Valbonne, France" },
  { label: "Cagnes-sur-Mer centre", address: "Place du Général de Gaulle, 06800 Cagnes-sur-Mer, France" },
  { label: "Nice centre", address: "Place Masséna, 06000 Nice, France" },
  { label: "Aéroport Nice", address: "Aéroport Nice Côte d'Azur, 06206 Nice, France" },
  { label: "Vence", address: "Place du Grand Jardin, 06140 Vence, France" },
];

export default async function handler(): Promise<Response> {
  const results = [];

  for (const t of TEST_ADDRESSES) {
    const entry: any = { label: t.label, address: t.address };
    try {
      entry.uber = await quoteUber(t.address);
    } catch (e: any) {
      entry.uber_error = e.message;
    }
    try {
      entry.stuart = await quoteStuart(t.address);
    } catch (e: any) {
      entry.stuart_error = e.message;
    }
    results.push(entry);
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
