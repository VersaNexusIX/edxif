# Components

This document describes each React component in EDXIF PRO, its props interface, its responsibilities, and how it fits into the overall application structure.

---

## Component Tree

```
App
├── ThemeSelector
├── HelpOverlay
├── Header (inline in App)
│   ├── Mobile menu toggle
│   ├── Logo and version
│   ├── HelpOverlay trigger
│   ├── ThemeSelector trigger
│   └── Export button
├── Sidebar (inline in App)
│   ├── FileUploader       (when no file is loaded)
│   └── Navigator panel    (when a file is loaded)
│       ├── MediaPreview
│       └── File descriptor
└── Main panel (inline in App)
    └── MetadataEditor     (when metadata is available)
```

---

## App

**File:** `src/App.tsx`

App is the root component and the single source of truth for application state. It owns the `AppState` object and passes slices of it and handler functions down to child components as props.

**Responsibilities:**

App manages the following operations directly: file selection and upload, metadata update submission, file reset, file download, and theme application.

**Theme application:**

A `useEffect` hook watches `state.themeId`. When it changes, the hook locates the corresponding theme object in the `themes` array and writes six CSS custom properties to `document.documentElement`. This causes the entire interface to update immediately through CSS cascade without triggering a React re-render.

**Layout:**

The component renders a full-height flex column containing a fixed header, a flex row containing the sidebar and main panel, and a status footer. On small screens, the sidebar is hidden by default and can be revealed by clicking the hamburger menu in the header.

---

## FileUploader

**File:** `src/components/FileUploader.tsx`

FileUploader renders the file import interface shown in the sidebar when no file is currently loaded.

**Props:**

| Prop | Type | Description |
|---|---|---|
| onFileSelect | `(file: File) => void` | Called when the user selects a file by any means |
| isProcessing | `boolean` | When true, the dropzone is disabled and shows reduced opacity |

**File selection methods:**

This component supports three input methods.

The first is drag and drop. The component uses `react-dropzone` to manage drop events. The `useDropzone` hook handles drag state, file validation, and the acceptance of the dropped file. Only the first file in a multi-file drop is processed.

The second is click to browse. Clicking anywhere on the dropzone area opens the operating system's native file picker. This is handled by the hidden `input` element that `react-dropzone` manages.

The third is camera capture. Clicking the CAPTURE button below the dropzone calls `navigator.mediaDevices.getUserMedia` with `facingMode: 'environment'` to request the rear-facing camera on mobile devices. The video stream is displayed in a fullscreen overlay. Clicking the shutter button draws the current video frame onto an offscreen canvas, converts it to a JPEG Blob at 90% quality, wraps it in a `File` object, and passes it to `onFileSelect`.

**Camera cleanup:**

When the camera overlay is closed, all tracks in the media stream are stopped and the stream reference is cleared. This ensures the camera indicator light on the device is turned off.

---

## MetadataEditor

**File:** `src/components/MetadataEditor.tsx`

MetadataEditor is the main content panel. It renders the metadata table, the category tabs, and the commit button.

**Props:**

| Prop | Type | Description |
|---|---|---|
| metadata | `any` | The flat metadata object returned by the server |
| onUpdate | `(updates: any) => void` | Called when the user clicks COMMIT with the modified fields |
| isUpdating | `boolean` | When true, the commit button shows a spinner and is disabled |

**Local state:**

MetadataEditor maintains its own `editedMetadata` state object that tracks only the fields the user has modified. This object starts empty and grows as the user edits fields. When `metadata` changes (because a new file was loaded or metadata was refreshed), `editedMetadata` is reset to empty via a `useEffect` hook.

**Tab system:**

The five tabs filter the full list of metadata keys using substring matching on the lowercased key name. The filtering logic is contained in the `getFields` function.

| Tab ID | Matched substrings |
|---|---|
| all | (all keys) |
| image | make, model, fnumber, iso, exposure, aperture, shutter, lens, focal |
| gps | gps, latitude, longitude, altitude, coord, position, loc |
| date | date, time, create, modify, original, birth |
| file | file, size, format, name, path, mimetype |

**Editable vs read-only fields:**

Fields whose value is a primitive type (string or number) are rendered as `input` elements. Fields whose value is an object or array are rendered as non-interactive text showing the JSON stringification. Object values represent complex tag structures that cannot be meaningfully edited as a flat string.

**DIRTY indicator:**

If a field key exists in `editedMetadata`, the row displays a "DIRTY" badge and the value is rendered in the primary theme color to indicate a pending change.

**COMMIT button state:**

The COMMIT button is enabled only when `editedMetadata` contains at least one key. The `canUpdate` boolean is derived from `Object.keys(editedMetadata).length > 0`. When `isUpdating` is true, the button shows a rotating icon and the label changes to "COMMIT...".

---

## MediaPreview

**File:** `src/components/MediaPreview.tsx`

MediaPreview renders a visual preview of the loaded file in the sidebar navigator.

**Props:**

| Prop | Type | Description |
|---|---|---|
| file | `File` | The currently loaded file object |
| previewUrl | `string or null` | A local object URL created from the file |

**Rendering logic:**

The component checks `file.type` to determine which element to render.

Images (`image/*`) are rendered as an `img` element with `object-contain` sizing to fit within the preview area without cropping.

Videos (`video/*`) are rendered as a `video` element with native browser controls. The `controls` attribute is set, allowing the user to play, pause, and scrub within the sidebar.

Audio files (`audio/*`) are rendered with a large music note icon and a compact `audio` element with native controls.

ZIP archives and any other unrecognized types are rendered as a generic file or archive icon with the filename displayed below.

All previews include a format badge in the upper right corner showing the file subtype (the part of the MIME type after the slash). If the MIME type is unavailable, `0xBIN` is displayed as a fallback.

---

## ThemeSelector

**File:** `src/components/ThemeSelector.tsx`

ThemeSelector renders a panel listing all available themes with a swatch and a select button for each.

**Props:**

| Prop | Type | Description |
|---|---|---|
| currentThemeId | `string` | The ID of the currently active theme |
| onThemeChange | `(themeId: string) => void` | Called when the user selects a theme |
| onClose | `() => void` | Called when the user clicks the close button |

**Layout:**

The panel slides in from the right side of the screen, positioned below the header. It is 256 pixels wide and occupies the full remaining height of the viewport. On mobile, it overlaps the sidebar and main panel.

**Active state:**

The currently active theme row is rendered with the primary color as background and black text. A checkmark icon appears on the right of the active row. All other rows use the surface background color with muted text.

---

## HelpOverlay

**File:** `src/components/HelpOverlay.tsx`

HelpOverlay renders a modal dialog containing a usage guide for the four main application operations.

**Props:**

| Prop | Type | Description |
|---|---|---|
| onClose | `() => void` | Called when the user clicks the close button or the CLOSE_GUIDE button |

**Content:**

The overlay contains four guide items, each with an icon, a title, and a description sentence. The four items cover: importing a file, editing metadata tags, committing changes, and exporting the modified file.

A note at the bottom of the overlay explains that ExifTool is used for server-side processing.

**Animation:**

The overlay uses `motion.div` from the Motion library with `opacity: 0` as the initial state and `opacity: 1` as the animate state. The exit animation reverses to `opacity: 0`. The AnimatePresence wrapper in App.tsx ensures the exit animation plays before the component is removed from the DOM.
