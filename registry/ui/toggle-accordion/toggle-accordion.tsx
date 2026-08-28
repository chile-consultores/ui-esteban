import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export interface AccordionItem {
  /** Identificador estable. Sin esto se usa el indice. */
  id?: string;
  title: string;
  content: ReactNode;
}

interface ToggleAccordionProps {
  items: AccordionItem[];
  /** Indice abierto al montar. `null` = todos cerrados. Solo sin `open`. */
  defaultOpen?: number | null;
  /** Modo controlado: el indice abierto. */
  open?: number | null;
  /** Avisa el nuevo indice abierto, o `null` si se cerro. */
  onOpenChange?: (index: number | null) => void;
  /** false = clic sobre el abierto no lo cierra; siempre queda uno abierto. */
  collapsible?: boolean;
  /**
   * Duracion del gesto completo en ms. Los tiempos internos son proporciones
   * de este valor, tal como salen del original (ver README).
   */
  duration?: number;
  /** Curva de la animacion. El original trae `cubic-bezier(.42,0,1,1)`. */
  easing?: string;
  /** Cuanto sube el contenido al entrar, en px. */
  slide?: number;
  /** Icono del estado abierto. Por defecto un chevron hacia arriba. */
  iconOpen?: ReactNode;
  /** Icono del estado cerrado. Por defecto un chevron hacia abajo. */
  iconClosed?: ReactNode;
  className?: string;
  itemClassName?: string;
  headerClassName?: string;
  panelClassName?: string;
}

/**
 * Proporciones sacadas del timeline original (300 ms de gesto):
 * - alto y desplazamiento del contenido: 0 -> 300 ms
 * - opacidad del contenido al ABRIR:  100 -> 300 ms   (entra tarde, termina con el movimiento)
 * - opacidad del contenido al CERRAR:   0 -> 200 ms   (se va temprano, el movimiento la tapa)
 * - icono que se va:   0 -> 140 ms
 * - icono que llega: 140 -> 300 ms
 * Esa asimetria es lo que hace que el texto siempre quede "dentro" del gesto.
 */
const R = {
  opacidadEntraDesde: 100 / 300,
  opacidadEntraDura: 200 / 300,
  opacidadSaleDura: 200 / 300,
  /** El icono que se va: siempre 140 ms desde el arranque, abriendo y cerrando. */
  iconoSaleDura: 140 / 300,
  /** El que llega al ABRIR: entra en 140 y dura 160. */
  iconoEntraAbreDesde: 140 / 300,
  iconoEntraAbreDura: 160 / 300,
  /** El que llega al CERRAR: entra en 160 y dura 140. El original no es simetrico. */
  iconoEntraCierraDesde: 160 / 300,
  iconoEntraCierraDura: 140 / 300,
};

function ChevronAbajo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronArriba() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
      <path
        d="m18 15-6-6-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Acordeon de una sola tarjeta abierta a la vez, con los tiempos del template
 * "Dropdown menu - animated text with toggle effect" rehechos en codigo.
 *
 * Sin dependencias npm. El alto del panel se mide con un ResizeObserver, asi
 * que el contenido puede ser cualquier cosa y de cualquier largo: no hay
 * max-height inventado ni saltos cuando el texto cambia o el ancho reflow-ea.
 *
 * Accesible como disclosure: el encabezado es un `<button>` de verdad con
 * `aria-expanded` y `aria-controls`, el panel es una `region` etiquetada por su
 * encabezado, el panel cerrado queda `inert` (fuera del foco y del lector), y
 * las flechas arriba/abajo, Home y End mueven el foco entre encabezados.
 *
 * Con `prefers-reduced-motion: reduce` el cambio es instantaneo.
 */
export function ToggleAccordion({
  items,
  defaultOpen = null,
  open,
  onOpenChange,
  collapsible = true,
  duration = 300,
  easing = "cubic-bezier(.22,1,.36,1)",
  slide = 27,
  iconOpen,
  iconClosed,
  className,
  itemClassName,
  headerClassName,
  panelClassName,
}: ToggleAccordionProps) {
  const base = useId();
  const controlado = open !== undefined;
  const [interno, setInterno] = useState<number | null>(defaultOpen);
  const abierto = controlado ? open : interno;

  const [menosMovimiento, setMenosMovimiento] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revisar = () => setMenosMovimiento(mq.matches);
    revisar();
    mq.addEventListener("change", revisar);
    return () => mq.removeEventListener("change", revisar);
  }, []);

  // Sin transiciones en el primer pintado: un item abierto por defecto tiene
  // que aparecer ya abierto, no animandose solo al montar.
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setListo(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const d = menosMovimiento || !listo ? 0 : duration;

  const alternar = useCallback(
    (i: number) => {
      const siguiente = abierto === i && collapsible ? null : i;
      if (!controlado) setInterno(siguiente);
      onOpenChange?.(siguiente);
    },
    [abierto, collapsible, controlado, onOpenChange]
  );

  // Navegacion por teclado entre encabezados (patron APG de acordeon).
  const encabezados = useRef<Array<HTMLButtonElement | null>>([]);
  const alTeclear = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = items.length;
    let destino: number | null = null;
    if (e.key === "ArrowDown") destino = (i + 1) % n;
    else if (e.key === "ArrowUp") destino = (i - 1 + n) % n;
    else if (e.key === "Home") destino = 0;
    else if (e.key === "End") destino = n - 1;
    if (destino === null) return;
    e.preventDefault();
    encabezados.current[destino]?.focus();
  };

  return (
    <div className={cn("w-full", className)}>
      {items.map((item, i) => {
        const esta = abierto === i;
        const idEncabezado = `${base}-e${i}`;
        const idPanel = `${base}-p${i}`;
        return (
          <Fila
            key={item.id ?? i}
            item={item}
            abierta={esta}
            duracion={d}
            easing={easing}
            slide={slide}
            iconOpen={iconOpen ?? <ChevronArriba />}
            iconClosed={iconClosed ?? <ChevronAbajo />}
            idEncabezado={idEncabezado}
            idPanel={idPanel}
            onToggle={() => alternar(i)}
            onKeyDown={(e) => alTeclear(e, i)}
            refEncabezado={(nodo) => {
              encabezados.current[i] = nodo;
            }}
            className={itemClassName}
            headerClassName={headerClassName}
            panelClassName={panelClassName}
          />
        );
      })}
    </div>
  );
}

