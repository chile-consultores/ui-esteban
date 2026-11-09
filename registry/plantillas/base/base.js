/* ============================================================
   Chile Consultores · JS base compartido de plantillas
   Sin dependencias. Expone window.UI = { toast, modal, confirmar, tabs, dropdowns, sidebar, formato }
   Uso: <script src="../_base/base.js"></script>
   ============================================================ */
(function () {
  'use strict';
  const UI = {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Toasts ---------- */
  function contenedorToasts() {
    let c = $('.toasts');
    if (!c) { c = document.createElement('div'); c.className = 'toasts'; c.setAttribute('aria-live', 'polite'); c.setAttribute('role', 'status'); document.body.appendChild(c); }
    return c;
  }
  const ICONOS = { ok: '✓', error: '✕', warn: '!', info: 'i' };
  UI.toast = function (mensaje, tipo = 'info', opts = {}) {
    const c = contenedorToasts();
    while (c.children.length >= 3) c.firstChild.remove();
    const t = document.createElement('div');
    t.className = 'toast ' + tipo;
    const ico = document.createElement('span'); ico.className = 'ico'; ico.textContent = ICONOS[tipo] || 'i';
    const msg = document.createElement('span'); msg.textContent = mensaje;
    t.append(ico, msg);
    if (opts.deshacer) {
      const b = document.createElement('button'); b.className = 'deshacer'; b.textContent = 'Deshacer';
      b.addEventListener('click', () => { opts.deshacer(); t.remove(); });
      t.append(b);
    } else {
      const x = document.createElement('button'); x.className = 'cerrar'; x.setAttribute('aria-label', 'Cerrar aviso'); x.textContent = '×';
      x.addEventListener('click', () => t.remove()); t.append(x);
    }
    c.appendChild(t);
    const dur = opts.duracion ?? (tipo === 'error' ? 7000 : 4000);
    setTimeout(() => t.remove(), dur);
    return t;
  };

  /* ---------- Modal (declarativo: [data-modal="id"] abre #id) ---------- */
  let ultimoFoco = null;
  UI.modal = {
    abrir(id) {
      const telon = typeof id === 'string' ? document.getElementById(id) : id;
      if (!telon) return;
      ultimoFoco = document.activeElement;
      telon.classList.add('abierto');
      const m = $('.modal', telon); m.setAttribute('role', m.getAttribute('role') || 'dialog'); m.setAttribute('aria-modal', 'true');
      const f = $('input,select,textarea,button:not(.cerrar-modal)', m); (f || m).focus();
    },
    cerrar(id) {
      const telon = typeof id === 'string' ? document.getElementById(id) : id;
      if (!telon) return;
      telon.classList.remove('abierto');
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }
  };
  document.addEventListener('click', e => {
    const abre = e.target.closest('[data-modal]'); if (abre) { e.preventDefault(); UI.modal.abrir(abre.dataset.modal); return; }
    const cierra = e.target.closest('[data-cerrar-modal]'); if (cierra) { UI.modal.cerrar(cierra.closest('.telon')); return; }
    if (e.target.classList.contains('telon') && e.target.classList.contains('abierto')) UI.modal.cerrar(e.target);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { const t = $('.telon.abierto'); if (t) UI.modal.cerrar(t); $$('.menu.abierto').forEach(m => m.classList.remove('abierto')); }
    if (e.key === 'Tab') { const t = $('.telon.abierto'); if (!t) return;
      const f = $$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])', t);
      if (!f.length) return; const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  });

  /* ---------- Confirmar (Promise) ---------- */
  UI.confirmar = function ({ titulo, texto, confirmar = 'Confirmar', cancelar = 'Cancelar', peligro = false, palabra = null }) {
    return new Promise(resolve => {
      const telon = document.createElement('div'); telon.className = 'telon';
      telon.innerHTML = `<div class="modal" role="alertdialog" aria-labelledby="cf-t">
        <div class="modal-head"><h3 id="cf-t"></h3><button class="btn btn-ghost btn-icon cerrar-modal" aria-label="Cerrar">✕</button></div>
        <p class="muted small" id="cf-p"></p>
        ${palabra ? `<div class="campo mt-16"><label for="cf-w">Escribe <b>${palabra}</b> para confirmar</label><input id="cf-w" class="input" autocomplete="off"></div>` : ''}
        <div class="modal-foot"><button class="btn btn-sec" data-x>${cancelar}</button><button class="btn ${peligro ? 'btn-danger' : ''}" data-ok ${palabra ? 'disabled' : ''}>${confirmar}</button></div></div>`;
      $('#cf-t', telon).textContent = titulo; $('#cf-p', telon).textContent = texto || '';
      document.body.appendChild(telon);
      const fin = v => { UI.modal.cerrar(telon); setTimeout(() => telon.remove(), 200); resolve(v); };
      $('[data-x]', telon).addEventListener('click', () => fin(false));
      $('.cerrar-modal', telon).addEventListener('click', () => fin(false));
      $('[data-ok]', telon).addEventListener('click', () => fin(true));
      telon.addEventListener('click', e => { if (e.target === telon) fin(false); });
      if (palabra) $('#cf-w', telon).addEventListener('input', e => { $('[data-ok]', telon).disabled = e.target.value.trim() !== palabra; });
      requestAnimationFrame(() => UI.modal.abrir(telon));
    });
  };

  /* ---------- Tabs ([role=tablist] > button[aria-controls]) ---------- */
  UI.tabs = function (root = document) {
    $$('[role="tablist"]', root).forEach(list => {
      const tabs = $$('[role="tab"]', list);
      const activar = t => { tabs.forEach(x => { const sel = x === t; x.setAttribute('aria-selected', sel); x.tabIndex = sel ? 0 : -1; const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !sel; }); };
      tabs.forEach(t => { t.addEventListener('click', () => activar(t)); t.addEventListener('keydown', e => { const i = tabs.indexOf(t); if (e.key === 'ArrowRight') { tabs[(i + 1) % tabs.length].focus(); activar(tabs[(i + 1) % tabs.length]); } if (e.key === 'ArrowLeft') { tabs[(i - 1 + tabs.length) % tabs.length].focus(); activar(tabs[(i - 1 + tabs.length) % tabs.length]); } }); });
      activar(tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0]);
    });
  };

  /* ---------- Dropdowns ([data-menu] abre .menu hermano) ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-menu]');
    $$('.menu.abierto').forEach(m => { if (!b || m !== b.nextElementSibling) m.classList.remove('abierto'); });
    if (b) { const m = b.nextElementSibling; m.classList.toggle('abierto'); b.setAttribute('aria-expanded', m.classList.contains('abierto')); }
  });

  /* ---------- Sidebar mobile ---------- */
  document.addEventListener('click', e => {
    if (e.target.closest('.hamburguesa')) { $('.sidebar')?.classList.toggle('abierta'); $('.telon-nav')?.classList.toggle('visible'); }
    if (e.target.classList.contains('telon-nav')) { $('.sidebar')?.classList.remove('abierta'); e.target.classList.remove('visible'); }
  });

  /* ---------- Switches ---------- */
  document.addEventListener('click', e => {
    const s = e.target.closest('.switch'); if (!s) return;
    s.setAttribute('aria-checked', s.getAttribute('aria-checked') !== 'true');
  });

  /* ---------- Chips toggle ---------- */
  document.addEventListener('click', e => {
    const c = e.target.closest('.chip[aria-pressed]'); if (!c) return;
    c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') !== 'true');
  });

  /* ---------- Botón async: data-busy="Guardando…" ---------- */
  UI.busy = async function (btn, fn) {
    const txt = btn.textContent; btn.disabled = true; btn.textContent = btn.dataset.busy || 'Procesando…';
    try { return await fn(); } finally { btn.disabled = false; btn.textContent = txt; }
  };

  /* ---------- Formato ---------- */
  UI.formato = {
    clp: n => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n),
    num: n => new Intl.NumberFormat('es-CL').format(n),
    pct: n => new Intl.NumberFormat('es-CL', { style: 'percent', maximumFractionDigits: 1 }).format(n),
    fecha: d => new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d)),
    relativo: d => { const s = (Date.now() - new Date(d)) / 1000; if (s < 60) return 'hace un momento'; if (s < 3600) return `hace ${Math.floor(s / 60)} min`; if (s < 86400) return `hace ${Math.floor(s / 3600)} h`; const n = Math.floor(s / 86400); return n === 1 ? 'hace 1 día' : `hace ${n} días`; }
  };

  /* ---------- Validación de formularios (blur primero, luego por tecla) ---------- */
  UI.validar = function (form, reglas) {
    const tocado = new Set();
    const check = (name, mostrar) => {
      const el = form.elements[name]; const campo = el.closest('.campo'); const msg = campo?.querySelector('.error-msg');
      const err = reglas[name](el.value, form);
      if (mostrar || tocado.has(name)) { campo?.classList.toggle('invalido', !!err); el.setAttribute('aria-invalid', !!err); if (msg) msg.textContent = err || ''; }
      return !err;
    };
    Object.keys(reglas).forEach(n => { const el = form.elements[n]; if (!el) return;
      el.addEventListener('blur', () => { tocado.add(n); check(n, true); });
      el.addEventListener('input', () => { if (tocado.has(n)) check(n, true); }); });
    return () => { let ok = true; Object.keys(reglas).forEach(n => { tocado.add(n); if (!check(n, true)) ok = false; }); return ok; };
  };

  document.addEventListener('DOMContentLoaded', () => UI.tabs());
  window.UI = UI;
})();
