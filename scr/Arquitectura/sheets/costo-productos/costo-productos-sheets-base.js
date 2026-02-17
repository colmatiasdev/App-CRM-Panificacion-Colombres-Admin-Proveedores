/**
 * Configuración base compartida del módulo Costo Productos (Tabla-Costo-Productos).
 * PK = IDCosto-Producto.
 * Relación con Listado-Productos-Elaborados: esta tabla es referenciada por IDCosto-Producto (FK).
 * Cardinalidad configurable: "1:1" (un producto elaborado asigna un costo) o "1:N" (varios productos
 * elaborados pueden asignar este costo). Define etiquetas del botón en Ver y URL del listado relacionado.
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
    ],
    "referenciadoPor": [
      {
        "tabla": "Listado-Productos-Elaborados",
        "nombreHoja": "Listado-Productos-Elaborados",
        "columnaFK": "IDCosto-Producto",
        "pkReferencia": "IDCosto-Producto",
        "cardinalidad": "1:1",
        "etiquetaBoton1a1": "Asignar productos elaborados",
        "etiquetaBoton1aN": "Ver productos elaborados asignados",
        "urlListado": "../Productos-Elaborados/productos-elaborados.html",
        "parametroFiltroId": "idCostoProducto"
      }
    ]
  }
};
