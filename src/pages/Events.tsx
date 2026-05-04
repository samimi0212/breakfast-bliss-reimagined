import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventBookingForm from "@/components/EventBookingForm";
import { Sparkles, Users, Briefcase, Heart } from "lucide-react";

const eventDetails = [
  {
    id: "mariage",
    name: "Brunch Mariage",
    price: "À partir de 12€ par personne",
    image: "https://static.wixstatic.com/media/21c6e4_137b677c57ed4588b83a5cd2f9c99169~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_137b677c57ed4588b83a5cd2f9c99169~mv2.png",
    icon: Heart,
    description: "Célébrez votre mariage avec un brunch d'exception. Un moment gourmand et raffiné pour débuter votre plus beau jour.",
    features: [
      "Buffet viennoiseries premium",
      "Sélection salé & sucré",
      "Boissons chaudes & froides",
      "Décoration personnalisable",
      "Service discret et professionnel",
    ],
  },
  {
    id: "entreprise",
    name: "Brunch Entreprise",
    price: "À partir de 9€ par personne",
    image: "https://static.wixstatic.com/media/21c6e4_a4aec83b7dd54ab48764a13c365dab08~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_a4aec83b7dd54ab48764a13c365dab08~mv2.jpg",
    icon: Briefcase,
    description: "Dynamisez vos réunions, séminaires et team building. Une pause gourmande pour renforcer la cohésion d'équipe.",
    features: [
      "Installation rapide sur site",
      "Formule adaptée à vos horaires",
      "Viennoiseries fraîches",
      "Fruits & produits locaux",
      "Livraison & mise en place incluses",
    ],
  },
  {
    id: "groupe",
    name: "Brunch Groupe",
    price: "À partir de 8€ par personne",
    image: "https://static.wixstatic.com/media/21c6e4_b9896374a7884f76b153e6af574a0bdd~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_b9896374a7884f76b153e6af574a0bdd~mv2.png",
    icon: Users,
    description: "Anniversaire, enterrement de vie, retrouvailles... Partagez un brunch convivial et généreux avec vos proches.",
    features: [
      "Buffet viennoiseries & pains",
      "Plateau sucré & salé",
      "Boissons fraîches variées",
      "Ambiance chaleureuse garantie",
      "Décoration thématique possible",
    ],
  },
];

const Events = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-foreground pt-28 pb-16 px-6 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
          style={{
            backgroundColor: "rgba(223, 240, 87, 0.15)",
            border: "1px solid rgba(223, 240, 87, 0.4)",
            color: "#DFF057",
          }}
        >
          <Sparkles size={14} />
          Sur mesure pour chaque occasion
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4" style={{ color: "white" }}>
          Vos Événements{" "}
          <span className="italic" style={{ color: "#DFF057" }}>
            Sur Mesure
          </span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
          De l'intime au grand format, nous créons l'expérience gourmande qui vous ressemble.
        </p>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 px-6 py-16 max-w-7xl mx-auto w-full">
        {/* Trois cartes événements */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {eventDetails.map((event) => {
            const Icon = event.icon;
            return (
              <div
                key={event.id}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <img src={event.image} alt={event.name} className="w-full h-full object-cover" loading="lazy" />
                </div>

                {/* Contenu */}
                <div className="bg-card p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">{event.name}</h3>
                      <p className="text-primary font-semibold text-sm">{event.price}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{event.description}</p>

                  <div className="space-y-2 flex-1">
                    {event.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Formulaire */}
        <div className="bg-muted rounded-3xl p-12">
          <h2 className="font-display text-3xl font-bold text-center mb-3">Demander un devis</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Remplissez le formulaire ci-dessous et nous vous proposerons une formule adaptée à votre événement.
          </p>
          <EventBookingForm />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Events;
