// Articles de blog (SEO local + contenu produit).
// URL : /blog/{slug} (FR) et /en/blog/{slug} (EN).

export interface BlogBlock {
  type: "p" | "h2";
  text: string;
  text_en: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  /** Date de publication, format YYYY-MM-DD. */
  date: string;
  image: string;
  metaTitle: string;
  metaTitle_en: string;
  metaDesc: string;
  metaDesc_en: string;
  blocks: BlogBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "ou-bruncher-a-antibes",
    title: "Où bruncher à Antibes en 2026 : notre guide",
    title_en: "Where to brunch in Antibes in 2026: our guide",
    excerpt:
      "Envie d'un brunch à Antibes sans sortir de chez vous ? Voici comment composer le brunch parfait et se le faire livrer directement à domicile ou au bureau.",
    excerpt_en:
      "Want brunch in Antibes without leaving home? Here's how to put together the perfect brunch and have it delivered straight to your door or office.",
    date: "2026-07-15",
    image: "/menu-brunch.png",
    metaTitle: "Où bruncher à Antibes en 2026 ? | Breakfast Time",
    metaTitle_en: "Where to brunch in Antibes in 2026? | Breakfast Time",
    metaDesc:
      "Nos conseils pour organiser le brunch parfait à Antibes : viennoiseries, œufs bénédicte, bagels et boissons, livrés directement chez vous.",
    metaDesc_en:
      "Our tips for the perfect brunch in Antibes: pastries, eggs Benedict, bagels and drinks, delivered straight to your door.",
    blocks: [
      {
        type: "p",
        text: "Antibes ne manque pas de charme pour prendre un petit-déjeuner en terrasse, mais un vrai brunch réussi demande souvent plus de temps qu'on ne l'imagine : trouver une table libre le dimanche matin, attendre son tour, puis rentrer avec des enfants qui ont déjà faim. Il existe une alternative plus simple : faire venir le brunch à vous, chez vous ou au bureau, avec la même qualité qu'en boulangerie-traiteur artisanale.",
        text_en:
          "Antibes has no shortage of charming terraces for breakfast, but a proper brunch often takes more time than you'd think: finding a free table on a Sunday morning, waiting your turn, then heading home with hungry kids. There's a simpler alternative: have the brunch come to you, at home or at the office, with the same quality as an artisan bakery-caterer.",
      },
      {
        type: "h2",
        text: "Qu'est-ce qu'un bon brunch, exactement ?",
        text_en: "What actually makes a good brunch?",
      },
      {
        type: "p",
        text: "Un brunch réussi mélange le sucré et le salé : des viennoiseries fraîches, un plat chaud comme des œufs bénédicte ou un bagel garni, des fruits ou un bowl, et une boisson chaude ou un jus pressé. L'idée n'est pas de multiplier les plats, mais d'avoir un peu de tout pour satisfaire toutes les envies autour de la table, y compris les invités les plus difficiles.",
        text_en:
          "A good brunch mixes sweet and savoury: fresh pastries, a hot dish such as eggs Benedict or a loaded bagel, some fruit or a bowl, and a hot drink or fresh juice. The idea isn't to pile on dishes, but to have a bit of everything so every guest at the table finds something they like — even the pickiest ones.",
      },
      {
        type: "h2",
        text: "Composer son brunch à la maison, sans y passer la matinée",
        text_en: "Putting together a brunch at home, without losing your morning",
      },
      {
        type: "p",
        text: "Chez Breakfast Time, notre Menu Brunch a justement été pensé pour ça : un assortiment de viennoiseries, un plat salé au choix et une boisson, livré prêt à déguster. Pour un groupe plus large ou un anniversaire, le Menu Duo ou le Menu Famille permettent de varier les plaisirs sans multiplier les commandes séparées. Tout est personnalisable directement sur la carte.",
        text_en:
          "At Breakfast Time, our Brunch Menu was designed for exactly this: an assortment of pastries, a choice of savoury dish and a drink, delivered ready to enjoy. For a bigger group or a birthday, the Duo Menu or the Family Menu let you mix things up without placing several separate orders. Everything can be customised directly on the menu.",
      },
      {
        type: "h2",
        text: "Et si vous recevez à Antibes, Juan-les-Pins ou dans les environs ?",
        text_en: "Hosting in Antibes, Juan-les-Pins or nearby?",
      },
      {
        type: "p",
        text: "Nous livrons les petits-déjeuners et brunchs directement à Antibes et dans plusieurs communes voisines. Il suffit d'indiquer votre adresse au moment de la commande pour vérifier que vous êtes bien dans notre zone de livraison, et de choisir un créneau qui vous arrange.",
        text_en:
          "We deliver breakfasts and brunches directly to Antibes and several neighbouring towns. Just enter your address when ordering to check you're within our delivery zone, then pick a time slot that suits you.",
      },
      {
        type: "p",
        text: "Vous voulez composer votre brunch dès maintenant ? Direction notre carte pour découvrir tous les menus et options disponibles.",
        text_en:
          "Ready to build your brunch now? Head to our menu to discover all the available menus and options.",
      },
    ],
  },
];

export const getBlogPostBySlug = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);
