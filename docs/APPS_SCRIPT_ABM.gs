/**
 * APPS SCRIPT – ABM completo (list, get, search, create, update, delete, fillIds)
 * Un solo archivo: configuración + handlers. Desplegá como aplicación web.
 * Ejecutar la app como: Yo. Quién puede acceder: Cualquier usuario (o según necesites).
 */

// ——— CONFIGURACIÓN ———
var CONFIG = {
  spreadsheetId: '',
  materiaPrima: {
    sheetName: 'Materia Prima',
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
  packing: {
    sheetName: 'Packing',
    gid: 1565788325,
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

var ACTIONS = {
  LIST: 'list',
  GET: 'get',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  SEARCH: 'search',
  FILL_IDS: 'fillIds'
};

var SEARCH_PARAMS = {
  sheet: 'sheet',
  q: 'q',
  limit: 'limit',
  offset: 'offset',
  sortBy: 'sortBy',
  sortOrder: 'sortOrder'
};

// ——— FUNCIONES AUXILIARES ———
function jsonResponse(success, data, errorMessage) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: success,
      data: data || null,
      error: errorMessage || null
    }))
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
  var sheets = ss.getSheets();
  var sheet = null;
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === configSheet.gid) {
      sheet = sheets[i];
      break;
    }
  }
  if (!sheet && configSheet.sheetName) {
    sheet = ss.getSheetByName(configSheet.sheetName);
  }
  return sheet;
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

// ——— ENTRADA HTTP ———
function doGet(e) {
  return handleRequest(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  var params = e && e.parameter ? {} : {};
  if (e && e.parameter) {
    for (var p in e.parameter) params[p] = e.parameter[p];
  }
  if (e.postData && e.postData.contents) {
    var type = (e.postData.type || '').toLowerCase();
    if (type.indexOf('application/json') !== -1) {
      try {
        var body = JSON.parse(e.postData.contents);
        for (var k in body) params[k] = body[k];
      } catch (err) {}
    }
  }
  return handleRequest(params);
}

// ——— LÓGICA DE ACCIONES ———
function handleRequest(params) {
  var action = (params.action || params['action'] || '').toString().toLowerCase();
  var sheetKey = (params.sheet || params['sheet'] || 'materiaPrima').toLowerCase();
  var configSheet = sheetKey === 'packing' ? CONFIG.packing : CONFIG.materiaPrima;
  var headers = configSheet.headers;
  var sheet = getSheet(configSheet);
  if (!sheet) {
    return jsonResponse(false, null, 'Hoja no encontrada');
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

  try {
    if (action === ACTIONS.LIST) {
      var limit = parseInt(params[SEARCH_PARAMS.limit], 10) || 500;
      var offset = parseInt(params[SEARCH_PARAMS.offset], 10) || 0;
      var list = rows.slice(offset, offset + limit).map(function (row) { return rowToObject(headerRow, row); });
      return jsonResponse(true, { headers: headerRow, rows: list, total: rows.length });
    }

    if (action === ACTIONS.SEARCH) {
      var filters = {};
      headers.forEach(function (h) {
        if (params[h] != null && params[h] !== '') filters[h] = params[h];
      });
      var q = (params[SEARCH_PARAMS.q] || params.q || '').toString().trim();
      var filtered = rows;
      if (Object.keys(filters).length > 0) {
        filtered = filterRows(filtered, headerRow, filters);
      }
      if (q) {
        filtered = searchInRows(filtered, headerRow, configSheet.filterColumns, q);
      }
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
      var slice = filtered.slice(offsetS, offsetS + limitS).map(function (row) { return rowToObject(headerRow, row); });
      return jsonResponse(true, { headers: headerRow, rows: slice, total: filtered.length });
    }

    if (action === ACTIONS.GET) {
      var id = (params.id || params[configSheet.idColumn] || '').toString().trim();
      if (!id) return jsonResponse(false, null, 'Falta id');
      var idColIdx = headerRow.indexOf(configSheet.idColumn);
      if (idColIdx === -1) return jsonResponse(false, null, 'Columna id no configurada');
      for (var g = 0; g < rows.length; g++) {
        if (String(rows[g][idColIdx] || '').trim() === id) {
          return jsonResponse(true, rowToObject(headerRow, rows[g]));
        }
      }
      return jsonResponse(false, null, 'No encontrado');
    }

    if (action === ACTIONS.CREATE) {
      var newObj = {};
      headers.forEach(function (h, idx) {
        newObj[h] = params[h] != null ? params[h] : (params[idx] != null ? params[idx] : '');
      });
      if (!(configSheet.idColumn in newObj) || !String(newObj[configSheet.idColumn]).trim()) {
        newObj[configSheet.idColumn] = generateId(configSheet.idPrefix);
      }
      for (var r = 0; r < configSheet.requiredOnCreate.length; r++) {
        var req = configSheet.requiredOnCreate[r];
        if (!String(newObj[req] || '').trim()) {
          return jsonResponse(false, null, 'Falta campo obligatorio: ' + req);
        }
      }
      if (configSheet.dateUpdatedColumn) {
        newObj[configSheet.dateUpdatedColumn] = new Date().toISOString().slice(0, 10);
      }
      var newRow = objectToRow(headerRow, newObj);
      sheet.appendRow(newRow);
      return jsonResponse(true, newObj);
    }

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
      var updatedObj = rowToObject(headerRow, existing);
      headerRow.forEach(function (h) {
        if (h !== configSheet.idColumn && params[h] !== undefined && params[h] !== null) {
          updatedObj[h] = params[h];
        }
      });
      if (configSheet.dateUpdatedColumn) {
        updatedObj[configSheet.dateUpdatedColumn] = new Date().toISOString().slice(0, 10);
      }
      var upRow = objectToRow(headerRow, updatedObj);
      sheet.getRange(rowIndex, 1, 1, upRow.length).setValues([upRow]);
      return jsonResponse(true, updatedObj);
    }

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
      sheet.deleteRow(delRowIndex);
      return jsonResponse(true, { deleted: idDel });
    }

    if (action === ACTIONS.FILL_IDS) {
      var idColIdxFill = headerRow.indexOf(configSheet.idColumn);
      if (idColIdxFill === -1) {
        return jsonResponse(false, null, 'Columna "' + configSheet.idColumn + '" no encontrada en la hoja');
      }
      var updated = 0;
      for (var f = 0; f < rows.length; f++) {
        var cellVal = rows[f][idColIdxFill];
        if (cellVal == null || String(cellVal).trim() === '') {
          var newId = generateId(configSheet.idPrefix);
          var rowNum = f + 2;
          sheet.getRange(rowNum, idColIdxFill + 1).setValue(newId);
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
