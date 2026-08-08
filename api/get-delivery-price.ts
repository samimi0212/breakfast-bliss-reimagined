export const config = { runtime: "edge" };

const PICKUP_LAT = 43.6186;
const PICKUP_LNG = 7.0897;

const MINIMUM_ORDER = 15;
const FREE_DELIVERY_THRESHOLD = 45;

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

function deliveryPrice(distanceKm: number): number | null {
  if (distanceKm < 5) return 4.99;
  if (distanceKm <= 12) return 6.99;
  return null;
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

    const price = deliveryPrice(distance);
    if (price === null) {
      return new Response(JSON.stringify({
        deliverable: false,
        message: "Cette adresse est hors de notre zone de livraison (max 12 km)",
      }), { status: 200 });
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
