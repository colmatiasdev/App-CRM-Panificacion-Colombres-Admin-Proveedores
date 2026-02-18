/**
 * Configuración de la acción Crear para Receta Base (Tabla-Receta-Base).
 */
(function () {
  var base = window.RECETA_BASE_SHEET_BASE;
  if (!base || !base.hoja) throw new Error("Cargá receta-base-sheets-base.js antes de sheets-crear-receta-base.config.js");
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "IDReceta-Base",
      alias: "ID Receta Base",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      obligatorio: true,
      descripcion: "ID autogenerado.",
      restricciones: {}
    },
    {
      nombre: "Descripcion-Masa-Producto",
      alias: "Descripción Masa Producto",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: true,
      descripcion: "Descripción de la masa.",
      restricciones: { maxLongitud: 500 }
    },
    {
      nombre: "Costo-Directo-Receta",
      alias: "Costo Directo",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      visible: true,
      obligatorio: false,
      descripcion: "Costo directo receta.",
      restricciones: { min: 0 },
      formatoVisual: "moneda"
    },
    {
      nombre: "Tiempo-Produccion-Minutos",
      alias: "Tiempo (min)",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: false,
      descripcion: "Tiempo producción minutos.",
      restricciones: { min: 0 }
    },
    {
      nombre: "Costo-Mano-Obra-Produccion",
      alias: "Costo Mano Obra",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      visible: true,
      obligatorio: false,
      descripcion: "Costo mano de obra.",
      restricciones: { min: 0 },
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Produccion[C+E]",
      alias: "Costo Producción [C+E]",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      obligatorio: false,
      descripcion: "Fórmula (solo lectura).",
      formatoVisual: "moneda"
    },
    {
      nombre: "Rendimiento-Cantidad",
      alias: "Rendimiento Cantidad",
      tipoDato: "numeric",
      tipoComponente: "text-box",
      decimales: 2,
      visible: true,
      obligatorio: true,
      descripcion: "Rendimiento cantidad.",
      restricciones: { min: 0 }
    },
    {
      nombre: "Rendimiento-UnidadMedida",
      alias: "Rendimiento U.M.",
      tipoDato: "text",
      tipoComponente: "text-box",
      visible: true,
      obligatorio: false,
      descripcion: "Unidad de medida.",
      restricciones: { maxLongitud: 50 }
    },
    {
      nombre: "Costo-Produccion-ProductoBase [F/G]",
      alias: "Costo Base [F/G]",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      obligatorio: false,
      descripcion: "Fórmula (solo lectura).",
      formatoVisual: "moneda"
    }
  ];
  window.RECETA_BASE_SHEETS_JSON = {
    modulo: base.modulo,
    descripcion: base.descripcion,
    hojas: [{
      nombre: hoja.nombre,
      nombreHoja: hoja.nombreHoja,
      clavePrimaria: hoja.clavePrimaria,
      clavesForaneas: hoja.clavesForaneas || [],
      columnasPropias: (base.hoja && Array.isArray(base.hoja.columnasPropias)) ? base.hoja.columnasPropias : [],
      columnaOrden: hoja.columnaOrden,
      prefijoId: hoja.prefijoId,
      patronId: hoja.patronId,
      indices: hoja.indices,
      columnas: columnas
    }]
  };
})();
