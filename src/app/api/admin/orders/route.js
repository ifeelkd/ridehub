import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    const supabase = getSupabaseAdmin();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: true, orders: [] });
    }

    let q = supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      q = q.eq("order_status", status);
    }

    if (query) {
      q = q.or(
        `order_number.ilike.%${query}%,customer_name.ilike.%${query}%,customer_phone.ilike.%${query}%`
      );
    }

    const { data: orders, error } = await q;

    if (error) throw error;

    return NextResponse.json({ success: true, orders: orders || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
