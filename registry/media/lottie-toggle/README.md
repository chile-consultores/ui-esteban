# Lottie Toggle

Botón que reproduce una animación Lottie de ida y vuelta y **se queda** en el
estado final hasta el siguiente clic. Para íconos de menú (hamburguesa → X),
play/pausa, seguir/dejar de seguir.

| | |
|---|---|
| **Origen** | **Propio** |
| **Autor** | yo |
| **Guardado el** | 2026-08-27 |
| **Estado** | listo |

## Requisitos

- React
- `@lottiefiles/dotlottie-react` + el WASM en `public/` — ver el README de
  `lottie`, mismos dos pasos
- Un `.lottie` que sea una transición A → B, **sin loop propio**

## Props

| Prop | Tipo | Default | Qué hace |
|---|---|---|---|
| `src` | `string` | — | Ruta al `.lottie` en `public/` |
| `labelClosed` | `string` | — | Texto accesible cerrado ("Abrir menú") |
| `labelOpen` | `string` | — | Texto accesible abierto ("Cerrar menú") |
| `width` / `height` | `number` | `56` | Respetar la proporción del archivo |
| `speed` | `number` | `1` | Menor = más lento |
| `open` | `boolean` | — | Estado controlado. Si lo pasas, tú mandas |
| `onOpenChange` | `(b) => void` | — | Notifica el cambio |

## Uso

```tsx
// suelto: se maneja solo
<LottieToggle
  src="/lottie/menu.lottie"
  labelClosed="Abrir menú"
  labelOpen="Cerrar menú"
  width={200}
  height={57}
  speed={0.6}
/>

// controlado: compartir estado con el panel que abre
const [abierto, setAbierto] = useState(false);

<LottieToggle ... open={abierto} onOpenChange={setAbierto} />
{abierto && <nav>...</nav>}
```

## Por qué existe

Un `.lottie` con `loop` se reinicia de inmediato, y bajarle la velocidad con
`speed` solo estira el ciclo — **nunca se detiene**. Acá la reproducción va a
mano: `setMode("forward")` al abrir, `setMode("reverse")` al cerrar, con
`loop={false}`, así que la animación termina y se queda.

## Notas de uso

- **Es un `<button>` real**, no un `<canvas>` con `onClick`. Eso resuelve la
  limitación del componente `lottie`: funciona con Tab + Enter/Espacio, toma
  el foco, y anuncia su estado con `aria-expanded`. El canvas va con
  `aria-hidden` y `pointer-events: none` para que no compita por el clic.
- El archivo debe ser una transición A → B. Si el `.lottie` ya trae su propio
  loop interno, el reverse se ve raro.
- Con `prefers-reduced-motion` salta directo al fotograma final, sin animar.
- **Verificado**: tras abrir, el canvas queda 0.00% distinto 3 segundos
  después — congelado de verdad, no un loop lento.

## Dónde lo he usado

-
