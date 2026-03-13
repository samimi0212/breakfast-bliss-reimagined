import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-0">
        {/* Gauche — vide */}
        <div className="flex-1" />

        {/* Centre — Logo */}
        <a href="#" className="flex-1 flex justify-center">
          <img src={logo} alt="Breakfast Time" className="h-20 w-auto" />
        </a>

        {/* Droite — Connexion / S'inscrire */}
        <div className="flex-1 flex justify-end items-center gap-3">
          <a
            href="#connexion"
            className="hidden md:block text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Connexion
          </a>
          <a
            href="#inscription"
            className="hidden md:block bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            S'inscrire
          </a>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border animate-fade-in">
          <div className="flex flex-col px-6 py-4 gap-4">
            <a href="#connexion" className="text-foreground font-medium py-2">
              Connexion
            </a>
            <a
              href="#inscription"
              className="bg-primary text-primary-foreground text-center px-5 py-3 rounded-full font-semibold"
            >
              S'inscrire
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
