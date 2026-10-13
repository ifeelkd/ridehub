"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ExternalLink,
  Edit,
  Eye,
  EyeOff,
  Package,
  Layers,
} from "lucide-react";
import { formatPrice } from "@/lib/store-config";

export default function ProductListTable({ initialProducts = [], categories = [], brands = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  const handleToggleActive = async (productId, currentActive) => {
    setTogglingId(productId);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentActive }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, is_active: !currentActive } : p))
        );
      }
    } catch {
      // ignore
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());

    const matchesCat =
      selectedCat === "all" ||
      p.category?.slug === selectedCat ||
      p.category_id === selectedCat;

    const matchesBrand =
      selectedBrand === "all" ||
      p.brand?.name?.toLowerCase() === selectedBrand.toLowerCase() ||
      p.brand_id === selectedBrand;

    return matchesSearch && matchesCat && matchesBrand;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl border border-border-default bg-bg-primary flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input h-10 text-xs"
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="input h-10 text-xs py-1"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.slug || c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="input h-10 text-xs py-1"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b.id || b.slug} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border-default bg-bg-primary overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-bg-secondary/60 text-xs uppercase tracking-wider text-text-secondary border-b border-border-default">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category & Brand</th>
                <th className="px-5 py-3.5">Base Price</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {filtered.map((product) => {
                const totalStock = product.has_variants
                  ? product.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0)
                  : product.stock_quantity || 0;

                const primaryImg = product.images?.find((i) => i.is_primary) || product.images?.[0];

                return (
                  <tr key={product.id} className="hover:bg-bg-secondary/30 transition-colors">
                    {/* Name & Img */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-13 rounded-lg bg-bg-secondary overflow-hidden flex-shrink-0 border border-border-default">
                          {primaryImg?.url ? (
                            <Image
                              src={primaryImg.url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                              <Package size={16} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-text-primary text-sm truncate max-w-xs">
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-text-tertiary">
                            SKU: {product.sku || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Brand */}
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-text-primary">
                        {product.brand?.name || "Multi-Brand"}
                      </div>
                      <div className="text-[11px] text-text-secondary">
                        {product.category?.name || "Gear"}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3.5 font-semibold text-text-primary">
                      {formatPrice(product.sale_price || product.base_price)}
                      {product.sale_price && (
                        <span className="text-[11px] text-text-tertiary line-through block font-normal">
                          {formatPrice(product.base_price)}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`badge text-xs font-bold ${
                          totalStock <= 0
                            ? "bg-red-500/10 text-red-600 border-red-500/20"
                            : totalStock <= 5
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        }`}
                      >
                        {totalStock} units
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleActive(product.id, product.is_active)}
                        disabled={togglingId === product.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          product.is_active !== false
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : "bg-stone-500/10 text-stone-500 hover:bg-stone-500/20"
                        }`}
                      >
                        {product.is_active !== false ? (
                          <>
                            <Eye size={12} /> Active
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} /> Hidden
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="btn btn-sm btn-outline text-xs inline-flex items-center gap-1"
                      >
                        <Edit size={13} /> Edit
                      </Link>
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="p-1.5 text-text-secondary hover:text-text-primary inline-flex items-center rounded"
                        title="Preview on customer storefront"
                      >
                        <ExternalLink size={15} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-text-secondary text-xs">
            No products match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
