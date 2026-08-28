# Wordmark Collapse

Logo de texto que colapsa a su monograma al hacer scroll: **Chile Consultores
→ CC**. Para el header que se achica al bajar.

| | |
|---|---|
| **Origen** | **Propio** |
| **Autor** | yo |
| **Guardado el** | 2026-08-27 |
| **Estado** | listo |

## Requisitos

- React
- Tailwind v4 (solo para `cn`)
- Cero dependencias npm

## Props

| Prop | Tipo | Default | Qué hace |
|---|---|---|---|
| `words` | `string[]` | `["Chile","Consultores"]` | La inicial de cada una es lo que queda |
| `collapseAfter` | `number` | `80` | Px de scroll para colapsar |
| `collapsed` | `boolean` | — | Estado controlado. Ignora el scroll |
| `overlap` | `number` | `0.18` | Cuánto se montan las iniciales, en em |
| `scale` | `number` | `1.1` | Cuánto crecen al colapsar. `1` = nada |
| `gap` | `number` | `0.28` | Separación normal entre palabras, en em |
| `duration` | `number` | `420` | ms |

## Uso

```tsx
<header className="sticky top-0 z-50">
  <WordmarkCollapse
    words={["Chile", "Consultores"]}
    collapseAfter={80}
    className="text-xl font-semibold tracking-tight text-white"
  />
</header>
```

Sirve para cualquier marca de dos o más palabras: `words={["Cumpli","Tec"]}`
da `CT`.

## Por qué NO es un morph

Un morph real entre "Chile Consultores" y "CC" interpola trazos de letras que
no se corresponden entre sí, y el resultado es una papilla que se retuerce.
Lo que en los sitios buenos parece un morph casi nunca lo es.

Acá es coreografía: el resto de cada palabra se encoge hasta ancho cero
mientras las iniciales —que nunca se fueron— se juntan, se montan y crecen.
Se lee como transformación, y el texto sigue siendo texto real: seleccionable,
traducible, y sin un SVG que mantener.

## Notas de uso

- **Los anchos se miden, no se calculan.** Para animar a cero hay que saber de
  cuánto se parte, y `max-width` en `ch` o en `%` depende de la fuente. Se mide
  el `scrollWidth` real una vez en un `useLayoutEffect`. Si cambias la fuente en
  caliente, hay que re-medir.
- **El scroll pasa por `requestAnimationFrame`.** El evento dispara decenas de
  veces por segundo; hacer `setState` en cada uno es tirón asegurado.
- **El nombre accesible es siempre el completo.** El `aria-label` del contenedor
  dice "Chile Consultores" colapsado o no, y las partes van `aria-hidden`. Sin
  eso, un lector de pantalla anunciaría "C C" al bajar.
- `overlap` entre 0.15 y 0.22 se ve a monograma. Más arriba las letras se
  funden en una mancha; más abajo parece que quedaron pegadas por error.
- Con `prefers-reduced-motion` el cambio es instantáneo, sin transición.
- **Verificado**: 163 px expandido → 24 px colapsado → 163 px al volver arriba,
  con el nombre accesible intacto en los tres momentos.

## Dónde lo he usado

-
