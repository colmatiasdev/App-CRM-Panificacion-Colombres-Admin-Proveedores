/**
 * Configuración de la acción Editar. Solo columnas (comportamiento del formulario).
 * Cargado por editar-producto-elaborado.html. Requiere productos-elaborados-sheets-base.js antes.
 * tipoDato: tipo de dato (numeric, text). tipoComponente: label, combo-basico, text-box, etc.
 */
(function () {
  var base = window.PRODUCTOS_ELABORADOS_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá productos-elaborados-sheets-base.js antes de sheets-editar-productos-elaborados.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "Orden-Lista",
      alias: "Orden Lista",
      tipoDato: "numeric",
      tipoComponente: "label",
      visible: true,
      obligatorio: true,
      descripcion: "Orden en listados.",
      restricciones: { min: 0, entero: true }
    },
    {
      nombre: "IDProducto",
      alias: "ID Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      obligatorio: true,
      descripcion: "ID (solo lectura).",
      restricciones: {}
    },
    {
      nombre: "IDCosto-Producto",
      alias: "ID Costo Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      obligatorio: false,
      descripcion: "Referencia a Tabla-Costo-Productos (FK).",
      restricciones: { maxLongitud: 100 }
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
      nombre: "Nombre-Producto",
      alias: "Nombre Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Nombre del producto.",
      restricciones: { maxLongitud: 500 }
    },
    {
      nombre: "Costo-Producto-Final-Actual",
      alias: "Costo Producto Final Actual",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      obligatorio: false,
      descripcion: "Costo final actual.",
      restricciones: { min: 0 }
    },
    {
      nombre: "Observaciones",
      alias: "Observaciones",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: false,
      obligatorio: false,
      restricciones: { maxLongitud: 2000 }
    },
    {
      nombre: "Habilitado",
      alias: "Habilitado",
      tipoDato: "text",
      tipoComponente: "label",
      visible: false,
      obligatorio: false,
      descripcion: "Sí / No.",
      restricciones: { valoresPermitidos: ["Sí", "No", ""] }
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
