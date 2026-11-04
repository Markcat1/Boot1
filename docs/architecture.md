# Arquitectura del Sistema: SafeZMG & Resilience Core

## Diagrama Textual de Arquitectura

El sistema está diseñado para ser altamente escalable y modular, separando responsabilidades en tres capas principales: Frontend, Backend y Base de Datos, orquestado mediante contenedores Docker para facilitar su despliegue.

```text
[ Cliente Web / Móvil ]  (React / Next.js, Tailwind CSS)
    |
    | (Peticiones HTTP/REST, WebSockets para alertas)
    v
[ API Gateway / Load Balancer ] (Nginx / Traefik / AWS ALB)
    |
    |
    v
[ Capa de Aplicación - Backend ] (Python, FastAPI)
    |--- Autenticación y Autorización (JWT)
    |--- Módulo B2C: Mapas, Alertas y Reportes
    |--- Módulo B2B: Gestión PIPC, Dictámenes, Bitácoras
    |--- Módulo Billing: Stripe/PayPal para suscripciones
    |
    | (Queries SQL, Conexiones asíncronas)
    v
[ Capa de Persistencia - Base de Datos ] (PostgreSQL + PostGIS)
    |--- Datos relacionales (Usuarios, Instalaciones, Pagos)
    |--- Datos espaciales (Polígonos de riesgo, geolocalización)
```

## Estructura de Directorios

```text
/
├── backend/                # API REST y lógica de negocio
│   ├── main.py             # Punto de entrada de FastAPI
│   ├── models/             # Modelos ORM (SQLAlchemy)
│   ├── schemas/            # Esquemas de validación (Pydantic)
│   ├── routers/            # Controladores y endpoints
│   ├── services/           # Lógica de integración y procesamiento
│   ├── core/               # Configuración (CORS, BD, seguridad)
│   └── requirements.txt    # Dependencias de Python
├── frontend/               # Interfaz de usuario B2B y B2C
│   ├── src/
│   │   ├── app/            # Rutas de Next.js (App Router)
│   │   │   ├── dashboard/  # B2B: Gestión de PIPC
│   │   │   └── alerts/     # B2C: Mapa y alertas ciudadanas
│   │   ├── components/     # Componentes UI reutilizables
│   │   ├── lib/            # Utilidades y configuración (e.g. Prisma client, utils)
│   │   └── styles/         # Estilos globales de Tailwind
│   ├── package.json        # Dependencias de Node.js
│   └── tailwind.config.ts  # Configuración de estilos
├── database/               # Esquemas y scripts de migración
│   └── init.sql            # Script inicial de creación de BD con PostGIS
├── docs/                   # Documentación técnica y de negocio
│   ├── architecture.md     # Este documento
│   └── go_to_market.md     # Estrategia de lanzamiento y monetización
└── docker-compose.yml      # (Opcional) Orquestación local para desarrollo
```
