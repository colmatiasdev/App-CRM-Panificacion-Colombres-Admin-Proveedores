/**
 * Configuración del módulo Producto Unitario Base (Armador Receta).
 * Lee la config desde window.PRODUCTO_UNITARIO_BASE_SHEETS_JSON. Cada página carga primero
 * producto-unitario-base-sheets-base.js y luego su script de acción (sheets-listar/crear/editar/ver-*.config.js).
 */
(function () {
  var CACHE_MAX_AGE_MS = 5 * 60 * 1000;

  var ACCIONES = {
    listar: {
      id: "listar",
      url: "producto-unitario-base.html",
      label: "Listar",
      visible: true,
      componente: "listado"
    },
    crear: {
      id: "crear",
      url: "crear-producto-unitario-base.html",
      label: "Crear",
      visible: true,
      componente: "formulario"
    },
    editar: {
      id: "editar",
      url: "editar-producto-unitario-base.html",
      label: "Editar",
      visible: true,
      componente: "formulario"
    },
    ver: {
      id: "ver",
      url: "ver-producto-unitario-base.html",
      label: "Ver",
      visible: true,
      componente: "detalle"
    }
  };

  window.PRODUCTO_UNITARIO_BASE_ACCIONES = ACCIONES;

  function getAccionActual() {
    var id = (window.PRODUCTO_UNITARIO_BASE_ACCION_ACTUAL || "").toLowerCase();
    return ACCIONES[id] || ACCIONES.listar;
  }
  window.PRODUCTO_UNITARIO_BASE_GET_ACCION_ACTUAL = getAccionActual;

  function applyNavAccion() {
    var accion = getAccionActual();
    document.querySelectorAll(".costos-nav-link[data-accion]").forEach(function (a) {
      var linkAccion = a.getAttribute("data-accion");
      var activo = linkAccion === accion.id || (linkAccion === "listar" && ["crear", "editar", "ver"].indexOf(accion.id) !== -1);
      a.classList.toggle("is-active", !!activo);
    });
  }
  window.PRODUCTO_UNITARIO_BASE_APPLY_NAV = applyNavAccion;

  function getSheetConfig(hojas, nombreHoja) {
    if (!hojas || !nombreHoja) return null;
    for (var i = 0; i < hojas.length; i++) {
      if (String(hojas[i].nombreHoja || hojas[i].nombre || "").trim() === String(nombreHoja).trim()) return hojas[i];
    }
    return hojas[0] || null;
  }

  function buildConfigFromJson(json) {
    var hojas = json.hojas || json.sheets || [];
    var hoja = getSheetConfig(hojas, "Tabla-Costos-ProductoUnitario") || getSheetConfig(hojas, "Tabla-Receta-Base") || (hojas[0] || null);
    if (!hoja) throw new Error("No se encontró la hoja en la configuración (Tabla-Costos-ProductoUnitario o Tabla-Receta-Base).");
    var nombreHoja = String(hoja.nombreHoja || hoja.nombre || "Tabla-Costos-ProductoUnitario").trim();
    var clavePrimaria = Array.isArray(hoja.clavePrimaria) ? hoja.clavePrimaria : (hoja.idColumn ? [hoja.idColumn] : ["IDCosto-ProductoUnitario"]);
    var columnas = hoja.columnas || [];
    var listado = hoja.listado || {};
    var columnaOrden = (hoja.columnaOrden && String(hoja.columnaOrden).trim()) || "Orden";
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
      prefijoId: hoja.prefijoId != null ? hoja.prefijoId : null,
      patronId: hoja.patronId != null ? hoja.patronId : 1,
      longitudAlfanum: hoja.longitudAlfanum != null ? hoja.longitudAlfanum : 15,
      digitosSufijo: hoja.digitosSufijo != null ? hoja.digitosSufijo : 4
    };
    columnas.forEach(function (col, idx) {
      var nombre = String((col.nombre || "").trim());
      if (nombre) config.columnasPorNombre[nombre] = { index: idx, col: col };
    });
    window._productoUnitarioBaseConfigCache = { config: config, timestamp: Date.now() };
    window.PRODUCTO_UNITARIO_BASE_CONFIG = config;
    return config;
  }

  function loadConfig() {
    var cached = window._productoUnitarioBaseConfigCache;
    if (cached && cached.timestamp && (Date.now() - cached.timestamp < CACHE_MAX_AGE_MS)) return Promise.resolve(cached.config);
    var json = window.PRODUCTO_UNITARIO_BASE_SHEETS_JSON;
    if (!json) return Promise.reject(new Error("Falta la configuración del módulo. Cargá el script de la acción antes de producto-unitario-base-config.js."));
    try {
      return Promise.resolve(buildConfigFromJson(json));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  window.PRODUCTO_UNITARIO_BASE_LOAD_CONFIG = loadConfig;
})();
