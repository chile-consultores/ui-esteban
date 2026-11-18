# useStableHeight

Mientras carga, el bloque mantiene su último alto (nada se colapsa ni salta); al llegar los datos pasa al alto real con una transición corta.

| | |
|---|---|
| **Origen** | propio (Mystery Shopper, `lib/sinSaltos.ts`, `useAltoEstable`) |
| **Autor** | yo |
| **Guardado el** | 2026-11-18 |
| **Comando original** | n/a |
| **Estado** | listo |

## Requisitos

- React 18+ / sin deps npm

## API

| Pieza | Qué hace |
|---|---|
| `useStableHeight(ref, loading, durationMs = 200)` | Con `loading` en true fija `min-height` al alto medido; al pasar a false anima `height` del alto anterior al real. |

## Notas de uso

- Sin transición con `prefers-reduced-motion: reduce`.
- En un hijo `flex-1` de una columna flex, `height` no se respeta (manda `flex-basis`): el hook pone `flex: none` mientras dura la transición y luego lo devuelve.
- Pensado para el patrón «caché primero»: el contenido viejo sigue a la vista (atenuado, `aria-busy`) mientras llega el nuevo; no vuelvas al skeleton.
- Se combina con `useScrollAnchor` para que la página tampoco salte.

## Dónde lo he usado

- Mystery Shopper: cuerpo de cada tarjeta de gráfico del panel.
