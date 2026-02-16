/**
 * Carga la configuración de la hoja Listado-Productos-Elaborados desde scr/Arquitectura/sheets/productos-elaborados-sheets.json
 * y la expone en window.PRODUCTOS_ELABORADOS_CONFIG para listado, crear y editar.
 */
(function () {
    var CACHE_MAX_AGE_MS = 5 * 60 * 1000;
    var CONFIG_URL = "../../Arquitectura/sheets/productos-elaborados-sheets.json";

    function norm(s) {
        return String(s != null ? s : "").trim().toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
    }

    function getSheetConfig(hojas, nombreHoja) {
        if (!hojas || !nombreHoja) return null;
        for (var i = 0; i < hojas.length; i++) {
            if (String(hojas[i].nombreHoja || hojas[i].nombre || "").trim() === String(nombreHoja).trim()) {
                return hojas[i];
            }
        }
        return hojas[0] || null;
    }

    function parseColumnNorm(col) {
        var nombre = (col && col.nombre) ? String(col.nombre).trim() : "";
        return { nombre: nombre, norm: norm(nombre), col: col };
    }

    function buildConfigFromJson(json) {
                var hojas = json.hojas || json.sheets || [];
                var hoja = getSheetConfig(hojas, "Listado-Productos-Elaborados");
                if (!hoja) {
                    throw new Error("No se encontró la hoja Listado-Productos-Elaborados en el JSON.");
                }
                var nombreHoja = String(hoja.nombreHoja || hoja.nombre || "Listado-Productos-Elaborados").trim();
                var clavePrimaria = Array.isArray(hoja.clavePrimaria) ? hoja.clavePrimaria : (hoja.idColumn ? [hoja.idColumn] : ["IDProducto"]);
                var columnas = hoja.columnas || [];
                var config = {
                    nombreHoja: nombreHoja,
                    clavePrimaria: clavePrimaria,
                    columnas: columnas,
                    columnasPorNombre: {},
                    indicesExtras: hoja.indices || []
                };
                columnas.forEach(function (col, idx) {
                    var nombre = String((col.nombre || "").trim());
                    if (nombre) config.columnasPorNombre[nombre] = { index: idx, col: col };
                });
                window._productosElaboradosConfigCache = { config: config, timestamp: Date.now() };
                window.PRODUCTOS_ELABORADOS_CONFIG = config;
                return config;
    }

    /**
     * Carga el JSON de configuración desde scr/Arquitectura/sheets/productos-elaborados-sheets.json
     * @returns {Promise<{ nombreHoja: string, clavePrimaria: string[], columnas: Array }>}
     */
    function loadConfig() {
        var cached = window._productosElaboradosConfigCache;
        if (cached && cached.timestamp && (Date.now() - cached.timestamp < CACHE_MAX_AGE_MS)) {
            return Promise.resolve(cached.config);
        }
        return fetch(CONFIG_URL + "?_=" + Date.now(), { cache: "no-store" })
            .then(function (res) {
                if (!res.ok) throw new Error("Config no encontrada en scr/Arquitectura/sheets/productos-elaborados-sheets.json (" + res.status + ")");
                return res.json();
            })
            .then(buildConfigFromJson);
    }

    window.PRODUCTOS_ELABORADOS_LOAD_CONFIG = loadConfig;
})();
