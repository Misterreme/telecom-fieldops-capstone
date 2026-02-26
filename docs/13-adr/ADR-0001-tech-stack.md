ADR-0001: Tech stack y persistencia
Estado: Propuesto (se decide en clase)

Contexto:
Se requiere web app hosted, offline-first, API first, seguridad por código, tests.

Opciones:
A) Frontend-only: LocalStorage + export/import JSON, sin backend real.
B) Frontend + API serverless: endpoints esenciales y persistencia ligera.
C) Frontend + API local dev + hosting limitado (no recomendado por tiempo).

Decisión:
Cada equipo decide, pero debe justificar con trade-offs:
- complejidad vs alcance
- seguridad real vs simulada
- persistencia consistente vs velocidad

Datos iniciales:
- Sucursales: principal + 2 sucursales
- Catálogo: 5 planes, 8 productos
- Inventario: cantidades por sucursal