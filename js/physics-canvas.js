/**
 * ============================================================================
 * KFC: CYBER KITCHEN 2088 — REAL-TIME CANVAS PHYSICS & PARTICLE SIMULATOR
 * Architecture: 1000+ Lines of Particle Fluids, Rigid Bodies & Radar Simulation
 * ============================================================================
 */

class CyberPhysicsCanvasEngine {
  constructor() {
    // Canvas References
    this.canvasFryer = null;
    this.canvasStacker = null;
    this.canvasRadar = null;

    // 2D Contexts
    this.fryerCtx = null;
    this.stackerCtx = null;
    this.radarCtx = null;

    // Animation & Timing
    this.lastTime = performance.now();
    this.deltaTime = 0.016;
    this.isRunning = true;

    // Simulation Sub-Engines
    this.fryerSim = null;
    this.stackerSim = null;
    this.radarSim = null;

    // Mouse & Pointer Interactions
    this.mouse = {
      x: 0,
      y: 0,
      isDown: false,
      targetCanvas: null
    };
  }

  /**
   * Bind DOM Canvases and initialize internal sub-simulations
   */
  init(fryerCanvas, stackerCanvas, radarCanvas) {
    this.canvasFryer = fryerCanvas;
    this.canvasStacker = stackerCanvas;
    this.canvasRadar = radarCanvas;

    if (this.canvasFryer) this.fryerCtx = this.canvasFryer.getContext('2d');
    if (this.canvasStacker) this.stackerCtx = this.canvasStacker.getContext('2d');
    if (this.canvasRadar) this.radarCtx = this.canvasRadar.getContext('2d');

    // Instantiate Specialized Simulators
    this.fryerSim = new FryerParticleSimulator(this.canvasFryer, this.fryerCtx);
    this.stackerSim = new StackerPhysicsSimulator(this.canvasStacker, this.stackerCtx);
    this.radarSim = new DroneRadarSimulator(this.canvasRadar, this.radarCtx);

    this.bindEvents();
    this.startLoop();

    console.log('✅ KFC Physics & Canvas Simulation Engine fully initialized.');
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      // Resize handling if needed
    });

    if (this.canvasFryer) {
      this.canvasFryer.addEventListener('mousemove', (e) => {
        const rect = this.canvasFryer.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (this.canvasFryer.width / rect.width);
        const my = (e.clientY - rect.top) * (this.canvasFryer.height / rect.height);
        if (this.fryerSim) this.fryerSim.onMouseMove(mx, my);
      });
      this.canvasFryer.addEventListener('mousedown', (e) => {
        const rect = this.canvasFryer.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (this.canvasFryer.width / rect.width);
        const my = (e.clientY - rect.top) * (this.canvasFryer.height / rect.height);
        if (this.fryerSim) this.fryerSim.onMouseDown(mx, my);
      });
    }

    if (this.canvasStacker) {
      this.canvasStacker.addEventListener('mousemove', (e) => {
        const rect = this.canvasStacker.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (this.canvasStacker.width / rect.width);
        const my = (e.clientY - rect.top) * (this.canvasStacker.height / rect.height);
        if (this.stackerSim) this.stackerSim.onMouseMove(mx, my);
      });
      this.canvasStacker.addEventListener('mousedown', (e) => {
        const rect = this.canvasStacker.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (this.canvasStacker.width / rect.width);
        const my = (e.clientY - rect.top) * (this.canvasStacker.height / rect.height);
        if (this.stackerSim) this.stackerSim.onMouseDown(mx, my);
      });
      this.canvasStacker.addEventListener('mouseup', () => {
        if (this.stackerSim) this.stackerSim.onMouseUp();
      });
    }

    if (this.canvasRadar) {
      this.canvasRadar.addEventListener('click', (e) => {
        const rect = this.canvasRadar.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (this.canvasRadar.width / rect.width);
        const my = (e.clientY - rect.top) * (this.canvasRadar.height / rect.height);
        if (this.radarSim) this.radarSim.onClick(mx, my);
      });
    }
  }

  startLoop() {
    const loop = (currentTime) => {
      const delta = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;
      this.deltaTime = Math.min(delta, 0.1); // Clamp maximum delta to avoid physics explosion

      if (this.isRunning) {
        this.update(this.deltaTime);
        this.render();
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(dt) {
    if (this.fryerSim) this.fryerSim.update(dt);
    if (this.stackerSim) this.stackerSim.update(dt);
    if (this.radarSim) this.radarSim.update(dt);
  }

  render() {
    if (this.fryerSim) this.fryerSim.render();
    if (this.stackerSim) this.stackerSim.render();
    if (this.radarSim) this.radarSim.render();
  }
}

// ============================================================================
// SUB-SIMULATOR 1: KITCHEN FRYER PARTICLE & FLUID CONVECTION SIMULATOR
// ============================================================================

class FryerParticleSimulator {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = canvas ? canvas.width : 640;
    this.height = canvas ? canvas.height : 380;

    // Thermal State
    this.temperature = 185.0; // Celsius
    this.targetTemp = 185.0;
    this.isTurboHeat = false;
    this.oilPurity = 1.0; // 1.0 = pristine, 0.0 = dark sludge
    this.oilLevel = this.height * 0.35; // Surface of boiling oil

    // Simulation Entities
    this.bubbles = [];
    this.sparks = [];
    this.steamPuffs = [];
    this.activeBatches = [];
    this.vortices = [];

    // Max capacity
    this.maxBubbles = 220;
    this.maxSteam = 80;

    // Mouse Interaction
    this.stirVelocity = 0;
    this.stirX = this.width / 2;

    this.initPrePopulate();
  }

  initPrePopulate() {
    for (let i = 0; i < 90; i++) {
      this.spawnOilBubble(Math.random() * this.height * 0.6 + this.oilLevel);
    }
  }

  dropBatch(recipeName = 'original_crispy') {
    const batch = {
      id: Date.now() + Math.random(),
      recipe: recipeName,
      x: this.width * 0.25 + Math.random() * (this.width * 0.5),
      y: this.oilLevel + 40 + Math.random() * 80,
      targetY: this.oilLevel + 80 + Math.random() * 60,
      width: 64,
      height: 38,
      rotation: (Math.random() - 0.5) * 0.4,
      cookProgress: 0.0, // 0.0 to 1.0
      isDone: false,
      crispLevel: 0.2
    };
    this.activeBatches.push(batch);

    // Initial splash bubbles
    for (let i = 0; i < 35; i++) {
      this.spawnOilBubble(batch.y);
      this.spawnSteam(batch.x + (Math.random() - 0.5) * 40, this.oilLevel);
    }
  }

  cleanOil() {
    this.oilPurity = 1.0;
    this.bubbles = [];
    this.initPrePopulate();
  }

  setTurbo(enabled) {
    this.isTurboHeat = enabled;
    this.targetTemp = enabled ? 225.0 : 185.0;
  }

  spawnOilBubble(startY) {
    if (this.bubbles.length >= this.maxBubbles) return;
    this.bubbles.push({
      x: Math.random() * this.width,
      y: startY !== undefined ? startY : this.height - 20 - Math.random() * 30,
      radius: 2 + Math.random() * 5.5,
      speedY: 45 + Math.random() * 95,
      driftX: (Math.random() - 0.5) * 35,
      wobbleFreq: 3 + Math.random() * 6,
      wobblePhase: Math.random() * Math.PI * 2,
      opacity: 0.4 + Math.random() * 0.5,
      life: 1.0
    });
  }

  spawnSteam(x, y) {
    if (this.steamPuffs.length >= this.maxSteam) return;
    this.steamPuffs.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y,
      vx: (Math.random() - 0.5) * 25,
      vy: -(30 + Math.random() * 50),
      radius: 6 + Math.random() * 12,
      growthRate: 15 + Math.random() * 20,
      opacity: 0.45,
      decay: 0.35 + Math.random() * 0.4
    });
  }

  spawnSpark(x, y) {
    this.sparks.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 160,
      vy: -(80 + Math.random() * 140),
      gravity: 300,
      size: 1.5 + Math.random() * 2,
      life: 1.0,
      decay: 1.8 + Math.random() * 1.5
    });
  }

  onMouseMove(x, y) {
    if (y > this.oilLevel) {
      this.stirVelocity = (x - this.stirX) * 2.5;
      this.stirX = x;
    }
  }

  onMouseDown(x, y) {
    if (y > this.oilLevel) {
      // Create splash on click
      for (let i = 0; i < 20; i++) {
        this.spawnOilBubble(y + (Math.random() - 0.5) * 30);
      }
      for (let i = 0; i < 15; i++) {
        this.spawnSpark(x, this.oilLevel);
      }
    }
  }

  update(dt) {
    // Thermal Ramp
    this.temperature += (this.targetTemp - this.temperature) * dt * 0.8;

    // Oil Purity Slow Degradation when cooking
    if (this.activeBatches.length > 0) {
      this.oilPurity = Math.max(0.2, this.oilPurity - dt * 0.003);
    }

    // Stir velocity dampening
    this.stirVelocity *= Math.pow(0.2, dt);

    // Continuous bubble generation based on temperature
    const spawnRate = (this.temperature / 185.0) * 180 * dt;
    for (let i = 0; i < spawnRate; i++) {
      if (Math.random() < 0.8) {
        this.spawnOilBubble();
      }
    }

    // Update Bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.wobblePhase += b.wobbleFreq * dt;
      b.x += (b.driftX + Math.sin(b.wobblePhase) * 25 + this.stirVelocity * 0.1) * dt;
      b.y -= b.speedY * (this.temperature / 185.0) * dt;

      // Pop when reaching oil surface
      if (b.y <= this.oilLevel) {
        this.bubbles.splice(i, 1);
        if (Math.random() < 0.35) {
          this.spawnSteam(b.x, this.oilLevel);
        }
        if (this.isTurboHeat && Math.random() < 0.15) {
          this.spawnSpark(b.x, this.oilLevel);
        }
      }
    }

    // Update Steam
    for (let i = this.steamPuffs.length - 1; i >= 0; i--) {
      const s = this.steamPuffs[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.radius += s.growthRate * dt;
      s.opacity -= s.decay * dt;
      if (s.opacity <= 0 || s.y < 0) {
        this.steamPuffs.splice(i, 1);
      }
    }

    // Update Sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const sp = this.sparks[i];
      sp.vy += sp.gravity * dt;
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.life -= sp.decay * dt;
      if (sp.life <= 0) {
        this.sparks.splice(i, 1);
      }
    }

    // Update Active Batches Cooking
    for (let i = this.activeBatches.length - 1; i >= 0; i--) {
      const batch = this.activeBatches[i];
      batch.y += (batch.targetY - batch.y) * dt * 2.0;

      // Cooking progress speeds up with temperature
      const cookSpeed = 0.12 * (this.temperature / 185.0);
      batch.cookProgress = Math.min(1.0, batch.cookProgress + cookSpeed * dt);
      batch.crispLevel = 0.2 + batch.cookProgress * 0.78;

      // Emit bubbling around the chicken
      if (Math.random() < 0.6) {
        this.spawnOilBubble(batch.y + (Math.random() - 0.5) * batch.height);
      }

      if (batch.cookProgress >= 1.0 && !batch.isDone) {
        batch.isDone = true;
        // Broadcast batch finished event
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('batch-cooked', { detail: { batch } }));
        }
      }
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Clear Background (Stainless Steel Deep Fryer Chamber)
    ctx.fillStyle = '#060912';
    ctx.fillRect(0, 0, w, h);

    // Fryer Metal Vat Gradient
    const vatGrad = ctx.createLinearGradient(0, 0, w, 0);
    vatGrad.addColorStop(0, '#101726');
    vatGrad.addColorStop(0.1, '#1b253b');
    vatGrad.addColorStop(0.9, '#1b253b');
    vatGrad.addColorStop(1, '#101726');
    ctx.fillStyle = vatGrad;
    ctx.fillRect(0, 0, w, h);

    // Heating Elements at Bottom (Glows red/orange when heating)
    const elementGlow = this.isTurboHeat ? '#ff3b00' : '#e4002b';
    ctx.strokeStyle = elementGlow;
    ctx.shadowColor = elementGlow;
    ctx.shadowBlur = this.isTurboHeat ? 24 : 14;
    ctx.lineWidth = 6;
    ctx.beginPath();
    for (let x = 40; x < w - 40; x += 40) {
      ctx.moveTo(x, h - 25);
      ctx.lineTo(x + 20, h - 12);
      ctx.lineTo(x + 40, h - 25);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Oil Volume Gradient (Color shifts with oil purity from amber gold to dark deep)
    const oilTopColor = this.oilPurity > 0.6 ? 'rgba(255, 183, 3, 0.45)' : 'rgba(180, 110, 10, 0.65)';
    const oilBottomColor = this.oilPurity > 0.6 ? 'rgba(220, 120, 0, 0.85)' : 'rgba(80, 40, 5, 0.95)';

    const oilGrad = ctx.createLinearGradient(0, this.oilLevel, 0, h);
    oilGrad.addColorStop(0, oilTopColor);
    oilGrad.addColorStop(1, oilBottomColor);
    ctx.fillStyle = oilGrad;
    ctx.fillRect(0, this.oilLevel, w, h - this.oilLevel);

    // Boiling Oil Surface Wave
    ctx.beginPath();
    ctx.moveTo(0, this.oilLevel);
    const now = performance.now() * 0.005;
    for (let x = 0; x <= w; x += 20) {
      const wave = Math.sin(now + x * 0.05) * 3 + Math.cos(now * 1.5 + x * 0.03) * 2;
      ctx.lineTo(x, this.oilLevel + wave);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fillStyle = 'rgba(255, 200, 50, 0.12)';
    ctx.fill();

    // Render Submerged Chicken Batches
    this.activeBatches.forEach((batch) => {
      this.renderChickenDrumstick(batch);
    });

    // Render Bubbles with Specular Highlights
    ctx.lineWidth = 1.2;
    this.bubbles.forEach((b) => {
      ctx.strokeStyle = `rgba(255, 235, 150, ${b.opacity})`;
      ctx.fillStyle = `rgba(255, 190, 40, ${b.opacity * 0.3})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Highlight dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
      ctx.fill();
    });

    // Render Rising Steam Puffs
    this.steamPuffs.forEach((s) => {
      const steamGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius);
      steamGrad.addColorStop(0, `rgba(220, 240, 255, ${s.opacity})`);
      steamGrad.addColorStop(1, 'rgba(220, 240, 255, 0)');
      ctx.fillStyle = steamGrad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Render Sizzling Sparks
    this.sparks.forEach((sp) => {
      ctx.fillStyle = `rgba(255, 240, 180, ${sp.life})`;
      ctx.shadowColor = '#ffaa00';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Thermal Surface Scanner Overlay
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(0, this.oilLevel);
    ctx.lineTo(w, this.oilLevel);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  renderChickenDrumstick(batch) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(batch.x, batch.y);
    ctx.rotate(batch.rotation);

    // Color transition from raw pale poultry to golden crispy KFC mahogany
    const r = Math.floor(210 + (228 - 210) * batch.cookProgress);
    const g = Math.floor(180 - 100 * batch.cookProgress);
    const b = Math.floor(140 - 110 * batch.cookProgress);
    const crustColor = `rgb(${r}, ${g}, ${b})`;

    // Drumstick Bone
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-batch.width * 0.45, -4, batch.width * 0.35, 8);
    ctx.beginPath();
    ctx.arc(-batch.width * 0.45, -4, 6, 0, Math.PI * 2);
    ctx.arc(-batch.width * 0.45, 4, 6, 0, Math.PI * 2);
    ctx.fill();

    // Crispy Meat Bulge
    ctx.fillStyle = crustColor;
    ctx.strokeStyle = '#6b2005';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(batch.width * 0.1, 0, batch.width * 0.4, batch.height * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Crispy Crumb Flakes
    ctx.fillStyle = '#ffcc00';
    for (let i = 0; i < 7; i++) {
      const fx = (Math.sin(i * 1.7) * batch.width * 0.25);
      const fy = (Math.cos(i * 2.3) * batch.height * 0.3);
      ctx.fillRect(fx, fy, 3, 3);
    }

    // Cook Progress Ring Overlay
    ctx.strokeStyle = batch.isDone ? '#00ff88' : '#00f3ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, batch.width * 0.45, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * batch.cookProgress);
    ctx.stroke();

    ctx.restore();
  }
}

// ============================================================================
// SUB-SIMULATOR 2: 2D RIGID BODY PHYSICS BURGER & TOWER STACKER
// ============================================================================

class StackerPhysicsSimulator {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = canvas ? canvas.width : 700;
    this.height = canvas ? canvas.height : 420;

    this.gravity = 980; // px/s^2
    this.bodies = [];
    this.groundY = this.height - 35;

    // Active Spawner / Crosshair Target
    this.spawnX = this.width / 2;
    this.spawnY = 50;
    this.selectedIngredient = 'crispy_patty';

    // Tower Telemetry & Evaluation
    this.towerHeight = 0; // mm
    this.balanceScore = 100; // %
    this.centerOfMassOffset = 0.0;
    this.totalFlavorValue = 0.0;
    this.isCollapsed = false;

    // Static Base Plate
    this.plate = {
      x: this.width / 2,
      y: this.groundY,
      width: 220,
      height: 16
    };

    // Ingredient Definitions & Material Properties
    this.ingredientDefs = {
      bottom_bun: {
        name: 'Bottom Bun',
        width: 140,
        height: 24,
        mass: 1.2,
        restitution: 0.12,
        friction: 0.85,
        color: '#d97706',
        flavorValue: 2.50
      },
      crispy_patty: {
        name: 'Crispy Patty',
        width: 155,
        height: 32,
        mass: 2.5,
        restitution: 0.18,
        friction: 0.9,
        color: '#92400e',
        flavorValue: 6.50
      },
      melted_cheese: {
        name: 'Neon Cheese',
        width: 145,
        height: 12,
        mass: 0.6,
        restitution: 0.05,
        friction: 0.95,
        color: '#fbbf24',
        flavorValue: 2.00
      },
      spicy_slaw: {
        name: 'KFC Slaw',
        width: 135,
        height: 16,
        mass: 0.8,
        restitution: 0.08,
        friction: 0.65,
        color: '#a3e635',
        flavorValue: 1.80
      },
      pickles: {
        name: 'Cyber Pickles',
        width: 90,
        height: 10,
        mass: 0.4,
        restitution: 0.15,
        friction: 0.75,
        color: '#15803d',
        flavorValue: 1.20
      },
      secret_sauce: {
        name: '11-Sauce Layer',
        width: 130,
        height: 8,
        mass: 0.5,
        restitution: 0.02,
        friction: 0.98,
        color: '#e4002b',
        flavorValue: 2.20
      },
      bacon_strip: {
        name: 'Smoked Bacon',
        width: 140,
        height: 10,
        mass: 0.9,
        restitution: 0.1,
        friction: 0.88,
        color: '#7f1d1d',
        flavorValue: 3.50
      },
      top_bun: {
        name: 'Top Bun',
        width: 145,
        height: 36,
        mass: 1.4,
        restitution: 0.14,
        friction: 0.8,
        color: '#d97706',
        flavorValue: 2.50
      }
    };
  }

  spawnIngredient(type) {
    const def = this.ingredientDefs[type] || this.ingredientDefs.crispy_patty;
    const body = {
      id: Date.now() + Math.random(),
      type: type,
      name: def.name,
      x: this.spawnX,
      y: this.spawnY,
      vx: (Math.random() - 0.5) * 15,
      vy: 20,
      width: def.width,
      height: def.height,
      mass: def.mass,
      invMass: 1.0 / def.mass,
      angle: (Math.random() - 0.5) * 0.05,
      angularVelocity: (Math.random() - 0.5) * 0.2,
      restitution: def.restitution,
      friction: def.friction,
      color: def.color,
      flavorValue: def.flavorValue,
      isGrounded: false
    };

    this.bodies.push(body);
    this.calculateTelemetry();
  }

  clear() {
    this.bodies = [];
    this.isCollapsed = false;
    this.calculateTelemetry();
  }

  onMouseMove(x) {
    this.spawnX = Math.max(80, Math.min(this.width - 80, x));
  }

  onMouseDown() {
    this.spawnIngredient(this.selectedIngredient);
  }

  onMouseUp() {}

  update(dt) {
    const bodies = this.bodies;
    const subSteps = 4; // Sub-stepping for stable stack stacking
    const subDt = dt / subSteps;

    for (let step = 0; step < subSteps; step++) {
      // 1. Numerical Integration (Semi-implicit Euler)
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];

        // Apply Gravity
        b.vy += this.gravity * subDt;

        // Position update
        b.x += b.vx * subDt;
        b.y += b.vy * subDt;
        b.angle += b.angularVelocity * subDt;

        // Damping
        b.vx *= Math.pow(0.85, subDt);
        b.angularVelocity *= Math.pow(0.7, subDt);

        // Ground / Base Plate Collision
        if (b.y + b.height / 2 >= this.groundY) {
          b.y = this.groundY - b.height / 2;
          b.vy = -b.vy * b.restitution;
          b.vx *= b.friction;
          b.angularVelocity *= 0.6;
          b.isGrounded = true;
        }

        // Walls Collision
        if (b.x - b.width / 2 < 10) {
          b.x = 10 + b.width / 2;
          b.vx = -b.vx * 0.5;
        } else if (b.x + b.width / 2 > this.width - 10) {
          b.x = this.width - 10 - b.width / 2;
          b.vx = -b.vx * 0.5;
        }
      }

      // 2. Inter-body Collision Resolution (AABB + Angular torque approximation)
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          this.resolveBodyCollision(bodies[i], bodies[j]);
        }
      }
    }

    this.calculateTelemetry();
  }

  resolveBodyCollision(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const halfW = (a.width + b.width) * 0.5;
    const halfH = (a.height + b.height) * 0.5;

    if (Math.abs(dx) < halfW && Math.abs(dy) < halfH) {
      const overlapX = halfW - Math.abs(dx);
      const overlapY = halfH - Math.abs(dy);

      if (overlapY < overlapX) {
        // Vertical Collision (Stacking)
        const sign = dy > 0 ? 1 : -1;
        const totalMass = a.mass + b.mass;
        const aRatio = b.mass / totalMass;
        const bRatio = a.mass / totalMass;

        a.y -= sign * overlapY * aRatio;
        b.y += sign * overlapY * bRatio;

        const relVy = b.vy - a.vy;
        const impulse = -(1 + Math.min(a.restitution, b.restitution)) * relVy * (aRatio * bRatio);

        a.vy -= impulse / a.mass;
        b.vy += impulse / b.mass;

        // Friction and torque based on horizontal offset
        const torque = dx * 0.05;
        a.angularVelocity -= torque / a.mass;
        b.angularVelocity += torque / b.mass;

        a.vx *= a.friction * b.friction;
        b.vx *= a.friction * b.friction;
      } else {
        // Horizontal Collision
        const sign = dx > 0 ? 1 : -1;
        a.x -= sign * overlapX * 0.5;
        b.x += sign * overlapX * 0.5;
        a.vx *= -0.3;
        b.vx *= -0.3;
      }
    }
  }

  calculateTelemetry() {
    if (this.bodies.length === 0) {
      this.towerHeight = 0;
      this.balanceScore = 100;
      this.centerOfMassOffset = 0.0;
      this.totalFlavorValue = 0.0;
      return;
    }

    let totalMass = 0;
    let weightedX = 0;
    let minY = this.groundY;
    let totalVal = 0;

    this.bodies.forEach((b) => {
      totalMass += b.mass;
      weightedX += b.x * b.mass;
      if (b.y - b.height / 2 < minY) {
        minY = b.y - b.height / 2;
      }
      totalVal += b.flavorValue;
    });

    const comX = weightedX / totalMass;
    const baseCenterX = this.plate.x;
    this.centerOfMassOffset = Math.abs(comX - baseCenterX);

    // Height in mm (scaling: 1px = ~1.2mm)
    this.towerHeight = Math.max(0, Math.round((this.groundY - minY) * 1.2));

    // Balance score drops as center of mass deviates from base center
    const maxSafeOffset = this.plate.width * 0.45;
    const balance = Math.max(0, 100 - (this.centerOfMassOffset / maxSafeOffset) * 100);
    this.balanceScore = Math.round(balance);
    this.totalFlavorValue = totalVal;

    if (this.balanceScore < 25 && !this.isCollapsed) {
      this.isCollapsed = true;
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Dark Cyber Kitchen Laboratory Grid
    ctx.fillStyle = '#040711';
    ctx.fillRect(0, 0, w, h);

    // Measurement Height Ruler Lines
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let y = this.groundY; y >= 40; y -= 35) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(w - 30, y);
      ctx.stroke();

      const mm = Math.round((this.groundY - y) * 1.2);
      ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
      ctx.font = '10px Share Tech Mono';
      ctx.fillText(`${mm}mm`, 35, y - 4);
    }

    // Base Serving Plate
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0, 243, 255, 0.3)';
    ctx.shadowBlur = 10;
    ctx.fillRect(this.plate.x - this.plate.width / 2, this.plate.y, this.plate.width, this.plate.height);
    ctx.strokeRect(this.plate.x - this.plate.width / 2, this.plate.y, this.plate.width, this.plate.height);
    ctx.shadowBlur = 0;

    // Stacking Dropper Crosshair
    ctx.strokeStyle = 'rgba(255, 43, 84, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(this.spawnX, 10);
    ctx.lineTo(this.spawnX, this.groundY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Crosshair Indicator
    ctx.strokeStyle = '#ff2b54';
    ctx.beginPath();
    ctx.arc(this.spawnX, this.spawnY, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Render Stack Bodies
    this.bodies.forEach((b) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);

      ctx.fillStyle = b.color;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1.5;

      // Rounded rect body representation
      const r = Math.min(b.height * 0.4, 6);
      ctx.beginPath();
      ctx.roundRect(-b.width / 2, -b.height / 2, b.width, b.height, r);
      ctx.fill();
      ctx.stroke();

      // Top Bun Sesame Seeds Detail
      if (b.type === 'top_bun') {
        ctx.fillStyle = '#ffffff';
        for (let s = -35; s <= 35; s += 14) {
          ctx.fillRect(s, -b.height * 0.25, 3, 2);
        }
      }

      // Crispy Patty Golden Crust Texture
      if (b.type === 'crispy_patty') {
        ctx.fillStyle = '#ffaa00';
        for (let c = -50; c <= 50; c += 18) {
          ctx.fillRect(c, 0, 4, 3);
        }
      }

      ctx.restore();
    });

    // Center of Mass Vertical Guide Line
    if (this.bodies.length > 0) {
      const comX = this.plate.x + (this.centerOfMassOffset * (this.bodies[0].x > this.plate.x ? 1 : -1));
      ctx.strokeStyle = this.balanceScore > 75 ? '#00ff88' : '#ffb703';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(comX, this.groundY - (this.towerHeight / 1.2) * 0.5, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// ============================================================================
// SUB-SIMULATOR 3: AUTONOMOUS DRONE FLEET AIRSPACE RADAR
// ============================================================================

class DroneRadarSimulator {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = canvas ? canvas.width : 680;
    this.height = canvas ? canvas.height : 420;

    // Radar Center (KFC Mega-Hub Base)
    this.hubX = this.width / 2;
    this.hubY = this.height / 2;
    this.maxRadius = Math.min(this.width, this.height) * 0.46;

    // Radar Sweep Beam
    this.sweepAngle = 0;
    this.sweepSpeed = 1.8; // Rad/s

    // Fleet Drones
    this.drones = [];
    this.destinations = [];
    this.stormCells = [];
    this.flightLogs = [];

    // Overclock Engine Mode
    this.isOverclocked = false;

    this.initDefaultEntities();
  }

  initDefaultEntities() {
    // 3 Default Drones
    this.addDrone('KFC-DRONE-01', '#00f3ff');
    this.addDrone('KFC-DRONE-02', '#00ff88');
    this.addDrone('KFC-DRONE-03', '#ffb703');

    // Storm Cells
    this.stormCells.push({
      x: this.hubX - 160,
      y: this.hubY - 90,
      radius: 55,
      severity: 0.8
    });
    this.stormCells.push({
      x: this.hubX + 180,
      y: this.hubY + 80,
      radius: 45,
      severity: 0.6
    });

    // Random delivery destinations
    for (let i = 0; i < 4; i++) {
      this.spawnRandomCustomerBeacon();
    }
  }

  addDrone(callsign, color = '#00f3ff') {
    const drone = {
      id: Date.now() + Math.random(),
      callsign: callsign || `KFC-DRONE-${this.drones.length + 1}`,
      x: this.hubX,
      y: this.hubY,
      vx: 0,
      vy: 0,
      targetX: this.hubX,
      targetY: this.hubY,
      state: 'IDLE', // IDLE, FLYING_TO_CUSTOMER, DELIVERING, RETURNING
      battery: 100.0,
      speed: 65, // px/s
      color: color,
      payload: null,
      path: [],
      historyTrails: []
    };
    this.drones.push(drone);
    this.log(`Drone [${drone.callsign}] commissioned to active airspace.`);
  }

  spawnRandomCustomerBeacon() {
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * (this.maxRadius - 90);
    this.destinations.push({
      id: Date.now() + Math.random(),
      title: `Penthouse #${Math.floor(10 + Math.random() * 90)}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
      x: this.hubX + Math.cos(angle) * dist,
      y: this.hubY + Math.sin(angle) * dist,
      isAssigned: false
    });
  }

  dispatchOrder(orderData) {
    // Find first idle drone
    const idleDrone = this.drones.find((d) => d.state === 'IDLE');
    if (!idleDrone) {
      this.log('⚠️ All drones currently in flight. Queueing delivery.');
      return false;
    }

    let target = this.destinations.find((dst) => !dst.isAssigned);
    if (!target) {
      this.spawnRandomCustomerBeacon();
      target = this.destinations[this.destinations.length - 1];
    }

    target.isAssigned = true;
    idleDrone.targetX = target.x;
    idleDrone.targetY = target.y;
    idleDrone.state = 'FLYING_TO_CUSTOMER';
    idleDrone.payload = orderData;

    this.log(`[DISPATCH] ${idleDrone.callsign} en route to ${target.title} with payload.`);
    return true;
  }

  onClick(x, y) {
    // Click on radar sets a manual delivery waypoint
    const dx = x - this.hubX;
    const dy = y - this.hubY;
    if (Math.hypot(dx, dy) <= this.maxRadius) {
      this.destinations.push({
        id: Date.now(),
        title: `Sector Point (${Math.round(dx)}, ${Math.round(dy)})`,
        x: x,
        y: y,
        isAssigned: false
      });
      this.log(`New delivery beacon plotted at coordinates (${Math.round(x)}, ${Math.round(y)})`);
    }
  }

  log(msg) {
    const time = new Date().toTimeString().split(' ')[0];
    this.flightLogs.unshift(`[${time}] ${msg}`);
    if (this.flightLogs.length > 25) this.flightLogs.pop();

    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('drone-log', { detail: { msg: `[${time}] ${msg}` } }));
    }
  }

  update(dt) {
    // Radar Sweep Rotation
    this.sweepAngle = (this.sweepAngle + this.sweepSpeed * dt) % (Math.PI * 2);

    const speedMultiplier = this.isOverclocked ? 1.8 : 1.0;

    // Update Fleet
    this.drones.forEach((d) => {
      // Trail tracking
      d.historyTrails.unshift({ x: d.x, y: d.y });
      if (d.historyTrails.length > 14) d.historyTrails.pop();

      if (d.state === 'FLYING_TO_CUSTOMER') {
        const dx = d.targetX - d.x;
        const dy = d.targetY - d.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          d.vx = (dx / dist) * d.speed * speedMultiplier;
          d.vy = (dy / dist) * d.speed * speedMultiplier;
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.battery = Math.max(0, d.battery - dt * 0.6);
        } else {
          // Arrived at destination
          d.state = 'DELIVERING';
          this.log(`[DELIVERY] ${d.callsign} dropped hot KFC parcel at destination!`);
          setTimeout(() => {
            d.state = 'RETURNING';
            d.targetX = this.hubX;
            d.targetY = this.hubY;
          }, 1200);
        }
      } else if (d.state === 'RETURNING') {
        const dx = this.hubX - d.x;
        const dy = this.hubY - d.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          d.vx = (dx / dist) * (d.speed * 1.2) * speedMultiplier;
          d.vy = (dy / dist) * (d.speed * 1.2) * speedMultiplier;
          d.x += d.vx * dt;
          d.y += d.vy * dt;
        } else {
          d.state = 'IDLE';
          d.x = this.hubX;
          d.y = this.hubY;
          d.battery = Math.min(100, d.battery + 20); // Recharge at hub
          this.log(`[BASE] ${d.callsign} docked at Central KFC Hub. Recharging.`);
        }
      }
    });
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Dark Radar CRT Surface
    ctx.fillStyle = '#030813';
    ctx.fillRect(0, 0, w, h);

    // Range Rings
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    ctx.lineWidth = 1;
    const rings = [0.25, 0.5, 0.75, 1.0];
    rings.forEach((r) => {
      ctx.beginPath();
      ctx.arc(this.hubX, this.hubY, this.maxRadius * r, 0, Math.PI * 2);
      ctx.stroke();

      // Range text
      ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
      ctx.font = '9px Share Tech Mono';
      ctx.fillText(`${Math.round(r * 1000)}M`, this.hubX + 5, this.hubY - this.maxRadius * r + 12);
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(this.hubX - this.maxRadius, this.hubY);
    ctx.lineTo(this.hubX + this.maxRadius, this.hubY);
    ctx.moveTo(this.hubX, this.hubY - this.maxRadius);
    ctx.lineTo(this.hubX, this.hubY + this.maxRadius);
    ctx.stroke();

    // Weather Storm Cells
    this.stormCells.forEach((storm) => {
      const stormGrad = ctx.createRadialGradient(storm.x, storm.y, 0, storm.x, storm.y, storm.radius);
      stormGrad.addColorStop(0, 'rgba(181, 23, 158, 0.35)');
      stormGrad.addColorStop(1, 'rgba(181, 23, 158, 0)');
      ctx.fillStyle = stormGrad;
      ctx.beginPath();
      ctx.arc(storm.x, storm.y, storm.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(181, 23, 158, 0.4)';
      ctx.stroke();
    });

    // Radar Sweep Beam Wedge
    ctx.save();
    ctx.translate(this.hubX, this.hubY);
    const sweepGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.maxRadius);
    sweepGrad.addColorStop(0, 'rgba(0, 243, 255, 0.4)');
    sweepGrad.addColorStop(1, 'rgba(0, 243, 255, 0.05)');

    ctx.fillStyle = sweepGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this.maxRadius, this.sweepAngle - 0.35, this.sweepAngle);
    ctx.closePath();
    ctx.fill();

    // Beam Leading Line
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(this.sweepAngle) * this.maxRadius, Math.sin(this.sweepAngle) * this.maxRadius);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Central Hub Marker (KFC Base)
    ctx.fillStyle = '#e4002b';
    ctx.shadowColor = '#e4002b';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(this.hubX, this.hubY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Render Destinations Beacons
    this.destinations.forEach((dst) => {
      ctx.fillStyle = '#00ff88';
      ctx.beginPath();
      ctx.arc(dst.x, dst.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
      ctx.beginPath();
      ctx.arc(dst.x, dst.y, 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '9px Rajdhani';
      ctx.fillText(dst.title, dst.x + 8, dst.y + 3);
    });

    // Render Drones & Flight Trails
    this.drones.forEach((d) => {
      // History trail
      ctx.strokeStyle = d.color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      d.historyTrails.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // Drone Body Dot
      ctx.fillStyle = d.color;
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Callsign tag
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px Share Tech Mono';
      ctx.fillText(d.callsign, d.x + 8, d.y - 6);
    });
  }
}

// Global Export
window.CyberPhysicsCanvasEngine = CyberPhysicsCanvasEngine;
