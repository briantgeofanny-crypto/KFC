// ============================================================
// MAGIC CHESS GOGO - SYNERGY DATA
// Race and Class synergies with tier bonuses
// ============================================================

const SYNERGY_DATA = {
  // ==================== RACE SYNERGIES ====================
  human: {
    id: 'human', name: 'Human', type: 'race', icon: '🧑', color: '#93c5fd',
    description: 'Manusia yang berani dan tangguh.',
    tiers: [
      { count: 2, name: 'Human Unity', desc: '+8% damage untuk semua Human hero.', bonus: { allAtk: 0.08 } },
      { count: 4, name: 'Human Pride', desc: '+18% damage dan +10% armor untuk Human hero.', bonus: { allAtk: 0.18, armor: 0.10 } },
      { count: 6, name: 'Human Supremacy', desc: '+30% damage, +20% armor, +15% HP untuk Human hero.', bonus: { allAtk: 0.30, armor: 0.20, hp: 0.15 } },
      { count: 8, name: 'Human Legend', desc: '+50% semua stats untuk Human hero. Revive sekali dengan 30% HP.', bonus: { allAtk: 0.50, armor: 0.35, hp: 0.30, revive: true } }
    ]
  },
  elf: {
    id: 'elf', name: 'Elf', type: 'race', icon: '🌿', color: '#86efac',
    description: 'Elf dengan kecepatan dan keanggunan tak tertandingi.',
    tiers: [
      { count: 2, name: 'Elf Grace', desc: '+15% attack speed untuk Elf hero.', bonus: { atkSpeed: 0.15 } },
      { count: 4, name: 'Elf Agility', desc: '+30% attack speed dan +10% dodge untuk Elf hero.', bonus: { atkSpeed: 0.30, dodge: 0.10 } },
      { count: 6, name: 'Elf Mastery', desc: '+50% attack speed, +20% dodge, +20% damage untuk Elf hero.', bonus: { atkSpeed: 0.50, dodge: 0.20, allAtk: 0.20 } }
    ]
  },
  orc: {
    id: 'orc', name: 'Orc', type: 'race', icon: '👹', color: '#4ade80',
    description: 'Orc yang brutal dengan kekuatan fisik luar biasa.',
    tiers: [
      { count: 2, name: 'Orc Strength', desc: '+15% physical attack dan +5% HP untuk Orc hero.', bonus: { physAtk: 0.15, hp: 0.05 } },
      { count: 4, name: 'Orc Rage', desc: '+30% physical attack dan +15% HP untuk Orc hero.', bonus: { physAtk: 0.30, hp: 0.15 } },
      { count: 6, name: 'Orc Warlord', desc: '+50% physical attack, +30% HP, dan Orc immune CC selama 2 detik pertama battle.', bonus: { physAtk: 0.50, hp: 0.30, ccImmune: 2 } }
    ]
  },
  abyss: {
    id: 'abyss', name: 'Abyss', type: 'race', icon: '😈', color: '#7c3aed',
    description: 'Makhluk kegelapan dengan kekuatan abysm yang menakutkan.',
    tiers: [
      { count: 2, name: 'Abyss Touch', desc: 'Semua Abyss hero drain 15% HP musuh yang diserang.', bonus: { lifesteal: 0.15 } },
      { count: 4, name: 'Abyss Power', desc: '+25% magic damage dan lifesteal 25% untuk Abyss hero.', bonus: { magicAtk: 0.25, lifesteal: 0.25 } },
      { count: 6, name: 'Abyss Domination', desc: '+40% semua damage, lifesteal 40%, dan reduce enemy magic resist 20%.', bonus: { allAtk: 0.40, lifesteal: 0.40, magicPen: 0.20 } }
    ]
  },
  beast: {
    id: 'beast', name: 'Beast', type: 'race', icon: '🐯', color: '#fb923c',
    description: 'Makhluk liar dengan naluri bertarung yang tajam.',
    tiers: [
      { count: 2, name: 'Beast Instinct', desc: '+10% critical chance untuk semua Beast hero.', bonus: { critChance: 0.10 } },
      { count: 4, name: 'Beast Frenzy', desc: '+25% critical chance dan +25% critical damage untuk Beast hero.', bonus: { critChance: 0.25, critDmg: 0.25 } },
      { count: 6, name: 'Beast King', desc: '+40% crit chance, +50% crit damage, dan +20% attack speed.', bonus: { critChance: 0.40, critDmg: 0.50, atkSpeed: 0.20 } }
    ]
  },
  mech: {
    id: 'mech', name: 'Mech', type: 'race', icon: '🤖', color: '#22d3ee',
    description: 'Mesin perang dengan armor super tebal.',
    tiers: [
      { count: 2, name: 'Mech Shield', desc: '+150 shield untuk semua Mech hero di awal battle.', bonus: { shield: 150 } },
      { count: 4, name: 'Mech Fortress', desc: '+350 shield dan +20% armor untuk Mech hero.', bonus: { shield: 350, armor: 0.20 } },
      { count: 6, name: 'Mech Overlord', desc: '+600 shield, +35% armor, dan skill damage +30%.', bonus: { shield: 600, armor: 0.35, skillDmg: 0.30 } }
    ]
  },
  undead: {
    id: 'undead', name: 'Undead', type: 'race', icon: '💀', color: '#6b7280',
    description: 'Makhluk tak mati yang bangkit dari kegelapan.',
    tiers: [
      { count: 2, name: 'Undead Curse', desc: 'Musuh yang diserang Undead mendapat -10% armor.', bonus: { armorShred: 0.10 } },
      { count: 4, name: 'Undead Plague', desc: '-20% armor untuk semua musuh. Undead hero regenerasi 100 HP/detik.', bonus: { armorShred: 0.20, regen: 100 } },
      { count: 6, name: 'Undead Legion', desc: '-35% armor semua musuh. Regen 200 HP/detik. Revive dengan 20% HP.', bonus: { armorShred: 0.35, regen: 200, revive: true } }
    ]
  },
  crystal: {
    id: 'crystal', name: 'Crystal', type: 'race', icon: '💎', color: '#67e8f9',
    description: 'Makhluk kristal dengan kemampuan defensif unik.',
    tiers: [
      { count: 2, name: 'Crystal Armor', desc: 'Crystal hero mendapatkan shield 200 setiap kali skill digunakan.', bonus: { onSkillShield: 200 } },
      { count: 4, name: 'Crystal Power', desc: 'Shield 400 saat skill. +15% skill damage untuk Crystal hero.', bonus: { onSkillShield: 400, skillDmg: 0.15 } }
    ]
  },

  // ==================== CLASS SYNERGIES ====================
  fighter: {
    id: 'fighter', name: 'Fighter', type: 'class', icon: '👊', color: '#f97316',
    description: 'Pejuang garis depan yang kuat dan tangguh.',
    tiers: [
      { count: 2, name: 'Fighter Spirit', desc: '+15% physical attack untuk semua Fighter.', bonus: { physAtk: 0.15 } },
      { count: 4, name: 'Fighter Resolve', desc: '+30% physical attack dan +20% HP untuk Fighter.', bonus: { physAtk: 0.30, hp: 0.20 } },
      { count: 6, name: 'Fighter Domination', desc: '+50% physical attack, +35% HP, dan lifesteal 20%.', bonus: { physAtk: 0.50, hp: 0.35, lifesteal: 0.20 } }
    ]
  },
  mage: {
    id: 'mage', name: 'Mage', type: 'class', icon: '🔮', color: '#a78bfa',
    description: 'Penyihir dengan kekuatan magic yang dahsyat.',
    tiers: [
      { count: 2, name: 'Mage Focus', desc: '+15% magic power untuk semua Mage.', bonus: { magicAtk: 0.15 } },
      { count: 4, name: 'Mage Mastery', desc: '+30% magic power dan +20% magic penetration.', bonus: { magicAtk: 0.30, magicPen: 0.20 } },
      { count: 6, name: 'Arcane Supremacy', desc: '+50% magic power, +35% magic pen, dan spell vamp 25%.', bonus: { magicAtk: 0.50, magicPen: 0.35, lifesteal: 0.25 } }
    ]
  },
  marksman: {
    id: 'marksman', name: 'Marksman', type: 'class', icon: '🏹', color: '#fbbf24',
    description: 'Penembak jitu yang memberikan DPS tinggi dari jarak jauh.',
    tiers: [
      { count: 2, name: 'Marksman Focus', desc: '+15% attack speed dan +10% physical attack untuk Marksman.', bonus: { atkSpeed: 0.15, physAtk: 0.10 } },
      { count: 4, name: 'Marksman Mastery', desc: '+30% attack speed dan +25% physical attack.', bonus: { atkSpeed: 0.30, physAtk: 0.25 } },
      { count: 6, name: 'Dead Eye', desc: '+50% attack speed, +40% physical attack, armor penetration 30%.', bonus: { atkSpeed: 0.50, physAtk: 0.40, armorPen: 0.30 } }
    ]
  },
  assassin: {
    id: 'assassin', name: 'Assassin', type: 'class', icon: '🗡️', color: '#475569',
    description: 'Pembunuh senyap yang menyerang target lemah dengan mematikan.',
    tiers: [
      { count: 2, name: 'Assassin Mark', desc: '+20% critical chance untuk Assassin.', bonus: { critChance: 0.20 } },
      { count: 4, name: 'Assassin Execution', desc: '+40% crit chance dan +50% crit damage.', bonus: { critChance: 0.40, critDmg: 0.50 } },
      { count: 6, name: 'Shadow Master', desc: '+60% crit chance, +100% crit damage, dan burst damage +30%.', bonus: { critChance: 0.60, critDmg: 1.0, burstDmg: 0.30 } }
    ]
  },
  tank: {
    id: 'tank', name: 'Tank', type: 'class', icon: '🛡️', color: '#0ea5e9',
    description: 'Garis depan yang menyerap damage untuk tim.',
    tiers: [
      { count: 2, name: 'Tank Barrier', desc: '+25% armor untuk semua Tank.', bonus: { armor: 0.25 } },
      { count: 4, name: 'Tank Wall', desc: '+50% armor dan +25% HP untuk Tank.', bonus: { armor: 0.50, hp: 0.25 } },
      { count: 6, name: 'Fortress', desc: '+80% armor, +40% HP, dan pantulkan 20% damage ke attacker.', bonus: { armor: 0.80, hp: 0.40, reflect: 0.20 } }
    ]
  },
  support: {
    id: 'support', name: 'Support', type: 'class', icon: '💊', color: '#34d399',
    description: 'Penyokong tim yang memberikan heal dan buff.',
    tiers: [
      { count: 2, name: 'Support Aura', desc: 'Support hero heal semua ally 100 HP setiap 5 detik.', bonus: { teamRegen: 100 } },
      { count: 4, name: 'Support Mastery', desc: 'Heal 200 HP per 5 detik dan +15% semua ally stats.', bonus: { teamRegen: 200, teamStats: 0.15 } },
      { count: 6, name: 'Divine Support', desc: 'Heal 350 HP per 5 detik, +25% ally stats, dan CC duration -30%.', bonus: { teamRegen: 350, teamStats: 0.25, ccReduce: 0.30 } }
    ]
  }
};

export { SYNERGY_DATA };
