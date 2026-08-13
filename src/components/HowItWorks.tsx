import { ClipboardList, ShoppingBag, Truck, MapPin, Clock, Calendar, Search, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLangPath } from "@/hooks/useLangPath";

const HowItWorks = () => {
  const { t } = useTranslation();
  const { lp } = useLangPath();
  const navigate = useNavigate();

  const steps = [
    { icon: ClipboardList, title: t("howItWorks.step1Title"), desc: t("howItWorks.step1Desc") },
    { icon: ShoppingBag,   title: t("howItWorks.step2Title"), desc: t("howItWorks.step2Desc") },
    { icon: Truck,         title: t("howItWorks.step3Title"), desc: t("howItWorks.step3Desc") },
  ];

  const infos = [
    { icon: MapPin,   label: t("delivery.infoZoneLabel"),  value: t("delivery.infoZoneValue") },
    { icon: Clock,    label: t("delivery.infoHoursLabel"), value: t("delivery.infoHoursValue") },
    { icon: Calendar, label: t("delivery.infoDaysLabel"),  value: t("delivery.infoDaysValue") },
  ];

  const [address, setAddress] = useState("");
  const [result, setResult] = useState<"ok" | "ko" | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ description: string; place_id: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timer = useRef<any>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    setResult(null);
    if (timer.current) clearTimeout(timer.current);
    if (value.length > 3) {
      timer.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/autocomplete-address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: value }),
          });
          const data = await res.json();
          setSuggestions(data.predictions || []);
          setShowSuggestions(true);
        } catch { /* ignore */ }
      }, 400);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const checkAddress = async (addr: string) => {
    setLoading(true);
    setResult(null);
    setShowSuggestions(false);
    setSuggestions([]);
    try {
      const res = await fetch("/api/get-delivery-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addr }),
      });
      const data = await res.json();
      setResult(data.deliverable ? "ok" : "ko");
    } catch {
      setResult("ko");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="how" className="section-padding bg-card">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t("howItWorks.label")}</p>
          <h2 className="section-title mb-4">{t("howItWorks.title")}</h2>
          <p className="section-subtitle">{t("howItWorks.subtitle")}</p>
        </div>

        <div className="mt-14 grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-14 items-start">
          {/* Étapes en timeline */}
          <div className="relative">
            <span
              aria-hidden
              className="absolute left-7 top-8 bottom-8 w-px bg-gradient-to-b from-primary/40 via-border to-transparent hidden sm:block"
            />
            <ol className="space-y-6">
              {steps.map((s, i) => (
                <li
                  key={i}
                  className="relative flex gap-5 items-start rounded-2xl bg-background border border-border/70 p-5 sm:p-6 hover-lift group"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center transition-colors duration-300 group-hover:bg-primary">
                      <s.icon className="w-6 h-6 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                    </div>
                    <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-[11px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold mb-1.5">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Carte livraison */}
          <div id="delivery" className="scroll-mt-24 rounded-3xl bg-secondary p-6 sm:p-8 border border-border/60" style={{ boxShadow: "var(--card-shadow)" }}>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <p className="text-primary text-xs font-semibold tracking-widest uppercase">{t("delivery.label")}</p>
            </div>
            <h3 className="font-display text-2xl font-semibold mb-2">{t("delivery.cardTitle")}</h3>
            <p className="text-sm text-muted-foreground mb-5">{t("delivery.cardSubtitle")}</p>

            <div className="relative">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={address}
                    onChange={handleInput}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder={t("delivery.placeholder")}
                    autoComplete="off"
                    aria-label={t("delivery.cardTitle")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition text-sm"
                  />
                </div>
                <button
                  onClick={() => address && checkAddress(address)}
                  disabled={loading || !address}
                  className="px-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap inline-flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? t("delivery.checking") : t("delivery.checkBtn")}
                </button>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full bg-card border border-border rounded-xl shadow-lg mt-2 overflow-hidden text-left">
                  {suggestions.map((s) => (
                    <button
                      key={s.place_id}
                      type="button"
                      onMouseDown={() => {
                        setAddress(s.description);
                        setShowSuggestions(false);
                        checkAddress(s.description);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors border-b border-border last:border-0 flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="truncate">{s.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {result === "ok" && (
              <div className="mt-4 flex items-start gap-2 text-sm font-medium rounded-xl py-3 px-4 bg-primary/10 text-primary">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{t("delivery.resultOkText")}</span>
              </div>
            )}
            {result === "ko" && (
              <div className="mt-4 flex items-start gap-2 text-sm font-medium rounded-xl py-3 px-4 bg-destructive/10 text-destructive">
                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {t("delivery.resultKoText")}{" "}
                  <button onClick={() => navigate(lp("/contact"))} className="underline hover:opacity-80">
                    {t("delivery.resultKoLink")}
                  </button>{" "}
                  {t("delivery.resultKoSuffix")}
                </span>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-border/70 grid grid-cols-3 gap-3">
              {infos.map((item, i) => (
                <div key={i} className="text-center">
                  <item.icon className="w-4 h-4 text-primary mx-auto mb-2" />
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">{item.label}</p>
                  <p className="font-display text-sm font-semibold leading-tight">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
