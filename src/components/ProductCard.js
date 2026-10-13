"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/store-config";

export default function ProductCard({ product }) {
  const {
    slug,
    name,
    brand,
    base_price,
    sale_price,
    images = [],
    is_new_arrival,
    variants = [],
  } = product;

  const primaryImage = images.find((img) => img.is_primary) || images[0];
  const secondaryImage = images.find((img) => !img.is_primary && img !== primaryImage);
  const brandName = brand?.name || product.brand_name;

  // Calculate total stock
  const totalStock = product.has_variants
    ? variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0)
    : product.stock_quantity || 0;

  const isOutOfStock = totalStock <= 0;

  // Get unique colors
  const colors = [
    ...new Set(
      variants
        .filter((v) => v.color_hex)
        .map((v) => JSON.stringify({ color: v.color, hex: v.color_hex }))
    ),
  ].map((c) => JSON.parse(c));

  // Get unique sizes
  const sizes = [...new Set(variants.filter((v) => v.size).map((v) => v.size))];

  const displayPrice = sale_price || base_price;
  const hasDiscount = sale_price && sale_price < base_price;
  const discountPercent = hasDiscount
    ? Math.round(((base_price - sale_price) / base_price) * 100)
    : 0;

  return (
    <Link
      href={`/products/${slug}`}
      className="group block no-underline"
    >
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
          {primaryImage?.url ? (
            <>
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt_text || name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {secondaryImage?.url && (
                <Image
                  src={secondaryImage.url}
                  alt={secondaryImage.alt_text || `${name} alternate view`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {hasDiscount && (
              <span className="badge badge-sale shadow-sm font-bold text-[10px] tracking-wider px-2 py-0.5">-{discountPercent}%</span>
            )}
            {is_new_arrival && (
              <span className="badge badge-new shadow-sm font-bold text-[10px] tracking-wider px-2 py-0.5">New</span>
            )}
            {isOutOfStock && (
              <span className="badge badge-out-of-stock shadow-sm font-bold text-[10px] tracking-wider px-2 py-0.5">Sold Out</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
          <div>
            {brandName && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600 mb-1">
                {brandName}
              </p>
            )}
            <h3 className="text-sm sm:text-base font-semibold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug min-h-[2.5em]">
              {name}
            </h3>
          </div>

          <div className="mt-3 pt-3 border-t border-stone-100">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-stone-900">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs sm:text-sm text-stone-400 line-through font-medium">
                  {formatPrice(base_price)}
                </span>
              )}
            </div>

            {/* Colors */}
            {colors.length > 1 && (
              <div className="flex items-center gap-1.5 mt-2.5">
                {colors.slice(0, 5).map((c) => (
                  <span
                    key={c.hex}
                    className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                    title={c.color}
                  />
                ))}
                {colors.length > 5 && (
                  <span className="text-[11px] text-stone-400 font-medium ml-0.5">
                    +{colors.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* Sizes preview */}
            {sizes.length > 0 && (
              <p className="text-[11px] text-stone-400 font-medium mt-1.5">
                {sizes.length} size{sizes.length > 1 ? "s" : ""} available
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
