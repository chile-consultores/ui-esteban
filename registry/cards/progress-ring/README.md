# Progress Ring

Anillo de progreso que se llena al entrar en pantalla.

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
| `value` | `number` | — | Porcentaje final 0-100. Se recorta solo si te pasas |
| `size` | `number` | `190` | Diámetro en px |
| `strokeWidth` | `number` | `14` | Grosor del trazo |
| `duration` | `number` | `1700` | Duración del llenado en ms |
| `delay` | `number` | `0` | Retardo antes de arrancar. Para escalonar varios |
| `from` / `to` | `string` | rosa / violeta | Colores del degradado. `to` también es el glow |
| `glow` | `number` | `10` | Radio del glow en px. `0` lo apaga |
| `children` | `ReactNode` | — | Contenido al centro |
| `label` | `string` | `Progreso: N%` | Texto para lectores de pantalla |
| `trackClassName` | `string` | — | Para pisar el color del riel de fondo |

## Uso

```tsx
import { ProgressRing } from "@/components/ui/progress-ring";

<ProgressRing value={89} size={130} strokeWidth={10} from="#22d3ee" to="#3b82f6">
  <span className="text-3xl font-bold tabular-nums text-white">89%</span>
</ProgressRing>
```

## Cómo funciona

El trazo del círculo se corta con `stroke-dasharray` (el perímetro completo) y
se desplaza con `stroke-dashoffset`. Offset = perímetro → invisible.
Offset = 0 → lleno. Animar esa propiedad "dibuja" el trazo.

## Notas de uso

- **El `<svg>` lleva `overflow-visible` y no es opcional**: el anillo toca justo
  el borde del viewBox, y sin eso el glow se recorta.
- El `id` del degradado sale de `useId()` limpiado de `:` y `«»`, que rompen un
  `url(#...)`. Sin eso, dos anillos en la misma página comparten gradiente y
  salen del mismo color.
- Se dispara al entrar en viewport (IntersectionObserver, threshold 0.3), así
  que en una sección de métricas conviene que esté bajo el fold.
- Respeta `prefers-reduced-motion` vía `motion-reduce:`.

## Dónde lo he usado

-
