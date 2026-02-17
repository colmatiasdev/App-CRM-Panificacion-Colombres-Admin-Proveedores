/**
 * Configuración de la acción Ver. Solo columnas (qué mostrar en detalle).
 * Cargado por ver-producto-elaborado.html. Requiere productos-elaborados-sheets-base.js antes.
 * tipoDato: tipo de dato. tipoComponente: label (solo lectura), combo-basico, text-box, etc.
 */
(function () {
  var base = window.PRODUCTOS_ELABORADOS_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá productos-elaborados-sheets-base.js antes de sheets-ver-productos-elaborados.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "Orden-Lista",
      alias: "Orden Lista",
      tipoDato: "numeric",
      tipoComponente: "label",
      visible: true,
      descripcion: "Orden en listados."
    },
    {
      nombre: "IDProducto",
      alias: "ID Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Identificador único."
    },
    {
      nombre: "IDCosto-Producto",
      alias: "ID Costo Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Referencia a Tabla-Costo-Productos (FK)."
    },
    {
      nombre: "Comercio-Sucursal",
      alias: "Comercio Sucursal",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      listadoValores: "COMPONENTE-COMBOS.Combo-Comercio-Sucursal",
      descripcion: "Comercio o sucursal."
    },
    {
      nombre: "Categoria",
      alias: "Categoría",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Categoría del producto (desde costo)."
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
      nombre: "Costo-Producto-Final-Actual",
      alias: "Costo Producto Final Actual",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Costo final actual.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Observaciones",
      alias: "Observaciones",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true
    },
    {
      nombre: "Habilitado",
      alias: "Habilitado",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      descripcion: "Sí / No."
    }
  ];
  window.PRODUCTOS_ELABORADOS_SHEETS_JSON = {
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
