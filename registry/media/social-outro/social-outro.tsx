import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export interface RedSocial {
  /** Nombre de la red, para el texto accesible. Ej: "Instagram". */
  red: string;
  /** La manija tal como se muestra. Ej: "@chileconsultores". */
  handle: string;
  /** URL del perfil. Sin esto la manija no es un enlace, solo texto. */
  href?: string;
  /** El icono. Lo pones tu: asi el componente no arrastra dependencias. */
  icon?: ReactNode;
}

interface SocialOutroProps {
  headline: string;
  subheadline?: string;
  socials: RedSocial[];
  /** Imagen de fondo. Local, no un CDN ajeno. Opcional. */
  image?: string;
  alt?: string;
  /** Colores del panel. Dos o mas, se reparten en el degradado. */
  gradient?: string[];
  /** ms entre una red y la siguiente. */
  stagger?: number;
  /**
   * Cuando entra el panel de degradado, en ms. El titulo entra en 0, sobre
   * la foto; el panel llega despues y arrastra al subtitulo y las redes.
   * Ese es el orden del original: primero el titulo, luego el color.
   */
  panelDelay?: number;
  /** Cuanto hace zoom la foto de fondo mientras dura todo. 1 = sin zoom. */
  photoZoom?: number;
  /**
   * Velo oscuro sobre la foto (0-1). El titulo entra en blanco ANTES de que
   * llegue el panel, asi que si la foto es clara desaparece. Con el velo se
   * lee sobre cualquier imagen. Pon 0 solo si tu foto ya es oscura.
   */
  scrim?: number;
  once?: boolean;
  className?: string;
}

/**
 * Cierre de "siguenos": un panel con degradado entra en diagonal sobre el
 * fondo y revela el titulo y las redes, en secuencia.
 *
 * La diferencia con hacerlo en Lottie o en video: aca las manijas son
 * enlaces de verdad. En un archivo animado son pixeles — se ven, no se
 * pueden pulsar.
 *
 * Cero dependencias npm. El panel anima solo `transform`, asi que no
 * recalcula layout en cada fotograma.
 */
