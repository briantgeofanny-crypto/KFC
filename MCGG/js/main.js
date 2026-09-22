// ============================================================
// MAGIC CHESS GOGO - MAIN ENTRY POINT
// Lobby → Commander Select → Card Select → Game
// ============================================================

import { COMMANDER_DATA } from './data/commanders.js';
import { GOGOCARD_DATA, STARTER_DECKS } from './data/cards.js';
import { Game } from './game.js';

// ==================== LOBBY STATE ====================
const lobbyState = {
  selectedCommander: 'gogo',
  selectedDeckIdx: 0,
  customCards: null,
  playerName: 'GoGo Player'
};

// ==================== LOBBY SCREENS ====================

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.add('active');
}

// ==================== LOADING SCREEN ====================

function startLoading() {
  const bar = document.getElementById('loading-progress');
  const text = document.getElementById('loading-text');
  const steps = [
    [10, 'Loading hero data...'],
    [25, 'Initializing commanders...'],
    [40, 'Setting up game board...'],
    [60, 'Preparing GoGoCards...'],
    [75, 'Loading battle system...'],
    [90, 'Syncing synergy data...'],
    [100, 'Ready to play!']
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i >= steps.length) {
      clearInterval(interval);
      setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
          document.getElementById('loading-screen').style.display = 'none';
          showScreen('screen-menu');
          initMainMenu();
        }, 500);
      }, 300);
      return;
    }
    if (bar) bar.style.width = `${steps[i][0]}%`;
    if (text) text.textContent = steps[i][1];
    i++;
  }, 250);
}

// ==================== MAIN MENU ====================

function initMainMenu() {
  // Floating cards background
  createFloatingCards();

  // Buttons
  document.getElementById('btn-play').addEventListener('click', () => {
    showScreen('screen-commander');
    initCommanderSelect();
  });

  document.getElementById('btn-how-to-play').addEventListener('click', () => {
    showHowToPlay();
  });
}

function createFloatingCards() {
  const container = document.querySelector('.menu-floating-cards');
  if (!container) return;
  const emojis = ['🦸', '⭐', '🏹', '🔮', '⚔️', '🛡️', '🌸', '🔥', '💎', '🐯', '🤖', '👹'];

  for (let i = 0; i < 15; i++) {
    const card = document.createElement('div');
    card.className = 'floating-card';
    card.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
    card.style.left = `${Math.random() * 100}%`;
    card.style.animationDuration = `${8 + Math.random() * 12}s`;
    card.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(card);
  }
}

