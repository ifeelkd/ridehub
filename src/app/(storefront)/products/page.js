import { Suspense } from "react";
import { getSupabaseServer } from "@/lib/supabase/server";
import ProductGrid from "./ProductGrid";

export const metadata = {
  title: "All Products | RideHub",
  description:
    "Browse our complete collection of premium motorcycle riding gear. Helmets, jackets, gloves, pants, boots & accessories from top brands.",
};

import { BRANDS, CATEGORIES } from "@/lib/catalog-data";

async function getFilters() {
  try {
    const supabase = await getSupabaseServer();

    const [{ data: brands }, { data: categories }] = await Promise.all([
      supabase.from("brands").select("id, name, slug").eq("is_active", true).order("sort_order"),
      supabase.from("categories").select("id, name, slug").eq("is_active", true).order("sort_order"),
    ]);

    return {
      brands: (brands && brands.length > 0) ? brands : BRANDS,
      categories: (categories && categories.length > 0) ? categories : CATEGORIES,
    };
  } catch (err) {
    return { brands: BRANDS, categories: CATEGORIES };
  }
}

export default async function ProductsPage({ searchParams }) {
  const filters = await getFilters();
  const params = await searchParams;

  return (
    <div className="container-narrow py-6 lg:py-10">
      <div className="mb-6 lg:mb-8">
        <h1 className="heading-display text-2xl lg:text-3xl text-text-primary">
          {params?.category
            ? filters.categories.find((c) => c.slug === params.category)?.name || "Products"
            : params?.brand
            ? params.brand
            : params?.search
            ? `Search: "${params.search}"`
            : "All Products"}
        </h1>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-product skeleton" />
                <div className="h-3 skeleton w-1/3" />
                <div className="h-4 skeleton w-2/3" />
                <div className="h-4 skeleton w-1/4" />
              </div>
            ))}
          </div>
        }
      >
        <ProductGrid filters={filters} searchParams={params} />
      </Suspense>
    </div>
  );
}
