/**
 * Configuración del módulo Costo Productos (Tabla-Costo-Productos).
 * Lee la config desde window.COSTO_PRODUCTOS_SHEETS_JSON. Cada página carga primero
 * costo-productos-sheets-base.js (datos fijos: modulo, hoja, clavePrimaria, prefijoId, indices)
 * y luego su script de acción (sheets-listar/crear/editar/ver-costo-productos.config.js), que solo define columnas.
 * Define las acciones (Listar, Crear, Editar, Ver) y la página HTML de cada una.
 */
(function () {
    var CACHE_MAX_AGE_MS = 5 * 60 * 1000;

    /**
     * Acciones del módulo: cada una referencia su HTML y tipo de componente.
     * visible: si la acción se muestra en la navegación/UI cuando corresponde.
     * componente: "listado" | "formulario" | "detalle" para saber qué tipo de vista mostrar.
     */
    var ACCIONES = {
        listar: {
            id: "listar",
            url: "costo-productos.html",
            label: "Listar",
            visible: true,
            componente: "listado"
        },
        crear: {
            id: "crear",
            url: "crear-costo-producto.html",
            label: "Crear",
            visible: true,
            componente: "formulario"
        },
        editar: {
            id: "editar",
            url: "editar-costo-producto.html",
            label: "Editar",
            visible: true,
            componente: "formulario"
        },
        ver: {
            id: "ver",
            url: "ver-costo-producto.html",
            label: "Ver",
            visible: true,
            componente: "detalle"
        }
    };

    window.COSTO_PRODUCTOS_ACCIONES = ACCIONES;

    /**
     * Devuelve la acción actual según lo que haya definido la página (window.COSTO_PRODUCTOS_ACCION_ACTUAL).
     * Cada HTML debe setear esa variable para que el nav marque el ítem activo.
     */
    function getAccionActual() {
        var id = (window.COSTO_PRODUCTOS_ACCION_ACTUAL || "").toLowerCase();
        return ACCIONES[id] || ACCIONES.listar;
    }

    window.COSTO_PRODUCTOS_GET_ACCION_ACTUAL = getAccionActual;

    /**
     * Aplica el estado activo al nav según la acción actual.
     * El enlace "Costo productos" (data-accion="listar") queda activo en toda la sección (listar, crear, editar, ver).
     */
    function applyNavAccion() {
        var accion = getAccionActual();
        document.querySelectorAll(".costos-nav-link[data-accion]").forEach(function (a) {
            var linkAccion = a.getAttribute("data-accion");
            var activo = linkAccion === accion.id || (linkAccion === "listar" && ["crear", "editar", "ver"].indexOf(accion.id) !== -1);
            a.classList.toggle("is-active", !!activo);
        });
    }

    window.COSTO_PRODUCTOS_APPLY_NAV = applyNavAccion;

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
        var hoja = getSheetConfig(hojas, "Tabla-Costo-Productos");
        if (!hoja) {
            throw new Error("No se encontró la hoja Tabla-Costo-Productos en la configuración.");
        }
        var nombreHoja = String(hoja.nombreHoja || hoja.nombre || "Tabla-Costo-Productos").trim();
        var clavePrimaria = Array.isArray(hoja.clavePrimaria) ? hoja.clavePrimaria : (hoja.idColumn ? [hoja.idColumn] : ["IDCosto-Producto"]);
        var columnas = hoja.columnas || [];
        var listado = hoja.listado || {};
        var columnaOrden = (hoja.columnaOrden && String(hoja.columnaOrden).trim()) || null;
        if (!columnaOrden) {
            for (var c = 0; c < columnas.length; c++) {
                if (columnas[c].autogeneradorID === true) {
                    columnaOrden = String(columnas[c].nombre || "").trim();
                    break;
                }
            }
        }
        var config = {
            nombreHoja: nombreHoja,
            clavePrimaria: clavePrimaria,
            columnas: columnas,
            columnasPropias: Array.isArray(hoja.columnasPropias) ? hoja.columnasPropias : [],
            formulas: hoja.formulas && typeof hoja.formulas === "object" ? hoja.formulas : {},
            lookups: Array.isArray(hoja.lookups) ? hoja.lookups : [],
            columnasPorNombre: {},
            indicesExtras: hoja.indices || [],
            columnasAgrupacion: Array.isArray(listado.columnasAgrupacion) ? listado.columnasAgrupacion : (listado.columnasAgrupacion ? [listado.columnasAgrupacion] : []),
            modosAgrupacion: Array.isArray(listado.modosAgrupacion) ? listado.modosAgrupacion : [],
            columnaFiltroValores: (listado.columnaFiltroValores && String(listado.columnaFiltroValores).trim()) || null,
            columnaOrden: columnaOrden,
            prefijoId: hoja.prefijoId != null ? hoja.prefijoId : null,
            patronId: hoja.patronId != null ? hoja.patronId : 1,
            longitudAlfanum: hoja.longitudAlfanum != null ? hoja.longitudAlfanum : 15,
            digitosSufijo: hoja.digitosSufijo != null ? hoja.digitosSufijo : 4
        };
        columnas.forEach(function (col, idx) {
            var nombre = String((col.nombre || "").trim());
            if (nombre) config.columnasPorNombre[nombre] = { index: idx, col: col };
        });
        window._costoProductosConfigCache = { config: config, timestamp: Date.now() };
        window.COSTO_PRODUCTOS_CONFIG = config;
        return config;
    }

    /**
     * Carga la configuración desde window.COSTO_PRODUCTOS_SHEETS_JSON
     * (script *-sheets.config.js de la acción correspondiente). Editá el config de cada acción para cambiar la config.
     * @returns {Promise<{ nombreHoja: string, clavePrimaria: string[], columnas: Array }>}
     */
    function loadConfig() {
        var cached = window._costoProductosConfigCache;
        if (cached && cached.timestamp && (Date.now() - cached.timestamp < CACHE_MAX_AGE_MS)) {
            return Promise.resolve(cached.config);
        }
        var json = window.COSTO_PRODUCTOS_SHEETS_JSON;
        if (!json) {
            return Promise.reject(new Error("Falta la configuración del módulo. Cargá el script de la acción (sheets-listar/crear/editar/ver-costo-productos.config.js) antes de costo-productos-config.js."));
        }
        try {
            return Promise.resolve(buildConfigFromJson(json));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    window.COSTO_PRODUCTOS_LOAD_CONFIG = loadConfig;
})();
