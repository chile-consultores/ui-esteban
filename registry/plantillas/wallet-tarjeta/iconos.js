// Íconos de línea propios (grilla de 24, trazo redondo). Un solo origen para el HTML (SVG) y para las
// imágenes del pase (canvas con Path2D), así el sello se ve igual en la vista previa y en Wallet.
export const ICONOS = {
  cafe: { nombre: "Café", d: ["M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z", "M17 10.5h1.2a2.4 2.4 0 0 1 0 4.8H17", "M8 3.5v2.2", "M12.5 3.5v2.2"] },
  pesa: { nombre: "Pesa", d: ["M9 12h6", "M6 7.5a1.5 1.5 0 0 1 3 0v9a1.5 1.5 0 0 1-3 0Z", "M15 7.5a1.5 1.5 0 0 1 3 0v9a1.5 1.5 0 0 1-3 0Z", "M3 10.2a1.5 1.5 0 0 1 3 0v3.6a1.5 1.5 0 0 1-3 0Z", "M18 10.2a1.5 1.5 0 0 1 3 0v3.6a1.5 1.5 0 0 1-3 0Z"] },
  tijeras: { nombre: "Tijeras", d: ["M9 6a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z", "M9 18a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z", "M8.1 8.1 20 20", "M8.1 15.9 20 4"] },
  cubiertos: { nombre: "Cubiertos", d: ["M5 3v5a2.5 2.5 0 0 0 5 0V3", "M7.5 3v18", "M17 21V3c-2.2 1.3-3.5 3.9-3.5 7.2V13H17"] },
  helado: { nombre: "Helado", d: ["M6.5 11a5.5 5.5 0 0 1 11 0Z", "M7.6 11 12 21l4.4-10"] },
  libro: { nombre: "Libro", d: ["M12 6.5C10.4 5.3 8.2 4.8 5 5v13c3.2-.2 5.4.3 7 1.5 1.6-1.2 3.8-1.7 7-1.5V5c-3.2-.2-5.4.3-7 1.5Z", "M12 6.5v13"] },
  estrella: { nombre: "Estrella", d: ["M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.8Z"] },
  corazon: { nombre: "Corazón", d: ["M12 20S4.5 15.4 4.5 10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"] },
  regalo: { nombre: "Regalo", d: ["M4.5 11h15v9h-15Z", "M3.5 7.5h17V11h-17Z", "M12 7.5V20", "M12 7.5C10.5 4 7 4 7.5 6.3 7.8 7.5 10 7.5 12 7.5Z", "M12 7.5C13.5 4 17 4 16.5 6.3 16.2 7.5 14 7.5 12 7.5Z"] },
  pizza: { nombre: "Pizza", d: ["M12 21 4 6.5c5-2.6 11-2.6 16 0Z", "M10.2 10.6a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0-2.2 0Z", "M12.4 14.6a.9.9 0 1 0 1.8 0a.9.9 0 1 0-1.8 0Z"] },
  hamburguesa: { nombre: "Hamburguesa", d: ["M4 10.5a8 6 0 0 1 16 0Z", "M3.5 14.2h17", "M4.5 17.8h15v.7a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2Z"] },
  copa: { nombre: "Copa", d: ["M7 3h10l-.6 5a4.4 4.4 0 0 1-8.8 0Z", "M12 12.5V20", "M8.5 20.5h7"] },
  cerveza: { nombre: "Cerveza", d: ["M6 8.5h9V19a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 6 19Z", "M15 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2", "M5.6 8.5a2.5 2.5 0 0 1 2.9-4 3 3 0 0 1 5 0 2.5 2.5 0 0 1 1.9 4"] },
  pan: { nombre: "Pan", d: ["M4 12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4c0 1.2-.8 2-2 2v4.5H6V14c-1.2 0-2-.8-2-2Z", "M9.5 11.5v2.2", "M12 11.5v2.2", "M14.5 11.5v2.2"] },
  pata: { nombre: "Mascota", d: ["M12 12.5c-2.8 0-5 2-5 4.2 0 1.6 1.3 2.3 2.6 2.3.9 0 1.5-.4 2.4-.4s1.5.4 2.4.4c1.3 0 2.6-.7 2.6-2.3 0-2.2-2.2-4.2-5-4.2Z", "M7.4 10a1.6 1.6 0 1 1-3.2 0a1.6 1.6 0 0 1 3.2 0Z", "M11 6a1.6 1.6 0 1 1-3.2 0a1.6 1.6 0 0 1 3.2 0Z", "M16.2 6a1.6 1.6 0 1 1-3.2 0a1.6 1.6 0 0 1 3.2 0Z", "M19.8 10a1.6 1.6 0 1 1-3.2 0a1.6 1.6 0 0 1 3.2 0Z"] },
  hoja: { nombre: "Hoja", d: ["M5 19C5 10 10 5 19 5c0 9-5 14-14 14Z", "M5 19 13.5 10.5"] },
  gota: { nombre: "Gota", d: ["M12 3.5c3.5 4.2 6 7.3 6 10.5a6 6 0 0 1-12 0c0-3.2 2.5-6.3 6-10.5Z"] },
  corona: { nombre: "Corona", d: ["M4 8l4 4 4-6 4 6 4-4-1.5 10h-13Z"] },
  rayo: { nombre: "Rayo", d: ["M13 3 5 13.5h6L10 21l8-10.5h-6Z"] },
  auto: { nombre: "Auto", d: ["M4 16v-3.5l1.8-4.6a2 2 0 0 1 1.9-1.4h8.6a2 2 0 0 1 1.9 1.4L20 12.5V16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z", "M4.5 12h15", "M7 17v1.8", "M17 17v1.8"] },
  bolsa: { nombre: "Bolsa", d: ["M6 8h12l1 12H5Z", "M9 8V7a3 3 0 0 1 6 0v1"] },
  diamante: { nombre: "Diamante", d: ["M7 4h10l4 5.5L12 20 3 9.5Z", "M3 9.5h18", "M9.5 9.5 12 20l2.5-10.5", "M7 4l2.5 5.5L12 4l2.5 5.5L17 4"] },
  ticket: { nombre: "Entrada", d: ["M4 7.5h16v3a1.5 1.5 0 0 0 0 3v3H4v-3a1.5 1.5 0 0 0 0-3Z", "M14 7.5v9"] },
  musica: { nombre: "Música", d: ["M9 18V6l10-2v12", "M9 18a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z", "M19 16a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z"] },
  // de la interfaz
  check: { nombre: "Listo", d: ["M5 12.5l4.5 4.5L19 7.5"] },
  mas: { nombre: "Agregar", d: ["M12 5v14", "M5 12h14"] },
  menos: { nombre: "Quitar", d: ["M5 12h14"] },
  buscar: { nombre: "Buscar", d: ["M17 11a6 6 0 1 1-12 0a6 6 0 0 1 12 0Z", "M15.5 15.5 20 20"] },
  cerrar: { nombre: "Cerrar", d: ["M6 6l12 12", "M18 6 6 18"] },
  qr: { nombre: "Código QR", d: ["M4 4h6v6H4Z", "M14 4h6v6h-6Z", "M4 14h6v6H4Z", "M14 14h2.5v2.5H14Z", "M20 14v2.5", "M17.5 20H20v-1", "M14 20h1"] },
  salir: { nombre: "Salir", d: ["M10 4H6a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 6 20h4", "M15 8l4 4-4 4", "M19 12H9"] },
  campana: { nombre: "Avisos", d: ["M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15Z", "M10 20.5a2.2 2.2 0 0 0 4 0"] },
  personas: { nombre: "Clientes", d: ["M12.5 8a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0Z", "M2.5 19.5a6.5 6.5 0 0 1 13 0", "M16 4.8a3.5 3.5 0 0 1 0 6.4", "M18 14.2a6.5 6.5 0 0 1 3.5 5.3"] },
  pincel: { nombre: "Diseño", d: ["M14.5 5.5l4 4L9 19H5v-4Z", "M12.5 7.5l4 4"] },
  inicio: { nombre: "Resumen", d: ["M4 11.5 12 4l8 7.5V20h-5.5v-5.5h-5V20H4Z"] },
  tienda: { nombre: "Negocios", d: ["M4 9.5 5.5 4h13L20 9.5", "M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0", "M5.5 12.5V20h13v-7.5", "M10 20v-4.5h4V20"] },
  sol: { nombre: "Tema claro", d: ["M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z", "M12 3v2", "M12 19v2", "M3 12h2", "M19 12h2", "M5.6 5.6 7 7", "M17 17l1.4 1.4", "M5.6 18.4 7 17", "M17 7l1.4-1.4"] },
  luna: { nombre: "Tema oscuro", d: ["M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z"] },
  flecha: { nombre: "Ir", d: ["M5 12h14", "M13 6l6 6-6 6"] },
  copiar: { nombre: "Copiar", d: ["M9 9h10v11H9Z", "M5 15V4h10"] },
  cartera: { nombre: "Wallet", d: ["M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v1.5", "M4 7.5V17a2 2 0 0 0 2 2h12.5a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 18.5 7H6.5", "M16 13h.01"] },
};

