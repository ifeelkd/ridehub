// Master catalog data representing the store's physical inventory
// Used as fallback when Supabase is unconfigured or to hydrate local dev/demo

export const BRANDS = [
  { id: "b1", name: "Rynox", slug: "rynox", description: "Premium Indian protective motorcycle gear designed for adventure and touring.", logo_url: null, sort_order: 1 },
  { id: "b2", name: "Axor", slug: "axor", description: "Italian design engineered with cutting-edge helmet safety technology.", logo_url: null, sort_order: 2 },
  { id: "b3", name: "MT Helmets", slug: "mt-helmets", description: "Spanish helmet brand delivering world-class ECE 22.06 certified helmets.", logo_url: null, sort_order: 3 },
  { id: "b4", name: "Raida", slug: "raida", description: "High-value, ergonomic touring and street motorcycle gear.", logo_url: null, sort_order: 4 },
  { id: "b5", name: "Solace", slug: "solace", description: "Precision crafted gear with D3O impact armor for serious riders.", logo_url: null, sort_order: 5 },
  { id: "b6", name: "Viaterra", slug: "viaterra", description: "Rugged motorcycle luggage and gear built to endure tough Indian terrains.", logo_url: null, sort_order: 6 },
  { id: "b7", name: "Mototech", slug: "mototech", description: "Durable motorcycle boots and protective accessories engineered for daily riders.", logo_url: null, sort_order: 7 },
  { id: "b8", name: "BBG", slug: "bbg", description: "Biking Brotherhood Gear specializing in leather racing and touring equipment.", logo_url: null, sort_order: 8 },
  { id: "b9", name: "DSG", slug: "dsg", description: "Pioneer in Indian performance motorcycle apparel and protection.", logo_url: null, sort_order: 9 },
  { id: "b10", name: "Zeus", slug: "zeus", description: "Adventure and off-road helmet specialist with dual-sport innovations.", logo_url: null, sort_order: 10 }
];

export const CATEGORIES = [
  { id: "c1", name: "Helmets", slug: "helmets", icon: "hard-hat", sort_order: 1 },
  { id: "c2", name: "Jackets", slug: "jackets", icon: "shirt", sort_order: 2 },
  { id: "c3", name: "Gloves", slug: "gloves", icon: "hand", sort_order: 3 },
  { id: "c4", name: "Pants", slug: "pants", icon: "scissors", sort_order: 4 },
  { id: "c5", name: "Boots", slug: "boots", icon: "footprints", sort_order: 5 },
  { id: "c6", name: "Luggage", slug: "luggage", icon: "briefcase", sort_order: 6 },
  { id: "c7", name: "Accessories", slug: "accessories", icon: "wrench", sort_order: 7 }
];

