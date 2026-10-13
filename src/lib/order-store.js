import fs from "fs";
import path from "path";

// Unified order store supporting both persistent local file caching and memory
const DATA_DIR = path.join(process.cwd(), "src", "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

const INITIAL_DEMO_ORDERS = [
  {
    id: "demo-1",
    order_number: "RH-2026-8812",
    customer_name: "Bikash Kalita",
    customer_phone: "9864012345",
    customer_email: "bikash.kalita@gmail.com",
    shipping_address: "Station Road, Ward No 4, Bongaigaon, Assam - 783380",
    city: "Bongaigaon",
    state: "Assam",
    pin_code: "783380",
    delivery_instructions: "Call before reaching, leave at gate if not home",
    subtotal: 12999,
    shipping_charge: 0,
    total: 12999,
    order_status: "confirmed",
    payment_method: "cod",
    payment_status: "unpaid",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    items: [
      {
        id: "item-1",
        product_name: "Axor Apex Carbon Fibre Helmet",
        variant_name: "L",
        sku: "AXR-APEX-CF-L",
        unit_price: 12999,
        quantity: 1,
        line_total: 12999,
        product_image_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "demo-2",
    order_number: "RH-2026-7491",
    customer_name: "Amitava Das",
    customer_phone: "9435098765",
    customer_email: "amitava.das@yahoo.com",
    shipping_address: "GS Road, ABC Point, Guwahati, Assam - 781005",
    city: "Guwahati",
    state: "Assam",
    pin_code: "781005",
    delivery_instructions: "Deliver between 10 AM to 5 PM",
    subtotal: 7999,
    shipping_charge: 0,
    total: 7999,
    order_status: "shipped",
    payment_method: "cod",
    payment_status: "unpaid",
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    items: [
      {
        id: "item-2",
        product_name: "Rynox Storm Evo 3 Jacket",
        variant_name: "Black / XL",
        sku: "RNX-STRM3-BK-XL",
        unit_price: 7999,
        quantity: 1,
        line_total: 7999,
        product_image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "demo-3",
    order_number: "RH-2026-6102",
    customer_name: "Rupam Barman",
    customer_phone: "9706123987",
    customer_email: "rupam.barman@outlook.com",
    shipping_address: "Main Market, Near Police Point, Kokrajhar, Assam - 783370",
    city: "Kokrajhar",
    state: "Assam",
    pin_code: "783370",
    delivery_instructions: "",
    subtotal: 4499,
    shipping_charge: 0,
    total: 4499,
    order_status: "delivered",
    payment_method: "cod",
    payment_status: "paid",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    items: [
      {
        id: "item-3",
        product_name: "Raida Drifter Mesh Jacket",
        variant_name: "M",
        sku: "RDA-DRFT-M",
        unit_price: 3999,
        quantity: 1,
        line_total: 3999,
        product_image_url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
];

// In-memory fallback
let memoryOrders = [...INITIAL_DEMO_ORDERS];

function loadOrdersFromFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(INITIAL_DEMO_ORDERS, null, 2), "utf-8");
      return INITIAL_DEMO_ORDERS;
    }
    const content = fs.readFileSync(ORDERS_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryOrders = parsed;
      return parsed;
    }
  } catch (err) {
    console.error("Error reading orders file:", err);
  }
  return memoryOrders;
}

function saveOrdersToFile(orders) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing orders file:", err);
  }
}

export function getStoredOrders() {
  return loadOrdersFromFile();
}

export function getStoredOrderById(idOrOrderNumber) {
  const orders = loadOrdersFromFile();
  return (
    orders.find(
      (o) =>
        o.id === idOrOrderNumber ||
        o.order_number?.toLowerCase() === idOrOrderNumber?.toLowerCase()
    ) || null
  );
}

export function addStoredOrder(order) {
  const orders = loadOrdersFromFile();
  const normalizedOrder = {
    id: order.id || `order-${Date.now()}`,
    order_number: order.order_number || order.orderNumber,
    customer_name: order.customer_name || order.customerName,
    customer_phone: order.customer_phone || order.customerPhone,
    customer_email: order.customer_email || order.customerEmail || null,
    shipping_address: order.shipping_address || order.shippingAddress,
    city: order.city || "Bongaigaon",
    state: order.state || "Assam",
    pin_code: order.pin_code || order.pinCode || "783380",
    delivery_instructions: order.delivery_instructions || order.deliveryInstructions || null,
    subtotal: Number(order.subtotal || 0),
    shipping_charge: Number(order.shipping_charge || order.shippingCharge || 0),
    total: Number(order.total || 0),
    order_status: order.order_status || order.orderStatus || "pending",
    payment_method: order.payment_method || order.paymentMethod || "cod",
    payment_status: order.payment_status || order.paymentStatus || "unpaid",
    created_at: order.created_at || order.createdAt || new Date().toISOString(),
    items: order.items || [],
  };

  orders.unshift(normalizedOrder);
  memoryOrders = orders;
  saveOrdersToFile(orders);
  return normalizedOrder;
}

export function updateStoredOrderStatus(orderNumber, { order_status, payment_status }) {
  const orders = loadOrdersFromFile();
  const index = orders.findIndex(
    (o) =>
      o.id === orderNumber ||
      o.order_number?.toLowerCase() === orderNumber?.toLowerCase()
  );

  if (index !== -1) {
    if (order_status) orders[index].order_status = order_status;
    if (payment_status) orders[index].payment_status = payment_status;
    memoryOrders = orders;
    saveOrdersToFile(orders);
    return orders[index];
  }
  return null;
}
