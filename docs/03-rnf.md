RNF base:
RNF-SEC-01 Validación de input obligatoria en endpoints
RNF-SEC-02 Sanitización anti-XSS para textos visibles en UI
RNF-SEC-03 Rate limiting por código en login y creación de solicitudes
RNF-SEC-04 Sesiones con expiración y revocación
RNF-SEC-05 No uso de assets externos (todo en repo)
RNF-PERF-01 Cache de catálogo con TTL (30 min)
RNF-PERF-02 Cache de inventario con TTL (5 min) para vista técnico
RNF-REL-01 Manejo global de errores con contrato ProblemDetails
RNF-OBS-01 Logs estructurados con correlationId por request
RNF-OBS-02 Auditoría inmutable (no editable desde UI)
RNF-MNT-01 OpenAPI siempre actualizado
RNF-TEST-01 1 test mínimo por RF implementado