/**
 * Configuración del módulo Receta Detalle (Armador Receta).
 * Lee la config desde window.RECETA_DETALLE_SHEETS_JSON.
 */
(function () {
  var CACHE_MAX_AGE_MS = 5 * 60 * 1000;
  var ACCIONES = {
    listar: { id: "listar", url: "receta-detalle.html", label: "Listar", visible: true, componente: "listado" },
    crear: { id: "crear", url: "crear-receta-detalle.html", label: "Nuevo Detalle de la Receta", visible: true, componente: "formulario" },
    editar: { id: "editar", url: "editar-receta-detalle.html", label: "Editar", visible: true, componente: "formulario" },
    ver: { id: "ver", url: "ver-receta-detalle.html", label: "Ver Receta", visible: true, componente: "detalle" }
  };
  window.RECETA_DETALLE_ACCIONES = ACCIONES;

  function getAccionActual() {
    var id = (window.RECETA_DETALLE_ACCION_ACTUAL || "").toLowerCase();
    return ACCIONES[id] || ACCIONES.listar;
  }
  window.RECETA_DETALLE_GET_ACCION_ACTUAL = getAccionActual;

  function applyNavAccion() {
    var accion = getAccionActual();
    document.querySelectorAll(".costos-nav-link[data-accion]").forEach(function (a) {
      var linkAccion = a.getAttribute("data-accion");
      var activo = linkAccion === accion.id || (linkAccion === "listar" && ["crear", "editar", "ver"].indexOf(accion.id) !== -1);
      a.classList.toggle("is-active", !!activo);
    });
  }
  window.RECETA_DETALLE_APPLY_NAV = applyNavAccion;

  function getSheetConfig(hojas, nombreHoja) {
    if (!hojas || !nombreHoja) return null;
    for (var i = 0; i < hojas.length; i++) {
      if (String(hojas[i].nombreHoja || hojas[i].nombre || "").trim() === String(nombreHoja).trim()) return hojas[i];
    }
    return hojas[0] || null;
  }

  function buildConfigFromJson(json) {
    var hojas = json.hojas || json.sheets || [];
    var hoja = getSheetConfig(hojas, "Tabla-Receta-Base-Detalle") || (hojas[0] || null);
    if (!hoja) throw new Error("No se encontró la hoja Tabla-Receta-Base-Detalle en la configuración.");
    var nombreHoja = String(hoja.nombreHoja || hoja.nombre || "Tabla-Receta-Base-Detalle").trim();
    var clavePrimaria = Array.isArray(hoja.clavePrimaria) ? hoja.clavePrimaria : (hoja.idColumn ? [hoja.idColumn] : ["IDReceta-Base-Detalle"]);
    var columnas = hoja.columnas || [];
    var listado = hoja.listado || {};
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
      columnaOrden: (hoja.columnaOrden && String(hoja.columnaOrden).trim()) || null,
      prefijoId: hoja.prefijoId != null ? hoja.prefijoId : null,
      patronId: hoja.patronId != null ? hoja.patronId : 1,
      longitudAlfanum: hoja.longitudAlfanum != null ? hoja.longitudAlfanum : 15,
      digitosSufijo: hoja.digitosSufijo != null ? hoja.digitosSufijo : 4,
      formulas: hoja.formulas || {},
      lookups: Array.isArray(hoja.lookups) ? hoja.lookups : []
    };
    columnas.forEach(function (col, idx) {
      var nombre = String((col.nombre || "").trim());
      if (nombre) config.columnasPorNombre[nombre] = { index: idx, col: col };
    });
    var accionId = (window.RECETA_DETALLE_GET_ACCION_ACTUAL && window.RECETA_DETALLE_GET_ACCION_ACTUAL()) ? window.RECETA_DETALLE_GET_ACCION_ACTUAL().id : "";
    window._recetaDetalleConfigCache = { config: config, timestamp: Date.now(), accionId: accionId };
    window.RECETA_DETALLE_CONFIG = config;
    return config;
  }

  function loadConfig() {
    var accionId = (window.RECETA_DETALLE_GET_ACCION_ACTUAL && window.RECETA_DETALLE_GET_ACCION_ACTUAL()) ? window.RECETA_DETALLE_GET_ACCION_ACTUAL().id : "";
    var cached = window._recetaDetalleConfigCache;
    if (cached && cached.accionId === accionId && cached.timestamp && (Date.now() - cached.timestamp < CACHE_MAX_AGE_MS)) return Promise.resolve(cached.config);
    var json = window.RECETA_DETALLE_SHEETS_JSON;
    if (!json) return Promise.reject(new Error("Falta la configuración del módulo. Cargá el script de la acción antes de receta-detalle-config.js."));
    try {
      return Promise.resolve(buildConfigFromJson(json));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  window.RECETA_DETALLE_LOAD_CONFIG = loadConfig;
})();
