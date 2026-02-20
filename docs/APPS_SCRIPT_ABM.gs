/**
 * GOOGLE APPS SCRIPT – ABM (Alta, Baja, Modificación) para varias hojas
 * Un solo archivo: copiá y pegá todo en el editor de Apps Script.
 *
 * Acciones: list | get | search | create | update | delete | fillIds
 * Parámetro sheet: materiaPrima | packing | combos | equivalencias | Listado-Productos-Elaborados | Tabla-Costo-Productos | COSTO-EMPLEADOS | Tabla-Costos-ProductoUnitario | Tabla-Elaboracion-Productos-Base
 *
 * Desplegar: Implementar → Nueva implementación → Aplicación web
 * Ejecutar como: Yo | Quién puede acceder: Cualquier usuario (o según necesites)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN – Una entrada por hoja del libro. Agregá más según avance el proyecto.
// ═══════════════════════════════════════════════════════════════════════════════

var CONFIG = {
  /** ID del libro (vacío = libro donde está el script) */
  spreadsheetId: '',

  /** Hoja Materia Prima – ?sheet=materiaPrima */
  materiaPrima: {
    sheetName: 'PRECIO-Materia-Prima',
    gid: 0,
    headers: [
      'idmateria-prima',
      'Categoria',
      'Nombre-Producto',
      'Presentacion-Tipo',
      'Presentacion-Cantidad-Medida',
      'Presentacion-Unidad',
      'Precio-Actual',
      'Precio-Anterior',
      'Observaciones',
      'Cantidad-Unidad-Medida',
      'Tipo-Unidad-Medida',
      'Equivalencia-Unidad-Medida',
      'Equivalencia-Tipo-Unidad-Medida',
      'Habilitado',
      'Precio-Costo-x-Unidad',
      'Precio-Equivalencia-x-Unidad',
      'Fecha-Actualizada-Al',
      'Marca',
      'Lugar'
    ],
    idColumn: 'idmateria-prima',
    idPrefix: 'COSTO-MP-',
    filterColumns: ['Categoria', 'Nombre-Producto', 'Presentacion-Tipo', 'Marca', 'Habilitado', 'idmateria-prima'],
    requiredOnCreate: ['Nombre-Producto'],
    dateUpdatedColumn: 'Fecha-Actualizada-Al'
  },

  /** Hoja Packing – ?sheet=packing */
  packing: {
    sheetName: 'PRECIO-Packing',
    gid: 0,
    headers: [
      'idpacking',
      'Categoria',
      'Nombre-Producto',
      'Presentacion-Tipo',
      'Presentacion-Cantidad-Medida',
      'Presentacion-Unidad',
      'Precio-Actual',
      'Precio-Anterior',
      'Observaciones',
      'Cantidad-Unidad-Medida',
      'Tipo-Unidad-Medida',
      'Equivalencia-Unidad-Medida',
      'Equivalencia-Tipo-Unidad-Medida',
      'Habilitado',
      'Precio-Costo-x-Unidad',
      'Precio-Equivalencia-x-Unidad',
      'Fecha-Actualizada-Al',
      'Marca',
      'Lugar'
    ],
    idColumn: 'idpacking',
    idPrefix: 'COSTO-PK-',
    filterColumns: ['Categoria', 'Nombre-Producto', 'Presentacion-Tipo', 'Marca', 'Habilitado', 'idpacking'],
    requiredOnCreate: ['Nombre-Producto'],
    dateUpdatedColumn: 'Fecha-Actualizada-Al'
  },

  /** Hoja Combos – listas para combos – ?sheet=combos o ?sheet=COMBO
   * Columnas: TIPO-UNIDAD-MEDIDA, CONVERTIR-UNIDAD-MEDIDA, TIPO-PRESENTACION, COMBO-CATEGORIA, UNIDADES-MEDIDA-RENDIMIENTO, COMERCIO-SUCURSAL */
  combos: {
    sheetName: 'COMBOS',
    gid: 0,
    headers: [
      'TIPO-UNIDAD-MEDIDA',
      'CONVERTIR-UNIDAD-MEDIDA',
      'TIPO-PRESENTACION',
      'COMBO-CATEGORIA',
      'UNIDADES-MEDIDA-RENDIMIENTO',
      'COMERCIO-SUCURSAL'
    ],
    idColumn: 'TIPO-UNIDAD-MEDIDA',
    filterColumns: ['TIPO-UNIDAD-MEDIDA', 'CONVERTIR-UNIDAD-MEDIDA', 'TIPO-PRESENTACION', 'COMBO-CATEGORIA', 'UNIDADES-MEDIDA-RENDIMIENTO', 'COMERCIO-SUCURSAL']
  },

  /** Hoja Equivalencias – unidades y factores para conversión – ?sheet=equivalencias
   * Columnas: Categoria, Unidad, Factor, Convertir-UnidadMedida, Factor-Unidad-Equivalencia, Convertido-UnidadMedida, Alias, Tipo, Notas. Ver docs/EQUIVALENCIAS_SHEET.md */
  equivalencias: {
    sheetName: 'EQUIVALENCIAS',
    gid: 0,
    headers: ['Categoria', 'Unidad', 'Factor', 'Convertir-UnidadMedida', 'Factor-Unidad-Equivalencia', 'Convertido-UnidadMedida', 'Alias', 'Tipo', 'Notas'],
    idColumn: 'Unidad',
    filterColumns: ['Categoria', 'Unidad', 'Tipo']
  },

  /** Hoja Listado Productos Elaborados (Armador de Productos) – ?sheet=Listado-Productos-Elaborados
   * PK = IDProducto. FK = IDCosto-Producto → Tabla-Costo-Productos.IDCosto-Producto
   * Debe coincidir con scr/Arquitectura/sheets/productos-elaborados/sheets-listar-productos-elaborados.config.js */
  'listado-productos-elaborados': {
    sheetName: 'Listado-Productos-Elaborados',
    gid: 0,
    headers: [
      'Orden-Lista',
      'IDProducto',
      'IDCosto-Producto',
      'Comercio-Sucursal',
      'Categoria',
      'Nombre-Producto',
      'Costo-Producto-Final-Actual',
      'Costo-Producto-Final-Anterior',
      'Observaciones',
      'Habilitado'
    ],
    idColumn: 'IDProducto',
    idPrefix: 'PROD-ELAB-',
    filterColumns: ['IDProducto', 'IDCosto-Producto', 'Comercio-Sucursal', 'Categoria', 'Nombre-Producto', 'Habilitado'],
    requiredOnCreate: ['Comercio-Sucursal']
  },

  /** Hoja Tabla Costo Productos (Armador de Productos) – ?sheet=Tabla-Costo-Productos
   * PK = IDCosto-Producto. Referenciada por Listado-Productos-Elaborados.IDCosto-Producto */
  'tabla-costo-productos': {
    sheetName: 'Tabla-Costo-Productos',
    gid: 0,
    headers: [
      'Orden',
      'IDCosto-Producto',
      'Categoria',
      'Producto',
      'Costo-Producto-Maestro-Total',
      'Costo-Packing',
      'Costos-Fijos',
      'Merma-Porcentaje',
      'Merma-Importe',
      'Tiempo-Packing-Minutos',
      'Costo-Mano-Obra-Packing',
      'Costo-Producto-Final-Actual',
      'Costo-Producto-Final-Anterior',
      'Habilitado'
    ],
    idColumn: 'IDCosto-Producto',
    idPrefix: 'COSTO-PROD-',
    filterColumns: ['IDCosto-Producto', 'Categoria', 'Producto', 'Habilitado'],
    requiredOnCreate: ['Producto']
  },

  /** Hoja Costo Empleados – ?sheet=COSTO-EMPLEADOS
   * PK = MINUTOS (ej. 15, 30, 60). Costos por minuto y mano de obra por actividad. */
  'costo-empleados': {
    sheetName: 'COSTO-EMPLEADOS',
    gid: 0,
    headers: [
      'MINUTOS',
      'Costo-x-Minutos-Produccion',
      'Costo-Mano-Obra-Produccion',
      'Costo-x-Minutos-Elaboracion',
      'Costo-Mano-Obra-Elaboracion',
      'Costo-x-Minutos-Packing',
      'Costo-Mano-Obra-Packing'
    ],
    idColumn: 'MINUTOS',
    filterColumns: ['MINUTOS'],
    requiredOnCreate: ['MINUTOS']
  },

  /** Hoja Tabla Receta Base (Armador Receta – módulo Receta Base) – ?sheet=Tabla-Receta-Base
   * PK = IDReceta-Base. Fórmulas: Costo-Produccion[C+E] = C+E; Costo-Produccion-ProductoBase [F/G] = F/G.
   * Sincronizar con scr/Arquitectura/sheets/receta-base/receta-base-sheets-base.js */
  'tabla-receta-base': {
    sheetName: 'Tabla-Receta-Base',
    gid: 0,
    headers: [
      'IDReceta-Base',
      'Descripcion-Masa-Producto',
      'Costo-Directo-Receta',
      'Tiempo-Produccion-Minutos',
      'Costo-Mano-Obra-Produccion',
      'Costo-Produccion[C+E]',
      'Rendimiento-Cantidad',
      'Rendimiento-UnidadMedida',
      'Costo-Produccion-ProductoBase [F/G]'
    ],
    idColumn: 'IDReceta-Base',
    idPrefix: 'RECBASE-',
    filterColumns: ['IDReceta-Base', 'Descripcion-Masa-Producto', 'Rendimiento-UnidadMedida'],
    requiredOnCreate: ['Descripcion-Masa-Producto']
  },

  /** Hoja Tabla Costos Producto Unitario (Armador Receta) – ?sheet=Tabla-Costos-ProductoUnitario
   * Headers deben coincidir con la primera fila de la hoja. PK = IDCosto-ProductoUnitario.
   * Sincronizar con scr/Arquitectura/sheets/producto-unitario-base/producto-unitario-base-sheets-base.js */
  'tabla-costos-productounitario': {
    sheetName: 'Tabla-Costos-ProductoUnitario',
    gid: 0,
    headers: [
      'Orden',
      'IDCosto-ProductoUnitario',
      'Comercio-Sucursal',
      'Categoria',
      'Nombre-Producto',
      'IDElaboracion-ProductoBase',
      'Costo-Produccion-ProductoBase',
      'Costo-Relleno-Producto',
      'Costo-Decoracion-Producto',
      'Tiempo-Elaboracion-Minutos',
      'Costo-Mano-Obra-Elaboracion',
      'Costo-Elaboracion-Actual [G + H + I + K]',
      'Costo-Elaboracion-Anterior',
      'Habilitado',
      'Fecha-Registro-Actualizado-Al',
      'Actualizado'
    ],
    idColumn: 'IDCosto-ProductoUnitario',
    idPrefix: 'PROD-UNITARIO-',
    filterColumns: ['IDCosto-ProductoUnitario', 'Comercio-Sucursal', 'Categoria', 'Nombre-Producto', 'Habilitado'],
    requiredOnCreate: ['Nombre-Producto'],
    dateUpdatedColumn: 'Fecha-Registro-Actualizado-Al'
  },

  /** Hoja Tabla Elaboración Productos Base (Armador Receta) – ?sheet=Tabla-Elaboracion-ProductosBase
   * PK = IDElaboracion-ProductoBase. Relación con Tabla-Receta-Base. */
  'tabla-elaboracion-productos-base': {
    sheetName: 'Tabla-Elaboracion-ProductosBase',
    gid: 0,
    headers: [
      'IDElaboracion-ProductoBase',
      'IDReceta-Base',
      'Cantidad',
      'Descripcion-Masa-Producto',
      'Costo-Produccion-ProductoBase',
      'Monto'
    ],
    idColumn: 'IDElaboracion-ProductoBase',
    idPrefix: 'ELAB-',
    filterColumns: ['IDElaboracion-ProductoBase', 'IDReceta-Base', 'Cantidad', 'Descripcion-Masa-Producto'],
    requiredOnCreate: ['IDReceta-Base', 'Cantidad']
  },

  /** Hoja Tabla Receta Base Detalle (Armador Receta – módulo Receta Detalle) – ?sheet=Tabla-Receta-Base-Detalle
   * PK = IDReceta-Base-Detalle. FK IDReceta-Base → Tabla-Receta-Base. FK IDInsumo-MateriaPrima → PRECIO-Materia-Prima (idmateria-prima).
   * Importe = Cantidad * Precio-Equivalencia-x-Unidad. */
  'tabla-receta-base-detalle': {
    sheetName: 'Tabla-Receta-Base-Detalle',
    gid: 0,
    headers: [
      'IDReceta-Base-Detalle',
      'IDReceta-Base',
      'IDInsumo-MateriaPrima',
      'Nombre-Insumo',
      'Cantidad',
      'Unidad-Medida',
      'Precio-Equivalencia-x-Unidad',
      'Importe'
    ],
    idColumn: 'IDReceta-Base-Detalle',
    idPrefix: 'RECDET-',
    filterColumns: ['IDReceta-Base-Detalle', 'IDReceta-Base', 'Nombre-Insumo', 'Unidad-Medida'],
    requiredOnCreate: ['IDReceta-Base', 'IDInsumo-MateriaPrima', 'Cantidad']
  }

  // Para agregar otra hoja, copiá un bloque (p.ej. packing), cambiá la clave y sheetName:
  // otraHoja: { sheetName: 'PRECIO-Otra', headers: [...], idColumn: 'idotra', idPrefix: 'COSTO-XX-', ... }
};

