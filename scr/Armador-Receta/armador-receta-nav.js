/**
 * Construye la barra de navegación en las páginas de los submódulos de Armador de Receta.
 * Requiere: armador-receta-hub.config.js cargado y window.ARMADOR_RECETA_SUBMODULO_ACTUAL = "receta-base" | "receta-detalle" | etc.
 * El <nav> debe tener id="armador-receta-nav". Opcional: data-nav-index y data-nav-hub para rutas (por defecto desde subcarpeta: ../../../index.html, ../armador-receta.html).
 */
(function (global) {
    "use strict";

    function applySubmoduloNav() {
        var config = global.ARMADOR_RECETA_HUB_CONFIG;
        var submoduloActual = global.ARMADOR_RECETA_SUBMODULO_ACTUAL;
        if (!config || !config.subModulos || !submoduloActual) return;

        var nav = document.getElementById("armador-receta-nav");
        if (!nav) return;

        var pathIndex = nav.getAttribute("data-nav-index") || "../../../index.html";
        var pathHub = nav.getAttribute("data-nav-hub") || "../armador-receta.html";

        nav.innerHTML = "";

        var linkInicio = document.createElement("a");
        linkInicio.href = pathIndex;
        linkInicio.className = "costos-nav-link";
        linkInicio.textContent = "Inicio";
        nav.appendChild(linkInicio);

        var linkHub = document.createElement("a");
        linkHub.href = pathHub;
        linkHub.className = "costos-nav-link";
        linkHub.textContent = "Armador de Receta";
        nav.appendChild(linkHub);

        config.subModulos.forEach(function (sub) {
            if (!sub.visibleEnMenu) return;
            var a = document.createElement("a");
            if (sub.carpeta && sub.listar) {
                a.href = sub.id === submoduloActual ? sub.listar : ("../" + sub.carpeta + "/" + sub.listar);
            } else {
                a.href = "#";
            }
            a.className = "costos-nav-link" + (sub.id === submoduloActual ? " is-active" : "");
            a.setAttribute("data-accion", "listar");
            a.textContent = sub.label || sub.id;
            nav.appendChild(a);
        });
    }

    if (typeof global.ARMADOR_RECETA_APPLY_SUBMODULO_NAV === "function") {
        return;
    }
    global.ARMADOR_RECETA_APPLY_SUBMODULO_NAV = applySubmoduloNav;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applySubmoduloNav);
    } else {
        applySubmoduloNav();
    }
})(typeof window !== "undefined" ? window : this);
