/**
 * Listado de Productos Elaborados desde la hoja Listado-Productos-Elaborados.
 * Carga vía Apps Script (action=list&sheet=listadoProductosElaborados) y muestra tarjetas con opción Editar / Nuevo.
 */
(function () {
    var SHEET_KEY = "listadoProductosElaborados";
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

    function renderList(container, headers, rows, filterText) {
        if (!container) return;
        var idColIdx = findColumnIndex(headers, ["id", "idproducto", "idproductoelaborado", "idproductoelaborados"]);
        if (idColIdx < 0) idColIdx = 0;
        var nameColIdx = findColumnIndex(headers, ["nombre", "nombreproducto", "producto", "descripcion"]);
        if (nameColIdx < 0) nameColIdx = 0;

        var filter = (filterText || "").trim().toLowerCase();
        var visible = rows;
        if (filter) {
            visible = rows.filter(function (row) {
                var concat = row.map(function (c) { return String(c != null ? c : ""); }).join(" ").toLowerCase();
                return concat.indexOf(filter) !== -1;
            });
        }

        var html = '<div class="costos-cards costos-cards-productos-elaborados">';
        visible.forEach(function (row) {
            var id = getRowId(headers, row, idColIdx);
            var title = getRowTitle(headers, row, nameColIdx);
            var extra = [];
            for (var c = 0; c < Math.min(headers.length, 5); c++) {
                if (c === nameColIdx || c === idColIdx) continue;
                var val = row[c] != null ? String(row[c]).trim() : "";
                if (val) extra.push(escapeHtml(headers[c]) + ": " + escapeHtml(val));
            }
            var extraHtml = extra.length ? "<p class=\"costos-card-extra\">" + extra.slice(0, 3).join(" · ") + "</p>" : "";
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

        var url = appsScriptUrl + "?action=list&sheet=" + encodeURIComponent(SHEET_KEY);
        fetch(url, { cache: "no-store" })
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
                if (!headers.length && !rows.length) {
                    showMessage(container, "La hoja no tiene datos.");
                    return;
                }
                renderList(container, headers, rows, (filterInput && filterInput.value) ? filterInput.value : "");
                if (filterInput) {
                    filterInput.addEventListener("input", function () {
                        renderList(container, headers, rows, filterInput.value);
                    });
                }
            })
            .catch(function (err) {
                showMessage(container, "Error al cargar: " + (err.message || "Revisá la URL de la API."));
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }
})();
