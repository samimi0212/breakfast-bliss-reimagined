import { describe, it, expect, vi, afterEach } from "vitest";
import { createUberDelivery } from "../../api/_lib/delivery-providers";

// Uber Direct est le transporteur unique : il n'y a plus de secours. Deux
// choses doivent donc être blindées — le téléphone doit être en E.164, sinon
// Uber rejette toute la requête et aucune livraison n'est créée ; et une
// commande programmée ne doit jamais partir en collecte immédiate.

type Commande = Parameters<typeof createUberDelivery>[0];

const commande = (over: Partial<Commande> = {}): Commande => ({
  prenom: "Test",
  nom: "Client",
  telephone: "0612345678",
  adresse: "1544 Avenue Jules Grec",
  ville: "Antibes",
  codePostal: "06600",
  date: "2026-08-05",
  heure: "11:30",
  items: [{ name: "Bagel saumon", qty: 1, price: "9,50€" }],
  total: 9.5,
  ...over,
});

/** Capture le corps envoyé à l'API Uber. */
function mockUber() {
  const calls: any[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: any) => {
      if (String(url).includes("oauth")) {
        return { ok: true, json: async () => ({ access_token: "jeton-test" }) } as any;
      }
      calls.push(JSON.parse(init.body));
      return {
        ok: true,
        json: async () => ({ id: "del-test", tracking_url: "https://suivi", status: "pending" }),
      } as any;
    })
  );
  return {
    body: () => calls.at(-1),
    count: () => calls.length,
  };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("createUberDelivery — téléphone", () => {
  it("convertit un 06 en E.164 avant l'envoi", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-04T20:41:00Z"));
    const uber = mockUber();

    await createUberDelivery(commande({ telephone: "06 12 34 56 78" }));

    // C'est exactement ce qui faisait échouer la commande du 04/08/2026
    expect(uber.body().dropoff_phone_number).toBe("+33612345678");
  });

  it("refuse un téléphone inexploitable avec un message clair", async () => {
    const uber = mockUber();

    await expect(createUberDelivery(commande({ telephone: "12345" }))).rejects.toThrow(
      /Téléphone client inexploitable/
    );
    expect(uber.count()).toBe(0);
  });
});

describe("createUberDelivery — heure de collecte", () => {
  it("programme la collecte 30 min avant un créneau du lendemain", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-04T20:41:00Z")); // la veille à 22h41 à Paris
    const uber = mockUber();

    await createUberDelivery(commande());

    // 11h30 à Paris → collecte 11h00 à Paris → 09h00 UTC, le 5 août
    expect(uber.body().pickup_ready_dt).toBe("2026-08-05T09:00:00.000Z");
    expect(uber.body().dropoff_ready_dt).toBe("2026-08-05T09:30:00.000Z");
  });

  it("ignore le drapeau « maintenant » si le créneau est le lendemain", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-04T20:41:00Z"));
    const uber = mockUber();

    await createUberDelivery(commande({ isMaintenant: true }));

    expect(uber.body().pickup_ready_dt).toBe("2026-08-05T09:00:00.000Z");
  });

  it("respecte « maintenant » quand le créneau est bien proche", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-05T08:00:00Z")); // 10h00 à Paris
    const uber = mockUber();

    await createUberDelivery(commande({ heure: "10:45", isMaintenant: true }));

    expect(uber.body().pickup_ready_dt).toBe("2026-08-05T08:15:00.000Z"); // now + 15 min
  });

  it("ne bloque pas une commande du jour au créneau minimum", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-05T08:00:00Z")); // 10h00 à Paris
    const uber = mockUber();

    await createUberDelivery(commande({ heure: "10:45" }));

    expect(uber.count()).toBe(1);
    expect(uber.body().pickup_ready_dt).toBe("2026-08-05T08:15:00.000Z");
  });

  it("refuse un créneau illisible plutôt que d'envoyer une date invalide", async () => {
    const uber = mockUber();

    await expect(createUberDelivery(commande({ date: "", heure: "" }))).rejects.toThrow(
      /Créneau de livraison illisible/
    );
    expect(uber.count()).toBe(0);
  });
});
