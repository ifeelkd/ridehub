import { getSupabaseServer } from "@/lib/supabase/server";
import { getFallbackProducts } from "@/lib/catalog-data";
import ProductCard from "@/components/ProductCard";
import FilterBar from "./FilterBar";

export default async function ProductGrid({ filters, searchParams }) {
  const supabase = await getSupabaseServer();

  let query = supabase
    .from("products")
    .select(`
      *,
      brand:brands(name, slug),
      images:product_images(id, url, alt_text, is_primary, sort_order),
      variants:product_variants(id, size, color, color_hex, stock_quantity, is_active)
    `)
    .eq("is_active", true);

  // Apply filters
  if (searchParams?.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", searchParams.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (searchParams?.brand) {
    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("name", searchParams.brand)
      .single();
    if (brand) query = query.eq("brand_id", brand.id);
  }

  if (searchParams?.search) {
    query = query.or(
      `name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`
    );
  }

  if (searchParams?.min_price) {
    query = query.gte("base_price", parseInt(searchParams.min_price));
  }

  if (searchParams?.max_price) {
    query = query.lte("base_price", parseInt(searchParams.max_price));
  }

  // Sorting
  const sort = searchParams?.sort || "featured";
  switch (sort) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "price_asc":
      query = query.order("base_price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("base_price", { ascending: false });
      break;
    default:
      query = query
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
  }

  let products = [];
  try {
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      products = data;
    } else {
      products = getFallbackProducts(searchParams || {});
    }
  } catch (err) {
    products = getFallbackProducts(searchParams || {});
  }

  return (
    <div>
      <FilterBar
        filters={filters}
        searchParams={searchParams}
        productCount={products?.length || 0}
      />

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mt-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            No products found
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            Try adjusting your filters or search terms.
          </p>
          <a href="/products" className="btn btn-outline">
            Clear All Filters
          </a>
        </div>
      )}
    </div>
  );
}
