import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

/** Que la página no salte al cambiar filtros: mantiene en su lugar la tarjeta que el usuario está mirando mientras
 *  las de arriba cambian de alto (cargan datos nuevos, se achican, crecen).
 *
 *  - Al cambiar `key`, elige la tarjeta mirada: la primera `item` (por defecto `[data-anchor]`) que empieza a la vista
 *    bajo lo pegado arriba (los `sticky` que están pegados ahora, por defecto `[data-sticky]`). Si una sola tarjeta
 *    llena la pantalla, esa.
 *  - Toma esa foto al tocar o teclear (antes de que React pinte el cambio) y corrige el scroll en cada cuadro y con
 *    ResizeObserver. Si `key` vuelve a cambiar enseguida (filtro y luego sub-filtro), sigue con la misma tarjeta.
 *  - Nunca hace scroll por su cuenta a otro lugar. Se suelta si el scroll cambia por otra cosa (rueda, toque, teclas
 *    de página, barra de scroll) o a los `maxMs`. Mientras corrige apaga el anclaje propio del navegador. */
export type ScrollAnchorOptions = {
  /** Selector de las tarjetas que se pueden anclar. */
  item?: string;
  /** Selector de lo que queda pegado arriba (sticky). */
  sticky?: string;
  /** Alto fijo de arriba que no es sticky medible (p. ej. un encabezado `fixed`), en px. */
  topOffset?: number;
  /** Tiempo máximo corrigiendo, en ms. */
  maxMs?: number;
};

const SCROLL_KEYS = new Set(["PageUp", "PageDown", "Home", "End", " "]);
const SNAPSHOT_MS = 1000;
const REUSE_MS = 2000;

function visibleTop(sticky: string, topOffset: number): number {
  let top = topOffset;
  document.querySelectorAll<HTMLElement>(sticky).forEach((el) => {
    const r = el.getBoundingClientRect();
    const stuckAt = parseFloat(getComputedStyle(el).top);
    // Solo lo que está pegado ahora, no lo que va en el flujo más abajo.
    if (r.height > 0 && Number.isFinite(stuckAt) && Math.abs(r.top - stuckAt) < 2) top = Math.max(top, r.bottom);
  });
  return top;
}

function pickAnchor(items: HTMLElement[], sticky: string, topOffset: number): HTMLElement | undefined {
  const top = visibleTop(sticky, topOffset);
  const inView = (t: HTMLElement) => { const r = t.getBoundingClientRect(); return r.top >= top - 1 && r.top < window.innerHeight; };
  return items.find(inView) ?? items.find((t) => t.getBoundingClientRect().bottom > top + 8);
}

export function useScrollAnchor(container: RefObject<HTMLElement | null>, key: string, options: ScrollAnchorOptions = {}) {
  const { item = "[data-anchor]", sticky = "[data-sticky]", topOffset = 0, maxMs = 6000 } = options;
  const first = useRef(true);
  const current = useRef<{ anchor: HTMLElement; y0: number; released: boolean; since: number } | null>(null);
  const snapshot = useRef<{ anchor: HTMLElement; top: number; t: number } | null>(null);

  useEffect(() => {
    const take = () => {
      const c = container.current;
      const a = c ? pickAnchor(Array.from(c.querySelectorAll<HTMLElement>(item)), sticky, topOffset) : undefined;
      snapshot.current = a ? { anchor: a, top: a.getBoundingClientRect().top, t: performance.now() } : null;
    };
    window.addEventListener("pointerdown", take, true);
    window.addEventListener("keydown", take, true);
    return () => { window.removeEventListener("pointerdown", take, true); window.removeEventListener("keydown", take, true); };
  }, [container, item, sticky, topOffset]);

  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    const c = container.current;
    if (!c || typeof ResizeObserver === "undefined") return;
    const items = Array.from(c.querySelectorAll<HTMLElement>(item));
    const prev = current.current && !current.current.released && current.current.anchor.isConnected && performance.now() - current.current.since < REUSE_MS ? current.current : null;
    const snap = snapshot.current && snapshot.current.anchor.isConnected && performance.now() - snapshot.current.t < SNAPSHOT_MS ? snapshot.current : null;
    snapshot.current = null;
    const anchor = prev?.anchor ?? snap?.anchor ?? pickAnchor(items, sticky, topOffset);
    if (!anchor) return;
    const state = { anchor, y0: prev?.y0 ?? snap?.top ?? anchor.getBoundingClientRect().top, released: false, since: performance.now() };
    current.current = state;
    let active = true;
    let expected = window.scrollY;
    const fix = () => {
      if (!active || !anchor.isConnected) return;
      const d = anchor.getBoundingClientRect().top - state.y0;
      if (Math.abs(d) > 0.5) window.scrollBy(0, d);
      expected = window.scrollY;
    };
    const root = document.documentElement;
    const prevAnchoring = root.style.overflowAnchor;
    root.style.overflowAnchor = "none";
    const ro = new ResizeObserver(fix);
    ro.observe(document.body);
    ro.observe(c);
    items.forEach((t) => ro.observe(t));
    let frame = requestAnimationFrame(function step() { fix(); if (active) frame = requestAnimationFrame(step); });
    const release = () => { active = false; state.released = true; root.style.overflowAnchor = prevAnchoring; };
    const onScroll = () => { if (Math.abs(window.scrollY - expected) > 2) release(); };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (SCROLL_KEYS.has(e.key) && !(t && t.closest("input, textarea, select, button, [role=radio], [role=tab]"))) release();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchmove", release, { passive: true });
    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(release, maxMs);
    if (prev || snap) fix();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      root.style.overflowAnchor = prevAnchoring;
      ro.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", onKey);
    };
    // Solo al cambiar la clave.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
