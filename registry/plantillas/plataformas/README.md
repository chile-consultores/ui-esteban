# Plantillas: plataformas

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
| `base-de-conocimiento` | centro de ayuda público con búsqueda (resaltado y atajo "/"), categorías, populares, artículo con tabla de contenido que sigue el scroll, voto "¿Te sirvió?" y relacionados. | #kb-main, #kb-q, rutas #/, #/categoria/slug, #/articulo/slug. |
| `panel-de-metricas` | panel con periodo (7, 30, 90 días) y comparación con el periodo anterior, 4 KPIs con delta, líneas SVG con tooltip por teclado y mouse, barras por gerencia, dona, heatmap semana por hora y exportar CS | #pm-linea, #pm-kpis, #pm-barras, #pm-dona, #pm-calor, #pm-csv, #pm-demo (selector solo para demo). |
| `portal-de-cliente` | portal donde una empresa cliente ve sus estudios (Clima, Mystery) con estado y avance, descarga informes, paga facturas y pide soporte. | #pc-estados, #pc-estudios, #pc-facturas, #pc-form, #pc-soporte, #pc-demo (selector solo para demo, bórralo en producción). |
| `precios-comparador` | página pública de precios con 3 planes, selector mensual/anual con ahorro calculado, tabla comparativa, plan recomendado, FAQ y CTA a ?plan=x. | #pr-planes, #pr-tabla, input[name=ciclo], PLANES.iva, PLANES.mesesGratis. |

## Notas de uso

- Cada archivo trae un comentario inicial con cómo aplicarlo y qué conectar (`API.*`, un solo punto por plantilla).
- Los selectores "Demo" de estado se borran al conectar.
- No reutilizar con otro significado clases de base.css (`.app .nav .estado .grid .tabs .estrellas .campo`).

## Dónde lo he usado

-
