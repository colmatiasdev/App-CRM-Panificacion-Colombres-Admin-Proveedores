/**
 * Configuración de la acción Ver (Tabla-Costo-Productos). Solo columnas.
 * Cargado por ver-costo-producto.html. Requiere costo-productos-sheets-base.js antes.
 */
(function () {
  var base = window.COSTO_PRODUCTOS_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá costo-productos-sheets-base.js antes de sheets-ver-costo-productos.config.js");
  }
  var hoja = base.hoja;
  var columnas = [
    { nombre: "Orden", alias: "Orden", tipo: "numeric", nullable: true, label: true, visible: true, restricciones: { min: 0, entero: true } },
    { nombre: "IDCosto-Producto", alias: "ID Costo Producto", tipo: "text", nullable: false, label: true, visible: true, restricciones: {} },
    { nombre: "Categoria", alias: "Categoría", tipo: "text", nullable: true, visible: true, restricciones: { maxLongitud: 200 } },
    { nombre: "Producto", alias: "Producto", tipo: "text", nullable: true, visible: true, restricciones: { maxLongitud: 500 } },
    { nombre: "Costo-Producto-Maestro-Total", alias: "Costo Producto Maestro Total", tipo: "numeric", nullable: true, decimales: 2, visible: true, restricciones: { min: 0 } },
    { nombre: "Costo-Packing", alias: "Costo Packing", tipo: "numeric", nullable: true, decimales: 2, visible: true, restricciones: { min: 0 } },
    { nombre: "Costos-Fijos", alias: "Costos Fijos", tipo: "numeric", nullable: true, decimales: 2, visible: true, restricciones: {} },
    { nombre: "Merma-Porcentaje", alias: "Merma Porcentaje", tipo: "numeric", nullable: true, decimales: 2, visible: true, restricciones: { min: 0, max: 100 } },
    { nombre: "Merma-Importe", alias: "Merma Importe", tipo: "numeric", nullable: true, decimales: 2, visible: true, restricciones: { min: 0 } },
    { nombre: "Tiiempo-Packing-Minutos", alias: "Tiempo Packing Minutos", tipo: "numeric", nullable: true, visible: true, restricciones: { min: 0, entero: true } },
    { nombre: "Costo-Mano-Obra-Packing", alias: "Costo Mano Obra Packing", tipo: "numeric", nullable: true, decimales: 2, visible: true, restricciones: { min: 0 } },
    { nombre: "Costo-Producto-Final-Actual", alias: "Costo Producto Final Actual", tipo: "numeric", nullable: true, decimales: 2, visible: true, restricciones: { min: 0 } },
    { nombre: "Costo-Producto-Final-Anterior", alias: "Costo Producto Final Anterior", tipo: "numeric", nullable: true, decimales: 2, visible: true, restricciones: { min: 0 } },
    { nombre: "Habilitado", alias: "Habilitado", tipo: "text", nullable: true, visible: true, restricciones: { valoresPermitidos: ["Sí", "No", ""] } }
  ];
  window.COSTO_PRODUCTOS_SHEETS_JSON = {
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
