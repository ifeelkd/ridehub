import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Printer,
} from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/store-config";
import OrderControlPanel from "./OrderControlPanel";

async function getOrder(id) {
  try {
    const supabase = getSupabaseAdmin();
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data: order, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*)
        `)
        .eq("id", id)
        .single();

      if (!error && order) return order;
    }
  } catch {
    // fallback below
  }

  // Fallback demo order
  return {
    id,
    order_number: "RH-2026-8812",
    customer_name: "Bikash Kalita",
    customer_phone: "9864012345",
    customer_email: "bikash.k@example.com",
    shipping_address: "House 45, Bye-lane 3, Mayapuri, Near Kali Mandir",
    city: "Bongaigaon",
    state: "Assam",
    pin_code: "783380",
    delivery_instructions: "Please call 10 minutes prior to delivery.",
    subtotal: 12999,
    shipping_charge: 0,
    total: 12999,
    order_status: "confirmed",
    payment_method: "cod",
    payment_status: "unpaid",
    created_at: new Date().toISOString(),
    items: [
      {
        id: "item-1",
        product_name: "Axor Apex Carbon Fibre Helmet",
        variant_name: "L",
        sku: "AXR-APEX-CF-L",
        quantity: 1,
        unit_price: 12999,
        line_total: 12999,
        product_image_url:
          "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80",
      },
    ],
  };
}

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/admin/orders"
          className="text-xs text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 mb-3 font-medium"
        >
          <ArrowLeft size={14} /> Back to All Orders
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="heading-display text-2xl sm:text-3xl font-bold text-text-primary">
              Order {order.order_number}
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`badge text-xs uppercase font-bold ${
                order.order_status === "delivered"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : order.order_status === "cancelled"
                  ? "bg-red-500/10 text-red-600 border-red-500/20"
                  : "bg-accent/10 text-accent border-accent/20"
              }`}
            >
              {order.order_status}
            </span>
            <span
              className={`badge text-xs uppercase font-bold ${
                order.payment_status === "paid"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-amber-500/10 text-amber-600"
              }`}
            >
              COD: {order.payment_status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Order Items & Customer Snapshot */}
        <div className="lg:col-span-7 space-y-6">
          {/* Items Card */}
          <div className="rounded-2xl border border-border-default bg-bg-primary overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border-default bg-bg-secondary/40 font-semibold text-sm text-text-primary flex items-center justify-between">
              <span>Items in this Order ({order.items?.length || 0})</span>
              <span className="text-xs text-text-secondary">Snapshotted at purchase</span>
            </div>

            <div className="p-6 divide-y divide-border-default">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                  <div className="relative w-16 h-20 rounded-xl bg-bg-secondary overflow-hidden flex-shrink-0 border border-border-default">
                    {item.product_image_url ? (
                      <Image
                        src={item.product_image_url}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                        <Package size={20} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary text-sm truncate">
                      {item.product_name}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-text-secondary mt-1">
                      {item.variant_name && (
                        <span className="bg-bg-secondary px-2 py-0.5 rounded border border-border-default">
                          Size/Variant: {item.variant_name}
                        </span>
                      )}
                      <span className="text-text-tertiary">SKU: {item.sku}</span>
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      Qty: <strong>{item.quantity}</strong> × {formatPrice(item.unit_price)}
                    </div>
                  </div>

                  <span className="font-bold text-text-primary text-sm">
                    {formatPrice(item.line_total || item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="p-6 border-t border-border-default bg-bg-secondary/20 space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Delivery Charge</span>
                <span>
                  {order.shipping_charge === 0 ? "FREE" : formatPrice(order.shipping_charge)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-text-primary text-base pt-2 border-t border-border-default">
                <span>Total Due on Delivery</span>
                <span className="heading-display text-2xl text-accent">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info Card */}
          <div className="rounded-2xl border border-border-default bg-bg-primary p-6 space-y-4 shadow-sm">
            <h3 className="font-semibold text-text-primary text-sm flex items-center gap-2">
              <MapPin size={16} className="text-accent" /> Customer & Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-secondary">
              <div>
                <span className="font-semibold text-text-primary block mb-0.5">
                  Customer Name
                </span>
                <p>{order.customer_name}</p>
              </div>

              <div>
                <span className="font-semibold text-text-primary block mb-0.5">
                  Contact Phone
                </span>
                <p>{order.customer_phone}</p>
              </div>

              {order.customer_email && (
                <div>
                  <span className="font-semibold text-text-primary block mb-0.5">
                    Email
                  </span>
                  <p>{order.customer_email}</p>
                </div>
              )}

              <div className="sm:col-span-2">
                <span className="font-semibold text-text-primary block mb-0.5">
                  Full Shipping Address
                </span>
                <p className="leading-relaxed">
                  {order.shipping_address}<br />
                  {order.city}, {order.state} — {order.pin_code}
                </p>
              </div>

              {order.delivery_instructions && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-bg-secondary border border-border-default">
                  <span className="font-semibold text-text-primary block mb-0.5">
                    Delivery Instructions from Customer:
                  </span>
                  <p className="italic">{order.delivery_instructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Actions & Status Manager */}
        <div className="lg:col-span-5">
          <OrderControlPanel order={order} />
        </div>
      </div>
    </div>
  );
}
