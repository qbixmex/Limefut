# Reporte: Migración completa a sesión JWT de NestJS (eliminación de Better Auth)

Fecha: 2026-09-08

## Resumen

Se completó la migración a un modelo donde el **JWT de NestJS es la única sesión** del frontend (Next.js Sportex/limefut). Better Auth se eliminó por completo: código (`src/lib/auth.ts`, `src/lib/auth-client.ts`, server actions, ruta API, componentes RSC), tablas en la BD (`session`, `account`, `verification`) y dependencia npm.

Validación por introspección: `GET {AUTH_API_BASE_URL}/auth/check-status` con `Authorization: Bearer <token>` devuelve el usuario y un **token renovado**. Este fresco se usa para rotación deslizante según el modo de sesión:

- **Persistente (recordarme ON)**: la cookie `nest_access_token` se renueva a 1h en cada `requireAdmin()` y en el middleware `/admin/:path*`. La sesión nunca caduca mientras haya actividad.
- **Sesión (recordarme OFF)**: no se renueva; la cookie sin `maxAge` caduca al cerrar el navegador y el JWT expira a la hora → re-login.

El token nunca se expone al cliente (cookie httpOnly), los server actions siguen siendo la capa de seguridad (ninguno usa `guard.session...`, solo `guard.ok`/`guard.message`).

## Diseño

### Cookies
| Cookie | Valor | httpOnly | Vida |
|---|---|---|---|
| `nest_access_token` | JWT emitido por NestJS | sí | `maxAge: 3600` (modo persistente) o sin `maxAge` (modo sesión) |
| `nest_session_mode` | `persistent` \| `session` | sí | misma vida que el token (cuando aplica rotación) |

Partes que **escriben** cookies: `signInAction` (login), `signOutAction` (borra ambas), `requireAdmin`/rotación, `proxy.ts` (edge). `getSession` (RSC, cacheada con `cache()` de React) **nunca** escribe cookies → no rompe la semántica de Server Component ni causa errores de "headers set after read".

### Flujo
1. Login → `POST /auth/login` → JWT + sesión recordarme.
2. Cada petición RSC/action valida el JWT contra `check-status` (2 llamadas cacheadas por request vía `React.cache`).
3. Admin actions → `requireAdmin()` (valida + rotación si persistente).
4. `/admin/*` → `proxy.ts` (valida + redirige a login + rotación).
5. Logout → borra ambas cookies (no elimina el JWT del backend; expira solo).

## Archivos nuevos

### `src/lib/nest-api.ts`
- Constantes: `NEST_ACCESS_TOKEN_COOKIE`, `NEST_SESSION_MODE_COOKIE`, `AUTH_LOGIN_ENDPOINT`, `NEST_CHECK_STATUS_ENDPOINT`, tipo `NestSessionMode`.
- `NestAuthUser` con `isActive?`.
- `loginWithNestApi(email, password)` → `{ ok, message, user, token }`.
- `checkNestTokenStatus(token)` → `{ ok: true, user, token | ok: false, message }`.
  - Red caída → `¡ No se pudo conectar con el servicio de autentificación ❌ !`.
  - Token inválido/expirado → `¡ La sesión ha expirado, inicie sesión nuevamente !` (o mensaje del backend).
- `getNestBaseUrl()` simplificado: `process.env.AUTH_API_BASE_URL ?? ''` (sin switch por NODE_ENV).
- `mapNestRoles`, `getNestAccessToken`, `callNestApi<T>`.

### `src/lib/get-session.ts` (reescrito)
- Tipo `AuthSession` compatible con la sesión anterior (mismos campos `user`/`session`).
- `getSessionPayload` en `cache()`: lee cookie, valida token, descarta si `!check.ok` o `isActive === false`.
- `getSession` en `cache()` (RSC-safe).
- `requireAdmin()` con mensajes conservados y rotación vía `rotateIfPersistent`.
- `rotateIfPersistent(freshToken)`: solo renueva si `nest_session_mode === 'persistent'` (https + httpOnly + sameSite lax + path `/`).

### `src/tests/lib/get-session.test.ts`
- 9 casos (mock de `@/lib/nest-api`, `vi.resetModules()` + import dinámico por test para aislar el cache de React): sin token, check falla, usuario inactivo, sesión válida con roles mapeados + token fresco, no autenticado, sin rol admin, rotación persistente (cookie con `maxAge: 3600`), sin rotación en modo sesión y sin cookie de modo.

