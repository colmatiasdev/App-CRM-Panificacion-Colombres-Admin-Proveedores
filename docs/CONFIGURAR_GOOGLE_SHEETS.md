# Configurar Google Sheets para mostrar datos en el módulo

Para que Packing o Materia prima muestren datos de una hoja de Google Sheets, seguí estos pasos.

---

## 1. Crear la hoja en Google Sheets

1. Entrá a [Google Sheets](https://sheets.google.com) y creá una hoja nueva (o usá una existente).
2. En la primera fila poné los **encabezados** (nombre de cada columna). Ejemplo para Packing:
   - `Producto` | `Costo unitario` | `Unidad` | `Observaciones`
3. Debajo cargá una fila por ítem. La primera fila siempre se usa como encabezado.

---

## 2. Publicar la hoja para obtener la URL

1. En la hoja: **Archivo** → **Compartir** → **Publicar en la Web** (o **File** → **Share** → **Publish to web**).
2. En **Vínculo**, elegí:
   - **Documento completo** o la **pestaña** que quieras (ej. "Packing" o "Materia prima").
   - Formato: **Valores separados por comas (.csv)**.
3. Clic en **Publicar**. Copiá la URL que aparece (algo como):
   ```text
   https://docs.google.com/spreadsheets/d/e/2PACX-1vXXXX.../pub?gid=0&single=true&output=csv
   ```
4. Si tenés varias pestañas, podés publicar cada una y obtener una URL por pestaña (cambia el `gid=...` en la URL). El `gid` de cada pestaña lo ves en la URL del navegador cuando hacés clic en esa pestaña (ej. `#gid=1234567890`).

---

## 3. Configurar las URLs en el proyecto

En **`config.js`** (raíz del proyecto) hay una variable por módulo:

| Variable | Módulo | Uso |
|----------|--------|-----|
| **`googleSheetPackingUrl`** | Packing | URL CSV pública de la hoja de costos de packing. |
| **`googleSheetMateriaPrimaUrl`** | Materia prima | URL CSV pública de la hoja de costo de materia prima. |

Ejemplo:

```js
googleSheetPackingUrl: "https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv",
googleSheetMateriaPrimaUrl: "https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv"
```

Cada módulo usa solo su URL; si una está vacía, esa página mostrará el mensaje para configurarla.

---

## 4. Permisos

- La hoja debe estar **publicada en la web** (paso 2). No alcanza con “cualquiera con el enlace puede ver”.
- No hace falta que nadie inicie sesión: la URL pública CSV se puede leer desde el navegador (y desde tu página) sin login.

---

## Resumen

| Dónde        | Qué configurar |
|-------------|-----------------|
| **Google Sheets** | Hoja con encabezados en la 1ª fila y datos debajo. |
| **Google Sheets** | Archivo → Publicar en la Web → CSV → copiar URL. |
| **Proyecto**      | `config.js` → `googleSheetCostosUrl` = esa URL. |

Después de guardar `config.js` y recargar la página del módulo (Packing o Materia prima), la página podrá leer esa URL y mostrar los datos (cuando el código del módulo use `APP_CONFIG.googleSheetCostosUrl` para hacer el `fetch` y pintar la tabla).
