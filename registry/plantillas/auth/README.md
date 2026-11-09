# Plantillas: auth

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
| `invitacion-y-bienvenida` | aceptar la invitación a una empresa (?token=): quién invita, empresa y rol, estados válida / expirada / ya usada, formulario de nombre y clave, y pantalla de bienvenida con 3 primeros pasos. | API, [data-vista], mostrar(vista), #demo, #ir-panel. |
| `login-y-registro` | tarjeta de acceso con tabs Ingresar / Crear cuenta. | API, #f-ing, #f-reg, #err-ing, #err-reg, entrar(). |
| `perfil-y-seguridad` | página "Mi cuenta" con 4 pestañas: Perfil (avatar con iniciales, aviso de cambios sin guardar), Seguridad (cambio de clave y 2FA con QR simulado y 8 códigos de recuperación), Sesiones activas y Zona d | API, #f-perfil, #f-clave, #sw-2fa, #lista-ses, #b-eliminar. |
| `recuperar-clave` | recuperar clave en una sola página: 1) pedir correo, 2) "revisa tu correo" con reenvío tras 60 s y cambio de correo, 3) nueva clave con token de la URL, más éxito y estados de token inválido o vencido | API, [data-paso], ir(paso), #reenviar. |
| `verificacion-2-pasos` | código de 6 dígitos con casillas separadas (autoavance, pegar el código completo, retroceso, flechas), autoenvío al completar, error con vibración suave, reenvío con cuenta regresiva, código de recupe | API, #casillas, #f-rec, #confiar, mostrarOk(). |

## Notas de uso

- Cada archivo trae un comentario inicial con cómo aplicarlo y qué conectar (`API.*`, un solo punto por plantilla).
- Los selectores "Demo" de estado se borran al conectar.
- No reutilizar con otro significado clases de base.css (`.app .nav .estado .grid .tabs .estrellas .campo`).

## Dónde lo he usado

-
