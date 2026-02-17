/**
 * Configuración de la acción Crear para Elaboración Productos Base (Tabla-Elaboracion-ProductosBase).
 * Cargado por crear-elaboracion-productos-base.html. Requiere elaboracion-productos-base-sheets-base.js antes.
 * tipoDato / tipoComponente: label (solo lectura), text-box. obligatorio reemplaza nullable.
 */
(function () {
  var base = window.ELABORACION_PRODUCTOS_BASE_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá elaboracion-productos-base-sheets-base.js antes de sheets-crear-elaboracion-productos-base.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "IDElaboracion-ProductoBase",
      alias: "ID Elaboración",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      obligatorio: true,
      descripcion: "ID autogenerado.",
      restricciones: {}
    },
    {
      nombre: "IDReceta-Base",
      alias: "ID Receta Base",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: true,
      descripcion: "Referencia a Tabla-Receta-Base.",
      restricciones: { maxLongitud: 100 }
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
      restricciones: { min: 0 },
      formatoVisual: "numero"
    },
    {
      nombre: "Costo-Produccion-ProductoBase",
      alias: "Costo Producción Base",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      visible: true,
      obligatorio: false,
      descripcion: "Costo de producción base.",
      restricciones: { min: 0 },
      formatoVisual: "moneda"
    },
    {
      nombre: "Monto",
      alias: "Monto",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      visible: true,
      obligatorio: false,
      descripcion: "Monto.",
      restricciones: { min: 0 },
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
      columnasPropias: (base.hoja && Array.isArray(base.hoja.columnasPropias)) ? base.hoja.columnasPropias : [],
      columnaOrden: hoja.columnaOrden,
      prefijoId: hoja.prefijoId,
      patronId: hoja.patronId,
      indices: hoja.indices,
      columnas: columnas
    }]
  };
})();
