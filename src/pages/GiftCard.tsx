import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GiftCardPreview from "@/components/GiftCardPreview";
import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const generateTestCode = () => {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${seg()}-${seg()}-${seg()}`;
};

const AMOUNTS = [25, 40, 60];

const GiftCard = () => {
  const { t, i18n } = useTranslation();
  usePageMeta("Carte Cadeau | Breakfast Time", "Offrez un brunch Breakfast Time : carte cadeau originale pour toutes les occasions.", "/carte-cadeau");

  const previewExpiresAt = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString(i18n.language === "en" ? "en-GB" : "fr-FR");
  })();

  const [amount, setAmount] = useState<number | "custom">(40);
  const [customAmount, setCustomAmount] = useState("");
  const [showAmount, setShowAmount] = useState(false);
  const [sendToSelf, setSendToSelf] = useState(false);
  const [form, setForm] = useState({ from: "", to: "", message: "", recipientEmail: "", yourEmail: "" });
  const [error, setError] = useState("");
  const [previewCode, setPreviewCode] = useState("XXXX-XXXX-XXXX");
  const [previewTab, setPreviewTab] = useState<"recto" | "verso">("verso");
  const [testStatus, setTestStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const previewRef = useRef<HTMLDivElement>(null);

  const finalAmount = amount === "custom" ? Number(customAmount) : amount;
  const previewAmount = finalAmount > 0 ? `${finalAmount}€` : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!finalAmount || finalAmount <= 0) {
      setError(t("giftCard.errorAmount"));
      return;
    }
    if (!form.from || !form.to || (sendToSelf ? !form.yourEmail : !form.recipientEmail)) {
      setError(t("giftCard.errorRequired"));
      return;
    }
    setError("");
    // TODO: paiement Stripe + génération du code carte cadeau
  };

  // Envoi de test (sans paiement) — pour valider le rendu du PDF reçu par email
  const handleTestSend = async () => {
    const testEmail = sendToSelf ? form.yourEmail : form.recipientEmail;
    if (!finalAmount || finalAmount <= 0) {
      setError(t("giftCard.errorAmount"));
      return;
    }
    if (!form.from || !form.to || !testEmail) {
      setError(t("giftCard.errorRequired"));
      return;
    }
    setError("");
    setTestStatus("sending");

    const code = generateTestCode();
    setPreviewCode(code);
    setPreviewTab("verso");
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      if (!previewRef.current) throw new Error("preview not ready");
      const dataUrl = await Promise.race([
        toPng(previewRef.current, { pixelRatio: 2, skipFonts: true, cacheBust: true }),
        new Promise<string>((_, reject) => setTimeout(() => reject(new Error("capture timeout")), 15000)),
      ]);

      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1748, 1240] });
      pdf.addImage(dataUrl, "PNG", 0, 0, 1748, 1240);
      const pdfBase64 = pdf.output("datauristring").split(",")[1];

      const res = await fetch("/api/send-gift-card-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: testEmail,
          cardFrom: form.from,
          cardTo: form.to,
          message: form.message,
          amount: showAmount ? previewAmount : null,
          code,
          expiresAt: previewExpiresAt,
          pdfBase64,
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setTestStatus("sent");
    } catch (e) {
      console.error(e);
      setTestStatus("error");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground placeholder:text-sm placeholder:italic focus:outline-none focus:border-primary transition";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t("giftCard.label")}</p>
            <h1 className="font-display text-3xl font-bold mb-3">{t("giftCard.title")}</h1>
            <p className="text-muted-foreground">{t("giftCard.subtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="bg-white rounded-2xl p-8 space-y-6" style={{ boxShadow: "var(--card-shadow)" }}>
              <div>
                <label className="block text-sm font-medium mb-2">{t("giftCard.amountLabel")}</label>
                <div className="flex flex-wrap gap-2">
                  {AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAmount(a)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                        amount === a ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {a}€
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount("custom")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                      amount === "custom" ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {t("giftCard.amountCustom")}
                  </button>
                </div>
                {amount === "custom" && (
                  <input
                    type="number"
                    min={1}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={t("giftCard.amountCustomPlaceholder")}
                    className={`${inputClass} mt-3`}
                  />
                )}
                <label className="flex items-center gap-2 text-sm cursor-pointer mt-3">
                  <input type="checkbox" checked={showAmount} onChange={(e) => setShowAmount(e.target.checked)} className="w-4 h-4 accent-primary" />
                  {t("giftCard.showAmountOnCard")}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">{t("giftCard.fromLabel")} <span className="text-red-400">*</span></label>
                <input name="from" value={form.from} onChange={handleChange} placeholder={t("giftCard.fromPlaceholder")} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">{t("giftCard.toLabel")} <span className="text-red-400">*</span></label>
                <input name="to" value={form.to} onChange={handleChange} placeholder={t("giftCard.toPlaceholder")} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">{t("giftCard.messageLabel")}</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder={t("giftCard.messagePlaceholder")} rows={3} className={`${inputClass} resize-none`} />
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={sendToSelf} onChange={(e) => setSendToSelf(e.target.checked)} className="w-4 h-4 accent-primary" />
                {t("giftCard.sendToSelf")}
              </label>

              {sendToSelf ? (
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t("giftCard.yourEmailLabel")}</label>
                  <input name="yourEmail" type="email" value={form.yourEmail} onChange={handleChange} placeholder={t("giftCard.yourEmailPlaceholder")} className={inputClass} />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t("giftCard.recipientEmailLabel")}</label>
                  <input name="recipientEmail" type="email" value={form.recipientEmail} onChange={handleChange} placeholder={t("giftCard.recipientEmailPlaceholder")} className={inputClass} />
                  <p className="italic text-xs text-muted-foreground mt-1">{t("giftCard.recipientEmailNote")}</p>
                </div>
              )}

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                onClick={handleSubmit}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                {t("giftCard.submit")}
              </button>

              <p className="text-xs text-muted-foreground text-center">{t("giftCard.validityNote")}</p>

              <div className="border-t border-border pt-4 space-y-2">
                <p className="text-xs text-muted-foreground text-center">Test interne — sans paiement</p>
                <button
                  type="button"
                  onClick={handleTestSend}
                  disabled={testStatus === "sending"}
                  className="w-full border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-60"
                >
                  {testStatus === "sending" ? "Envoi en cours..." : "Test : recevoir la carte par email"}
                </button>
                {testStatus === "sent" && <p className="text-green-600 text-sm text-center">Email envoyé</p>}
                {testStatus === "error" && <p className="text-red-400 text-sm text-center">Échec de l'envoi, réessaie.</p>}
              </div>
            </div>

            <div className="lg:sticky lg:top-32">
              <p className="text-sm font-medium text-muted-foreground mb-3 text-center">{t("giftCard.previewLabel")}</p>

              <div className="flex justify-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setPreviewTab("recto")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
                    previewTab === "recto" ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-foreground hover:border-primary"
                  }`}
                >
                  {t("giftCard.previewRecto")}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("verso")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
                    previewTab === "verso" ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-foreground hover:border-primary"
                  }`}
                >
                  {t("giftCard.previewVerso")}
                </button>
              </div>

              <div className={previewTab === "recto" ? "" : "hidden"}>
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1748 / 1240", boxShadow: "var(--card-shadow)" }}>
                  <img src="/carte-cadeau-recto.png" alt="Aperçu du recto de la carte cadeau" className="absolute inset-0 w-full h-full object-contain" />
                </div>
              </div>

              <div className={previewTab === "verso" ? "" : "hidden"} ref={previewRef}>
                <GiftCardPreview
                  from={form.from}
                  to={form.to}
                  message={form.message}
                  code={previewCode}
                  expiresAt={previewExpiresAt}
                  amount={showAmount ? previewAmount : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default GiftCard;
