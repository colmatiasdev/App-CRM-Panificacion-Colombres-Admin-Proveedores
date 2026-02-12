/**
 * Carga datos desde una hoja de Google Sheets (URL CSV pública)
 * y los muestra en #datos-packing o #datos-materia-prima.
 * Configurar APP_CONFIG.googleSheetCostosUrl en config.js.
 */
(function () {
    const config = window.APP_CONFIG || {};
    const urlPacking = (config.googleSheetPackingUrl || "").trim();
    const urlMateria = (config.googleSheetMateriaPrimaUrl || "").trim();
    const containerPacking = document.getElementById("datos-packing");
    const containerMateria = document.getElementById("datos-materia-prima");

    function showMessage(container, html) {
        if (!container) return;
        container.innerHTML = html;
        container.classList.add("costos-datos-message");
    }

    function showTable(container, headers, rows) {
        if (!container) return;
        let html = '<table class="costos-table"><thead><tr>';
        headers.forEach(function (h) {
            html += "<th>" + escapeHtml(h) + "</th>";
        });
        html += "</tr></thead><tbody>";
        rows.forEach(function (row) {
            html += "<tr>";
            row.forEach(function (cell) {
                html += "<td>" + escapeHtml(cell) + "</td>";
            });
            html += "</tr>";
        });
        html += "</tbody></table>";
        container.innerHTML = html;
        container.classList.remove("costos-datos-message");
    }

    function escapeHtml(text) {
        if (text == null) return "";
        var div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    function parseCsv(text) {
        var lines = text.trim().split(/\r?\n/);
        if (lines.length === 0) return { headers: [], rows: [] };
        var headers = parseCsvLine(lines[0]);
        var rows = [];
        for (var i = 1; i < lines.length; i++) {
            var row = parseCsvLine(lines[i]);
            if (row.some(function (c) { return c.trim() !== ""; })) {
                rows.push(row);
            }
        }
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

    function run(container) {
        if (!container) return;

        var url = container === containerMateria ? urlMateria : urlPacking;
        if (!url || url.trim() === "") {
            showMessage(
                container,
                '<p class="costos-placeholder">Para ver datos, configurá <strong>googleSheetPackingUrl</strong> o <strong>googleSheetMateriaPrimaUrl</strong> en <code>config.js</code>.</p><p class="costos-placeholder">Ver <a href="../../docs/CONFIGURAR_GOOGLE_SHEETS.md" target="_blank" rel="noopener">docs/CONFIGURAR_GOOGLE_SHEETS.md</a>.</p>'
            );
            return;
        }

        var sheetUrl = container === containerMateria ? urlMateria : urlPacking;
        fetch(sheetUrl, { cache: "no-store" })
            .then(function (res) { return res.text(); })
            .then(function (text) {
                var data = parseCsv(text);
                if (data.headers.length === 0 && data.rows.length === 0) {
                    showMessage(container, "<p class=\"costos-placeholder\">La hoja no tiene datos o la URL no es correcta.</p>");
                    return;
                }
                if (container === containerMateria) {
                    completarIdMateriaPrima(data.headers, data.rows);
                }
                showTable(container, data.headers, data.rows);
            })
            .catch(function (err) {
                showMessage(
                    container,
                    '<p class="costos-placeholder">No se pudieron cargar los datos. Revisá que la hoja esté publicada en la web como CSV y que la URL en config.js sea correcta.</p>'
                );
            });
    }

    run(containerPacking);
    run(containerMateria);
})();
