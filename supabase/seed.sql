-- =============================================================
-- RideHub — Seed Data
-- =============================================================
-- Run AFTER schema.sql. Provides initial brands, categories,
-- and sample products for development and demo.

-- -----------------------------------------------
-- Brands
-- -----------------------------------------------
INSERT INTO brands (name, slug, sort_order) VALUES
  ('Rynox', 'rynox', 1),
  ('Axor', 'axor', 2),
  ('MT Helmets', 'mt-helmets', 3),
  ('Raida', 'raida', 4),
  ('Solace', 'solace', 5),
  ('Viaterra', 'viaterra', 6),
  ('Mototech', 'mototech', 7),
  ('BBG', 'bbg', 8),
  ('DSG', 'dsg', 9),
  ('Zeus', 'zeus', 10)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------
-- Categories
-- -----------------------------------------------
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Helmets', 'helmets', 'hard-hat', 1),
  ('Jackets', 'jackets', 'shirt', 2),
  ('Gloves', 'gloves', 'hand', 3),
  ('Pants', 'pants', 'scissors', 4),
  ('Boots', 'boots', 'footprints', 5),
  ('Luggage', 'luggage', 'briefcase', 6),
  ('Accessories', 'accessories', 'wrench', 7)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------
-- Sample Products
-- -----------------------------------------------

-- Helmets
INSERT INTO products (name, slug, brand_id, category_id, description, base_price, sale_price, sku, is_active, is_featured, is_new_arrival, has_variants, stock_quantity, specifications) VALUES
(
  'Axor Apex Carbon Fibre Helmet',
  'axor-apex-carbon-fibre',
  (SELECT id FROM brands WHERE slug = 'axor'),
  (SELECT id FROM categories WHERE slug = 'helmets'),
  'The Axor Apex Carbon Fibre is an ultra-lightweight full-face helmet with premium carbon fiber shell construction. Features an advanced ventilation system, dual-density EPS liner, and a clear anti-fog pinlock-ready visor. ECE 22.06 certified for maximum safety.',
  12999,
  NULL,
  'AXR-APEX-CF',
  true, true, true, true, 0,
  '{"Shell": "Carbon Fibre", "Certification": "ECE 22.06", "Weight": "1250g ± 50g", "Visor": "Pinlock Ready, Anti-Fog", "Ventilation": "Multi-channel airflow", "Liner": "Removable, washable"}'::jsonb
),
(
  'MT Thunder 4 SV Solid Helmet',
  'mt-thunder-4-sv-solid',
  (SELECT id FROM brands WHERE slug = 'mt-helmets'),
  (SELECT id FROM categories WHERE slug = 'helmets'),
  'Entry-level full-face helmet from MT with polycarbonate shell, integrated sun visor, quick-release buckle, and excellent ventilation. Perfect for daily commuting and weekend rides.',
  4999,
  4499,
  'MT-TH4-SLD',
  true, false, true, true, 0,
  '{"Shell": "Polycarbonate", "Certification": "ECE 22.06", "Weight": "1450g ± 50g", "Visor": "Clear + Internal Sun Visor", "Ventilation": "Top & chin vents", "Buckle": "Micrometric quick-release"}'::jsonb
),
(
  'Zeus ZS-813 Dual Sport Helmet',
  'zeus-zs-813-dual-sport',
  (SELECT id FROM brands WHERE slug = 'zeus'),
  (SELECT id FROM categories WHERE slug = 'helmets'),
  'Versatile dual-sport helmet perfect for adventure riding. Features a removable peak visor, wide eye port, and rugged polycarbonate construction.',
  5999,
  5499,
  'ZS-813-DS',
  true, false, false, true, 0,
  '{"Shell": "Polycarbonate", "Type": "Dual Sport", "Weight": "1550g ± 50g", "Visor": "Clear + Removable Peak", "Ventilation": "Front & rear channels"}'::jsonb
);

