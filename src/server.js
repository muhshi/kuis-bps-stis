const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const apiRouter = require('./routes/api');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    // HTML files should not be aggressively cached so updates appear immediately
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// API Routes
app.use('/api', apiRouter);

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server function for testing / app export
function startServer(port = PORT) {
  return new Promise((resolve) => {
    initDb().catch(err => console.warn('[DB] Init schema warning:', err.message));
    const server = app.listen(port, () => {
      console.log(`===============================================`);
      console.log(`🚀 Kuis Sosialisasi STIS & BPS Server Aktif!`);
      console.log(`📱 Web Kuis Siswa: http://localhost:${port}`);
      console.log(`📺 Layar TV Booth:  http://localhost:${port}/tv.html`);
      console.log(`📊 Export Data:     http://localhost:${port}/api/admin/export-csv?token=bps-stis-2026`);
      console.log(`===============================================`);
      resolve(server);
    });
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
