# Image Callouts

Imagen anotada: puntos sobre la foto, líneas guía que salen de ellos y
etiquetas al final de cada línea, entrando en secuencia. Para explicar una
captura de pantalla, un producto o un plano.

| | |
|---|---|
| **Origen** | **Propio** |
| **Autor** | yo |
| **Guardado el** | 2026-08-27 |
| **Estado** | listo |

## Requisitos

- React
- Tailwind v4
- Cero dependencias npm

## Props

| Prop | Tipo | Default | Qué hace |
|---|---|---|---|
| `src` | `string` | — | Imagen de fondo. Ruta local |
| `alt` | `string` | — | Descripción para lectores de pantalla |
| `callouts` | `Callout[]` | — | Las anotaciones |
| `stagger` | `number` | `420` | ms entre un callout y el siguiente |
| `accent` | `string` | `#e11d48` | Color por defecto de puntos y líneas |
| `once` | `boolean` | `true` | `false` = re-anima al volver a pantalla |

### Callout

| Campo | Tipo | Qué hace |
|---|---|---|
| `x`, `y` | `number` | Punto marcado, en % del contenedor (0-100) |
| `labelX`, `labelY` | `number` | Dónde se posa la etiqueta, en % |
| `title` | `string` | |
| `detail` | `string?` | Segunda línea, opcional |
| `color` | `string?` | Pisa el `accent` para este callout |
| `align` | `"izquierda" \| "derecha"?` | Hacia dónde crece la caja desde `labelX` |

## Uso

```tsx
<ImageCallouts
  src="/capturas/panel.png"
  alt="Panel de resumen mensual"
  callouts={[
    { x: 28, y: 26, labelX: 33, labelY: 42, align: "derecha",
      title: "KPIs del mes", detail: "Cada uno con su variación" },
  ]}
/>
```

## La secuencia

Cada callout entra en tres tiempos, y los callouts entre sí van escalonados:

| | Cuándo | Qué |
|---|---|---|
| 1 | `i × stagger` | El punto aparece y escala |
| 2 | `+140 ms` | La línea se dibuja de punta a punta |
| 3 | `+380 ms` | La etiqueta entra |

Medido en navegador: a los 300 ms el punto está completo y la línea recién va
por la mitad; a los 500 ms la línea terminó y la caja va en 0.48.

## Notas de uso

- **Las coordenadas van en porcentaje**, así que la anotación sigue a la imagen
  cuando el contenedor cambia de tamaño. No uses px.
- **El SVG trabaja en píxeles reales, medidos con un `ResizeObserver`** — no
  con un `viewBox` 0-100 estirado por `preserveAspectRatio="none"`. La primera
  versión hacía eso y las líneas salían **a trozos**: con `non-scaling-stroke`
  el `stroke-dasharray` se mide en píxeles de pantalla mientras `pathLength`
  normaliza en unidades del path, las dos escalas se pelean y el trazo se
  rompe. De paso, estirar el viewBox deformaba las diagonales.
- **El largo del trazo se calcula, no se mide.** Son dos segmentos y se conocen
  los tres puntos, así que `hypot()` + una resta dan el largo exacto para el
  `stroke-dasharray`. Sin `getTotalLength()`, sin ref al path.
- **Cuidado con `strokeWidth` + `non-scaling-stroke`**: el grosor pasa a estar
  en píxeles de pantalla. Un `0.35` ahí es medio píxel y el antialiasing se
  come la línea.
- **`align` no es opcional en la práctica.** Sin él, el lado de la caja se
  deduce de si la etiqueta quedó a la derecha o izquierda del punto — y eso
  falla cuando la quieres justo debajo o encima. Pásalo siempre.
- **Colocar las etiquetas es el 80% del trabajo.** Ponlas sobre zonas de poca
  información (fondos planos, márgenes, huecos) y cerca de su punto: las líneas
  largas cruzando la imagen se ven mal. Si dos etiquetas comparten `labelY`, se
  tapan — sepáralas.
- El punto lleva un halo con `animate-ping`. En una imagen con 6+ callouts eso
  son 6 animaciones infinitas: considera bajarlo.
- Con `prefers-reduced-motion` todo aparece de una, sin secuencia.

## Dónde lo he usado

-
