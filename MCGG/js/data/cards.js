// ============================================================
// MAGIC CHESS GOGO - GOGOCARD DATA
// 30+ GoGoCards with unique effects
// ============================================================

const GOGOCARD_DATA = {
  // === GOLD CARDS ===
  golden_shovel: {
    id: 'golden_shovel', name: 'Golden Shovel', icon: '🔨',
    rarity: 'common', color: '#fbbf24',
    desc: 'Dapatkan +3 Gold saat ini.',
    type: 'economy',
    effect: (gameState) => { gameState.addGold(3); }
  },
  treasure_chest: {
    id: 'treasure_chest', name: 'Treasure Chest', icon: '💰',
    rarity: 'rare', color: '#f59e0b',
    desc: 'Dapatkan +6 Gold saat ini.',
    type: 'economy',
    effect: (gameState) => { gameState.addGold(6); }
  },
  gold_mine: {
    id: 'gold_mine', name: 'Gold Mine', icon: '⛏️',
    rarity: 'epic', color: '#d97706',
    desc: 'Dapatkan +10 Gold saat ini.',
    type: 'economy',
    effect: (gameState) => { gameState.addGold(10); }
  },
  interest_boost: {
    id: 'interest_boost', name: 'Interest Boost', icon: '📈',
    rarity: 'rare', color: '#10b981',
    desc: 'Tambah +2 Gold dari interest di ronde ini.',
    type: 'economy',
    effect: (gameState) => { gameState.interestBonus = (gameState.interestBonus || 0) + 2; }
  },

  // === XP CARDS ===
  xp_scroll: {
    id: 'xp_scroll', name: 'XP Scroll', icon: '📜',
    rarity: 'common', color: '#818cf8',
    desc: 'Dapatkan +2 XP saat ini.',
    type: 'xp',
    effect: (gameState) => { gameState.addXP(2); }
  },
  experience_potion: {
    id: 'experience_potion', name: 'Experience Potion', icon: '🧪',
    rarity: 'rare', color: '#a78bfa',
    desc: 'Dapatkan +4 XP saat ini.',
    type: 'xp',
    effect: (gameState) => { gameState.addXP(4); }
  },
  wisdom_tome: {
    id: 'wisdom_tome', name: 'Wisdom Tome', icon: '📚',
    rarity: 'epic', color: '#7c3aed',
    desc: 'Dapatkan +6 XP saat ini. Level naik lebih cepat!',
    type: 'xp',
    effect: (gameState) => { gameState.addXP(6); }
  },

  // === SHOP CARDS ===
  free_reroll: {
    id: 'free_reroll', name: 'Free Reroll', icon: '🎲',
    rarity: 'common', color: '#38bdf8',
    desc: 'Refresh shop gratis 1 kali.',
    type: 'shop',
    effect: (gameState) => { gameState.freeRerolls = (gameState.freeRerolls || 0) + 1; }
  },
  triple_reroll: {
    id: 'triple_reroll', name: 'Triple Reroll', icon: '🎯',
    rarity: 'rare', color: '#0ea5e9',
    desc: 'Refresh shop gratis 3 kali.',
    type: 'shop',
    effect: (gameState) => { gameState.freeRerolls = (gameState.freeRerolls || 0) + 3; }
  },
  lucky_shop: {
    id: 'lucky_shop', name: 'Lucky Shop', icon: '🍀',
    rarity: 'epic', color: '#4ade80',
    desc: 'Shop berikutnya menampilkan hero tier lebih tinggi.',
    type: 'shop',
    effect: (gameState) => { gameState.luckyShop = true; }
  },
  shop_freeze: {
    id: 'shop_freeze', name: 'Shop Freeze', icon: '❄️',
    rarity: 'rare', color: '#67e8f9',
    desc: 'Lock shop tanpa biaya sampai ronde berikutnya.',
    type: 'shop',
    effect: (gameState) => { gameState.shopLocked = true; }
  },

  // === BUFF CARDS ===
  battle_cry: {
    id: 'battle_cry', name: 'Battle Cry', icon: '⚔️',
    rarity: 'common', color: '#ef4444',
    desc: 'Semua hero mendapat +20% attack damage di ronde ini.',
    type: 'buff',
    duration: 1,
    effect: (gameState) => { gameState.roundBuffs.push({ type: 'allAtk', value: 0.2 }); }
  },
  iron_will: {
    id: 'iron_will', name: 'Iron Will', icon: '🛡️',
    rarity: 'common', color: '#94a3b8',
    desc: 'Semua hero mendapat +20% armor di ronde ini.',
    type: 'buff',
    duration: 1,
    effect: (gameState) => { gameState.roundBuffs.push({ type: 'allArmor', value: 0.2 }); }
  },
  magic_surge: {
    id: 'magic_surge', name: 'Magic Surge', icon: '🔮',
    rarity: 'rare', color: '#c084fc',
    desc: 'Semua Mage mendapat +35% magic power di ronde ini.',
    type: 'buff',
    duration: 1,
    effect: (gameState) => { gameState.roundBuffs.push({ type: 'mageAtk', value: 0.35 }); }
  },
  swift_boots_card: {
    id: 'swift_boots_card', name: 'Swift Boots', icon: '👟',
    rarity: 'rare', color: '#86efac',
    desc: 'Semua hero mendapat +30% movement speed di ronde ini.',
    type: 'buff',
    duration: 1,
    effect: (gameState) => { gameState.roundBuffs.push({ type: 'allSpeed', value: 0.3 }); }
  },

  // === HERO CARDS ===
  hero_summon: {
    id: 'hero_summon', name: 'Hero Summon', icon: '🦸',
    rarity: 'rare', color: '#fbbf24',
    desc: 'Dapatkan 1 hero acak dari tier B1-B2.',
    type: 'hero',
    effect: (gameState) => { gameState.giveRandomHero([1, 2]); }
  },
  star_hero: {
    id: 'star_hero', name: 'Star Hero', icon: '⭐',
    rarity: 'epic', color: '#facc15',
    desc: 'Pilih 1 hero di board dan naikkan ke 2★.',
    type: 'hero',
    effect: (gameState) => { gameState.pendingStarUp = true; }
  },
  hero_copy: {
    id: 'hero_copy', name: 'Hero Copy', icon: '📋',
    rarity: 'epic', color: '#f59e0b',
    desc: 'Dapatkan salinan hero 1★ acak yang sudah kamu miliki.',
    type: 'hero',
    effect: (gameState) => { gameState.copyRandomHero(); }
  },

  // === SPECIAL CARDS ===
  round_skip: {
    id: 'round_skip', name: 'Round Skip', icon: '⏭️',
    rarity: 'legendary', color: '#e879f9',
    desc: 'Skip battle ronde ini (tidak ada pertempuran, tidak ada damage).',
    type: 'special',
    effect: (gameState) => { gameState.skipBattle = true; }
  },
  hp_restore: {
    id: 'hp_restore', name: 'HP Restore', icon: '❤️',
    rarity: 'rare', color: '#f43f5e',
    desc: 'Pulihkan 10 HP pemain.',
    type: 'special',
    effect: (gameState) => { gameState.player.hp = Math.min(100, gameState.player.hp + 10); }
  },
  synergy_boost: {
    id: 'synergy_boost', name: 'Synergy Boost', icon: '🔗',
    rarity: 'epic', color: '#34d399',
    desc: 'Aktifkan satu synergy tier berikutnya tanpa hero tambahan di ronde ini.',
    type: 'special',
    effect: (gameState) => { gameState.synergyBoost = true; }
  },
  item_chest: {
    id: 'item_chest', name: 'Item Chest', icon: '📦',
    rarity: 'rare', color: '#fb923c',
    desc: 'Dapatkan 1 item acak.',
    type: 'item',
    effect: (gameState) => { gameState.giveRandomItem(); }
  },
  upgrade_item: {
    id: 'upgrade_item', name: 'Upgrade Item', icon: '⬆️',
    rarity: 'epic', color: '#fbbf24',
    desc: 'Upgrade 1 item di hero menjadi versi lebih kuat.',
    type: 'item',
    effect: (gameState) => { gameState.pendingItemUpgrade = true; }
  },

  // === COMMANDER CARDS ===
  commander_boost: {
    id: 'commander_boost', name: 'Commander Boost', icon: '👑',
    rarity: 'epic', color: '#fbbf24',
    desc: 'Commander skill cooldown -50% di ronde ini.',
    type: 'commander',
    effect: (gameState) => { gameState.commanderCooldownReduction = 0.5; }
  },
  ultimate_charge: {
    id: 'ultimate_charge', name: 'Ultimate Charge', icon: '💥',
    rarity: 'legendary', color: '#e879f9',
    desc: 'Commander ultimate siap digunakan di awal ronde ini.',
    type: 'commander',
    effect: (gameState) => { gameState.commanderUltReady = true; }
  }
};

