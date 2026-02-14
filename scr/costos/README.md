# Módulos Costos — Estructura y rutas

## Patrón por módulo

Cada módulo tiene **su propia carpeta** con:

- **HTML**: listado (`packing.html` / `materia-prima.html`), crear (`crear-*.html`), editar (`editar-*.html`).
- **CSS compartido**: `../costos.css` (un solo archivo para todos los módulos de costos).
- **JS compartido**: `../costos-sheet.js` (lógica de listado, formularios y API).
- **Config global**: `../../../config.js` (raíz del proyecto).

Estructura:

```
scr/costos/
├── costos.css          ← estilos de todas las páginas costos
├── costos-sheet.js     ← lógica compartida (listado, crear, editar, API, COSTOS_EQUIVALENCIA)
├── README.md
├── Packing/
│   ├── packing.html
│   ├── crear-packing.html
│   └── editar-packing.html
├── Materia-Prima/
│   ├── materia-prima.html
│   ├── crear-materia-prima.html
│   └── editar-materia-prima.html
└── Calculadora/
    └── calculadora-equivalencia.html   ← módulo Calculadora de equivalencia
```

## Rutas que debe usar cada HTML

Desde **cualquier archivo** dentro de `scr/costos/Packing/` o `scr/costos/Materia-Prima/`:

| Recurso      | Ruta relativa      | Motivo |
|-------------|--------------------|--------|
| CSS costos  | `../costos.css`    | El CSS está en la carpeta padre `scr/costos/`. |
| JS costos   | `../costos-sheet.js`| El JS está en `scr/costos/`. |
| Config      | `../../../config.js` | `config.js` está en la raíz del proyecto. |

**Errores habituales:**

- En crear/editar de Materia Prima usar `costos.css` o `costos-sheet.js` sin `../` → el navegador busca dentro de `Materia-Prima/` y no encuentra los archivos (CSS/JS no se ven).
- Usar `../../config.js` → apunta a `scr/config.js`; debe ser `../../../config.js` para llegar a la raíz.

## Navegación rápida

Todas las páginas de costos incluyen una barra `.costos-nav` con enlaces a:

- **Inicio** → `../../../index.html#costos`
- **Packing** → desde Packing: `packing.html`; desde otras: `../Packing/packing.html`
- **Materia prima** → desde Materia-Prima: `materia-prima.html`; desde otras: `../Materia-Prima/materia-prima.html`
- **Calculadora** → desde Calculadora: `calculadora-equivalencia.html`; desde otras: `../Calculadora/calculadora-equivalencia.html`

Así se puede saltar entre módulos sin volver al inicio. La **Calculadora de equivalencia** es un módulo propio para convertir cantidades entre unidades (masa, volumen, longitud, conteo).

## Añadir un nuevo módulo

1. Crear carpeta `scr/costos/NombreModulo/`.
2. Añadir `listado.html`, `crear-nombre-modulo.html`, `editar-nombre-modulo.html`.
3. En cada HTML: `<link href="../costos.css">`, `<script src="../costos-sheet.js">`, `<script src="../../../config.js">`.
4. Incluir la misma `<nav class="costos-nav">` con enlaces a Inicio, Packing, Materia prima (y el nuevo módulo si se desea).
5. En `costos-sheet.js` y en `config.js` (googleSheet.gids) añadir la hoja/nombre del nuevo módulo si usa Sheets/API.
