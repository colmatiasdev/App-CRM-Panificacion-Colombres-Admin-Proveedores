/**
 * Configuración base compartida del módulo Productos elaborados.
 * Define modulo, descripcion y la parte fija de la hoja (nombre, nombreHoja, clavePrimaria,
 * clavesForaneas (relación con Tabla-Costo-Productos = 1:1), prefijoId, patronId, indices).
 * columnasPropias: columnas que pertenecen solo a esta tabla (no se rellenan desde la relación).
 * En cada FK, columnasVinculadasPorRelacion = columnas que se completan desde la tabla relacionada (destino en columnasAActualizar).
 * Debe cargarse antes de cualquier *-sheets.config.js de acción (listar, crear, editar, ver).
 */
window.PRODUCTOS_ELABORADOS_SHEET_BASE = {
  "modulo": "productos-elaborados",
  "descripcion": "Módulo Productos elaborados (Armador de Productos). Listado y ABM sobre la hoja Listado-Productos-Elaborados.",
  "hoja": {
    "nombre": "Listado-Productos-Elaborados",
    "nombreHoja": "Listado-Productos-Elaborados",
    "clavePrimaria": ["IDProducto"],
    "columnasPropias": ["Orden-Lista", "IDProducto", "Comercio-Sucursal", "Observaciones", "Habilitado"],
    "columnaOrden": "Orden-Lista",
    "clavesForaneas": [
      {
        "columna": "IDCosto-Producto",
        "tabla": "Tabla-Costo-Productos",
        "pkReferencia": "IDCosto-Producto",
        "cardinalidad": "1:1",
        "columnasVinculadasPorRelacion": ["IDCosto-Producto", "Categoria", "Nombre-Producto", "Costo-Producto-Final-Actual", "Costo-Producto-Final-Anterior"],
        "asignarCuandoVacio": {
          "etiquetaBoton": "Asignar Producto a la Lista",
          "urlListado": "costo-productos.html",
          "paramIdProducto": "idProductoElaborado",
          "nombreHojaOrigen": "Tabla-Costo-Productos",
          "nombreHojaDestino": "Listado-Productos-Elaborados",
          "columnasAActualizar": [
            { "destino": "IDCosto-Producto", "origen": "IDCosto-Producto" },
            { "destino": "Categoria", "origen": "Categoria" },
            { "destino": "Nombre-Producto", "origen": "Producto" },
            { "destino": "Costo-Producto-Final-Actual", "origen": "Costo-Producto-Final-Actual" },
            { "destino": "Costo-Producto-Final-Anterior", "origen": "Costo-Producto-Final-Anterior" }
          ]
        }
      }
    ],
    "prefijoId": "PROD-ELAB",
    "patronId": 1,
    "indices": [
      { "columnas": ["IDProducto"], "unico": true },
      { "columnas": ["Orden-Lista"], "unico": false },
      { "columnas": ["IDCosto-Producto"], "unico": false },
      { "columnas": ["Comercio-Sucursal"], "unico": false }
    ]
  }
};
