// ============================================================
// MAGIC CHESS GOGO - ECONOMY SYSTEM
// Gold, interest, XP, level, streaks
// ============================================================

export class Economy {
  constructor(game) {
    this.game = game;

    this.gold = 0;
    this.goldPerRound = 5;
    this.interest = 0;
    this.winStreak = 0;
    this.lossStreak = 0;

    this.xp = 0;
    this.level = 1;
    this.xpNeeded = [0, 2, 4, 6, 10, 20, 36, 56, 80]; // XP to reach each level
    this.maxLevel = 10;

    // XP to next level table
    this.xpTable = [0, 2, 4, 6, 10, 20, 36, 56, 80, 999];

    this.render();
  }

  // ==================== GOLD ====================

  addGold(amount, animated = true) {
    this.gold += amount;
    if (animated) this.animateGoldChange(amount);
    this.render();
  }

  spendGold(amount) {
    if (this.gold < amount) return false;
    this.gold -= amount;
    this.render();
    return true;
  }

  // Called at start of each round (PREPARATION phase)
  collectRoundGold() {
    let earned = 0;
    const base = 5;
    earned += base;

    // Interest bonus (1 gold per 10 gold, max 5)
    const interestBonus = Math.min(5, Math.floor(this.gold / 10));
    earned += interestBonus;
    this.interest = interestBonus;

    // Streak bonus
    const streak = Math.max(this.winStreak, this.lossStreak);
    let streakBonus = 0;
    if (streak >= 2) streakBonus = 1;
    if (streak >= 4) streakBonus = 2;
    if (streak >= 6) streakBonus = 3;
    earned += streakBonus;

    // Extra bonus from GoGoCards
    earned += this.game.interestBonus || 0;
    this.game.interestBonus = 0;

    this.addGold(earned, false);

    const breakdown = [`Base: +${base}G`];
    if (interestBonus > 0) breakdown.push(`Interest: +${interestBonus}G`);
    if (streakBonus > 0) breakdown.push(`Streak: +${streakBonus}G`);

    this.game.showNotification(`💰 +${earned}G (${breakdown.join(', ')})`, 'gold');
    return earned;
  }

  recordBattleResult(won) {
    if (won) {
      this.winStreak++;
      this.lossStreak = 0;
    } else {
      this.lossStreak++;
      this.winStreak = 0;
    }
    this.render();
  }

  animateGoldChange(amount) {
    const el = document.getElementById('gold-amount');
    if (!el) return;
    el.classList.add('animate-scale-in');
    setTimeout(() => el.classList.remove('animate-scale-in'), 300);

    // Floating coin animation
    for (let i = 0; i < Math.min(amount, 5); i++) {
      setTimeout(() => {
        const coin = document.createElement('div');
        coin.textContent = '🟡';
        coin.style.cssText = `
          position: fixed;
          font-size: 20px;
          pointer-events: none;
          z-index: 9999;
          animation: goldCoin 0.8s ease-out forwards;
          left: ${100 + Math.random() * 100}px;
          top: ${window.innerHeight - 100}px;
        `;
        document.body.appendChild(coin);
        setTimeout(() => coin.remove(), 800);
      }, i * 100);
    }
  }

  // ==================== XP & LEVEL ====================

  addXP(amount) {
    if (this.level >= this.maxLevel) return;

    this.xp += amount;

    // Check level up
    while (this.level < this.maxLevel && this.xp >= this.xpTable[this.level]) {
      this.xp -= this.xpTable[this.level];
      this.levelUp();
    }

    this.render();
  }

  buyXP() {
    if (!this.spendGold(4)) {
      this.game.showNotification('❌ Need 4 gold for XP!', 'error');
      return;
    }
    this.addXP(4);
    this.game.showNotification('📚 +4 XP purchased!', 'info');
  }

  levelUp() {
    if (this.level >= this.maxLevel) return;
    this.level++;
    this.game.playerLevel = this.level;

    this.game.showNotification(`⬆️ Level Up! Now Level ${this.level} (${this.level} heroes on board)`, 'gold');

    // Visual effect
    const lvlEl = document.getElementById('player-level');
    if (lvlEl) {
      lvlEl.classList.add('animate-scale-bounce');
      setTimeout(() => lvlEl.classList.remove('animate-scale-bounce'), 500);
    }

    this.render();
  }

  collectRoundXP() {
    // XP gained per round
    this.addXP(2);
  }

  // ==================== RENDER ====================

  render() {
    // Gold
    const goldEl = document.getElementById('gold-amount');
    if (goldEl) goldEl.textContent = this.gold;

    // Interest pips
    for (let i = 1; i <= 5; i++) {
      const pip = document.getElementById(`interest-pip-${i}`);
      if (pip) {
        pip.classList.toggle('active', i <= this.interest);
      }
    }

    // Interest label
    const intLabel = document.getElementById('interest-label');
    if (intLabel) intLabel.textContent = `+${this.interest}G interest next round`;

    // Streak
    const streakIcon = document.getElementById('streak-icon');
    const streakText = document.getElementById('streak-text');
    const streakBonus = document.getElementById('streak-bonus');

    if (streakIcon && streakText && streakBonus) {
      if (this.winStreak >= 2) {
        streakIcon.textContent = '🔥';
        streakText.textContent = `Win Streak x${this.winStreak}`;
        const b = this.winStreak >= 6 ? 3 : this.winStreak >= 4 ? 2 : 1;
        streakBonus.textContent = `+${b}G`;
        streakBonus.style.color = '#4ade80';
      } else if (this.lossStreak >= 2) {
        streakIcon.textContent = '💧';
        streakText.textContent = `Loss Streak x${this.lossStreak}`;
        const b = this.lossStreak >= 6 ? 3 : this.lossStreak >= 4 ? 2 : 1;
        streakBonus.textContent = `+${b}G`;
        streakBonus.style.color = '#ef4444';
      } else {
        streakIcon.textContent = '➖';
        streakText.textContent = 'No streak';
        streakBonus.textContent = '+0G';
        streakBonus.style.color = 'var(--text-muted)';
      }
    }

    // Level
    const lvlEl = document.getElementById('player-level');
    const capEl = document.getElementById('board-cap');
    const xpEl = document.getElementById('xp-display');
    const xpBarEl = document.getElementById('xp-bar-fill');

    if (lvlEl) lvlEl.textContent = this.level;
    if (capEl) capEl.textContent = this.level;

    const xpNeededNext = this.level < this.maxLevel ? this.xpTable[this.level] : 999;
    const xpProgress = this.level < this.maxLevel ? (this.xp / xpNeededNext) * 100 : 100;

    if (xpEl) xpEl.textContent = `${this.xp}/${this.level < this.maxLevel ? xpNeededNext : '∞'} XP`;
    if (xpBarEl) xpBarEl.style.width = `${xpProgress}%`;

    // Player HP bar
    const hpBar = document.getElementById('player-hp-bar');
    const hpVal = document.getElementById('player-hp-value');
    if (hpBar) hpBar.style.width = `${this.game.player.hp}%`;
    if (hpVal) hpVal.textContent = `${this.game.player.hp} HP`;
  }
}
