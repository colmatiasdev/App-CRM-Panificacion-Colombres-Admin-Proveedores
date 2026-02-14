# Hoja de equivalencias de unidades

La app de Costos usa esta hoja para saber cómo convertir entre unidades (ej.: 10 m → 1000 cm, 1 kg → 1000 g). Podés tener **equivalencias universales** (las estándar) y **personalizadas** (las que agregues vos).

---

## 1. Crear la hoja en Google Sheets

1. En el mismo libro donde tenés **PRECIO-Materia-Prima**, **COMBOS**, etc., creá una nueva hoja.
2. Ponéle nombre, por ejemplo: **EQUIVALENCIAS**.
3. En la **primera fila** (encabezados) usá exactamente estas columnas:

| Categoria | Unidad | Factor | Convertir-UnidadMedida | Factor-Unidad-Equivalencia | Convertido-UnidadMedida | Alias | Tipo | Notas |
|-----------|--------|--------|-------------------------|----------------------------|--------------------------|-------|------|-------|

---

## 2. Significado de cada columna

| Columna    | Obligatorio | Descripción |
|------------|-------------|-------------|
| **Categoria** | Sí | Agrupa unidades que se pueden convertir entre sí. Valores típicos: `masa`, `volumen`, `longitud`, `conteo`. Podés crear categorías propias (ej. `superficie`). |
| **Unidad** | Sí | Nombre principal de la unidad (ej. `gramos`, `kg`, `metro`, `centimetro`, `docena`). Se usa tal cual para mostrar y para buscar. Coincide con la opción elegida en **Presentación** (unidad) en los formularios de Materia prima y Packing. |
| **Factor**  | Sí | Número que indica cuántas **unidades base** de esa categoría equivalen a **1** de esta unidad. La unidad base de la categoría tiene factor **1**. Ejemplos: 1 kg = 1000 g → para categoría `masa` (base = gramos), `kg` tiene factor `1000`; 1 m = 100 cm → para `longitud` (base = centimetro), `metro` tiene factor `100`. |
| **Convertir-UnidadMedida** | No (recomendado) | Valor que se muestra en el campo **Convertir A** de los formularios (crear/editar Materia prima y Packing) según la unidad de presentación elegida (ej. `Gramos`, `CC`, `Unidad`). Campo de solo lectura con icono de calculadora. |
| **Factor-Unidad-Equivalencia** | No (recomendado) | Valor que se muestra en el campo **Equivalencia** de los formularios según la unidad de presentación elegida. Si está vacío, la app puede usar el valor de **Factor**. |
| **Convertido-UnidadMedida** | No (recomendado) | Unidad de destino para la conversión (ej. `Gramos`, `Litro`, `Unidad`). Se muestra en el campo **Convertido a** de los formularios según la unidad de presentación. La conversión (cantidad × factorOrigen ÷ factorDestino) usa esta unidad como destino. |
| **Alias**  | No | Otros nombres para la misma unidad, separados por coma. Ej: `g` para gramos, `kilo,kilos` para kg, `m,metros` para metro. Se usan para reconocer la unidad al escribir o elegir en combos. |
| **Tipo**   | No | `Universal` o `Personalizada`. Solo informativo; la app no lo usa para calcular. |
| **Notas**  | No | Comentario (ej. "Unidad base de masa"). La app no lo usa. |

---

## 3. Regla del Factor

- **Unidad base** (la más chica o la de referencia): **Factor = 1**.
- Otras unidades: **Factor = cuántas unidades base hay en 1 de esta**.

Ejemplos:

- **Masa** (base = gramos): 1 g = 1 → factor `1`; 1 kg = 1000 g → factor `1000`.
- **Longitud** (base = centímetro): 1 cm = 1 → factor `1`; 1 m = 100 cm → factor `100`.
- **Volumen** (base = cc): 1 cc = 1 → factor `1`; 1 L = 1000 cc → factor `1000`.
- **Conteo** (base = unidad): 1 unidad = 1 → factor `1`; 1 docena = 12 unidades → factor `12`.

La fórmula de conversión es:  
**resultado = cantidad × factorOrigen ÷ factorDestino**

