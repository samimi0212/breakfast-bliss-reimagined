import { describe, it, expect } from "vitest";
import { toE164Fr } from "../../api/_lib/delivery-providers";

// Le formulaire accepte "06…" comme "+33 6…". Les transporteurs, eux, peuvent
// refuser une requête dont le téléphone n'est pas en E.164 : la conversion se
// fait donc systématiquement avant l'envoi.
describe("toE164Fr", () => {
  it("convertit un 06 français", () => {
    expect(toE164Fr("0612345678")).toBe("+33612345678");
  });

  it("ignore les espaces, points et tirets", () => {
    expect(toE164Fr("06 12 34 56 78")).toBe("+33612345678");
    expect(toE164Fr("06.12.34.56.78")).toBe("+33612345678");
    expect(toE164Fr("06-12-34-56-78")).toBe("+33612345678");
  });

  it("laisse intact un numéro déjà en E.164", () => {
    expect(toE164Fr("+33612345678")).toBe("+33612345678");
    expect(toE164Fr("+33 6 12 34 56 78")).toBe("+33612345678");
  });

  it("convertit la forme internationale 0033", () => {
    expect(toE164Fr("0033612345678")).toBe("+33612345678");
  });

  it("accepte un fixe français", () => {
    expect(toE164Fr("0493123456")).toBe("+33493123456");
  });

  it("complète un numéro à 9 chiffres sans le 0 initial", () => {
    expect(toE164Fr("612345678")).toBe("+33612345678");
  });

  it("préserve un numéro étranger déjà préfixé", () => {
    expect(toE164Fr("+41791234567")).toBe("+41791234567");
  });

  it("renvoie une chaîne vide si rien n'est saisi", () => {
    expect(toE164Fr("")).toBe("");
    expect(toE164Fr(undefined)).toBe("");
    expect(toE164Fr(null)).toBe("");
  });

  it("n'invente rien sur un format non reconnu", () => {
    expect(toE164Fr("12345")).toBe("12345");
  });
});
