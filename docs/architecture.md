# SafeZMG & Resilience Core - Architecture

## System Overview
SafeZMG is a modular application designed to address critical civil protection vulnerabilities. It consists of a React/Next.js frontend, a FastAPI Python backend, and a PostgreSQL/PostGIS database.

## Directory Structure
- `/backend`: Contains the FastAPI application, endpoints for risk calculation, facility registration, and B2B subscription logic.
- `/frontend`: Contains the Next.js/React application with Tailwind CSS, optimized for low data consumption on mobile and robust B2B dashboard interfaces.
- `/database`: Contains SQL schema scripts, specifically leveraging PostGIS for spatial analysis (polygons, risk zones).
- `/docs`: Contains documentation on architecture and business strategies.

## Technology Stack
- **Frontend:** React / Next.js, Tailwind CSS. Chosen for its performance, SEO capabilities (if needed), and rapid component-based UI development.
- **Backend:** Python / FastAPI. Chosen for high performance as well as ease of integration with spatial data processing and ML/AI risk models in the future.
- **Database:** PostgreSQL + PostGIS. Essential for mapping risk zones, incidents, and facilities spatially.
- **Infrastructure:** Designed to be containerized with Docker for deployment on cloud providers like AWS or Render.

## Key Modules
1. **Vulnerability Mapping & Community Alert (B2C):** Uses spatial queries to warn users in affected polygons.
2. **PIPC Management (B2B):** Handles document lifecycles, expiration dates, and compliance reporting.
3. **Monetization & Billing:** Manages tiered subscriptions and marketplace interactions.
