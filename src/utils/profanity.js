/**
 * Filter kata-kata tidak pantas / kotor pada nickname siswa agar aman tampil di layar TV booth.
 */

const BAD_WORDS = [
  'anjing', 'babi', 'monyet', 'bangsat', 'kontol', 'memek', 'jembut', 'pantek',
  'itil', 'pepek', 'ngentot', 'titit', 'bokep', 'porno', 'bajingan', 'tolol',
  'goblok', 'idiot', 'perek', 'bitch', 'fuck', 'shit', 'asshole', 'bastard',
  'dick', 'pussy', 'slut', 'whore', 'cunt'
];

function sanitizeNickname(rawName) {
  if (!rawName || typeof rawName !== 'string') return 'Siswa BPS';

  let sanitized = rawName.trim().replace(/\s+/g, ' ');
  if (sanitized.length === 0) return 'Siswa BPS';

  // Limit nickname length to 25 chars for neat TV display
  if (sanitized.length > 25) {
    sanitized = sanitized.substring(0, 25);
  }

  // Check bad words
  let lower = sanitized.toLowerCase();
  for (const word of BAD_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(lower)) {
      sanitized = sanitized.replace(regex, '***');
    }
  }

  return sanitized;
}

module.exports = { sanitizeNickname, BAD_WORDS };
