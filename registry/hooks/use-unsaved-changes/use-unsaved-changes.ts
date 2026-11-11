import { useEffect, useRef } from "react";

/** Cambios sin guardar en la pantalla abierta. Mientras haya, salir de ella pregunta qué hacer:
 *  guardar, seguir editando o salir sin guardar. Cubre la navegación propia (llamando a `canLeave()`
 *  antes de cambiar de ruta), «Atrás» / «Adelante» del navegador, y cerrar o recargar la pestaña
 *  (este último con el aviso propio del navegador, que solo trae 2 botones).
 *
 *  Una sola pantalla con cambios a la vez: la última que se marca es la que cuenta. */
export type LeaveAnswer = "save" | "leave" | "stay";

let pending: { save: () => Promise<void> } | null = null;
let ask: (() => Promise<LeaveAnswer>) | null = null;
let here = typeof window === "undefined" ? "" : location.href;

// «Atrás» / «Adelante»: la dirección ya cambió. Se frena el aviso al resto de la app, se vuelve a la
// dirección de la pantalla con cambios y se pregunta. Se registra al cargar el módulo para quedar antes que
// los oyentes de la app (en `window` corren en orden de registro; la fase de captura NO sirve para esto).
// Los popstate que dispara la propia app (no confiables) pasan.
if (typeof window !== "undefined") {
  window.addEventListener("popstate", (ev) => {
    if (!ev.isTrusted || !pending) { here = location.href; return; }
    ev.stopImmediatePropagation();
    const target = location.href;
    history.pushState(null, "", here);
    void canLeave().then((ok) => {
      if (!ok) return;
      history.replaceState(null, "", target);
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  });
}

/** Registra la ventana que pregunta (una vez, en el proveedor de diálogos de la app). */
export function setLeavePrompt(fn: (() => Promise<LeaveAnswer>) | null) { ask = fn; }

export function hasUnsavedChanges(): boolean { return pending !== null; }

/** Pregunta qué hacer con los cambios. true = se puede salir (guardó bien o eligió salir sin guardar). */
export async function canLeave(): Promise<boolean> {
  if (!pending) return true;
  const answer = ask ? await ask() : "leave";
  if (answer === "stay") return false;
  if (answer === "leave") { pending = null; return true; }
  await pending?.save();
  // Si el guardado salió bien, la pantalla deja de tener cambios y `pending` se borra en el siguiente render.
  await new Promise((ok) => window.setTimeout(ok, 50));
  return pending === null;
}

/** Marca que esta pantalla tiene cambios sin guardar y cómo guardarlos. `save` puede cambiar en cada render. */
export function useUnsavedChanges(dirty: boolean, save: () => Promise<void>) {
  const latest = useRef(save);
  latest.current = save;
  useEffect(() => {
    if (!dirty) return;
    const mine = { save: () => latest.current() };
    pending = mine;
    here = location.href;
    const beforeUnload = (ev: BeforeUnloadEvent) => { ev.preventDefault(); ev.returnValue = ""; };
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      if (pending === mine) pending = null;
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [dirty]);
}
