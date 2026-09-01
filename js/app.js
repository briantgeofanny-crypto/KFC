/**
 * ============================================================================
 * KFC: CYBER KITCHEN 2088 — MASTER APPLICATION BOOTSTRAP & ORCHESTRATOR
 * Coordinates Audio Synth, Canvas Physics, Tycoon Simulation & UI Controller
 * ============================================================================
 */

(function () {
  'use strict';

  // Global Engine Instances
  let audioEngine = null;
  let physicsEngine = null;
  let simEngine = null;
  let uiController = null;

  // Master Clock & Performance Telemetry
  let lastFrameTime = performance.now();
  let frameCounter = 0;
  let fpsTimer = performance.now();
  let currentFps = 60;

  // Kernel Status Messages Pool
  const kernelMessages = [
    'Quantum Hydro-Fryer telemetry nominal. Pressure locked at 15.2 PSI.',
    '11 Secret Herbs & Spices molecular matrix calibrated to high synergy.',
    'Autonomous Drone radar tracking sector airspace. Battery levels optimal.',
    'Neo-Chicago Commodity Exchange connection verified. Spot prices synced.',
    'Thermal holding warmers maintaining 68.5°C food safety compliance.',
    'Web Audio API 8-voice procedural synthwave generator ready for playback.',
    'Customer AI emotion queue initialized. Satisfaction index monitored.'
  ];

  /**
   * Main Application Lifecycle Bootstrapper
   */
  window.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Booting KFC: Cyber Kitchen 2088 Systems...');

    try {
      // 1. Initialize Audio Synthesizer Engine
      audioEngine = new CyberAudioEngine();
      const masterScope = document.getElementById('canvasMasterScope');
      const miniViz = document.getElementById('canvasAudioViz');
      audioEngine.bindCanvases(masterScope, miniViz);

      // 2. Initialize Physics & Canvas Simulators
      physicsEngine = new CyberPhysicsCanvasEngine();
      const canvasFryer = document.getElementById('canvasFryer');
      const canvasStacker = document.getElementById('canvasStacker');
      const canvasRadar = document.getElementById('canvasRadar');
      physicsEngine.init(canvasFryer, canvasStacker, canvasRadar);

      // 3. Initialize Tycoon Simulation Model
      simEngine = new CyberSimulationEngine();

      // 4. Initialize UI Controller & DOM Bindings
      uiController = new CyberUIController(simEngine, audioEngine, physicsEngine);
      uiController.init();

      // 5. Wire Audio Engine to global user interaction click to bypass Autoplay policy
      const unlockAudio = async () => {
        if (audioEngine && !audioEngine.isInitialized) {
          await audioEngine.init();
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });

      // 6. Start Kernel Status Message Rotator
      startKernelLogStreamer();

      // 7. Start Master High-Resolution Simulation Loop
      requestAnimationFrame(masterGameLoop);

      console.log('✅ KFC: Cyber Kitchen 2088 Empire Protocol successfully engaged!');
    } catch (err) {
      console.error('Fatal initialization error in Cyber Kitchen:', err);
    }
  });

  /**
   * High-Resolution 60 FPS Master Game Loop
   */
  function masterGameLoop(currentTime) {
    const delta = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    // FPS Calculation
    frameCounter++;
    if (currentTime - fpsTimer >= 1000) {
      currentFps = frameCounter;
      frameCounter = 0;
      fpsTimer = currentTime;
      updateTelemetryFooter();
    }

    // 1. Update Tycoon Economic Simulation
    if (simEngine) {
      simEngine.update(delta);
    }

    // 2. Update UI Dynamic HUD Elements
    if (uiController) {
      uiController.updateLiveHud();
    }

    requestAnimationFrame(masterGameLoop);
  }

  /**
   * Update bottom footer telemetry readouts
   */
  function updateTelemetryFooter() {
    const elFps = document.getElementById('txtFps');
    const elParticles = document.getElementById('txtParticleCount');

    if (elFps) elFps.textContent = currentFps;

    if (elParticles && physicsEngine && physicsEngine.fryerSim) {
      const bubbleCount = physicsEngine.fryerSim.bubbles.length;
      const sparkCount = physicsEngine.fryerSim.sparks.length;
      const steamCount = physicsEngine.fryerSim.steamPuffs.length;
      elParticles.textContent = bubbleCount + sparkCount + steamCount;
    }
  }

  /**
   * Periodically rotates cyberpunk terminal status messages
   */
  function startKernelLogStreamer() {
    const elKernel = document.getElementById('liveKernelMsg');
    let index = 0;

    setInterval(() => {
      if (elKernel) {
        index = (index + 1) % kernelMessages.length;
        elKernel.textContent = kernelMessages[index];
      }
    }, 9000);
  }

})();
