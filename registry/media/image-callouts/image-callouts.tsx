import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export interface Callout {
  /** Punto que se marca sobre la imagen, en % del contenedor (0-100). */
  x: number;
  y: number;
  /** Donde se posa la etiqueta, en % del contenedor. */
  labelX: number;
  labelY: number;
  title: string;
  detail?: string;
  /** Color del punto, la linea y el borde. Default: el acento del componente. */
  color?: string;
  /**
   * Hacia donde crece la caja desde `labelX`.
   * "derecha" = el borde izquierdo queda en labelX. "izquierda" = el derecho.
   * Sin esto se deduce de si la etiqueta quedo a un lado u otro del punto,
   * que falla cuando la quieres justo debajo o encima.
   */
  align?: "izquierda" | "derecha";
}

interface ImageCalloutsProps {
  /** Imagen de fondo. Ruta local, no un CDN ajeno. */
  src: string;
  /** Descripcion de la imagen para lectores de pantalla. */
  alt: string;
  callouts: Callout[];
  /** ms entre un callout y el siguiente. */
  stagger?: number;
  /** Color por defecto de puntos y lineas. */
  accent?: string;
  /** false = re-anima cada vez que entra en pantalla. */
  once?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Imagen anotada: puntos sobre la foto, lineas guia que salen de ellos y
 * etiquetas al final de cada linea, entrando en secuencia.
 *
 * Cada callout entra en tres tiempos — punto, linea, etiqueta — y los callouts
 * entre si van escalonados. Todo con transiciones CSS y retrasos calculados:
 * sin timers, sin dependencias npm.
 *
 * Las coordenadas van en porcentaje, asi que la anotacion sigue a la imagen
 * cuando el contenedor cambia de tamano.
 */
export function ImageCallouts({
  src,
  alt,
  callouts,
  stagger = 420,
  accent = "#e11d48",
  once = true,
  className,
  children,
}: ImageCalloutsProps) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [menosMovimiento, setMenosMovimiento] = useState(false);

  useEffect(() => {
    setMenosMovimiento(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
  }, []);

  // Tamano real en px. Antes el SVG usaba un viewBox 0-100 estirado con
  // preserveAspectRatio="none": con eso el dasharray queda en pixeles de
  // pantalla mientras pathLength normaliza en unidades del path, las dos
  // escalas se pelean y la linea sale a trozos. Ademas las diagonales salian
  // deformadas. Midiendo el contenedor, el SVG trabaja en px y todo cuadra.
  const [tam, setTam] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const nodo = contenedor.current;
    if (!nodo || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) =>
      setTam({ w: e.contentRect.width, h: e.contentRect.height })
    );
    ro.observe(nodo);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const nodo = contenedor.current;
    if (!nodo) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        } else if (!once) setVisible(false);
      },
      { threshold: 0.25 }
    );
    obs.observe(nodo);
    return () => obs.disconnect();
  }, [once]);

  const t = (ms: number) => (menosMovimiento ? 0 : ms);
  const codoPx = 26; // largo del tramo horizontal antes de la etiqueta

  return (
    <div
      ref={contenedor}
      className={cn("relative overflow-hidden rounded-2xl", className)}
    >
      <img src={src} alt={alt} className="block h-full w-full object-cover" />

      {/* Las lineas guia van en un SVG que cubre todo, en coordenadas 0-100
          para que coincidan con los % de los puntos y las etiquetas. */}
      <svg
        viewBox={`0 0 ${tam.w || 1} ${tam.h || 1}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {callouts.map((c, i) => {
          const color = c.color ?? accent;
          const haciaDerecha = c.align
            ? c.align === "derecha"
            : c.labelX > c.x;

          // % -> px
          const px = (v: number) => (v / 100) * tam.w;
          const py = (v: number) => (v / 100) * tam.h;

          const x0 = px(c.x);
          const y0 = py(c.y);
          const xf = px(c.labelX);
          const yf = py(c.labelY);
          // Codo: tramo horizontal corto antes de llegar a la etiqueta.
          const xc = xf + (haciaDerecha ? -codoPx : codoPx);

          // Largo exacto de la polilinea: no hace falta getTotalLength(),
          // son dos segmentos y conocemos los tres puntos.
          const largo =
            Math.hypot(xc - x0, yf - y0) + Math.abs(xf - xc);

          return (
            <path
              key={i}
              d={`M ${x0} ${y0} L ${xc} ${yf} L ${xf} ${yf}`}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={largo}
              strokeDashoffset={visible ? 0 : largo}
              style={{
                transition: `stroke-dashoffset ${t(380)}ms ease-out ${t(
                  i * stagger + 140
                )}ms`,
              }}
            />
          );
        })}
      </svg>

      {/* Puntos */}
      {callouts.map((c, i) => {
        const color = c.color ?? accent;
        const estilo: CSSProperties = {
          left: `${c.x}%`,
          top: `${c.y}%`,
          opacity: visible ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.3})`,
          transition:
            `opacity ${t(260)}ms ease-out ${t(i * stagger)}ms, ` +
            `transform ${t(380)}ms cubic-bezier(.22,1,.36,1) ${t(i * stagger)}ms`,
        };
        return (
          <span
            key={i}
            style={estilo}
            className="pointer-events-none absolute block"
            aria-hidden="true"
          >
            <span className="relative flex size-4 items-center justify-center">
              <span
                className="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                style={{ backgroundColor: color }}
              />
              <span
                className="relative inline-flex size-3 rounded-full ring-2 ring-white/90"
                style={{ backgroundColor: color }}
              />
            </span>
          </span>
        );
      })}

      {/* Etiquetas */}
      {callouts.map((c, i) => {
        const color = c.color ?? accent;
        const haciaDerecha = c.align ? c.align === "derecha" : c.labelX > c.x;
        const estilo: CSSProperties = {
          left: `${c.labelX}%`,
          top: `${c.labelY}%`,
          borderColor: color,
          opacity: visible ? 1 : 0,
          transform: `translate(${haciaDerecha ? "0" : "-100%"}, -50%) translateY(${
            visible ? "0" : "6px"
          })`,
          transition:
            `opacity ${t(320)}ms ease-out ${t(i * stagger + 380)}ms, ` +
            `transform ${t(460)}ms cubic-bezier(.22,1,.36,1) ${t(
              i * stagger + 380
            )}ms`,
        };
        return (
          <div
            key={i}
            style={estilo}
            className="absolute w-max max-w-[34%] border-l-[3px] bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm"
          >
            <p className="text-[13px] font-semibold leading-tight text-neutral-900">
              {c.title}
            </p>
            {c.detail && (
              <p className="mt-0.5 text-[11px] leading-snug text-neutral-600">
                {c.detail}
              </p>
            )}
          </div>
        );
      })}

      {children}
    </div>
  );
}
