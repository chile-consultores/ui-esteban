# Scroll Deck

Baraja de cartas en 3D que avanza con el scroll. Para secciones de servicios,
pasos de un proceso o features.

| | |
|---|---|
| **Origen** | **Propio** |
| **Autor** | yo |
| **Guardado el** | 2026-08-27 |
| **Comando original** | — |
| **Estado** | listo |

## Requisitos

- React
- Tailwind v4
- `motion` (MIT)

## Props

| Prop | Tipo | Default | Qué hace |
|---|---|---|---|
| `children` | `ReactNode` | — | Cada hijo se vuelve una carta, en orden |
| `heading` | `ReactNode` | — | Encabezado fijo sobre la baraja |
| `vhPerCard` | `number` | `85` | Alto de scroll por carta. Más alto = más lento |
| `perspective` | `number` | `1200` | Profundidad en px. Menos = más exagerado |
| `cardHeight` | `number` | `420` | Alto del área de cartas en px |

## Uso

```tsx
import { ScrollDeck } from "@/components/ui/scroll-deck";

<ScrollDeck heading={<h2>Qué hacemos</h2>}>
  {SERVICIOS.map((s) => (
    <article key={s.id} className="h-full rounded-[28px] border border-white/10 p-9">
      ...
    </article>
  ))}
</ScrollDeck>
```

## Cómo funciona

La sección mide varias pantallas de alto pero su contenido es `sticky`, así que
queda congelado mientras haces scroll. `useScroll` convierte ese recorrido en un
número 0 → 1, y cada carta mapea ese número a su propio translateZ / rotateX /
opacity. La carta *i* queda al frente cuando el progreso llega a `i/(total-1)`.

## Notas de uso

- **Trampa importante**: `useTransform` sobre el progreso del scroll exige que
  el rango de entrada viva dentro de `[0,1]`. Motion lo compila a una animación
  nativa y si te sales tira `Offsets must be in the range [0,1]` y **el árbol de
  React no monta** — pantalla en blanco, no un efecto feo. Por eso el componente
  deriva primero la distancia de cada carta a su turno (`turno`, en unidades de
  carta) y transforma sobre eso, que sí acepta cualquier número.
- Las cartas de atrás llevan desenfoque por profundidad. Sin él, su texto se
  transparenta encima de la del frente y queda un fantasma ilegible.
- El último tramo de la carta que sale es corto a propósito: si tarda mucho en
  irse, se queda grande y borrosa tapando a la que entra.
- Con `prefers-reduced-motion` se cae a una lista vertical normal, sin scroll
  pegado ni transforms.
- Cuidado con el scroll-jacking: 5-6 cartas es el techo razonable antes de que
  la sección se sienta secuestrada.

## Dónde lo he usado

-
