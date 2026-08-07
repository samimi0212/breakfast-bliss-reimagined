export const config = { runtime: "edge" };

import { getUberToken } from "./_lib/delivery-providers";

// Coordonnées du point de pickup : 371 chemin des Prés, 06410 Biot
const PICKUP_LAT = 43.6186;
const PICKUP_LNG = 7.0897;
const PICKUP_ADDRESS = "371 chemin des Prés, 06410 Biot, France";

const UBER_API_BASE = "https://api.uber.com/v1/customers";

// Doit rester aligné sur MIN_ORDER dans src/pages/Cart.tsx et sur la clé
// "cart.minOrder" des traductions : un écart bloquait le client à l'étape
// adresse après lui avoir laissé valider son panier.
const MINIMUM_ORDER = 15;
const FREE_DELIVERY_THRESHOLD = 45;
const CLIENT_SHARE = 0.5;
const MAX_CLIENT_FEE = 15;

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Grille de secours si le devis Uber échoue
function fallbackPrice(distanceKm: number): number | null {
  if (distanceKm < 5) return 7.50;
  if (distanceKm < 10) return 12.50;
  if (distanceKm < 12) return 17;
  return null;
}

async function getUberQuote(dropoffAddress: string): Promise<number> {
  const token = await getUberToken();
  const customerId = process.env.UBER_CUSTOMER_ID;
  const res = await fetch(`${UBER_API_BASE}/${customerId}/delivery_quotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ pickup_address: PICKUP_ADDRESS, dropoff_address: dropoffAddress }),
  });
  const data: any = await res.json();
  if (!res.ok) throw new Error(data.message || JSON.stringify(data));
  return data.fee / 100;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { address, cartTotal } = await req.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const geoRes = await fetch(geocodeUrl);
    const geoData: any = await geoRes.json();

    if (geoData.status !== "OK" || !geoData.results?.[0]) {
      return new Response(JSON.stringify({ error: "Adresse introuvable" }), { status: 400 });
    }

    const { lat, lng } = geoData.results[0].geometry.location;
    const distance = haversineDistance(PICKUP_LAT, PICKUP_LNG, lat, lng);

    if (distance > 12) {
      return new Response(JSON.stringify({
        deliverable: false,
        message: "Cette adresse est hors de notre zone de livraison (max 12 km)",
      }), { status: 200 });
    }

    if (typeof cartTotal === "number" && cartTotal < MINIMUM_ORDER) {
      return new Response(JSON.stringify({
        deliverable: false,
        belowMinimum: true,
        minimum: MINIMUM_ORDER,
        message: `Commande minimum de ${MINIMUM_ORDER}€ pour la livraison`,
      }), { status: 200 });
    }

    const roundedDistance = Math.round(distance * 10) / 10;

    if (typeof cartTotal === "number" && cartTotal >= FREE_DELIVERY_THRESHOLD) {
      return new Response(JSON.stringify({
        deliverable: true,
        price: 0,
        distance: roundedDistance,
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    let price: number;
    try {
      const realCost = await getUberQuote(address);
      price = Math.min(Math.round(realCost * CLIENT_SHARE * 100) / 100, MAX_CLIENT_FEE);
    } catch {
      const fallback = fallbackPrice(distance);
      if (fallback === null) {
        return new Response(JSON.stringify({
          deliverable: false,
          message: "Cette adresse est hors de notre zone de livraison (max 12 km)",
        }), { status: 200 });
      }
      price = fallback;
    }

    return new Response(JSON.stringify({
      deliverable: true,
      price,
      distance: roundedDistance,
    }), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
