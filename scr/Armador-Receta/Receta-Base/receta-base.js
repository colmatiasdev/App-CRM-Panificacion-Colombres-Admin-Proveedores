/**
 * Listado de Receta Base. Usa sheets-listar-receta-base.config.js
 */
(function () {
    var STORAGE_EDIT = "costosEditRecordRecetaBase";
    var STORAGE_FILTRO = "recetaBaseFiltroValor";
    var ACCIONES = window.RECETA_BASE_ACCIONES || {};
    var LISTAR_URL = (ACCIONES.listar && ACCIONES.listar.url) ? ACCIONES.listar.url : "receta-base.html";
    var CREAR_URL = (ACCIONES.crear && ACCIONES.crear.url) ? ACCIONES.crear.url : "crear-receta-base.html";
    var EDITAR_URL = (ACCIONES.editar && ACCIONES.editar.url) ? ACCIONES.editar.url : "editar-receta-base.html";
    var VER_URL = (ACCIONES.ver && ACCIONES.ver.url) ? ACCIONES.ver.url : "ver-receta-base.html";

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
            for (var j = 0; j < names.length; j++) { if (h === names[j]) return i; }
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

    function alignRowsToConfig(headersConfig, apiHeaders, apiRows) {
        var headers = headersConfig.map(function (c) { return c.nombre || c; });
        var rows = (apiRows || []).map(function (obj) {
            var rowObj = Array.isArray(obj) ? {} : obj;
            if (Array.isArray(obj)) { apiHeaders.forEach(function (h, i) { rowObj[h] = obj[i]; }); }
            return headers.map(function (nombre) {
                var val = rowObj[nombre];
                if (val === undefined) { var key = Object.keys(rowObj).find(function (k) { return norm(k) === norm(nombre); }); val = key != null ? rowObj[key] : ""; }
                return val != null ? val : "";
            });
        });
        return { headers: headers, rows: rows };
    }

    function renderList(container, sheetConfig, headers, rows, filterText, valorFiltroColumna, indiceColumnaFiltro) {
        if (!container) return;
        var columnas = sheetConfig.columnas || [];
        var clavePrimaria = sheetConfig.clavePrimaria || ["IDReceta-Base"];
        var pkNorms = clavePrimaria.map(function (k) { return norm(k); });
        var idColIdx = findColumnIndex(headers, pkNorms);
        if (idColIdx < 0) idColIdx = 0;
        var nameColIdx = headers.indexOf("Descripcion-Masa-Producto");
        if (nameColIdx < 0) nameColIdx = findColumnIndex(headers, ["descripcionmasaproducto", "descripcion-masa-producto", "nombre"]);
        if (nameColIdx < 0) nameColIdx = 0;

        var filter = (filterText || "").trim().toLowerCase();
        var visible = rows;
        if (filter) {
            visible = visible.filter(function (row) {
                var concat = row.map(function (c) { return String(c != null ? c : ""); }).join(" ").toLowerCase();
                return concat.indexOf(filter) !== -1;
            });
        }
        if (valorFiltroColumna != null && String(valorFiltroColumna).trim() !== "" && indiceColumnaFiltro >= 0) {
            var valorBuscar = String(valorFiltroColumna).trim();
            visible = visible.filter(function (row) { return (row[indiceColumnaFiltro] != null ? String(row[indiceColumnaFiltro]).trim() : "") === valorBuscar; });
        }

        var extraIndexes = [];
        columnas.forEach(function (col) {
            var nombre = col.nombre || "";
            if (!nombre || col.visible !== true) return;
            if (norm(nombre) === norm((headers[idColIdx] || ""))) return;
            if (norm(nombre) === norm((headers[nameColIdx] || ""))) return;
            var idx = headers.indexOf(nombre);
            if (idx >= 0) extraIndexes.push(idx);
        });

        function cardActionsHtml(id, rowIndex) {
            return "<a href=\"" + VER_URL + "\" class=\"costos-card-btn costos-card-btn-ver\" data-id=\"" + escapeHtml(id) + "\" data-row-index=\"" + rowIndex + "\"><i class=\"fa-solid fa-eye\" aria-hidden=\"true\"></i> Ver</a>" +
                "<a href=\"" + EDITAR_URL + "\" class=\"costos-card-btn costos-card-btn-editar\" data-id=\"" + escapeHtml(id) + "\" data-row-index=\"" + rowIndex + "\"><i class=\"fa-solid fa-pen\" aria-hidden=\"true\"></i> Editar</a>";
        }

        var html = '<div class="costos-cards costos-cards-receta-base">';
        visible.forEach(function (row) {
            var id = getRowId(headers, row, idColIdx);
            var title = (nameColIdx >= 0 && row[nameColIdx] != null && String(row[nameColIdx]).trim() !== "") ? String(row[nameColIdx]).trim() : "—";
            var extra = [];
            extraIndexes.forEach(function (c) {
                var val = row[c] != null ? String(row[c]).trim() : "";
                var colConfig = columnas.filter(function (col) { return norm(col.nombre) === norm(headers[c]); })[0];
                if (colConfig && colConfig.formatoVisual && typeof window.formatNumeroVisual === "function") {
                    var num = parseFloat(String(val).replace(",", "."));
                    val = !isNaN(num) ? window.formatNumeroVisual(num, colConfig.formatoVisual, colConfig.decimales != null ? colConfig.decimales : 2) : (val || "—");
                } else if (val === "") val = "—";
                var label = (colConfig && colConfig.alias) ? colConfig.alias : headers[c];
                extra.push(escapeHtml(label) + ": " + escapeHtml(val));
            });
            var extraHtml = extra.length ? "<ul class=\"costos-card-extra\">" + extra.map(function (item) { return "<li>" + item + "</li>"; }).join("") + "</ul>" : "";
            html += "<div class=\"costos-card costos-card-receta-base\">";
            html += "<div class=\"costos-card-header\"><h3 class=\"costos-card-title\">" + escapeHtml(title) + "</h3></div>";
            html += "<div class=\"costos-card-body\">" + extraHtml + "</div>";
            html += "<div class=\"costos-card-actions\">" + cardActionsHtml(id, rows.indexOf(row)) + "</div></div>";
        });
        html += "</div>";
        container.innerHTML = html;
        container.classList.remove("costos-datos-message");

        var countEl = document.getElementById("receta-base-count");
        if (countEl) countEl.textContent = visible.length + " de " + rows.length + " registro(s)";

        function goToCardAction(btn) {
            var idx = parseInt(btn.getAttribute("data-row-index"), 10);
            if (isNaN(idx) || idx < 0 || idx >= rows.length) return;
            try {
                sessionStorage.setItem(STORAGE_EDIT, JSON.stringify({ id: getRowId(headers, rows[idx], idColIdx), headers: headers, row: rows[idx] }));
            } catch (err) {}
            window.location.href = btn.getAttribute("href");
        }
        container.querySelectorAll(".costos-card-btn-editar, .costos-card-btn-ver").forEach(function (btn) {
            btn.addEventListener("click", function (e) { e.preventDefault(); goToCardAction(btn); });
        });
    }

    function showMessage(container, text) {
        if (!container) return;
        container.innerHTML = "<p class=\"costos-placeholder\">" + escapeHtml(text) + "</p>";
        container.classList.add("costos-datos-message");
    }

    function run() {
        var container = document.getElementById("datos-receta-base");
        var filterInput = document.getElementById("filter-receta-base");
        var btnNuevo = document.getElementById("btn-nuevo-receta-base");
        if (!container) return;
        if (btnNuevo) btnNuevo.addEventListener("click", function (e) { e.preventDefault(); window.location.href = CREAR_URL; });
        if (!appsScriptUrl) { showMessage(container, "No está configurada la URL de la API (appsScriptUrl)."); return; }
        var loadConfig = window.RECETA_BASE_LOAD_CONFIG;
        if (!loadConfig) { showMessage(container, "No se pudo cargar la configuración del módulo."); return; }

        loadConfig().then(function (sheetConfig) {
            var nombreHoja = (sheetConfig && sheetConfig.nombreHoja) ? String(sheetConfig.nombreHoja).trim() : "";
            if (!nombreHoja) { showMessage(container, "Configuración incorrecta: no se especificó la hoja (Tabla-Receta-Base)."); return; }
            var columnas = sheetConfig.columnas || [];
            var headersConfig = columnas.map(function (c) { return { nombre: c.nombre }; });
            var columnaFiltroValores = sheetConfig.columnaFiltroValores || null;
            var filtrarWrap = document.getElementById("receta-base-filtrar-wrap");
            var filtrarSelect = document.getElementById("filtrar-valores-receta-base");

            var url = appsScriptUrl + "?action=list&sheet=" + encodeURIComponent(nombreHoja) + "&_=" + Date.now();
            if (window.COSTOS_SPINNER) window.COSTOS_SPINNER.show("Cargando…");
            if (btnNuevo) { btnNuevo.classList.add("costos-btn-disabled"); btnNuevo.setAttribute("aria-disabled", "true"); }
            return fetch(url, { cache: "no-store" }).then(function (res) { return res.json(); }).then(function (json) {
                if (!json || !json.success || !json.data) throw new Error(json && json.error ? json.error : "Error al cargar");
                var apiHeaders = (json.data.headers || []).map(function (h) { return String(h != null ? h : "").trim(); });
                var apiRows = json.data.rows || [];
                var aligned = alignRowsToConfig(headersConfig, apiHeaders, apiRows);
                var headers = aligned.headers;
                var rows = aligned.rows;
                if (!headers.length && !rows.length) { showMessage(container, "La hoja no tiene datos."); return { sheetConfig: sheetConfig, headers: headers, rows: rows }; }

                var indiceColumnaFiltro = -1;
                if (columnaFiltroValores && filtrarSelect && filtrarWrap) {
                    indiceColumnaFiltro = findColumnIndex(headers, [norm(columnaFiltroValores)]);
                    if (indiceColumnaFiltro >= 0) {
                        filtrarWrap.style.display = "";
                        var valoresUnicos = {};
                        rows.forEach(function (row) { var v = row[indiceColumnaFiltro]; var s = (v != null && String(v).trim() !== "") ? String(v).trim() : "—"; valoresUnicos[s] = true; });
                        var valoresOrdenados = Object.keys(valoresUnicos).sort();
                        filtrarSelect.innerHTML = "";
                        var optTodos = document.createElement("option"); optTodos.value = ""; optTodos.textContent = "Todos"; optTodos.selected = true; filtrarSelect.appendChild(optTodos);
                        valoresOrdenados.forEach(function (val) { var opt = document.createElement("option"); opt.value = val; opt.textContent = val; filtrarSelect.appendChild(opt); });
                        try { var guardado = sessionStorage.getItem(STORAGE_FILTRO); if (guardado != null && guardado !== "") { var opts = filtrarSelect.querySelectorAll("option"); for (var o = 0; o < opts.length; o++) { if (opts[o].value === guardado) { opts[o].selected = true; break; } } } } catch (e) {}
                    }
                }

                function getValorFiltroActual() { var sel = document.getElementById("filtrar-valores-receta-base"); return sel ? (sel.value || "") : ""; }
                function redraw() {
                    var valorFiltro = columnaFiltroValores ? getValorFiltroActual() : "";
                    renderList(container, sheetConfig, headers, rows, (filterInput && filterInput.value) ? filterInput.value : "", valorFiltro, columnaFiltroValores ? indiceColumnaFiltro : -1);
                }
                redraw();
                if (filterInput) filterInput.addEventListener("input", redraw);
                if (filtrarSelect) filtrarSelect.addEventListener("change", function () { try { sessionStorage.setItem(STORAGE_FILTRO, filtrarSelect.value || ""); } catch (e) {} redraw(); });
                return { sheetConfig: sheetConfig, headers: headers, rows: rows };
            }).finally(function () { if (window.COSTOS_SPINNER) window.COSTOS_SPINNER.hide(); if (btnNuevo) { btnNuevo.classList.remove("costos-btn-disabled"); btnNuevo.removeAttribute("aria-disabled"); } });
        }).catch(function (err) {
            if (window.COSTOS_SPINNER) window.COSTOS_SPINNER.hide();
            if (btnNuevo) { btnNuevo.classList.remove("costos-btn-disabled"); btnNuevo.removeAttribute("aria-disabled"); }
            showMessage(container, "Error al cargar: " + (err.message || "Revisá la URL de la API."));
        });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
    else run();
})();
