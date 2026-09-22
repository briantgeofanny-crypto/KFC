// ============================================================
// MAGIC CHESS GOGO - COMMANDER SYSTEM
// In-battle commander skills, ultimate, passive
// ============================================================

import { COMMANDER_DATA } from './data/commanders.js';

export class CommanderSystem {
  constructor(game, commanderId) {
    this.game = game;
    this.data = COMMANDER_DATA[commanderId];
    if (!this.data) throw new Error('Invalid commander: ' + commanderId);

    this.id = commanderId;
    this.hp = this.data.stats.hp;
    this.maxHp = this.data.stats.hp;
    this.isActive = false;

    // Skill cooldowns
    this.skill1CD = 0;
    this.skill2CD = 0;
    this.ultCD = 0;
    this.skill1Ready = true;
    this.skill2Ready = true;
    this.ultReady = false;
    this.ultChargeProgress = 0;

    this.render();
  }

  // ==================== TICK ====================

  tick(dt, allyUnits, enemyUnits) {
    if (!this.isActive) return;

    // Tick cooldowns
    if (this.skill1CD > 0) this.skill1CD -= dt;
    if (this.skill2CD > 0) this.skill2CD -= dt;
    if (this.ultCD > 0) this.ultCD -= dt;

    this.skill1Ready = this.skill1CD <= 0;
    this.skill2Ready = this.skill2CD <= 0;
    this.ultReady = this.ultCD <= 0;

    // Charge ult progress
    if (!this.ultReady) {
      this.ultChargeProgress = 1 - (this.ultCD / this.data.ultimate.cooldown);
    }

    // Auto-use skills during battle (AI for non-player control)
    if (this.skill1Ready && Math.random() < 0.02) {
      this.useSkill1(allyUnits, enemyUnits);
    }

    this.updateCooldownUI();
  }

  // ==================== SKILL ACTIVATION ====================

  useSkill1(allyUnits, enemyUnits) {
    if (this.skill1CD > 0) return;
    this.skill1CD = this.data.skills[0].cooldown;
    this.skill1Ready = false;

    const effect = this.data.skills[0].effect;
    this.applyEffect(effect, allyUnits, enemyUnits);

    this.game.showNotification(`⚔️ ${this.data.name}: ${this.data.skills[0].name}!`, 'info');
    this.updateCooldownUI();
  }

  useSkill2(allyUnits, enemyUnits) {
    if (this.skill2CD > 0) return;
    this.skill2CD = this.data.skills[1].cooldown;
    this.skill2Ready = false;

    const effect = this.data.skills[1].effect;
    this.applyEffect(effect, allyUnits, enemyUnits);

    this.game.showNotification(`⚔️ ${this.data.name}: ${this.data.skills[1].name}!`, 'info');
    this.updateCooldownUI();
  }

  useUltimate(allyUnits, enemyUnits) {
    if (!this.ultReady && !this.game.commanderUltReady) return;
    this.ultCD = this.data.ultimate.cooldown;
    this.ultReady = false;
    this.ultChargeProgress = 0;
    this.game.commanderUltReady = false;

    const effect = this.data.ultimate.effect;
    this.applyEffect(effect, allyUnits, enemyUnits);

    this.game.showNotification(`💥 ${this.data.name}: ${this.data.ultimate.name}!!! `, 'gold');

    // Dramatic flash
    const overlay = document.getElementById('ult-flash');
    if (overlay) {
      overlay.style.opacity = '1';
      setTimeout(() => { overlay.style.opacity = '0'; }, 300);
    }

    this.updateCooldownUI();
  }

  // ==================== EFFECTS ====================

