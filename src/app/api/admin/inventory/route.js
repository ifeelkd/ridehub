import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { variant_id, product_id, new_quantity, reason = "manual_adjustment", note = "" } = body;

    if (new_quantity < 0) {
      return NextResponse.json(
        { success: false, error: "Inventory quantity cannot be negative." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        success: true,
        message: "Inventory updated in demo mode",
        new_quantity,
      });
    }

    let previousQuantity = 0;

    if (variant_id) {
      const { data: v, error: vErr } = await supabase
        .from("product_variants")
        .select("stock_quantity, product_id")
        .eq("id", variant_id)
        .single();

      if (vErr || !v) {
        return NextResponse.json({ success: false, error: "Variant not found" }, { status: 404 });
      }

      previousQuantity = v.stock_quantity;

      await supabase
        .from("product_variants")
        .update({ stock_quantity: new_quantity })
        .eq("id", variant_id);

      await supabase.from("inventory_log").insert({
        product_id: v.product_id,
        variant_id,
        change_quantity: new_quantity - previousQuantity,
        new_quantity,
        reason: `${reason}${note ? ` (${note})` : ""}`,
      });
    } else if (product_id) {
      const { data: p } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", product_id)
        .single();

      if (p) {
        previousQuantity = p.stock_quantity;
        await supabase
          .from("products")
          .update({ stock_quantity: new_quantity })
          .eq("id", product_id);

        await supabase.from("inventory_log").insert({
          product_id,
          change_quantity: new_quantity - previousQuantity,
          new_quantity,
          reason: `${reason}${note ? ` (${note})` : ""}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      new_quantity,
      change: new_quantity - previousQuantity,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
