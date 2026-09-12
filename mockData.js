// Curated Luxury & Contemporary Fashion Catalog for FitSwipe MVP

const MOCK_CATALOG = {
  outerwear: [
    {
      id: "out-1",
      name: "Florence Oversized Wool Trench",
      brand: "KHAITE",
      category: "outerwear",
      price: 640,
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=700&q=80",
      sku: "KH-FLR-902",
      sizes: ["XS", "S", "M", "L"],
      color: "Sandstone Beige",
      material: "100% Virgin Wool",
      tags: ["quiet-luxury", "minimalist", "classic"],
      rationale: "Balances your sleek silhouette with an architectural drape suited for NYC evening temps."
    },
    {
      id: "out-2",
      name: "Washed Lambskin Moto Jacket",
      brand: "ACNE STUDIOS",
      category: "outerwear",
      price: 580,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80",
      sku: "AC-MTO-340",
      sizes: ["36", "38", "40", "42"],
      color: "Deep Burgundy",
      material: "100% Washed Lambskin",
      tags: ["edgy", "downtown", "statement"],
      rationale: "Injected rich burgundy tones to contrast against the neutral base, giving an effortless downtown edge."
    },
    {
      id: "out-3",
      name: "Structured Double-Breasted Blazer",
      brand: "COS ATELIER",
      category: "outerwear",
      price: 220,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=80",
      sku: "COS-ATL-118",
      sizes: ["XS", "S", "M", "L"],
      color: "Charcoal Melange",
      material: "Recycled Wool Blend",
      tags: ["budget-friendly", "minimalist", "tailored"],
      rationale: "Sharp tailored lines that capture the The Row aesthetic at an accessible price point."
    }
  ],

  tops: [
    {
      id: "top-1",
      name: "Draped Silk Crepe High-Neck Blouse",
      brand: "TOTEME",
      category: "tops",
      price: 340,
      image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=700&q=80",
      sku: "TOT-SLK-401",
      sizes: ["34", "36", "38", "40"],
      color: "Off-White Ivory",
      material: "100% Habotai Silk",
      tags: ["quiet-luxury", "elevated", "evening"],
      rationale: "Echoes the high-neckline detected in your video capture, elevated in heavy silk crepe."
    },
    {
      id: "top-2",
      name: "Sculpted Ribbed Mockneck Knit",
      brand: "ARITZIA (BABATON)",
      category: "tops",
      price: 98,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80",
      sku: "AR-SCPT-092",
      sizes: ["XS", "S", "M", "L"],
      color: "Oatmeal Heather",
      material: "Extra Fine Merino Wool",
      tags: ["budget-friendly", "staple", "cozy"],
      rationale: "Budget-optimized knit maintaining the sculptural collar profile while keeping total under $400."
    },
    {
      id: "top-3",
      name: "Asymmetric Cut-Out Viscose Bodysuit",
      brand: "KOPERNIK",
      category: "tops",
      price: 260,
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80",
      sku: "KOP-ASY-204",
      sizes: ["XS", "S", "M"],
      color: "Midnight Obsidian",
      material: "Stretch Compact Viscose",
      tags: ["edgy", "night-out", "sculptural"],
      rationale: "Brings architectural negative space to transition seamlessly into late-night rooftop drinks."
    }
  ],

  bottoms: [
    {
      id: "bot-1",
      name: "Bea Pleated Wide-Leg Trousers",
      brand: "THE FRANKIE SHOP",
      category: "bottoms",
      price: 215,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80",
      sku: "FS-BEA-703",
      sizes: ["XS", "S", "M", "L"],
      color: "Deep Espresso",
      material: "Poly-Viscose Twill",
      tags: ["quiet-luxury", "tailored", "trending"],
      rationale: "Dramatic puddle drape creates the relaxed, effortless silhouette favored by NYC fashion tastemakers."
    },
    {
      id: "bot-2",
      name: "Relaxed Straight Pleated Chino",
      brand: "MASSIMO DUTTI",
      category: "bottoms",
      price: 119,
      image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=700&q=80",
      sku: "MD-CHIN-551",
      sizes: ["34", "36", "38", "40", "42"],
      color: "Umber Brown",
      material: "100% Lyocell Cotton",
      tags: ["budget-friendly", "casual", "clean"],
      rationale: "Similar relaxed volume and tailored rise at nearly half the price."
    },
    {
      id: "bot-3",
      name: "Slit Column Midi Skirt in Raw Denim",
      brand: "REFORMATION",
      category: "bottoms",
      price: 188,
      image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=700&q=80",
      sku: "REF-SLT-882",
      sizes: ["0", "2", "4", "6", "8"],
      color: "Washed Black",
      material: "Organic Cotton Denim",
      tags: ["edgy", "contemporary", "feminine"],
      rationale: "Adds a textural denim clash against clean tailoring for a curated street-style vibe."
    }
  ],

  shoes: [
    {
      id: "sho-1",
      name: "Neous Sculptural Kitten-Heel Slingbacks",
      brand: "NEOUS",
      category: "shoes",
      price: 395,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80",
      sku: "NE-KTT-512",
      sizes: ["36", "37", "38", "39", "40", "41"],
      color: "Glossy Black Patent",
      material: "Calfskin Leather",
      tags: ["formal", "sculptural", "evening"],
      rationale: "Sharp pointed toe elongates the silhouette beneath wide trousers for evening dining."
    },
    {
      id: "sho-2",
      name: "Soft Leather Penny Loafers",
      brand: "THE ROW (Style Replica)",
      category: "shoes",
      price: 240,
      image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=700&q=80",
      sku: "TR-PNN-109",
      sizes: ["36", "37", "38", "39", "40", "41"],
      color: "Buffed Black Nappa",
      material: "100% Nappa Calfskin",
      tags: ["less-formal", "quiet-luxury", "comfortable"],
      rationale: "Swapped formal heel for effortless leather loafers—downtown comfort without sacrificing luxury polish."
    },
    {
      id: "sho-3",
      name: "990v6 Made in USA Suede Sneakers",
      brand: "NEW BALANCE",
      category: "shoes",
      price: 210,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80",
      sku: "NB-990-GRY",
      sizes: ["6", "7", "8", "9", "10", "11"],
      color: "Castlerock Grey",
      material: "Pigskin & Mesh",
      tags: ["casual", "streetwear", "sporty"],
      rationale: "High-contrast styling: pairs tailored trousers with authentic archival athletic footwear."
    }
  ],

  bags: [
    {
      id: "bag-1",
      name: "Small Cloud Pleated Frame Clutch",
      brand: "MANSUR GAVRIEL",
      category: "bags",
      price: 295,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
      sku: "MG-CLD-301",
      sizes: ["One Size"],
      color: "Warm Biscotto",
      material: "Italian Lambskin",
      tags: ["quiet-luxury", "minimalist", "handheld"],
      rationale: "Soft pillowy texture balances the sharp geometric lines of the outerwear and trousers."
    },
    {
      id: "bag-2",
      name: "Le Chiquito Noeud Mini Bag",
      brand: "JACQUEMUS",
      category: "bags",
      price: 360,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
      sku: "JAQ-CHQ-722",
      sizes: ["One Size"],
      color: "Black Smooth Box Leather",
      material: "Cowhide Leather",
      tags: ["edgy", "statement", "iconic"],
      rationale: "A cult design accent that immediately signals high fashion awareness."
    },
    {
      id: "bag-3",
      name: "Half-Moon Leather Crossbody Bag",
      brand: "ARKET",
      category: "bags",
      price: 135,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",
      sku: "ARK-HMN-440",
      sizes: ["One Size"],
      color: "Dark Chocolate",
      material: "Chrome-Free Tanned Leather",
      tags: ["budget-friendly", "practical", "everyday"],
      rationale: "Sleek sculptural crescent shape with zero visible hardware, under $150."
    }
  ],

  accessories: [
    {
      id: "acc-1",
      name: "Charlotte Bold Sculptural Hoops",
      brand: "MEJURI",
      category: "accessories",
      price: 98,
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=700&q=80",
      sku: "MJ-HOOP-901",
      sizes: ["Standard"],
      color: "14k Gold Vermeil",
      material: "Recycled Sterling Silver & Gold",
      tags: ["quiet-luxury", "jewelry", "timeless"],
      rationale: "Warm metallic accent frames your jawline, complementary to the warm neutral styling palette."
    },
    {
      id: "acc-2",
      name: "Chunky Molten Silver Ear Cuff & Huggie Set",
      brand: "MISSOMA",
      category: "accessories",
      price: 85,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
      sku: "MIS-MLT-332",
      sizes: ["Standard"],
      color: "Liquid Chrome Silver",
      material: "Rhodium Plated Brass",
      tags: ["edgy", "jewelry", "downtown"],
      rationale: "Injects an organic, liquid metal texture that leans into Soho gallery afterparty vibes."
    }
  ]
};

