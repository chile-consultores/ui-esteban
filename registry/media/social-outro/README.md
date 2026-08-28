# Social Outro

Cierre de "síguenos": un panel con degradado entra en diagonal sobre el fondo
y revela el título y las redes, en secuencia. Para el pie de una landing, el
cierre de un caso, o un CTA de redes.

| | |
|---|---|
| **Origen** | **Propio** |
| **Autor** | yo |
| **Guardado el** | 2026-08-28 |
| **Estado** | listo |

## Requisitos

- React
- Tailwind v4
- Cero dependencias npm (los iconos los pasas tú)

## Props

| Prop | Tipo | Default | Qué hace |
|---|---|---|---|
| `headline` | `string` | — | Ej: "Síguenos" |
| `subheadline` | `string?` | — | Segunda línea |
| `socials` | `RedSocial[]` | — | Las redes |
| `image` | `string?` | — | Imagen de fondo, local |
| `gradient` | `string[]` | 3 colores | Colores del panel |
| `stagger` | `number` | `200` | ms entre una red y la siguiente |
| `panelDelay` | `number` | `1000` | Cuándo entra el panel. El título entra en 0 |
| `photoZoom` | `number` | `1.07` | Zoom lento de la foto. `1` lo apaga |
| `scrim` | `number` | `0.45` | Velo oscuro sobre la foto (0-1) |
| `once` | `boolean` | `true` | `false` = re-anima al volver a pantalla |

### RedSocial

| Campo | Tipo | Qué hace |
|---|---|---|
| `red` | `string` | Nombre de la red, para el texto accesible |
| `handle` | `string` | La manija tal como se muestra |
| `href` | `string?` | URL del perfil. Sin esto es texto, no enlace |
| `icon` | `ReactNode?` | El icono, lo pones tú |

## Uso

```tsx
import { IconBrandInstagram } from "@tabler/icons-react";

<SocialOutro
  headline="Síguenos"
  subheadline="Para más información"
  image="/fotos/equipo.jpg"
  socials={[
    { red: "Instagram", handle: "@chileconsultores",
      href: "https://instagram.com/chileconsultores",
      icon: <IconBrandInstagram size={22} stroke={1.6} /> },
  ]}
/>
```

## La coreografía

El orden importa y no es el obvio. Sale del timeline del original:

| Momento | Qué entra |
|---|---|
| **0 ms** | La foto empieza su zoom lento (2.6 s) y entra el **título**, grande y translúcido, encogiendo hasta su tamaño (1.5 s) |
| **~820 ms** (`panelDelay`) | El **panel** entra deformándose: triángulo → pentágono → plano (1.4 s) |
| +220 ms | El subtítulo |
| +260 ms, luego cada `stagger` | Las redes, una a una |

Lo importante: **el título entra sobre la foto, antes del panel.** La primera
versión de esto metía el panel primero y se veía completamente distinto —
perdía el momento en que la palabra aparece sola sobre la imagen.

## Por qué no un Lottie

Esto salió imitando una plantilla de SVGator. La versión animada tenía la
imagen de fondo en un CDN ajeno, marca de agua, y —lo que decide— **las
manijas eran píxeles**: se veían, no se podían pulsar.

Acá cada red es un `<a>` real, con `href`, `target="_blank"`,
`rel="noopener noreferrer"` y su `aria-label`. Se hace clic, Google las indexa
y un lector de pantalla las anuncia.

## Notas de uso

- **Los iconos los pasas tú**, por prop. Así el componente no arrastra una
  librería de iconos al registry. En los proyectos con `@tabler/icons-react`
  ya instalado, sus `IconBrand*` sirven directo.
- **El `aria-label` lleva el nombre de la red**, no solo la manija: cuatro
  enlaces seguidos diciendo "@chileconsultores" no le dicen nada a alguien
  que navega con lector de pantalla.
- **El panel anima solo `transform`.** El borde diagonal es un `clip-path`
  fijo, no animado — animar `clip-path` obliga al navegador a recalcular la
  máscara en cada fotograma y se nota.
- **El `scrim` no es decorativo.** El título entra en blanco ANTES de que
  llegue el panel: sobre una foto clara desaparece del todo. Lo descubrí
  probándolo con una captura de dashboard clara — la opacidad decía 0.95 y
  en pantalla no había nada. Ponlo en 0 solo si tu foto ya es oscura.
- **El panel no se desliza: se deforma.** Sube como un triángulo con el pico
  al centro, los hombros se levantan hasta volverlo un pentágono, y al llegar
  arriba el pico se aplana — sin pasarse de largo. Son cuatro estados de
  `clip-path`, todos con **5 vértices**: si el número de puntos no coincide
  entre estados, el navegador no sabe interpolar y la forma salta.
- **El `animation-timing-function` es `linear`, y no es descuido.** Un easing
  ahí se aplica entre **cada par** de keyframes, no a la animación completa:
  la forma frena y vuelve a acelerar en cada parada, y eso se ve como tirones.
  La curva va horneada en los valores — un `easeOutCubic` muestreado en 21
  pasos — así el movimiento es uno solo. Medido: 63 muestras dentro del
  morph, **0 fotogramas con velocidad nula**.
- **Los tiempos se solapan a propósito.** El `transform` del título dura 1.5 s
  y el panel entra a los 820 ms: el título sigue asentándose cuando el panel
  ya viene subiendo. Sin ese solape queda un instante en que nada se mueve.
- **Los keyframes van en un `<style>` dentro del componente**, con el nombre
  derivado de `useId()`. Dos razones: una `transition` solo va de A a B y acá
  hay cuatro estados; y si hubiera dos de estos en la misma página, un nombre
  fijo haría que el segundo pisara la animación del primero.
- Una versión anterior deslizaba un rectángulo con el borde inclinado. Se veía
  parecido en el fotograma final y **completamente distinto en movimiento** —
  el original tiene un pico que sube y se aplana, no un borde que pasa.
- Con `prefers-reduced-motion` todo aparece de una, sin barrido ni secuencia.

## Dónde lo he usado

-
