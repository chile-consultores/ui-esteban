# useTabSave

Un solo «Guardar cambios» por pestaña: cada bloque anota si tiene cambios y cómo guardarlos; la pestaña guarda todo junto.

| | |
|---|---|
| **Origen** | propio (Mystery Shopper, `lib/guardarEnPestana.tsx`) |
| **Autor** | yo |
| **Guardado el** | 2026-11-11 |
| **Comando original** | n/a |
| **Estado** | listo |

## Requisitos

- React 18+ / sin deps npm

## API

| Pieza | Qué hace |
|---|---|
| `useTabSaveRegistry()` | En la pestaña: devuelve `{ register, dirty, saving, saveAll }`. |
| `TabSaveContext.Provider value={register}` | Envuelve los bloques de la pestaña. |
| `useTabSave(id, dirty, save)` | En cada bloque. Devuelve `true` si está dentro de una pestaña (el bloque esconde su propio botón Guardar). |

## Notas de uso

- Nada se guarda al tocar un control: cada bloque mantiene su borrador y solo guarda en `save`.
- `save` puede cambiar en cada render; el hook usa siempre la última.
- Si un bloque pide confirmación al guardar (por ejemplo, porque recalcula datos), hazlo dentro de su `save`.
- Combina bien con `useUnsavedChanges(dirty, saveAll)` en la pestaña.

## Dónde lo he usado

- Mystery Shopper: Administración > Configuración (Marca, Notas y metas, Período y regiones, Revisiones y avisos).
