# Dialog

Modal accesible con dos modos: confirmacion y prompt de texto. API basada
en promesas, asi que se usa como un `confirm()` o `prompt()` nativo pero
con estilos propios.

| | |
|---|---|
| **Origen** | Propio |
| **Autor** | Esteban — Chile Consultores |
| **Guardado el** | 2026-08-24 |
| **Viene de** | encuestas-chileconsultores, convertido a Tailwind |

## Que trae

- Focus trap: al abrir enfoca el boton primario (o el input en modo prompt)
- Retorno de foco al elemento que lo abrio, al cerrar
- Cierre con Escape y con clic en el backdrop
- ARIA completo: `role="dialog"`, `aria-modal`, `aria-labelledby`,
  `aria-describedby`, `aria-invalid` en el input
- Validacion de campo vacio en modo prompt
- Variante destructiva (rojo) para acciones de borrado
- Dark mode

## Requisitos

- React 18+
- Tailwind CSS v4

Sin dependencias npm. No requiere CSS externo.

## Uso

El hook devuelve dos funciones y un elemento que hay que renderizar.

```tsx
import { useDialog } from "@/components/ui/dialog";

function MiComponente() {
  const { confirmDialog, promptDialog, dialog } = useDialog();

  async function borrar(id: string) {
    const ok = await confirmDialog({
      title: "Borrar registro",
      message: "Esta accion no se puede deshacer.",
      confirmLabel: "Borrar",
      destructive: true,
    });
    if (!ok) return;
    // ... borrar
  }

  async function renombrar() {
    const nombre = await promptDialog({
      title: "Renombrar proyecto",
      label: "Nuevo nombre",
      initialValue: "Proyecto sin titulo",
      placeholder: "Escribe el nombre",
    });
    if (nombre === null) return; // cancelo
    // ... guardar
  }

  return (
    <>
      <button onClick={() => borrar("1")}>Borrar</button>
      <button onClick={renombrar}>Renombrar</button>
      {dialog}
    </>
  );
}
```

**Importante:** hay que renderizar `{dialog}` en el JSX. Si se olvida, las
promesas quedan colgadas y no pasa nada al llamar a las funciones.

## Opciones

**confirmDialog** — devuelve `Promise<boolean>`

| Opcion | Tipo | Que hace |
|---|---|---|
| `title` | string | Titulo del modal |
| `message` | string | Texto descriptivo |
| `confirmLabel` | string? | Texto del boton. Default: "Aceptar" |
| `destructive` | boolean? | Pinta el boton en rojo e ilustra con "!" |

**promptDialog** — devuelve `Promise<string \| null>`, `null` si cancela

| Opcion | Tipo | Que hace |
|---|---|---|
| `title` | string | Titulo del modal |
| `message` | string? | Texto descriptivo opcional |
| `label` | string | Etiqueta del campo |
| `initialValue` | string? | Valor precargado |
| `placeholder` | string? | Placeholder del input |
| `confirmLabel` | string? | Texto del boton. Default: "Guardar" |
| `required` | boolean? | Si es `false`, permite guardar vacio |

## Donde lo he usado

- encuestas-chileconsultores (version original con CSS propio)