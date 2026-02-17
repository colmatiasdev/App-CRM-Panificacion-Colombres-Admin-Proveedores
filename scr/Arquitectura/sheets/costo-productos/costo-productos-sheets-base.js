/**
 * Configuración base compartida del módulo Costo Productos (Tabla-Costo-Productos).
 * PK = IDCosto-Producto. Referenciada por Listado-Productos-Elaborados.IDCosto-Producto (FK).
 * Debe cargarse antes de cualquier sheets-*-costo-productos.config.js.
 */
window.COSTO_PRODUCTOS_SHEET_BASE = {
  "modulo": "costo-productos",
  "descripcion": "Módulo Costo Productos (Armador de Productos). ABM sobre la hoja Tabla-Costo-Productos.",
  "hoja": {
    "nombre": "Tabla-Costo-Productos",
    "nombreHoja": "Tabla-Costo-Productos",
    "clavePrimaria": ["IDCosto-Producto"],
    "clavesForaneas": [],
    "prefijoId": "COSTO-PROD",
    "patronId": 1,
    "indices": [
      { "columnas": ["IDCosto-Producto"], "unico": true },
      { "columnas": ["Orden"], "unico": false },
      { "columnas": ["Categoria"], "unico": false },
      { "columnas": ["Habilitado"], "unico": false }
    ]
  }
};
