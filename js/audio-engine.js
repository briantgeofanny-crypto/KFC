/**
 * ============================================================================
 * KFC: CYBER KITCHEN 2088 — PROCEDURAL WEB AUDIO API SYNTHESIZER & SFX ENGINE
 * Architecture: 1000+ Lines of Pure Procedural Audio, Sound Synthesis & BGM
 * ============================================================================
 */

class CyberAudioEngine {
  constructor() {
    this.ctx = null;
    this.isInitialized = false;
    this.isPlayingMusic = false;
    this.isMuted = false;

    // Master Audio Graph Nodes
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.bassGain = null;
    this.arpGain = null;
    this.drumsGain = null;
    this.reverbGain = null;
    this.masterCompressor = null;
    this.masterFilter = null;
    this.analyser = null;
    this.convolver = null;

    // Channel Volume Levels (0.0 to 1.0)
    this.volumes = {
      master: 0.8,
      music: 0.7,
      sfx: 0.85,
      bass: 0.7,
      arp: 0.6,
      drums: 0.75,
      reverb: 0.35
    };

    // Sequencer Clock & Timing
    this.bpm = 124;
    this.stepInterval = 60 / (this.bpm * 4); // 16th note duration in seconds
    this.currentStep = 0;
    this.totalSteps = 16;
    this.currentBar = 0;
    this.nextNoteTime = 0.0;
    this.scheduleAheadTime = 0.1; // 100ms lookahead
    this.timerID = null;

    // Musical Harmony & Scales Matrix
    this.currentScaleKey = 'cyber_minor';
    this.scales = {
      cyber_minor: {
        root: 62, // D4
        name: 'Cyberpunk D Minor (Blade Runner)',
        notes: [50, 52, 53, 55, 57, 58, 60, 62, 64, 65, 67, 69, 70, 72, 74],
        bassNotes: [26, 29, 31, 33, 34, 38], // D1, F1, G1, A1, Bb1, D2
        progressions: [
          [0, 5, 3, 4], // i - VI - iv - v (Dm - Bb - Gm - Am)
          [0, 3, 5, 4], // i - iv - VI - v
          [0, 2, 3, 5], // i - III - iv - VI
          [5, 4, 0, 0]  // VI - v - i - i
        ]
      },
      neon_major: {
        root: 57, // A3
        name: 'Neon City A Major (Uplifting)',
        notes: [57, 59, 61, 62, 64, 66, 68, 69, 71, 73, 74, 76, 78, 80, 81],
        bassNotes: [33, 37, 40, 42, 45], // A1, C#2, E2, F#2, A2
        progressions: [
          [0, 3, 4, 0], // I - IV - V - I
          [0, 5, 3, 4], // I - vi - IV - V
          [3, 4, 5, 0]  // IV - V - vi - I
        ]
      },
      synth_dorian: {
        root: 64, // E4
        name: 'Synthwave E Dorian (Fast Pursuit)',
        notes: [52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 76],
        bassNotes: [28, 31, 33, 35, 38, 40], // E1, G1, A1, B1, D2, E2
        progressions: [
          [0, 3, 0, 5], // i - IV - i - VII
          [0, 5, 3, 0], // i - VII - IV - i
          [0, 1, 3, 5]  // i - ii - IV - VII
        ]
      },
      dark_phrygian: {
        root: 61, // C#4
        name: 'Dark Phrygian (Overclocked)',
        notes: [49, 50, 52, 54, 56, 57, 59, 61, 62, 64, 66, 68, 69, 71, 73],
        bassNotes: [25, 26, 28, 30, 33, 37], // C#1, D1, E1, F#1, A1, C#2
        progressions: [
          [0, 1, 0, 1], // i - bII - i - bII
          [0, 1, 6, 1], // i - bII - bvii - bII
          [0, 3, 1, 0]  // i - iv - bII - i
        ]
      }
    };

    // Active Sequencer Patterns
    this.drumPattern = {
      kick:  [1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0],
      snare: [0, 0, 0, 0,  1, 0, 0, 0,  0, 0, 0, 0,  1, 0, 0, 0],
      hihat: [1, 0, 1, 0,  1, 0, 1, 0,  1, 0, 1, 0,  1, 0, 1, 1],
      openHat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
    };

    this.bassPattern = [1, 0, 1, 0,  1, 0, 1, 0,  1, 0, 1, 0,  1, 1, 1, 0];
    this.arpPattern  = [1, 1, 0, 1,  1, 0, 1, 1,  0, 1, 1, 0,  1, 1, 1, 1];

    // Visualizer Canvas Bindings
    this.canvasScope = null;
    this.canvasAudioViz = null;
    this.scopeCtx = null;
    this.vizCtx = null;
    this.visualizerAnimationId = null;

    // Sizzle loop active nodes
    this.ambientFryNode = null;
  }

