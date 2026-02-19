/**
 * Configuración de la acción Ver para Receta Base (Tabla-Receta-Base).
 */
(function () {
  var base = window.RECETA_BASE_SHEET_BASE;
  if (!base || !base.hoja) throw new Error("Cargá receta-base-sheets-base.js antes de sheets-ver-receta-base.config.js");
  var hoja = base.hoja;
  var columnas = [
    {
      nombre: "IDReceta-Base",
      alias: "ID Receta Base",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Identificador único."
    },
    {
      nombre: "Descripcion-Masa-Producto",
      alias: "Descripción Masa Producto",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Descripción de la masa."
    },
    {
      nombre: "Costo-Directo-Receta",
      alias: "Costo Directo",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Costo directo receta.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Tiempo-Produccion-Minutos",
      alias: "Tiempo (min)",
      tipoDato: "numeric",
      tipoComponente: "label",
      visible: true,
      descripcion: "Tiempo de producción."
    },
    {
      nombre: "Costo-Mano-Obra-Produccion",
      alias: "Costo Mano Obra",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Costo mano de obra.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Costo-Produccion[C+E]",
      alias: "Costo Producción",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Fórmula C+E.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Rendimiento-Cantidad",
      alias: "Cant. Rendimiento",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Rendimiento cantidad."
    },
    {
      nombre: "Rendimiento-UnidadMedida",
      alias: "Rendimiento U.M.",
      tipoDato: "text",
      tipoComponente: "label",
      visible: true,
      descripcion: "Unidad de medida."
    },
    {
      nombre: "Costo-Produccion-ProductoBase [F/G]",
      alias: "Costo [Receta / Rendimiento]",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Fórmula F/G.",
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
      columnasPropias: Array.isArray(hoja.columnasPropias) ? hoja.columnasPropias : [],
      columnaOrden: hoja.columnaOrden,
      prefijoId: hoja.prefijoId,
      patronId: hoja.patronId,
      indices: hoja.indices,
      columnas: columnas
    }]
  };
})();
