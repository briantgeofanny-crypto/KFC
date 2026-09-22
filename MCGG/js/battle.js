// ============================================================
// MAGIC CHESS GOGO - BATTLE SYSTEM
// Auto-battle simulation with attack, move, skill, death
// ============================================================

export class BattleSystem {
  constructor(game) {
    this.game = game;
    this.isRunning = false;
    this.tickInterval = null;
    this.TICK_RATE = 100; // ms per tick
    this.elapsed = 0;
    this.maxDuration = 30000; // 30 second max battle

    this.allyUnits = [];
    this.enemyUnits = [];
    this.battleLog = [];
  }

  // ==================== START BATTLE ====================

  startBattle(allyHeroes, enemyHeroes) {
    this.isRunning = true;
    this.elapsed = 0;
    this.battleLog = [];

    // Deep-prepare units
    this.allyUnits = allyHeroes.map(u => {
      u.hero.team = 'player';
      u.hero.battlePos = { row: u.row, col: u.col };
      u.hero.resetStats();
      return u;
    });

    this.enemyUnits = enemyHeroes.map(u => {
      u.hero.team = 'enemy';
      u.hero.battlePos = { row: u.row, col: u.col };
      u.hero.resetStats();
      return u;
    });

    // Apply synergy bonuses to allies
    const allies = this.allyUnits.map(u => u.hero);
    const syns = this.game.synergy.calculate(allies);
    // Reset + apply items + apply synergies
    allies.forEach(h => {
      h.resetStats();
      h.applyItems();
    });
    this.game.synergy.applyBonuses(allies);

    // Start tick loop
    this.tickInterval = setInterval(() => this.tick(), this.TICK_RATE);
    this.log('⚔️ Battle Start!');
  }

  // ==================== TICK ====================

  tick() {
    if (!this.isRunning) return;

    const dt = this.TICK_RATE / 1000; // seconds
    this.elapsed += this.TICK_RATE;

    const aliveAllies = this.allyUnits.filter(u => u.hero.isAlive);
    const aliveEnemies = this.enemyUnits.filter(u => u.hero.isAlive);

    // Check end conditions
    if (aliveAllies.length === 0 || aliveEnemies.length === 0) {
      this.endBattle();
      return;
    }
    if (this.elapsed >= this.maxDuration) {
      this.endBattle();
      return;
    }

    // Process each alive ally
    for (const unit of aliveAllies) {
      this.processUnit(unit, aliveAllies, aliveEnemies, dt, 'player');
    }

    // Process each alive enemy
    for (const unit of aliveEnemies) {
      this.processUnit(unit, aliveEnemies, aliveAllies, dt, 'enemy');
    }

    // Commander skill ticks
    this.game.commander?.tick(dt, aliveAllies, aliveEnemies);

    // Update all HP bars
    [...aliveAllies, ...aliveEnemies].forEach(u => u.hero.updateHpBar());
  }

  processUnit(unit, friends, foes, dt, team) {
    const hero = unit.hero;
    if (!hero.isAlive) return;

    // Tick buffs/debuffs
    hero.tick(dt);

    // CC check
    if (!hero.canAct()) return;

    // Find target (nearest enemy by priority: lowest HP)
    if (!hero.target || !hero.target.isAlive) {
      hero.target = this.findTarget(unit, foes);
    }

    if (!hero.target) return;

    // Check if in range
    const dist = this.getDistance(unit, hero.target._unit || foes[0]);
    const inRange = dist <= hero.range;

    if (inRange) {
      // Tick attack timer
      hero.attackTimer -= dt;

      if (hero.attackTimer <= 0) {
        // Try skill first if mana full
        if (hero.currentMana >= hero.maxMana && hero.skillCooldown <= 0) {
          const targets = this.getSkillTargets(unit, foes, 3);
          hero.useSkill(targets.map(u => u.hero));
          hero.attackTimer = 1 / hero.atkSpeed;
        } else {
          // Basic attack
          hero.attack(hero.target);
          hero.attackTimer = 1 / hero.atkSpeed;
        }
      }

      // Mana regen
      hero.currentMana = Math.min(hero.maxMana, hero.currentMana + 2 * dt);
    } else {
      // Move toward target
      if (hero.canMove()) {
        this.moveToward(unit, hero.target._unit || foes[0], dt);
      }
    }
  }