// Card pool by rarity
const CARD_RARITY_WEIGHTS = {
  common: 40,
  rare: 35,
  epic: 20,
  legendary: 5
};

// Starting deck options (player chooses 4 cards from 3 sets)
const STARTER_DECKS = [
  {
    name: 'Economy Master',
    description: 'Fokus gold dan XP untuk build yang kuat di late game',
    cards: ['golden_shovel', 'interest_boost', 'xp_scroll', 'free_reroll'],
    icon: '💰'
  },
  {
    name: 'Battle Ready',
    description: 'Buff tempur untuk menang di ronde awal dengan kuat',
    cards: ['battle_cry', 'iron_will', 'hero_summon', 'hp_restore'],
    icon: '⚔️'
  },
  {
    name: 'Shop Wizard',
    description: 'Kontrol shop untuk mendapatkan hero sempurna',
    cards: ['triple_reroll', 'lucky_shop', 'experience_potion', 'hero_summon'],
    icon: '🎲'
  },
  {
    name: 'Synergy Builder',
    description: 'Bangun synergy kuat dengan cepat',
    cards: ['synergy_boost', 'hero_copy', 'xp_scroll', 'free_reroll'],
    icon: '🔗'
  },
  {
    name: 'Commander Power',
    description: 'Andalkan kekuatan Commander untuk turn the tide',
    cards: ['commander_boost', 'ultimate_charge', 'hp_restore', 'battle_cry'],
    icon: '👑'
  }
];

export { GOGOCARD_DATA, CARD_RARITY_WEIGHTS, STARTER_DECKS };
