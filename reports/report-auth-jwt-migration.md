# Plan: Migración a "JWT de NestJS = única sesión" (eliminar Better Auth)

Fecha: 2026-09-08 · Estado: **APROBADO**, pendiente de implementar.

## Objetivo

Retirar Better Auth por completo. La cookie `nest_access_token` (JWT de NestJS) **es** la sesión.
La autorización se valida contra `GET {AUTH_API_BASE_URL}/auth/check-status` (introspección).
Los ~60 server actions de datos (torneos, categorías, encuentros, usuarios…) NO cambian:
siguen llamando `requireAdmin()` y escribiendo en la BD local (migración del backend es gradual, los endpoints aún NO están).

## Contratos del backend

- Login: `POST ${AUTH_API_BASE_URL}/auth/login` body `{ email, password }` →
  `{ statusCode: 200, message, data: { user: { id, name, username, email, imageUrl, createdAt, updatedAt, roles: string[] }, token } }`.
- Check-status: `GET ${AUTH_API_BASE_URL}/auth/check-status` con `Authorization: Bearer <token>` →
  `{ statusCode: 200, message, data: { user: { id, name, email, imageUrl, isActive: boolean, createdAt, updatedAt, roles: string[] }, token } }`.
  - Devuelve un **token nuevo** (extiende 1h) → base de la sesión deslizante.
- `AUTH_API_BASE_URL="https://sportex-alpha.vercel.app/api/v1"` (en `.env.local`, `.env`).
- Errores: non-2xx o `statusCode !== 200` → usar mensaje de `body.data.message ?? body.message`.

## Semántica de sesión (remember-me)

| | remember-me ON (default) | remember-me OFF |
|---|---|---|
| `nest_access_token` | `maxAge: 3600` | sin `maxAge` (session cookie) |
| Rotación | SÍ: tras `check-status` ok, guardar `data.token` nuevo (renueva la hora) | NO: nunca renovar; al expirar (401) → redirect login |
| `nest_session_mode` | `'persistent'` (maxAge 3600) | `'session'` (sin maxAge) |

Reglas de escritura de cookies:
- `signInAction` (server action): setea token + mode cookie.
- `requireAdmin` (solo server actions): rotar si `persistent` y hay token nuevo.
- `proxy` (middleware): rotar si `persistent` en el `NextResponse`.
- `getSession` (RSC `cache()`): **NO escribe cookies** (prohibido en RSC), solo lee/valida.
- `signOutAction`: borra `nest_access_token` + `nest_session_mode`.

## Shape de sesión (compatibilidad con consumidores actuales)

```ts
getSession() => {
  user: { id, name, username, email, emailVerified, roles: string[], image },
  session: { createdAt, expiresAt, token, userAgent },
} | null  // null si sin cookie, check-status !ok, o !isActive
```
`requireAdmin()`: `{ ok: true, session } | { ok: false, message }` (roles admin + `isActive`).

## Cambios

1. `src/lib/nest-api.ts`
   - `NEST_CHECK_STATUS_ENDPOINT = '/auth/check-status'`, `NEST_SESSION_MODE_COOKIE = 'nest_session_mode'`.
   - `checkNestTokenStatus(token): Promise<{ ok, user, token }>` — función PURA (recibe token), edge-safe, mismo estilo que `loginWithNestApi`.
   - `NestAuthUser`: añadir `isActive?: boolean`; `username` nullable OK.

2. `src/lib/get-session.ts` (reescribir)
   - `getSession = cache(async () => ...)`: `getNestAccessToken()` → sin token `null` → `checkNestTokenStatus` → `!ok || !user.isActive` → `null` → shape compatible. Devolver también el token nuevo internamente (para rotación) sin exponerlo en el contrato público.
   - `requireAdmin()`: igual que hoy (usar `roles.includes('admin')`); si `ok` y mode `persistent` → `cookies().set(NEST_ACCESS_TOKEN_COOKIE, freshToken, { httpOnly, secure: prod, sameSite: 'lax', path: '/', maxAge: 3600 })` + refrescar mode cookie.

3. `src/proxy.ts` (middleware `/admin/:path*`, edge)
   - Leer `nest_access_token` del request cookies; si falta → redirect `ROUTES.AUTH_LOGIN`.
   - `checkNestTokenStatus(token)`; `!ok || !user.isActive || !roles.includes('admin')` → redirect login.
   - Si mode `persistent` → rotar token en el `NextResponse` (`cookies.set` con maxAge 3600).
   - Mantener `export const config = { matcher: '/admin/:path*' }`.

4. `src/app/(auth)/signInAction.ts` (simplificar)
   - Quitar `auth`, `prisma`, `bcrypt`, todo el sync, `signInEmail`, helper P2002, `mapNestRoles` de roles? → aún útil para roles de `login.user.roles` (paranoid: mapear igual que antes).
   - Leer `rememberMe` de `formData` (default `true`).
   - `loginWithNestApi` → `!ok` → `{ ok: false, message }`.
   - Set cookie token: `{ httpOnly, secure: NODE_ENV==='production', sameSite: 'lax', path: '/', maxAge: rememberMe ? 3600 : undefined }`.
   - Set mode cookie: `{ httpOnly, sameSite, path, maxAge: rememberMe ? 3600 : undefined, value: rememberMe ? 'persistent' : 'session' }`.
   - Return `{ ok: true, message, roles }`.