-- Jackets
INSERT INTO products (name, slug, brand_id, category_id, description, base_price, sale_price, sku, is_active, is_featured, is_new_arrival, has_variants, stock_quantity, specifications) VALUES
(
  'Rynox Storm Evo 3 Jacket',
  'rynox-storm-evo-3',
  (SELECT id FROM brands WHERE slug = 'rynox'),
  (SELECT id FROM categories WHERE slug = 'jackets'),
  'The Storm Evo 3 is Rynox''s flagship all-season touring jacket. Features Cordura 600D outer shell, CE Level 2 armor at shoulders and elbows, a removable thermal liner, waterproof membrane, and extensive ventilation panels for Indian summers.',
  7999,
  NULL,
  'RNX-STRM3',
  true, true, false, true, 0,
  '{"Material": "Cordura 600D", "Armor": "CE Level 2 (Shoulders, Elbows)", "Back Protector": "Pocket (sold separately)", "Liner": "Removable thermal + Waterproof membrane", "Ventilation": "Multiple zippered panels", "Reflective": "360° reflective elements"}'::jsonb
),
(
  'Raida Drifter Mesh Jacket',
  'raida-drifter-mesh',
  (SELECT id FROM brands WHERE slug = 'raida'),
  (SELECT id FROM categories WHERE slug = 'jackets'),
  'Lightweight mesh riding jacket ideal for hot-weather touring. Maximum airflow with CE-approved armor protection. Features adjustable fit, multiple pockets, and reflective panels.',
  4499,
  3999,
  'RDA-DRFT-MSH',
  true, false, true, true, 0,
  '{"Material": "High-denier mesh + Cordura reinforcements", "Armor": "CE Level 1 (Shoulders, Elbows)", "Back Protector": "Foam pad included", "Ventilation": "Full mesh construction", "Fit": "Adjustable waist & arm straps"}'::jsonb
),
(
  'Solace Rival Urban Jacket',
  'solace-rival-urban',
  (SELECT id FROM brands WHERE slug = 'solace'),
  (SELECT id FROM categories WHERE slug = 'jackets'),
  'Sleek urban riding jacket that transitions seamlessly from bike to street. D3O ghost armor offers invisible protection with a casual aesthetic. Water-resistant outer with YKK zippers.',
  8999,
  NULL,
  'SLC-RVL-URB',
  true, true, true, true, 0,
  '{"Material": "600D Polyester with DWR coating", "Armor": "D3O Ghost (Shoulders, Elbows, Back)", "Waterproof": "Water-resistant DWR", "Zippers": "YKK throughout", "Style": "Urban casual"}'::jsonb
);

-- Gloves
INSERT INTO products (name, slug, brand_id, category_id, description, base_price, sale_price, sku, is_active, is_featured, is_new_arrival, has_variants, stock_quantity, specifications) VALUES
(
  'Rynox Air GT Gloves',
  'rynox-air-gt-gloves',
  (SELECT id FROM brands WHERE slug = 'rynox'),
  (SELECT id FROM categories WHERE slug = 'gloves'),
  'Breathable summer riding gloves with goat leather palm, TPU knuckle protector, touchscreen-compatible fingertips, and a secure velcro wrist closure.',
  1999,
  NULL,
  'RNX-AIRGT',
  true, true, false, true, 0,
  '{"Palm": "Goat Leather", "Upper": "Mesh + Nylon", "Protection": "TPU knuckle guard", "Features": "Touchscreen compatible", "Closure": "Velcro wrist strap"}'::jsonb
),
(
  'BBG Semi Gauntlet Gloves',
  'bbg-semi-gauntlet',
  (SELECT id FROM brands WHERE slug = 'bbg'),
  (SELECT id FROM categories WHERE slug = 'gloves'),
  'Premium semi-gauntlet riding gloves with full leather construction, carbon fiber knuckle protection, and EVA foam padding at critical impact zones.',
  2999,
  2599,
  'BBG-SG-GLV',
  true, false, false, true, 0,
  '{"Material": "Full grain leather", "Protection": "Carbon fiber knuckle + EVA padding", "Closure": "Velcro wrist + gauntlet strap", "Features": "Visor wiper, touchscreen index finger"}'::jsonb
);

-- Pants
INSERT INTO products (name, slug, brand_id, category_id, description, base_price, sale_price, sku, is_active, is_featured, is_new_arrival, has_variants, stock_quantity, specifications) VALUES
(
  'Rynox Advento Riding Pants',
  'rynox-advento-pants',
  (SELECT id FROM brands WHERE slug = 'rynox'),
  (SELECT id FROM categories WHERE slug = 'pants'),
  'Versatile adventure touring pants with Cordura 500D construction, CE armor at knees and hips, removable waterproof liner, and reflective elements for visibility.',
  5999,
  NULL,
  'RNX-ADVT-PNT',
  true, false, true, true, 0,
  '{"Material": "Cordura 500D", "Armor": "CE Level 1 (Knees, Hips)", "Liner": "Removable waterproof", "Connection": "Jacket zip connector", "Reflective": "Yes"}'::jsonb
);

