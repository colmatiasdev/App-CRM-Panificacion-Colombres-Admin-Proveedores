# Hojas de Google Sheets – columnas y uso

Resumen de cada hoja que usa el proyecto y las columnas que espera (primera fila = encabezados). Los nombres de columna pueden variar en mayúsculas/minúsculas; el código intenta reconocer variantes.

---

## 1. Menú simple

**Nombre en config:** `menuSimpleSheetName` (ej. `menu-toro-rapido-web-simple`)

**Uso:** Listado de productos por categoría para el menú simple.

| Columna sugerida | Descripción |
|------------------|-------------|
| Categoria / categoria | Nombre de la categoría (ej. Burgers, Bebidas). |
| Producto / nombre | Nombre del producto. |
| Descripcion / descripcion | Descripción corta. |
| Precio Actual / precio / Precio | Precio en pesos (número o texto con número). |
| Imagen / img | URL de la imagen. |
| Producto Agotado / agotado | SI/NO. SI = no disponible. |
| Stock | Opcional. Número; si > 0 suele considerarse disponible. |
| idproducto / id / codigo | ID único del producto (para opciones y detalle). |
| orden / order | Orden dentro de la categoría (número). |
| Habilitado / activo | SI/NO. NO = no se muestra en el menú. |
| Precio Regular | Opcional. Precio “antes” para mostrar oferta. |
| Mostar Descuento / Mostrar Descuento | SI/NO. SI = mostrar bloque oferta si Precio Regular > Precio Actual. |
| Es Destacado | SI/NO. Para destacar en la UI. |

---

## 2. Menú compuesto

**Nombre en config:** `menuCompuestoSheetName` (ej. `menu-toro-rapido-web-compuesto`)

**Uso:** Listado principal del menú compuesto. Cada fila es un ítem; si **Tipo Menu** = MENU-COMPUESTO, se complementa con la hoja de detalle.

| Columna sugerida | Descripción |
|------------------|-------------|
| orden | Orden. |
| idmenu-unico / idproducto | ID único del ítem (se usa para enlaces y opciones). |
| Tipo Menu / tipomenu | MENU-SIMPLE o MENU-COMPUESTO. |
| idmenu-variable | Relaciona con la hoja de detalle (mismo valor allí). |
| Categoria / categoria | Categoría del ítem. |
| Producto / nombre | Nombre. |
| Descripcion Producto / Descripcion | Descripción. |
| Precio Actual / Precio | Precio en pesos. |
| Precio Regular | Precio “antes” para oferta. |
| Mostar Descuento / Mostrar Descuento | SI/NO para mostrar oferta. |
| Porcentaje Descuento | Opcional; si no se usa, se calcula desde precios. |
| Imagen / img | URL de la imagen. |
| Es Destacado | SI/NO. |
| Producto Agotado / Agotado | SI/NO. |
| Stock | Opcional. |
| Habilitado | SI/NO. NO = no se muestra. |

---

## 3. Menú compuesto – detalle

**Nombre en config:** `menuCompuestoDetalleSheetName` (ej. `menu-compuesto-detalle`)

**Uso:** Subítems de cada ítem con Tipo Menu = MENU-COMPUESTO. Se cruza por **idmenu-variable**.

| Columna sugerida | Descripción |
|------------------|-------------|
| idmenu-variable | Debe coincidir con la columna idmenu-variable del menú compuesto. |
| idproducto / id | Opcional. ID del subítem. |
| Cantidad | Cantidad (ej. 1, 2). |
| Producto / nombre | Nombre del subítem. |
| Precio Unitario Actual / Precio Total Actual | Opcional. Precios. |
| Imagen | Opcional. |
| Producto Agotado / Agotado | SI/NO. |
| Stock | Opcional. |
| Habilitado | SI/NO. |

---

## 4. Opciones / agregados por producto

**Nombre en config:** `menuOpcionesSheetName` (ej. `menu-opciones`)

**Uso:** Grupos de opciones (aderezo, tamaño, agregados, guarnición) y recargos. Una fila por opción; el **idproducto** debe coincidir con el ID del producto en la hoja del menú.

| Columna | Descripción |
|---------|-------------|
| idproducto | Mismo valor que idproducto o idmenu-unico en la hoja del menú. |
| Grupo | Nombre del grupo (ej. Aderezo, Tamaño, Guarnición). |
| Tipo | `uno` = una opción; `varios` = varias. |
| Obligatorio | SI = obligatorio elegir al menos una opción del grupo. |
| Opcion | Nombre de la opción (ej. Mayonesa, Grande). |
| Recargo | Precio extra en pesos (0 o vacío = sin recargo). |

Documentación detallada: [MENU_OPCIONES_SHEET.md](MENU_OPCIONES_SHEET.md).

---

## 5. Horario de atención

**Nombre en config:** `horarioSheetName` (ej. `HORARIO-TORO-RAPIDO`)

**Uso:** Define por día de la semana los horarios de apertura y cierre. El front calcula si el local está abierto y muestra avisos/cuenta regresiva.

| Columna | Descripción |
|---------|-------------|
| IDHORARIO | Identificador (opcional). |
| DIA | Nombre del día: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo. |
| HORA DESDE | Hora de apertura (0–23). |
| MINUTO DESDE | Minuto de apertura (0–59). |
| HORA HASTA | Hora de cierre (0–23). |
| MINUTO HASTA | Minuto de cierre (0–59). |

Documentación: [APPS_SCRIPT_HORARIO_FERIADO.md](APPS_SCRIPT_HORARIO_FERIADO.md).

---

## 6. Feriados

**Nombre en config:** `feriadoSheetName` (ej. `FERIADO-TORO-RAPIDO`)

**Uso:** Fechas especiales; si SE_ATIENDE = NO, el local se considera cerrado ese día (y opcionalmente se muestra leyenda días antes).

| Columna | Descripción |
|---------|-------------|
| FECHA | Fecha en formato YYYY-MM-DD. |
| FECHA TEXTO | Opcional. Texto para mostrar. |
| NOMBRE | Nombre del feriado. |
| SE_ATIENDE | SI/NO. NO = no se atiende ese día. |
| HORA DESDE, MINUTO DESDE, HORA HASTA, MINUTO HASTA | Opcional. Horario especial ese día. |
| MOTIVO | Opcional. |

---

## Resumen de nombres en config.js

| Variable en config.js | Hoja típica |
|-----------------------|-------------|
| `menuSimpleSheetName` | menu-toro-rapido-web-simple |
| `menuCompuestoSheetName` | menu-toro-rapido-web-compuesto |
| `menuCompuestoDetalleSheetName` | menu-compuesto-detalle |
| `menuOpcionesSheetName` | menu-opciones |
| `horarioSheetName` | HORARIO-TORO-RAPIDO |
| `feriadoSheetName` | FERIADO-TORO-RAPIDO |

Estos nombres deben coincidir con las **pestañas** del libro de Google Sheets vinculado al Apps Script.