5. `src/app/auth/login/components/login-form/index.tsx`
   - Añadir campo `rememberMe: z.boolean().default(true)` al esquema (defaultValues `rememberMe: true`).
   - UI: checkbox "Recordarme" (usar patrón UI del proyecto; ver `<Checkbox>`/`<FieldLabel>`).
   - `formData.append('rememberMe', rememberMe ? 'true' : 'false')`.

6. `src/app/(auth)/signOutAction.ts`
   - Quitar `auth.api.signOut` y `headers()`. Borrar `nest_access_token` y `nest_session_mode`.

7. **Eliminar archivos**:
   - `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/app/api/[...all]/route.ts`, `src/app/(auth)/signUpAction.ts`, `src/app/(auth)/getUserAction.ts` (muerto, sin imports).

8. **13 componentes** `auth.api.getSession(...)` → `getSession()` (quitar imports `auth` + `headers`):
   - `src/app/admin/patrocinadores/sponsors-table.tsx`
   - `src/app/admin/entrenadores/(components)/coaches-table.tsx`
   - `src/app/admin/banners/(components)/banners-table.tsx`
   - `src/app/admin/mensajes/(components)/messages-table.tsx`
   - `src/app/admin/canchas/(components)/fields-wrapper.tsx`
   - `src/app/admin/credenciales/(components)/CredentialsTable.tsx`
   - `src/app/admin/galerias/(components)/galleries-table.tsx`
   - `src/app/admin/noticias/(components)/announcements-table.tsx`
   - `src/app/admin/usuarios/(components)/users-table.tsx`
   - `src/app/(public)/components/edit-match/index.tsx`
   - `src/app/admin/videos/(components)/videos-table.tsx`
   - `src/app/admin/paginas/(components)/pages-table.tsx`
   - `src/app/admin/equipos/(components)/teams-wrapper.tsx`

9. **Tests** (19 archivos mockean `@/lib/auth` → migrar):
   - Tests de listas (tablas/view): `players-table.test.tsx`, `categories-table.test.tsx`, `tournaments-table.test.tsx`, `tournament-view.test.tsx` → `vi.mock('@/lib/get-session', () => ({ getSession: vi.fn()... }))`.
   - Tests de acciones: `create-player-action`, `update-player-action`, `update-player-state-action`, `delete-player-action`, `delete-player-image-action`, `create-category-action`, `update-category-action`, `delete-category-action`, `create-tournament-action`, `update-tournament-action`, `update-tournament-state-action`, `delete-tournament-action`, `delete-tournament-image-action`, `fetch-tournament-action`, `signInAction.test.ts` → mock `requireAdmin`/`getSession` desde `@/lib/get-session` (hoisted + beforeEach por `mockReset: true`).
   - `src/tests/auth/login/signInAction.test.ts`: simplificar (mock `loginWithNestApi` vía `@/lib/nest-api`; assert cookies según rememberMe; sin prisma/bcrypt/auth).
   - `src/tests/lib/nest-api.test.ts`: + casos de `checkNestTokenStatus` (válido, 401, red). Mock `next/headers` cookies hoisted.
   - Nuevo `src/tests/lib/get-session.test.ts`: sin cookie → null; ok → session+roles; 401 → null; `isActive: false` → null.
   - `src/tests/auth/login/login-form.test.tsx`: checkbox presente; `rememberMe` enviado al action.

10. **Esquema + migración**:
    - `prisma/schema.prisma`: eliminar modelos `Session`, `Account`, `Verification` y las relaciones `sessions Session[]` / `accounts Account[]` de `User`. Se mantienen `User` completo (incl. `password`, `emailVerified`) y todos los demás modelos (los usa el CRUD local).
    - `node node_modules/.bin/prisma generate`.
    - Migración `drop_better_auth_tables` → `DROP TABLE "session"; DROP TABLE "account"; DROP TABLE "verification";` (orden: código primero, migración después).

11. **Desinstalar**: `bun remove better-auth && bun install` (poda `@better-auth/*` del lock).
    - Opcional: quitar `BETTER_AUTH_SECRET` de `.env.local` / `.env.template`.

12. **Reporte**: actualizar/extender `reports/report-nestjs-login.md` con el diseño final (o nuevo `report-auth-jwt-migration.md` en `reports/`).

## Verificación

- `node /Users/qbix/CODE/nextjs/limefut/node_modules/.bin/vitest --run` (126 archivos / 710 tests base)
- `node /Users/qbix/CODE/nextjs/limefut/node_modules/.bin/tsc --noEmit --incremental false`
- `node /Users/qbix/CODE/nextjs/limefut/node_modules/.bin/eslint --config eslint.config.mjs`
- Opcional: `next build`.
- Manual: login con Formulario (ON y OFF), rutas admin, logout.

## Notas de entorno (crítico)

- `npx` ROTO (exit 236) → usar binarios directos de `node_modules/.bin` (vitest/tsc/eslint/prisma).
- Shell básico (ls, mkdir, head, rg...) NO en PATH → usar tools Read/Glob/Grep/Write o `/bin/ls`, `/usr/bin/mkdir`, etc.
- Gestor de paquetes: **bun** (`bun.lock`). Versiones: better-auth ^1.6.28, next ^16.3.1, prisma ^7.9.1 (generator `prisma-client` → `src/generated/prisma`), bcryptjs ^3.0.3 (lo sigue usando el CRUD de usuarios — NO desinstalar).
- vitest `mockReset: true` en config → mocks hoisted (`vi.hoisted`) + impl en `beforeEach`.
- NO tocar: los demás server actions, `prisma/schema.prisma` (salvo los 3 modelos), los modelos de datos locales.