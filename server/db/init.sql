-- 🗄️ DATABASE SCHEMA – LAUNDROLUX

-- 1. USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR,
  phone VARCHAR UNIQUE NOT NULL,
  email VARCHAR,
  language VARCHAR DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. ADDRESSES
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR, -- Home, Office, Parents
  address_line TEXT,
  city VARCHAR,
  state VARCHAR,
  pincode VARCHAR,
  latitude DECIMAL,
  longitude DECIMAL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. FABRIC_PREFERENCES
CREATE TABLE fabric_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  detergent_type VARCHAR, -- eco, hypoallergenic, regular
  starch_level VARCHAR,   -- none, light, medium, heavy
  softener BOOLEAN DEFAULT TRUE,
  special_notes TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. SERVICES
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR, -- Dry Cleaning, Premium Wash
  description TEXT,
  base_price DECIMAL,
  icon_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. ITEMS (CLOTHING TYPES)
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR, -- Shirt, Saree, Suit
  category VARCHAR, -- casual, couture, ethnic
  default_service_id UUID REFERENCES services(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. FABRICS
CREATE TABLE fabrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR, -- Cotton, Silk, Wool
  care_type VARCHAR, -- delicate, normal, heavy
  price_multiplier DECIMAL DEFAULT 1.0
);

-- 7. ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  address_id UUID REFERENCES addresses(id),
  status VARCHAR DEFAULT 'pending', -- pending, collected, processing, delivered
  pickup_time TIMESTAMP,
  delivery_time TIMESTAMP,
  total_price DECIMAL,
  payment_status VARCHAR DEFAULT 'pending', -- pending, paid, failed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. ORDER_ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id),
  fabric_id UUID REFERENCES fabrics(id),
  service_id UUID REFERENCES services(id),
  quantity INT,
  unit_price DECIMAL,
  total_price DECIMAL
);

-- 9. ORDER_STATUS_TRACKING
CREATE TABLE order_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR, -- collected, analysis, cleaning, qc, out_for_delivery
  timestamp TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- 10. DRIVERS (DELIVERY AGENTS)
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR,
  phone VARCHAR,
  vehicle_type VARCHAR,
  current_lat DECIMAL,
  current_lng DECIMAL,
  is_available BOOLEAN DEFAULT TRUE
);

-- 11. ORDER_ASSIGNMENTS
CREATE TABLE order_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  driver_id UUID REFERENCES drivers(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR -- assigned, picked, delivered
);

-- 12. PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  amount DECIMAL,
  method VARCHAR, -- UPI, card, wallet
  transaction_id VARCHAR,
  status VARCHAR, -- success, failed, pending
  created_at TIMESTAMP DEFAULT NOW()
);

-- 13. MEMBERSHIPS
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  tier VARCHAR, -- gold, platinum
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  benefits JSONB
);

-- 14. REWARDS
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  points INT DEFAULT 0,
  last_redeemed TIMESTAMP
);

-- 15. COUPONS
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR UNIQUE,
  discount_type VARCHAR, -- percentage, flat
  discount_value DECIMAL,
  expiry_date TIMESTAMP,
  usage_limit INT
);

-- 16. ORDER_COUPONS
CREATE TABLE order_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  coupon_id UUID REFERENCES coupons(id),
  discount_applied DECIMAL
);

-- 17. AI_REQUEST_LOGS
CREATE TABLE ai_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  raw_input TEXT,
  parsed_output JSONB,
  confidence_score DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 18. ORDER_ITEM_CUSTOMIZATIONS
CREATE TABLE order_item_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  detergent_type VARCHAR,
  fragrance VARCHAR,
  starch_level VARCHAR,
  special_handling JSONB,
  add_ons JSONB,
  extra_cost DECIMAL DEFAULT 0.00
);

-- 🔗 KEY RELATIONSHIPS INDEXING
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_order_assignments_order_id ON order_assignments(order_id);
CREATE INDEX idx_ai_requests_user_id ON ai_requests(user_id);
