import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { PRODUCTS, BRANDS, CATEGORIES } from "@/lib/catalog-data";
import ProductForm from "../../ProductForm";

async function getProductAndFormData(id) {
  let product = null;
  let brands = BRANDS;
  let categories = CATEGORIES;

  try {
    const supabase = getSupabaseAdmin();
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const [{ data: p }, { data: b }, { data: c }] = await Promise.all([
        supabase
          .from("products")
          .select(`
            *,
            images:product_images(*),
            variants:product_variants(*)
          `)
          .eq("id", id)
          .single(),
        supabase.from("brands").select("*").order("sort_order"),
        supabase.from("categories").select("*").order("sort_order"),
      ]);

      if (p) product = p;
      if (b && b.length > 0) brands = b;
      if (c && c.length > 0) categories = c;
    }
  } catch {
    // fallback
  }

  if (!product) {
    product = PRODUCTS.find((p) => p.id === id || p.slug === id);
  }

  return { product, brands, categories };
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const { product, brands, categories } = await getProductAndFormData(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-display text-2xl sm:text-3xl font-bold text-text-primary">
          Edit Product: {product.name}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Modify retail prices, specifications, active visibility, or variant SKUs.
        </p>
      </div>

      <ProductForm initialProduct={product} brands={brands} categories={categories} />
    </div>
  );
}
