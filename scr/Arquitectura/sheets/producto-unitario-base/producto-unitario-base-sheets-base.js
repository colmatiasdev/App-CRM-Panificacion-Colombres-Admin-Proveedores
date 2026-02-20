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
      "Costo-Produccion-ProductoBase",
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
      { columnas: ["IDCosto-ProductoUnitario"], unico: true },
      { columnas: ["Orden"], unico: false },
      { columnas: ["Comercio-Sucursal"], unico: false }
    ],
    formulas: {
      "Costo-Elaboracion-Actual [G + H + I + K]": {
        fuentes: [
          "Costo-Produccion-ProductoBase",
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
    ]
  }
};
