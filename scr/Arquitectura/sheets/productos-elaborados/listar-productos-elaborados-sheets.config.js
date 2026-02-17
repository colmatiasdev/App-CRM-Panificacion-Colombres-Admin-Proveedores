/**
 * Configuración de la acción Listar. Solo columnas y listado (agrupación).
 * Cargado por productos-elaborados.html. Requiere productos-elaborados-sheets-base.js antes.
 */
(function () {
  var base = window.PRODUCTOS_ELABORADOS_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá productos-elaborados-sheets-base.js antes de listar-productos-elaborados-sheets.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "Orden-Lista",
      tipo: "numeric",
      nullable: true,
      autogeneradoOrden: true,
      label: true,
      visible: true,
      descripcion: "Orden de aparición en listados.",
      restricciones: { min: 0, entero: true }
    },
    {
      nombre: "IDProducto",
      tipo: "text",
      nullable: false,
      label: true,
      visible: false,
      descripcion: "Identificador único.",
      restricciones: {}
    },
    {
      nombre: "Comercio-Sucursal",
      tipo: "text",
      nullable: true,
      visible: false,
      listadoValores: "COMPONENTE-COMBOS.Combo-Comercio-Sucursal",
      descripcion: "Comercio o sucursal.",
      restricciones: { maxLongitud: 200 }
    },
    {
      nombre: "Nombre-Producto",
      tipo: "text",
      nullable: true,
      visible: true,
      descripcion: "Nombre del producto.",
      restricciones: { maxLongitud: 500 }
    },
    {
      nombre: "Costo-Producto-Final-Actual",
      tipo: "numeric",
      nullable: true,
      decimales: 2,
      visible: true,
      descripcion: "Costo final actual.",
      restricciones: { min: 0 }
    },
    {
      nombre: "Observaciones",
      tipo: "text",
      nullable: true,
      visible: false,
      restricciones: { maxLongitud: 2000 }
    },
    {
      nombre: "Habilitado",
      tipo: "text",
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
      prefijoId: hoja.prefijoId,
      patronId: hoja.patronId,
      indices: hoja.indices,
      columnas: columnas,
      listado: {
        columnasAgrupacion: ["Comercio-Sucursal"],
        modosAgrupacion: [
          [],
          ["Comercio-Sucursal"],
          ["Comercio-Sucursal", "Habilitado"]
        ]
      }
    }]
  };
})();
