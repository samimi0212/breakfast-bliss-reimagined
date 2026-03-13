import { MapPin, Clock, Calendar } from "lucide-react";

const DeliveryZone = () => (
  <section id="delivery" className="section-padding bg-secondary">
    <div className="max-w-6xl mx-auto text-center">
      <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Zone de livraison</p>
      <h2 className="section-title mb-4">Nous livrons dans les Alpes-Maritimes</h2>
      <p className="section-subtitle mx-auto mb-12">
        Nice, Cannes, Antibes, Grasse et leurs environs — votre petit-déjeuner arrive en 30 minutes.
      </p>
      <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {[
          { icon: MapPin, label: "Zone", value: "Alpes-Maritimes" },
          { icon: Clock, label: "Horaires", value: "7h – 15h" },
          { icon: Calendar, label: "Jours", value: "Lun. – Dim." },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl p-6 text-center"
            style={{ boxShadow: "var(--card-shadow)" }}
          >
            <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
            <p className="font-display text-lg font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DeliveryZone;