// Preset Initial Curated Looks Deck for Tinder-style Swiping
const CURATED_LOOKS_DECK = [
  {
    id: "look-meatpacking",
    name: "The Meatpacking Skyline",
    subtitle: "Autumn Architectural Minimalist • Curated for Rooftop Evening",
    heroImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
    vibe: "Quiet Luxury / Architectural Chic",
    occasion: "Rooftop Date (Meatpacking)",
    matchScore: 98,
    rationale: "Synthesized your minimalist undertones with structured Khaite wool tailoring, draped Toteme silk, and sleek kitten heels designed for high-altitude NYC evening socializing.",
    items: {
      outerwear: "out-1",
      tops: "top-1",
      bottoms: "bot-1",
      shoes: "sho-1",
      bags: "bag-1",
      accessories: "acc-1"
    },
    hotspots: [
      { category: "outerwear", top: "28%", left: "38%", label: "Khaite Wool Trench • $640" },
      { category: "tops", top: "42%", left: "54%", label: "Toteme Silk Blouse • $340" },
      { category: "bottoms", top: "65%", left: "46%", label: "Frankie Shop Trousers • $215" },
      { category: "shoes", top: "90%", left: "42%", label: "Neous Kitten Heels • $395" },
      { category: "bags", top: "55%", left: "26%", label: "Mansur Gavriel Clutch • $295" }
    ]
  },
  {
    id: "look-soho",
    name: "Downtown SoHo Vernissage",
    subtitle: "Contemporary Art-World Cool • Leather & Relaxed Volume",
    heroImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
    vibe: "Downtown Edgy / Gallery Chic",
    occasion: "SoHo Art Gallery Opening",
    matchScore: 95,
    rationale: "Assembled for art gallery openings: statement Acne Studios burgundy washed leather moto layered over an asymmetric bodysuit, grounded by relaxed tailoring and cult Jacquemus hardware.",
    items: {
      outerwear: "out-2",
      tops: "top-3",
      bottoms: "bot-1",
      shoes: "sho-2",
      bags: "bag-2",
      accessories: "acc-2"
    },
    hotspots: [
      { category: "outerwear", top: "32%", left: "34%", label: "Acne Studios Moto • $580" },
      { category: "tops", top: "46%", left: "52%", label: "Kopernik Cut-Out Bodysuit • $260" },
      { category: "bottoms", top: "68%", left: "48%", label: "Frankie Shop Wide Trousers • $215" },
      { category: "shoes", top: "91%", left: "45%", label: "The Row Nappa Loafers • $240" },
      { category: "bags", top: "54%", left: "68%", label: "Jacquemus Le Chiquito • $360" }
    ]
  },
  {
    id: "look-tribeca",
    name: "Tribeca Candlelight Dinner",
    subtitle: "Monochrome Sleek • Fluid Silk & Architectural Outerwear",
    heroImage: "/images/tribeca_original.jpg",
    burgundyLeatherImage: "/images/tribeca_burgundy_jacket.jpg",
    vibe: "Monochrome Obsidian / Evening Dining",
    occasion: "Downtown Dinner & Cocktails",
    matchScore: 97,
    rationale: "Synthesized for evening dining: tailored Khaite wool coat draped over Toteme habotai silk, structured Frankie Shop trousers, and Missoma molten metal accents.",
    items: {
      outerwear: "out-1",
      tops: "top-1",
      bottoms: "bot-1",
      shoes: "sho-1",
      bags: "bag-2",
      accessories: "acc-2"
    },
    hotspots: [
      { category: "outerwear", top: "44%", left: "54%", label: "Khaite Wool Trench • $640" },
      { category: "tops", top: "48%", left: "52%", label: "Toteme Silk Blouse • $340" },
      { category: "bottoms", top: "72%", left: "48%", label: "Frankie Shop Trousers • $215" },
      { category: "shoes", top: "91%", left: "43%", label: "Neous Kitten Heels • $395" },
      { category: "bags", top: "58%", left: "24%", label: "Jacquemus Mini • $360" }
    ]
  },
  {
    id: "look-highline",
    name: "West Chelsea Highline Flow",
    subtitle: "Modern Tailored Casual • Accessible Minimalist Luxury",
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
    vibe: "Contemporary Tailored / Street Luxury",
    occasion: "Casual West Village Coffee",
    matchScore: 94,
    rationale: "Smart budget-optimized ensemble: COS Atelier double-breasted recycled wool blazer paired with Babaton merino knit, raw-edge denim column skirt, and archival New Balance 990v6.",
    items: {
      outerwear: "out-3",
      tops: "top-2",
      bottoms: "bot-3",
      shoes: "sho-3",
      bags: "bag-3",
      accessories: "acc-1"
    },
    hotspots: [
      { category: "outerwear", top: "34%", left: "42%", label: "COS Atelier Blazer • $220" },
      { category: "tops", top: "45%", left: "52%", label: "Babaton Merino Knit • $98" },
      { category: "bottoms", top: "66%", left: "48%", label: "Reformation Denim Midi • $188" },
      { category: "shoes", top: "92%", left: "44%", label: "New Balance 990v6 • $210" },
      { category: "bags", top: "58%", left: "28%", label: "Arket Half-Moon Bag • $135" }
    ]
  }
];

