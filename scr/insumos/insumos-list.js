/**
 * Carga y muestra lista de insumos (materia prima o packing) desde Apps Script.
 * Uso: definir window.INSUMOS_LIST_CONFIG = { sheet, idColumn, storageKeyEdit, storageKeyVisualizar, editUrl, visualizarUrl, filterInputId, countId, dataContainerId };
 */
(function () {
    var config = window.INSUMOS_LIST_CONFIG || {};
    var sheetKey = config.sheet || "materiaPrima";
    var idColumn = config.idColumn || "idmateria-prima";
    var storageKeyEdit = config.storageKeyEdit || "costosEditRecord";
    var storageKeyVisualizar = config.storageKeyVisualizar || "costosVisualizarRecord";
    var editUrl = config.editUrl || "../costos/Materia-Prima/editar-materia-prima.html";
    var visualizarUrl = config.visualizarUrl || "../costos/Materia-Prima/visualizar-materia-prima.html";
    var filterInputId = config.filterInputId || "filter-insumos";
    var countId = config.countId || "insumos-count";
    var dataContainerId = config.dataContainerId || "datos-insumos";
    var returnToUrl = (config.returnToUrl || "").trim();
    var storageKeySeleccion = (config.storageKeySeleccion || "").trim();
    var modoSeleccion = returnToUrl && storageKeySeleccion;

    var listColumns = config.listColumns;
    if (!listColumns && sheetKey === "materiaPrima" && window.PRECIO_MATERIA_PRIMA_CONFIG && window.PRECIO_MATERIA_PRIMA_CONFIG.listColumns) listColumns = window.PRECIO_MATERIA_PRIMA_CONFIG.listColumns;
    if (!listColumns && sheetKey === "packing" && window.PRECIO_PACKING_CONFIG && window.PRECIO_PACKING_CONFIG.listColumns) listColumns = window.PRECIO_PACKING_CONFIG.listColumns;
    var COLUMNAS_VISIBLES = listColumns && listColumns.length ? listColumns : ["Nombre-Producto", "Categoria", "Presentacion-Tipo", "Presentacion-Unidad", "Precio-Actual", "Precio-Anterior", "Fecha-Actualizada-Al", "Marca", "Habilitado"];

    var listFilter = config.listFilter;
    if (!listFilter && sheetKey === "materiaPrima" && window.PRECIO_MATERIA_PRIMA_CONFIG && window.PRECIO_MATERIA_PRIMA_CONFIG.listFilter) listFilter = window.PRECIO_MATERIA_PRIMA_CONFIG.listFilter;
    if (!listFilter && sheetKey === "packing" && window.PRECIO_PACKING_CONFIG && window.PRECIO_PACKING_CONFIG.listFilter) listFilter = window.PRECIO_PACKING_CONFIG.listFilter;
    var FILTER_RULES = Array.isArray(listFilter) ? listFilter : [];

    var listGroupBy = config.listGroupBy;
    if (!listGroupBy && sheetKey === "materiaPrima" && window.PRECIO_MATERIA_PRIMA_CONFIG && window.PRECIO_MATERIA_PRIMA_CONFIG.listGroupBy) listGroupBy = window.PRECIO_MATERIA_PRIMA_CONFIG.listGroupBy;
    if (!listGroupBy && sheetKey === "packing" && window.PRECIO_PACKING_CONFIG && window.PRECIO_PACKING_CONFIG.listGroupBy) listGroupBy = window.PRECIO_PACKING_CONFIG.listGroupBy;
    var GROUP_BY_COLUMNS = Array.isArray(listGroupBy) ? listGroupBy : [];

    var listColumnAliases = config.listColumnAliases;
    if (!listColumnAliases && sheetKey === "materiaPrima" && window.PRECIO_MATERIA_PRIMA_CONFIG && window.PRECIO_MATERIA_PRIMA_CONFIG.listColumnAliases) listColumnAliases = window.PRECIO_MATERIA_PRIMA_CONFIG.listColumnAliases;
    if (!listColumnAliases && sheetKey === "packing" && window.PRECIO_PACKING_CONFIG && window.PRECIO_PACKING_CONFIG.listColumnAliases) listColumnAliases = window.PRECIO_PACKING_CONFIG.listColumnAliases;
    var COLUMN_ALIASES = listColumnAliases && typeof listColumnAliases === "object" ? listColumnAliases : {};

    var listLeyenda = config.listLeyenda;
    if (!listLeyenda && sheetKey === "materiaPrima" && window.PRECIO_MATERIA_PRIMA_CONFIG && window.PRECIO_MATERIA_PRIMA_CONFIG.listLeyenda) listLeyenda = window.PRECIO_MATERIA_PRIMA_CONFIG.listLeyenda;
    if (!listLeyenda && sheetKey === "packing" && window.PRECIO_PACKING_CONFIG && window.PRECIO_PACKING_CONFIG.listLeyenda) listLeyenda = window.PRECIO_PACKING_CONFIG.listLeyenda;
    var LEYENDA_CONFIG = listLeyenda && listLeyenda.columns && listLeyenda.columns.length ? listLeyenda : null;

    var listSubLeyenda = config.listSubLeyenda;
    if (!listSubLeyenda && sheetKey === "materiaPrima" && window.PRECIO_MATERIA_PRIMA_CONFIG && window.PRECIO_MATERIA_PRIMA_CONFIG.listSubLeyenda) listSubLeyenda = window.PRECIO_MATERIA_PRIMA_CONFIG.listSubLeyenda;
    if (!listSubLeyenda && sheetKey === "packing" && window.PRECIO_PACKING_CONFIG && window.PRECIO_PACKING_CONFIG.listSubLeyenda) listSubLeyenda = window.PRECIO_PACKING_CONFIG.listSubLeyenda;
    var SUB_LEYENDA_CONFIG = listSubLeyenda && listSubLeyenda.columns && listSubLeyenda.columns.length ? listSubLeyenda : null;

    var listSearchColumns = config.listSearchColumns;
    if (!listSearchColumns && sheetKey === "materiaPrima" && window.PRECIO_MATERIA_PRIMA_CONFIG && window.PRECIO_MATERIA_PRIMA_CONFIG.listSearchColumns) listSearchColumns = window.PRECIO_MATERIA_PRIMA_CONFIG.listSearchColumns;
    if (!listSearchColumns && sheetKey === "packing" && window.PRECIO_PACKING_CONFIG && window.PRECIO_PACKING_CONFIG.listSearchColumns) listSearchColumns = window.PRECIO_PACKING_CONFIG.listSearchColumns;
    var SEARCH_COLUMNS = Array.isArray(listSearchColumns) ? listSearchColumns : [];

    var appsScriptUrl = (window.APP_CONFIG && window.APP_CONFIG.appsScriptUrl) ? String(window.APP_CONFIG.appsScriptUrl).trim() : "";
    var container = document.getElementById(dataContainerId);

    function escapeHtml(text) {
        if (text == null) return "";
        return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function norm(s) {
        return String(s != null ? s : "").trim().toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
    }

    /** Índices de columnas para listGroupBy. */
    function getGroupByIndexes(headers) {
        var idx = [];
        for (var g = 0; g < GROUP_BY_COLUMNS.length; g++) {
            for (var h = 0; h < headers.length; h++) {
                if (norm(headers[h]) === norm(GROUP_BY_COLUMNS[g])) { idx.push(h); break; }
            }
        }
        return idx;
    }

    /** Clave de agrupación de una fila (array de valores). */
    function getRowGroupKey(rowArr, colIndexes) {
        return colIndexes.map(function (i) { return String((i < rowArr.length ? rowArr[i] : null) != null ? rowArr[i] : "").trim(); });
    }

    /** Ordena filas por columnas de agrupación; si nameColIdx >= 0, desempata por nombre alfabético. */
    function sortRowsByGroup(headers, rows, groupByIndexes, nameColIdx) {
        if (!groupByIndexes.length) return rows.slice();
        return rows.slice().sort(function (a, b) {
            var arrA = Array.isArray(a) ? a : [];
            var arrB = Array.isArray(b) ? b : [];
            for (var i = 0; i < groupByIndexes.length; i++) {
                var vA = (groupByIndexes[i] < arrA.length ? arrA[groupByIndexes[i]] : null) != null ? String(arrA[groupByIndexes[i]]).trim() : "";
                var vB = (groupByIndexes[i] < arrB.length ? arrB[groupByIndexes[i]] : null) != null ? String(arrB[groupByIndexes[i]]).trim() : "";
                var c = vA.localeCompare(vB, undefined, { sensitivity: "base" });
                if (c !== 0) return c;
            }
            if (nameColIdx >= 0) {
                var nA = (nameColIdx < arrA.length && arrA[nameColIdx] != null) ? String(arrA[nameColIdx]).trim() : "";
                var nB = (nameColIdx < arrB.length && arrB[nameColIdx] != null) ? String(arrB[nameColIdx]).trim() : "";
                return nA.localeCompare(nB, undefined, { sensitivity: "base" });
            }
            return 0;
        });
    }

    /** Ordena filas alfabéticamente por la columna nombre (nameColIdx). */
    function sortRowsByName(headers, rows, nameColIdx) {
        if (nameColIdx < 0) return rows.slice();
        return rows.slice().sort(function (a, b) {
            var arrA = Array.isArray(a) ? a : [];
            var arrB = Array.isArray(b) ? b : [];
            var nA = (nameColIdx < arrA.length && arrA[nameColIdx] != null) ? String(arrA[nameColIdx]).trim() : "";
            var nB = (nameColIdx < arrB.length && arrB[nameColIdx] != null) ? String(arrB[nameColIdx]).trim() : "";
            return nA.localeCompare(nB, undefined, { sensitivity: "base" });
        });
    }

    /** Particiona filas ya ordenadas en grupos con etiqueta. */
    function partitionIntoGroups(headers, sortedRows, groupByIndexes) {
        if (!groupByIndexes.length) return [{ label: "", rows: sortedRows, startIndex: 0 }];
        var groups = [];
        var start = 0;
        var prevKey = null;
        for (var r = 0; r <= sortedRows.length; r++) {
            var row = r < sortedRows.length ? sortedRows[r] : null;
            var key = row ? getRowGroupKey(Array.isArray(row) ? row : [], groupByIndexes).join("\0") : null;
            if (prevKey !== null && key !== prevKey || r === sortedRows.length) {
                var labelParts = [];
                if (start < sortedRows.length) {
                    var firstRow = Array.isArray(sortedRows[start]) ? sortedRows[start] : [];
                    for (var g = 0; g < groupByIndexes.length; g++) {
                        var hi = groupByIndexes[g];
                        var val = hi < firstRow.length ? firstRow[hi] : "";
                        labelParts.push(escapeHtml(String(val != null ? val : "")));
                    }
                }
                groups.push({ label: labelParts.join(" — "), rows: sortedRows.slice(start, r), startIndex: start });
                start = r;
            }
            prevKey = key;
        }
        return groups;
    }

    function renderTable(headers, rows) {
        if (!container) return;
        var idColIdx = headers.indexOf(idColumn);
        if (idColIdx === -1) {
            for (var i = 0; i < headers.length; i++) {
                if (norm(headers[i]) === norm(idColumn)) { idColIdx = i; break; }
            }
        }
        if (idColIdx === -1) idColIdx = 0;

        var visibleIndexes = [];
        var visibleHeaders = [];
        COLUMNAS_VISIBLES.forEach(function (colName) {
            for (var h = 0; h < headers.length; h++) {
                if (norm(headers[h]) === norm(colName)) {
                    visibleIndexes.push(h);
                    visibleHeaders.push(headers[h]);
                    break;
                }
            }
        });
        if (visibleIndexes.length === 0) {
            visibleIndexes = headers.map(function (_, i) { return i; });
            visibleHeaders = headers.slice();
        }
        var titleColIdx = -1;
        for (var t = 0; t < headers.length; t++) {
            if (norm(headers[t]) === norm("Nombre-Producto")) { titleColIdx = t; break; }
        }
        if (titleColIdx === -1) titleColIdx = visibleIndexes[0] >= 0 ? visibleIndexes[0] : 0;

        var groupByIndexes = [];
        var groups = [];
        var dataRows = rows;
        if (GROUP_BY_COLUMNS.length) {
            groupByIndexes = getGroupByIndexes(headers);
            dataRows = sortRowsByGroup(headers, rows, groupByIndexes, titleColIdx);
            groups = partitionIntoGroups(headers, dataRows, groupByIndexes);
        } else {
            dataRows = sortRowsByName(headers, rows, titleColIdx);
        }

        var html = "<div class=\"costos-cards-wrap\">";

        function buildLeyendaFromConfig(headers, rowArr, leyendaConfig, highlightClass) {
            if (!leyendaConfig || !leyendaConfig.columns.length) return "";
            var sep = (leyendaConfig.separator != null ? String(leyendaConfig.separator) : " · ");
            var resaltadoClass = (highlightClass && String(highlightClass).trim()) ? String(highlightClass).trim() : "insumos-leyenda-resaltado";
            var highlightSet = {};
            if (leyendaConfig.highlight && Array.isArray(leyendaConfig.highlight)) {
                leyendaConfig.highlight.forEach(function (c) { highlightSet[norm(c)] = true; });
            }
            var parts = [];
            for (var l = 0; l < leyendaConfig.columns.length; l++) {
                var colName = leyendaConfig.columns[l];
                var colIdx = -1;
                for (var hi = 0; hi < headers.length; hi++) {
                    if (norm(headers[hi]) === norm(colName)) { colIdx = hi; break; }
                }
                var val = (colIdx >= 0 && colIdx < rowArr.length && rowArr[colIdx] != null) ? String(rowArr[colIdx]).trim() : "";
                var safe = escapeHtml(val || "—");
                if (highlightSet[norm(colName)]) safe = "<span class=\"" + resaltadoClass + "\">" + safe + "</span>";
                parts.push(safe);
            }
            return parts.join(sep);
        }
        function buildLeyendaHtml(headers, rowArr) { return buildLeyendaFromConfig(headers, rowArr, LEYENDA_CONFIG); }
        function buildSubLeyendaHtml(headers, rowArr) { return buildLeyendaFromConfig(headers, rowArr, SUB_LEYENDA_CONFIG, "insumos-subleyenda-resaltado"); }

        function renderCard(row, rowIndex) {
            var rowArr = Array.isArray(row) ? row : [];
            var titleVal = titleColIdx >= 0 && titleColIdx < rowArr.length ? String(rowArr[titleColIdx] != null ? rowArr[titleColIdx] : "").trim() : "";
            html += "<div class=\"costos-card\" data-row-index=\"" + rowIndex + "\">";
            html += "<div class=\"costos-card-name\">" + escapeHtml(titleVal || "—") + "</div>";
            var leyendaHtml = buildLeyendaHtml(headers, rowArr);
            if (leyendaHtml) html += "<div class=\"insumos-card-leyenda\">" + leyendaHtml + "</div>";
            html += "<div class=\"costos-card-body insumos-card-meta\">";
            for (var v = 0; v < visibleIndexes.length; v++) {
                var idx = visibleIndexes[v];
                if (idx === titleColIdx) continue;
                var hdr = headers[idx] || "";
                var label = (COLUMN_ALIASES[hdr] !== undefined && COLUMN_ALIASES[hdr] !== "") ? COLUMN_ALIASES[hdr] : hdr;
                var val = idx < rowArr.length ? rowArr[idx] : "";
                var valStr = String(val != null ? val : "").trim();
                if (valStr === "") continue;
                html += "<div class=\"insumos-card-row\"><span class=\"insumos-card-label\">" + escapeHtml(label) + "</span> <span class=\"insumos-card-value\">" + escapeHtml(valStr) + "</span></div>";
            }
            html += "</div>";
            var subLeyendaHtml = buildSubLeyendaHtml(headers, rowArr);
            if (subLeyendaHtml) html += "<div class=\"insumos-card-subleyenda\">" + subLeyendaHtml + "</div>";
            html += "<div class=\"costos-card-actions\">";
            if (modoSeleccion) {
                html += "<a href=\"#\" class=\"costos-card-btn costos-card-btn-seleccionar\" data-row-index=\"" + rowIndex + "\">Seleccionar</a>";
            } else {
                html += "<a href=\"#\" class=\"costos-card-btn costos-card-btn-ver\" data-row-index=\"" + rowIndex + "\">Ver</a> ";
                html += "<a href=\"#\" class=\"costos-card-btn costos-card-btn-editar\" data-row-index=\"" + rowIndex + "\">Editar</a>";
            }
            html += "</div></div>";
        }

        if (groups.length && groups[0].rows !== undefined) {
            groups.forEach(function (group) {
                if (group.label) html += "<div class=\"costos-cat-title insumos-group-header\">" + group.label + "</div>";
                for (var i = 0; i < group.rows.length; i++) {
                    renderCard(group.rows[i], group.startIndex + i);
                }
            });
        } else {
            dataRows.forEach(function (row, idx) { renderCard(row, idx); });
        }
        html += "</div>";
        container.innerHTML = html;
        container.classList.remove("costos-datos-message");

        var countEl = document.getElementById(countId);
        if (countEl) countEl.textContent = dataRows.length + " registro(s)";

        if (modoSeleccion) {
            container.querySelectorAll(".costos-card-btn-seleccionar").forEach(function (a) {
                a.addEventListener("click", function (e) {
                    e.preventDefault();
                    var idx = parseInt(a.getAttribute("data-row-index"), 10);
                    if (isNaN(idx) || idx < 0 || idx >= dataRows.length) return;
                    var r = dataRows[idx];
                    var rowArr = Array.isArray(r) ? r : [];
                    var idVal = idColIdx >= 0 && rowArr[idColIdx] != null ? String(rowArr[idColIdx]).trim() : "";
                    try {
                        sessionStorage.setItem(storageKeySeleccion, JSON.stringify({ id: idVal, headers: headers, row: rowArr }));
                        window.location.href = returnToUrl;
                    } catch (err) { window.location.href = returnToUrl; }
                });
            });
            return;
        }
        container.querySelectorAll(".costos-card-btn-ver").forEach(function (a) {
            a.addEventListener("click", function (e) {
                e.preventDefault();
                var idx = parseInt(a.getAttribute("data-row-index"), 10);
                if (isNaN(idx) || idx < 0 || idx >= dataRows.length) return;
                var r = dataRows[idx];
                var rowArr = Array.isArray(r) ? r : [];
                try {
                    sessionStorage.setItem(storageKeyVisualizar, JSON.stringify({ id: idColIdx >= 0 ? rowArr[idColIdx] : "", headers: headers, row: rowArr }));
                    window.location.href = visualizarUrl + (rowArr[idColIdx] ? "?id=" + encodeURIComponent(rowArr[idColIdx]) : "");
                } catch (err) { window.location.href = visualizarUrl; }
            });
        });
        container.querySelectorAll(".costos-card-btn-editar").forEach(function (a) {
            a.addEventListener("click", function (e) {
                e.preventDefault();
                var idx = parseInt(a.getAttribute("data-row-index"), 10);
                if (isNaN(idx) || idx < 0 || idx >= dataRows.length) return;
                var r = dataRows[idx];
                var rowArr = Array.isArray(r) ? r : [];
                try {
                    sessionStorage.setItem(storageKeyEdit, JSON.stringify({ id: idColIdx >= 0 ? rowArr[idColIdx] : "", headers: headers, row: rowArr }));
                    window.location.href = editUrl + (rowArr[idColIdx] ? "?id=" + encodeURIComponent(rowArr[idColIdx]) : "");
                } catch (err) { window.location.href = editUrl; }
            });
        });
    }

    /** Aplica listFilter de la config: solo deja filas que cumplan todas las reglas (columna = valor). */
    function applyConfigFilter(headers, rows) {
        if (!FILTER_RULES.length) return rows;
        return rows.filter(function (row) {
            var rowArr = Array.isArray(row) ? row : [];
            return FILTER_RULES.every(function (rule) {
                var col = rule && rule.column;
                var wantVal = rule && rule.value;
                if (!col) return true;
                var idx = -1;
                for (var h = 0; h < headers.length; h++) {
                    if (norm(headers[h]) === norm(col)) { idx = h; break; }
                }
                if (idx === -1) return true;
                var cellVal = idx < rowArr.length ? String(rowArr[idx] != null ? rowArr[idx] : "").trim() : "";
                var wantStr = String(wantVal != null ? wantVal : "").trim();
                return norm(cellVal) === norm(wantStr);
            });
        });
    }

    function applyFilter(headers, rows, filterText) {
        if (!filterText || !filterText.trim()) return rows;
        var words = filterText.trim().toLowerCase().split(/\s+/).filter(Boolean);
        var searchIndexes = [];
        if (SEARCH_COLUMNS.length) {
            for (var s = 0; s < SEARCH_COLUMNS.length; s++) {
                for (var h = 0; h < headers.length; h++) {
                    if (norm(headers[h]) === norm(SEARCH_COLUMNS[s])) { searchIndexes.push(h); break; }
                }
            }
        }
        return rows.filter(function (row) {
            var rowArr = Array.isArray(row) ? row : [];
            var concat;
            if (searchIndexes.length) {
                concat = searchIndexes.map(function (idx) { return (idx < rowArr.length && rowArr[idx] != null) ? String(rowArr[idx]) : ""; }).join(" ").toLowerCase();
            } else {
                concat = rowArr.map(function (c) { return String(c != null ? c : ""); }).join(" ").toLowerCase();
            }
            return words.every(function (w) { return concat.indexOf(w) !== -1; });
        });
    }

    function showMessage(msg) {
        if (!container) return;
        container.innerHTML = "<p class=\"costos-placeholder\">" + escapeHtml(msg) + "</p>";
        container.classList.add("costos-datos-message");
    }

    function run() {
        if (!container) return;
        if (!appsScriptUrl) { showMessage("No está configurada la URL de la API (appsScriptUrl)."); return; }

        var filterInput = document.getElementById(filterInputId);
        var allHeaders = [];
        var allRows = [];

        var url = appsScriptUrl + "?action=list&sheet=" + encodeURIComponent(sheetKey) + "&limit=5000&_=" + Date.now();
        if (window.COSTOS_SPINNER) window.COSTOS_SPINNER.show("Cargando…");
        fetch(url, { cache: "no-store" })
            .then(function (res) { return res.json(); })
            .then(function (json) {
                if (!json || !json.success || !json.data) throw new Error(json && json.error ? json.error : "Error al cargar");
                var headers = (json.data.headers || []).map(function (h) { return String(h != null ? h : "").trim(); });
                var rows = json.data.rows || [];
                rows = rows.map(function (row) {
                    if (Array.isArray(row)) return row;
                    return headers.map(function (h) { return row[h] != null ? row[h] : ""; });
                });
                allHeaders = headers;
                allRows = applyConfigFilter(headers, rows);
                var filtered = applyFilter(headers, allRows, filterInput ? filterInput.value : "");
                renderTable(headers, filtered);
            })
            .catch(function (err) { showMessage("Error al cargar: " + (err.message || "Revisá la URL de la API.")); })
            .finally(function () { if (window.COSTOS_SPINNER) window.COSTOS_SPINNER.hide(); });

        if (filterInput) {
            filterInput.addEventListener("input", function () {
                if (!allHeaders.length || !allRows.length) return;
                var filtered = applyFilter(allHeaders, allRows, filterInput.value);
                renderTable(allHeaders, filtered);
            });
        }
        // allRows ya tiene aplicado applyConfigFilter; el filtro de texto se aplica sobre eso
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
    else run();
})();
