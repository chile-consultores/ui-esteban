# Plantillas: reglas

Guías vivas de UI, UX, proceso de diseño y color. HTML autocontenido por plantilla. Cada una enlaza `../[base]/base.css` y `../[base]/base.js`.

| | |
|---|---|
| **Origen** | propio (skills ux-*, accesibilidad-web y performance-frontend, más NN/g, Laws of UX, W3C, web.dev) |
| **Autor** | yo |
| **Guardado el** | 2026-11-13 |
| **Estado** | listo |

## Requisitos

- Instalar antes `plantillas-base`. Sin dependencias npm ni frameworks.

## Plantillas

| Nombre | Qué hace | Ganchos |
|---|---|---|
| `reglas-ui` | reglas visuales con ejemplo bien y mal, buscador, filtros por tema y checklist antes de publicar. | .rg[data-sec], #buscar, #filtros, #checklist, window.ReglasUI. |
| `reglas-ux` | heurísticas de Nielsen, leyes de UX, estados, errores, formularios, archivos, modales, tablas, WCAG 2.2, Core Web Vitals, demo del botón positivo/negativo y checklist. | REGLAS, CHECKLIST, CAMPOS, section.fija, window.ReglasUX. |
| `proceso-de-diseno` | card sorting interactivo, herramientas de Optimal Workshop, wireframe y sus 3 fidelidades, wireflow donde cada acción tiene resultado. | TARJETAS, GRUPOS, FID, PANTALLAS, ACCIONES, window.Proceso. |
| `paletas-de-color` | 7 paletas en claro y oscuro con vista previa, contraste WCAG en vivo y copiar tokens CSS. | PALETAS, tokens(), contraste(), window.Paletas. |

## Notas de uso

- Las reglas se editan en los arreglos del script (o en los `<article>` en reglas-ui).
- Los checklists se recuerdan solo en ese navegador (localStorage con try/catch).
- Los enlaces "Ver en plantilla" apuntan a `../[carpeta]/archivo.html`: funcionan con la estructura de `public/plantillas/`.
- Reglas nuevas desde internet: anotar fuente, si choca con una regla actual y en qué skill `ux-*` iría.

## Dónde lo he usado

-
