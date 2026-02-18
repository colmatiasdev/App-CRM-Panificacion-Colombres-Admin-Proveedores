/**
 * Configuración de la acción Crear para Receta Detalle (Tabla-Receta-Base-Detalle).
 * FK IDReceta-Base → Tabla-Receta-Base; FK IDInsumo-MateriaPrima → PRECIO-Materia-Prima.
 * Lookups completan Nombre-Insumo, Unidad-Medida, Precio-Equivalencia-x-Unidad al elegir insumo.
 */
(function () {
  var base = window.RECETA_DETALLE_SHEET_BASE;
  if (!base || !base.hoja) throw new Error("Cargá receta-detalle-sheets-base.js antes de sheets-crear-receta-detalle.config.js");
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "IDReceta-Base-Detalle",
      alias: "ID Detalle",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      obligatorio: true,
      descripcion: "ID autogenerado.",
      restricciones: {}
    },
    {
      nombre: "IDReceta-Base",
      alias: "ID Receta Base",
      tipoDato: "text",
      tipoComponente: "combo-desde-api",
      visible: true,
      obligatorio: true,
      descripcion: "Receta base (Tabla-Receta-Base).",
      restricciones: { maxLongitud: 100 },
      comboDesdeApi: { sheet: "Tabla-Receta-Base", valorColumna: "IDReceta-Base", etiquetaColumna: "Descripcion-Masa-Producto" }
    },
    {
      nombre: "IDInsumo-MateriaPrima",
      alias: "Insumo (Materia Prima)",
      tipoDato: "text",
      tipoComponente: "combo-desde-api",
      visible: true,
      obligatorio: true,
      descripcion: "Insumo desde PRECIO-Materia-Prima (idmateria-prima).",
      restricciones: { maxLongitud: 100 },
      comboDesdeApi: { sheet: "PRECIO-Materia-Prima", valorColumna: "idmateria-prima", etiquetaColumna: "Nombre-Producto" }
    },
    {
      nombre: "Nombre-Insumo",
      alias: "Nombre Insumo",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      obligatorio: false,
      descripcion: "Completado por relación con PRECIO-Materia-Prima.",
      restricciones: { maxLongitud: 200 }
    },
    {
      nombre: "Cantidad",
      alias: "Cantidad",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      visible: true,
      obligatorio: true,
      descripcion: "Cantidad.",
      restricciones: { min: 0, entero: true } 
    },
    {
      nombre: "Unidad-Medida",
      alias: "Unidad Medida",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      obligatorio: true,
      descripcion: "Completado por relación con PRECIO-Materia-Prima.",
      restricciones: { maxLongitud: 50 }
    },
    {
      nombre: "Precio-Equivalencia-x-Unidad",
      alias: "Costo del Insumo",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      obligatorio: true,
      descripcion: "Precio equivalencia por unidad (se completa desde insumo, editable).",
      restricciones: { min: 0 },
      formatoVisual: "moneda"
    },
    {
      nombre: "Importe",
      alias: "Importe",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      obligatorio: false,
      descripcion: "Fórmula: Cantidad × Precio.",
      formatoVisual: "moneda",
      restricciones: {}
    }
  ];
  window.RECETA_DETALLE_SHEETS_JSON = {
    modulo: base.modulo,
    descripcion: base.descripcion,
    hojas: [
      {
        nombre: hoja.nombre,
        nombreHoja: hoja.nombreHoja,
        clavePrimaria: hoja.clavePrimaria,
        clavesForaneas: hoja.clavesForaneas || [],
        columnasPropias: (base.hoja && Array.isArray(base.hoja.columnasPropias)) ? base.hoja.columnasPropias : [],
        columnaOrden: hoja.columnaOrden,
        prefijoId: hoja.prefijoId,
        patronId: hoja.patronId,
        indices: hoja.indices,
        formulas: hoja.formulas || {},
        lookups: Array.isArray(hoja.lookups) ? hoja.lookups : [],
        columnas: columnas
      }
    ]
  };
})();
