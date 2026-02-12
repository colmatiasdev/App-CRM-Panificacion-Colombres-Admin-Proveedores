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
    appsScriptUrl: "https://script.google.com/macros/s/AKfycbxYrhVGLA1TEg0384a2jfIK33EtQLEnY253Ftx2FeDMVz6Unbq-h4FtEkcRJv3bPcSptA/exec",

    /** Google Sheets – URLs públicas CSV por módulo. Ver docs/CONFIGURAR_GOOGLE_SHEETS.md */
    /** Packing: costos de empaque, envases, etiquetas. */
    googleSheetPackingUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZLbiTy2vAqNDISIC-TfpvtKjJtERv-N6aIcldP6s-LQ5EI4Og-ZYGPG8qZkl3-TTh7wYF13PWQm6E/pub?gid=1565788325&single=true&output=csv",
    /** Materia prima: precios de proveedores (insumos, harinas, etc.). */
    googleSheetMateriaPrimaUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZLbiTy2vAqNDISIC-TfpvtKjJtERv-N6aIcldP6s-LQ5EI4Og-ZYGPG8qZkl3-TTh7wYF13PWQm6E/pub?gid=0&single=true&output=csv",

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
    }
};