-- Boots
INSERT INTO products (name, slug, brand_id, category_id, description, base_price, sale_price, sku, is_active, is_featured, is_new_arrival, has_variants, stock_quantity, specifications) VALUES
(
  'Mototech Asphalt V3 Riding Shoes',
  'mototech-asphalt-v3',
  (SELECT id FROM brands WHERE slug = 'mototech'),
  (SELECT id FROM categories WHERE slug = 'boots'),
  'Urban riding shoes with ankle protection, oil-resistant sole, shift pad, and waterproof membrane. Looks like casual shoes but rides like proper motorcycle boots.',
  4499,
  NULL,
  'MTK-ASPH-V3',
  true, true, false, true, 0,
  '{"Material": "Microfibre upper", "Protection": "Ankle cups + toe reinforcement", "Sole": "Oil-resistant rubber", "Waterproof": "Membrane liner", "Closure": "Speed lace + velcro"}'::jsonb
);

-- Luggage
INSERT INTO products (name, slug, brand_id, category_id, description, base_price, sale_price, sku, is_active, is_featured, is_new_arrival, has_variants, stock_quantity, specifications) VALUES
(
  'Viaterra Claw 100% Waterproof Tail Bag',
  'viaterra-claw-tail-bag',
  (SELECT id FROM brands WHERE slug = 'viaterra'),
  (SELECT id FROM categories WHERE slug = 'luggage'),
  'Fully waterproof tail bag with 50L capacity, expandable design, heavy-duty straps, and multiple attachment points. Perfect for touring and daily commuting.',
  3999,
  3499,
  'VIA-CLAW-50',
  true, true, false, false, 15,
  '{"Volume": "50 Litres", "Material": "500D tarpaulin", "Waterproof": "100% welded seams", "Mounting": "Universal strap system", "Features": "Expandable, reflective accents"}'::jsonb
);

-- Accessories
INSERT INTO products (name, slug, brand_id, category_id, description, base_price, sale_price, sku, is_active, is_featured, is_new_arrival, has_variants, stock_quantity, specifications) VALUES
(
  'DSG Knee Guard Pro',
  'dsg-knee-guard-pro',
  (SELECT id FROM brands WHERE slug = 'dsg'),
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'CE Level 2 certified knee guards with hard shell outer and soft foam inner. Adjustable straps for a secure fit over or under riding pants.',
  1499,
  NULL,
  'DSG-KG-PRO',
  true, false, true, false, 20,
  '{"Certification": "CE Level 2", "Shell": "Hard ABS outer", "Padding": "Multi-density foam", "Straps": "Adjustable elastic", "Weight": "350g per piece"}'::jsonb
),
(
  'Rynox Optimus Balaclava',
  'rynox-optimus-balaclava',
  (SELECT id FROM brands WHERE slug = 'rynox'),
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'Moisture-wicking balaclava with flat-seam construction. Keeps you cool in summer and warm in winter. Compatible with all helmet types.',
  499,
  NULL,
  'RNX-OPT-BLV',
  true, false, false, false, 30,
  '{"Material": "Coolmax fabric", "Features": "Moisture-wicking, anti-bacterial", "Fit": "One size fits most", "Season": "All-season"}'::jsonb
);

-- -----------------------------------------------
-- Variants for products with has_variants = true
-- -----------------------------------------------

-- Axor Apex Carbon Fibre - Sizes
INSERT INTO product_variants (product_id, name, sku, size, stock_quantity, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'axor-apex-carbon-fibre'), 'S', 'AXR-APEX-CF-S', 'S', 3, 1),
  ((SELECT id FROM products WHERE slug = 'axor-apex-carbon-fibre'), 'M', 'AXR-APEX-CF-M', 'M', 5, 2),
  ((SELECT id FROM products WHERE slug = 'axor-apex-carbon-fibre'), 'L', 'AXR-APEX-CF-L', 'L', 4, 3),
  ((SELECT id FROM products WHERE slug = 'axor-apex-carbon-fibre'), 'XL', 'AXR-APEX-CF-XL', 'XL', 3, 4),
  ((SELECT id FROM products WHERE slug = 'axor-apex-carbon-fibre'), 'XXL', 'AXR-APEX-CF-XXL', 'XXL', 2, 5);