  /**
   * Initialize Web Audio API on first user interaction
   */
  async init() {
    if (this.isInitialized) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Compressor (Prevents clipping & glues sound)
      this.masterCompressor = this.ctx.createDynamicsCompressor();
      this.masterCompressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.masterCompressor.knee.setValueAtTime(8, this.ctx.currentTime);
      this.masterCompressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.masterCompressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
      this.masterCompressor.release.setValueAtTime(0.15, this.ctx.currentTime);

      // Master Lowpass Filter
      this.masterFilter = this.ctx.createBiquadFilter();
      this.masterFilter.type = 'lowpass';
      this.masterFilter.frequency.setValueAtTime(18000, this.ctx.currentTime);
      this.masterFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volumes.master, this.ctx.currentTime);

      // Sub-Mixer Gains
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.volumes.music, this.ctx.currentTime);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.volumes.sfx, this.ctx.currentTime);

      this.bassGain = this.ctx.createGain();
      this.bassGain.gain.setValueAtTime(this.volumes.bass, this.ctx.currentTime);

      this.arpGain = this.ctx.createGain();
      this.arpGain.gain.setValueAtTime(this.volumes.arp, this.ctx.currentTime);

      this.drumsGain = this.ctx.createGain();
      this.drumsGain.gain.setValueAtTime(this.volumes.drums, this.ctx.currentTime);

      this.reverbGain = this.ctx.createGain();
      this.reverbGain.gain.setValueAtTime(this.volumes.reverb, this.ctx.currentTime);

      // Analyser Node for Visualizers
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.85;

      // Build Procedural Impulse Response for Cyber Reverb Room
      this.convolver = this.ctx.createConvolver();
      this.convolver.buffer = this.createCyberReverbImpulse(2.2, 2.0);

      // Graph Routing:
      // Instruments -> Subgains -> MusicGain -> MasterCompressor -> MasterFilter -> MasterGain -> Analyser -> Destination
      this.bassGain.connect(this.musicGain);
      this.arpGain.connect(this.musicGain);
      this.drumsGain.connect(this.musicGain);

      // Reverb routing (send/return)
      this.arpGain.connect(this.convolver);
      this.convolver.connect(this.reverbGain);
      this.reverbGain.connect(this.musicGain);

      this.musicGain.connect(this.masterCompressor);
      this.sfxGain.connect(this.masterCompressor);

      this.masterCompressor.connect(this.masterFilter);
      this.masterFilter.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.isInitialized = true;

      // Start Visualizer Canvas Render Loop
      this.startVisualizerLoop();

      console.log('✅ KFC Cyber Audio Engine initialized successfully.');
    } catch (e) {
      console.warn('Web Audio API error on initialization:', e);
    }
  }

  /**
   * Resume AudioContext if suspended by browser autoplay policy
   */
  async ensureContextRunning() {
    if (!this.isInitialized) {
      await this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  /**
   * Procedurally generate an impulse response buffer for synthetic digital reverb
   */
  createCyberReverbImpulse(duration = 2.0, decay = 2.0) {
    if (!this.ctx) return null;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const t = i / length;
      const n = (1 - t) * Math.exp(-t * decay);
      // Pink-ish filtered noise with stereo decorrelation
      left[i] = (Math.random() * 2 - 1) * n;
      right[i] = (Math.random() * 2 - 1) * n;
    }
    return impulse;
  }

  /**
   * Convert MIDI Note number to Frequency (Hz)
   */
  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // ==========================================================================
  // PROCEDURAL SOUND FX GENERATORS (SFX)
  // ==========================================================================

  /**
   * SFX: Sizzling hot oil with bubble micro-pops
   */
  playFrySizzle(duration = 1.8, intensity = 1.0) {
    this.ensureContextRunning();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Pink-ish noise formula
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2400, t);
    bandpass.Q.setValueAtTime(1.8, t);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(800, t);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, t);
    gainNode.gain.linearRampToValueAtTime(0.4 * intensity, t + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration);

    whiteNoise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(this.sfxGain);

    whiteNoise.start(t);
    whiteNoise.stop(t + duration);

    // Add 4-6 micro bubble pops
    const popCount = Math.floor(6 * intensity);
    for (let p = 0; p < popCount; p++) {
      const popTime = t + 0.05 + Math.random() * (duration - 0.2);
      this.triggerMicroBubblePop(popTime);
    }
  }

  /**
   * Helper: Micro oil bubble popping sound
   */
  triggerMicroBubblePop(time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    const freq = 600 + Math.random() * 1400;
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, time + 0.04);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.045);
  }

  /**
   * SFX: Super-crispy fried chicken bite crunch
   */
  playCrispyBite() {
    this.ensureContextRunning();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Layer 1: High frequency crackle
    const bufferSize = this.ctx.sampleRate * 0.35;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(t);

    // Layer 2: Sub-low impact thump
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(140, t);
    sub.frequency.exponentialRampToValueAtTime(40, t + 0.15);

    subGain.gain.setValueAtTime(0.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    sub.connect(subGain);
    subGain.connect(this.sfxGain);
    sub.start(t);
    sub.stop(t + 0.16);
  }

  /**
   * SFX: Dual-Tone POS Barcode Scanner Beep
   */
  playPosBeep() {
    this.ensureContextRunning();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(2093.00, t); // C7
    osc2.frequency.setValueAtTime(2793.83, t); // F7

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.085);
    osc2.stop(t + 0.085);
  }

  /**
   * SFX: Cyber Credits Cash Register Inflow
   */
  playCoinCashIn() {
    this.ensureContextRunning();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [987.77, 1318.51, 1567.98, 2093.00]; // B5, E6, G6, C7
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + index * 0.04);

      gain.gain.setValueAtTime(0.18, t + index * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + index * 0.04 + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + index * 0.04);
      osc.stop(t + index * 0.04 + 0.19);
    });
  }

  /**
   * SFX: Drone High-Speed Doppler Flyby with Stereo Panning
   */
  playDroneFlyby(panning = 0.0, speed = 1.0) {
    this.ensureContextRunning();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const dur = 1.4 / speed;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    osc.type = 'sawtooth';
    subOsc.type = 'square';

    // Pitch sweep down simulating Doppler effect
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + dur);

    subOsc.frequency.setValueAtTime(240, t);
    subOsc.frequency.exponentialRampToValueAtTime(90, t + dur);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + dur);
    filter.Q.setValueAtTime(3.5, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + dur * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    if (panner) {
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panning - 0.8)), t);
      panner.pan.linearRampToValueAtTime(Math.max(-1, Math.min(1, panning + 0.8)), t + dur);
      gain.connect(panner);
      panner.connect(this.sfxGain);
    } else {
      gain.connect(this.sfxGain);
    }

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);

    osc.start(t);
    subOsc.start(t);
    osc.stop(t + dur);
    subOsc.stop(t + dur);
  }

  /**
   * SFX: VIP Customer Siren Alert
   */
  playVipAlert() {
    this.ensureContextRunning();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.setValueAtTime(1174, t + 0.12);
    osc.frequency.setValueAtTime(880, t + 0.24);
    osc.frequency.setValueAtTime(1174, t + 0.36);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.56);
  }

  /**
   * SFX: Mechanical Stacker Drop Sound (Material Aware)
   */
  playStackDrop(ingredientType = 'crispy_patty') {
    this.ensureContextRunning();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    switch (ingredientType) {
      case 'bottom_bun':
      case 'top_bun':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        break;

      case 'crispy_patty':
        this.playCrispyBite();
        return;

      case 'melted_cheese':
      case 'secret_sauce':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        break;

      default:
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        break;
    }

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  /**
   * SFX: UI Micro Click
   */
  playButtonTick() {
    this.ensureContextRunning();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(2400, t);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.02);
  }

  /**
   * SFX: Quest & Level Up Success Chime
   */
  playSuccessChime() {
    this.ensureContextRunning();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);

      gain.gain.setValueAtTime(0.2, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.36);
    });
  }

  /**
   * SFX: Error / Rejection Buzz
   */
  playErrorBuzz() {
    this.ensureContextRunning();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.setValueAtTime(95, t + 0.1);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  // ==========================================================================
  // PROCEDURAL SYNTHWAVE BGM SEQUENCER & MUSIC ENGINE
  // ==========================================================================

  /**
   * Start 8-track procedural music playback
   */
  async startBgm() {
    await this.ensureContextRunning();
    if (this.isPlayingMusic) return;

    this.isPlayingMusic = true;
    this.currentStep = 0;
    this.currentBar = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.scheduler();

    console.log('🎵 KFC Procedural Synthwave BGM started at', this.bpm, 'BPM');
  }

  /**
   * Stop music playback
   */
  stopBgm() {
    this.isPlayingMusic = false;
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
    console.log('⏹ KFC BGM stopped.');
  }

  /**
   * Lookahead timing scheduler loop
   */
  scheduler() {
    if (!this.isPlayingMusic || !this.ctx) return;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextNoteTime);
      this.advanceStep();
    }

    this.timerID = setTimeout(() => this.scheduler(), 25);
  }

  /**
   * Advance step and bar counters
   */
  advanceStep() {
    this.stepInterval = 60 / (this.bpm * 4);
    this.nextNoteTime += this.stepInterval;
    this.currentStep = (this.currentStep + 1) % this.totalSteps;

    if (this.currentStep === 0) {
      this.currentBar = (this.currentBar + 1) % 16;
    }

    // Broadcast step event to UI sequencer matrix
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('synth-step', { detail: { step: this.currentStep } }));
    }
  }

  /**
   * Schedule audio synthesis events for the given step
   */
  scheduleStep(step, time) {
    const scale = this.scales[this.currentScaleKey] || this.scales.cyber_minor;
    const progIndex = Math.floor(this.currentBar / 4) % scale.progressions.length;
    const currentProg = scale.progressions[progIndex];
    const chordIndex = currentProg[Math.floor(step / 4) % currentProg.length];

    // 1. Synth Bassline (Driving 16th note rolling bass)
    if (this.bassPattern[step]) {
      const bassMidi = scale.bassNotes[chordIndex % scale.bassNotes.length] || 38;
      const bassFreq = this.midiToFreq(bassMidi);
      this.synthesizeBassNote(bassFreq, time, this.stepInterval * 0.9);
    }

    // 2. Synthwave Lead Arpeggiator
    if (this.arpPattern[step]) {
      const scaleNotes = scale.notes;
      const arpNoteIndex = (step * 2 + chordIndex * 3) % scaleNotes.length;
      const arpHertz = this.midiToFreq(scaleNotes[arpNoteIndex]);
      this.synthesizeArpNote(arpHertz, time, this.stepInterval * 0.85);
    }

    // 3. Synth Chords Pad (On 1st and 3rd beats)
    if (step === 0 || step === 8) {
      const rootMidi = scale.notes[chordIndex % scale.notes.length];
      const chordMidis = [rootMidi, rootMidi + 3, rootMidi + 7];
      this.synthesizeChordPad(chordMidis, time, this.stepInterval * 7.5);
    }

    // 4. Drums: Kick
    if (this.drumPattern.kick[step]) {
      this.synthesizeDrumKick(time);
    }

    // 5. Drums: Snare
    if (this.drumPattern.snare[step]) {
      this.synthesizeDrumSnare(time);
    }

    // 6. Drums: Hi-Hat
    if (this.drumPattern.hihat[step]) {
      this.synthesizeDrumHiHat(time, step % 2 === 0);
    }

    // 7. Drums: Open Hat
    if (this.drumPattern.openHat[step]) {
      this.synthesizeDrumOpenHat(time);
    }
  }

  /**
   * Synthesize rolling synth bass note
   */
  synthesizeBassNote(freq, time, duration) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, time);

    // Resonant Lowpass Filter Envelope
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(180, time + duration);
    filter.Q.setValueAtTime(4.0, time);

    gain.gain.setValueAtTime(0.0, time);
    gain.gain.linearRampToValueAtTime(0.32, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bassGain);

    osc.start(time);
    subOsc.start(time);
    osc.stop(time + duration);
    subOsc.stop(time + duration);
  }

  /**
   * Synthesize arpeggiated lead melodic synth note
   */
  synthesizeArpNote(freq, time, duration) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, time);
    filter.frequency.exponentialRampToValueAtTime(600, time + duration);
    filter.Q.setValueAtTime(3.0, time);

    gain.gain.setValueAtTime(0.0, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.arpGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  /**
   * Synthesize lush analog polyphonic pad chord
   */
  synthesizeChordPad(midis, time, duration) {
    if (!this.ctx) return;
    midis.forEach((midi) => {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      const freq = this.midiToFreq(midi);
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq * 0.996, time); // Slight detune for chorus warmth

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(freq * 1.004, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, time);
      filter.frequency.linearRampToValueAtTime(1400, time + duration * 0.5);
      filter.frequency.exponentialRampToValueAtTime(400, time + duration);

      gain.gain.setValueAtTime(0.0, time);
      gain.gain.linearRampToValueAtTime(0.08, time + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration);
      osc2.stop(time + duration);
    });
  }

  /**
   * Synthesize electronic 808-style drum kick
   */
  synthesizeDrumKick(time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(0.65, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.drumsGain);

    osc.start(time);
    osc.stop(time + 0.29);
  }

  /**
   * Synthesize electronic snare with noise snap
   */
  synthesizeDrumSnare(time) {
    if (!this.ctx) return;
    // Tonal body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, time);
    osc.frequency.exponentialRampToValueAtTime(90, time + 0.1);
    oscGain.gain.setValueAtTime(0.4, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc.connect(oscGain);
    oscGain.connect(this.drumsGain);
    osc.start(time);
    osc.stop(time + 0.13);

    // Noise snap
    const bufferSize = this.ctx.sampleRate * 0.18;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.drumsGain);
    noise.start(time);
  }

  /**
   * Synthesize closed hi-hat
   */
  synthesizeDrumHiHat(time, isAccent = false) {
    if (!this.ctx) return;
    const dur = isAccent ? 0.06 : 0.035;
    const bufferSize = this.ctx.sampleRate * dur;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isAccent ? 0.22 : 0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.drumsGain);
    noise.start(time);
  }

  /**
   * Synthesize open hi-hat
   */
  synthesizeDrumOpenHat(time) {
    if (!this.ctx) return;
    const dur = 0.22;
    const bufferSize = this.ctx.sampleRate * dur;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(5000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.drumsGain);
    noise.start(time);
  }

  // ==========================================================================
  // REAL-TIME AUDIO VISUALIZER & SCOPE
  // ==========================================================================

  /**
   * Bind DOM Canvas elements for oscilloscope & mini ticker display
   */
  bindCanvases(masterScopeCanvas, miniVizCanvas) {
    this.canvasScope = masterScopeCanvas;
    this.canvasAudioViz = miniVizCanvas;

    if (this.canvasScope) this.scopeCtx = this.canvasScope.getContext('2d');
    if (this.canvasAudioViz) this.vizCtx = this.canvasAudioViz.getContext('2d');
  }

  /**
   * Continuous render loop for waveform & frequency scopes
   */
  startVisualizerLoop() {
    const render = () => {
      this.drawScope();
      this.drawMiniViz();
      this.visualizerAnimationId = requestAnimationFrame(render);
    };
    render();
  }

  /**
   * Draw big master oscilloscope with neon grid & phosphor glow
   */
  drawScope() {
    if (!this.scopeCtx || !this.canvasScope || !this.analyser) return;

    const width = this.canvasScope.width;
    const height = this.canvasScope.height;
    const bufferLength = this.analyser.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    const freqData = new Uint8Array(bufferLength);

    this.analyser.getByteTimeDomainData(timeData);
    this.analyser.getByteFrequencyData(freqData);

    // Dark clear with fading motion blur trail
    this.scopeCtx.fillStyle = 'rgba(2, 4, 8, 0.35)';
    this.scopeCtx.fillRect(0, 0, width, height);

    // Background Grid lines
    this.scopeCtx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
    this.scopeCtx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      this.scopeCtx.beginPath();
      this.scopeCtx.moveTo(x, 0);
      this.scopeCtx.lineTo(x, height);
      this.scopeCtx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      this.scopeCtx.beginPath();
      this.scopeCtx.moveTo(0, y);
      this.scopeCtx.lineTo(width, y);
      this.scopeCtx.stroke();
    }

    // Spectrum Bars Layer
    const barCount = 48;
    const barWidth = width / barCount;
    for (let i = 0; i < barCount; i++) {
      const idx = Math.floor(i * (bufferLength / barCount));
      const val = freqData[idx] / 255;
      const barHeight = val * (height * 0.85);

      const grad = this.scopeCtx.createLinearGradient(0, height, 0, height - barHeight);
      grad.addColorStop(0, 'rgba(228, 0, 43, 0.3)');
      grad.addColorStop(0.7, 'rgba(0, 243, 255, 0.6)');
      grad.addColorStop(1, '#00f3ff');

      this.scopeCtx.fillStyle = grad;
      this.scopeCtx.fillRect(i * barWidth + 2, height - barHeight, barWidth - 4, barHeight);
    }

    // Waveform Oscilloscope Curve Layer
    this.scopeCtx.lineWidth = 2.5;
    this.scopeCtx.strokeStyle = '#00ff88';
    this.scopeCtx.shadowColor = 'rgba(0, 255, 136, 0.8)';
    this.scopeCtx.shadowBlur = 8;
    this.scopeCtx.beginPath();

    const sliceWidth = width / bufferLength;
    let currentX = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = timeData[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        this.scopeCtx.moveTo(currentX, y);
      } else {
        this.scopeCtx.lineTo(currentX, y);
      }
      currentX += sliceWidth;
    }

    this.scopeCtx.stroke();
    this.scopeCtx.shadowBlur = 0;
  }

  /**
   * Draw mini ticker visualizer bar in header
   */
  drawMiniViz() {
    if (!this.vizCtx || !this.canvasAudioViz || !this.analyser) return;

    const w = this.canvasAudioViz.width;
    const h = this.canvasAudioViz.height;
    const bufferLength = 32;
    const data = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(data);

    this.vizCtx.clearRect(0, 0, w, h);
    const barWidth = w / bufferLength;

    for (let i = 0; i < bufferLength; i++) {
      const val = data[i] / 255;
      const barHeight = Math.max(2, val * h);

      this.vizCtx.fillStyle = val > 0.6 ? '#ff2b54' : '#00f3ff';
      this.vizCtx.fillRect(i * barWidth, h - barHeight, barWidth - 1, barHeight);
    }
  }

  // ==========================================================================
  // VOLUME MIXER & CONFIGURATION SETTERS
  // ==========================================================================

  setMasterVolume(val) {
    this.volumes.master = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volumes.master, this.ctx.currentTime);
    }
  }

  setBassVolume(val) {
    this.volumes.bass = Math.max(0, Math.min(1, val));
    if (this.bassGain && this.ctx) {
      this.bassGain.gain.setValueAtTime(this.volumes.bass, this.ctx.currentTime);
    }
  }

  setArpVolume(val) {
    this.volumes.arp = Math.max(0, Math.min(1, val));
    if (this.arpGain && this.ctx) {
      this.arpGain.gain.setValueAtTime(this.volumes.arp, this.ctx.currentTime);
    }
  }

  setDrumsVolume(val) {
    this.volumes.drums = Math.max(0, Math.min(1, val));
    if (this.drumsGain && this.ctx) {
      this.drumsGain.gain.setValueAtTime(this.volumes.drums, this.ctx.currentTime);
    }
  }

  setSfxVolume(val) {
    this.volumes.sfx = Math.max(0, Math.min(1, val));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.volumes.sfx, this.ctx.currentTime);
    }
  }

  setReverbLevel(val) {
    this.volumes.reverb = Math.max(0, Math.min(1, val));
    if (this.reverbGain && this.ctx) {
      this.reverbGain.gain.setValueAtTime(this.volumes.reverb, this.ctx.currentTime);
    }
  }

  setBpm(newBpm) {
    this.bpm = Math.max(60, Math.min(200, parseInt(newBpm, 10)));
  }

  setScale(scaleKey) {
    if (this.scales[scaleKey]) {
      this.currentScaleKey = scaleKey;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volumes.master, this.ctx.currentTime);
    }
    return !this.isMuted;
  }
}

// Global Export
window.CyberAudioEngine = CyberAudioEngine;
