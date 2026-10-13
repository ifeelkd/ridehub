"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice, storeConfig } from "@/lib/store-config";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    shippingCharge,
    freeShippingThreshold,
    isFreeShipping,
    amountToFreeShipping,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-narrow py-20 lg:py-28 text-center">
        <div className="w-20 h-20 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-6 text-text-tertiary">
          <ShoppingBag size={36} />
        </div>
        <h1 className="heading-display text-3xl font-bold text-text-primary mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-text-secondary max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
          Looks like you haven&apos;t added any riding gear yet. Explore our verified helmets, jackets, gloves, and boots.
        </p>
        <Link href="/products" className="btn btn-primary inline-flex items-center gap-2">
          Explore Riding Gear <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  return (
    <div className="container-narrow py-8 lg:py-14">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-default">
        <div>
          <h1 className="heading-display text-3xl lg:text-4xl text-text-primary">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-text-secondary hover:text-red-500 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Meter */}
          <div className="p-4 rounded-2xl bg-bg-secondary/60 border border-border-default">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-text-primary flex items-center gap-1.5">
                <Truck size={15} className="text-accent" />
                {isFreeShipping ? (
                  <span className="text-emerald-600 font-bold">
                    You have unlocked FREE Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-accent">{formatPrice(amountToFreeShipping)}</strong> more for FREE shipping
                  </span>
                )}
              </span>
              <span className="font-semibold text-text-secondary">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-border-default overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFreeShipping ? "bg-emerald-500" : "bg-accent"
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Table / Cards */}
          <div className="divide-y divide-border-default border border-border-default rounded-2xl overflow-hidden bg-bg-primary">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:bg-bg-secondary/30 transition-colors"
              >
                {/* Product Thumbnail */}
                <Link
                  href={`/products/${item.slug}`}
                  className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-bg-secondary flex-shrink-0 border border-border-default"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  {item.brandName && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-accent block">
                      {item.brandName}
                    </span>
                  )}
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-semibold text-text-primary text-base hover:text-accent transition-colors block truncate"
                  >
                    {item.name}
                  </Link>

                  <div className="flex flex-wrap gap-2 text-xs text-text-secondary mt-1">
                    {item.size && (
                      <span className="bg-bg-secondary px-2 py-0.5 rounded-md border border-border-default">
                        Size: <strong className="text-text-primary">{item.size}</strong>
                      </span>
                    )}
                    {item.color && (
                      <span className="bg-bg-secondary px-2 py-0.5 rounded-md border border-border-default">
                        Color: <strong className="text-text-primary">{item.color}</strong>
                      </span>
                    )}
                    {item.sku && (
                      <span className="text-[11px] text-text-tertiary py-0.5">
                        SKU: {item.sku}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-sm font-semibold text-text-primary sm:hidden">
                    {formatPrice(item.price)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border-default rounded-xl bg-bg-secondary/40 overflow-hidden h-9">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-full flex items-center justify-center text-text-primary hover:bg-bg-secondary text-sm transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-text-primary">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-full flex items-center justify-center text-text-primary hover:bg-bg-secondary text-sm transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-text-tertiary hover:text-red-500 p-2 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Price Total Desktop */}
                <div className="hidden sm:block text-right min-w-24">
                  <div className="font-bold text-base text-text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  {item.quantity > 1 && (
                    <div className="text-[11px] text-text-secondary">
                      {formatPrice(item.price)} each
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-text-secondary pt-2">
            <Link
              href="/products"
              className="hover:text-text-primary font-medium flex items-center gap-1"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-border-default bg-bg-primary p-6 space-y-6 sticky top-24">
            <h2 className="heading-display text-xl text-text-primary pb-3 border-b border-border-default">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-semibold text-text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-text-secondary">
                <span>Delivery Charge</span>
                <span className="font-semibold">
                  {isFreeShipping ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(shippingCharge)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-text-secondary">
                <span>Payment Method</span>
                <span className="font-semibold text-text-primary">
                  Cash on Delivery (COD)
                </span>
              </div>

              <div className="pt-3 border-t border-border-default flex justify-between items-baseline">
                <span className="font-bold text-base text-text-primary">
                  Total Payable
                </span>
                <span className="heading-display text-2xl font-bold text-text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-text-secondary leading-relaxed">
              Taxes included. Cash on Delivery is collected at your doorstep upon parcel arrival.
            </p>

            <Link
              href="/checkout"
              className="btn btn-primary w-full h-12 flex items-center justify-center gap-2 text-base font-semibold shadow-md"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>

            {/* Reassurances */}
            <div className="pt-4 border-t border-border-default space-y-2.5 text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-600" />
                <span>100% Genuine brand guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={15} className="text-accent" />
                <span>7-Day Size Exchange policy</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-stone-400" />
                <span>Fast dispatch from Bongaigaon, Assam</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
