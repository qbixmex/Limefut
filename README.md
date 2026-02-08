<img src="public/limefut-logo.png" alt="Limefut" />

## Install Dependencies

```bash
npm install
```

## Run Development Mode

```bash
npm run dev
```

## Create Production Bundle

```bash
# http://localhost:3000/
npm run build
```

## Pre View the Project

***Nota: se debe crear el bundle antes de correr este comando***

```bash
# http://localhost:3000/
npm run preview
```

## Generate Auth Secret Key

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"

# It will generate something like this:
'1f135548a57a4e2c043d6eb6a6b5e144 and more ...'

# ------- Alternative with Open SSL -------
openssl rand -base64 32

# It will generate something like this:
'W4w2IBUAoVqqTI3ODmyvmJa ...'
```

### Copy the generated numbers and paste them into: .env -> ```AUTH_SECRET``` environment variable value:

```ini
AUTH_SECRET="1f135548a57a4e2c043d6eb6a6b5e144 ..."
```

***Then paste generated secret to .env***

```ini
...
BETTER_AUTH_SECRET="RNBUvICd9zpIPyIVAs80Z ..."
```

## Preview Locally

**Note: You must run build before running this command**

```bash
# NPM
npm start
```
## Docker

```bash
docker compose -p sonusbeat_blog up -d

# -p container name
# -d detach mode
```

**Create your migrations:**

```bash
npx prisma migrate dev --name init

# --name migration_name
```

**Prisma Client:**

```bash
npx prisma generate
```

## Prisma Studio

**You can check your database in the browser**

```bash
npx prisma studio
```

## Run Tests

```bash
# NPM
npm run test
```