// Los que puede elegir un negocio como sello
export const ICONOS_SELLO = ["cafe", "pesa", "tijeras", "cubiertos", "helado", "libro", "estrella", "corazon", "regalo", "pizza", "hamburguesa", "copa", "cerveza", "pan", "pata", "hoja", "gota", "corona", "rayo", "auto", "bolsa", "diamante", "ticket", "musica"];

const NS = "http://www.w3.org/2000/svg";
// Elemento <svg> listo para insertar. Decorativo por defecto; con `titulo` pasa a tener nombre accesible.
export function icono(id, { lado = 20, trazo = 1.75, titulo = "" } = {}) {
  const def = ICONOS[id] || ICONOS.estrella;
  const s = document.createElementNS(NS, "svg");
  s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("width", lado); s.setAttribute("height", lado);
  s.setAttribute("fill", "none"); s.setAttribute("stroke", "currentColor"); s.setAttribute("stroke-width", trazo);
  s.setAttribute("stroke-linecap", "round"); s.setAttribute("stroke-linejoin", "round");
  if (titulo) { s.setAttribute("role", "img"); s.setAttribute("aria-label", titulo); } else s.setAttribute("aria-hidden", "true");
  for (const d of def.d) { const p = document.createElementNS(NS, "path"); p.setAttribute("d", d); s.appendChild(p); }
  return s;
}

// Dibuja el ícono en un canvas, centrado en (cx, cy), con `lado` px de alto
export function dibujarIcono(ctx, id, cx, cy, lado, color, trazo = 1.75) {
  const def = ICONOS[id] || ICONOS.estrella;
  ctx.save();
  ctx.translate(cx - lado / 2, cy - lado / 2);
  ctx.scale(lado / 24, lado / 24);
  ctx.strokeStyle = color; ctx.lineWidth = trazo; ctx.lineCap = "round"; ctx.lineJoin = "round";
  for (const d of def.d) ctx.stroke(new Path2D(d));
  ctx.restore();
}