  findTarget(unit, enemies) {
    if (!enemies.length) return null;

    // Find closest alive enemy
    let closest = null;
    let minDist = Infinity;

    for (const enemy of enemies) {
      if (!enemy.hero.isAlive) continue;
      const dist = this.getDistance(unit, enemy);
      if (dist < minDist) {
        minDist = dist;
        closest = enemy.hero;
        closest._unit = enemy;
      }
    }
    return closest;
  }

  getSkillTargets(unit, enemies, count = 3) {
    return enemies
      .filter(u => u.hero.isAlive)
      .sort((a, b) => {
        const da = this.getDistance(unit, a);
        const db = this.getDistance(unit, b);
        return da - db;
      })
      .slice(0, count);
  }

  getDistance(unitA, unitB) {
    if (!unitA || !unitB) return 999;
    const dr = Math.abs((unitA.row || 0) - (unitB.row || 0));
    const dc = Math.abs((unitA.col || 0) - (unitB.col || 0));
    return Math.sqrt(dr * dr + dc * dc);
  }

  moveToward(unit, targetUnit, dt) {
    // Simple position tracking (visual movement is animated)
    const hero = unit.hero;
    const speed = hero.moveSpeed / 100;

    const dr = (targetUnit.row || 0) - (unit.row || 0);
    const dc = (targetUnit.col || 0) - (unit.col || 0);
    const dist = Math.sqrt(dr * dr + dc * dc);

    if (dist < 0.1) return;

    unit.row += (dr / dist) * speed * dt;
    unit.col += (dc / dist) * speed * dt;

    // Update visual position if element exists
    if (hero.element) {
      const boardEl = hero.team === 'player'
        ? document.getElementById('ally-grid')
        : document.getElementById('enemy-grid');
      // Visual position updating happens via CSS transitions
    }
  }

  // ==================== END BATTLE ====================

  endBattle() {
    clearInterval(this.tickInterval);
    this.isRunning = false;

    const aliveAllies = this.allyUnits.filter(u => u.hero.isAlive);
    const aliveEnemies = this.enemyUnits.filter(u => u.hero.isAlive);

    const playerWon = aliveAllies.length > aliveEnemies.length
      || (aliveAllies.length > 0 && aliveEnemies.length === 0);

    this.game.onBattleEnd(playerWon, aliveEnemies.length);
  }

  stopBattle() {
    clearInterval(this.tickInterval);
    this.isRunning = false;
  }

  log(msg) {
    this.battleLog.push({ time: this.elapsed, msg });
  }

  // ==================== SIMULATE BATTLE (instant) ====================
  // Used for AI vs AI rounds to quickly determine winner

  simulateBattle(allyHeroes, enemyHeroes) {
    // Clone heroes for simulation
    const allies = allyHeroes.map(h => ({
      hp: h.maxHp,
      atk: h.atk,
      atkSpeed: h.atkSpeed,
      armor: h.armor,
      star: h.star
    }));
    const enemies = enemyHeroes.map(h => ({
      hp: h.maxHp,
      atk: h.atk,
      atkSpeed: h.atkSpeed,
      armor: h.armor,
      star: h.star
    }));

    let tick = 0;
    const maxTicks = 500;

    while (tick < maxTicks) {
      const aliveA = allies.filter(h => h.hp > 0);
      const aliveE = enemies.filter(h => h.hp > 0);
      if (!aliveA.length || !aliveE.length) break;

      // Each unit attacks each tick at its speed
      for (const a of aliveA) {
        const target = aliveE[Math.floor(Math.random() * aliveE.length)];
        if (target) {
          const dmg = a.atk * (100 / (100 + target.armor));
          target.hp -= dmg;
        }
      }
      for (const e of aliveE) {
        const target = aliveA[Math.floor(Math.random() * aliveA.length)];
        if (target) {
          const dmg = e.atk * (100 / (100 + target.armor));
          target.hp -= dmg;
        }
      }
      tick++;
    }

    const aliveAllies = allies.filter(h => h.hp > 0);
    const aliveEnemies = enemies.filter(h => h.hp > 0);

    return {
      playerWon: aliveAllies.length >= aliveEnemies.length,
      survivingEnemies: aliveEnemies.length
    };
  }
}
