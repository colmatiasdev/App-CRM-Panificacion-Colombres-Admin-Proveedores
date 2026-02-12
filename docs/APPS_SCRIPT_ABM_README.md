# Apps Script – ABM completo y filtros de búsqueda

Archivos para usar en tu proyecto de Google Apps Script:

1. **APPS_SCRIPT_CONFIG_ABM.gs** – Configuración de hojas, columnas, filtros e IDs.
2. **APPS_SCRIPT_ABM_HANDLERS.gs** – `doGet` / `doPost` que implementan list, get, create, update, delete y search.

---

## Configuración (CONFIG)

En **APPS_SCRIPT_CONFIG_ABM.gs** podés definir:

| Clave | Uso |
|-------|-----|
| `spreadsheetId` | ID del libro. Vacío = libro donde está el script. |
| `materiaPrima.sheetName` / `gid` | Hoja de Materia Prima (nombre o gid). |
| `materiaPrima.headers` | Array de nombres de columnas en orden A, B, C… |
| `materiaPrima.idColumn` | Columna que identifica la fila (ej. `idmateria-prima`). |
| `materiaPrima.idPrefix` | Prefijo para nuevos IDs (ej. `COSTO-MP-`). |
| `materiaPrima.filterColumns` | Columnas por las que se puede filtrar/buscar. |
| `materiaPrima.requiredOnCreate` | Columnas obligatorias al dar de alta. |
| `packing.*` | Igual estructura para la hoja Packing. |

---

## Acciones (parámetro `action`)

Todas las peticiones usan el parámetro **`action`**. Opcionalmente **`sheet`** = `materiaPrima` o `packing` (por defecto `materiaPrima`).

### 1. Listar – `action=list`

- **GET** `?action=list&sheet=materiaPrima&limit=100&offset=0`
- Devuelve: `{ headers, rows, total }`.

### 2. Obtener uno – `action=get`

- **GET** `?action=get&sheet=materiaPrima&id=COSTO-MP-xxxx`
- O por nombre de columna: `&idmateria-prima=COSTO-MP-xxxx`
- Devuelve: un objeto con la fila.

### 3. Buscar / filtrar – `action=search`

- **GET** `?action=search&sheet=materiaPrima&q=harina`  
  Búsqueda libre en las columnas definidas en `filterColumns`.

- **GET** `?action=search&sheet=materiaPrima&Categoria=HARINAS&Nombre Producto=Harina`  
  Filtros por columna (coincidencia que contenga el texto).

- Parámetros opcionales:
  - `limit` – máximo de filas (ej. 100).
  - `offset` – desde qué fila (paginación).
  - `sortBy` – nombre de columna para ordenar.
  - `sortOrder` – `asc` o `desc`.

- Devuelve: `{ headers, rows, total }`.

### 4. Alta – `action=create`

- **POST** con body JSON o form: `action=create&sheet=materiaPrima` y el resto de campos como parámetros o en el JSON.
- Si no enviás `idmateria-prima`, se genera uno con `idPrefix` + valor alfanumérico único.
- Devuelve: el objeto creado (con id asignado).

### 5. Modificación – `action=update`

- **POST** `action=update&sheet=materiaPrima&id=COSTO-MP-xxxx` y los campos a actualizar (o en body JSON).
- No se puede cambiar el id; el resto de columnas sí.
- Devuelve: el objeto actualizado.

### 6. Baja – `action=delete`

- **GET** o **POST** `?action=delete&sheet=materiaPrima&id=COSTO-MP-xxxx`
- Elimina la fila correspondiente.
- Devuelve: `{ deleted: "COSTO-MP-xxxx" }`.

### 7. Rellenar IDs vacíos – `action=fillIds`

- **GET** `?action=fillIds&sheet=materiaPrima` (o `sheet=packing`)
- Recorre todas las filas de la hoja y, donde la columna **idmateria-prima** (o **idpacking**) esté vacía, escribe un ID generado (COSTO-MP-xxx o COSTO-PK-xxx).
- **Modifica la hoja directamente.** Conviene ejecutarlo una vez para completar IDs existentes.
- Devuelve: `{ updated: 42, sheet: "materiaPrima" }`.

---

## Formato de respuesta

Todas las respuestas son JSON:

```json
{ "success": true, "data": { ... }, "error": null }
{ "success": false, "data": null, "error": "mensaje" }
```

---

## Despliegue

1. En el editor de Apps Script: **Implementar** → **Nueva implementación** → tipo **Aplicación web**.
2. **Ejecutar la app como**: Yo.
3. **Quién puede acceder**: según necesites (solo tu org o “Cualquier usuario” para probar desde el front).
4. Copiá la URL del despliegue y usala en el front como base para las llamadas (ej. `fetch(url + '?action=list&sheet=materiaPrima')`).

---

## Ajustar headers de Packing

En **APPS_SCRIPT_CONFIG_ABM.gs**, la sección `packing.headers` está con columnas de ejemplo. Revisá la pestaña Packing de tu hoja y reemplazá el array por los nombres reales de cada columna en orden (A, B, C…).
