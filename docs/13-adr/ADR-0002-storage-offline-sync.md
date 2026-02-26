ADR-0002: Offline-first y sincronización por export/import
Estado: Aprobado

Decisión:
- La app web debe funcionar sin internet.
- Los cambios del técnico se guardan en LocalStorage como "offlineQueue".
- La sincronización se hace por exportar e importar un archivo JSON (sin depender de infraestructura).

Formato:
- JSON UTF-8
- Contiene metadata (deviceId, exportedAt, appVersion)
- Contiene items con tipo, entidad, operación, payload, timestamps y hash

Riesgos:
- Conflictos si dos dispositivos cambian el mismo ticket.
Mitigación:
- ETags o version field en entidades
- En import: si version no coincide, marcar conflicto y no aplicar automáticamente