import { useEffect, useRef, useState, type ReactNode } from "react";

export type MenuOption = {
  /** Texto de la opción. */
  label: string;
  /** Línea chica bajo la opción (opcional). */
  detail?: string;
  onSelect: () => void;
  disabled?: boolean;
};

/** Botón que abre una lista corta de acciones (por ejemplo «Exportar»: Excel, PDF; o «Más»: Editar, Quitar).
 *  Sirve para dejar una sola acción a la vista y guardar el resto. Se cierra al elegir, con Escape (el foco
 *  vuelve al botón) o con un clic afuera. Sin opciones no se dibuja. */
export function MenuButton({
  label,
  options,
  className = "inline-flex min-h-[40px] items-center gap-1 rounded-md border border-neutral-700 px-3 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-800 disabled:opacity-50",
  disabled = false,
  align = "left",
}: {
  label: ReactNode;
  options: MenuOption[];
  className?: string;
  disabled?: boolean;
  /** Hacia qué lado se abre la lista: «right» para botones pegados al borde derecho. */
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (e: MouseEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); button.current?.focus(); } };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", key); };
  }, [open]);

  if (options.length === 0) return null;
  return (
    <div ref={root} className="relative">
      <button ref={button} type="button" className={className} aria-haspopup="menu" aria-expanded={open} disabled={disabled} onClick={() => setOpen((v) => !v)}>
        {label} <span aria-hidden="true" className="text-[10px]">▾</span>
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute top-full z-40 mt-1 w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-neutral-800 bg-neutral-900 p-1 shadow-lg ${align === "right" ? "right-0" : "left-0"}`}
        >
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              role="menuitem"
              disabled={o.disabled}
              onClick={() => { setOpen(false); o.onSelect(); }}
              className="flex min-h-[40px] w-full flex-col justify-center rounded-md px-3 py-1.5 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:opacity-50"
            >
              {o.label}
              {o.detail && <span className="text-xs text-neutral-500">{o.detail}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
