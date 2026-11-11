# formatDate

Fechas en pantalla en un solo formato: «21 oct 2026» y «21 oct 2026, 09:56».

| | |
|---|---|
| **Origen** | propio (Mystery Shopper, `lib/fechas.ts`) |
| **Autor** | yo |
| **Guardado el** | 2026-11-11 |
| **Comando original** | n/a |
| **Estado** | listo |

## Requisitos

- Sin deps npm (usa `Intl` del navegador)

## API

| Función | Ejemplo | Qué hace |
|---|---|---|
| `formatDate(valor, locale = "es-CL")` | «21 oct 2026» | Solo el día. |
| `formatDateTime(valor, locale = "es-CL")` | «21 oct 2026, 09:56» | Día y hora en 24 h. |

`valor` acepta `"2026-10-21"`, un ISO con hora, un `Date`, `null` o `undefined`. Si no es una fecha válida devuelve `""`.

## Notas de uso

- Una fecha sin hora se arma a mediodía (`T12:00:00`) para que la zona horaria no la corra de día.
- Le saca el punto a la abreviatura del mes por si el navegador lo pone («oct.»).
- No usar en archivos exportados (Excel, PDF): ahí cada exporte deja su propio formato.

## Dónde lo he usado

- Mystery Shopper: todas las fechas en pantalla (20 componentes).
