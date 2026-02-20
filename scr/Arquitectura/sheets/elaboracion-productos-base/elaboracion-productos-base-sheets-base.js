/**
 * Configuración base del módulo Elaboración Productos Base (Armador Receta).
 * Tabla: Tabla-Elaboracion-ProductosBase. PK = ID-UNICO.
 * FK IDReceta-Base → Tabla-Receta-Base.IDReceta-Base.
 * FK IDElaboracion-ProductoBase → Tabla-Costos-ProductoUnitario.IDCosto-ProductoUnitario.
 * Debe cargarse antes de cualquier *-sheets.config.js de acción.
 */
window.ELABORACION_PRODUCTOS_BASE_SHEET_BASE = {
  modulo: "elaboracion-productos-base",
  descripcion: "Módulo Elaboración Productos Base (Armador Receta). Listado y ABM sobre la hoja Tabla-Elaboracion-ProductosBase.",
  hoja: {
    nombre: "Tabla-Elaboracion-ProductosBase",
    nombreHoja: "Tabla-Elaboracion-Productos-Base",
    clavePrimaria: ["ID-UNICO"],
    columnasPropias: [
      "ID-UNICO",
      "IDElaboracion-ProductoBase",
      "IDReceta-Base",
      "Cantidad",
      "Descripcion-Masa-Producto",
      "Costo-Produccion-ProductoBase",
      "Monto"
    ],
    columnaOrden: null,
    clavesForaneas: [
      { columna: "IDReceta-Base", tabla: "Tabla-Receta-Base", pkReferencia: "IDReceta-Base", cardinalidad: "N:1" },
      { columna: "IDElaboracion-ProductoBase", tabla: "Tabla-Costos-ProductoUnitario", pkReferencia: "IDCosto-ProductoUnitario", cardinalidad: "N:1" }
    ],
    prefijoId: "ID-UNICO",
    patronId: 1,
    indices: [
      { columnas: ["ID-UNICO"], unico: true },
      { columnas: ["IDElaboracion-ProductoBase"], unico: false },
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
