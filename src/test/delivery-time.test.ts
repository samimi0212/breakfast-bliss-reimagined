import { describe, it, expect } from "vitest";
import { parisTimeToUtc } from "../../api/_lib/delivery-providers";

// Les créneaux saisis par le client sont toujours des heures de Paris.
// Les fonctions serverless tournent en UTC sur Vercel Edge : sans conversion
// explicite, un créneau de 11h00 était envoyé aux livreurs pour 13h00.
describe("parisTimeToUtc", () => {
  it("convertit un créneau d'été (CEST, UTC+2)", () => {
    expect(parisTimeToUtc("2026-08-05", "11:00").toISOString()).toBe(
      "2026-08-05T09:00:00.000Z"
    );
  });

  it("convertit un créneau d'hiver (CET, UTC+1)", () => {
    expect(parisTimeToUtc("2026-01-15", "11:00").toISOString()).toBe(
      "2026-01-15T10:00:00.000Z"
    );
  });

  it("gère le passage à l'heure d'été", () => {
    // 29/03/2026 : 2h00 devient 3h00, on bascule en UTC+2
    expect(parisTimeToUtc("2026-03-29", "04:00").toISOString()).toBe(
      "2026-03-29T02:00:00.000Z"
    );
  });

  it("gère le passage à l'heure d'hiver", () => {
    // 25/10/2026 : 3h00 redevient 2h00, on bascule en UTC+1
    expect(parisTimeToUtc("2026-10-25", "04:00").toISOString()).toBe(
      "2026-10-25T03:00:00.000Z"
    );
  });

  it("place le pickup Stuart 40 min avant la livraison", () => {
    const livraison = parisTimeToUtc("2026-08-05", "11:00");
    const pickup = new Date(livraison.getTime() - 40 * 60000);
    // 11h00 à Paris → pickup à 10h20 à Paris → 08h20 UTC
    expect(pickup.toISOString()).toBe("2026-08-05T08:20:00.000Z");
  });

  it("place le pickup Uber 30 min avant la livraison", () => {
    const livraison = parisTimeToUtc("2026-08-05", "11:00");
    const pickup = new Date(livraison.getTime() - 30 * 60000);
    expect(pickup.toISOString()).toBe("2026-08-05T08:30:00.000Z");
  });

  it("ne réintroduit pas le décalage de l'ancienne implémentation", () => {
    // L'ancien code produisait 11:00Z pour un créneau de 11h00 heure de Paris
    expect(parisTimeToUtc("2026-08-05", "11:00").toISOString()).not.toBe(
      "2026-08-05T11:00:00.000Z"
    );
  });
});
