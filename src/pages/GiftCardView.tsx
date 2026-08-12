import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GiftCardPreview from "@/components/GiftCardPreview";
import { usePageMeta } from "@/hooks/usePageMeta";

const GiftCardView = () => {
  usePageMeta("Votre carte cadeau | Breakfast Time", "Découvrez votre carte cadeau Breakfast Time.", undefined, true);

  const [params] = useSearchParams();
  const [previewTab, setPreviewTab] = useState<"recto" | "verso">("verso");

  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const message = params.get("message") ?? "";
  const code = params.get("code") ?? "";
  const expiresAt = params.get("expiresAt") ?? "";
  const amount = params.get("amount") ?? undefined;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-16 px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Carte Cadeau</p>
            <h1 className="font-display text-3xl font-bold mb-3">Votre cadeau Breakfast Time</h1>
          </div>

          <div className="flex justify-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setPreviewTab("recto")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
                previewTab === "recto" ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-foreground hover:border-primary"
              }`}
            >
              Recto
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab("verso")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
                previewTab === "verso" ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-foreground hover:border-primary"
              }`}
            >
              Verso
            </button>
          </div>

          <div className={previewTab === "recto" ? "" : "hidden"}>
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1748 / 1240", boxShadow: "var(--card-shadow)" }}>
              <img src="/carte-cadeau-recto.png" alt="Recto de la carte cadeau" className="absolute inset-0 w-full h-full object-contain" />
            </div>
          </div>

          <div className={previewTab === "verso" ? "" : "hidden"}>
            <GiftCardPreview from={from} to={to} message={message} code={code} expiresAt={expiresAt} amount={amount} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default GiftCardView;
