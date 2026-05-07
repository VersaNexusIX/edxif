# Overview

## What is EDXIF PRO

EDXIF PRO is a professional-grade metadata editing tool that runs entirely in the browser backed by a lightweight Node.js server. It is designed for photographers, videographers, audio engineers, archivists, and developers who need precise control over the technical metadata embedded in their media files.

The name EDXIF is derived from "Edit EXIF", referencing the Exchangeable Image File Format standard that defines how metadata is stored in digital photographs and other media.

---

## Core Concepts

**Metadata** is structured data embedded inside a file that describes the file itself. For a photograph, metadata might include the camera model, lens focal length, shutter speed, GPS coordinates of where the photo was taken, and the date and time of capture. This data is invisible during normal file use but is read by software such as photo organizers, map applications, and digital asset management systems.

**EXIF** (Exchangeable Image File Format) is the most widely used metadata standard for images and is supported by virtually all digital cameras and smartphones. EXIF data travels with the file and persists across most editing operations.

**ExifTool** is a Perl-based command-line utility widely regarded as the most complete metadata processor available. It supports hundreds of file formats and thousands of individual tag types. EDXIF PRO uses a vendored Node.js wrapper around ExifTool for server-side read and write operations.

---

## Key Features

**Metadata Extraction**

When a file is uploaded, EDXIF PRO performs a two-stage extraction. It first uses ExifReader, a pure JavaScript library, to parse the raw binary headers of the file. If ExifReader returns an empty result, it falls back to ExifTool, which can process a much broader range of formats and edge cases. The combined result is presented to the user as a flat key-value table.

**Inline Editing**

Every scalar metadata field (any field that holds a plain string, number, or date) is directly editable in the browser. The editor tracks which fields have been modified and visually flags them with a "DIRTY" indicator. The user can see exactly which values will be written before committing.

**Server-Side Writing**

Metadata writing is handled server-side by ExifTool. This is intentional: ExifTool performs safe in-place writes that preserve the file's binary structure, pixel data, and audio content. Browser-only approaches cannot safely rewrite binary file formats. EDXIF PRO sends the file and the set of changes to the server, which returns the modified file for download.

**Camera Capture**

On devices with a camera, EDXIF PRO can open the rear-facing camera directly in the browser, capture a photograph, and immediately load the resulting JPEG for metadata inspection and editing. This is useful for testing metadata capture behavior on mobile devices.

**Theme Engine**

EDXIF PRO ships with 33 built-in color themes. Themes are applied using CSS custom properties on the document root, so the entire interface updates instantly without a page reload. The theme selection persists for the duration of the session.

---

## Use Cases

**Privacy Protection**

Modern smartphones embed precise GPS coordinates, device identifiers, and user information into every photograph. Before sharing images publicly, users can inspect and remove this data with EDXIF PRO to prevent unintended location disclosure.

**Digital Asset Management**

Organizations managing large media libraries often need to standardize or correct metadata fields across many files. EDXIF PRO provides a clear view of exactly what metadata is present in a given file and allows precise corrections.

**Forensic Inspection**

Researchers and investigators use metadata to verify the authenticity of images, check timestamps, and trace the origin of files. EDXIF PRO presents all embedded tags in an organized, readable format.

**Development and Testing**

Developers building applications that consume metadata can use EDXIF PRO to quickly inspect what fields are present in test files and verify that their metadata manipulation code produces the expected output.

---

## Limitations

The following limitations should be understood before use.

Files are uploaded to a temporary server directory at `/tmp/uploads` and are deleted after each operation. No file is retained on the server after the response is sent.

Metadata writing modifies a copy of the uploaded file. The original file on the user's device is never altered.

Some metadata fields are computed or read-only at the format level. ExifTool will report an error when attempting to write to such fields. EDXIF PRO will surface that error in the interface.

ZIP archive metadata is displayed as read-only. Writing metadata into ZIP containers is not supported in this version.
