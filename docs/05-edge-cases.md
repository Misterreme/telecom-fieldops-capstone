Edge cases mínimos:
EC-01 dos usuarios reservan el mismo equipo al mismo tiempo -> 409
EC-02 solicitud cambia a COMPLETED sin pasar por estados requeridos -> 409
EC-03 técnico offline cierra orden, pero en server está CANCELLED -> conflicto
EC-04 usuario bloqueado intenta operar -> 403
EC-05 token expirado -> 401
EC-06 notas con script -> se neutraliza y no ejecuta
EC-07 import JSON con schema inválido -> 400 con detalle
EC-08 catálogo cacheado expiró -> refresh obligatorio