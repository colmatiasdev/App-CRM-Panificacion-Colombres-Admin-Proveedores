/**
 * Carga datos desde Apps Script (action=list) o desde URL CSV pública
 * y los muestra en #datos-packing o #datos-materia-prima.
 * Si config.appsScriptUrl está definido, se usa la API para leer (datos actualizados del sheet).
 */
(function () {
    const config = window.APP_CONFIG || {};
    const appsScriptUrl = (config.appsScriptUrl || "").trim();
    var gs = config.googleSheet;
    var urlPacking = (config.googleSheetPackingUrl || "").trim();
    var urlMateria = (config.googleSheetMateriaPrimaUrl || "").trim();
    if (!urlPacking && gs && gs.baseUrl && gs.gids && gs.gids.packing != null) {
        urlPacking = gs.baseUrl + "?gid=" + gs.gids.packing + "&single=true&output=csv";
    }
    if (!urlMateria && gs && gs.baseUrl && gs.gids && gs.gids.materiaPrima != null) {
        urlMateria = gs.baseUrl + "?gid=" + gs.gids.materiaPrima + "&single=true&output=csv";
    }
    const containerPacking = document.getElementById("datos-packing");
    const containerMateria = document.getElementById("datos-materia-prima");

    /** Columnas a ocultar en listado por categorías (Materia prima y Packing). */
    var COSTOS_COLUMNAS_OCULTAS = [
        "Categoria",
        "idmateria-prima",
        "id materia prima",
        "idpacking",
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
        if (container === containerMateria) {
            showTableCostosConCategorias(container, data.headers, data.rows, {
                idColumnHeaders: ["idmateria-prima", "idmateriaprima"],
                storageKeyEdit: "costosEditRecord",
                storageKeyCreate: "costosCreateRecord",
                editUrl: "editar-materia-prima.html",
                createUrl: "crear-materia-prima.html",
                filterInputId: "filter-materia-prima",
                countId: "materia-prima-count",
                btnNuevaId: "btn-nueva-materia-prima"
            });
        } else if (container === containerPacking) {
            showTableCostosConCategorias(container, data.headers, data.rows, {
                idColumnHeaders: ["idpacking"],
                storageKeyEdit: "costosEditRecordPacking",
                storageKeyCreate: "costosCreateRecordPacking",
                editUrl: "editar-packing.html",
                createUrl: "crear-packing.html",
                filterInputId: "filter-packing",
                countId: "packing-count",
                btnNuevaId: "btn-nueva-packing"
            });
        } else {
            showTable(container, data.headers, data.rows);
        }
    }

    /** Listado por categorías (Materia prima y Packing). options: idColumnHeaders, storageKeyEdit, storageKeyCreate, editUrl, createUrl, filterInputId, countId, btnNuevaId. */
    function showTableCostosConCategorias(container, headers, rows, options) {
        if (!container) return;
        var opts = options || {};
        var idColumnHeaders = opts.idColumnHeaders || ["idmateria-prima", "idmateriaprima"];
        var storageKeyEdit = opts.storageKeyEdit || "costosEditRecord";
        var storageKeyCreate = opts.storageKeyCreate || "costosCreateRecord";
        var editUrl = opts.editUrl || "editar-materia-prima.html";
        var createUrl = opts.createUrl || "crear-materia-prima.html";
        var filterInputId = opts.filterInputId || "filter-materia-prima";
        var countId = opts.countId || "materia-prima-count";
        var btnNuevaId = opts.btnNuevaId || "btn-nueva-materia-prima";
        var hidden = COSTOS_COLUMNAS_OCULTAS.slice();
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
        var marcaIdx = -1;
        var lugarIdx = -1;
        var idxPresUnid = -1;
        var idxPresTipo = -1;
        var idxTipoUnidadMedida = -1;
        var idxId = -1;
        var idxHabilitado = -1;
        for (var i = 0; i < headers.length; i++) {
            var hTrim = String(headers[i] != null ? headers[i] : "").trim().toLowerCase().replace(/\s/g, "");
            if (hTrim === "categoria" || hTrim === "categoría") catIdx = i;
            if (hTrim === "marca") marcaIdx = i;
            if (hTrim === "lugar") lugarIdx = i;
            if (hTrim === "presentacion-unidad") idxPresUnid = i;
            if (hTrim === "presentacion-tipo") idxPresTipo = i;
            if (hTrim === "tipo-unidad-medida") idxTipoUnidadMedida = i;
            if (idColumnHeaders.indexOf(hTrim) !== -1) idxId = i;
            if (hTrim === "habilitado") idxHabilitado = i;
        }
        var groups = [];
        var groupMap = {};
        var groupOrder = [];
        var marcaSet = {};
        var marcaOrder = [];
        var lugarSet = {};
        var lugarOrder = [];
        var unidadPresSet = {};
        var unidadPresOrder = [];
        var tipoPresSet = {};
        var tipoPresOrder = [];
        var tipoUnidadMedidaSet = {};
        var tipoUnidadMedidaOrder = [];
        rows.forEach(function (row) {
            var catVal = catIdx >= 0 && row[catIdx] != null ? String(row[catIdx]).trim() : "";
            if (!catVal) catVal = "Sin categoría";
            if (groupMap[catVal] === undefined) {
                groupMap[catVal] = groups.length;
                groupOrder.push(catVal);
                groups.push({ label: catVal, rows: [] });
            }
            groups[groupMap[catVal]].rows.push(row);
            if (marcaIdx >= 0) {
                var mVal = row[marcaIdx] != null ? String(row[marcaIdx]).trim() : "";
                if (!marcaSet[mVal]) { marcaSet[mVal] = true; marcaOrder.push(mVal || "—"); }
            }
            if (lugarIdx >= 0) {
                var lVal = row[lugarIdx] != null ? String(row[lugarIdx]).trim() : "";
                if (!lugarSet[lVal]) { lugarSet[lVal] = true; lugarOrder.push(lVal || "—"); }
            }
            if (idxPresUnid >= 0) {
                var uVal = row[idxPresUnid] != null ? String(row[idxPresUnid]).trim() : "";
                if (!unidadPresSet[uVal]) { unidadPresSet[uVal] = true; unidadPresOrder.push(uVal || "—"); }
            }
            if (idxPresTipo >= 0) {
                var tVal = row[idxPresTipo] != null ? String(row[idxPresTipo]).trim() : "";
                if (!tipoPresSet[tVal]) { tipoPresSet[tVal] = true; tipoPresOrder.push(tVal || "—"); }
            }
            if (idxTipoUnidadMedida >= 0) {
                var tumVal = row[idxTipoUnidadMedida] != null ? String(row[idxTipoUnidadMedida]).trim() : "";
                if (!tipoUnidadMedidaSet[tumVal]) { tipoUnidadMedidaSet[tumVal] = true; tipoUnidadMedidaOrder.push(tumVal || "—"); }
            }
        });
        groupOrder.sort(function (a, b) {
            if (a === "Sin categoría") return 1;
            if (b === "Sin categoría") return -1;
            return a.localeCompare(b);
        });
        marcaOrder.sort(function (a, b) {
            if (a === "—") return 1;
            if (b === "—") return -1;
            return a.localeCompare(b);
        });
        lugarOrder.sort(function (a, b) {
            if (a === "—") return 1;
            if (b === "—") return -1;
            return a.localeCompare(b);
        });
        unidadPresOrder.sort(function (a, b) {
            if (a === "—") return 1;
            if (b === "—") return -1;
            return a.localeCompare(b);
        });
        tipoPresOrder.sort(function (a, b) {
            if (a === "—") return 1;
            if (b === "—") return -1;
            return a.localeCompare(b);
        });
        tipoUnidadMedidaOrder.sort(function (a, b) {
            if (a === "—") return 1;
            if (b === "—") return -1;
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
                var idRegistro = idxId >= 0 && row[idxId] != null ? String(row[idxId]).trim() : "";
                recordsForEdit.push({
                    id: idRegistro,
                    headers: headers.slice(),
                    row: row.slice()
                });
                function parsePrecioNum(str) {
                    if (!str || !String(str).trim()) return NaN;
                    var s = String(str).trim().replace(/\$\s?/g, "").replace(/\s/g, "");
                    if (s.indexOf(",") !== -1) {
                        s = s.replace(/\./g, "").replace(",", ".");
                    }
                    return parseFloat(s);
                }
                var numActual = parsePrecioNum(precio);
                var numAnterior = parsePrecioNum(precioAnterior);
                var trendIcon = "";
                if (!isNaN(numActual) && !isNaN(numAnterior) && numActual !== numAnterior) {
                    if (numActual > numAnterior) {
                        trendIcon = "<i class=\"fa-solid fa-arrow-trend-up costos-trend-up\" title=\"Subi\u00f3 el precio\" aria-hidden=\"true\"></i>";
                    } else {
                        trendIcon = "<i class=\"fa-solid fa-arrow-trend-down costos-trend-down\" title=\"Baj\u00f3 el precio\" aria-hidden=\"true\"></i>";
                    }
                }
                var habilitadoVal = idxHabilitado >= 0 && row[idxHabilitado] != null ? String(row[idxHabilitado]).trim().toUpperCase() : "";
                var isDeshabilitado = habilitadoVal === "NO";
                var cardClass = "costos-card" + (isDeshabilitado ? " costos-card-deshabilitado" : "");
                var deshabilitadoIcon = isDeshabilitado ? "<span class=\"costos-card-deshabilitado-icon\" title=\"Deshabilitado\" aria-label=\"Deshabilitado\"><i class=\"fa-solid fa-circle-slash\" aria-hidden=\"true\"></i></span>" : "";
                var priceBlock = (precio ? "<div class=\"costos-card-price\">" + escapeHtml(precio) + (trendIcon ? " " + trendIcon : "") + "</div>" : "") +
                    "<a href=\"#\" class=\"costos-card-edit-btn\" title=\"Editar precio / registro\" aria-label=\"Editar registro\"><i class=\"fa-solid fa-pen\" aria-hidden=\"true\"></i></a>";
                cardsHtml += "<div class=\"" + cardClass + "\">" +
                    "<div class=\"costos-card-main\">" +
                    "<div class=\"costos-card-left-wrap\">" +
                    "<div class=\"costos-card-left\">" +
                    "<div class=\"costos-card-info\">" +
                    "<h2 class=\"costos-card-name\">" + deshabilitadoIcon + escapeHtml(nombre) + "</h2>" +
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
                        sessionStorage.setItem(storageKeyEdit, JSON.stringify({
                            id: rec.id,
                            headers: rec.headers,
                            row: rec.row
                        }));
                        sessionStorage.setItem("costosDistinctCategorias", JSON.stringify(groupOrder));
                        sessionStorage.setItem("costosDistinctMarcas", JSON.stringify(marcaOrder));
                        sessionStorage.setItem("costosDistinctLugares", JSON.stringify(lugarOrder));
                        sessionStorage.setItem("costosDistinctUnidadPresentacion", JSON.stringify(unidadPresOrder));
                        sessionStorage.setItem("costosDistinctTipoPresentacion", JSON.stringify(tipoPresOrder));
                        sessionStorage.setItem("costosDistinctTipoUnidadMedida", JSON.stringify(tipoUnidadMedidaOrder));
                        window.location.href = editUrl + (rec.id ? "?id=" + encodeURIComponent(rec.id) : "");
                    } catch (err) {
                        window.location.href = editUrl + (rec.id ? "?id=" + encodeURIComponent(rec.id) : "");
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
        var filterInput = document.getElementById(filterInputId);
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
                var countEl = document.getElementById(countId);
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
            var filterDebounceTimer = null;
            function scheduleFilter() {
                if (filterDebounceTimer) clearTimeout(filterDebounceTimer);
                filterDebounceTimer = setTimeout(applyFilterMateria, 180);
            }
            filterInput.addEventListener("input", scheduleFilter);
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

    /** Completa idmateria-prima vacíos en las filas de materia prima. */
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

    function generarIdPacking(seed) {
        var base = (Date.now().toString(36) + (seed != null ? Number(seed).toString(36) : "")).slice(-6);
        var rnd = "";
        for (var i = 0; i < 4; i++) {
            rnd += ALFANUM[Math.floor(Math.random() * ALFANUM.length)];
        }
        return "COSTO-PK-" + base + rnd;
    }

    /** Completa idpacking vacíos en las filas de packing. */
    function completarIdPacking(headers, rows) {
        var idx = -1;
        for (var i = 0; i < headers.length; i++) {
            if (String(headers[i]).trim().toLowerCase().replace(/\s/g, "") === "idpacking") {
                idx = i;
                break;
            }
        }
        if (idx < 0) return;
        rows.forEach(function (row, i) {
            if (row[idx] == null || String(row[idx]).trim() === "") {
                row[idx] = generarIdPacking(i);
            }
        });
    }

    /** Carga desde Apps Script (action=list). Devuelve { headers, rows }. Timeout 12s para no quedar en "Cargando..." si falla CORS (p. ej. file://). */
    function loadFromApi(sheetKey, container) {
        var url = appsScriptUrl + "?action=list&sheet=" + sheetKey;
        var timeoutMs = 12000;
        var fetchPromise = fetch(url, { cache: "no-store" })
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
        var timeoutPromise = new Promise(function (_, reject) {
            setTimeout(function () { reject(new Error("Tiempo de espera agotado. Usá un servidor local (Live Server, etc.) para que la API funcione.")); }, timeoutMs);
        });
        return Promise.race([fetchPromise, timeoutPromise]);
    }

    function run(container) {
        if (!container) return;

        var isMateria = container === containerMateria;
        var sheetKey = isMateria ? "materiaPrima" : "packing";
        var csvUrl = isMateria ? urlMateria : urlPacking;

        if (appsScriptUrl) {
            var loadCombos = isMateria ? fetch(appsScriptUrl + "?action=list&sheet=combos&limit=5000", { cache: "no-store" })
                .then(function (res) { return res.json(); })
                .then(function (json) {
                    if (!json || !json.success || !json.data) return;
                    var headers = json.data.headers || [];
                    var rows = json.data.rows || [];
                    function normCol(h) {
                        return String(h != null ? h : "").trim().toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-");
                    }
                    function findColKey(normName) {
                        for (var ci = 0; ci < headers.length; ci++) {
                            if (normCol(headers[ci]) === normName) return String(headers[ci] != null ? headers[ci] : "").trim();
                        }
                        return headers.length > 0 ? String(headers[0]).trim() : null;
                    }
                    function distinctValues(colKey) {
                        var vals = [];
                        rows.forEach(function (row) {
                            var v = (row && colKey && row[colKey] != null) ? String(row[colKey]).trim() : "";
                            if (v && vals.indexOf(v) === -1) vals.push(v);
                        });
                        return vals;
                    }
                    try {
                        var keyUnidad = findColKey("tipo-unidad-medida");
                        if (keyUnidad) sessionStorage.setItem("costosCombosUnidadPresentacion", JSON.stringify(distinctValues(keyUnidad)));
                        var keyConvertir = findColKey("convertir-unidad-medida");
                        if (keyConvertir) sessionStorage.setItem("costosCombosConvertirUnidadMedida", JSON.stringify(distinctValues(keyConvertir)));
                        var keyTipoPres = findColKey("tipo-presentacion");
                        if (keyTipoPres) sessionStorage.setItem("costosCombosTipoPresentacion", JSON.stringify(distinctValues(keyTipoPres)));
                    } catch (e) {}
                })
                .catch(function () {}) : Promise.resolve();
            loadFromApi(sheetKey, container)
                .then(function (data) {
                    if (data.headers && data.headers.length) {
                        try {
                            if (isMateria) {
                                sessionStorage.setItem("costosMateriaHeaders", JSON.stringify(data.headers));
                            } else {
                                sessionStorage.setItem("costosPackingHeaders", JSON.stringify(data.headers));
                            }
                        } catch (e) {}
                    }
                    if (!data.headers.length && !data.rows.length) {
                        showMessage(container, "<p class=\"costos-placeholder\">La hoja no tiene datos.</p>");
                        return;
                    }
                    return loadCombos.then(function () { applyMateriaOrPackingTable(container, data, isMateria); });
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
                } else {
                    completarIdPacking(data.headers, data.rows);
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

    /** Conversiones universales de unidades (1 KG = 1000 g, 1 L = 1000 cc, 1 m = 100 cm, 1 docena = 12 unidad). */
    window.COSTOS_EQUIVALENCIA = (function () {
        var categorias = {
            masa: { gramos: 1, g: 1, kg: 1000, kilo: 1000, kilos: 1000 },
            volumen: { cc: 1, litro: 1000, l: 1000, litros: 1000, centimetrocubico: 1, centimetroscubico: 1 },
            longitud: { centimetro: 1, centimetros: 1, cm: 1, centímetro: 1, centímetros: 1, metro: 100, metros: 100, m: 100 },
            conteo: { unidad: 1, unidades: 1, elemento: 1, elementos: 1, pieza: 1, piezas: 1, docena: 12, docenas: 12 }
        };
        function normalizar(val) {
            if (val == null || typeof val !== "string") return "";
            var s = String(val).trim().toLowerCase().replace(/\s*\[[^\]]*\]\s*/g, "").replace(/\s+/g, "");
            try {
                s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            } catch (e) {
                s = s.replace(/ó/g, "o").replace(/í/g, "i").replace(/á/g, "a").replace(/é/g, "e").replace(/ú/g, "u");
            }
            return s;
        }
        function getCategoria(unidadNorm) {
            var c, keys;
            for (c in categorias) {
                if (categorias.hasOwnProperty(c) && categorias[c][unidadNorm] != null) return c;
            }
            return null;
        }
        function getFactor(cat, unidadNorm) {
            if (!cat || !categorias[cat]) return NaN;
            var f = categorias[cat][unidadNorm];
            return f != null ? f : NaN;
        }
        /** Convierte cantidad de unidadOrigen a unidadDestino dentro de la misma categoría.
         * Ej: 10 docena → unidad: 10 * 12 / 1 = 120; 1 kg → gramos: 1 * 1000 / 1 = 1000. */
        function convert(cantidad, unidadOrigen, unidadDestino) {
            var q = parseFloat(String(cantidad).replace(",", "."));
            if (isNaN(q) || q < 0) return NaN;
            var u = normalizar(unidadOrigen);
            var d = normalizar(unidadDestino);
            if (!u || !d) return q;
            var catOrigen = getCategoria(u);
            var catDestino = getCategoria(d);
            if (!catOrigen || !catDestino || catOrigen !== catDestino) return q;
            var factorOrigen = getFactor(catOrigen, u);
            var factorDestino = getFactor(catDestino, d);
            if (isNaN(factorOrigen) || isNaN(factorDestino) || factorDestino === 0) return q;
            return q * factorOrigen / factorDestino;
        }
        /** Igual que convert pero devuelve { value, debug } para la sección de debug. */
        function convertWithDebug(cantidad, unidadOrigen, unidadDestino) {
            var q = parseFloat(String(cantidad).replace(",", "."));
            var u = (unidadOrigen != null && unidadOrigen !== "") ? normalizar(unidadOrigen) : "";
            var d = (unidadDestino != null && unidadDestino !== "") ? normalizar(unidadDestino) : "";
            var catOrigen = u ? getCategoria(u) : null;
            var catDestino = d ? getCategoria(d) : null;
            var factorOrigen = catOrigen && u ? getFactor(catOrigen, u) : NaN;
            var factorDestino = catDestino && d ? getFactor(catDestino, d) : NaN;
            var mismaCategoria = catOrigen && catDestino && catOrigen === catDestino;
            var resultado = q;
            var formula = "—";
            if (!isNaN(q) && q >= 0 && u && d && mismaCategoria && !isNaN(factorOrigen) && !isNaN(factorDestino) && factorDestino !== 0) {
                resultado = q * factorOrigen / factorDestino;
                formula = q + " × " + factorOrigen + " / " + factorDestino + " = " + resultado;
            }
            return {
                value: resultado,
                debug: {
                    cantidad: q,
                    unidadOrigen: String(unidadOrigen != null ? unidadOrigen : ""),
                    unidadDestino: String(unidadDestino != null ? unidadDestino : ""),
                    normalizadoOrigen: u,
                    normalizadoDestino: d,
                    categoria: catOrigen || catDestino || "—",
                    categoriaOrigen: catOrigen || "—",
                    categoriaDestino: catDestino || "—",
                    factorOrigen: factorOrigen,
                    factorDestino: factorDestino,
                    mismaCategoria: mismaCategoria,
                    formula: formula,
                    resultado: resultado
                }
            };
        }
        /** Construye categorias desde filas del sheet (Categoria, Unidad, Factor, Alias). Solo agrega claves nuevas, no sobrescribe las por defecto. */
        function setCategoriasFromRows(rows) {
            if (!rows || !Array.isArray(rows) || rows.length === 0) return;
            var cat, factor, unidadNorm, aliasStr, list, i, j;
            for (i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row && typeof row === "object") {
                    cat = String((row.Categoria != null ? row.Categoria : row.categoria != null ? row.categoria : "") || "").trim().toLowerCase().replace(/\s+/g, "");
                    if (!cat) continue;
                    factor = parseFloat(String((row.Factor != null ? row.Factor : row.factor != null ? row.factor : "") || "").replace(",", "."));
                    if (isNaN(factor) || factor <= 0) continue;
                    if (!categorias[cat]) categorias[cat] = {};
                    unidadNorm = normalizar((row.Unidad != null ? row.Unidad : row.unidad != null ? row.unidad : "") || "");
                    if (unidadNorm && categorias[cat][unidadNorm] === undefined) categorias[cat][unidadNorm] = factor;
                    aliasStr = String((row.Alias != null ? row.Alias : row.alias != null ? row.alias : "") || "").trim();
                    if (aliasStr) {
                        list = aliasStr.split(",");
                        for (j = 0; j < list.length; j++) {
                            unidadNorm = normalizar(list[j].trim());
                            if (unidadNorm && categorias[cat][unidadNorm] === undefined) categorias[cat][unidadNorm] = factor;
                        }
                    }
                }
            }
        }
        return { convert: convert, convertWithDebug: convertWithDebug, normalizar: normalizar, categorias: categorias, setCategoriasFromRows: setCategoriasFromRows };
    })();

    (function loadEquivalenciasFromSheet() {
        var url = (window.APP_CONFIG && window.APP_CONFIG.appsScriptUrl) ? String(window.APP_CONFIG.appsScriptUrl).trim() : "";
        if (!url || !window.COSTOS_EQUIVALENCIA || !window.COSTOS_EQUIVALENCIA.setCategoriasFromRows) return;
        fetch(url + "?action=list&sheet=equivalencias&limit=500", { cache: "no-store" })
            .then(function (res) { return res.json(); })
            .then(function (json) {
                if (json && json.success && json.data && json.data.rows && json.data.rows.length) {
                    window.COSTOS_EQUIVALENCIA.setCategoriasFromRows(json.data.rows);
                }
            })
            .catch(function () {});
    })();

    run(containerPacking);
    run(containerMateria);

    var btnNuevaMateria = document.getElementById("btn-nueva-materia-prima");
    if (btnNuevaMateria) {
        btnNuevaMateria.addEventListener("click", function (e) {
            e.preventDefault();
            var appsScriptUrl = (window.APP_CONFIG && window.APP_CONFIG.appsScriptUrl) ? String(window.APP_CONFIG.appsScriptUrl).trim() : "";
            function goToCreate(headers) {
                if (!headers || !headers.length) {
                    alert("No se pudieron obtener las columnas. Revisá la conexión con la hoja.");
                    return;
                }
                var row = headers.map(function () { return ""; });
                for (var hi = 0; hi < headers.length; hi++) {
                    var h = String(headers[hi] != null ? headers[hi] : "").trim().toLowerCase().replace(/\s/g, "").replace(/-/g, "");
                    if (h === "habilitado") {
                        row[hi] = "SI";
                        break;
                    }
                }
                try {
                    sessionStorage.setItem("costosCreateRecord", JSON.stringify({ headers: headers, row: row }));
                    window.location.href = "crear-materia-prima.html";
                } catch (err) {
                    alert("Error al preparar el formulario.");
                }
            }
            try {
                var stored = sessionStorage.getItem("costosMateriaHeaders");
                if (stored) {
                    var headers = JSON.parse(stored);
                    goToCreate(Array.isArray(headers) ? headers : null);
                    return;
                }
            } catch (e) {}
            if (!appsScriptUrl) {
                alert("Configurá appsScriptUrl en config.js para poder crear registros.");
                return;
            }
            btnNuevaMateria.classList.add("costos-btn-loading");
            var origContent = btnNuevaMateria.innerHTML;
            btnNuevaMateria.innerHTML = "<i class=\"fa-solid fa-spinner fa-spin\" aria-hidden=\"true\"></i> <span>Cargando…</span>";
            var fetchCombos = fetch(appsScriptUrl + "?action=list&sheet=combos&limit=5000", { cache: "no-store" })
                .then(function (res) { return res.json(); })
                .then(function (json) {
                    if (!json || !json.success || !json.data) return;
                    var headers = json.data.headers || [];
                    var rows = json.data.rows || [];
                    function normCol(h) {
                        return String(h != null ? h : "").trim().toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-");
                    }
                    function findColKey(normName) {
                        for (var ci = 0; ci < headers.length; ci++) {
                            if (normCol(headers[ci]) === normName) return String(headers[ci] != null ? headers[ci] : "").trim();
                        }
                        return headers.length > 0 ? String(headers[0]).trim() : null;
                    }
                    function distinctValues(colKey) {
                        var vals = [];
                        rows.forEach(function (row) {
                            var v = (row && colKey && row[colKey] != null) ? String(row[colKey]).trim() : "";
                            if (v && vals.indexOf(v) === -1) vals.push(v);
                        });
                        return vals;
                    }
                    try {
                        var keyUnidad = findColKey("tipo-unidad-medida");
                        if (keyUnidad) sessionStorage.setItem("costosCombosUnidadPresentacion", JSON.stringify(distinctValues(keyUnidad)));
                        var keyConvertir = findColKey("convertir-unidad-medida");
                        if (keyConvertir) sessionStorage.setItem("costosCombosConvertirUnidadMedida", JSON.stringify(distinctValues(keyConvertir)));
                        var keyTipoPres = findColKey("tipo-presentacion");
                        if (keyTipoPres) sessionStorage.setItem("costosCombosTipoPresentacion", JSON.stringify(distinctValues(keyTipoPres)));
                    } catch (e) {}
                })
                .catch(function () {});
            fetch(appsScriptUrl + "?action=list&sheet=materiaPrima", { cache: "no-store" })
                .then(function (res) { return res.json(); })
                .then(function (json) {
                    return Promise.all([Promise.resolve(json), fetchCombos]);
                })
                .then(function (arr) {
                    var json = arr[0];
                    btnNuevaMateria.classList.remove("costos-btn-loading");
                    btnNuevaMateria.innerHTML = origContent;
                    if (!json || !json.success || !json.data || !json.data.headers) {
                        goToCreate(null);
                        return;
                    }
                    var headers = (json.data.headers || []).map(function (h) { return String(h != null ? h : "").trim(); });
                    goToCreate(headers);
                })
                .catch(function (err) {
                    btnNuevaMateria.classList.remove("costos-btn-loading");
                    btnNuevaMateria.innerHTML = origContent;
                    alert("Error al cargar: " + (err.message || "Revisá appsScriptUrl."));
                });
        });
    }

    var btnNuevaPacking = document.getElementById("btn-nueva-packing");
    if (btnNuevaPacking) {
        btnNuevaPacking.addEventListener("click", function (e) {
            e.preventDefault();
            var appsScriptUrl = (window.APP_CONFIG && window.APP_CONFIG.appsScriptUrl) ? String(window.APP_CONFIG.appsScriptUrl).trim() : "";
            function goToCreate(headers) {
                if (!headers || !headers.length) {
                    alert("No se pudieron obtener las columnas. Revisá la conexión con la hoja.");
                    return;
                }
                var row = headers.map(function () { return ""; });
                for (var hi = 0; hi < headers.length; hi++) {
                    var h = String(headers[hi] != null ? headers[hi] : "").trim().toLowerCase().replace(/\s/g, "").replace(/-/g, "");
                    if (h === "habilitado") {
                        row[hi] = "SI";
                        break;
                    }
                }
                try {
                    sessionStorage.setItem("costosCreateRecordPacking", JSON.stringify({ headers: headers, row: row }));
                    window.location.href = "crear-packing.html";
                } catch (err) {
                    alert("Error al preparar el formulario.");
                }
            }
            try {
                var stored = sessionStorage.getItem("costosPackingHeaders");
                if (stored) {
                    var headers = JSON.parse(stored);
                    goToCreate(Array.isArray(headers) ? headers : null);
                    return;
                }
            } catch (e) {}
            if (!appsScriptUrl) {
                alert("Configurá appsScriptUrl en config.js para poder crear registros.");
                return;
            }
            btnNuevaPacking.classList.add("costos-btn-loading");
            var origContent = btnNuevaPacking.innerHTML;
            btnNuevaPacking.innerHTML = "<i class=\"fa-solid fa-spinner fa-spin\" aria-hidden=\"true\"></i> <span>Cargando…</span>";
            var fetchCombos = fetch(appsScriptUrl + "?action=list&sheet=combos&limit=5000", { cache: "no-store" })
                .then(function (res) { return res.json(); })
                .then(function (json) {
                    if (!json || !json.success || !json.data) return;
                    var headers = json.data.headers || [];
                    var rows = json.data.rows || [];
                    function normCol(h) {
                        return String(h != null ? h : "").trim().toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-");
                    }
                    function findColKey(normName) {
                        for (var ci = 0; ci < headers.length; ci++) {
                            if (normCol(headers[ci]) === normName) return String(headers[ci] != null ? headers[ci] : "").trim();
                        }
                        return headers.length > 0 ? String(headers[0]).trim() : null;
                    }
                    function distinctValues(colKey) {
                        var vals = [];
                        rows.forEach(function (row) {
                            var v = (row && colKey && row[colKey] != null) ? String(row[colKey]).trim() : "";
                            if (v && vals.indexOf(v) === -1) vals.push(v);
                        });
                        return vals;
                    }
                    try {
                        var keyUnidad = findColKey("tipo-unidad-medida");
                        if (keyUnidad) sessionStorage.setItem("costosCombosUnidadPresentacion", JSON.stringify(distinctValues(keyUnidad)));
                        var keyConvertir = findColKey("convertir-unidad-medida");
                        if (keyConvertir) sessionStorage.setItem("costosCombosConvertirUnidadMedida", JSON.stringify(distinctValues(keyConvertir)));
                        var keyTipoPres = findColKey("tipo-presentacion");
                        if (keyTipoPres) sessionStorage.setItem("costosCombosTipoPresentacion", JSON.stringify(distinctValues(keyTipoPres)));
                    } catch (e) {}
                })
                .catch(function () {});
            fetch(appsScriptUrl + "?action=list&sheet=packing", { cache: "no-store" })
                .then(function (res) { return res.json(); })
                .then(function (json) {
                    return Promise.all([Promise.resolve(json), fetchCombos]);
                })
                .then(function (arr) {
                    var json = arr[0];
                    btnNuevaPacking.classList.remove("costos-btn-loading");
                    btnNuevaPacking.innerHTML = origContent;
                    if (!json || !json.success || !json.data || !json.data.headers) {
                        goToCreate(null);
                        return;
                    }
                    var headers = (json.data.headers || []).map(function (h) { return String(h != null ? h : "").trim(); });
                    goToCreate(headers);
                })
                .catch(function (err) {
                    btnNuevaPacking.classList.remove("costos-btn-loading");
                    btnNuevaPacking.innerHTML = origContent;
                    alert("Error al cargar: " + (err.message || "Revisá appsScriptUrl."));
                });
        });
    }
})();
