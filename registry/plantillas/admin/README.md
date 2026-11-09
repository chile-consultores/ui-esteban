# Plantillas: admin

HTML autocontenido por plantilla. Cada una enlaza `../[base]/base.css` y `../[base]/base.js`.

| | |
|---|---|
| **Origen** | propio |
| **Autor** | yo |
| **Guardado el** | 2026-11-09 |
| **Estado** | listo |

## Requisitos

- Instalar antes `plantillas-base`. Sin dependencias npm ni frameworks.

## Plantillas

| Nombre | Qué hace | Ganchos |
|---|---|---|
| `configuracion-de-empresa` | ajustes de empresa por secciones (Empresa con logo y color en vivo, Notificaciones por evento y canal, Integraciones con claves de API y webhooks, Dominio personalizado con registros DNS). | #s-empresa #s-notificaciones #s-integraciones #s-dominio, [data-ir], window.CONFIG, window.API. |
| `facturacion-y-suscripcion` | panel admin de facturación. | #v-cargando #v-error #v-vacio #v-contenido, #m-plan, #m-tarjeta, #m-cancelar, #facturas, window.API. |
| `registro-de-actividad` | log de auditoría con filtros (usuario, acción, rango de fechas), búsqueda, chips de filtros activos, paginación por cursor ("Cargar más"), fila expandible con diff antes/después y exportación a CSV. | #demo, #q, #usuario, #accion, #desde, #hasta, #chips, #cuerpo, #mas, #exportar. |
| `usuarios-y-roles` | administración de usuarios de una empresa: tabla con búsqueda, filtros, selección múltiple y acciones masivas, invitaciones, rol inline, suspender/reactivar, eliminar con deshacer y matriz de permisos | #demo (estado de la vista), #q, #f-rol, #f-estado, #lista tbody, #masivas, #mInvitar, #matriz. |

## Notas de uso

- Cada archivo trae un comentario inicial con cómo aplicarlo y qué conectar (`API.*`, un solo punto por plantilla).
- Los selectores "Demo" de estado se borran al conectar.
- No reutilizar con otro significado clases de base.css (`.app .nav .estado .grid .tabs .estrellas .campo`).

## Dónde lo he usado

-
