import { useState } from "react";

// ---- DONNÉES ----

const menus = [
  {
    name: "Menu Brunch",
    price: "29,00€",
    desc: "Le brunch complet pour bien commencer la journée",
    img: "https://static.wixstatic.com/media/21c6e4_137b677c57ed4588b83a5cd2f9c99169~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_137b677c57ed4588b83a5cd2f9c99169~mv2.png",
  },
  {
    name: "Menu Famille",
    price: "49,00€",
    desc: "Un petit-déjeuner généreux pour toute la famille",
    img: "https://static.wixstatic.com/media/21c6e4_a4aec83b7dd54ab48764a13c365dab08~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_a4aec83b7dd54ab48764a13c365dab08~mv2.jpg",
  },
  {
    name: "Birthday Box",
    price: "45,00€",
    desc: "Offrez un menu anniversaire à personnaliser",
    img: "https://static.wixstatic.com/media/21c6e4_b9896374a7884f76b153e6af574a0bdd~mv2.png/v1/fill/w_980,h_1386,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_b9896374a7884f76b153e6af574a0bdd~mv2.png",
  },
];

const produits: Record<string, { name: string; price: string; img: string }[]> = {
  Viennoiseries: [
    {
      name: "Croissant",
      price: "1,50€",
      img: "https://static.wixstatic.com/media/21c6e4_d396d1aefd3347a494342e2e3100c9d7~mv2.jpeg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_d396d1aefd3347a494342e2e3100c9d7~mv2.jpeg",
    },
    {
      name: "Pain aux raisins",
      price: "1,80€",
      img: "https://static.wixstatic.com/media/21c6e4_321718d0c9b547fba1bc9e630d0d6db5~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_321718d0c9b547fba1bc9e630d0d6db5~mv2.png",
    },
    {
      name: "Suisse",
      price: "1,70€",
      img: "https://static.wixstatic.com/media/21c6e4_84d87e8f2b6c494a94518f55cba0b872~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_84d87e8f2b6c494a94518f55cba0b872~mv2.png",
    },
    {
      name: "Mini viennoiseries",
      price: "3,90€",
      img: "https://static.wixstatic.com/media/21c6e4_27396356b6cf494c807a4627f27d7d9a~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_27396356b6cf494c807a4627f27d7d9a~mv2.jpg",
    },
    {
      name: "Brioche",
      price: "8,50€",
      img: "https://static.wixstatic.com/media/21c6e4_71ad92708a6a4bd68b0233b9842753ac~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_71ad92708a6a4bd68b0233b9842753ac~mv2.png",
    },
  ],
  Pains: [],
  "Le Salé": [],
  "Le Sucré": [],
  Boissons: [],
  "À Partager": [],
};

const categories = Object.keys(produits);

// ---- COMPOSANT CARTE ----
const CardItem = ({ name, price, img, desc }: { name: string; price: string; img: string; desc?: string }) => (
  <div className="bg-card rounded-2xl overflow-hidden hover-lift group" style={{ boxShadow: "var(--card-shadow)" }}>
    <div className="relative overflow-hidden aspect-square">
      <img
        src={img}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-lg font-semibold">{name}</h3>
        <span className="text-primary font-bold text-lg">{price}</span>
      </div>
      {desc && <p className="text-muted-foreground text-sm mb-3">{desc}</p>}
      <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
        Ajouter au panier
      </button>
    </div>
  </div>
);

// ---- SECTION MENU ----
const MenuSection = () => {
  const [tab, setTab] = useState<"menus" | "carte">("menus");
  const [catActive, setCatActive] = useState("Viennoiseries");

  return (
    <section id="menu" className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Titre */}
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Nos produits</p>
          <h2 className="section-title mb-4">La Carte</h2>
          <p className="section-subtitle mx-auto">
            Des produits frais, locaux et préparés le matin même pour commencer la journée en beauté.
          </p>
        </div>

        {/* Onglets principaux */}
        <div className="flex justify-center mb-10">
          <div className="bg-muted rounded-2xl p-1.5 flex gap-2">
            <button
              onClick={() => setTab("menus")}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                tab === "menus"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Nos Menus
            </button>
            <button
              onClick={() => setTab("carte")}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                tab === "carte"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Produits à la Carte
            </button>
          </div>
        </div>

        {/* Nos Menus */}
        {tab === "menus" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {menus.map((item, i) => (
              <CardItem key={i} {...item} />
            ))}
          </div>
        )}

        {/* Produits à la Carte */}
        {tab === "carte" && (
          <>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatActive(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    catActive === cat
                      ? "bg-primary text-primary-foreground"
                      : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {produits[catActive].length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {produits[catActive].map((item, i) => (
                  <CardItem key={i} {...item} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">Produits à venir...</p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
