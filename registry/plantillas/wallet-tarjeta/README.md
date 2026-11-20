# Wallet: tarjeta de fidelización

Reglas y dibujo de tarjetas de sellos o puntos para Apple Wallet y Google Wallet. Salen de la plataforma `wallet-chileconsultores`.

| | |
|---|---|
| **Origen** | **Propio** (repo `wallet-chileconsultores`, `public/_r/`) |
| **Autor** | yo |
| **Guardado el** | 2026-11-20 |
| **Comando original** | — |
| **Estado** | listo (Apple probado en iPhone real; Google Wallet sin probar en Android) |

## Requisitos

- JS puro (ES modules), sin React, sin Tailwind, sin dependencias npm.
- `reglas.js` corre igual en el navegador y en el servidor (Cloudflare Pages Functions). `tarjeta.js` e `iconos.js` necesitan `canvas` y `document` (solo navegador).
- Los tres archivos viven juntos: `tarjeta.js` importa `./reglas.js` e `./iconos.js`.

## Archivos

| Archivo | Qué hace |
|---|---|
| `reglas.js` | Plantillas, configuración limpia (`limpiarConfig`), estado del cliente (`estadoDe`), campos del pase (`camposDe`), niveles, premios y colores con contraste. |
| `iconos.js` | 24 íconos para sellos y `dibujarIcono` sobre canvas. |
| `tarjeta.js` | `dibujarFranja` (franja del pase en canvas), `vistaPase` (vista previa Apple o Google), `generarArte` (una imagen por estado para subir). |

## API principal

| Función | Qué hace |
|---|---|
| `limpiarConfig(entrada, iconosValidos)` | Deja la configuración completa y dentro de rango. Úsala al guardar (servidor) y al editar (navegador). |
| `camposDe(negocio, cliente)` | Campos y mensaje del pase. `pase_saldo` y `pase_mensaje` (en la config) ocultan el saldo y el mensaje. |
| `estadoDe(cfg, cliente)` | Estado dibujable: sellos ganados, o paso de la barra de progreso. |
| `dibujarFranja(ctx, w, h, cfg, estado, { hero })` | Pinta la franja. Margen lateral de 44 pt en la barra de avance para que el iPhone no la recorte. |
| `vistaPase(negocio, cliente, { tipo, url, logoUrl })` | Elemento DOM con la vista previa del pase. |

## Notas de uso

- Los sellos van como imagen: Apple no deja diseñar el pase libre. Genera una imagen por estado (0 de 8, 1 de 8...) con `generarArte` y súbelas.
- Tamaños: franja de 375 x 123 pt (se exporta a 2x y 3x), hero de Google de 1032 x 336.
- Cambiar de sellos a puntos no convierte saldos: son contadores separados. La conversión (mantener, convertir con tasa o reiniciar) se hace en el servidor al guardar el diseño.
- Cuidado con el recorte lateral del iPhone: no pongas contenido a menos de 40 pt de los bordes de la franja.

## Dónde lo he usado

- `wallet-chileconsultores` (https://wallet.chileconsultores.com): panel, diseñador y pases reales.
