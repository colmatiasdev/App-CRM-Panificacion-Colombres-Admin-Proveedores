/**
 * Configuración de la acción Ver para Elaboración Productos Base (Tabla-Elaboracion-ProductosBase).
 * Cargado por ver-elaboracion-productos-base.html. Requiere elaboracion-productos-base-sheets-base.js antes.
 */
(function () {
  var base = window.ELABORACION_PRODUCTOS_BASE_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá elaboracion-productos-base-sheets-base.js antes de sheets-ver-elaboracion-productos-base.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    { nombre: "IDElaboracion-ProductoBase", alias: "ID Elaboración", tipoDato: "text", tipoComponente: "label", visible: true },
    { nombre: "IDReceta-Base", alias: "ID Receta Base", tipoDato: "text", tipoComponente: "label", visible: true },
    { nombre: "Cantidad", alias: "Cantidad", tipoDato: "numeric", tipoComponente: "label", decimales: 2, visible: true },
    { nombre: "Costo-Produccion-ProductoBase", alias: "Costo Producción Base", tipoDato: "numeric", tipoComponente: "label", decimales: 2, visible: true, formatoVisual: "moneda" },
    { nombre: "Monto", alias: "Monto", tipoDato: "numeric", tipoComponente: "label", decimales: 2, visible: true, formatoVisual: "moneda" }
  ];
  window.ELABORACION_PRODUCTOS_BASE_SHEETS_JSON = {
    modulo: base.modulo,
    descripcion: base.descripcion,
    hojas: [{
      nombre: hoja.nombre,
      nombreHoja: hoja.nombreHoja,
      clavePrimaria: hoja.clavePrimaria,
      clavesForaneas: hoja.clavesForaneas || [],
      columnasPropias: Array.isArray(hoja.columnasPropias) ? hoja.columnasPropias : [],
      columnaOrden: hoja.columnaOrden,
      prefijoId: hoja.prefijoId,
      patronId: hoja.patronId,
      indices: hoja.indices,
      columnas: columnas
    }]
  };
})();
