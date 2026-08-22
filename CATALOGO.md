# Catálogo de fuentes

Dónde buscar cuando necesito algo. **La licencia manda**: solo lo marcado
como ✅ puede guardarse en `registry/` (repo público). El resto es ficha
y comando, nada más.

Última revisión: 2026-08-22

---

## ✅ Guardables — MIT

MIT permite copiar, modificar y redistribuir, **siempre que conserve el
aviso de copyright y el texto de la licencia**. Si guardo un componente
MIT acá, va con su atribución en el README de la carpeta.

### Magic UI — https://magicui.design
150+ componentes animados. La apuesta más segura para fondos y efectos de
texto. Es el reemplazo directo de Aceternity que sí puedo guardar.

- **Sirve para:** fondos animados, efectos de texto, marquees, bento grids
- **Stack:** React, TypeScript, Tailwind, Motion
- `npx shadcn@latest add @magicui/<componente>`

### Kibo UI — https://www.kibo-ui.com
Los componentes complejos que uno normalmente construiría a mano.

- **Sirve para:** Gantt, Kanban, editor de código, color picker, dropzone
- Autor: Hayden Bleasel

### Cult UI — https://www.cult-ui.com
Animaciones con más gusto y menos espectáculo.

- **Sirve para:** cards interactivas, grids animados, texto en movimiento

### Origin UI — https://originui.com
Cobertura amplia de primitivas. Rellena los huecos de shadcn.

- **Sirve para:** inputs, selects, variaciones de formulario

### HyperUI — https://www.hyperui.dev
HTML + Tailwind puro, sin React. **Sirve para mis sitios estáticos**,
donde el registry no aplica.

- **Sirve para:** headers, footers, CTA, pricing, FAQ, newsletter
- No hay CLI: se copia y pega

### Motion Primitives — https://motion-primitives.com
Bloques de movimiento de bajo nivel, para componer animaciones propias.

### Tremor — https://tremor.so
Solo para dashboards: gráficos, KPI cards, tablas de datos.

### Otros MIT según el look
- **Neobrutalism Components** — alto contraste, bordes gruesos
- **8bitcn** — estética retro
- **Animate UI** — anima primitivas que ya tengo
- **ReUI** — catálogo amplio y pulido

---

## ⚠️ Guardable con matiz — MIT + Commons Clause

### React Bits — https://www.reactbits.dev
110+ componentes animados, probablemente la colección más creativa que
existe. Cuatro variantes de cada uno: JS-CSS, JS-TW, TS-CSS, TS-TW.

- **Sirve para:** animaciones de texto, fondos, efectos interactivos
- Autor: David Haz
- `npx shadcn@latest add "https://reactbits.dev/r/<componente>"`

**El matiz:** la Commons Clause prohíbe *vender* el software en sí. Usarlo
en proyectos propios y de clientes está permitido. Como no pienso vender
un registry, no me afecta — pero si lo guardo, con atribución completa.

---

## ❌ No guardables — solo ficha

### Aceternity UI — https://ui.aceternity.com
Los efectos más cinematográficos del ecosistema.

- **Usar en mis proyectos:** ✅ permitido, incluso comercial
- **Guardar el código acá:** ❌ prohíbe redistribuir los archivos fuente,
  aunque los modifique
- **Flujo correcto:** ficha acá → `npx shadcn@latest add @aceternity/<x>`
  en el proyecto donde lo necesite

Probados en el playground: `cloud-shader`, `3d-globe`

### Freemium — revisar caso a caso
Tailark, Skiper UI, 21st.dev, shadcnblocks, MynaUI. Licencias varían por
tier. **Revisar antes de guardar nada.**

---

## Dónde explorar

- **registry.directory** — busca en todos los registries públicos
- **shadcn.io/awesome/registries** — lista curada
- **ui.shadcn.com/docs/directory** — el directorio oficial

---

## Reglas que me di

1. Antes de guardar algo de terceros, **verificar la licencia** y anotarla.
2. Si es MIT, incluir el aviso de copyright original. No es opcional.
3. Si dudo, no lo guardo: dejo la ficha y el comando.
4. Ver un efecto y escribir mi propia versión desde cero es legítimo.
   Copiar el archivo y renombrar variables, no.

---

## Mis repos

- **ui-esteban** (público) — este. Solo código mío o MIT con atribución.
- **playground** (privado) — mesa de trabajo. Todo lo que pruebe, sin
  restricción. Galería automática en `src/demos/`.