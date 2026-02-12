/**
 * CONFIGURACIÓN APPS SCRIPT – ABM completo y filtros de búsqueda
 * Copiá este archivo en tu proyecto de Google Apps Script y ajustá valores según tu hoja.
 * Uso: doGet(e) / doPost(e) leen e.parameter.action y estos configs para listar, crear, actualizar, borrar o buscar.
 */

var CONFIG = {
  /** ID del libro de Google Sheets (opcional: si está vacío se usa getActiveSpreadsheet()) */
  spreadsheetId: '',
  
  /** Hoja de Materia Prima */
  materiaPrima: {
    sheetName: 'Materia Prima',
    gid: 0,
    /** Encabezados en el mismo orden que las columnas A, B, C... (para leer/escribir por nombre) */
    headers: [
      'idmateria-prima',
      'Categoria',
      'Nombre Producto',
      'Presentacion Tipo',
      'Presentacion Cantidad Medida',
      'Presentacion Unidad',
      'Precio',
      'OBSERVACIONES',
      'Cantidad Unidad Medida',
      'Tipo Unidad Medida',
      'Equivalencia Unidad Medida',
      'Equivalencia Tipo Unidad Medida',
      'HABILITADO',
      'NO',
      'Precio COSTO x Unidad',
      'Precio Equivalencia x Unidad',
      'Fecha Actualizada Al',
      'Dias Trascurridos Actualizacion',
      'MARCA',
      'LUGAR',
      'ACTUALIZAR PRECIO'
    ],
    /** Columna que identifica unívocamente la fila (para update/delete) */
    idColumn: 'idmateria-prima',
    /** Prefijo para generar nuevo id si no viene en create */
    idPrefix: 'COSTO-MP-',
    /** Columnas por las que se puede filtrar/buscar (nombre exacto del header) */
    filterColumns: ['Categoria', 'Nombre Producto', 'Presentacion Tipo', 'MARCA', 'HABILITADO', 'idmateria-prima'],
    /** Columnas obligatorias en alta (create) */
    requiredOnCreate: ['Nombre Producto'],
    /** Columna de fecha para "actualizado" (opcional) */
    dateUpdatedColumn: 'Fecha Actualizada Al'
  },

  /** Hoja de Packing */
  packing: {
    sheetName: 'Packing',
    gid: 1565788325,
    /** Ajustá los headers según las columnas reales de tu hoja Packing */
    headers: [
      'idpacking',
      'Nombre',
      'Tipo',
      'Unidad',
      'Costo unitario',
      'Observaciones',
      'HABILITADO',
      'Fecha Actualizada Al'
    ],
    idColumn: 'idpacking',
    idPrefix: 'COSTO-PK-',
    filterColumns: ['Nombre', 'Tipo', 'HABILITADO', 'idpacking'],
    requiredOnCreate: ['Nombre'],
    dateUpdatedColumn: 'Fecha Actualizada Al'
  }
};

/** Nombres de acciones para el ABM (parámetro ?action= en doGet/doPost) */
var ACTIONS = {
  LIST: 'list',
  GET: 'get',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  SEARCH: 'search'
};

/** Parámetros de búsqueda/filtro (query string o JSON body) */
// Ejemplo: ?action=search&sheet=materiaPrima&Categoria=HARINAS&Nombre Producto=Harina
// O: ?action=search&sheet=materiaPrima&q=harina  (búsqueda libre en columnas filterColumns)
var SEARCH_PARAMS = {
  sheet: 'sheet',           // materiaPrima | packing
  q: 'q',                  // texto libre (busca en filterColumns)
  limit: 'limit',          // máximo de filas (ej: 100)
  offset: 'offset',        // desde qué fila (paginación)
  sortBy: 'sortBy',        // nombre de columna
  sortOrder: 'sortOrder'   // asc | desc
};

/** Respuesta estándar JSON */
function jsonResponse(success, data, errorMessage) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: success,
      data: data || null,
      error: errorMessage || null
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Obtiene el libro: por ID o activo */
function getSpreadsheet() {
  if (CONFIG.spreadsheetId) {
    return SpreadsheetApp.openById(CONFIG.spreadsheetId);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/** Obtiene la hoja por nombre o por gid */
function getSheet(configSheet) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(configSheet.sheetName);
  if (!sheet) {
    sheet = ss.getSheets().filter(function (s) { return s.getSheetId() === configSheet.gid; })[0];
  }
  return sheet;
}

/** Convierte fila del sheet a objeto { header: value } */
function rowToObject(headers, values) {
  var obj = {};
  headers.forEach(function (h, i) {
    obj[h] = values[i] != null ? values[i] : '';
  });
  return obj;
}

/** Convierte objeto a fila según headers */
function objectToRow(headers, obj) {
  return headers.map(function (h) {
    return obj[h] != null ? String(obj[h]) : '';
  });
}

/** Genera ID alfanumérico único */
function generateId(prefix) {
  var alfanum = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var base = (new Date().getTime().toString(36) + Math.random().toString(36).slice(2, 6)).slice(-8);
  var r = '';
  for (var i = 0; i < 4; i++) {
    r += alfanum[Math.floor(Math.random() * alfanum.length)];
  }
  return (prefix || 'ID-') + base + r;
}

/** Aplica filtros a filas: cada key del objeto filters es nombre de columna, value es texto a contener o igualar */
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

/** Búsqueda por texto libre en columnas permitidas */
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
