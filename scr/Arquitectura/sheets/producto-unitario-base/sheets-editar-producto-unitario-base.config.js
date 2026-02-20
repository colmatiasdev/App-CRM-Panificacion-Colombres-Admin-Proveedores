/**
 * Configuración de la acción Editar para Producto Unitario Base (Tabla-Receta-Base).
 * Cargado por editar-producto-unitario-base.html. Requiere producto-unitario-base-sheets-base.js antes.
 * tipoDato / tipoComponente: label, combo-basico, text-box. obligatorio reemplaza nullable.
 */
(function () {
  var base = window.PRODUCTO_UNITARIO_BASE_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá producto-unitario-base-sheets-base.js antes de sheets-editar-producto-unitario-base.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "Orden",
      alias: "Orden",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: true,
      descripcion: "Orden en listados.",
      restricciones: { min: 0, entero: true }
    },
    {
      nombre: "IDCosto-ProductoUnitario",
      alias: "ID Costo Producto Unitario",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      obligatorio: true,
      descripcion: "ID (solo lectura).",
      restricciones: {}
    },
    {
      nombre: "Comercio-Sucursal",
      alias: "Comercio Sucursal",
      tipoDato: "text",
      tipoComponente: "combo-basico",
      comboListadoValores: "COMPONENTE-COMBOS.Combo-Comercio-Sucursal",
      visible: true,
      obligatorio: true,
      descripcion: "Comercio o sucursal.",
      restricciones: {}
    },
    {
      nombre: "Categoria",
      alias: "Categoría",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: false,
      descripcion: "Categoría del producto.",
      restricciones: { maxLongitud: 200 }
    },
    {
      nombre: "Nombre-Producto",
      alias: "Nombre Producto",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: true,
      restricciones: { maxLongitud: 500 }
    },
    {
      nombre: "IDElaboracion-ProductoBase",
      alias: "ID Elaboración Base",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: false,
      restricciones: { maxLongitud: 100 }
    },
    {
      nombre: "Costo-Produccion-ProductoBase",
      alias: "Costo Producción Base",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      visible: true,
      obligatorio: false,
      restricciones: { min: 0 },
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Relleno-Producto",
      alias: "Costo Relleno",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      visible: true,
      obligatorio: false,
      restricciones: { min: 0 },
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Decoracion-Producto",
      alias: "Costo Decoración",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      visible: true,
      obligatorio: false,
      restricciones: { min: 0 },
      formatoVisual: "moneda"
    },
    {
      nombre: "Tiempo-Elaboracion-Minutos",
      alias: "Tiempo (min)",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: false,
      restricciones: { min: 0, entero: true }
    },
    {
      nombre: "Costo-Mano-Obra-Elaboracion",
      alias: "Costo Mano Obra",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      visible: true,
      obligatorio: false,
      restricciones: { min: 0 },
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Elaboracion-Actual [G + H + I + K]",
      alias: "Costo Elaboración Actual",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      obligatorio: false,
      descripcion: "Calculado (solo lectura).",
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Elaboracion-Anterior",
      alias: "Costo Anterior",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      obligatorio: false,
      formatoVisual: "moneda"
    },
    {
      nombre: "Habilitado",
      alias: "Habilitado",
      tipoDato: "text",
      tipoComponente: "combo-basico",
      visible: true,
      obligatorio: true,
      restricciones: { valoresPermitidos: ["Sí", "No", ""] }
    },
    {
      nombre: "Fecha-Registro-Actualizado-Al",
      alias: "Fecha actualización",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      obligatorio: false
    },
    {
      nombre: "Actualizado",
      alias: "Actualizado",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      obligatorio: false
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