function showHowToPlay() {
  const overlay = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  const modalTitle = document.getElementById('modal-title');
  if (!overlay) return;

  modalTitle.textContent = '📖 How to Play Magic Chess GoGo';
  modalBody.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:16px;text-align:left;font-size:14px;line-height:1.6;">
      <div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:12px;padding:16px;">
        <div style="font-weight:700;color:var(--primary);margin-bottom:8px;">🎮 Game Overview</div>
        <p>Magic Chess GoGo is an auto-battler game. 8 players compete, buying and placing heroes on a board that fights automatically.</p>
      </div>
      <div style="background:rgba(129,140,248,0.08);border:1px solid rgba(129,140,248,0.2);border-radius:12px;padding:16px;">
        <div style="font-weight:700;color:var(--secondary);margin-bottom:8px;">🔄 Round Structure</div>
        <ul style="padding-left:20px;color:var(--text-secondary);">
          <li><b style="color:var(--text-primary);">Preparation (30s)</b> — Buy heroes, arrange your formation, use GoGoCards</li>
          <li><b style="color:var(--text-primary);">Battle (auto)</b> — Heroes fight automatically. Winner deals damage to loser.</li>
        </ul>
      </div>
      <div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:16px;">
        <div style="font-weight:700;color:#4ade80;margin-bottom:8px;">💰 Economy</div>
        <ul style="padding-left:20px;color:var(--text-secondary);">
          <li>Earn 5 gold per round + interest (1G per 10G saved, max 5G)</li>
          <li>Win/Loss streaks give bonus gold</li>
          <li>Spend 4 gold for +4 XP → Level up → Deploy more heroes</li>
          <li>Reroll shop for 2 gold</li>
        </ul>
      </div>
      <div style="background:rgba(192,132,252,0.08);border:1px solid rgba(192,132,252,0.2);border-radius:12px;padding:16px;">
        <div style="font-weight:700;color:#c084fc;margin-bottom:8px;">⭐ Hero Stars</div>
        <p style="color:var(--text-secondary);">Collect 3 copies of the same hero to upgrade to 2★ (doubled stats). Collect 3 copies of 2★ to get 3★ (4x stats)!</p>
      </div>
      <div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:12px;padding:16px;">
        <div style="font-weight:700;color:#38bdf8;margin-bottom:8px;">🔗 Synergies</div>
        <p style="color:var(--text-secondary);">Heroes share Race (Human, Elf, Orc...) and Class (Fighter, Mage, Assassin...) synergies. Combine matching heroes to activate powerful bonus effects!</p>
      </div>
    </div>
  `;
  overlay.classList.add('active');
}

// ==================== COMMANDER SELECT ====================

function initCommanderSelect() {
  const grid = document.getElementById('commander-grid');
  if (!grid) return;

  const commanders = Object.values(COMMANDER_DATA);
  grid.innerHTML = commanders.map((cmd, idx) => `
    <div class="commander-card ${cmd.id === lobbyState.selectedCommander ? 'selected' : ''}"
         data-id="${cmd.id}"
         style="--commander-gradient:${cmd.bgGradient};--commander-color:${cmd.color};--commander-glow:${cmd.color}40;animation-delay:${idx * 0.08}s"
         onclick="selectCommander('${cmd.id}')">
      <div class="commander-selected-badge">✓</div>
      <span class="commander-emoji" style="filter:drop-shadow(0 0 16px ${cmd.color})">${cmd.emoji}</span>
      <div class="commander-name">${cmd.name}</div>
      <div class="commander-passive-name" style="color:${cmd.color}">${cmd.passive.name}</div>
      <div class="commander-desc">${cmd.description}</div>
    </div>
  `).join('');

  updateCommanderPreview(lobbyState.selectedCommander);
}

window.selectCommander = function(commanderId) {
  lobbyState.selectedCommander = commanderId;
  document.querySelectorAll('.commander-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.id === commanderId);
  });
  updateCommanderPreview(commanderId);
};

function updateCommanderPreview(commanderId) {
  const cmd = COMMANDER_DATA[commanderId];
  if (!cmd) return;
  const preview = document.getElementById('commander-preview');
  if (!preview) return;

  preview.style.setProperty('--preview-color', cmd.color);
  preview.innerHTML = `
    <div class="commander-preview-left">
      <span class="commander-preview-emoji" style="filter:drop-shadow(0 0 20px ${cmd.color})">${cmd.emoji}</span>
      <div class="commander-preview-name" style="color:${cmd.color}">${cmd.name}</div>
      <div class="commander-preview-lore">"${cmd.lore}"</div>
      <div style="margin-top:16px;background:rgba(255,255,255,0.05);border-radius:10px;padding:12px;">
        <div style="font-family:var(--font-ui);font-size:11px;font-weight:700;color:${cmd.color};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Passive: ${cmd.passive.name}</div>
        <div style="font-size:12px;color:var(--text-secondary);">${cmd.passive.desc}</div>
      </div>
    </div>
    <div class="commander-preview-right">
      ${cmd.skills.map(sk => `
        <div class="skill-item">
          <span class="skill-icon">${sk.icon}</span>
          <div>
            <div class="skill-name">${sk.name}</div>
            <div class="skill-desc">${sk.desc}</div>
            <div class="skill-cd">Cooldown: ${sk.cooldown}s</div>
          </div>
        </div>
      `).join('')}
      <div class="skill-item skill-ultimate">
        <span class="skill-icon">${cmd.ultimate.icon}</span>
        <div>
          <div class="skill-name">⚡ ULTIMATE: ${cmd.ultimate.name}</div>
          <div class="skill-desc">${cmd.ultimate.desc}</div>
          <div class="skill-cd">Cooldown: ${cmd.ultimate.cooldown}s</div>
        </div>
      </div>
    </div>
  `;
}

// ==================== CARD SELECT ====================

function initCardSelect() {
  renderDeckOptions();
  renderChosenDeck();
}

function renderDeckOptions() {
  const container = document.getElementById('deck-options');
  if (!container) return;

  container.innerHTML = STARTER_DECKS.map((deck, i) => `
    <div class="deck-card ${i === lobbyState.selectedDeckIdx ? 'selected' : ''}"
         data-deck="${i}" onclick="selectDeck(${i})"
         style="animation-delay:${i * 0.1}s">
      <span class="deck-icon">${deck.icon}</span>
      <div class="deck-name">${deck.name}</div>
      <div class="deck-desc">${deck.description}</div>
      <div class="deck-cards-preview">
        ${deck.cards.map(id => `
          <div class="mini-card" title="${GOGOCARD_DATA[id]?.name || id}">
            ${GOGOCARD_DATA[id]?.icon || '🃏'}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

window.selectDeck = function(idx) {
  lobbyState.selectedDeckIdx = idx;
  lobbyState.customCards = null;
  document.querySelectorAll('.deck-card').forEach(c => {
    c.classList.toggle('selected', parseInt(c.dataset.deck) === idx);
  });
  renderChosenDeck();
};

function renderChosenDeck() {
  const container = document.getElementById('chosen-deck');
  if (!container) return;

  const cards = lobbyState.customCards || STARTER_DECKS[lobbyState.selectedDeckIdx]?.cards || [];
  container.innerHTML = Array(4).fill(null).map((_, i) => {
    const cardId = cards[i];
    const card = cardId ? GOGOCARD_DATA[cardId] : null;
    const rarityColor = card ? {
      common: '#94a3b8', rare: '#38bdf8', epic: '#c084fc', legendary: '#fbbf24'
    }[card.rarity] || '#94a3b8' : '';

    return `
      <div class="chosen-card-slot ${card ? 'filled' : ''}" style="--card-color:${rarityColor}">
        ${card ? `
          <div class="slot-icon">${card.icon}</div>
          <div class="slot-name">${card.name}</div>
          <div class="chosen-card-remove" onclick="removeChosenCard(${i})">✕</div>
        ` : `
          <span class="slot-empty-icon">🃏</span>
          <span class="slot-empty-text">Empty</span>
        `}
      </div>
    `;
  }).join('');
}

window.removeChosenCard = function(idx) {
  if (!lobbyState.customCards) {
    lobbyState.customCards = [...(STARTER_DECKS[lobbyState.selectedDeckIdx]?.cards || [])];
  }
  lobbyState.customCards.splice(idx, 1);
  document.querySelectorAll('.deck-card').forEach(c => c.classList.remove('selected'));
  renderChosenDeck();
};

// ==================== MATCHMAKING ====================

function startMatchmaking() {
  showScreen('screen-matchmaking');
  const playerSlots = document.querySelectorAll('.mm-player');
  const emojis = ['🗡️', '🐉', '❄️', '⚡', '🌌', '🩸', '⭐'];

  // Animate players finding
  let found = 1; // player is already "found"
  const interval = setInterval(() => {
    if (found >= 8) {
      clearInterval(interval);
      setTimeout(() => launchGame(), 800);
      return;
    }
    if (playerSlots[found]) {
      playerSlots[found].classList.add('found');
      playerSlots[found].textContent = emojis[found - 1] || '🤖';
    }
    found++;
  }, 300);
}

function launchGame() {
  // Save config to sessionStorage
  const config = {
    commanderId: lobbyState.selectedCommander,
    deckCards: lobbyState.customCards || STARTER_DECKS[lobbyState.selectedDeckIdx]?.cards || [],
    playerName: lobbyState.playerName
  };
  sessionStorage.setItem('mcgg_config', JSON.stringify(config));

  // Navigate to game
  window.location.href = 'game.html';
}

// ==================== MODAL HELPERS ====================

function initModals() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
    document.getElementById('modal-close')?.addEventListener('click', () => {
      overlay.classList.remove('active');
    });
  }
}

// ==================== NAV BUTTONS ====================

function initNavButtons() {
  // Commander screen → next
  document.getElementById('btn-next-commander')?.addEventListener('click', () => {
    showScreen('screen-cards');
    initCardSelect();
  });

  document.getElementById('btn-back-menu')?.addEventListener('click', () => {
    showScreen('screen-menu');
  });

  // Cards screen → matchmaking
  document.getElementById('btn-start-match')?.addEventListener('click', () => {
    const cards = lobbyState.customCards || STARTER_DECKS[lobbyState.selectedDeckIdx]?.cards || [];
    if (cards.length < 4) {
      alert('Please select 4 GoGoCards!');
      return;
    }
    startMatchmaking();
  });

  document.getElementById('btn-back-commander')?.addEventListener('click', () => {
    showScreen('screen-commander');
    initCommanderSelect();
  });
}

// ==================== BOOTSTRAP ====================

document.addEventListener('DOMContentLoaded', () => {
  initModals();
  initNavButtons();
  startLoading();
});
