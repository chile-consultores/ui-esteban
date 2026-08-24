# Magic Card

Card con spotlight que sigue al cursor e ilumina el borde. Sutil, reacciona
al mouse en vez de correr sola.

| | |
|---|---|
| **Origen** | Magic UI — https://magicui.design |
| **Licencia** | MIT |
| **Guardado el** | 2026-08-24 |
| **Comando original** | `npx shadcn@latest add @magicui/magic-card` |

## Aviso de licencia

Proviene de Magic UI, licencia MIT. Ver LICENSE-MAGICUI en la raiz.

## Props utiles

| Prop | Que hace |
|---|---|
| `gradientColor` | Color del spotlight. En fondo oscuro, `#262626` funciona bien |
| `className` | Clases del contenedor |

## Uso

```tsx
import { MagicCard } from "@/components/ui/magic-card";

<MagicCard className="h-64 w-72 rounded-2xl p-6" gradientColor="#262626">
  <h3>Servicio</h3>
</MagicCard>
```

Sirve para grillas de servicios o features. Necesita fondo oscuro para que
el spotlight se note.

## Donde lo he usado

-