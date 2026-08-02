import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  img: string;
  qty: number;
  options?: Record<string, string | string[]>;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

// Un panier stocké par une ancienne version du site (ou corrompu) ne doit jamais
// pouvoir casser le rendu : ce Provider est à la racine de l'app, une exception ici
// rend TOUTES les pages blanches. On écarte donc silencieusement les articles invalides.
const isValidItem = (item: unknown): item is CartItem => {
  if (!item || typeof item !== "object") return false;
  const i = item as Record<string, unknown>;
  return (
    typeof i.id === "string" &&
    typeof i.name === "string" &&
    typeof i.price === "string" &&
    typeof i.qty === "number" &&
    Number.isFinite(i.qty)
  );
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("breakfast-cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("breakfast-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.findIndex(
        (i) => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options),
      );
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing].qty += item.qty;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQty = (index: number, qty: number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, qty } : item)));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => {
    const price = parseFloat(String(item.price).replace("€", "").replace(",", "."));
    return Number.isFinite(price) ? sum + price * item.qty : sum;
  }, 0);

  const count = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
