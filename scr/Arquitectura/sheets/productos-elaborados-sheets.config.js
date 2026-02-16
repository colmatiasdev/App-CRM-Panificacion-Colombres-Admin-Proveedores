/**
 * Configuración del módulo Productos elaborados.
 * Es la única fuente de configuración del módulo: columnas, orden, visible, agrupación.
 * Para cambiar el comportamiento del módulo, editá este archivo directamente.
 */
window.PRODUCTOS_ELABORADOS_SHEETS_JSON = {
  "modulo": "productos-elaborados",
  "descripcion": "Módulo Productos elaborados (Armador de Productos). Listado y ABM sobre la hoja Listado-Productos-Elaborados.",
  "hojas": [
    {
      "nombre": "Listado-Productos-Elaborados",
      "nombreHoja": "Listado-Productos-Elaborados",
      "clavePrimaria": [
        "IDProducto"
      ],
      "clavesForaneas": [],
      "columnas": [
        {
          "nombre": "Orden-Lista",
          "tipo": "numeric",
          "nullable": true,
          "autogeneradoOrden": true,
          "visible": false,
          "descripcion": "Orden de aparición en listados. Se puede autogenerar.",
          "restricciones": {
            "min": 0,
            "entero": true
          }
        },
        {
          "nombre": "IDProducto",
          "tipo": "text",
          "nullable": false,
          "visible": false,
          "descripcion": "Identificador único del producto (clave primaria).",
          "restricciones": {}
        },
        {
          "nombre": "Comercio-Sucursal",
          "tipo": "text",
          "nullable": true,
          "visible": false,
          "listadoValores": "COMPONENTE-COMBOS.Combo-Comercio-Sucursal",
          "descripcion": "Comercio o sucursal asociada; valores desde combo.",
          "restricciones": {
            "maxLongitud": 200
          }
        },
        {
          "nombre": "Nombre-Producto",
          "tipo": "text",
          "nullable": true,
          "visible": true,
          "descripcion": "Nombre del producto elaborado.",
          "restricciones": {
            "maxLongitud": 500
          }
        },
        {
          "nombre": "Costo-Producto-Final-Actual",
          "tipo": "numeric",
          "nullable": true,
          "decimales": 2,
          "visible": true,
          "descripcion": "Costo final actual del producto.",
          "restricciones": {
            "min": 0
          }
        },
        {
          "nombre": "Observaciones",
          "tipo": "text",
          "nullable": true,
          "visible": false,
          "restricciones": {
            "maxLongitud": 2000
          }
        },
        {
          "nombre": "Habilitado",
          "tipo": "text",
          "nullable": true,
          "visible": false,
          "descripcion": "Sí / No.",
          "restricciones": {
            "valoresPermitidos": [
              "Sí",
              "No",
              ""
            ]
          }
        }
      ],
      "indices": [
        {
          "columnas": [
            "IDProducto"
          ],
          "unico": true
        },
        {
          "columnas": [
            "Orden-Lista"
          ],
          "unico": false
        },
        {
          "columnas": [
            "Comercio-Sucursal"
          ],
          "unico": false
        }
      ],
      "listado": {
        "columnasAgrupacion": [
          "Comercio-Sucursal"
        ],
        "modosAgrupacion": [
          [],
          [
            "Comercio-Sucursal"
          ],
          [
            "Comercio-Sucursal",
            "Habilitado"
          ]
        ]
      }
    }
  ]
};
