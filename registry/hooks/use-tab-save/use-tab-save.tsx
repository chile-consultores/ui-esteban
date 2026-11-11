import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/** Lo que un bloque de una pestaña tiene sin guardar y cómo se guarda. */
export type Savable = { dirty: boolean; save: () => Promise<void> };

/** La pestaña entrega esta función a sus bloques: cada uno anota su estado y la pestaña guarda todo con un solo botón. */
export const TabSaveContext = createContext<((id: string, s: Savable | null) => void) | null>(null);

/** Dentro de una pestaña con un solo «Guardar»: anota si este bloque tiene cambios y cómo guardarlos.
 *  Devuelve true si hay pestaña (el bloque esconde su propio botón); fuera de una pestaña devuelve false y nada cambia. */
export function useTabSave(id: string, dirty: boolean, save: () => Promise<void>): boolean {
  const register = useContext(TabSaveContext);
  const latest = useRef(save);
  latest.current = save;
  useEffect(() => {
    if (!register) return;
    register(id, { dirty, save: () => latest.current() });
    return () => register(id, null);
  }, [register, id, dirty]);
  return !!register;
}

/** Del lado de la pestaña: la función para el `TabSaveContext.Provider`, si hay cambios y guardar todo. */
export function useTabSaveRegistry() {
  const [blocks, setBlocks] = useState<Record<string, Savable>>({});
  const register = useCallback((id: string, s: Savable | null) => setBlocks((m) => {
    const n = { ...m };
    if (s) n[id] = s; else delete n[id];
    return n;
  }), []);
  const dirtyBlocks = Object.values(blocks).filter((b) => b.dirty);
  const [saving, setSaving] = useState(false);
  async function saveAll() {
    setSaving(true);
    try { for (const b of dirtyBlocks) await b.save(); } finally { setSaving(false); }
  }
  return { register, dirty: dirtyBlocks.length > 0, saving, saveAll };
}
