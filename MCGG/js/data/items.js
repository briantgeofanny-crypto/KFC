// ============================================================
// MAGIC CHESS GOGO - ITEM DATA
// Complete item system with combination recipes
// ============================================================

const BASE_ITEMS = {
  // Row 1: Attack items
  sword: { id: 'sword', name: 'Sword', icon: '⚔️', color: '#ef4444', type: 'atk', bonus: { physAtk: 15 }, desc: '+15 Physical Attack' },
  bow: { id: 'bow', name: 'Recurve Bow', icon: '🏹', color: '#f97316', type: 'atkspeed', bonus: { atkSpeed: 0.15 }, desc: '+15% Attack Speed' },
  wand: { id: 'wand', name: 'Magic Wand', icon: '🪄', color: '#818cf8', type: 'magic', bonus: { magicAtk: 15 }, desc: '+15 Magic Power' },
  // Row 2: Defense items
  shield_item: { id: 'shield_item', name: 'Shield', icon: '🛡️', color: '#0ea5e9', type: 'armor', bonus: { armor: 15 }, desc: '+15 Armor' },
  cloak: { id: 'cloak', name: 'Mystic Cloak', icon: '🧥', color: '#a78bfa', type: 'magicres', bonus: { magicRes: 15 }, desc: '+15 Magic Resistance' },
  heart: { id: 'heart', name: 'Ruby', icon: '❤️', color: '#f43f5e', type: 'hp', bonus: { hp: 150 }, desc: '+150 HP' },
  // Row 3: Utility items
  belt: { id: 'belt', name: 'Belt', icon: '🎗️', color: '#4ade80', type: 'utility', bonus: { hp: 100, armor: 5 }, desc: '+100 HP +5 Armor' },
  knife: { id: 'knife', name: 'Short Sword', icon: '🔪', color: '#94a3b8', type: 'crit', bonus: { critChance: 0.1 }, desc: '+10% Critical Chance' },
  tome: { id: 'tome', name: 'Ancient Tome', icon: '📖', color: '#d4a017', type: 'magic', bonus: { magicAtk: 10, magicPen: 0.05 }, desc: '+10 Magic Power +5% Penetration' }
};

