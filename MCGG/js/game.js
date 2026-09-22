// ============================================================
// MAGIC CHESS GOGO - MAIN GAME CONTROLLER
// Orchestrates all systems: board, shop, economy, battle, AI
// ============================================================

import { Board } from './board.js';
import { Shop } from './shop.js';
import { Economy } from './economy.js';
import { SynergySystem } from './synergy.js';
import { BattleSystem } from './battle.js';
import { CommanderSystem } from './commander.js';
import { GoGoCardSystem } from './gogocard.js';
import { AIPlayer } from './ai.js';
import { Hero } from './hero.js';
import { HERO_DATA } from './data/heroes.js';
import { BASE_ITEMS } from './data/items.js';

const PHASE = { PREP: 'prep', BATTLE: 'battle', RESULT: 'result' };
const PREP_TIME = 30;
const BATTLE_TIME = 30;

// PVE rounds schedule
const PVE_ROUNDS = [1, 2, 3, 7, 11, 15, 20];

export class Game {
  constructor(config) {
    // config: { commanderId, deckCards, playerName }
    this.config = config;
    this.playerName = config.playerName || 'GoGo Player';
    this.commanderId = config.commanderId || 'gogo';
    this.deckCards = config.deckCards || ['golden_shovel', 'free_reroll', 'xp_scroll', 'battle_cry'];

    // Game state
    this.round = 0;
    this.phase = PHASE.PREP;
    this.phaseTimer = PREP_TIME;
    this.timerInterval = null;
    this.playerLevel = 1;

    this.player = { hp: 100, name: this.playerName, emoji: '👑' };
    this.roundBuffs = [];
    this.freeRerolls = 0;
    this.interestBonus = 0;
    this.luckyShop = false;
    this.skipBattle = false;
    this.commanderUltReady = false;
    this.synergyBoost = false;
    this.pendingStarUp = false;
    this.pendingItemUpgrade = false;

    // AI opponents
    this.aiPlayers = [];
    for (let i = 1; i <= 7; i++) this.aiPlayers.push(new AIPlayer(i, this));

    // Matchmaking rotation
    this.currentOpponentIdx = 0;
    this.matchmakingRotation = [];
    this.buildMatchmakingRotation();

    // Systems (init after DOM ready)
    this.board = null;
    this.shop = null;
    this.economy = null;
    this.synergy = null;
    this.battle = null;
    this.commander = null;
    this.gogocards = null;

    // Stats
    this.totalWins = 0;
    this.totalLosses = 0;
    this.totalDamageDealt = 0;
  }

  // ==================== INIT ====================

  init() {
    this.board = new Board(this);
    this.economy = new Economy(this);
    this.shop = new Shop(this);
    this.synergy = new SynergySystem(this);
    this.battle = new BattleSystem(this);
    this.commander = new CommanderSystem(this, this.commanderId);
    this.gogocards = new GoGoCardSystem(this, this.deckCards);

    // Expose globally for HTML event handlers
    window.game = this;

    // Initial gold
    this.economy.addGold(3, false);

    // Start round 1
    this.startRound();

    // Update opponents panel
    this.renderOpponents();

    // Init player HP display
    this.economy.render();

    console.log('🎮 Magic Chess GoGo initialized!');
  }

  // ==================== ROUND FLOW ====================

  startRound() {
    this.round++;
    this.phase = PHASE.PREP;
    this.phaseTimer = PREP_TIME;

    // AI players take their turns
    this.aiPlayers.forEach(ai => ai.takeTurn(this.round));

    // Collect gold & XP
    if (this.round > 1) {
      this.economy.collectRoundGold();
      this.economy.collectRoundXP();
    }

    // Reset for new round
    this.board.resetForNewRound();
    this.roundBuffs = [];

    // Roll shop (unless locked)
    if (!this.shop.isLocked) this.shop.roll();

    // Update header
    this.updateRoundHeader();
    this.updatePhaseDisplay();
    this.renderOpponents();

    // Sync synergies
    this.onBoardChanged();

    // Start prep timer
    this.startTimer(PREP_TIME, () => this.startBattlePhase());

    this.showNotification(`🔔 Round ${this.round} - Preparation!`, 'info');
  }

