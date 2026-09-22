// ============================================================
// MAGIC CHESS GOGO - SHOP SYSTEM
// Hero shop with reroll, lock, probabilities
// ============================================================

import { HERO_DATA, HERO_POOL, SHOP_ODDS } from './data/heroes.js';
import { Hero } from './hero.js';

export class Shop {
  constructor(game) {
    this.game = game;
    this.slots = 5;
    this.currentHeroes = Array(this.slots).fill(null);
    this.isLocked = false;
    this.soldIndices = new Set();

    // Global hero pool (tracks available copies)
    this.pool = {};
    Object.keys(HERO_DATA).forEach(id => {
      const tier = HERO_DATA[id].tier;
      this.pool[id] = HERO_POOL[tier];
    });

    this.render();
  }

  // ==================== SHOP ROLL ====================

  roll(force = false) {
    if (this.isLocked && !force) return;

    // Return current heroes to pool (except sold ones)
    this.currentHeroes.forEach((hero, i) => {
      if (hero && !this.soldIndices.has(i)) {
        this.returnToPool(hero.id);
      }
    });
    this.soldIndices.clear();

    this.currentHeroes = [];
    const level = this.game.playerLevel;
    const odds = SHOP_ODDS[Math.min(level, 10)];

    for (let i = 0; i < this.slots; i++) {
      const hero = this.getRandomHero(odds, this.game.luckyShop);
      this.currentHeroes.push(hero);
    }

    this.game.luckyShop = false;
    this.render();
  }

  getRandomHero(odds, lucky = false) {
    // Pick tier based on odds
    let roll = Math.random() * 100;
    let tier = null;
    let cumulative = 0;

    for (let t = 1; t <= 5; t++) {
      let chance = odds[t - 1];
      if (lucky && t >= 3) chance = Math.min(100, chance * 1.5);
      cumulative += chance;
      if (roll <= cumulative) { tier = `B${t}`; break; }
    }
    if (!tier) tier = 'B1';

    // Get heroes of that tier that have pool remaining
    const tierHeroes = Object.keys(HERO_DATA).filter(id =>
      HERO_DATA[id].tier === tier && this.pool[id] > 0
    );

    if (tierHeroes.length === 0) return this.getRandomHero(odds); // fallback

    const heroId = tierHeroes[Math.floor(Math.random() * tierHeroes.length)];
    this.pool[heroId]--;

    return new Hero(heroId, 1);
  }

  returnToPool(heroId) {
    const tier = HERO_DATA[heroId]?.tier;
    if (!tier) return;
    this.pool[heroId] = Math.min(HERO_POOL[tier], (this.pool[heroId] || 0) + 1);
  }

  // ==================== BUY / SELL ====================

  buyHero(slotIndex) {
    const hero = this.currentHeroes[slotIndex];
    if (!hero) return;

    if (this.game.economy.gold < hero.cost) {
      this.game.showNotification('❌ Not enough gold!', 'error');
      this.flashGold();
      return;
    }

    this.game.economy.spendGold(hero.cost);
    this.currentHeroes[slotIndex] = null;
    this.soldIndices.add(slotIndex);

    // Add hero to collection (handles star upgrade)
    this.game.board.addHeroToCollection(hero);

    this.game.showNotification(`🦸 ${hero.name} purchased!`, 'success');
    this.render();
  }

  flashGold() {
    const goldEl = document.getElementById('gold-amount');
    if (!goldEl) return;
    goldEl.classList.add('animate-shake');
    setTimeout(() => goldEl.classList.remove('animate-shake'), 500);
  }

  reroll() {
    const freeRerolls = this.game.freeRerolls || 0;
    if (freeRerolls > 0) {
      this.game.freeRerolls--;
      this.roll(true);
      this.game.showNotification('🎲 Free reroll used!', 'info');
    } else if (this.game.economy.gold >= 2) {
      this.game.economy.spendGold(2);
      this.roll(true);
    } else {
      this.game.showNotification('❌ Need 2 gold to reroll!', 'error');
    }
  }

  toggleLock() {
    this.isLocked = !this.isLocked;
    this.render();
    this.game.showNotification(
      this.isLocked ? '🔒 Shop locked!' : '🔓 Shop unlocked!',
      'info'
    );
  }

  // ==================== RENDER ====================

  render() {
    const container = document.getElementById('shop-heroes');
    if (!container) return;

    container.innerHTML = '';
    const boardHeroes = this.game.board.getAllAllyHeroes().map(h => h.id);

    this.currentHeroes.forEach((hero, i) => {
      const card = document.createElement('div');
      if (!hero) {
        card.className = 'shop-hero-card sold';
        card.innerHTML = '<div style="opacity:0.3;font-size:24px">—</div>';
        container.appendChild(card);
        return;
      }

      const canAfford = this.game.economy.gold >= hero.cost;
      const isOwned = boardHeroes.includes(hero.id);
      const tierColor = { B1: '#94a3b8', B2: '#4ade80', B3: '#38bdf8', B4: '#c084fc', B5: '#fbbf24' }[hero.tier];

      card.className = `shop-hero-card ${canAfford ? 'affordable' : 'cant-afford'} ${isOwned ? 'owned' : ''}`;
      card.style.setProperty('--hero-tier-color', tierColor);
      card.innerHTML = `
        <div class="shop-hero-emoji">${hero.emoji}</div>
        <div class="shop-hero-name">${hero.name}</div>
        <div class="shop-hero-cost cost-${hero.cost}">🟡 ${hero.cost}</div>
        <div class="shop-hero-synergies">
          ${[...hero.race, ...hero.class].map(s => `<span class="syn-tag">${s}</span>`).join('')}
        </div>
        ${isOwned ? '<div style="position:absolute;top:4px;right:4px;font-size:10px;color:#4ade80;">✓ own</div>' : ''}
      `;

      card.addEventListener('click', () => this.buyHero(i));
      card.addEventListener('mouseenter', () => this.game.board.showTooltip(hero, card));
      card.addEventListener('mouseleave', () => this.game.board.hideTooltip());

      container.appendChild(card);
    });

    // Lock button
    const lockBtn = document.getElementById('btn-lock-shop');
    if (lockBtn) {
      lockBtn.textContent = this.isLocked ? '🔒 Locked' : '🔓 Lock';
      lockBtn.className = `btn-lock-shop ${this.isLocked ? 'locked' : ''}`;
    }
  }

  // ==================== GIVE RANDOM HERO ====================

  giveRandomHero(tiers = [1, 2]) {
    const tierNames = tiers.map(t => `B${t}`);
    const eligible = Object.keys(HERO_DATA).filter(id =>
      tierNames.includes(HERO_DATA[id].tier) && this.pool[id] > 0
    );
    if (!eligible.length) return null;

    const heroId = eligible[Math.floor(Math.random() * eligible.length)];
    this.pool[heroId]--;
    const hero = new Hero(heroId, 1);
    this.game.board.addHeroToCollection(hero);
    return hero;
  }
}
