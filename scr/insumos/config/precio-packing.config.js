/**
 * Configuración de la tabla PRECIO-Packing (Armador Insumos).
 * Debe coincidir con la hoja en Apps Script: sheet=packing, sheetName='PRECIO-Packing'.
 * Uso: referencia de columnas para listas.
 */
window.PRECIO_PACKING_CONFIG = {
  sheetKey: "packing",
  sheetName: "PRECIO-Packing",
  idColumn: "idpacking",
  /** Columnas que se muestran en la lista (orden de aparición). */
  listColumns: [
    "idpacking",
    "Nombre-Producto",
    "Categoria",
    "Presentacion-Tipo",
    "Presentacion-Unidad",
    "Precio-Actual",
    "Precio-Anterior",
    "Fecha-Actualizada-Al",
    "Marca",
    "Habilitado"
  ],
  /** Alias para mostrar en la UI (nombre interno de columna → texto a mostrar). */
  listColumnAliases: {
    "idpacking": "ID",
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
   * Cada regla: columna (puede no estar en listColumns) y valor que debe tener.
   */
  listFilter: [
    { column: "Habilitado", value: "Sí" }
  ],
  /** Columnas por las que se agrupa el listado (orden: primer nivel, segundo, etc.). */
  listGroupBy: ["Categoria"],
  /** Leyenda: columnas concatenadas, separator entre valores, highlight = columnas a resaltar. */
  listLeyenda: {
    columns: ["Categoria", "Nombre-Producto", "Presentacion-Tipo", "Presentacion-Unidad"],
    separator: " · ",
    highlight: ["Nombre-Producto"]
  },
  /** Subleyenda: se muestra al final de la card, antes de las acciones. */
  listSubLeyenda: {
    columns: ["Marca", "Lugar"],
    separator: " · ",
    highlight: []
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
    "idpacking",
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