  startBattlePhase() {
    this.phase = PHASE.BATTLE;
    this.updatePhaseDisplay();

    const boardHeroes = this.board.getBoardHeroes();
    if (boardHeroes.length === 0) {
      // Auto-lose if no heroes
      this.onBattleEnd(false, 1);
      return;
    }

    if (this.skipBattle) {
      this.skipBattle = false;
      this.onBattleEnd(true, 0);
      return;
    }

    // Determine opponent
    const isPVE = PVE_ROUNDS.includes(this.round);
    let opponentHeroes = [];

    if (isPVE) {
      opponentHeroes = this.getPVEEnemies(this.round);
    } else {
      const opponent = this.getCurrentOpponent();
      if (opponent && !opponent.isEliminated) {
        opponentHeroes = opponent.getBoardForBattle();
      } else {
        // Ghost round (eliminated opponent)
        opponentHeroes = this.getGhostHeroes();
      }
    }

    // Show VS banner
    const opName = isPVE ? 'PvE Monsters' : (this.getCurrentOpponent()?.name || 'Ghost');
    this.showVSBanner(opName);

    // Set enemy board
    if (opponentHeroes.length > 0) {
      const enemyHeroObjects = opponentHeroes.map(u => u.hero);
      this.board.setEnemyBoard(enemyHeroObjects);
    }

    // Apply commander passive
    this.commander.applyPassive(boardHeroes);

    // Apply synergy bonuses before battle
    boardHeroes.forEach(h => { h.resetStats(); h.applyItems(); });
    this.synergy.applyBonuses(boardHeroes);

    // Enable commander during battle
    this.commander.isActive = true;

    // Start actual battle
    const { ally, enemy } = this.board.getBattlePositions();
    setTimeout(() => {
      this.battle.startBattle(ally, enemy);
      this.startTimer(BATTLE_TIME, () => {
        if (this.battle.isRunning) this.battle.endBattle();
      });
    }, 1500); // Delay for VS banner
  }

  onBattleEnd(playerWon, survivingEnemyCount) {
    clearInterval(this.timerInterval);
    this.battle.stopBattle();
    this.commander.isActive = false;
    this.phase = PHASE.RESULT;

    // Calculate damage
    let damage = 0;
    if (!playerWon) {
      damage = 3 + survivingEnemyCount + Math.floor(this.round / 5);
    }

    // Record result
    this.economy.recordBattleResult(playerWon);

    if (playerWon) {
      this.totalWins++;
      this.aiPlayers.forEach(ai => {
        if (!ai.isEliminated && this.matchmakingRotation[this.currentOpponentIdx] === ai.id) {
          ai.recordLoss(0);
        }
      });
      this.showRoundResult(true, 0);
    } else {
      this.totalLosses++;
      this.player.hp -= damage;
      this.totalDamageDealt += damage;

      // Record AI win
      const oppId = this.matchmakingRotation[this.currentOpponentIdx];
      const opp = this.aiPlayers.find(a => a.id === oppId);
      if (opp) opp.recordWin();

      this.showRoundResult(false, damage);
      this.economy.render();

      // Check player elimination
      if (this.player.hp <= 0) {
        setTimeout(() => this.endGame(false), 3000);
        return;
      }
    }

    // Advance matchmaking
    this.advanceMatchmaking();
    this.renderOpponents();

    // Check win condition (only player + 1 alive)
    const alive = this.aiPlayers.filter(a => !a.isEliminated);
    if (alive.length === 0) {
      setTimeout(() => this.endGame(true), 3000);
      return;
    }

    // Advance to next round after delay
    setTimeout(() => this.startRound(), 3000);
  }

  // ==================== TIMER ====================

