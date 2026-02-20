/**
 * Configuración de la acción Listar para Elaboración Productos Base.
 * Cargado por elaboracion-productos-base.html. Requiere elaboracion-productos-base-sheets-base.js antes.
 * tipoDato: tipo de dato. tipoComponente: label, text-box, etc.
 */
(function () {
  var base = window.ELABORACION_PRODUCTOS_BASE_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá elaboracion-productos-base-sheets-base.js antes de sheets-listar-elaboracion-productos-base.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "IDElaboracion-ProductoBase",
      alias: "ID Elaboración",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "PK del registro. Tabla-Costos-ProductoUnitario vincula por esta columna."
    },
    {
      nombre: "IDReceta-Base",
      alias: "ID Receta Base",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Referencia a Tabla-Receta-Base."
    },
    {
      nombre: "Cantidad",
      alias: "Cantidad",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Cantidad.",
      restricciones: { min: 0 }
    },
    {
      nombre: "Descripcion-Masa-Producto",
      alias: "Descripción Masa Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Descripción de la masa del producto."
    },
    {
      nombre: "Costo-Produccion-ProductoBase",
      alias: "Costo Producción Base",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Costo de producción base.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Monto",
      alias: "Monto",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Monto.",
      formatoVisual: "moneda"
    }
  ];
  window.ELABORACION_PRODUCTOS_BASE_SHEETS_JSON = {
    modulo: base.modulo,
    descripcion: base.descripcion,
    hojas: [{
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
        columnasAgrupacion: ["IDReceta-Base"],
        columnaFiltroValores: "IDReceta-Base",
        modosAgrupacion: []
      }
    }]
  };
})();
