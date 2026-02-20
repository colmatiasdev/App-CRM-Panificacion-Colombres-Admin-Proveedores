/**
 * Configuración base del módulo Producto Unitario Base (Armador Receta).
 * Tabla: Tabla-Costos-ProductoUnitario. PK = IDCosto-ProductoUnitario.
 * Costo-Elaboracion-Actual [G + H + I + K] = fórmula (Producción + Relleno + Decoración + Mano obra elaboración).
 * Debe cargarse antes de cualquier *-sheets.config.js de acción.
 */
window.PRODUCTO_UNITARIO_BASE_SHEET_BASE = {
  modulo: "producto-unitario-base",
  descripcion: "Módulo Producto Unitario Base (Armador Receta). Listado y ABM sobre la hoja Tabla-Costos-ProductoUnitario.",
  hoja: {
    nombre: "Tabla-Costos-ProductoUnitario",
    nombreHoja: "Tabla-Costos-ProductoUnitario",
    clavePrimaria: ["IDCosto-ProductoUnitario"],
    columnasPropias: [
      "Orden",
      "IDCosto-ProductoUnitario",
      "Comercio-Sucursal",
      "Categoria",
      "Nombre-Producto",
      "IDElaboracion-ProductoBase",
      "Costo-Produccion",
      "Costo-Relleno-Producto",
      "Costo-Decoracion-Producto",
      "Tiempo-Elaboracion-Minutos",
      "Costo-Mano-Obra-Elaboracion",
      "Costo-Elaboracion-Actual [G + H + I + K]",
      "Costo-Elaboracion-Anterior",
      "Habilitado",
      "Fecha-Registro-Actualizado-Al",
      "Actualizado"
    ],
    columnaOrden: "Orden",
    clavesForaneas: [],
    prefijoId: "PROD-UNITARIO",
    patronId: 1,
    indices: [
      {
        columnas: ["IDCosto-ProductoUnitario"],
        unico: true
      },
      {
        columnas: ["Orden"],
        unico: false
      },
      {
        columnas: ["Comercio-Sucursal"],
        unico: false
      }
    ],
    lookups: [
      {
        "columnaClaveLocal": "Tiempo-Elaboracion-Minutos",
        "tablaOrigen": "COSTO-EMPLEADOS",
        "columnaClaveRemota": "MINUTOS",
        "columnaOrigen": "Costo-Mano-Obra-Elaboracion",
        "columnaDestino": "Costo-Mano-Obra-Elaboracion",
        "decimales": 2
      }
    ],
    formulas: {
      "Costo-Elaboracion-Actual [G + H + I + K]": {
        fuentes: [
          "Costo-Produccion",
          "Costo-Relleno-Producto",
          "Costo-Decoracion-Producto",
          "Costo-Mano-Obra-Elaboracion"
        ],
        operacion: "suma",
        expresion: "a + b + c + d",
        decimales: 2,
        leyenda: "Suma: Producción + Relleno + Decoración + Mano obra elaboración"
      }
    },
    valorAnterior: [
      {
        columnaOrigen: "Costo-Elaboracion-Actual [G + H + I + K]",
        columnaDestino: "Costo-Elaboracion-Anterior"
      }
    ],
    /**
     * Combos: valores de listas desplegables desde la hoja COMBOS.
     * sheetCombo: nombre para la API (?action=list&sheet=...).
     * columnaCombo: columna en la hoja de combos (nombre exacto o el que devuelve la API).
     * columnaComboAlternativas: [opcional] otros nombres por si la hoja tiene distinto texto en la cabecera.
     * claveCombo: key en window["COMPONENTE-COMBOS"].
     */
    combos: [
      {
        columnaLocal: "Comercio-Sucursal",
        sheetCombo: "combos",
        columnaCombo: "COMERCIO-SUCURSAL",
        claveCombo: "Combo-Comercio-Sucursal"
      },
      {
        columnaLocal: "Categoria",
        sheetCombo: "combos",
        columnaCombo: "COMBO-CATEGORIA",
        columnaComboAlternativas: ["Categoria", "COMBO CATEGORIA", "Combo-Categoria"],
        /** Índice de columna en la hoja COMBOS (0-based). Orden: 0=TIPO-UNIDAD-MEDIDA, 1=CONVERTIR, 2=TIPO-PRESENTACION, 3=COMBO-CATEGORIA, 4=UNIDADES, 5=COMERCIO-SUCURSAL. Usado si el nombre no coincide. */
        columnaComboIndex: 3,
        claveCombo: "Combo-Categoria"
      }
    ]
  }
};
