# SegmentedControl

Control segmentado de una sola elección (radiogroup): píldoras con texto y un detalle corto («Optical Center · 212»).

| | |
|---|---|
| **Origen** | propio (Mystery Shopper, `componentes/ControlSegmentado.tsx`, selector de «Detalle por banner») |
| **Autor** | yo |
| **Guardado el** | 2026-11-18 |
| **Comando original** | n/a |
| **Estado** | listo |

## Requisitos

- React 18+ / Tailwind / sin deps npm

## Props

| Prop | Tipo | Default | Qué hace |
|---|---|---|---|
| `label` | `string` | (obligatoria) | Nombre del grupo para lectores de pantalla («Banner»). |
| `options` | `SegmentedOption[]` | (obligatoria) | `{ value, label, detail?, detailLong? }`. `detail` va al lado del texto; `detailLong` es cómo se lee en lector de pantalla («212 visitas»). |
| `value` | `string` | (obligatoria) | Opción elegida. |
| `onChange` | `(value: string) => void` | (obligatoria) | Al elegir otra. |
| `className` | `string` | `""` | Para el contenedor (p. ej. `basis-full sm:basis-auto sm:flex-1` para que en celular baje a su propia fila). |

## Notas de uso

- Patrón radiogroup de la ARIA APG: flechas, Inicio y Fin cambian la elección y mueven el foco; solo la elegida está en el orden de tabulación.
- No se envuelve: con muchas opciones hace scroll horizontal propio. Trae la elegida a la vista **sin mover la página** (no usa `scrollIntoView`, que también hace scroll vertical y desarmaba el ancla de scroll).
- 44 px de alto en pantallas táctiles, 36 px desde `sm`.
- Colores neutral + sky de ejemplo; en Mystery usa los tokens del proyecto (acento). Contraste medido allá: activa 4,7:1 (claro) / 6,5:1 (oscuro).
- Si el cambio de opción cambia contenido, anúncialo aparte con un `aria-live="polite"` («Detalle de Miramas»).

## Dónde lo he usado

- Mystery Shopper: «Detalle por banner» (Optical Center, DEMO Ópticas).
