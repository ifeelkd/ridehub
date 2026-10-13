import Link from "next/link";
import { Plus, Package, Layers } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { PRODUCTS, BRANDS, CATEGORIES } from "@/lib/catalog-data";
import ProductListTable from "./ProductListTable";

async function getProductsData() {
  try {
    const supabase = getSupabaseAdmin();
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const [{ data: products }, { data: brands }, { data: categories }] =
        await Promise.all([
          supabase
            .from("products")
            .select(`
              *,
              brand:brands(id, name, slug),
              category:categories(id, name, slug),
              images:product_images(*),
              variants:product_variants(*)
            `)
            .order("created_at", { ascending: false }),
          supabase.from("brands").select("*").order("sort_order"),
          supabase.from("categories").select("*").order("sort_order"),
        ]);

      return {
        products: (products && products.length > 0) ? products : PRODUCTS,
        brands: (brands && brands.length > 0) ? brands : BRANDS,
        categories: (categories && categories.length > 0) ? categories : CATEGORIES,
      };
    }
  } catch {
    // fallback
  }

  return {
    products: PRODUCTS,
    brands: BRANDS,
    categories: CATEGORIES,
  };
}

export default async function AdminProductsPage() {
  const { products, brands, categories } = await getProductsData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-display text-2xl sm:text-3xl font-bold text-text-primary">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage your physical multi-brand gear inventory, prices, and visibility.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="btn btn-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={16} /> Add New Product
        </Link>
      </div>

      <ProductListTable
        initialProducts={products}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
