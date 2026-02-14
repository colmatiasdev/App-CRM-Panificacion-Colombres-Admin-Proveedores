/** Configuración compartida (contacto, redes, hojas). Cargar en páginas que lo necesiten. */
window.APP_CONFIG = {
    urlCorta: "",
    telefonoNegocio: "5493814130520",
    instagram: {
        name: "panificacioncolombres",
        url: "https://www.instagram.com/panificacioncolombres/"
    },
    plataformas: {
        pedidosYa: "https://www.pedidosya.com.ar",
        rappi: "https://www.rappi.com.ar"
    },

    /** Apps Script desplegado – ABM (list, get, search, create, update, delete). Ver docs/APPS_SCRIPT_ABM_README.md */
    appsScriptUrl: "https://script.google.com/macros/s/AKfycbxuc3g3X3_8MvfcKpxkD2Z0HhV9MOJ3wUuRsiTVMBfDZ1OqiPKs91R94ozHpa3TO1W_8A/exec",

    /**
     * Google Sheets – Un solo documento publicado con todas las hojas.
     * Documento: Costo - Proveedores (pubhtml para ver, /pub para CSV).
     * Las URLs CSV se arman desde baseUrl + gid de cada hoja (fallback cuando no hay Apps Script).
     */
    googleSheet: {
        baseUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZLbiTy2vAqNDISIC-TfpvtKjJtERv-N6aIcldP6s-LQ5EI4Og-ZYGPG8qZkl3-TTh7wYF13PWQm6E/pub",
        gids: {
            materiaPrima: 0,
            packing: 1565788325
        }
    },
    /** URLs CSV por hoja (se rellenan al final del script desde googleSheet). */
    googleSheetMateriaPrimaUrl: "",
    googleSheetPackingUrl: "",

    /** Días transcurridos actualización (columna Materia prima): umbrales para colorear celdas.
     *  normal: <= limiteNormal (ej. 0–30)
     *  amarillo: limiteNormal+1 .. limiteAmarillo (ej. 31–60)
     *  rojo: limiteAmarillo+1 .. limiteRojo (ej. 61–100)
     *  urgente: > limiteRojo (ej. >100)
     */
    diasActualizacion: {
        limiteNormal: 30,
        limiteAmarillo: 60,
        limiteRojo: 100,
        clases: {
            amarillo: "costos-dias-amarillo",
            rojo: "costos-dias-rojo",
            urgente: "costos-dias-urgente"
        }
    },

    /** Costos: mostrar sección de debug con valores y fórmula de equivalencia. */
    costos: {
        debugEquivalencia: true
    }
};
(function () {
    var gs = window.APP_CONFIG && window.APP_CONFIG.googleSheet;
    if (gs && gs.baseUrl && gs.gids) {
        window.APP_CONFIG.googleSheetMateriaPrimaUrl = gs.baseUrl + "?gid=" + gs.gids.materiaPrima + "&single=true&output=csv";
        window.APP_CONFIG.googleSheetPackingUrl = gs.baseUrl + "?gid=" + gs.gids.packing + "&single=true&output=csv";
    }
})();