/**
 * Propagación al actualizar Tabla-Costo-Productos: copiar columnas resultado a filas de Listado-Productos-Elaborados
 * que referencian este ID. Sincronizar con scr/Arquitectura/sheets/costo-productos/costo-productos-sheets-base.js → hoja.propagacion
 */
var PROPAGACION_COSTO_PRODUCTOS = {
  soloEnUpdate: false,
  tablaDestino: 'listado-productos-elaborados',
  columnaClaveForanea: 'IDCosto-Producto',
  columnas: [
    { columnaOrigen: 'Costo-Producto-Final-Actual', columnaDestino: 'Costo-Producto-Final-Actual' },
    { columnaOrigen: 'Costo-Producto-Final-Anterior', columnaDestino: 'Costo-Producto-Final-Anterior' },
    { columnaOrigen: 'Producto', columnaDestino: 'Nombre-Producto' },
    { columnaOrigen: 'Categoria', columnaDestino: 'Categoria' }
  ]
};

/**
 * Al crear/actualizar Tabla-Receta-Base-Detalle, rellenar columnas desde PRECIO-Materia-Prima
 * cuando IDInsumo-MateriaPrima está definido. Sincronizar con receta-detalle-sheets-base.js → hoja.propagacionDesdeInsumo
 */
var PROPAGACION_RECETA_DETALLE_DESDE_INSUMO = {
  tablaOrigen: 'materiaPrima',
  columnaClaveForanea: 'IDInsumo-MateriaPrima',
  columnas: [
    { columnaOrigen: 'Nombre-Producto', columnaDestino: 'Nombre-Insumo' },
    { columnaOrigen: 'Equivalencia-Tipo-Unidad-Medida', columnaDestino: 'Unidad-Medida' },
    { columnaOrigen: 'Precio-Equivalencia-x-Unidad', columnaDestino: 'Precio-Equivalencia-x-Unidad' }
  ]
};