-- MT Thunder 4 - Sizes
INSERT INTO product_variants (product_id, name, sku, size, stock_quantity, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'mt-thunder-4-sv-solid'), 'S', 'MT-TH4-S', 'S', 4, 1),
  ((SELECT id FROM products WHERE slug = 'mt-thunder-4-sv-solid'), 'M', 'MT-TH4-M', 'M', 6, 2),
  ((SELECT id FROM products WHERE slug = 'mt-thunder-4-sv-solid'), 'L', 'MT-TH4-L', 'L', 5, 3),
  ((SELECT id FROM products WHERE slug = 'mt-thunder-4-sv-solid'), 'XL', 'MT-TH4-XL', 'XL', 4, 4);

-- Zeus ZS-813 - Sizes
INSERT INTO product_variants (product_id, name, sku, size, stock_quantity, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'zeus-zs-813-dual-sport'), 'M', 'ZS-813-M', 'M', 3, 1),
  ((SELECT id FROM products WHERE slug = 'zeus-zs-813-dual-sport'), 'L', 'ZS-813-L', 'L', 4, 2),
  ((SELECT id FROM products WHERE slug = 'zeus-zs-813-dual-sport'), 'XL', 'ZS-813-XL', 'XL', 3, 3);

-- Rynox Storm Evo 3 - Sizes
INSERT INTO product_variants (product_id, name, sku, size, color, color_hex, stock_quantity, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'rynox-storm-evo-3'), 'Black / S', 'RNX-STRM3-BK-S', 'S', 'Black', '#1a1a1a', 3, 1),
  ((SELECT id FROM products WHERE slug = 'rynox-storm-evo-3'), 'Black / M', 'RNX-STRM3-BK-M', 'M', 'Black', '#1a1a1a', 5, 2),
  ((SELECT id FROM products WHERE slug = 'rynox-storm-evo-3'), 'Black / L', 'RNX-STRM3-BK-L', 'L', 'Black', '#1a1a1a', 4, 3),
  ((SELECT id FROM products WHERE slug = 'rynox-storm-evo-3'), 'Black / XL', 'RNX-STRM3-BK-XL', 'XL', 'Black', '#1a1a1a', 3, 4),
  ((SELECT id FROM products WHERE slug = 'rynox-storm-evo-3'), 'Charcoal Grey / M', 'RNX-STRM3-GR-M', 'M', 'Charcoal Grey', '#4a4a4a', 3, 5),
  ((SELECT id FROM products WHERE slug = 'rynox-storm-evo-3'), 'Charcoal Grey / L', 'RNX-STRM3-GR-L', 'L', 'Charcoal Grey', '#4a4a4a', 4, 6),
  ((SELECT id FROM products WHERE slug = 'rynox-storm-evo-3'), 'Charcoal Grey / XL', 'RNX-STRM3-GR-XL', 'XL', 'Charcoal Grey', '#4a4a4a', 2, 7);

-- Raida Drifter Mesh - Sizes
INSERT INTO product_variants (product_id, name, sku, size, stock_quantity, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'raida-drifter-mesh'), 'S', 'RDA-DRFT-S', 'S', 3, 1),
  ((SELECT id FROM products WHERE slug = 'raida-drifter-mesh'), 'M', 'RDA-DRFT-M', 'M', 5, 2),
  ((SELECT id FROM products WHERE slug = 'raida-drifter-mesh'), 'L', 'RDA-DRFT-L', 'L', 6, 3),
  ((SELECT id FROM products WHERE slug = 'raida-drifter-mesh'), 'XL', 'RDA-DRFT-XL', 'XL', 4, 4),
  ((SELECT id FROM products WHERE slug = 'raida-drifter-mesh'), 'XXL', 'RDA-DRFT-XXL', 'XXL', 2, 5);

