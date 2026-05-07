# Changelog

All notable changes to EDXIF PRO are documented in this file. The format follows the conventions of Keep a Changelog. Versions are numbered using Semantic Versioning.

---

## 1.0.42 (Current)

### Added

Two-stage metadata extraction pipeline. ExifReader is now attempted first for speed. ExifTool is used as a fallback when ExifReader returns no results, improving compatibility with audio, video, and less common image formats.

Camera capture feature. On supported devices, users can open the rear-facing camera directly from the import panel, take a photograph, and immediately load it into the metadata editor without saving to disk first.

33 built-in color themes with an in-session theme selector. Themes are applied using CSS custom properties and take effect instantly without a page reload.

Mobile-responsive layout with a collapsible sidebar. On small screens, a hamburger menu reveals the navigator panel and file controls. The main metadata panel occupies the full viewport on mobile.

Help overlay explaining the four primary workflow steps: import, edit, commit, and export.

Media type-specific preview rendering. Images are displayed as scaled thumbnails. Videos are displayed with a native player control bar. Audio files are displayed with an audio player. Archives and unknown types are displayed with a type icon.

"DIRTY" field indicators. Modified metadata fields display a badge to show which values are pending commit.

Animated transitions for the theme selector panel, help overlay, and status messages using Motion.

---

## Planned

### Batch Processing

The ability to upload multiple files and apply the same metadata changes across all of them in a single commit operation.

### Metadata Templates

The ability to save a set of metadata values as a named template and apply it to any subsequent file with a single click.

### GPS Map Preview

When GPS coordinates are present, display a small map thumbnail in the navigator panel showing the location where the file was captured.

### Metadata History

A per-session undo stack allowing users to revert individual field edits before committing.

### ZIP Metadata Writing

Support for writing metadata into ZIP archive comment fields and extended attribute records.

### Drag-to-Reorder Tags

The ability to reorder custom metadata fields within the editor table by dragging rows.
