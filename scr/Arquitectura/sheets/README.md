# Configuración de hojas (Sheets) por módulo

Los archivos en esta carpeta definen las **tablas (hojas de Google Sheets)** que consume cada módulo: nombre de hoja, campos y restricciones. Sirve para:

- **Configurar** la app desde un solo lugar (nombre de tabla, clave para la API).
- **Especificar restricciones** de cada campo (obligatorio, tipo, mínimo/máximo, enum, etc.).
- **Documentar** qué columnas tiene cada hoja y cuáles se ocultan en el listado.

## Ubicación

Esta carpeta es **scr/Arquitectura/sheets/**. El módulo Productos elaborados se configura solo con **productos-elaborados/productos-elaborados-sheets.config.js**: ese archivo expone `window.PRODUCTOS_ELABORADOS_SHEETS_JSON` y se carga en listado, crear y editar. Para cambiar columnas, agrupación o visibilidad en cards, editá directamente ese `.config.js`.

## Archivos

| Archivo | Módulo | Hojas |
|--------|--------|--------|
| `costos-sheets.json` | Costos | packing, materiaPrima, combos, equivalencias |
| `productos-elaborados/productos-elaborados-sheets.config.js` | Productos elaborados | Listado-Productos-Elaborados (incl. `listado.columnasAgrupacion`, `modosAgrupacion`, `visible`) |

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

En la config de la hoja (p. ej. en `productos-elaborados/productos-elaborados-sheets.config.js`), cada columna puede tener **`"label": true`**: son columnas autogeneradas por el sistema que el usuario no debe modificar (para no perder relaciones). Ejemplos: la columna de orden (`autogeneradoOrden`), la clave primaria (ID). En **crear** no se muestran campos para esas columnas; el ID se genera con la función de Arquitectura. En **editar** se muestran en solo lectura (disabled).

Para la **clave primaria** que es ID autogenerado, la hoja debe definir:
- **`prefijoId`**: cadena fija (ej. `"PROD-ELAB"` o `"PROD-BASE"`).
- **`patronId`**: 1 o 2.  
  - **1**: `prefijoId` + "-" + 15 caracteres alfanuméricos (ej. `PROD-ELAB-4g8h6jjk64tg63`).  
  - **2**: `prefijoId` + "-" + alfanuméricos + "-" + 4 dígitos (ej. `PROD-BASE-s46g4dh4s5aazs-7522`).

La generación está en **scr/Arquitectura/generar-id.js** (`window.GENERAR_ID_PARA_HOJA(hojaConfig)`), para reutilizar en todas las tablas.

## Orden y visibilidad en listado (Productos elaborados)

- **Columna de orden**: La columna con `"autogeneradoOrden": true` (ej. `Orden-Lista`) define el orden de la lista; el módulo ordena las filas por ese campo (numérico).
- **Visibilidad en la card**: Cada columna puede llevar `"visible": true` o `"visible": false`. Solo las que tienen `true` se muestran en el cuerpo de cada tarjeta del listado (el título de la card sigue siendo la columna nombre, p. ej. Nombre-Producto).

## Listado con agrupación (Productos elaborados)

En `productos-elaborados/productos-elaborados-sheets.config.js` (objeto `window.PRODUCTOS_ELABORADOS_SHEETS_JSON.hojas[0]`) la hoja puede incluir un objeto **`listado`** para el listado en pantalla:

- **`columnasAgrupacion`**: array de nombres de columnas por las que agrupar por defecto (ej. `["Comercio-Sucursal"]`).
- **`modosAgrupacion`**: array de modos; cada modo es un array de columnas. Ej.: `[]` = sin agrupar, `["Comercio-Sucursal"]` = por una columna, `["Comercio-Sucursal", "Habilitado"]` = por dos. El usuario puede elegir el modo en un desplegable si hay más de un modo.

## Uso en la app

- **Costos**: usa `costos-sheets.json` como referencia; el código y el Apps Script deben mantener las mismas hojas y columnas.
- **Productos elaborados**: usa **productos-elaborados/productos-elaborados-sheets.config.js** (objeto `window.PRODUCTOS_ELABORADOS_SHEETS_JSON`); editá ese archivo para cambiar columnas, orden, visibilidad en cards y agrupación.

## Apps Script

El backend (Google Apps Script) debe exponer las hojas con el mismo **nombre de pestaña** que figure en la config de cada módulo (por ejemplo `getSheetByName("Listado-Productos-Elaborados")` para Productos elaborados).