const COMBINED_ITEMS = {
  // ===== SWORD + x =====
  infinity_blade: {
    id: 'infinity_blade', name: 'Blade of Despair', icon: '⚡', color: '#fbbf24',
    recipe: ['sword', 'sword'], tier: 'tier2',
    bonus: { physAtk: 45, critDmg: 0.25 },
    desc: '+45 Phys Attack +25% Crit DMG',
    passive: 'Damage +20% vs musuh dengan HP < 50%'
  },
  endless_battle: {
    id: 'endless_battle', name: 'Endless Battle', icon: '♾️', color: '#f59e0b',
    recipe: ['sword', 'heart'], tier: 'tier2',
    bonus: { physAtk: 30, hp: 300, lifesteal: 0.15 },
    desc: '+30 Atk +300 HP +15% Lifesteal',
    passive: 'Basic attack deal true damage = 60% magic power'
  },
  berserkers_fury: {
    id: 'berserkers_fury', name: 'Berserker\'s Fury', icon: '💥', color: '#dc2626',
    recipe: ['sword', 'knife'], tier: 'tier2',
    bonus: { physAtk: 25, critChance: 0.20, critDmg: 0.40 },
    desc: '+25 Atk +20% Crit +40% Crit DMG',
    passive: 'Setelah crit, +8% crit chance (stack max 10)'
  },
  windtalker: {
    id: 'windtalker', name: 'Windtalker', icon: '💨', color: '#38bdf8',
    recipe: ['sword', 'bow'], tier: 'tier2',
    bonus: { physAtk: 20, atkSpeed: 0.20, critChance: 0.15 },
    desc: '+20 Atk +20% Atk Speed +15% Crit',
    passive: 'Setiap 3 serangan, tambah 200 magic damage'
  },

  // ===== BOW + x =====
  golden_staff: {
    id: 'golden_staff', name: 'Golden Staff', icon: '🌟', color: '#facc15',
    recipe: ['bow', 'bow'], tier: 'tier2',
    bonus: { atkSpeed: 0.40, critChance: 0.10 },
    desc: '+40% Atk Speed +10% Crit',
    passive: 'Basic attack critical = 2x serangan'
  },
  corrosion_scythe: {
    id: 'corrosion_scythe', name: 'Corrosion Scythe', icon: '⚙️', color: '#6b7280',
    recipe: ['bow', 'shield_item'], tier: 'tier2',
    bonus: { atkSpeed: 0.25, armor: 20 },
    desc: '+25% Atk Speed +20 Armor',
    passive: 'Setiap hit, slow musuh 6% (stack 8x)'
  },

  // ===== WAND + x =====
  arcane_boots_item: {
    id: 'arcane_boots_item', name: 'Holy Crystal', icon: '🔮', color: '#c084fc',
    recipe: ['wand', 'wand'], tier: 'tier2',
    bonus: { magicAtk: 45, magicPen: 0.15 },
    desc: '+45 Magic Power +15% Magic Pen',
    passive: '+25% magic power from passive effects'
  },
  glowing_wand: {
    id: 'glowing_wand', name: 'Glowing Wand', icon: '✨', color: '#f9a8d4',
    recipe: ['wand', 'heart'], tier: 'tier2',
    bonus: { magicAtk: 30, hp: 300 },
    desc: '+30 Magic Power +300 HP',
    passive: 'Magic damage burn musuh 2% max HP per detik 3 detik'
  },
  divine_glaive: {
    id: 'divine_glaive', name: 'Divine Glaive', icon: '🗡️', color: '#6366f1',
    recipe: ['wand', 'cloak'], tier: 'tier2',
    bonus: { magicAtk: 25, magicPen: 0.35 },
    desc: '+25 Magic Power +35% Magic Pen',
    passive: 'Magic penetration +5% per 10% enemy magic resist'
  },

  // ===== DEFENSE COMBOS =====
  dominance_ice: {
    id: 'dominance_ice', name: 'Dominance Ice', icon: '❄️', color: '#67e8f9',
    recipe: ['shield_item', 'shield_item'], tier: 'tier2',
    bonus: { armor: 40, manaRegen: 20 },
    desc: '+40 Armor',
    passive: 'Kurangi attack speed musuh sekitar 10%'
  },
  twilight_armor: {
    id: 'twilight_armor', name: 'Twilight Armor', icon: '🌅', color: '#fb923c',
    recipe: ['shield_item', 'cloak'], tier: 'tier2',
    bonus: { armor: 20, magicRes: 20, hp: 200 },
    desc: '+20 Armor +20 Magic Res +200 HP',
    passive: 'Kurangi damage satu kali maksimum 900'
  },
  oracle: {
    id: 'oracle', name: 'Oracle', icon: '🌙', color: '#818cf8',
    recipe: ['cloak', 'cloak'], tier: 'tier2',
    bonus: { magicRes: 40, heal: 0.3 },
    desc: '+40 Magic Res',
    passive: 'Shield dan heal effect +30%'
  },
  immortality: {
    id: 'immortality', name: 'Immortality', icon: '💫', color: '#e879f9',
    recipe: ['shield_item', 'heart'], tier: 'tier2',
    bonus: { armor: 15, hp: 400 },
    desc: '+15 Armor +400 HP',
    passive: 'Revive sekali dengan 15% HP + 1000 shield (cooldown 3 menit)'
  },
  cursed_helmet: {
    id: 'cursed_helmet', name: 'Cursed Helmet', icon: '🪖', color: '#dc2626',
    recipe: ['cloak', 'heart'], tier: 'tier2',
    bonus: { magicRes: 20, hp: 400 },
    desc: '+20 Magic Res +400 HP',
    passive: 'Pantulkan 10% magic damage ke semua musuh sekitar'
  },

  // ===== HP COMBOS =====
  bloodlust_axe: {
    id: 'bloodlust_axe', name: 'Bloodlust Axe', icon: '🩸', color: '#dc2626',
    recipe: ['heart', 'sword'], tier: 'tier2',
    bonus: { hp: 200, physAtk: 20, lifesteal: 0.20 },
    desc: '+200 HP +20 Atk +20% Lifesteal',
    passive: 'Skill damage lifesteal 20%'
  },
  blade_armor: {
    id: 'blade_armor', name: 'Blade Armor', icon: '🔰', color: '#4ade80',
    recipe: ['shield_item', 'knife'], tier: 'tier2',
    bonus: { armor: 25, critChance: 0.10 },
    desc: '+25 Armor +10% Crit',
    passive: 'Pantulkan 25% physical damage ke attacker'
  }
};

// All items combined
const ITEM_DATA = { ...BASE_ITEMS, ...COMBINED_ITEMS };

export { BASE_ITEMS, COMBINED_ITEMS, ITEM_DATA };