var ACTIONS = {
  LIST: 'list',
  GET: 'get',
  SEARCH: 'search',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  FILL_IDS: 'fillIds'
};

var SEARCH_PARAMS = { sheet: 'sheet', q: 'q', limit: 'limit', offset: 'offset', sortBy: 'sortBy', sortOrder: 'sortOrder' };

// ═══════════════════════════════════════════════════════════════════════════════
// AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

function jsonResponse(success, data, errorMessage) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: success, data: data || null, error: errorMessage || null }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet() {
  if (CONFIG.spreadsheetId) {
    return SpreadsheetApp.openById(CONFIG.spreadsheetId);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet(configSheet) {
  var ss = getSpreadsheet();
  if (configSheet.sheetName) {
    var byName = ss.getSheetByName(configSheet.sheetName);
    if (byName) return byName;
  }
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === configSheet.gid) {
      return sheets[i];
    }
  }
  return null;
}

function rowToObject(headers, values) {
  var obj = {};
  var arr = Array.isArray(values) ? values : [];
  headers.forEach(function (h, i) {
    obj[h] = i < arr.length && arr[i] !== null && arr[i] !== undefined ? arr[i] : '';
  });
  return obj;
}

function objectToRow(headers, obj) {
  return headers.map(function (h) {
    return obj[h] != null ? String(obj[h]) : '';
  });
}

