/**
 * Listado de Productos Elaborados. Usa la configuración de listar-productos-elaborados-sheets.config.js
 * (cargado por productos-elaborados.html) para nombre de hoja, clave primaria, columnas y agrupación.
 */
(function () {
    var STORAGE_EDIT = "costosEditRecordProductosElaborados";
    var ACCIONES = window.PRODUCTOS_ELABORADOS_ACCIONES || {};
    var LISTAR_URL = (ACCIONES.listar && ACCIONES.listar.url) ? ACCIONES.listar.url : "productos-elaborados.html";
    var CREAR_URL = (ACCIONES.crear && ACCIONES.crear.url) ? ACCIONES.crear.url : "crear-producto-elaborado.html";
    var EDITAR_URL = (ACCIONES.editar && ACCIONES.editar.url) ? ACCIONES.editar.url : "editar-producto-elaborado.html";
    var VER_URL = (ACCIONES.ver && ACCIONES.ver.url) ? ACCIONES.ver.url : "ver-producto-elaborado.html";

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

    function findColumnIndices(headers, columnNames) {
        var indices = [];
        for (var c = 0; c < columnNames.length; c++) {
            var idx = findColumnIndex(headers, [norm(columnNames[c])]);
            if (idx >= 0) indices.push(idx);
        }
        return indices;
    }

    /** Agrupa filas por valores de las columnas en colIndices. Devuelve { "key": [rows], ... } con key = "val1|val2" (vacío = "Sin valor"). */
    function groupRowsBy(rows, colIndices) {
        var groups = {};
        for (var r = 0; r < rows.length; r++) {
            var row = rows[r];
            var parts = [];
            for (var i = 0; i < colIndices.length; i++) {
                var v = row[colIndices[i]];
                parts.push(v != null && String(v).trim() !== "" ? String(v).trim() : "—");
            }
            var key = parts.join(" | ");
            if (!groups[key]) groups[key] = [];
            groups[key].push(row);
        }
        return groups;
    }

    function etiquetaModoAgrupacion(columnas) {
        if (!columnas || columnas.length === 0) return "Sin agrupar";
        if (columnas.length === 1) return "Por " + columnas[0];
        return "Por " + columnas.slice(0, -1).join(", ") + " y " + columnas[columnas.length - 1];
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

    /** Ordena las filas por la columna de orden (autogeneradoOrden). Si no hay columna o está vacía, deja el orden intacto. */
    function sortRowsByOrden(rows, headers, columnaOrdenLista) {
        if (!columnaOrdenLista || !rows.length) return rows;
        var ordenIdx = findColumnIndex(headers, [norm(columnaOrdenLista)]);
        if (ordenIdx < 0) return rows;
        var sorted = rows.slice();
        sorted.sort(function (a, b) {
            var va = a[ordenIdx];
            var vb = b[ordenIdx];
            var na = typeof va === "number" && !isNaN(va) ? va : parseFloat(String(va || "0"), 10);
            var nb = typeof vb === "number" && !isNaN(vb) ? vb : parseFloat(String(vb || "0"), 10);
            if (isNaN(na)) na = 0;
            if (isNaN(nb)) nb = 0;
            return na - nb;
        });
        return sorted;
    }

    function renderList(container, sheetConfig, headers, rows, filterText, modoAgrupacionColumnas) {
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
            if (col.visible !== true) return;
            var nameNorm = norm(nombre);
            if (nameNorm !== norm((headers[idColIdx] || "")) && nameNorm !== norm((headers[nameColIdx] || ""))) {
                var idx = headers.indexOf(nombre);
                if (idx >= 0) extraIndexes.push(idx);
            }
        });

        var colIndicesAgrupar = (modoAgrupacionColumnas && modoAgrupacionColumnas.length > 0)
            ? findColumnIndices(headers, modoAgrupacionColumnas)
            : [];
        var grouped = colIndicesAgrupar.length > 0 ? groupRowsBy(visible, colIndicesAgrupar) : null;
        var groupKeys = grouped ? Object.keys(grouped).sort() : null;

        var html = '<div class="costos-cards costos-cards-productos-elaborados">';
        if (grouped && groupKeys && groupKeys.length > 0) {
            groupKeys.forEach(function (key) {
                var groupRows = grouped[key];
                html += '<div class="costos-listado-grupo">';
                html += '<h2 class="costos-grupo-titulo">' + escapeHtml(key) + ' <span class="costos-grupo-count">(' + groupRows.length + ')</span></h2>';
                html += '<div class="costos-grupo-cards">';
                groupRows.forEach(function (row) {
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
                    html += "<a href=\"" + VER_URL + "\" class=\"costos-card-btn costos-card-btn-ver\" data-action=\"ver\" data-id=\"" + escapeHtml(id) + "\" data-row-index=\"" + rows.indexOf(row) + "\"><i class=\"fa-solid fa-eye\" aria-hidden=\"true\"></i> Ver</a>";
                    html += "<a href=\"" + EDITAR_URL + "\" class=\"costos-card-btn costos-card-btn-editar\" data-action=\"editar\" data-id=\"" + escapeHtml(id) + "\" data-row-index=\"" + rows.indexOf(row) + "\"><i class=\"fa-solid fa-pen\" aria-hidden=\"true\"></i> Editar</a>";
                    html += "</div></div>";
                });
                html += "</div></div>";
            });
        } else {
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
                html += "<a href=\"" + VER_URL + "\" class=\"costos-card-btn costos-card-btn-ver\" data-action=\"ver\" data-id=\"" + escapeHtml(id) + "\" data-row-index=\"" + rows.indexOf(row) + "\"><i class=\"fa-solid fa-eye\" aria-hidden=\"true\"></i> Ver</a>";
                html += "<a href=\"" + EDITAR_URL + "\" class=\"costos-card-btn costos-card-btn-editar\" data-action=\"editar\" data-id=\"" + escapeHtml(id) + "\" data-row-index=\"" + rows.indexOf(row) + "\"><i class=\"fa-solid fa-pen\" aria-hidden=\"true\"></i> Editar</a>";
                html += "</div></div>";
            });
        }
        html += "</div>";
        container.innerHTML = html;
        container.classList.remove("costos-datos-message");

        var countEl = document.getElementById("productos-elaborados-count");
        if (countEl) countEl.textContent = visible.length + " de " + rows.length + " producto(s)";

        function goToCardAction(btn) {
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
        }
        container.querySelectorAll(".costos-card-btn-editar, .costos-card-btn-ver").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                goToCardAction(btn);
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
                window.location.href = CREAR_URL;
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
                var modosAgrupacion = sheetConfig.modosAgrupacion || [];
                var columnasAgrupacion = sheetConfig.columnasAgrupacion || [];
                if (modosAgrupacion.length === 0 && columnasAgrupacion.length > 0) {
                    modosAgrupacion = [[], columnasAgrupacion];
                }
                if (modosAgrupacion.length === 0) {
                    modosAgrupacion = [[]];
                }
                var defaultModoIndex = 0;
                for (var m = 0; m < modosAgrupacion.length; m++) {
                    var modo = modosAgrupacion[m];
                    if (Array.isArray(modo) && modo.length === columnasAgrupacion.length && modo.length > 0) {
                        var igual = modo.every(function (col, i) { return col === columnasAgrupacion[i]; });
                        if (igual) { defaultModoIndex = m; break; }
                    }
                }
                if (columnasAgrupacion.length > 0 && defaultModoIndex === 0 && modosAgrupacion[0] && modosAgrupacion[0].length === 0) {
                    for (var n = 1; n < modosAgrupacion.length; n++) {
                        var mo = modosAgrupacion[n];
                        if (Array.isArray(mo) && mo.length === columnasAgrupacion.length && mo.every(function (col, i) { return col === columnasAgrupacion[i]; })) {
                            defaultModoIndex = n;
                            break;
                        }
                    }
                }

                var agruparWrap = document.getElementById("productos-elaborados-agrupar-wrap");
                var agruparSelect = document.getElementById("agrupar-productos-elaborados");
                if (agruparSelect && modosAgrupacion.length > 1) {
                    agruparWrap.style.display = "";
                    agruparSelect.innerHTML = "";
                    modosAgrupacion.forEach(function (modo, idx) {
                        var opt = document.createElement("option");
                        opt.value = idx;
                        opt.textContent = etiquetaModoAgrupacion(Array.isArray(modo) ? modo : []);
                        if (idx === defaultModoIndex) opt.selected = true;
                        agruparSelect.appendChild(opt);
                    });
                }

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
                        if (sheetConfig.columnaOrdenLista) {
                            rows = sortRowsByOrden(rows, headers, sheetConfig.columnaOrdenLista);
                        }
                        if (!headers.length && !rows.length) {
                            showMessage(container, "La hoja no tiene datos.");
                            return { sheetConfig: sheetConfig, headers: headers, rows: rows };
                        }

                        function getModoActual() {
                            var sel = document.getElementById("agrupar-productos-elaborados");
                            var idx = sel ? parseInt(sel.value, 10) : defaultModoIndex;
                            if (isNaN(idx) || idx < 0 || idx >= modosAgrupacion.length) idx = defaultModoIndex;
                            return modosAgrupacion[idx] || [];
                        }

                        function redraw() {
                            renderList(container, sheetConfig, headers, rows, (filterInput && filterInput.value) ? filterInput.value : "", getModoActual());
                        }

                        redraw();
                        if (filterInput) {
                            filterInput.addEventListener("input", redraw);
                        }
                        if (agruparSelect) {
                            agruparSelect.addEventListener("change", redraw);
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
