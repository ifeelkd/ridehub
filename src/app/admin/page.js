import Link from "next/link";

import {
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  BarChart2,
  CheckCircle2,
  Truck,
  IndianRupee,
} from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/store-config";
import { PRODUCTS } from "@/lib/catalog-data";

async function getDashboardData() {
  let orders = [];
  let lowStockItems = [];

  try {
    const supabase = getSupabaseAdmin();
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // 1. Fetch Orders
      const { data: dbOrders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (dbOrders) orders = dbOrders;

      // 2. Fetch Low Stock Variants (< 5)
      const { data: dbVariants } = await supabase
        .from("product_variants")
        .select(`
          id,
          sku,
          size,
          color,
          stock_quantity,
          product:products(name, slug)
        `)
        .lte("stock_quantity", 5)
        .order("stock_quantity", { ascending: true })
        .limit(6);

      if (dbVariants && dbVariants.length > 0) {
        lowStockItems = dbVariants.map((v) => ({
          id: v.id,
          name: `${v.product?.name || "Product"} (${[v.size, v.color].filter(Boolean).join(" / ")})`,
          sku: v.sku,
          stock: v.stock_quantity,
          slug: v.product?.slug,
        }));
      }
    }
  } catch (err) {
    // fallback below
  }

  // Fallback demo/initial data if empty
  if (orders.length === 0) {
    orders = [
      {
        id: "demo-1",
        order_number: "RH-2026-8812",
        customer_name: "Bikash Kalita",
        customer_phone: "9864012345",
        city: "Bongaigaon",
        total: 12999,
        order_status: "confirmed",
        payment_status: "unpaid",
        created_at: "2026-01-14T10:30:00.000Z",
      },
      {
        id: "demo-2",
        order_number: "RH-2026-7491",
        customer_name: "Amitava Das",
        customer_phone: "9435098765",
        city: "Guwahati",
        total: 7999,
        order_status: "shipped",
        payment_status: "unpaid",
        created_at: "2026-01-13T15:20:00.000Z",
      },
      {
        id: "demo-3",
        order_number: "RH-2026-6102",
        customer_name: "Rupam Barman",
        customer_phone: "9706123987",
        city: "Kokrajhar",
        total: 4499,
        order_status: "delivered",
        payment_status: "paid",
        created_at: "2026-01-11T12:00:00.000Z",
      },
    ];
  }

  if (lowStockItems.length === 0) {
    // extract low stock from catalog
    PRODUCTS.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.stock_quantity <= 3) {
          lowStockItems.push({
            id: v.id,
            name: `${p.name} (${v.size || v.name})`,
            sku: v.sku,
            stock: v.stock_quantity,
            slug: p.slug,
          });
        }
      });
    });
  }

  // Calculate Metrics
  const totalOrders = orders.length;
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.created_at?.startsWith(todayDateStr)).length;

  const totalOrderValue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const collectedRevenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingCodValue = orders
    .filter((o) => o.payment_status === "unpaid" && o.order_status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  return {
    orders,
    lowStockItems: lowStockItems.slice(0, 5),
    todayOrders,
    totalOrders,
    totalOrderValue,
    collectedRevenue,
    pendingCodValue,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Live Operations
            </span>
          </div>
          <h1 className="heading-display text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-wide">
            Store Overview
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Real-time retail inventory status and Cash on Delivery order pipeline for RideHub Bongaigaon.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/admin/products/new"
            className="btn btn-primary flex items-center gap-2 shadow-sm font-bold"
          >
            <Plus size={16} /> Add Product
          </Link>
          <Link
            href="/admin/inventory"
            className="btn btn-outline flex items-center gap-2 font-bold"
          >
            <BarChart2 size={16} /> Update Stock
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {/* Today's Orders */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[150px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Orders Today
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <div className="my-3">
            <div className="heading-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-none">
              {data.todayOrders}
            </div>
          </div>
          <p className="text-xs text-stone-500 font-medium">
            {data.totalOrders} total recorded orders
          </p>
        </div>

        {/* Collected Cash */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[150px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Collected Cash
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="my-3">
            <div className="heading-display text-3xl sm:text-4xl font-bold text-emerald-600 tracking-tight leading-none">
              {formatPrice(data.collectedRevenue)}
            </div>
          </div>
          <p className="text-xs text-emerald-700 font-medium">
            Deposited from fulfilled orders
          </p>
        </div>

        {/* Pending COD Cash */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[150px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Pending COD
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <div className="my-3">
            <div className="heading-display text-3xl sm:text-4xl font-bold text-amber-600 tracking-tight leading-none">
              {formatPrice(data.pendingCodValue)}
            </div>
          </div>
          <p className="text-xs text-stone-500 font-medium">
            Awaiting doorstep collection
          </p>
        </div>

        {/* Total Booked Demand */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[150px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Total Booked
            </span>
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="my-3">
            <div className="heading-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-none">
              {formatPrice(data.totalOrderValue)}
            </div>
          </div>
          <p className="text-xs text-stone-500 font-medium">
            Gross customer demand
          </p>
        </div>
      </div>

      {/* 2-Column Split: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 rounded-2xl border border-stone-200/90 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-white">
            <div>
              <h2 className="heading-display text-lg sm:text-xl font-bold text-stone-900 tracking-wide">
                Recent Orders
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Latest customer submissions awaiting fulfillment
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 transition-colors"
            >
              View All Orders <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.orders.slice(0, 6).map((order) => {
                  const isDelivered = order.order_status === "delivered";
                  const isCancelled = order.order_status === "cancelled";
                  const isShipped = order.order_status === "shipped";

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-6 py-4 font-bold text-stone-900 whitespace-nowrap">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-stone-900">
                          {order.customer_name}
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          {order.customer_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-600 whitespace-nowrap">
                        {order.city}
                      </td>
                      <td className="px-6 py-4 font-bold text-stone-900 whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`badge text-[11px] uppercase font-bold px-2.5 py-1 ${
                            isDelivered
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : isCancelled
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : isShipped
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-4 rounded-2xl border border-stone-200/90 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-white">
            <div>
              <h2 className="heading-display text-lg font-bold text-stone-900 flex items-center gap-2 tracking-wide">
                <AlertTriangle size={18} className="text-amber-500" /> Low Stock Alert
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Units below threshold (&le; 5)
              </p>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
            >
              Restock
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {data.lowStockItems.length > 0 ? (
              data.lowStockItems.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-stone-500 font-mono mt-0.5 block">
                      SKU: {item.sku}
                    </span>
                  </div>
                  <span className="badge bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex-shrink-0 px-2.5 py-1">
                    {item.stock} left
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-stone-500">
                All inventory levels are healthy!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
