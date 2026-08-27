# Lottie

Reproduce archivos `.lottie` (dotLottie), incluidas las animaciones
interactivas con máquina de estados.

| | |
|---|---|
| **Origen** | **Propio** (wrapper sobre @lottiefiles/dotlottie-react, MIT) |
| **Autor** | yo |
| **Guardado el** | 2026-08-27 |
| **Comando original** | — |
| **Estado** | listo |

## Requisitos

- React
- `@lottiefiles/dotlottie-react` (MIT)
- **Dos pasos manuales** después de instalar, ver abajo

## Instalación completa

```powershell
npm i @lottiefiles/dotlottie-react@0.19.15
```

Después copia el WASM del player a tu `public/`:

```powershell
mkdir public\lottie -Force
Copy-Item node_modules\@lottiefiles\dotlottie-web\dist\dotlottie-player.wasm public\lottie\
```

**Este paso no es opcional.** Sin él, el player se baja 1.2 MB de WASM desde
`cdn.jsdelivr.net` en cada carga de página. La línea `setWasmUrl()` del
componente apunta a `/lottie/dotlottie-player.wasm`.

El `.wasm` debe coincidir con la versión de `@lottiefiles/dotlottie-web` del
`package-lock`. Si actualizas el paquete, vuelve a copiarlo.

## Props

| Prop | Tipo | Default | Qué hace |
|---|---|---|---|
| `src` | `string` | — | Ruta al `.lottie` en `public/` |
| `stateMachineId` | `string` | — | Id de la máquina de estados. La hace interactiva |
| `loop` | `boolean` | `true` | |
| `autoplay` | `boolean` | `true` | |
| `speed` | `number` | `1` | |
| `width` / `height` | `number` | `240` / `180` | Tamaño del **contenedor**. Deben respetar la proporción del archivo |
| `label` | `string \| null` | — | Para lectores de pantalla. `null` = decorativa |
| `onInstance` | `(i) => void` | — | Da acceso al player para eventos |

## Uso

```tsx
import { Lottie } from "@/components/ui/lottie";

// loop simple
<Lottie src="/lottie/loader.lottie" width={240} height={180} label="Cargando" />

// interactiva: responde al puntero
<Lottie
  src="/lottie/burger.lottie"
  stateMachineId="StateMachine1"
  width={280}
  height={174}
  label="Abrir menú"
/>
```

## Notas de uso

- **El tamaño va en un contenedor, no en el canvas.** El player pisa el style
  del canvas con `width:100%;height:100%` y luego lo ajusta al tamaño del padre
  multiplicado por el `devicePixelRatio`. Si dimensionas el canvas directamente,
  tus medidas se pierden y en una pantalla HiDPI la animación sale al doble.
  Verificado a dpr 1, 1.5 y 2.
- **La proporción importa.** Un `.lottie` no es cuadrado por defecto. Su tamaño
  real está en el JSON de adentro (campos `w`/`h`): descomprime el `.lottie`
  (es un zip) y míralo, o la animación sale estirada.
- **El id de la máquina de estados** sale del `manifest.json` dentro del zip,
  en el array `stateMachines`. No hace falta llamar a `stateMachineLoad` ni
  `stateMachineStart` a mano: basta la prop y el player lo hace solo.
- El player congela la animación cuando el canvas sale de pantalla
  (`freezeOnOffscreen`), así que no gasta CPU de fondo.
- **Limitación conocida**: una animación con máquina de estados responde **solo
  al puntero**. Los eventos los escucha el canvas, así que con teclado no se
  activa. Si la vas a usar como botón real, envuélvela en un `<button>` y
  dispara la transición desde ahí.
- Los archivos `.lottie` de LottieFiles son de sus autores. Revisa la licencia
  de cada uno antes de meterlos a un repo público — este componente no los
  incluye, solo los reproduce.

## Dónde lo he usado

-
