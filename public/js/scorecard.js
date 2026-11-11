/**
 * Shareable Digital Score Card Generator (1080x1920 IG Story / WhatsApp Portrait)
 * Menggunakan HTML5 Canvas 2D murni (tanpa dependensi eksternal, 100% bekerja offline).
 */
(function (global) {
  function drawRoundRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function wrapTextCentered(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text || '').split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    if (line.trim()) lines.push(line.trim());

    lines.forEach((l, i) => {
      ctx.fillText(l, x, y + i * lineHeight);
    });
    return lines.length;
  }

  function resolveHighestBadge(totalScore, completedCount) {
    if (completedCount >= 3 && totalScore >= 25000) {
      return { icon: '👑', title: 'Legenda Statistika Demak', sub: 'Penakluk 3 Kategori Tantangan!' };
    }
    if (totalScore >= 11000) {
      return { icon: '🏆', title: 'Grand Master Statistika', sub: 'Calon Taruna/Mahasiswa Unggulan STIS!' };
    }
    if (totalScore >= 8000) {
      return { icon: '🎯', title: 'Detektif Data Handal', sub: 'Nalar Kuat & Melek Data Indonesia!' };
    }
    if (totalScore >= 5000) {
      return { icon: '⚡', title: 'Pejuang Logika Tangguh', sub: 'Berani Menjawab & Berpotensi Tinggi!' };
    }
    return { icon: '🌱', title: 'Sahabat Muda BPS Demak', sub: 'Terus Asah Nalar & Ilmu Data!' };
  }

  function renderScoreCardCanvas(canvas, payload, theme = 'light') {
    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    const isDark = theme === 'dark';
    const palette = isDark
      ? {
          bgTop: '#0b1120',
          bgMid: '#13203b',
          bgBot: '#090d16',
          blob1: 'rgba(56, 189, 248, 0.16)',
          blob2: 'rgba(245, 158, 11, 0.14)',
          cardBg: 'rgba(30, 41, 59, 0.92)',
          cardBorder: 'rgba(255, 255, 255, 0.14)',
          innerBg: 'rgba(15, 23, 42, 0.72)',
          innerBorder: 'rgba(255, 255, 255, 0.10)',
          textMain: '#f8fafc',
          textMuted: '#94a3b8',
          pillBg: 'rgba(56, 189, 248, 0.16)',
          pillBorder: 'rgba(56, 189, 248, 0.4)',
          pillText: '#38bdf8',
          accentGold: '#fbbf24',
          accentGoldBg: 'rgba(251, 191, 36, 0.14)',
          accentBlue: '#38bdf8',
          accentGreen: '#34d399',
          footerBg: 'rgba(2, 132, 199, 0.18)',
          footerBorder: 'rgba(56, 189, 248, 0.35)'
        }
      : {
          bgTop: '#e0f2fe',
          bgMid: '#f8fafc',
          bgBot: '#e2e8f0',
          blob1: 'rgba(2, 132, 199, 0.14)',
          blob2: 'rgba(245, 158, 11, 0.14)',
          cardBg: '#ffffff',
          cardBorder: '#cbd5e1',
          innerBg: '#f8fafc',
          innerBorder: '#e2e8f0',
          textMain: '#0f172a',
          textMuted: '#64748b',
          pillBg: 'rgba(2, 132, 199, 0.10)',
          pillBorder: 'rgba(2, 132, 199, 0.30)',
          pillText: '#0284c7',
          accentGold: '#d97706',
          accentGoldBg: 'rgba(245, 158, 11, 0.12)',
          accentBlue: '#0284c7',
          accentGreen: '#059669',
          footerBg: '#f0f9ff',
          footerBorder: '#bae6fd'
        };

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, palette.bgTop);
    grad.addColorStop(0.5, palette.bgMid);
    grad.addColorStop(1, palette.bgBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Decorative ambient glows
    ctx.fillStyle = palette.blob1;
    ctx.beginPath();
    ctx.arc(160, 260, 340, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette.blob2;
    ctx.beginPath();
    ctx.arc(920, 1620, 360, 0, Math.PI * 2);
    ctx.fill();

    // Subtle dot pattern
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)';
    for (let dx = 60; dx < W; dx += 60) {
      for (let dy = 60; dy < H; dy += 60) {
        ctx.beginPath();
        ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Main Card Container
    const cardX = 72;
    const cardY = 120;
    const cardW = W - 144;
    const cardH = H - 240;

    ctx.save();
    ctx.shadowColor = isDark ? 'rgba(0,0,0,0.55)' : 'rgba(15, 23, 42, 0.14)';
    ctx.shadowBlur = 45;
    ctx.shadowOffsetY = 20;
    drawRoundRect(ctx, cardX, cardY, cardW, cardH, 48);
    ctx.fillStyle = palette.cardBg;
    ctx.fill();
    ctx.restore();

    drawRoundRect(ctx, cardX, cardY, cardW, cardH, 48);
    ctx.lineWidth = 3;
    ctx.strokeStyle = palette.cardBorder;
    ctx.stroke();

    // Top Header Pill
    const pillW = 660;
    const pillH = 68;
    const pillX = (W - pillW) / 2;
    const pillY = cardY + 64;
    drawRoundRect(ctx, pillX, pillY, pillW, pillH, 34);
    ctx.fillStyle = palette.pillBg;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = palette.pillBorder;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = palette.pillText;
    ctx.font = '800 28px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.fillText('🏛️ BPS KAB. DEMAK × POLSTAT STIS', W / 2, pillY + pillH / 2);

    // Event Subtitle
    ctx.fillStyle = palette.textMuted;
    ctx.font = '700 26px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.fillText('KARTU SKOR KUIS PAMERAN PENDIDIKAN', W / 2, pillY + 114);

    // Trophy & Badge Section
    const badge = payload.badge || resolveHighestBadge(payload.totalScore, payload.completedCount);
    ctx.font = '130px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.fillText(badge.icon || '🏆', W / 2, pillY + 245);

    ctx.fillStyle = palette.accentGold;
    ctx.font = '900 48px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    wrapTextCentered(ctx, badge.title, W / 2, pillY + 355, cardW - 120, 56);

    ctx.fillStyle = palette.textMuted;
    ctx.font = '600 28px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    wrapTextCentered(ctx, badge.sub, W / 2, pillY + 422, cardW - 120, 38);

    // Participant Box
    const boxX = cardX + 56;
    const boxW = cardW - 112;
    const partY = pillY + 490;
    const partH = 165;
    drawRoundRect(ctx, boxX, partY, boxW, partH, 28);
    ctx.fillStyle = palette.innerBg;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = palette.innerBorder;
    ctx.stroke();

    ctx.fillStyle = palette.textMain;
    ctx.font = '900 46px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.fillText(payload.nama || 'Peserta Kuis', W / 2, partY + 58);

    ctx.fillStyle = palette.accentBlue;
    ctx.font = '800 32px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.fillText(`🏫 ${payload.sekolah || 'SMAN 1 Demak'}`, W / 2, partY + 118);

    // Cumulative Score Highlight Box
    const scoreY = partY + partH + 34;
    const scoreH = 230;
    drawRoundRect(ctx, boxX, scoreY, boxW, scoreH, 32);
    ctx.fillStyle = palette.accentGoldBg;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = palette.accentGold;
    ctx.stroke();

    ctx.fillStyle = palette.textMuted;
    ctx.font = '800 26px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.fillText('TOTAL AKUMULASI SKOR', W / 2, scoreY + 48);

    ctx.fillStyle = palette.accentGold;
    ctx.font = '900 94px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.fillText(`${Number(payload.totalScore || 0).toLocaleString('id-ID')}`, W / 2, scoreY + 125);

    ctx.fillStyle = palette.textMain;
    ctx.font = '800 26px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.fillText(`POIN • ${payload.completedCount || 0}/3 KATEGORI SELESAI`, W / 2, scoreY + 188);

    // Category Breakdown Rows
    const cats = [
      { code: 'logika', label: '⚡ The Logic Master', color: '#f59e0b' },
      { code: 'data', label: '📊 Detektif Data BPS', color: '#0284c7' },
      { code: 'stis', label: '🎓 Pejuang STIS', color: '#059669' }
    ];

    let rowY = scoreY + scoreH + 38;
    const rowH = 98;
    const rowGap = 18;

    cats.forEach(c => {
      drawRoundRect(ctx, boxX, rowY, boxW, rowH, 22);
      ctx.fillStyle = palette.innerBg;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = palette.innerBorder;
      ctx.stroke();

      const catScore = payload.scores ? payload.scores[c.code] : null;
      const hasScore = catScore !== null && catScore !== undefined;

      ctx.textAlign = 'left';
      ctx.fillStyle = palette.textMain;
      ctx.font = '800 30px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText(c.label, boxX + 32, rowY + rowH / 2);

      ctx.textAlign = 'right';
      if (hasScore) {
        ctx.fillStyle = c.color;
        ctx.font = '900 32px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        ctx.fillText(`${Number(catScore).toLocaleString('id-ID')} Poin ✅`, boxX + boxW - 32, rowY + rowH / 2);
      } else {
        ctx.fillStyle = palette.textMuted;
        ctx.font = '700 26px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        ctx.fillText('Belum dicoba', boxX + boxW - 32, rowY + rowH / 2);
      }

      rowY += rowH + rowGap;
    });

    // Footer CTA Box
    ctx.textAlign = 'center';
    const footY = cardY + cardH - 185;
    const footH = 135;
    drawRoundRect(ctx, boxX, footY, boxW, footH, 26);
    ctx.fillStyle = palette.footerBg;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = palette.footerBorder;
    ctx.stroke();

    ctx.fillStyle = palette.textMain;
    ctx.font = '800 29px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.fillText('🎯 Ayo kalahkan skorku di Booth BPS Demak!', W / 2, footY + 48);

    ctx.fillStyle = palette.accentBlue;
    ctx.font = '700 26px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.fillText('Info Ikatan Dinas Kuliah Gratis: spmb.stis.ac.id', W / 2, footY + 94);
  }

  global.ScoreCardGenerator = {
    renderScoreCardCanvas
  };
})(window);
