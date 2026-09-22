/**
 * ============================================================================
 * SLAY THE SPIRE - MASTER POTIONS ENCYCLOPEDIA & USAGE SYSTEM
 * ============================================================================
 * Koleksi ramuan tempur dengan efek instan untuk pertempuran di Spire.
 */

const POTION_DATABASE = {
  fire_potion: {
    id: 'fire_potion',
    name: 'Fire Potion',
    icon: '🧪🔥',
    color: '#ff4d4d',
    target: 'ENEMY',
    description: 'Deal 20 damage to target enemy.',
    use(combat, target) {
      if (!target) return false;
      combat.dealDamageToEnemy(target, 20);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('fire_burst', target);
      return true;
    }
  },

  block_potion: {
    id: 'block_potion',
    name: 'Block Potion',
    icon: '🧪🛡️',
    color: '#4dabf7',
    target: 'SELF',
    description: 'Gain 12 Block.',
    use(combat) {
      combat.gainPlayerBlock(12);
      if (window.spireAudio) window.spireAudio.playBlock();
      combat.triggerVfx('shield', 'player');
      return true;
    }
  },

  strength_potion: {
    id: 'strength_potion',
    name: 'Strength Potion',
    icon: '🧪💪',
    color: '#ff922b',
    target: 'SELF',
    description: 'Gain 2 Strength.',
    use(combat) {
      combat.applyPlayerStatus('strength', 2);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
      return true;
    }
  },

  dexterity_potion: {
    id: 'dexterity_potion',
    name: 'Dexterity Potion',
    icon: '🧪🥾',
    color: '#51cf66',
    target: 'SELF',
    description: 'Gain 2 Dexterity.',
    use(combat) {
      combat.applyPlayerStatus('dexterity', 2);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
      return true;
    }
  },

  energy_potion: {
    id: 'energy_potion',
    name: 'Energy Potion',
    icon: '🧪⚡',
    color: '#ffd43b',
    target: 'SELF',
    description: 'Gain 2 Energy.',
    use(combat) {
      combat.energy += 2;
      combat.showCombatText('+2 Energy!', 'player', '#ffd43b');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      return true;
    }
  },

  fear_potion: {
    id: 'fear_potion',
    name: 'Fear Potion',
    icon: '🧪😱',
    color: '#f03e3e',
    target: 'ENEMY',
    description: 'Apply 3 Vulnerable to target enemy.',
    use(combat, target) {
      if (!target) return false;
      combat.applyEnemyStatus(target, 'vulnerable', 3);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('impact', target);
      return true;
    }
  },

  explosive_potion: {
    id: 'explosive_potion',
    name: 'Explosive Potion',
    icon: '🧪💣',
    color: '#d9480f',
    target: 'ALL_ENEMIES',
    description: 'Deal 10 damage to ALL enemies.',
    use(combat) {
      combat.dealDamageToAllEnemies(10);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('shockwave_ring', 'all');
      return true;
    }
  },

  swift_potion: {
    id: 'swift_potion',
    name: 'Swift Potion',
    icon: '🧪⚡',
    color: '#339af0',
    target: 'SELF',
    description: 'Draw 3 cards.',
    use(combat) {
      combat.drawCards(3);
      if (window.spireAudio) window.spireAudio.playCardDraw();
      return true;
    }
  },

  blood_potion: {
    id: 'blood_potion',
    name: 'Blood Potion',
    icon: '🧪🩸',
    color: '#c92a2a',
    target: 'SELF',
    description: 'Heal 20% of your Max HP.',
    use(combat) {
      const healAmt = Math.floor(window.gameState.player.maxHp * 0.2);
      combat.healPlayer(healAmt);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('heal_sparkle', 'player');
      return true;
    }
  },

  fairy_potion: {
    id: 'fairy_potion',
    name: 'Fairy in a Bottle',
    icon: '🧚🍾',
    color: '#f06595',
    target: 'PASSIVE',
    description: 'When you would die, heal to 30% of your Max HP instead and discard this potion.',
    use() {
      return false;
    }
  }
};

class Potion {
  constructor(def) {
    this.id = def.id;
    this.name = def.name;
    this.icon = def.icon;
    this.color = def.color;
    this.target = def.target;
    this.description = def.description;
    this.baseDef = def;
  }

  use(combat, target = null) {
    if (window.spireAudio) window.spireAudio.playPotion();
    return this.baseDef.use(combat, target);
  }
}

function getRandomPotion() {
  const pool = Object.values(POTION_DATABASE);
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return new Potion(picked);
}

window.POTION_DATABASE = POTION_DATABASE;
window.Potion = Potion;
window.getRandomPotion = getRandomPotion;
