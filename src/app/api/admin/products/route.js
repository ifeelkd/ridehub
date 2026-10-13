import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { PRODUCTS, BRANDS, CATEGORIES } from "@/lib/catalog-data";

export async function GET(request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        success: true,
        products: PRODUCTS,
        brands: BRANDS,
        categories: CATEGORIES,
      });
    }

    const [{ data: products, error: pErr }, { data: brands }, { data: categories }] =
      await Promise.all([
        supabase
          .from("products")
          .select(`
            *,
            brand:brands(id, name, slug),
            category:categories(id, name, slug),
            variants:product_variants(*)
          `)
          .order("created_at", { ascending: false }),
        supabase.from("brands").select("*").order("sort_order"),
        supabase.from("categories").select("*").order("sort_order"),
      ]);

    if (pErr) throw pErr;

    return NextResponse.json({
      success: true,
      products: products || PRODUCTS,
      brands: brands || BRANDS,
      categories: categories || CATEGORIES,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      products: PRODUCTS,
      brands: BRANDS,
      categories: CATEGORIES,
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      brand_id,
      category_id,
      description,
      base_price,
      sale_price,
      sku,
      is_active = true,
      is_featured = false,
      is_new_arrival = false,
      has_variants = false,
      stock_quantity = 0,
      specifications = {},
      image_urls = [],
      variants = [],
    } = body;

    const supabase = getSupabaseAdmin();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        success: true,
        message: "Product created in demo mode",
        product: { id: `demo-p-${Date.now()}`, name, slug },
      });
    }

    // 1. Insert product
    const { data: newProduct, error: pErr } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        brand_id: brand_id || null,
        category_id: category_id || null,
        description,
        base_price: Number(base_price),
        sale_price: sale_price ? Number(sale_price) : null,
        sku,
        is_active,
        is_featured,
        is_new_arrival,
        has_variants,
        stock_quantity: Number(stock_quantity),
        specifications,
      })
      .select()
      .single();

    if (pErr) throw pErr;

    // 2. Insert images
    if (image_urls.length > 0) {
      const imgRecords = image_urls.map((url, idx) => ({
        product_id: newProduct.id,
        url,
        is_primary: idx === 0,
        sort_order: idx + 1,
      }));
      await supabase.from("product_images").insert(imgRecords);
    }

    // 3. Insert variants
    if (has_variants && variants.length > 0) {
      const variantRecords = variants.map((v, idx) => ({
        product_id: newProduct.id,
        name: v.size || v.name || `Variant ${idx + 1}`,
        sku: v.sku || `${sku}-${v.size || idx}`,
        size: v.size || null,
        color: v.color || null,
        stock_quantity: Number(v.stock_quantity || 0),
        sort_order: idx + 1,
      }));
      await supabase.from("product_variants").insert(variantRecords);
    }

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
