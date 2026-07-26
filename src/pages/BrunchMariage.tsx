import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventBookingForm from "@/components/EventBookingForm";
import PhoneAppointmentForm from "@/components/PhoneAppointmentForm";
import { Sparkles, Phone, FileText, X, Check } from "lucide-react";
import brunchMariage from "@/assets/brunch-mariage.jpg";

const BrunchMariage = () => {
  const { t } = useTranslation();
  const [showAppointment, setShowAppointment] = useState(false);
  const [showDevis, setShowDevis] = useState(false);

  usePageMeta(t("brunchMariagePage.metaTitle"), t("brunchMariagePage.metaDesc"), "/brunch-mariage");

  const features = [
    t("eventsPage.mariageF1"),
    t("eventsPage.mariageF2"),
    t("eventsPage.mariageF3"),
    t("eventsPage.mariageF4"),
    t("eventsPage.mariageF5"),
  ];

  const faq = [
    { q: t("brunchMariagePage.faq1Q"), a: t("brunchMariagePage.faq1A") },
    { q: t("brunchMariagePage.faq2Q"), a: t("brunchMariagePage.faq2A") },
    { q: t("brunchMariagePage.faq3Q"), a: t("brunchMariagePage.faq3A") },
  ];

  // Schema JSON-LD : FAQPage (aide à l'affichage enrichi dans Google).
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-brunch-mariage-faq", "true");
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    return () => {
      document.head.querySelectorAll('script[data-brunch-mariage-faq="true"]').forEach((el) => el.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-16 px-6 text-center" style={{ backgroundColor: "#f4f1ea" }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ backgroundColor: "rgba(58,58,10,0.08)", color: "#5a5a1a" }}
          >
            <Sparkles size={12} />
            {t("brunchMariagePage.badge")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight" style={{ color: "#2a2a08" }}>
            {t("brunchMariagePage.h1")}{" "}
            <span className="italic" style={{ color: "#7a7020" }}>{t("brunchMariagePage.h1Italic")}</span>
          </h1>
          <p className="text-base leading-relaxed mb-8 max-w-xl mx-auto" style={{ color: "#5a5a40" }}>
            {t("brunchMariagePage.intro")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowDevis(true)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
            >
              <FileText size={16} />
              {t("eventsPage.quoteBtn")}
            </button>
            <button
              onClick={() => setShowAppointment(true)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border-2 transition-colors hover:bg-black/5"
              style={{ borderColor: "rgba(58,58,10,0.25)", color: "#3a3a0a" }}
            >
              <Phone size={16} />
              {t("eventsPage.callbackBtn")}
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative aspect-square rounded-3xl overflow-hidden" style={{ boxShadow: "0 30px 60px -12px rgba(0,0,0,0.15)" }}>
              <img src={brunchMariage} alt={t("brunchMariagePage.h1")} className="w-full h-full object-cover" loading="lazy" />
              <div
                className="absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md"
                style={{ backgroundColor: "rgba(223, 240, 87, 0.95)", color: "#3a3a0a" }}
              >
                {t("eventsPage.priceFrom", { price: t("eventsPage.mariagePrice") })}
              </div>
            </div>
            <div className="space-y-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">{t("brunchMariagePage.faqTitle")}</h2>
          <div className="space-y-6 mb-4">
            {faq.map((f, i) => (
              <div key={i}>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "#2a2a08" }}>{f.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="relative py-16 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(61, 45%, 20%) 0%, hsl(30, 10%, 8%) 100%)" }}
      >
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: "white" }}>
            {t("eventsPage.ctaTitle")}{" "}
            <span className="italic" style={{ color: "#DFF057" }}>{t("eventsPage.ctaTitleItalic")}</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.75)" }}>
            {t("eventsPage.ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowDevis(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
            >
              <FileText size={18} />
              {t("eventsPage.quoteBtn")}
            </button>
            <button
              onClick={() => setShowAppointment(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold border-2 transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}
            >
              <Phone size={18} />
              {t("eventsPage.callbackBtn")}
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal Prendre RDV */}
      {showAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={() => setShowAppointment(false)}
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full my-8 p-8 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowAppointment(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X size={20} />
            </button>
            <PhoneAppointmentForm onClose={() => setShowAppointment(false)} />
          </div>
        </div>
      )}

      {/* Modal Demander un devis */}
      {showDevis && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={() => setShowDevis(false)}
        >
          <div className="bg-white rounded-3xl max-w-3xl w-full my-8 p-8 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowDevis(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors z-10"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-3xl font-bold text-center mb-3">{t("eventsPage.quoteModalTitle")}</h2>
            <p className="text-center text-muted-foreground mb-8">{t("eventsPage.quoteModalSubtitle")}</p>
            <EventBookingForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default BrunchMariage;
