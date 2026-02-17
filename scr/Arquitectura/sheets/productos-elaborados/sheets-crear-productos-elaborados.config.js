/**
 * Configuración de la acción Crear. Solo columnas (comportamiento del formulario).
 * Cargado por crear-producto-elaborado.html. Requiere productos-elaborados-sheets-base.js antes.
 * tipoDato: tipo de dato (numeric, text). tipoComponente: label (solo lectura), combo-basico, text-box (caja de texto editable), etc.
 */
(function () {
  var base = window.PRODUCTOS_ELABORADOS_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá productos-elaborados-sheets-base.js antes de sheets-crear-productos-elaborados.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "Orden-Lista",
      alias: "Orden Lista",
      tipoDato: "numeric",
      tipoComponente: "label",
      nullable: true,
      autogeneradorID: true,
      visible: true,
      descripcion: "Orden en listados.",
      restricciones: { min: 0, entero: true }
    },
    {
      nombre: "IDProducto",
      alias: "ID Producto",
      tipoDato: "text",
      tipoComponente: "label",
      nullable: false,
      visible: true,
      descripcion: "ID autogenerado.",
      restricciones: {}
    },
    {
      nombre: "IDCosto-Producto",
      alias: "ID Costo Producto",
      tipoDato: "text",
      tipoComponente: "text-box",
      nullable: true,
      visible: false,
      descripcion: "Referencia a Tabla-Costo-Productos (FK).",
      restricciones: { maxLongitud: 100 }
    },
    {
      nombre: "Comercio-Sucursal",
      alias: "Comercio Sucursal",
      tipoDato: "text",
      tipoComponente: "combo-basico",
      comboListadoValores: "COMPONENTE-COMBOS.Combo-Comercio-Sucursal",
      nullable: false,
      obligatorio: true,
      visible: true,
      descripcion: "Comercio o sucursal.",
      restricciones: {}
    },
    {
      nombre: "Nombre-Producto",
      alias: "Nombre Producto",
      tipoDato: "text",
      tipoComponente: "text-box",
      nullable: true,
      visible: true,
      descripcion: "Nombre del producto.",
      restricciones: { maxLongitud: 500 }
    },
    {
      nombre: "Costo-Producto-Final-Actual",
      alias: "Costo Producto Final Actual",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      nullable: true,
      decimales: 2,
      visible: true,
      descripcion: "Costo final actual.",
      restricciones: { min: 0 }
    },
    {
      nombre: "Observaciones",
      alias: "Observaciones",
      tipoDato: "text",
      tipoComponente: "text-box",
      nullable: true,
      visible: false,
      restricciones: { maxLongitud: 2000 }
    },
    {
      nombre: "Habilitado",
      alias: "Habilitado",
      tipoDato: "text",
      tipoComponente: "combo-basico",
      nullable: true,
      visible: false,
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
      columnasPropias: Array.isArray(hoja.columnasPropias) ? hoja.columnasPropias : [],
      columnaOrden: hoja.columnaOrden,
      prefijoId: hoja.prefijoId,
      patronId: hoja.patronId,
      indices: hoja.indices,
      columnas: columnas
    }]
  };
})();
