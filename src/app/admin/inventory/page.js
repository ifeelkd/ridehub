import { getSupabaseAdmin } from "@/lib/supabase/server";
import { PRODUCTS } from "@/lib/catalog-data";
import InventoryTable from "./InventoryTable";

async function getInventoryData() {
  let variants = [];
  let logs = [];

  try {
    const supabase = getSupabaseAdmin();
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const [{ data: vData }, { data: lData }] = await Promise.all([
        supabase
          .from("product_variants")
          .select(`
            id,
            product_id,
            sku,
            size,
            color,
            stock_quantity,
            product:products(name, sku, brand:brands(name))
          `)
          .order("stock_quantity", { ascending: true }),
        supabase
          .from("inventory_log")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      if (vData && vData.length > 0) {
        variants = vData.map((v) => ({
          id: v.id,
          product_id: v.product_id,
          product_name: v.product?.name || "Product",
          brand_name: v.product?.brand?.name || "Multi-Brand",
          sku: v.sku,
          size: v.size,
          color: v.color,
          stock_quantity: v.stock_quantity ?? 0,
        }));
      }

      if (lData) logs = lData;
    }
  } catch {
    // fallback
  }

  // Fallback to local catalog if database is empty
  if (variants.length === 0) {
    PRODUCTS.forEach((p) => {
      p.variants?.forEach((v) => {
        variants.push({
          id: v.id,
          product_id: p.id,
          product_name: p.name,
          brand_name: p.brand?.name || "Multi-Brand",
          sku: v.sku,
          size: v.size,
          color: v.color,
          stock_quantity: v.stock_quantity ?? 0,
        });
      });
    });

    logs = [
      {
        id: "l1",
        reason: "Initial Store Stock Ingest",
        change_quantity: 40,
        reference_id: "SEED-2026",
        created_at: new Date().toISOString(),
      },
    ];
  }

  return { variants, logs };
}

export default async function AdminInventoryPage() {
  const { variants, logs } = await getInventoryData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-display text-2xl sm:text-3xl font-bold text-text-primary">
          Inventory Control
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Direct stock quantity updates with audit trail for walk-in store sales and distributor restocks.
        </p>
      </div>

      <InventoryTable initialVariants={variants} logs={logs} />
    </div>
  );
}
