/**
 * Lista de costos del producto — datos de ejemplo y render
 * Panificación Colombres
 */
(function () {
    "use strict";

    function formatMoneda(val) {
        if (val == null || isNaN(val)) return "—";
        var n = Number(val);
        var parts = n.toFixed(2).split(".");
        var intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return "$ " + intPart + "," + (parts[1] || "00");
    }

    var productosEjemplo = [
        { nombre: "Pan francés", elaboracion: 45, packing: 12, materiaPrima: 38 },
        { nombre: "Pan lactal", elaboracion: 62, packing: 28, materiaPrima: 85 },
        { nombre: "Facturas x6", elaboracion: 120, packing: 35, materiaPrima: 180 },
        { nombre: "Medialunas x6", elaboracion: 95, packing: 32, materiaPrima: 140 },
        { nombre: "Tortas negras", elaboracion: 88, packing: 45, materiaPrima: 95 },
        { nombre: "Pan integral", elaboracion: 55, packing: 15, materiaPrima: 72 },
        { nombre: "Criollos x12", elaboracion: 78, packing: 22, materiaPrima: 110 },
        { nombre: "Bizcochos de grasa x10", elaboracion: 65, packing: 18, materiaPrima: 88 },
        { nombre: "Pan de campo", elaboracion: 72, packing: 20, materiaPrima: 95 },
        { nombre: "Pre pizzas x4", elaboracion: 98, packing: 38, materiaPrima: 125 }
    ];

    function renderProducto(p, index) {
        var total = p.elaboracion + p.packing + p.materiaPrima;
        var card = document.createElement("article");
        card.className = "lista-costo-producto-card";
        card.setAttribute("aria-labelledby", "producto-nombre-" + index);

        var titulo = document.createElement("div");
        titulo.className = "lista-costo-producto-card-header";
        var nombreEl = document.createElement("h2");
        nombreEl.className = "lista-costo-producto-card-nombre";
        nombreEl.id = "producto-nombre-" + index;
        nombreEl.textContent = p.nombre;
        var rightHeader = document.createElement("div");
        rightHeader.className = "lista-costo-producto-card-header-right";
        var totalEl = document.createElement("span");
        totalEl.className = "lista-costo-producto-card-total";
        totalEl.textContent = "Costo total: " + formatMoneda(total);
        var toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.className = "lista-costo-producto-card-toggle";
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.setAttribute("aria-controls", "detalle-" + index);
        toggleBtn.setAttribute("aria-label", "Ver detalle de costos");
        toggleBtn.innerHTML = "<i class=\"fa-solid fa-chevron-down\" aria-hidden=\"true\"></i>";
        rightHeader.appendChild(totalEl);
        rightHeader.appendChild(toggleBtn);
        titulo.appendChild(nombreEl);
        titulo.appendChild(rightHeader);

        var resumen = document.createElement("div");
        resumen.className = "lista-costo-producto-card-resumen";
        resumen.setAttribute("aria-label", "Composición del costo");

        var filas = [
            { label: "Costo elaboración", valor: p.elaboracion, clase: "lista-costo-elaboracion" },
            { label: "Costo packing", valor: p.packing, clase: "lista-costo-packing" },
            { label: "Costo materia prima (directa)", valor: p.materiaPrima, clase: "lista-costo-materia-prima" }
        ];

        filas.forEach(function (f) {
            var fila = document.createElement("div");
            fila.className = "lista-costo-producto-fila " + f.clase;
            var label = document.createElement("span");
            label.className = "lista-costo-producto-fila-label";
            label.textContent = f.label;
            var valor = document.createElement("span");
            valor.className = "lista-costo-producto-fila-valor";
            valor.textContent = formatMoneda(f.valor);
            fila.appendChild(label);
            fila.appendChild(valor);
            resumen.appendChild(fila);
        });

        var barra = document.createElement("div");
        barra.className = "lista-costo-producto-barra";
        barra.setAttribute("aria-hidden", "true");
        var pctElab = total > 0 ? (p.elaboracion / total) * 100 : 0;
        var pctPack = total > 0 ? (p.packing / total) * 100 : 0;
        var pctMat = total > 0 ? (p.materiaPrima / total) * 100 : 0;
        barra.innerHTML =
            "<span class=\"lista-costo-barra-segment lista-costo-barra-elaboracion\" style=\"width:" + pctElab + "%\" title=\"Elaboración\"></span>" +
            "<span class=\"lista-costo-barra-segment lista-costo-barra-packing\" style=\"width:" + pctPack + "%\" title=\"Packing\"></span>" +
            "<span class=\"lista-costo-barra-segment lista-costo-barra-materia\" style=\"width:" + pctMat + "%\" title=\"Materia prima\"></span>";

        var detalleWrap = document.createElement("div");
        detalleWrap.className = "lista-costo-producto-card-detalle is-collapsed";
        detalleWrap.id = "detalle-" + index;
        detalleWrap.appendChild(resumen);
        detalleWrap.appendChild(barra);

        toggleBtn.addEventListener("click", function () {
            var wasCollapsed = detalleWrap.classList.contains("is-collapsed");
            detalleWrap.classList.toggle("is-collapsed");
            card.classList.toggle("is-detalle-abierto", wasCollapsed);
            var isExpanded = !detalleWrap.classList.contains("is-collapsed");
            toggleBtn.setAttribute("aria-expanded", isExpanded ? "true" : "false");
            toggleBtn.setAttribute("aria-label", isExpanded ? "Ocultar detalle de costos" : "Ver detalle de costos");
            var icon = toggleBtn.querySelector("i");
            if (icon) {
                icon.className = isExpanded ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down";
            }
        });

        card.appendChild(titulo);
        card.appendChild(detalleWrap);

        return card;
    }

    function init() {
        var contenedor = document.getElementById("lista-costo-producto-contenido");
        if (!contenedor) return;

        productosEjemplo.forEach(function (p, i) {
            contenedor.appendChild(renderProducto(p, i));
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
