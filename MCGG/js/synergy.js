// ============================================================
// MAGIC CHESS GOGO - SYNERGY SYSTEM
// Calculate and apply race/class bonuses
// ============================================================

import { SYNERGY_DATA } from './data/synergies.js';

export class SynergySystem {
  constructor(game) {
    this.game = game;
    this.activeSynergies = {}; // { synergyId: { count, tier, bonus } }
  }

  // ==================== CALCULATION ====================

  calculate(boardHeroes) {
    const counts = {}; // { synergyId: count }

    for (const hero of boardHeroes) {
      const tags = [...hero.race, ...hero.class];
      for (const tag of tags) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }

    this.activeSynergies = {};

    for (const [synergyId, count] of Object.entries(counts)) {
      const synData = SYNERGY_DATA[synergyId];
      if (!synData) continue;

      // Find highest active tier
      let activeTier = null;
      for (const tier of [...synData.tiers].reverse()) {
        if (count >= tier.count) {
          activeTier = { ...tier, currentCount: count };
          break;
        }
      }

      this.activeSynergies[synergyId] = {
        count,
        data: synData,
        activeTier,
        isActive: activeTier !== null,
        nextTier: synData.tiers.find(t => t.count > count) || null
      };
    }

    this.render();
    return this.activeSynergies;
  }

  // ==================== APPLY BONUSES ====================

  applyBonuses(boardHeroes) {
    // First reset all heroes' stats to base
    boardHeroes.forEach(h => {
      h.applyItems(); // reset will be called before this
    });

    for (const [synergyId, synState] of Object.entries(this.activeSynergies)) {
      if (!synState.isActive || !synState.activeTier) continue;

      const bonus = synState.activeTier.bonus;
      const synData = synState.data;

      for (const hero of boardHeroes) {
        const hasSynergy = hero.race.includes(synergyId) || hero.class.includes(synergyId);
        if (!hasSynergy) continue;

        hero.applyBonus(bonus);

        // Special bonuses
        if (bonus.ccImmune) {
          hero.applyBuff('ccImmune', bonus.ccImmune, 999);
        }
        if (bonus.teamRegen) {
          // Applied as periodic heal during battle
          hero._synergyRegen = (hero._synergyRegen || 0) + bonus.teamRegen;
        }
      }

      // Team-wide bonuses (support)
      if (bonus.teamStats) {
        boardHeroes.forEach(h => h.applyBonus({ allAtk: bonus.teamStats, hp: bonus.teamStats }));
      }
    }
  }

  // ==================== RENDER ====================

  render() {
    const container = document.getElementById('synergy-list');
    if (!container) return;

    const entries = Object.entries(this.activeSynergies)
      .sort((a, b) => {
        if (a[1].isActive && !b[1].isActive) return -1;
        if (!a[1].isActive && b[1].isActive) return 1;
        return b[1].count - a[1].count;
      })
      .filter(([, s]) => s.count > 0);

    if (entries.length === 0) {
      container.innerHTML = '<div style="color:var(--text-muted);font-size:12px;text-align:center;padding:16px;">Place heroes on board to see synergies</div>';
      return;
    }

    container.innerHTML = entries.map(([id, syn]) => {
      const data = syn.data;
      const isActive = syn.isActive;
      const color = data.color;
      const glow = color + '40';
      const bg = color + '10';

      // Build pip indicators
      const pips = data.tiers.map(tier => {
        const filled = syn.count >= tier.count;
        return `<div class="syn-pip ${filled ? 'filled' : ''}" style="${filled ? `background:${color}` : ''}"></div>`;
      }).join('');

      return `
        <div class="synergy-item ${isActive ? 'active' : ''}"
             style="--syn-color:${color};--syn-glow:${glow};--syn-bg:${bg}"
             data-synergy="${id}"
             title="${isActive ? syn.activeTier?.desc : `Need ${syn.nextTier?.count || '?'} for bonus`}">
          <span class="syn-icon">${data.icon}</span>
          <span class="syn-name">${data.name}</span>
          <span class="syn-count">${syn.count}</span>
          <div class="syn-progress">${pips}</div>
        </div>
      `;
    }).join('');

    // Add click handlers for tooltip
    container.querySelectorAll('.synergy-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.synergy;
        const syn = this.activeSynergies[id];
        if (syn) this.showSynergyDetail(syn);
      });
    });
  }

  showSynergyDetail(syn) {
    const data = syn.data;
    const tiers = data.tiers.map(t => `
      <div style="display:flex;align-items:center;gap:8px;padding:8px;background:${syn.count >= t.count ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)'};border-radius:8px;margin-bottom:4px;">
        <span style="color:${data.color};font-weight:700;min-width:24px;">${t.count}</span>
        <div>
          <div style="font-weight:700;color:${syn.count >= t.count ? '#4ade80' : 'var(--text-secondary)'};">${t.name}</div>
          <div style="font-size:12px;color:var(--text-muted);">${t.desc}</div>
        </div>
      </div>
    `).join('');

    this.game.showModal(`
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <span style="font-size:40px;">${data.icon}</span>
        <div>
          <div style="font-family:var(--font-display);font-size:22px;font-weight:700;color:${data.color}">${data.name}</div>
          <div style="color:var(--text-secondary);font-size:13px;">${data.description}</div>
        </div>
      </div>
      <div>${tiers}</div>
      <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">Current: ${syn.count} ${data.name} heroes on board</div>
    `, data.name + ' Synergy');
  }

  getActiveBonus(synergyId) {
    return this.activeSynergies[synergyId]?.activeTier?.bonus || null;
  }

  getSynergyCount(synergyId) {
    return this.activeSynergies[synergyId]?.count || 0;
  }
}
