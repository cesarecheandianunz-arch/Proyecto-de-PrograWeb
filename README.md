# Almacén de Equipos · Tema 7 (avance)

Programación Web · Universidad de Lima · 2026-2. Interfaz en React + Tailwind (solo front, sin backend).

Verificado con Node.js 24.21.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL que aparece en la terminal (normalmente http://localhost:5173).

## Demostración del frontend

En Inicio están los enlaces «Vista del estudiante» y «Vista del encargado».
Permiten revisar HU-1 a HU-5 sin cambiar direcciones manualmente.
El acceso por correo es una simulación de rol; no hay autenticación real ni envío de correos.
No se guardan contraseñas.

Solicitudes, aprobaciones, entregas, devoluciones, renovaciones y pagos comparten
los mismos datos y se conservan en el navegador. La entrega requiere una solicitud
aprobada y una fecha dentro del rango solicitado que no sea futura.

```bash
npm test
npm run build
```

Las pruebas cubren las reglas de HU-2 y el recorrido integrado de préstamos.
La explicación por historia, los complementos y la demostración están en
[Integracion-frontend-paso-a-paso.md](docs/Integracion-frontend-paso-a-paso.md).

Para imágenes se admiten enlaces HTTP/HTTPS o selección de JPG/PNG, hasta tres
fotografías por equipo y 600 KB por archivo. No se necesitan servicios externos.

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
