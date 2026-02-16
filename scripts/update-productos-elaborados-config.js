/**
 * Regenera scr/Arquitectura/sheets/productos-elaborados-sheets.config.js
 * a partir de productos-elaborados-sheets.json.
 * Uso: node scripts/update-productos-elaborados-config.js
 * (ejecutar desde la raíz del proyecto)
 */
var fs = require("fs");
var path = require("path");

var root = path.resolve(__dirname, "..");
var jsonPath = path.join(root, "scr", "Arquitectura", "sheets", "productos-elaborados-sheets.json");
var outPath = path.join(root, "scr", "Arquitectura", "sheets", "productos-elaborados-sheets.config.js");

var json = fs.readFileSync(jsonPath, "utf8");
var data = JSON.parse(json);
var pretty = JSON.stringify(data, null, 2);

var out = [
  "/**",
  " * Configuración del módulo Productos elaborados.",
  " * Generado desde productos-elaborados-sheets.json. Es la única fuente de configuración del módulo.",
  " * Para cambiar: editá productos-elaborados-sheets.json y ejecutá: node scripts/update-productos-elaborados-config.js",
  " */",
  "window.PRODUCTOS_ELABORADOS_SHEETS_JSON = " + pretty + ";",
  ""
].join("\n");

fs.writeFileSync(outPath, out, "utf8");
console.log("Actualizado: scr/Arquitectura/sheets/productos-elaborados-sheets.config.js");
