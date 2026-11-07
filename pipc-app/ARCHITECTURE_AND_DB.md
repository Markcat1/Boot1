# Arquitectura y Diseño de Base de Datos - PIPC App

## 1. Arquitectura General

El sistema está diseñado como una aplicación web modular basada en una arquitectura cliente-servidor:

*   **Frontend (Cliente):** SPA (Single Page Application) desarrollada con React y TypeScript, estructurada por componentes (módulos).
*   **Backend (Servidor):** API RESTful desarrollada con Python y FastAPI.
*   **Base de Datos:** Relacional (SQLAlchemy ORM + SQLite/PostgreSQL), debido a la naturaleza estructurada y relacional de los datos requeridos por la normativa.

### Justificación Técnica - Ley de Protección Civil del Estado de Jalisco
La arquitectura desacoplada permite escalar módulos individuales en el futuro (ej. añadir un módulo de GIS para riesgos hidrometeorológicos) y facilita la integración con posibles servicios web gubernamentales si fuera necesario.

## 2. Estructura de la Base de Datos

La base de datos sigue un modelo relacional para garantizar la integridad de los datos de un PIPC (Programa Interno de Protección Civil).

### Modelos Principales:

*   **Inmueble (GeneralData):** Almacena datos del establecimiento, municipio (ZMG), giro comercial, y afluencia.
    *   *Justificación normada:* El cálculo de afluencia (fija + flotante) y el giro determinan si el inmueble es de riesgo bajo, medio o alto, dictando la obligatoriedad y el alcance del PIPC.
*   **Riesgo (Risk):** Almacena los riesgos identificados (internos y externos).
    *   *Campos:* tipo (interno/externo), categoría (eléctrico, químico, hidrometeorológico), probabilidad (1-5), impacto (1-5).
*   **Equipamiento (Equipment):** Inventario de equipos de seguridad.
    *   *Campos:* tipo (extintor, alarma, señalización), especificación (tipo A, B, C, K según NOM-002-STPS y señalización según NOM-003-SEGOB), ubicación, fecha de mantenimiento.
*   **Brigadista (BrigadeMember):** Integrantes de las brigadas de emergencia.
    *   *Campos:* nombre, brigada asignada (Primeros Auxilios, Evacuación, etc.), estatus de capacitación.
*   **Evento (CalendarEvent):** Mantenimientos y simulacros.
    *   *Justificación normada:* Los municipios de la ZMG exigen una frecuencia mínima de simulacros anuales.

## 3. Módulos del Sistema

1.  **GeneralDataModule:** Captura básica y cálculo automático de obligatoriedad/riesgo.
2.  **RiskAnalysisModule:** Matriz de probabilidad x impacto, con ponderaciones técnicas estándar.
3.  **InventoryModule:** Gestión de recursos materiales y humanos (brigadas).
4.  **CalendarModule:** Programación de actividades obligatorias preventivas.
5.  **ExportModule:** Agregación de datos en una memoria descriptiva estructurada para cumplir con los formatos requeridos por las dependencias de Protección Civil.