// Backwards compatibility alias
const DEFAULT_LOOKS = {
  meatpacking: CURATED_LOOKS_DECK[0],
  soho: CURATED_LOOKS_DECK[1],
  tribeca: CURATED_LOOKS_DECK[2],
  highline: CURATED_LOOKS_DECK[3]
};

// Conversational refinement rules

// Demo Video Context Presets (allows judges to test with 1 click without camera)
const DEMO_PRESETS = [
  {
    id: "preset-1",
    name: "NYC Fall Casual (Beige Knit & Denim)",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    detectedPieces: ["Oatmeal Mockneck Sweater", "Straight Vintage Denim", "Minimal Gold Hoops"],
    detectedPalette: ["#E7D8C9", "#2B2D42", "#C9ADA7", "#D4AF37"],
    detectedSilhouette: "Relaxed Boxy Top / Tailored Column Base",
    recommendedOccasion: "Rooftop Date (Meatpacking)"
  },
  {
    id: "preset-2",
    name: "All-Black Soho Minimalist (Turtleneck & Blazer)",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    detectedPieces: ["Black Fitted Ribbed Turtleneck", "Charcoal Wool Trousers", "Silver Hardware"],
    detectedPalette: ["#121214", "#343A40", "#6C757D", "#E9ECEF"],
    detectedSilhouette: "Slim Sleek Top / High-Rise Wide Tailoring",
    recommendedOccasion: "SoHo Art Gallery Opening"
  }
];

