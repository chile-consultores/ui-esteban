# Plantillas: crm

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
| `ficha-de-cliente` | vista 360 de un cliente con cabecera y acciones (llamar, correo, agendar), pestañas Resumen (KPIs, próximos pasos, datos editables inline), Contactos, Actividad (filtro por tipo, nota rápida con Ctrl+ | #demo (estado), #form-datos, #nota, #filtro-tipo, #archivo, #dlg-contacto, #dlg-agenda. |
| `leads-y-seguimiento` | lista de leads con resumen (abiertos, valor en pipeline, tasa de cierre), búsqueda, filtros, orden, vencidos con texto, alta con validación (+56 9), cambio de etapa con línea de tiempo automática, mot | #demo (estado), #q, #f-etapa, #f-resp, #f-origen, #orden, #dlg-nuevo, #dlg-motivo, #dr. |

## Notas de uso

- Cada archivo trae un comentario inicial con cómo aplicarlo y qué conectar (`API.*`, un solo punto por plantilla).
- Los selectores "Demo" de estado se borran al conectar.
- No reutilizar con otro significado clases de base.css (`.app .nav .estado .grid .tabs .estrellas .campo`).

## Dónde lo he usado

-