interface FilaProps {
  item: AccordionItem;
  abierta: boolean;
  duracion: number;
  easing: string;
  slide: number;
  iconOpen: ReactNode;
  iconClosed: ReactNode;
  idEncabezado: string;
  idPanel: string;
  onToggle: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  refEncabezado: (nodo: HTMLButtonElement | null) => void;
  className?: string;
  headerClassName?: string;
  panelClassName?: string;
}

function Fila({
  item,
  abierta,
  duracion,
  easing,
  slide,
  iconOpen,
  iconClosed,
  idEncabezado,
  idPanel,
  onToggle,
  onKeyDown,
  refEncabezado,
  className,
  headerClassName,
  panelClassName,
}: FilaProps) {
  const contenido = useRef<HTMLDivElement>(null);
  const [alto, setAlto] = useState(0);

  // El alto real del contenido, medido. El panel cerrado tiene alto 0 con
  // overflow oculto, pero el hijo sigue maquetando a su alto natural, asi que
  // la medida vale igual estando cerrado.
  useEffect(() => {
    const nodo = contenido.current;
    if (!nodo || typeof ResizeObserver === "undefined") return;
    // borderBoxSize, no contentRect: el contenido lleva padding y contentRect
    // lo deja fuera, asi que el panel cerraria 24 px mas corto de lo que mide.
    const ro = new ResizeObserver(([e]) => {
      const caja = e.borderBoxSize?.[0]?.blockSize;
      setAlto(caja ?? nodo.getBoundingClientRect().height);
    });
    ro.observe(nodo);
    setAlto(nodo.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, []);

  const ms = (v: number) => `${Math.round(v)}ms`;

  return (
    <div className={cn("border-b border-white/10 last:border-b-0", className)}>
      <h3 className="m-0">
        <button
          ref={refEncabezado}
          type="button"
          id={idEncabezado}
          aria-expanded={abierta}
          aria-controls={idPanel}
          onClick={onToggle}
          onKeyDown={onKeyDown}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-4 bg-transparent px-8 py-6 text-left",
            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white/60",
            headerClassName
          )}
        >
          <span className="text-2xl font-semibold tracking-tight text-white">
            {item.title}
          </span>

          {/* Relevo de iconos, no rotacion: el que se va cae a cero en el 47 %
              del gesto y recien ahi entra el otro. Ese bajon es del original. */}
          <span
            aria-hidden="true"
            className="relative block size-6 shrink-0 text-white/70"
          >
            <span
              className="absolute inset-0 block"
              style={{
                opacity: abierta ? 1 : 0,
                transition: abierta
                  ? `opacity ${ms(duracion * R.iconoEntraAbreDura)} ${easing} ${ms(
                      duracion * R.iconoEntraAbreDesde
                    )}`
                  : `opacity ${ms(duracion * R.iconoSaleDura)} ${easing} 0ms`,
              }}
            >
              {iconOpen}
            </span>
            <span
              className="absolute inset-0 block"
              style={{
                opacity: abierta ? 0 : 1,
                transition: abierta
                  ? `opacity ${ms(duracion * R.iconoSaleDura)} ${easing} 0ms`
                  : `opacity ${ms(duracion * R.iconoEntraCierraDura)} ${easing} ${ms(
                      duracion * R.iconoEntraCierraDesde
                    )}`,
              }}
            >
              {iconClosed}
            </span>
          </span>
        </button>
      </h3>

      <div
        id={idPanel}
        role="region"
        aria-labelledby={idEncabezado}
        inert={!abierta}
        style={{
          height: abierta ? alto : 0,
          overflow: "hidden",
          transition: `height ${ms(duracion)} ${easing}`,
        }}
      >
        <div
          ref={contenido}
          style={{
            transform: `translateY(${abierta ? 0 : -slide}px)`,
            opacity: abierta ? 1 : 0,
            transition:
              `transform ${ms(duracion)} ${easing}, ` +
              // Al abrir la opacidad arranca tarde y termina con el movimiento;
              // al cerrar arranca ya y termina antes. El texto nunca se ve
              // flotando fuera del panel.
              `opacity ${ms(
                abierta
                  ? duracion * R.opacidadEntraDura
                  : duracion * R.opacidadSaleDura
              )} ${easing} ${ms(abierta ? duracion * R.opacidadEntraDesde : 0)}`,
          }}
          className={cn("px-8 pb-6 text-white/55", panelClassName)}
        >
          {item.content}
        </div>
      </div>
    </div>
  );
}
