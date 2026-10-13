import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Truck,
  CreditCard,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { storeConfig, formatPrice } from "@/lib/store-config";
import ProductCard from "@/components/ProductCard";
import { getSupabaseServer } from "@/lib/supabase/server";

import { BRANDS, CATEGORIES, PRODUCTS } from "@/lib/catalog-data";

async function getHomeData() {
  try {
    const supabase = await getSupabaseServer();

    // Fetch featured products
    const { data: featured } = await supabase
      .from("products")
      .select(`
        *,
        brand:brands(name, slug),
        images:product_images(id, url, alt_text, is_primary, sort_order),
        variants:product_variants(id, size, color, color_hex, stock_quantity, is_active)
      `)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8);

    // Fetch new arrivals
    const { data: newArrivals } = await supabase
      .from("products")
      .select(`
        *,
        brand:brands(name, slug),
        images:product_images(id, url, alt_text, is_primary, sort_order),
        variants:product_variants(id, size, color, color_hex, stock_quantity, is_active)
      `)
      .eq("is_active", true)
      .eq("is_new_arrival", true)
      .order("created_at", { ascending: false })
      .limit(8);

    // Fetch brands
    const { data: brands } = await supabase
      .from("brands")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    // Fetch categories
    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    return {
      featured: (featured && featured.length > 0) ? featured : PRODUCTS.filter(p => p.is_featured).slice(0, 8),
      newArrivals: (newArrivals && newArrivals.length > 0) ? newArrivals : PRODUCTS.filter(p => p.is_new_arrival).slice(0, 8),
      brands: (brands && brands.length > 0) ? brands : BRANDS,
      categories: (categories && categories.length > 0) ? categories : CATEGORIES,
    };
  } catch (err) {
    return {
      featured: PRODUCTS.filter(p => p.is_featured).slice(0, 8),
      newArrivals: PRODUCTS.filter(p => p.is_new_arrival).slice(0, 8),
      brands: BRANDS,
      categories: CATEGORIES,
    };
  }
}

const categoryIcons = {
  helmets: (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 28c0-8.837 7.163-16 16-16s16 7.163 16 16v2a4 4 0 01-4 4H12a4 4 0 01-4-4v-2z" />
      <path d="M12 30h24" />
      <rect x="6" y="32" width="36" height="4" rx="2" />
    </svg>
  ),
  jackets: (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 8l-8 6v24h12V26h8v12h12V14l-8-6" />
      <path d="M16 8c0 4 4 6 8 6s8-2 8-6" />
    </svg>
  ),
  gloves: (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 38V14a4 4 0 018 0v10" />
      <path d="M28 24V12a4 4 0 018 0v14" />
      <path d="M20 24V10a4 4 0 00-8 0v18l-2-4a4 4 0 00-6 4l8 16h24l2-16" />
    </svg>
  ),
  pants: (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 8h20v6l-3 26h-6L24 24l-1 16h-6L14 14V8z" />
      <path d="M14 14h20" />
    </svg>
  ),
  boots: (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 8v16l-4 6v6h24v-6l-4-10V8" />
      <path d="M16 24h16" />
      <path d="M12 36h24" />
    </svg>
  ),
  luggage: (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="10" y="14" width="28" height="22" rx="3" />
      <path d="M18 14V10a2 2 0 012-2h8a2 2 0 012 2v4" />
      <path d="M24 20v10" />
      <path d="M18 36v4M30 36v4" />
    </svg>
  ),
  accessories: (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="20" r="12" />
      <path d="M24 14v6l4 4" />
      <path d="M20 32v8h8v-8" />
    </svg>
  ),
};

