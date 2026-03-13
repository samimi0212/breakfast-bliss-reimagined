import croissantImg from "@/assets/menu-croissant.jpg";
import brunchImg from "@/assets/menu-brunch.jpg";
import granolaImg from "@/assets/menu-granola.jpg";
import coffeeImg from "@/assets/menu-coffee.jpg";
import pancakesImg from "@/assets/menu-pancakes.jpg";
import boxImg from "@/assets/menu-box.jpg";

const items = [
  { name: "Croissant Artisanal", price: "2,50 €", cat: "Viennoiserie", img: croissantImg },
  { name: "Brunch Bowl", price: "14,90 €", cat: "Salé", img: brunchImg },
  { name: "Granola Maison", price: "8,90 €", cat: "Sucré", img: granolaImg },
  { name: "Latte Artisanal", price: "4,50 €", cat: "Boisson", img: coffeeImg },
  { name: "Pancakes Gourmands", price: "11,90 €", cat: "Sucré", img: pancakesImg },
  { name: "Box Surprise", price: "29,90 €", cat: "Menu complet", img: boxImg },
];

const MenuSection = () => (
  <section id="menu" className="section-padding">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Nos produits</p>
        <h2 className="section-title mb-4">La Carte</h2>
        <p className="section-subtitle mx-auto">
          Des produits frais, locaux et préparés le matin même pour commencer la journée en beauté.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl overflow-hidden hover-lift group"
            style={{ boxShadow: "var(--card-shadow)" }}
          >
            <div className="relative overflow-hidden aspect-[4/3]">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1 rounded-full">
                {item.cat}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-lg font-semibold">{item.name}</h3>
                <span className="text-primary font-bold text-lg">{item.price}</span>
              </div>
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Ajouter au panier
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <a
          href="#"
          className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Voir toute la carte →
        </a>
      </div>
    </div>
  </section>
);

export default MenuSection;
