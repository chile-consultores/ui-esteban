// Motor de tarjetas: dibuja la franja (la imagen con los sellos o el avance), arma la vista previa
// tal como se ve en Apple Wallet y Google Wallet, y genera las imágenes del pase al guardar el diseño.
import { ICONOS, icono, dibujarIcono } from "./iconos.js";
import { esSellos, estadoDe, totalEstados, camposDe, mezclar, contraste, colorEtiqueta, sobreAcento, nombrePrograma, PASOS_PROGRESO } from "./reglas.js";

export const FRANJA = { w: 375, h: 123 };   // puntos de Apple (se exporta a 2x y 3x)
export const HERO = { w: 1032, h: 336 };    // imagen inferior de Google Wallet
const FUENTE = '"Instrument Sans", system-ui, -apple-system, "Segoe UI", sans-serif';

const acentoVisible = (cfg) => (contraste(cfg.color_acento, cfg.color_fondo) >= 2.2 ? cfg.color_acento : cfg.color_texto);

/* ---------- franja ---------- */
function circulo(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }
function pildora(ctx, x, y, w, h) { const r = h / 2; ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2); ctx.lineTo(x + r, y + h); ctx.arc(x + r, y + r, r, Math.PI / 2, -Math.PI / 2); ctx.closePath(); }

// Reparte n sellos en una o dos filas centradas. Devuelve [{x, y}] y el diámetro.
function grilla(n, W, H) {
  const mx = 22, my = 14, hueco = n > 8 ? 9 : 11;
  const filas = n <= 6 ? 1 : 2;
  const arriba = Math.ceil(n / filas);
  const d = Math.min(filas === 1 ? 54 : (H - my * 2 - 10) / 2, (W - mx * 2 - hueco * (arriba - 1)) / arriba);
  const huecoY = filas === 1 ? 0 : Math.min(12, H - my * 2 - d * 2);
  const alto = d * filas + huecoY * (filas - 1);
  const pos = [];
  for (let f = 0; f < filas; f++) {
    const cuantos = f === 0 ? arriba : n - arriba;
    const ancho = cuantos * d + (cuantos - 1) * hueco;
    for (let i = 0; i < cuantos; i++) pos.push({ x: (W - ancho) / 2 + d / 2 + i * (d + hueco), y: (H - alto) / 2 + d / 2 + f * (d + huecoY) });
  }
  return { pos, d };
}

function franjaSellos(ctx, W, H, cfg, estado) {
  const { pos, d } = grilla(cfg.meta, W, H);
  const acento = acentoVisible(cfg), apagado = mezclar(cfg.color_texto, cfg.color_fondo, 0.66), tenue = mezclar(cfg.color_texto, cfg.color_fondo, 0.78);
  pos.forEach((p, i) => {
    const lleno = i < estado, ultimo = i === cfg.meta - 1, id = ultimo ? "regalo" : cfg.icono;
    if (cfg.plantilla === "iconos") {
      dibujarIcono(ctx, id, p.x, p.y, d * 0.84, lleno ? acento : tenue, lleno ? 1.9 : 1.5);
      return;
    }
    if (lleno) {
      circulo(ctx, p.x, p.y, d / 2); ctx.fillStyle = acento; ctx.fill();
      dibujarIcono(ctx, id, p.x, p.y, d * 0.54, sobreAcento({ ...cfg, color_acento: acento }), 1.9);
    } else {
      circulo(ctx, p.x, p.y, d / 2 - 0.75); ctx.strokeStyle = apagado; ctx.lineWidth = 1.5;
      if (ultimo) ctx.setLineDash([3.5, 3.5]);
      ctx.stroke(); ctx.setLineDash([]);
      if (ultimo) dibujarIcono(ctx, "regalo", p.x, p.y, d * 0.46, apagado, 1.6);
    }
  });
}

function franjaNumero(ctx, W, H, cfg, { hero }) {
  // limpia: el número lo escribe Wallet encima. Solo una marca de agua del ícono a la derecha.
  dibujarIcono(ctx, cfg.icono, W - 62, H / 2 + 6, 132, mezclar(cfg.color_fondo, cfg.color_texto, 0.11), 1.1);
  if (hero) { // Google no escribe sobre la imagen: va una fila corta de íconos para que no quede vacía
    const acento = acentoVisible(cfg);
    for (let i = 0; i < 3; i++) dibujarIcono(ctx, cfg.icono, 44 + i * 44, H / 2, 30, i === 0 ? acento : mezclar(acento, cfg.color_fondo, 0.35 + i * 0.2), 1.7);
  }
}

