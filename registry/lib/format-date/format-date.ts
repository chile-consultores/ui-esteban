/** Fechas en pantalla en un solo formato: «21 oct 2026» y «21 oct 2026, 09:56» (24 h).
 *  Para archivos exportados conviene dejar el formato de cada exporte. */

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  // Fecha sin hora («2026-10-21»): a mediodía, para que la zona horaria no la corra de día.
  const d = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** «21 oct 2026». Vacío si no hay fecha válida. */
export function formatDate(value: string | Date | null | undefined, locale = "es-CL"): string {
  const d = toDate(value);
  return d ? d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }).replace(/\./g, "") : "";
}

/** «21 oct 2026, 09:56». Vacío si no hay fecha válida. */
export function formatDateTime(value: string | Date | null | undefined, locale = "es-CL"): string {
  const d = toDate(value);
  if (!d) return "";
  return `${formatDate(d, locale)}, ${d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false })}`;
}
