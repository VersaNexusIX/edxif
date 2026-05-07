# EDXIF PRO

**Professional Metadata Editor for Images, Videos, Audio, and Archives**

EDXIF PRO is a web-based application that provides full read and write access to embedded file metadata. It supports EXIF, GPS coordinates, timestamps, camera settings, and dozens of other technical markers across a wide range of media formats. The interface is built with a retro terminal aesthetic and supports over 30 selectable color themes.

---

## Table of Contents

- [Overview](docs/OVERVIEW.md)
- [Getting Started](docs/GETTING-STARTED.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API-REFERENCE.md)
- [Components](docs/COMPONENTS.md)
- [Themes](docs/THEMES.md)
- [Configuration](docs/CONFIGURATION.md)

---

## Quick Start

**Requirements:** Node.js 18 or higher

```bash
# Install all dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## What EDXIF PRO Does

When a file is uploaded, the server extracts its embedded metadata using ExifReader and ExifTool. The extracted fields are presented in a tabular editor grouped by category: camera settings, GPS location, timestamps, and system-level file properties. Any field can be edited inline. Once changes are committed, ExifTool rewrites the metadata into the file binary, and the modified file is made available for download.

The entire workflow runs locally. No data is sent to external services.

---

## Supported Formats

EDXIF PRO can read and write metadata for the following file types.

**Images:** JPEG, PNG, TIFF, WebP, HEIC, RAW variants (CR2, NEF, ARW)

**Video:** MP4, MOV, AVI, MKV

**Audio:** MP3, FLAC, WAV, AAC, OGG

**Archives:** ZIP (read metadata only)

---

## License

Private. All rights reserved.
