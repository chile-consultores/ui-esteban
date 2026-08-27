import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface ProgressRingProps {
  /** Porcentaje final, 0-100. Se recorta solo si te pasas. */
  value: number;
  /** Diametro en px. El trazo va por dentro, asi que este es el tamano real. */
  size?: number;
  /** Grosor del trazo en px. */
  strokeWidth?: number;
  /** Duracion del llenado en ms. */
  duration?: number;
  /** Retardo antes de arrancar, en ms. Para escalonar varios anillos. */
  delay?: number;
  /** Inicio del degradado del trazo. */
  from?: string;
  /** Fin del degradado. Tambien es el color del glow. */
  to?: string;
  /** Radio del glow en px. 0 lo apaga. */
  glow?: number;
  /** Contenido al centro (numero, etiqueta, lo que sea). */
  children?: ReactNode;
  /** Texto para lectores de pantalla. Default: "Progreso: N%". */
  label?: string;
  className?: string;
  /** Para pisar el color del riel de fondo. */
  trackClassName?: string;
}

/**
 * Anillo de progreso que se llena al entrar en pantalla.
 *
 * La animacion es un solo truco: el trazo del circulo se corta con
 * `stroke-dasharray` (el perimetro completo) y se desplaza con
 * `stroke-dashoffset`. Offset = perimetro -> invisible. Offset = 0 -> lleno.
 * Animar esa propiedad "dibuja" el trazo.
 *
 * Cero dependencias npm: IntersectionObserver + una transicion CSS.
 */
export function ProgressRing({
  value,
  size = 190,
  strokeWidth = 14,
  duration = 1700,
  delay = 0,
  from = "#ff2fb3",
  to = "#b84cff",
  glow = 10,
  children,
  label,
  className,
  trackClassName,
}: ProgressRingProps) {
  // useId da algo como ":r3:" o "«r3»" segun la version de React.
  // Los limpiamos porque este id termina dentro de un url(#...).
  const idBruto = useId();
  const idDegradado = `progress-ring-${idBruto.replace(/[^a-zA-Z0-9]/g, "")}`;

  const contenedor = useRef<HTMLDivElement>(null);
  const [avance, setAvance] = useState(0);

  const objetivo = Math.min(100, Math.max(0, value));
  const centro = size / 2;
  const radio = (size - strokeWidth) / 2;
  const perimetro = 2 * Math.PI * radio;
  const offset = perimetro - (perimetro * avance) / 100;

  useEffect(() => {
    const nodo = contenedor.current;
    if (!nodo) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    // Sin IntersectionObserver (jsdom, navegador viejo): mostrar el final.
    if (typeof IntersectionObserver === "undefined") {
      setAvance(objetivo);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        timer = setTimeout(() => setAvance(objetivo), delay);
      },
      { threshold: 0.3 }
    );

    observador.observe(nodo);

    return () => {
      observador.disconnect();
      if (timer !== null) clearTimeout(timer);
    };
  }, [objetivo, delay]);

  const estiloTrazo: CSSProperties = {
    transitionProperty: "stroke-dashoffset",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
    filter: glow > 0 ? `drop-shadow(0 0 ${glow}px ${to})` : undefined,
  };

  return (
    <div
      ref={contenedor}
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={objetivo}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `Progreso: ${objetivo}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        /* overflow-visible: sin esto el <svg> recorta el glow, porque el
           anillo toca justo el borde del viewBox */
        className="absolute inset-0 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={idDegradado} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>

        {/* riel de fondo */}
        <circle
          cx={centro}
          cy={centro}
          r={radio}
          fill="none"
          strokeWidth={strokeWidth}
          className={cn(
            "stroke-neutral-200 dark:stroke-neutral-800",
            trackClassName
          )}
        />

        {/* trazo que se dibuja */}
        <circle
          cx={centro}
          cy={centro}
          r={radio}
          fill="none"
          stroke={`url(#${idDegradado})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={perimetro}
          strokeDashoffset={offset}
          /* -90deg para que arranque arriba y no a las 3 en punto */
          transform={`rotate(-90 ${centro} ${centro})`}
          className="motion-reduce:transition-none"
          style={estiloTrazo}
        />
      </svg>

      {children ? (
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {children}
        </div>
      ) : null}
    </div>
  );
}
