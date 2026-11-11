# Menu Button

Botón que abre una lista corta de acciones («Exportar»: Excel, PDF; «Más»: Editar, Quitar). Deja una sola acción a la vista.

| | |
|---|---|
| **Origen** | propio (Mystery Shopper, `MenuBoton.tsx`) |
| **Autor** | yo |
| **Guardado el** | 2026-11-11 |
| **Comando original** | n/a |
| **Estado** | listo |

## Requisitos

- React 18+ / Tailwind v4 / sin deps npm

## Props

| Prop | Tipo | Default | Qué hace |
|---|---|---|---|
| `label` | `ReactNode` | | Texto del botón; se le agrega «▾». |
| `options` | `MenuOption[]` | | `{ label, detail?, onSelect, disabled? }`. Sin opciones el componente no se dibuja. |
| `className` | `string` | botón con borde neutro | Clases del botón (para usar el estilo del proyecto). |
| `disabled` | `boolean` | `false` | Deshabilita el botón. |
| `align` | `"left" \| "right"` | `"left"` | Hacia dónde se abre la lista. `right` para botones pegados al borde derecho. |

## Notas de uso

- Se cierra al elegir, con Escape (el foco vuelve al botón) o con un clic afuera.
- Para acciones peligrosas («Quitar»), la confirmación la pone quien llama en `onSelect`.
- Las opciones se pueden armar condicionalmente: `...(cond ? [{...}] : [])`.

## Dónde lo he usado

- Mystery Shopper: Exportar y Más en Resultados, paneles, lista de paneles, Formularios; menú «Más» de cada gráfico y de cada pregunta del editor.
