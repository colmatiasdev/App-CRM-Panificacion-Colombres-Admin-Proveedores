/**
 * Listado de Productos Elaborados. Usa la configuración de scr/Arquitectura/sheets/productos-elaborados-sheets.json
 * para nombre de hoja, clave primaria y columnas. Siempre solicita datos frescos a la API (cache-busting).
 */
(function () {
    var STORAGE_EDIT = "costosEditRecordProductosElaborados";
    var EDIT_URL = "editar-producto-elaborado.html";
    var CREATE_URL = "crear-producto-elaborado.html";

    var config = window.APP_CONFIG || {};
    var appsScriptUrl = (config.appsScriptUrl || "").trim();

    function escapeHtml(text) {
        if (text == null) return "";
        return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function norm(s) {
        return String(s != null ? s : "").trim().toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
    }

    function findColumnIndex(headers, names) {
        for (var i = 0; i < headers.length; i++) {
            var h = norm(headers[i]);
            for (var j = 0; j < names.length; j++) {
                if (h === names[j]) return i;
            }
        }
        return -1;
    }

    function getRowId(headers, row, idColumnIndex) {
        if (idColumnIndex >= 0 && row[idColumnIndex] != null) return String(row[idColumnIndex]).trim();
        return row[0] != null ? String(row[0]).trim() : "";
    }

    function getRowTitle(headers, row, nameColumnIndex) {
        if (nameColumnIndex >= 0 && row[nameColumnIndex] != null) return String(row[nameColumnIndex]).trim();
        return row[0] != null ? String(row[0]).trim() : "Sin nombre";
    }

    /**
     * Alinea los datos de la API al orden de columnas definido en la configuración.
     * headersConfig = array de { nombre } desde config.columnas
     * apiHeaders = lo que devolvió la API; apiRows = array de objetos (o arrays) con datos
     */
    function alignRowsToConfig(headersConfig, apiHeaders, apiRows) {
        var headers = headersConfig.map(function (c) { return c.nombre || c; });
        var rows = (apiRows || []).map(function (obj) {
            var rowObj = obj;
            if (Array.isArray(obj)) {
                rowObj = {};
                apiHeaders.forEach(function (h, i) { rowObj[h] = obj[i]; });
            }
            return headers.map(function (nombre) {
                var val = rowObj[nombre];
                if (val === undefined) {
                    var key = Object.keys(rowObj).find(function (k) { return norm(k) === norm(nombre); });
                    val = key != null ? rowObj[key] : "";
                }
                return val != null ? val : "";
            });
        });
        return { headers: headers, rows: rows };
    }

    function renderList(container, sheetConfig, headers, rows, filterText) {
        if (!container) return;
        var columnas = sheetConfig.columnas || [];
        var clavePrimaria = sheetConfig.clavePrimaria || ["IDProducto"];
        var pkNorms = clavePrimaria.map(function (k) { return norm(k); });
        var idColIdx = findColumnIndex(headers, pkNorms);
        if (idColIdx < 0) idColIdx = 0;
        var nameColIdx = findColumnIndex(headers, ["nombreproducto", "nombre-producto", "nombre", "producto"]);
        if (nameColIdx < 0) nameColIdx = 0;

        var filter = (filterText || "").trim().toLowerCase();
        var visible = rows;
        if (filter) {
            visible = rows.filter(function (row) {
                var concat = row.map(function (c) { return String(c != null ? c : ""); }).join(" ").toLowerCase();
                return concat.indexOf(filter) !== -1;
            });
        }

        var extraIndexes = [];
        columnas.forEach(function (col) {
            var nombre = col.nombre || "";
            if (!nombre) return;
            var nameNorm = norm(nombre);
            if (nameNorm !== norm((headers[idColIdx] || "")) && nameNorm !== norm((headers[nameColIdx] || ""))) {
                var idx = headers.indexOf(nombre);
                if (idx >= 0) extraIndexes.push(idx);
            }
        });
        if (extraIndexes.length === 0) {
            headers.forEach(function (_, c) {
                if (c !== nameColIdx && c !== idColIdx) extraIndexes.push(c);
            });
        }

        var html = '<div class="costos-cards costos-cards-productos-elaborados">';
        visible.forEach(function (row) {
            var id = getRowId(headers, row, idColIdx);
            var title = getRowTitle(headers, row, nameColIdx);
            var extra = [];
            extraIndexes.forEach(function (c) {
                var val = row[c] != null ? String(row[c]).trim() : "";
                if (val) extra.push(escapeHtml(headers[c]) + ": " + escapeHtml(val));
            });
            var extraHtml = extra.length ? "<p class=\"costos-card-extra\">" + extra.join(" · ") + "</p>" : "";
            html += "<div class=\"costos-card costos-card-producto-elaborado\">";
            html += "<div class=\"costos-card-header\"><h3 class=\"costos-card-title\">" + escapeHtml(title) + "</h3></div>";
            html += "<div class=\"costos-card-body\">" + extraHtml + "</div>";
            html += "<div class=\"costos-card-actions\">";
            html += "<a href=\"" + EDIT_URL + "\" class=\"costos-card-btn costos-card-btn-editar\" data-action=\"editar\" data-id=\"" + escapeHtml(id) + "\" data-row-index=\"" + rows.indexOf(row) + "\">Editar</a>";
            html += "</div></div>";
        });
        html += "</div>";
        container.innerHTML = html;
        container.classList.remove("costos-datos-message");

        var countEl = document.getElementById("productos-elaborados-count");
        if (countEl) countEl.textContent = visible.length + " de " + rows.length + " producto(s)";

        container.querySelectorAll(".costos-card-btn-editar").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                var idx = parseInt(btn.getAttribute("data-row-index"), 10);
                if (isNaN(idx) || idx < 0 || idx >= rows.length) return;
                try {
                    sessionStorage.setItem(STORAGE_EDIT, JSON.stringify({
                        id: getRowId(headers, rows[idx], idColIdx),
                        headers: headers,
                        row: rows[idx]
                    }));
                } catch (err) {}
                window.location.href = btn.getAttribute("href");
            });
        });
    }

    function showMessage(container, text) {
        if (!container) return;
        container.innerHTML = "<p class=\"costos-placeholder\">" + escapeHtml(text) + "</p>";
        container.classList.add("costos-datos-message");
    }

    function run() {
        var container = document.getElementById("datos-productos-elaborados");
        var filterInput = document.getElementById("filter-productos-elaborados");
        var btnNuevo = document.getElementById("btn-nuevo-producto-elaborado");

        if (!container) return;

        if (btnNuevo) {
            btnNuevo.addEventListener("click", function (e) {
                e.preventDefault();
                window.location.href = CREATE_URL;
            });
        }

        if (!appsScriptUrl) {
            showMessage(container, "No está configurada la URL de la API (appsScriptUrl en config.js).");
            return;
        }

        var loadConfig = window.PRODUCTOS_ELABORADOS_LOAD_CONFIG;
        if (!loadConfig) {
            showMessage(container, "No se pudo cargar la configuración del módulo (productos-elaborados-config.js).");
            return;
        }

        loadConfig()
            .then(function (sheetConfig) {
                var nombreHoja = sheetConfig.nombreHoja;
                var columnas = sheetConfig.columnas || [];
                var headersConfig = columnas.map(function (c) { return { nombre: c.nombre }; });
                var url = appsScriptUrl + "?action=list&sheet=" + encodeURIComponent(nombreHoja) + "&_=" + Date.now();
                return fetch(url, { cache: "no-store" })
                    .then(function (res) { return res.json(); })
                    .then(function (json) {
                        if (!json || !json.success || !json.data) {
                            throw new Error(json && json.error ? json.error : "Error al cargar");
                        }
                        var apiHeaders = (json.data.headers || []).map(function (h) { return String(h != null ? h : "").trim(); });
                        var apiRows = json.data.rows || [];
                        var aligned = alignRowsToConfig(headersConfig, apiHeaders, apiRows);
                        var headers = aligned.headers;
                        var rows = aligned.rows;
                        if (headersConfig.length > 0 && headers.length === 0) {
                            headers = apiHeaders;
                            rows = apiRows.map(function (obj) {
                                return apiHeaders.map(function (k) { return obj[k] != null ? obj[k] : ""; });
                            });
                        }
                        if (!headers.length && !rows.length) {
                            showMessage(container, "La hoja no tiene datos.");
                            return { sheetConfig: sheetConfig, headers: headers, rows: rows };
                        }
                        renderList(container, sheetConfig, headers, rows, (filterInput && filterInput.value) ? filterInput.value : "");
                        if (filterInput) {
                            filterInput.addEventListener("input", function () {
                                renderList(container, sheetConfig, headers, rows, filterInput.value);
                            });
                        }
                        return { sheetConfig: sheetConfig, headers: headers, rows: rows };
                    });
            })
            .catch(function (err) {
                showMessage(container, "Error al cargar: " + (err.message || "Revisá la URL de la API y la configuración."));
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }
})();
