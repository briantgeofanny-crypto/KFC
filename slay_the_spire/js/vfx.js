/**
 * ============================================================================
 * SLAY THE SPIRE - MASTER CANVAS VFX & PARTICLE PHYSICS ENGINE
 * ============================================================================
 * Mengelola efek partikel, kurva panah Bézier penargetan interaktif dari kartu
 * ke musuh, floating combat numbers dengan fisika gravitasi, efek sabetan pedang,
 * aura tameng, ledakan api, serta screen shake physics.
 */

class SpireVfx {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.combatTexts = [];
    this.ambientMotes = [];
    this.isTargeting = false;
    this.targetStart = { x: 0, y: 0 };
    this.targetEnd = { x: 0, y: 0 };
    this.isOverTarget = false;
    this.animFrame = null;
    this.curvePulseOffset = 0;
  }

  init(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initAmbientMotes();
    this.loop();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initAmbientMotes() {
    this.ambientMotes = [];
    for (let i = 0; i < 35; i++) {
      this.ambientMotes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.2,
        alpha: Math.random() * 0.4 + 0.1
      });
    }
  }

  startTargeting(startX, startY) {
    this.isTargeting = true;
    this.targetStart = { x: startX, y: startY };
    this.targetEnd = { x: startX, y: startY };
    this.isOverTarget = false;
  }

  updateTargeting(currentX, currentY, isOverValidTarget = false) {
    this.targetEnd = { x: currentX, y: currentY };
    this.isOverTarget = isOverValidTarget;
  }

  stopTargeting() {
    this.isTargeting = false;
    this.isOverTarget = false;
  }

  // Tampilkan angka atau status melayang di atas target
  showFloatingText(text, x, y, color = '#ff4d4d', isCrit = false) {
    this.combatTexts.push({
      text: text,
      x: x + (Math.random() * 24 - 12),
      y: y - 20,
      vx: (Math.random() - 0.5) * 1.8,
      vy: isCrit ? -5.0 : -3.2,
      alpha: 1.0,
      scale: isCrit ? 1.5 : 1.0,
      color: color,
      life: 60
    });
  }

  // Efek Sabetan Pedang / Slash

  // ==========================================================================
  // ADVANCED CANVASES PARTICLE ROUTINES
  // ==========================================================================

  createPoisonCloud(x, y) {
    for (let i = 0; i < 24; i++) {
      this.particles.push({
        type: 'bubble',
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2.2 - 0.5,
        radius: Math.random() * 8 + 4,
        color: Math.random() < 0.5 ? '#51cf66' : '#2b8a3e',
        alpha: 0.85,
        decay: 0.02
      });
    }
  }

  createFrostNova(x, y) {
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 / 30) * i;
      const speed = Math.random() * 4 + 2;
      this.particles.push({
        type: 'spark',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 2,
        color: '#74c0fc',
        alpha: 1,
        decay: 0.025
      });
    }
  }

  createHolySunbeam(x, y) {
    for (let i = 0; i < 28; i++) {
      this.particles.push({
        type: 'spark',
        x: x + (Math.random() - 0.5) * 50,
        y: y - Math.random() * 120,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 2.5 - 1.0,
        radius: Math.random() * 3 + 1.5,
        color: '#ffd43b',
        alpha: 0.9,
        decay: 0.02
      });
    }
  }

  createBloodSplatter(x, y) {
    for (let i = 0; i < 32; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1.5;
      this.particles.push({
        type: 'spark',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        radius: Math.random() * 3.5 + 1.5,
        color: Math.random() < 0.5 ? '#c92a2a' : '#821414',
        alpha: 1,
        decay: 0.03
      });
    }
  }

  createLightningBolt(x1, y1, x2, y2) {
    const segments = 8;
    let currX = x1;
    let currY = y1;
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const nextX = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 30;
      const nextY = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 30;
      this.particles.push({
        type: 'lightning_seg',
        x1: currX,
        y1: currY,
        x2: nextX,
        y2: nextY,
        color: '#ffd43b',
        alpha: 1,
        decay: 0.1
      });
      currX = nextX;
      currY = nextY;
    }
  }

  createSlash(x, y, isHeavy = false) {
    const count = isHeavy ? 32 : 18;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.85;
      const speed = (Math.random() * 8 + 4) * (isHeavy ? 1.6 : 1.0);
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 2,
        color: isHeavy ? '#ffa8a8' : '#ffffff',
        alpha: 1,
        life: 26,
        maxLife: 26
      });
    }

    this.particles.push({
      type: 'slash_line',
      x: x,
      y: y,
      isHeavy: isHeavy,
      alpha: 1,
      life: 14,
      maxLife: 14
    });
  }

  // Efek Tameng / Shield Aura
  createShieldBurst(x, y) {
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3.5 + 2,
        color: '#4dabf7',
        alpha: 1,
        life: 32,
        maxLife: 32
      });
    }
  }

  // Efek Ledakan Api / Fire Burst
  createFireBurst(x, y) {
    for (let i = 0; i < 36; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6.5 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        radius: Math.random() * 4 + 2,
        color: Math.random() > 0.5 ? '#ff6b6b' : '#ffa94d',
        alpha: 1,
        life: 38,
        maxLife: 38
      });
    }
  }

  // Efek Gelombang Hentakan / Shockwave
  createShockwave(x, y) {
    this.particles.push({
      type: 'shockwave',
      x: x,
      y: y,
      radius: 6,
      maxRadius: 130,
      alpha: 1,
      color: '#ffd43b',
      life: 24,
      maxLife: 24
    });
  }

  // Efek Jejak Tebasan Busur Cahaya (Blade Trail Arc)
  createBladeTrail(startX, startY, endX, endY) {
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const arcHeight = -60 * Math.sin(t * Math.PI);
      const px = startX + (endX - startX) * t;
      const py = startY + (endY - startY) * t + arcHeight;

      this.particles.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        radius: (Math.sin(t * Math.PI) * 4) + 2,
        color: '#ffdd57',
        alpha: 1,
        life: 18 + i,
        maxLife: 18 + i
      });
    }

    // Spark burst di titik akhir tebasan
    for (let s = 0; s < 14; s++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 3;
      this.particles.push({
        x: endX,
        y: endY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1.5,
        color: '#ff6b6b',
        alpha: 1,
        life: 22,
        maxLife: 22
      });
    }
  }

  // Efek Pilar Cahaya Magis (Power / Buff Pillar)
  createPowerPillar(x, y) {
    for (let i = 0; i < 28; i++) {
      this.particles.push({
        x: x + (Math.random() * 50 - 25),
        y: y + 20 - (Math.random() * 20),
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 6 - 3,
        radius: Math.random() * 3.5 + 1.5,
        color: Math.random() > 0.5 ? '#da77f2' : '#74c0fc',
        alpha: 1,
        life: 30,
        maxLife: 30
      });
    }
  }

  // Trigger Goncangan Layar (Screen Shake)
  triggerScreenShake(intensity = 'medium') {
    const arena = document.querySelector('.combat-arena');
    if (!arena) return;
    arena.classList.remove('shake-subtle', 'shake-heavy');
    void arena.offsetWidth;
    if (intensity === 'heavy') {
      arena.classList.add('shake-heavy');
    } else {
      arena.classList.add('shake-subtle');
    }
    setTimeout(() => {
      arena.classList.remove('shake-subtle', 'shake-heavy');
    }, 400);
  }

  // Menggambar Kurva Panah Penargetan Dotted Bézier
  drawTargetingArrow() {
    if (!this.isTargeting) return;
    const ctx = this.ctx;
    const start = this.targetStart;
    const end = this.targetEnd;

    this.curvePulseOffset = (this.curvePulseOffset + 0.05) % 1;

    // Hitung titik kontrol kurva melengkung ke atas
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - Math.abs(end.x - start.x) * 0.35 - 50;

    const numPoints = 24;
    for (let i = 1; i <= numPoints; i++) {
      const t = i / numPoints;
      const px = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * midX + t * t * end.x;
      const py = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * midY + t * t * end.y;

      const size = 3.5 + t * 5.5;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = this.isOverTarget ? '#ff2a2a' : '#ff922b';
      ctx.shadowColor = this.isOverTarget ? '#ff0000' : '#ff6b6b';
      ctx.shadowBlur = 14;
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Gambar Kepala Panah di Ujung
    ctx.save();
    ctx.translate(end.x, end.y);
    const angle = Math.atan2(end.y - midY, end.x - midX);
    ctx.rotate(angle);

    ctx.fillStyle = this.isOverTarget ? '#ff0000' : '#ffa94d';
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-14, -13);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-14, 13);
    ctx.closePath();
    ctx.fill();

    if (this.isOverTarget) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  loop() {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Ambient Dust Motes
      for (const m of this.ambientMotes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < 0) {
          m.y = window.innerHeight;
          m.x = Math.random() * window.innerWidth;
        }
        this.ctx.beginPath();
        this.ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 212, 59, ${m.alpha})`;
        this.ctx.fill();
      }

      // Gambar kurva penargetan
      this.drawTargetingArrow();

      // Render partikel
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life--;
        const lifeRatio = p.life / p.maxLife;

        if (p.type === 'slash_line') {
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(Math.PI / 4);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${lifeRatio})`;
          this.ctx.lineWidth = p.isHeavy ? 10 * lifeRatio : 5 * lifeRatio;
          this.ctx.shadowColor = p.isHeavy ? '#ff4d4d' : '#4dabf7';
          this.ctx.shadowBlur = 15;
          this.ctx.beginPath();
          this.ctx.moveTo(-75, 0);
          this.ctx.lineTo(75, 0);
          this.ctx.stroke();
          this.ctx.restore();
        } else if (p.type === 'shockwave') {
          p.radius += (p.maxRadius - p.radius) * 0.18;
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.strokeStyle = `rgba(255, 212, 59, ${lifeRatio * 0.8})`;
          this.ctx.lineWidth = 4 * lifeRatio;
          this.ctx.stroke();
          this.ctx.restore();
        } else {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius * lifeRatio, 0, Math.PI * 2);
          this.ctx.fillStyle = p.color;
          this.ctx.globalAlpha = lifeRatio;
          this.ctx.fill();
          this.ctx.globalAlpha = 1.0;
        }

        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }

      // Render Floating Combat Text
      for (let i = this.combatTexts.length - 1; i >= 0; i--) {
        const ct = this.combatTexts[i];
        ct.x += ct.vx;
        ct.y += ct.vy;
        ct.vy += 0.08;
        ct.life--;
        const alpha = Math.min(1.0, ct.life / 20);

        this.ctx.save();
        this.ctx.font = `bold ${Math.round(22 * ct.scale)}px "Outfit", "Space Grotesk", sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = '#000';
        this.ctx.shadowBlur = 6;
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        this.ctx.strokeText(ct.text, ct.x, ct.y);

        this.ctx.fillStyle = ct.color;
        this.ctx.globalAlpha = alpha;
        this.ctx.fillText(ct.text, ct.x, ct.y);
        this.ctx.restore();

        if (ct.life <= 0) {
          this.combatTexts.splice(i, 1);
        }
      }
    }

    this.animFrame = requestAnimationFrame(() => this.loop());
  }
}

window.spireVfx = new SpireVfx();
