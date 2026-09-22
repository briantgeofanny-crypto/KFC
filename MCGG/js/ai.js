// ============================================================
// MAGIC CHESS GOGO - AI PLAYERS
// 7 AI opponents with different strategies
// ============================================================

import { HERO_DATA, SHOP_ODDS } from './data/heroes.js';
import { Hero } from './hero.js';

const AI_NAMES = ['ShadowBlade', 'DragonMaster', 'IceQueen', 'ThunderGod', 'VoidWalker', 'BloodMoon', 'StarForge'];
const AI_EMOJIS = ['🗡️', '🐉', '❄️', '⚡', '🌌', '🩸', '⭐'];
const AI_STRATEGIES = ['aggressive', 'economy', 'synergy', 'reroll', 'slow_roll', 'fast_level', 'balanced'];

export class AIPlayer {
  constructor(id, game) {
    const nameIdx = id - 1;
    this.id = id;
    this.name = AI_NAMES[nameIdx] || `Player${id}`;
    this.emoji = AI_EMOJIS[nameIdx] || '🤖';
    this.strategy = AI_STRATEGIES[nameIdx] || 'balanced';
    this.game = game;

    this.hp = 100;
    this.gold = 0;
    this.level = 1;
    this.xp = 0;
    this.isEliminated = false;

    this.boardHeroes = []; // Active board heroes
    this.benchHeroes = [];
    this.wins = 0;
    this.losses = 0;
    this.winStreak = 0;
    this.lossStreak = 0;

    // Hero collection
    this.heroCollection = {}; // { heroId: [Hero, ...] }

    this.initStarterHeroes();
  }

  initStarterHeroes() {
    // Start with 2 random B1 heroes
    const b1Heroes = Object.keys(HERO_DATA).filter(id => HERO_DATA[id].tier === 'B1');
    for (let i = 0; i < 2; i++) {
      const heroId = b1Heroes[Math.floor(Math.random() * b1Heroes.length)];
      this.addHero(new Hero(heroId, 1));
    }
    this.updateBoard();
  }

  // ==================== TURN LOGIC ====================

  takeTurn(round) {
    if (this.isEliminated) return;

    // Collect gold
    const base = 5;
    const interest = Math.min(5, Math.floor(this.gold / 10));
    const streak = Math.max(this.winStreak, this.lossStreak);
    const streakBonus = streak >= 6 ? 3 : streak >= 4 ? 2 : streak >= 2 ? 1 : 0;
    this.gold += base + interest + streakBonus;

    // Strategy-based decisions
    switch (this.strategy) {
      case 'aggressive':
        this.aggressiveStrategy(round);
        break;
      case 'economy':
        this.economyStrategy(round);
        break;
      case 'synergy':
        this.synergyStrategy(round);
        break;
      case 'slow_roll':
        this.slowRollStrategy(round);
        break;
      case 'fast_level':
        this.fastLevelStrategy(round);
        break;
      case 'reroll':
        this.rerollStrategy(round);
        break;
      default:
        this.balancedStrategy(round);
    }

    this.updateBoard();
  }

  aggressiveStrategy(round) {
    // Buy XP aggressively early
    if (round <= 3 && this.gold >= 6) {
      this.buyXP(4);
    }
    // Buy heroes whenever possible
    this.buyHeroesFromShop(3);
  }

  economyStrategy(round) {
    // Save gold for interest, only buy when necessary
    if (this.gold < 50 && this.boardHeroes.length < this.level) {
      this.buyHeroesFromShop(1);
    }
    if (round >= 5 && this.gold >= 50) {
      // Start spending
      this.buyHeroesFromShop(2);
      this.buyXP(4);
    }
  }

  synergyStrategy(round) {
    // Try to complete synergies
    this.buyHeroesFromShop(2);
    if (this.gold >= 8) this.buyXP(4);
  }

  slowRollStrategy(round) {
    // Stay at level 6-7, reroll for 3-stars
    if (this.level < 7 && this.gold >= 8) {
      this.buyXP(4);
    }
    // Reroll and buy
    if (round >= 4) this.buyHeroesFromShop(3);
  }

  fastLevelStrategy(round) {
    // Level up as fast as possible
    while (this.gold >= 8) {
      this.buyXP(4);
    }
    this.buyHeroesFromShop(1);
  }

