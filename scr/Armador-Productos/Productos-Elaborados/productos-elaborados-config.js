/**
 * Configuración del módulo Productos elaborados.
 * Lee la config desde window.PRODUCTOS_ELABORADOS_SHEETS_JSON (definida en
 * scr/Arquitectura/sheets/productos-elaborados-sheets.config.js). Para cambiar
 * el comportamiento del módulo, editá directamente ese .config.js.
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

    function buildConfigFromJson(json) {
                var hojas = json.hojas || json.sheets || [];
                var hoja = getSheetConfig(hojas, "Listado-Productos-Elaborados");
                if (!hoja) {
                    throw new Error("No se encontró la hoja Listado-Productos-Elaborados en la configuración.");
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
                    columnaOrdenLista: columnaOrdenLista || null,
                    prefijoId: hoja.prefijoId != null ? hoja.prefijoId : null,
                    patronId: hoja.patronId != null ? hoja.patronId : 1,
                    longitudAlfanum: hoja.longitudAlfanum != null ? hoja.longitudAlfanum : 15,
                    digitosSufijo: hoja.digitosSufijo != null ? hoja.digitosSufijo : 4
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
     * Carga la configuración desde window.PRODUCTOS_ELABORADOS_SHEETS_JSON
     * (script productos-elaborados-sheets.config.js). Editá ese archivo para cambiar la config.
     * @returns {Promise<{ nombreHoja: string, clavePrimaria: string[], columnas: Array }>}
     */
    function loadConfig() {
        var cached = window._productosElaboradosConfigCache;
        if (cached && cached.timestamp && (Date.now() - cached.timestamp < CACHE_MAX_AGE_MS)) {
            return Promise.resolve(cached.config);
        }
        var json = window.PRODUCTOS_ELABORADOS_SHEETS_JSON;
        if (!json) {
            return Promise.reject(new Error("Falta la configuración del módulo. Cargá el script scr/Arquitectura/sheets/productos-elaborados-sheets.config.js antes de productos-elaborados-config.js."));
        }
        try {
            return Promise.resolve(buildConfigFromJson(json));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    window.PRODUCTOS_ELABORADOS_LOAD_CONFIG = loadConfig;
})();
