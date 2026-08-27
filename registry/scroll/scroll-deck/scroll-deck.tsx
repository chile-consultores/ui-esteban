import { Children, useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

interface ScrollDeckProps {
  /** Cada hijo se vuelve una carta de la baraja, en orden. */
  children: ReactNode;
  /** Encabezado que queda fijo sobre la baraja mientras avanza. */
  heading?: ReactNode;
  /** Alto de scroll por carta, en vh. Mas alto = avanza mas lento. */
  vhPerCard?: number;
  /** Profundidad de la perspectiva en px. Menos px = efecto mas exagerado. */
  perspective?: number;
  /** Alto del area de cartas en px. */
  cardHeight?: number;
  className?: string;
}

/**
 * Baraja de cartas en 3D que avanza con el scroll.
 *
 * Como funciona: la seccion mide varias pantallas de alto, pero su contenido
 * es `sticky`, asi que queda congelado mientras haces scroll. `useScroll`
 * convierte ese recorrido en un numero 0 -> 1, y cada carta mapea ese numero
 * a su propio translateZ / rotateX / opacity. La carta i queda al frente
 * cuando el progreso llega a i/(total-1).
 *
 * Con `prefers-reduced-motion` no hay scroll pegado ni transforms: las cartas
 * se apilan en una lista normal.
 */
export function ScrollDeck({
  children,
  heading,
  vhPerCard = 85,
  perspective = 1200,
  cardHeight = 420,
  className,
}: ScrollDeckProps) {
  const seccion = useRef<HTMLElement>(null);
  const menosMovimiento = useReducedMotion();

  const cartas = Children.toArray(children);
  const total = cartas.length;

  const { scrollYProgress } = useScroll({
    target: seccion,
    offset: ["start start", "end end"],
  });

  if (menosMovimiento) {
    return (
      <section className={cn("w-full", className)}>
        {heading}
        <div className="mx-auto flex max-w-md flex-col gap-6">
          {cartas.map((carta, i) => (
            <div key={i} style={{ minHeight: cardHeight }}>
              {carta}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={seccion}
      className={cn("relative w-full", className)}
      /* +100vh para que la ultima carta alcance a quedarse un rato al frente */
      style={{ height: `${total * vhPerCard + 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {heading}

        <div
          className="relative w-full max-w-md"
          style={{
            height: cardHeight,
            perspective,
            transformStyle: "preserve-3d",
          }}
        >
          {cartas.map((carta, i) => (
            <Capa key={i} progreso={scrollYProgress} indice={i} total={total}>
              {carta}
            </Capa>
          ))}
        </div>

        <Indicador progreso={scrollYProgress} total={total} />
      </div>
    </section>
  );
}

/** Una carta. Vive aparte porque cada una necesita sus propios hooks. */
function Capa({
  progreso,
  indice,
  total,
  children,
}: {
  progreso: MotionValue<number>;
  indice: number;
  total: number;
  children: ReactNode;
}) {
  // Donde esta carta queda al frente: la primera en 0, la ultima en 1.
  const centro = total > 1 ? indice / (total - 1) : 0;
  const paso = total > 1 ? 1 / (total - 1) : 1;

  // OJO: `useTransform` sobre el progreso del scroll exige que el rango de
  // entrada viva dentro de [0,1]; motion lo compila a una animacion nativa y
  // si te sales tira "Offsets must be in the range [0,1]" y el arbol no monta.
  // Por eso primero derivamos la distancia de la carta a su turno, en
  // "unidades de carta": -1 = le falta una para llegar, 0 = al frente,
  // +1 = ya paso. Ese valor si puede tomar cualquier numero.
  const turno = useTransform(progreso, (v) => (v - centro) / paso);

  // Cinco tramos: bien al fondo -> al fondo -> atras -> al frente -> se va.
  // El ultimo tramo es corto a proposito: si la carta que sale tarda mucho en
  // irse, se queda grande y borrosa tapando a la que entra.
  const tramos = [-2.5, -1.6, -0.85, 0, 0.45];

  const z = useTransform(turno, tramos, [-1300, -900, -420, 0, 260]);
  const y = useTransform(turno, tramos, [210, 150, 70, 0, -110]);
  const rotateX = useTransform(turno, tramos, [38, 32, 20, 0, -22]);
  const opacity = useTransform(turno, tramos, [0, 0.1, 0.32, 1, 0]);

  // Sin esto el texto de las cartas de atras se transparenta encima de la del
  // frente y queda un fantasma ilegible. El desenfoque las manda al fondo de
  // verdad: se lee la forma, no el contenido.
  const px = useTransform(turno, tramos, [12, 9, 5, 0, 6]);
  const filter = useTransform(px, (v) => `blur(${v.toFixed(2)}px)`);

  // La carta mas cerca de su centro queda arriba. Sin esto el apilado
  // depende del orden del DOM y la de atras tapa a la del frente.
  const zIndex = useTransform(progreso, (v) =>
    Math.round(1000 - Math.abs(v - centro) * 1000)
  );

  return (
    <motion.div
      style={{ z, y, rotateX, opacity, filter, zIndex }}
      className="absolute inset-0 [transform-style:preserve-3d]"
    >
      {children}
    </motion.div>
  );
}

/** Puntitos de progreso bajo la baraja. */
function Indicador({
  progreso,
  total,
}: {
  progreso: MotionValue<number>;
  total: number;
}) {
  return (
    <div className="mt-10 flex items-center gap-2" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <Punto key={i} progreso={progreso} indice={i} total={total} />
      ))}
    </div>
  );
}

function Punto({
  progreso,
  indice,
  total,
}: {
  progreso: MotionValue<number>;
  indice: number;
  total: number;
}) {
  const centro = total > 1 ? indice / (total - 1) : 0;
  const paso = total > 1 ? 1 / (total - 1) : 1;

  const turno = useTransform(progreso, (v) => (v - centro) / paso);
  const opacity = useTransform(turno, [-1, 0, 1], [0.25, 1, 0.25]);
  const width = useTransform(turno, [-1, 0, 1], [6, 26, 6]);

  return (
    <motion.span
      style={{ opacity, width }}
      className="h-1.5 rounded-full bg-white"
    />
  );
}
