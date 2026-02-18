/**
 * Configuración base del módulo Receta Detalle (Armador Receta).
 * Tabla: Tabla-Receta-Base-Detalle. PK = IDReceta-Base-Detalle. FK = IDReceta-Base.
 * Fórmula: Importe = Cantidad * Precio-Equivalencia-x-Unidad.
 * Debe cargarse antes de cualquier *-sheets.config.js de acción.
 */
window.RECETA_DETALLE_SHEET_BASE = {
  modulo: "receta-detalle",
  descripcion: "Módulo Receta Detalle (Armador Receta). Listado y ABM sobre la hoja Tabla-Receta-Base-Detalle.",
  hoja: {
    nombre: "Tabla-Receta-Base-Detalle",
    nombreHoja: "Tabla-Receta-Base-Detalle",
    clavePrimaria: ["IDReceta-Base-Detalle"],
    columnasPropias: [
      "IDReceta-Base-Detalle",
      "IDReceta-Base",
      "IDInsumo-MateriaPrima",
      "Nombre-Insumo",
      "Cantidad",
      "Unidad-Medida",
      "Precio-Equivalencia-x-Unidad",
      "Importe"
    ],
    columnaOrden: null,
    clavesForaneas: ["IDReceta-Base"],
    prefijoId: "RECDET-",
    patronId: 1,
    indices: [
      { columnas: ["IDReceta-Base-Detalle"], unico: true }
    ],
    formulas: {
      "Importe": {
        fuentes: ["Cantidad", "Precio-Equivalencia-x-Unidad"],
        operacion: "multiplicacion",
        expresion: "a * b",
        decimales: 2,
        leyenda: "Cantidad × Precio equivalencia por unidad"
      }
    }
  }
};
