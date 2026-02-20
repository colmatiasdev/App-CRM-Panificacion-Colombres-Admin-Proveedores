/**
 * Configuración base del módulo Elaboración Productos Base (Armador Receta).
 * Tabla: Tabla-Elaboracion-ProductosBase. PK = IDElaboracion-ProductoBase.
 * FK: IDReceta-Base → Tabla-Receta-Base.IDCosto-ProductoUnitario.
 * Debe cargarse antes de cualquier *-sheets.config.js de acción.
 */
window.ELABORACION_PRODUCTOS_BASE_SHEET_BASE = {
  modulo: "elaboracion-productos-base",
  descripcion: "Módulo Elaboración Productos Base (Armador Receta). Listado y ABM sobre la hoja Tabla-Elaboracion-ProductosBase.",
  hoja: {
    nombre: "Tabla-Elaboracion-ProductosBase",
    nombreHoja: "Tabla-Elaboracion-Productos-Base",
    clavePrimaria: ["IDElaboracion-ProductoBase"],
    columnasPropias: [
      "IDElaboracion-ProductoBase",
      "IDReceta-Base",
      "Cantidad",
      "Descripcion-Masa-Producto",
      "Costo-Produccion-ProductoBase",
      "Monto"
    ],
    columnaOrden: null,
    clavesForaneas: [
      {
        columna: "IDReceta-Base",
        tabla: "Tabla-Receta-Base",
        pkReferencia: "IDCosto-ProductoUnitario",
        cardinalidad: "N:1"
      }
    ],
    prefijoId: "ID-UNICO",
    patronId: 1,
    indices: [
      { columnas: ["IDElaboracion-ProductoBase"], unico: true },
      { columnas: ["IDReceta-Base"], unico: false }
    ],
    /** Fórmulas: Monto = Cantidad × Costo-Produccion-ProductoBase */
    formulas: {
      "Monto": {
        fuentes: ["Cantidad", "Costo-Produccion-ProductoBase"],
        operacion: "multiplicacion",
        expresion: "a * b",
        decimales: 2,
        leyenda: "Cantidad × Costo Producción Base"
      }
    }
  }
};
