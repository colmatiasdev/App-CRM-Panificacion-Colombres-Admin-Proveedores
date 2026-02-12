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

    /** Google Sheets: URL pública CSV para Packing (y para Materia prima si no definís la siguiente).
     *  Ver docs/CONFIGURAR_GOOGLE_SHEETS.md para obtener esta URL. */
    googleSheetCostosUrl: "",
    /** URL CSV para Materia prima (opcional). Si está vacío, se usa googleSheetCostosUrl. */
    googleSheetMateriaPrimaUrl: ""
};
