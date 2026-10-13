"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Truck,
  RotateCcw,
  AlertCircle,
  DollarSign,
  Printer,
  Phone,
  MessageCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/store-config";

export default function OrderControlPanel({ order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.order_status || "pending");
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status || "unpaid");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus === "cancelled") {
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel this order? This will automatically restore reserved stock to inventory."
      );
      if (!confirmCancel) return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update failed");

      setStatus(newStatus);
      setMessage(`Order status updated to "${newStatus}"`);
      router.refresh();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status: "paid" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update failed");

      setPaymentStatus("paid");
      setMessage("COD cash collection confirmed!");
      router.refresh();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-semibold flex items-center gap-2">
          <CheckCircle size={15} />
          <span>{message}</span>
        </div>
      )}

      {/* Status Controls */}
      <div className="p-6 rounded-2xl border border-border-default bg-bg-primary space-y-4">
        <h3 className="font-semibold text-text-primary text-sm">
          Update Order Status
        </h3>

        <div className="flex flex-wrap gap-2">
          {["pending", "confirmed", "packed", "shipped", "delivered"].map((st) => (
            <button
              key={st}
              disabled={loading || status === "cancelled"}
              onClick={() => handleUpdateStatus(st)}
              className={`btn btn-sm capitalize text-xs ${
                status === st
                  ? "btn-primary shadow-sm"
                  : "btn-outline border-border-default hover:bg-bg-secondary"
              }`}
            >
              {st}
            </button>
          ))}

          <button
            disabled={loading || status === "cancelled"}
            onClick={() => handleUpdateStatus("cancelled")}
            className="btn btn-sm text-xs border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 ml-auto"
          >
            Cancel & Restore Stock
          </button>
        </div>
      </div>

      {/* COD Payment Collection Toggle */}
      <div className="p-6 rounded-2xl border border-border-default bg-bg-primary space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text-primary text-sm">
              COD Payment State
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Confirm only when the courier delivery executive deposits the cash.
            </p>
          </div>
          <span
            className={`badge font-bold uppercase text-[10px] ${
              paymentStatus === "paid"
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
            }`}
          >
            {paymentStatus === "paid" ? "Paid" : "Awaiting Collection"}
          </span>
        </div>

        {paymentStatus !== "paid" ? (
          <button
            onClick={handleMarkPaid}
            disabled={loading}
            className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white w-full flex items-center justify-center gap-2 text-xs font-semibold"
          >
            <CheckCircle size={15} /> Confirm COD Cash Collected ({formatPrice(order.total)})
          </button>
        ) : (
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
            <CheckCircle size={15} /> Cash payment verified and accounted for.
          </p>
        )}
      </div>

      {/* Quick Customer Communication */}
      <div className="p-6 rounded-2xl border border-border-default bg-bg-primary space-y-3">
        <h3 className="font-semibold text-text-primary text-sm">
          Customer Communication
        </h3>
        <div className="flex gap-3">
          <a
            href={`https://wa.me/91${order.customer_phone}?text=${encodeURIComponent(
              `Hi ${order.customer_name}! This is RideHub Bongaigaon regarding your order ${order.order_number}. Current status: ${status}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white flex-1 flex items-center justify-center gap-1.5 text-xs"
          >
            <MessageCircle size={15} /> WhatsApp
          </a>

          <a
            href={`tel:${order.customer_phone}`}
            className="btn btn-sm btn-outline flex-1 flex items-center justify-center gap-1.5 text-xs"
          >
            <Phone size={14} /> Call Customer
          </a>

          <button
            onClick={() => window.print()}
            className="btn btn-sm btn-outline flex items-center gap-1.5 text-xs"
            title="Print packing slip"
          >
            <Printer size={15} /> Print Slip
          </button>
        </div>
      </div>
    </div>
  );
}
