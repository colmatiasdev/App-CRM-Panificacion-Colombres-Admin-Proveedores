/**
 * Configuración de la acción Ver (Tabla-Costo-Productos). Solo columnas.
 * Cargado por ver-costo-producto.html. Requiere costo-productos-sheets-base.js antes.
 * tipoDato / tipoComponente: en ver solo se muestran datos (label). Sin nullable ni restricciones.
 */
(function () {
  var base = window.COSTO_PRODUCTOS_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá costo-productos-sheets-base.js antes de sheets-ver-costo-productos.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "Orden",
      alias: "Orden",
      tipoDato: "numeric",
      tipoComponente: "label",
      visible: true
    },
    {
      nombre: "IDCosto-Producto",
      alias: "ID Costo Producto",
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
      nombre: "Producto",
      alias: "Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true
    },
    {
      nombre: "Costo-Producto-Maestro-Total",
      alias: "Costo Producto Maestro Total",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true
    },
    {
      nombre: "Costo-Packing",
      alias: "Costo Packing",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true
    },
    {
      nombre: "Costos-Fijos",
      alias: "Costos Fijos",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true
    },
    {
      nombre: "Merma-Porcentaje",
      alias: "Merma Porcentaje",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true
    },
    {
      nombre: "Merma-Importe",
      alias: "Merma Importe",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true
    },
    {
      nombre: "Tiiempo-Packing-Minutos",
      alias: "Tiempo Packing Minutos",
      tipoDato: "numeric",
      tipoComponente: "label",
      visible: true
    },
    {
      nombre: "Costo-Mano-Obra-Packing",
      alias: "Costo Mano Obra Packing",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true
    },
    {
      nombre: "Costo-Producto-Final-Actual",
      alias: "Costo Producto Final Actual",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true
    },
    {
      nombre: "Costo-Producto-Final-Anterior",
      alias: "Costo Producto Final Anterior",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true
    },
    {
      nombre: "Habilitado",
      alias: "Habilitado",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true
    }
  ];
  window.COSTO_PRODUCTOS_SHEETS_JSON = {
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
      columnas: columnas
    }]
  };
})();
