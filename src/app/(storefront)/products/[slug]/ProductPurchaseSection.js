"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { formatPrice, storeConfig } from "@/lib/store-config";
import { useCart } from "@/context/cart-context";
import SizeGuideModal from "./SizeGuideModal";

export default function ProductPurchaseSection({ product }) {
  const router = useRouter();
  const { addItem, items = [] } = useCart();

  const {
    id,
    name,
    slug,
    brand,
    category,
    base_price,
    sale_price,
    has_variants,
    stock_quantity = 0,
    sku,
    variants = [],
    images = [],
  } = product;

  // Active variant state
  const activeVariants = variants.filter((v) => v.is_active !== false);
  const [selectedVariantId, setSelectedVariantId] = useState(
    activeVariants.length > 0 ? activeVariants[0].id : null
  );

  const selectedVariant = activeVariants.find((v) => v.id === selectedVariantId) || null;

  // Available stock calculation
  const currentStock = has_variants
    ? selectedVariant?.stock_quantity ?? 0
    : stock_quantity;

  const isOutOfStock = currentStock <= 0;

  // Check if currently selected product / variant is already in cart
  const isInCart = items?.some((i) => {
    if (selectedVariant) {
      return (
        i.variantId === selectedVariant.id ||
        i.id === `${id}-${selectedVariant.id}`
      );
    }
    return i.productId === id;
  });

  // Quantity selector
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const displayPrice = sale_price || base_price;
  const hasDiscount = sale_price && sale_price < base_price;
  const discountPercent = hasDiscount
    ? Math.round(((base_price - sale_price) / base_price) * 100)
    : 0;

  const primaryImage = images.find((img) => img.is_primary) || images[0];

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      id: selectedVariant ? `${id}-${selectedVariant.id}` : id,
      productId: id,
      variantId: selectedVariant?.id || null,
      name,
      slug,
      brandName: brand?.name || "",
      price: displayPrice,
      originalPrice: base_price,
      quantity,
      size: selectedVariant?.size || null,
      color: selectedVariant?.color || null,
      sku: selectedVariant?.sku || sku,
      image: primaryImage?.url || null,
      maxStock: currentStock,
    });

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  // Group variants if they have colors and sizes
  const uniqueSizes = [...new Set(activeVariants.filter((v) => v.size).map((v) => v.size))];
  const uniqueColors = [
    ...new Set(
      activeVariants
        .filter((v) => v.color)
        .map((v) => JSON.stringify({ color: v.color, hex: v.color_hex }))
    ),
  ].map((c) => JSON.parse(c));

  return (
    <div className="space-y-6">
      {/* Brand & Title */}
      <div>
        {brand?.name && (
          <Link
            href={`/products?brand=${encodeURIComponent(brand.name)}`}
            className="text-xs font-semibold uppercase tracking-wider text-accent hover:underline inline-block mb-1.5"
          >
            {brand.name}
          </Link>
        )}
        <h1 className="heading-display text-2xl sm:text-3xl lg:text-4xl text-text-primary tracking-tight">
          {name}
        </h1>
        <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
          <span>SKU: {selectedVariant?.sku || sku || "RH-PRD"}</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <Check size={14} /> 100% Authentic Guaranteed
          </span>
        </div>
      </div>

      {/* Pricing Block */}
      <div className="p-4 rounded-xl bg-bg-secondary/60 border border-border-default">
        <div className="flex items-baseline gap-3">
          <span className="heading-display text-3xl font-bold text-text-primary">
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-base text-text-secondary line-through">
                {formatPrice(base_price)}
              </span>
              <span className="badge badge-accent">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-text-secondary mt-1">
          Inclusive of all applicable taxes • Cash on Delivery Available
        </p>
      </div>

      {/* Variants Section */}
      {has_variants && activeVariants.length > 0 && (
        <div className="space-y-4 pt-2">
          {/* Size Selection */}
          {uniqueSizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                  Select Size
                </label>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
                >
                  <Ruler size={13} /> Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {activeVariants.map((variant) => {
                  const isSelected = selectedVariantId === variant.id;
                  const isVarOutOfStock = (variant.stock_quantity || 0) <= 0;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={isVarOutOfStock}
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setQuantity(1);
                      }}
                      className={`min-w-12 h-11 px-3.5 rounded-xl text-sm font-semibold border transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-text-primary text-bg-primary border-text-primary shadow-sm"
                          : isVarOutOfStock
                          ? "opacity-40 border-dashed border-border-default bg-bg-secondary text-text-secondary line-through cursor-not-allowed"
                          : "border-border-default bg-bg-primary text-text-primary hover:border-text-primary"
                      }`}
                    >
                      <span>{variant.size || variant.name}</span>
                      {variant.color && (
                        <span className="text-[10px] font-normal opacity-70">
                          {variant.color}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Real-time stock status */}
          <div className="flex items-center gap-2 text-xs">
            {isOutOfStock ? (
              <span className="text-red-500 font-medium flex items-center gap-1">
                <AlertCircle size={14} /> Currently Out of Stock
              </span>
            ) : currentStock <= (storeConfig.inventory?.lowStockThreshold || 5) ? (
              <span className="text-amber-600 font-medium flex items-center gap-1">
                <AlertCircle size={14} /> Only {currentStock} left in stock — order soon!
              </span>
            ) : (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <Check size={14} /> In Stock ({currentStock} units ready to ship)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quantity & CTA buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-border-default rounded-xl bg-bg-secondary/40 overflow-hidden h-12">
            <button
              type="button"
              disabled={quantity <= 1 || isOutOfStock}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-11 h-full flex items-center justify-center text-text-primary hover:bg-bg-secondary disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-10 text-center text-sm font-semibold text-text-primary">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= currentStock || isOutOfStock}
              onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
              className="w-11 h-full flex items-center justify-center text-text-primary hover:bg-bg-secondary disabled:opacity-30 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart / Go to Cart Button */}
          {isInCart ? (
            <Link
              href="/cart"
              className="flex-1 h-12 btn btn-accent text-white flex items-center justify-center gap-2 font-semibold shadow-sm no-underline"
            >
              <ShoppingBag size={18} /> Go to Cart &rarr;
            </Link>
          ) : (
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`flex-1 h-12 btn ${
                addedFeedback ? "btn-accent" : "btn-primary"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {addedFeedback ? (
                <span className="flex items-center gap-2">
                  <Check size={18} /> Added to Cart!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingBag size={18} /> Add to Cart
                </span>
              )}
            </button>
          )}
        </div>

        {/* Buy Now (Direct Checkout) */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleBuyNow}
          className="w-full h-12 btn btn-outline border-accent text-accent hover:bg-accent hover:text-white transition-colors disabled:opacity-40"
        >
          <Zap size={18} /> Order with Cash on Delivery
        </button>
      </div>

      {/* Assurance / Store Guarantees */}
      <div className="border-t border-border-default pt-6 space-y-3.5">
        <div className="flex items-start gap-3">
          <Truck size={18} className="text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-text-primary">
              Fast Dispatch & Cash on Delivery
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Dispatched within 24-48 hours from Bongaigaon, Assam. Free shipping on orders over {formatPrice(storeConfig.shipping?.freeThreshold || 2999)}.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <RotateCcw size={18} className="text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-text-primary">
              7-Day Hassle-Free Size Exchange
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Wrong fit? We exchange unused gear with original tags intact so your ride is always safe and comfortable.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-text-primary">
              100% Genuine Authorized Retailer
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Brand warranty covered directly through official manufacturer channels.
            </p>
          </div>
        </div>
      </div>

      {/* Direct WhatsApp Fitment Support */}
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <MessageCircle size={20} className="text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
              Need Sizing or Fit Advice?
            </p>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
              Chat directly with our riding specialists in Bongaigaon
            </p>
          </div>
        </div>
        <a
          href={`https://wa.me/${storeConfig.contact.whatsapp}?text=${encodeURIComponent(
            `Hi RideHub! I need sizing help with ${name} (${slug})`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white flex-shrink-0"
        >
          WhatsApp
        </a>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        categorySlug={category?.slug || slug}
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
}
