/**
 * Configuración de API (Apps Script) y hojas de Google Sheets.
 * Cargar después de config.js. Los valores se agregan a window.APP_CONFIG.
 * Ver docs/APPS_SCRIPT_ABM_README.md
 */
(function () {
    var c = window.APP_CONFIG;
    if (!c) {
        window.APP_CONFIG = {};
        c = window.APP_CONFIG;
    }

    /** Apps Script desplegado – ABM (list, get, search, create, update, delete). */
    c.appsScriptUrl = "https://script.google.com/macros/s/AKfycbzoDVFZxZr6gHoA32IS_bDgnzKEaycTr0RNCbSrB-muJ1fpESw1yKvX7Zds9vGHuKpX7g/exec";

    /**
     * Google Sheets – Un solo documento publicado con todas las hojas.
     * Documento: Costo - Proveedores (pubhtml para ver, /pub para CSV).
     * Las URLs CSV se arman desde baseUrl + gid de cada hoja (fallback cuando no hay Apps Script).
     */
    c.googleSheet = {
        baseUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZLbiTy2vAqNDISIC-TfpvtKjJtERv-N6aIcldP6s-LQ5EI4Og-ZYGPG8qZkl3-TTh7wYF13PWQm6E/pub",
        gids: {
            materiaPrima: 0,
            packing: 1565788325
        },
        /** Hoja Listado-Productos-Elaborados (módulo Productos elaborados). Apps Script: sheet=Listado-Productos-Elaborados. FK: IDCosto-Producto → Tabla-Costo-Productos */
        listadoProductosElaborados: "Listado-Productos-Elaborados",
        /** Hoja Tabla-Costo-Productos (módulo Costo productos). Apps Script: sheet=Tabla-Costo-Productos. PK: IDCosto-Producto */
        tablaCostoProductos: "Tabla-Costo-Productos",
        /** Hoja COSTO-EMPLEADOS. Apps Script: sheet=COSTO-EMPLEADOS. PK: MINUTOS. Costos por minuto y mano de obra. */
        costoEmpleados: "COSTO-EMPLEADOS"
    };

    /** URLs CSV por hoja (se rellenan a continuación desde googleSheet). */
    c.googleSheetMateriaPrimaUrl = "";
    c.googleSheetPackingUrl = "";

    var gs = c.googleSheet;
    if (gs && gs.baseUrl && gs.gids) {
        c.googleSheetMateriaPrimaUrl = gs.baseUrl + "?gid=" + gs.gids.materiaPrima + "&single=true&output=csv";
        c.googleSheetPackingUrl = gs.baseUrl + "?gid=" + gs.gids.packing + "&single=true&output=csv";
    }

    /**
     * Spinner global para cargar/guardar/procesar.
     * Uso: COSTOS_SPINNER.show("Cargando…"); … fetch… ; COSTOS_SPINNER.hide();
     * Deshabilitar botones manualmente: btn.disabled = true; … ; btn.disabled = false;
     */
    var overlay = null;
    window.COSTOS_SPINNER = {
        show: function (text) {
            if (!overlay) {
                overlay = document.createElement("div");
                overlay.className = "costos-spinner-overlay";
                overlay.setAttribute("role", "status");
                overlay.setAttribute("aria-live", "polite");
                overlay.innerHTML = "<div class=\"costos-spinner-box\"><div class=\"costos-spinner\" aria-hidden=\"true\"></div><span class=\"costos-spinner-text\" id=\"costos-spinner-text\">Procesando…</span></div>";
                document.body.appendChild(overlay);
            }
            overlay.setAttribute("aria-hidden", "false");
            overlay.style.display = "flex";
            var textEl = document.getElementById("costos-spinner-text");
            if (textEl) textEl.textContent = text || "Procesando…";
        },
        hide: function () {
            if (overlay) {
                overlay.setAttribute("aria-hidden", "true");
                overlay.style.display = "none";
            }
        }
    };

    /**
     * Formato visual para valores numéricos en labels (tipoDato numeric + tipoComponente label).
     * formato: "moneda" → $ 1.254,59 (ARG; punto miles, coma decimal) | "porcentaje" → 3 %
     * @param {string|number} val - Valor a formatear
     * @param {string} [formato] - "moneda" | "porcentaje" | omitir (número con decimales)
     * @param {number} [decimales] - Cantidad de decimales (default 2)
     * @returns {string}
     */
    window.formatNumeroVisual = function (val, formato, decimales) {
        var num = parseFloat(String(val).replace(",", ".")) || 0;
        var dec = (decimales != null && !isNaN(decimales)) ? parseInt(decimales, 10) : 2;
        if (formato === "moneda") {
            var s = num.toFixed(dec);
            var parts = s.split(".");
            var intPart = (parts[0] || "0").replace(/^-/, "");
            var neg = num < 0;
            var formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            var decPart = (parts[1] || "").length >= dec ? (parts[1] || "").substring(0, dec) : (parts[1] || "").padEnd(dec, "0").substring(0, dec);
            return (neg ? "-" : "") + "$ " + formattedInt + "," + decPart;
        }
        if (formato === "porcentaje") {
            return num.toFixed(dec) + " %";
        }
        return num.toFixed(dec);
    };

    /**
     * Convierte un valor mostrado (moneda o porcentaje) de vuelta a número para envío al servidor.
     * @param {string} val - Texto formateado (ej. "$ 1.254,59" o "3 %")
     * @param {string} [formato] - "moneda" | "porcentaje"
     * @returns {string} - Número como string (ej. "1254.59")
     */
    window.parseNumeroVisual = function (val, formato) {
        if (val == null || String(val).trim() === "") return "";
        var s = String(val).trim();
        if (formato === "moneda") {
            s = s.replace(/\$\s*/g, "").replace(/\./g, "").replace(",", ".");
        } else if (formato === "porcentaje") {
            s = s.replace(/\s*%\s*$/g, "").trim();
        }
        var num = parseFloat(s);
        return isNaN(num) ? "" : String(num);
    };
})();
