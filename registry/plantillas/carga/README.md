# Plantillas: carga

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
| `barras-progreso` | 10 patrones de progreso (lineal, indeterminada, buffer, NProgress superior, circular, gauge, pasos, multi-segmento, subida con velocidad y ETA, contador animado). | [role=progressbar], window.NP.start/set/inc/done (barra superior), .anillo[data-valor], .subida (tarjeta de archivo). |
| `carga-imagenes` | 7 técnicas de carga de imágenes (lazy con IntersectionObserver, blur-up LQIP, color dominante, fallback con reintento, masonry, carga por franjas, avatar con iniciales) con medidor de CLS en vivo. | .img[data-src], .img.cargada, .img.error, #latencia, #fallos, window.IMG.cargar(el). |
| `carga-optimista-subidas` | UI optimista con rollback, subida de archivos multiple (drag and drop, progreso, cancelar, reintentar), autoguardado con estado y eliminar con deshacer. | [data-fav], .tarea, #zona-drop, .archivo, #estado-guardado, window.API.config(latenciaMs, fallaPct). |
| `estados-vacio-error-offline` | 14 estados de interfaz listos para copiar (vacío primera vez, vacío por filtros, sin resultados, error de red con backoff, sin permiso, 404, 500, offline con cola, mantenimiento, cuota, error parcial, | .est (contenedor), [data-estado] (botones del menú), #banner-offline, window.EST.mostrar(id). |
| `preloaders-pantalla-completa` | 8 pantallas de carga inicial (splash) a pantalla completa, con salida animada que revela la página. | #pre (overlay), .pre[data-tipo], PRE.duracion (ms), PRE.umbral (ms), botón [data-ver]. |
| `scroll-infinito-paginacion` | 6 patrones para listas largas: scroll infinito con sentinel, botón "Cargar más", paginación con prefetch, lista virtualizada (10.000 filas), pull-to-refresh y aviso de nuevos elementos. | #lista-inf (contenedor con scroll), #centinela, #btn-mas, #tabla-pag, #virt, #pull, #pastilla-nuevos, funciones cargarMas()/irPagina(n)/refr |
| `skeletons-lab` | Laboratorio de skeletons (8 patrones de carga con transición suave a contenido real, sin saltos de layout). | [data-anim] en <body> (shimmer/pulso/onda), --vel (duración), .sk (bloque), .caja[data-demo], botones [data-simular]. |
| `spinners-y-loaders` | Galería de 36 loaders solo CSS (más 3 hechos con SVG) y 10 estados de botón en carga. | .ld (contenedor), [data-tam] en la galería, .bt[data-estado] (botones), role="status" con texto sr-only en cada loader. |
| `transiciones-de-pagina` | router de hash con 8 transiciones entre vistas (fundido, deslizar, apilar, zoom, cortina, difuminar, elevar, ninguna) y barra de progreso superior. | [data-vista], [data-ir] (enlaces internos), body[data-trans], window.NAV.ir(nombre), evento `vista:lista`. |

## Notas de uso

- Cada archivo trae un comentario inicial con cómo aplicarlo y qué conectar (`API.*`, un solo punto por plantilla).
- Los selectores "Demo" de estado se borran al conectar.
- No reutilizar con otro significado clases de base.css (`.app .nav .estado .grid .tabs .estrellas .campo`).

## Dónde lo he usado

-
