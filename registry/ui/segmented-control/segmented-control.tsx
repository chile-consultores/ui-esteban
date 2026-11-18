import { useEffect, useRef, type KeyboardEvent } from "react";

export type SegmentedOption = {
  value: string;
  label: string;
  /** Detalle corto al lado del texto («212»). */
  detail?: string;
  /** Cómo se lee el detalle en lector de pantalla («212 visitas»). */
  detailLong?: string;
};

/** Control segmentado de una sola elección (radiogroup, patrón de la ARIA APG).
 *  - Flechas, Inicio y Fin cambian la elección y mueven el foco; solo la elegida está en el orden de tabulación.
 *  - No se envuelve: con muchas opciones hace scroll horizontal propio y trae la elegida a la vista sin mover la página.
 *  - 44 px de alto en pantallas táctiles (36 px desde `sm`). */
export function SegmentedControl({ label, options, value, onChange, className = "" }: {
  /** Nombre del grupo para lectores de pantalla. */
  label: string;
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const group = useRef<HTMLDivElement>(null);
  const focusNext = useRef(false);

  useEffect(() => {
    const el = refs.current[value];
    const g = group.current;
    if (!el || !g) return;
    const left = el.offsetLeft - g.offsetLeft;
    if (left < g.scrollLeft) g.scrollLeft = left - 8;
    else if (left + el.offsetWidth > g.scrollLeft + g.clientWidth) g.scrollLeft = left + el.offsetWidth - g.clientWidth + 8;
    if (focusNext.current) { el.focus({ preventScroll: true }); focusNext.current = false; }
  }, [value]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = options.findIndex((o) => o.value === value);
    const to =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % options.length
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + options.length) % options.length
      : e.key === "Home" ? 0
      : e.key === "End" ? options.length - 1
      : -1;
    if (to < 0 || options.length === 0) return;
    e.preventDefault();
    focusNext.current = true;
    if (options[to].value !== value) onChange(options[to].value);
    else refs.current[value]?.focus({ preventScroll: true });
  }

  return (
    <div ref={group} role="radiogroup" aria-label={label} onKeyDown={onKeyDown}
      className={`-mx-1 flex min-w-0 flex-nowrap items-center gap-1.5 overflow-x-auto px-1 py-1 ${className}`}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} ref={(el) => { refs.current[o.value] = el; }} type="button" role="radio" aria-checked={active}
            tabIndex={active ? 0 : -1}
            aria-label={o.detailLong ? `${o.label}, ${o.detailLong}` : undefined}
            className={`min-h-[44px] shrink-0 whitespace-nowrap rounded-full border px-3 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 sm:min-h-[36px] ${active ? "border-sky-400/50 bg-sky-400/15 text-sky-300" : "border-neutral-700 text-neutral-300 hover:text-white"}`}
            onClick={() => { if (!active) onChange(o.value); }}>
            {o.label}{o.detail != null && <span className={`tabular-nums ${active ? "" : "text-neutral-400"}`}> · {o.detail}</span>}
          </button>
        );
      })}
    </div>
  );
}
