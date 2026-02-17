/**
 * Configuración base compartida del módulo Productos elaborados.
 * Define modulo, descripcion y la parte fija de la hoja (nombre, nombreHoja, clavePrimaria,
 * clavesForaneas, prefijoId, patronId, indices). Debe cargarse antes de cualquier
 * *-sheets.config.js de acción (listar, crear, editar, ver).
 * Lo que cambia por acción son solo las columnas (y listado en listar).
 */
window.PRODUCTOS_ELABORADOS_SHEET_BASE = {
  "modulo": "productos-elaborados",
  "descripcion": "Módulo Productos elaborados (Armador de Productos). Listado y ABM sobre la hoja Listado-Productos-Elaborados.",
  "hoja": {
    "nombre": "Listado-Productos-Elaborados",
    "nombreHoja": "Listado-Productos-Elaborados",
    "clavePrimaria": ["IDProducto"],
    "clavesForaneas": [
      { "columna": "IDCosto-Producto", "tabla": "Tabla-Costo-Productos", "pkReferencia": "IDCosto-Producto" }
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
