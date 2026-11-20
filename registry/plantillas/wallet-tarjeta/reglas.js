// Reglas de las tarjetas. Las usa el navegador (vista previa, paneles) y el servidor
// (functions/ importa este mismo archivo), así la vista previa y el pase real nunca se desfasan.

export const PLANTILLAS = {
  circulos: { tipo: "sellos", nombre: "Sellos en círculos", detalle: "Un círculo por visita. Se rellena con tu ícono." },
  iconos: { tipo: "sellos", nombre: "Sellos de ícono", detalle: "Solo los íconos: los ganados se encienden." },
  numero: { tipo: "puntos", nombre: "Puntos en grande", detalle: "El saldo de puntos es el protagonista." },
  progreso: { tipo: "puntos", nombre: "Barra de avance", detalle: "Muestra cuánto falta para el próximo premio." },
  niveles: { tipo: "puntos", nombre: "Niveles", detalle: "El cliente sube de nivel según lo que acumula." },
};

export const RUBROS = ["Cafetería", "Restaurante", "Gimnasio", "Barbería", "Heladería", "Librería", "Panadería", "Bar", "Peluquería", "Lavado de autos", "Tienda", "Veterinaria", "Otro"];

export const META_MIN = 4, META_MAX = 12, NIVELES_MAX = 5, PREMIOS_MAX = 8, PASOS_PROGRESO = 10;

