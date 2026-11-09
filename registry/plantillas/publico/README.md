# Plantillas: publico

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
| `encuesta-publica` | encuesta pública de clima laboral por enlace con token (?t=...). | PREGUNTAS, QUESTION_TYPES, ESTADOS, API, [data-pant], #enc-demo (selector de demo, bórralo en producción). |
| `formulario-contacto` | landing corta de contacto pública con formulario validado, consentimiento explícito, honeypot, límite de reintentos y estados enviando, éxito con resumen y error con reintentar. | API.contacto, REGLAS, #ct-form, #ct-ok, #ct-aviso, MAX_INTENTOS. |

## Notas de uso

- Cada archivo trae un comentario inicial con cómo aplicarlo y qué conectar (`API.*`, un solo punto por plantilla).
- Los selectores "Demo" de estado se borran al conectar.
- No reutilizar con otro significado clases de base.css (`.app .nav .estado .grid .tabs .estrellas .campo`).

## Dónde lo he usado

-
