# Configuración de hojas (Sheets) por módulo

Los archivos en esta carpeta definen las **tablas (hojas de Google Sheets)** que consume cada módulo: nombre de hoja, campos y restricciones. Sirve para:

- **Configurar** la app desde un solo lugar (nombre de tabla, clave para la API).
- **Especificar restricciones** de cada campo (obligatorio, tipo, mínimo/máximo, enum, etc.).
- **Documentar** qué columnas tiene cada hoja y cuáles se ocultan en el listado.

## Ubicación

Esta carpeta es **scr/Arquitectura/sheets/**. El módulo Productos elaborados usa **un base compartido** más **un config por acción**: la base define datos que no cambian (modulo, descripcion, nombre de hoja, clavePrimaria, prefijoId, patronId, indices); cada acción define solo las **columnas** (y en listar además **listado** para agrupación).

## Archivos

| Archivo | Módulo | Uso |
|--------|--------|--------|
| `costos-sheets.json` | Costos | packing, materiaPrima, combos, equivalencias |
| `productos-elaborados/productos-elaborados-sheets-base.js` | Productos elaborados | **Compartido.** modulo, descripcion, hoja (nombre, nombreHoja, clavePrimaria, clavesForaneas, prefijoId, patronId, indices). Cargar antes del config de la acción. |
| `productos-elaborados/listar-productos-elaborados-sheets.config.js` | Productos elaborados | Listado. Solo columnas + listado (visible en cards, agrupación). |
| `productos-elaborados/crear-producto-elaborado-sheets.config.js` | Productos elaborados | Crear. Solo columnas (comportamiento del formulario). |
| `productos-elaborados/editar-producto-elaborado-sheets.config.js` | Productos elaborados | Editar. Solo columnas (comportamiento del formulario). |
| `productos-elaborados/ver-producto-elaborado-sheets.config.js` | Productos elaborados | Ver. Solo columnas (qué mostrar en detalle). |

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

## Columnas tipo label (solo lectura / autogeneradas)

En la config de cada acción (p. ej. en `productos-elaborados/crear-producto-elaborado-sheets.config.js`), cada columna puede tener **`"label": true`**: son columnas autogeneradas por el sistema que el usuario no debe modificar (para no perder relaciones). Ejemplos: la columna de orden (`autogeneradoOrden`), la clave primaria (ID). En **crear** no se muestran campos para esas columnas; el ID se genera con la función de Arquitectura. En **editar** se muestran en solo lectura (disabled).

Para la **clave primaria** que es ID autogenerado, la hoja en el **base** define:
- **`prefijoId`**: cadena fija (ej. `"PROD-ELAB"`).
- **`patronId`**: 1 o 2.  
  - **1**: `prefijoId` + "-" + 15 caracteres alfanuméricos.  
  - **2**: `prefijoId` + "-" + alfanuméricos + "-" + 4 dígitos.

La generación está en **scr/Arquitectura/generar-id.js** (`window.GENERAR_ID_PARA_HOJA(hojaConfig)`).

## Orden y visibilidad en listado (Productos elaborados)

- **Columna de orden**: La columna con `"autogeneradoOrden": true` (ej. `Orden-Lista`) define el orden de la lista; el módulo ordena las filas por ese campo (numérico).
- **Visibilidad en la card**: Cada columna puede llevar `"visible": true` o `"visible": false`. Solo las que tienen `true` se muestran en el cuerpo de cada tarjeta del listado (el título de la card sigue siendo la columna nombre, p. ej. Nombre-Producto).

## Listado con agrupación (Productos elaborados)

En **listar-productos-elaborados-sheets.config.js** (objeto `window.PRODUCTOS_ELABORADOS_SHEETS_JSON.hojas[0]`) la hoja puede incluir un objeto **`listado`** para el listado en pantalla:

- **`columnasAgrupacion`**: array de nombres de columnas por las que agrupar por defecto (ej. `["Comercio-Sucursal"]`).
- **`modosAgrupacion`**: array de modos; cada modo es un array de columnas. Ej.: `[]` = sin agrupar, `["Comercio-Sucursal"]` = por una columna, `["Comercio-Sucursal", "Habilitado"]` = por dos. El usuario puede elegir el modo en un desplegable si hay más de un modo.

## Uso en la app

- **Costos**: usa `costos-sheets.json` como referencia; el código y el Apps Script deben mantener las mismas hojas y columnas.
- **Productos elaborados**: cargá siempre `productos-elaborados-sheets-base.js` y luego el config de la acción (`listar-`, `crear-`, `editar-` o `ver-producto-elaborado-sheets.config.js`). La base tiene los datos fijos (modulo, hoja, clavePrimaria, prefijoId, indices); cada acción define solo las **columnas** (y en listar el **listado**). Para cambiar nombre de hoja o ID, editá el base; para cambiar comportamiento por pantalla, editá el config de esa acción.

## Apps Script

El backend (Google Apps Script) debe exponer las hojas con el mismo **nombre de pestaña** que figure en la config de cada módulo (por ejemplo `getSheetByName("Listado-Productos-Elaborados")` para Productos elaborados).
