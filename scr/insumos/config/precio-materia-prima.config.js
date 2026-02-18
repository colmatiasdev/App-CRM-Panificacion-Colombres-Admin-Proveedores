/**
 * Configuración de la tabla PRECIO-Materia-Prima (Armador Insumos).
 * Debe coincidir con la hoja en Apps Script: sheet=materiaPrima, sheetName='PRECIO-Materia-Prima'.
 * Uso: referencia de columnas para listas y selección de insumos.
 */
window.PRECIO_MATERIA_PRIMA_CONFIG = {
  sheetKey: "materiaPrima",
  sheetName: "PRECIO-Materia-Prima",
  idColumn: "idmateria-prima",
  /** Columnas que se muestran en la lista (orden de aparición). */
  listColumns: [
    "Nombre-Producto",
    "Precio-Actual",
    "Fecha-Actualizada-Al",
    "Marca",
    "Lugar",
  ],
  /** Alias para mostrar en la UI (nombre interno de columna → texto a mostrar). */
  listColumnAliases: {
    "idmateria-prima": "ID",
    "Nombre-Producto": "Producto",
    "Categoria": "Categoría",
    "Presentacion-Tipo": "Presentación",
    "Presentacion-Cantidad-Medida": "Cant. medida",
    "Presentacion-Unidad": "Unidad",
    "Precio-Actual": "Precio actual",
    "Precio-Anterior": "Precio anterior",
    "Observaciones": "Observaciones",
    "Cantidad-Unidad-Medida": "Cant. unidad",
    "Tipo-Unidad-Medida": "Tipo unidad",
    "Equivalencia-Unidad-Medida": "Equiv. medida",
    "Equivalencia-Tipo-Unidad-Medida": "Equiv. tipo",
    "Habilitado": "Habilitado",
    "Precio-Costo-x-Unidad": "Costo x unidad",
    "Precio-Equivalencia-x-Unidad": "Equiv. x unidad",
    "Fecha-Actualizada-Al": "Actualizado",
    "Marca": "Marca",
    "Lugar": "Lugar"
  },
  /**
   * Filtro de filas: solo se muestran las que cumplan todas las reglas.
   * Cada regla usa una columna (puede no estar en listColumns) y el valor que debe tener.
   * Ej.: solo insumos habilitados: [ { column: "Habilitado", value: "Sí" } ]
   */
  listFilter: [
    { column: "Habilitado", value: "SI" }
  ],
  /** Columnas por las que se agrupa el listado (orden: primer nivel, segundo, etc.). Mejora la lectura. */
  listGroupBy: ["Categoria"],
  /**
   * Leyenda: texto concatenado por columnas para cada card.
   * - columns: columnas en el orden que se concatenan
   * - separator: texto entre cada valor (ej. " · ", " | ")
   * - highlight: columnas cuyos valores se muestran resaltados en la leyenda
   */
  listLeyenda: {
    columns: ["Presentacion-Tipo", "Presentacion-Cantidad-Medida", "Presentacion-Unidad"],
    separator: " ",
    highlight: ["Presentacion-Tipo"]
  },
  listSubLeyenda: {
    columns: ["Marca", "Lugar"],
    separator: " · ",
    highlight: ["Lugar"]
  },
  /** Columnas por las que se filtra al escribir en la caja de búsqueda. */
  listSearchColumns: [
    "Nombre-Producto",
    "Categoria",
    "Presentacion-Tipo",
    "Presentacion-Unidad",
    "Marca",
    "Lugar"
  ],
  headers: [
    "idmateria-prima",
    "Categoria",
    "Nombre-Producto",
    "Presentacion-Tipo",
    "Presentacion-Cantidad-Medida",
    "Presentacion-Unidad",
    "Precio-Actual",
    "Precio-Anterior",
    "Observaciones",
    "Cantidad-Unidad-Medida",
    "Tipo-Unidad-Medida",
    "Equivalencia-Unidad-Medida",
    "Equivalencia-Tipo-Unidad-Medida",
    "Habilitado",
    "Precio-Costo-x-Unidad",
    "Precio-Equivalencia-x-Unidad",
    "Fecha-Actualizada-Al",
    "Marca",
    "Lugar"
  ]
};