// Conversational refinement rules
const REFINEMENT_PRESETS = [
  {
    id: "less-formal-shoes",
    label: "👟 Make shoes less formal",
    query: "make the shoes less formal",
    action: (state) => {
      state.currentLook.items.shoes = "sho-2";
      return {
        message: "Swapped the sculptural kitten heels for The Row-inspired soft nappa leather loafers. The look transitions effortlessly from formal dining to downtown strolling, reducing total outfit price by $155.",
        updatedSlot: "shoes"
      };
    }
  },
  {
    id: "burgundy-jacket",
    label: "🧥 Change jacket to burgundy leather",
    query: "change jacket to burgundy leather",
    action: (state) => {
      state.currentLook.items.outerwear = "out-2";
      return {
        message: "Replaced the wool trench with the Acne Studios Washed Lambskin Moto in Deep Burgundy. This injects rich seasonal color contrast and instant downtown edge.",
        updatedSlot: "outerwear"
      };
    }
  },
  {
    id: "under-400",
    label: "💰 Keep style, but bring under $600",
    query: "keep the vibe but make total under 600",
    action: (state) => {
      state.currentLook.items.outerwear = "out-3"; // COS $220
      state.currentLook.items.tops = "top-2"; // Aritzia $98
      state.currentLook.items.bottoms = "bot-2"; // Massimo Dutti $119
      state.currentLook.items.shoes = "sho-3"; // New Balance $210 or Loafer
      state.currentLook.items.bags = "bag-3"; // Arket $135
      return {
        message: "Smart budget recalculation applied! Swapped luxury outerwear and knitwear for high-craft contemporary pieces (COS Atelier blazer, Babaton knit, Arket leather bag). You preserve the exact same quiet-luxury silhouette while saving $925.",
        updatedSlot: "all"
      };
    }
  },
  {
    id: "more-edgy",
    label: "⚡ Make it more edgy / night out",
    query: "make it more edgy",
    action: (state) => {
      state.currentLook.items.tops = "top-3"; // Kopernik asymmetric $260
      state.currentLook.items.bags = "bag-2"; // Jacquemus $360
      state.currentLook.items.accessories = "acc-2"; // Missoma molten silver $85
      return {
        message: "Amplified the night-out aesthetic: swapped the ivory blouse for Kopernik's asymmetric cut-out bodysuit, added Jacquemus sculptural leather, and stacked Missoma molten silver ear jewelry.",
        updatedSlot: "accessories"
      };
    }
  }
];

