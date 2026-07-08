import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLangPath } from "@/hooks/useLangPath";
import { usePageMeta } from "@/hooks/usePageMeta";
import { allProducts } from "@/data/products";
import { ALLERGENS, PRODUCT_ALLERGENS } from "@/data/allergens";

const AllergenesPage = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { lp } = useLangPath();
  const isEn = i18n.language === "en";

  usePageMeta(
    isEn ? "Allergens | Breakfast Time" : "Allergènes | Breakfast Time",
    isEn
      ? "Allergen information for every Breakfast Time product."
      : "Informations allergènes pour tous les produits Breakfast Time.",
    "/allergenes"
  );

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">{isEn ? "Back" : "Retour"}</span>
        </button>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
          {isEn ? "Allergens" : "Tableau des allergènes"}
        </h1>

        <div className="flex flex-wrap gap-2 mb-12 bg-muted rounded-2xl p-5">
          {Object.entries(ALLERGENS).map(([code, a]) => (
            <span
              key={code}
              className="inline-flex items-center gap-1.5 text-xs bg-white text-foreground px-3 py-1.5 rounded-full font-medium border border-border"
            >
              <span>{a.icon}</span>
              {isEn ? a.en : a.fr}
            </span>
          ))}
        </div>

        {categories.map((category) => {
          const products = allProducts.filter((p) => p.category === category);
          const hasQuote = products.every((p) => p.price === "Sur devis");
          return (
            <section key={category} className="mb-12">
              <h2 className="font-display text-xl font-semibold mb-4 pb-2 border-b border-border">
                {category}
              </h2>

              {hasQuote ? (
                <p className="text-sm text-muted-foreground italic">
                  {isEn
                    ? "Custom quote-based offers — allergens depend on the products selected in the final menu."
                    : "Prestations sur devis — les allergènes dépendent des produits choisis dans le menu final."}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse min-w-[560px]">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="py-2 pr-4 font-semibold">{isEn ? "Product" : "Produit"}</th>
                        <th className="py-2 font-semibold">{isEn ? "Allergens" : "Allergènes"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => {
                        const codes = PRODUCT_ALLERGENS[p.id];
                        const name = isEn ? p.name_en || p.name : p.name;
                        return (
                          <tr key={p.id} className="border-t border-border">
                            <td className="py-3 pr-4 font-medium whitespace-nowrap">{name}</td>
                            <td className="py-3">
                              {codes && codes.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {codes.map((code) => (
                                    <span
                                      key={code}
                                      className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium"
                                    >
                                      <span>{ALLERGENS[code].icon}</span>
                                      {isEn ? ALLERGENS[code].en : ALLERGENS[code].fr}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground italic text-xs">
                                  {isEn ? "None" : "Aucun"}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
};

export default AllergenesPage;
