-- Enable PostGIS extension for spatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table (B2B and B2C users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'citizen', -- 'citizen', 'admin', 'consultant', 'company'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Facilities Table (B2B: Inmuebles for PIPC)
CREATE TABLE IF NOT EXISTS facilities (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    location GEOMETRY(Point, 4326), -- PostGIS point (longitude, latitude)
    facility_type VARCHAR(100), -- 'industrial', 'commercial', 'office'
    risk_level VARCHAR(50), -- 'low', 'medium', 'high'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Risk Zones Table (B2C/B2B: Polígonos de riesgo)
CREATE TABLE IF NOT EXISTS risk_zones (
    id SERIAL PRIMARY KEY,
    zone_name VARCHAR(255) NOT NULL,
    zone_type VARCHAR(100) NOT NULL, -- 'flood', 'landslide', 'fault_line'
    polygon GEOMETRY(Polygon, 4326), -- PostGIS polygon defining the risk area
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Incidents Table (B2C: Reportes ciudadanos y sensores)
CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    reporter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    incident_type VARCHAR(100) NOT NULL, -- 'flood', 'fire', 'accident'
    description TEXT,
    location GEOMETRY(Point, 4326),
    status VARCHAR(50) DEFAULT 'reported', -- 'reported', 'investigating', 'resolved'
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PIPC Documents Table (B2B: Documentos de cumplimiento)
CREATE TABLE IF NOT EXISTS pipc_documents (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'risk_assessment', 'brigade_log', 'evacuation_plan'
    document_url TEXT NOT NULL, -- URL to S3 or local storage
    expiration_date DATE,
    status VARCHAR(50) DEFAULT 'valid', -- 'valid', 'expired', 'pending_review'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Subscriptions Table (B2B: Pagos y facturación)
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL, -- 'freemium', 'pyme', 'corporate'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'canceled', 'past_due'
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial Indexes for fast geographic queries
CREATE INDEX IF NOT EXISTS idx_facilities_location ON facilities USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_risk_zones_polygon ON risk_zones USING GIST (polygon);
CREATE INDEX IF NOT EXISTS idx_incidents_location ON incidents USING GIST (location);
