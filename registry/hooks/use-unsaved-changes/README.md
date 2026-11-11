# useUnsavedChanges

Cambios sin guardar: al salir de la pantalla pregunta Guardar cambios / Seguir editando / Salir sin guardar.

| | |
|---|---|
| **Origen** | propio (Mystery Shopper, `lib/sinGuardar.ts`) |
| **Autor** | yo |
| **Guardado el** | 2026-11-11 |
| **Comando original** | n/a |
| **Estado** | listo |

## Requisitos

- React 18+ / sin deps npm

## API

| Pieza | Qué hace |
|---|---|
| `useUnsavedChanges(dirty, save)` | En la pantalla: marca que hay cambios y cómo guardarlos. Mientras `dirty`, también avisa al cerrar o recargar la pestaña. |
| `setLeavePrompt(fn)` | Una vez, en el proveedor de diálogos: la función que muestra la ventana de 3 botones y resuelve `"save" \| "leave" \| "stay"`. |
| `canLeave()` | Antes de cambiar de ruta, de sección o de empresa: `if (!(await canLeave())) return;`. |
| `hasUnsavedChanges()` | Para cortar rápido sin `await` (por ejemplo dentro de una función `navegar` síncrona). |

## Notas de uso

- Atrás/adelante del navegador: el oyente de `popstate` se registra al cargar el módulo para correr antes que los de la app. En `window` los oyentes corren en orden de registro: la fase de captura no adelanta a nadie. Importa el módulo temprano (por ejemplo desde tu `navegar`).
- Los `popstate` que dispara la propia app (`isTrusted = false`) pasan sin preguntar.
- «Guardar cambios» espera el guardado y solo sale si después ya no quedan cambios (si el guardado falla, se queda).
- Cerrar o recargar usa el aviso del navegador: solo trae 2 botones y no se puede personalizar.
- Una sola pantalla con cambios a la vez. Con Vite, tras editar el módulo puede quedar cargado dos veces: recargar antes de probar.

## Dónde lo he usado

- Mystery Shopper: Configuración (4 pestañas) y metas de Marcas.
