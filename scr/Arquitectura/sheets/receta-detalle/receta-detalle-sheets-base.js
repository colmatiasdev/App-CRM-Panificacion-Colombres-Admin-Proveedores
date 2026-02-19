/**
 * Configuración base del módulo Receta Detalle (Armador Receta).
 * Tabla: Tabla-Receta-Base-Detalle.
 * PK = IDReceta-Base-Detalle.
 * FK: IDReceta-Base → Tabla-Receta-Base (IDReceta-Base).
 * FK: IDInsumo-MateriaPrima → PRECIO-Materia-Prima (idmateria-prima).
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
    /** FK: nombre de columna → tabla referenciada (hoja Apps Script). */
    clavesForaneas: ["IDReceta-Base", "IDInsumo-MateriaPrima"],
    /** Relaciones para documentación / combos: IDReceta-Base → Tabla-Receta-Base; IDInsumo-MateriaPrima → PRECIO-Materia-Prima */
    relaciones: [
      { columna: "IDReceta-Base", tabla: "Tabla-Receta-Base", pkReferencia: "IDReceta-Base" },
      { columna: "IDInsumo-MateriaPrima", tabla: "PRECIO-Materia-Prima", pkReferencia: "idmateria-prima" }
    ],
    columnaOrden: null,
    prefijoId: "RECETA-DET",
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
    },
    /** Lookups: al elegir IDInsumo-MateriaPrima se completan Nombre-Insumo, Unidad-Medida, Precio-Equivalencia-x-Unidad desde PRECIO-Materia-Prima */
    lookups: [
      {
        columnaClaveLocal: "IDInsumo-MateriaPrima",
        tablaOrigen: "PRECIO-Materia-Prima",
        columnaOrigen: "Nombre-Producto",
        columnaDestino: "Nombre-Insumo"
      },
      {
        columnaClaveLocal: "IDInsumo-MateriaPrima",
        tablaOrigen: "PRECIO-Materia-Prima",
        columnaOrigen: "Equivalencia-Tipo-Unidad-Medida",
        columnaDestino: "Unidad-Medida"
      },
      {
        columnaClaveLocal: "IDInsumo-MateriaPrima",
        tablaOrigen: "PRECIO-Materia-Prima",
        columnaOrigen: "Precio-Equivalencia-x-Unidad",
        columnaDestino: "Precio-Equivalencia-x-Unidad",
        decimales: 2
      }
    ],
    /**
     * Propagación desde insumo: al elegir un insumo (PRECIO-Materia-Prima), copiar estas columnas
     * al formulario/fila de Tabla-Receta-Base-Detalle. Sincronizar con PROPAGACION_RECETA_DETALLE_DESDE_INSUMO en APPS_SCRIPT_ABM.gs.
     * tablaOrigen = clave de hoja en API (materiaPrima); columnaClaveForanea = FK en esta tabla.
     */
    propagacionDesdeInsumo: {
      tablaOrigen: "materiaPrima",
      columnaClaveForanea: "IDInsumo-MateriaPrima",
      columnas: [
        { columnaOrigen: "Nombre-Producto", columnaDestino: "Nombre-Insumo" },
        { columnaOrigen: "Equivalencia-Tipo-Unidad-Medida", columnaDestino: "Unidad-Medida" },
        { columnaOrigen: "Precio-Equivalencia-x-Unidad", columnaDestino: "Precio-Equivalencia-x-Unidad" }
      ]
    }
  }
};
