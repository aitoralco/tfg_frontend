# Frontend

[English](README.md) | **Español**

Cliente web del proyecto, construido con **Angular**. Es una SPA que permite explorar, buscar y ver vídeos, registrarse / iniciar sesión, gestionar el perfil y los vídeos propios y (para los admins) gestionar usuarios. Todos los datos vienen de la API REST del backend (`../tfg_backend`).

## Tecnología

- **Angular 21** (componentes standalone) + **Angular Material**
- **Tailwind CSS 4** (vía PostCSS)
- **Vitest** (tests unitarios, `ng test`)
- **Nginx** (sirve el build de producción dentro de Docker)
- **npm** (gestión de dependencias, `package.json` + `package-lock.json`)

## Estructura del proyecto

```
src/
├── app/
│   ├── app.config.ts    # providers: router, HttpClient + interceptor de auth
│   ├── app.routes.ts    # rutas
│   ├── pages/           # una carpeta por página (home, videos, login, admin...)
│   ├── modules/         # componentes compartidos (navigation-bar)
│   ├── services/        # servicios de la API, guard e interceptor de auth
│   └── models/          # interfaces TypeScript (user, video)
├── environments/        # apiUrl (producción / desarrollo)
├── material-theme.scss
└── styles.css
public/                  # recursos estáticos
nginx/nginx.conf         # configuración de Nginx usada por la imagen Docker
Dockerfile
```

## Páginas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Inicio | público |
| `/videos` | Lista y búsqueda de vídeos | público |
| `/videos/:id` | Detalle / reproductor del vídeo | público |
| `/contact` | Contacto | público |
| `/login`, `/register` | Inicio de sesión / registro | público |
| `/profile` | Perfil del usuario y sus vídeos | usuario logueado (`authGuard`) |
| `/admin` | Administración de usuarios | rol admin (`adminGuard`) |

Cualquier otra ruta redirige a `/`.

## Conexión con el backend

- La URL de la API se define en `src/environments/environment.ts` (build de producción) y `src/environments/environment.development.ts` (`ng serve`). Las dos apuntan a `http://127.0.0.1:8000`.
- La URL queda fijada al compilar: para cambiarla hay que volver a compilar la app (o la imagen Docker).
- Tras el login, el JWT y los datos del usuario se guardan en `localStorage` (`token`, `user_data`). `services/auth.interceptor.ts` añade la cabecera `Authorization: Bearer <token>` a todas las peticiones.
- Los elementos `<video>` no pueden enviar cabeceras, así que `VideoService` añade el token a las URLs de streaming (`?token=...`). Así el propietario (o un admin) puede reproducir sus vídeos privados.
- El backend solo acepta peticiones de los orígenes listados en `../tfg_backend/app/main.py` (CORS). Si el frontend se sirve desde otro host o puerto, hay que añadirlo ahí.

## Ejecución con Docker Compose (stack completo)

Desde `../tfg_dockercompose`:

```bash
docker compose up --build -d
```

La app queda disponible en http://localhost:8080.

El `Dockerfile` es un build en dos etapas:

1. **Node** (`node:24-alpine`): `npm ci` + `npm run build` (configuración de producción).
2. **Nginx** (`nginx-unprivileged`, usuario no root): sirve `dist/*/browser` en el puerto `8080` con `nginx/nginx.conf`, que redirige las rutas desconocidas a `index.html` (routing de Angular), activa gzip y cachea los recursos estáticos.

## Ejecución en local (desarrollo)

1. Arranca el backend (ver `../tfg_backend/README.es.md`), para que esté disponible en http://127.0.0.1:8000.
2. Instala las dependencias:
   ```bash
   npm ci
   ```
3. Arranca el servidor de desarrollo (recarga automática):
   ```bash
   npm start
   ```
   La app queda disponible en http://localhost:4200.

## Build y tests

```bash
npm run build     # build de producción en dist/
npm run watch     # build de desarrollo en modo watch
npm test          # tests unitarios con Vitest
```

## Documentación

- [`../tfg_backend/docs/frontend_api_guide.md`](../tfg_backend/docs/frontend_api_guide.md): cómo usa el frontend la API del backend (endpoints, payloads, auth). Está en el repo del backend, junto a la API que documenta.

## Licencia

© 2026 Aitor Alonso Coloma. Con licencia [Creative Commons Atribución-NoComercial 4.0 Internacional (CC BY-NC 4.0)](LICENSE): puedes usarlo, compartirlo y adaptarlo con fines no comerciales, siempre que cites al autor y enlaces la licencia.
