# Configuration

This document describes all configuration options available in EDXIF PRO, including environment variables, server settings, and build-time options.

---

## Environment Variables

EDXIF PRO reads environment variables from a `.env.local` file in the project root during development. In production, variables should be injected by the hosting platform at runtime.

Create the file manually before starting the server:

```bash
touch .env.local
```

The following variables are recognized.

---

### GEMINI_API_KEY

**Type:** String
**Required:** No (only required if Gemini AI features are enabled)
**Default:** None

This key authenticates requests to the Google Gemini AI API. EDXIF PRO does not use Gemini in its current feature set, but the variable is forwarded to the browser bundle by Vite for use in potential future extensions.

When deploying to Google AI Studio, this variable is injected automatically from the user's configured secrets. You do not need to set it manually in that environment.

**Example:**

```
GEMINI_API_KEY=AIzaSy...
```

---

### APP_URL

**Type:** String (URL)
**Required:** No
**Default:** None

The public URL at which the application is hosted. This is used for self-referential links, OAuth callback registration, and API endpoint configuration in hosted environments. When running locally, this variable is not needed.

When deploying to Google AI Studio or Cloud Run, this variable is injected automatically with the service URL.

**Example:**

```
APP_URL=https://your-service-url.run.app
```

---

### NODE_ENV

**Type:** String
**Required:** No
**Default:** `development` (when running via `tsx`)

Controls whether the server runs in development or production mode. In development mode, Vite middleware is activated and serves the frontend with hot module replacement. In production mode, the server serves compiled static files from the `dist` directory.

This variable is set automatically when you run `npm run build` and `npm run preview`. You do not need to set it manually during local development.

**Values:** `development`, `production`

---

### DISABLE_HMR

**Type:** String (`'true'` or `'false'`)
**Required:** No
**Default:** `'false'`

When set to `'true'`, Vite's hot module replacement is disabled. This is used by Google AI Studio's agent editor to prevent interface flickering during automated file edits. You do not need to set this variable for local development.

---

## Server Configuration

The following settings are hardcoded in `server.ts`. They can be modified by editing the file directly.

### Port

**Default:** `3000`

The server listens on port 3000. To change this, locate the `PORT` constant in `server.ts`:

```typescript
const PORT = 3000;
```

Update the value to any available port number above 1024.

### Upload Directory

**Default:** `/tmp/uploads`

Uploaded files are written to this directory before processing. The directory is created automatically on server start if it does not exist. To change this, locate the `uploadDir` constant in `server.ts`:

```typescript
const uploadDir = '/tmp/uploads';
```

On Windows, the default `/tmp/uploads` path may not be valid. Change it to a Windows-compatible path such as `path.join(os.tmpdir(), 'edxif-uploads')` using Node's built-in `os` module.

### Bind Address

**Default:** `0.0.0.0`

The server binds to all network interfaces by default. This allows the application to be accessed from other devices on the same network, which is useful for testing camera capture on a mobile device. To restrict the server to localhost only, change `'0.0.0.0'` to `'127.0.0.1'` in the `app.listen` call:

```typescript
app.listen(PORT, '0.0.0.0');
```

---

## Vite Configuration

The Vite configuration is defined in `vite.config.ts`.

### Path Alias

The `@` alias is configured to resolve to the project root:

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, '.'),
  },
},
```

This allows imports like `import { cn } from '@/src/lib/utils'` from any file in the project.

### Environment Variable Forwarding

The `define` block forwards `GEMINI_API_KEY` from the server-side environment into the browser bundle at build time:

```typescript
define: {
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
},
```

This replaces the literal string `process.env.GEMINI_API_KEY` in the compiled JavaScript with the value of the variable at build time. In development mode, the value is read from `.env.local` via Vite's `loadEnv` function.

---

## TypeScript Configuration

The TypeScript compiler is configured in `tsconfig.json`. The key settings are as follows.

**Target:** `ES2022` — the compiler output targets the ES2022 specification, which is supported by all modern browsers and Node.js 18+.

**Module:** `ESNext` — uses native ES module syntax in the output.

**moduleResolution:** `bundler` — uses Vite's bundler-aware module resolution algorithm, which supports importing TypeScript files with their `.ts` extension.

**allowImportingTsExtensions:** `true` — allows TypeScript source files to be imported using their full `.ts` or `.tsx` extension. This is required for the bundler resolution mode.

**noEmit:** `true` — the TypeScript compiler is used only for type checking, not for output generation. Vite handles the actual compilation and bundling.

**jsx:** `react-jsx` — uses the automatic JSX runtime introduced in React 17, which does not require an explicit `import React from 'react'` statement in every component file.

---

## Deployment Checklist

Before deploying EDXIF PRO to a production environment, verify the following items.

1. Run `npm run build` to generate the compiled frontend in the `dist` directory.
2. Set `NODE_ENV=production` in the hosting environment.
3. Ensure the upload directory path (`/tmp/uploads` by default) is writable by the server process.
4. Confirm that ExifTool-vendored has write permissions to its working directory. On some restricted hosting environments, the vendored Perl binary may fail to execute. Check the ExifTool-vendored documentation for platform-specific notes.
5. If the application will be accessed over HTTPS, ensure the hosting platform terminates TLS before forwarding requests to the Node.js server. The Express server does not handle TLS directly.
6. Set any required environment variables (`GEMINI_API_KEY`, `APP_URL`) through the hosting platform's secrets or environment configuration, not through a `.env.local` file that is committed to version control.
