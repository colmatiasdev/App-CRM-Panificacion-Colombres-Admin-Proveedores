/**
 * Configuración del módulo Productos elaborados.
 * Lee siempre la config desde window.PRODUCTOS_ELABORADOS_SHEETS_JSON (definida en
 * scr/Arquitectura/sheets/productos-elaborados-sheets.config.js). Ese archivo es la
 * configuración del módulo; para cambiarla, editá productos-elaborados-sheets.json
 * y sincronizá el .config.js (o editá directamente el .config.js).
 */
(function () {
    var CACHE_MAX_AGE_MS = 5 * 60 * 1000;

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
                var listado = hoja.listado || {};
                var columnaOrdenLista = null;
                for (var c = 0; c < columnas.length; c++) {
                    if (columnas[c].autogeneradoOrden === true) {
                        columnaOrdenLista = String(columnas[c].nombre || "").trim();
                        break;
                    }
                }
                var config = {
                    nombreHoja: nombreHoja,
                    clavePrimaria: clavePrimaria,
                    columnas: columnas,
                    columnasPorNombre: {},
                    indicesExtras: hoja.indices || [],
                    columnasAgrupacion: Array.isArray(listado.columnasAgrupacion) ? listado.columnasAgrupacion : (listado.columnasAgrupacion ? [listado.columnasAgrupacion] : []),
                    modosAgrupacion: Array.isArray(listado.modosAgrupacion) ? listado.modosAgrupacion : [],
                    columnaOrdenLista: columnaOrdenLista || null
                };
                columnas.forEach(function (col, idx) {
                    var nombre = String((col.nombre || "").trim());
                    if (nombre) config.columnasPorNombre[nombre] = { index: idx, col: col };
                });
                window._productosElaboradosConfigCache = { config: config, timestamp: Date.now() };
                window.PRODUCTOS_ELABORADOS_CONFIG = config;
                return config;
    }

    var JSON_URL = "../../Arquitectura/sheets/productos-elaborados-sheets.json";

    /**
     * Carga la configuración: intenta primero el JSON (así al editar el archivo y recargar se ve el cambio).
     * Si el fetch falla (sin servidor, 404), usa window.PRODUCTOS_ELABORADOS_SHEETS_JSON del .config.js.
     * @returns {Promise<{ nombreHoja: string, clavePrimaria: string[], columnas: Array }>}
     */
    function loadConfig() {
        var cached = window._productosElaboradosConfigCache;
        if (cached && cached.timestamp && (Date.now() - cached.timestamp < CACHE_MAX_AGE_MS)) {
            return Promise.resolve(cached.config);
        }
        var url = JSON_URL + "?_=" + Date.now();
        return fetch(url, { cache: "no-store" })
            .then(function (res) {
                if (res && res.ok) return res.json();
                return Promise.reject(new Error("JSON no disponible"));
            })
            .then(buildConfigFromJson)
            .catch(function () {
                var json = window.PRODUCTOS_ELABORADOS_SHEETS_JSON;
                if (!json) {
                    return Promise.reject(new Error("No se pudo cargar la configuración. Revisá que exista productos-elaborados-sheets.json (o el script .config.js) y que la app se abra desde un servidor que sirva los archivos."));
                }
                try {
                    return Promise.resolve(buildConfigFromJson(json));
                } catch (e) {
                    return Promise.reject(e);
                }
            });
    }

    window.PRODUCTOS_ELABORADOS_LOAD_CONFIG = loadConfig;
})();
