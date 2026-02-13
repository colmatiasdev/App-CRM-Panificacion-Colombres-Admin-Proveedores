/**
 * Handlers doGet / doPost – ABM completo y búsqueda
 * Requiere: APPS_SCRIPT_CONFIG_ABM.gs en el mismo proyecto.
 * Desplegá como aplicación web: Ejecutar la app como "Yo", Quién puede acceder "Cualquier usuario" (o según necesites).
 */

function doGet(e) {
  return handleRequest(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  var params = e && e.parameter ? Object.assign({}, e.parameter) : {};
  if (e.postData && e.postData.contents) {
    var type = (e.postData.type || '').toLowerCase();
    if (type.indexOf('application/json') !== -1) {
      try {
        var body = JSON.parse(e.postData.contents);
        for (var k in body) params[k] = body[k];
      } catch (err) {}
    }
    // application/x-www-form-urlencoded: los parámetros ya vienen en e.parameter
  }
  return handleRequest(params);
}

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
      headers.forEach(function (h) {
        if (h !== configSheet.idColumn && (params[h] !== undefined && params[h] !== null)) {
          updatedObj[h] = params[h];
        }
      });
      if (configSheet.dateUpdatedColumn) {
        updatedObj[configSheet.dateUpdatedColumn] = new Date().toISOString().slice(0, 10);
      }
      var upRow = objectToRow(headerRow, updatedObj);
      // getRange(row, column, numRows, numColumns): 1 fila, numCols columnas
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

    /** Rellena idmateria-prima (o idpacking) vacíos en la hoja con COSTO-MP-xxx / COSTO-PK-xxx */
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
