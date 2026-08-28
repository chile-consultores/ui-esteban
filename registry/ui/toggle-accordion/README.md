# Toggle Accordion

Acordeón de una sola tarjeta abierta a la vez: el panel crece, el texto entra
tarde y se va temprano, y el chevron se releva en vez de girar. Rehecho en
código a partir del timeline de un template de SVGator.

| | |
|---|---|
| **Origen** | **Propio**, movimiento calcado de "Dropdown menu - animated text with toggle effect" (SVGator) |
| **Autor** | yo |
| **Guardado el** | 2026-08-28 |
| **Estado** | listo |

El archivo de SVGator **no** está en el repo: trae la tipografía servida desde
`fonts.gstatic.com`, el texto horneado y marca de agua. De ahí salieron solo los
tiempos, que están en la tabla de abajo.

## Requisitos

- React 19 (usa el atributo `inert`, que React soporta como booleano desde la 19)
- Tailwind v4
- Cero dependencias npm. El chevron es un `<svg>` inline y se puede reemplazar por prop

## Props

| Prop | Tipo | Default | Qué hace |
|---|---|---|---|
| `items` | `AccordionItem[]` | — | Los items |
| `defaultOpen` | `number \| null` | `null` | Índice abierto al montar. Solo en modo no controlado |
| `open` | `number \| null` | — | Modo controlado: el índice abierto |
| `onOpenChange` | `(i: number \| null) => void` | — | Avisa el nuevo índice, o `null` si se cerró |
| `collapsible` | `boolean` | `true` | `false` = clic sobre el abierto no lo cierra |
| `duration` | `number` | `300` | Duración del gesto en ms. Los tiempos internos son proporciones de este valor |
| `easing` | `string` | `cubic-bezier(.22,1,.36,1)` | Curva. El original trae `cubic-bezier(.42,0,1,1)` |
| `slide` | `number` | `27` | Cuánto sube el contenido al entrar, en px |
| `iconOpen` | `ReactNode?` | chevron ↑ | Icono del estado abierto |
| `iconClosed` | `ReactNode?` | chevron ↓ | Icono del estado cerrado |
| `className` | `string?` | — | Contenedor |
| `itemClassName` | `string?` | — | Cada fila |
| `headerClassName` | `string?` | — | El `<button>` del encabezado |
| `panelClassName` | `string?` | — | El contenido del panel |

### AccordionItem

| Campo | Tipo | Qué hace |
|---|---|---|
| `id` | `string?` | Clave estable. Sin esto se usa el índice |
| `title` | `string` | El encabezado |
| `content` | `ReactNode` | Lo que se despliega. Cualquier cosa, de cualquier alto |

## Uso

```tsx
<ToggleAccordion
  items={[
    { id: "envios", title: "Envíos", content: "Llega en 3 días hábiles." },
    { id: "pagos", title: "Pagos", content: <PagosDetalle /> },
  ]}
  defaultOpen={0}
/>
```

## Los tiempos del original

Tomando t=0 en el clic, sobre un gesto de 300 ms. Todo lo demás se escala con
`duration`.

| Qué | Al abrir | Al cerrar |
|---|---|---|
| Alto del panel | 0 → 300 ms | 0 → 300 ms |
| Contenido, `translateY` | 0 → 300 ms (−27 px → 0) | 0 → 300 ms |
| Contenido, opacidad | **100 → 300 ms** | **0 → 200 ms** |
| Chevron que se va | 0 → 140 ms | 0 → 140 ms |
| Chevron que llega | 140 → 300 ms | 160 → 300 ms |

La asimetría de la opacidad es lo que hace el efecto: al abrir el texto entra
tarde y termina junto con el movimiento; al cerrar se va temprano y el panel lo
tapa. Nunca se ve texto flotando fuera de la caja. El relevo de chevrons deja un
instante (≈ 250 ms) con los dos casi en cero — ese parpadeo es del original, no
es un bug.

En el demo, el cursor automático usa los otros tiempos del template: 350 ms de
espera tras el clic, 350 ms de viaje a la tarjeta siguiente, y 100 ms de aplaste
hasta 82,76 % que toca fondo justo en el toggle. Da 800 ms exactos entre
aperturas y un ciclo de 5 s.

## Notas de uso

- **El alto se mide, no se adivina.** Un `ResizeObserver` lee el `borderBoxSize`
  del contenido, así que sirve cualquier largo de texto y el panel se ajusta solo
  si el contenido cambia o el contenedor hace reflow. Nada de `max-height`
  inventado, que es lo que hace que estos acordeones se sientan mal: con
  `max-height` la curva se aplica al tope y no al alto real.
- **`contentRect` no sirve acá.** El contenido lleva padding y `contentRect` lo
  deja fuera: el panel cerraría 24 px más corto de lo que mide. Va
  `borderBoxSize`.
- **Sin transición en el primer pintado.** Un item con `defaultOpen` tiene que
  aparecer ya abierto, no animándose solo al montar. La duración es 0 hasta el
  primer `requestAnimationFrame`.
- **Accesible como disclosure.** Encabezado `<button>` de verdad dentro de un
  `<h3>`, con `aria-expanded` y `aria-controls`; el panel es una `region`
  etiquetada por su encabezado; el panel cerrado queda `inert`, o sea fuera del
  foco y del lector de pantalla. Flechas arriba/abajo, Home y End mueven el foco
  entre encabezados (patrón APG). Si necesitas otro nivel de encabezado, el `h3`
  está fijo — cámbialo en el archivo.
- **`prefers-reduced-motion: reduce`** → el cambio es instantáneo, sin
  fotogramas intermedios.
- Cero peticiones de red y cero archivos: no depende de ninguna fuente ni asset.

## Verificado

Montado en Chromium real y medido fotograma a fotograma, no revisado por captura.
Tiempos relativos al arranque del alto:

**Al abrir**

| Propiedad | Medido | Del original |
|---|---|---|
| Alto (0 → 72 px) | 0 → 295 ms | 0 → 300 |
| Opacidad del texto | 93 → 294 ms | 100 → 300 |
| `translateY` (−27 → 0) | 0 → 295 ms | 0 → 300 |
| Chevron que se va | 0 → 134 ms | 0 → 140 |
| Chevron que llega | 136 → 294 ms | 140 → 300 |

**Al cerrar:** opacidad 0 → 200 ms y chevron que llega en 145 ms (esperado 160,
dentro de un fotograma).

- **Sin mesetas:** las cuatro propiedades son monótonas — peor paso en contra de
  la dirección: **0,0000** — con velocidad 0,67 del pico justo a mitad de
  recorrido.
- **El estado abierto se queda:** alto, opacidad y transform idénticos 2,5 s
  después.
- **Teclado:** Enter abre (`aria-expanded` pasa a `true` y el panel deja de ser
  `inert`), ↓ pasa al encabezado siguiente, End al último, Home al primero.
- **Contenido variable:** al triplicar el texto el panel pasa de 72 a 120 px con
  `scrollHeight` igual al alto — no recorta nada.
- **`reduced-motion`:** 0 fotogramas intermedios, salta de 0 a 72 px.
- **Demo:** las cuatro aperturas caen en 0 / 799 / 1598 / 2400 ms contra los
  0 / 800 / 1600 / 2400 del original, y el ciclo reinicia en 4999 ms contra 5000.
  El recorrido automático se apaga solo al primer movimiento real del mouse.
- **Red:** 0 peticiones externas. **Consola:** 0 errores.

## Dónde lo he usado

-