function franjaProgreso(ctx, W, H, cfg, estado) {
  const acento = acentoVisible(cfg), pista = mezclar(cfg.color_texto, cfg.color_fondo, 0.84), apagado = mezclar(cfg.color_texto, cfg.color_fondo, 0.66);
  const mx = 44, meta = 44, hueco = 5, alto = 14, y = H / 2 - alto / 2;
  const ancho = (W - mx * 2 - meta - 12 - hueco * (PASOS_PROGRESO - 1)) / PASOS_PROGRESO;
  for (let i = 0; i < PASOS_PROGRESO; i++) { pildora(ctx, mx + i * (ancho + hueco), y, ancho, alto); ctx.fillStyle = i < estado ? acento : pista; ctx.fill(); }
  const cx = W - mx - meta / 2, lleno = estado >= PASOS_PROGRESO;
  if (lleno) { circulo(ctx, cx, H / 2, meta / 2); ctx.fillStyle = acento; ctx.fill(); dibujarIcono(ctx, "regalo", cx, H / 2, 24, sobreAcento({ ...cfg, color_acento: acento }), 1.8); }
  else { circulo(ctx, cx, H / 2, meta / 2 - 0.75); ctx.strokeStyle = apagado; ctx.lineWidth = 1.5; ctx.stroke(); dibujarIcono(ctx, "regalo", cx, H / 2, 22, apagado, 1.6); }
}

function franjaNiveles(ctx, W, H, cfg, estado) {
  const ns = cfg.niveles, n = ns.length;
  const acento = acentoVisible(cfg), apagado = mezclar(cfg.color_texto, cfg.color_fondo, 0.66), pasado = mezclar(acento, cfg.color_fondo, 0.5);
  const r = 17, y = H / 2 - 13, x0 = 48, x1 = W - 48;
  const xs = ns.map((_, i) => (n === 1 ? W / 2 : x0 + ((x1 - x0) * i) / (n - 1)));
  ctx.lineWidth = 2; ctx.lineCap = "round";
  for (let i = 0; i < n - 1; i++) { ctx.beginPath(); ctx.moveTo(xs[i] + r + 5, y); ctx.lineTo(xs[i + 1] - r - 5, y); ctx.strokeStyle = i < estado ? pasado : mezclar(cfg.color_texto, cfg.color_fondo, 0.82); ctx.stroke(); }
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  ns.forEach((nv, i) => {
    if (i === estado) { circulo(ctx, xs[i], y, r); ctx.fillStyle = acento; ctx.fill(); dibujarIcono(ctx, cfg.icono, xs[i], y, 19, sobreAcento({ ...cfg, color_acento: acento }), 1.9); }
    else if (i < estado) { circulo(ctx, xs[i], y, r); ctx.fillStyle = pasado; ctx.fill(); dibujarIcono(ctx, "check", xs[i], y, 17, cfg.color_fondo, 2.2); }
    else { circulo(ctx, xs[i], y, r - 0.75); ctx.strokeStyle = apagado; ctx.lineWidth = 1.5; ctx.stroke(); }
    ctx.font = `${i === estado ? 700 : 500} 12px ${FUENTE}`;
    ctx.fillStyle = i === estado ? cfg.color_texto : mezclar(cfg.color_texto, cfg.color_fondo, 0.34);
    ctx.fillText(nv.nombre, xs[i], y + r + 22);
  });
}

// Dibuja la franja en un canvas de w x h px reales. Las coordenadas internas son las de Apple (375 de ancho).
export function dibujarFranja(ctx, w, h, cfg, estado, { hero = false } = {}) {
  const u = w / FRANJA.w, W = FRANJA.w, H = h / u;
  ctx.save();
  ctx.setTransform(u, 0, 0, u, 0, 0);
  ctx.fillStyle = cfg.color_fondo; ctx.fillRect(0, 0, W, H);
  if (esSellos(cfg)) franjaSellos(ctx, W, H, cfg, estado);
  else if (cfg.plantilla === "progreso") franjaProgreso(ctx, W, H, cfg, estado);
  else if (cfg.plantilla === "niveles") franjaNiveles(ctx, W, H, cfg, estado);
  else franjaNumero(ctx, W, H, cfg, { hero });
  ctx.restore();
}

/* ---------- vista previa (HTML) ---------- */
const el = (etq, clase, texto) => { const e = document.createElement(etq); if (clase) e.className = clase; if (texto != null) e.textContent = texto; return e; };

