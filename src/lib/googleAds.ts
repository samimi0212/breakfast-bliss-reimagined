// Suivi des conversions Google Ads.
// À compléter une fois le compte Google Ads créé : Outils > Conversions > "Achat"
// → Google fournit un ID (AW-XXXXXXXXX) et un label de conversion.
export const GOOGLE_ADS_ID = "AW-XXXXXXXXX";
export const GOOGLE_ADS_PURCHASE_LABEL = "XXXXXXXXXX";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const isConfigured = () =>
  !GOOGLE_ADS_ID.includes("XXXXXXXXX") && !GOOGLE_ADS_PURCHASE_LABEL.includes("XXXXXXXXXX");

export function trackPurchaseConversion(params: { value: number; transactionId: string }) {
  if (typeof window === "undefined" || typeof window.gtag !== "function" || !isConfigured()) return;
  window.gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PURCHASE_LABEL}`,
    value: params.value,
    currency: "EUR",
    transaction_id: params.transactionId,
  });
}
