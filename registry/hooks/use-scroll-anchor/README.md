# useScrollAnchor

Que la página no salte al cambiar filtros: la tarjeta que el usuario está mirando se queda en su lugar aunque las de arriba cambien de alto.

| | |
|---|---|
| **Origen** | propio (Mystery Shopper, `lib/sinSaltos.ts`, `useAnclaDeScroll`) |
| **Autor** | yo |
| **Guardado el** | 2026-11-18 |
| **Comando original** | n/a |
| **Estado** | listo |

## Requisitos

- React 18+ / sin deps npm

## API

| Pieza | Qué hace |
|---|---|
| `useScrollAnchor(containerRef, key, options?)` | Al cambiar `key` (p. ej. `JSON.stringify(filtros)`), ancla la tarjeta mirada dentro de `containerRef` y corrige el scroll mientras todo cambia de alto. |
| `options.item` | Selector de las tarjetas anclables. Default `[data-anchor]`. |
| `options.sticky` | Selector de lo pegado arriba (barras sticky). Default `[data-sticky]`. Solo cuenta lo que está pegado en ese momento. |
| `options.topOffset` | Alto fijo de arriba que no es un sticky medible (encabezado `fixed`), en px. Default `0`. |
| `options.maxMs` | Tiempo máximo corrigiendo. Default `6000`. |

## Notas de uso

- Toma la foto de la tarjeta al tocar o teclear (captura de `pointerdown`/`keydown`), **antes** de que React pinte el cambio: si en ese mismo render otra cosa cambia de alto (una barra sticky que crece), medir en el `useLayoutEffect` ya llega tarde.
- Corrige en cada cuadro (`requestAnimationFrame`) y con `ResizeObserver`; lo que cambia fuera de lo observado también se corrige.
- Si `key` cambia dos veces seguidas (filtro y, al llegar los datos, un sub-filtro), sigue con la misma tarjeta y posición (hasta 2 s).
- Mientras corrige apaga `overflow-anchor` del navegador para que no corrijan los dos.
- Se suelta si el scroll cambia por otra cosa: rueda, toque, PageUp/PageDown/Inicio/Fin/espacio fuera de controles, barra de scroll. Nunca hace scroll por su cuenta a otro lugar.
- Cuidado con `scrollIntoView` en controles dentro de la página: también hace scroll vertical y arrastra la página.
- Verificado midiendo cuadros realmente pintados (screencast de CDP): 0 a 1 px. Medir con `getBoundingClientRect` entre tareas da saltos falsos que nunca se pintan.

## Dónde lo he usado

- Mystery Shopper: grilla de gráficos del panel (cliente, región y admin) al cambiar filtros y el banner de «Detalle por banner».