function lienzoFranja(cfg, estado, hero) {
  const c = document.createElement("canvas");
  const dim = hero ? HERO : { w: FRANJA.w * 2, h: FRANJA.h * 2 };
  c.width = dim.w; c.height = dim.h; c.className = "pase-franja-img";
  c.setAttribute("role", "img");
  dibujarFranja(c.getContext("2d"), c.width, c.height, cfg, estado, { hero });
  return c;
}
function logoDe(negocio, logoUrl, lado) {
  const cfg = negocio.config;
  if (cfg.logo === "imagen" && logoUrl) { const i = el("img", "pase-logo-img"); i.src = logoUrl; i.alt = ""; i.height = lado; return i; }
  const s = el("span", "pase-logo"); s.appendChild(icono(cfg.icono, { lado, trazo: 1.8 })); return s;
}
function qrDe(texto) {
  const caja = el("div", "pase-qr-img");
  if (window.QR) {
    const doc = new DOMParser().parseFromString(window.QR.svg(texto, { margen: 1, oscuro: "#111111" }), "image/svg+xml");
    caja.appendChild(document.importNode(doc.documentElement, true));
  }
  return caja;
}
const campo = (c, clase = "") => { const d = el("div", "pase-campo " + clase); d.append(el("span", "pase-etq", c.etiqueta), el("span", "pase-val", c.valor)); return d; };

// Descripción en palabras de la franja, para lectores de pantalla
function descripcion(negocio, cliente) {
  const cfg = negocio.config, c = camposDe(negocio, cliente);
  return esSellos(cfg) ? `${Math.min(cfg.meta, cliente.sellos || 0)} de ${cfg.meta} sellos. ${c.mensaje}` : `${c.google.puntos.valor} puntos. ${c.mensaje}`;
}

// tipo: "apple" | "google". Devuelve un <figure> con la tarjeta.
export function vistaPase(negocio, cliente, { tipo = "apple", url = "", logoUrl = "" } = {}) {
  const cfg = negocio.config, c = camposDe(negocio, cliente), estado = estadoDe(cfg, cliente);
  const fig = el("figure", "pase pase-" + tipo);
  fig.setAttribute("aria-label", `Tarjeta de ${negocio.nombre} en ${tipo === "apple" ? "Apple Wallet" : "Google Wallet"}`);
  const codigo = cliente.codigo || "DEMO-0000";
  const destino = url || "https://wallet.chileconsultores.com/t/demo";
  if (tipo === "apple") {
    fig.style.setProperty("--p-fondo", cfg.color_fondo); fig.style.setProperty("--p-texto", cfg.color_texto);
    fig.style.setProperty("--p-etq", colorEtiqueta(cfg)); fig.style.setProperty("--p-acento", acentoVisible(cfg));
    const cab = el("div", "pase-cab");
    const marca = el("div", "pase-marca"); marca.append(logoDe(negocio, logoUrl, 30), el("span", "pase-nombre", negocio.nombre));
    cab.append(marca);
    if (c.encabezado) cab.append(campo(c.encabezado, "pase-campo-der"));
    const franja = el("div", "pase-franja");
    const lienzo = lienzoFranja(cfg, estado, false); lienzo.setAttribute("aria-label", descripcion(negocio, cliente));
    franja.append(lienzo);
    if (c.principal) { const p = el("div", "pase-principal"); p.append(el("span", "pase-principal-val", c.principal.valor), el("span", "pase-etq", c.principal.etiqueta)); franja.append(p); }
    const campos = el("div", "pase-campos");
    c.secundarios.forEach((s, i) => campos.append(campo(s, i > 0 && i === c.secundarios.length - 1 ? "pase-campo-der" : "")));
    const qr = el("div", "pase-qr"); qr.append(qrDe(destino), el("span", "pase-qr-txt", codigo));
    fig.append(cab, franja, campos, qr);
  } else {
    // Google elige solo el color del texto (blanco o negro) según el fondo
    const claro = contraste("#FFFFFF", cfg.color_fondo) >= contraste("#1F1F1F", cfg.color_fondo);
    fig.style.setProperty("--p-fondo", cfg.color_fondo); fig.style.setProperty("--p-texto", claro ? "#FFFFFF" : "#1F1F1F");
    fig.style.setProperty("--p-etq", claro ? "#FFFFFF" : "#1F1F1F"); fig.style.setProperty("--p-acento", acentoVisible(cfg));
    fig.style.setProperty("--p-logo", mezclar(cfg.color_fondo, cfg.color_texto, 0.12));
    const cab = el("div", "pase-cab");
    const marca = el("div", "pase-marca"); marca.append(logoDe(negocio, logoUrl, 20), el("span", "pase-nombre", negocio.nombre));
    cab.append(marca);
    const titulo = el("p", "pase-titulo", nombrePrograma(negocio));
    const campos = el("div", "pase-campos");
    campos.append(campo(c.google.puntos));
    if (c.google.segundo) campos.append(campo(c.google.segundo, "pase-campo-der"));
    const qr = el("div", "pase-qr"); qr.append(qrDe(destino), el("span", "pase-qr-txt", codigo));
    const hero = el("div", "pase-franja");
    const lienzo = lienzoFranja(cfg, estado, true); lienzo.setAttribute("aria-label", descripcion(negocio, cliente));
    hero.append(lienzo);
    fig.append(cab, titulo, campos, qr, hero);
  }
  return fig;
}

