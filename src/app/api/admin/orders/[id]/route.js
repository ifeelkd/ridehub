import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { updateStoredOrderStatus } from "@/lib/order-store";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { order_status, payment_status, notes } = body;

    const supabase = getSupabaseAdmin();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      updateStoredOrderStatus(id, { order_status, payment_status });
      return NextResponse.json({ success: true, message: "Updated in demo mode" });
    }

    // 1. Fetch current order to check status transitions
    const { data: currentOrder, error: fetchErr } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .eq("id", id)
      .single();

    if (fetchErr || !currentOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const updates = {};
    if (order_status) updates.order_status = order_status;
    if (payment_status) {
      updates.payment_status = payment_status;
      if (payment_status === "paid" && !currentOrder.paid_at) {
        updates.paid_at = new Date().toISOString();
      }
    }
    if (notes !== undefined) updates.notes = notes;

    // Handle cancellation: restore stock once if transitioning to cancelled
    if (order_status === "cancelled" && currentOrder.order_status !== "cancelled") {
      updates.cancelled_at = new Date().toISOString();

      // Restore variants stock
      for (const item of currentOrder.items || []) {
        if (item.variant_id) {
          const { data: v } = await supabase
            .from("product_variants")
            .select("stock_quantity")
            .eq("id", item.variant_id)
            .single();

          if (v) {
            const restoredStock = v.stock_quantity + item.quantity;
            await supabase
              .from("product_variants")
              .update({ stock_quantity: restoredStock })
              .eq("id", item.variant_id);

            await supabase.from("inventory_log").insert({
              product_id: item.product_id,
              variant_id: item.variant_id,
              change_quantity: item.quantity,
              new_quantity: restoredStock,
              reason: "order_cancelled",
              reference_id: currentOrder.order_number,
            });
          }
        }
      }
    }

    // If marked delivered and COD, offer option or auto-update payment
    if (order_status === "delivered" && currentOrder.payment_method === "cod" && payment_status === undefined) {
      // By default retain unpaid unless owner explicitly confirms payment collected
    }

    const { data: updated, error: updateErr } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
