import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { storeConfig } from "@/lib/store-config";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: true, settings: storeConfig });
    }

    const { data: records, error } = await supabase.from("store_settings").select("*");
    if (error) throw error;

    const mapped = {};
    records?.forEach((r) => {
      mapped[r.key] = r.value;
    });

    return NextResponse.json({
      success: true,
      settings: {
        contact: {
          phone: mapped.contact?.phone || storeConfig.contact.phone,
          whatsapp: mapped.contact?.whatsapp || storeConfig.contact.whatsapp,
          email: mapped.contact?.email || storeConfig.contact.email,
          address: mapped.contact?.address || storeConfig.contact.address,
        },
        shipping: {
          defaultCharge: mapped.shipping?.default_charge ?? storeConfig.shipping.defaultCharge,
          freeThreshold: mapped.shipping?.free_threshold ?? storeConfig.shipping.freeThreshold,
        },
        lowStockThreshold: mapped.low_stock_threshold ?? 5,
        announcement: mapped.announcement || storeConfig.announcement,
      },
    });
  } catch (err) {
    return NextResponse.json({ success: true, settings: storeConfig });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { contact, shipping, lowStockThreshold, announcement } = body;

    const supabase = getSupabaseAdmin();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: true, message: "Settings saved in demo mode" });
    }

    const upserts = [
      { key: "contact", value: contact },
      { key: "shipping", value: { default_charge: shipping.defaultCharge, free_threshold: shipping.freeThreshold } },
      { key: "low_stock_threshold", value: Number(lowStockThreshold) },
      { key: "announcement", value: announcement },
    ];

    for (const item of upserts) {
      await supabase.from("store_settings").upsert(item);
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