export const PRODUCTS = [
  {
    id: "p1",
    name: "Axor Apex Carbon Fibre Helmet",
    slug: "axor-apex-carbon-fibre",
    brand_id: "b2",
    brand: { name: "Axor", slug: "axor" },
    category_id: "c1",
    category: { name: "Helmets", slug: "helmets" },
    description: "The Axor Apex Carbon Fibre is an ultra-lightweight full-face helmet with premium carbon fiber shell construction. Features an advanced multi-channel ventilation system, dual-density EPS liner, and a clear anti-fog pinlock-ready visor. ECE 22.06 and DOT certified for maximum impact absorption on highway tours and track days.",
    base_price: 12999,
    sale_price: null,
    sku: "AXR-APEX-CF",
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    has_variants: true,
    stock_quantity: 17,
    specifications: {
      "Shell Material": "100% Carbon Fibre composite",
      "Safety Certification": "ECE 22.06 & DOT Certified",
      "Weight": "1250g ± 50g",
      "Visor": "Pinlock 70 MaxVision Ready, Scratch-resistant",
      "Ventilation": "Multi-channel EPS airflow with chin & forehead intakes",
      "Closure": "Double D-Ring retention system",
      "Liner": "Breathable, removable, hypoallergenic & washable"
    },
    images: [
      { id: "img1-1", url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80", alt_text: "Axor Apex Carbon Fibre Helmet Front View", is_primary: true },
      { id: "img1-2", url: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80", alt_text: "Axor Apex Carbon Fibre Helmet Angle View", is_primary: false }
    ],
    variants: [
      { id: "v1-1", name: "S", sku: "AXR-APEX-CF-S", size: "S", stock_quantity: 3, is_active: true },
      { id: "v1-2", name: "M", sku: "AXR-APEX-CF-M", size: "M", stock_quantity: 5, is_active: true },
      { id: "v1-3", name: "L", sku: "AXR-APEX-CF-L", size: "L", stock_quantity: 4, is_active: true },
      { id: "v1-4", name: "XL", sku: "AXR-APEX-CF-XL", size: "XL", stock_quantity: 3, is_active: true },
      { id: "v1-5", name: "XXL", sku: "AXR-APEX-CF-XXL", size: "XXL", stock_quantity: 2, is_active: true }
    ]
  },
  {
    id: "p2",
    name: "MT Thunder 4 SV Solid Helmet",
    slug: "mt-thunder-4-sv-solid",
    brand_id: "b3",
    brand: { name: "MT Helmets", slug: "mt-helmets" },
    category_id: "c1",
    category: { name: "Helmets", slug: "helmets" },
    description: "The MT Thunder 4 SV represents the newest benchmark in affordable full-face protection. Upgraded with an aerodynamic HIRP (High Impact Resistant Polymer) shell, internal dropdown sun visor, optical class 1 quick-release visor, and class-leading ECE 22.06 certification.",
    base_price: 4999,
    sale_price: 4499,
    sku: "MT-TH4-SLD",
    is_active: true,
    is_featured: false,
    is_new_arrival: true,
    has_variants: true,
    stock_quantity: 19,
    specifications: {
      "Shell Material": "HIRP (High Impact Resistant Polymer)",
      "Safety Certification": "ECE 22.06 Certified",
      "Weight": "1450g ± 50g",
      "Sun Visor": "Internal drop-down tinted sun visor",
      "Visor": "MT-V-28 Optical Class 1, Quick release",
      "Fastener": "Micrometric quick-release metal buckle"
    },
    images: [
      { id: "img2-1", url: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80", alt_text: "MT Thunder 4 SV Solid Helmet Matte Black", is_primary: true },
      { id: "img2-2", url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80", alt_text: "MT Thunder 4 Side Profile", is_primary: false }
    ],
    variants: [
      { id: "v2-1", name: "S", sku: "MT-TH4-S", size: "S", stock_quantity: 4, is_active: true },
      { id: "v2-2", name: "M", sku: "MT-TH4-M", size: "M", stock_quantity: 6, is_active: true },
      { id: "v2-3", name: "L", sku: "MT-TH4-L", size: "L", stock_quantity: 5, is_active: true },
      { id: "v2-4", name: "XL", sku: "MT-TH4-XL", size: "XL", stock_quantity: 4, is_active: true }
    ]
  },
  {
    id: "p3",
    name: "Zeus ZS-813 Dual Sport Helmet",
    slug: "zeus-zs-813-dual-sport",
    brand_id: "b10",
    brand: { name: "Zeus", slug: "zeus" },
    category_id: "c1",
    category: { name: "Helmets", slug: "helmets" },
    description: "Versatile dual-sport helmet engineered for adventure touring and trail exploration. Features an aerodynamic removable peak visor, wide goggle-compatible eye port, reinforced polycarbonate construction, and high-flow chin intake.",
    base_price: 5999,
    sale_price: 5499,
    sku: "ZS-813-DS",
    is_active: true,
    is_featured: false,
    is_new_arrival: false,
    has_variants: true,
    stock_quantity: 10,
    specifications: {
      "Type": "Dual Sport / ADV Helmet",
      "Shell Material": "Advanced Polycarbonate",
      "Weight": "1550g ± 50g",
      "Peak": "Aerodynamic, vibration-free, removable",
      "Visor": "Anti-scratch clear visor",
      "Ventilation": "Chin bar, top intake and rear exhaust extractors"
    },
    images: [
      { id: "img3-1", url: "https://images.unsplash.com/photo-1571188654248-7a89213915f7?auto=format&fit=crop&w=1000&q=80", alt_text: "Zeus ZS-813 Dual Sport Helmet", is_primary: true }
    ],
    variants: [
      { id: "v3-1", name: "M", sku: "ZS-813-M", size: "M", stock_quantity: 3, is_active: true },
      { id: "v3-2", name: "L", sku: "ZS-813-L", size: "L", stock_quantity: 4, is_active: true },
      { id: "v3-3", name: "XL", sku: "ZS-813-XL", size: "XL", stock_quantity: 3, is_active: true }
    ]
  },
  {
    id: "p4",
    name: "Rynox Storm Evo 3 Jacket",
    slug: "rynox-storm-evo-3",
    brand_id: "b1",
    brand: { name: "Rynox", slug: "rynox" },
    category_id: "c2",
    category: { name: "Jackets", slug: "jackets" },
    description: "Rynox's flagship all-season touring jacket. Built with Invista Cordura 600D abrasion-resistant outer shell, Knox Micro-Lock CE Level 2 armor at shoulders and elbows, a detachable thermal liner, and a standalone waterproof membrane. Designed to conquer monsoon rides, freezing mountain passes, and hot plains.",
    base_price: 7999,
    sale_price: null,
    sku: "RNX-STRM3",
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    has_variants: true,
    stock_quantity: 24,
    specifications: {
      "Abrasion Resistance": "Invista Cordura 600D with 1000D crash zones",
      "Impact Armor": "CE Level 2 Knox Micro-Lock (Shoulders, Elbows)",
      "Back Protection": "Pocket for CE Level 2 Back Armor",
      "Weather Versatility": "Detachable thermal vest + internal rain jacket",
      "Ventilation": "Foldable chest panels, dual arm bicep vents, rear exhaust",
      "Night Visibility": "360° laminated reflective strips"
    },
    images: [
      { id: "img4-1", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80", alt_text: "Rynox Storm Evo 3 Jacket Front View", is_primary: true },
      { id: "img4-2", url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80", alt_text: "Rynox Storm Evo 3 Texture Detail", is_primary: false }
    ],
    variants: [
      { id: "v4-1", name: "Black / S", sku: "RNX-STRM3-BK-S", size: "S", color: "Black", color_hex: "#1a1a1a", stock_quantity: 3, is_active: true },
      { id: "v4-2", name: "Black / M", sku: "RNX-STRM3-BK-M", size: "M", color: "Black", color_hex: "#1a1a1a", stock_quantity: 5, is_active: true },
      { id: "v4-3", name: "Black / L", sku: "RNX-STRM3-BK-L", size: "L", color: "Black", color_hex: "#1a1a1a", stock_quantity: 4, is_active: true },
      { id: "v4-4", name: "Black / XL", sku: "RNX-STRM3-BK-XL", size: "XL", color: "Black", color_hex: "#1a1a1a", stock_quantity: 3, is_active: true },
      { id: "v4-5", name: "Charcoal / M", sku: "RNX-STRM3-GR-M", size: "M", color: "Charcoal", color_hex: "#4a4a4a", stock_quantity: 3, is_active: true },
      { id: "v4-6", name: "Charcoal / L", sku: "RNX-STRM3-GR-L", size: "L", color: "Charcoal", color_hex: "#4a4a4a", stock_quantity: 4, is_active: true },
      { id: "v4-7", name: "Charcoal / XL", sku: "RNX-STRM3-GR-XL", size: "XL", color: "Charcoal", color_hex: "#4a4a4a", stock_quantity: 2, is_active: true }
    ]
  },
  {
    id: "p5",
    name: "Raida Drifter Mesh Jacket",
    slug: "raida-drifter-mesh",
    brand_id: "b4",
    brand: { name: "Raida", slug: "raida" },
    category_id: "c2",
    category: { name: "Jackets", slug: "jackets" },
    description: "Lightweight summer mesh riding jacket engineered for maximum airflow in tropical Indian heat without compromising on safety. Features CE-approved armors, rugged 600D ballistic nylon reinforcement at high abrasion impact points, and multiple adjusters for a snug fit.",
    base_price: 4499,
    sale_price: 3999,
    sku: "RDA-DRFT-MSH",
    is_active: true,
    is_featured: false,
    is_new_arrival: true,
    has_variants: true,
    stock_quantity: 20,
    specifications: {
      "Fabric": "Heavy-duty 3D Air Mesh + 600D Poly Oxford",
      "Armor Rating": "CE Level 1 (Shoulders, Elbows)",
      "Back Pad": "High-density EVA foam back protector included",
      "Airflow": "90% breathable mesh front and back",
      "Fit Adjustment": "Velcro tabs at waist, biceps, and cuffs",
      "Pockets": "2 external zippered pockets + 1 waterproof internal phone pocket"
    },
    images: [
      { id: "img5-1", url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80", alt_text: "Raida Drifter Mesh Jacket", is_primary: true }
    ],
    variants: [
      { id: "v5-1", name: "S", sku: "RDA-DRFT-S", size: "S", stock_quantity: 3, is_active: true },
      { id: "v5-2", name: "M", sku: "RDA-DRFT-M", size: "M", stock_quantity: 5, is_active: true },
      { id: "v5-3", name: "L", sku: "RDA-DRFT-L", size: "L", stock_quantity: 6, is_active: true },
      { id: "v5-4", name: "XL", sku: "RDA-DRFT-XL", size: "XL", stock_quantity: 4, is_active: true },
      { id: "v5-5", name: "XXL", sku: "RDA-DRFT-XXL", size: "XXL", stock_quantity: 2, is_active: true }
    ]
  },
  {
    id: "p6",
    name: "Solace Rival Urban Jacket",
    slug: "solace-rival-urban",
    brand_id: "b5",
    brand: { name: "Solace", slug: "solace" },
    category_id: "c2",
    category: { name: "Jackets", slug: "jackets" },
    description: "Sleek urban riding jacket that transitions effortlessly from motorbike to casual hangout. Equipped with ultra-pliable D3O Ghost armor that remains completely invisible until an impact occurs.",
    base_price: 8999,
    sale_price: null,
    sku: "SLC-RVL-URB",
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    has_variants: true,
    stock_quantity: 21,
    specifications: {
      "Outer Shell": "Cotton-blend Canvas with DWR water-repellent finish",
      "Armor Package": "D3O Ghost CE Level 1 (Shoulders, Elbows, Back)",
      "Zippers": "YKK metal antique-finish zippers",
      "Style": "Minimalist cafe racer / urban commuter",
      "Thermal Liner": "Detachable quilted thermal liner"
    },
    images: [
      { id: "img6-1", url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80", alt_text: "Solace Rival Urban Jacket", is_primary: true }
    ],
    variants: [
      { id: "v6-1", name: "Black / M", sku: "SLC-RVL-BK-M", size: "M", color: "Black", color_hex: "#1a1a1a", stock_quantity: 4, is_active: true },
      { id: "v6-2", name: "Black / L", sku: "SLC-RVL-BK-L", size: "L", color: "Black", color_hex: "#1a1a1a", stock_quantity: 5, is_active: true },
      { id: "v6-3", name: "Black / XL", sku: "SLC-RVL-BK-XL", size: "XL", color: "Black", color_hex: "#1a1a1a", stock_quantity: 3, is_active: true },
      { id: "v6-4", name: "Olive / M", sku: "SLC-RVL-OL-M", size: "M", color: "Olive", color_hex: "#5a6340", stock_quantity: 3, is_active: true },
      { id: "v6-5", name: "Olive / L", sku: "SLC-RVL-OL-L", size: "L", color: "Olive", color_hex: "#5a6340", stock_quantity: 4, is_active: true },
      { id: "v6-6", name: "Olive / XL", sku: "SLC-RVL-OL-XL", size: "XL", color: "Olive", color_hex: "#5a6340", stock_quantity: 2, is_active: true }
    ]
  },
  {
    id: "p7",
    name: "Rynox Air GT Gloves",
    slug: "rynox-air-gt-gloves",
    brand_id: "b1",
    brand: { name: "Rynox", slug: "rynox" },
    category_id: "c3",
    category: { name: "Gloves", slug: "gloves" },
    description: "Highly breathable summer street gloves featuring a supple genuine goat leather palm for optimal throttle feel, TPU molded knuckle protector, touchscreen-friendly finger pads, and durable 3D mesh chassis.",
    base_price: 1999,
    sale_price: null,
    sku: "RNX-AIRGT",
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    has_variants: true,
    stock_quantity: 25,
    specifications: {
      "Palm": "100% Genuine Goat Leather with reinforced scaphoid slider",
      "Backhand": "Air Mesh with 4-way stretch panels",
      "Protection": "Contoured TPU knuckle guard & finger TPR protectors",
      "Touchscreen": "Capacitive leather on thumb and index fingertips",
      "Closure": "Low-profile velcro wrist strap"
    },
    images: [
      { id: "img7-1", url: "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=1000&q=80", alt_text: "Rynox Air GT Gloves", is_primary: true }
    ],
    variants: [
      { id: "v7-1", name: "S", sku: "RNX-AIRGT-S", size: "S", stock_quantity: 5, is_active: true },
      { id: "v7-2", name: "M", sku: "RNX-AIRGT-M", size: "M", stock_quantity: 8, is_active: true },
      { id: "v7-3", name: "L", sku: "RNX-AIRGT-L", size: "L", stock_quantity: 7, is_active: true },
      { id: "v7-4", name: "XL", sku: "RNX-AIRGT-XL", size: "XL", stock_quantity: 5, is_active: true }
    ]
  },
  {
    id: "p8",
    name: "BBG Semi Gauntlet Gloves",
    slug: "bbg-semi-gauntlet",
    brand_id: "b8",
    brand: { name: "BBG", slug: "bbg" },
    category_id: "c3",
    category: { name: "Gloves", slug: "gloves" },
    description: "Sport-touring semi-gauntlet gloves constructed from top-grain full leather with real carbon fiber knuckle shielding and integrated visor wiper on the left thumb for wet weather touring.",
    base_price: 2999,
    sale_price: 2599,
    sku: "BBG-SG-GLV",
    is_active: true,
    is_featured: false,
    is_new_arrival: false,
    has_variants: true,
    stock_quantity: 12,
    specifications: {
      "Construction": "Full grain drum-dyed cowhide leather",
      "Knuckle Armor": "Molded real carbon fiber shield",
      "Palm Slider": "Dual TPU slider padding",
      "Touring Feature": "Integrated soft rubber visor wiper",
      "Fastening": "Dual cuff velcro adjustment"
    },
    images: [
      { id: "img8-1", url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80", alt_text: "BBG Semi Gauntlet Gloves", is_primary: true }
    ],
    variants: [
      { id: "v8-1", name: "M", sku: "BBG-SG-M", size: "M", stock_quantity: 4, is_active: true },
      { id: "v8-2", name: "L", sku: "BBG-SG-L", size: "L", stock_quantity: 5, is_active: true },
      { id: "v8-3", name: "XL", sku: "BBG-SG-XL", size: "XL", stock_quantity: 3, is_active: true }
    ]
  },
  {
    id: "p9",
    name: "Rynox Advento Riding Pants",
    slug: "rynox-advento-pants",
    brand_id: "b1",
    brand: { name: "Rynox", slug: "rynox" },
    category_id: "c4",
    category: { name: "Pants", slug: "pants" },
    description: "Hardcore adventure touring riding pants made of Cordura 500D with CE Level 1 armor at knees and hips. Comes with a removable breathable waterproof inner liner and jacket connecting zipper.",
    base_price: 5999,
    sale_price: null,
    sku: "RNX-ADVT-PNT",
    is_active: true,
    is_featured: false,
    is_new_arrival: true,
    has_variants: true,
    stock_quantity: 16,
    specifications: {
      "Chassis": "Heavy Duty 500D Cordura + Ripstop Stretch Panels",
      "Knee Armor": "CE Level 1 Adjustable Knee Protectors",
      "Hip Protection": "CE Level 1 Hip Protectors",
      "Waterproofing": "Detachable Reissa waterproof liner",
      "Ventilation": "Dual zippered thigh intake vents",
      "Jacket Connector": "Standard 8-inch waist connection zipper"
    },
    images: [
      { id: "img9-1", url: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80", alt_text: "Rynox Advento Riding Pants", is_primary: true }
    ],
    variants: [
      { id: "v9-1", name: "S (28-30)", sku: "RNX-ADVT-S", size: "S (28-30)", stock_quantity: 3, is_active: true },
      { id: "v9-2", name: "M (30-32)", sku: "RNX-ADVT-M", size: "M (30-32)", stock_quantity: 5, is_active: true },
      { id: "v9-3", name: "L (32-34)", sku: "RNX-ADVT-L", size: "L (32-34)", stock_quantity: 4, is_active: true },
      { id: "v9-4", name: "XL (34-36)", sku: "RNX-ADVT-XL", size: "XL (34-36)", stock_quantity: 3, is_active: true }
    ]
  },
  {
    id: "p10",
    name: "Mototech Asphalt V3 Riding Shoes",
    slug: "mototech-asphalt-v3",
    brand_id: "b7",
    brand: { name: "Mototech", slug: "mototech" },
    category_id: "c5",
    category: { name: "Boots", slug: "boots" },
    description: "Versatile ankle-height riding boots combining street sneaker comfort with full motorcycling protection. Features rigid ankle disc protectors, reinforced gear shift zone, oil-resistant lugged sole, and water-repellent microfibre construction.",
    base_price: 4499,
    sale_price: null,
    sku: "MTK-ASPH-V3",
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    has_variants: true,
    stock_quantity: 17,
    specifications: {
      "Upper": "High-tensile abrasion resistant Microfibre",
      "Ankle Protection": "Molded TPU medial and lateral ankle cups",
      "Shift Pad": "Embossed TPU gear shift reinforcement",
      "Sole": "High-grip oil & petrol resistant vulcanized rubber",
      "Lacing": "Speed lace mechanism with velcro strap keeper"
    },
    images: [
      { id: "img10-1", url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80", alt_text: "Mototech Asphalt V3 Riding Shoes", is_primary: true }
    ],
    variants: [
      { id: "v10-1", name: "UK 7 / EU 41", sku: "MTK-ASPH-41", size: "UK 7 / EU 41", stock_quantity: 3, is_active: true },
      { id: "v10-2", name: "UK 8 / EU 42", sku: "MTK-ASPH-42", size: "UK 8 / EU 42", stock_quantity: 4, is_active: true },
      { id: "v10-3", name: "UK 9 / EU 43", sku: "MTK-ASPH-43", size: "UK 9 / EU 43", stock_quantity: 5, is_active: true },
      { id: "v10-4", name: "UK 10 / EU 44", sku: "MTK-ASPH-44", size: "UK 10 / EU 44", stock_quantity: 3, is_active: true },
      { id: "v10-5", name: "UK 11 / EU 45", sku: "MTK-ASPH-45", size: "UK 11 / EU 45", stock_quantity: 2, is_active: true }
    ]
  },
  {
    id: "p11",
    name: "Viaterra Claw 100% Waterproof Tail Bag",
    slug: "viaterra-claw-tail-bag",
    brand_id: "b6",
    brand: { name: "Viaterra", slug: "viaterra" },
    category_id: "c6",
    category: { name: "Luggage", slug: "luggage" },
    description: "The gold standard of motorcycle luggage in India. 50L capacity 100% waterproof tail bag with radio-frequency welded seams, universal 3-point mounting system, and durable 500D PVC tarpaulin construction.",
    base_price: 3999,
    sale_price: 3499,
    sku: "VIA-CLAW-50",
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    has_variants: false,
    stock_quantity: 15,
    specifications: {
      "Capacity": "50 Litres storage volume",
      "Material": "500D Heavy duty PVC tarpaulin",
      "Waterproofing": "100% Welded seams (no rain cover required)",
      "Mounting": "Universal quick-release strap system fitting all motorcycles",
      "Extra Features": "MOLLE attachment straps, exterior compression straps"
    },
    images: [
      { id: "img11-1", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80", alt_text: "Viaterra Claw Tail Bag", is_primary: true }
    ],
    variants: []
  },
  {
    id: "p12",
    name: "DSG Knee Guard Pro",
    slug: "dsg-knee-guard-pro",
    brand_id: "b9",
    brand: { name: "DSG", slug: "dsg" },
    category_id: "c7",
    category: { name: "Accessories", slug: "accessories" },
    description: "CE Level 2 certified bionic articulated knee and shin protectors with high-impact poly-carbonate protective shells and ergonomic bio-foam padding. Fits snugly over or under riding jeans.",
    base_price: 1499,
    sale_price: null,
    sku: "DSG-KG-PRO",
    is_active: true,
    is_featured: false,
    is_new_arrival: true,
    has_variants: false,
    stock_quantity: 20,
    specifications: {
      "Impact Certification": "CE Level 2 EN 1621-1",
      "Armor Shell": "Articulated dual-axis Polycarbonate knee cap",
      "Padding": "Shock-absorbing high-density bio-foam",
      "Straps": "Triple quick-release elastic velcro strapping"
    },
    images: [
      { id: "img12-1", url: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80", alt_text: "DSG Knee Guard Pro", is_primary: true }
    ],
    variants: []
  }
];

export function getFallbackProducts(filters = {}) {
  let list = [...PRODUCTS];

  if (filters.category) {
    list = list.filter((p) => p.category?.slug === filters.category);
  }
  if (filters.brand) {
    list = list.filter((p) => p.brand?.name?.toLowerCase() === filters.brand.toLowerCase());
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (filters.min_price) {
    list = list.filter((p) => (p.sale_price || p.base_price) >= parseInt(filters.min_price));
  }
  if (filters.max_price) {
    list = list.filter((p) => (p.sale_price || p.base_price) <= parseInt(filters.max_price));
  }

  // Sort
  if (filters.sort === "price_asc") {
    list.sort((a, b) => (a.sale_price || a.base_price) - (b.sale_price || b.base_price));
  } else if (filters.sort === "price_desc") {
    list.sort((a, b) => (b.sale_price || b.base_price) - (a.sale_price || a.base_price));
  } else if (filters.sort === "newest") {
    list.sort((a, b) => (b.is_new_arrival ? 1 : 0) - (a.is_new_arrival ? 1 : 0));
  } else {
    // default featured
    list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  return list;
}

export function getFallbackProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}
