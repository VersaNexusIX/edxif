# Troubleshooting

This document covers the most common issues encountered when installing, running, and using EDXIF PRO, along with their causes and solutions.

---

## Installation Issues

### npm install fails with an ExifTool binary error

**Symptom:** The installation completes with errors related to `exiftool-vendored`, or the package reports that it cannot find or execute the ExifTool binary.

**Cause:** The `exiftool-vendored` package downloads a platform-specific Perl binary during installation. This can fail if Node.js does not have sufficient permissions to write to the installation directory, or if the system is behind a network proxy that blocks the download.

**Solution:**

Verify that Node.js 18 or higher is installed:

```bash
node --version
```

If the binary download failed due to a network issue, delete the `node_modules` directory and retry with the npm cache cleared:

```bash
rm -rf node_modules
npm cache clean --force
npm install
```

If the issue persists on Linux, verify that Perl is installed on the system, as `exiftool-vendored` on Linux relies on the system Perl rather than a bundled binary:

```bash
perl --version
```

Install Perl if it is missing:

```bash
# Debian or Ubuntu
sudo apt-get install perl

# Fedora or Red Hat
sudo dnf install perl

# macOS (using Homebrew)
brew install perl
```

---

### The server starts but the browser shows a blank page

**Symptom:** Running `npm run dev` succeeds and the terminal shows the server is listening, but opening `http://localhost:3000` shows a blank or error page.

**Cause:** In development mode, the Vite middleware serves the frontend. If Vite fails to start, the server still listens but cannot respond to frontend requests.

**Solution:**

Check the terminal output for Vite errors. Common causes include a syntax error in a source file, a missing dependency, or a port conflict.

If the terminal shows a port conflict error, another process is already using port 3000. Find and stop that process, or change the port in `server.ts`.

On macOS, port 5000 is sometimes occupied by AirPlay Receiver. Port 3000 is generally safe, but verify there is no conflict:

```bash
lsof -i :3000
```

---

## Metadata Extraction Issues

### "Extraction failed" error after uploading a file

**Symptom:** After selecting a file, the Navigator panel shows an error message beginning with "ERR: Extraction failed".

**Cause:** Both ExifReader and ExifTool were unable to extract metadata from the file. This can happen with corrupted files, files with no embedded metadata, or file formats that neither library supports.

**Solution:**

Verify the file is not corrupted by opening it in its native application (an image viewer, media player, or audio application).

Check that the file format is in the supported list described in the [Overview](OVERVIEW.md). If the format is listed as supported, the file may have been created by software that does not embed standard metadata.

If the file is a RAW format from a camera, ensure the version of `exiftool-vendored` is recent enough to support that specific camera model. Some newer cameras produce RAW files that require a newer ExifTool version to parse.

---

### GPS fields are empty for a photo taken on a smartphone

**Symptom:** A photo taken on a smartphone shows no GPS data in the Location tab.

**Cause:** Location services may have been disabled for the camera application at the time the photo was taken, or the photo may have been re-exported by an application that strips GPS data.

**Solution:**

Switch to the "All Tags" tab and search for any field containing "GPS" in the identifier column. If no GPS fields appear at all, the photo genuinely contains no location data.

If GPS fields appear but are empty or zero, the camera captured the photo without a valid GPS fix. This is common indoors or in areas with poor satellite visibility.

---

### Some fields show as read-only (displayed as JSON, not editable)

**Symptom:** Certain metadata fields in the table cannot be clicked to edit. They show the value as a JSON string surrounded by brackets or braces.

**Cause:** These fields contain structured values such as arrays or nested objects. The editor does not support editing structured values as free-form text because the format is complex and varies by tag type. Modifying these fields incorrectly would corrupt the metadata structure.

**Solution:**

For fields that require structured editing (such as GPS coordinate arrays or thumbnail data), use ExifTool directly from the command line with the appropriate format syntax. Refer to the ExifTool documentation for the specific tag.

---

## Metadata Writing Issues

### COMMIT fails with "Update failed" error

**Symptom:** After clicking COMMIT, the interface shows an error message beginning with "ERR: Update failed".

