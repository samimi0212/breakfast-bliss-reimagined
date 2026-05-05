import { ClipboardList, ShoppingBag, Truck } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Choisissez",
    desc: "Parcourez notre carte et composez votre petit-déjeuner idéal parmi nos menus ou à la carte.",
  },
  {
    icon: ShoppingBag,
    title: "Commandez",
    desc: "Passez commande directement sur Deliveroo ou Uber Eats en quelques clics.",
    platforms: true,
  },
  {
    icon: Truck,
    title: "Savourez",
    desc: "Livré chez vous frais et prêt à déguster. 7j/7 de 8h à 15h.",
  },
];

const HowItWorks = () => (
  <section id="how" className="section-padding bg-card">
    <div className="max-w-6xl mx-auto text-center">
      <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Simple & rapide</p>
      <h2 className="section-title mb-4">Comment ça marche</h2>
      <p className="section-subtitle mx-auto mb-16">
        Trois étapes pour un matin parfait, sans effort.
      </p>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <s.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            <div className="text-sm font-bold text-primary mb-2">0{i + 1}</div>
            <h3 className="text-xl font-display font-semibold mb-3">{s.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
            {s.platforms && (
              <div className="flex items-center gap-3 mt-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Deliveroo_logo.svg/200px-Deliveroo_logo.svg.png"
                  alt="Deliveroo"
                  className="h-6 object-contain opacity-80"
                />
                <span className="text-muted-foreground">·</span>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Uber_Eats_logo_2023.svg/200px-Uber_Eats_logo_2023.svg.png"
                  alt="Uber Eats"
                  className="h-6 object-contain opacity-80"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
