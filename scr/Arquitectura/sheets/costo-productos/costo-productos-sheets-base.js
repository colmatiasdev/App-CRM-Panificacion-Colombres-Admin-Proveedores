/**
 * Configuración base compartida del módulo Costo Productos (Tabla-Costo-Productos).
 * PK = IDCosto-Producto.
 * referenciadoPor: vacío; la asignación producto elaborado ↔ costo se hace desde Editar producto elaborado (botón Ver Costo producto) y desde listado de costos (modo asignar).
 * Debe cargarse antes de cualquier sheets-*-costo-productos.config.js.
 *
 * formulas: campos calculados. Por cada columna: fuentes, operacion, expresion, decimales, leyenda (texto del párrafo bajo el campo).
 * lookups: columnas que se rellenan desde otra tabla. Tiempo-Packing-Minutos (FK) → COSTO-EMPLEADOS.MINUTOS;
 *   columnaOrigen: nombre en COSTO-EMPLEADOS (Costo-x-Minutos-Packing o Costo-Mano-Obra-Packing). Si no existe, se prueba columnaDestino. Aplica en crear y editar.
 * valorAnterior: en crear y editar, columnaDestino recibe el valor de columnaOrigen al cargar; si columnaOrigen
 *   cambia, se guarda el valor anterior de columnaOrigen en columnaDestino (resguardar dato). Ej.: Costo-Producto-Final-Actual → Costo-Producto-Final-Anterior.
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
    "prefijoId": "PROD-COSTO",
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
        "operacion": "porcentaje",
        "expresion": "a * (b / 100)",
        "decimales": 2,
        "leyenda": "Porcentaje de: Costo Producto x Merma Porcentaje"
      },
      "Costo-Producto-Final-Actual": {
        "fuentes": ["Costo-Producto-Maestro-Total", "Costo-Packing", "Costos-Fijos", "Merma-Importe", "Costo-Mano-Obra-Packing"],
        "operacion": "suma",
        "expresion": "a + b + c + d + e",
        "decimales": 2,
        "leyenda": "Suma de: Costo de Poducto + Packing + Costos Fijos + Merma + Mano Obra Packing"
      }
    },
    "lookups": [
      {
        "columnaClaveLocal": "Tiempo-Packing-Minutos",
        "tablaOrigen": "COSTO-EMPLEADOS",
        "columnaClaveRemota": "MINUTOS",
        "columnaOrigen": "Costo-Mano-Obra-Packing",
        "columnaDestino": "Costo-Mano-Obra-Packing",
        "decimales": 2
      }
    ],
    "valorAnterior": [
      {
        "columnaOrigen": "Costo-Producto-Final-Actual",
        "columnaDestino": "Costo-Producto-Final-Anterior"
      }
    ]
  }
};
