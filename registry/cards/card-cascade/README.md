# Card Cascade

Entrada escalonada: las tarjetas aparecen una tras otra al entrar en pantalla.
Para listas de movimientos, notificaciones, resultados de búsqueda o cualquier
feed que se sienta muerto si aparece de golpe.

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
- Cero dependencias npm

## Props

| Prop | Tipo | Default | Qué hace |
|---|---|---|---|
| `children` | `ReactNode` | — | Cada hijo entra por separado, en orden |
| `stagger` | `number` | `90` | Milisegundos entre una tarjeta y la siguiente |
| `duration` | `number` | `520` | Duración de la entrada de cada tarjeta |
| `offset` | `number` | `18` | Cuánto se desplaza antes de asentarse, en px |
| `from` | `"abajo" \| "arriba" \| "izquierda" \| "derecha"` | `"abajo"` | Desde dónde entran |
| `scale` | `number` | `0.97` | Arrancan un poco más chicas. `1` lo desactiva |
| `once` | `boolean` | `true` | `false` = re-anima cada vez que entra en pantalla |
| `className` | `string` | — | Contenedor. Acá va el layout: `flex`, `gap`, etc. |

## Uso

```tsx
import { CardCascade } from "@/components/ui/card-cascade";

<CardCascade className="w-full max-w-md">
  {movimientos.map((m) => (
    <article key={m.id} className="rounded-2xl border border-white/10 p-4">
      ...
    </article>
  ))}
</CardCascade>
```

El componente no opina sobre cómo se ven las tarjetas: solo las anima. El
layout (dirección, separación, ancho) va en `className`; el diseño de cada
tarjeta, en los hijos.

## Cómo funciona

Cada hijo se envuelve en un `div` con su propio `transition-delay` calculado
como `indice * stagger`. El escalonado sale del CSS, no de temporizadores en
JavaScript: un solo `IntersectionObserver` cambia un booleano y el navegador
reparte los retrasos. Menos código y sin timers que limpiar.

## Notas de uso

- **Con `stagger` alto y muchas tarjetas la última tarda una eternidad.** El
  total es `stagger * (n-1) + duration`. Con el default y 5 tarjetas son
  ~880 ms, que se siente bien. Con 20 tarjetas serían 2.3 s y el usuario ya
  hizo scroll. Sobre ~8 elementos, baja el `stagger` a 40-50.
- `threshold: 0.15` — se dispara cuando se ve un 15% del contenedor. Si tu lista
  es más alta que la pantalla, considera envolver grupos más chicos.
- Lleva `willChange` solo mientras la tarjeta está oculta, y lo suelta al
  asentarse. Dejarlo permanente mantiene una capa de composición por tarjeta
  y sale caro en listas largas.
- Con `prefers-reduced-motion` las tarjetas aparecen de una, sin desplazamiento
  ni retraso.
- **De dónde salió**: imitando la cascada del Lottie `transaction-cards`, que
  pesaba 783 KB porque eran seis JPEG horneados y no permitía cambiar los datos.
  Esto pesa ~2 KB y recibe los datos como children.

## Dónde lo he usado

-
