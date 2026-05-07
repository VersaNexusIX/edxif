# Architecture

This document describes the technical structure of EDXIF PRO, how its components interact, and why key design decisions were made.

---

## High-Level Overview

EDXIF PRO is a fullstack web application with a clear separation between the browser client and the Node.js server. The browser handles the user interface, file selection, state management, and rendering. The server handles all binary file operations, including metadata extraction and writing, using ExifTool.

```
Browser (React + TypeScript)
        |
        | HTTP (multipart/form-data)
        |
Express Server (Node.js + TypeScript)
        |
        | ExifReader (pure JS, browser binary parsing)
        | ExifTool  (vendored Perl binary, full read/write)
        |
     /tmp/uploads (ephemeral file storage)
```

The server does not use a database. Files exist on disk only for the duration of a single request and are cleaned up after the response is sent.

---

## Server

**File:** `server.ts`

The server is built with Express and starts on port 3000. In development mode it integrates Vite as a middleware, which enables the React frontend to be served with hot module replacement from the same origin. In production mode it serves the compiled static files from the `dist` directory.

**Startup sequence:**

1. Express application is created.
2. The temporary upload directory `/tmp/uploads` is created if it does not exist.
3. Multer is configured to write uploaded files to `/tmp/uploads`.
4. Express JSON and URL-encoded body parsers are registered.
5. The two API route handlers are registered.
6. Vite middleware (development) or static file serving (production) is configured.
7. The server begins listening on port 3000 bound to all interfaces (`0.0.0.0`).

---

## API Endpoints

### POST /api/metadata

**Purpose:** Extract all metadata from an uploaded file.

**Input:** A `multipart/form-data` request with a single field named `file` containing the binary file data.

**Processing:**

1. Multer writes the file to `/tmp/uploads` with a randomly generated filename.
2. The file is read into a Node.js Buffer.
3. ExifReader attempts to parse the buffer. ExifReader is a pure JavaScript implementation and works directly on binary data without spawning a child process. It returns a dictionary of tag objects.
4. Each tag object is normalized: if the object has a `description` property, that string is used as the value; otherwise the raw `value` property is used.
5. If ExifReader returns zero tags, ExifTool is invoked as a fallback. ExifTool is more capable and handles formats that ExifReader does not support.
6. The normalized metadata dictionary is returned as JSON.

**Response:**

```json
{
  "metadata": {
    "Make": "Apple",
    "Model": "iPhone 15 Pro",
    "GPSLatitude": "37.7749",
    "GPSLongitude": "-122.4194"
  },
  "filename": "photo.jpg",
  "mimetype": "image/jpeg"
}
```

### POST /api/update-metadata

**Purpose:** Write modified metadata fields back into a file and return the updated binary.

**Input:** A `multipart/form-data` request with two fields: `file` containing the binary file data, and `updates` containing a JSON string of key-value pairs representing the fields to write.

**Processing:**

1. Multer writes the file to `/tmp/uploads`.
2. The `updates` JSON string is parsed into an object.
3. ExifTool writes the updates into the temporary file path. ExifTool modifies the file in place while preserving all other embedded data.
4. The modified file is read back into a Buffer.
5. The temporary file is deleted.
6. The Buffer is sent as the response body with the appropriate MIME type and a `Content-Disposition` header prompting the browser to save the file.

---

## Frontend

**Entry point:** `src/main.tsx`

The frontend is a single-page React application written in TypeScript. It uses Vite as the build tool and Tailwind CSS for styling.

### State Management

All application state lives in a single `useState` call in `App.tsx`. The state object is defined by the `AppState` interface:

```typescript
interface AppState {
  file: File | null;
  metadata: any | null;
  previewUrl: string | null;
  isProcessing: boolean;
  isUpdating: boolean;
  error: string | null;
  success: string | null;
  themeId: string;
  isThemeOpen: boolean;
  isMobileMenuOpen: boolean;
  isHelpOpen: boolean;
}
```

State transitions are handled by passing the previous state to the `setState` updater function. This pattern prevents stale closure issues when multiple state fields are updated in a single handler.

### Theme System

Themes are defined in `src/themes.ts` as an array of `Theme` objects. Each theme specifies six color values: primary, background, surface, border, text, and muted text.

When the selected theme changes, a `useEffect` hook reads the current theme from the array and writes the six color values as CSS custom properties on `document.documentElement`. All Tailwind utility classes in the application use these custom properties through a set of custom `bg-theme-*`, `text-theme-*`, and `border-theme-*` classes defined in `src/index.css`.

This approach means theme changes are applied instantly without a re-render of the component tree, since CSS custom property changes are handled entirely by the browser's style engine.

### Data Flow for Metadata Editing

1. User selects or drops a file. `handleFileSelect` is called with the `File` object.
2. A local object URL is created from the file for preview rendering.
3. The file is sent to `/api/metadata` via a `FormData` POST request.
4. The server response is stored in `state.metadata`.
5. The `MetadataEditor` component receives `metadata` as a prop and renders the editable table.
6. When the user edits a field, `MetadataEditor` maintains its own local `editedMetadata` state.
7. When the user clicks COMMIT, `MetadataEditor` calls `onUpdate(editedMetadata)`.
8. `App.tsx` sends the original file and the edited fields to `/api/update-metadata`.
9. The server returns the modified file binary as a Blob.
10. A new `File` object is constructed from the Blob, the local preview URL is revoked and recreated, and `handleFileSelect` is called again on the new file to refresh the metadata display.

---

## File Upload Handling

Multer is configured with `dest: '/tmp/uploads'`, which means uploaded files are written to disk before the route handler runs. This is necessary because ExifTool operates on file paths, not in-memory buffers.

Files are cleaned up after each request. The cleanup in `/api/update-metadata` uses a try-catch around the `fs.unlinkSync` call to prevent cleanup errors from affecting the response. Files in `/tmp/uploads` are also cleared by the operating system on reboot or when `/tmp` is purged.

---

## Build System

**Vite** handles frontend compilation. The configuration in `vite.config.ts` registers two plugins: the Vite React plugin for JSX transform support, and the Tailwind CSS Vite plugin for utility class generation.

The `tsconfig.json` targets ES2022 with strict module resolution settings appropriate for a Vite bundler environment. The `paths` alias maps `@/` to the project root, enabling absolute imports like `import { cn } from '@/src/lib/utils'`.

The server is run directly by `tsx`, which provides TypeScript execution for Node.js without a separate compilation step during development.
