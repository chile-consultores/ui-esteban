# ui-esteban

Mi biblioteca de componentes. Repo público de GitHub que funciona como
registry de shadcn: cualquier proyecto mío puede jalar de acá con un comando.

---

## Instalar algo desde acá

Desde cualquier proyecto con `components.json` (o sea, donde ya corriste
`npx shadcn@latest init`):

```bash
npx shadcn@latest add chile-consultores/ui-esteban/use-media-query
npx shadcn@latest add chile-consultores/ui-esteban/dialog
npx shadcn@latest add chile-consultores/ui-esteban/cloud-shader
```

El formato es `usuario/repo/nombre-del-item`. No hace falta configurar nada
en el proyecto que consume.

Para congelar una versión (recomendado en proyectos en producción):

```bash
npx shadcn@latest add chile-consultores/ui-esteban/dialog#v1.0.0
```

### Ver qué hay sin instalar

```bash
npx shadcn@latest list chile-consultores/ui-esteban
npx shadcn@latest search chile-consultores/ui-esteban --query "fondo"
npx shadcn@latest view chile-consultores/ui-esteban/cloud-shader
```

---

## Estructura

```
ui-esteban/
├── registry.json              ← raíz: solo apunta a los de abajo
└── registry/
    ├── ui/
    │   ├── registry.json      ← declara los items de esta categoría
    │   └── dialog/
    │       ├── dialog.tsx
    │       └── README.md
    ├── fondos/
    │   ├── registry.json
    │   └── cloud-shader/
    │       ├── cloud-shader.tsx
    │       └── README.md
    └── hooks/
        ├── registry.json
        └── use-media-query/
            └── use-media-query.ts
```

El `registry.json` raíz usa `include` para componerse de los sub-registries.
Así cada categoría se administra sola y el archivo raíz nunca crece.

**Los paths dentro de cada sub-registry son relativos a ese archivo**, no a la
raíz del repo. Por eso en `registry/ui/registry.json` dice `"dialog/dialog.tsx"`
y no `"registry/ui/dialog/dialog.tsx"`.

Los nombres de items deben ser únicos en todo el registry, aunque estén en
categorías distintas.

---

## Agregar un componente nuevo

1. `mkdir registry/<categoria>/<nombre>` y pega el archivo ahí.
2. Agrega el item al `registry.json` de esa categoría.
3. Copia `PLANTILLA-README.md` a la carpeta como `README.md` y llénalo.
4. Valida antes de commitear:

   ```bash
   npx shadcn@latest validate .
   ```

5. Commit y push. Listo — ya es instalable.

### Los campos que importan

- **`type`** — cómo lo trata el CLI y dónde lo deja:
  `registry:ui`, `registry:component`, `registry:block`, `registry:hook`,
  `registry:lib`, `registry:page`, `registry:file`, `registry:style`,
  `registry:theme`.
- **`categories`** — texto libre, para buscar. Acá es donde va tu taxonomía
  propia: `["fondos", "hero"]`, `["formularios"]`, `["navegacion"]`.
- **`dependencies`** — paquetes npm que instala solo.
- **`registryDependencies`** — otros items de los que depende. Se traen solos.
  - `"button"` a secas = el button oficial de shadcn.
  - Para uno de **este mismo repo** hay que usar la dirección completa:
    `"chile-consultores/ui-esteban/dialog"`.
- **`target`** — dónde cae el archivo en el proyecto destino. Obligatorio para
  `registry:page` y `registry:file`.

---

## Licencias — leer antes de hacer público

El registry por dirección de GitHub **solo funciona con repos públicos**.
Eso significa que todo lo que pongas acá queda redistribuido públicamente.

- **Componentes míos** → sin problema.
- **Componentes de terceros** (Aceternity, etc.) → usarlos en mis proyectos
  es una cosa; republicarlos en un repo público es otra. Antes de subir uno,
  revisar su licencia.

Alternativa si quiero guardar cosas de terceros sin republicarlas: dejarlas
en un repo **privado** aparte, y usarlas por copiar y pegar. El registry por
GitHub no soporta repos privados; para eso habría que montar un namespace con
autenticación, que ya es otra pega.

Regla simple: **este repo, solo código propio.** Lo de terceros, en otro lado.

---

## Si algún día quiero URL propia

No hace falta hoy. Pero si en algún momento quiero
`npx shadcn@latest add https://ui.esteban.dev/r/dialog.json`:

```bash
npx shadcn build          # genera public/r/*.json
```

Y publicas `public/` en Cloudflare Pages (gratis). El repo no cambia de forma.

---

## Pendientes

- [ ] Reemplazar `chile-consultores` por mi usuario real en `registry.json` y acá.
- [ ] Pegar el `dialog.tsx` real.
- [ ] Decidir si el `cloud-shader` va acá o en el repo privado.
- [ ] `npx shadcn@latest validate .` sin errores.
