/**
 * Configuración del módulo Elaboración Productos Base (Armador Receta).
 * Lee la config desde window.ELABORACION_PRODUCTOS_BASE_SHEETS_JSON.
 */
(function () {
  var CACHE_MAX_AGE_MS = 5 * 60 * 1000;

  var ACCIONES = {
    listar: {
      id: "listar",
      url: "elaboracion-productos-base.html",
      label: "Listar",
      visible: true,
      componente: "listado"
    },
    crear: {
      id: "crear",
      url: "crear-elaboracion-productos-base.html",
      label: "Crear",
      visible: true,
      componente: "formulario"
    },
    editar: {
      id: "editar",
      url: "editar-elaboracion-productos-base.html",
      label: "Editar",
      visible: true,
      componente: "formulario"
    },
    ver: {
      id: "ver",
      url: "ver-elaboracion-productos-base.html",
      label: "Ver",
      visible: true,
      componente: "detalle"
    }
  };

  window.ELABORACION_PRODUCTOS_BASE_ACCIONES = ACCIONES;

  function getAccionActual() {
    var id = (window.ELABORACION_PRODUCTOS_BASE_ACCION_ACTUAL || "").toLowerCase();
    return ACCIONES[id] || ACCIONES.listar;
  }
  window.ELABORACION_PRODUCTOS_BASE_GET_ACCION_ACTUAL = getAccionActual;

  function applyNavAccion() {
    var accion = getAccionActual();
    document.querySelectorAll(".costos-nav-link[data-accion]").forEach(function (a) {
      var linkAccion = a.getAttribute("data-accion");
      var activo = linkAccion === accion.id || (linkAccion === "listar" && ["crear", "editar", "ver"].indexOf(accion.id) !== -1);
      a.classList.toggle("is-active", !!activo);
    });
  }
  window.ELABORACION_PRODUCTOS_BASE_APPLY_NAV = applyNavAccion;

  function getSheetConfig(hojas, nombreHoja) {
    if (!hojas || !nombreHoja) return null;
    for (var i = 0; i < hojas.length; i++) {
      if (String(hojas[i].nombreHoja || hojas[i].nombre || "").trim() === String(nombreHoja).trim()) return hojas[i];
    }
    return hojas[0] || null;
  }

  function buildConfigFromJson(json) {
    var hojas = json.hojas || json.sheets || [];
    var hoja = getSheetConfig(hojas, "Tabla-Elaboracion-ProductosBase");
    if (!hoja) throw new Error("No se encontró la hoja Tabla-Elaboracion-ProductosBase en la configuración.");
    var nombreHoja = String(hoja.nombreHoja || hoja.nombre || "Tabla-Elaboracion-ProductosBase").trim();
    var clavePrimaria = Array.isArray(hoja.clavePrimaria) ? hoja.clavePrimaria : (hoja.idColumn ? [hoja.idColumn] : ["IDElaboracion-ProductoBase"]);
    var columnas = hoja.columnas || [];
    var listado = hoja.listado || {};
    var columnaOrden = (hoja.columnaOrden && String(hoja.columnaOrden).trim()) || null;
    var baseHoja = (window.ELABORACION_PRODUCTOS_BASE_SHEET_BASE && window.ELABORACION_PRODUCTOS_BASE_SHEET_BASE.hoja) ? window.ELABORACION_PRODUCTOS_BASE_SHEET_BASE.hoja : null;
    var config = {
      nombreHoja: nombreHoja,
      clavePrimaria: clavePrimaria,
      columnas: columnas,
      columnasPropias: Array.isArray(hoja.columnasPropias) ? hoja.columnasPropias : [],
      columnasPorNombre: {},
      indicesExtras: hoja.indices || [],
      columnasAgrupacion: Array.isArray(listado.columnasAgrupacion) ? listado.columnasAgrupacion : [],
      modosAgrupacion: Array.isArray(listado.modosAgrupacion) ? listado.modosAgrupacion : [],
      columnaFiltroValores: (listado.columnaFiltroValores && String(listado.columnaFiltroValores).trim()) || null,
      columnaOrden: columnaOrden,
      prefijoId: hoja.prefijoId != null ? hoja.prefijoId : (baseHoja && baseHoja.prefijoId),
      patronId: hoja.patronId != null ? hoja.patronId : (baseHoja && baseHoja.patronId != null ? baseHoja.patronId : 1),
      longitudAlfanum: hoja.longitudAlfanum != null ? hoja.longitudAlfanum : (baseHoja && baseHoja.longitudAlfanum != null ? baseHoja.longitudAlfanum : 15),
      digitosSufijo: hoja.digitosSufijo != null ? hoja.digitosSufijo : (baseHoja && baseHoja.digitosSufijo != null ? baseHoja.digitosSufijo : 4),
      formulas: (hoja.formulas && typeof hoja.formulas === "object") ? hoja.formulas : (baseHoja && baseHoja.formulas ? baseHoja.formulas : {})
    };
    columnas.forEach(function (col, idx) {
      var nombre = String((col.nombre || "").trim());
      if (nombre) config.columnasPorNombre[nombre] = { index: idx, col: col };
    });
    window._elaboracionProductosBaseConfigCache = { config: config, timestamp: Date.now() };
    window.ELABORACION_PRODUCTOS_BASE_CONFIG = config;
    return config;
  }

  function loadConfig() {
    var cached = window._elaboracionProductosBaseConfigCache;
    if (cached && cached.timestamp && (Date.now() - cached.timestamp < CACHE_MAX_AGE_MS)) return Promise.resolve(cached.config);
    var json = window.ELABORACION_PRODUCTOS_BASE_SHEETS_JSON;
    if (!json) return Promise.reject(new Error("Falta la configuración del módulo. Cargá el script de la acción antes de elaboracion-productos-base-config.js."));
    try { return Promise.resolve(buildConfigFromJson(json)); } catch (e) { return Promise.reject(e); }
  }
  window.ELABORACION_PRODUCTOS_BASE_LOAD_CONFIG = loadConfig;
})();
