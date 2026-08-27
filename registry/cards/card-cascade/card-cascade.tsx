import {
  Children,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type Desde = "abajo" | "arriba" | "izquierda" | "derecha";

interface CardCascadeProps {
  /** Cada hijo entra por separado, en orden. */
  children: ReactNode;
  /** Milisegundos entre una tarjeta y la siguiente. */
  stagger?: number;
  /** Duracion de la entrada de cada tarjeta, en ms. */
  duration?: number;
  /** Cuanto se desplaza cada tarjeta antes de asentarse, en px. */
  offset?: number;
  /** Desde donde entran. */
  from?: Desde;
  /**
   * Si las tarjetas arrancan un poco mas chicas. `1` lo desactiva.
   * Valores utiles: 0.94 - 0.98. Mas abajo se siente rebotado.
   */
  scale?: number;
  /** false = vuelve a animar cada vez que entra en pantalla. */
  once?: boolean;
  /** Clases del contenedor. Aca va el layout: flex, gap, etc. */
  className?: string;
}

const DESPLAZAMIENTO: Record<Desde, (px: number) => string> = {
  abajo: (px) => `translateY(${px}px)`,
  arriba: (px) => `translateY(-${px}px)`,
  izquierda: (px) => `translateX(-${px}px)`,
  derecha: (px) => `translateX(${px}px)`,
};

/**
 * Entrada en cascada: las tarjetas aparecen escalonadas al entrar en pantalla.
 *
 * Cada hijo se envuelve en un div con su propio `transition-delay`, asi que el
 * escalonado sale del CSS y no de temporizadores en JavaScript. Un solo
 * IntersectionObserver dispara todo.
 *
 * Cero dependencias npm. Con `prefers-reduced-motion` aparecen de una, sin
 * desplazamiento.
 */
export function CardCascade({
  children,
  stagger = 90,
  duration = 520,
  offset = 18,
  from = "abajo",
  scale = 0.97,
  once = true,
  className,
}: CardCascadeProps) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [menosMovimiento, setMenosMovimiento] = useState(false);

  useEffect(() => {
    setMenosMovimiento(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
  }, []);

  useEffect(() => {
    const nodo = contenedor.current;
    if (!nodo) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          if (once) observador.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15 }
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, [once]);

  const tarjetas = Children.toArray(children);
  const oculto = `${DESPLAZAMIENTO[from](offset)} scale(${scale})`;

  return (
    <div ref={contenedor} className={cn("flex flex-col gap-3", className)}>
      {tarjetas.map((tarjeta, i) => {
        const retraso = menosMovimiento ? 0 : i * stagger;
        const dur = menosMovimiento ? 0 : duration;

        const estilo: CSSProperties = {
          opacity: visible ? 1 : 0,
          transform: visible || menosMovimiento ? "none" : oculto,
          transition:
            `opacity ${dur}ms ease-out ${retraso}ms, ` +
            `transform ${dur}ms cubic-bezier(.22,1,.36,1) ${retraso}ms`,
          // sin esto el navegador repinta la tarjeta entera en cada fotograma
          willChange: visible ? "auto" : "opacity, transform",
        };

        return (
          <div key={i} style={estilo}>
            {tarjeta}
          </div>
        );
      })}
    </div>
  );
}
