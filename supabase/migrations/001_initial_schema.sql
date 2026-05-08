-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    address TEXT NOT NULL,
    type TEXT CHECK (type IN ('flat', 'house', 'room')) NOT NULL,
    monthly_rent_cents INTEGER NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    lease_start DATE,
    lease_end DATE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    amount_cents INTEGER NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status TEXT DEFAULT 'pending' NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create maintenance_jobs table
CREATE TABLE maintenance_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    contractor_name TEXT,
    contractor_phone TEXT,
    scheduled_date DATE,
    estimated_cost_cents INTEGER,
    actual_cost_cents INTEGER,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    amount_cents INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own properties" ON properties
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tenants" ON tenants
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage payments for their properties" ON payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = payments.property_id
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage maintenance jobs for their properties" ON maintenance_jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = maintenance_jobs.property_id
            AND properties.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage expenses for their properties" ON expenses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = expenses.property_id
            AND properties.user_id = auth.uid()
        )
    );

-- Payment status auto-calculator trigger
CREATE OR REPLACE FUNCTION calculate_payment_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.paid_date IS NOT NULL THEN
        IF NEW.paid_date <= NEW.due_date THEN
            NEW.status := 'paid';
        ELSE
            NEW.status := 'late';
        END IF;
    ELSE
        -- If it's already set to 'late' (e.g. by the cron job), don't overwrite it to 'missed'
        IF NEW.status = 'late' THEN
            -- Keep status as late
            NULL;
        ELSIF NEW.due_date < CURRENT_DATE THEN
            NEW.status := 'missed';
        ELSE
            NEW.status := 'pending';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_payment_status
BEFORE INSERT OR UPDATE OF paid_date, due_date, status ON payments
FOR EACH ROW
EXECUTE FUNCTION calculate_payment_status();
