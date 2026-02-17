# Panificación Colombres

Sitio web para panadería artesanal: portada institucional, enlaces a inicio de sesión y registro.

## Contenido actual

- **Portada**: logo, texto institucional, botones Iniciar sesión / Registrarse / Conocenos
- **Auth**: páginas de login y registro (`scr/auth/`)
- **Footer**: pie con nombre y copyright
- **config.js** (`scr/Arquitectura/config.js`): datos de contacto (WhatsApp, Instagram, delivery) y configuración compartida

## Tecnologías

HTML5, CSS3, JavaScript (vanilla). Sin dependencias de build.

## Cómo ejecutar

La app usa rutas con `/scr/` en el path (igual que en [GitHub Pages](https://colmatiasdev.github.io/App-CRM-Panificacion-Colombres-Admin-Proveedores/)). **Hay que levantar el servidor desde la raíz del proyecto** (la carpeta que contiene `scr`, `index.html`, etc.), no desde dentro de `scr`.

Desde la **raíz del proyecto**:

```bash
# Opción 1: Python
python -m http.server 8081

# Opción 2: npx serve
npx serve -l 8081
```

Luego abrir en el navegador, por ejemplo:

- Portada: `http://localhost:8081/index.html`
- Costos Materia prima: `http://localhost:8081/scr/costos/Materia-Prima/materia-prima.html`
- Packing: `http://localhost:8081/scr/costos/Packing/packing.html`

Si levantás el servidor desde otra carpeta (por ejemplo desde `scr`), las URLs con `/scr/` darán 404.

## Estructura

```
├── index.html      # Portada
├── index.css       # Estilos
├── imagenes/logo/  # Logos
├── scr/
│   ├── Arquitectura/  # config.js, config-sheets.js, generar-id.js, sheets/
│   ├── auth/       # login.html, registro.html
│   └── footer/     # footer (CSS/JS para otras páginas)
└── docs/           # Documentación de referencia
```

## Documentación

En `docs/` hay documentación de referencia (Apps Script, Sheets, configuración) por si se vuelven a integrar menú u otras funcionalidades.