export function SocialOutro({
  headline,
  subheadline,
  socials,
  image,
  alt = "",
  gradient = ["#c0246a", "#7c3aed", "#2b3fd6"],
  stagger = 160,
  panelDelay = 820,
  photoZoom = 1.07,
  scrim = 0.45,
  once = true,
  className,
}: SocialOutroProps) {
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
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        } else if (!once) setVisible(false);
      },
      { threshold: 0.4 }
    );
    obs.observe(nodo);
    return () => obs.disconnect();
  }, [once]);

  const t = (ms: number) => (menosMovimiento ? 0 : ms);

  // Nombre unico para los keyframes: si hay dos de estos en la pagina, el
  // segundo pisaria la animacion del primero. Se limpia porque useId trae
  // caracteres que no valen en un identificador CSS.
  const anim = `outro-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const suave = "cubic-bezier(.22,1,.36,1)";

  /** Entrada de una pieza, con su retraso propio en ms. */
  const entra = (retraso: number, desplazamiento = 14): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : `translateY(${desplazamiento}px)`,
    transition:
      `opacity ${t(460)}ms ease-out ${t(retraso)}ms, ` +
      `transform ${t(620)}ms ${suave} ${t(retraso)}ms`,
  });

  return (
    <div
      ref={contenedor}
      className={cn(
        "relative isolate aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900",
        className
      )}
    >
      {image && (
        <img
          src={image}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            // Zoom lento desde el primer instante, corriendo por debajo de
            // todo lo demas. Sin esto la foto se ve congelada y el corte
            // entre "foto quieta" y "panel entrando" se nota.
            transform: `scale(${visible && !menosMovimiento ? photoZoom : 1})`,
            transition: `transform ${t(2600)}ms cubic-bezier(.33,.4,.2,1)`,
          }}
        />
      )}

      {image && scrim > 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,${scrim + 0.15}), rgba(0,0,0,${scrim * 0.6}))`,
          }}
        />
      )}

      {/* El panel. Solo se mueve con transform; el borde diagonal es un
          clip-path fijo, no animado — animar clip-path es caro. */}
      {/* El panel NO se desliza: se DEFORMA. Sube como un triangulo con el
          pico al centro, los hombros se levantan hasta volverlo un pentagono,
          y al llegar arriba el pico se aplana — sin pasarse de largo.
          Es interpolacion de clip-path entre poligonos de 5 vertices; todos
          los estados tienen el mismo numero de puntos, si no el navegador no
          sabe interpolar y salta.
          Va en <style> y no inline porque son varios keyframes, no dos
          estados: una `transition` solo puede ir de A a B. */}
      <style>{`
        @keyframes ${anim} {
          0% { clip-path: polygon(0% 100.0%, 50% 100.0%, 100% 100.0%, 100% 100%, 0% 100%); }
          5% { clip-path: polygon(0% 100.0%, 50% 82.4%, 100% 100.0%, 100% 100%, 0% 100%); }
          10% { clip-path: polygon(0% 100.0%, 50% 67.0%, 100% 100.0%, 100% 100%, 0% 100%); }
          15% { clip-path: polygon(0% 100.0%, 50% 53.6%, 100% 100.0%, 100% 100%, 0% 100%); }
          20% { clip-path: polygon(0% 100.0%, 50% 42.2%, 100% 100.0%, 100% 100%, 0% 100%); }
          25% { clip-path: polygon(0% 96.1%, 50% 32.5%, 100% 82.4%, 100% 100%, 0% 100%); }
          30% { clip-path: polygon(0% 78.1%, 50% 24.4%, 100% 67.0%, 100% 100%, 0% 100%); }
          35% { clip-path: polygon(0% 62.6%, 50% 17.8%, 100% 53.6%, 100% 100%, 0% 100%); }
          40% { clip-path: polygon(0% 49.2%, 50% 12.5%, 100% 42.2%, 100% 100%, 0% 100%); }
          45% { clip-path: polygon(0% 37.9%, 50% 8.4%, 100% 32.5%, 100% 100%, 0% 100%); }
          50% { clip-path: polygon(0% 28.5%, 50% 5.3%, 100% 24.4%, 100% 100%, 0% 100%); }
          55% { clip-path: polygon(0% 20.8%, 50% 3.1%, 100% 17.8%, 100% 100%, 0% 100%); }
          60% { clip-path: polygon(0% 14.6%, 50% 1.6%, 100% 12.5%, 100% 100%, 0% 100%); }
          65% { clip-path: polygon(0% 9.8%, 50% 0.7%, 100% 8.4%, 100% 100%, 0% 100%); }
          70% { clip-path: polygon(0% 6.2%, 50% 0.2%, 100% 5.3%, 100% 100%, 0% 100%); }
          75% { clip-path: polygon(0% 3.6%, 50% 0.0%, 100% 3.1%, 100% 100%, 0% 100%); }
          80% { clip-path: polygon(0% 1.8%, 50% 0.0%, 100% 1.6%, 100% 100%, 0% 100%); }
          85% { clip-path: polygon(0% 0.8%, 50% 0.0%, 100% 0.7%, 100% 100%, 0% 100%); }
          90% { clip-path: polygon(0% 0.2%, 50% 0.0%, 100% 0.2%, 100% 100%, 0% 100%); }
          95% { clip-path: polygon(0% 0.0%, 50% 0.0%, 100% 0.0%, 100% 100%, 0% 100%); }
          100% { clip-path: polygon(0% 0.0%, 50% 0.0%, 100% 0.0%, 100% 100%, 0% 100%); }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(120deg, ${gradient.join(", ")})`,
          clipPath: "polygon(0% 100%, 50% 100%, 100% 100%, 100% 100%, 0% 100%)",
          // OJO: timing `linear` a proposito. Un easing aqui se aplicaria
          // entre CADA par de keyframes, no a la animacion completa: la forma
          // frenaria y volveria a acelerar en cada parada, y eso se ve como
          // tirones. La curva ya esta horneada en los valores de arriba
          // (easeOutCubic muestreado en 21 pasos), asi que el movimiento es
          // uno solo, continuo.
          animation: visible
            ? `${anim} ${t(1400)}ms linear ${t(panelDelay)}ms both`
            : undefined,
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h2
          /* Entra en 0, sobre la foto, antes del panel: grande y translucido,
             encogiendo hasta su tamano final. Asi lo hace el original. */
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(1.38)",
            transition:
              // El transform dura mas que la opacidad y mas que panelDelay:
              // el titulo sigue asentandose cuando el panel ya viene subiendo,
              // asi no hay un instante en que nada se mueva.
              `opacity ${t(700)}ms ease-out ${t(100)}ms, ` +
              `transform ${t(1500)}ms ${suave} ${t(100)}ms`,
          }}
          className="text-3xl font-semibold uppercase tracking-[0.06em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-5xl"
        >
          {headline}
        </h2>

        {subheadline && (
          <p
            style={entra(panelDelay + 520)}
            className="mt-3 text-xs uppercase tracking-[0.18em] text-white/80 sm:text-sm"
          >
            {subheadline}
          </p>
        )}

        <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
          {socials.map((s, i) => {
            const contenido = (
              <>
                {s.icon && (
                  <span className="shrink-0 text-white" aria-hidden="true">
                    {s.icon}
                  </span>
                )}
                <span className="text-sm text-white/90">{s.handle}</span>
              </>
            );

            return (
              <li key={s.red + s.handle} style={entra(panelDelay + 640 + i * stagger)}>
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    /* El nombre de la red va en el texto accesible: "@marca"
                       solo, repetido cuatro veces, no dice nada. */
                    aria-label={`${s.red}: ${s.handle}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-white/10"
                  >
                    {contenido}
                  </a>
                ) : (
                  <span className="flex items-center gap-3 px-2 py-1">
                    {contenido}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
