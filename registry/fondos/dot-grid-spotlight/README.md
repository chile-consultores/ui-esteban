# Dot Grid Spotlight

Fondo de grilla de puntos que se desplaza lento y se ilumina alrededor del
cursor, con caída suave al salir. Reemplazo propio del `cloud-shader` de
Aceternity, sin dependencias y sin restricción de licencia.

| | |
|---|---|
| **Origen** | **Propio** |
| **Autor** | yo |
| **Guardado el** | 2026-08-28 |
| **Estado** | listo |

## Requisitos

- React
- Tailwind v4 (solo para las clases del contenedor)
- Cero dependencias npm. Canvas 2D a mano

## Props

| Prop | Tipo | Default | Qué hace |
|---|---|---|---|
| `gap` | `number` | `26` | Densidad: px entre centros de puntos. Menos px = más denso |
| `dotSize` | `number` | `1.1` | Radio de cada punto en px, en reposo |
| `color` | `string` | `rgba(148,163,184,0.35)` | Color de los puntos en reposo. Cualquier color CSS, con su propia alfa |
| `glowColor` | `string` | `rgb(226,232,240)` | Color de los puntos encendidos. Se pinta encima del de reposo |
| `speed` | `number` | `12` | Velocidad del desplazamiento en px/s. `0` deja la grilla quieta |
| `angle` | `number` | `32` | Dirección del desplazamiento en grados. `0` = derecha, `90` = abajo |
| `radius` | `number` | `170` | Radio de influencia del cursor en px |
| `activeScale` | `number` | `2.6` | Cuánto crece un punto en el centro del foco, respecto de `dotSize` |
| `interactive` | `boolean` | `true` | `false` = no escucha el puntero, pero la grilla sigue desplazándose |
| `className` | `string?` | — | Va al contenedor. Acá se le da tamaño y color de fondo |
| `children` | `ReactNode?` | — | El contenido. **Tiene que ir en un hijo `relative`** (ver notas) |

## Uso

```tsx
<DotGridSpotlight className="min-h-screen bg-neutral-950">
  <div className="relative flex min-h-screen items-center justify-center">
    <h1 className="text-white">Hola</h1>
  </div>
</DotGridSpotlight>
```

## Notas de uso

- **El contenido va en un hijo `relative`.** El lienzo está en `absolute
  inset-0`; un hijo en flujo normal se pinta *por debajo* de él y los puntos
  encendidos le quedan encima del texto. Un `relative` en el hijo lo arregla.
- **El contenedor necesita alto.** No lo pone el componente: `min-h-screen`,
  `h-full` o lo que corresponda va en `className`. Sin alto el lienzo queda de
  1 px y no se ve nada — no da error.
- **Cómo rinde.** La grilla en reposo no es un bucle sobre miles de puntos: es
  un patrón (`createPattern`) de un tile de `gap × gap` px, así que cada
  fotograma son un `clearRect` y un `fillRect` trasladado. El foco solo recorre
  las celdas dentro del radio, calculadas por índice — con los valores por
  defecto son ~170 puntos por fotograma, no 3.000.
- **Cero `setState` por `mousemove`.** El listener solo guarda `clientX/clientY`
  en un ref; ni React ni el layout se tocan. El `getBoundingClientRect()` se lee
  una vez por fotograma dentro del `rAF`, donde ya no provoca reflow forzado.
  Medido: 120 `mousemove` en 2 s y el contador de renders de React no se movió.
- **Techo de trabajo.** El radio efectivo se limita a `30 × gap` (`MAX_CELDAS =
  3600`). Sin eso, un `gap` chico con un `radius` grande — por ejemplo `gap=5,
  radius=900` — serían decenas de miles de arcos por fotograma. Con `gap` 26 el
  techo son 780 px, muy por encima de lo usable, así que en la práctica no se
  nota.
- **El lienzo lleva su posición en estilo en línea**, no solo en clases. Si
  cayera al flujo normal — Tailwind sin cargar, una clase pisada — su tamaño
  intrínseco empujaría al contenedor, el `ResizeObserver` volvería a medir más
  grande y crecería solo. Con el estilo en línea eso no puede pasar, y de paso
  el componente no depende de que Tailwind esté presente.
- **Fuera de pantalla se detiene.** Un `IntersectionObserver` corta el `rAF`
  cuando el contenedor no está visible.
- **`prefers-reduced-motion: reduce` o puntero grueso (móvil)** → versión
  estática de verdad: no monta el `rAF` ni el listener, pinta la grilla una vez
  y se queda. Se decide antes del primer pintado, así que no hay parpadeo. Si el
  usuario cambia la preferencia del sistema en caliente, el componente se
  reconstruye solo.
- **`gap` se redondea a px de dispositivo.** El tile del patrón tiene que medir
  un entero de píxeles: si no, la repetición deja una costura visible. En una
  pantalla 2× un `gap` de 26 queda en 26 exactos; valores raros pueden quedar a
  medio px del pedido.
- Cero peticiones de red y cero archivos: no depende de ninguna imagen ni
  textura, así que no hay caso de "falta el asset".

## Verificado

Montado en Chromium real y medido, no revisado por captura:

- **Desplazamiento:** 10,17 y 6,36 px/s medidos contra 10,18 y 6,36 esperados
  para `speed=12` a 32°. 60 fps, peor fotograma 16,8 ms.
- **Caída espacial:** la opacidad punto a punto saliendo del cursor da
  0,978 → 0,963 → 0,831 → 0,630 → 0,409 → 0,197 → 0,044 → 0,000, contra la
  `smoothstep` teórica con una desviación máxima de 0,010. Llega a cero justo en
  `radius`, sin canto.
- **Encendido y apagado:** la energía del foco sube +251 % y vuelve a 0,003
  (o sea, cero) al salir el cursor; monótona, con velocidad 0,44 del pico justo
  a mitad del recorrido — sin mesetas.
- **Modo estático:** con `reduced-motion` y con puntero grueso, el lienzo
  comparado consigo mismo 3 s después y tras 40 `mousemove` da 0,0000 % de
  diferencia.
- **`interactive={false}`:** con el cursor encima la energía varía −0,35 %,
  contra +251 % cuando sí escucha.
- **Red:** 0 peticiones externas. **Consola:** 0 errores.
- **Estrés** (`gap=5`, `radius=900`): p95 de fotograma 16,8 ms, con un solo
  fotograma largo (33 ms) en 100.
- **Demo montado aparte:** el contenido queda por encima del lienzo
  (`elementFromPoint` sobre el título devuelve el `h2`, no el `canvas`), los tres
  presets cambian la densidad, y con `Foco: off` el cursor encima mueve la tinta
  −0,7 %.

## Dónde lo he usado

-
