/**
 * Carga datos desde Apps Script (action=list) o desde URL CSV pública
 * y los muestra en #datos-packing o #datos-materia-prima.
 * Si config.appsScriptUrl está definido, se usa la API para leer (datos actualizados del sheet).
 */
(function () {
    const config = window.APP_CONFIG || {};
    const appsScriptUrl = (config.appsScriptUrl || "").trim();
    const urlPacking = (config.googleSheetPackingUrl || "").trim();
    const urlMateria = (config.googleSheetMateriaPrimaUrl || "").trim();
    const containerPacking = document.getElementById("datos-packing");
    const containerMateria = document.getElementById("datos-materia-prima");

    /** Columnas a ocultar en la tabla de Materia prima (Categoria = fila de agrupación; id interno no se muestra). */
    var MATERIA_PRIMA_COLUMNAS_OCULTAS = [
        "Categoria",
        "idmateria-prima",
        "id materia prima",
        "Presentacion-Tipo",
        "OBSERVACIONES",
        "Cantidad Unidad Medida",
        "Tipo Unidad Medida",
        "Equivalencia Unidad Medida",
        "Equivalencia Tipo Unidad Medida",
        "NO",
        "Precio COSTO x Unidad",
        "Precio Equivalencia x Unidad",
        "Fecha Actualizada Al",
        "MARCA",
        "LUGAR"
    ].map(function (s) { return s.trim().toLowerCase(); });

    function showMessage(container, html) {
        if (!container) return;
        container.innerHTML = html;
        container.classList.add("costos-datos-message");
    }

    function showTable(container, headers, rows) {
        if (!container) return;
        var headerList = Array.isArray(headers) ? headers : [];
        var rowList = Array.isArray(rows) ? rows : [];
        var html = '<table class="costos-table"><thead><tr>';
        headerList.forEach(function (h) {
            html += "<th>" + escapeHtml(String(h != null ? h : "").trim()) + "</th>";
        });
        html += "</tr></thead><tbody>";
        rowList.forEach(function (row) {
            html += "<tr>";
            var cells = Array.isArray(row) ? row : (row && typeof row === "object" ? headerList.map(function (k) { return row[k]; }) : []);
            for (var c = 0; c < headerList.length; c++) {
                var label = escapeHtml(String(headerList[c] != null ? headerList[c] : "").trim());
                html += "<td data-label=\"" + label + "\">" + escapeHtml(String(cells[c] != null ? cells[c] : "")) + "</td>";
            }
            html += "</tr>";
        });
        html += "</tbody></table>";
        container.innerHTML = "<div class=\"costos-table-wrap\">" + html + "</div>";
        container.classList.remove("costos-datos-message");
    }

    function escapeHtml(text) {
        if (text == null) return "";
        var s = String(text);
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    /** Devuelve índices de headers que no están en la lista de ocultas (nombre normalizado: trim + toLowerCase). */
    function filterVisibleColumns(headers, rows, hiddenNames) {
        if (!hiddenNames || hiddenNames.length === 0) return { headers: headers, rows: rows };
        var visibleIndexes = [];
        var visibleHeaders = [];
        headers.forEach(function (h, i) {
            var key = String(h != null ? h : "").trim().toLowerCase();
            if (hiddenNames.indexOf(key) === -1) {
                visibleIndexes.push(i);
                visibleHeaders.push(h);
            }
        });
        var visibleRows = rows.map(function (row) {
            return visibleIndexes.map(function (idx) { return row[idx]; });
        });
        return { headers: visibleHeaders, rows: visibleRows, visibleIndexes: visibleIndexes };
    }

    function applyMateriaOrPackingTable(container, data, isMateria) {
        if (isMateria) {
            showTableMateriaPrimaConCategorias(container, data.headers, data.rows);
        } else {
            showTable(container, data.headers, data.rows);
        }
    }

    /** Tabla de Materia prima: sin columna Categoria; las filas se agrupan por categoría con una fila de ancho completo por grupo. */
    function showTableMateriaPrimaConCategorias(container, headers, rows) {
        if (!container) return;
        var hidden = MATERIA_PRIMA_COLUMNAS_OCULTAS.slice();
        var filtered = filterVisibleColumns(headers, rows, hidden);
        var visibleHeaders = filtered.headers;
        var visibleIndexes = filtered.visibleIndexes || [];
        if (visibleIndexes.length === 0) {
            visibleIndexes = filtered.headers.map(function (_, i) { return i; });
        }
        var displayHeaders = [];
        var displaySources = [];
        var norm = function (s) { return String(s != null ? s : "").trim().toLowerCase(); };
        function normHeader(s) {
            return norm(s).replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e").replace(/[íìïî]/g, "i").replace(/[óòöô]/g, "o").replace(/[úùüû]/g, "u");
        }
        for (var d = 0; d < visibleHeaders.length; d++) {
            var h = visibleHeaders[d];
            var next = visibleHeaders[d + 1];
            /* Columna PRESENTACION = concatenación de: 1) Presentacion-Cantidad-Medida, 2) Presentacion-Unidad, 3) Presentacion-Tipo (oculta) → "1 KG [Paquete]" */
            if (normHeader(h) === "presentacion-cantidad-medida" && normHeader(next) === "presentacion-unidad") {
                displayHeaders.push("Presentacion");
                displaySources.push([visibleIndexes[d], visibleIndexes[d + 1]]);
                d++;
            } else {
                displayHeaders.push(h);
                displaySources.push([visibleIndexes[d]]);
            }
        }
        var displayHeadersNorm = displayHeaders.map(function (h) { return norm(h); });
        function isProductNameColumn(nameNorm) {
            var n = (nameNorm || "").trim();
            return n === "producto" || n === "nombre" || n === "descripcion" || n === "insumo" || n === "nombre del producto" || n === "nombre producto";
        }
        var fechaIdx = -1;
        var presentacionTipoIdx = -1;
        for (var fi = 0; fi < headers.length; fi++) {
            if (norm(headers[fi]) === "fecha actualizada al") {
                fechaIdx = fi;
            }
            if (normHeader(headers[fi]) === "presentacion-tipo") {
                presentacionTipoIdx = fi;
            }
        }
        /** Formato moneda Argentina: $ 1.456,59 (espacio después de $, punto miles, coma decimal). */
        function formatoMonedaArg(val) {
            if (val == null || String(val).trim() === "") return "";
            var s = String(val).trim().replace(",", ".");
            var n = parseFloat(s);
            if (isNaN(n)) return String(val);
            var parts = n.toFixed(2).split(".");
            var intPart = parts[0];
            var decPart = parts[1];
            var withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return "$ " + withDots + "," + decPart;
        }
        function diasDesdeFechaHastaHoy(dateStr) {
            if (dateStr == null || String(dateStr).trim() === "") return "";
            var s = String(dateStr).trim();
            var d = null;
            if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
                d = new Date(s.substring(0, 10));
            } else if (/^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(s)) {
                var parts = s.split("/");
                var day = parseInt(parts[0], 10);
                var month = parseInt(parts[1], 10) - 1;
                var year = parseInt(parts[2], 10);
                if (year < 100) year += year < 50 ? 2000 : 1900;
                d = new Date(year, month, day);
            } else {
                d = new Date(s);
            }
            if (isNaN(d.getTime())) return "";
            var hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            d.setHours(0, 0, 0, 0);
            var diff = Math.floor((hoy.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
            return String(diff);
        }
        /** Clase CSS según días; umbrales y nombres de clase desde config.diasActualizacion. */
        function claseDiasActualizacion(diasNum) {
            if (diasNum === "" || isNaN(diasNum)) return "";
            var n = parseInt(diasNum, 10);
            var cfg = (config.diasActualizacion || {});
            var limN = typeof cfg.limiteNormal === "number" ? cfg.limiteNormal : 30;
            var limA = typeof cfg.limiteAmarillo === "number" ? cfg.limiteAmarillo : 60;
            var limR = typeof cfg.limiteRojo === "number" ? cfg.limiteRojo : 100;
            var clases = cfg.clases || {};
            var cA = clases.amarillo || "costos-dias-amarillo";
            var cR = clases.rojo || "costos-dias-rojo";
            var cU = clases.urgente || "costos-dias-urgente";
            if (n <= limN) return "";
            if (n <= limA) return cA;
            if (n <= limR) return cR;
            return cU;
        }
        var getDisplayCells = function (row) {
            return displayHeaders.map(function (displayName, i) {
                var indices = displaySources[i];
                var parts = indices.map(function (idx) { return String(row[idx] != null ? row[idx] : "").trim(); });
                var nameNorm = displayHeadersNorm[i];
                var raw;
                if (nameNorm === "presentacion") {
                    var tipoVal = (presentacionTipoIdx >= 0 ? String(row[presentacionTipoIdx] != null ? row[presentacionTipoIdx] : "").trim() : "");
                    raw = (parts[0] + " " + parts[1] + (tipoVal ? " [" + tipoVal + "]" : "")).trim();
                } else {
                    raw = parts.join(" ").trim();
                }
                var text = raw;
                var tdClass = "";
                if (nameNorm === "dias trascurridos actualizacion") {
                    var dateStr = raw || (fechaIdx >= 0 ? String(row[fechaIdx] != null ? row[fechaIdx] : "").trim() : "");
                    text = diasDesdeFechaHastaHoy(dateStr);
                    tdClass = claseDiasActualizacion(text);
                } else if (nameNorm === "precio") {
                    text = formatoMonedaArg(raw);
                }
                if (isProductNameColumn(nameNorm)) {
                    tdClass = (tdClass ? tdClass + " " : "") + "costos-cell-producto";
                }
                return { text: text, tdClass: tdClass };
            });
        };
        var catIdx = -1;
        for (var i = 0; i < headers.length; i++) {
            if (String(headers[i] != null ? headers[i] : "").trim().toLowerCase() === "categoria") {
                catIdx = i;
                break;
            }
        }
        var groups = [];
        var groupMap = {};
        var groupOrder = [];
        rows.forEach(function (row) {
            var catVal = catIdx >= 0 && row[catIdx] != null ? String(row[catIdx]).trim() : "";
            if (!catVal) catVal = "Sin categoría";
            if (groupMap[catVal] === undefined) {
                groupMap[catVal] = groups.length;
                groupOrder.push(catVal);
                groups.push({ label: catVal, rows: [] });
            }
            groups[groupMap[catVal]].rows.push(row);
        });
        groupOrder.sort(function (a, b) {
            if (a === "Sin categoría") return 1;
            if (b === "Sin categoría") return -1;
            return a.localeCompare(b);
        });
        var html = '<table class="costos-table"><thead><tr>';
        displayHeaders.forEach(function (h, i) {
            var thClass = isProductNameColumn(displayHeadersNorm[i]) ? ' class="costos-cell-producto"' : "";
            html += "<th" + thClass + ">" + escapeHtml(String(h != null ? h : "").trim()) + "</th>";
        });
        html += "</tr></thead><tbody>";
        groupOrder.forEach(function (catLabel) {
            var g = groups[groupMap[catLabel]];
            html += '<tr class="costos-table-categoria"><td colspan="' + displayHeaders.length + '" data-label="Categoría">' + escapeHtml(g.label) + "</td></tr>";
            g.rows.forEach(function (row) {
                html += "<tr>";
                getDisplayCells(row).forEach(function (cell, colIndex) {
                    var headerLabel = escapeHtml(String(displayHeaders[colIndex] != null ? displayHeaders[colIndex] : "").trim());
                    var c = cell.tdClass ? ' class="' + escapeHtml(cell.tdClass) + '"' : "";
                    html += "<td" + c + " data-label=\"" + headerLabel + "\">" + escapeHtml(cell.text) + "</td>";
                });
                html += "</tr>";
            });
        });
        html += "</tbody></table>";
        container.innerHTML = "<div class=\"costos-table-wrap\">" + html + "</div>";
        container.classList.remove("costos-datos-message");
    }

    /** Normaliza filas para que cada una tenga tantas celdas como headers (rellena con "" si falta). */
    function normalizeRows(headers, rows) {
        var len = headers.length;
        return rows.map(function (row) {
            var arr = Array.isArray(row) ? row.slice(0, len) : [];
            while (arr.length < len) arr.push("");
            return arr;
        });
    }

    function parseCsv(text) {
        text = String(text || "").replace(/^\uFEFF/, "").trim();
        var lines = text.split(/\r?\n/);
        if (lines.length === 0) return { headers: [], rows: [] };
        var headers = parseCsvLine(lines[0]).map(function (h) { return String(h || "").trim(); });
        var rows = [];
        for (var i = 1; i < lines.length; i++) {
            var row = parseCsvLine(lines[i]);
            if (row.some(function (c) { return String(c).trim() !== ""; })) {
                rows.push(row);
            }
        }
        rows = normalizeRows(headers, rows);
        return { headers: headers, rows: rows };
    }

    function parseCsvLine(line) {
        var result = [];
        var current = "";
        var inQuotes = false;
        for (var i = 0; i < line.length; i++) {
            var c = line[i];
            if (c === '"') {
                inQuotes = !inQuotes;
            } else if (inQuotes) {
                current += c;
            } else if (c === ",") {
                result.push(current.trim());
                current = "";
            } else {
                current += c;
            }
        }
        result.push(current.trim());
        return result;
    }

    /** Genera un valor alfanumérico único para idmateria-prima. Formato: COSTO-MP- + 10 caracteres alfanuméricos */
    var ALFANUM = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    function generarIdMateriaPrima(seed) {
        var base = (Date.now().toString(36) + (seed != null ? Number(seed).toString(36) : "")).slice(-6);
        var rnd = "";
        for (var i = 0; i < 4; i++) {
            rnd += ALFANUM[Math.floor(Math.random() * ALFANUM.length)];
        }
        return "COSTO-MP-" + base + rnd;
    }

    /** Completa idmateria-prima vacíos en las filas de materia prima. Primera columna = idmateria-prima. */
    function completarIdMateriaPrima(headers, rows) {
        var idx = -1;
        for (var i = 0; i < headers.length; i++) {
            if (String(headers[i]).trim().toLowerCase().replace(/\s/g, "") === "idmateria-prima") {
                idx = i;
                break;
            }
        }
        if (idx < 0) return;
        rows.forEach(function (row, i) {
            if (row[idx] == null || String(row[idx]).trim() === "") {
                row[idx] = generarIdMateriaPrima(i);
            }
        });
    }

    /** Carga desde Apps Script (action=list). Devuelve { headers, rows } con rows como array de arrays. */
    function loadFromApi(sheetKey, container) {
        var url = appsScriptUrl + "?action=list&sheet=" + sheetKey;
        return fetch(url, { cache: "no-store" })
            .then(function (res) { return res.json(); })
            .then(function (json) {
                if (!json || !json.success || !json.data) {
                    throw new Error(json && json.error ? json.error : "Error al cargar");
                }
                var headers = (json.data.headers || []).map(function (h) { return String(h != null ? h : "").trim(); });
                var list = json.data.rows || [];
                var rows = list.map(function (obj) {
                    return headers.map(function (k) { return obj[k] != null ? obj[k] : ""; });
                });
                return { headers: headers, rows: rows };
            });
    }

    function run(container) {
        if (!container) return;

        var isMateria = container === containerMateria;
        var sheetKey = isMateria ? "materiaPrima" : "packing";
        var csvUrl = isMateria ? urlMateria : urlPacking;

        if (appsScriptUrl) {
            loadFromApi(sheetKey, container)
                .then(function (data) {
                    if (!data.headers.length && !data.rows.length) {
                        showMessage(container, "<p class=\"costos-placeholder\">La hoja no tiene datos.</p>");
                        return;
                    }
                    applyMateriaOrPackingTable(container, data, isMateria);
                })
                .catch(function () {
                    if (csvUrl) {
                        loadFromCsv(csvUrl, container, isMateria);
                    } else {
                        showMessage(container, "<p class=\"costos-placeholder\">No se pudieron cargar los datos. Revisá appsScriptUrl en config.js.</p>");
                    }
                });
            return;
        }

        if (!csvUrl) {
            showMessage(
                container,
                '<p class="costos-placeholder">Configurá <strong>appsScriptUrl</strong> o <strong>googleSheetPackingUrl</strong> / <strong>googleSheetMateriaPrimaUrl</strong> en <code>config.js</code>.</p><p class="costos-placeholder">Ver <a href="../../docs/CONFIGURAR_GOOGLE_SHEETS.md" target="_blank" rel="noopener">docs/CONFIGURAR_GOOGLE_SHEETS.md</a>.</p>'
            );
            return;
        }
        loadFromCsv(csvUrl, container, isMateria);
    }

    function loadFromCsv(sheetUrl, container, isMateria) {
        fetch(sheetUrl, { cache: "no-store" })
            .then(function (res) { return res.text(); })
            .then(function (text) {
                var data = parseCsv(text);
                if (data.headers.length === 0 && data.rows.length === 0) {
                    showMessage(container, "<p class=\"costos-placeholder\">La hoja no tiene datos o la URL no es correcta.</p>");
                    return;
                }
                if (isMateria) {
                    completarIdMateriaPrima(data.headers, data.rows);
                }
                applyMateriaOrPackingTable(container, data, isMateria);
            })
            .catch(function () {
                showMessage(
                    container,
                    '<p class="costos-placeholder">No se pudieron cargar los datos. Revisá la URL en config.js.</p>'
                );
            });
    }

    run(containerPacking);
    run(containerMateria);
})();
