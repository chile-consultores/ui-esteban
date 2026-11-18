# Plantillas: completas

Plataformas enteras en un solo HTML. Cada una enlaza `../[base]/base.css` y `../[base]/base.js` y guarda sus datos de demo en el navegador (localStorage).
Usan `<html data-tema>` (claro por defecto, oscuro disponible), sin aurora ni desenfoques. Cada una define sus colores de marca en los tokens `html[data-tema]` al inicio de su `<style>`.

| | |
|---|---|
| **Origen** | propio |
| **Autor** | yo |
| **Guardado el** | 2026-11-11 |
| **Estado** | listo |

## Requisitos

- Instalar antes `plantillas-base` (versión con el bloque de temas al final de `base.css`). Sin dependencias npm ni frameworks.

## Plantillas

| Nombre | Qué hace | Ganchos |
|---|---|---|
| `torneos` | gestión de torneos: inscripción pública con restricciones horarias, cuadros automáticos por categoría, programación de canchas y horarios, resultados con avance automático y vista pública. Deportes: pádel, tenis, pickleball, fútbol, vóleibol y básquetbol. Formatos: grupos + playoff (Oro y Plata), eliminación con consolación, liga, doble eliminación, americano y mexicano. | `Motor` (sin DOM: `generarCuadro`, `programar`, `ajustar`, `registrarResultado`, `tablaGrupo`), `intercambiar`, `duracion`), `API.cargar` / `API.guardar`, #tn-vista, #tn-top. Rutas #/, #/t/id/seccion, #/p/id/seccion. |
| `club-de-padel` | gestión de club: agenda por cancha en grilla de 30 min con reservas de cualquier duración, turnos fijos y reserva pública; arrastre de reservas a otra hora, cancha o día con confirmación y deshacer. Socios con planes y descuentos, clases con asistencia. Eventos simples o americanos jugables (clásico, parejas, mixto, mexicano, mexicano por parejas, rey de la pista) con puntaje por puntos o tiempo, sorteo de rondas, marcador, ranking en vivo y podio; bloquean sus canchas en la agenda. Caja por turnos (una abierta a la vez, arqueo de efectivo) y cierre de día. Zona horaria del club en Ajustes; la página pública muestra también la hora del visitante si está en otra zona. Módulos y permisos por rol (dueño, administrador, recepción, profesor, solo lectura). | #cl-top, #cl-vista, `puede(modulo, nivel)`, `precio()`, `ocupa()`, `cobrar()`, `mover()`, `genRonda()`, `ranking()`, `ahoraClub(tz)`. Datos en `cc_club_v2`. En la demo se cambia de usuario con "Entrar como"; en producción los permisos van con RLS. |

## Notas de `torneos`

- El orden de las categorías en Configuración es la prioridad al programar. Se puede programar todo o una categoría sin mover el resto.
- Restricciones: el organizador fija cuántas horas puede bloquear cada pareja, si son obligatorias o preferencia, y bloques protegidos que nadie puede bloquear.
- Grupos de 4: dos partidos (ganador con ganador y perdedor con perdedor, o cruzado ganador con perdedor) o todos contra todos.
- Los partidos con participantes por definir se programan pesando las restricciones de quienes podrían jugarlos. Cuando se conoce el cruce, `Motor.ajustar` reubica los que quedaron mal.
- Un partido movido a mano queda fijado y la programación automática no lo toca.
- Duración por fase (grupos, previas, octavos, cuartos, semifinal, final) a nivel de torneo; cada categoría puede tener las suyas desde su botón de ajustes.
- Categorías: lista compacta con selección múltiple para cambiar cupos, inscripción y formato de varias a la vez.
- Programación: se marcan las categorías a programar; las demás no se mueven. Arrastrar un partido sobre otro los intercambia; a un hueco, lo mueve; desde "Sin horario", lo coloca. En táctil y teclado se hace desde el partido.
- Al forzar a mano se puede pasar por alto restricción, descanso o máximo por día (pide confirmación); nunca cancha ocupada ni orden de fases.
- Look: verde cancha sobre blanco, pestañas arriba, sin menú lateral. Datos guardados en `cc_torneos_v3`.
- Programación en grilla por turnos fijos, horario que se bloquea al terminar de programar, llegada de un toque, W.O., doble W.O., retiro y lucky loser por sorteo.
- `torneos-motor.js` es el mismo motor del HTML, suelto, para usarlo en la versión conectada.
- Estados de demo por URL: `?demo=cargando`, `?demo=error`, `?demo=vacio`.
- Para conectar: reemplazar `API.cargar` y `API.guardar`. Tablas sugeridas: tournaments, courts, court_blocks, categories, registrations, matches. La inscripción pública va por RPC o Edge Function.
- Capacidad de referencia: 6 canchas en viernes tarde, sábado y domingo dan unos 130 turnos de 75 minutos.