Ej.: 10 metros → centímetros: 10 × 100 ÷ 1 = **1000** centímetros.

---

## 4. Datos de ejemplo (copiá y pegá en la hoja)

1. Creá la hoja **EQUIVALENCIAS** en tu libro.
2. En la **fila 1** pegá exactamente esta línea (encabezados):

```
Categoria	Unidad	Factor	Convertir-UnidadMedida	Factor-Unidad-Equivalencia	Convertido-UnidadMedida	Alias	Tipo	Notas
```

3. Desde la **fila 2** pegá estas filas (datos universales; podés completar Convertir-UnidadMedida, Factor-Unidad-Equivalencia y Convertido-UnidadMedida según tu caso):

```
masa	gramos	1	Gramos	1	Gramos	g	Universal	Unidad base de masa
masa	kg	1000	Gramos	1000	Gramos	kilo,kilos	Universal	1 kg = 1000 g
volumen	cc	1	CC	1	CC	centimetro cubico,centimetrocubico,centimetroscubico	Universal	Unidad base de volumen
volumen	litro	1000	CC	1000	CC	l,litros	Universal	1 L = 1000 cc
longitud	centimetro	1	Centimetro	1	Centimetro	cm,centimetros	Universal	Unidad base de longitud
longitud	metro	100	Centimetro	100	Centimetro	m,metros	Universal	1 m = 100 cm
conteo	unidad	1	Unidad	1	Unidad	unidades,elemento,elementos,pieza,piezas	Universal	Unidad base de conteo
conteo	docena	12	Unidad	12	Unidad	docenas	Universal	1 docena = 12 unidades
```

En Google Sheets, al pegar, cada tabulación va a una celda distinta. Revisá que **Categoria**, **Unidad** y **Factor** no queden vacíos.

---

## 5. Equivalencias personalizadas

Podés agregar filas con **Tipo = Personalizada** (o dejarlo en blanco), por ejemplo:

- Otra categoría (ej. **superficie**): `m2` factor 1, `hectarea` factor 10000.
- Variantes que uses en tus combos: si en “Presentación” usás “Kilo” con K, agregá una fila con Unidad `Kilo` y Alias `kilo`, mismo factor que `kg`.

Mientras **Categoria** sea la misma para dos unidades, la app podrá convertir entre ellas usando sus **Factor**.

---

## 6. Cómo usa la app esta hoja

1. La app llama a la API con `?action=list&sheet=equivalencias` (o el nombre que configures en Apps Script).
2. Con las filas que devuelve, arma internamente un mapa: por cada **Categoria**, para **Unidad** y cada valor de **Alias** (separado por comas) asigna el **Factor**. Además guarda por **Unidad** (y alias) los valores de **Convertir-UnidadMedida**, **Factor-Unidad-Equivalencia** y **Convertido-UnidadMedida**.
3. En los formularios de crear/editar (Materia prima y Packing), al elegir la **Presentación** (unidad, p. ej. Kg, Litro, Docena), la app busca la fila correspondiente en EQUIVALENCIAS y muestra en solo lectura: **Convertir A** = Convertir-UnidadMedida, **Equivalencia** = Factor-Unidad-Equivalencia y **Convertido a** = Convertido-UnidadMedida. Esos campos son asignación automática desde la tabla y tienen icono de calculadora.
4. Al convertir (calculadora o formulario), normaliza el nombre de la unidad (minúsculas, sin acentos, sin espacios) y busca ese **Factor** en la categoría; si no encuentra nada, usa equivalencias por defecto que tiene en código. La unidad destino para la conversión en el formulario es la de **Convertido-UnidadMedida**.

---

## 7. Configuración en Apps Script

En `docs/APPS_SCRIPT_ABM.gs`, en `CONFIG`, tiene que existir la hoja `equivalencias` con el mismo nombre de hoja que creaste (ej. `EQUIVALENCIAS`) y los headers que uses en la fila 1. Así la acción `list` devuelve las columnas que la app espera (**Categoria**, **Unidad**, **Factor**, **Alias**, etc.).

Resumen: con esta hoja podés definir **equivalencias universales y personalizadas** en un solo lugar; la app las consulta para calcular bien las conversiones (por ejemplo 10 m → 1000 cm).
