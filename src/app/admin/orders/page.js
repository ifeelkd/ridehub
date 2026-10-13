import Link from "next/link";

import {
  Package,
  Search,
  Filter,
  ArrowRight,
  Phone,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/store-config";

async function getOrders(statusFilter, searchQuery) {
  let orders = [];

  try {
    const supabase = getSupabaseAdmin();
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      let query = supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("order_status", statusFilter);
      }

      if (searchQuery) {
        query = query.or(
          `order_number.ilike.%${searchQuery}%,customer_name.ilike.%${searchQuery}%,customer_phone.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;
      if (!error && data) orders = data;
    }
  } catch {
    // fallback below
  }

  // Fallback demo orders if database empty
  if (orders.length === 0) {
    orders = [
      {
        id: "demo-1",
        order_number: "RH-2026-8812",
        customer_name: "Bikash Kalita",
        customer_phone: "9864012345",
        city: "Bongaigaon",
        state: "Assam",
        total: 12999,
        order_status: "pending",
        payment_status: "unpaid",
        items_count: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: "demo-2",
        order_number: "RH-2026-7491",
        customer_name: "Amitava Das",
        customer_phone: "9435098765",
        city: "Guwahati",
        state: "Assam",
        total: 7999,
        order_status: "confirmed",
        payment_status: "unpaid",
        items_count: 1,
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: "demo-3",
        order_number: "RH-2026-6102",
        customer_name: "Rupam Barman",
        customer_phone: "9706123987",
        city: "Kokrajhar",
        state: "Assam",
        total: 4499,
        order_status: "shipped",
        payment_status: "unpaid",
        items_count: 2,
        created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
      },
      {
        id: "demo-4",
        order_number: "RH-2026-5019",
        customer_name: "Manash Jyoti",
        customer_phone: "8876543210",
        city: "Tezpur",
        state: "Assam",
        total: 3999,
        order_status: "delivered",
        payment_status: "paid",
        items_count: 1,
        created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
      },
      {
        id: "demo-5",
        order_number: "RH-2026-4190",
        customer_name: "Prakash Roy",
        customer_phone: "9101234567",
        city: "Dhubri",
        state: "Assam",
        total: 5999,
        order_status: "cancelled",
        payment_status: "unpaid",
        items_count: 1,
        created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
      },
    ];

    if (statusFilter && statusFilter !== "all") {
      orders = orders.filter((o) => o.order_status === statusFilter);
    }
  }

  return orders;
}

const statusTabs = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default async function AdminOrdersPage({ searchParams }) {
  const params = await searchParams;
  const currentStatus = params?.status || "all";
  const searchQuery = params?.q || "";

  const orders = await getOrders(currentStatus, searchQuery);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-display text-2xl sm:text-3xl font-bold text-text-primary">
            Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Track customer shipments, update delivery stages, and verify COD receipts.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-border-default">
        {statusTabs.map((tab) => {
          const isActive = currentStatus === tab.key;
          return (
            <Link
              key={tab.key}
              href={`/admin/orders?status=${tab.key}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-text-primary text-bg-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Orders List Table */}
      <div className="rounded-2xl border border-border-default bg-bg-primary overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-bg-secondary/60 text-xs uppercase tracking-wider text-text-secondary border-b border-border-default">
              <tr>
                <th className="px-5 py-3.5">Order Ref</th>
                <th className="px-5 py-3.5">Customer & Phone</th>
                <th className="px-5 py-3.5">Destination</th>
                <th className="px-5 py-3.5">Order Status</th>
                <th className="px-5 py-3.5">COD Payment</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {orders.map((order) => {
                const isPaid = order.payment_status === "paid";
                const isDelivered = order.order_status === "delivered";
                const isCancelled = order.order_status === "cancelled";
                const isShipped = order.order_status === "shipped";

                return (
                  <tr key={order.id} className="hover:bg-bg-secondary/30 transition-colors">
                    {/* Order Reference */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-text-primary text-sm">
                        {order.order_number}
                      </div>
                      <div className="text-[11px] text-text-secondary">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-text-primary">
                        {order.customer_name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-text-secondary">
                          {order.customer_phone}
                        </span>
                        <a
                          href={`https://wa.me/91${order.customer_phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle size={14} />
                        </a>
                        <a
                          href={`tel:${order.customer_phone}`}
                          className="text-text-secondary hover:text-text-primary"
                          title="Call Customer"
                        >
                          <Phone size={13} />
                        </a>
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="px-5 py-4 text-text-secondary">
                      <div>{order.city}</div>
                      <div className="text-[11px] opacity-75">{order.state}</div>
                    </td>

                    {/* Order Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`badge text-[11px] uppercase font-bold ${
                          isDelivered
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : isCancelled
                            ? "bg-red-500/10 text-red-600 border-red-500/20"
                            : isShipped
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </td>

                    {/* COD Payment Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isPaid
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                        }`}
                      >
                        {isPaid ? "✓ Collected" : "Pending COD"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 font-bold text-text-primary">
                      {formatPrice(order.total)}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="btn btn-sm btn-outline text-xs"
                      >
                        Manage Order
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="p-12 text-center text-text-secondary">
            <Package size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No orders found</p>
            <p className="text-xs text-text-secondary mt-1">
              Try switching status filters or clearing search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
