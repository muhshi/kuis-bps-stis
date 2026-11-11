const express = require('express');
const router = express.Router();
const quizService = require('../services/quizService');
const db = require('../db');
let QRCode = null;
try {
  QRCode = require('qrcode');
} catch (e) {}

// Healthcheck
router.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// QR Code SVG generator for TV Booth & Promos
router.get('/qrcode', async (req, res) => {
  try {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol || 'http';
    const defaultUrl = `${protocol}://${host}`;
    const targetUrl = req.query.url || defaultUrl;

    if (QRCode) {
      const svg = await QRCode.toString(targetUrl, {
        type: 'svg',
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(svg);
    }
    res.status(503).send('QR Code module not available');
  } catch (err) {
    res.status(500).send('Error creating QR Code');
  }
});

// Get participant status & completed categories
router.get('/participant/:id', async (req, res) => {
  try {
    const partId = parseInt(req.params.id, 10);
    const status = await quizService.getParticipantStatus(partId);
    if (!status) {
      return res.status(404).json({ success: false, error: 'Peserta tidak ditemukan' });
    }
    res.json({ success: true, data: status });
  } catch (err) {
    console.error('Error on /api/participant/:id:', err);
    res.status(500).json({ success: false, error: 'Gagal memuat status peserta' });
  }
});

// Start session for a specific category
router.post('/quiz/start', async (req, res) => {
  try {
    const { participantId, nama, sekolah, wa, kategoriKode } = req.body || {};

    if (!participantId) {
      if (!nama || typeof nama !== 'string' || nama.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Nama peserta wajib diisi' });
      }
      if (!sekolah || typeof sekolah !== 'string' || sekolah.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Asal sekolah wajib diisi' });
      }
    }

    const sessionData = await quizService.startSession({
      participantId: participantId ? parseInt(participantId, 10) : null,
      nama,
      sekolah,
      wa,
      kategoriKode: kategoriKode || 'logika'
    });

    res.json({ success: true, data: sessionData });
  } catch (err) {
    console.error('Error on /api/quiz/start:', err);
    res.status(400).json({ success: false, error: err.message || 'Gagal memulai sesi kuis' });
  }
});

// Finish session & calculate scores
router.post('/quiz/finish', async (req, res) => {
  try {
    const { sessionId, participantId, kategoriKode, answers } = req.body || {};

    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'Session ID diperlukan' });
    }

    const result = await quizService.finishSession({
      sessionId,
      participantId: participantId ? parseInt(participantId, 10) : null,
      kategoriKode,
      answers: Array.isArray(answers) ? answers : []
    });

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error on /api/quiz/finish:', err);
    res.status(500).json({ success: false, error: err.message || 'Gagal memproses hasil kuis' });
  }
});

// Leaderboard live snapshot (Supports ?kategori=all | logika | data | stis)
router.get('/leaderboard', async (req, res) => {
  try {
    const kategori = (req.query.kategori || 'all').toLowerCase();
    const leaderboard = await quizService.getLeaderboardSnapshot(kategori);
    res.set('Cache-Control', 'public, max-age=1');
    res.json({ success: true, data: leaderboard });
  } catch (err) {
    console.error('Error on /api/leaderboard:', err);
    res.status(500).json({ success: false, error: 'Gagal memuat leaderboard' });
  }
});

function isValidAdminToken(req) {
  const token = req.query.token || req.headers['x-admin-token'];
  const validToken = process.env.ADMIN_TOKEN || 'bps-stis-2026';
  return token === validToken;
}

// Admin Overview (Stats, All Schools, Participant List)
router.get('/admin/overview', async (req, res) => {
  try {
    if (!isValidAdminToken(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Token operator salah' });
    }
    const overview = await quizService.getAdminOverview();
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, data: overview });
  } catch (err) {
    console.error('Error on /api/admin/overview:', err);
    res.status(500).json({ success: false, error: 'Gagal memuat data operator' });
  }
});

// Admin CSV Export
router.get('/admin/export-csv', async (req, res) => {
  try {
    if (!isValidAdminToken(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Token admin salah' });
    }

    const queryRes = await db.query(
      `SELECT p.id, p.nama, p.nama_clean, p.sekolah, p.sekolah_clean, p.wa,
              s.kategori_kode, s.total_score, s.correct_count, s.total_time_ms, s.badge_title, s.started_at, s.finished_at
       FROM participants p
       LEFT JOIN quiz_sessions s ON s.participant_id = p.id
       ORDER BY s.total_score DESC NULLS LAST, p.created_at ASC`
    );

    const rows = queryRes.rows || [];
    let csv = 'ID,Nama Asli,Nama Clean,Sekolah Asli,Sekolah Clean,WhatsApp,Kategori,Total Skor,Benar,Waktu (detik),Gelar Badge,Waktu Mulai,Waktu Selesai\n';

    rows.forEach(r => {
      const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
      const timeSec = r.total_time_ms ? (r.total_time_ms / 1000).toFixed(1) : '0';
      csv += [
        r.id,
        escape(r.nama),
        escape(r.nama_clean),
        escape(r.sekolah),
        escape(r.sekolah_clean),
        escape(r.wa),
        escape(r.kategori_kode || '-'),
        r.total_score || 0,
        r.correct_count || 0,
        timeSec,
        escape(r.badge_title),
        escape(r.started_at),
        escape(r.finished_at)
      ].join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="data-kuis-bps-stis.csv"');
    res.send(csv);
  } catch (err) {
    console.error('Error on /api/admin/export-csv:', err);
    res.status(500).json({ success: false, error: 'Gagal mengekspor data' });
  }
});

module.exports = router;
