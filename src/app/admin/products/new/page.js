import { getSupabaseAdmin } from "@/lib/supabase/server";
import { BRANDS, CATEGORIES } from "@/lib/catalog-data";
import ProductForm from "../ProductForm";

async function getFormData() {
  try {
    const supabase = getSupabaseAdmin();
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const [{ data: brands }, { data: categories }] = await Promise.all([
        supabase.from("brands").select("*").order("sort_order"),
        supabase.from("categories").select("*").order("sort_order"),
      ]);
      return {
        brands: brands && brands.length > 0 ? brands : BRANDS,
        categories: categories && categories.length > 0 ? categories : CATEGORIES,
      };
    }
  } catch {
    // fallback
  }

  return { brands: BRANDS, categories: CATEGORIES };
}

export default async function NewProductPage() {
  const { brands, categories } = await getFormData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-display text-2xl sm:text-3xl font-bold text-text-primary">
          Add New Product
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Enter product attributes, pricing, specifications, and initial stock quantities.
        </p>
      </div>

      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}
