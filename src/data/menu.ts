/**
 * Vanisca Restaurant — Menu data (single source of truth).
 * Prices are in Moroccan Dirhams (DH). Strings are localized FR / EN / AR.
 * Edit this file (or a future CMS/DB) to update the menu site-wide.
 */

export type MenuLocale = "fr" | "en" | "ar";
export type Localized = Record<MenuLocale, string>;
export type MenuTag = "signature" | "seafood" | "vegetarian" | "spicy";

export interface MenuItem {
  id: string;
  name: Localized;
  description?: Localized;
  price: number;
  tags?: MenuTag[];
}

export interface MenuCategory {
  /** Matches a key under `menu.categories` in the message files. */
  id: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    id: "starters-cold",
    items: [
      {
        id: "fantasia-legumes",
        name: {
          fr: "Fantasia de légumes grillés",
          en: "Grilled vegetable fantasia",
          ar: "فانتازيا خضار مشوية",
        },
        description: {
          fr: "Courgette, aubergine, trois poivrons, tomate confite, champignons, brocolis, sauce vinaigrette, haricot vert.",
          en: "Courgette, aubergine, three peppers, confit tomato, mushrooms, broccoli, vinaigrette, green beans.",
          ar: "كوسة، باذنجان، ثلاثة فلفل، طماطم مُحمّرة، فطر، بروكلي، صلصة الفيناغريت، فاصولياء خضراء.",
        },
        price: 60,
        tags: ["vegetarian"],
      },
      {
        id: "tomate-mozzarella",
        name: {
          fr: "Salade tomate mozzarella",
          en: "Tomato & mozzarella salad",
          ar: "سلطة طماطم وموتزاريلا",
        },
        description: {
          fr: "Tomate, mozzarella, sauce pesto.",
          en: "Tomato, mozzarella, pesto sauce.",
          ar: "طماطم، موتزاريلا، صلصة بيستو.",
        },
        price: 70,
        tags: ["vegetarian"],
      },
      {
        id: "avocat-crevettes",
        name: {
          fr: "Salade d'avocat et crevettes",
          en: "Avocado & shrimp salad",
          ar: "سلطة أفوكادو وقريدس",
        },
        description: {
          fr: "Mesculin de salade, avocat, crevettes, sauce cocktail.",
          en: "Mixed greens, avocado, shrimp, cocktail sauce.",
          ar: "خضار ورقية مشكّلة، أفوكادو، قريدس، صلصة كوكتيل.",
        },
        price: 70,
        tags: ["seafood"],
      },
      {
        id: "cesar-gambas",
        name: {
          fr: "Salade César gambas",
          en: "Caesar salad with prawns",
          ar: "سلطة سيزر بالقريدس",
        },
        description: {
          fr: "Laitue, poulet pané, gambas pané, croûton à l'ail, tomate confite, avocat, parmesan, anchois, sauce César.",
          en: "Lettuce, breaded chicken, breaded prawns, garlic croutons, confit tomato, avocado, parmesan, anchovies, Caesar dressing.",
          ar: "خس، دجاج مقرمش، قريدس مقرمش، خبز محمّص بالثوم، طماطم مُحمّرة، أفوكادو، بارميزان، أنشوفة، صلصة سيزر.",
        },
        price: 70,
        tags: ["seafood"],
      },
      {
        id: "salade-vanisca",
        name: {
          fr: "Salade Vanisca",
          en: "Vanisca salad",
          ar: "سلطة فانيسكا",
        },
        description: {
          fr: "Quinoa, haricot vert, tomate cerise, olives, féta, gambas, mangue, œufs de caille, avocat, amandes, kiwi, ananas, sauce verte.",
          en: "Quinoa, green beans, cherry tomato, olives, feta, prawns, mango, quail eggs, avocado, almonds, kiwi, pineapple, green sauce.",
          ar: "كينوا، فاصولياء خضراء، طماطم كرزية، زيتون، فيتا، قريدس، مانجو، بيض السمان، أفوكادو، لوز، كيوي، أناناس، صلصة خضراء.",
        },
        price: 80,
        tags: ["signature", "seafood"],
      },
      {
        id: "salade-fruits-mer",
        name: {
          fr: "Salade fruits de mer",
          en: "Seafood salad",
          ar: "سلطة مأكولات بحرية",
        },
        description: {
          fr: "Mesculin de salade, poulpe, crevettes, seiche, moules, gambas, ail, brunoise de poivron, sauce vinaigrette.",
          en: "Mixed greens, octopus, shrimp, cuttlefish, mussels, prawns, garlic, diced pepper, vinaigrette.",
          ar: "خضار ورقية مشكّلة، أخطبوط، قريدس، حبّار، بلح البحر، جمبري، ثوم، فلفل مقطّع، صلصة فيناغريت.",
        },
        price: 85,
        tags: ["seafood"],
      },
    ],
  },
  {
    id: "starters-hot",
    items: [
      {
        id: "gratin-aubergines",
        name: {
          fr: "Gratin d'aubergines au parmesan",
          en: "Aubergine parmesan gratin",
          ar: "غراتان الباذنجان بالبارميزان",
        },
        price: 50,
        tags: ["vegetarian"],
      },
      {
        id: "croustini-chevre",
        name: {
          fr: "Croustini chèvre chaud au miel",
          en: "Warm goat cheese croustini with honey",
          ar: "كروستيني بجبن الماعز الساخن والعسل",
        },
        price: 65,
        tags: ["vegetarian"],
      },
      {
        id: "brochettes-gambas",
        name: {
          fr: "Brochettes gambas au romarin",
          en: "Prawn skewers with rosemary",
          ar: "أسياخ قريدس بإكليل الجبل",
        },
        price: 70,
        tags: ["seafood"],
      },
      {
        id: "poulpe-provencale",
        name: {
          fr: "Poulpe braisé à la provençale",
          en: "Braised octopus à la provençale",
          ar: "أخطبوط مطهو على الطريقة البروفنسالية",
        },
        price: 75,
        tags: ["seafood"],
      },
      {
        id: "crevettes-pilpil",
        name: {
          fr: "Poêlée crevettes pil pil / provençale",
          en: "Pan-fried shrimp pil pil / provençale",
          ar: "قريدس مقلي بيل بيل / بروفنسال",
        },
        price: 75,
        tags: ["seafood", "spicy"],
      },
      {
        id: "gratin-fruits-mer",
        name: {
          fr: "Gratin fruit de mer",
          en: "Seafood gratin",
          ar: "غراتان المأكولات البحرية",
        },
        price: 80,
        tags: ["seafood"],
      },
    ],
  },
  {
    id: "soup",
    items: [
      {
        id: "soupe-oignon",
        name: { fr: "Soupe à l'oignon", en: "Onion soup", ar: "شوربة البصل" },
        price: 50,
        tags: ["vegetarian"],
      },
      {
        id: "creme-legumes",
        name: {
          fr: "Crème de légumes",
          en: "Cream of vegetables",
          ar: "شوربة كريمة الخضار",
        },
        price: 50,
        tags: ["vegetarian"],
      },
      {
        id: "soupe-poisson",
        name: {
          fr: "Soupe de poisson",
          en: "Fish soup",
          ar: "شوربة السمك",
        },
        price: 75,
        tags: ["seafood"],
      },
    ],
  },
  {
    id: "pasta",
    items: [
      {
        id: "pomodoro",
        name: { fr: "Pomodoro", en: "Pomodoro", ar: "بومودورو" },
        description: {
          fr: "Sauce tomate, ail, tomate cerise, parmesan.",
          en: "Tomato sauce, garlic, cherry tomato, parmesan.",
          ar: "صلصة طماطم، ثوم، طماطم كرزية، بارميزان.",
        },
        price: 60,
        tags: ["vegetarian"],
      },
      {
        id: "arrabiata",
        name: { fr: "All'Arrabbiata", en: "All'Arrabbiata", ar: "أرابياتا" },
        description: {
          fr: "Sauce tomate, piment, ail, huile d'olive, basilic, parmesan.",
          en: "Tomato sauce, chilli, garlic, olive oil, basil, parmesan.",
          ar: "صلصة طماطم، فلفل حار، ثوم، زيت الزيتون، ريحان، بارميزان.",
        },
        price: 70,
        tags: ["vegetarian", "spicy"],
      },
      {
        id: "verdura",
        name: { fr: "Verdura", en: "Verdura", ar: "فيردورا" },
        description: {
          fr: "Sauce pesto, courgettes, champignons, basilic, parmesan.",
          en: "Pesto sauce, courgettes, mushrooms, basil, parmesan.",
          ar: "صلصة بيستو، كوسة، فطر، ريحان، بارميزان.",
        },
        price: 70,
        tags: ["vegetarian"],
      },
      {
        id: "al-tonno",
        name: { fr: "Al Tonno", en: "Al Tonno", ar: "آل تونو" },
        description: {
          fr: "Sauce tomate, thon, olives noires, basilic, parmesan.",
          en: "Tomato sauce, tuna, black olives, basil, parmesan.",
          ar: "صلصة طماطم، تونة، زيتون أسود، ريحان، بارميزان.",
        },
        price: 70,
        tags: ["seafood"],
      },
      {
        id: "alfredo",
        name: { fr: "Alfredo", en: "Alfredo", ar: "ألفريدو" },
        description: {
          fr: "Sauce Alfredo, poulet, champignons, parmesan.",
          en: "Alfredo sauce, chicken, mushrooms, parmesan.",
          ar: "صلصة ألفريدو، دجاج، فطر، بارميزان.",
        },
        price: 70,
      },
      {
        id: "carbonara",
        name: { fr: "Carbonara", en: "Carbonara", ar: "كاربونارا" },
        description: {
          fr: "Bacon de bœuf, sauce carbonara, parmesan.",
          en: "Beef bacon, carbonara sauce, parmesan.",
          ar: "بيكون لحم البقر، صلصة كاربونارا، بارميزان.",
        },
        price: 75,
      },
      {
        id: "al-tartufo",
        name: { fr: "Al Tartufo", en: "Al Tartufo", ar: "آل تارتوفو" },
        description: {
          fr: "Crème de truffe, champignons, parmesan, huile de truffe.",
          en: "Truffle cream, mushrooms, parmesan, truffle oil.",
          ar: "كريمة الكمأة، فطر، بارميزان، زيت الكمأة.",
        },
        price: 75,
        tags: ["vegetarian", "signature"],
      },
      {
        id: "bolognaise",
        name: { fr: "Bolognaise", en: "Bolognese", ar: "بولونيز" },
        description: {
          fr: "Sauce bolognaise, basilic, parmesan.",
          en: "Bolognese sauce, basil, parmesan.",
          ar: "صلصة بولونيز، ريحان، بارميزان.",
        },
        price: 85,
      },
      {
        id: "cinque-formaggi",
        name: { fr: "Cinque Formaggi", en: "Cinque Formaggi", ar: "خمسة أجبان" },
        description: {
          fr: "Crème de parmesan, gorgonzola, ricotta, chèvre, parmesan.",
          en: "Parmesan cream, gorgonzola, ricotta, goat cheese, parmesan.",
          ar: "كريمة بارميزان، غورغونزولا، ريكوتا، جبن الماعز، بارميزان.",
        },
        price: 85,
        tags: ["vegetarian"],
      },
      {
        id: "pesto-gambas",
        name: { fr: "Pesto Gambas", en: "Pesto Prawns", ar: "بيستو بالقريدس" },
        description: {
          fr: "Sauce pesto, gambas, parmesan.",
          en: "Pesto sauce, prawns, parmesan.",
          ar: "صلصة بيستو، قريدس، بارميزان.",
        },
        price: 90,
        tags: ["seafood"],
      },
      {
        id: "mare-rosa",
        name: { fr: "Mare Rosa", en: "Mare Rosa", ar: "ماري روزا" },
        description: {
          fr: "Sauce rose, calamar, gambas, basilic, parmesan.",
          en: "Pink sauce, calamari, prawns, basil, parmesan.",
          ar: "صلصة وردية، كاليماري، قريدس، ريحان، بارميزان.",
        },
        price: 90,
        tags: ["seafood"],
      },
      {
        id: "al-salmone",
        name: { fr: "Al Salmone", en: "Al Salmone", ar: "آل سالموني" },
        description: {
          fr: "Sauce rose, saumon fumé, basilic, parmesan.",
          en: "Pink sauce, smoked salmon, basil, parmesan.",
          ar: "صلصة وردية، سلمون مدخّن، ريحان، بارميزان.",
        },
        price: 90,
        tags: ["seafood"],
      },
      {
        id: "frutti-di-mare-pasta",
        name: { fr: "Frutti di Mare", en: "Frutti di Mare", ar: "فروتي دي ماري" },
        description: {
          fr: "Calamar, crevettes, huile d'olive, tomate cerise, ail, parmesan.",
          en: "Calamari, shrimp, olive oil, cherry tomato, garlic, parmesan.",
          ar: "كاليماري، قريدس، زيت الزيتون، طماطم كرزية، ثوم، بارميزان.",
        },
        price: 90,
        tags: ["seafood"],
      },
    ],
  },
  {
    id: "calzone",
    items: [
      {
        id: "calzone-tonno",
        name: { fr: "Calzone Tonno", en: "Tonno Calzone", ar: "كالزوني تونو" },
        description: {
          fr: "Sauce tomate, mozzarella, thon, basilic.",
          en: "Tomato sauce, mozzarella, tuna, basil.",
          ar: "صلصة طماطم، موتزاريلا، تونة، ريحان.",
        },
        price: 80,
        tags: ["seafood"],
      },
      {
        id: "calzone-charcuterie",
        name: {
          fr: "Calzone Charcuterie",
          en: "Charcuterie Calzone",
          ar: "كالزوني شاركوتيري",
        },
        description: {
          fr: "Crème de parmesan, mozzarella, jambon de dinde, champignons.",
          en: "Parmesan cream, mozzarella, turkey ham, mushrooms.",
          ar: "كريمة بارميزان، موتزاريلا، لحم الديك الرومي، فطر.",
        },
        price: 80,
      },
      {
        id: "calzone-pollo",
        name: { fr: "Calzone Pollo", en: "Pollo Calzone", ar: "كالزوني بولو" },
        description: {
          fr: "Crème de parmesan, mozzarella, poulet, champignons.",
          en: "Parmesan cream, mozzarella, chicken, mushrooms.",
          ar: "كريمة بارميزان، موتزاريلا، دجاج، فطر.",
        },
        price: 80,
      },
      {
        id: "calzone-vanisca",
        name: { fr: "Calzone Vanisca", en: "Vanisca Calzone", ar: "كالزوني فانيسكا" },
        price: 90,
        tags: ["signature"],
      },
    ],
  },
  {
    id: "risotto",
    items: [
      {
        id: "risotto-truffe",
        name: {
          fr: "Risotto crème de truffe noire",
          en: "Black truffle cream risotto",
          ar: "ريزوتو كريمة الكمأة السوداء",
        },
        price: 90,
        tags: ["vegetarian", "signature"],
      },
      {
        id: "risotto-champignons",
        name: {
          fr: "Risotto aux trois champignons",
          en: "Three-mushroom risotto",
          ar: "ريزوتو بثلاثة أنواع فطر",
        },
        price: 90,
        tags: ["vegetarian"],
      },
      {
        id: "risotto-poulet",
        name: {
          fr: "Risotto poulet (roquefort ou champignons)",
          en: "Chicken risotto (roquefort or mushroom)",
          ar: "ريزوتو الدجاج (روكفور أو فطر)",
        },
        price: 90,
      },
      {
        id: "risotto-gambas",
        name: {
          fr: "Risotto gambas au romarin",
          en: "Prawn risotto with rosemary",
          ar: "ريزوتو القريدس بإكليل الجبل",
        },
        price: 120,
        tags: ["seafood"],
      },
      {
        id: "risotto-fruits-mer",
        name: {
          fr: "Risotto fruit de mer",
          en: "Seafood risotto",
          ar: "ريزوتو المأكولات البحرية",
        },
        description: {
          fr: "Calamar, gambas, poisson blanc.",
          en: "Calamari, prawns, white fish.",
          ar: "كاليماري، قريدس، سمك أبيض.",
        },
        price: 120,
        tags: ["seafood"],
      },
      {
        id: "risotto-saumon",
        name: {
          fr: "Risotto saumon",
          en: "Salmon risotto",
          ar: "ريزوتو السلمون",
        },
        price: 120,
        tags: ["seafood"],
      },
    ],
  },
  {
    id: "lasagne",
    items: [
      {
        id: "lasagne-bolognaise",
        name: {
          fr: "Lasagne Bolognaise",
          en: "Bolognese lasagne",
          ar: "لازانيا بولونيز",
        },
        price: 90,
      },
      {
        id: "lasagne-fruits-mer",
        name: {
          fr: "Lasagne fruit de mer & épinards",
          en: "Seafood & spinach lasagne",
          ar: "لازانيا بالمأكولات البحرية والسبانخ",
        },
        price: 100,
        tags: ["seafood"],
      },
      {
        id: "lasagne-saumon",
        name: {
          fr: "Lasagne saumon & épinards",
          en: "Salmon & spinach lasagne",
          ar: "لازانيا بالسلمون والسبانخ",
        },
        price: 100,
        tags: ["seafood"],
      },
    ],
  },
  {
    id: "meat",
    items: [
      {
        id: "meli-melo",
        name: {
          fr: "Méli mélo bœuf & poulet",
          en: "Beef & chicken medley",
          ar: "تشكيلة لحم البقر والدجاج",
        },
        description: {
          fr: "Sauce au choix.",
          en: "Sauce of your choice.",
          ar: "صلصة حسب الاختيار.",
        },
        price: 130,
      },
      {
        id: "emince-boeuf",
        name: {
          fr: "Émincé de filet de bœuf",
          en: "Sliced beef fillet",
          ar: "شرائح فيليه لحم البقر",
        },
        description: {
          fr: "Sauce au choix.",
          en: "Sauce of your choice.",
          ar: "صلصة حسب الاختيار.",
        },
        price: 130,
      },
      {
        id: "entrecote",
        name: {
          fr: "Entrecôte de bœuf bordelaise",
          en: "Beef entrecôte bordelaise",
          ar: "أنتركوت لحم البقر بصلصة بوردليز",
        },
        price: 150,
      },
      {
        id: "medaillon-veau",
        name: {
          fr: "Médaillon de filet de veau aux trois champignons",
          en: "Veal fillet medallion, three mushrooms",
          ar: "ميدالية فيليه العجل بثلاثة أنواع فطر",
        },
        price: 160,
      },
      {
        id: "filet-mignon",
        name: {
          fr: "Filet mignon de veau",
          en: "Veal filet mignon",
          ar: "فيليه مينيون العجل",
        },
        description: {
          fr: "Sauce au choix : trois champignons, poivre, roquefort…",
          en: "Sauce of your choice: three mushrooms, pepper, roquefort…",
          ar: "صلصة حسب الاختيار: ثلاثة فطر، فلفل، روكفور…",
        },
        price: 180,
        tags: ["signature"],
      },
      {
        id: "souris-agneau",
        name: {
          fr: "Souris d'agneau confite",
          en: "Confit lamb shank",
          ar: "موزة الخروف المطهوة ببطء",
        },
        price: 190,
        tags: ["signature"],
      },
    ],
  },
  {
    id: "chicken",
    items: [
      {
        id: "emince-poulet",
        name: {
          fr: "Émincé de poulet",
          en: "Sliced chicken",
          ar: "شرائح الدجاج",
        },
        description: {
          fr: "Moutarde à l'ancienne ou champignons.",
          en: "Wholegrain mustard or mushroom.",
          ar: "خردل تقليدي أو فطر.",
        },
        price: 100,
      },
      {
        id: "pollo-parmigiana",
        name: {
          fr: "Pollo Parmigiana",
          en: "Pollo Parmigiana",
          ar: "بولو بارميجانا",
        },
        description: {
          fr: "Poulet pané, sauce tomate et fromage gratiné.",
          en: "Breaded chicken, tomato sauce, gratinated cheese.",
          ar: "دجاج مقرمش، صلصة طماطم وجبن غراتان.",
        },
        price: 100,
      },
      {
        id: "poulet-farci",
        name: {
          fr: "Blanc de poulet farci épinard & ricotta",
          en: "Chicken breast stuffed with spinach & ricotta",
          ar: "صدر دجاج محشو بالسبانخ والريكوتا",
        },
        price: 100,
      },
    ],
  },
  {
    id: "fish",
    items: [
      {
        id: "brochettes-poisson",
        name: {
          fr: "Brochettes de poisson mariné aux herbes",
          en: "Herb-marinated fish skewers",
          ar: "أسياخ سمك متبّل بالأعشاب",
        },
        price: 130,
        tags: ["seafood"],
      },
      {
        id: "saint-pierre",
        name: {
          fr: "Saint-Pierre à la Normande",
          en: "John Dory à la Normande",
          ar: "سمك سان بيير على الطريقة النورماندية",
        },
        price: 140,
        tags: ["seafood"],
      },
      {
        id: "gambas-charmoula",
        name: {
          fr: "Gambas à la charmoula",
          en: "Prawns in chermoula",
          ar: "قريدس بالشرمولة",
        },
        price: 140,
        tags: ["seafood"],
      },
      {
        id: "poelee-pecheur",
        name: {
          fr: "Poêlée pêcheur à la provençale",
          en: "Fisherman's pan à la provençale",
          ar: "طبق الصياد على الطريقة البروفنسالية",
        },
        price: 140,
        tags: ["seafood"],
      },
      {
        id: "calamar-saute",
        name: {
          fr: "Calamar sauté à l'ail, persil et citron",
          en: "Calamari sautéed with garlic, parsley & lemon",
          ar: "كاليماري مقلي بالثوم والبقدونس والليمون",
        },
        price: 140,
        tags: ["seafood"],
      },
      {
        id: "pave-saumon",
        name: {
          fr: "Pavé de saumon beurre citron",
          en: "Salmon fillet, lemon butter",
          ar: "فيليه سلمون بزبدة الليمون",
        },
        price: 150,
        tags: ["seafood"],
      },
      {
        id: "trio-poisson",
        name: {
          fr: "Trio de poisson grillé / provençale",
          en: "Grilled fish trio / provençale",
          ar: "ثلاثية السمك المشوي / بروفنسال",
        },
        price: 170,
        tags: ["seafood"],
      },
      {
        id: "paupiette-sole",
        name: {
          fr: "Paupiette de sole aux gambas",
          en: "Sole paupiette with prawns",
          ar: "لفائف سمك موسى بالقريدس",
        },
        price: 170,
        tags: ["seafood"],
      },
      {
        id: "marmite-poisson",
        name: {
          fr: "Marmite de poisson printanière",
          en: "Spring fish pot",
          ar: "طاجن السمك الربيعي",
        },
        price: 190,
        tags: ["seafood"],
      },
      {
        id: "assortiment-vanisca",
        name: {
          fr: "Assortiment de poisson grillé Vanisca",
          en: "Vanisca grilled fish assortment",
          ar: "تشكيلة السمك المشوي فانيسكا",
        },
        price: 200,
        tags: ["seafood", "signature"],
      },
    ],
  },
  {
    id: "pizza",
    items: [
      {
        id: "margarita",
        name: { fr: "Margarita", en: "Margherita", ar: "مارغريتا" },
        description: {
          fr: "Sauce tomate, mozzarella, basilic.",
          en: "Tomato sauce, mozzarella, basil.",
          ar: "صلصة طماطم، موتزاريلا، ريحان.",
        },
        price: 70,
        tags: ["vegetarian"],
      },
      {
        id: "ortolino",
        name: { fr: "Ortolino", en: "Ortolino", ar: "أورتولينو" },
        description: {
          fr: "Sauce tomate, mozzarella, aubergine, courgettes, poivron, champignons, olives, roquette.",
          en: "Tomato sauce, mozzarella, aubergine, courgettes, pepper, mushrooms, olives, rocket.",
          ar: "صلصة طماطم، موتزاريلا، باذنجان، كوسة، فلفل، فطر، زيتون، جرجير.",
        },
        price: 80,
        tags: ["vegetarian"],
      },
      {
        id: "tunara",
        name: { fr: "Tunara", en: "Tunara", ar: "تونارا" },
        description: {
          fr: "Sauce tomate, mozzarella, thon, olives, oignons, basilic.",
          en: "Tomato sauce, mozzarella, tuna, olives, onions, basil.",
          ar: "صلصة طماطم، موتزاريلا، تونة، زيتون، بصل، ريحان.",
        },
        price: 80,
        tags: ["seafood"],
      },
      {
        id: "portofino",
        name: { fr: "Portofino", en: "Portofino", ar: "بورتوفينو" },
        description: {
          fr: "Sauce tomate, viande hachée, mozzarella, champignons.",
          en: "Tomato sauce, minced meat, mozzarella, mushrooms.",
          ar: "صلصة طماطم، لحم مفروم، موتزاريلا، فطر.",
        },
        price: 85,
      },
      {
        id: "pepperoni",
        name: { fr: "Pepperoni", en: "Pepperoni", ar: "بيبروني" },
        description: {
          fr: "Sauce tomate, pepperoni, mozzarella, basilic.",
          en: "Tomato sauce, pepperoni, mozzarella, basil.",
          ar: "صلصة طماطم، بيبروني، موتزاريلا، ريحان.",
        },
        price: 85,
        tags: ["spicy"],
      },
      {
        id: "quattro-formaggi",
        name: { fr: "Quattro Formaggi", en: "Quattro Formaggi", ar: "أربعة أجبان" },
        description: {
          fr: "Crème de parmesan, mozzarella, gorgonzola, chèvre, parmesan, roquette.",
          en: "Parmesan cream, mozzarella, gorgonzola, goat cheese, parmesan, rocket.",
          ar: "كريمة بارميزان، موتزاريلا، غورغونزولا، جبن الماعز، بارميزان، جرجير.",
        },
        price: 85,
        tags: ["vegetarian"],
      },
      {
        id: "funghi",
        name: { fr: "Funghi", en: "Funghi", ar: "فونغي" },
        description: {
          fr: "Crème de parmesan, mozzarella, champignons, huile de truffe, parmesan.",
          en: "Parmesan cream, mozzarella, mushrooms, truffle oil, parmesan.",
          ar: "كريمة بارميزان، موتزاريلا، فطر، زيت الكمأة، بارميزان.",
        },
        price: 85,
        tags: ["vegetarian"],
      },
      {
        id: "pizza-pollo",
        name: { fr: "Pollo", en: "Pollo", ar: "بولو" },
        description: {
          fr: "Crème de parmesan, poulet, champignons, roquette, parmesan.",
          en: "Parmesan cream, chicken, mushrooms, rocket, parmesan.",
          ar: "كريمة بارميزان، دجاج، فطر، جرجير، بارميزان.",
        },
        price: 85,
      },
      {
        id: "beef-amore",
        name: { fr: "Beef Amore", en: "Beef Amore", ar: "بيف أموري" },
        description: {
          fr: "Crème de parmesan, mozzarella, champignons, viande hachée, jambon de bœuf, roquette, parmesan.",
          en: "Parmesan cream, mozzarella, mushrooms, minced meat, beef ham, rocket, parmesan.",
          ar: "كريمة بارميزان، موتزاريلا، فطر، لحم مفروم، لحم بقري، جرجير، بارميزان.",
        },
        price: 90,
      },
      {
        id: "salmone-pizza",
        name: { fr: "Salmone", en: "Salmone", ar: "سالموني" },
        description: {
          fr: "Crème de parmesan, mozzarella, saumon fumé, avocat, parmesan, roquette.",
          en: "Parmesan cream, mozzarella, smoked salmon, avocado, parmesan, rocket.",
          ar: "كريمة بارميزان، موتزاريلا، سلمون مدخّن، أفوكادو، بارميزان، جرجير.",
        },
        price: 100,
        tags: ["seafood", "signature"],
      },
      {
        id: "frutti-di-mare-pizza",
        name: { fr: "Frutti di Mare", en: "Frutti di Mare", ar: "فروتي دي ماري" },
        description: {
          fr: "Sauce tomate, mozzarella, crevettes, seiche, poulpe, basilic, olives.",
          en: "Tomato sauce, mozzarella, shrimp, cuttlefish, octopus, basil, olives.",
          ar: "صلصة طماطم، موتزاريلا، قريدس، حبّار، أخطبوط، ريحان، زيتون.",
        },
        price: 100,
        tags: ["seafood"],
      },
    ],
  },
  {
    id: "juice",
    items: [
      { id: "jus-orange", name: { fr: "Jus d'orange", en: "Orange juice", ar: "عصير برتقال" }, price: 30 },
      { id: "jus-carotte", name: { fr: "Jus de carotte", en: "Carrot juice", ar: "عصير جزر" }, price: 30 },
      { id: "jus-betterave", name: { fr: "Jus de betterave", en: "Beetroot juice", ar: "عصير شمندر" }, price: 30 },
      { id: "jus-pomme", name: { fr: "Jus de pomme", en: "Apple juice", ar: "عصير تفاح" }, price: 30 },
      { id: "jus-banane", name: { fr: "Jus de banane", en: "Banana juice", ar: "عصير موز" }, price: 30 },
      { id: "jus-citron", name: { fr: "Jus de citron", en: "Lemon juice", ar: "عصير ليمون" }, price: 30 },
      { id: "jus-kiwi", name: { fr: "Jus de kiwi", en: "Kiwi juice", ar: "عصير كيوي" }, price: 35 },
      { id: "jus-fraise", name: { fr: "Jus de fraise", en: "Strawberry juice", ar: "عصير فراولة" }, price: 35 },
      { id: "jus-ananas", name: { fr: "Jus d'ananas", en: "Pineapple juice", ar: "عصير أناناس" }, price: 35 },
      { id: "jus-mangue", name: { fr: "Jus de mangue", en: "Mango juice", ar: "عصير مانجو" }, price: 35 },
      { id: "panache", name: { fr: "Panaché", en: "Mixed juice", ar: "عصير مشكّل" }, price: 40 },
      { id: "jus-avocat", name: { fr: "Jus d'avocat aux fruits secs", en: "Avocado juice with nuts", ar: "عصير أفوكادو بالمكسرات" }, price: 40 },
    ],
  },
  {
    id: "smoothies",
    items: [
      {
        id: "happy-juice",
        name: { fr: "Happy Juice", en: "Happy Juice", ar: "هابي جوس" },
        description: { fr: "Mangue, banane, chia, yaourt.", en: "Mango, banana, chia, yoghurt.", ar: "مانجو، موز، شيا، زبادي." },
        price: 35,
      },
      {
        id: "sunny",
        name: { fr: "Sunny", en: "Sunny", ar: "ساني" },
        description: { fr: "Ananas, carotte, orange.", en: "Pineapple, carrot, orange.", ar: "أناناس، جزر، برتقال." },
        price: 35,
      },
      {
        id: "happy-pink",
        name: { fr: "Happy Pink", en: "Happy Pink", ar: "هابي بينك" },
        description: { fr: "Fraise ou framboise, banane, yaourt.", en: "Strawberry or raspberry, banana, yoghurt.", ar: "فراولة أو توت، موز، زبادي." },
        price: 35,
      },
      {
        id: "garden-mix",
        name: { fr: "Garden Mix", en: "Garden Mix", ar: "غاردن ميكس" },
        description: { fr: "Avocat, kiwi, banane, épinard, orange.", en: "Avocado, kiwi, banana, spinach, orange.", ar: "أفوكادو، كيوي، موز، سبانخ، برتقال." },
        price: 35,
      },
      {
        id: "exotique",
        name: { fr: "Exotique", en: "Exotic", ar: "إكزوتيك" },
        description: { fr: "Mangue, ananas, papaye, orange.", en: "Mango, pineapple, papaya, orange.", ar: "مانجو، أناناس، بابايا، برتقال." },
        price: 35,
      },
      {
        id: "antidote",
        name: { fr: "Antidote", en: "Antidote", ar: "أنتيدوت" },
        description: { fr: "Ananas, épinard, pomme, citron, gingembre, orange.", en: "Pineapple, spinach, apple, lemon, ginger, orange.", ar: "أناناس، سبانخ، تفاح، ليمون، زنجبيل، برتقال." },
        price: 35,
      },
      {
        id: "bahama",
        name: { fr: "Bahama", en: "Bahama", ar: "باهاما" },
        description: { fr: "Mangue, ananas, papaye, fraise ou framboise, orange.", en: "Mango, pineapple, papaya, strawberry or raspberry, orange.", ar: "مانجو، أناناس، بابايا، فراولة أو توت، برتقال." },
        price: 35,
      },
      {
        id: "mango-banana",
        name: { fr: "Mango Banana", en: "Mango Banana", ar: "مانجو موز" },
        description: { fr: "Mangue, ananas, banane, orange.", en: "Mango, pineapple, banana, orange.", ar: "مانجو، أناناس، موز، برتقال." },
        price: 40,
      },
      {
        id: "booster",
        name: { fr: "Booster", en: "Booster", ar: "بوستر" },
        description: { fr: "Mangue, banane, ananas, framboise, lait, yaourt.", en: "Mango, banana, pineapple, raspberry, milk, yoghurt.", ar: "مانجو، موز، أناناس، توت، حليب، زبادي." },
        price: 40,
      },
      {
        id: "sunshine",
        name: { fr: "Sunshine", en: "Sunshine", ar: "صن شاين" },
        description: { fr: "Ananas, pomme, orange, gingembre, citron.", en: "Pineapple, apple, orange, ginger, lemon.", ar: "أناناس، تفاح، برتقال، زنجبيل، ليمون." },
        price: 40,
      },
    ],
  },
  {
    id: "drinks",
    items: [
      { id: "sidi-ali-33", name: { fr: "Sidi Ali 33cl", en: "Sidi Ali 33cl", ar: "سيدي علي 33 سل" }, price: 15 },
      { id: "eau-50", name: { fr: "Eau minérale 50cl", en: "Mineral water 50cl", ar: "مياه معدنية 50 سل" }, price: 20 },
      { id: "eau-75", name: { fr: "Eau minérale 75cl", en: "Mineral water 75cl", ar: "مياه معدنية 75 سل" }, price: 25 },
      { id: "oulmes-25", name: { fr: "Oulmès 25cl", en: "Oulmès 25cl", ar: "أولماس 25 سل" }, price: 25 },
      { id: "oulmes-1l", name: { fr: "Oulmès 1L", en: "Oulmès 1L", ar: "أولماس 1 لتر" }, price: 25 },
      { id: "soda", name: { fr: "Soda 35cl", en: "Soda 35cl", ar: "صودا 35 سل" }, price: 20 },
      { id: "cafe-nespresso", name: { fr: "Café Nespresso", en: "Nespresso coffee", ar: "قهوة نسبريسو" }, price: 25 },
    ],
  },
  {
    id: "desserts",
    items: [
      {
        id: "tiramisu",
        name: { fr: "Tiramisu Classic", en: "Classic Tiramisu", ar: "تيراميسو كلاسيك" },
        price: 40,
      },
      {
        id: "creme-brulee",
        name: {
          fr: "Crème brûlée vanille de Bourbon",
          en: "Bourbon vanilla crème brûlée",
          ar: "كريم بروليه بفانيليا بوربون",
        },
        price: 50,
      },
      {
        id: "fondant-chocolat",
        name: {
          fr: "Fondant chocolat, boule de glace",
          en: "Chocolate fondant with ice cream",
          ar: "فوندان شوكولاتة مع كرة آيس كريم",
        },
        price: 50,
      },
      {
        id: "fondant-pistache",
        name: {
          fr: "Fondant pistache, boule de glace",
          en: "Pistachio fondant with ice cream",
          ar: "فوندان فستق مع كرة آيس كريم",
        },
        price: 50,
      },
      {
        id: "cheesecake",
        name: {
          fr: "Cheesecake San Sebastián",
          en: "San Sebastián cheesecake",
          ar: "تشيز كيك سان سيباستيان",
        },
        price: 60,
        tags: ["signature"],
      },
    ],
  },
];

/** Convenience: a flat list of signature dishes for the homepage. */
export const signatureItems = menu
  .flatMap((c) => c.items)
  .filter((i) => i.tags?.includes("signature"));
