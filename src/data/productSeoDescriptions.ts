// Descriptions SEO uniques par produit, utilisées UNIQUEMENT pour la balise
// <meta name="description"> (jamais affichées sur la page produit elle-même).
// Chaque produit ayant un template de page identique, Google traitait ces pages
// comme du contenu quasi dupliqué — une phrase rédigée par produit règle ça.

export const productSeoDescriptions: Record<string, { fr: string; en: string }> = {
  "menu-francais": {
    fr: "Le petit-déjeuner français dans les règles : demi-baguette, beurre, viennoiserie et boisson chaude, livré frais chaque matin.",
    en: "The classic French breakfast: half baguette, butter, pastry and a hot drink, delivered fresh every morning.",
  },
  "menu-anglais": {
    fr: "L'English Breakfast complet : saucisses, œufs brouillés, baked beans et toast à l'avocat, livré chaud et généreux.",
    en: "The full English Breakfast: sausages, scrambled eggs, baked beans and avocado toast, delivered hot and hearty.",
  },
  "menu-brunch": {
    fr: "Le grand brunch du dimanche : bagel gourmand, frites de patates douces et granola bowl, livré prêt à partager.",
    en: "The Sunday brunch spread: bagel, sweet potato fries and granola bowl parfait, delivered ready to share.",
  },
  "menu-veggie": {
    fr: "Un brunch 100% végétal : toast méditerranéen généreux et frites de patates douces, livré frais et gourmand.",
    en: "An all-plant brunch: generous Mediterranean toast and sweet potato fries, delivered fresh and flavourful.",
  },
  "menu-duo": {
    fr: "Le brunch à deux : bagels au choix, granola bowl et mini viennoiseries à partager, livré pour deux gourmands.",
    en: "Brunch for two: bagels, granola bowl and mini pastries to share, delivered for two hungry mornings.",
  },
  "menu-famille": {
    fr: "Le grand brunch familial : bagels, granola bowls et mini viennoiseries pour quatre, livré généreux et complet.",
    en: "The big family brunch: bagels, granola bowls and mini pastries for four, delivered generous and complete.",
  },
  "birthday-box": {
    fr: "La box anniversaire gourmande : gâteau de pancakes à la pâte à tartiner, bougies scintillantes et message personnalisé inclus.",
    en: "The birthday treat box: pancake cake with chocolate spread, sparkling candles and a personalised message included.",
  },
  croissant: {
    fr: "Croissant pur beurre, doré et croustillant, façonné et cuit chaque matin avant d'être livré chez vous.",
    en: "Pure butter croissant, golden and flaky, shaped and baked fresh each morning before delivery.",
  },
  "pain-au-chocolat": {
    fr: "Pain au chocolat pur beurre, deux barres de chocolat noir fondant, livré tout juste sorti du four.",
    en: "Pure butter chocolate croissant with two bars of melting dark chocolate, delivered fresh from the oven.",
  },
  "chausson-pommes": {
    fr: "Chausson aux pommes pur beurre, pâte feuilletée croustillante et compotée fondante, livré frais du matin.",
    en: "Pure butter apple turnover, crisp puff pastry and soft apple filling, delivered fresh each morning.",
  },
  "pain-aux-raisins": {
    fr: "Pain aux raisins pur beurre, spirale moelleuse à la crème pâtissière et raisins gonflés, livré frais du jour.",
    en: "Pure butter raisin pastry, a soft spiral of pastry cream and plump raisins, delivered fresh daily.",
  },
  "mini-viennoiseries": {
    fr: "Assortiment de mini viennoiseries pur beurre, croissants et pains au chocolat miniatures, livré tout juste cuits.",
    en: "Assorted pure butter mini pastries, miniature croissants and chocolate croissants, delivered oven-fresh.",
  },
  baguette: {
    fr: "Baguette traditionnelle de 140g, croûte craquante et mie alvéolée, livrée fraîche du jour.",
    en: "Traditional 140g baguette, crackling crust and airy crumb, delivered fresh the same day.",
  },
  "baguette-bio": {
    fr: "Baguette aux graines de tournesol, pavot, sésame et lin, croustillante et généreuse, livrée fraîche du matin.",
    en: "Seeded baguette with sunflower, poppy, sesame and flax seeds, crusty and generous, delivered fresh.",
  },
  "petit-pain-campagne": {
    fr: "Petit pavé de campagne au levain naturel, mie dense et croûte rustique, livré frais chaque matin.",
    en: "Country sourdough roll, dense crumb and rustic crust, delivered fresh every morning.",
  },
  "avocado-toast": {
    fr: "Avocat crémeux et stracciatella sur pain au levain grillé, garni de jeunes pousses fraîches et de sésame doré.",
    en: "Creamy avocado and stracciatella on grilled sourdough, topped with baby greens and golden sesame.",
  },
  "bagel-chevre-miel": {
    fr: "Bagel brioché au chèvre cendré, noix de Grenoble AOP et confit de poires, une association gourmande livrée fraîche.",
    en: "Brioche bagel with ash-ripened goat cheese, AOP Grenoble walnuts and pear confit, a gourmet pairing delivered fresh.",
  },
  "bagel-bacon-cheddar": {
    fr: "Bagel aux graines garni d'œuf, bacon croustillant et cheddar fondant, nappé d'une sauce fumée maison.",
    en: "Seeded bagel with egg, crispy bacon and melting cheddar, finished with a house-made smoky sauce.",
  },
  "bagel-saumon-avocat": {
    fr: "Bagel brioché au poulet mariné aux herbes, salade fraîche et pickles d'oignons rouges, sauce fumée artisanale.",
    en: "Brioche bagel with herb-marinated chicken, fresh salad and pickled red onions, artisanal smoky sauce.",
  },
  "breakfast-burrito": {
    fr: "Burrito généreux au pulled pork, œufs brouillés et bacon croustillant, sauce fumée et confit de tomates.",
    en: "Hearty pulled pork burrito with scrambled eggs and crispy bacon, smoky sauce and tomato confit.",
  },
  "pancakes-a-composer": {
    fr: "Trois pancakes moelleux à composer vous-même, nappage et topping au choix, livrés chauds et prêts à savourer.",
    en: "Three fluffy pancakes to top your way, with the topping and drizzle of your choice, delivered warm.",
  },
  "gaufre-composer": {
    fr: "Gaufre de Liège authentique et croustillante, nappage et topping au choix, livrée chaude et personnalisable.",
    en: "Authentic crisp Liège waffle, with the topping and drizzle of your choice, delivered warm and customisable.",
  },
  "focaccia-saumon": {
    fr: "Pinsa moelleuse au pesto artisanal, burrata crémeuse, mortadelle et pistache, relevée de tomates confites.",
    en: "Soft pinsa with artisanal pesto, creamy burrata, mortadella and pistachio, finished with confit tomatoes.",
  },
  "toast-mediterraneen": {
    fr: "Tartine au levain garnie de caviar d'aubergine, feta et olives Kalamata, relevée d'épices zaatar et d'huile d'olive.",
    en: "Sourdough tartine topped with eggplant caviar, feta and Kalamata olives, finished with zaatar and olive oil.",
  },
  "breakfast-bowl": {
    fr: "Bowl généreux au quinoa et falafel, pois chiches croustillants, houmous et grenade, sauce citronnée maison.",
    en: "Hearty quinoa and falafel bowl, crispy chickpeas, hummus and pomegranate, house lemon sauce.",
  },
  "oeufs-brouilles": {
    fr: "Œufs brouillés crémeux aux œufs fermiers plein air, beurre de baratte et fleur de sel, servis avec un toast.",
    en: "Creamy scrambled eggs made with free-range eggs, churned butter and fleur de sel, served with toast.",
  },
  "oeufs-brouilles-truffe": {
    fr: "Œufs brouillés à la truffe noire du Périgord, œufs fermiers plein air et fleur de sel, servis avec un toast.",
    en: "Scrambled eggs with black Périgord truffle, free-range eggs and fleur de sel, served with toast.",
  },
  rostis: {
    fr: "Röstis de pommes de terre dorés et croustillants, accompagnés d'une sauce fraîche aux herbes maison.",
    en: "Golden crispy potato röstis, served with a fresh house-made herb sauce.",
  },
  "frites-patates-douces": {
    fr: "Frites de patates douces croustillantes, fleur de sel et sauce fraîche aux herbes, livrées encore chaudes.",
    en: "Crispy sweet potato fries with fleur de sel and fresh herb sauce, delivered still warm.",
  },
  "halloumi-grille": {
    fr: "Halloumi grillé AOP, fondant à l'intérieur et doré à l'extérieur, fleur de sel et sauce fraîche aux herbes.",
    en: "Grilled AOP halloumi, soft inside and golden outside, with fleur de sel and fresh herb sauce.",
  },
  "brioche-perdue": {
    fr: "Brioche perdue fondante à la Nocciolata et éclats de noisettes grillées, une gourmandise livrée tiède.",
    en: "Indulgent French toast with Nocciolata and toasted hazelnut bits, a treat delivered warm.",
  },
  "brioche-perdue-caramel": {
    fr: "Brioche perdue au caramel beurre salé de Guérande, noix de pécan et myrtilles fraîches, livrée fondante.",
    en: "French toast with Guérande salted butter caramel, pecans and fresh blueberries, delivered warm.",
  },
  "pudding-chia": {
    fr: "Bowl crémeux à la pistache et vanille, yaourt végétal, granola croustillant et myrtilles fraîches.",
    en: "Creamy pistachio and vanilla bowl, plant-based yogurt, crunchy granola and fresh blueberries.",
  },
  "granola-parfait": {
    fr: "Bowl gourmand au yaourt grec et granola artisanal, fruits rouges, banane et miel de lavande.",
    en: "Greek yogurt bowl with artisanal granola, mixed berries, banana and lavender honey.",
  },
  porridge: {
    fr: "Porridge onctueux à la mangue et vanille, amandes grillées, graines de chia et beurre de cacahuètes.",
    en: "Creamy mango vanilla porridge, toasted almonds, chia seeds and peanut butter.",
  },
  "acai-bowl": {
    fr: "Bowl açaï glacé, fruits rouges et banane, granola artisanal croquant et miel de lavande.",
    en: "Chilled açaí bowl with mixed berries and banana, crunchy artisanal granola and lavender honey.",
  },
  "cookie-chocolat": {
    fr: "Cookie fondant au chocolat et à la noisette, 85g de gourmandise, livré croustillant à l'extérieur.",
    en: "Soft chocolate hazelnut cookie, 85g of indulgence, crisp on the outside.",
  },
  "cookie-caramel": {
    fr: "Cookie au caramel et beurre salé de Guérande, cœur coulant et bords croustillants, livré frais du jour.",
    en: "Salted butter caramel cookie from Guérande, gooey centre and crisp edges, delivered fresh.",
  },
  "brownie-pecan": {
    fr: "Brownie fondant au chocolat noir et noix de pécan torréfiées, une gourmandise dense et intense.",
    en: "Fudgy dark chocolate brownie with toasted pecans, dense and indulgent.",
  },
  "cake-marbre": {
    fr: "Cake marbré vanille-chocolat moelleux, à partager en 8 à 10 parts, livré frais du matin.",
    en: "Soft vanilla-chocolate marble cake, sliced for 8 to 10, delivered fresh each morning.",
  },
  "muffin-myrtilles": {
    fr: "Muffin moelleux aux myrtilles fraîches, 130g de gourmandise fondante, livré tout juste cuit.",
    en: "Soft blueberry muffin, 130g of melting indulgence, delivered oven-fresh.",
  },
  "muffin-choco": {
    fr: "Muffin fondant au chocolat noir, 130g généreux et moelleux, livré tout juste sorti du four.",
    en: "Fudgy dark chocolate muffin, a generous 130g, delivered fresh from the oven.",
  },
  americano: {
    fr: "Café filtre torréfié, servi non sucré avec le sucre à part, livré chaud dans les minutes qui suivent.",
    en: "Filter coffee, served unsweetened with sugar on the side, delivered hot within minutes.",
  },
  "cafe-latte": {
    fr: "Latte macchiato onctueux, espresso et lait mousseux en couches, servi non sucré, sucre à part.",
    en: "Smooth latte macchiato, layered espresso and frothed milk, served unsweetened with sugar on the side.",
  },
  capuccino: {
    fr: "Cappuccino crémeux à la mousse de lait onctueuse, servi non sucré avec le sucre à part.",
    en: "Creamy cappuccino with silky milk foam, served unsweetened with sugar on the side.",
  },
  "chocolat-chaud": {
    fr: "Chocolat chaud intense au 100% cacao de Guayaquil, servi non sucré, sucre à part sur demande.",
    en: "Rich hot chocolate made with 100% Guayaquil cocoa, served unsweetened, sugar on request.",
  },
  "the-earl-grey": {
    fr: "Thé noir Earl Grey au zeste de citron, infusé à la demande, servi non sucré avec le sucre à part.",
    en: "Earl Grey black tea with lemon zest, brewed to order, served unsweetened with sugar on the side.",
  },
  "iced-latte": {
    fr: "Iced latte frais et crémeux, espresso corsé sur glace et lait onctueux, servi non sucré.",
    en: "Cool creamy iced latte, bold espresso over ice with smooth milk, served unsweetened.",
  },
  "chai-latte": {
    fr: "Chai latte épicé au lait d'avoine, thé noir et vanille, une boisson chaude réconfortante et parfumée.",
    en: "Spiced chai latte with oat milk, black tea and vanilla, a comforting warm drink.",
  },
  "iced-matcha-latte": {
    fr: "Matcha latte vibrant, thé vert japonais et lait d'avoine crémeux, une boisson fraîche et énergisante.",
    en: "Vibrant matcha latte, Japanese green tea and creamy oat milk, fresh and energising.",
  },
  "smoothie-tropical": {
    fr: "Smoothie tropical mangue et gingembre, lait de coco et pomme, sans sucres ajoutés, livré frais et vitaminé.",
    en: "Tropical mango ginger smoothie with coconut milk and apple, no added sugar, fresh and vibrant.",
  },
  "smoothie-energie": {
    fr: "Smoothie énergisant fraise et cerise, pomme et guarana, sans sucres ajoutés, pour un vrai coup de boost.",
    en: "Energising strawberry cherry smoothie with apple and guarana, no added sugar, a real morning boost.",
  },
  "smoothie-detox": {
    fr: "Smoothie detox kiwi et concombre, pomme et matcha, sans sucres ajoutés, frais de la tête aux pieds.",
    en: "Green detox smoothie with kiwi, cucumber, apple and matcha, no added sugar, fresh from head to toe.",
  },
  "jus-orange-presse": {
    fr: "Jus d'orange 100% pressé minute, sans sucres ajoutés, livré frais pour une vitamine C immédiate.",
    en: "Freshly squeezed orange juice, no added sugar, delivered fresh for an instant vitamin C boost.",
  },
  "jus-pamplemousse-presse": {
    fr: "Jus de pamplemousse 100% pressé minute, sans sucres ajoutés, une fraîcheur acidulée livrée chez vous.",
    en: "Freshly squeezed grapefruit juice, no added sugar, a tangy freshness delivered to your door.",
  },
  "jus-abricot": {
    fr: "Nectar d'abricot velouté et gourmand, livré frais pour accompagner votre petit-déjeuner.",
    en: "Velvety, indulgent apricot nectar, delivered fresh to accompany your breakfast.",
  },
  "plateau-viennoiseries": {
    fr: "Plateau de viennoiseries pur beurre, 5 croissants et 5 pains au chocolat, livré prêt à partager en équipe.",
    en: "Pure butter pastry platter with 5 croissants and 5 chocolate croissants, delivered ready to share.",
  },
  "plateau-pancakes": {
    fr: "Plateau de 10 pancakes moelleux avec 3 nappages au choix, livré chaud, idéal pour un brunch à plusieurs.",
    en: "Platter of 10 fluffy pancakes with 3 toppings of your choice, delivered warm for a shared brunch.",
  },
  "brioche-partager": {
    fr: "Brioche pur beurre moelleuse à partager en 8 à 10 parts, livrée fraîche pour le petit-déjeuner en famille.",
    en: "Soft pure butter brioche, sliced for 8 to 10, delivered fresh for a family breakfast.",
  },
  "banana-bread": {
    fr: "Banana bread moelleux à la banane fondante, livré frais du jour pour une pause gourmande.",
    en: "Moist banana bread with soft ripe banana, delivered fresh for a sweet morning treat.",
  },
  "brunch-mariage": {
    fr: "Formule brunch de mariage : buffet de viennoiseries, salé et sucré, décoration et service sur place inclus.",
    en: "Wedding brunch package: pastry buffet, sweet and savoury spread, decoration and on-site service included.",
  },
  "brunch-entreprise": {
    fr: "Formule brunch d'entreprise : viennoiseries fraîches, plateaux salés et fruits, livrée et installée sur site.",
    en: "Corporate brunch package: fresh pastries, savoury platters and fruit, delivered and set up on site.",
  },
  "brunch-groupe": {
    fr: "Formule brunch de groupe : buffet de viennoiseries et pains, sucré-salé et boissons fraîches, décoration possible.",
    en: "Group brunch package: pastry and bread buffet, sweet and savoury, cold drinks, themed decoration available.",
  },
  "box-cadeau-events": {
    fr: "Box cadeau personnalisée garnie de viennoiseries et gourmandises, message manuscrit et emballage inclus.",
    en: "Personalised gift box filled with pastries and sweet treats, handwritten message and gift wrap included.",
  },
  "petit-dejeuner-seminaire": {
    fr: "Petit-déjeuner de séminaire : viennoiseries individuelles, café, thé et fruits de saison, service ponctuel.",
    en: "Seminar breakfast package: individual pastries, coffee, tea and seasonal fruit, punctual on-site service.",
  },
};
