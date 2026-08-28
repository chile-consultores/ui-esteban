import { useCallback, useEffect, useRef, useState } from "react";
import {
  DotLottieReact,
  setWasmUrl,
  type DotLottie,
} from "@lottiefiles/dotlottie-react";

import { cn } from "@/lib/utils";

setWasmUrl("/lottie/dotlottie-player.wasm");

interface LottieToggleProps {
  /** Ruta al .lottie en public/. Debe ser una animacion A -> B, sin loop. */
  src: string;
  /** Texto accesible cuando esta cerrado (ej. "Abrir menu"). */
  labelClosed: string;
  /** Texto accesible cuando esta abierto (ej. "Cerrar menu"). */
  labelOpen: string;
  /** Ancho y alto en px. Respetar la proporcion del archivo. */
  width?: number;
  height?: number;
  /** Multiplicador de velocidad. Menor = mas lento. */
  speed?: number;
  /** Estado controlado. Si lo pasas, tu mandas; si no, se maneja solo. */
  open?: boolean;
  onOpenChange?: (abierto: boolean) => void;
  className?: string;
}

/**
 * Boton que reproduce una animacion Lottie de ida y vuelta, y **se queda**
 * en el fotograma final hasta el siguiente clic.
 *
 * Por que existe: un .lottie con `loop` se reinicia de inmediato, y bajarle
 * la velocidad solo estira el ciclo — nunca se detiene. Aca la reproduccion
 * va a mano: modo forward al abrir, reverse al cerrar, sin loop, asi que
 * termina y se queda.
 *
 * Es un <button> real, no un <canvas> con onClick: funciona con teclado,
 * anuncia su estado con aria-expanded y toma el foco como cualquier boton.
 */
export function LottieToggle({
  src,
  labelClosed,
  labelOpen,
  width = 56,
  height = 56,
  speed = 1,
  open,
  onOpenChange,
  className,
}: LottieToggleProps) {
  const instancia = useRef<DotLottie | null>(null);
  const [interno, setInterno] = useState(false);
  const controlado = open !== undefined;
  const abierto = controlado ? open : interno;

  const [menosMovimiento, setMenosMovimiento] = useState(false);
  useEffect(() => {
    setMenosMovimiento(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
  }, []);

  // Reproduce hacia el estado pedido. Se usa tanto al hacer clic como cuando
  // el estado cambia desde afuera (modo controlado).
  const reproducirHacia = useCallback(
    (destino: boolean) => {
      const i = instancia.current;
      if (!i) return;

      if (menosMovimiento) {
        // Sin animacion: saltar directo al fotograma final del estado.
        i.setFrame(destino ? Math.max(0, i.totalFrames - 1) : 0);
        return;
      }

      i.setMode(destino ? "forward" : "reverse");
      i.play();
    },
    [menosMovimiento]
  );

  useEffect(() => {
    if (controlado) reproducirHacia(abierto);
  }, [controlado, abierto, reproducirHacia]);

  const alternar = () => {
    const siguiente = !abierto;
    if (!controlado) setInterno(siguiente);
    onOpenChange?.(siguiente);
    if (!controlado) reproducirHacia(siguiente);
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-expanded={abierto}
      aria-label={abierto ? labelOpen : labelClosed}
      style={{ width, height }}
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center",
        "rounded-xl transition-colors",
        className
      )}
    >
      <DotLottieReact
        src={src}
        loop={false}
        autoplay={false}
        speed={speed}
        dotLottieRefCallback={(i) => {
          instancia.current = i;
        }}
        aria-hidden="true"
        /* el canvas no debe recibir el clic: el boton de afuera ya lo maneja */
        style={{ pointerEvents: "none" }}
      />
    </button>
  );
}