  applyEffect(effectType, allies, enemies) {
    const allyHeroes = (allies || []).map(u => u?.hero || u).filter(h => h?.isAlive);
    const enemyHeroes = (enemies || []).map(u => u?.hero || u).filter(h => h?.isAlive);

    switch (effectType) {
      case 'stun_strongest':
        const strongest = enemyHeroes.sort((a, b) => b.maxHp - a.maxHp)[0];
        if (strongest) { strongest.applyCC('stun', 1); strongest.takeDamage(300, 'magic'); }
        break;

      case 'boost_atkspeed':
        allyHeroes.forEach(h => h.applyBuff('atkSpeed', 0.2, 5));
        break;

      case 'ultimate_gogo':
        enemyHeroes.forEach(h => h.takeDamage(500, 'magic'));
        allyHeroes.forEach(h => h.heal(300));
        this.createUltEffect('⭐', '#fbbf24');
        break;

      case 'aoe_stun':
        enemyHeroes.forEach(h => { h.applyCC('stun', 2); h.takeDamage(250, 'physical'); });
        break;

      case 'charge_knockback':
        const farthest = enemyHeroes[enemyHeroes.length - 1];
        if (farthest) { farthest.takeDamage(400, 'physical'); farthest.applyCC('knockback', 1); }
        break;

      case 'ultimate_leomord':
        enemyHeroes.forEach(h => { h.takeDamage(800, 'physical'); h.applyCC('slow', 4, 0.5); });
        this.createUltEffect('⚔️', '#f97316');
        break;

      case 'triple_strike':
        const nearestEnemy = enemyHeroes[0];
        if (nearestEnemy) for(let i = 0; i < 3; i++) nearestEnemy.takeDamage(150, 'physical');
        break;

      case 'leap_strike':
        enemyHeroes.slice(0, 3).forEach(h => { h.takeDamage(350, 'physical'); h.applyCC('knockup', 1.5); });
        break;

      case 'ultimate_freya':
        allyHeroes.forEach(h => h.applyBuff('allAtk', 0.3, 6));
        enemyHeroes.forEach(h => h.takeDamage(600, 'magic'));
        this.createUltEffect('⚡', '#818cf8');
        break;

      case 'spawn_clones':
        // Visual effect only - simulated by buff
        allyHeroes.forEach(h => h.applyBuff('allAtk', 0.15, 5));
        break;

      case 'aoe_slow':
        enemyHeroes.forEach(h => { h.takeDamage(300, 'physical'); h.applyCC('slow', 3, 0.4); });
        break;

      case 'ultimate_sun':
        allyHeroes.forEach(h => h.applyBuff('allAtk', 0.25, 8));
        this.createUltEffect('🐒', '#fbbf24');
        break;

      case 'bounce_shot':
        let bounceDmg = 200;
        enemyHeroes.forEach(h => { h.takeDamage(bounceDmg, 'physical'); bounceDmg *= 0.8; });
        break;

      case 'chain_slow':
        enemyHeroes.forEach(h => h.applyCC('slow', 3, 0.4));
        break;

      case 'ultimate_hanabi':
        enemyHeroes.forEach(h => { h.takeDamage(700, 'magic'); h.applyCC('stun', 2); });
        this.createUltEffect('🌺', '#ec4899');
        break;

      case 'starfall':
        enemyHeroes.slice(0, 4).forEach(h => { h.takeDamage(350, 'magic'); h.applyCC('slow', 2, 0.3); });
        break;

      case 'comet_bounce':
        enemyHeroes.slice(0, 3).forEach(h => h.takeDamage(200, 'magic'));
        break;

      case 'ultimate_cyclops':
        enemyHeroes.forEach(h => h.takeDamage(1000, 'magic'));
        this.createUltEffect('🌀', '#a78bfa');
        break;

      case 'beam_shot':
        enemyHeroes.slice(0, 3).forEach(h => h.takeDamage(400, 'magic'));
        break;

      case 'projectile_slow':
        enemyHeroes.slice(0, 2).forEach(h => { h.takeDamage(280, 'magic'); h.applyCC('slow', 3, 0.3); });
        break;

      case 'ultimate_gord':
        enemyHeroes.forEach(h => h.takeDamage(1200 / Math.max(1, enemyHeroes.length), 'magic'));
        this.createUltEffect('🌀', '#0ea5e9');
        break;

      case 'superposition_clone':
        allyHeroes.forEach(h => h.applyBuff('allAtk', 0.5, 4));
        break;

      case 'time_interference':
        enemyHeroes.forEach(h => h.applyBuff('atkSpeed', -0.4, 3));
        break;

      case 'ultimate_natan':
        allyHeroes.forEach(h => h.heal(h.maxHp * 0.5));
        enemyHeroes.forEach(h => h.takeDamage(800, 'magic'));
        this.createUltEffect('✨', '#34d399');
        break;
    }
  }

