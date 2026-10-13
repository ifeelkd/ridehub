"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  Truck,
  Phone,
  MessageCircle,
  Printer,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";
import { formatPrice, storeConfig } from "@/lib/store-config";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber;

  const [order, setOrder] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && orderNumber) {
      const saved = sessionStorage.getItem(`order_${orderNumber}`);
      if (saved) {
        try {
          setOrder(JSON.parse(saved));
        } catch {
          // ignore error
        }
      }
    }
  }, [orderNumber]);

  if (!mounted) return null;

  return (
    <div className="container-narrow py-10 lg:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-3 pb-8 border-b border-border-default">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <CheckCircle size={36} />
          </div>
          <span className="badge badge-accent uppercase tracking-wider text-xs">
            Order Confirmed
          </span>
          <h1 className="heading-display text-3xl sm:text-4xl font-bold text-text-primary">
            Thank You for Riding with Us!
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
            Your Cash on Delivery order has been successfully placed. We are preparing your riding gear for dispatch.
          </p>
        </div>

        {/* Order Reference Banner */}
        <div className="p-6 rounded-2xl bg-bg-secondary/60 border border-border-default flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wider block">
              Order Reference Number
            </span>
            <span className="heading-display text-2xl font-bold text-text-primary tracking-wide">
              {orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="btn btn-sm btn-outline flex items-center gap-1.5"
            >
              <Printer size={15} /> Print Receipt
            </button>
            <a
              href={`https://wa.me/${storeConfig.contact.whatsapp}?text=${encodeURIComponent(
                `Hi RideHub! I just placed order ${orderNumber}. Please confirm my shipment details.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
            >
              <MessageCircle size={15} /> WhatsApp Support
            </a>
          </div>
        </div>

        {/* COD Notice Box */}
        <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-2">
          <h3 className="font-semibold text-amber-900 dark:text-amber-400 text-sm flex items-center gap-2">
            <Truck size={18} /> Cash on Delivery Instructions
          </h3>
          <p className="text-xs text-amber-800/80 dark:text-amber-300 leading-relaxed">
            Please keep exact cash or prepare your UPI app (Google Pay, PhonePe, Paytm) ready for the courier delivery partner when they arrive at your shipping address.
          </p>
        </div>

        {/* Order Details & Items (if snapshot present) */}
        {order && (
          <div className="rounded-2xl border border-border-default bg-bg-primary overflow-hidden">
            <div className="px-6 py-4 border-b border-border-default bg-bg-secondary/30 flex items-center justify-between">
              <span className="font-semibold text-text-primary text-sm flex items-center gap-2">
                <Package size={16} className="text-accent" /> Items in this Order
              </span>
              <span className="text-xs text-text-secondary">
                Payment: <strong className="text-text-primary">COD (Unpaid)</strong>
              </span>
            </div>

            <div className="p-6 divide-y divide-border-default">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center gap-4 first:pt-0 last:pb-0">
                  <div className="relative w-14 h-16 rounded-xl bg-bg-secondary overflow-hidden flex-shrink-0 border border-border-default">
                    {item.product_image_url && (
                      <Image
                        src={item.product_image_url}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text-primary text-sm truncate">
                      {item.product_name}
                    </h4>
                    <p className="text-xs text-text-secondary">
                      Qty: {item.quantity} {item.variant_name ? `• ${item.variant_name}` : ""}
                    </p>
                    <p className="text-[11px] text-text-tertiary">SKU: {item.sku}</p>
                  </div>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatPrice(item.line_total || item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="p-6 border-t border-border-default bg-bg-secondary/20 space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Delivery Charge</span>
                <span>{order.shippingCharge === 0 ? "FREE" : formatPrice(order.shippingCharge)}</span>
              </div>
              <div className="flex justify-between font-bold text-text-primary text-base pt-2 border-t border-border-default">
                <span>Total Amount to Pay</span>
                <span className="heading-display text-xl text-accent">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {/* Shipping Address Snapshot */}
            {order.shippingAddress && (
              <div className="p-6 border-t border-border-default bg-bg-secondary/10 text-xs text-text-secondary">
                <span className="font-semibold text-text-primary block mb-1">
                  Delivering to:
                </span>
                <p>{order.customerName} ({order.customerPhone})</p>
                <p>{order.shippingAddress}</p>
              </div>
            )}
          </div>
        )}

        {/* Store Location & Support */}
        <div className="p-6 rounded-2xl border border-border-default bg-bg-secondary/40 text-center space-y-3">
          <h3 className="font-semibold text-text-primary text-sm">
            Questions About Your Shipment?
          </h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            Our physical store is open Monday through Saturday (10:00 AM – 8:30 PM) at Chapaguri Road, Bongaigaon, Assam. Call us directly or message our support line.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold pt-1">
            <a
              href={`tel:${storeConfig.contact.phone}`}
              className="text-text-primary hover:text-accent flex items-center gap-1.5"
            >
              <Phone size={14} /> {storeConfig.contact.phone}
            </a>
            <span>•</span>
            <Link href="/products" className="text-accent hover:underline flex items-center gap-1">
              Continue Shopping <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
