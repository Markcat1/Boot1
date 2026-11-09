-- init.sql
-- Create Database Schema with PostGIS and RLS for SafeZMG & Resilience Core

CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Organizations (Tenants)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Citizen', 'FacilityManager', 'Consultant', 'AccreditedThirdParty', 'Admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Facilities (Inmuebles comerciales e industriales)
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    facility_type VARCHAR(100) CHECK (facility_type IN ('PyME', 'Industrial', 'Corporate')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Risk Zones (PostGIS geo-spatial data)
CREATE TABLE risk_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    risk_type VARCHAR(100) NOT NULL CHECK (risk_type IN ('Flood', 'Geological Fault', 'Fire', 'Other')),
    polygon GEOMETRY(Polygon, 4326) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PIPC Logs (Gestión de Programas Internos de Protección Civil)
CREATE TABLE pipc_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID REFERENCES facilities(id) NOT NULL,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    log_type VARCHAR(100) NOT NULL CHECK (log_type IN ('Extinguisher Maintenance', 'Fire System', 'Evacuation Route', 'Brigade Training', 'Other')),
    description TEXT NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Overdue')),
    validated_by UUID REFERENCES users(id), -- Tercero Acreditado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Subscriptions (SaaS Monetization)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) NOT NULL UNIQUE,
    plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('Basic', 'Pro', 'Enterprise')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'PastDue', 'Canceled')),
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row-Level Security (RLS) Implementation
-- Enable RLS on multi-tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipc_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper function to get the current tenant ID from session settings
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS UUID AS $$
BEGIN
    RETURN current_setting('app.current_tenant')::UUID;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- RLS Policies
-- Users can only see and modify users in their own organization
CREATE POLICY tenant_isolation_users ON users
    FOR ALL
    USING (organization_id = current_tenant_id());

-- Facilities can only be seen and modified by their organization
CREATE POLICY tenant_isolation_facilities ON facilities
    FOR ALL
    USING (organization_id = current_tenant_id());

-- PIPC Logs can only be seen and modified by their organization
CREATE POLICY tenant_isolation_pipc_logs ON pipc_logs
    FOR ALL
    USING (organization_id = current_tenant_id());

-- Subscriptions can only be seen and modified by their organization
CREATE POLICY tenant_isolation_subscriptions ON subscriptions
    FOR ALL
    USING (organization_id = current_tenant_id());

-- Note: risk_zones is public (B2C) and doesn't need tenant isolation for reads,
-- but you might want to restrict writes to admins.
