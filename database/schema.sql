-- Enable PostGIS extension for spatial analysis
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- e.g., 'citizen', 'admin', 'b2b_user'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table (B2B SaaS)
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan_tier VARCHAR(50) NOT NULL, -- e.g., 'freemium', 'pyme', 'industrial', 'corporativo'
    status VARCHAR(50) NOT NULL, -- e.g., 'active', 'expired'
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Facilities table (PIPC - B2B)
CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location GEOMETRY(Point, 4326), -- PostGIS Point
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PIPC Documents table
CREATE TABLE pipc_documents (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id),
    document_type VARCHAR(100) NOT NULL, -- e.g., 'dictamen', 'bitacora', 'inventario'
    file_url TEXT NOT NULL,
    expiration_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk Zones table (Vulnerability mapping - B2C)
CREATE TABLE risk_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    risk_type VARCHAR(100) NOT NULL, -- e.g., 'inundacion', 'falla_geologica'
    polygon GEOMETRY(Polygon, 4326), -- PostGIS Polygon
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Incidents table (Community reports)
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    reporter_id INTEGER REFERENCES users(id),
    incident_type VARCHAR(100) NOT NULL,
    description TEXT,
    location GEOMETRY(Point, 4326),
    status VARCHAR(50) DEFAULT 'reported',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
