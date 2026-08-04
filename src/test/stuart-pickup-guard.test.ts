import { describe, it, expect, vi, afterEach } from "vitest";
import { createStuartDelivery } from "../../api/_lib/delivery-providers";

// Le 04/08/2026, une livraison prévue pour le lendemain 11h30 est partie chez
// Stuart pour une collecte le jour même. Ces tests vérifient l'heure de
// collecte réellement envoyée, et surtout qu'aucune commande légitime n'est
// bloquée : une commande payée ne doit jamais rester sans coursier.

type Commande = Parameters<typeof createStuartDelivery>[0];

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

/** Capture le pickup_at envoyé à l'API Stuart. */
function mockStuart() {
  const calls: any[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: any) => {
      if (String(url).includes("oauth/token")) {
        return { ok: true, json: async () => ({ access_token: "jeton-test" }) } as any;
      }
      calls.push(JSON.parse(init.body));
      return {
        ok: true,
        json: async () => ({ id: "job-test", deliveries: [{ tracking_url: "https://suivi" }] }),
      } as any;
    })
  );
  return {
    pickupAt: () => calls.at(-1)?.job.pickups[0].pickup_at,
    count: () => calls.length,
  };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("createStuartDelivery — heure de collecte", () => {
  it("programme la collecte 40 min avant un créneau du lendemain", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-04T20:41:00Z")); // la veille à 22h41 à Paris
    const stuart = mockStuart();

    await createStuartDelivery(commande());

    // 11h30 à Paris → collecte 10h50 à Paris → 08h50 UTC, le 5 août
    expect(stuart.pickupAt()).toBe("2026-08-05T08:50:00.000Z");
  });

  it("ignore le drapeau « maintenant » si le créneau est le lendemain", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-04T20:41:00Z"));
    const stuart = mockStuart();

    // Exactement le scénario redouté : drapeau immédiat sur une commande du lendemain
    await createStuartDelivery(commande({ isMaintenant: true }));

    expect(stuart.pickupAt()).toBe("2026-08-05T08:50:00.000Z");
    expect(stuart.pickupAt()).not.toBe("2026-08-04T20:56:00.000Z");
  });

  it("respecte « maintenant » quand le créneau est bien proche", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-05T08:00:00Z")); // 10h00 à Paris
    const stuart = mockStuart();

    // Créneau à 10h45 heure de Paris, soit dans 45 min
    await createStuartDelivery(commande({ heure: "10:45", isMaintenant: true }));

    expect(stuart.pickupAt()).toBe("2026-08-05T08:15:00.000Z"); // now + 15 min
  });

  it("ne bloque pas une commande du jour au créneau minimum", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-05T08:00:00Z")); // 10h00 à Paris
    const stuart = mockStuart();

    // Créneau à 10h45 sans drapeau : la collecte tombe 5 min après maintenant.
    // C'est serré mais légitime — la course doit partir.
    await createStuartDelivery(commande({ heure: "10:45" }));

    expect(stuart.count()).toBe(1);
    expect(stuart.pickupAt()).toBe("2026-08-05T08:05:00.000Z");
  });

  it("refuse un créneau illisible plutôt que d'envoyer une date invalide", async () => {
    const stuart = mockStuart();

    await expect(createStuartDelivery(commande({ date: "", heure: "" }))).rejects.toThrow(
      /Créneau de livraison illisible/
    );
    expect(stuart.count()).toBe(0);
  });
});
