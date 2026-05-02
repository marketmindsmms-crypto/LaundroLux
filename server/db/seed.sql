-- 🗄️ MOCK DATA SEED SCRIPT – LAUNDROLUX
-- Run this script after init.sql to populate initial reference data and a test order.

BEGIN;

-- 1. Insert Reference Data (Services, Items, Fabrics)
INSERT INTO services (id, name, description, base_price, icon_url)
VALUES 
  ('uuid-premium-wash', 'Premium Wash', 'Fresh & fragrant cleaning', 89.00, '👕'),
  ('uuid-dry-clean', 'Dry Cleaning', 'Professional care for delicate items', 149.00, '🧥'),
  ('uuid-couture-care', 'Couture Care', 'Specialized care for luxury items', 349.00, '👘');

INSERT INTO fabrics (id, name, care_type, price_multiplier)
VALUES 
  ('uuid-cotton', 'Cotton', 'normal', 1.0),
  ('uuid-silk', 'Silk', 'delicate', 2.0),
  ('uuid-wool', 'Wool', 'delicate', 1.5);

INSERT INTO items (id, name, category, default_service_id)
VALUES 
  ('uuid-shirt', 'Shirt', 'casual', 'uuid-premium-wash'),
  ('uuid-saree', 'Saree', 'ethnic', 'uuid-couture-care');


-- 2. Insert Test User & Address
INSERT INTO users (id, name, phone, email)
VALUES 
  ('uuid-user', 'Arjun Sharma', '9876543210', 'arjun@example.com');

INSERT INTO addresses (id, user_id, label, address_line, city, state, pincode, is_default)
VALUES 
  ('uuid-address', 'uuid-user', 'Home', '14B, Vasant Vihar', 'New Delhi', 'Delhi', '110057', TRUE);


-- 3. Insert Mock Order (from API flow)
INSERT INTO orders (
  id, user_id, address_id, status, pickup_time, delivery_time, total_price
)
VALUES (
  'order-id',
  'uuid-user',
  'uuid-address',
  'pending',
  '2026-05-03 20:00:00',
  '2026-05-04 20:00:00',
  50.00
);

-- 4. Insert Mock Order Items
INSERT INTO order_items (
  id, order_id, item_id, fabric_id, service_id, quantity, unit_price, total_price
)
VALUES (
  gen_random_uuid(),
  'order-id',
  'uuid-shirt',
  'uuid-cotton',
  'uuid-premium-wash',
  5,
  10.00,
  50.00
);

-- 5. Insert Order Tracking Event
INSERT INTO order_tracking (id, order_id, status, notes)
VALUES (
  gen_random_uuid(),
  'order-id',
  'pending',
  'Order created, awaiting pickup'
);

-- 6. Insert Order Collected Tracking Event
INSERT INTO order_tracking (
  id, order_id, status
)
VALUES (
  gen_random_uuid(),
  'order-id',
  'collected'
);

COMMIT;
