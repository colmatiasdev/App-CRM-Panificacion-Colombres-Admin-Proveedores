# Configuración de hojas (Sheets) por módulo

Cada archivo JSON en esta carpeta describe las **tablas (hojas de Google Sheets)** que consume un módulo de la app: nombre de la hoja, campos y restricciones. Sirve para:

- **Configurar** la app desde un solo lugar (nombre de tabla, clave para la API).
- **Especificar restricciones** de cada campo (obligatorio, tipo, mínimo/máximo, enum, etc.).
- **Documentar** qué columnas tiene cada hoja y cuáles se ocultan en el listado.

## Ubicación

Esta carpeta es **scr/Arquitectura/sheets/**. El módulo Productos elaborados usa como configuración el archivo **productos-elaborados-sheets.config.js** (no hay servidor que sirva el JSON). Ese `.config.js` expone `window.PRODUCTOS_ELABORADOS_SHEETS_JSON` y se carga en listado, crear y editar. La fuente de verdad para editar es **productos-elaborados-sheets.json**; después de modificarlo, hay que regenerar el `.config.js` (script en la raíz del proyecto: `node scripts/update-productos-elaborados-config.js`).

## Archivos

| Archivo | Módulo | Hojas |
|--------|--------|--------|
| `costos-sheets.json` | Costos | packing, materiaPrima, combos, equivalencias |
| `productos-elaborados-sheets.json` | Productos elaborados | Listado-Productos-Elaborados (incl. `listado.columnasAgrupacion` y `modosAgrupacion`) |

## Esquema de cada JSON

```json
{
  "module": "identificador-del-modulo",
  "description": "Breve descripción del módulo",
  "sheets": [
    {
      "name": "Nombre visible de la hoja",
      "sheetKey": "Valor del parámetro sheet en la API (GET/POST)",
      "idColumn": "Nombre de la columna ID (para update/editar)",
      "idColumnAliases": ["alias1", "alias2"],
      "columnsHiddenInList": ["Columna1", "Columna2"],
      "fields": [
        {
          "name": "Nombre exacto de la columna en la hoja",
          "type": "string|number|date|boolean",
          "required": true|false,
          "hiddenInList": true|false,
          "description": "Opcional",
          "restrictions": {
            "min": 0,
            "max": 100,
            "maxLength": 500,
            "pattern": "regex",
            "enum": ["Sí", "No", ""],
            "integer": true
          }
        }
      ]
    }
  ]
}
```

## Restricciones (`restrictions`)

| Clave | Uso | Ejemplo |
|-------|-----|--------|
| `min` | Valor mínimo (número) | `"min": 0` |
| `max` | Valor máximo (número) | `"max": 100` |
| `maxLength` | Longitud máxima (texto) | `"maxLength": 500` |
| `pattern` | Expresión regular | `"pattern": "^[A-Z0-9-]+$"` |
| `enum` | Valores permitidos | `"enum": ["Sí", "No", ""]` |
| `integer` | Solo enteros | `"integer": true` |

## Orden y visibilidad en listado (Productos elaborados)

- **Columna de orden**: La columna con `"autogeneradoOrden": true` (ej. `Orden-Lista`) define el orden de la lista; el módulo ordena las filas por ese campo (numérico).
- **Visibilidad en la card**: Cada columna puede llevar `"visibleEnCard": true` o `"visibleEnCard": false`. Solo las que tienen `true` se muestran en el cuerpo de cada tarjeta del listado (el título de la card sigue siendo la columna nombre, p. ej. Nombre-Producto).

## Listado con agrupación (Productos elaborados)

En `productos-elaborados-sheets.json` la hoja puede incluir un objeto **`listado`** para el listado en pantalla:

- **`columnasAgrupacion`**: array de nombres de columnas por las que agrupar por defecto (ej. `["Comercio-Sucursal"]`).
- **`modosAgrupacion`**: array de modos; cada modo es un array de columnas. Ej.: `[]` = sin agrupar, `["Comercio-Sucursal"]` = por una columna, `["Comercio-Sucursal", "Habilitado"]` = por dos. El usuario puede elegir el modo en un desplegable si hay más de un modo.

## Uso en la app

- Los módulos pueden **cargar** el JSON correspondiente (por ejemplo con `fetch`) y usar `sheetKey`, `idColumn` y `fields` para construir formularios y validar.
- Si no se cargan dinámicamente, estos JSON sirven como **documentación y referencia** al modificar el código o el Apps Script; al cambiar una hoja o sus columnas, actualizá primero el JSON y luego el código/Apps Script para mantenerlos alineados.

## Apps Script

El backend (Google Apps Script) debe exponer las hojas con el mismo **nombre de pestaña** o **sheetKey** que figure en cada JSON (por ejemplo `getSheetByName("Listado-Productos-Elaborados")` o un mapeo `sheetKey` → nombre de hoja).
