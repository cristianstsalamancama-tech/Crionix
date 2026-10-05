# CRIONIX — Tienda de videojuegos

Sitio web de una tienda de videojuegos con estética roja y negra. Proyecto 100% frontend
(HTML, CSS y JavaScript puro, sin frameworks ni dependencias).

## Estructura

```
crionix/
├── img/
│   ├── logo.jpg      Logo de Crionix
│   └── games/        Portadas de los juegos (ver LEEME.txt)
├── index.html        Estructura de la página (inicio, catálogo, PQR, modales)
├── css/
│   └── styles.css    Todos los estilos y variables de color
└── js/
    ├── data.js       Catálogo de juegos, íconos y utilidades de formato
    └── app.js        Lógica: sesión, catálogo, carrito, pago y PQR
```

## Funcionalidades

- **Registro e inicio de sesión**: valida los campos, impide correos duplicados y mantiene
  la sesión abierta entre visitas.
- **Catálogo**: 10 juegos reales con precios en pesos colombianos, filtro por género y
  ficha detallada al hacer clic en cada tarjeta.
- **Carrito**: agrega, cambia cantidades, quita productos y calcula el total.
- **Pago en línea**: formulario con tarjeta, PSE o Nequi, y confirmación con número de pedido.
- **PQR**: formulario de peticiones, quejas y reclamos que genera un número de ticket
  y guarda el historial de solicitudes.

## Dónde se guardan los datos

Todo se almacena en el `localStorage` del navegador con estas claves:

| Clave | Contenido |
|---|---|
| `crionix_users` | Cuentas registradas |
| `crionix_session` | Usuario con sesión activa |
| `crionix_cart` | Carrito actual |
| `crionix_orders` | Historial de pedidos |
| `crionix_pqr` | Tickets de PQR |

Para reiniciar todo, abre la consola del navegador y ejecuta `localStorage.clear()`.

## Advertencias

- **El pago es una simulación.** No hay pasarela real ni se procesan datos financieros.
  Para producción se debe integrar un proveedor como Wompi, PayU o Mercado Pago, y el
  procesamiento debe ocurrir en un servidor, nunca en el navegador.
- **No hay backend.** Las contraseñas se guardan en texto plano en el navegador solo
  porque es una demo. Un sitio real necesita servidor, base de datos y contraseñas cifradas.
- **Las carátulas son originales.** Los nombres, desarrolladores y precios corresponden a
  juegos reales, pero las portadas oficiales tienen derechos de autor, así que cada juego
  usa una carátula generada con CSS.

## Logo e imágenes de juegos

- El logo está en `img/logo.jpg` (para cambiarlo, reemplaza ese archivo).
- Cada juego tiene un campo `image` en `js/data.js`. Pon las portadas en `img/games/` con los
  nombres de `img/games/LEEME.txt`. Si falta una, se muestra una carátula de respaldo.
- Las portadas oficiales tienen derechos de autor: usa las del kit de prensa de cada
  publisher o las que tengas autorizadas.

## Personalizar

Para cambiar los colores, edita las variables al inicio de `css/styles.css`:

```css
:root{
  --bg:#0a0a0a;
  --red:#e21f26;
  ...
}
```

Para agregar o quitar juegos, edita el arreglo `GAMES` en `js/data.js`.
