# API Reference

The EDXIF PRO server exposes two HTTP endpoints. Both accept `multipart/form-data` requests and return JSON or binary responses. There is no authentication required for local use.

---

## POST /api/metadata

Extract all embedded metadata tags from an uploaded file.

### Request

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| file | Binary | Yes | The media file to extract metadata from |

### Response

**Success (200)**

**Content-Type:** `application/json`

```json
{
  "metadata": {
    "TagName": "value",
    "AnotherTag": "another value"
  },
  "filename": "original_filename.jpg",
  "mimetype": "image/jpeg"
}
```

The `metadata` object is a flat dictionary. Keys are EXIF tag names. Values are always strings or numbers. Nested tag structures from ExifReader are flattened during processing: the `description` property of each tag object is used when present, otherwise the `value` property is used.

**Error (400)**

Returned when no file is included in the request.

```json
{
  "error": "No file uploaded"
}
```

**Error (500)**

Returned when the server fails to read or process the file.

```json
{
  "error": "Extraction failed: <error message from ExifReader or ExifTool>"
}
```

### Extraction Logic

The endpoint uses a two-stage extraction strategy.

In the first stage, ExifReader attempts to parse the file buffer in pure JavaScript. ExifReader is fast because it does not spawn a child process, but it has more limited format support than ExifTool.

In the second stage, if ExifReader returns zero tags, ExifTool is invoked via the `exiftool-vendored` wrapper. ExifTool supports hundreds of formats and thousands of tag types but requires spawning a Perl process. The ExifTool process is kept alive between requests by the `exiftool-vendored` library's connection pooling.

---

## POST /api/update-metadata

Write modified metadata values into a file and return the updated binary.

### Request

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| file | Binary | Yes | The media file to modify |
| updates | String | Yes | A JSON-serialized object containing the key-value pairs to write |

The `updates` field must be a valid JSON string. Each key must be a recognized EXIF tag name. Each value must be a string or number compatible with the tag's expected type. Example:

```json
{
  "Make": "Fujifilm",
  "Model": "X-T5",
  "GPSLatitude": "35.6762",
  "GPSLongitude": "139.6503"
}
```

### Response

**Success (200)**

**Content-Type:** The MIME type of the uploaded file (e.g., `image/jpeg`)

**Content-Disposition:** `attachment; filename="<original filename>"`

The response body is the binary content of the modified file. The browser will treat this as a file download.

**Error (400)**

Returned when the file or updates field is missing.

```json
{
  "error": "Missing input"
}
```

**Error (500)**

Returned when ExifTool fails to write the metadata.

```json
{
  "error": "Update failed: <error message from ExifTool>"
}
```

### Write Behavior

ExifTool performs an in-place write on the temporary copy of the uploaded file. Only the fields specified in the `updates` object are modified. All other existing metadata fields are preserved. ExifTool creates an internal backup of the original data before writing, which is discarded after a successful write.

Some fields cannot be written. These include computed fields, read-only proprietary tags, and format-level structural fields. If any of the requested updates contain an unwritable tag, ExifTool will return a warning. This warning is currently propagated as a 500 error. Future versions of the API may distinguish between partial success and complete failure.

---

## Error Handling

The frontend performs its own validation before sending requests. If the server returns a non-OK HTTP status, the response body is parsed for an `error` field. If the response is not JSON, the raw status text is used as the error message. Errors are displayed in the Navigator panel below the file descriptor section.

---

## Using the API Directly

The API can be used independently of the browser frontend, for example with `curl` for scripting or testing.

**Extract metadata from a file:**

```bash
curl -X POST http://localhost:3000/api/metadata \
  -F "file=@/path/to/photo.jpg"
```

**Write metadata to a file and save the result:**

```bash
curl -X POST http://localhost:3000/api/update-metadata \
  -F "file=@/path/to/photo.jpg" \
  -F 'updates={"Make":"Nikon","Model":"Z9"}' \
  -o modified_photo.jpg
```
