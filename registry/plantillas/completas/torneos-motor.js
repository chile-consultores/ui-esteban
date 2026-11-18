/* ===== MOTOR DE TORNEOS (sin DOM): cuadros, tablas, programación y resultados ===== */
const Motor = (() => {
  'use strict';
  const DIA = 1440, BYE = 'BYE';
  const pow2 = n => { let p = 1; while (p < n) p *= 2; return p; };
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  const hm = s => { const [h, m] = String(s).split(':').map(Number); return h * 60 + (m || 0); };
  const hora = min => { const m = ((min % DIA) + DIA) % DIA; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  function rng(seed) { let s = (seed >>> 0) || 1; return () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function barajar(arr, r) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /* ---------- Deportes: cada uno carga su propia configuración ---------- */
  const DEPORTES = {
    padel: { id: 'padel', nombre: 'Pádel', lado: 'pareja', lados: 'parejas', porLado: [2], cancha: 'cancha', canchas: 'canchas',
      marcador: { tipo: 'sets', set: 'set', sets: 'sets', juego: 'games', a: 6, tb: true, mejorDe: 3, decisivo: 'super10', decisivos: ['super10', 'super11', 'set'], wo: [6, 0] },
      puntos: { g: 1, e: 0, p: 0 }, duracion: 75, descanso: 60, canchasDef: 6,
      formatos: ['grupos', 'eliminacion', 'liga', 'doble', 'americano', 'mexicano'],
      desempates: ['difSets', 'juegosFavor', 'directo', 'difJuegos'],
      categorias: ['1ª Masculina', '2ª Masculina', '3ª Masculina', '4ª Masculina', '5ª Masculina', '6ª Masculina', '3ª Femenina', '4ª Femenina', '5ª Femenina', 'Mixto A', 'Mixto B'],
      regla: 'Sets a 6 games con tie-break y punto de oro. El super tie-break cuenta como un set y como un game.' },
    tenis: { id: 'tenis', nombre: 'Tenis', lado: 'jugador', lados: 'jugadores', porLado: [1, 2], cancha: 'cancha', canchas: 'canchas',
      marcador: { tipo: 'sets', set: 'set', sets: 'sets', juego: 'games', a: 6, tb: true, mejorDe: 3, decisivo: 'super10', decisivos: ['super10', 'set'], wo: [6, 0] },
      puntos: { g: 1, e: 0, p: 0 }, duracion: 90, descanso: 90, canchasDef: 4,
      formatos: ['eliminacion', 'grupos', 'liga', 'doble'],
      desempates: ['directo', 'difSets', 'difJuegos', 'juegosFavor'],
      categorias: ['Honor', 'Primera', 'Segunda', 'Tercera', 'Cuarta', 'Damas A', 'Damas B', 'Dobles varones', 'Dobles mixto'],
      regla: 'Sets a 6 games con tie-break a 7. Con ventajas, sin punto de oro.' },
    pickleball: { id: 'pickleball', nombre: 'Pickleball', lado: 'pareja', lados: 'parejas', porLado: [2, 1], cancha: 'cancha', canchas: 'canchas',
      marcador: { tipo: 'sets', set: 'juego', sets: 'juegos', juego: 'puntos', a: 11, tb: false, mejorDe: 3, decisivo: 'set', decisivos: ['set'], objetivos: [11, 15, 21], wo: [11, 0] },
      puntos: { g: 1, e: 0, p: 0 }, duracion: 40, descanso: 20, canchasDef: 4,
      formatos: ['grupos', 'eliminacion', 'liga', 'doble', 'americano', 'mexicano'],
      desempates: ['directo', 'difSets', 'difJuegos', 'juegosFavor'],
      categorias: ['Nivel 2.5', 'Nivel 3.0', 'Nivel 3.5', 'Nivel 4.0', 'Mixto 3.0', 'Mixto 3.5', 'Senior 50+'],
      regla: 'Juegos a 11 puntos con diferencia de 2. Solo anota quien saca.' },
    futbol: { id: 'futbol', nombre: 'Fútbol', lado: 'equipo', lados: 'equipos', porLado: [1], cancha: 'cancha', canchas: 'canchas',
      marcador: { tipo: 'goles', gol: 'goles', empate: true, definicion: 'penales', wo: [3, 0] },
      puntos: { g: 3, e: 1, p: 0 }, duracion: 60, descanso: 60, canchasDef: 2,
      formatos: ['grupos', 'liga', 'eliminacion', 'doble'],
      desempates: ['difJuegos', 'juegosFavor', 'directo'],
      categorias: ['Libre varones', 'Libre damas', 'Senior 35+', 'Súper senior 45+', 'Sub 17', 'Mixto'],
      regla: '3 puntos por victoria y 1 por empate. En eliminación, el empate se define por penales.' },
    voleibol: { id: 'voleibol', nombre: 'Vóleibol', lado: 'equipo', lados: 'equipos', porLado: [1], cancha: 'cancha', canchas: 'canchas',
      marcador: { tipo: 'sets', set: 'set', sets: 'sets', juego: 'puntos', a: 25, tb: false, mejorDe: 3, decisivo: 'a15', decisivos: ['a15', 'set'], wo: [25, 0] },
      puntos: { g: 1, e: 0, p: 0 }, duracion: 60, descanso: 30, canchasDef: 2,
      formatos: ['grupos', 'liga', 'eliminacion', 'doble'],
      desempates: ['difSets', 'difJuegos', 'directo'],
      categorias: ['Damas', 'Varones', 'Mixto', 'Sub 18'],
      regla: 'Sets a 25 puntos con diferencia de 2. El set decisivo se juega a 15.' },
    basquetbol: { id: 'basquetbol', nombre: 'Básquetbol', lado: 'equipo', lados: 'equipos', porLado: [1], cancha: 'cancha', canchas: 'canchas',
      marcador: { tipo: 'goles', gol: 'puntos', empate: false, wo: [20, 0] },
      puntos: { g: 2, e: 0, p: 1 }, duracion: 60, descanso: 60, canchasDef: 2,
      formatos: ['grupos', 'liga', 'eliminacion', 'doble'],
      desempates: ['directo', 'difJuegos', 'juegosFavor'],
      categorias: ['Varones', 'Damas', 'Senior 35+', 'Sub 17', '3x3'],
      regla: '2 puntos por victoria y 1 por derrota. No hay empates: se juega tiempo extra.' }
  };
  const FORMATOS = {
    grupos: { nombre: 'Grupos + playoff', ayuda: 'Fase de grupos y después cuadro de eliminación con los clasificados.' },
    eliminacion: { nombre: 'Eliminación directa', ayuda: 'Quien pierde queda fuera. Con cabezas de serie y byes.' },
    liga: { nombre: 'Liga (todos contra todos)', ayuda: 'Todos juegan contra todos. Gana quien termina primero en la tabla.' },
    doble: { nombre: 'Doble eliminación', ayuda: 'Hay que perder dos veces para quedar fuera.' },
    americano: { nombre: 'Americano', ayuda: 'Inscripción individual. Cambias de compañero en cada ronda y sumas puntos.' },
    mexicano: { nombre: 'Mexicano', ayuda: 'Como el americano, pero cada ronda se arma según el ranking del momento.' }
  };
  const CRITERIOS = { directo: 'Resultado entre sí', difSets: 'Diferencia de sets', difJuegos: 'Diferencia de games', juegosFavor: 'Games ganados', setsFavor: 'Sets ganados' };
  const FASES = { grupos: 'Grupos', liga: 'Liga', principal: 'Cuadro principal', oro: 'Cuadro Oro', plata: 'Cuadro Plata', consolacion: 'Consolación', ganadores: 'Cuadro de ganadores', perdedores: 'Cuadro de perdedores', granfinal: 'Gran final', americano: 'Rondas' };

  /* ---------- Helpers de modelo ---------- */
  const catDe = (t, id) => t.categorias.find(c => c.id === id);
  const insDe = (t, id) => t.inscripciones.find(i => i.id === id);
  const esPuntos = cat => cat.formato.tipo === 'americano' || cat.formato.tipo === 'mexicano';
  const ladoCat = (t, cat) => esPuntos(cat) ? 1 : (cat.porLado || DEPORTES[t.deporte].porLado[0]);
  const marcDe = t => Object.assign({}, DEPORTES[t.deporte].marcador, { mejorDe: t.reglas.mejorDe, decisivo: t.reglas.decisivo, a: t.reglas.objetivo || DEPORTES[t.deporte].marcador.a });
  const jugable = m => m.ra !== BYE && m.rb !== BYE;
  const listo = m => !!m.ra && !!m.rb && jugable(m);
  const eliminatoria = m => !['grupos', 'liga', 'americano'].includes(m.fase);
  const INS = id => ({ tipo: 'ins', id }), GAN = m => ({ tipo: 'gan', de: m.id }), PER = m => ({ tipo: 'per', de: m.id }), LIBRE = () => ({ tipo: 'bye' }), DUO = ids => ({ tipo: 'duo', ids });
  const letra = i => i < 26 ? String.fromCharCode(65 + i) : 'G' + (i + 1);
  const nombreRonda = n => ({ 1: 'Final', 2: 'Semifinal', 4: 'Cuartos', 8: 'Octavos', 16: '16avos', 32: '32avos', 64: '64avos' })[n] || 'Ronda de ' + n * 2;
  function nuevo(t, b) {
    const m = Object.assign({ id: 'm' + (++t.seq), grupo: null, ronda: 1, nombreRonda: null, cancha: null, inicio: null, fijo: false, res: null, ra: null, rb: null, gan: null, per: null }, b);
    m.n = t.partidos.reduce((s, x) => s + (x.cat === m.cat ? 1 : 0), 0) + 1; t.partidos.push(m); return m;
  }

  // Duración por fase: vale la del torneo, salvo que la categoría tenga la suya (cat.dur).
  const FASES_DUR = ['grupos', 'previas', 'octavos', 'cuartos', 'semis', 'final', 'puntos'];
  function claveDur(m) {
    if (m.fase === 'americano') return 'puntos'; if (m.fase === 'grupos' || m.fase === 'liga') return 'grupos'; if (m.fase === 'granfinal') return 'final'; if (m.tercer) return 'semis';
    const n = m.nombreRonda || ''; return n === 'Final' ? 'final' : n === 'Semifinal' || n.startsWith('Final de') ? 'semis' : n === 'Cuartos' ? 'cuartos' : n === 'Octavos' ? 'octavos' : 'previas';
  }
  function duracion(t, m) { const c = catDe(t, m.cat), k = claveDur(m); return (c.dur && c.dur[k]) || t.reglas.duraciones[k] || t.reglas.duracion || 60; }
  const FORZABLES = ['restriccion', 'descanso', 'maxdia'];

  function crearTorneo(depId, d) {
    const dep = DEPORTES[depId];
    return { id: d.id, deporte: depId, nombre: d.nombre, club: d.club || '', ciudad: d.ciudad || '', inscripcionAbierta: true,
      dias: d.dias.map(x => ({ fecha: x.fecha, desde: x.desde, hasta: x.hasta })),
      canchas: Array.from({ length: d.canchas || dep.canchasDef }, (_, i) => ({ id: 'c' + (i + 1), nombre: 'Cancha ' + (i + 1) })), seqCancha: d.canchas || dep.canchasDef,
      bloqueos: [], paso: 15,
      reglas: { mejorDe: dep.marcador.mejorDe || 1, decisivo: dep.marcador.decisivo || 'set', objetivo: dep.marcador.a || 0, duracion: dep.duracion, duraciones: { grupos: dep.duracion, previas: dep.duracion, octavos: dep.duracion, cuartos: dep.duracion, semis: dep.duracion, final: dep.duracion, puntos: 20 }, descanso: dep.descanso, maxDia: 3, cierreFinales: true, desempates: dep.desempates.slice() },
      restricciones: { modo: 'obligatoria', maxHoras: 6, protegidos: [] },
      categorias: [], inscripciones: [], partidos: [], conflictos: [], seq: 0, seqCat: 0, seqIns: 0 };
  }
  function formatoDef(tipo) { return { tipo, tam: 4, g4: 'gg_pp', clasifican: 2, plata: true, tercer: false, consolacion: true, vueltas: 1, puntos: 24, rondas: 5 }; }
  function agregarCategoria(t, d) {
    const dep = DEPORTES[t.deporte]; const tipo = d.tipo || dep.formatos[0];
    const c = { id: 'k' + (++t.seqCat), nombre: d.nombre, cupo: d.cupo || 16, precio: d.precio || 0, porLado: d.porLado || dep.porLado[0],
      dur: d.dur || null, formato: Object.assign(formatoDef(tipo), d.formato || {}), grupos: {}, generado: false, semilla: 1, rondaMex: 0 };
    t.categorias.push(c); return c;
  }
  function agregarInscripcion(t, d) {
    const cat = catDe(t, d.cat); const ap = t.inscripciones.filter(i => i.cat === d.cat && i.estado !== 'rechazada' && i.estado !== 'espera').length;
    const jug = d.jugadores.map(n => ({ nombre: String(n).trim() }));
    const corto = n => { const p = n.trim().split(/\s+/); return p.length > 1 ? p[0][0] + '. ' + p.slice(1).join(' ') : n; };
    const i = { id: 'i' + (++t.seqIns), cat: d.cat, jugadores: jug, nombre: d.nombre || jug.map(j => corto(j.nombre)).join(' / '), tel: d.tel || '', correo: d.correo || '',
      seed: d.seed || 0, estado: d.estado || (ap >= cat.cupo ? 'espera' : 'pendiente'), pago: !!d.pago, noDisp: (d.noDisp || []).slice() };
    t.inscripciones.push(i); return i;
  }

  /* ---------- Marcadores ---------- */
  const puntosValidos = (a, b, obj) => { const hi = Math.max(a, b), lo = Math.min(a, b); return hi >= obj && hi - lo >= 2 && (hi === obj || hi - lo === 2); };
  function setValido(a, b, marc, dec) {
    if (dec) return puntosValidos(a, b, marc.decisivo === 'super11' ? 11 : marc.decisivo === 'a15' ? 15 : 10);
    if (marc.tb) { const hi = Math.max(a, b), lo = Math.min(a, b); return (hi === marc.a && lo <= marc.a - 2) || (hi === marc.a + 1 && (lo === marc.a - 1 || lo === marc.a)); }
    return puntosValidos(a, b, marc.a);
  }
  function evalSets(sets, marc) {
    const need = Math.ceil(marc.mejorDe / 2); let wa = 0, wb = 0, ja = 0, jb = 0;
    if (!Array.isArray(sets) || !sets.length) return { ok: false, error: 'Ingresa el marcador.' };
    for (let i = 0; i < sets.length; i++) {
      if (wa === need || wb === need) return { ok: false, error: 'Sobra un ' + marc.set + ': el partido ya estaba definido.' };
      const [a, b] = sets[i];
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) return { ok: false, error: 'Completa el ' + (i + 1) + 'º ' + marc.set + ' con números enteros.' };
      const dec = marc.mejorDe > 1 && wa === need - 1 && wb === need - 1 && marc.decisivo !== 'set';
      if (!setValido(a, b, marc, dec)) return { ok: false, error: (i + 1) + 'º ' + marc.set + ': ' + a + '-' + b + ' no es un marcador válido' + (dec ? ' para el ' + marc.set + ' decisivo.' : '.') };
      if (a > b) wa++; else wb++;
      if (dec && marc.decisivo.startsWith('super')) { if (a > b) ja++; else jb++; } else { ja += a; jb += b; }
    }
    if (wa < need && wb < need) return { ok: false, error: 'Falta al menos un ' + marc.set + ' para definir el partido.' };
    return { ok: true, ganador: wa > wb ? 'a' : 'b', sa: wa, sb: wb, ja, jb };
  }
  function statsPartido(t, m) {
    if (!m.res) return null;
    const marc = marcDe(t), cat = catDe(t, m.cat), r = m.res;
    if (r.wo === 'ab') return { ganador: null, doble: true, sa: 0, sb: 0, ja: 0, jb: 0, wo: true };
    if (r.wo || r.ret) {
      const g = (r.wo || r.ret) === 'a' ? 'b' : 'a'; const st = { ganador: g, sa: 0, sb: 0, ja: 0, jb: 0, wo: true };
      if (esPuntos(cat)) st['j' + g] = cat.formato.puntos;
      else if (marc.tipo === 'sets') { const need = Math.ceil(marc.mejorDe / 2); st['s' + g] = need; st['j' + g] = need * marc.wo[0]; }
      else st['j' + g] = marc.wo[0];
      return st;
    }
    if (esPuntos(cat)) return { ganador: r.a > r.b ? 'a' : r.b > r.a ? 'b' : null, sa: 0, sb: 0, ja: r.a, jb: r.b };
    if (marc.tipo === 'sets') return evalSets(r.sets, marc);
    return { ganador: r.a > r.b ? 'a' : r.b > r.a ? 'b' : r.pen ? (r.pen[0] > r.pen[1] ? 'a' : 'b') : null, sa: 0, sb: 0, ja: r.a, jb: r.b };
  }
  function validarResultado(t, m, res) {
    const marc = marcDe(t), cat = catDe(t, m.cat); const ent = x => Number.isInteger(x) && x >= 0;
    if (res.wo) return ['a', 'b', 'ab'].includes(res.wo) ? { ok: true } : { ok: false, error: 'Indica quién no se presentó.' };
    if (res.ret) return res.ret === 'a' || res.ret === 'b' ? { ok: true } : { ok: false, error: 'Indica quién se retiró.' };
    if (esPuntos(cat)) {
      if (!ent(res.a) || !ent(res.b)) return { ok: false, error: 'Ingresa los puntos de cada lado.' };
      return res.a + res.b === cat.formato.puntos ? { ok: true } : { ok: false, error: 'Los puntos deben sumar ' + cat.formato.puntos + '.' };
    }
    if (marc.tipo === 'sets') return evalSets(res.sets, marc);
    if (!ent(res.a) || !ent(res.b)) return { ok: false, error: 'Ingresa el marcador de cada equipo.' };
    if (res.a === res.b) {
      if (!marc.empate) return { ok: false, error: 'En este deporte no hay empates. Ingresa el marcador con tiempo extra.' };
      if (eliminatoria(m)) { if (!res.pen || !ent(res.pen[0]) || !ent(res.pen[1]) || res.pen[0] === res.pen[1]) return { ok: false, error: 'En eliminación no hay empate: ingresa la definición por penales.' }; }
    }
    return { ok: true };
  }
  function textoResultado(t, m) {
    if (!m.res) return '';
    const cat = catDe(t, m.cat), marc = marcDe(t), r = m.res;
    if (r.wo) return r.wo === 'ab' ? 'Doble W.O.' : 'W.O.';
    if (r.ret) return ((r.sets || []).map(s => s[0] + '-' + s[1]).join('  ') || (r.a != null ? r.a + '-' + r.b : '')) + ' (retiro)';
    if (esPuntos(cat) || marc.tipo !== 'sets') return r.a + '-' + r.b + (r.pen ? ' (' + r.pen[0] + '-' + r.pen[1] + ' pen.)' : '');
    return r.sets.map(s => s[0] + '-' + s[1]).join('  ');
  }

  /* ---------- Tablas de posiciones con desempates ---------- */
  function clasificar(t, ids, partidos) {
    const R = t.reglas, P = DEPORTES[t.deporte].puntos;
    const f = new Map(ids.map((id, i) => [id, { id, pj: 0, pg: 0, pe: 0, pp: 0, sf: 0, sc: 0, jf: 0, jc: 0, pts: 0, orden: i, empate: false }]));
    const jug = [];
    for (const m of partidos) {
      const st = statsPartido(t, m); if (!st || !f.has(m.ra) || !f.has(m.rb)) continue;
      const A = f.get(m.ra), B = f.get(m.rb); jug.push({ a: m.ra, b: m.rb, g: st.ganador });
      A.pj++; B.pj++; A.sf += st.sa; A.sc += st.sb; B.sf += st.sb; B.sc += st.sa; A.jf += st.ja; A.jc += st.jb; B.jf += st.jb; B.jc += st.ja;
      if (st.ganador === 'a') { A.pg++; B.pp++; A.pts += P.g; B.pts += P.p; }
      else if (st.ganador === 'b') { B.pg++; A.pp++; B.pts += P.g; A.pts += P.p; }
      else if (st.doble) { A.pp++; B.pp++; A.pts += P.p; B.pts += P.p; }
      else { A.pe++; B.pe++; A.pts += P.e; B.pts += P.e; }
    }
    const val = (c, row, bloque) => {
      if (c === 'difSets') return row.sf - row.sc; if (c === 'difJuegos') return row.jf - row.jc; if (c === 'juegosFavor') return row.jf; if (c === 'setsFavor') return row.sf;
      const set = new Set(bloque.map(x => x.id)); let p = 0;
      for (const j of jug) if (set.has(j.a) && set.has(j.b) && (j.a === row.id || j.b === row.id)) p += !j.g ? P.e : ((j.g === 'a') === (j.a === row.id)) ? P.g : P.p;
      return p;
    };
    const partir = (bloque, clave) => { const g = new Map(); for (const r of bloque) { const v = clave(r); if (!g.has(v)) g.set(v, []); g.get(v).push(r); } return [...g.entries()].sort((x, y) => y[0] - x[0]).map(e => e[1]); };
    const desempatar = bloque => {
      if (bloque.length < 2) return bloque;
      for (const c of R.desempates) { const gs = partir(bloque, r => val(c, r, bloque)); if (gs.length > 1) return gs.flatMap(desempatar); }
      bloque.sort((x, y) => x.orden - y.orden); if (bloque[0].pj > 0) bloque.forEach(r => { r.empate = true; }); return bloque;
    };
    return partir([...f.values()], r => r.pts).flatMap(desempatar);
  }
  function tablaGrupo(t, catId, g) {
    const cat = catDe(t, catId); const ids = cat.grupos[g] || [];
    const ps = t.partidos.filter(m => m.cat === catId && m.grupo === g);
    return { filas: clasificar(t, ids, ps), completa: ps.length > 0 && ps.every(m => !!m.res), partidos: ps };
  }
  function rankingAmericano(t, catId) {
    const ids = t.inscripciones.filter(i => i.cat === catId && i.estado === 'aprobada').map(i => i.id);
    const f = new Map(ids.map((id, i) => [id, { id, pj: 0, pg: 0, pe: 0, pp: 0, pts: 0, contra: 0, orden: i }]));
    for (const m of t.partidos) {
      if (m.cat !== catId) continue; const st = statsPartido(t, m); if (!st) continue;
      for (const [L, O] of [['a', 'b'], ['b', 'a']]) for (const id of m[L].ids) { const r = f.get(id); if (!r) continue; r.pj++; r.pts += st['j' + L]; r.contra += st['j' + O]; if (st.ganador === L) r.pg++; else if (st.ganador) r.pp++; else r.pe++; }
    }
    return [...f.values()].sort((x, y) => y.pts - x.pts || (y.pts - y.contra) - (x.pts - x.contra) || y.pg - x.pg || x.orden - y.orden);
  }

  /* ---------- Resolver: propaga ganadores, perdedores, byes y clasificados ---------- */
  function resolver(t) {
    const porId = new Map(t.partidos.map(m => [m.id, m])); const tablas = new Map();
    const tabla = (cat, g) => { const k = cat + '|' + g; if (!tablas.has(k)) tablas.set(k, tablaGrupo(t, cat, g)); return tablas.get(k); };
    const res = (m, src) => {
      switch (src.tipo) {
        case 'ins': return src.id; case 'duo': return src.ids.join('+'); case 'bye': return BYE;
        case 'gan': return porId.get(src.de).gan; case 'per': return porId.get(src.de).per;
        case 'perSi': { const M = porId.get(src.de); if (M.per == null) return null; return M.per !== BYE && M.per === M['r' + src.lado] ? M.per : BYE; }
        case 'grupo': { const ids = catDe(t, m.cat).grupos[src.g] || []; if (src.pos > ids.length) return BYE; const tb = tabla(m.cat, src.g); return tb.completa ? tb.filas[src.pos - 1].id : null; }
      }
      return BYE;
    };
    for (const m of t.partidos) {
      let ra = res(m, m.a), rb = res(m, m.b); if (m.sust) { if (m.sust.a) ra = m.sust.a; if (m.sust.b) rb = m.sust.b; } m.ra = ra; m.rb = rb; m.gan = null; m.per = null; m.empate = false;
      if (ra === BYE || rb === BYE) { m.gan = ra === BYE ? rb : ra; m.per = BYE; m.cancha = null; m.inicio = null; m.res = null; m.fijo = false; continue; }
      if (m.res && ra && rb) { const st = statsPartido(t, m); if (st.ganador === 'a') { m.gan = ra; m.per = rb; } else if (st.ganador === 'b') { m.gan = rb; m.per = ra; } else if (st.doble) { m.gan = BYE; m.per = BYE; } else m.empate = true; }
      else if (m.res) m.res = null;
    }
    return t;
  }
  function nombreFuente(t, m, src) {
    const P = id => { const M = t.partidos.find(x => x.id === id); return M ? 'P' + M.n : '?'; };
    switch (src.tipo) {
      case 'ins': { const i = insDe(t, src.id); return i ? i.nombre : 'Sin nombre'; }
      case 'duo': return src.ids.map(id => (insDe(t, id) || {}).nombre || '?').join(' / ');
      case 'bye': return 'Libre';
      case 'gan': return 'Ganador ' + P(src.de); case 'per': case 'perSi': return 'Perdedor ' + P(src.de);
      case 'grupo': return src.pos + 'º Grupo ' + src.g;
    }
    return '';
  }
  function nombreLado(t, m, L) {
    const r = m['r' + L]; if (r === BYE) return 'Libre'; if (!r) return nombreFuente(t, m, m[L]);
    return String(r).split('+').map(id => (insDe(t, id) || {}).nombre || '?').join(' / ');
  }
  function etiqueta(t, m) {
    if (m.fase === 'grupos') return 'Grupo ' + m.grupo; if (m.fase === 'liga') return 'Fecha ' + m.ronda; if (m.fase === 'americano') return 'Ronda ' + m.ronda;
    if (m.fase === 'granfinal') return 'Gran final';
    const plata = t.partidos.some(x => x.cat === m.cat && x.fase === 'plata'), nr = m.nombreRonda || 'Ronda ' + m.ronda;
    const suf = { oro: plata ? ' Oro' : '', plata: ' Plata', consolacion: ' consolación', ganadores: nr.includes('ganadores') ? '' : ' ganadores' }[m.fase] || '';
    return nr + suf;
  }

  /* ---------- Cuadros ---------- */
  function ordenSiembra(n) { let a = [1]; while (a.length < n) { const m = a.length * 2 + 1; a = a.flatMap(s => [s, m - s]); } return a; }
  function llavePos(t, cat, fase, pos, o = {}) {
    const S = pos.length, total = Math.log2(S), rondas = []; let prev = null;
    for (let r = 1; r <= total; r++) {
      const cnt = S / 2 ** r, ms = [];
      for (let i = 0; i < cnt; i++) ms.push(nuevo(t, { cat, fase, ronda: r, orden: i, nombreRonda: o.nombres ? o.nombres(r, cnt) : nombreRonda(cnt), cierre: cnt === 1 && !o.sinCierre,
        a: r === 1 ? pos[2 * i] : GAN(prev[2 * i]), b: r === 1 ? pos[2 * i + 1] : GAN(prev[2 * i + 1]) }));
      rondas.push(ms); prev = ms;
    }
    let tercer = null;
    if (o.tercer && total >= 2) { const sf = rondas[total - 2]; tercer = nuevo(t, { cat, fase, ronda: total, orden: 1, nombreRonda: 'Tercer lugar', tercer: true, cierre: true, a: PER(sf[0]), b: PER(sf[1]) }); }
    return { rondas, tercer };
  }
  function crearLlave(t, cat, fase, fuentes, o) {
    const n = fuentes.length; if (n < 2) return { rondas: [], tercer: null };
    const S = pow2(n); return llavePos(t, cat, fase, ordenSiembra(S).map(s => s <= n ? fuentes[s - 1] : LIBRE()), o);
  }
  function consolacion(t, cat, princ) {
    const R1 = princ.rondas[0], R2 = princ.rondas[1]; if (!R2) return null;
    // Entra a consolación quien pierde su primer partido. Si venía de bye y pierde en 2ª ronda también entra,
    // salvo que esa 2ª ronda ya sea semifinal o final (ahí juega por el podio).
    const bye = m => m.a.tipo === 'bye' || m.b.tipo === 'bye', pos = [], temprano = R2.length >= 4;
    for (let j = 0; j < R2.length; j++) {
      const f0 = R1[2 * j], f1 = R1[2 * j + 1], b0 = bye(f0), b1 = bye(f1);
      if (!b0 && !b1) pos.push(PER(f0), PER(f1));
      else if (b0 && b1) pos.push(temprano ? PER(R2[j]) : LIBRE(), LIBRE());
      else if (b0) pos.push(temprano ? { tipo: 'perSi', de: R2[j].id, lado: 'a' } : LIBRE(), PER(f1));
      else pos.push(PER(f0), temprano ? { tipo: 'perSi', de: R2[j].id, lado: 'b' } : LIBRE());
    }
    if (pos.filter(x => x.tipo !== 'bye').length < 2) return null;
    return llavePos(t, cat, 'consolacion', pos);
  }
  function tamanosGrupos(n, tam) {
    if (n < 6) return [n];
    if (tam === 4) { const g = Math.ceil(n / 4), d = 4 * g - n; return Array.from({ length: g }, (_, i) => i < g - d ? 4 : 3); }
    const g = Math.floor(n / 3), r = n - 3 * g; return Array.from({ length: g }, (_, i) => i >= g - r ? 4 : 3);
  }
  function circulo(ids) {
    const a = ids.slice(); if (a.length % 2) a.push(null); const n = a.length, rondas = [];
    for (let r = 0; r < n - 1; r++) { const ps = []; for (let i = 0; i < n / 2; i++) { const x = a[i], y = a[n - 1 - i]; if (x != null && y != null) ps.push([x, y]); } rondas.push(ps); a.splice(1, 0, a.pop()); }
    return rondas;
  }
  function sembrarPorGrupos(tiers) {
    const lista = tiers.map((x, i) => i % 2 ? x.slice().reverse() : x.slice()).flat(); const n = lista.length; if (n < 3) return lista;
    const S = pow2(n), posDe = new Map(), rondas = Math.log2(S); ordenSiembra(S).forEach((s, i) => posDe.set(s, i));
    const pen = arr => { let p = 0; for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) if (arr[i].g === arr[j].g) p += 4 ** (rondas - (32 - Math.clz32(posDe.get(i + 1) ^ posDe.get(j + 1)))); return p; };
    let ini = tiers[0].length, mejor = pen(lista);
    for (let ti = 1; ti < tiers.length; ti++) {
      const fin = ini + tiers[ti].length; let cambio = true;
      while (cambio) { cambio = false; for (let i = ini; i < fin; i++) for (let j = i + 1; j < fin; j++) { [lista[i], lista[j]] = [lista[j], lista[i]]; const p = pen(lista); if (p < mejor) { mejor = p; cambio = true; } else [lista[i], lista[j]] = [lista[j], lista[i]]; } }
      ini = fin;
    }
    return lista;
  }
  function rondaMex(t, cat, rk) {
    let juegan = rk; const sobra = rk.length % 4;
    if (sobra) {
      const pj = new Map(rk.map(id => [id, 0])); for (const m of t.partidos) if (m.cat === cat.id) for (const id of [...m.a.ids, ...m.b.ids]) pj.set(id, (pj.get(id) || 0) + 1);
      const fuera = new Set(rk.slice().reverse().sort((x, y) => pj.get(y) - pj.get(x)).slice(0, sobra)); juegan = rk.filter(id => !fuera.has(id));
    }
    cat.rondaMex++;
    for (let i = 0; i + 3 < juegan.length; i += 4) nuevo(t, { cat: cat.id, fase: 'americano', ronda: cat.rondaMex, a: DUO([juegan[i], juegan[i + 2]]), b: DUO([juegan[i + 1], juegan[i + 3]]) });
  }
  function siguienteRondaMexicano(t, catId) {
    const cat = catDe(t, catId); const ms = t.partidos.filter(m => m.cat === catId);
    if (ms.some(m => !m.res)) return { ok: false, error: 'Faltan resultados de la ronda actual.' };
    if (cat.rondaMex >= cat.formato.rondas) return { ok: false, error: 'Ya se jugaron las ' + cat.formato.rondas + ' rondas configuradas.' };
    rondaMex(t, cat, rankingAmericano(t, catId).map(f => f.id)); resolver(t); return { ok: true, ronda: cat.rondaMex };
  }

  function generarCuadro(t, catId, o = {}) {
    const cat = catDe(t, catId), f = cat.formato;
    if (!o.forzar && t.partidos.some(m => m.cat === catId && m.res)) return { ok: false, error: 'Esta categoría ya tiene resultados cargados. Bórralos antes de rehacer el cuadro.' };
    const ins = t.inscripciones.filter(i => i.cat === catId && i.estado === 'aprobada');
    const min = esPuntos(cat) ? 4 : 2;
    if (ins.length < min) return { ok: false, error: 'Se necesitan al menos ' + min + ' inscripciones aprobadas para armar el cuadro.' };
    t.partidos = t.partidos.filter(m => m.cat !== catId); t.conflictos = (t.conflictos || []).filter(c => t.partidos.some(m => m.id === c.id));
    const semilla = o.semilla || cat.semilla || 1, r = rng(semilla * 7919 + ins.length);
    const orden = [...ins.filter(i => i.seed > 0).sort((a, b) => a.seed - b.seed), ...barajar(ins.filter(i => !(i.seed > 0)), r)].map(i => i.id);
    cat.grupos = {}; cat.semilla = semilla; cat.generado = true; cat.rondaMex = 0; const partes = [];
    if (f.tipo === 'eliminacion') {
      const p = crearLlave(t, catId, 'principal', orden.map(INS), { tercer: f.tercer });
      partes.push('cuadro de ' + pow2(orden.length)); if (pow2(orden.length) > orden.length) partes.push((pow2(orden.length) - orden.length) + ' byes para los mejores sembrados');
      if (f.consolacion && consolacion(t, catId, p)) partes.push('consolación para quienes pierden su primer partido');
      if (f.tercer && p.tercer) partes.push('partido por el tercer lugar');
    } else if (f.tipo === 'grupos' || f.tipo === 'liga') {
      const liga = f.tipo === 'liga', tams = liga ? [orden.length] : tamanosGrupos(orden.length, f.tam), g = tams.length, gr = tams.map(() => []);
      const seq = [...Array(g).keys()].concat([...Array(g).keys()].reverse()); let p = 0;
      for (const id of orden) { while (gr[seq[p % seq.length]].length >= tams[seq[p % seq.length]]) p++; gr[seq[p % seq.length]].push(id); p++; }
      const fase = liga ? 'liga' : 'grupos';
      gr.forEach((ids, gi) => {
        const G = letra(gi); cat.grupos[G] = ids;
        if (!liga && ids.length === 4 && f.g4 !== 'todos') {
          const m1 = nuevo(t, { cat: catId, fase, grupo: G, ronda: 1, a: INS(ids[0]), b: INS(ids[3]) }), m2 = nuevo(t, { cat: catId, fase, grupo: G, ronda: 1, a: INS(ids[1]), b: INS(ids[2]) });
          if (f.g4 === 'gg_pp') { nuevo(t, { cat: catId, fase, grupo: G, ronda: 2, nota: 'Ganadores', a: GAN(m1), b: GAN(m2) }); nuevo(t, { cat: catId, fase, grupo: G, ronda: 2, nota: 'Perdedores', a: PER(m1), b: PER(m2) }); }
          else { nuevo(t, { cat: catId, fase, grupo: G, ronda: 2, nota: 'Cruzado', a: GAN(m1), b: PER(m2) }); nuevo(t, { cat: catId, fase, grupo: G, ronda: 2, nota: 'Cruzado', a: GAN(m2), b: PER(m1) }); }
        } else {
          const rs = circulo(ids), v = liga ? (f.vueltas || 1) : 1;
          for (let k = 0; k < v; k++) rs.forEach((ps, ri) => ps.forEach(([x, y]) => nuevo(t, { cat: catId, fase, grupo: G, ronda: k * rs.length + ri + 1, a: INS(k % 2 ? y : x), b: INS(k % 2 ? x : y) })));
        }
      });
      if (liga) partes.push('liga de ' + orden.length + (f.vueltas > 1 ? ' a dos vueltas' : ' a una vuelta'));
      else {
        partes.push(g + (g === 1 ? ' grupo de ' : ' grupos (') + (g === 1 ? tams[0] : tams.join(', ') + ')'));
        const k = Math.max(1, Math.min(f.clasifican, Math.min(...tams) - 1 || 1)), nombres = gr.map((_, i) => letra(i)), max = Math.max(...tams);
        const tier = pos => nombres.filter((_, i) => tams[i] >= pos).map(G => ({ tipo: 'grupo', g: G, pos }));
        const oro = sembrarPorGrupos(Array.from({ length: k }, (_, i) => tier(i + 1)));
        partes.push('clasifican ' + k + ' por grupo'); const lo = crearLlave(t, catId, 'oro', oro, { tercer: f.tercer });
        if (lo.rondas.length) partes.push('cuadro Oro de ' + pow2(oro.length));
        if (f.plata && max > k) { const pl = sembrarPorGrupos(Array.from({ length: max - k }, (_, i) => tier(k + i + 1)).filter(x => x.length)); if (crearLlave(t, catId, 'plata', pl).rondas.length) partes.push('cuadro Plata de ' + pow2(pl.length)); }
      }
    } else if (f.tipo === 'doble') {
      const W = crearLlave(t, catId, 'ganadores', orden.map(INS), { sinCierre: true, nombres: (r, c) => c === 1 ? 'Final de ganadores' : nombreRonda(c) }).rondas, k = W.length;
      if (k >= 2) {
        let lp = [], lr = 1; for (let i = 0; i < W[0].length; i += 2) lp.push(nuevo(t, { cat: catId, fase: 'perdedores', ronda: 1, nombreRonda: 'Perdedores R1', a: PER(W[0][i]), b: PER(W[0][i + 1]) }));
        for (let ri = 1; ri < k; ri++) {
          const drop = W[ri].slice().reverse(); lr++;
          const mayor = lp.map((x, i) => nuevo(t, { cat: catId, fase: 'perdedores', ronda: lr, nombreRonda: ri === k - 1 ? 'Final de perdedores' : 'Perdedores R' + lr, a: GAN(x), b: PER(drop[i]) }));
          if (ri < k - 1) { lr++; lp = []; for (let i = 0; i < mayor.length; i += 2) lp.push(nuevo(t, { cat: catId, fase: 'perdedores', ronda: lr, nombreRonda: 'Perdedores R' + lr, a: GAN(mayor[i]), b: GAN(mayor[i + 1]) })); } else lp = mayor;
        }
        nuevo(t, { cat: catId, fase: 'granfinal', ronda: 1, nombreRonda: 'Gran final', cierre: true, a: GAN(W[k - 1][0]), b: GAN(lp[0]) });
        partes.push('cuadro de ganadores de ' + pow2(orden.length), 'cuadro de perdedores', 'gran final a un partido');
      } else { W[0][0].cierre = true; partes.push('final directa'); }
    } else if (f.tipo === 'americano') {
      const rs = circulo(orden).slice(0, f.rondas || 99);
      rs.forEach((pares, ri) => { const ps = pares.slice(ri % pares.length).concat(pares.slice(0, ri % pares.length)); for (let i = 0; i + 1 < ps.length; i += 2) nuevo(t, { cat: catId, fase: 'americano', ronda: ri + 1, a: DUO(ps[i]), b: DUO(ps[i + 1]) }); });
      partes.push(rs.length + ' rondas a ' + f.puntos + ' puntos', 'compañero distinto en cada ronda');
    } else { rondaMex(t, cat, orden); partes.push('ronda 1 por sorteo', 'las siguientes ' + (f.rondas - 1) + ' se arman con el ranking'); }
    resolver(t);
    const n = t.partidos.filter(m => m.cat === catId && jugable(m)).length;
    return { ok: true, partidos: n, resumen: partes.join(' · ') + ' · ' + n + ' partidos' };
  }
  function previsualizar(t, catId) { const c = JSON.parse(JSON.stringify(t)); return generarCuadro(c, catId, { forzar: true }); }

  /* ---------- Programación: canchas y horarios con restricciones ---------- */
  function grafo(t) {
    const porId = new Map(t.partidos.map(m => [m.id, m])), cats = new Map(t.categorias.map(c => [c.id, c])), porGrupo = new Map(), info = new Map();
    for (const m of t.partidos) if (m.grupo) { const k = m.cat + '|' + m.grupo; if (!porGrupo.has(k)) porGrupo.set(k, []); porGrupo.get(k).push(m.id); }
    const lado = (m, src) => {
      if (src.tipo === 'ins') return { deps: [], pot: [src.id] }; if (src.tipo === 'duo') return { deps: [], pot: src.ids.slice() }; if (src.tipo === 'bye') return { deps: [], pot: [] };
      if (src.tipo === 'grupo') return { deps: (porGrupo.get(m.cat + '|' + src.g) || []).slice(), pot: (cats.get(m.cat).grupos[src.g] || []).slice() };
      const I = info.get(src.de); return { deps: [src.de], pot: [...new Set([...I.a.pot, ...I.b.pot])] };
    };
    for (const m of t.partidos) info.set(m.id, { a: lado(m, m.a), b: lado(m, m.b), hijos: [], nivel: 0, deps: [] });
    for (const m of t.partidos) { const I = info.get(m.id); I.deps = [...new Set([...I.a.deps, ...I.b.deps])].filter(d => d !== m.id); for (const d of I.deps) { info.get(d).hijos.push(m.id); I.nivel = Math.max(I.nivel, info.get(d).nivel + 1); } }
    return { porId, info, cats };
  }
  function contexto(t) {
    resolver(t);
    const R = t.reglas, paso = t.paso || 15, { porId, info, cats } = grafo(t);
    const ins = new Map(t.inscripciones.map(i => [i.id, i]));
    const dur = m => duracion(t, m);
    const mc = new Map(), mb = new Map(), mv = new Map();
    const claves = id => { if (!mc.has(id)) mc.set(id, ins.has(id) ? ins.get(id).jugadores.map(j => norm(j.nombre)) : []); return mc.get(id); };
    const bloqueos = id => { if (!mb.has(id)) mb.set(id, ((ins.get(id) || {}).noDisp || []).map(k => { const [d, h] = k.split('-').map(Number); return { ini: d * DIA + h * 60, fin: d * DIA + h * 60 + 60 }; })); return mb.get(id); };
    const ventanas = c => {
      if (!mv.has(c)) { const out = []; t.dias.forEach((d, di) => { let segs = [{ ini: di * DIA + d.desde, fin: di * DIA + d.hasta }];
        for (const b of t.bloqueos.filter(b => b.cancha === c && b.dia === di)) { const bi = di * DIA + b.desde, bf = di * DIA + b.hasta; segs = segs.flatMap(s => bf <= s.ini || bi >= s.fin ? [s] : [{ ini: s.ini, fin: bi }, { ini: bf, fin: s.fin }].filter(x => x.fin > x.ini)); }
        out.push(...segs); }); mv.set(c, out); }
      return mv.get(c);
    };
    const occC = new Map(t.canchas.map(c => [c.id, []])), occJ = new Map();
    const cert = m => { const out = []; for (const L of ['a', 'b']) { const r = m['r' + L]; if (r && r !== BYE) out.push(...String(r).split('+')); } return out; };
    const poner = (m, c, s) => { m.cancha = c; m.inicio = s; const fin = s + dur(m); occC.get(c).push({ ini: s, fin, id: m.id });
      for (const id of cert(m)) for (const k of claves(id)) { if (!occJ.has(k)) occJ.set(k, []); occJ.get(k).push({ ini: s, fin, id: m.id, am: m.fase === 'americano' ? m.cat : null }); } };
    const sacar = m => { if (m.cancha == null) return; occC.set(m.cancha, occC.get(m.cancha).filter(x => x.id !== m.id)); for (const [k, v] of occJ) if (v.some(x => x.id === m.id)) occJ.set(k, v.filter(x => x.id !== m.id)); m.cancha = null; m.inicio = null; };
    for (const m of t.partidos) { if (m.inicio == null) continue; if (!jugable(m) || !occC.has(m.cancha)) { m.cancha = null; m.inicio = null; continue; } const c = m.cancha, s = m.inicio; poner(m, c, s); }
    const ocupada = (c, ini, fin, salvo) => occC.get(c).some(x => x.id !== salvo && ini < x.fin && x.ini < fin);
    const no = (motivo, quien) => ({ ok: false, motivo, quien });
    function evaluar(m, c, ini, ignCancha, ignSuaves) {
      const fin = ini + dur(m), I = info.get(m.id), am = m.fase === 'americano' ? m.cat : null;
      if (!ventanas(c).some(v => ini >= v.ini && fin <= v.fin)) return no('horario');
      for (const d of I.deps) { const D = porId.get(d); if (!jugable(D)) continue; if (D.inicio == null) return no('dep'); if (ini < D.inicio + dur(D) + (am && D.fase === 'americano' ? 0 : R.descanso)) return no('dep'); }
      for (const h of I.hijos) { const H = porId.get(h); if (H.inicio != null && jugable(H) && H.inicio < fin + (am ? 0 : R.descanso)) return no('dep'); }
      if (!ignCancha && ocupada(c, ini, fin, m.id)) return no('cancha');
      let cierto = 0, incierto = 0; const dia = Math.floor(ini / DIA);
      for (const id of cert(m)) {
        for (const k of claves(id)) {
          let hoy = 0;
          for (const o of occJ.get(k) || []) { if (o.id === m.id) continue; const desc = am && o.am === am ? 0 : R.descanso; if (ini < o.fin && o.ini < fin) return no('choque', id); if (!ignSuaves && ini < o.fin + desc && o.ini < fin + desc) return no('descanso', id); if (!o.am && Math.floor(o.ini / DIA) === dia) hoy++; }
          if (!ignSuaves && !am && R.maxDia && hoy >= R.maxDia) return no('maxdia', id);
        }
        for (const b of bloqueos(id)) if (ini < b.fin && b.ini < fin) { if (t.restricciones.modo === 'obligatoria' && !ignSuaves) return no('restriccion', id); cierto++; break; }
      }
      for (const L of ['a', 'b']) { if (m['r' + L]) continue; const P = I[L].pot; if (!P.length) continue; let n = 0;
        for (const id of P) { if (bloqueos(id).some(b => ini < b.fin && b.ini < fin)) { n++; continue; } if (claves(id).some(k => (occJ.get(k) || []).some(o => o.id !== m.id && ini < o.fin && o.ini < fin))) n++; }
        incierto += n / P.length; }
      return { ok: true, costo: cierto * 10 + incierto, cierto, incierto };
    }
    // Los partidos caen en turnos fijos (cada "duración de grupos" desde la apertura del día), para que las horas se repitan: 9:00, 10:15, 11:30...
    const turno = R.turnos === false ? paso : (R.duraciones.grupos || paso);
    function* candidatos(m) { const d = dur(m), st = Math.min(turno, d); for (let ci = 0; ci < t.canchas.length; ci++) { const c = t.canchas[ci].id; for (const v of ventanas(c)) { const d0 = Math.floor(v.ini / DIA) * DIA + t.dias[Math.floor(v.ini / DIA)].desde; for (let s = d0 + Math.ceil((v.ini - d0) / st) * st; s + d <= v.fin; s += st) yield [c, s, s === v.ini, ci]; } } }
    function mejor(m) {
      let best = null, min = 0; const I = info.get(m.id), d = dur(m), tarde = m.cierre && R.cierreFinales;
      for (const x of I.deps) { const D = porId.get(x); if (!jugable(D)) continue; if (D.inicio == null) return null; min = Math.max(min, D.inicio + dur(D)); }
      for (const [c, s, borde, ci] of candidatos(m)) {
        if (s < min) continue; const e = evaluar(m, c, s); if (!e.ok) continue;
        // Con participantes por definir, cada restricción posible pesa como demora (300 min por participante esperado si son obligatorias, 120 si son preferencia), no como veto.
        const k2 = (tarde ? -s + ci * d * 2 : s + (borde || occC.get(c).some(x => x.fin === s) ? 0 : 20)) + e.incierto * (t.restricciones.modo === 'obligatoria' ? 300 : 120);
        if (!best || e.cierto < best.cierto || (e.cierto === best.cierto && k2 < best.k2)) best = { c, s, cierto: e.cierto, costo: e.costo, k2 };
      }
      return best;
    }
    const nombre = id => (ins.get(id) || {}).nombre || 'un participante';
    function textoMotivo(e) {
      return ({ horario: 'Queda fuera del horario de la cancha.', dep: 'No respeta el orden con los partidos de los que depende (incluido el descanso).', cancha: 'La cancha está ocupada a esa hora.',
        choque: nombre(e.quien) + ' ya tiene otro partido a esa hora.', descanso: 'No alcanza el descanso mínimo de ' + nombre(e.quien) + '.', maxdia: nombre(e.quien) + ' supera el máximo de partidos por día.',
        restriccion: 'Choca con una restricción horaria de ' + nombre(e.quien) + '.' })[e.motivo] || 'No disponible.';
    }
    function diagnostico(m) {
      const I = info.get(m.id); for (const d of I.deps) { const D = porId.get(d); if (jugable(D) && D.inicio == null) return { motivo: 'dep', texto: 'Depende de un partido anterior que tampoco tiene horario.' }; }
      const cnt = new Map(); let total = 0, soloCancha = 0;
      for (const [c, s] of candidatos(m)) { total++; const e = evaluar(m, c, s, true); if (e.ok) soloCancha++; else { const k = e.motivo + '|' + (e.quien || ''); cnt.set(k, (cnt.get(k) || 0) + 1); } }
      if (!total) return { motivo: 'horario', texto: 'El partido no cabe en ningún bloque de horario del torneo.' };
      if (soloCancha) return { motivo: 'cancha', texto: 'No quedan ' + DEPORTES[t.deporte].canchas + ' libres en los horarios que le sirven. Agrega horas, canchas o acorta la duración.' };
      const top = [...cnt.entries()].sort((x, y) => y[1] - x[1])[0];
      const [motivo, quien] = top[0].split('|');
      return { motivo, quien, texto: ({ restriccion: 'Las restricciones horarias de ' + nombre(quien) + ' no dejan ningún horario posible.', descanso: 'No alcanza el descanso mínimo de ' + nombre(quien) + ' entre partidos.', choque: nombre(quien) + ' tiene otros partidos en todos los horarios posibles.', maxdia: nombre(quien) + ' ya llega al máximo de partidos por día.', dep: 'No queda horario después de los partidos de los que depende.' })[motivo] || 'No se encontró horario.' };
    }
    return { R, porId, info, cats, dur, cert, poner, sacar, evaluar, candidatos, mejor, occC, diagnostico, textoMotivo, bloqueos, claves };
  }
  function programar(t, o = {}) {
    resolver(t);
    for (const m of t.partidos) { if (m.inicio == null || m.res || m.fijo) continue; if (o.cats && !o.cats.includes(m.cat)) continue; if (!o.soloPendientes) { m.cancha = null; m.inicio = null; } }
    const X = contexto(t), { info } = X; const fijos = new Set(t.partidos.filter(m => m.inicio != null).map(m => m.id));
    const catIdx = new Map(t.categorias.map((c, i) => [c.id, i])), idx = new Map(t.partidos.map((m, i) => [m.id, i]));
    const restr = m => X.cert(m).reduce((s, id) => s + X.bloqueos(id).length, 0);
    const pend = t.partidos.filter(m => jugable(m) && m.inicio == null && (!o.cats || o.cats.includes(m.cat)));
    pend.sort((x, y) => catIdx.get(x.cat) - catIdx.get(y.cat) || info.get(x.id).nivel - info.get(y.id).nivel || restr(y) - restr(x) || idx.get(x.id) - idx.get(y.id));
    function reparar(m) {
      const d = X.dur(m), ops = [];
      for (const [c, s] of X.candidatos(m)) {
        const e = X.evaluar(m, c, s, true); if (!e.ok) continue;
        const bl = X.occC.get(c).filter(x => s < x.fin && x.ini < s + d).map(x => X.porId.get(x.id));
        if (!bl.length || bl.length > 2 || bl.some(x => x.res || x.fijo || fijos.has(x.id))) continue; ops.push({ c, s, bl, costo: e.costo });
      }
      ops.sort((x, y) => x.costo - y.costo || x.bl.length - y.bl.length || x.s - y.s);
      for (const op of ops.slice(0, 60)) {
        const prev = op.bl.map(x => [x, x.cancha, x.inicio]); op.bl.forEach(X.sacar);
        if (!X.evaluar(m, op.c, op.s).ok) { prev.forEach(([x, c, s]) => X.poner(x, c, s)); continue; }
        X.poner(m, op.c, op.s); const puestos = []; let ok = true;
        for (const x of op.bl) { const b = X.mejor(x); if (b) { X.poner(x, b.c, b.s); puestos.push(x); } else { ok = false; break; } }
        if (ok) return true; puestos.forEach(X.sacar); X.sacar(m); prev.forEach(([x, c, s]) => X.poner(x, c, s));
      }
      return false;
    }
    let cola = [], progreso = true;
    for (const m of pend) { const b = X.mejor(m); if (b) X.poner(m, b.c, b.s); else cola.push(m); }
    while (progreso && cola.length) { progreso = false; const sig = []; for (const m of cola) { const b = X.mejor(m); if (b) { X.poner(m, b.c, b.s); progreso = true; } else if (reparar(m)) progreso = true; else sig.push(m); } cola = sig; }
    const otros = (t.conflictos || []).filter(c => { const m = X.porId.get(c.id); return m && jugable(m) && m.inicio == null && !cola.includes(m); });
    t.conflictos = [...otros, ...cola.map(m => Object.assign({ id: m.id }, X.diagnostico(m)))];
    return { programados: pend.length - cola.length, sinHorario: cola.length, conflictos: t.conflictos };
  }
  function validarPrograma(t) {
    const X = contexto(t), out = [];
    for (const m of t.partidos) {
      if (m.inicio == null || m.res) continue; const c = m.cancha, s = m.inicio; X.sacar(m); const e = X.evaluar(m, c, s); X.poner(m, c, s);
      if (!e.ok) out.push({ id: m.id, nivel: m.fijo && FORZABLES.includes(e.motivo) && X.evaluar(m, c, s, false, true).ok ? 'aviso' : 'error', motivo: e.motivo, texto: X.textoMotivo(e) });
      else if (e.cierto) out.push({ id: m.id, nivel: 'aviso', motivo: 'preferencia', texto: 'Queda en un horario que alguien marcó como no disponible.' });
    }
    return out;
  }
  function opciones(t, mId) {
    const X = contexto(t), m = X.porId.get(mId), prev = [m.cancha, m.inicio], out = []; X.sacar(m);
    for (const [c, s] of X.candidatos(m)) { const e = X.evaluar(m, c, s); out.push({ cancha: c, inicio: s, ok: e.ok, costo: e.ok ? e.costo : null, texto: e.ok ? (e.cierto ? 'Alguien marcó este horario como no disponible.' : '') : X.textoMotivo(e) }); }
    if (prev[0] != null) X.poner(m, prev[0], prev[1]); return out;
  }
  // forzar: el organizador puede pasar por alto restricción, descanso o máximo por día; nunca cancha ocupada, choque u orden de fases.
  function mover(t, mId, cancha, inicio, forzar) {
    const X = contexto(t), m = X.porId.get(mId), prev = [m.cancha, m.inicio]; X.sacar(m);
    if (cancha == null) { m.fijo = false; return { ok: true }; }
    const e = X.evaluar(m, cancha, inicio);
    if (!e.ok) { const f = FORZABLES.includes(e.motivo) && X.evaluar(m, cancha, inicio, false, true).ok;
      if (!f || !forzar) { if (prev[0] != null) X.poner(m, prev[0], prev[1]); return { ok: false, forzable: !!f, error: X.textoMotivo(e) }; } }
    X.poner(m, cancha, inicio); m.fijo = true; t.conflictos = (t.conflictos || []).filter(c => c.id !== mId); return { ok: true };
  }
  function intercambiar(t, a, b, forzar) {
    const X = contexto(t), A = X.porId.get(a), B = X.porId.get(b);
    if (!A || !B || A.res || B.res || A.inicio == null || B.inicio == null) return { ok: false, error: 'Solo se intercambian partidos con horario y sin resultado.' };
    const pa = [A.cancha, A.inicio], pb = [B.cancha, B.inicio]; X.sacar(A); X.sacar(B);
    for (const [m, p] of [[A, pb], [B, pa]]) {
      const e = X.evaluar(m, p[0], p[1]);
      if (!e.ok) { const f = FORZABLES.includes(e.motivo) && X.evaluar(m, p[0], p[1], false, true).ok;
        if (!f || !forzar) { X.sacar(A); X.sacar(B); X.poner(A, pa[0], pa[1]); X.poner(B, pb[0], pb[1]); return { ok: false, forzable: !!f, error: 'P' + m.n + ' de ' + catDe(t, m.cat).nombre + ': ' + X.textoMotivo(e) }; } }
      X.poner(m, p[0], p[1]);
    }
    A.fijo = true; B.fijo = true; return { ok: true };
  }
  // Cuando se conocen los cruces, un partido ya programado puede quedar en un horario que no le sirve a alguien: lo reubica.
  function ajustar(t) {
    const errs = validarPrograma(t).filter(a => a.nivel === 'error'); if (!errs.length) return { movidos: [], sinHorario: 0 };
    const porId = new Map(t.partidos.map(m => [m.id, m])), antes = new Map(t.partidos.map(m => [m.id, m.cancha + '@' + m.inicio]));
    const soltar = m => { m.cancha = null; m.inicio = null; m.fijo = false; };
    for (const a of errs) soltar(porId.get(a.id));
    programar(t, { soloPendientes: true });
    const falla = errs.map(a => porId.get(a.id)).filter(m => m.inicio == null);
    if (falla.length) { // no cabe antes de los partidos que dependen de él: se sueltan también y se reprograma la cadena
      const { info } = grafo(t), visto = new Set(); const baja = id => { for (const h of info.get(id).hijos) { if (visto.has(h)) continue; visto.add(h); const H = porId.get(h); if (!H.res) { soltar(H); baja(h); } } };
      falla.forEach(m => baja(m.id)); programar(t, { soloPendientes: true });
    }
    const movidos = t.partidos.filter(m => m.inicio != null && antes.get(m.id) !== m.cancha + '@' + m.inicio).map(m => m.id);
    return { movidos, sinHorario: t.partidos.filter(m => jugable(m) && !m.res && m.inicio == null).length };
  }
  function limpiarPrograma(t, cats) { for (const m of t.partidos) if (!m.res && (!cats || cats.includes(m.cat))) { m.cancha = null; m.inicio = null; m.fijo = false; } t.conflictos = []; }

  /* ---------- Resultados ---------- */
  function registrarResultado(t, mId, res) {
    const m = t.partidos.find(x => x.id === mId); if (!m) return { ok: false, error: 'Partido no encontrado.' };
    if (!listo(m)) return { ok: false, error: 'Este partido todavía no tiene definidos a sus participantes.' };
    if (res) { const v = validarResultado(t, m, res); if (!v.ok) return v; }
    const { info, porId } = grafo(t); const h = info.get(mId).hijos.map(x => porId.get(x)).find(x => x.res);
    if (h) return { ok: false, error: 'El partido P' + h.n + ' (' + etiqueta(t, h) + ') depende de este y ya tiene resultado. Bórralo primero.' };
    const antes = new Map(t.partidos.map(x => [x.id, [x.ra, x.rb]]));
    m.res = res || null; resolver(t);
    const avances = [];
    for (const x of t.partidos) { if (x.id === mId) continue; const [a, b] = antes.get(x.id); for (const [L, old] of [['a', a], ['b', b]]) { const now = x['r' + L]; if (now && now !== BYE && now !== old) avances.push({ quien: nombreLado(t, x, L), partido: x.id, donde: etiqueta(t, x) }); } }
    return { ok: true, avances };
  }
  // Lucky loser: sortea a alguien ya eliminado de la categoría para ocupar un cupo de una llave que aún no se juega.
  function luckyLoser(t, mId, L, semilla) {
    const m = t.partidos.find(x => x.id === mId), cat = catDe(t, m.cat);
    if (m.res) return { ok: false, error: 'El partido ya tiene resultado.' };
    if (!eliminatoria(m)) return { ok: false, error: 'El lucky loser solo aplica en llaves de eliminación.' };
    const sale = m['r' + L]; if (!sale || sale === BYE) return { ok: false, error: 'Ese cupo todavía no tiene a nadie definido.' };
    const fuera = new Set([sale]);
    for (const x of t.partidos) { if (x.cat !== m.cat) continue; if (jugable(x) && !x.res) for (const r of [x.ra, x.rb]) if (r && r !== BYE) String(r).split('+').forEach(id => fuera.add(id)); if (x.sust) Object.values(x.sust).forEach(id => fuera.add(id)); }
    for (const g of Object.keys(cat.grupos || {})) if (!tablaGrupo(t, m.cat, g).completa) cat.grupos[g].forEach(id => fuera.add(id));
    const jugaron = new Set(); for (const x of t.partidos) if (x.cat === m.cat && x.res) for (const L2 of ['a', 'b']) { const r = x['r' + L2], w = x.res.wo; if (r && r !== BYE && w !== 'ab' && w !== L2) jugaron.add(r); } // quien no se presentó no entra al sorteo
    const cand = t.inscripciones.filter(i => i.cat === m.cat && i.estado === 'aprobada' && !fuera.has(i.id) && jugaron.has(i.id));
    if (!cand.length) return { ok: false, error: 'No hay nadie eliminado en esta categoría para sortear.' };
    const entra = cand[Math.floor(rng(semilla || Date.now() % 100000)() * cand.length)];
    m.sust = Object.assign({}, m.sust, { [L]: entra.id }); resolver(t);
    return { ok: true, entra: entra.nombre, sale: (insDe(t, sale) || {}).nombre || '', candidatos: cand.length };
  }
  function resultadoAzar(t, m, r) {
    const marc = marcDe(t), cat = catDe(t, m.cat);
    if (esPuntos(cat)) { const p = cat.formato.puntos, a = Math.round(p / 4 + r() * p / 2); return { a, b: p - a }; }
    if (marc.tipo === 'sets') {
      const need = Math.ceil(marc.mejorDe / 2), g = r() < 0.5 ? 0 : 1, sets = []; let w = 0, l = 0;
      const uno = dec => { let s; if (dec && marc.decisivo !== 'set') { const o = marc.decisivo === 'super11' ? 11 : marc.decisivo === 'a15' ? 15 : 10; s = [o, Math.floor(r() * (o - 1))]; }
        else if (marc.tb) s = [[6, 1], [6, 2], [6, 3], [6, 3], [6, 4], [6, 4], [7, 5], [7, 6]][Math.floor(r() * 8)]; else s = [marc.a, Math.floor(r() * (marc.a - 1))]; return s; };
      while (w < need) { const dec = marc.mejorDe > 1 && w === need - 1 && l === need - 1; const pierde = !dec && l < need - 1 && r() < 0.28; const s = uno(dec); if (pierde) { l++; sets.push(g ? [s[0], s[1]] : [s[1], s[0]]); } else { w++; sets.push(g ? [s[1], s[0]] : [s[0], s[1]]); } }
      return { sets };
    }
    if (!marc.empate) { const a = 38 + Math.floor(r() * 30); let b = 38 + Math.floor(r() * 30); if (b === a) b++; return { a, b }; }
    const a = Math.floor(r() * 4), b = Math.floor(r() * 4), res = { a, b }; if (a === b && eliminatoria(m)) res.pen = r() < 0.5 ? [5, 4] : [3, 4]; return res;
  }
  function simular(t, o = {}) {
    const r = rng(o.semilla || 99); let n = 0, sigue = true;
    while (sigue) { sigue = false;
      const ms = t.partidos.filter(m => listo(m) && !m.res && (o.sinHorario || m.inicio != null) && (o.hasta == null || (m.inicio != null && m.inicio < o.hasta)) && (!o.cats || o.cats.includes(m.cat))).sort((x, y) => (x.inicio || 0) - (y.inicio || 0));
      for (const m of ms) { const x = registrarResultado(t, m.id, resultadoAzar(t, m, r)); if (x.ok) { n++; sigue = true; } if (o.max && n >= o.max) return n; } }
    return n;
  }
  function campeon(t, catId) {
    const cat = catDe(t, catId), ms = t.partidos.filter(m => m.cat === catId); if (!ms.length) return null;
    if (esPuntos(cat)) { if (ms.some(m => !m.res) || (cat.formato.tipo === 'mexicano' && cat.rondaMex < cat.formato.rondas)) return null; const rk = rankingAmericano(t, catId); return rk.length ? rk[0].id : null; }
    if (cat.formato.tipo === 'liga') { const tb = tablaGrupo(t, catId, 'A'); return tb.completa ? tb.filas[0].id : null; }
    const f = ms.filter(m => m.cierre && !m.tercer && ['principal', 'oro', 'granfinal', 'ganadores'].includes(m.fase)).pop(); if (!f && cat.formato.tipo === 'grupos' && Object.keys(cat.grupos).length === 1) { const tb = tablaGrupo(t, catId, 'A'); return tb.completa ? tb.filas[0].id : null; }
    return f && f.gan && f.gan !== BYE ? f.gan : null;
  }
  function estado(t) {
    const j = t.partidos.filter(jugable);
    return { aprobadas: t.inscripciones.filter(i => i.estado === 'aprobada').length, pendientes: t.inscripciones.filter(i => i.estado === 'pendiente').length, espera: t.inscripciones.filter(i => i.estado === 'espera').length,
      partidos: j.length, programados: j.filter(m => m.inicio != null).length, jugados: j.filter(m => m.res).length, sinHorario: j.filter(m => m.inicio == null && !m.res).length,
      generadas: t.categorias.filter(c => c.generado).length, categorias: t.categorias.length };
  }

  /* ---------- Datos de demostración ---------- */
  const NM = ['Matías', 'Benjamín', 'Vicente', 'Martín', 'Joaquín', 'Tomás', 'Agustín', 'Cristóbal', 'Sebastián', 'Felipe', 'Diego', 'Nicolás', 'Ignacio', 'Gonzalo', 'Rodrigo', 'Pablo', 'Andrés', 'Javier', 'Francisco', 'Cristián', 'Maximiliano', 'Lucas', 'Gabriel', 'Daniel', 'Álvaro', 'Camilo', 'Raúl', 'Hernán', 'Mauricio', 'Claudio'];
  const NF = ['Sofía', 'Antonia', 'Isidora', 'Florencia', 'Catalina', 'Valentina', 'Fernanda', 'Constanza', 'Javiera', 'Camila', 'Francisca', 'Daniela', 'Carolina', 'Paula', 'Macarena', 'Trinidad', 'Josefa', 'Amanda', 'Bárbara', 'Magdalena', 'Ignacia', 'Victoria', 'Rocío', 'Pilar'];
  const AP = ['González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Martínez', 'Sepúlveda', 'Morales', 'Rodríguez', 'López', 'Fuentes', 'Hernández', 'Torres', 'Araya', 'Flores', 'Espinoza', 'Valenzuela', 'Castillo', 'Tapia', 'Reyes', 'Gutiérrez', 'Castro', 'Pizarro', 'Álvarez', 'Vásquez', 'Sánchez', 'Fernández', 'Ramírez', 'Carrasco', 'Gómez', 'Cortés', 'Herrera', 'Núñez', 'Jara', 'Vergara', 'Rivera', 'Figueroa', 'Riquelme', 'García', 'Miranda', 'Bravo', 'Vera', 'Molina', 'Vega', 'Campos', 'Sandoval', 'Orellana', 'Cárdenas', 'Olivares', 'Alarcón', 'Gallardo', 'Ortiz', 'Garrido', 'Salazar', 'Guzmán', 'Henríquez', 'Saavedra', 'Navarro', 'Aguilera', 'Parra', 'Romero', 'Aravena', 'Vargas', 'Cáceres', 'Yáñez', 'Leiva', 'Escobar', 'Ruiz', 'Valdés', 'Vidal', 'Salinas', 'Zúñiga', 'Peña', 'Godoy', 'Lagos', 'Maldonado', 'Bustos'];
  const EQ = ['Deportivo Los Aromos', 'Unión Maipo', 'Atlético Ñuñoa', 'Real Quilín', 'Los Halcones', 'Peñalolén Unido', 'Estrella del Sur', 'Barrio Italia', 'Deportes La Reina', 'Los Cóndores', 'Juventud Macul', 'San Carlos', 'Lo Cañas Unido', 'Santa Julia', 'Villa Olímpica', 'Independiente Tobalaba', 'Los Pumas', 'Cordillera', 'Rayo Vitacura', 'Parque Bustamante'];
  function fechas(hoy, n) { const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()); d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7)); return Array.from({ length: n }, (_, i) => { const x = new Date(d); x.setDate(d.getDate() + i); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); }); }
  function demo(depId, hoy = new Date()) {
    const dep = DEPORTES[depId], r = rng(depId.length * 1009 + 17), usados = new Set(), f = fechas(hoy, 3);
    const persona = lista => { for (;;) { const n = lista[Math.floor(r() * lista.length)] + ' ' + AP[Math.floor(r() * AP.length)]; if (!usados.has(n)) { usados.add(n); return n; } } };
    const D = { padel: { nombre: 'Abierto Primavera', club: 'Club Pádel Los Aromos', canchas: 6 }, tenis: { nombre: 'Open de Otoño', club: 'Club de Tenis El Arrayán', canchas: 4 }, pickleball: { nombre: 'Copa Pickleball Oriente', club: 'Centro Deportivo Las Tranqueras', canchas: 4 },
      futbol: { nombre: 'Copa Empresas', club: 'Complejo Deportivo Quilín', canchas: 2 }, voleibol: { nombre: 'Liga Metropolitana', club: 'Gimnasio Municipal de Ñuñoa', canchas: 2 }, basquetbol: { nombre: 'Torneo Cuadrangular Plus', club: 'Gimnasio Santa Rosa', canchas: 2 } }[depId];
    const t = crearTorneo(depId, { id: 'demo-' + depId, nombre: D.nombre, club: D.club, ciudad: 'Santiago', canchas: D.canchas,
      dias: [{ fecha: f[0], desde: hm('18:00'), hasta: hm('23:30') }, { fecha: f[1], desde: hm('09:00'), hasta: hm('22:00') }, { fecha: f[2], desde: hm('09:00'), hasta: hm('20:00') }] });
    t.inscripcionAbierta = false; t.restricciones.protegidos = ['2-16', '2-17', '2-18', '2-19'];
    const patrones = [['0-18', '0-19'], ['0-18', '0-19', '0-20'], ['1-9', '1-10', '1-11'], ['1-9', '1-10'], ['1-14', '1-15', '1-16'], ['1-19', '1-20', '1-21'], ['2-9', '2-10', '2-11'], ['0-21', '0-22', '0-23'], ['1-12', '1-13'], ['2-9', '2-10']];
    const restr = () => { if (r() < 0.38) return []; const a = patrones[Math.floor(r() * patrones.length)].slice(); if (r() < 0.3) for (const k of patrones[Math.floor(r() * patrones.length)]) if (!a.includes(k) && a.length < t.restricciones.maxHoras) a.push(k); return a; };
    const cat = (nombre, tipo, n, o = {}) => {
      const c = agregarCategoria(t, Object.assign({ nombre, tipo, cupo: o.cupo || Math.max(n, 8), precio: o.precio || 0 }, o));
      const pl = ladoCat(t, c), lista = o.genero === 'f' ? NF : NM;
      for (let i = 0; i < n; i++) {
        const jug = dep.lado === 'equipo' ? null : Array.from({ length: pl }, (_, j) => persona(o.genero === 'x' ? (j ? NF : NM) : lista));
        const nombreEq = dep.lado === 'equipo' ? EQ[(i + t.categorias.length * 7) % EQ.length] : null;
        agregarInscripcion(t, { cat: c.id, jugadores: jug || [nombreEq], nombre: nombreEq || undefined, tel: '+56 9 ' + (5000 + Math.floor(r() * 4999)) + ' ' + (1000 + Math.floor(r() * 8999)), estado: i < (o.aprobadas == null ? n : o.aprobadas) ? 'aprobada' : 'pendiente', pago: r() < 0.85, seed: i < (o.seeds || 0) ? i + 1 : 0, noDisp: restr() });
      }
      return c;
    };
    if (depId === 'padel') {
      t.reglas.duraciones.semis = 90; t.reglas.duraciones.final = 90;
      cat('3ª Masculina', 'grupos', 16, { seeds: 4, precio: 36000, cupo: 16, formato: { tam: 4, g4: 'gg_pp', clasifican: 2, plata: true } });
      cat('4ª Masculina', 'grupos', 14, { seeds: 4, precio: 36000, cupo: 16, formato: { tam: 3, clasifican: 2, plata: true } });
      cat('4ª Femenina', 'grupos', 8, { seeds: 2, precio: 36000, cupo: 12, genero: 'f', formato: { tam: 4, g4: 'todos', clasifican: 2, plata: false, tercer: true } });
      const am = cat('Americano social', 'americano', 12, { precio: 12000, cupo: 12, genero: 'x', formato: { puntos: 24, rondas: 5 } });
      cat('Mixto B', 'eliminacion', 11, { seeds: 2, precio: 36000, cupo: 12, genero: 'x', aprobadas: 9, formato: { consolacion: true } });
      const dup = t.inscripciones.filter(i => i.cat === 'k1')[5]; t.inscripciones.filter(i => i.cat === am.id)[0].jugadores[0].nombre = dup.jugadores[0].nombre; t.inscripciones.filter(i => i.cat === am.id)[0].nombre = dup.nombre.split(' / ')[0];
      for (const c of t.categorias.slice(0, 4)) generarCuadro(t, c.id, { semilla: 3 });
    } else if (depId === 'tenis') {
      cat('Primera', 'eliminacion', 13, { seeds: 4, precio: 25000, cupo: 16, formato: { consolacion: true, tercer: false } });
      cat('Damas A', 'grupos', 8, { seeds: 2, precio: 25000, cupo: 8, genero: 'f', formato: { tam: 4, g4: 'todos', clasifican: 2, plata: false } });
      cat('Dobles mixto', 'doble', 8, { seeds: 2, precio: 30000, cupo: 8, genero: 'x', porLado: 2 });
      for (const c of t.categorias) generarCuadro(t, c.id, { semilla: 5 });
    } else if (depId === 'pickleball') {
      cat('Nivel 3.0', 'grupos', 9, { seeds: 3, precio: 20000, cupo: 12, formato: { tam: 3, clasifican: 2, plata: false } });
      cat('Mixto 3.5', 'liga', 6, { precio: 20000, cupo: 6, genero: 'x', formato: { vueltas: 1 } });
      cat('Mexicano abierto', 'mexicano', 8, { precio: 8000, cupo: 8, formato: { puntos: 21, rondas: 4 }, dur: { puntos: 15 } });
      for (const c of t.categorias) generarCuadro(t, c.id, { semilla: 2 });
    } else if (depId === 'futbol') {
      cat('Libre varones', 'grupos', 8, { seeds: 2, precio: 120000, cupo: 8, formato: { tam: 4, g4: 'todos', clasifican: 2, plata: false, tercer: true } });
      cat('Senior 35+', 'liga', 5, { precio: 120000, cupo: 6, formato: { vueltas: 1 } });
      for (const c of t.categorias) generarCuadro(t, c.id, { semilla: 4 });
    } else if (depId === 'voleibol') {
      cat('Damas', 'liga', 6, { precio: 80000, cupo: 6, formato: { vueltas: 1 } });
      cat('Mixto', 'eliminacion', 6, { seeds: 2, precio: 80000, cupo: 8, formato: { consolacion: false, tercer: true } });
      for (const c of t.categorias) generarCuadro(t, c.id, { semilla: 6 });
    } else {
      cat('Varones', 'doble', 4, { seeds: 2, precio: 90000, cupo: 4 });
      cat('Damas', 'grupos', 6, { seeds: 2, precio: 90000, cupo: 6, formato: { tam: 3, clasifican: 1, plata: false } });
      for (const c of t.categorias) generarCuadro(t, c.id, { semilla: 8 });
    }
    programar(t); simular(t, { hasta: DIA, semilla: 7 }); ajustar(t); t.bloqueado = true;
    return t;
  }

  return { DIA, BYE, DEPORTES, FORMATOS, CRITERIOS, FASES, norm, hm, hora, rng, pow2, catDe, insDe, esPuntos, ladoCat, marcDe, jugable, listo, eliminatoria,
    FASES_DUR, claveDur, duracion, intercambiar, luckyLoser, crearTorneo, formatoDef, agregarCategoria, agregarInscripcion, evalSets, statsPartido, validarResultado, textoResultado, clasificar, tablaGrupo, rankingAmericano,
    resolver, nombreLado, nombreFuente, etiqueta, ordenSiembra, tamanosGrupos, generarCuadro, previsualizar, siguienteRondaMexicano,
    programar, validarPrograma, ajustar, opciones, mover, limpiarPrograma, registrarResultado, simular, campeon, estado, demo };
})();
if (typeof module !== 'undefined') module.exports = Motor;
