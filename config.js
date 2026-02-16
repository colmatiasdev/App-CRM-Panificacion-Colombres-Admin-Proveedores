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
/* appsScriptUrl, googleSheet y URLs CSV están en config-sheets.js (cargar después de config.js). */
