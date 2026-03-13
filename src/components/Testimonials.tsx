import { Star } from "lucide-react";

const reviews = [
  { name: "Marie L.", text: "Un vrai bonheur chaque matin ! Les croissants sont incroyablement frais et la livraison toujours ponctuelle.", rating: 5 },
  { name: "Thomas D.", text: "J'ai offert une box anniversaire à ma compagne, elle était ravie. Présentation soignée et produits délicieux.", rating: 5 },
  { name: "Sophie M.", text: "Parfait pour nos réunions d'équipe. Simple à commander, livraison fiable, tout le monde adore.", rating: 5 },
];

const Testimonials = () => (
  <section className="section-padding bg-card">
    <div className="max-w-6xl mx-auto text-center">
      <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Témoignages</p>
      <h2 className="section-title mb-4">Ce que disent nos clients</h2>
      <p className="section-subtitle mx-auto mb-16">
        Des matins plus beaux grâce à Breakfast Time.
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-background rounded-2xl p-8 text-left hover-lift"
            style={{ boxShadow: "var(--card-shadow)" }}
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-foreground leading-relaxed mb-6">"{r.text}"</p>
            <p className="font-display font-semibold text-foreground">{r.name}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
