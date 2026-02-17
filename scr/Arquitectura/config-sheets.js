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
    c.appsScriptUrl = "https://script.google.com/macros/s/AKfycbyiLq6cEO0AhXcaCd5CzL1n3Vpn_bB9V6iESAUhQ2GzN2jIN3MG4-qVkrkd8euZuQXkKw/exec";

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
        tablaCostoProductos: "Tabla-Costo-Productos"
    };

    /** URLs CSV por hoja (se rellenan a continuación desde googleSheet). */
    c.googleSheetMateriaPrimaUrl = "";
    c.googleSheetPackingUrl = "";

    var gs = c.googleSheet;
    if (gs && gs.baseUrl && gs.gids) {
        c.googleSheetMateriaPrimaUrl = gs.baseUrl + "?gid=" + gs.gids.materiaPrima + "&single=true&output=csv";
        c.googleSheetPackingUrl = gs.baseUrl + "?gid=" + gs.gids.packing + "&single=true&output=csv";
    }
})();
