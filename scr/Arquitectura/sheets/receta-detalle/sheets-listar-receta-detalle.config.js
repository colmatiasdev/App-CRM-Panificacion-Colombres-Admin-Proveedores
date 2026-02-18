/**
 * Configuración de la acción Listar para Receta Detalle.
 * Cargado por receta-detalle.html. Requiere receta-detalle-sheets-base.js antes.
 */
(function () {
  var base = window.RECETA_DETALLE_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá receta-detalle-sheets-base.js antes de sheets-listar-receta-detalle.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "IDReceta-Base-Detalle",
      alias: "ID Detalle",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Identificador único."
    },
    {
      nombre: "IDReceta-Base",
      alias: "ID Receta Base",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Receta base asociada."
    },
    {
      nombre: "IDInsumo-MateriaPrima",
      alias: "ID Insumo",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Insumo materia prima."
    },
    {
      nombre: "Nombre-Insumo",
      alias: "Nombre Insumo",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Nombre del insumo."
    },
    {
      nombre: "Cantidad",
      alias: "Cantidad",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Cantidad."
    },
    {
      nombre: "Unidad-Medida",
      alias: "Unidad Medida",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Unidad de medida."
    },
    {
      nombre: "Precio-Equivalencia-x-Unidad",
      alias: "Precio x Unidad",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Precio equivalencia por unidad.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Importe",
      alias: "Importe",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Cantidad × Precio.",
      formatoVisual: "moneda"
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
        columnaOrden: hoja.columnaOrden,
        prefijoId: hoja.prefijoId,
        patronId: hoja.patronId,
        indices: hoja.indices,
        columnas: columnas,
        listado: {
          columnasAgrupacion: [],
          columnaFiltroValores: null,
          modosAgrupacion: []
        }
      }
    ]
  };
})();