const HEX = /^#[0-9a-f]{6}$/i;
const txt = (v, max) => String(v ?? "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
const ent = (v, min, max, def) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : def; };
const url = (v) => { const s = txt(v, 200); return /^https:\/\/[^\s"'<>]+$/i.test(s) ? s : ""; };

export const num = (n) => Number(n || 0).toLocaleString("es-CL");

/* ---------- color ---------- */
export const rgbDe = (hex) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || ""); return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0]; };
export const hexDe = (rgb) => "#" + rgb.map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join("");
// mezcla a hacia b (t = 0 es a, t = 1 es b)
export const mezclar = (a, b, t) => { const x = rgbDe(a), y = rgbDe(b); return hexDe(x.map((v, i) => v + (y[i] - v) * t)); };
const lum = (hex) => { const [r, g, b] = rgbDe(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const contraste = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
// Color de las etiquetas chicas del pase: el texto apagado hacia el fondo, sin bajar de 4.5:1
export function colorEtiqueta(cfg) {
  for (const t of [0.34, 0.26, 0.18, 0.1, 0]) { const c = mezclar(cfg.color_texto, cfg.color_fondo, t); if (contraste(c, cfg.color_fondo) >= 4.5 || t === 0) return c; }
}
// Color legible sobre el acento (para el ícono dentro de un sello lleno)
export const sobreAcento = (cfg) => (contraste(cfg.color_fondo, cfg.color_acento) >= contraste(cfg.color_texto, cfg.color_acento) ? cfg.color_fondo : cfg.color_texto);

/* ---------- configuración ---------- */
export const CONFIG_BASE = {
  plantilla: "circulos", icono: "estrella", programa: "",
  meta: 8, premio: "Un producto gratis", bienvenida: 0, max_por_dia: 0, vence_meses: 0, compra_max: 1000000,
  pesos_por_punto: 100, premios: [], niveles: [],
  color_fondo: "#1F2430", color_texto: "#FFFFFF", color_acento: "#F2C14E",
  pase_saldo: true, pase_mensaje: true,
  logo: "icono", direccion: "", sitio: "", condiciones: "", url_privacidad: "", url_terminos: "",
};

// Deja la configuración completa y dentro de rango. Se usa al guardar (servidor) y al editar (navegador).
export function limpiarConfig(entrada, iconosValidos) {
  const e = entrada && typeof entrada === "object" ? entrada : {};
  const c = { ...CONFIG_BASE };
  c.plantilla = PLANTILLAS[e.plantilla] ? e.plantilla : CONFIG_BASE.plantilla;
  c.tipo = PLANTILLAS[c.plantilla].tipo;
  c.icono = txt(e.icono, 24).replace(/[^a-z]/g, "") || CONFIG_BASE.icono;
  if (iconosValidos && !iconosValidos.includes(c.icono)) c.icono = CONFIG_BASE.icono;
  c.programa = txt(e.programa, 40);
  c.meta = ent(e.meta, META_MIN, META_MAX, CONFIG_BASE.meta);
  c.premio = txt(e.premio, 60) || CONFIG_BASE.premio;
  c.bienvenida = ent(e.bienvenida, 0, c.tipo === "sellos" ? c.meta - 1 : 100000, 0);
  c.max_por_dia = ent(e.max_por_dia, 0, META_MAX, 0);
  c.vence_meses = [0, 3, 6, 12, 24].includes(Number(e.vence_meses)) ? Number(e.vence_meses) : 0;
  c.compra_max = ent(e.compra_max, 1000, 100000000, CONFIG_BASE.compra_max);
  c.pesos_por_punto = ent(e.pesos_por_punto, 1, 1000000, CONFIG_BASE.pesos_por_punto);
  c.premios = (Array.isArray(e.premios) ? e.premios : []).map((p) => ({ nombre: txt(p && p.nombre, 60), puntos: ent(p && p.puntos, 1, 10000000, 0) }))
    .filter((p) => p.nombre && p.puntos > 0).sort((a, b) => a.puntos - b.puntos).slice(0, PREMIOS_MAX);
  c.niveles = (Array.isArray(e.niveles) ? e.niveles : []).map((n) => ({ nombre: txt(n && n.nombre, 16), desde: ent(n && n.desde, 0, 100000000, 0), beneficio: txt(n && n.beneficio, 80) }))
    .filter((n) => n.nombre).sort((a, b) => a.desde - b.desde).slice(0, NIVELES_MAX);
  if (c.niveles.length) c.niveles[0].desde = 0;
  if (c.plantilla === "niveles" && c.niveles.length < 2) c.niveles = [{ nombre: "Bronce", desde: 0, beneficio: "" }, { nombre: "Plata", desde: 5000, beneficio: "" }, { nombre: "Oro", desde: 15000, beneficio: "" }];
  for (const k of ["color_fondo", "color_texto", "color_acento"]) c[k] = HEX.test(e[k] || "") ? e[k].toUpperCase() : CONFIG_BASE[k];
  c.pase_saldo = e.pase_saldo !== false;
  c.pase_mensaje = e.pase_mensaje !== false;
  c.logo = e.logo === "imagen" ? "imagen" : "icono";
  c.direccion = txt(e.direccion, 120);
  c.sitio = url(e.sitio);
  c.condiciones = txt(e.condiciones, 400);
  c.url_privacidad = url(e.url_privacidad);
  c.url_terminos = url(e.url_terminos);
  return c;
}

export const esSellos = (cfg) => cfg.tipo === "sellos";
export const unidad = (cfg, n) => (esSellos(cfg) ? (n === 1 ? "sello" : "sellos") : n === 1 ? "punto" : "puntos");
export const nombrePrograma = (negocio) => negocio.config.programa || (esSellos(negocio.config) ? "Tarjeta de sellos" : "Club de puntos");

/* ---------- estado del cliente ---------- */
export function nivelDe(cfg, total) {
  const ns = cfg.niveles || [];
  if (!ns.length) return null;
  let i = 0;
  for (let k = 0; k < ns.length; k++) if ((total || 0) >= ns[k].desde) i = k;
  const sig = ns[i + 1] || null;
  return { indice: i, nombre: ns[i].nombre, beneficio: ns[i].beneficio || "", siguiente: sig ? { nombre: sig.nombre, desde: sig.desde, faltan: sig.desde - (total || 0) } : null };
}
// Próximo premio que todavía no alcanza; si ya alcanza todos, null
export function proximoPremio(cfg, puntos) {
  return (cfg.premios || []).find((p) => p.puntos > (puntos || 0)) || null;
}
export const premiosAlcanzados = (cfg, puntos) => (cfg.premios || []).filter((p) => p.puntos <= (puntos || 0));

// Cuántas imágenes distintas necesita la tarjeta (una por estado)
export function totalEstados(cfg) {
  if (esSellos(cfg)) return cfg.meta + 1;
  if (cfg.plantilla === "progreso") return PASOS_PROGRESO + 1;
  if (cfg.plantilla === "niveles") return Math.max(1, cfg.niveles.length);
  return 1;
}
// Qué imagen le corresponde a este cliente (0 .. totalEstados - 1)
export function estadoDe(cfg, cliente) {
  if (esSellos(cfg)) return Math.max(0, Math.min(cfg.meta, cliente.sellos || 0));
  if (cfg.plantilla === "progreso") {
    const prox = proximoPremio(cfg, cliente.puntos);
    if (!prox) return (cfg.premios || []).length ? PASOS_PROGRESO : 0;
    const alc = premiosAlcanzados(cfg, cliente.puntos);
    const base = alc.length ? alc[alc.length - 1].puntos : 0;
    return Math.max(0, Math.min(PASOS_PROGRESO - 1, Math.floor(((cliente.puntos - base) / (prox.puntos - base)) * PASOS_PROGRESO)));
  }
  if (cfg.plantilla === "niveles") return nivelDe(cfg, cliente.total)?.indice || 0;
  return 0;
}

// Textos del pase. La vista previa, Apple Wallet y Google Wallet salen de aquí.
export function camposDe(negocio, cliente) {
  const k = camposBase(negocio, cliente);
  if (negocio.config.pase_saldo === false) { k.encabezado = null; k.principal = null; }
  return k;
}
function camposBase(negocio, cliente) {
  const cfg = negocio.config;
  const nombre = cliente.nombre || "Cliente";
  if (esSellos(cfg)) {
    const s = Math.max(0, Math.min(cfg.meta, cliente.sellos || 0));
    const lleno = s >= cfg.meta;
    return {
      encabezado: { etiqueta: "SELLOS", valor: `${s}/${cfg.meta}` }, principal: null,
      secundarios: [{ etiqueta: "CLIENTE", valor: nombre }, { etiqueta: lleno ? "PREMIO LISTO" : "PREMIO", valor: cfg.premio }],
      mensaje: lleno ? `Completaste tu tarjeta. Pide tu premio: ${cfg.premio}` : s === cfg.meta - 1 ? `Te falta 1 sello para: ${cfg.premio}` : `Te faltan ${cfg.meta - s} sellos para: ${cfg.premio}`,
      google: { puntos: { etiqueta: "Sellos", valor: `${s}/${cfg.meta}` }, segundo: { etiqueta: lleno ? "Premio listo" : "Premio", valor: cfg.premio } },
      cambio: lleno ? "Completaste tu tarjeta en " + negocio.nombre : "Ahora tienes %@ sellos en " + negocio.nombre,
    };
  }
  const p = cliente.puntos || 0, prox = proximoPremio(cfg, p), nv = nivelDe(cfg, cliente.total);
  const sec = [{ etiqueta: "CLIENTE", valor: nombre }];
  let segundo;
  if (cfg.plantilla === "niveles" && nv) { sec.push({ etiqueta: "NIVEL", valor: nv.nombre }); segundo = { etiqueta: "Nivel", valor: nv.nombre }; }
  else if (prox) { sec.push({ etiqueta: "PRÓXIMO PREMIO", valor: prox.nombre }); segundo = { etiqueta: "Próximo premio", valor: prox.nombre }; }
  else if (cfg.premios.length) { sec.push({ etiqueta: "PREMIO LISTO", valor: cfg.premios[cfg.premios.length - 1].nombre }); segundo = { etiqueta: "Premio listo", valor: cfg.premios[cfg.premios.length - 1].nombre }; }
  const mensaje = prox ? `Te faltan ${num(prox.puntos - p)} puntos para: ${prox.nombre}` : cfg.premios.length ? "Ya puedes canjear cualquier premio" : `1 punto por cada $${num(cfg.pesos_por_punto)}`;
  const puntos = { etiqueta: "PUNTOS", valor: num(p) };
  return {
    encabezado: cfg.plantilla === "numero" ? (nv ? { etiqueta: "NIVEL", valor: nv.nombre } : null) : puntos,
    principal: cfg.plantilla === "numero" ? puntos : null,
    secundarios: sec, mensaje,
    google: { puntos: { etiqueta: "Puntos", valor: num(p) }, segundo },
    cambio: "Ahora tienes %@ puntos en " + negocio.nombre,
  };
}

// Puntos que entrega una compra
export const puntosPorMonto = (cfg, monto) => Math.max(0, Math.floor((Number(monto) || 0) / cfg.pesos_por_punto));

export const esSlug = (s) => /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/.test(String(s || ""));
export const aSlug = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
