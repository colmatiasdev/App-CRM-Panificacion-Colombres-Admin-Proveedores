/**
 * Configuración base del módulo Producto Unitario Base (Armador Receta).
 * Tabla: Tabla-Receta-Base. PK = IDCosto-ProductoUnitario.
 * Costo-Elaboracion-Actual = fórmula G+H+I+K (Producción + Relleno + Decoración + Mano obra elaboración).
 * Debe cargarse antes de cualquier *-sheets.config.js de acción.
 */
window.PRODUCTO_UNITARIO_BASE_SHEET_BASE = {
  modulo: "producto-unitario-base",
  descripcion: "Módulo Producto Unitario Base (Armador Receta). Listado y ABM sobre la hoja Tabla-Receta-Base.",
  hoja: {
    nombre: "Tabla-Receta-Base",
    nombreHoja: "Tabla-Receta-Base",
    clavePrimaria: ["IDCosto-ProductoUnitario"],
    columnasPropias: [
      "Orden",
      "IDCosto-ProductoUnitario",
      "Comercio-Sucursal",
      "Tipo-Producto",
      "Nombre-Producto",
      "IDElaboracion-ProductoBase",
      "Costo-Produccion-ProductoBase",
      "Costo-Relleno-Producto",
      "Costo-Decoracion-Producto",
      "Tiempo-Elaboracion-Minutos",
      "Costo-Mano-Obra-Elaboracion",
      "Costo-Elaboracion-Actual",
      "Costo-Elaboracion-Anterior",
      "Habilitado",
      "Fecha-Registro-Actualizado-Al",
      "Actualizado"
    ],
    columnaOrden: "Orden",
    clavesForaneas: [],
    prefijoId: "RECETA-",
    patronId: 1,
    indices: [
      { columnas: ["IDCosto-ProductoUnitario"], unico: true },
      { columnas: ["Orden"], unico: false },
      { columnas: ["Comercio-Sucursal"], unico: false }
    ],
    formulas: {
      "Costo-Elaboracion-Actual": {
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
        columnaOrigen: "Costo-Elaboracion-Actual",
        columnaDestino: "Costo-Elaboracion-Anterior"
      }
    ]
  }
};
