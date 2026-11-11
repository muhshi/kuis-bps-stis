/**
 * Normalizes school names to avoid fragmentation in school leaderboard.
 * Example:
 * - "sma n 1 semarang" -> "SMAN 1 Semarang"
 * - "SMA NEGERI 1 SEMARANG" -> "SMAN 1 Semarang"
 * - "smkn 2 kudus" -> "SMKN 2 Kudus"
 * - "man 1 medan" -> "MAN 1 Medan"
 */

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function normalizeSchoolName(input) {
  if (!input || typeof input !== 'string') return 'Sekolah Lainnya';

  let cleaned = input.trim().replace(/\s+/g, ' ');
  if (cleaned.length === 0) return 'Sekolah Lainnya';

  let lower = cleaned.toLowerCase();

  // Normalize SMA Negeri / SMAN / SMA N
  lower = lower.replace(/\bsma\s+negeri\s+(\d+)\b/gi, 'SMAN $1');
  lower = lower.replace(/\bsma\s+n\s+(\d+)\b/gi, 'SMAN $1');
  lower = lower.replace(/\bsman(\d+)\b/gi, 'SMAN $1');
  lower = lower.replace(/\bsman\s+(\d+)\b/gi, 'SMAN $1');
  lower = lower.replace(/\bsma\s+(\d+)\b/gi, 'SMAN $1');

  // Normalize SMK Negeri / SMKN / SMK N
  lower = lower.replace(/\bsmk\s+negeri\s+(\d+)\b/gi, 'SMKN $1');
  lower = lower.replace(/\bsmk\s+n\s+(\d+)\b/gi, 'SMKN $1');
  lower = lower.replace(/\bsmkn(\d+)\b/gi, 'SMKN $1');
  lower = lower.replace(/\bsmkn\s+(\d+)\b/gi, 'SMKN $1');
  lower = lower.replace(/\bsmk\s+(\d+)\b/gi, 'SMKN $1');

  // Normalize MAN / MA Negeri
  lower = lower.replace(/\bma\s+negeri\s+(\d+)\b/gi, 'MAN $1');
  lower = lower.replace(/\bma\s+negeri\s+(?!\d)/gi, 'MAN ');
  lower = lower.replace(/\bman(\d+)\b/gi, 'MAN $1');
  lower = lower.replace(/\bman\s+(\d+)\b/gi, 'MAN $1');

  // Format capitalized
  const parts = lower.split(' ').map((p) => {
    const upperP = p.toUpperCase();
    if (upperP.startsWith('SMAN') || upperP.startsWith('SMKN') || upperP.startsWith('MAN') || upperP === 'SMA' || upperP === 'SMK' || upperP === 'MA' || upperP === 'NU' || upperP === 'PGRI' || upperP === 'IT') {
      return upperP;
    }
    return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  });

  return parts.join(' ');
}

module.exports = { normalizeSchoolName };
