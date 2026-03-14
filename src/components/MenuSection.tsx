import { useState } from "react";
import croissantImg from "@/assets/menu-croissant.jpg";
import brunchImg from "@/assets/menu-brunch.jpg";
import granolaImg from "@/assets/menu-granola.jpg";
import coffeeImg from "@/assets/menu-coffee.jpg";
import pancakesImg from "@/assets/menu-pancakes.jpg";
import boxImg from "@/assets/menu-box.jpg";

const menus = [
  { name: "Box Surprise", price: "29,90 €", desc: "Notre sélection du moment, livrée avec amour", img: boxImg },
  { name: "Brunch Bowl", price: "14,90 €", desc: "Salé, sucré, frais — le brunch parfait", img: brunchImg },
  { name: "Formule Duo", price: "39,90 €", desc: "Petit-déjeuner complet pour 2 personnes", img: croissantImg },
];

const produits = {
  Viennoiseries: [
    { name: "Croissant Artisanal", price: "2,50 €", img: croissantImg },
    { name: "Pain au Chocolat", price: "2,80 €", img: croissantImg },
    { name: "Brioche Maison", price: "4,50 €", img: croissantImg },
  ],
  Pains: [
    { name: "Pain de Campagne", price: "3,90 €", img: brunchImg },
    { name: "Pain aux Céréales", price: "4,20 €", img: brunchImg },
    { name: "Baguette Tradition", price: "1,50 €", img: brunchImg },
  ],
  "Le Salé": [
    { name: "Œufs Bénédicte", price: "9,90 €", img: brunchImg },
    { name: "Avocat Toast", price: "8,50 €", img: brunchImg },
    { name: "Assiette Fromages", price: "11,90 €", img: brunchImg },
  ],
  "Le Sucré": [
    { name: "Granola Maison", price: "8,90 €", img: granolaImg },
    { name: "Pancakes Gourmands", price: "11,90 €", img: pancakesImg },
    { name: "Açaï Bowl", price: "10,50 €", img: granolaImg },
  ],
  Boissons: [
    { name: "Latte Artisanal", price: "4,50 €", img: coffeeImg },
    { name: "Jus d'Orange Frais", price: "4,90 €", img: coffeeImg },
    { name: "Thé & Infusions", price: "3,50 €", img: coffeeImg },
  ],
  "À Partager": [
    { name: "Plateau Viennoiseries", price: "18,90 €", img: boxImg },
    { name: "Box Fruits Frais", price: "14,90 €", img: granolaImg },
    { name: "Assortiment Maison", price: "24,90 €", img: boxImg },
  ],
};

const categories = Object.keys(produits) as Array<keyof typeof produits>;

const CardItem = ({ name, price, img, desc }: { name: string; price: string; img: string; desc?: string }) => (
  <div className="bg-card rounded-2xl overflow-hidden hover-lift group" style={{ boxShadow: "var(--card-shadow)" }}>
    <div className="relative overflow-hidden aspect-[4/3]">
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

const MenuSection = () => {
  const [tab, setTab] = useState<"menus" | "carte">("menus");
  const [catActive, setCatActive] = useState<string>("Viennoiseries");

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
            {/* Sous-catégories */}
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

            {/* Produits */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {produits[catActive as keyof typeof produits].map((item, i) => (
                <CardItem key={i} {...item} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
