"use client";

import { useState } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  Save,
  Clock,
  RotateCcw,
} from "lucide-react";
import { formatPrice } from "@/lib/store-config";

const ADJUSTMENT_REASONS = [
  { key: "restock", label: "Restocked from Brand/Distributor" },
  { key: "physical_store_sale", label: "Walk-in Sale (Bongaigaon Store)" },
  { key: "correction", label: "Inventory Count Correction" },
  { key: "damaged_returned", label: "Damaged / Customer Return" },
];

export default function InventoryTable({ initialVariants = [], logs = [] }) {
  const [variants, setVariants] = useState(initialVariants);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const [selectedReason, setSelectedReason] = useState("restock");

  // Local draft quantities for quick editing
  const [drafts, setDrafts] = useState(
    initialVariants.reduce((acc, v) => ({ ...acc, [v.id]: v.stock_quantity }), {})
  );

  const handleQtyChange = (id, newQty) => {
    const validQty = Math.max(0, parseInt(newQty) || 0);
    setDrafts((prev) => ({ ...prev, [id]: validQty }));
  };

  const handleStepQty = (id, delta) => {
    const current = drafts[id] ?? 0;
    const nextVal = Math.max(0, current + delta);
    setDrafts((prev) => ({ ...prev, [id]: nextVal }));
  };

  const handleSaveStock = async (variant) => {
    const newQty = drafts[variant.id];
    if (newQty === variant.stock_quantity) return; // no change

    setUpdatingId(variant.id);
    setSuccessId(null);

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant_id: variant.id,
          product_id: variant.product_id,
          new_quantity: newQty,
          reason: selectedReason,
        }),
      });

      if (res.ok) {
        setVariants((prev) =>
          prev.map((v) => (v.id === variant.id ? { ...v, stock_quantity: newQty } : v))
        );
        setSuccessId(variant.id);
        setTimeout(() => setSuccessId(null), 2000);
      }
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = variants.filter(
    (v) =>
      !search ||
      v.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.sku?.toLowerCase().includes(search.toLowerCase()) ||
      v.size?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="p-4 rounded-2xl border border-border-default bg-bg-primary flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search variant name, size, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input h-10 text-xs"
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-text-secondary whitespace-nowrap">
            Adjustment Reason:
          </span>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="input h-10 text-xs py-1 cursor-pointer flex-1 sm:flex-initial"
          >
            {ADJUSTMENT_REASONS.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
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
                <th className="px-5 py-3.5">Product & Brand</th>
                <th className="px-5 py-3.5">Size / Color</th>
                <th className="px-5 py-3.5">SKU</th>
                <th className="px-5 py-3.5">Current Stock</th>
                <th className="px-5 py-3.5">Quick Adjust</th>
                <th className="px-5 py-3.5 text-right">Apply</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {filtered.map((v) => {
                const currentDraft = drafts[v.id] ?? v.stock_quantity;
                const hasChanged = currentDraft !== v.stock_quantity;
                const isLow = v.stock_quantity <= 5;
                const isOut = v.stock_quantity <= 0;

                return (
                  <tr key={v.id} className="hover:bg-bg-secondary/30 transition-colors">
                    {/* Product */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-text-primary text-sm">
                        {v.product_name}
                      </div>
                      <div className="text-[11px] text-text-secondary">
                        {v.brand_name || "Multi-Brand"}
                      </div>
                    </td>

                    {/* Size & Color */}
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-text-primary">
                        {v.size || "Standard"}
                      </div>
                      {v.color && (
                        <div className="text-[11px] text-text-secondary">{v.color}</div>
                      )}
                    </td>

                    {/* SKU */}
                    <td className="px-5 py-3.5 font-mono text-xs text-text-tertiary">
                      {v.sku}
                    </td>

                    {/* Stock Status Badge */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`badge text-xs font-bold ${
                          isOut
                            ? "bg-red-500/10 text-red-600 border-red-500/20"
                            : isLow
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        }`}
                      >
                        {v.stock_quantity} in stock
                      </span>
                    </td>

                    {/* Adjust Controls */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 w-36">
                        <button
                          type="button"
                          onClick={() => handleStepQty(v.id, -1)}
                          className="w-8 h-8 rounded-lg border border-border-default bg-bg-secondary hover:bg-border-default text-text-primary flex items-center justify-center font-bold"
                          title="Subtract 1 unit"
                        >
                          <Minus size={13} />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={currentDraft}
                          onChange={(e) => handleQtyChange(v.id, e.target.value)}
                          className="w-16 h-8 text-center input p-1 text-xs font-bold"
                        />

                        <button
                          type="button"
                          onClick={() => handleStepQty(v.id, 1)}
                          className="w-8 h-8 rounded-lg border border-border-default bg-bg-secondary hover:bg-border-default text-text-primary flex items-center justify-center font-bold"
                          title="Add 1 unit"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </td>

                    {/* Save / Status */}
                    <td className="px-5 py-3.5 text-right">
                      {successId === v.id ? (
                        <span className="text-xs text-emerald-600 font-semibold inline-flex items-center gap-1">
                          <CheckCircle size={14} /> Updated!
                        </span>
                      ) : (
                        <button
                          disabled={!hasChanged || updatingId === v.id}
                          onClick={() => handleSaveStock(v)}
                          className={`btn btn-sm text-xs font-semibold ${
                            hasChanged
                              ? "btn-primary shadow-sm"
                              : "btn-outline opacity-40 cursor-not-allowed"
                          }`}
                        >
                          {updatingId === v.id ? "Saving..." : "Save"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Logs Section */}
      {logs.length > 0 && (
        <div className="p-6 rounded-2xl border border-border-default bg-bg-primary space-y-4">
          <h3 className="heading-display text-base font-bold text-text-primary flex items-center gap-2">
            <Clock size={16} className="text-accent" /> Recent Inventory Activity
          </h3>

          <div className="divide-y divide-border-default text-xs">
            {logs.slice(0, 8).map((log, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-text-primary">
                    {log.reason || "Stock update"}
                  </span>
                  {log.reference_id && (
                    <span className="text-text-tertiary ml-2">
                      Ref: {log.reference_id}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold ${
                      log.change_quantity > 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {log.change_quantity > 0 ? `+${log.change_quantity}` : log.change_quantity} units
                  </span>
                  <span className="text-text-tertiary text-[11px]">
                    {new Date(log.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
