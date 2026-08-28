import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DotGridSpotlightProps {
  /** Densidad: distancia en px entre centros de puntos. Menos px = mas denso. */
  gap?: number;
  /** Radio de cada punto en px, en reposo. */
  dotSize?: number;
  /** Color de los puntos en reposo. Cualquier color CSS, con su propia alfa. */
  color?: string;
  /** Color de los puntos iluminados. Se pinta encima del punto en reposo. */
  glowColor?: string;
  /** Velocidad del desplazamiento de la grilla, en px por segundo. 0 = quieta. */
  speed?: number;
  /** Direccion del desplazamiento en grados. 0 = derecha, 90 = abajo. */
  angle?: number;
  /** Radio de influencia del cursor en px. */
  radius?: number;
  /** Cuanto crece un punto en el centro del foco, respecto de dotSize. */
  activeScale?: number;
  /** false = no escucha el puntero, pero la grilla sigue desplazandose. */
  interactive?: boolean;
  className?: string;
  children?: ReactNode;
}

/** Puntero: solo se escribe desde el listener, solo se lee desde el rAF. */
interface Puntero {
  /** Ultimas coordenadas de viewport crudas. Escribirlas no lee layout. */
  clienteX: number;
  clienteY: number;
  /** Posicion suavizada, ya en px de dispositivo y relativa al lienzo. */
  x: number;
  y: number;
  /** Fuerza del foco, 0..1. Sube al entrar y cae suave al salir. */
  s: number;
  dentro: boolean;
  /** Primera lectura tras entrar: se salta el suavizado para no barrer la pantalla. */
  saltar: boolean;
}

const TAU = Math.PI * 2;
/** Celdas maximas que el foco recorre por fotograma. Ver el clamp en pintar(). */
const MAX_CELDAS = 3600;

