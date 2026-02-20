/**
 * Configuración de la acción Ver para Producto Unitario Base (Tabla-Receta-Base).
 * Cargado por ver-producto-unitario-base.html. Requiere producto-unitario-base-sheets-base.js antes.
 * Solo lectura: todas las columnas con tipoComponente "label".
 */
(function () {
  var base = window.PRODUCTO_UNITARIO_BASE_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá producto-unitario-base-sheets-base.js antes de sheets-ver-producto-unitario-base.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "Orden",
      alias: "Orden",
      tipoDato: "numeric",
      tipoComponente: "label",
      visible: false
    },
    {
      nombre: "IDCosto-ProductoUnitario",
      alias: "ID Costo Producto Unitario",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false
    },
    {
      nombre: "Comercio-Sucursal",
      alias: "Comercio Sucursal",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true
    },
    {
      nombre: "Categoria",
      alias: "Categoría",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true
    },
    {
      nombre: "Nombre-Producto",
      alias: "Nombre Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true
    },
    {
      nombre: "IDElaboracion-ProductoBase",
      alias: "ID Elaboración Base",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true
    },
    {
      nombre: "Costo-Produccion-ProductoBase",
      alias: "Costo Producción Base",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Relleno-Producto",
      alias: "Costo Relleno",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Decoracion-Producto",
      alias: "Costo Decoración",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      formatoVisual: "moneda"
    },
    {
      nombre: "Tiempo-Elaboracion-Minutos",
      alias: "Tiempo (min)",
      tipoDato: "numeric",
      tipoComponente: "label",
      visible: true
    },
    {
      nombre: "Costo-Mano-Obra-Elaboracion",
      alias: "Costo Mano Obra",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Elaboracion-Actual [G + H + I + K]",
      alias: "Costo Elaboración Actual",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Elaboracion-Anterior",
      alias: "Costo Anterior",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      formatoVisual: "moneda"
    },
    {
      nombre: "Habilitado",
      alias: "Habilitado",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false
    },
    {
      nombre: "Fecha-Registro-Actualizado-Al",
      alias: "Fecha actualización",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false
    },
    {
      nombre: "Actualizado",
      alias: "Actualizado",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false
    }
  ];
  window.PRODUCTO_UNITARIO_BASE_SHEETS_JSON = {
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
