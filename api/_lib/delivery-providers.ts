const UBER_AUTH_URL = "https://login.uber.com/oauth/v2/token";
const UBER_API_BASE = "https://api.uber.com/v1/customers";

const PICKUP_ADDRESS = "371 chemin des Prés, 06410 Biot, France";
const PICKUP_PHONE = "+33626154730";

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

/**
 * Met un numéro français au format E.164 (+33XXXXXXXXX).
 *
 * Le formulaire accepte aussi bien "06 12 34 56 78" que "+33 6 12 34 56 78" :
 * la conversion se fait ici, au moment de sortir vers le transporteur, pour ne
 * jamais lui transmettre un format qu'il pourrait refuser.
 *
 * Un format non reconnu est renvoyé tel quel plutôt que transformé au hasard :
 * mieux vaut laisser le transporteur refuser qu'expédier un mauvais numéro.
 */
export function toE164Fr(raw: string | undefined | null): string {
  const compact = String(raw ?? "").replace(/[\s.\-() ]/g, "");
  if (!compact) return "";

  if (compact.startsWith("+")) return compact;
  if (compact.startsWith("00")) return `+${compact.slice(2)}`;
  if (/^0[1-9]\d{8}$/.test(compact)) return `+33${compact.slice(1)}`;
  if (/^[1-9]\d{8}$/.test(compact)) return `+33${compact}`;

  return compact;
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
  // Contrôle des formats avant conversion : parisTimeToUtc lève un
  // « Invalid time value » peu parlant si on lui passe autre chose.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(order.date ?? "") || !/^\d{2}:\d{2}$/.test(order.heure ?? "")) {
    throw new Error(
      `Créneau de livraison illisible (date="${order.date}", heure="${order.heure}") : livraison non créée.`
    );
  }

  // Uber Direct exige le format E.164 et rejette TOUTE la requête sinon
  // (« The parameters of your request were invalid »). Sans transporteur de
  // secours, un numéro mal formé signifie zéro livraison : on échoue avec un
  // message clair plutôt que de laisser passer l'erreur opaque d'Uber.
  const dropoffPhone = toE164Fr(order.telephone);
  if (!/^\+[1-9]\d{7,14}$/.test(dropoffPhone)) {
    throw new Error(
      `Téléphone client inexploitable ("${order.telephone}" → "${dropoffPhone}") : livraison non créée.`
    );
  }

  const deliveryDateTime = parisTimeToUtc(order.date, order.heure);

  // « Maintenant » n'a de sens que si le créneau demandé est effectivement
  // proche. Si le drapeau contredit le créneau choisi, c'est le créneau qui
  // fait foi : une commande programmée ne doit jamais partir immédiatement.
  const IMMEDIATE_WINDOW_MS = 90 * 60000;
  const askedImmediate = order.isMaintenant === true;
  const creneauIsNear = deliveryDateTime.getTime() - Date.now() <= IMMEDIATE_WINDOW_MS;
  const isMaintenant = askedImmediate && creneauIsNear;

  const pickupDateTime = isMaintenant
    ? new Date(Date.now() + 15 * 60000)
    : new Date(deliveryDateTime.getTime() - 30 * 60000);

  if (askedImmediate && !creneauIsNear) {
    console.warn(
      `Drapeau « maintenant » ignoré : le créneau ${order.date} ${order.heure} ` +
        `est trop lointain. Collecte programmée pour ${pickupDateTime.toISOString()}.`
    );
  }

  // Tracé systématique : permet de vérifier dans les logs Vercel ce qui a
  // réellement été demandé à Uber, sans avoir à reproduire la commande.
  console.log(
    JSON.stringify({
      tag: "uber_delivery",
      creneau_client: `${order.date} ${order.heure}`,
      isMaintenant_recu: askedImmediate,
      isMaintenant_applique: isMaintenant,
      pickup_ready_dt: pickupDateTime.toISOString(),
      livraison_attendue: deliveryDateTime.toISOString(),
    })
  );

  const token = await getUberToken();
  const customerId = process.env.UBER_CUSTOMER_ID;

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
    pickup_phone_number: PICKUP_PHONE,
    pickup_ready_dt: pickupDateTime.toISOString(),
    pickup_deadline_dt: deliveryDateTime.toISOString(),
    dropoff_address: dropoffAddress,
    dropoff_name: `${order.prenom} ${order.nom}`,
    dropoff_phone_number: dropoffPhone,
    dropoff_notes: order.note || "",
    dropoff_ready_dt: deliveryDateTime.toISOString(),
    dropoff_deadline_dt: new Date(deliveryDateTime.getTime() + 30 * 60000).toISOString(),
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