/**
 * Normaliza un objeto de fila (con claves que pueden ser del sheet) al orden y nombres de configHeaders.
 * Así la API siempre devuelve datos según la configuración del módulo, aunque la hoja tenga columnas en otro orden o con nombres ligeramente distintos.
 */
function normalizeRowToConfigHeaders(rowObj, configHeaders) {
  var norm = function (s) {
    return (s != null ? String(s) : '').trim().toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  };
  var out = {};
  configHeaders.forEach(function (h) {
    var val = rowObj[h];
    if (val === undefined || val === null) {
      for (var k in rowObj) {
        if (Object.prototype.hasOwnProperty.call(rowObj, k) && norm(k) === norm(h)) {
          val = rowObj[k];
          break;
        }
      }
    }
    out[h] = val !== undefined && val !== null ? val : '';
  });
  return out;
}

function generateId(prefix) {
  var alfanum = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var base = (new Date().getTime().toString(36) + Math.random().toString(36).slice(2, 6)).slice(-8);
  var r = '';
  for (var i = 0; i < 4; i++) {
    r += alfanum[Math.floor(Math.random() * alfanum.length)];
  }
  return (prefix || 'ID-') + base + r;
}

function filterRows(rows, headers, filters) {
  if (!filters || Object.keys(filters).length === 0) return rows;
  return rows.filter(function (row) {
    var obj = rowToObject(headers, row);
    for (var col in filters) {
      var val = (obj[col] || '').toString().toLowerCase();
      var search = (filters[col] || '').toString().toLowerCase();
      if (search && val.indexOf(search) === -1) return false;
    }
    return true;
  });
}

function searchInRows(rows, headers, filterColumns, q) {
  if (!q || !q.trim()) return rows;
  q = q.trim().toLowerCase();
  return rows.filter(function (row) {
    var obj = rowToObject(headers, row);
    return filterColumns.some(function (col) {
      return (obj[col] || '').toString().toLowerCase().indexOf(q) !== -1;
    });
  });
}

/** Obtiene la config de la hoja por parámetro sheet (materiaPrima, packing, combos, etc.) */
function getSheetConfig(sheetKey) {
  var key = (sheetKey || 'materiaPrima').toString().trim().toLowerCase();
  if (CONFIG[key]) return CONFIG[key];
  if (key === 'combo') return CONFIG.combos;
  return CONFIG.materiaPrima;
}

/**
 * Tras actualizar Tabla-Costo-Productos, propaga los valores indicados en PROPAGACION_COSTO_PRODUCTOS
 * a las filas de la tabla destino (Listado-Productos-Elaborados) donde la FK coincide con idCostoProducto.
 */