  createUltEffect(icon, color) {
    const container = document.getElementById('game-board-area') || document.body;
    const effect = document.createElement('div');
    effect.innerHTML = icon;
    effect.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(0);
      font-size: 80px;
      z-index: 500;
      filter: drop-shadow(0 0 30px ${color});
      animation: bossEntry 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      pointer-events: none;
    `;
    container.appendChild(effect);
    setTimeout(() => effect.remove(), 1500);
  }

  // ==================== PASSIVE ====================

  applyPassive(boardHeroes) {
    const passive = this.data.passive;
    if (!passive) return;

    // Apply passive bonuses based on commander
    switch (this.id) {
      case 'gogo':
        boardHeroes.forEach(h => h.applyBonus({ allAtk: 0.10 }));
        break;
      case 'leomord':
        boardHeroes.filter(h => h.class.includes('fighter')).forEach(h => h.applyBonus({ physAtk: 0.15 }));
        break;
      case 'freya':
        boardHeroes.filter(h => h.class.includes('marksman')).forEach(h => h.applyBonus({ atkSpeed: 0.12 }));
        break;
      case 'sun':
        // Clone spawning is handled in battle
        break;
      case 'hanabi':
        boardHeroes.filter(h => h.class.includes('marksman')).forEach(h => h.applyBonus({ physAtk: 0.10 }));
        break;
      case 'cyclops':
        boardHeroes.filter(h => h.class.includes('mage')).forEach(h => h.applyBonus({ magicAtk: 0.15 }));
        break;
      case 'gord':
        boardHeroes.filter(h => h.class.includes('mage')).forEach(h => h.applyBonus({ magicPen: 0.20 }));
        break;
      case 'natan':
        boardHeroes.forEach(h => h.applyBonus({ critChance: 0.05 }));
        break;
    }
  }

  // ==================== RENDER ====================

  render() {
    const panel = document.getElementById('commander-panel');
    if (!panel) return;

    panel.innerHTML = `
      <div class="panel-title">⚔️ Commander</div>
      <div class="commander-on-board">
        <div class="commander-avatar" style="border-color: ${this.data.color}; box-shadow: 0 0 20px ${this.data.color}40">
          ${this.data.emoji}
        </div>
        <div class="commander-panel-name">${this.data.name}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">${this.data.passive.name}: ${this.data.passive.desc}</div>
        <div class="commander-skills-row">
          <div class="cmd-skill-btn ready" id="cmd-skill-1" onclick="window.game.useCommanderSkill(1)">
            <span class="cmd-skill-icon">${this.data.skills[0].icon}</span>
            <div class="cmd-skill-name">${this.data.skills[0].name}</div>
            <div class="cmd-cd-overlay" id="cmd-cd-1" style="display:none">0</div>
          </div>
          <div class="cmd-skill-btn ready" id="cmd-skill-2" onclick="window.game.useCommanderSkill(2)">
            <span class="cmd-skill-icon">${this.data.skills[1].icon}</span>
            <div class="cmd-skill-name">${this.data.skills[1].name}</div>
            <div class="cmd-cd-overlay" id="cmd-cd-2" style="display:none">0</div>
          </div>
        </div>
        <div class="ult-btn" id="ult-btn" onclick="window.game.useCommanderUlt()">
          <span>${this.data.ultimate.icon}</span>
          <span>${this.data.ultimate.name}</span>
        </div>
        <div class="progress" style="margin-top:6px;">
          <div class="progress-bar progress-xp" id="ult-charge-bar" style="width:0%"></div>
        </div>
      </div>
    `;
  }

  updateCooldownUI() {
    // Skill 1
    const s1btn = document.getElementById('cmd-skill-1');
    const s1cd = document.getElementById('cmd-cd-1');
    if (s1btn && s1cd) {
      if (this.skill1CD > 0) {
        s1btn.className = 'cmd-skill-btn cooldown';
        s1cd.style.display = 'flex';
        s1cd.textContent = Math.ceil(this.skill1CD);
      } else {
        s1btn.className = 'cmd-skill-btn ready';
        s1cd.style.display = 'none';
      }
    }

    // Skill 2
    const s2btn = document.getElementById('cmd-skill-2');
    const s2cd = document.getElementById('cmd-cd-2');
    if (s2btn && s2cd) {
      if (this.skill2CD > 0) {
        s2btn.className = 'cmd-skill-btn cooldown';
        s2cd.style.display = 'flex';
        s2cd.textContent = Math.ceil(this.skill2CD);
      } else {
        s2btn.className = 'cmd-skill-btn ready';
        s2cd.style.display = 'none';
      }
    }

    // Ult button
    const ultBtn = document.getElementById('ult-btn');
    const ultBar = document.getElementById('ult-charge-bar');
    if (ultBtn) {
      if (this.ultReady || this.game?.commanderUltReady) {
        ultBtn.classList.add('ready');
        ultBtn.style.pointerEvents = 'all';
      } else {
        ultBtn.classList.remove('ready');
        ultBtn.style.pointerEvents = 'none';
      }
    }
    if (ultBar) {
      ultBar.style.width = `${this.ultChargeProgress * 100}%`;
    }
  }
}
