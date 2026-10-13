"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice, calculateShipping, getFreeShippingProgress } from "@/lib/store-config";

export default function CartDrawer({ open, onClose }) {
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;
  const freeShippingInfo = getFreeShippingProgress(subtotal);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-drawer)]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg-overlay animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h2 className="text-base font-semibold">
              Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-icon btn-ghost"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {freeShippingInfo && !freeShippingInfo.achieved && itemCount > 0 && (
          <div className="px-4 py-3 bg-accent-light border-b border-accent-muted">
            <div className="flex items-center gap-2 text-xs font-medium text-accent-hover mb-1.5">
              <Truck size={14} />
              Add {formatPrice(freeShippingInfo.remaining)} more for free shipping
            </div>
            <div className="w-full h-1.5 bg-accent-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${freeShippingInfo.percentage}%` }}
              />
            </div>
          </div>
        )}
        {freeShippingInfo && freeShippingInfo.achieved && itemCount > 0 && (
          <div className="px-4 py-3 bg-green-50 border-b border-green-200">
            <div className="flex items-center gap-2 text-xs font-medium text-green-700">
              <Truck size={14} />
              You&apos;ve unlocked free shipping! 🎉
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <ShoppingBag size={48} className="text-text-tertiary mb-4" strokeWidth={1} />
              <h3 className="text-base font-semibold mb-1">Your cart is empty</h3>
              <p className="text-sm text-text-secondary mb-6">
                Explore our collection of premium riding gear.
              </p>
              <Link
                href="/products"
                onClick={onClose}
                className="btn btn-primary"
              >
                Shop Now
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => {
                const itemKey = item.variantId || item.productId;
                const itemPrice = item.salePrice || item.price;
                return (
                  <li key={itemKey} className="p-4 flex gap-3">
                    {/* Image */}
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="flex-shrink-0 w-20 h-24 bg-bg-secondary rounded-md overflow-hidden"
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          width={80}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                          <ShoppingBag size={20} />
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={onClose}
                        className="text-sm font-medium text-text-primary hover:text-accent transition-colors line-clamp-2 no-underline"
                      >
                        {item.productName}
                      </Link>
                      {item.variantName && (
                        <p className="text-xs text-text-secondary mt-0.5">
                          {item.variantName}
                        </p>
                      )}
                      {item.brandName && (
                        <p className="text-xs text-text-tertiary mt-0.5">
                          {item.brandName}
                        </p>
                      )}
                      <p className="text-sm font-semibold mt-1.5">
                        {formatPrice(itemPrice)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-0 border border-border rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(itemKey, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary transition-colors rounded-l-md"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x border-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(itemKey, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                            className="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary transition-colors rounded-r-md disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(itemKey)}
                          className="text-xs text-text-tertiary hover:text-error transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-1.5 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="btn btn-primary btn-lg w-full"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>

            <button
              onClick={onClose}
              className="btn btn-ghost w-full text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
