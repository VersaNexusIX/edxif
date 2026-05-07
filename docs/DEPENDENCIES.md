# Dependencies

This document describes every dependency used in EDXIF PRO, its purpose, and why it was chosen over alternatives.

---

## Runtime Dependencies

These packages are required for the application to run in both development and production.

---

### @google/genai

**Version:** ^1.29.0
**Purpose:** Google Gemini AI SDK for JavaScript and TypeScript.

This package provides the official client for the Google Gemini API. It is included in the project for potential AI-assisted metadata generation features. It is not actively used in the current feature set.

---

### @tailwindcss/vite

**Version:** ^4.1.14
**Purpose:** Vite plugin for Tailwind CSS v4.

Tailwind CSS v4 introduced a new plugin-based architecture that integrates directly with Vite rather than relying on a PostCSS pipeline. This plugin enables Tailwind utility class generation during the Vite build without a separate PostCSS configuration file.

---

### @vitejs/plugin-react

**Version:** ^5.0.4
**Purpose:** Vite plugin for React.

This plugin enables JSX transformation using the React 17 automatic runtime and configures Babel-based fast refresh for hot module replacement during development. It is required for any Vite project that uses React.

---

### clsx

**Version:** ^2.1.1
**Purpose:** Utility for conditionally joining class names.

`clsx` accepts any combination of strings, arrays, and objects and returns a single space-separated class name string. It is used throughout the component files to apply Tailwind classes conditionally based on component state.

---

### dotenv

**Version:** ^17.2.3
**Purpose:** Load environment variables from `.env` files into `process.env`.

`dotenv` is used by the server to read `.env.local` during development. In production, environment variables are expected to be injected by the hosting platform.

---

### exifreader

**Version:** ^4.38.1
**Purpose:** Pure JavaScript EXIF, IPTC, and XMP metadata reader.

ExifReader parses image metadata directly from a binary buffer without spawning any child process. It is used as the primary, fast-path metadata extractor in the `/api/metadata` endpoint. Because it runs in pure JavaScript, it has lower overhead than ExifTool but supports a narrower range of formats. ExifReader is used first; ExifTool is used as a fallback when ExifReader returns no results.

---

### exiftool-vendored

**Version:** ^35.19.0
**Purpose:** Cross-platform ExifTool wrapper with a bundled Perl binary.

ExifTool is the industry-standard tool for reading and writing metadata across hundreds of file formats. `exiftool-vendored` bundles the ExifTool Perl script and a platform-appropriate Perl binary (on Windows) or uses the system Perl (on macOS and Linux), eliminating the need to install ExifTool separately. It exposes a Promise-based API that manages a persistent ExifTool process for efficient reuse across multiple requests.

---

### express

**Version:** ^4.21.2
**Purpose:** HTTP server framework for Node.js.

Express handles routing, middleware, and HTTP request/response management for the EDXIF PRO server. It provides the two API endpoints and integrates with the Vite middleware in development mode.

---

### file-saver

**Version:** ^2.0.5
**Purpose:** Client-side file saving for browsers.

`file-saver` exposes a `saveAs` function that triggers a file download in the browser. It is used by the EXPORT button in the header to download the currently loaded file. It handles cross-browser compatibility for the download prompt.

---

### jszip

**Version:** ^3.10.1
**Purpose:** ZIP file reading and creation in JavaScript.

JSZip is included as a dependency for potential ZIP metadata inspection. It allows reading the contents of ZIP archives in the browser without server involvement.

---

### lucide-react

**Version:** ^0.546.0
**Purpose:** Icon component library for React.

Lucide React provides the icon set used throughout the interface, including the upload arrow, camera, palette, download, trash, and navigation icons. Icons are imported individually as React components, which enables tree-shaking so only the icons actually used are included in the bundle.

---

### motion

**Version:** ^12.23.24
**Purpose:** Animation library for React.

The Motion library (formerly Framer Motion) provides the `motion.div` component and `AnimatePresence` wrapper used for fade-in and slide-in animations on the theme selector panel, help overlay, and status messages. It is imported as `motion/react` to use the React-specific entry point.

---

### multer

**Version:** ^2.1.1
**Purpose:** Multipart form data handling for Express.

Multer processes `multipart/form-data` requests and writes uploaded files to disk before the route handler runs. It is used by both API endpoints to handle the binary file uploads from the browser.

---

### music-metadata-browser

**Version:** ^2.5.11
**Purpose:** Audio metadata reader for browser environments.

This package parses ID3, Vorbis, FLAC, and other audio metadata formats directly in the browser. It is included for potential client-side audio metadata preview without requiring a server round trip.

---

### react and react-dom

**Version:** ^19.0.1
**Purpose:** The React UI framework.

EDXIF PRO uses React 19, the latest stable major version. The application uses functional components with hooks throughout.

---

### react-dropzone

**Version:** ^15.0.0
**Purpose:** Drag and drop file upload for React.

`react-dropzone` provides the `useDropzone` hook used in `FileUploader.tsx`. It handles drag events, file validation, and the integration between the drop target and the hidden file input element.

---

### tailwind-merge

**Version:** ^3.5.0
**Purpose:** Merge Tailwind CSS class names without conflicts.

`tailwind-merge` is used alongside `clsx` in the `cn` utility function defined in `src/lib/utils.ts`. While `clsx` joins class names conditionally, `tailwind-merge` resolves conflicts between utility classes that affect the same CSS property.

---

### vite

**Version:** ^6.2.3
**Purpose:** Frontend build tool and development server.

Vite serves the React frontend during development with native ES module serving and hot module replacement. It also bundles and optimizes the frontend for production. Vite is listed in both `dependencies` and `devDependencies` because the server imports `createViteServer` from Vite at runtime in development mode.

---

## Development Dependencies

These packages are required during development and type checking but are not needed at runtime.

---

### @types/express

**Version:** ^4.17.21
**Purpose:** TypeScript type definitions for Express.

Provides the TypeScript interfaces for Express request, response, and application objects. Required for type checking in `server.ts`.

---

### @types/node

**Version:** ^22.14.0
**Purpose:** TypeScript type definitions for Node.js built-in modules.

Provides types for `fs`, `path`, `url`, and other Node.js built-in modules used in `server.ts`.

---

### autoprefixer

**Version:** ^10.4.21
**Purpose:** PostCSS plugin for adding vendor prefixes.

Autoprefixer automatically adds vendor-prefixed versions of CSS properties to ensure compatibility across browsers.

---

### tailwindcss

**Version:** ^4.1.14
**Purpose:** Utility-first CSS framework.

Tailwind CSS generates utility classes from a design token system. EDXIF PRO extends the default Tailwind configuration with custom `theme-*` utility classes that map to the CSS custom properties set by the theme engine.

---

### tsx

**Version:** ^4.21.0
**Purpose:** TypeScript execution for Node.js.

`tsx` allows running TypeScript files directly with Node.js without a separate compilation step. It is used by `npm run dev` to start `server.ts` directly. It works by stripping TypeScript type annotations at runtime using esbuild.

---

### typescript

**Version:** ~5.8.2
**Purpose:** The TypeScript compiler.

TypeScript provides static type checking across all `.ts` and `.tsx` files in the project. The compiler is invoked in type-check-only mode via `npm run lint` (`tsc --noEmit`). Actual compilation is handled by Vite and tsx.
