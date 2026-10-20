# Supabase Schema

Complete PostgreSQL schema for Cap Collective dashboard.

```sql
-- Cap Collective Supabase Schema
-- ============================================================
-- Run this in Supabase SQL Editor to set up the database
-- Compatible with PostgreSQL 15+ (Supabase default)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: cap_counts
-- Stores individual cap count events from IoT sensors
-- ============================================================
CREATE TABLE IF NOT EXISTS cap_counts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id SMALLINT NOT NULL CHECK (node_id BETWEEN 1 AND 10),
    cap_count INTEGER NOT NULL CHECK (cap_count > 0),
    cap_color VARCHAR(20) NOT NULL CHECK (cap_color IN ('red', 'blue', 'green', 'white', 'unknown')),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_cap_counts_node_id ON cap_counts(node_id);
CREATE INDEX IF NOT EXISTS idx_cap_counts_recorded_at ON cap_counts(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_cap_counts_cap_color ON cap_counts(cap_color);
CREATE INDEX IF NOT EXISTS idx_cap_counts_node_recorded ON cap_counts(node_id, recorded_at DESC);

-- ============================================================
-- TABLE: collection_events
-- Manual/aggregated collection events (from Google Sheets sync)
-- ============================================================
CREATE TABLE IF NOT EXISTS collection_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_date DATE NOT NULL,
    location VARCHAR(100) NOT NULL,
    collector_names TEXT[],
    cap_count INTEGER NOT NULL CHECK (cap_count >= 0),
    weight_kg DECIMAL(8,3) CHECK (weight_kg >= 0),
    color_mix_light_pct SMALLINT CHECK (color_mix_light_pct BETWEEN 0 AND 100),
    color_mix_dark_pct SMALLINT CHECK (color_mix_dark_pct BETWEEN 0 AND 100),
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collection_events_date ON collection_events(collection_date DESC);
CREATE INDEX IF NOT EXISTS idx_collection_events_location ON collection_events(location);

-- ============================================================
-- TABLE: equipment
-- Equipment inventory and procurement tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('Core', 'FabLab', 'Center')),
    quantity SMALLINT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_cost_usd DECIMAL(10,2) CHECK (unit_cost_usd >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    supplier_name VARCHAR(200),
    supplier_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Research' CHECK (status IN ('Research', 'Quoted', 'Ordered', 'Received')),
    lead_time_weeks SMALLINT,
    budget_code VARCHAR(50),
    received_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: finances
-- Income and expense tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS finances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_date DATE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Grant', 'Product', 'Sponsorship', 'PTA', 'Crowdfunding', 'Other Income',
        'Equipment', 'Consumable', 'Maintenance', 'Marketing', 'Other Expense'
    )),
    amount_usd DECIMAL(12,2) NOT NULL,
    is_income BOOLEAN NOT NULL,
    related_product_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: products
-- Product catalog and inventory
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price_usd DECIMAL(8,2) NOT NULL CHECK (price_usd >= 0),
    material_cost_usd DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (material_cost_usd >= 0),
    tier_required VARCHAR(20) NOT NULL DEFAULT 'Core' CHECK (tier_required IN ('Core', 'FabLab', 'Center')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: product_batches
-- Production batches for QC tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS product_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    batch_number VARCHAR(50) NOT NULL,
    quantity_made INTEGER NOT NULL DEFAULT 0 CHECK (quantity_made >= 0),
    quantity_sold INTEGER NOT NULL DEFAULT 0 CHECK (quantity_sold >= 0),
    production_date DATE NOT NULL,
    operators TEXT[], -- Student names
    material_type VARCHAR(10) CHECK (material_type IN ('HDPE', 'PP', 'MIXED')),
    material_percentage JSONB, -- e.g., {"HDPE": 80, "PP": 20}
    sheet_thickness_mm DECIMAL(4,2),
    qc_passed BOOLEAN,
    qc_notes TEXT,
    qc_checked_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_batches_product ON product_batches(product_id);
CREATE INDEX IF NOT EXISTS idx_product_batches_date ON product_batches(production_date DESC);

-- ============================================================
-- TABLE: sales
-- Individual sales transactions
-- ============================================================
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES product_batches(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_usd DECIMAL(8,2) NOT NULL,
    total_usd DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price_usd) STORED,
    customer_type VARCHAR(20) NOT NULL CHECK (customer_type IN ('Student', 'Staff', 'Community', 'Online', 'B2B')),
    customer_email VARCHAR(255),
    sale_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    pos_reference VARCHAR(100),
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date DESC);
CREATE INDEX IF NOT EXISTS idx_sales_batch ON sales(batch_id);
CREATE INDEX IF NOT EXISTS idx_sales_product ON sales(product_id);

-- ============================================================
-- TABLE: students
-- Student roster and role tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    grade SMALLINT CHECK (grade BETWEEN 0 AND 12),
    roles TEXT[] DEFAULT '{}',
    shift_days TEXT[] DEFAULT '{}',
    safety_certified BOOLEAN NOT NULL DEFAULT FALSE,
    shredder_certified BOOLEAN NOT NULL DEFAULT FALSE,
    press_certified BOOLEAN NOT NULL DEFAULT FALSE,
    laser_certified BOOLEAN NOT NULL DEFAULT FALSE,
    hours_logged DECIMAL(6,2) NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    joined_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: lessons
-- Curriculum and lesson tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_band VARCHAR(20) NOT NULL CHECK (grade_band IN ('K-2', '3-5', '6-8', '9-12')),
    unit VARCHAR(200) NOT NULL,
    lesson_number SMALLINT NOT NULL,
    title VARCHAR(300) NOT NULL,
    standards TEXT[],
    duration_minutes SMALLINT,
    materials TEXT[],
    status VARCHAR(20) NOT NULL DEFAULT 'Planned' CHECK (status IN ('Planned', 'Delivered', 'Assessed')),
    teacher_notes TEXT,
    delivered_at DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(grade_band, unit, lesson_number)
);

-- ============================================================
-- TABLE: sensor_data_log
-- Raw sensor data from ESP32 devices (high volume)
-- ============================================================
CREATE TABLE IF NOT EXISTS sensor_data_log (
    id BIGSERIAL PRIMARY KEY,
    bin_id VARCHAR(50) NOT NULL,
    count INTEGER NOT NULL CHECK (count >= 0),
    fill_pct SMALLINT CHECK (fill_pct BETWEEN 0 AND 100),
    temperature_c DECIMAL(4,1),
    status VARCHAR(20) DEFAULT 'OK' CHECK (status IN ('OK', 'Monitor', 'FULL — COLLECT NOW')),
    source VARCHAR(20) DEFAULT 'ESP32',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensor_log_bin ON sensor_data_log(bin_id);
CREATE INDEX IF NOT EXISTS idx_sensor_log_recorded ON sensor_data_log(recorded_at DESC);

-- ============================================================
-- TABLE: impact_metrics
-- Pre-aggregated metrics for fast dashboard queries
-- ============================================================
CREATE TABLE IF NOT EXISTS impact_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL UNIQUE,
    caps_collected BIGINT NOT NULL DEFAULT 0,
    weight_kg DECIMAL(10,3) NOT NULL DEFAULT 0,
    products_made INTEGER NOT NULL DEFAULT 0,
    products_sold INTEGER NOT NULL DEFAULT 0,
    revenue_usd DECIMAL(12,2) NOT NULL DEFAULT 0,
    students_engaged INTEGER NOT NULL DEFAULT 0,
    students_certified INTEGER NOT NULL DEFAULT 0,
    co2e_avoided_kg DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE cap_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_data_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous read access (for public dashboard)
-- In production, restrict to authenticated users with proper roles
CREATE POLICY "Allow public read" ON cap_counts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON collection_events FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON equipment FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON finances FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON product_batches FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON sales FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON students FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON lessons FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON sensor_data_log FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON impact_metrics FOR SELECT USING (true);

-- Policy: Allow service role full access (for backend writes)
CREATE POLICY "Service role full access" ON cap_counts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON collection_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON equipment FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON finances FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON product_batches FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON sales FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON students FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON lessons FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON sensor_data_log FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON impact_metrics FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- REALTIME PUBLICATION
-- Enable realtime for live dashboard updates
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE cap_counts;
ALTER PUBLICATION supabase_realtime ADD TABLE collection_events;
ALTER PUBLICATION supabase_realtime ADD TABLE sensor_data_log;
ALTER PUBLICATION supabase_realtime ADD TABLE impact_metrics;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_collection_events_updated_at BEFORE UPDATE ON collection_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_impact_metrics_updated_at BEFORE UPDATE ON impact_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to aggregate daily impact metrics
CREATE OR REPLACE FUNCTION refresh_daily_impact_metrics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
DECLARE
    v_caps BIGINT;
    v_weight DECIMAL(10,3);
    v_products_made INTEGER;
    v_products_sold INTEGER;
    v_revenue DECIMAL(12,2);
    v_students_engaged INTEGER;
    v_students_certified INTEGER;
    v_co2e DECIMAL(10,2);
BEGIN
    -- Aggregate from collection_events
    SELECT COALESCE(SUM(cap_count), 0), COALESCE(SUM(weight_kg), 0)
    INTO v_caps, v_weight
    FROM collection_events
    WHERE collection_date = target_date;

    -- Aggregate from product_batches
    SELECT COALESCE(SUM(quantity_made), 0)
    INTO v_products_made
    FROM product_batches
    WHERE production_date = target_date;

    -- Aggregate from sales
    SELECT COALESCE(SUM(quantity), 0), COALESCE(SUM(total_usd), 0)
    INTO v_products_sold, v_revenue
    FROM sales
    WHERE sale_date::DATE = target_date;

    -- Students
    SELECT COUNT(*), COUNT(*) FILTER (WHERE safety_certified OR shredder_certified OR press_certified OR laser_certified)
    INTO v_students_engaged, v_students_certified
    FROM students
    WHERE active = TRUE;

    -- CO2e (EPA WARM model: ~1.9 kg CO2e per kg HDPE)
    v_co2e := v_weight * 1.9;

    -- Upsert
    INSERT INTO impact_metrics (metric_date, caps_collected, weight_kg, products_made, products_sold, revenue_usd, students_engaged, students_certified, co2e_avoided_kg)
    VALUES (target_date, v_caps, v_weight, v_products_made, v_products_sold, v_revenue, v_students_engaged, v_students_certified, v_co2e)
    ON CONFLICT (metric_date) DO UPDATE SET
        caps_collected = EXCLUDED.caps_collected,
        weight_kg = EXCLUDED.weight_kg,
        products_made = EXCLUDED.products_made,
        products_sold = EXCLUDED.products_sold,
        revenue_usd = EXCLUDED.revenue_usd,
        students_engaged = EXCLUDED.students_engaged,
        students_certified = EXCLUDED.students_certified,
        co2e_avoided_kg = EXCLUDED.co2e_avoided_kg,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================

-- INSERT INTO products (sku, name, price_usd, material_cost_usd, tier_required) VALUES
-- ('CST-001', 'Coaster Set (4)', 10.00, 2.50, 'Core'),
-- ('KEY-001', 'Keychain', 4.00, 0.60, 'FabLab'),
-- ('ORG-001', 'Desk Organizer', 15.00, 4.50, 'FabLab'),
-- ('TILE-001', 'Outdoor Tile 12x12"', 20.00, 6.00, 'Center');

-- ============================================================
-- GRANTS FOR SERVICE ROLE (if using custom roles)
-- ============================================================
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Check tables created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS enabled:
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check realtime publication:
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```
