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
        "Observaciones",
        "Cantidad Unidad Medida",
        "Cantidad-Unidad-Medida",
        "Tipo Unidad Medida",
        "Tipo-Unidad-Medida",
        "Equivalencia Unidad Medida",
        "Equivalencia-Unidad-Medida",
        "Equivalencia Tipo Unidad Medida",
        "Equivalencia-Tipo-Unidad-Medida",
        "NO",
        "Precio COSTO x Unidad",
        "Precio-Costo-x-Unidad",
        "Precio Equivalencia x Unidad",
        "Precio-Equivalencia-x-Unidad",
        "Fecha Actualizada Al",
        "Fecha-Actualizada-Al",
        "MARCA",
        "Marca",
        "LUGAR",
        "Lugar",
        "Habilitado",
        "HABILITADO"
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
        var displayHeadersLogic = [];
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
                displayHeadersLogic.push("presentacion");
                displaySources.push([visibleIndexes[d], visibleIndexes[d + 1]]);
                d++;
            } else {
                if (isDiasActualizacionColumn(norm(h))) {
                    displayHeaders.push("Días actualiz.");
                } else {
                    displayHeaders.push(h);
                }
                displayHeadersLogic.push(norm(h));
                displaySources.push([visibleIndexes[d]]);
            }
        }
        var displayHeadersNorm = displayHeadersLogic;
        function isDiasActualizacionColumn(nameNorm) {
            var n = (nameNorm || "").trim().toLowerCase().replace(/-/g, " ");
            return n === "dias trascurridos actualizacion";
        }
        function isProductNameColumn(nameNorm) {
            var n = (nameNorm || "").trim().toLowerCase().replace(/-/g, " ");
            return n === "producto" || n === "nombre" || n === "descripcion" || n === "insumo" || n === "nombre del producto" || n === "nombre producto";
        }
        function isPrecioActualColumn(nameNorm) {
            var n = (nameNorm || "").trim().toLowerCase().replace(/-/g, " ");
            return n === "precio" || n === "precio actual";
        }
        function isPrecioAnteriorColumn(nameNorm) {
            var n = (nameNorm || "").trim().toLowerCase().replace(/-/g, " ");
            return n === "precio anterior";
        }
        var fechaIdx = -1;
        var presentacionTipoIdx = -1;
        var idxExtraEquivTipo = -1, idxExtraPrecioCosto = -1, idxExtraPrecioEq = -1;
        for (var fi = 0; fi < headers.length; fi++) {
            var hNorm = norm(headers[fi]).replace(/-/g, " ");
            var hNormHeader = normHeader(headers[fi]);
            if (hNorm === "fecha actualizada al") {
                fechaIdx = fi;
            }
            if (hNormHeader === "presentacion-tipo") {
                presentacionTipoIdx = fi;
            }
            if (hNorm === "equivalencia tipo unidad medida") idxExtraEquivTipo = fi;
            if (hNorm === "precio costo x unidad") idxExtraPrecioCosto = fi;
            if (hNorm === "precio equivalencia x unidad") idxExtraPrecioEq = fi;
        }
        var hasDiasCol = displayHeadersLogic.some(function (n) { return isDiasActualizacionColumn(n); });
        if (fechaIdx >= 0 && !hasDiasCol) {
            displayHeaders.push("Días actualiz.");
            displayHeadersLogic.push("dias trascurridos actualizacion");
            displaySources.push([fechaIdx]);
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
                if (isDiasActualizacionColumn(nameNorm)) {
                    var dateStr = (fechaIdx >= 0 ? String(row[fechaIdx] != null ? row[fechaIdx] : "").trim() : "");
                    text = diasDesdeFechaHastaHoy(dateStr);
                    tdClass = claseDiasActualizacion(text);
                } else if (isPrecioActualColumn(nameNorm) || isPrecioAnteriorColumn(nameNorm)) {
                    text = formatoMonedaArg(raw);
                }
                if (isProductNameColumn(nameNorm)) {
                    tdClass = (tdClass ? tdClass + " " : "") + "costos-cell-producto";
                }
                return { text: text, tdClass: tdClass };
            });
        };
        var catIdx = -1;
        var idxIdMateriaPrima = -1;
        for (var i = 0; i < headers.length; i++) {
            var hTrim = String(headers[i] != null ? headers[i] : "").trim().toLowerCase().replace(/\s/g, "");
            if (hTrim === "categoria") catIdx = i;
            if (hTrim === "idmateria-prima" || hTrim === "idmateriaprima") idxIdMateriaPrima = i;
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
        var idxProducto = -1, idxPresentacion = -1, idxPrecio = -1, idxPrecioAnterior = -1, idxDias = -1;
        for (var ii = 0; ii < displayHeadersNorm.length; ii++) {
            if (isProductNameColumn(displayHeadersNorm[ii])) idxProducto = ii;
            else if (displayHeadersNorm[ii] === "presentacion") idxPresentacion = ii;
            else if (isPrecioActualColumn(displayHeadersNorm[ii])) idxPrecio = ii;
            else if (isPrecioAnteriorColumn(displayHeadersNorm[ii])) idxPrecioAnterior = ii;
            else if (isDiasActualizacionColumn(displayHeadersNorm[ii])) idxDias = ii;
        }
        function textoDiasActualizacion(diasStr) {
            if (diasStr == null || String(diasStr).trim() === "") return "";
            var n = parseInt(String(diasStr).trim(), 10);
            if (isNaN(n)) return "";
            if (n === 0) return "Actualizado hoy";
            if (n === 1) return "Actualizado hace 1 d\u00eda";
            return "Actualizado hace " + n + " d\u00edas";
        }
        var cardsHtml = "";
        var recordsForEdit = [];
        groupOrder.forEach(function (catLabel) {
            var g = groups[groupMap[catLabel]];
            cardsHtml += "<div class=\"costos-cat-title\">" + escapeHtml(g.label) + "</div>";
            g.rows.forEach(function (row) {
                var cells = getDisplayCells(row);
                var nombre = idxProducto >= 0 ? (cells[idxProducto] && cells[idxProducto].text) : "";
                var presentacion = idxPresentacion >= 0 ? (cells[idxPresentacion] && cells[idxPresentacion].text) : "";
                var precio = idxPrecio >= 0 ? (cells[idxPrecio] && cells[idxPrecio].text) : "";
                var precioAnterior = idxPrecioAnterior >= 0 ? (cells[idxPrecioAnterior] && cells[idxPrecioAnterior].text) : "";
                var diasCell = idxDias >= 0 ? (cells[idxDias] && cells[idxDias]) : null;
                var diasStr = diasCell ? diasCell.text : "";
                var diasClass = diasCell && diasCell.tdClass ? diasCell.tdClass : "";
                var regText = textoDiasActualizacion(diasStr);
                var extraParts = [];
                function extraVal(idx) {
                    if (idx < 0) return "";
                    var v = row[idx];
                    return v != null ? String(v).trim() : "";
                }
                var labels = ["Equivalencia Tipo Unidad Medida", "Precio COSTO x Unidad", "Precio Equivalencia x Unidad", "Última Fecha Actualizada"];
                var extraIdxs = [idxExtraEquivTipo, idxExtraPrecioCosto, idxExtraPrecioEq, fechaIdx];
                var formatExtra = [function (s) { return s; }, formatoMonedaArg, formatoMonedaArg, function (s) { return s; }];
                for (var ex = 0; ex < extraIdxs.length; ex++) {
                    var val = extraVal(extraIdxs[ex]);
                    if (ex === 1 || ex === 2) val = formatExtra[ex](val);
                    extraParts.push("<div class=\"costos-extra-item\"><span class=\"costos-extra-label\">" + escapeHtml(labels[ex]) + "</span> <b>" + escapeHtml(val) + "</b></div>");
                }
                var extraHtml = "<div class=\"costos-extra-info\">" + extraParts.join("") + "</div>";
                var idRegistro = idxIdMateriaPrima >= 0 && row[idxIdMateriaPrima] != null ? String(row[idxIdMateriaPrima]).trim() : "";
                recordsForEdit.push({
                    id: idRegistro,
                    headers: headers.slice(),
                    row: row.slice()
                });
                var priceBlock = (precio ? "<div class=\"costos-card-price\">" + escapeHtml(precio) + "</div>" : "") +
                    "<a href=\"#\" class=\"costos-card-edit-btn\" title=\"Editar precio / registro\" aria-label=\"Editar registro\"><i class=\"fa-solid fa-pen\" aria-hidden=\"true\"></i></a>";
                cardsHtml += "<div class=\"costos-card\">" +
                    "<div class=\"costos-card-main\">" +
                    "<div class=\"costos-card-left-wrap\">" +
                    "<div class=\"costos-card-left\">" +
                    "<div class=\"costos-card-info\">" +
                    "<h2 class=\"costos-card-name\">" + escapeHtml(nombre) + "</h2>" +
                    "</div>" +
                    "</div>" +
                    "<div class=\"costos-card-presentacion-row\">" +
                    (regText ? "<span class=\"costos-card-days " + escapeHtml(diasClass) + "\">" + escapeHtml(regText) + "</span>" : "") +
                    (precioAnterior ? "<span class=\"costos-card-old-price\">Ant: " + escapeHtml(precioAnterior) + "</span>" : "") +
                    "</div>" +
                    "</div>" +
                    "<div class=\"costos-card-price-side\">" +
                    "<div class=\"costos-card-price-row\">" +
                    "<div class=\"costos-card-price-wrap\">" + priceBlock + "</div>" +
                    (presentacion ? "<div class=\"costos-card-presentacion\">" + escapeHtml(presentacion) + "</div>" : "") +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "<button type=\"button\" class=\"costos-expand-btn\" aria-expanded=\"false\"><i class=\"fa-solid fa-plus costos-expand-icon\"></i> <span class=\"costos-expand-text\">INFORMACION</span></button>" +
                    extraHtml +
                    "</div>";
            });
        });
        var leyenda = buildDiasLeyenda(config);
        container.innerHTML = "<div class=\"costos-cards-wrap\">" + cardsHtml + "</div>" + leyenda;
        container.classList.remove("costos-datos-message");
        container.querySelectorAll(".costos-card-edit-btn").forEach(function (btn, idx) {
            var rec = recordsForEdit[idx];
            if (rec) {
                btn.addEventListener("click", function (e) {
                    e.preventDefault();
                    try {
                        sessionStorage.setItem("costosEditRecord", JSON.stringify({
                            id: rec.id,
                            headers: rec.headers,
                            row: rec.row
                        }));
                        window.location.href = "editar-materia-prima.html" + (rec.id ? "?id=" + encodeURIComponent(rec.id) : "");
                    } catch (err) {
                        window.location.href = "editar-materia-prima.html" + (rec.id ? "?id=" + encodeURIComponent(rec.id) : "");
                    }
                });
            }
        });
        container.querySelectorAll(".costos-expand-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var extra = btn.nextElementSibling;
                var isOpen = btn.getAttribute("aria-expanded") === "true";
                if (isOpen) {
                    if (extra && extra.classList.contains("costos-extra-info")) extra.classList.remove("costos-extra-show");
                    btn.setAttribute("aria-expanded", "false");
                    btn.querySelector(".costos-expand-icon").className = "fa-solid fa-plus costos-expand-icon";
                    if (btn.querySelector(".costos-expand-text")) btn.querySelector(".costos-expand-text").textContent = "INFORMACION";
                } else {
                    if (extra && extra.classList.contains("costos-extra-info")) extra.classList.add("costos-extra-show");
                    btn.setAttribute("aria-expanded", "true");
                    btn.querySelector(".costos-expand-icon").className = "fa-solid fa-minus costos-expand-icon";
                    if (btn.querySelector(".costos-expand-text")) btn.querySelector(".costos-expand-text").textContent = "OCULTAR";
                }
            });
        });
        var filterInput = document.getElementById("filter-materia-prima");
        if (filterInput) {
            function applyFilterMateria() {
                var wrap = container.querySelector(".costos-cards-wrap");
                if (!wrap) return;
                var query = (filterInput.value || "").trim();
                var words = query.toLowerCase().split(/\s+/).filter(Boolean);
                var totalCards = wrap.querySelectorAll(".costos-card").length;
                var children = wrap.children;
                var i = 0;
                while (i < children.length) {
                    var el = children[i];
                    if (el.classList.contains("costos-cat-title")) {
                        var categoryText = (el.textContent || "").trim().toLowerCase();
                        var group = [el];
                        i++;
                        while (i < children.length && !children[i].classList.contains("costos-cat-title")) {
                            group.push(children[i]);
                            i++;
                        }
                        group.forEach(function (node) {
                            if (node.classList.contains("costos-cat-title")) {
                                return;
                            }
                            if (node.classList.contains("costos-card")) {
                                var nameEl = node.querySelector(".costos-card-name");
                                var nameText = nameEl ? (nameEl.textContent || "").trim().toLowerCase() : "";
                                var cardMatches = words.length === 0 || words.every(function (word) {
                                    return categoryText.indexOf(word) !== -1 || nameText.indexOf(word) !== -1;
                                });
                                node.style.display = cardMatches ? "" : "none";
                            }
                        });
                        var anyCardVisible = group.some(function (node) {
                            return node.classList.contains("costos-card") && node.style.display !== "none";
                        });
                        el.style.display = (words.length === 0 || anyCardVisible) ? "" : "none";
                    } else {
                        i++;
                    }
                }
                var visibleCards = [].slice.call(wrap.querySelectorAll(".costos-card")).filter(function (c) { return c.style.display !== "none"; }).length;
                var countEl = document.getElementById("materia-prima-count");
                if (countEl) {
                    if (totalCards === 0) {
                        countEl.textContent = "";
                    } else if (words.length === 0) {
                        countEl.textContent = totalCards === 1 ? "1 producto" : totalCards + " productos";
                    } else {
                        countEl.textContent = visibleCards === 1
                            ? "Mostrando 1 de " + totalCards + " productos"
                            : "Mostrando " + visibleCards + " de " + totalCards + " productos";
                    }
                }
            }
            filterInput.addEventListener("input", applyFilterMateria);
            filterInput.addEventListener("search", applyFilterMateria);
            applyFilterMateria();
        }
    }

    /** Leyenda de referencia para Días actualiz. (umbrales desde config.diasActualizacion). */
    function buildDiasLeyenda(cfg) {
        var d = (cfg && cfg.diasActualizacion) ? cfg.diasActualizacion : {};
        var limN = typeof d.limiteNormal === "number" ? d.limiteNormal : 30;
        var limA = typeof d.limiteAmarillo === "number" ? d.limiteAmarillo : 60;
        var limR = typeof d.limiteRojo === "number" ? d.limiteRojo : 100;
        var clases = d.clases || {};
        var cA = clases.amarillo || "costos-dias-amarillo";
        var cR = clases.rojo || "costos-dias-rojo";
        var cU = clases.urgente || "costos-dias-urgente";
        return "<div class=\"costos-dias-leyenda\">" +
            "<span class=\"costos-dias-leyenda-titulo\">Referencia Días actualiz.</span> " +
            "<span class=\"costos-dias-leyenda-item\">menos de " + limN + " Normal</span> " +
            "<span class=\"costos-dias-leyenda-item " + escapeHtml(cA) + "\">" + (limN + 1) + "–" + limA + " Atención</span> " +
            "<span class=\"costos-dias-leyenda-item " + escapeHtml(cR) + "\">" + (limA + 1) + "–" + limR + " Revisar</span> " +
            "<span class=\"costos-dias-leyenda-item " + escapeHtml(cU) + "\">más de " + limR + " Urgente</span>" +
            "</div>";
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
