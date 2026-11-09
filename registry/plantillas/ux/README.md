# Plantillas: ux

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
| `busqueda-y-filtros` | catálogo con búsqueda y filtros por facetas: contadores que se recalculan, chips de filtros activos con "limpiar todo", rango de precio con doble control, orden, vistas guardadas, historial de búsqued | [data-faceta], #chips-activos, #lista, #vistas, window.Cat. |
| `formularios-ux` | formulario de registro en 3 pasos con todas las reglas de UX aplicadas: validación al salir del campo (y en vivo después del primer error), resumen de errores con foco, RUT chileno con dígito verifica | .campo[data-v], [data-paso], #resumen-errores, window.Form. |
| `leyes-ux-interactivas` | guía viva de 8 leyes de UX con una demo medible por cada una (Fitts, Hick, Miller, Doherty, Postel, Gradiente de meta, Von Restorff, Proximidad), cada una con "cuándo aplicarla" y una regla concreta p | .ley[data-ley], #reglas, window.Leyes. |
| `modales-y-confirmaciones` | sistema de diálogos con las reglas de UX aplicadas: modal estándar, confirmación simple, confirmación destructiva (escribir el nombre), deshacer en vez de preguntar, drawer lateral, hoja inferior en m | dialog.dlg, [data-dlg-cerrar], window.Dialogo.abrir/confirmar/destructivo. |
| `onboarding-y-tour` | onboarding en 3 capas: (1) tour con foco sobre elementos reales (spotlight, flechas del teclado, omitir, retomar), (2) checklist de activación con progreso que se marca solo al completar la acción rea | [data-tour="id"], #checklist, window.Tour, window.Checklist, window.Pista. |
| `tabla-de-datos-pro` | tabla de datos completa: búsqueda con resaltado, filtros por chips, orden por columna (aria-sort), selección múltiple con Shift y "seleccionar todo en los N resultados", barra de acciones en lote, den | .dt, [data-col], [aria-sort], .fila-sel, #barra-lote, window.Tabla. |

## Notas de uso

- Cada archivo trae un comentario inicial con cómo aplicarlo y qué conectar (`API.*`, un solo punto por plantilla).
- Los selectores "Demo" de estado se borran al conectar.
- No reutilizar con otro significado clases de base.css (`.app .nav .estado .grid .tabs .estrellas .campo`).

## Dónde lo he usado

-
