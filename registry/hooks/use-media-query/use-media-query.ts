import { useEffect, useState } from "react";

/**
 * Reacciona a una media query desde React.
 *
 * @example
 * const esChico = useMediaQuery("(max-width: 768px)");
 * const menosMovimiento = useMediaQuery("(prefers-reduced-motion: reduce)");
 *
 * // Uso típico: no montar un shader en móvil ni si el usuario pidió menos movimiento
 * if (esChico || menosMovimiento) return <FondoEstatico />;
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Guard para SSR / entornos sin window
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
