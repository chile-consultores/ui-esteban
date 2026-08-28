import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { cn } from "@/lib/utils";

interface WordmarkCollapseProps {
  /** Las palabras del logo. La inicial de cada una es lo que queda. */
  words?: string[];
  /** Pixeles de scroll a partir de los cuales colapsa. Ignorado si pasas `collapsed`. */
  collapseAfter?: number;
  /** Estado controlado. Si lo pasas, tu mandas. */
  collapsed?: boolean;
  /** Cuanto se montan las iniciales al colapsar, en em. 0 = solo se juntan. */
  overlap?: number;
  /** Cuanto crecen las iniciales al colapsar. 1 = no crecen. */
  scale?: number;
  /** Separacion normal entre palabras, en em. */
  gap?: number;
  duration?: number;
  className?: string;
}

/**
 * Logo de texto que colapsa a su monograma: "Chile Consultores" -> "CC".
 *
 * NO es un morph. Un morph real entre letras distintas interpola trazos que no
 * se corresponden y produce una papilla que se retuerce. Aca es coreografia:
 * el resto de cada palabra se encoge hasta ancho cero mientras las iniciales
 * —que nunca se fueron— se juntan, se montan y crecen. Se lee como
 * transformacion y el texto sigue siendo texto real, seleccionable y
 * traducible.
 *
 * Pensado para el logo de un header que se achica al bajar.
 */
export function WordmarkCollapse({
  words = ["Chile", "Consultores"],
  collapseAfter = 80,
  collapsed,
  overlap = 0.18,
  scale = 1.1,
  gap = 0.28,
  duration = 420,
  className,
}: WordmarkCollapseProps) {
  const controlado = collapsed !== undefined;
  const [porScroll, setPorScroll] = useState(false);
  const colapsado = controlado ? collapsed : porScroll;

  const [menosMovimiento, setMenosMovimiento] = useState(false);
  useEffect(() => {
    setMenosMovimiento(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
  }, []);

  // --- scroll ---------------------------------------------------------------
  useEffect(() => {
    if (controlado) return;

    let pendiente = false;
    const alScrollear = () => {
      if (pendiente) return;
      pendiente = true;
      // Leer scrollY en un rAF: el evento de scroll dispara decenas de veces
      // por segundo y hacer setState en cada uno es tiron asegurado.
      requestAnimationFrame(() => {
        setPorScroll(window.scrollY > collapseAfter);
        pendiente = false;
      });
    };

    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, [controlado, collapseAfter]);

  // --- medir las colas ------------------------------------------------------
  // Para animar el ancho a cero hay que saber de cuanto parte. `max-width` en
  // `ch` o en % no sirve: depende de la fuente. Se mide el ancho real una vez.
  const colas = useRef<(HTMLSpanElement | null)[]>([]);
  const [anchos, setAnchos] = useState<number[] | null>(null);

  useLayoutEffect(() => {
    const medidos = colas.current.map((n) => n?.scrollWidth ?? 0);
    setAnchos(medidos);
  }, [words.join("|")]);

  const dur = menosMovimiento ? 0 : duration;
  const suave = `cubic-bezier(.22,1,.36,1)`;

  return (
    <span
      className={cn("inline-flex items-baseline whitespace-nowrap", className)}
      /* El texto accesible siempre es el nombre completo, colapsado o no:
         un lector de pantalla no debe leer "C C". */
      aria-label={words.join(" ")}
    >
      {words.map((palabra, i) => {
        const inicial = palabra.slice(0, 1);
        const cola = palabra.slice(1);

        const estiloPalabra: CSSProperties = {
          marginLeft: i === 0 ? 0 : `${colapsado ? -overlap : gap}em`,
          transition: `margin-left ${dur}ms ${suave}`,
        };

        const estiloInicial: CSSProperties = {
          display: "inline-block",
          transform: `scale(${colapsado ? scale : 1})`,
          transformOrigin: "left bottom",
          transition: `transform ${dur}ms ${suave}`,
        };

        const estiloCola: CSSProperties = {
          display: "inline-block",
          overflow: "hidden",
          verticalAlign: "bottom",
          // Antes de medir, ancho natural. Despues, el medido o cero.
          maxWidth:
            anchos === null ? undefined : colapsado ? 0 : `${anchos[i]}px`,
          opacity: colapsado ? 0 : 1,
          transition:
            `max-width ${dur}ms ${suave}, opacity ${Math.round(dur * 0.6)}ms ease-out`,
        };

        return (
          <span key={i} style={estiloPalabra} aria-hidden="true">
            <span style={estiloInicial}>{inicial}</span>
            <span
              ref={(n) => {
                colas.current[i] = n;
              }}
              style={estiloCola}
            >
              {cola}
            </span>
          </span>
        );
      })}
    </span>
  );
}