/* ---------- imágenes del pase ---------- */
const lienzo = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
const aBlob = (c) => new Promise((ok, mal) => c.toBlob((b) => (b ? ok(b) : mal(new Error("No se pudo crear la imagen"))), "image/png"));
function encajar(ctx, img, x, y, w, h) {
  const k = Math.min(w / img.width, h / img.height), iw = img.width * k, ih = img.height * k;
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}
export function cargarImagen(src) {
  return new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => mal(new Error("No se pudo leer la imagen")); i.src = src; });
}

// Devuelve [{ nombre, blob }] con todo lo que el pase necesita. `logo` es una imagen ya cargada (opcional).
export async function generarArte(cfg, logo = null, alAvanzar = () => {}) {
  if (document.fonts && document.fonts.load) { try { await Promise.all([document.fonts.load(`500 12px ${FUENTE}`), document.fonts.load(`700 12px ${FUENTE}`)]); } catch {} }
  const acento = acentoVisible(cfg), conLogo = cfg.logo === "imagen" && logo;
  const tareas = [];
  // ícono cuadrado (notificaciones y pantalla bloqueada)
  for (const [k, sufijo] of [[1, ""], [2, "@2x"], [3, "@3x"]]) tareas.push(["icon" + sufijo + ".png", () => {
    const c = lienzo(29 * k, 29 * k), x = c.getContext("2d");
    x.fillStyle = cfg.color_fondo; x.fillRect(0, 0, c.width, c.height);
    if (conLogo) encajar(x, logo, 3 * k, 3 * k, 23 * k, 23 * k); else dibujarIcono(x, cfg.icono, c.width / 2, c.height / 2, 19 * k, acento, 1.9);
    return c;
  }]);
  // logo de la esquina (Apple escribe el nombre al lado)
  for (const [k, sufijo] of [[1, ""], [2, "@2x"], [3, "@3x"]]) tareas.push(["logo" + sufijo + ".png", () => {
    const w = conLogo ? Math.round(Math.min(160, Math.max(30, (logo.width / logo.height) * 44))) : 44;
    const c = lienzo(w * k, 44 * k), x = c.getContext("2d");
    if (conLogo) encajar(x, logo, 0, 0, c.width, c.height); else dibujarIcono(x, cfg.icono, c.width / 2, c.height / 2, 36 * k, acento, 1.8);
    return c;
  }]);
  // logo redondo de Google
  tareas.push(["glogo.png", () => {
    const c = lienzo(660, 660), x = c.getContext("2d");
    x.fillStyle = conLogo ? "#FFFFFF" : mezclar(cfg.color_fondo, cfg.color_texto, 0.12); x.fillRect(0, 0, 660, 660);
    if (conLogo) encajar(x, logo, 130, 130, 400, 400); else dibujarIcono(x, cfg.icono, 330, 330, 330, acento, 1.7);
    return c;
  }]);
  const n = totalEstados(cfg);
  for (let e = 0; e < n; e++) {
    for (const k of [2, 3]) tareas.push([`strip-${e}@${k}x.png`, () => { const c = lienzo(FRANJA.w * k, FRANJA.h * k); dibujarFranja(c.getContext("2d"), c.width, c.height, cfg, e); return c; }]);
    tareas.push([`hero-${e}.png`, () => { const c = lienzo(HERO.w, HERO.h); dibujarFranja(c.getContext("2d"), c.width, c.height, cfg, e, { hero: true }); return c; }]);
  }
  const salida = [];
  for (let i = 0; i < tareas.length; i++) { salida.push({ nombre: tareas[i][0], blob: await aBlob(tareas[i][1]()) }); alAvanzar(i + 1, tareas.length); }
  return salida;
}

export { ICONOS };