-- Solace Rival Urban - Sizes
INSERT INTO product_variants (product_id, name, sku, size, color, color_hex, stock_quantity, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'solace-rival-urban'), 'Black / M', 'SLC-RVL-BK-M', 'M', 'Black', '#1a1a1a', 4, 1),
  ((SELECT id FROM products WHERE slug = 'solace-rival-urban'), 'Black / L', 'SLC-RVL-BK-L', 'L', 'Black', '#1a1a1a', 5, 2),
  ((SELECT id FROM products WHERE slug = 'solace-rival-urban'), 'Black / XL', 'SLC-RVL-BK-XL', 'XL', 'Black', '#1a1a1a', 3, 3),
  ((SELECT id FROM products WHERE slug = 'solace-rival-urban'), 'Olive / M', 'SLC-RVL-OL-M', 'M', 'Olive', '#5a6340', 3, 4),
  ((SELECT id FROM products WHERE slug = 'solace-rival-urban'), 'Olive / L', 'SLC-RVL-OL-L', 'L', 'Olive', '#5a6340', 4, 5),
  ((SELECT id FROM products WHERE slug = 'solace-rival-urban'), 'Olive / XL', 'SLC-RVL-OL-XL', 'XL', 'Olive', '#5a6340', 2, 6);

-- Rynox Air GT Gloves - Sizes
INSERT INTO product_variants (product_id, name, sku, size, stock_quantity, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'rynox-air-gt-gloves'), 'S', 'RNX-AIRGT-S', 'S', 5, 1),
  ((SELECT id FROM products WHERE slug = 'rynox-air-gt-gloves'), 'M', 'RNX-AIRGT-M', 'M', 8, 2),
  ((SELECT id FROM products WHERE slug = 'rynox-air-gt-gloves'), 'L', 'RNX-AIRGT-L', 'L', 7, 3),
  ((SELECT id FROM products WHERE slug = 'rynox-air-gt-gloves'), 'XL', 'RNX-AIRGT-XL', 'XL', 5, 4);

-- BBG Semi Gauntlet Gloves - Sizes
INSERT INTO product_variants (product_id, name, sku, size, stock_quantity, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'bbg-semi-gauntlet'), 'M', 'BBG-SG-M', 'M', 4, 1),
  ((SELECT id FROM products WHERE slug = 'bbg-semi-gauntlet'), 'L', 'BBG-SG-L', 'L', 5, 2),
  ((SELECT id FROM products WHERE slug = 'bbg-semi-gauntlet'), 'XL', 'BBG-SG-XL', 'XL', 3, 3);

-- Rynox Advento Pants - Sizes
INSERT INTO product_variants (product_id, name, sku, size, stock_quantity, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'rynox-advento-pants'), 'S (28-30)', 'RNX-ADVT-S', 'S (28-30)', 3, 1),
  ((SELECT id FROM products WHERE slug = 'rynox-advento-pants'), 'M (30-32)', 'RNX-ADVT-M', 'M (30-32)', 5, 2),
  ((SELECT id FROM products WHERE slug = 'rynox-advento-pants'), 'L (32-34)', 'RNX-ADVT-L', 'L (32-34)', 4, 3),
  ((SELECT id FROM products WHERE slug = 'rynox-advento-pants'), 'XL (34-36)', 'RNX-ADVT-XL', 'XL (34-36)', 3, 4);

-- Mototech Asphalt V3 - Sizes
INSERT INTO product_variants (product_id, name, sku, size, stock_quantity, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'mototech-asphalt-v3'), 'UK 7 / EU 41', 'MTK-ASPH-41', 'UK 7 / EU 41', 3, 1),
  ((SELECT id FROM products WHERE slug = 'mototech-asphalt-v3'), 'UK 8 / EU 42', 'MTK-ASPH-42', 'UK 8 / EU 42', 4, 2),
  ((SELECT id FROM products WHERE slug = 'mototech-asphalt-v3'), 'UK 9 / EU 43', 'MTK-ASPH-43', 'UK 9 / EU 43', 5, 3),
  ((SELECT id FROM products WHERE slug = 'mototech-asphalt-v3'), 'UK 10 / EU 44', 'MTK-ASPH-44', 'UK 10 / EU 44', 3, 4),
  ((SELECT id FROM products WHERE slug = 'mototech-asphalt-v3'), 'UK 11 / EU 45', 'MTK-ASPH-45', 'UK 11 / EU 45', 2, 5);

-- -----------------------------------------------
-- Initial Store Settings
-- -----------------------------------------------
INSERT INTO store_settings (key, value) VALUES
  ('announcement', '{"enabled": true, "text": "Free shipping on orders above ₹2,999 • Cash on Delivery available across India"}'::jsonb),
  ('shipping', '{"default_charge": 99, "free_threshold": 2999, "estimated_delivery": "5-10 business days"}'::jsonb),
  ('low_stock_threshold', '5'::jsonb)
ON CONFLICT (key) DO NOTHING;
