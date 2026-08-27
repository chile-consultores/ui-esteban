import {
  DotLottieReact,
  setWasmUrl,
  type DotLottie,
} from "@lottiefiles/dotlottie-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Sin esta linea el player se baja 1.2 MB de WASM desde cdn.jsdelivr.net en
// CADA carga de pagina. Con ella sale de nuestro propio public/: nada de
// terceros en runtime, y funciona sin internet.
//
// El .wasm tiene que coincidir con la version de @lottiefiles/dotlottie-web
// que traiga el package-lock. Si actualizas el paquete, vuelve a copiar:
//   node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-player.wasm
//   -> public/lottie/dotlottie-player.wasm
// ---------------------------------------------------------------------------
setWasmUrl("/lottie/dotlottie-player.wasm");

interface LottieProps {
  /** Ruta al .lottie servido desde public/. Ej: "/lottie/burger.lottie" */
  src: string;
  /**
   * Id de la maquina de estados dentro del archivo, si la tiene.
   * Al pasarlo, el player la carga y la arranca solo: la animacion pasa a
   * responder al puntero en vez de reproducirse de corrido.
   * El id sale del manifest.json que va dentro del .lottie.
   */
  stateMachineId?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  /**
   * Ancho y alto en px del contenedor. Deben respetar la proporcion del
   * archivo o la animacion sale estirada.
   * La proporcion real esta en el JSON de adentro del .lottie (campos w/h):
   * paperplane es 800x600 (4:3), burger 2173x1350 (~1.61:1).
   */
  width?: number;
  height?: number;
  /**
   * Descripcion para lectores de pantalla. Un <canvas> sin esto es un agujero
   * negro para ellos. Pasa null solo si la animacion es pura decoracion.
   */
  label: string | null;
  className?: string;
  /** Para leer el estado del player desde afuera si hace falta. */
  onInstance?: (instancia: DotLottie | null) => void;
}

/**
 * Reproduce un archivo .lottie.
 *
 * El player congela la animacion sola cuando el canvas sale de pantalla
 * (`freezeOnOffscreen`), asi que no gasta CPU en algo que nadie esta viendo.
 *
 * Con `prefers-reduced-motion` no reproduce: deja el primer fotograma quieto.
 */
export function Lottie({
  src,
  stateMachineId,
  loop = true,
  autoplay = true,
  speed = 1,
  width = 240,
  height = 180,
  label,
  className,
  onInstance,
}: LottieProps) {
  const menosMovimiento =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // El tamano va en un contenedor, NO en el canvas. El player le pisa el style
  // con "width:100%;height:100%" y despues ajusta el canvas al tamano del
  // padre multiplicado por el devicePixelRatio. Si dimensionas el canvas
  // directamente, tus medidas se pierden y en una pantalla HiDPI la animacion
  // sale al doble. Dimensionando el padre, el canvas lo llena y punto.
  return (
    <div style={{ width, height }} className={cn("relative", className)}>
      <DotLottieReact
        src={src}
        stateMachineId={stateMachineId}
        loop={menosMovimiento ? false : loop}
        autoplay={menosMovimiento ? false : autoplay}
        speed={speed}
        dotLottieRefCallback={onInstance}
        role={label ? "img" : "presentation"}
        aria-label={label ?? undefined}
        aria-hidden={label ? undefined : true}
      />
    </div>
  );
}
