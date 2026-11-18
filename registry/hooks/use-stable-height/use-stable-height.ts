import { useLayoutEffect, useRef, type RefObject } from "react";

/** Mientras `loading`, el elemento mantiene el último alto medido (nada se colapsa ni salta); al terminar pasa al alto
 *  real con una transición corta. Sin transición con prefers-reduced-motion. Funciona también en hijos `flex-1`
 *  (suelta el flex mientras dura la transición). */
export function useStableHeight(ref: RefObject<HTMLElement | null>, loading: boolean, durationMs = 200) {
  const last = useRef<number | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (loading) {
      last.current = el.getBoundingClientRect().height;
      el.style.minHeight = `${last.current}px`;
      return;
    }
    const before = last.current;
    last.current = null;
    el.style.minHeight = "";
    if (before == null) return;
    const after = el.getBoundingClientRect().height;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (Math.abs(after - before) < 1 || reduced) return;
    el.style.flex = "none";
    el.style.height = `${before}px`;
    el.style.overflow = "hidden";
    void el.offsetHeight; // fija el alto de partida
    el.style.transition = `height ${durationMs}ms cubic-bezier(.2,.9,.3,1)`;
    el.style.height = `${after}px`;
    const done = () => { el.style.flex = ""; el.style.height = ""; el.style.overflow = ""; el.style.transition = ""; };
    const t = window.setTimeout(done, durationMs + 50);
    return () => { window.clearTimeout(t); done(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
}
