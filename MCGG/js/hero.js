// ============================================================
// MAGIC CHESS GOGO - HERO CLASS
// Hero instance, stats, buffs, CC, damage, animation
// ============================================================

import { HERO_DATA } from './data/heroes.js';

export class Hero {
  constructor(heroId, star = 1) {
    const data = HERO_DATA[heroId];
    if (!data) throw new Error(`Hero not found: ${heroId}`);

    this.id = heroId;
    this.instanceId = `${heroId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    this.name = data.name;
    this.cost = data.cost;
    this.tier = data.tier;
    this.race = [...data.race];
    this.class = [...data.class];
    this.emoji = data.emoji;
    this.color = data.color;
    this.star = star;
    this.skillData = data.skill;

    // Base stats indexed by star level [1★, 2★, 3★]
    this.baseHp = data.hp[star - 1];
    this.baseAtk = data.atk[star - 1];
    this.baseAtkSpeed = data.atkSpeed;
    this.baseArmor = data.armor;
    this.baseMagicRes = data.magicRes;
    this.baseRange = data.range;
    this.baseMoveSpeed = data.moveSpeed;

    this.resetStats();

    // Items
    this.items = [];
    this.maxItems = 3;

    // Combat state
    this.position = null; // { row, col }
    this.isOnBoard = false;
    this.isBench = false;
    this.team = null; // 'player' | 'enemy'
    this.target = null;
    this.attackTimer = 0;
    this.skillCooldown = 0;
    this.currentMana = 0;
    this.maxMana = 100;
    this.stacks = 0;

    // Visual
    this.element = null;
    this.isAlive = true;
    this.isAnimating = false;
  }

  resetStats() {
    this.maxHp = this.baseHp;
    this.currentHp = this.baseHp;
    this.atk = this.baseAtk;
    this.atkSpeed = this.baseAtkSpeed;
    this.armor = this.baseArmor;
    this.magicRes = this.baseMagicRes;
    this.range = this.baseRange;
    this.moveSpeed = this.baseMoveSpeed;
    this.critChance = 0;
    this.critDmg = 1.5;
    this.lifesteal = 0;
    this.armorPen = 0;
    this.magicPen = 0;
    this.buffs = [];
    this.debuffs = [];
    this.isAlive = true;
    this.currentHp = this.maxHp;
  }

  // Apply synergy/item bonuses BEFORE battle
  applyBonus(bonusObj) {
    if (bonusObj.hp) { this.maxHp = Math.floor(this.baseHp * (1 + bonusObj.hp)); this.currentHp = this.maxHp; }
    if (bonusObj.allAtk) { this.atk = Math.floor(this.baseAtk * (1 + bonusObj.allAtk)); }
    if (bonusObj.physAtk) { this.atk = Math.floor(this.baseAtk * (1 + bonusObj.physAtk)); }
    if (bonusObj.magicAtk) { this.atk = Math.floor(this.baseAtk * (1 + bonusObj.magicAtk)); }
    if (bonusObj.atkSpeed) { this.atkSpeed = Math.min(3.0, this.baseAtkSpeed + bonusObj.atkSpeed); }
    if (bonusObj.armor) { this.armor = Math.floor(this.baseArmor * (1 + bonusObj.armor)); }
    if (bonusObj.magicRes) { this.magicRes = Math.floor(this.baseMagicRes * (1 + bonusObj.magicRes)); }
    if (bonusObj.critChance) { this.critChance = Math.min(0.95, this.critChance + bonusObj.critChance); }
    if (bonusObj.critDmg) { this.critDmg += bonusObj.critDmg; }
    if (bonusObj.lifesteal) { this.lifesteal += bonusObj.lifesteal; }
    if (bonusObj.armorPen) { this.armorPen = Math.min(0.8, this.armorPen + bonusObj.armorPen); }
    if (bonusObj.magicPen) { this.magicPen = Math.min(0.8, this.magicPen + bonusObj.magicPen); }
    if (bonusObj.shield) { this.applyBuff('shield', bonusObj.shield, 999); }
  }

  // Apply item bonuses
  applyItems() {
    for (const item of this.items) {
      if (item.bonus) {
        this.applyBonus(item.bonus);
      }
    }
  }

  // Runtime buff (during battle)
  applyBuff(type, value, duration) {
    const existing = this.buffs.find(b => b.type === type);
    if (existing) {
      existing.value = Math.max(existing.value, value);
      existing.duration = Math.max(existing.duration, duration);
    } else {
      this.buffs.push({ type, value, duration, elapsed: 0 });
    }

    if (type === 'shield') this.shield = (this.shield || 0) + value;
  }

  // Apply CC (crowd control)
  applyCC(type, duration, value = 0) {
    // CC immune check
    if (this.buffs.some(b => b.type === 'ccImmune' || b.type === 'immortal' || b.type === 'invulnerable')) return;

    const existing = this.debuffs.find(d => d.type === type);
    if (existing) {
      existing.duration = Math.max(existing.duration, duration);
    } else {
      this.debuffs.push({ type, duration, value, elapsed: 0 });
    }
  }

  // Check if hero is CC'd
  hasCC(type) { return this.debuffs.some(d => d.type === type && d.duration > 0); }
  canAct() { return !this.hasCC('stun') && !this.hasCC('transform') && !this.hasCC('imprisoned') && !this.hasCC('charm'); }
  canMove() { return this.canAct() && !this.hasCC('slow'); }

  // Take damage
  takeDamage(amount, type = 'physical', sourceHero = null) {
    if (!this.isAlive) return 0;
    if (this.buffs.some(b => b.type === 'immortal' || b.type === 'invulnerable' || b.type === 'immune')) return 0;

    let dmg = amount;

    // Armor/magic resist reduction
    if (type === 'physical') {
      const effectiveArmor = this.armor * (1 - (sourceHero?.armorPen || 0));
      dmg = dmg * (100 / (100 + effectiveArmor));
    } else if (type === 'magic') {
      const effectiveMR = this.magicRes * (1 - (sourceHero?.magicPen || 0));
      dmg = dmg * (100 / (100 + effectiveMR));
    }
    // true damage = no reduction

    // Damage reduction buff
    const drBuff = this.buffs.find(b => b.type === 'damageReduction');
    if (drBuff) dmg = dmg * (1 - drBuff.value);

    // Shield absorption
    if (this.shield > 0) {
      const absorbed = Math.min(this.shield, dmg);
      this.shield -= absorbed;
      dmg -= absorbed;
    }

    dmg = Math.max(0, Math.round(dmg));
    this.currentHp = Math.max(0, this.currentHp - dmg);

    // Lifesteal for attacker
    if (sourceHero && sourceHero.lifesteal > 0) {
      sourceHero.heal(dmg * sourceHero.lifesteal);
    }

    // Mana from taking damage
    this.currentMana = Math.min(this.maxMana, this.currentMana + dmg * 0.1);

    // Check death
    if (this.currentHp <= 0) {
      this.die();
    }

    // Update visual
    this.updateHpBar();
    this.showDamageNumber(dmg, type);

    return dmg;
  }

  heal(amount) {
    if (!this.isAlive) return;
    const actual = Math.min(amount, this.maxHp - this.currentHp);
    this.currentHp += actual;
    this.updateHpBar();
    if (actual > 0) this.showDamageNumber(actual, 'heal');
  }

  die() {
    this.isAlive = false;
    this.currentHp = 0;
    if (this.element) {
      this.element.classList.add('animate-die');
      setTimeout(() => {
        if (this.element && this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
      }, 600);
    }
  }

  // Attack another hero
  attack(target) {
    if (!this.isAlive || !target.isAlive) return;

    const isCrit = Math.random() < this.critChance;
    let dmg = this.atk;
    if (isCrit) dmg *= this.critDmg;

    target.takeDamage(dmg, 'physical', this);
    this.currentMana = Math.min(this.maxMana, this.currentMana + 8);

    if (this.element) {
      this.element.classList.add('animate-attack');
      setTimeout(() => this.element?.classList.remove('animate-attack'), 300);
    }
  }

  // Use skill
  useSkill(targets) {
    if (this.currentMana < this.maxMana) return false;
    if (this.skillCooldown > 0) return false;

    this.currentMana = 0;
    this.skillCooldown = this.skillData.cooldown;

    try {
      // Determine targets for skill
      const skillTargets = targets || [];
      this.skillData.effect(this, skillTargets);
    } catch(e) {
      console.warn('Skill error:', e);
    }

    if (this.element) {
      this.element.classList.add('animate-skill');
      setTimeout(() => this.element?.classList.remove('animate-skill'), 400);
    }

    return true;
  }

  // Update HP bar visual
  updateHpBar() {
    if (!this.element) return;
    const bar = this.element.querySelector('.hero-hp-fill');
    if (bar) {
      const pct = Math.max(0, (this.currentHp / this.maxHp) * 100);
      bar.style.width = `${pct}%`;
      bar.style.background = pct > 60 ? '#4ade80' : pct > 30 ? '#fbbf24' : '#ef4444';
    }
  }

  // Show floating damage/heal number
  showDamageNumber(amount, type) {
    if (!this.element) return;
    const num = document.createElement('div');
    num.className = `damage-number ${type === 'heal' ? 'heal' : type}`;
    num.textContent = type === 'heal' ? `+${Math.round(amount)}` : `-${Math.round(amount)}`;
    num.style.fontSize = amount > 500 ? '16px' : '12px';
    num.style.left = `${Math.random() * 40 + 20}%`;
    num.style.top = `${Math.random() * 20}%`;
    this.element.appendChild(num);
    setTimeout(() => num.remove(), 1000);
  }

  // Tick buffs/debuffs (per battle tick ~0.1s)
  tick(deltaTime) {
    // Tick buffs
    for (let i = this.buffs.length - 1; i >= 0; i--) {
      this.buffs[i].elapsed += deltaTime;
      if (this.buffs[i].elapsed >= this.buffs[i].duration) {
        this.buffs.splice(i, 1);
      }
    }
    // Tick debuffs
    for (let i = this.debuffs.length - 1; i >= 0; i--) {
      const d = this.debuffs[i];
      d.elapsed += deltaTime;

      // DoT effects
      if (d.type === 'burn' || d.type === 'dot') {
        this.currentHp = Math.max(0, this.currentHp - d.value * deltaTime);
        this.updateHpBar();
        if (this.currentHp <= 0) this.die();
      }
      if (d.type === 'drain') {
        this.currentHp = Math.max(0, this.currentHp - d.value * deltaTime);
        this.updateHpBar();
      }
      if (d.type === 'regen' || (this.buffs.find(b => b.type === 'regen'))) {
        const regen = this.buffs.find(b => b.type === 'regen');
        if (regen) this.heal(regen.value * deltaTime);
      }

      if (d.elapsed >= d.duration) {
        this.debuffs.splice(i, 1);
      }
    }

    // Tick skill cooldown
    if (this.skillCooldown > 0) this.skillCooldown -= deltaTime;

    // Tick attack timer
    if (this.attackTimer > 0) this.attackTimer -= deltaTime;
  }

  // Star upgrade
  upgradeToStar(newStar) {
    this.star = newStar;
    const data = HERO_DATA[this.id];
    this.baseHp = data.hp[newStar - 1];
    this.baseAtk = data.atk[newStar - 1];
    this.resetStats();
    this.applyItems();
    this.updateElement();
  }

  // Create/update DOM element
  createElement() {
    const el = document.createElement('div');
    el.className = 'hero-piece';
    el.dataset.heroInstance = this.instanceId;
    el.dataset.tier = this.tier;
    el.draggable = true;

    el.innerHTML = `
      <div class="hero-piece-bg" style="background:${this.color}"></div>
      <div class="hero-piece-stars"></div>
      <div class="hero-emoji-display">${this.emoji}</div>
      <div class="hero-piece-name">${this.name}</div>
      <div class="hero-hp-bar"><div class="hero-hp-fill" style="width:100%"></div></div>
      <div class="hero-items-row"></div>
    `;

    this.element = el;
    this.updateElement();
    this.setupDrag();
    return el;
  }

  updateElement() {
    if (!this.element) return;
    // Stars
    const starsEl = this.element.querySelector('.hero-piece-stars');
    if (starsEl) {
      starsEl.innerHTML = Array(this.star).fill('<span class="hero-piece-star">★</span>').join('');
    }
    // Items
    const itemsEl = this.element.querySelector('.hero-items-row');
    if (itemsEl) {
      itemsEl.innerHTML = this.items.map(item => `<div class="hero-item-dot" style="background:${item.color}"></div>`).join('');
    }
  }

  setupDrag() {
    if (!this.element) return;
    this.element.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('heroInstance', this.instanceId);
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => this.element?.classList.add('dragging'), 0);
    });
    this.element.addEventListener('dragend', () => {
      this.element?.classList.remove('dragging');
    });
  }

  // Get tooltip HTML
  getTooltipHTML() {
    const data = HERO_DATA[this.id];
    return `
      <div class="tooltip-hero-header">
        <span class="tooltip-hero-emoji">${this.emoji}</span>
        <div>
          <div class="tooltip-hero-name">${this.name}</div>
          <div class="tooltip-tier-cost">
            <span class="badge badge-${this.tier.toLowerCase()}">${this.tier}</span>
            <span class="shop-hero-cost cost-${this.cost}">🟡 ${this.cost}</span>
          </div>
          <div class="stars">${Array(this.star).fill('<span class="star">★</span>').join('')}</div>
        </div>
      </div>
      <div class="tooltip-stats">
        <div class="stat-row"><span class="stat-icon">❤️</span><span class="stat-label">HP</span><span class="stat-value">${Math.round(this.maxHp)}</span></div>
        <div class="stat-row"><span class="stat-icon">⚔️</span><span class="stat-label">ATK</span><span class="stat-value">${Math.round(this.atk)}</span></div>
        <div class="stat-row"><span class="stat-icon">⚡</span><span class="stat-label">SPD</span><span class="stat-value">${this.atkSpeed.toFixed(2)}/s</span></div>
        <div class="stat-row"><span class="stat-icon">🛡️</span><span class="stat-label">ARM</span><span class="stat-value">${Math.round(this.armor)}</span></div>
        <div class="stat-row"><span class="stat-icon">🔮</span><span class="stat-label">MR</span><span class="stat-value">${Math.round(this.magicRes)}</span></div>
        <div class="stat-row"><span class="stat-icon">📏</span><span class="stat-label">RNG</span><span class="stat-value">${this.range}</span></div>
      </div>
      <div class="tooltip-skill">
        <div class="tooltip-skill-name">⚡ ${this.skillData.name}</div>
        <div class="tooltip-skill-desc">${this.skillData.desc}</div>
      </div>
      <div class="tooltip-synergies">
        ${[...this.race, ...this.class].map(s => `<span class="tooltip-syn-tag">${s.toUpperCase()}</span>`).join('')}
      </div>
    `;
  }

  toJSON() {
    return {
      id: this.id,
      instanceId: this.instanceId,
      star: this.star,
      position: this.position,
      isOnBoard: this.isOnBoard,
      items: this.items.map(i => i.id)
    };
  }

  static fromJSON(data) {
    const hero = new Hero(data.id, data.star);
    hero.instanceId = data.instanceId;
    hero.position = data.position;
    hero.isOnBoard = data.isOnBoard;
    return hero;
  }
}
