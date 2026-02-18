/**
 * Configuración de la acción Editar para Receta Detalle (Tabla-Receta-Base-Detalle).
 */
(function () {
  var base = window.RECETA_DETALLE_SHEET_BASE;
  if (!base || !base.hoja) throw new Error("Cargá receta-detalle-sheets-base.js antes de sheets-editar-receta-detalle.config.js");
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "IDReceta-Base-Detalle",
      alias: "ID Detalle",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      obligatorio: true,
      descripcion: "ID (solo lectura).",
      restricciones: {}
    },
    {
      nombre: "IDReceta-Base",
      alias: "ID Receta Base",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: true,
      descripcion: "ID de la receta base.",
      restricciones: { maxLongitud: 100 }
    },
    {
      nombre: "IDInsumo-MateriaPrima",
      alias: "ID Insumo Materia Prima",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: true,
      descripcion: "ID del insumo.",
      restricciones: { maxLongitud: 100 }
    },
    {
      nombre: "Nombre-Insumo",
      alias: "Nombre Insumo",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: false,
      descripcion: "Nombre del insumo.",
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
      restricciones: { min: 0 }
    },
    {
      nombre: "Unidad-Medida",
      alias: "Unidad Medida",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: false,
      descripcion: "Unidad de medida.",
      restricciones: { maxLongitud: 50 }
    },
    {
      nombre: "Precio-Equivalencia-x-Unidad",
      alias: "Precio x Unidad",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      visible: true,
      obligatorio: false,
      descripcion: "Precio equivalencia por unidad.",
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
      descripcion: "Fórmula (solo lectura).",
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
        columnasPropias: Array.isArray(hoja.columnasPropias) ? hoja.columnasPropias : [],
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
