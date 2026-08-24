# Number Ticker

Numero que cuenta hacia arriba al entrar en pantalla. Para secciones de
metricas y resultados.

| | |
|---|---|
| **Origen** | Magic UI — https://magicui.design |
| **Licencia** | MIT |
| **Guardado el** | 2026-08-24 |
| **Comando original** | `npx shadcn@latest add @magicui/number-ticker` |

## Aviso de licencia

Proviene de Magic UI, licencia MIT. Ver LICENSE-MAGICUI en la raiz.

## Uso

```tsx
import { NumberTicker } from "@/components/ui/number-ticker";

<NumberTicker value={47} className="text-6xl font-bold" />
```

Se dispara al entrar en viewport, asi que en una seccion de metricas
conviene que este bajo el fold para que se vea la animacion.

## Donde lo he usado

-