import { usePageMeta } from "@/hooks/usePageMeta";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import MenuSection from "@/components/MenuSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import AboutSection from "@/components/AboutSection";
import DeliveryZone from "@/components/DeliveryZone";
import EventsPromo from "@/components/EventsPromo";
import OrderOnline from "@/components/OrderOnline";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  usePageMeta(
    "Breakfast Time — Petit-déjeuner & brunch livré à domicile",
    "Breakfast Time livre des petits-déjeuners et brunchs d'exception dans les Alpes-Maritimes. Produits frais, locaux, livrés en 30 minutes. 7j/7.",
    "/"
  );
  return (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <MenuSection />
      <OrderOnline />
      <EventsPromo />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <AboutSection />
      <DeliveryZone />
      <FinalCTA />
    </main>
    <Footer />
  </>
  );
};

export default Index;
