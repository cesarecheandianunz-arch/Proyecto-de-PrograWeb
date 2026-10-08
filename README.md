# Almacén de Equipos · Tema 7 (avance)

Programación Web · Universidad de Lima · 2026-2. Interfaz en React + Tailwind (solo front, sin backend).

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL que aparece en la terminal (normalmente http://localhost:5173).

## Dónde está cada historia

| Historia | Carpeta |
|---|---|
| HU-1 Cuenta y acceso | `src/pages/hu1` |
| HU-2 Inventario | `src/pages/hu2` |
| HU-3 Catálogo y solicitud | `src/pages/hu3` |
| HU-4 Aprobación y entrega | `src/pages/hu4` |
| HU-5 Devoluciones | `src/pages/hu5` |

- Datos de prueba: `src/datos.js`
- Componentes comunes (navbar, footer, panel del encargado, etiquetas, tarjeta de equipo): `src/components`
- Rutas: `src/App.jsx`
- Colores del sistema de diseño: `src/index.css`

## Cómo trabajar en grupo

Cada integrante trabaja en su propia rama y luego abre un pull request:

```bash
git checkout -b hu3-catalogo
git add .
git commit -m "Avance del catálogo"
git push -u origin hu3-catalogo
```
