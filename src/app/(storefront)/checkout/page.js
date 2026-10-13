"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice, storeConfig } from "@/lib/store-config";

const INDIAN_STATES = [
  "Assam",
  "Meghalaya",
  "Arunachal Pradesh",
  "Nagaland",
  "Manipur",
  "Mizoram",
  "Tripura",
  "Sikkim",
  "West Bengal",
  "Bihar",
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Rajasthan",
  "Gujarat",
  "Haryana",
  "Punjab",
  "Kerala",
  "Telangana",
  "Andhra Pradesh",
  "Odisha",
  "Jharkhand",
  "Chhattisgarh",
  "Madhya Pradesh",
  "Uttarakhand",
  "Himachal Pradesh",
  "Goa",
  "Jammu and Kashmir",
  "Ladakh",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, shippingCharge, total, isFreeShipping, clearCart } =
    useCart();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    shipping_address: "",
    city: "Bongaigaon",
    state: "Assam",
    pin_code: "",
    delivery_instructions: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container-narrow py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-4 text-text-tertiary">
          <ShoppingBag size={30} />
        </div>
        <h1 className="heading-display text-2xl font-bold text-text-primary mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-text-secondary text-sm mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link href="/products" className="btn btn-primary">
          Browse Riding Gear
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.customer_name.trim() || formData.customer_name.length < 2) {
      errors.customer_name = "Full name is required (min 2 letters)";
    }
    const cleanPhone = formData.customer_phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.customer_phone = "Please enter a valid 10-digit Indian mobile number";
    }
    if (formData.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      errors.customer_email = "Invalid email format";
    }
    if (!formData.shipping_address.trim() || formData.shipping_address.length < 5) {
      errors.shipping_address = "Please enter a complete delivery address (street/house/landmark)";
    }
    if (!formData.city.trim()) {
      errors.city = "City / Town is required";
    }
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }
    if (!/^\d{6}$/.test(formData.pin_code.trim())) {
      errors.pin_code = "PIN code must be exactly 6 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        ...formData,
        customer_phone: formData.customer_phone.replace(/\D/g, ""),
        items: items.map((i) => ({
          productId: i.productId || i.id,
          variantId: i.variantId || null,
          name: i.name,
          quantity: i.quantity,
          size: i.size || null,
          color: i.color || null,
          sku: i.sku || null,
          image: i.image || null,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process your order. Please try again.");
      }

      // Save order snapshot in sessionStorage for confirmation page display
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`order_${data.orderNumber}`, JSON.stringify(data.order));
      }

      // Clear shopping cart
      clearCart();

      // Navigate to order confirmation page
      router.push(`/orders/${data.orderNumber}`);
    } catch (err) {
      console.error("Checkout submission error:", err);
      setErrorMsg(err.message || "An unexpected error occurred. Please contact us on WhatsApp.");
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow py-8 lg:py-14">
      <div className="mb-8">
        <h1 className="heading-display text-3xl lg:text-4xl text-text-primary">
          Checkout
        </h1>
        <p className="text-sm text-text-secondary mt-1 flex items-center gap-1.5">
          <Lock size={14} className="text-emerald-600" /> Secure Guest Checkout • Cash on Delivery (COD)
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm flex items-center gap-2">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Details */}
            <div className="rounded-2xl border border-border-default bg-bg-primary p-6 space-y-4">
              <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-text-primary text-bg-primary flex items-center justify-center text-xs">
                  1
                </span>
                Customer Contact Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="label" htmlFor="customer_name">
                    Full Name *
                  </label>
                  <input
                    id="customer_name"
                    name="customer_name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.customer_name}
                    onChange={handleChange}
                    className={`input ${formErrors.customer_name ? "input-error" : ""}`}
                  />
                  {formErrors.customer_name && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.customer_name}</p>
                  )}
                </div>

                <div>
                  <label className="label" htmlFor="customer_phone">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-secondary font-medium">
                      +91
                    </span>
                    <input
                      id="customer_phone"
                      name="customer_phone"
                      type="tel"
                      required
                      placeholder="9876543210"
                      maxLength={10}
                      value={formData.customer_phone}
                      onChange={handleChange}
                      className={`input pl-12 ${formErrors.customer_phone ? "input-error" : ""}`}
                    />
                  </div>
                  {formErrors.customer_phone && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.customer_phone}</p>
                  )}
                  <p className="text-[11px] text-text-secondary mt-1">
                    Used by the delivery agent to confirm drop-off.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="label" htmlFor="customer_email">
                    Email Address (Optional)
                  </label>
                  <input
                    id="customer_email"
                    name="customer_email"
                    type="email"
                    placeholder="rahul@example.com (for order receipt & updates)"
                    value={formData.customer_email}
                    onChange={handleChange}
                    className={`input ${formErrors.customer_email ? "input-error" : ""}`}
                  />
                  {formErrors.customer_email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.customer_email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-2xl border border-border-default bg-bg-primary p-6 space-y-4">
              <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-text-primary text-bg-primary flex items-center justify-center text-xs">
                  2
                </span>
                Shipping Address
              </h2>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="label" htmlFor="shipping_address">
                    House / Flat No., Building, Street & Landmark *
                  </label>
                  <textarea
                    id="shipping_address"
                    name="shipping_address"
                    rows={2}
                    required
                    placeholder="e.g. Flat 302, Green Valley Apts, Near Old ASTC Bus Stand"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    className={`input py-2.5 h-auto ${formErrors.shipping_address ? "input-error" : ""}`}
                  />
                  {formErrors.shipping_address && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.shipping_address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label" htmlFor="city">
                      City / Town *
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      placeholder="e.g. Bongaigaon"
                      value={formData.city}
                      onChange={handleChange}
                      className={`input ${formErrors.city ? "input-error" : ""}`}
                    />
                    {formErrors.city && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="label" htmlFor="state">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="input cursor-pointer"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label" htmlFor="pin_code">
                      PIN Code *
                    </label>
                    <input
                      id="pin_code"
                      name="pin_code"
                      type="text"
                      maxLength={6}
                      required
                      placeholder="783380"
                      value={formData.pin_code}
                      onChange={handleChange}
                      className={`input ${formErrors.pin_code ? "input-error" : ""}`}
                    />
                    {formErrors.pin_code && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.pin_code}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="delivery_instructions">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    id="delivery_instructions"
                    name="delivery_instructions"
                    type="text"
                    placeholder="e.g. Call before delivery, deliver in afternoon"
                    value={formData.delivery_instructions}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border border-border-default bg-bg-primary p-6 space-y-4">
              <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-text-primary text-bg-primary flex items-center justify-center text-xs">
                  3
                </span>
                Payment Method
              </h2>

              <div className="p-4 rounded-xl border-2 border-accent bg-accent/5 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary text-sm">
                      Cash on Delivery (COD)
                    </span>
                    <span className="badge badge-accent text-[10px]">
                      VERIFIED RETAIL
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mt-1">
                    Pay in cash or scan UPI directly to the courier delivery executive when your riding gear parcel arrives at your door. Zero upfront payment required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Placement */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border-default bg-bg-primary p-6 space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-border-default">
                <h2 className="heading-display text-xl text-text-primary">
                  Order Review
                </h2>
                <Link
                  href="/cart"
                  className="text-xs text-accent hover:underline font-medium"
                >
                  Edit Cart
                </Link>
              </div>

              {/* Items List Snapshot */}
              <div className="divide-y divide-border-default max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg bg-bg-secondary flex-shrink-0 overflow-hidden border border-border-default">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primary truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-text-secondary">
                        Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ""}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2.5 pt-3 border-t border-border-default text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-text-secondary">
                  <span>Shipping Fee</span>
                  <span className="font-semibold">
                    {isFreeShipping ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(shippingCharge)
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-border-default flex justify-between items-baseline">
                  <span className="font-bold text-base text-text-primary">
                    Total Amount Due
                  </span>
                  <span className="heading-display text-2xl font-bold text-text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full h-13 text-base font-semibold shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Confirm Cash on Delivery Order <ArrowRight size={18} />
                  </span>
                )}
              </button>

              {/* Policies & Assurances */}
              <div className="space-y-2.5 pt-4 border-t border-border-default text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-accent flex-shrink-0" />
                  <span>Ships from Bongaigaon, Assam within 24-48 hrs</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={14} className="text-accent flex-shrink-0" />
                  <span>7-Day Hassle-Free Size Exchange Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>100% Genuine brand authorized merchandise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
