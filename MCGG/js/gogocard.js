// ============================================================
// MAGIC CHESS GOGO - GOGOCARD SYSTEM
// Card activation, effects, UI management
// ============================================================

import { GOGOCARD_DATA, STARTER_DECKS } from './data/cards.js';

export class GoGoCardSystem {
  constructor(game, deckCards) {
    this.game = game;
    this.deck = deckCards.map(id => ({ ...GOGOCARD_DATA[id], used: false }));
    this.render();
  }

  // ==================== ACTIVATION ====================

  useCard(index) {
    const card = this.deck[index];
    if (!card || card.used) return;

    // Apply effect
    try {
      card.effect(this.game);
      card.used = true;
      this.game.showNotification(`🃏 ${card.name}: ${card.desc}`, 'gold');
    } catch (e) {
      console.warn('Card effect error:', e);
    }

    this.render();
  }

  resetForNewRound() {
    // Cards are single-use per game; don't reset
    this.render();
  }

  // ==================== RENDER ====================

  render() {
    const container = document.getElementById('gogocard-slots');
    if (!container) return;

    container.innerHTML = this.deck.map((card, i) => {
      const rarityColor = {
        common: '#94a3b8',
        rare: '#38bdf8',
        epic: '#c084fc',
        legendary: '#fbbf24'
      }[card.rarity] || '#94a3b8';

      return `
        <div class="gogocard-slot ${card.used ? 'used' : ''}"
             style="--card-border: ${rarityColor}; ${!card.used ? `cursor:pointer;border-color:${rarityColor}20` : ''}"
             onclick="${!card.used ? `window.game.gogocards.useCard(${i})` : ''}">
          <span class="gogocard-slot-icon">${card.icon}</span>
          <div class="gogocard-slot-info">
            <div class="gogocard-slot-name">${card.name}</div>
            <div class="gogocard-slot-effect">${card.desc}</div>
          </div>
          <div style="font-size:9px;color:${rarityColor};font-family:var(--font-ui);font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">${card.rarity}</div>
        </div>
      `;
    }).join('');
  }

  // ==================== STATIC HELPERS ====================

  static getDeckFromSelection(deckIndex, customCards = null) {
    if (customCards) return customCards;
    const deck = STARTER_DECKS[deckIndex];
    return deck ? deck.cards : STARTER_DECKS[0].cards;
  }
}
