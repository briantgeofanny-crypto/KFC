/**
 * ============================================================================
 * SLAY THE SPIRE - COMPREHENSIVE WEB AUDIO SYNTHESIS & SOUND DESIGN ENGINE
 * ============================================================================
 * Menghasilkan seluruh efek suara dan musik ambient secara real-time via Web Audio API.
 * Nol file audio eksternal, performa tinggi, zero latency, dan dynamic parametric audio.
 */

class SpireAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.sfxVolume = 0.55;
    this.bgmVolume = 0.35;
    this.bgmOscs = [];
    this.bgmGain = null;
    this.isBgmPlaying = false;
    this.bgmType = 'ambient';
  }


  // ==========================================================================
  // PROCEDURAL WEB AUDIO SYNTHESIZER SOUNDSCAPES
  // ==========================================================================

  playHeavyBludgeon() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);

      gain.gain.setValueAtTime(this.sfxVolume * 0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  playPoisonSpit() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.15);
      osc.frequency.linearRampToValueAtTime(420, now + 0.25);

      gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  playHolyChime() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(this.sfxVolume * 0.25, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.65);
      });
    } catch (e) {}
  }

  playTimeWarpSound() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.4);

      gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  playCardExhaustFlame() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.36);
    } catch (e) {}
  }

  playBossRoar() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [80, 115].forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 0.6, now + 0.6);

        gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      });
    } catch (e) {}
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Efek Tarik Kartu (Card Draw / Swish)
  playCardDraw() {
    if (!this.enabled) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.1);
    filter.Q.setValueAtTime(3, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }

  // Efek Hover Kartu
  playCardHover() {
    if (!this.enabled) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440 + Math.random() * 80, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

    gain.gain.setValueAtTime(this.sfxVolume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Efek Serangan Pedang / Sabetan (Slash)
  playAttackSlash(isHeavy = false) {
    if (!this.enabled) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * (isHeavy ? 0.32 : 0.18));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(isHeavy ? 550 : 1200, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + (isHeavy ? 0.28 : 0.15));

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(this.sfxVolume * (isHeavy ? 0.95 : 0.6), now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (isHeavy ? 0.32 : 0.18));

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = isHeavy ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(isHeavy ? 190 : 320, now);
    osc.frequency.exponentialRampToValueAtTime(isHeavy ? 40 : 80, now + (isHeavy ? 0.25 : 0.12));

    oscGain.gain.setValueAtTime(this.sfxVolume * (isHeavy ? 0.85 : 0.5), now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + (isHeavy ? 0.28 : 0.15));

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (isHeavy ? 0.28 : 0.15));
  }

  // Efek Tameng / Armor Block
  playBlock() {
    if (!this.enabled) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const freqs = [350, 720, 1150];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.88, now + 0.32);

      gain.gain.setValueAtTime((this.sfxVolume * 0.38) / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    });
  }

  // Efek Cast Skill / Buff / Power
  playPowerBuff() {
    if (!this.enabled) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const noteTime = now + (i * 0.045);
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.32, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.48);
    });
  }

  // Efek End Turn (Heavy Iron Bell / Gong)
  playEndTurn() {
    if (!this.enabled) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(105, now + 0.65);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.exponentialRampToValueAtTime(215, now + 0.55);

    gain.gain.setValueAtTime(this.sfxVolume * 0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.65);
    osc2.stop(now + 0.65);
  }

  // Efek Kemenangan Pertarungan (Victory Fanfare)
  playVictory() {
    if (!this.enabled) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const fanfare = [
      { f: 392.00, t: 0.0, d: 0.16 }, // G4
      { f: 523.25, t: 0.16, d: 0.16 }, // C5
      { f: 659.25, t: 0.32, d: 0.16 }, // E5
      { f: 783.99, t: 0.48, d: 0.55 }  // G5
    ];

    fanfare.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const startTime = now + note.t;
      osc.frequency.setValueAtTime(note.f, startTime);

      gain.gain.setValueAtTime(this.sfxVolume * 0.45, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + note.d);
    });
  }

  // Efek Potion Gunakan
  playPotion() {
    if (!this.enabled) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1300, now + 0.16);

    gain.gain.setValueAtTime(this.sfxVolume * 0.42, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Efek Klik UI (Dinonaktifkan agar tidak berisik saat klik mouse)
  playClick() {
    // Hening: suara klik mouse dihilangkan
    return;
  }

  // Efek Gold Koin
  playGold() {
    if (!this.enabled) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    [1760, 2093, 2637].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + (i * 0.055);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(this.sfxVolume * 0.32, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    });
  }

  // Efek Api Campfire Rest
  playCampfire() {
    if (!this.enabled) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * 0.45);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.sfxVolume * 0.42, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  // Ambient Dark Dungeon Drone (BGM Sintetis)
  startBgm() {
    if (this.isBgmPlaying || !this.enabled) return;
    this.init();
    try {
      const ctx = this.ctx;
      this.bgmGain = ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.bgmVolume * 0.18, ctx.currentTime);
      this.bgmGain.connect(ctx.destination);

      const chord = [73.42, 110.00, 174.61];
      this.bgmOscs = chord.map(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(this.bgmGain);
        osc.start();
        return osc;
      });

      this.isBgmPlaying = true;
    } catch (e) {
      console.warn("BGM autoplay restricted until user gesture:", e);
    }
  }

  stopBgm() {
    if (!this.isBgmPlaying) return;
    this.bgmOscs.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.bgmOscs = [];
    this.isBgmPlaying = false;
  }

  // Dentang Logam Tangkisan Sempurna (Full Block Deflect)
  playFullBlockDeflect() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      [1250, 1850, 2400].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 0.5, now + 0.35);

        gain.gain.setValueAtTime(this.sfxVolume * 0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      });
    } catch (e) {}
  }

  // Efek Minum Ramuan (Potion Gulp & Bottle Clink)
  playPotionDrink() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      [280, 360, 440].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.07;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, startTime);
        osc.frequency.linearRampToValueAtTime(f + 90, startTime + 0.06);

        gain.gain.setValueAtTime(this.sfxVolume * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.09);
      });
    } catch (e) {}
  }

  // Efek Mistik Aktivasi Relic (Relic Crystal Chime)
  playRelicTrigger() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      [587.33, 880.00, 1174.66, 1760.00].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.05;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + 0.4);

        gain.gain.setValueAtTime(this.sfxVolume * 0.28, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.46);
      });
    } catch (e) {}
  }

  // Efek Kematian Musuh (Disintegration Rumble)
  playEnemyDeath() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.55);

      gain.gain.setValueAtTime(this.sfxVolume * 0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {}
  }

  // Tebasan Pedang Anime Resonansi Tinggi (Anime Katana Slash Ring)
  playAnimeSlash() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      [880, 1320, 2640].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 0.8, now + 0.4);

        gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.46);
      });
    } catch (e) {}
  }

  // Distorsi Spasial Black Flash (Kokusen Boom)
  playBlackFlash() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(20, now + 0.6);

      gain.gain.setValueAtTime(this.sfxVolume * 0.95, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.68);
    } catch (e) {}
  }

  // Efek Hentikan Waktu Za Warudo (Time Warp Chrono Boom)
  playTimeStop() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      [800, 600, 400, 200, 50].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.06;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(this.sfxVolume * 0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.11);
      });
    } catch (e) {}
  }

  // ==========================================================================
  // CINEMATIC BOSS ENCOUNTER SOUNDSCAPES
  // ==========================================================================

  // Sangkakala Kiamat & Gemuruh Boss (Deep Cinematic Brass Horn)
  playBossCinematicHorn() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Low ominous brass rumble (55Hz root note)
      [55, 110, 164.81].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 0.96, now + 2.2);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * (0.5 - idx * 0.1), now + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch (e) {}
  }

  // Ledakan Petir & Dentuman Bumi Bos (Thunder Sub-Bass Boom)
  playBossThunderBoom() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 1.2);

      gain.gain.setValueAtTime(this.sfxVolume * 1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.5);
    } catch (e) {}
  }

  // Detak Jantung Ketegangan Bos (Boss Heartbeat Thud)
  playBossHeartbeat() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      [0, 0.22].forEach(delay => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(75, now + delay);
        osc.frequency.exponentialRampToValueAtTime(35, now + delay + 0.16);

        gain.gain.setValueAtTime(this.sfxVolume * 0.7, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.2);
      });
    } catch (e) {}
  }

  // Efek Suara Jurus Aktif Karakter (Anime Skill Activation Surge)
  playActiveSkillSound() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      
      // Rising frequency whoosh
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(150, now);
      osc1.frequency.exponentialRampToValueAtTime(850, now + 0.25);
      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.7);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(this.sfxVolume * 0.75, now + 0.2);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.8);

      // Sub-bass impact thud
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(180, now + 0.2);
      osc2.frequency.exponentialRampToValueAtTime(30, now + 0.65);

      gain2.gain.setValueAtTime(this.sfxVolume * 0.9, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.75);
    } catch (e) {}
  }
}

window.spireAudio = new SpireAudio();


