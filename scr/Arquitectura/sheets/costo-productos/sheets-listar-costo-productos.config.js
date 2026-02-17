/**
 * Configuración de la acción Listar (Tabla-Costo-Productos). Solo columnas y listado.
 * Cargado por costo-productos.html. Requiere costo-productos-sheets-base.js antes.
 * tipoDato / tipoComponente: en listar solo se muestran datos (label). Sin nullable ni restricciones.
 */
(function () {
  var base = window.COSTO_PRODUCTOS_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá costo-productos-sheets-base.js antes de sheets-listar-costo-productos.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "Orden",
      alias: "Orden",
      tipoDato: "numeric",
      tipoComponente: "label",
      visible: false,
      descripcion: "Orden."
    },
    {
      nombre: "IDCosto-Producto",
      alias: "ID Costo Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      descripcion: "ID."
    },
    {
      nombre: "Categoria",
      alias: "Categoría",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Categoría."
    },
    {
      nombre: "Producto",
      alias: "Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Producto."
    },
    {
      nombre: "Costo-Producto-Maestro-Total",
      alias: "Costo Producto Maestro Total",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: false
    },
    {
      nombre: "Costo-Packing",
      alias: "Costo Packing",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: false
    },
    {
      nombre: "Costos-Fijos",
      alias: "Costos Fijos",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: false
    },
    {
      nombre: "Merma-Porcentaje",
      alias: "Merma Porcentaje",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: false
    },
    {
      nombre: "Merma-Importe",
      alias: "Merma Importe",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: false
    },
    {
      nombre: "Tiiempo-Packing-Minutos",
      alias: "Tiempo Packing Minutos",
      tipoDato: "numeric",
      tipoComponente: "label",
      visible: false
    },
    {
      nombre: "Costo-Mano-Obra-Packing",
      alias: "Costo Mano Obra Packing",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: false
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
      visible: false
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
      columnasPropias: Array.isArray(hoja.columnasPropias) ? hoja.columnasPropias : [],
      columnaOrden: hoja.columnaOrden,
      prefijoId: hoja.prefijoId,
      patronId: hoja.patronId,
      indices: hoja.indices,
      columnas: columnas,
      listado: {
        columnasAgrupacion: ["Categorial"],
        columnaFiltroValores: "Categorial",
        modosAgrupacion: [
          ["Categorial"],
        ]
      }
    }]
  };
})();
