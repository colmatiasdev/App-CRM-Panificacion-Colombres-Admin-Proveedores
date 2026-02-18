/**
 * Configuración base del módulo Receta Base (Armador Receta).
 * Tabla: Tabla-Receta-Base. PK = IDReceta-Base.
 * Fórmulas: Costo-Produccion[C+E] = C+E (Directo + Mano obra); Costo-Produccion-ProductoBase [F/G] = F/G.
 * Debe cargarse antes de cualquier *-sheets.config.js de acción.
 */
window.RECETA_BASE_SHEET_BASE = {
  modulo: "receta-base",
  descripcion: "Módulo Receta Base (Armador Receta). Listado y ABM sobre la hoja Tabla-Receta-Base.",
  hoja: {
    nombre: "Tabla-Receta-Base",
    nombreHoja: "Tabla-Receta-Base",
    clavePrimaria: ["IDReceta-Base"],
    columnasPropias: [
      "IDReceta-Base",
      "Descripcion-Masa-Producto",
      "Costo-Directo-Receta",
      "Tiempo-Produccion-Minutos",
      "Costo-Mano-Obra-Produccion",
      "Costo-Produccion[C+E]",
      "Rendimiento-Cantidad",
      "Rendimiento-UnidadMedida",
      "Costo-Produccion-ProductoBase [F/G]"
    ],
    columnaOrden: null,
    clavesForaneas: [],
    prefijoId: "RECETA",
    patronId: 1,
    indices: [
      { columnas: ["IDReceta-Base"], unico: true }
    ],
    formulas: {
      "Costo-Produccion[C+E]": {
        fuentes: ["Costo-Directo-Receta", "Costo-Mano-Obra-Produccion"],
        operacion: "suma",
        expresion: "a + b",
        decimales: 2,
        leyenda: "Costo directo + Costo mano de obra producción"
      },
      "Costo-Produccion-ProductoBase [F/G]": {
        fuentes: ["Costo-Produccion[C+E]", "Rendimiento-Cantidad"],
        operacion: "division",
        expresion: "a / b",
        decimales: 2,
        leyenda: "Costo producción total / Rendimiento cantidad"
      }
    },
    "lookups": [
      {
        "columnaClaveLocal": "Tiempo-Produccion-Minutos",
        "tablaOrigen": "COSTO-EMPLEADOS",
        "columnaClaveRemota": "MINUTOS",
        "columnaOrigen": "Costo-Mano-Obra-Produccion",
        "columnaDestino": "Costo-Mano-Obra-Produccion",
        "decimales": 2
      }
    ],
  }
};
