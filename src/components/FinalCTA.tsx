import heroImg from "@/assets/hero-breakfast.jpg";

const FinalCTA = () => (
  <section className="relative py-32 overflow-hidden">
    <img
      src={heroImg}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
    <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
    <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
      <h2 className="text-3xl md:text-5xl font-display font-bold mb-6" style={{ color: "hsl(0 0% 100%)" }}>
        Prêt à transformer votre matin ?
      </h2>
      <p className="text-lg mb-10" style={{ color: "hsl(0 0% 100% / 0.8)" }}>
        Commandez maintenant et recevez un petit-déjeuner d'exception en 30 minutes.
      </p>
      <a
        href="#menu"
        className="bg-primary text-primary-foreground px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity inline-block"
      >
        Commander maintenant
      </a>
    </div>
  </section>
);

export default FinalCTA;
