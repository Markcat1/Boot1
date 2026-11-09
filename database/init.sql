-- Enable PostGIS for geospatial analysis (Risk zones, facilities)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Tenants (Organizations/Companies)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (Citizens, Admins, Consultants, Third Parties)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id), -- Nullable for citizens/admins of system
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'CITIZEN', 'ADMIN', 'CONSULTANT', 'THIRD_PARTY'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Facilities (Inmuebles - B2B PIPC)
CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    location GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Risk Zones (Zonas de Riesgo ZMG - B2C/Social)
CREATE TABLE IF NOT EXISTS risk_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    risk_type VARCHAR(100) NOT NULL, -- 'FLOOD', 'FAULT_LINE', etc.
    polygon GEOMETRY(Polygon, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PIPC Logs (Bitácoras - B2B PIPC)
CREATE TABLE IF NOT EXISTS pipc_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID REFERENCES facilities(id) NOT NULL,
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    log_type VARCHAR(100) NOT NULL, -- 'EXTINGUISHER', 'EVACUATION_ROUTE', etc.
    status VARCHAR(50) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Subscriptions (SaaS B2B)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    plan_tier VARCHAR(50) NOT NULL, -- 'PYME', 'INDUSTRIAL', 'CORPORATE'
    status VARCHAR(50) NOT NULL, -- 'ACTIVE', 'INACTIVE'
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) FOR MULTI-TENANCY
-- ==========================================

-- Enable RLS on multi-tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipc_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Note: RLS logic here relies on setting a current setting `app.current_tenant_id`
-- from the application layer before executing queries on these tables.
-- Alternatively, roles could be used, but session variables are common in connection pools.

-- Policy for users table
CREATE POLICY tenant_isolation_users ON users
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID OR role = 'CITIZEN' OR role = 'ADMIN');

-- Policy for facilities table
CREATE POLICY tenant_isolation_facilities ON facilities
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Policy for pipc_logs table
CREATE POLICY tenant_isolation_pipc_logs ON pipc_logs
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Policy for subscriptions table
CREATE POLICY tenant_isolation_subscriptions ON subscriptions
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
