// Suivi des conversions Google Ads.
// Label restant à récupérer : Outils > Conversions > "purchase" > Paramètres de la balise.
export const GOOGLE_ADS_ID = "AW-18374067488";
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