export default async function HomePage() {
  const { featured, newArrivals, brands, categories } = await getHomeData();

  return (
    <>
      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section className="relative bg-bg-dark overflow-hidden">
        <div className="aspect-hero relative">
          {/* Hero Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative h-full container-narrow flex items-center">
            <div className="max-w-2xl py-12 lg:py-0">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-medium text-stone-300 tracking-wide">
                  Premium Riding Gear Store
                </span>
              </div>

              <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 lg:mb-6">
                Gear Up.
                <br />
                <span className="text-accent">Ride Safe.</span>
              </h1>

              <p className="text-base lg:text-lg text-stone-400 max-w-lg mb-8 leading-relaxed">
                Premium motorcycle riding gear from India&apos;s best brands.
                Helmets, jackets, gloves, boots &amp; everything you need for the road.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="btn btn-primary btn-lg group"
                >
                  Shop All Gear
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/products?category=helmets"
                  className="btn btn-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
                >
                  Browse Helmets
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        </div>
      </section>

      {/* ==========================================
          TRUST BADGES
          ========================================== */}
      <section className="border-b border-stone-200/80 bg-white py-8 sm:py-10">
        <div className="container-narrow">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: <Truck size={22} />,
                title: "Free Shipping",
                desc: `On orders above ${formatPrice(storeConfig.shipping.freeShippingThreshold || 2999)}`,
              },
              {
                icon: <CreditCard size={22} />,
                title: "Cash on Delivery",
                desc: "Pay when you receive",
              },
              {
                icon: <RotateCcw size={22} />,
                title: "Easy Returns",
                desc: "Hassle-free 7-day size swap",
              },
              {
                icon: <Shield size={22} />,
                title: "Genuine Products",
                desc: "100% authentic certified gear",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3.5 p-3 sm:p-4 rounded-xl bg-stone-50/70 border border-stone-200/60 lg:justify-center hover:bg-stone-50 transition-colors"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-stone-900">
                    {item.title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          CATEGORIES
          ========================================== */}
      {categories.length > 0 && (
        <section className="py-16 sm:py-24 bg-stone-50/60 border-b border-stone-200/70">
          <div className="container-narrow">
            <div className="text-center mb-12 sm:mb-16">
              <span className="badge badge-accent uppercase tracking-wider text-[11px] mb-2 inline-block">
                Curated Catalog
              </span>
              <h2 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-3">
                Shop by Category
              </h2>
              <p className="text-sm sm:text-base text-stone-500 max-w-md mx-auto">
                Find the perfect certified gear for every part of your ride.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-5">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-stone-200/80 hover:border-orange-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline shadow-sm min-h-[150px] justify-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 group-hover:bg-orange-50 text-stone-700 group-hover:text-orange-600 flex items-center justify-center mb-3.5 transition-all duration-300 group-hover:scale-110 shadow-inner">
                    {categoryIcons[cat.slug] || (
                      <div className="w-8 h-8 rounded-full bg-stone-300" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          FEATURED PRODUCTS
          ========================================== */}
      {featured.length > 0 && (
        <section className="py-16 sm:py-24 bg-white border-b border-stone-200/70">
          <div className="container-narrow">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
              <div>
                <span className="badge badge-accent uppercase tracking-wider text-[11px] mb-2 inline-block">
                  Handpicked Essentials
                </span>
                <h2 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-2">
                  Featured Gear
                </h2>
                <p className="text-sm sm:text-base text-stone-500">
                  Verified armor, helmets, and luggage ready for dispatch.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors no-underline group"
              >
                View Full Catalog
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="sm:hidden mt-8 text-center">
              <Link href="/products" className="btn btn-outline w-full h-12">
                View All Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          BRANDS
          ========================================== */}
      {brands.length > 0 && (
        <section className="py-16 sm:py-24 bg-stone-50/60">
          <div className="container-narrow">
            <div className="text-center mb-12 sm:mb-16">
              <span className="badge badge-accent uppercase tracking-wider text-[11px] mb-2 inline-block">
                Authorized Retailer
              </span>
              <h2 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-3">
                Brands We Carry
              </h2>
              <p className="text-sm sm:text-base text-stone-500 max-w-md mx-auto">
                Official warranty-backed riding gear from India&apos;s leading manufacturers.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/products?brand=${encodeURIComponent(brand.name)}`}
                  className="group flex items-center justify-center p-6 sm:p-7 rounded-2xl bg-white border border-stone-200/80 hover:border-orange-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 no-underline shadow-sm"
                >
                  <span className="heading-display text-base lg:text-lg font-bold text-stone-700 group-hover:text-orange-600 transition-colors tracking-wider">
                    {brand.name.toUpperCase()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          NEW ARRIVALS
          ========================================== */}
      {newArrivals.length > 0 && (
        <section className="py-12 lg:py-20 bg-bg-dark text-text-inverse">
          <div className="container-narrow">
            <div className="flex items-end justify-between mb-8 lg:mb-12">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-8 h-px bg-accent" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                    Just In
                  </span>
                </div>
                <h2 className="heading-display text-3xl lg:text-4xl mb-2">
                  New Arrivals
                </h2>
                <p className="text-stone-400">
                  The latest additions to our collection.
                </p>
              </div>
              <Link
                href="/products?sort=newest"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors no-underline"
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          CTA BANNER
          ========================================== */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-stone-100 to-orange-50">
        <div className="container-narrow text-center">
          <h2 className="heading-display text-3xl lg:text-5xl text-text-primary mb-4">
            Visit Our Store
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-8 text-lg">
            Can&apos;t decide online? Visit us at our store in {storeConfig.contact.address.city},{" "}
            {storeConfig.contact.address.state} for a hands-on experience.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Get Directions
              <ArrowRight size={18} />
            </Link>
            <a
              href={`tel:${storeConfig.contact.phone.replace(/\s/g, "")}`}
              className="btn btn-outline btn-lg"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
