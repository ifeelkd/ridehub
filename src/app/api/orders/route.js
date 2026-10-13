import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { storeConfig } from "@/lib/store-config";
import { PRODUCTS } from "@/lib/catalog-data";
import { addStoredOrder } from "@/lib/order-store";

// Validation Schema for checkout
const orderSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  customer_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  customer_email: z.string().email("Invalid email address").optional().or(z.literal("")),
  shipping_address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pin_code: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit PIN code"),
  delivery_instructions: z.string().max(500).optional(),
  idempotency_key: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().nullable().optional(),
        name: z.string(),
        quantity: z.number().int().positive(),
        size: z.string().nullable().optional(),
        color: z.string().nullable().optional(),
        sku: z.string().nullable().optional(),
        image: z.string().nullable().optional(),
      })
    )
    .min(1, "Order must contain at least one item"),
});

function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const timeSlice = Date.now().toString().slice(-4);
  return `RH-${year}-${timeSlice}${randomSuffix}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parseResult = orderSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const orderData = parseResult.data;
    const orderNumber = generateOrderNumber();

    // 1. Recalculate prices and totals server-side
    let subtotal = 0;
    const processedItems = [];

    // Attempt to verify with Supabase
    let supabase = null;
    try {
      supabase = getSupabaseAdmin();
    } catch {
      supabase = null;
    }

    for (const item of orderData.items) {
      let unitPrice = 0;
      let verifiedSku = item.sku;
      let productName = item.name;

      if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        try {
          const { data: dbProduct } = await supabase
            .from("products")
            .select("name, base_price, sale_price, sku, has_variants")
            .eq("id", item.productId)
            .single();

          if (dbProduct) {
            productName = dbProduct.name;
            unitPrice = dbProduct.sale_price || dbProduct.base_price;
            verifiedSku = dbProduct.sku;

            if (item.variantId) {
              const { data: dbVar } = await supabase
                .from("product_variants")
                .select("sku, price_adjustment, stock_quantity")
                .eq("id", item.variantId)
                .single();

              if (dbVar) {
                if (dbVar.sku) verifiedSku = dbVar.sku;
                if (dbVar.price_adjustment) {
                  unitPrice += Number(dbVar.price_adjustment);
                }
              }
            }
          }
        } catch {
          // fallback to catalog below
        }
      }

      // If price wasn't found in DB, check fallback catalog
      if (unitPrice === 0) {
        const catProduct = PRODUCTS.find(
          (p) => p.id === item.productId || p.name === item.name
        );
        if (catProduct) {
          unitPrice = catProduct.sale_price || catProduct.base_price;
          verifiedSku = catProduct.sku;
        } else {
          // Safety minimum fallback
          unitPrice = 1999;
        }
      }

      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      processedItems.push({
        product_id: item.productId?.startsWith("p") ? null : item.productId, // only uuid if real
        variant_id: item.variantId?.startsWith("v") ? null : item.variantId,
        product_name: productName,
        variant_name: [item.size, item.color].filter(Boolean).join(" / ") || null,
        sku: verifiedSku || "RH-SKU",
        unit_price: unitPrice,
        quantity: item.quantity,
        line_total: lineTotal,
        product_image_url: item.image || null,
      });
    }

    // Calculate shipping based on store configuration
    const freeThreshold = storeConfig.shipping?.freeThreshold || 2999;
    const defaultShippingCharge = storeConfig.shipping?.defaultCharge || 99;
    const shippingCharge = subtotal >= freeThreshold ? 0 : defaultShippingCharge;
    const total = subtotal + shippingCharge;

    // 2. Insert into database if Supabase is active
    let dbOrderId = null;
    if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { data: orderRecord, error: orderErr } = await supabase
          .from("orders")
          .insert({
            order_number: orderNumber,
            customer_name: orderData.customer_name,
            customer_phone: orderData.customer_phone,
            customer_email: orderData.customer_email || null,
            shipping_address: orderData.shipping_address,
            city: orderData.city,
            state: orderData.state,
            pin_code: orderData.pin_code,
            delivery_instructions: orderData.delivery_instructions || null,
            subtotal,
            shipping_charge: shippingCharge,
            total,
            order_status: "pending",
            payment_method: "cod",
            payment_status: "unpaid",
            idempotency_key: orderData.idempotency_key || null,
          })
          .select("id")
          .single();

        if (!orderErr && orderRecord) {
          dbOrderId = orderRecord.id;

          // Insert order items
          const itemsToInsert = processedItems.map((pi) => ({
            ...pi,
            order_id: dbOrderId,
          }));

          await supabase.from("order_items").insert(itemsToInsert);

          // Deduct stock and log inventory
          for (const item of orderData.items) {
            if (item.variantId && !item.variantId.startsWith("v")) {
              const { data: currentVar } = await supabase
                .from("product_variants")
                .select("stock_quantity")
                .eq("id", item.variantId)
                .single();

              if (currentVar) {
                const newStock = Math.max(0, currentVar.stock_quantity - item.quantity);
                await supabase
                  .from("product_variants")
                  .update({ stock_quantity: newStock })
                  .eq("id", item.variantId);

                await supabase.from("inventory_log").insert({
                  product_id: item.productId?.startsWith("p") ? null : item.productId,
                  variant_id: item.variantId,
                  change_quantity: -item.quantity,
                  new_quantity: newStock,
                  reason: "order_placed",
                  reference_id: orderNumber,
                });
              }
            }
          }
        }
      } catch (dbError) {
        console.error("Database order insertion error (falling back to memory):", dbError);
      }
    }

    // Save order in unified store so admin panel immediately sees it
    addStoredOrder({
      id: dbOrderId || orderNumber,
      order_number: orderNumber,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_email: orderData.customer_email || null,
      shipping_address: orderData.shipping_address,
      city: orderData.city,
      state: orderData.state,
      pin_code: orderData.pin_code,
      delivery_instructions: orderData.delivery_instructions || null,
      subtotal,
      shipping_charge: shippingCharge,
      total,
      order_status: "pending",
      payment_method: "cod",
      payment_status: "unpaid",
      items: processedItems,
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: dbOrderId || orderNumber,
      order: {
        orderNumber,
        customerName: orderData.customer_name,
        customerPhone: orderData.customer_phone,
        customerEmail: orderData.customer_email,
        shippingAddress: `${orderData.shipping_address}, ${orderData.city}, ${orderData.state} - ${orderData.pin_code}`,
        subtotal,
        shippingCharge,
        total,
        paymentMethod: "Cash on Delivery (COD)",
        paymentStatus: "Unpaid (Pay at doorstep)",
        items: processedItems,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Order creation route error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred while processing order." },
      { status: 500 }
    );
  }
}
