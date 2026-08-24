# Aurora Text

Texto con degradado animado tipo aurora. Para destacar una palabra dentro
de un titular.

| | |
|---|---|
| **Origen** | Magic UI — https://magicui.design |
| **Licencia** | MIT |
| **Guardado el** | 2026-08-24 |
| **Comando original** | `npx shadcn@latest add @magicui/aurora-text` |

## Aviso de licencia

Este componente proviene de Magic UI y se distribuye bajo licencia MIT.
La licencia MIT permite copiar, modificar y redistribuir, siempre que se
conserve el aviso de copyright original y el texto de la licencia.

Ver el archivo LICENSE-MAGICUI en la raiz de este repositorio.

## Uso

```tsx
import { AuroraText } from "@/components/ui/aurora-text";

<h1 className="text-5xl font-bold">
  Datos que <AuroraText>importan</AuroraText>
</h1>
```

Funciona bien sobre fondos oscuros. Usarlo en una sola palabra del titular,
no en la frase completa.

## Donde lo he usado

-