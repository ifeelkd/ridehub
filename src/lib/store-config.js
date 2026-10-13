/**
 * Centralized Store Configuration
 * ================================
 * Single source of truth for store identity, contact details,
 * shipping rules, policies, and feature toggles.
 *
 * PLACEHOLDER items are marked — the shop owner must supply
 * real values before launch.
 */

export const storeConfig = {
  // --- Identity ---
  name: "RideHub",
  tagline: "Premium Riding Gear, Multiple Brands",
  description:
    "Your destination for premium motorcycle riding gear from the best brands. Quality helmets, jackets, gloves, boots & more.",
  logoText: "RIDEHUB", // Used when no logo image is set
  logoImage: null, // Path to logo image (e.g., "/logo.png")

  // --- Contact ---
  contact: {
    phone: "+91 XXXXX XXXXX", // PLACEHOLDER — owner must supply
    email: "hello@ridehub.in", // PLACEHOLDER — owner must supply
    address: {
      line1: "Main Road", // PLACEHOLDER
      line2: "",
      city: "Bongaigaon",
      state: "Assam",
      pinCode: "783380", // PLACEHOLDER — verify
      country: "India",
    },
    mapUrl: "", // PLACEHOLDER — Google Maps embed URL
  },

  // --- Social ---
  social: {
    instagram: "", // PLACEHOLDER
    facebook: "", // PLACEHOLDER
    youtube: "", // PLACEHOLDER
    whatsapp: "", // PLACEHOLDER — full URL e.g., https://wa.me/91XXXXXXXXXX
  },

  // --- Currency ---
  currency: {
    code: "INR",
    symbol: "₹",
    locale: "en-IN",
  },

  // --- Shipping ---
  shipping: {
    defaultCharge: 99, // in INR — PLACEHOLDER, adjust to real shipping cost
    freeShippingThreshold: 2999, // set to 0 or null to disable free shipping
    estimatedDelivery: "5-10 business days", // PLACEHOLDER — owner must confirm
  },

  // --- Stock ---
  lowStockThreshold: 5,

  // --- Feature Toggles ---
  features: {
    cod: true,
    onlinePayment: false, // Phase 2: Razorpay
    reviews: false, // Deferred
    wishlist: false, // Deferred
    customerAccounts: false, // Deferred
  },

  // --- Announcement Bar ---
  announcement: {
    enabled: true,
    text: "Free shipping on orders above ₹2,999 • Cash on Delivery available across India",
  },

  // --- SEO ---
  seo: {
    titleTemplate: "%s | RideHub — Premium Riding Gear",
    defaultTitle: "RideHub — Premium Motorcycle Riding Gear",
    defaultDescription:
      "Shop premium motorcycle riding gear from top brands. Helmets, jackets, gloves, boots & accessories. Cash on Delivery. Based in Bongaigaon, Assam.",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ogImage: "/og-image.jpg", // PLACEHOLDER — create or supply
  },

  // --- Policies (short summaries for trust badges) ---
  policies: {
    shipping:
      "We ship across India. Orders are dispatched within 1-2 business days.", // PLACEHOLDER
    returns:
      "Easy returns within 7 days of delivery for unused products in original packaging.", // PLACEHOLDER
    privacy:
      "We respect your privacy and only collect information needed to fulfill your order.", // PLACEHOLDER
    terms:
      "By placing an order, you agree to our terms of service and return policy.", // PLACEHOLDER
  },

  // --- Brands (initial seed — owner can manage via admin) ---
  defaultBrands: [
    "Rynox",
    "Axor",
    "MT Helmets",
    "Raida",
    "Solace",
    "Viaterra",
    "Mototech",
    "BBG",
    "DSG",
    "Zeus",
  ],

  // --- Categories ---
  defaultCategories: [
    { name: "Helmets", slug: "helmets", icon: "hard-hat" },
    { name: "Jackets", slug: "jackets", icon: "shirt" },
    { name: "Gloves", slug: "gloves", icon: "hand" },
    { name: "Pants", slug: "pants", icon: "scissors" },
    { name: "Boots", slug: "boots", icon: "footprints" },
    { name: "Luggage", slug: "luggage", icon: "briefcase" },
    { name: "Accessories", slug: "accessories", icon: "wrench" },
  ],
};

/**
 * Format a price in INR.
 */
export function formatPrice(amount) {
  if (amount == null) return "";
  return new Intl.NumberFormat(storeConfig.currency.locale, {
    style: "currency",
    currency: storeConfig.currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate shipping for a given subtotal.
 */
export function calculateShipping(subtotal) {
  const { defaultCharge, freeShippingThreshold } = storeConfig.shipping;
  if (freeShippingThreshold && subtotal >= freeShippingThreshold) return 0;
  return defaultCharge;
}

/**
 * Get free-shipping progress info.
 */
export function getFreeShippingProgress(subtotal) {
  const { freeShippingThreshold } = storeConfig.shipping;
  if (!freeShippingThreshold) return null;
  const remaining = freeShippingThreshold - subtotal;
  return {
    threshold: freeShippingThreshold,
    remaining: Math.max(0, remaining),
    percentage: Math.min(100, (subtotal / freeShippingThreshold) * 100),
    achieved: remaining <= 0,
  };
}