/** El modo estatico se decide antes del primer pintado, sin parpadeo. */
function preferirEstatico(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

/**
 * Fondo de grilla de puntos que se desplaza lento y se ilumina alrededor del
 * cursor con caida suave. Canvas 2D, cero dependencias npm.
 *
 * Como rinde:
 * - La grilla en reposo es un patron repetido de un tile de gap x gap px. Cada
 *   fotograma es un solo fillRect trasladado, no un bucle sobre miles de puntos.
 * - El foco solo recorre las celdas dentro del radio de influencia (unas pocas
 *   decenas), calculadas por indice, sin recorrer la grilla entera.
 * - El listener de puntero solo guarda clientX/clientY en un ref: cero setState
 *   y cero lectura de layout por mousemove. El rect se lee una vez por fotograma
 *   dentro del rAF, donde ya no provoca reflow forzado.
 * - Fuera de pantalla el rAF se detiene (IntersectionObserver).
 *
 * Con `prefers-reduced-motion: reduce` o con puntero grueso (movil) no monta ni
 * el rAF ni el listener: pinta la grilla una vez y se queda ahi.
 */
export function DotGridSpotlight({
  gap = 26,
  dotSize = 1.1,
  color = "rgba(148,163,184,0.35)",
  glowColor = "rgb(226,232,240)",
  speed = 12,
  angle = 32,
  radius = 170,
  activeScale = 2.6,
  interactive = true,
  className,
  children,
}: DotGridSpotlightProps) {
  const contenedor = useRef<HTMLDivElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const [estatico, setEstatico] = useState(preferirEstatico);

  // Un solo setState en todo el ciclo de vida, y solo si el usuario cambia la
  // preferencia del sistema o enchufa un mouse a una tablet.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const consultas = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(pointer: coarse)"),
    ];
    const revisar = () => setEstatico(consultas.some((c) => c.matches));
    revisar();
    consultas.forEach((c) => c.addEventListener("change", revisar));
    return () =>
      consultas.forEach((c) => c.removeEventListener("change", revisar));
  }, []);

  useEffect(() => {
    const nodo = contenedor.current;
    const canvas = lienzo.current;
    if (!nodo || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Todo el trabajo interno va en px de dispositivo: asi el punto queda
    // nitido en pantallas retina sin escalar el patron (escalarlo lo emborrona).
    let dpr = 1;
    let ancho = 0;
    let alto = 0;
    // gap en px de dispositivo, redondeado a entero: un tile fraccionario deja
    // una costura visible al repetirse.
    let paso = 0;
    let patron: CanvasPattern | null = null;

    const puntero: Puntero = {
      clienteX: 0,
      clienteY: 0,
      x: -1e6,
      y: -1e6,
      s: 0,
      dentro: false,
      saltar: true,
    };

    const construirPatron = () => {
      paso = Math.max(2, Math.round(gap * dpr));
      const tile = document.createElement("canvas");
      tile.width = paso;
      tile.height = paso;
      const tctx = tile.getContext("2d");
      if (!tctx) return;
      tctx.fillStyle = color;
      tctx.beginPath();
      // El punto va al centro del tile: si tocara el borde, se cortaria al repetir.
      tctx.arc(
        paso / 2,
        paso / 2,
        Math.min(Math.max(0.5, dotSize * dpr), paso / 2 - 0.5),
        0,
        TAU
      );
      tctx.fill();
      patron = ctx.createPattern(tile, "repeat");
    }

    const redimensionar = () => {
      const r = nodo.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = Math.max(1, Math.round(r.width * dpr));
      alto = Math.max(1, Math.round(r.height * dpr));
      canvas.width = ancho;
      canvas.height = alto;
      construirPatron();
    }

    const pintar = (ox: number, oy: number) => {
      ctx.clearRect(0, 0, ancho, alto);

      if (patron) {
        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = patron;
        // El patron se ancla al origen trasladado, asi que este unico fillRect
        // dibuja la grilla completa ya desplazada.
        ctx.fillRect(-ox - paso, -oy - paso, ancho + paso * 2, alto + paso * 2);
        ctx.restore();
      }

      if (puntero.s <= 0.002) return;

      // Techo de trabajo por fotograma: el foco nunca recorre mas de MAX_CELDAS
      // puntos. Con gap 26 esto empieza a morder recien en radius 780, muy por
      // encima de lo usable; protege el caso gap chico + radius grande, que si
      // no serian decenas de miles de arcos por fotograma.
      const rad = Math.min(radius * dpr, (paso * Math.sqrt(MAX_CELDAS)) / 2);
      const cx = puntero.x;
      const cy = puntero.y;
      // Solo las celdas cuyo centro cae en el cuadrado del radio. Los centros
      // estan en ox + paso/2 + k*paso, con k entero.
      const kx0 = Math.ceil((cx - rad - ox - paso / 2) / paso);
      const kx1 = Math.floor((cx + rad - ox - paso / 2) / paso);
      const ky0 = Math.ceil((cy - rad - oy - paso / 2) / paso);
      const ky1 = Math.floor((cy + rad - oy - paso / 2) / paso);
      const puntoBase = Math.max(0.5, dotSize * dpr);

      ctx.fillStyle = glowColor;
      for (let kx = kx0; kx <= kx1; kx++) {
        const x = ox + paso / 2 + kx * paso;
        if (x < -paso || x > ancho + paso) continue;
        for (let ky = ky0; ky <= ky1; ky++) {
          const y = oy + paso / 2 + ky * paso;
          if (y < -paso || y > alto + paso) continue;
          const d = Math.hypot(x - cx, y - cy);
          if (d >= rad) continue;
          // smoothstep: la caida no tiene canto ni en el centro ni en el borde.
          const t = 1 - d / rad;
          const e = t * t * (3 - 2 * t) * puntero.s;
          if (e <= 0.002) continue;
          ctx.globalAlpha = e;
          ctx.beginPath();
          ctx.arc(x, y, puntoBase * (1 + (activeScale - 1) * e), 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    const ro = new ResizeObserver(() => {
      redimensionar();
      if (estatico) pintar(0, 0);
    });
    ro.observe(nodo);
    redimensionar();

    if (estatico) {
      pintar(0, 0);
      return () => ro.disconnect();
    }

    const rad = (angle * Math.PI) / 180;
    const dirX = Math.cos(rad);
    const dirY = Math.sin(rad);
    let ox = 0;
    let oy = 0;
    let ultimo = 0;
    let raf = 0;

    const cuadro = (ahora: number) => {
      // Primer fotograma y vuelta desde fuera de pantalla: dt acotado para que
      // la grilla no pegue un salto.
      const dt = ultimo ? Math.min((ahora - ultimo) / 1000, 0.05) : 0.016;
      ultimo = ahora;

      ox += dirX * speed * dpr * dt;
      oy += dirY * speed * dpr * dt;
      // Envolver dentro de un tile: desplazar un multiplo exacto de paso es
      // invisible, y asi el offset no crece hasta perder precision.
      ox -= Math.floor(ox / paso) * paso;
      oy -= Math.floor(oy / paso) * paso;

      if (puntero.dentro || puntero.s > 0.002) {
        // Una sola lectura de layout por fotograma, dentro del rAF.
        const r = nodo.getBoundingClientRect();
        const tx = (puntero.clienteX - r.left) * dpr;
        const ty = (puntero.clienteY - r.top) * dpr;
        if (puntero.saltar) {
          puntero.x = tx;
          puntero.y = ty;
          puntero.saltar = false;
        } else {
          // Suavizado exponencial independiente del framerate.
          const k = 1 - Math.exp(-dt / 0.045);
          puntero.x += (tx - puntero.x) * k;
          puntero.y += (ty - puntero.y) * k;
        }
      }
      const ks = 1 - Math.exp(-dt / 0.18);
      puntero.s += ((puntero.dentro ? 1 : 0) - puntero.s) * ks;

      pintar(ox, oy);
      raf = requestAnimationFrame(cuadro);
    }

    const arrancar = () => {
      if (raf) return;
      ultimo = 0;
      raf = requestAnimationFrame(cuadro);
    }
    const parar = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    }

    const alMover = (e: PointerEvent) => {
      if (!puntero.dentro) puntero.saltar = true;
      puntero.clienteX = e.clientX;
      puntero.clienteY = e.clientY;
      puntero.dentro = true;
    }
    const alSalir = () => {
      puntero.dentro = false;
    }

    if (interactive) {
      nodo.addEventListener("pointermove", alMover, { passive: true });
      nodo.addEventListener("pointerleave", alSalir, { passive: true });
      nodo.addEventListener("pointercancel", alSalir, { passive: true });
    }

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "undefined") {
      arrancar();
    } else {
      io = new IntersectionObserver(
        ([e]) => (e.isIntersecting ? arrancar() : parar()),
        { threshold: 0 }
      );
      io.observe(nodo);
    }

    return () => {
      parar();
      ro.disconnect();
      io?.disconnect();
      if (interactive) {
        nodo.removeEventListener("pointermove", alMover);
        nodo.removeEventListener("pointerleave", alSalir);
        nodo.removeEventListener("pointercancel", alSalir);
      }
    };
  }, [
    estatico,
    interactive,
    gap,
    dotSize,
    color,
    glowColor,
    speed,
    angle,
    radius,
    activeScale,
  ]);

  return (
    <div ref={contenedor} className={cn("relative overflow-hidden", className)}>
      <canvas
        ref={lienzo}
        aria-hidden="true"
        // En estilo en linea y no solo en clases: el lienzo NUNCA puede caer al
        // flujo normal. Si lo hiciera, su tamano intrinseco empujaria al
        // contenedor, el ResizeObserver volveria a medir mas grande y la cosa
        // crece sola. Asi tampoco depende de que Tailwind este cargado.
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      {/* El contenido va en un hijo posicionado (`relative`), si no queda por
          debajo del lienzo y los puntos encendidos se le pintan encima. */}
      {children}
    </div>
  );
}
