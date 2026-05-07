# Getting Started

This document covers everything needed to run EDXIF PRO on a local machine, from initial setup through the first successful metadata edit.

---

## System Requirements

**Node.js:** Version 18.0.0 or higher is required. ExifTool-vendored, one of the core dependencies, requires a modern Node.js runtime to install its bundled Perl binary correctly.

**Operating System:** EDXIF PRO runs on macOS, Linux, and Windows. The vendored ExifTool binary is automatically selected for the current platform during `npm install`.

**Disk Space:** Approximately 300 MB is required to accommodate Node.js dependencies, the vendored ExifTool binary, and TypeScript build tooling.

**Browser:** Any modern browser is supported. Camera capture requires a browser that supports the `getUserMedia` API (Chrome, Firefox, Safari 14+, Edge).

---

## Installation

**Step 1: Clone or unzip the project**

If you received the project as a ZIP archive, extract it to a directory of your choice. If you are working from a Git repository, clone it and navigate into the project folder.

**Step 2: Install dependencies**

```bash
npm install
```

This command downloads all JavaScript dependencies and installs the ExifTool binary appropriate for your operating system. The installation may take one to two minutes on a first run due to the size of the vendored ExifTool package.

**Step 3: Configure environment variables**

Create a file named `.env.local` in the project root. This file must contain any required environment variables. See [Configuration](CONFIGURATION.md) for the full list of available variables.

For a basic local installation with no external service integration, the file can remain empty. Create it with:

```bash
touch .env.local
```

**Step 4: Start the development server**

```bash
npm run dev
```

The server starts on port 3000. Open `http://localhost:3000` in your browser. You should see the EDXIF PRO interface with a file import panel on the left side.

---

## First Use Walkthrough

**Uploading a File**

The left panel contains the file import area. You can upload a file in one of three ways.

The first way is to click the import area. A standard file picker dialog will open. Select any supported image, video, or audio file.

The second way is to drag a file from your operating system's file manager and drop it anywhere onto the import area.

The third way, available only on devices with a camera, is to click the CAPTURE button below the import area. This opens a live camera view. Tap or click the white circle button to take a photo. The captured image is immediately loaded into the editor.

**Reading Metadata**

After a file is loaded, the server processes it and returns all extracted metadata fields. The main panel displays these fields in a table with two columns: the tag identifier on the left and the current value on the right.

Use the tab bar across the top of the main panel to filter fields by category.

| Tab | Contents |
|---|---|
| All Tags | Every extracted metadata field, sorted alphabetically |
| Camera | Camera make and model, lens, aperture, ISO, shutter speed, focal length |
| Location | GPS latitude, longitude, altitude, and related coordinate fields |
| Timeline | Creation dates, modification dates, and other timestamp fields |
| System | File name, size, format, MIME type, and path-level properties |

**Editing a Field**

Click directly on any value in the right column of the table. The field becomes an active text input. Type the new value. The field label on the left will display a "DIRTY" badge to indicate it has been changed.

You can edit as many fields as you need before committing. There is no limit to the number of fields modified in a single session.

**Committing Changes**

When you are satisfied with your edits, click the COMMIT button in the upper right of the main panel. The button is highlighted and active only when at least one field has been modified.

The server will process the file and return a modified copy with all metadata changes written into the binary. The interface will reload the updated metadata automatically so you can verify the changes were applied correctly.

**Exporting the File**

Click the EXPORT button in the top right corner of the header bar. The modified file will be downloaded to your device with the filename prefixed by `modified_`. The original filename is preserved after the prefix.

---

## Available Scripts

The following commands are available in the project root.

```bash
# Start the development server with hot module replacement
npm run dev

# Compile the frontend for production deployment
npm run build

# Preview the production build locally
npm run preview

# Run TypeScript type checking without emitting files
npm run lint

# Remove the compiled output directory
npm run clean
```

---

## Development Server vs Production Build

When running `npm run dev`, the server starts in development mode. Vite serves the frontend with hot module replacement enabled, so changes to React components and CSS are reflected in the browser without a full page reload.

When running `npm run build` followed by `npm run preview`, the frontend is compiled to the `dist` directory and served as static files. The Express server detects the production environment and switches to serving from `dist` instead of using the Vite middleware.

For deployment to a production host, build the project and deploy the compiled output together with `server.ts` and the `node_modules` directory.
