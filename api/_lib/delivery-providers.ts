const UBER_AUTH_URL = "https://login.uber.com/oauth/v2/token";
const UBER_API_BASE = "https://api.uber.com/v1/customers";
const STUART_AUTH_URL = "https://api.stuart.com/oauth/token";
const STUART_API_BASE = "https://api.stuart.com/v2";

const PICKUP_ADDRESS = "371 chemin des Prés, 06410 Biot, France";
const STUART_PICKUP_PHONE = "+33626154730";
const UBER_PICKUP_PHONE = process.env.BREAKFAST_PHONE || "+33600000000";

// Décalage entre Europe/Paris et UTC, en millisecondes, pour un instant donné.
function parisOffsetMs(instant: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);

  const v: Record<string, number> = {};
  for (const p of parts) if (p.type !== "literal") v[p.type] = Number(p.value);

  const asUtc = Date.UTC(v.year, v.month - 1, v.day, v.hour % 24, v.minute, v.second);
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

/**
 * Convertit un créneau saisi par le client ("2026-08-05" + "11:00"), qui est
 * toujours une heure de Paris, en instant UTC.
 *
 * À ne pas remplacer par `new Date(y, m, d, h, min)` ni par
 * `new Date("2026-08-05T11:00:00")` : ces deux formes interprètent l'heure dans
 * le fuseau du serveur, or Vercel Edge tourne en UTC. Un créneau de 11h00
 * partait donc à 13h00 heure de Paris en été.
 */
export function parisTimeToUtc(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const naive = Date.UTC(year, month - 1, day, hour, minute);

  // Deux passes : la première donne le décalage approximatif, la seconde le
  // corrige pour les créneaux proches d'un changement d'heure.
  const firstPass = naive - parisOffsetMs(new Date(naive));
  return new Date(naive - parisOffsetMs(new Date(firstPass)));
}

export interface DeliveryOrder {
  prenom: string;
  nom: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  date: string;
  heure: string;
  isMaintenant?: boolean;
  note?: string;
  items: { name: string; qty: number; price: string }[];
  total: number;
}

export async function getUberToken(): Promise<string> {
  const res = await fetch(UBER_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.UBER_CLIENT_ID!,
      client_secret: process.env.UBER_CLIENT_SECRET!,
      scope: "eats.deliveries",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Auth Uber échouée: ${err}`);
  }

  const data: any = await res.json();
  return data.access_token;
}

export async function createUberDelivery(order: DeliveryOrder) {
  const token = await getUberToken();
  const customerId = process.env.UBER_CUSTOMER_ID;

  const deliveryDateTime = parisTimeToUtc(order.date, order.heure);
  const pickupDateTime = new Date(deliveryDateTime.getTime() - 30 * 60 * 1000);

  const dropoffAddress = `${order.adresse}, ${order.codePostal} ${order.ville}, France`;

  const manifestItems = order.items.map((item) => ({
    name: item.name,
    quantity: item.qty,
    size: "small",
    price: Math.round(parseFloat(item.price.replace("€", "").replace(",", ".")) * 100),
  }));

  const payload = {
    pickup_address: PICKUP_ADDRESS,
    pickup_name: "Breakfast Time",
    pickup_phone_number: UBER_PICKUP_PHONE,
    pickup_ready_dt: pickupDateTime.toISOString(),
    pickup_deadline_dt: deliveryDateTime.toISOString(),
    dropoff_address: dropoffAddress,
    dropoff_name: `${order.prenom} ${order.nom}`,
    dropoff_phone_number: order.telephone,
    dropoff_notes: order.note || "",
    dropoff_ready_dt: deliveryDateTime.toISOString(),
    dropoff_deadline_dt: new Date(deliveryDateTime.getTime() + 30 * 60 * 1000).toISOString(),
    manifest_total_value: Math.round(order.total * 100),
    manifest_items: manifestItems,
  };

  const res = await fetch(`${UBER_API_BASE}/${customerId}/deliveries`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  const data: any = await res.json();
  if (!res.ok) throw new Error(data.message || JSON.stringify(data));

  return {
    delivery_id: data.id as string,
    tracking_url: data.tracking_url as string,
    status: data.status as string,
  };
}

export async function getUberDeliveryStatus(deliveryId: string) {
  const token = await getUberToken();
  const customerId = process.env.UBER_CUSTOMER_ID;
  const res = await fetch(`${UBER_API_BASE}/${customerId}/deliveries/${deliveryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data: any = await res.json();
  if (!res.ok) throw new Error(data.message || JSON.stringify(data));
  return data;
}

export async function cancelUberDelivery(deliveryId: string) {
  const token = await getUberToken();
  const customerId = process.env.UBER_CUSTOMER_ID;
  await fetch(`${UBER_API_BASE}/${customerId}/deliveries/${deliveryId}/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
}

export async function getStuartToken(): Promise<string> {
  const clientId = process.env.STUART_CLIENT_ID!;
  const clientSecret = process.env.STUART_CLIENT_SECRET!;
  const credentials = btoa(`${clientId}:${clientSecret}`);

  const res = await fetch(STUART_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Auth Stuart échouée: ${err}`);
  }

  const data: any = await res.json();
  return data.access_token;
}

export async function createStuartDelivery(order: DeliveryOrder) {
  const token = await getStuartToken();
  const dropoffAddress = `${order.adresse}, ${order.codePostal} ${order.ville}, France`;

  const deliveryTime = parisTimeToUtc(order.date, order.heure);

  const isMaintenant = order.isMaintenant === true;
  const pickupTime = isMaintenant
    ? new Date(Date.now() + 15 * 60000)
    : new Date(deliveryTime.getTime() - 40 * 60000);

  const payload = {
    job: {
      pickups: [
        {
          address: PICKUP_ADDRESS,
          comment: "Commande Breakfast Time — prête pour récupération",
          pickup_at: pickupTime.toISOString(),
          contact: { firstname: "Breakfast", lastname: "Time", phone: STUART_PICKUP_PHONE },
        },
      ],
      dropoffs: [
        {
          address: dropoffAddress,
          comment: order.note || "",
          contact: { firstname: order.prenom, lastname: order.nom, phone: order.telephone },
          package_type: "small",
          package_description: `Commande Breakfast Time — ${order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}`,
        },
      ],
    },
  };

  const res = await fetch(`${STUART_API_BASE}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  const data: any = await res.json();
  if (!res.ok) throw new Error(data.message || JSON.stringify(data));

  return {
    job_id: data.id as string,
    tracking_url: (data.deliveries?.[0]?.tracking_url as string) || "",
    status: data.status as string,
  };
}
