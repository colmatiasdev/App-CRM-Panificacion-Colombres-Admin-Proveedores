/**
 * Configuración de la acción Listar para Receta Base.
 * Cargado por receta-base.html. Requiere receta-base-sheets-base.js antes.
 */
(function () {
  var base = window.RECETA_BASE_SHEET_BASE;
  if (!base || !base.hoja) {
    throw new Error("Cargá receta-base-sheets-base.js antes de sheets-listar-receta-base.config.js");
  }
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
      descripcion: "Tiempo de producción en minutos."
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
      alias: "Costo Producción [C+E]",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Fórmula: Costo directo + Mano obra.",
      formatoVisual: "moneda"
    },
    {
      nombre: "Rendimiento-Cantidad",
      alias: "Rendimiento Cantidad",
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
      descripcion: "Unidad de medida del rendimiento."
    },
    {
      nombre: "Costo-Produccion-ProductoBase [F/G]",
      alias: "Costo Base [F/G]",
      tipoDato: "numeric",
      tipoComponente: "label",
      decimales: 2,
      visible: true,
      descripcion: "Fórmula: Costo producción / Rendimiento.",
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
      columnaOrden: hoja.columnaOrden,
      prefijoId: hoja.prefijoId,
      patronId: hoja.patronId,
      indices: hoja.indices,
      columnas: columnas,
      listado: { columnasAgrupacion: [], columnaFiltroValores: null, modosAgrupacion: [] }
    }]
  };
})();
