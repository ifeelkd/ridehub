"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function ProductForm({ initialProduct = null, brands = [], categories = [] }) {
  const router = useRouter();
  const isEditing = !!initialProduct;

  const [formData, setFormData] = useState({
    name: initialProduct?.name || "",
    slug: initialProduct?.slug || "",
    brand_id: initialProduct?.brand_id || (brands[0]?.id || ""),
    category_id: initialProduct?.category_id || (categories[0]?.id || ""),
    base_price: initialProduct?.base_price || "",
    sale_price: initialProduct?.sale_price || "",
    sku: initialProduct?.sku || "",
    description: initialProduct?.description || "",
    is_active: initialProduct?.is_active ?? true,
    is_featured: initialProduct?.is_featured ?? false,
    is_new_arrival: initialProduct?.is_new_arrival ?? false,
    has_variants: initialProduct?.has_variants ?? true,
    stock_quantity: initialProduct?.stock_quantity ?? 0,
    imageUrl: initialProduct?.images?.[0]?.url || "",
  });

  // Specifications key-value pairs
  const initialSpecs = initialProduct?.specifications
    ? Object.entries(initialProduct.specifications).map(([k, v]) => ({ key: k, val: String(v) }))
    : [
        { key: "Shell Material", val: "" },
        { key: "Certification", val: "ECE 22.06" },
        { key: "Weight", val: "1350g ± 50g" },
      ];

  const [specs, setSpecs] = useState(initialSpecs);

  // Variants list
  const initialVariants = initialProduct?.variants?.length > 0
    ? initialProduct.variants.map((v) => ({
        id: v.id,
        size: v.size || "",
        color: v.color || "",
        sku: v.sku || "",
        stock_quantity: v.stock_quantity ?? 3,
      }))
    : [
        { size: "S", color: "", sku: "", stock_quantity: 3 },
        { size: "M", color: "", sku: "", stock_quantity: 5 },
        { size: "L", color: "", sku: "", stock_quantity: 4 },
        { size: "XL", color: "", sku: "", stock_quantity: 2 },
      ];

  const [variants, setVariants] = useState(initialVariants);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleNameChange = (e) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : generatedSlug,
    }));
  };

  const addSpecRow = () => {
    setSpecs((prev) => [...prev, { key: "", val: "" }]);
  };

  const removeSpecRow = (idx) => {
    setSpecs((prev) => prev.filter((_, i) => i !== idx));
  };

  const addVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      { size: "", color: "", sku: "", stock_quantity: 1 },
    ]);
  };

  const removeVariantRow = (idx) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const specificationsObj = {};
      specs.forEach((s) => {
        if (s.key.trim()) specificationsObj[s.key.trim()] = s.val.trim();
      });

      const payload = {
        ...formData,
        base_price: Number(formData.base_price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        stock_quantity: Number(formData.stock_quantity),
        specifications: specificationsObj,
        image_urls: formData.imageUrl ? [formData.imageUrl] : [],
        variants: formData.has_variants ? variants : [],
      };

      const url = isEditing
        ? `/api/admin/products/${initialProduct.id}`
        : `/api/admin/products`;

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product.");
      }

      setSuccessMsg("Product saved successfully!");
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="text-xs text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>

        {isEditing && (
          <Link
            href={`/products/${formData.slug}`}
            target="_blank"
            className="text-xs text-accent hover:underline inline-flex items-center gap-1 font-medium"
          >
            <ExternalLink size={13} /> View on Store
          </Link>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Basic Information */}
      <div className="p-6 rounded-2xl border border-border-default bg-bg-primary space-y-4 shadow-sm">
        <h2 className="heading-display text-lg font-bold text-text-primary">
          Basic Product Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="prod_name">
              Product Name *
            </label>
            <input
              id="prod_name"
              type="text"
              required
              placeholder="e.g. Rynox Air GT Gloves"
              value={formData.name}
              onChange={handleNameChange}
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="slug">
              URL Slug *
            </label>
            <input
              id="slug"
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="sku">
              Master SKU *
            </label>
            <input
              id="sku"
              type="text"
              required
              placeholder="e.g. RNX-AIRGT"
              value={formData.sku}
              onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="brand">
              Brand *
            </label>
            <select
              id="brand"
              value={formData.brand_id}
              onChange={(e) => setFormData((prev) => ({ ...prev, brand_id: e.target.value }))}
              className="input cursor-pointer"
            >
              {brands.map((b) => (
                <option key={b.id || b.slug} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="category">
              Category *
            </label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
              className="input cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id || c.slug} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="base_price">
              Regular Selling Price (₹) *
            </label>
            <input
              id="base_price"
              type="number"
              required
              min="0"
              placeholder="1999"
              value={formData.base_price}
              onChange={(e) => setFormData((prev) => ({ ...prev, base_price: e.target.value }))}
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="sale_price">
              Sale / Discounted Price (₹) (Optional)
            </label>
            <input
              id="sale_price"
              type="number"
              min="0"
              placeholder="1799"
              value={formData.sale_price}
              onChange={(e) => setFormData((prev) => ({ ...prev, sale_price: e.target.value }))}
              className="input"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="image_url">
              Product Image URL (Unsplash or hosted photo)
            </label>
            <input
              id="image_url"
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
              className="input"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="desc">
              Description & Rider Benefits
            </label>
            <textarea
              id="desc"
              rows={4}
              placeholder="Detailed description of materials, protective armor, ventilation, and fitment..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="input py-2.5 h-auto"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-4 border-t border-border-default flex flex-wrap gap-6 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-text-primary">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
              className="w-4 h-4 rounded text-accent"
            />
            Active on Storefront
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-text-primary">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
              className="w-4 h-4 rounded text-accent"
            />
            Featured on Homepage
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-text-primary">
            <input
              type="checkbox"
              checked={formData.is_new_arrival}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_new_arrival: e.target.checked }))}
              className="w-4 h-4 rounded text-accent"
            />
            Mark as New Arrival
          </label>
        </div>
      </div>

      {/* Variants & Stock Section */}
      <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="heading-display text-lg font-bold text-stone-900 tracking-wide">
              Sizes, Colors & Inventory
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Configure variant-specific SKUs and initial unit stock levels.
            </p>
          </div>
          <button
            type="button"
            onClick={addVariantRow}
            className="btn btn-sm btn-outline text-xs flex items-center gap-1.5 self-start sm:self-auto font-bold"
          >
            <Plus size={14} /> Add Variant
          </button>
        </div>

        {/* Desktop Table Headers */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-3 py-2 bg-stone-50 rounded-xl text-[11px] font-bold uppercase tracking-wider text-stone-500">
          <div className="col-span-2">Size</div>
          <div className="col-span-3">Color</div>
          <div className="col-span-4">Variant SKU</div>
          <div className="col-span-2">Stock Units</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        <div className="space-y-3">
          {variants.map((v, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-2.5 rounded-xl border border-stone-200 sm:border-stone-100 bg-stone-50/50 sm:bg-transparent grid grid-cols-2 sm:grid-cols-12 gap-3 items-center"
            >
              {/* Size */}
              <div className="col-span-1 sm:col-span-2">
                <label className="sm:hidden block text-[10px] font-bold uppercase text-stone-500 mb-1">
                  Size
                </label>
                <input
                  type="text"
                  placeholder="e.g. M, L"
                  value={v.size}
                  onChange={(e) => {
                    const val = e.target.value;
                    setVariants((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, size: val } : item))
                    );
                  }}
                  className="input text-xs h-10 w-full"
                />
              </div>

              {/* Color */}
              <div className="col-span-1 sm:col-span-3">
                <label className="sm:hidden block text-[10px] font-bold uppercase text-stone-500 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  placeholder="e.g. Matte Black"
                  value={v.color}
                  onChange={(e) => {
                    const val = e.target.value;
                    setVariants((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, color: val } : item))
                    );
                  }}
                  className="input text-xs h-10 w-full"
                />
              </div>

              {/* SKU */}
              <div className="col-span-2 sm:col-span-4">
                <label className="sm:hidden block text-[10px] font-bold uppercase text-stone-500 mb-1">
                  Variant SKU
                </label>
                <input
                  type="text"
                  placeholder="e.g. AX-APX-BLK-M"
                  value={v.sku}
                  onChange={(e) => {
                    const val = e.target.value;
                    setVariants((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, sku: val } : item))
                    );
                  }}
                  className="input text-xs h-10 w-full font-mono"
                />
              </div>

              {/* Stock */}
              <div className="col-span-1 sm:col-span-2">
                <label className="sm:hidden block text-[10px] font-bold uppercase text-stone-500 mb-1">
                  Stock Units
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Units"
                  value={v.stock_quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setVariants((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, stock_quantity: val } : item))
                    );
                  }}
                  className="input text-xs h-10 w-full font-bold"
                />
              </div>

              {/* Remove */}
              <div className="col-span-1 sm:col-span-1 flex justify-end sm:justify-center pt-4 sm:pt-0">
                <button
                  type="button"
                  onClick={() => removeVariantRow(idx)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove variant"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div className="p-6 rounded-2xl border border-stone-200 bg-white space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="heading-display text-lg font-bold text-stone-900 tracking-wide">
              Technical Specifications
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Key specs shown on customer product pages (e.g., Armor Level, Shell, Weight).
            </p>
          </div>
          <button
            type="button"
            onClick={addSpecRow}
            className="btn btn-sm btn-outline text-xs flex items-center gap-1.5 self-start sm:self-auto font-bold"
          >
            <Plus size={14} /> Add Spec
          </button>
        </div>

        {/* Desktop Table Headers */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-3 py-2 bg-stone-50 rounded-xl text-[11px] font-bold uppercase tracking-wider text-stone-500">
          <div className="col-span-5">Specification Attribute</div>
          <div className="col-span-6">Specification Value</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        <div className="space-y-3">
          {specs.map((s, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-2.5 rounded-xl border border-stone-200 sm:border-stone-100 bg-stone-50/50 sm:bg-transparent grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
            >
              <div className="sm:col-span-5">
                <label className="sm:hidden block text-[10px] font-bold uppercase text-stone-500 mb-1">
                  Attribute Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shell Material"
                  value={s.key}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSpecs((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, key: val } : item))
                    );
                  }}
                  className="input text-xs h-10 w-full"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="sm:hidden block text-[10px] font-bold uppercase text-stone-500 mb-1">
                  Detail / Value
                </label>
                <input
                  type="text"
                  placeholder="e.g. Carbon Fibre & Kevlar Composite"
                  value={s.val}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSpecs((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, val } : item))
                    );
                  }}
                  className="input text-xs h-10 w-full"
                />
              </div>

              <div className="sm:col-span-1 flex justify-end sm:justify-center">
                <button
                  type="button"
                  onClick={() => removeSpecRow(idx)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove specification"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link href="/admin/products" className="btn btn-outline text-xs">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary text-xs font-semibold px-6 h-11 flex items-center gap-2 shadow-sm"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save size={15} /> {isEditing ? "Save Changes" : "Create Product"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
