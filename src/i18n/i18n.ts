import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

// Détermine la langue uniquement à partir du préfixe d'URL (/en/...) — jamais
// depuis le navigateur ou un stockage persistant, pour que "/" soit toujours FR
// même si l'utilisateur a déjà visité une page /en auparavant.
const getInitialLanguage = (): "fr" | "en" => {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/en")) {
    return "en";
  }
  return "fr";
};

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: getInitialLanguage(),
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

// Set initial html lang immediately
if (typeof window !== "undefined") {
  document.documentElement.lang = getInitialLanguage();
}

i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    document.documentElement.lang = lng;
  }
});

export default i18n;
