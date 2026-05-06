import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { exiftool } from 'exiftool-vendored';
import ExifReader from 'exifreader';
const __filename = fileURLToPath(import.meta.url), __dirname = path.dirname(__filename);
async function startServer() {
  const app = express(), PORT = 3000, uploadDir = 'tmp/uploads';
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const upload = multer({ dest: uploadDir });
  app.use(express.json()); app.use(express.urlencoded({ extended: true }));
  app.post('/api/metadata', upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      const data = fs.readFileSync(req.file.path), tags = ExifReader.load(data), metadata: Record<string, any> = {};
      for (const [key, value] of Object.entries(tags)) {
        if (value && typeof value === 'object') metadata[key] = (value as any).description || (value as any).value;
        else metadata[key] = value;
      }
      if (Object.keys(metadata).length === 0) { const etMetadata = await exiftool.read(req.file.path); Object.assign(metadata, etMetadata); }
      res.json({ metadata, filename: req.file.originalname, mimetype: req.file.mimetype });
    } catch (error: any) { res.status(500).json({ error: `Extraction failed: ${error.message}` }); }
  });
  app.post('/api/update-metadata', upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file || !req.body.updates) return res.status(400).json({ error: 'Missing input' });
      await exiftool.write(req.file.path, JSON.parse(req.body.updates));
      const fileBuffer = fs.readFileSync(req.file.path);
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      res.setHeader('Content-Type', req.file.mimetype || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname}"`);
      res.send(fileBuffer);
    } catch (error: any) { res.status(500).json({ error: `Update failed: ${error.message}` }); }
  });
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath)); app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '='.repeat(50));
    console.log(' EDXIF PRO TERMINAL : INITIALIZED');
    console.log('='.repeat(50));
    console.log(' STATUS    : OPERATIONAL');
    console.log(` PORT      : ${PORT}`);
    console.log(` LOCAL     : http://localhost:${PORT}`);
    console.log(' ENGINE    : DUAL_CORE_METADATA');
    console.log(' MODE      : ' + (process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT'));
    console.log('='.repeat(50));
    console.log(' READY FOR DATA INGESTION');
    console.log('='.repeat(50) + '\n');
  });
}
startServer();