  rerollStrategy(round) {
    // Reroll at 50 gold
    if (this.gold >= 50 || round >= 6) {
      this.buyHeroesFromShop(5);
    }
    if (this.gold >= 6) this.buyXP(4);
  }

  balancedStrategy(round) {
    if (round <= 2) {
      this.buyHeroesFromShop(2);
    } else if (round <= 5) {
      if (this.gold >= 8) this.buyXP(4);
      this.buyHeroesFromShop(2);
    } else {
      if (this.gold >= 8) this.buyXP(4);
      this.buyHeroesFromShop(3);
    }
  }

  buyHeroesFromShop(maxBuys) {
    let bought = 0;
    const level = this.game.playerLevel || 5;
    const odds = SHOP_ODDS[Math.min(this.level, 10)];

    while (bought < maxBuys && this.gold >= 1) {
      // Generate random hero from shop
      let tier = 'B1';
      const roll = Math.random() * 100;
      let cum = 0;
      for (let t = 1; t <= 5; t++) {
        cum += odds[t - 1];
        if (roll <= cum) { tier = `B${t}`; break; }
      }

      const cost = parseInt(tier[1]);
      if (this.gold < cost) break;

      const tierHeroes = Object.keys(HERO_DATA).filter(id => HERO_DATA[id].tier === tier);
      if (!tierHeroes.length) break;

      const heroId = tierHeroes[Math.floor(Math.random() * tierHeroes.length)];
      this.gold -= cost;

      const hero = new Hero(heroId, 1);
      this.addHero(hero);
      bought++;
    }
  }

  buyXP(amount) {
    if (this.gold < 4) return;
    this.gold -= 4;
    this.xp += amount;

    const xpTable = [0, 2, 4, 6, 10, 20, 36, 56, 80, 999];
    while (this.level < 10 && this.xp >= xpTable[this.level]) {
      this.xp -= xpTable[this.level];
      this.level = Math.min(10, this.level + 1);
    }
  }

  addHero(hero) {
    if (!this.heroCollection[hero.id]) this.heroCollection[hero.id] = [];
    this.heroCollection[hero.id].push(hero);

    // Check for star upgrades
    const copies = this.heroCollection[hero.id];
    if (copies.length >= 3 && copies[0].star === 1) {
      // Upgrade to 2★
      const upgraded = new Hero(hero.id, 2);
      this.heroCollection[hero.id] = [upgraded];
    }
    if (copies.length >= 3 && copies[0].star === 2) {
      // Upgrade to 3★
      const upgraded = new Hero(hero.id, 3);
      this.heroCollection[hero.id] = [upgraded];
    }
  }

  updateBoard() {
    // Fill board with heroes from collection, up to level
    const allHeroes = Object.values(this.heroCollection).flat();
    // Sort by tier (higher first), then star
    allHeroes.sort((a, b) => {
      const tierVal = { B5: 5, B4: 4, B3: 3, B2: 2, B1: 1 };
      const tierDiff = (tierVal[b.tier] || 0) - (tierVal[a.tier] || 0);
      if (tierDiff !== 0) return tierDiff;
      return b.star - a.star;
    });

    this.boardHeroes = allHeroes.slice(0, this.level);
    this.benchHeroes = allHeroes.slice(this.level);
  }

  // ==================== BATTLE ====================

  getBoardForBattle() {
    return this.boardHeroes.map((hero, i) => ({
      hero,
      row: Math.floor(i / 8),
      col: i % 8
    }));
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) {
      this.isEliminated = true;
    }
  }

  recordWin() {
    this.wins++;
    this.winStreak++;
    this.lossStreak = 0;
  }

  recordLoss(damageAmount) {
    this.losses++;
    this.lossStreak++;
    this.winStreak = 0;
    this.takeDamage(damageAmount);
  }

  // ==================== RENDER INFO ====================

  getStrength() {
    const totalAtk = this.boardHeroes.reduce((s, h) => s + h.atk, 0);
    return Math.round(totalAtk / Math.max(1, this.boardHeroes.length));
  }

  toDisplayInfo() {
    return {
      name: this.name,
      emoji: this.emoji,
      hp: this.hp,
      level: this.level,
      heroCount: this.boardHeroes.length,
      strength: this.getStrength(),
      isEliminated: this.isEliminated,
      wins: this.wins,
      losses: this.losses
    };
  }
}
