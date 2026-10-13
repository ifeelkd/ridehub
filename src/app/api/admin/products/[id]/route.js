import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { PRODUCTS } from "@/lib/catalog-data";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data: product, error } = await supabase
        .from("products")
        .select(`
          *,
          brand:brands(*),
          category:categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq("id", id)
        .single();

      if (!error && product) return NextResponse.json({ success: true, product });
    }

    const fallback = PRODUCTS.find((p) => p.id === id || p.slug === id);
    return NextResponse.json({ success: true, product: fallback || null });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const supabase = getSupabaseAdmin();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: true, message: "Updated in demo mode" });
    }

    const updates = {};
    const allowed = [
      "name",
      "slug",
      "brand_id",
      "category_id",
      "description",
      "base_price",
      "sale_price",
      "sku",
      "is_active",
      "is_featured",
      "is_new_arrival",
      "specifications",
    ];

    allowed.forEach((k) => {
      if (body[k] !== undefined) updates[k] = body[k];
    });

    const { data: updated, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
