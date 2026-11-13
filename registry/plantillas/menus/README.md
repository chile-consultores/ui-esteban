# Plantillas: menus

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
| `dropdowns-y-contextuales` | menú de usuario, menú de acciones con atajos, select personalizado con búsqueda, multiselect con chips, menú contextual (clic derecho o pulsación larga) y popover de notificaciones. | .pop, [data-pop], [role=menu], [role=listbox], [role=menuitem], [aria-expanded]. |
| `menus-moviles` | 4 patrones móviles dentro de un teléfono simulado (barra de pestañas inferior con indicador, menú pantalla completa, botón flotante con acciones, hoja inferior arrastrable). | .tabbar, .menu-full, .fab, .hoja, [data-abrir-hoja]. |
| `navbars-superiores` | 6 navbars listas para pegar (transparente a sólida al scrollear, oculta al bajar y aparece al subir, centrada, con buscador, con mega menú, con barra de progreso de lectura). | .nav-X, [data-megabtn], [aria-expanded], .progreso-lectura. |
| `navegacion-secundaria` | migas de pan (con colapso), pestañas con indicador deslizante, pestañas con scroll horizontal, stepper de pasos, paginación con elipsis, índice lateral con scrollspy y volver arriba. | .migas, [role=tablist], .stepper, .pag, .toc, .arriba. |
| `paleta-de-comandos` | paleta de comandos estilo Ctrl+K (búsqueda difusa con resaltado, grupos, recientes, atajos, acciones con parámetro y navegación por teclado). | Ctrl/Cmd+K abre, "/" abre, Escape cierra, ↑ ↓ navegan, Enter ejecuta, Tab sugiere, window.Paleta. |
| `sidebars-laterales` | 4 sidebars (colapsable a iconos con tooltip, acordeón con submenús, rail con flyout, drawer móvil con overlay) y selector de variante. | .sb, [data-sb], .sb-item[aria-current], .sb[data-colapsado], window.SB.activar(id). |
| `iconos-de-menu` | los 12 iconos de menú (hamburguesa, döner, hotdog, fries, escalera, torta, kebab, albóndigas, bento, chocolate, oreo, vegetariana) funcionando, cuándo usar cada uno y 4 animaciones de hamburguesa a X. | .im-btn[data-pop], .im-pop, .hx[data-anim], window.IconosMenu. |
| `tipos-de-desplegables` | 4 usos de un desplegable: mando, navegación (mega menú y anidado), acción (estilo Drive con submenús) y preferencias (idioma, tema, color). | .dm-btn[aria-controls], .dm-menu, .dm-sub, .nav-dd, window.Desplegables. |

## Notas de uso

- Cada archivo trae un comentario inicial con cómo aplicarlo y qué conectar (`API.*`, un solo punto por plantilla).
- Los selectores "Demo" de estado se borran al conectar.
- No reutilizar con otro significado clases de base.css (`.app .nav .estado .grid .tabs .estrellas .campo`).

## Dónde lo he usado

-