function propagarCostoProductosAReferenciadores(idCostoProducto, updatedObj) {
  if (!PROPAGACION_COSTO_PRODUCTOS || !PROPAGACION_COSTO_PRODUCTOS.tablaDestino || !PROPAGACION_COSTO_PRODUCTOS.columnas || PROPAGACION_COSTO_PRODUCTOS.columnas.length === 0) return;
  var configDest = getSheetConfig(PROPAGACION_COSTO_PRODUCTOS.tablaDestino);
  if (!configDest) return;
  var sheetDest = getSheet(configDest);
  if (!sheetDest) return;
  var dataDest = sheetDest.getDataRange().getValues();
  if (dataDest.length < 2) return;
  var headerRowDest = (dataDest[0] || []).map(function (c) { return (c != null ? String(c) : '').trim(); });
  var fkColIdx = headerRowDest.indexOf(PROPAGACION_COSTO_PRODUCTOS.columnaClaveForanea);
  if (fkColIdx === -1) return;
  var idStr = (idCostoProducto || '').toString().trim();
  var destColIndexes = [];
  for (var c = 0; c < PROPAGACION_COSTO_PRODUCTOS.columnas.length; c++) {
    var colDest = PROPAGACION_COSTO_PRODUCTOS.columnas[c].columnaDestino;
    var idx = headerRowDest.indexOf(colDest);
    if (idx !== -1) destColIndexes.push({ columnaOrigen: PROPAGACION_COSTO_PRODUCTOS.columnas[c].columnaOrigen, destIdx: idx });
  }
  if (destColIndexes.length === 0) return;
  for (var r = 1; r < dataDest.length; r++) {
    var rowVal = (dataDest[r][fkColIdx] != null ? String(dataDest[r][fkColIdx]) : '').trim();
    if (rowVal !== idStr) continue;
    var rowIndexSheet = r + 1;
    for (var d = 0; d < destColIndexes.length; d++) {
      var val = updatedObj[destColIndexes[d].columnaOrigen];
      var toWrite = val != null && val !== '' ? String(val) : '';
      sheetDest.getRange(rowIndexSheet, destColIndexes[d].destIdx + 1).setValue(toWrite);
    }
  }
}

/**
 * Rellena el objeto de Receta-Detalle con columnas propagadas desde PRECIO-Materia-Prima
 * cuando IDInsumo-MateriaPrima está definido. Modifica obj in-place.
 */
function rellenarRecetaDetalleDesdeInsumo(obj) {
  if (!PROPAGACION_RECETA_DETALLE_DESDE_INSUMO || !PROPAGACION_RECETA_DETALLE_DESDE_INSUMO.columnas || PROPAGACION_RECETA_DETALLE_DESDE_INSUMO.columnas.length === 0) return;
  var fkVal = (obj[PROPAGACION_RECETA_DETALLE_DESDE_INSUMO.columnaClaveForanea] || '').toString().trim();
  if (!fkVal) return;
  var configOrigen = getSheetConfig(PROPAGACION_RECETA_DETALLE_DESDE_INSUMO.tablaOrigen);
  if (!configOrigen) return;
  var sheetOrigen = getSheet(configOrigen);
  if (!sheetOrigen) return;
  var dataOrigen = sheetOrigen.getDataRange().getValues();
  if (dataOrigen.length < 2) return;
  var headerOrigen = (dataOrigen[0] || []).map(function (c) { return (c != null ? String(c) : '').trim(); });
  var idColIdx = headerOrigen.indexOf(configOrigen.idColumn);
  if (idColIdx === -1) return;
  var insumoRow = null;
  for (var r = 1; r < dataOrigen.length; r++) {
    if (String(dataOrigen[r][idColIdx] || '').trim() === fkVal) {
      insumoRow = rowToObject(headerOrigen, dataOrigen[r]);
      break;
    }
  }
  if (!insumoRow) return;
  for (var c = 0; c < PROPAGACION_RECETA_DETALLE_DESDE_INSUMO.columnas.length; c++) {
    var co = PROPAGACION_RECETA_DETALLE_DESDE_INSUMO.columnas[c].columnaOrigen;
    var cd = PROPAGACION_RECETA_DETALLE_DESDE_INSUMO.columnas[c].columnaDestino;
    var actual = (obj[cd] != null ? String(obj[cd]) : '').trim();
    if (actual !== '') continue;
    var val = insumoRow[co];
    obj[cd] = val != null && val !== '' ? (typeof val === 'number' ? val : String(val).trim()) : '';
  }
}

/**
 * Actualiza Costo-Directo-Receta en Tabla-Receta-Base con la suma de Importe
 * de todos los ítems (Tabla-Receta-Base-Detalle) para ese IDReceta-Base.
 */
