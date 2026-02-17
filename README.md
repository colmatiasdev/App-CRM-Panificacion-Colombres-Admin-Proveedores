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

Servir los archivos por HTTP, por ejemplo:

```bash
npx serve -l 3000
```

Abrir `http://localhost:3000`.

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
