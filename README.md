# Frontend

**English** | [Español](README.es.md)

Web client of the project, built with **Angular**. It is a SPA that lets users browse, search and watch videos, register / log in, manage their profile and videos, and (for admins) manage users. All data comes from the backend REST API (`../tfg_backend`).

## Technology

- **Angular 21** (standalone components) + **Angular Material**
- **Tailwind CSS 4** (via PostCSS)
- **Vitest** (unit tests, `ng test`)
- **Nginx** (serves the production build inside Docker)
- **npm** (dependency management, `package.json` + `package-lock.json`)

## Project structure

```
src/
├── app/
│   ├── app.config.ts    # providers: router, HttpClient + auth interceptor
│   ├── app.routes.ts    # routes
│   ├── pages/           # one folder per page (home, videos, login, admin...)
│   ├── modules/         # shared components (navigation-bar)
│   ├── services/        # API services, auth guard and interceptor
│   └── models/          # TypeScript interfaces (user, video)
├── environments/        # apiUrl (production / development)
├── material-theme.scss
└── styles.css
public/                  # static assets
nginx/nginx.conf         # Nginx config used by the Docker image
Dockerfile
```

## Pages

| Route | Page | Access |
|---|---|---|
| `/` | Home | public |
| `/videos` | Video list and search | public |
| `/videos/:id` | Video detail / player | public |
| `/contact` | Contact | public |
| `/login`, `/register` | Login / sign up | public |
| `/profile` | User profile and own videos | logged in (`authGuard`) |
| `/admin` | User administration | admin role (`adminGuard`) |

Any other route redirects to `/`.

## Backend connection

- The API URL is set in `src/environments/environment.ts` (production build) and `src/environments/environment.development.ts` (`ng serve`). Both point to `http://127.0.0.1:8000`.
- The URL is baked in at build time: changing it requires rebuilding the app (or the Docker image).
- After login, the JWT and the user data are stored in `localStorage` (`token`, `user_data`). `services/auth.interceptor.ts` adds the `Authorization: Bearer <token>` header to every request.
- The backend only accepts requests from the origins listed in `../tfg_backend/app/main.py` (CORS). If the frontend is served from another host or port, add it there.

## Running with Docker Compose (full stack)

From `../tfg_dockercompose`:

```bash
docker compose up --build -d
```

The app is available at http://localhost:8080.

The `Dockerfile` is a two-stage build:

1. **Node** (`node:24-alpine`): `npm ci` + `npm run build` (production configuration).
2. **Nginx** (`nginx-unprivileged`, non-root user): serves `dist/*/browser` on port `8080` with `nginx/nginx.conf`, which redirects unknown routes to `index.html` (Angular routing), enables gzip and caches static assets.

## Running locally (development)

1. Start the backend (see `../tfg_backend/README.md`), so that it is available at http://127.0.0.1:8000.
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Start the development server (auto reload):
   ```bash
   npm start
   ```
   The app is available at http://localhost:4200.

## Build and tests

```bash
npm run build     # production build in dist/
npm run watch     # development build in watch mode
npm test          # unit tests with Vitest
```

## Documentation

- [`../tfg_backend/docs/frontend_api_guide.md`](../tfg_backend/docs/frontend_api_guide.md): how the frontend uses the backend API (endpoints, payloads, auth). It lives in the backend repo, next to the API it documents.
