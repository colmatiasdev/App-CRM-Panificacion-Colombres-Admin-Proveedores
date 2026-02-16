/**
 * Configuración de la hoja Listado-Productos-Elaborados para el módulo Productos elaborados.
 * Usa la config embebida para no depender del servidor (evita 404). Para cambiar columnas, editá este objeto
 * o el JSON en scr/Arquitectura/sheets/productos-elaborados-sheets.json y sincronizá.
 */
(function () {
    var CACHE_MAX_AGE_MS = 5 * 60 * 1000;

    var CONFIG_EMBED = {
        hojas: [{
            nombre: "Listado-Productos-Elaborados",
            nombreHoja: "Listado-Productos-Elaborados",
            clavePrimaria: ["IDProducto"],
            clavesForaneas: [],
            columnas: [
                { nombre: "Orden-Lista", tipo: "numeric", nullable: true, autogeneradoOrden: true, descripcion: "Orden de aparición en listados.", restricciones: { min: 0, entero: true } },
                { nombre: "IDProducto", tipo: "text", nullable: false, descripcion: "Identificador único (clave primaria).", restricciones: {} },
                { nombre: "Comercio-Sucursal", tipo: "text", nullable: true, listadoValores: "COMPONENTE-COMBOS.Combo-Comercio-Sucursal", restricciones: { maxLongitud: 200 } },
                { nombre: "Nombre-Producto", tipo: "text", nullable: true, descripcion: "Nombre del producto elaborado.", restricciones: { maxLongitud: 500 } },
                { nombre: "Costo-Producto-Final-Actual", tipo: "numeric", nullable: true, decimales: 2, restricciones: { min: 0 } },
                { nombre: "Observaciones", tipo: "text", nullable: true, restricciones: { maxLongitud: 2000 } },
                { nombre: "Habilitado", tipo: "text", nullable: true, descripcion: "Sí / No.", restricciones: { valoresPermitidos: ["Sí", "No", ""] } }
            ],
            indices: [
                { columnas: ["IDProducto"], unico: true },
                { columnas: ["Orden-Lista"], unico: false },
                { columnas: ["Comercio-Sucursal"], unico: false }
            ]
        }]
    };

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
     * Devuelve la configuración de la hoja (embebida, sin fetch). Siempre resuelve correctamente.
     * @returns {Promise<{ nombreHoja: string, clavePrimaria: string[], columnas: Array }>}
     */
    function loadConfig() {
        var cached = window._productosElaboradosConfigCache;
        if (cached && cached.timestamp && (Date.now() - cached.timestamp < CACHE_MAX_AGE_MS)) {
            return Promise.resolve(cached.config);
        }
        try {
            var config = buildConfigFromJson(CONFIG_EMBED);
            return Promise.resolve(config);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    window.PRODUCTOS_ELABORADOS_LOAD_CONFIG = loadConfig;
})();