  startTimer(seconds, callback) {
    clearInterval(this.timerInterval);
    this.phaseTimer = seconds;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.phaseTimer--;
      this.updateTimerDisplay();
      if (this.phaseTimer <= 0) {
        clearInterval(this.timerInterval);
        callback();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const el = document.getElementById('timer-display');
    if (!el) return;
    el.textContent = this.phaseTimer;
    el.className = `timer-display ${this.phaseTimer <= 5 ? 'urgent' : ''}`;
  }

  // ==================== MATCHMAKING ====================

  buildMatchmakingRotation() {
    // 7 opponents, rotate through all of them
    const ids = this.aiPlayers.map(a => a.id);
    // Fisher-Yates shuffle
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    this.matchmakingRotation = ids;
  }

  getCurrentOpponent() {
    const idx = this.currentOpponentIdx % this.matchmakingRotation.length;
    const id = this.matchmakingRotation[idx];
    return this.aiPlayers.find(a => a.id === id);
  }

  advanceMatchmaking() {
    this.currentOpponentIdx = (this.currentOpponentIdx + 1) % this.matchmakingRotation.length;
    // Skip eliminated opponents
    let attempts = 0;
    while (this.getCurrentOpponent()?.isEliminated && attempts < 7) {
      this.currentOpponentIdx = (this.currentOpponentIdx + 1) % this.matchmakingRotation.length;
      attempts++;
    }
  }

  // ==================== PVE ENEMIES ====================

  getPVEEnemies(round) {
    const difficulty = Math.ceil(round / 5);
    const heroIds = Object.keys(HERO_DATA);
    const count = 2 + difficulty;
    const enemies = [];

    for (let i = 0; i < count; i++) {
      const hId = heroIds[Math.floor(Math.random() * heroIds.length)];
      const h = new Hero(hId, Math.min(difficulty, 3));
      h.team = 'enemy';
      h.resetStats();
      enemies.push({ hero: h, row: Math.floor(i / 8), col: i % 8 });
    }
    return enemies;
  }

  getGhostHeroes() {
    // Use a random eliminated opponent's last board
    const eliminated = this.aiPlayers.filter(a => a.isEliminated);
    if (!eliminated.length) return [];
    const ghost = eliminated[Math.floor(Math.random() * eliminated.length)];
    return ghost.getBoardForBattle();
  }

  // ==================== CALLBACKS ====================

  onBoardChanged() {
    const boardHeroes = this.board.getBoardHeroes();
    this.synergy.calculate(boardHeroes);
    this.playerLevel = this.economy.level;

    // Update board cap display
    const capEl = document.getElementById('board-cap');
    if (capEl) capEl.textContent = this.playerLevel;
  }

  // ==================== COMMANDER CONTROLS ====================

  useCommanderSkill(skillNum) {
    if (this.phase !== PHASE.BATTLE) {
      this.showNotification('⚔️ Can only use skills during battle!', 'error');
      return;
    }
    const { ally, enemy } = this.board.getBattlePositions();
    if (skillNum === 1) this.commander.useSkill1(ally, enemy);
    else this.commander.useSkill2(ally, enemy);
  }

  useCommanderUlt() {
    if (this.phase !== PHASE.BATTLE && !this.commanderUltReady) {
      this.showNotification('⚔️ Can only use ultimate during battle!', 'error');
      return;
    }
    const { ally, enemy } = this.board.getBattlePositions();
    this.commander.useUltimate(ally, enemy);
  }

  // ==================== UI HELPERS ====================

  updateRoundHeader() {
    const roundNum = document.getElementById('round-number');
    if (roundNum) roundNum.textContent = this.round;

    const phaseName = document.getElementById('phase-name');
    const phaseDesc = document.getElementById('phase-desc');
    if (phaseName && phaseDesc) {
      const isPVE = PVE_ROUNDS.includes(this.round);
      if (this.phase === PHASE.PREP) {
        phaseName.textContent = '🛠️ Preparation';
        phaseName.className = 'phase-name prep';
        phaseDesc.textContent = `Buy heroes & arrange formation`;
      } else if (this.phase === PHASE.BATTLE) {
        if (isPVE) {
          phaseName.textContent = '🐉 PvE Round';
          phaseName.className = 'phase-name pve';
        } else {
          phaseName.textContent = '⚔️ Battle!';
          phaseName.className = 'phase-name battle';
        }
        const opp = this.getCurrentOpponent();
        phaseDesc.textContent = `vs ${isPVE ? 'Monsters' : (opp?.name || 'Ghost')}`;
      }
    }
  }

  updatePhaseDisplay() {
    this.updateRoundHeader();

    // Shop controls
    const shopSection = document.getElementById('shop-section');
    if (shopSection) {
      shopSection.style.opacity = this.phase === PHASE.BATTLE ? '0.4' : '1';
      shopSection.style.pointerEvents = this.phase === PHASE.BATTLE ? 'none' : 'all';
    }
  }

  showVSBanner(opponentName) {
    const banner = document.getElementById('vs-banner');
    if (!banner) return;
    banner.querySelector('.vs-opponent-name').textContent = opponentName;
    banner.style.display = 'block';
    setTimeout(() => { banner.style.display = 'none'; }, 2000);
  }

  showRoundResult(won, damage) {
    const container = document.getElementById('round-result');
    if (!container) return;

    if (won) {
      container.innerHTML = `<div class="result-win">VICTORY!</div>
        <div class="result-damage" style="color:#4ade80">+${1}G bonus</div>`;
      this.economy.addGold(1);
    } else {
      container.innerHTML = `<div class="result-lose">DEFEAT</div>
        <div class="result-damage">-${damage} HP</div>`;
    }

    container.style.display = 'block';
    setTimeout(() => { container.style.display = 'none'; }, 2500);
  }

  renderOpponents() {
    const container = document.getElementById('opponents-list');
    if (!container) return;

    const currentOppId = this.matchmakingRotation[this.currentOpponentIdx % this.matchmakingRotation.length];

    container.innerHTML = this.aiPlayers.map(ai => {
      const info = ai.toDisplayInfo();
      const isSelected = ai.id === currentOppId;
      return `
        <div class="opponent-item ${info.isEliminated ? 'eliminated' : ''} ${isSelected ? 'selected' : ''}">
          <span class="opp-emoji">${ai.emoji}</span>
          <div class="opp-info">
            <div class="opp-name">${ai.name} ${isSelected ? '⚔️' : ''}</div>
            <div class="opp-hp">${info.isEliminated ? '💀 Eliminated' : `❤️ ${info.hp} HP`}</div>
          </div>
          <div class="opp-strength">Lv.${info.level}</div>
        </div>
      `;
    }).join('');

    // Update mini HP in header
    const hpRow = document.getElementById('players-hp-row');
    if (hpRow) {
      const all = [
        { name: 'You', emoji: '👑', hp: this.player.hp, isYou: true, eliminated: this.player.hp <= 0 },
        ...this.aiPlayers.map(a => ({
          name: a.name.slice(0, 4),
          emoji: a.emoji,
          hp: a.hp,
          isYou: false,
          eliminated: a.isEliminated
        }))
      ];
      hpRow.innerHTML = all.map(p => `
        <div class="player-hp-mini ${p.isYou ? 'you' : ''} ${p.eliminated ? 'eliminated' : ''}">
          <span class="php-emoji">${p.emoji}</span>
          <span class="php-name">${p.name}</span>
          <span class="php-hp">${p.eliminated ? '💀' : p.hp}</span>
        </div>
      `).join('');
    }
  }

  // ==================== MODAL ====================

  showModal(content, title = '') {
    let overlay = document.getElementById('game-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'game-modal-overlay';
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `<div class="modal"><div class="modal-title" style="font-family:var(--font-display);font-size:20px;font-weight:700;margin-bottom:16px;color:var(--primary);"></div><div class="modal-body"></div><div style="margin-top:20px;text-align:center;"><button class="btn btn-primary" onclick="document.getElementById('game-modal-overlay').classList.remove('active')">Close</button></div></div>`;
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
      document.body.appendChild(overlay);
    }
    overlay.querySelector('.modal-title').textContent = title;
    overlay.querySelector('.modal-body').innerHTML = content;
    overlay.classList.add('active');
  }

  showHeroDetail(hero) {
    if (!hero) return;
    this.showModal(hero.getTooltipHTML(), hero.name);
  }

  // ==================== NOTIFICATIONS ====================

  showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const icons = { success: '✅', error: '❌', info: 'ℹ️', gold: '🟡' };
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerHTML = `<span>${icons[type] || '📢'}</span><span>${message}</span>`;
    container.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  }