**Cause:** ExifTool was unable to write one or more of the requested metadata changes. Common reasons include: an attempt to write to a read-only or computed tag, a value in the wrong format for the target tag, or a file format that ExifTool does not support for writing.

**Solution:**

Identify which field caused the error. The current implementation reports the first ExifTool error encountered. Try committing one field at a time by reloading the file and editing only a single field before clicking COMMIT.

For GPS fields, ensure latitude and longitude values are decimal degree numbers (e.g., `37.7749`, `-122.4194`) and not in degrees-minutes-seconds format.

For date fields, ensure values conform to the EXIF date format: `YYYY:MM:DD HH:MM:SS` (note the colons in the date portion, which is the EXIF standard).

---

### The exported file is identical to the original

**Symptom:** After COMMIT and EXPORT, the downloaded file appears to have no metadata changes when inspected with another tool.

**Cause:** The COMMIT operation may have failed silently, or the modified file reference was not updated correctly before the EXPORT action.

**Solution:**

After clicking COMMIT, wait for the interface to complete the round trip. The metadata table should refresh and the previously modified fields should show their new values. If the table does not refresh, the commit failed.

Verify success by checking for the "OK: Metadata updated successfully" message in the Navigator panel after committing.

If the message appears but the exported file still has the old metadata, try downloading and inspecting the file with a third-party tool such as ExifTool directly or the Exif Metadata Viewer browser extension to confirm whether the changes are present.

---

## Camera Capture Issues

### Camera button does nothing or shows "Failed to access camera"

**Symptom:** Clicking the CAPTURE button either has no effect or immediately shows an alert with "Failed to access camera".

**Cause:** The browser does not have permission to access the camera, or the device has no camera available.

**Solution:**

Check browser permissions. In Chrome, click the camera icon in the address bar and ensure the site has camera access. In Firefox, look for a camera permission prompt that may have been dismissed. In Safari, go to Settings, then Websites, then Camera, and grant access for `localhost`.

Camera access requires a secure context. When accessing the application over `http://`, camera access is only permitted for `localhost`. If the application is hosted at a non-localhost HTTP address (such as a local IP address like `192.168.1.x`), camera access will be blocked by the browser. Access the application over HTTPS or use `localhost` instead.

---

### Camera opens but CAPTURE does not produce a file

**Symptom:** The camera overlay opens and shows a live video feed, but clicking the shutter button closes the overlay without loading a file into the editor.

**Cause:** The canvas-based capture failed silently. This can happen if the video element has not received enough frames, or if canvas operations are blocked by browser security policies.

**Solution:**

Wait a moment after the camera opens before clicking the shutter. The video stream needs a brief moment to initialize before the first frame is available for capture.

If the issue persists, check the browser console for any security-related errors regarding canvas `toBlob` or `getContext` operations.

---

## Performance Issues

### The interface is slow or unresponsive with large files

**Symptom:** Uploading a file larger than approximately 50 MB causes the interface to feel sluggish, or the browser shows a "page unresponsive" warning.

**Cause:** The file upload uses `FormData`, which must hold the entire file in memory. The preview URL creation uses `URL.createObjectURL`, which also references the file in memory. For very large video files, the browser may struggle to maintain multiple copies in memory simultaneously.

**Solution:**

EDXIF PRO is optimized for typical camera files (images up to approximately 100 MB, short video clips). For very large video files, consider using ExifTool directly from the command line, which can process files of any size without loading them entirely into memory.

If operating on a device with limited RAM, close other browser tabs before working with large files.

---

### ExifTool takes a long time on the first request

**Symptom:** The first metadata extraction after starting the server is slow (5 to 10 seconds). Subsequent requests are fast.

**Cause:** `exiftool-vendored` starts a persistent ExifTool process on the first request and keeps it alive for subsequent requests. The startup time is the cost of launching the Perl interpreter and loading the ExifTool modules. This is a one-time cost per server session.

**Solution:**

This behavior is expected and normal. No action is required. If startup time is consistently too long, ensure Perl and ExifTool are available and that the system is not under heavy load.
