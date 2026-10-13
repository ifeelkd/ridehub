-- =============================================================
-- RideHub — Database Schema
-- =============================================================
-- Run this in the Supabase SQL Editor to create all tables.
-- Make sure to enable Row Level Security on each table.

-- -----------------------------------------------
-- 1. Brands
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------
-- 2. Categories
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------
-- 3. Products
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  specifications JSONB DEFAULT '{}',
  base_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sale_price NUMERIC(10, 2),
  sku TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  has_variants BOOLEAN DEFAULT false,
  -- For products without variants, track stock directly
  stock_quantity INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- -----------------------------------------------
-- 4. Product Images
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- -----------------------------------------------
-- 5. Product Variants
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Black / L", "Matt Black / XL"
  sku TEXT,
  size TEXT,
  color TEXT,
  color_hex TEXT,
  price_override NUMERIC(10, 2), -- if null, use product base_price
  sale_price_override NUMERIC(10, 2),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  attributes JSONB DEFAULT '{}', -- extra variant-specific attributes
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

-- -----------------------------------------------
-- 6. Orders
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  -- Customer details (guest checkout)
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  -- Delivery address
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  delivery_instructions TEXT,
  -- Financials
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_charge NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  -- Status
  order_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (order_status IN ('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'cod'
    CHECK (payment_method IN ('cod', 'razorpay', 'other')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
  -- Razorpay (future)
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  -- Idempotency
  idempotency_key TEXT UNIQUE,
  -- Metadata
  notes TEXT,
  cancelled_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- -----------------------------------------------
-- 7. Order Items (snapshot)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  -- Snapshot (frozen at time of order)
  product_name TEXT NOT NULL,
  variant_name TEXT,
  sku TEXT,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total NUMERIC(10, 2) NOT NULL,
  product_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- -----------------------------------------------
-- 8. Inventory Log
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS inventory_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  change_quantity INTEGER NOT NULL, -- positive = added, negative = deducted
  new_quantity INTEGER NOT NULL,
  reason TEXT NOT NULL, -- 'order_placed', 'order_cancelled', 'manual_adjustment', 'restock'
  reference_id TEXT, -- order id or other reference
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_log_product ON inventory_log(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_log_variant ON inventory_log(variant_id);

-- -----------------------------------------------
-- 9. Store Settings (key-value)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------
-- 10. Updated-at trigger function
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------
-- 11. Row Level Security
-- -----------------------------------------------
-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Public read for catalog data
CREATE POLICY "Public can view active brands" ON brands
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Public can view active variants" ON product_variants
  FOR SELECT USING (is_active = true);

-- Public can insert orders (guest checkout)
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Public can read their own order by order_number (via server function)
-- No direct public read to orders table

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access brands" ON brands
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access images" ON product_images
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access variants" ON product_variants
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access order items" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access inventory log" ON inventory_log
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can insert inventory log" ON inventory_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access store settings" ON store_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- -----------------------------------------------
-- 12. Storage bucket for product images
-- -----------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of product images
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload/delete product images
CREATE POLICY "Admin upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- -----------------------------------------------
-- 13. Atomic stock deduction function
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION deduct_stock(
  p_variant_id UUID,
  p_product_id UUID,
  p_quantity INTEGER,
  p_order_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_stock INTEGER;
  v_new_stock INTEGER;
  v_has_variants BOOLEAN;
BEGIN
  IF p_variant_id IS NOT NULL THEN
    -- Lock the variant row
    SELECT stock_quantity INTO v_current_stock
    FROM product_variants
    WHERE id = p_variant_id
    FOR UPDATE;

    IF v_current_stock < p_quantity THEN
      RETURN false;
    END IF;

    v_new_stock := v_current_stock - p_quantity;

    UPDATE product_variants
    SET stock_quantity = v_new_stock
    WHERE id = p_variant_id;

    INSERT INTO inventory_log (product_id, variant_id, change_quantity, new_quantity, reason, reference_id)
    VALUES (p_product_id, p_variant_id, -p_quantity, v_new_stock, 'order_placed', p_order_id);
  ELSE
    -- Non-variant product
    SELECT stock_quantity INTO v_current_stock
    FROM products
    WHERE id = p_product_id
    FOR UPDATE;

    IF v_current_stock < p_quantity THEN
      RETURN false;
    END IF;

    v_new_stock := v_current_stock - p_quantity;

    UPDATE products
    SET stock_quantity = v_new_stock
    WHERE id = p_product_id;

    INSERT INTO inventory_log (product_id, variant_id, change_quantity, new_quantity, reason, reference_id)
    VALUES (p_product_id, NULL, -p_quantity, v_new_stock, 'order_placed', p_order_id);
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------
-- 14. Atomic stock restoration function (for cancellations)
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION restore_stock(
  p_variant_id UUID,
  p_product_id UUID,
  p_quantity INTEGER,
  p_order_id TEXT
)
RETURNS VOID AS $$
DECLARE
  v_new_stock INTEGER;
BEGIN
  IF p_variant_id IS NOT NULL THEN
    UPDATE product_variants
    SET stock_quantity = stock_quantity + p_quantity
    WHERE id = p_variant_id
    RETURNING stock_quantity INTO v_new_stock;

    INSERT INTO inventory_log (product_id, variant_id, change_quantity, new_quantity, reason, reference_id)
    VALUES (p_product_id, p_variant_id, p_quantity, v_new_stock, 'order_cancelled', p_order_id);
  ELSE
    UPDATE products
    SET stock_quantity = stock_quantity + p_quantity
    WHERE id = p_product_id
    RETURNING stock_quantity INTO v_new_stock;

    INSERT INTO inventory_log (product_id, variant_id, change_quantity, new_quantity, reason, reference_id)
    VALUES (p_product_id, NULL, p_quantity, v_new_stock, 'order_cancelled', p_order_id);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------
-- 15. Generate order number function
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  v_date TEXT;
  v_seq INTEGER;
  v_number TEXT;
BEGIN
  v_date := to_char(now(), 'YYMMDD');

  SELECT COALESCE(MAX(
    CAST(SUBSTRING(order_number FROM 'RH' || v_date || '(\d+)') AS INTEGER)
  ), 0) + 1
  INTO v_seq
  FROM orders
  WHERE order_number LIKE 'RH' || v_date || '%';

  v_number := 'RH' || v_date || LPAD(v_seq::TEXT, 4, '0');
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;
