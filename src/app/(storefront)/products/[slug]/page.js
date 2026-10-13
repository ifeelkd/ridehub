import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Shield, Award, Sparkles } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getFallbackProductBySlug, PRODUCTS } from "@/lib/catalog-data";
import { formatPrice } from "@/lib/store-config";
import ProductGallery from "./ProductGallery";
import ProductPurchaseSection from "./ProductPurchaseSection";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

async function getProduct(slug) {
  try {
    const supabase = await getSupabaseServer();
    if (supabase) {
      const { data: product, error } = await supabase
        .from("products")
        .select(`
          *,
          brand:brands(id, name, slug),
          category:categories(id, name, slug),
          images:product_images(id, url, alt_text, is_primary, sort_order),
          variants:product_variants(id, name, sku, size, color, color_hex, stock_quantity, is_active, sort_order)
        `)
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (!error && product) {
        return product;
      }
    }
  } catch (err) {
    // fallback below
  }

  return getFallbackProductBySlug(slug);
}

async function getRelatedProducts(categoryId, brandId, currentId) {
  try {
    const supabase = await getSupabaseServer();
    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          brand:brands(name, slug),
          images:product_images(id, url, alt_text, is_primary, sort_order),
          variants:product_variants(id, size, color, color_hex, stock_quantity, is_active)
        `)
        .eq("is_active", true)
        .neq("id", currentId)
        .or(`category_id.eq.${categoryId},brand_id.eq.${brandId}`)
        .limit(4);

      if (!error && data && data.length > 0) return data;
    }
  } catch (err) {
    // fallback below
  }

  return PRODUCTS.filter((p) => p.id !== currentId).slice(0, 4);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | RideHub",
    };
  }

  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];

  return {
    title: `${product.name} | RideHub`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} — ${formatPrice(product.sale_price || product.base_price)} | RideHub`,
      description: product.description.slice(0, 160),
      images: primaryImage?.url ? [{ url: primaryImage.url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(
    product.category_id,
    product.brand_id,
    product.id
  );

  const displayPrice = product.sale_price || product.base_price;
  const hasDiscount = product.sale_price && product.sale_price < product.base_price;
  const discountPercent = hasDiscount
    ? Math.round(((product.base_price - product.sale_price) / product.base_price) * 100)
    : 0;

  return (
    <div className="container-narrow py-6 lg:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 lg:mb-8">
        <ol className="flex items-center gap-1.5 text-xs text-text-secondary flex-wrap">
          <li>
            <Link href="/" className="hover:text-text-primary transition-colors">
              Home
            </Link>
          </li>
          <ChevronRight size={13} className="text-stone-400" />
          <li>
            <Link href="/products" className="hover:text-text-primary transition-colors">
              Gear
            </Link>
          </li>
          {product.category?.name && (
            <>
              <ChevronRight size={13} className="text-stone-400" />
              <li>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="hover:text-text-primary transition-colors"
                >
                  {product.category.name}
                </Link>
              </li>
            </>
          )}
          <ChevronRight size={13} className="text-stone-400" />
          <li className="font-medium text-text-primary truncate max-w-xs sm:max-w-md">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Column */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images || []}
            productName={product.name}
            hasDiscount={hasDiscount}
            discountPercent={discountPercent}
            isNew={product.is_new_arrival}
          />
        </div>

        {/* Purchase Info Column */}
        <div className="lg:col-span-5">
          <ProductPurchaseSection product={product} />
        </div>
      </div>

      {/* Deep Product Details & Specifications */}
      <div className="mt-16 pt-12 border-t border-border-default">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Detailed Description */}
          <div>
            <h2 className="heading-display text-xl sm:text-2xl text-text-primary mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-accent" /> Product Overview & Engineering
            </h2>
            <div className="prose prose-stone dark:prose-invert max-w-none text-text-secondary leading-relaxed text-sm sm:text-base space-y-4">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Technical Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h2 className="heading-display text-xl sm:text-2xl text-text-primary mb-4 flex items-center gap-2">
                <Shield size={20} className="text-accent" /> Technical Specifications
              </h2>
              <div className="rounded-2xl border border-border-default overflow-hidden bg-bg-secondary/40">
                <dl className="divide-y divide-border-default">
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-1 sm:grid-cols-3 px-6 py-4 text-sm ${
                        idx % 2 === 0 ? "bg-bg-primary/40" : ""
                      }`}
                    >
                      <dt className="font-semibold text-text-primary">{key}</dt>
                      <dd className="sm:col-span-2 text-text-secondary mt-1 sm:mt-0">
                        {typeof val === "object" ? JSON.stringify(val) : String(val)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {/* Care and Protection Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-bg-secondary/40 border border-border-default">
              <h3 className="font-semibold text-text-primary text-base mb-2 flex items-center gap-2">
                <Award size={18} className="text-accent" /> Genuine Multi-Brand Warranty
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                All riding gear sold at RideHub is backed by authorized manufacturer warranty. Retain your invoice provided in the parcel for all claim validations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-bg-secondary/40 border border-border-default">
              <h3 className="font-semibold text-text-primary text-base mb-2">
                Care & Maintenance
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Clean visors and shells with microfibre cloth and lukewarm water only. Remove internal armor pads before washing textile jackets and pants. Air-dry away from direct heat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20 pt-12 border-t border-border-default">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="heading-display text-2xl lg:text-3xl text-text-primary">
                Related Riding Gear
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                More top-rated protection from {product.brand?.name || "our catalog"}
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-accent hover:underline flex items-center gap-1"
            >
              View Full Catalog <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
