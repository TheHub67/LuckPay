# LuckPay

Plataforma demostrativa de cobros recurrentes para negocios locales (gimnasios, academias de baile, escuelas deportivas, academias de idiomas y otros servicios por suscripción).

Proyecto de Etapa Productiva — SENA. Es un **frontend puro**: no hay servidor ni base de datos real. Toda la información (negocios, clientes, sesión activa) se guarda en el `localStorage` del navegador, así que funciona abriendo el sitio directamente o publicándolo en GitHub Pages, sin necesidad de backend.

## Estructura del proyecto

```
luckpay/
├── index.html              → Landing / página principal
├── acceso.html              → Elige si entras como negocio o como cliente
├── login-empresa.html       → Inicio de sesión para negocios
├── registro-empresa.html    → Crear cuenta de negocio
├── panel-empresa.html       → Panel del negocio (clientes, cobros, neto estimado)
├── login-cliente.html       → Inicio de sesión para clientes
├── registro-cliente.html    → Crear cuenta de cliente
├── panel-cliente.html       → Panel del cliente (plan, próximo cobro, historial)
├── assets/
│   ├── style.css             → Todo el diseño del sitio
│   ├── auth.js                → Datos de ejemplo + funciones de sesión/login/registro
│   └── ui.js                   → Menú móvil, scroll, modales, toasts
└── README.md
```

## Cómo verlo

Simplemente abre `index.html` en el navegador (doble clic), o súbelo a GitHub Pages:

1. Sube esta carpeta a un repositorio de GitHub.
2. Ve a **Settings → Pages**.
3. En "Branch" selecciona tu rama principal (`main`) y carpeta `/root`.
4. Guarda. GitHub te dará un enlace público (algo como `https://tuusuario.github.io/luckpay/`).

No requiere `npm install` ni ningún paso de compilación: es HTML, CSS y JavaScript planos.

## Cuentas de ejemplo (ya cargadas)

### Negocios

| Negocio | Correo | Contraseña |
|---|---|---|
| PowerFit Gym | contacto@powerfit.demo | powerfit123 |
| Ritmo Vital (academia de baile) | hola@ritmovital.demo | ritmo123 |
| Golazo Escuela Deportiva | info@golazo.demo | golazo123 |
| Fluir Idiomas | contacto@fluir.demo | fluir123 |

### Clientes

| Cliente | Negocio | Correo | Contraseña |
|---|---|---|---|
| María Sánchez | PowerFit | maria@correo.demo | cliente123 |
| Juan Rojas | PowerFit | juan@correo.demo | cliente123 |
| Laura Castillo | Ritmo Vital | laura@correo.demo | cliente123 |
| Valentina Gómez | Ritmo Vital | valentina@correo.demo | cliente123 |
| Diego Torres | Golazo | diego@correo.demo | cliente123 |
| Andrés Peña | Fluir Idiomas | andres@correo.demo | cliente123 |

En las páginas de inicio de sesión hay botones "Usar" que llenan estos datos automáticamente, para que la sustentación sea más rápida.

También puedes crear negocios y clientes nuevos desde "Crear cuenta": quedan guardados igual que los de ejemplo.

## Qué es real y qué es simulado

Esto ya funciona de verdad, dentro del navegador:
- Registro e inicio de sesión (dos roles: negocio y cliente).
- Paneles protegidos: si no hay sesión, te redirige al login.
- El negocio puede agregar clientes, marcarlos como pagados o eliminarlos.
- Cálculo en vivo de ingreso, comisión y neto estimado.
- El cliente ve su plan, su próximo cobro y su historial de pagos.
- Todo persiste al recargar la página (queda en `localStorage`).

Esto **no** está conectado a nada real todavía (se explica también dentro del sitio, en el botón "Ver qué falta para producción"):
- No hay backend ni base de datos en un servidor.
- No hay pasarela de pagos: los "cobros" son simulados.
- Las contraseñas se guardan en texto plano en el navegador — suficiente para una demo académica, no para producción.

## Restablecer los datos de la demo

Si durante las pruebas quedan datos "sucios" (clientes de prueba, etc.), abre la consola del navegador (F12) estando en cualquier página del sitio y ejecuta:

```js
resetDemoData();
localStorage.removeItem('luckpay_session_v1');
location.reload();
```

Esto vuelve a dejar los 4 negocios y 6 clientes de ejemplo como al principio.
