import { useState } from "react";

// ---- DONNÉES ----

const menus = [
  {
    name: "Menu Français",
    price: "12,90€",
    desc: "Le classique à la française — viennoiseries, pain, beurre et confiture",
    img: "https://static.wixstatic.com/media/21c6e4_34c4bd51a8a94133aebf056e7c1dfbbe~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_34c4bd51a8a94133aebf056e7c1dfbbe~mv2.png",
  },
  {
    name: "Menu Anglais",
    price: "12,90€",
    desc: "Œufs, bacon, saucisses — le breakfast à l'anglaise",
    img: "https://static.wixstatic.com/media/21c6e4_35577f9aced14c51b49fc307bf7656d6~mv2.jpg/v1/fill/w_917,h_917,al_c,q_85,enc_avif,quality_auto/21c6e4_35577f9aced14c51b49fc307bf7656d6~mv2.jpg",
  },
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
    img: "https://static.wixstatic.com/media/21c6e4_b9896374a7884f76b153e6af574a0bdd~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_b9896374a7884f76b153e6af574a0bdd~mv2.png",
  },
];

const produits: Record<string, { name: string; price: string; img: string; desc?: string }[]> = {
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
  Pains: [
    {
      name: "Baguette",
      price: "1,30€",
      desc: "La baguette tradition croustillante, cuite le matin même",
      img: "https://static.wixstatic.com/media/21c6e4_d8f2fa38f4234f1e89e73216fb5da62b~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_d8f2fa38f4234f1e89e73216fb5da62b~mv2.jpg",
    },
    {
      name: "Baguette bio aux graines",
      price: "2,10€",
      desc: "Baguette bio généreusement garnie de graines, dorée et savoureuse",
      img: "https://static.wixstatic.com/media/21c6e4_bcd49273376a400fa8ca7e7b52d8d55d~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_bcd49273376a400fa8ca7e7b52d8d55d~mv2.jpg",
    },
    {
      name: "Pain complet",
      price: "2,80€",
      desc: "Pain complet aux céréales, dense et nourrissant pour bien démarrer",
      img: "https://static.wixstatic.com/media/21c6e4_736a710692ba41f2b3c6c6944edb9a40~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_736a710692ba41f2b3c6c6944edb9a40~mv2.jpg",
    },
  ],
  "Le Salé": [
    {
      name: "Bagel chèvre miel",
      price: "13,50€",
      img: "https://static.wixstatic.com/media/21c6e4_a2a0e40b65f14dc0b9e902939034c8b7~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_a2a0e40b65f14dc0b9e902939034c8b7~mv2.png",
    },
    {
      name: "Bagel Bacon Cheddar",
      price: "13,50€",
      img: "https://static.wixstatic.com/media/21c6e4_aceb5b56d164432abb582ed01d9e5c61~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_aceb5b56d164432abb582ed01d9e5c61~mv2.png",
    },
    {
      name: "Bagel Saumon Avocat",
      price: "13,50€",
      img: "https://static.wixstatic.com/media/21c6e4_1c3c0b77a93d4e0896c8679a0f21b446~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_1c3c0b77a93d4e0896c8679a0f21b446~mv2.png",
    },
    {
      name: "Avocado Toast",
      price: "13,50€",
      img: "https://static.wixstatic.com/media/21c6e4_d5216d063f2b4f68ad81354d27894bd1~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_d5216d063f2b4f68ad81354d27894bd1~mv2.png",
    },
    {
      name: "Tartine Halloumi Avocat",
      price: "14,90€",
      img: "https://static.wixstatic.com/media/21c6e4_08111e7f9e0b47e1b126820ad08c842e~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_08111e7f9e0b47e1b126820ad08c842e~mv2.png",
    },
    {
      name: "Oeufs bénédicte",
      price: "8,50€",
      img: "https://static.wixstatic.com/media/21c6e4_afd75b1c09184351bf14d4b600cef84c~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_afd75b1c09184351bf14d4b600cef84c~mv2.png",
    },
    {
      name: "Oeufs brouillés Truffe",
      price: "7,50€",
      img: "https://static.wixstatic.com/media/21c6e4_cb3b17ebf6484ce6a13ed79d3a530f53~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_cb3b17ebf6484ce6a13ed79d3a530f53~mv2.png",
    },
    {
      name: "Oeufs brouillés",
      price: "4,50€",
      img: "https://static.wixstatic.com/media/21c6e4_de105d93f91e471d8ccb8b6c7ccbaa8f~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_de105d93f91e471d8ccb8b6c7ccbaa8f~mv2.jpg",
    },
  ],
  "Le Sucré": [
    {
      name: "Pancakes Sirop d'érable Myrtilles",
      price: "10,90€",
      img: "https://static.wixstatic.com/media/21c6e4_f419aee1d44244458fc6c57efc1de148~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_f419aee1d44244458fc6c57efc1de148~mv2.png",
    },
    {
      name: "Pancakes Nutella Banane",
      price: "10,90€",
      img: "https://static.wixstatic.com/media/21c6e4_e0c9e849faa64c90b4e105a283f646bf~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_e0c9e849faa64c90b4e105a283f646bf~mv2.png",
    },
    {
      name: "Brioche Perdue Gourmande",
      price: "12,90€",
      img: "https://static.wixstatic.com/media/21c6e4_5ba1b60f56084a23b7fe442adaafbe4a~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_5ba1b60f56084a23b7fe442adaafbe4a~mv2.png",
    },
    {
      name: "Pudding Chia Bowl",
      price: "9,50€",
      img: "https://static.wixstatic.com/media/21c6e4_3b8ad26ddf37468a834c55f7697d48a6~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_3b8ad26ddf37468a834c55f7697d48a6~mv2.png",
    },
    {
      name: "Granola Parfait",
      price: "8,50€",
      img: "https://static.wixstatic.com/media/21c6e4_cc66f5eaed7a462488b1df7264e4b5a6~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_cc66f5eaed7a462488b1df7264e4b5a6~mv2.png",
    },
  ],
  Boissons: [
    {
      name: "Smoothie banane",
      price: "6,50€",
      img: "https://static.wixstatic.com/media/21c6e4_97bb0d3d0a8e4fd5a0bcb6426a6b5a91~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_97bb0d3d0a8e4fd5a0bcb6426a6b5a91~mv2.png",
    },
    {
      name: "Smoothie fruits rouges",
      price: "6,50€",
      img: "https://static.wixstatic.com/media/21c6e4_dd1900b53c5445bfa3005623afd0b1b0~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_dd1900b53c5445bfa3005623afd0b1b0~mv2.png",
    },
    {
      name: "Café frappé",
      price: "5,50€",
      img: "https://static.wixstatic.com/media/21c6e4_0666def6d3c34d979690efd0430ca8ec~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_0666def6d3c34d979690efd0430ca8ec~mv2.png",
    },
  ],
  "À Partager": [
    {
      name: "Plateau de viennoiseries",
      price: "17,00€",
      img: "https://static.wixstatic.com/media/21c6e4_54d6c72da0db428c9a95913573cb84ee~mv2.jpg/v1/fill/w_832,h_832,al_c,q_85,enc_avif,quality_auto/21c6e4_54d6c72da0db428c9a95913573cb84ee~mv2.jpg",
    },
    {
      name: "Planche de charcuterie",
      price: "39,00€",
      img: "https://static.wixstatic.com/media/21c6e4_a7461066fb7542869e337fd7e3ef7d9a~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_a7461066fb7542869e337fd7e3ef7d9a~mv2.png",
    },
    {
      name: "Planche de fromages",
      price: "39,00€",
      img: "https://static.wixstatic.com/media/21c6e4_1072c5ec1d8844478ad6ddf0753d7d1d~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_1072c5ec1d8844478ad6ddf0753d7d1d~mv2.png",
    },
  ],
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
