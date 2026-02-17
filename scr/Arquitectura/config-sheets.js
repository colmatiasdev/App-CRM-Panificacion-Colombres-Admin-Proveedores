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
    c.appsScriptUrl = "https://script.google.com/macros/s/AKfycbwFcrpTmKKQcCJ0wiA3TDi2fckCTZeTCTbMfuFpnLqxAZWf7F9yH3oWwYj8cI5JAkkrUA/exec";

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
})();