function actualizarCostoDirectoRecetaBase(idRecetaBase) {
  if (!idRecetaBase || String(idRecetaBase).trim() === '') return;
  var idRb = String(idRecetaBase).trim();
  var configDetalle = getSheetConfig('tabla-receta-base-detalle');
  if (!configDetalle) return;
  var sheetDetalle = getSheet(configDetalle);
  if (!sheetDetalle) return;
  var dataDetalle = sheetDetalle.getDataRange().getValues();
  if (dataDetalle.length < 2) return;
  var headerDetalle = (dataDetalle[0] || []).map(function (c) { return (c != null ? String(c) : '').trim(); });
  var idxIdRb = headerDetalle.indexOf('IDReceta-Base');
  var idxImporte = headerDetalle.indexOf('Importe');
  if (idxIdRb === -1 || idxImporte === -1) return;
  var suma = 0;
  for (var r = 1; r < dataDetalle.length; r++) {
    var fila = dataDetalle[r] || [];
    if (String(fila[idxIdRb] || '').trim() !== idRb) continue;
    var imp = fila[idxImporte];
    if (imp != null && imp !== '') suma += (typeof imp === 'number' ? imp : parseFloat(String(imp).replace(',', '.')) || 0);
  }
  var configBase = getSheetConfig('tabla-receta-base');
  if (!configBase) return;
  var sheetBase = getSheet(configBase);
  if (!sheetBase) return;
  var dataBase = sheetBase.getDataRange().getValues();
  if (dataBase.length < 2) return;
  var headerBase = (dataBase[0] || []).map(function (c) { return (c != null ? String(c) : '').trim(); });
  var idxIdBase = headerBase.indexOf('IDReceta-Base');
  var idxCostoDirecto = headerBase.indexOf('Costo-Directo-Receta');
  if (idxIdBase === -1 || idxCostoDirecto === -1) return;
  for (var b = 1; b < dataBase.length; b++) {
    if (String((dataBase[b] || [])[idxIdBase] || '').trim() === idRb) {
      sheetBase.getRange(b + 1, idxCostoDirecto + 1).setValue(suma);
      break;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTRADA HTTP (doGet / doPost)
// ═══════════════════════════════════════════════════════════════════════════════

function doGet(e) {
  return handleRequest(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  var params = {};
  if (e && e.parameter) {
    for (var p in e.parameter) params[p] = e.parameter[p];
  }
  if (e.postData && e.postData.contents) {
    var type = (e.postData.type || '').toLowerCase();
    var raw = e.postData.contents;
    if (type.indexOf('application/json') !== -1) {
      try {
        var body = JSON.parse(raw);
        for (var k in body) params[k] = body[k];
      } catch (err) {}
    } else if (type.indexOf('application/x-www-form-urlencoded') !== -1 || (raw && raw.indexOf('=') !== -1 && raw.indexOf('{') === -1)) {
      try {
        var pairs = raw.split('&');
        for (var i = 0; i < pairs.length; i++) {
          var parts = pairs[i].split('=');
          if (parts.length >= 1 && parts[0]) {
            var key = decodeURIComponent(parts[0].replace(/\+/g, ' '));
            var val = parts.length >= 2 ? decodeURIComponent((parts.slice(1).join('=')).replace(/\+/g, ' ')) : '';
            params[key] = val;
          }
        }
      } catch (err) {}
    }
  }
  return handleRequest(params);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABM: LISTAR | OBTENER UNO | BUSCAR | CREAR | MODIFICAR | ELIMINAR | RELLENAR IDs
// ═══════════════════════════════════════════════════════════════════════════════

function handleRequest(params) {
  var action = (params.action || params['action'] || '').toString().toLowerCase();
  var sheetParam = params.sheet || params['sheet'];
  if (Array.isArray(sheetParam)) sheetParam = sheetParam.length > 0 ? sheetParam[0] : '';
  var sheetKey = (sheetParam != null && String(sheetParam).trim() !== '' ? String(sheetParam).trim() : 'materiaPrima').toLowerCase();
  var configSheet = getSheetConfig(sheetKey);
  var headers = configSheet.headers;
  var sheet = getSheet(configSheet);

  if (!sheet) {
    return jsonResponse(false, null, 'Hoja no encontrada: ' + (configSheet.sheetName || sheetKey));
  }

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return jsonResponse(true, { headers: configSheet.headers, rows: [] });
  }

  var headerRow = (data[0] || []).map(function (c) { return (c != null ? String(c) : '').trim(); });
  var numCols = headerRow.length;
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var raw = data[i] || [];
    var row = [];
    for (var j = 0; j < numCols; j++) {
      row.push(j < raw.length && raw[j] !== null && raw[j] !== undefined ? raw[j] : '');
    }
    rows.push(row);
  }

  var configHeaders = configSheet.headers || headerRow;

  try {
    // ─── LISTAR ───
    if (action === ACTIONS.LIST) {
      var limit = parseInt(params[SEARCH_PARAMS.limit], 10) || 500;
      var offset = parseInt(params[SEARCH_PARAMS.offset], 10) || 0;
      var list = rows.slice(offset, offset + limit).map(function (row) {
        var obj = rowToObject(headerRow, row);
        return normalizeRowToConfigHeaders(obj, configHeaders);
      });
      return jsonResponse(true, { headers: configHeaders, rows: list, total: rows.length });
    }

    // ─── BUSCAR / FILTRAR ───
    if (action === ACTIONS.SEARCH) {
      var filters = {};
      configHeaders.forEach(function (h) {
        if (params[h] != null && params[h] !== '') filters[h] = params[h];
      });
      var q = (params[SEARCH_PARAMS.q] || params.q || '').toString().trim();
      var filtered = rows;
      if (Object.keys(filters).length > 0) filtered = filterRows(filtered, headerRow, filters);
      if (q) filtered = searchInRows(filtered, headerRow, configSheet.filterColumns || [], q);
      var sortBy = params[SEARCH_PARAMS.sortBy];
      if (sortBy && headerRow.indexOf(sortBy) !== -1) {
        var colIdx = headerRow.indexOf(sortBy);
        var order = (params[SEARCH_PARAMS.sortOrder] || 'asc').toLowerCase();
        filtered.sort(function (a, b) {
          var va = (a[colIdx] != null ? a[colIdx] : '').toString();
          var vb = (b[colIdx] != null ? b[colIdx] : '').toString();
          return order === 'desc' ? (vb < va ? -1 : vb > va ? 1 : 0) : (va < vb ? -1 : va > vb ? 1 : 0);
        });
      }
      var limitS = parseInt(params[SEARCH_PARAMS.limit], 10) || 200;
      var offsetS = parseInt(params[SEARCH_PARAMS.offset], 10) || 0;
      var slice = filtered.slice(offsetS, offsetS + limitS).map(function (row) {
        var obj = rowToObject(headerRow, row);
        return normalizeRowToConfigHeaders(obj, configHeaders);
      });
      return jsonResponse(true, { headers: configHeaders, rows: slice, total: filtered.length });
    }

    // ─── OBTENER UNO (por id) ───
    if (action === ACTIONS.GET) {
      var id = (params.id || params[configSheet.idColumn] || '').toString().trim();
      if (!id) return jsonResponse(false, null, 'Falta id');
      var idColIdx = headerRow.indexOf(configSheet.idColumn);
      if (idColIdx === -1) return jsonResponse(false, null, 'Columna id no configurada');
      for (var g = 0; g < rows.length; g++) {
        if (String(rows[g][idColIdx] || '').trim() === id) {
          var getObj = rowToObject(headerRow, rows[g]);
          return jsonResponse(true, normalizeRowToConfigHeaders(getObj, configHeaders));
        }
      }
      return jsonResponse(false, null, 'No encontrado');
    }

    // ─── CREAR REGISTRO ───
    if (action === ACTIONS.CREATE) {
      var newObj = {};
      configHeaders.forEach(function (h, idx) {
        newObj[h] = params[h] != null ? params[h] : (params[idx] != null ? params[idx] : '');
      });
      if (!(configSheet.idColumn in newObj) || !String(newObj[configSheet.idColumn]).trim()) {
        newObj[configSheet.idColumn] = generateId(configSheet.idPrefix);
      }
      if (configSheet.requiredOnCreate && configSheet.requiredOnCreate.length > 0) {
        for (var r = 0; r < configSheet.requiredOnCreate.length; r++) {
          var req = configSheet.requiredOnCreate[r];
          if (!String(newObj[req] || '').trim()) {
            return jsonResponse(false, null, 'Falta campo obligatorio: ' + req);
          }
        }
      }
      if (configSheet.dateUpdatedColumn) {
        newObj[configSheet.dateUpdatedColumn] = new Date().toISOString().slice(0, 10);
      }
      if (sheetKey === 'tabla-receta-base-detalle' && PROPAGACION_RECETA_DETALLE_DESDE_INSUMO && PROPAGACION_RECETA_DETALLE_DESDE_INSUMO.columnas && PROPAGACION_RECETA_DETALLE_DESDE_INSUMO.columnas.length > 0) {
        try { rellenarRecetaDetalleDesdeInsumo(newObj); } catch (errRelleno) {}
      }
      var newObjForSheet = normalizeRowToConfigHeaders(newObj, headerRow);
      var newRow = objectToRow(headerRow, newObjForSheet);
      sheet.appendRow(newRow);
      if (sheetKey === 'tabla-receta-base-detalle') {
        try { actualizarCostoDirectoRecetaBase(newObj['IDReceta-Base']); } catch (errCosto) {}
      }
      if (sheetKey === 'tabla-costo-productos' && PROPAGACION_COSTO_PRODUCTOS && PROPAGACION_COSTO_PRODUCTOS.columnas && PROPAGACION_COSTO_PRODUCTOS.columnas.length > 0 && PROPAGACION_COSTO_PRODUCTOS.soloEnUpdate !== true) {
        try {
          propagarCostoProductosAReferenciadores(newObj[configSheet.idColumn] || '', newObj);
        } catch (errProp) {}
      }
      return jsonResponse(true, normalizeRowToConfigHeaders(newObj, configHeaders));
    }

    // ─── MODIFICAR REGISTRO ───
    if (action === ACTIONS.UPDATE) {
      var idUp = (params.id || params[configSheet.idColumn] || '').toString().trim();
      if (!idUp) return jsonResponse(false, null, 'Falta id');
      var idColIdxUp = headerRow.indexOf(configSheet.idColumn);
      if (idColIdxUp === -1) return jsonResponse(false, null, 'Columna id no configurada');
      var rowIndex = -1;
      for (var u = 0; u < rows.length; u++) {
        if (String(rows[u][idColIdxUp] || '').trim() === idUp) {
          rowIndex = u + 2;
          break;
        }
      }
      if (rowIndex < 0) return jsonResponse(false, null, 'No encontrado');
      var existing = rows[rowIndex - 2];
      var updatedObj = normalizeRowToConfigHeaders(rowToObject(headerRow, existing), configHeaders);
      configHeaders.forEach(function (h) {
        if (h !== configSheet.idColumn && params[h] !== undefined && params[h] !== null) {
          updatedObj[h] = params[h];
        }
      });
      if (configSheet.dateUpdatedColumn) {
        updatedObj[configSheet.dateUpdatedColumn] = new Date().toISOString().slice(0, 10);
      }
      if (sheetKey === 'tabla-receta-base-detalle' && PROPAGACION_RECETA_DETALLE_DESDE_INSUMO && PROPAGACION_RECETA_DETALLE_DESDE_INSUMO.columnas && PROPAGACION_RECETA_DETALLE_DESDE_INSUMO.columnas.length > 0) {
        try { rellenarRecetaDetalleDesdeInsumo(updatedObj); } catch (errRelleno) {}
      }
      var updatedObjForSheet = normalizeRowToConfigHeaders(updatedObj, headerRow);
      var upRow = objectToRow(headerRow, updatedObjForSheet);
      // getRange(filaInicio, colInicio, numFilas, numCols): 3er parámetro = CANTIDAD de filas (1), no la fila final
      sheet.getRange(rowIndex, 1, 1, upRow.length).setValues([upRow]);
      if (sheetKey === 'tabla-receta-base-detalle') {
        try { actualizarCostoDirectoRecetaBase(updatedObj['IDReceta-Base']); } catch (errCosto) {}
      }
      if (sheetKey === 'tabla-costo-productos' && PROPAGACION_COSTO_PRODUCTOS && PROPAGACION_COSTO_PRODUCTOS.columnas && PROPAGACION_COSTO_PRODUCTOS.columnas.length > 0) {
        try {
          propagarCostoProductosAReferenciadores(idUp, updatedObj);
        } catch (errProp) {
          // No fallar el update si la propagación falla; se puede revisar en logs
        }
      }
      return jsonResponse(true, normalizeRowToConfigHeaders(updatedObj, configHeaders));
    }

    // ─── ELIMINAR REGISTRO ───
    if (action === ACTIONS.DELETE) {
      var idDel = (params.id || params[configSheet.idColumn] || '').toString().trim();
      if (!idDel) return jsonResponse(false, null, 'Falta id');
      var idColIdxDel = headerRow.indexOf(configSheet.idColumn);
      if (idColIdxDel === -1) return jsonResponse(false, null, 'Columna id no configurada');
      var delRowIndex = -1;
      for (var d = 0; d < rows.length; d++) {
        if (String(rows[d][idColIdxDel] || '').trim() === idDel) {
          delRowIndex = d + 2;
          break;
        }
      }
      if (delRowIndex < 0) return jsonResponse(false, null, 'No encontrado');
      var idRecetaBaseParaCosto = '';
      if (sheetKey === 'tabla-receta-base-detalle') {
        var idxIdRbDel = headerRow.indexOf('IDReceta-Base');
        if (idxIdRbDel >= 0) idRecetaBaseParaCosto = String((rows[delRowIndex - 2] || [])[idxIdRbDel] || '').trim();
      }
      sheet.deleteRow(delRowIndex);
      if (sheetKey === 'tabla-receta-base-detalle' && idRecetaBaseParaCosto) {
        try { actualizarCostoDirectoRecetaBase(idRecetaBaseParaCosto); } catch (errCosto) {}
      }
      return jsonResponse(true, { deleted: idDel });
    }

    // ─── RELLENAR IDs VACÍOS ───
    if (action === ACTIONS.FILL_IDS) {
      var idColIdxFill = headerRow.indexOf(configSheet.idColumn);
      if (idColIdxFill === -1) {
        return jsonResponse(false, null, 'Columna "' + configSheet.idColumn + '" no encontrada');
      }
      var updated = 0;
      for (var f = 0; f < rows.length; f++) {
        var cellVal = rows[f][idColIdxFill];
        if (cellVal == null || String(cellVal).trim() === '') {
          var newId = generateId(configSheet.idPrefix);
          sheet.getRange(f + 2, idColIdxFill + 1).setValue(newId);
          updated++;
        }
      }
      return jsonResponse(true, { updated: updated, sheet: sheetKey });
    }

    return jsonResponse(false, null, 'Acción no válida. Usar: list, get, search, create, update, delete, fillIds');
  } catch (err) {
    return jsonResponse(false, null, err.message || 'Error en el servidor');
  }
}
