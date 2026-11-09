# Plantillas: flujos

HTML autocontenido por plantilla. Cada una enlaza `../[base]/base.css` y `../[base]/base.js`.

| | |
|---|---|
| **Origen** | propio |
| **Autor** | yo |
| **Guardado el** | 2026-11-09 |
| **Estado** | listo |

## Requisitos

- Instalar antes `plantillas-base`. Sin dependencias npm ni frameworks.

## Plantillas

| Nombre | Qué hace | Ganchos |
|---|---|---|
| `calendario-de-reservas` | reserva de reuniones en 4 pasos (servicio, día, hora, datos): calendario mensual con días sin disponibilidad deshabilitados, horarios en bloques según duración, zona horaria visible, navegación por te | #cal, [data-dia], #horas, window.Reservas. |
| `centro-de-notificaciones` | centro de notificaciones completo: campana con contador y panel, bandeja con pestañas (todas, sin leer, menciones), agrupación por día, marcar leída al abrir, acciones por fila (leer, archivar, silenc | #campana, #panel, #bandeja, window.Notis, evento `noti:nueva`. |
| `checkout-por-pasos` | checkout de 3 pasos (datos, entrega y pago, revisión) con resumen de compra fijo, cupón con validación, cálculo de IVA 19 %, selector de plan con ahorro anual, formato de tarjeta con detección de marc | #resumen, [data-paso], window.Checkout. |
| `kanban-con-arrastre` | tablero kanban (embudo de ventas o tareas) con arrastre por puntero (mouse y táctil), reordenar dentro de la columna, mover con teclado (Espacio levanta, flechas mueven, Espacio suelta, Escape cancela | .kb-col[data-col], .kb-card[data-id], window.Kanban, evento `kanban:mover`. |

## Notas de uso

- Cada archivo trae un comentario inicial con cómo aplicarlo y qué conectar (`API.*`, un solo punto por plantilla).
- Los selectores "Demo" de estado se borran al conectar.
- No reutilizar con otro significado clases de base.css (`.app .nav .estado .grid .tabs .estrellas .campo`).

## Dónde lo he usado

-
