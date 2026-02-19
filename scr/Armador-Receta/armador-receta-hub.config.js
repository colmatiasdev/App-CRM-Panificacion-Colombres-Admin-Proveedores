/**
 * Configuración del hub y menú del módulo Armador de Receta.
 * Controla qué secciones del hub se muestran, qué botones por sección y qué enlaces en la cabecera.
 * Las opciones del menú se controlan por vínculo (href) en menuOpciones.
 * Ubicación: nivel de carpeta del módulo (Armador-Receta).
 */
(function (global) {
    "use strict";

    global.ARMADOR_RECETA_HUB_CONFIG = {
        /**
         * Opciones del menú de navegación, definidas por vínculo (href).
         * Orden y habilitación se controlan aquí: visible = true para mostrar en la cabecera.
         * Se pueden agregar más enlaces (ej. a páginas concretas) o reordenar.
         */
        menuOpciones: [
            { href: "Receta-Base/receta-base.html", label: "Receta Base", visible: true },
            { href: "Receta-Detalle/receta-detalle.html", label: "Receta Detalle", visible: true },
            { href: "Producto-Unitario-Base/producto-unitario-base.html", label: "Producto Unitario Base", visible: true },
            { href: "Elaboracion-Productos-Base/elaboracion-productos-base.html", label: "Elaboración Productos Base", visible: true }
        ],

        /**
         * Módulos del hub. Cada uno puede mostrarse u ocultarse en el hub.
         * botones: visibilidad y texto de cada botón (listar, nuevo, etc.).
         * ocultarSiReferrerContiene: si está definido, la sección del hub se oculta cuando
         *   el referrer contiene alguna de estas cadenas (ej. llegada desde receta-base).
         */
        modulos: [
            {
                id: "receta-base",
                label: "Receta Base",
                icono: "fa-book",
                visible: true,
                rutaListar: "Receta-Base/receta-base.html",
                rutaNuevo: "Receta-Base/crear-receta-base.html",
                botones: {
                    listar: { visible: true, texto: "Listar" },
                    nuevo: { visible: true, texto: "Nuevo" }
                }
            },
            {
                id: "receta-detalle",
                label: "Receta Detalle",
                icono: "fa-list-ul",
                visible: true,
                rutaListar: "Receta-Detalle/receta-detalle.html",
                rutaNuevo: "Receta-Detalle/crear-receta-detalle.html",
                botones: {
                    listar: { visible: true, texto: "Listar" },
                    nuevo: { visible: true, texto: "Nuevo Detalle de la Receta" }
                },
                ocultarSiReferrerContiene: ["receta-base", "ver-receta-base"]
            },
            {
                id: "producto-unitario-base",
                label: "Producto Unitario Base",
                icono: "fa-cube",
                visible: true,
                rutaListar: "Producto-Unitario-Base/producto-unitario-base.html",
                rutaNuevo: "Producto-Unitario-Base/crear-producto-unitario-base.html",
                botones: {
                    listar: { visible: true, texto: "Listar" },
                    nuevo: { visible: true, texto: "Nuevo" }
                }
            },
            {
                id: "elaboracion-productos-base",
                label: "Elaboración Productos Base",
                icono: "fa-list-check",
                visible: true,
                rutaListar: "Elaboracion-Productos-Base/elaboracion-productos-base.html",
                rutaNuevo: "Elaboracion-Productos-Base/crear-elaboracion-productos-base.html",
                botones: {
                    listar: { visible: true, texto: "Listar" },
                    nuevo: { visible: true, texto: "Nuevo" }
                }
            }
        ]
    };
})(typeof window !== "undefined" ? window : this);
