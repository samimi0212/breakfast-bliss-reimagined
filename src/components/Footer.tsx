import { Instagram, Facebook } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground section-padding" style={{ color: "hsl(var(--background))" }}>
    <div className="max-w-6xl mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div>
          <h3 className="font-display text-2xl font-bold mb-4">
            Breakfast <span className="text-primary">Time</span>
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--background) / 0.6)" }}>
            Des petits-déjeuners et brunchs d'exception livrés chez vous dans les Alpes-Maritimes.
          </p>
        </div>

        {/* Nav */}
        <div>
          <h4 className="font-semibold mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm" style={{ color: "hsl(var(--background) / 0.6)" }}>
            <li><a href="#menu" className="hover:text-primary transition-colors">La Carte</a></li>
            <li><a href="#how" className="hover:text-primary transition-colors">Comment ça marche</a></li>
            <li><a href="#about" className="hover:text-primary transition-colors">À propos</a></li>
            <li><a href="#delivery" className="hover:text-primary transition-colors">Livraison</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm" style={{ color: "hsl(var(--background) / 0.6)" }}>
            <li>hello@breakfast-time.fr</li>
            <li>Alpes-Maritimes, France</li>
            <li>Lun. – Dim. : 7h – 15h</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-4">Suivez-nous</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center hover:bg-primary transition-colors group">
              <Instagram className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center hover:bg-primary transition-colors group">
              <Facebook className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm" style={{ borderColor: "hsl(var(--background) / 0.1)", color: "hsl(var(--background) / 0.4)" }}>
        <p>© 2025 Breakfast Time. Tous droits réservés.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
          <a href="#" className="hover:text-primary transition-colors">CGV</a>
          <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
