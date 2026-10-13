"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

export default function FilterBar({ filters, searchParams, productCount }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeCategory = searchParams?.category || "";
  const activeBrand = searchParams?.brand || "";
  const activeSort = searchParams?.sort || "featured";
  const activeSearch = searchParams?.search || "";

  const hasActiveFilters = activeCategory || activeBrand || activeSearch;

  function updateParam(key, value) {
    const params = new URLSearchParams();
    // Preserve existing params
    if (searchParams) {
      Object.entries(searchParams).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
    }
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    router.push(pathname);
  }

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ];

  return (
    <>
      {/* Desktop Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => updateParam("category", e.target.value)}
              className="input pr-8 py-2 text-sm min-w-[140px] appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {filters.categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
            />
          </div>

          {/* Brand Filter */}
          <div className="relative">
            <select
              value={activeBrand}
              onChange={(e) => updateParam("brand", e.target.value)}
              className="input pr-8 py-2 text-sm min-w-[140px] appearance-none cursor-pointer"
            >
              <option value="">All Brands</option>
              {filters.brands.map((brand) => (
                <option key={brand.slug} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
            />
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">
            {productCount} product{productCount !== 1 ? "s" : ""}
          </span>

          {/* Sort */}
          <div className="relative">
            <select
              value={activeSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="input pr-8 py-2 text-sm min-w-[160px] appearance-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
            />
          </div>
        </div>
      </div>
    </>
  );
}
