/**
 * Módulo Lista de precios — JavaScript
 * Panificación Colombres
 */
(function () {
    "use strict";

    function init() {
        // Inicialización del módulo (filtros, carga de datos, etc. cuando se implementen)
        var menu = document.querySelector(".lista-precios-menu, .costos-lista-precios-menu");
        if (menu) {
            menu.setAttribute("role", "navigation");
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
