/**
 * Configuración base compartida del módulo Costo Productos (Tabla-Costo-Productos).
 * PK = IDCosto-Producto.
 * referenciadoPor: vacío; la asignación producto elaborado ↔ costo se hace desde Editar producto elaborado (botón Ver Costo producto) y desde listado de costos (modo asignar).
 * Debe cargarse antes de cualquier sheets-*-costo-productos.config.js.
 *
 * formulas: campos calculados. Por cada columna: fuentes (nombres de columnas), operacion ("suma" | "resta" | "multiplicacion" | "division"),
 * expresion (a, b, c = valores de fuentes en orden) y decimales.
 */
window.COSTO_PRODUCTOS_SHEET_BASE = {
  "modulo": "costo-productos",
  "descripcion": "Módulo Costo Productos (Armador de Productos). ABM sobre la hoja Tabla-Costo-Productos.",
  "hoja": {
    "nombre": "Tabla-Costo-Productos",
    "nombreHoja": "Tabla-Costo-Productos",
    "clavePrimaria": ["IDCosto-Producto"],
    "columnasPropias": [
      "Orden", "IDCosto-Producto", "Categoria", "Producto", "Costo-Producto-Maestro-Total",
      "Costo-Packing", "Costos-Fijos", "Merma-Porcentaje", "Merma-Importe", "Tiempo-Packing-Minutos",
      "Costo-Mano-Obra-Packing", "Costo-Producto-Final-Actual", "Costo-Producto-Final-Anterior", "Habilitado"
    ],
    "columnaOrden": "Orden",
    "clavesForaneas": [],
    "prefijoId": "COSTO-PROD",
    "patronId": 1,
    "indices": [
      { "columnas": ["IDCosto-Producto"], "unico": true },
      { "columnas": ["Orden"], "unico": false },
      { "columnas": ["Categoria"], "unico": false },
      { "columnas": ["Habilitado"], "unico": false }
    ],
    "referenciadoPor": [],
    "formulas": {
      "Merma-Importe": {
        "fuentes": ["Costo-Producto-Maestro-Total", "Merma-Porcentaje"],
        "operacion": "multiplicacion",
        "expresion": "a * b",
        "decimales": 2
      }
    }
  }
};