## Archivos modificados

- `src/proxy.ts` — valida `nest_access_token` (check-status + `isActive` + rol admin case-insensitive), redirige a `ROUTES.AUTH_LOGIN` si falla y rota cookies en modo persistente; `matcher: '/admin/:path*'`.
- `src/app/(auth)/signInAction.ts` — sin bcrypt/prisma/auth; `rememberMe` (default true); cookies `nest_access_token` + `nest_session_mode`; devuelve `roles` mapeados.
- `src/app/(auth)/signOutAction.ts` — elimina ambas cookies (sin `auth.api.signOut`).
- `src/app/auth/login/components/login-form/index.tsx` — switch "Recordarme" (`<Switch>` radix, `aria-label="Recordarme"`), schema `rememberMe: z.boolean()` con `defaultValues: { rememberMe: true }`, envía `rememberMe: 'true'|'false'`.
- 13 componentes RSC (sponsors, coaches, banners, messages, fields-wrapper, CredentialsTable, galleries, announcements, users, videos, pages, teams-wrapper, edit-match) — `auth.api.getSession({ headers })` → `getSession()`.
- `prisma/schema.prisma` — eliminados los modelos `Session`, `Account`, `Verification` y las relaciones `sessions`/`accounts` en `User`.
- `package.json` / `bun.lock` — eliminada la dependencia `better-auth`.
- `src/app/(public)/components/header/sign-in-out/*` — tipos de props alineados al `AuthSession.user` (`name`/`username`/`image: string|null`, `roles: string[]`).

## Archivos eliminados

- `src/lib/auth.ts`
- `src/lib/auth-client.ts`
- `src/app/(auth)/signUpAction.ts`
- `src/app/(auth)/getUserAction.ts`
- `src/app/api/[...all]/route.ts` (ruta catch-all de Better Auth)

## Base de datos

- Nueva migración: `prisma/migrations/20260908000000_drop_better_auth_tables/migration.sql` (DROP de `session`, `account`, `verification` + constraints).
- Aplicada vía `prisma migrate deploy` sobre la Neon dev (contenía 2 filas en `account` y 4 en `session` — pérdida intencional de sesiones locales, ya obsoletas).
- `prisma generate` regeneró el cliente (sin cambios funcionales en modelos restantes).
- Se conservan `bcryptjs` y `users.password` (CRUD de Usuarios en admin sigue usando hash local).

## Tests

- **Migrados a `@/lib/get-session`** (13 acciones de jugadores/categorías/torneos): mock `getSession` + `requireAdmin` real (función, no `vi.fn()`, para no ser borrada por `mockReset: true`).
- 4 tests de tablas/view → `{ getSession: mock, requireAdmin: vi.fn() }`.
- `fetch-tournament-action.test.ts` — sin guard: bloque `@/lib/auth` eliminado.
- `src/tests/auth/login/signInAction.test.ts` — reescrito (7 casos) probando cookies (persistente/sesión), mensajes de error y red.
- `src/tests/lib/nest-api.test.ts` — añadidos casos de `checkNestTokenStatus` y `AUTH_API_BASE_URL` vía `vi.stubEnv` (getNestBaseUrl lee la variable en runtime).
- `src/tests/auth/login/login-form.test.tsx` — asserts del switch: `rememberMe` default `'true'` y `'false'` al desactivarlo.

## Verificación

- `vitest --run`: **127 archivos / 723 tests** pasan.
- `tsc --noEmit --incremental false`: sin errores (se limpió `.next` obsoleto que referenciaba la ruta `[...all]` eliminada).
- `eslint --config eslint.config.mjs --fix .`: sin errores.

## Notas y consideraciones

- El backend (`sportex-alpha`) sigue siendo la única fuente de autentificación: los usuarios deben existir/activarse allí; los creados solo en la BD local y sin cuenta en NestJS ya no podrán entrar.
- No hay flujo de refresh explícito: en modo persistente la rotación deslizante sobre `check-status` renueva el JWT en cada request admin/edge; en modo sesión se requiere re-login al expirar (1h).
- Los server actions de datos (torneos, categorías, encuentros, etc.) NO se migraron a la API NestJS: siguen escribiendo en la BD local con Prisma; solo cambió su capa de autorización (`requireAdmin`). La migración de datos es un paso futuro independiente.
- Opcional pendiente: quitar `BETTER_AUTH_SECRET`/`BETTER_AUTH_URL` de `.env` y `.env.local`.