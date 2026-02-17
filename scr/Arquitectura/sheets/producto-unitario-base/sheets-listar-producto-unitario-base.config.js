/**
 * Configuración de la acción Listar para Producto Unitario Base.
 * Cargado por producto-unitario-base.html. Requiere producto-unitario-base-sheets-base.js antes.
 */
(function () {
  var base = window.PRODUCTO_UNITARIO_BASE_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá producto-unitario-base-sheets-base.js antes de sheets-listar-producto-unitario-base.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    { nombre: "Orden", alias: "Orden", tipoDato: "numeric", tipoComponente: "label", visible: false },
    { nombre: "IDCosto-ProductoUnitario", alias: "ID Costo Producto Unitario", tipoDato: "text", tipoComponente: "label", visible: false },
    { nombre: "Comercio-Sucursal", alias: "Comercio Sucursal", tipoDato: "text", tipoComponente: "label", visible: false },
    { nombre: "Tipo-Producto", alias: "Tipo Producto", tipoDato: "text", tipoComponente: "label", visible: false },
    { nombre: "Nombre-Producto", alias: "Nombre Producto", tipoDato: "text", tipoComponente: "label", visible: true },
    { nombre: "IDElaboracion-ProductoBase", alias: "ID Elaboración Base", tipoDato: "text", tipoComponente: "label", visible: false },
    { nombre: "Costo-Produccion-ProductoBase", alias: "Costo Producción Base", tipoDato: "numeric", tipoComponente: "label", decimales: 2, visible: true, formatoVisual: "moneda" },
    { nombre: "Costo-Relleno-Producto", alias: "Costo Relleno", tipoDato: "numeric", tipoComponente: "label", decimales: 2, visible: true, formatoVisual: "moneda" },
    { nombre: "Costo-Decoracion-Producto", alias: "Costo Decoración", tipoDato: "numeric", tipoComponente: "label", decimales: 2, visible: true, formatoVisual: "moneda" },
    { nombre: "Tiempo-Elaboracion-Minutos", alias: "Tiempo (min)", tipoDato: "numeric", tipoComponente: "label", visible: true },
    { nombre: "Costo-Mano-Obra-Elaboracion", alias: "Costo Mano Obra", tipoDato: "numeric", tipoComponente: "label", decimales: 2, visible: true, formatoVisual: "moneda" },
    { nombre: "Costo-Elaboracion-Actual", alias: "Costo Elaboración Actual", tipoDato: "numeric", tipoComponente: "label", decimales: 2, visible: true, formatoVisual: "moneda" },
    { nombre: "Costo-Elaboracion-Anterior", alias: "Costo Anterior", tipoDato: "numeric", tipoComponente: "label", decimales: 2, visible: true, formatoVisual: "moneda" },
    { nombre: "Habilitado", alias: "Habilitado", tipoDato: "text", tipoComponente: "label", visible: false },
    { nombre: "Fecha-Registro-Actualizado-Al", alias: "Actualizado", tipoDato: "text", tipoComponente: "label", visible: false },
    { nombre: "Actualizado", alias: "Actualizado", tipoDato: "text", tipoComponente: "label", visible: false }
  ];
  window.PRODUCTO_UNITARIO_BASE_SHEETS_JSON = {
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
        columnasAgrupacion: ["Comercio-Sucursal"],
        columnaFiltroValores: "Comercio-Sucursal",
        modosAgrupacion: [["Tipo-Producto"]]
      }
    }]
  };
})();
