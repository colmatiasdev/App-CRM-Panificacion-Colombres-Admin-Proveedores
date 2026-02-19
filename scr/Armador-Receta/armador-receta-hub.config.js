/**
 * Configuración del hub y menú del módulo Armador de Receta.
 * Módulo principal: Armador-Receta. Submódulos: Receta-Base, Receta-Detalle, Producto-Unitario-Base, Elaboracion-Productos-Base.
 * Controla hub, menú del hub y menú de las páginas de cada submódulo (visibleEnMenu, botones).
 */
(function (global) {
    "use strict";

    global.ARMADOR_RECETA_HUB_CONFIG = {
        /** Rutas desde la carpeta del módulo (Armador-Receta) hacia índice y hub */
        pathIndex: "../../index.html",
        pathHub: "armador-receta.html",

        /**
         * Opciones del menú en la página principal (hub). Definidas por vínculo (href).
         */
        menuOpciones: [
            { href: "Receta-Base/receta-base.html", label: "Receta Base", visible: true },
            { href: "Receta-Detalle/receta-detalle.html", label: "Receta Detalle", visible: true },
            { href: "Producto-Unitario-Base/producto-unitario-base.html", label: "Producto Unitario Base", visible: true },
            { href: "Elaboracion-Productos-Base/elaboracion-productos-base.html", label: "Elaboración Productos Base", visible: true }
        ],

        /**
         * Submódulos: definen el menú lateral en las páginas dentro de cada submódulo.
         * visibleEnMenu: si el ítem aparece en la barra de navegación de las subpáginas.
         * botones: habilitar/deshabilitar botones "Listar" y "Nuevo" en las vistas del submódulo.
         * carpeta: nombre de la carpeta (ej. Receta-Base). listar: nombre del archivo listar (ej. receta-base.html).
         */
        subModulos: [
            {
                id: "receta-base",
                label: "Receta Base",
                carpeta: "Receta-Base",
                listar: "receta-base.html",
                visibleEnMenu: true,
                botones: { listar: true, nuevo: true }
            },
            {
                id: "receta-detalle",
                label: "Receta Detalle",
                carpeta: "Receta-Detalle",
                listar: "receta-detalle.html",
                visibleEnMenu: true,
                botones: { listar: true, nuevo: true }
            },
            {
                id: "producto-unitario-base",
                label: "Producto Unitario Base",
                carpeta: "Producto-Unitario-Base",
                listar: "producto-unitario-base.html",
                visibleEnMenu: true,
                botones: { listar: true, nuevo: true }
            },
            {
                id: "elaboracion-productos-base",
                label: "Elaboración Productos Base",
                carpeta: "Elaboracion-Productos-Base",
                listar: "elaboracion-productos-base.html",
                visibleEnMenu: true,
                botones: { listar: true, nuevo: true }
            }
        ],

        /**
         * Módulos del hub (secciones en armador-receta.html). Cada uno puede mostrarse u ocultarse en el hub.
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
