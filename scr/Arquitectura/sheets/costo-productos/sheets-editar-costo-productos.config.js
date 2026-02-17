/**
 * Configuración de la acción Editar (Tabla-Costo-Productos). Solo columnas.
 * Cargado por editar-costo-producto.html. Requiere costo-productos-sheets-base.js antes.
 * tipoDato / tipoComponente: label, combo-basico, text-box. obligatorio reemplaza nullable.
 */
(function () {
  var base = window.COSTO_PRODUCTOS_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá costo-productos-sheets-base.js antes de sheets-editar-costo-productos.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "Orden",
      alias: "Orden",
      tipoDato: "numeric",
      tipoComponente: "label",
      visible: false,
      restricciones: { min: 0, entero: true }
    },
    {
      nombre: "IDCosto-Producto",
      alias: "ID Costo Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      descripcion: "ID (solo lectura).",
      restricciones: {}
    },
    {
      nombre: "Categoria",
      alias: "Categoría",
      tipoDato: "text",
      tipoComponente: "combo-basico",
      comboListadoValores: "COMBO.COMBO-CATEGORIA",
      visible: true,
      obligatorio: true,
      descripcion: "Categoría.",
      restricciones: {}
    },
    {
      nombre: "Producto",
      alias: "Producto",
      tipoDato: "text",
      tipoComponente: "text-box",
      obligatorio: true,
      visible: true,
      restricciones: { maxLongitud: 500 }
    },
    {
      nombre: "Costo-Producto-Maestro-Total",
      alias: "Costo Producto Maestro Total",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      obligatorio: true,
      visible: true,
      restricciones: { min: 0 }
    },
    {
      nombre: "Costo-Packing",
      alias: "Costo Packing",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      obligatorio: true,
      visible: true,
      restricciones: { min: 0 }
    },
    {
      nombre: "Costos-Fijos",
      alias: "Costos Fijos",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      obligatorio: true,
      visible: true,
      restricciones: {}
    },
    {
      nombre: "Merma-Porcentaje",
      alias: "Merma Porcentaje",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 0,
      obligatorio: true,
      visible: true,
      restricciones: { min: 0, max: 5 }
    },
    {
      nombre: "Merma-Importe",
      alias: "Merma Importe",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      obligatorio: true,
      visible: true,
      restricciones: { min: 0 }
    },
    {
      nombre: "Tiempo-Packing-Minutos",
      alias: "Tiempo Packing Minutos",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      obligatorio: true,
      visible: true,
      restricciones: { min: 0, entero: true }
    },
    {
      nombre: "Costo-Mano-Obra-Packing",
      alias: "Costo Mano Obra Packing",
      tipoDato: "numeric",
      tipoComponente: "label",  
      obligatorio: true,
      decimales: 2,
      visible: true,
      restricciones: { min: 0 }
    },
    {
      nombre: "Costo-Producto-Final-Actual",
      alias: "Costo Producto Final Actual",
      tipoDato: "numeric",
      tipoComponente: "text-box", 
      obligatorio: true,
      decimales: 2,
      visible: true,
      restricciones: { min: 0 }
    },
    {
      nombre: "Costo-Producto-Final-Anterior",
      alias: "Costo Producto Final Anterior",
      tipoDato: "numeric",
      tipoComponente: "label",
      obligatorio: true,
      decimales: 2,
      visible: true,
      restricciones: { min: 0 }
    },
    {
      nombre: "Habilitado",
      alias: "Habilitado",
      tipoDato: "text",
      tipoComponente: "combo-basico",
      visible: false,
      restricciones: { valoresPermitidos: ["Sí", "No", ""] }
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
      formulas: hoja.formulas && typeof hoja.formulas === "object" ? hoja.formulas : {},
      lookups: Array.isArray(hoja.lookups) ? hoja.lookups : [],
      columnaOrden: hoja.columnaOrden,
      prefijoId: hoja.prefijoId,
      patronId: hoja.patronId,
      indices: hoja.indices,
      columnas: columnas
    }]
  };
})();
