# Cloud Shader

Fondo de nubes procedurales que se desplazan por el cielo.

| | |
|---|---|
| **Origen** | Aceternity UI — https://ui.aceternity.com/components/cloud-shader |
| **Autor** | Manu Arora / Aceternity Labs |
| **Guardado el** | 2026-08-21 |
| **Comando original** | `npx shadcn@latest add @aceternity/cloud-shader` |
| **Estado** | ⚠️ archivo pendiente de pegar |

## Requisitos

- React
- Tailwind CSS v4
- Motion for React

## Props

| Prop | Tipo | Default | Qué hace |
|---|---|---|---|
| `className` | `string` | — | Clases extra del contenedor externo |
| `children` | `React.ReactNode` | — | Contenido dibujado sobre las nubes |
| `speed` | `number` | `1` | Multiplicador de velocidad |
| `count` | `number` | `6` | Cantidad de nubes (1–6) |
| `cloudColor` | `string` | `"#fbf8f2"` | Tinte de las nubes |
| `skyTopColor` | `string` | `"#3876ba"` | Color del cielo arriba |
| `skyBottomColor` | `string` | `"#8cbfe8"` | Color del cielo abajo |

## Notas de uso

- Es un shader corriendo en loop. **Uno por página**, en el hero. No lo
  repitas en varias secciones.
- Los tres colores son props, así que tíñelo con tus tokens en vez de dejar
  el azul cielo por defecto.
- En móvil o con `prefers-reduced-motion`, cámbialo por un fondo estático.
  Para eso está el hook `use-media-query` de este mismo registry:

  ```tsx
  const menosMovimiento = useMediaQuery("(prefers-reduced-motion: reduce)");
  const esChico = useMediaQuery("(max-width: 768px)");

  if (menosMovimiento || esChico) return <FondoEstatico />;
  return <CloudShader count={4} skyTopColor="var(--color-marca)" />;
  ```

## Dónde lo he usado

_(anota acá los proyectos, para acordarte)_

-
