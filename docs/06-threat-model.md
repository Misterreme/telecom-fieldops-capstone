Threat Model (mini)
Activos:
- PII de clientes
- credenciales y sesiones
- inventario y reservas
- auditoría y logs

Amenazas (mínimo 3):
TM-01 XSS en notas/comentarios
TM-02 SQL injection o query injection 
TM-03 DoS por abuso de endpoints (login, crear work-order)
TM-04 Upload de archivos corruptos/maliciosos 
TM-05 MITM (mitigación parcial desde código)

Mitigaciones requeridas (por código):
- validación de inputs (schema)
- sanitización de salida/entrada para campos de texto
- rate limiting a nivel de middleware
- queries parametrizadas
- validación de archivos (tipo, tamaño, firma)
- no exponer secretos en logs
- sesiones con expiración y revocación
Riesgo residual:
- DDoS real depende de infraestructura; se documenta como fuera de alcance.