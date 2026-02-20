/**
 * Configuración de la acción Listar para Producto Unitario Base.
 * Cargado por producto-unitario-base.html. Requiere producto-unitario-base-sheets-base.js antes.
 * tipoDato: tipo de dato. tipoComponente: label, combo-basico, text-box, etc.
 */
(function () {
  var base = window.PRODUCTO_UNITARIO_BASE_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá producto-unitario-base-sheets-base.js antes de sheets-listar-producto-unitario-base.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "Orden",
      alias: "Orden",
      tipoDato: "numeric",
      tipoComponente: "label",
      visible: false,
      descripcion: "Orden de aparición en listados."
    },
    {
      nombre: "IDCosto-ProductoUnitario",
      alias: "ID Costo Producto Unitario",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      descripcion: "Identificador único."
    },
    {
      nombre: "Comercio-Sucursal",
      alias: "Comercio Sucursal",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      listadoValores: "COMPONENTE-COMBOS.Combo-Comercio-Sucursal",
      descripcion: "Comercio o sucursal."
    },
    {
      nombre: "Categoria",
      alias: "Categoría",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Categoría del producto."
    },
    {
      nombre: "Nombre-Producto",
      alias: "Nombre Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Nombre del producto."
    },
    {
      nombre: "IDElaboracion-ProductoBase",
      alias: "ID Elaboración Base",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      descripcion: "Referencia a elaboración productos base."
    },
    {
      nombre: "Costo-Produccion",
      alias: "Costo Producción Base",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Costo de producción base.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Relleno-Producto",
      alias: "Costo Relleno",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Costo de relleno.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Decoracion-Producto",
      alias: "Costo Decoración",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Costo de decoración.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Tiempo-Elaboracion-Minutos",
      alias: "Tiempo (min)",
      tipoDato: "numeric",
      tipoComponente: "label",
      visible: true,
      descripcion: "Tiempo de elaboración en minutos."
    },
    {
      nombre: "Costo-Mano-Obra-Elaboracion",
      alias: "Costo Mano Obra",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Costo mano de obra elaboración.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Elaboracion-Actual [G + H + I + K]",
      alias: "Costo Elaboración Actual",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Costo elaboración actual (fórmula G+H+I+K).",
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Elaboracion-Anterior",
      alias: "Costo Anterior",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Costo elaboración anterior.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Habilitado",
      alias: "Habilitado",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      descripcion: "Sí / No."
    },
    {
      nombre: "Fecha-Registro-Actualizado-Al",
      alias: "Actualizado",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      descripcion: "Fecha de última actualización."
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
      columnaOrden: hoja.columnaOrden,
      prefijoId: hoja.prefijoId,
      patronId: hoja.patronId,
      indices: hoja.indices,
      columnas: columnas,
      listado: {
        columnasAgrupacion: ["Comercio-Sucursal"],
        columnaFiltroValores: "Comercio-Sucursal",
        modosAgrupacion: [
          ["Categoria"]
        ]
      }
    }]
  };
})();
