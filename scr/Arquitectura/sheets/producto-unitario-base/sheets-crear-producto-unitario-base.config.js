/**
 * Configuración de la acción Crear para Producto Unitario Base (Tabla-Receta-Base).
 * Cargado por crear-producto-unitario-base.html. Requiere producto-unitario-base-sheets-base.js antes.
 * tipoDato / tipoComponente: label (solo lectura), combo-basico, text-box. obligatorio reemplaza nullable (por defecto false).
 */
(function () {
  var base = window.PRODUCTO_UNITARIO_BASE_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá producto-unitario-base-sheets-base.js antes de sheets-crear-producto-unitario-base.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "Orden",
      alias: "Orden",
      tipoDato: "numeric",
      tipoComponente: "label",
      autogeneradorID: true,
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
      descripcion: "ID autogenerado.",
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
      descripcion: "Comercio o sucursal (valores de hoja COMBOS, columna COMERCIO-SUCURSAL).",
      restricciones: {}
    },
    {
      nombre: "Categoria",
      alias: "Categoría",
      tipoDato: "text",
      tipoComponente: "combo-basico",
      comboListadoValores: "COMBOS.COMBO-CATEGORIA",
      visible: true,
      obligatorio: false,
      descripcion: "Categoría del producto (valores de hoja COMBOS, columna COMBO-CATEGORIA).",
      restricciones: {}
    },
    {
      nombre: "Nombre-Producto",
      alias: "Nombre Producto",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: true,
      descripcion: "Nombre del producto.",
      restricciones: { maxLongitud: 500 }
    },
    {
      nombre: "IDElaboracion-ProductoBase",
      alias: "ID Elaboración Base",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: false,
      descripcion: "Referencia a elaboración productos base.",
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
      descripcion: "Costo de producción base.",
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
      descripcion: "Costo de relleno.",
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
      descripcion: "Costo de decoración.",
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
      descripcion: "Tiempo de elaboración en minutos.",
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
      descripcion: "Costo mano de obra elaboración.",
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
      descripcion: "Calculado: Producción + Relleno + Decoración + Mano obra.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Elaboracion-Anterior",
      alias: "Costo Anterior",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: false,
      obligatorio: false,
      descripcion: "Valor anterior (solo lectura).",
      formatoVisual: "moneda"
    },
    {
      nombre: "Habilitado",
      alias: "Habilitado",
      tipoDato: "text",
      tipoComponente: "combo-basico",
      visible: true,
      obligatorio: true,
      descripcion: "Sí / No.",
      restricciones: { valoresPermitidos: ["Sí", "No", ""] }
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
      columnasPropias: (base.hoja && Array.isArray(base.hoja.columnasPropias)) ? base.hoja.columnasPropias : [],
      columnaOrden: hoja.columnaOrden,
      prefijoId: hoja.prefijoId,
      patronId: hoja.patronId,
      indices: hoja.indices,
      columnas: columnas
    }]
  };
})();