  // ==================== SHOP ACTIONS ====================

  rerollShop() { this.shop.reroll(); }
  buyXP() { this.economy.buyXP(); }
  toggleLockShop() { this.shop.toggleLock(); }

  // ==================== HELPER METHODS for GoGoCards ====================

  addGold(amount) { this.economy.addGold(amount); }
  addXP(amount) { this.economy.addXP(amount); }
  giveRandomHero(tiers) { this.shop.giveRandomHero(tiers); }
  copyRandomHero() {
    const heroes = this.board.getAllAllyHeroes();
    if (!heroes.length) return;
    const original = heroes[Math.floor(Math.random() * heroes.length)];
    const copy = new Hero(original.id, original.star);
    this.board.addHeroToCollection(copy);
  }
  giveRandomItem() {
    const itemIds = Object.keys(BASE_ITEMS);
    const item = BASE_ITEMS[itemIds[Math.floor(Math.random() * itemIds.length)]];
    this.showNotification(`📦 Got item: ${item.icon} ${item.name}!`, 'gold');
  }

  // ==================== END GAME ====================

  endGame(victory) {
    clearInterval(this.timerInterval);
    const screen = document.getElementById('endgame-screen');
    if (!screen) return;

    const placement = victory ? 1 : (8 - this.aiPlayers.filter(a => !a.isEliminated).length);

    screen.querySelector('.endgame-title').textContent = victory ? '🏆 VICTORY!' : '💀 DEFEAT';
    screen.querySelector('.endgame-title').className = `endgame-title ${victory ? 'win' : 'lose'}`;
    screen.querySelector('.endgame-placement').textContent = `Placement: #${placement} of 8`;

    document.getElementById('stat-rounds').textContent = this.round;
    document.getElementById('stat-wins').textContent = this.totalWins;
    document.getElementById('stat-losses').textContent = this.totalLosses;
    document.getElementById('stat-placement').textContent = `#${placement}`;

    screen.classList.add('active');
  }
}
