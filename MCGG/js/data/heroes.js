// ============================================================
// MAGIC CHESS GOGO - HERO DATA
// All heroes B1-B5 with full stats, synergies, and skills
// ============================================================

const HERO_DATA = {
  // ==================== TIER B1 (Cost 1) ====================
  layla: {
    id: 'layla', name: 'Layla', cost: 1, tier: 'B1',
    race: ['human'], class: ['marksman'],
    hp: [450, 810, 1620], atk: [55, 99, 198], atkSpeed: 0.7,
    armor: 15, magicRes: 10, range: 4, moveSpeed: 300,
    emoji: '🏹',
    color: '#e8c4f0',
    skill: {
      name: 'Malefic Gun',
      desc: 'Tembakkan energi besar yang menembus musuh dalam garis lurus, memberikan 250/400/700 magic damage.',
      type: 'active', cooldown: 8, manaCost: 80,
      effect: (hero, targets) => {
        const dmg = [250, 400, 700][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'magic'));
      }
    }
  },
  nana: {
    id: 'nana', name: 'Nana', cost: 1, tier: 'B1',
    race: ['elf'], class: ['mage'],
    hp: [380, 684, 1368], atk: [50, 90, 180], atkSpeed: 0.6,
    armor: 10, magicRes: 15, range: 3, moveSpeed: 300,
    emoji: '🌸',
    color: '#f9a8d4',
    skill: {
      name: 'Molina Smooch',
      desc: 'Ubah musuh menjadi Molina selama 2/2.5/3 detik. Musuh tidak bisa bergerak atau menyerang.',
      type: 'active', cooldown: 10, manaCost: 90,
      effect: (hero, targets) => {
        const dur = [2, 2.5, 3][hero.star - 1];
        targets.forEach(t => t.applyCC('transform', dur));
      }
    }
  },
  tigreal: {
    id: 'tigreal', name: 'Tigreal', cost: 1, tier: 'B1',
    race: ['human'], class: ['tank'],
    hp: [750, 1350, 2700], atk: [45, 81, 162], atkSpeed: 0.5,
    armor: 40, magicRes: 20, range: 1, moveSpeed: 280,
    emoji: '🛡️',
    color: '#93c5fd',
    skill: {
      name: 'Sacred Hammer',
      desc: 'Hantam musuh terdekat, memberikan 150/250/450 physical damage dan stun 1.5 detik.',
      type: 'active', cooldown: 8, manaCost: 75,
      effect: (hero, targets) => {
        const dmg = [150, 250, 450][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'physical'); t.applyCC('stun', 1.5); });
      }
    }
  },
  saber: {
    id: 'saber', name: 'Saber', cost: 1, tier: 'B1',
    race: ['human'], class: ['assassin'],
    hp: [420, 756, 1512], atk: [70, 126, 252], atkSpeed: 0.8,
    armor: 20, magicRes: 10, range: 1, moveSpeed: 320,
    emoji: '⚔️',
    color: '#6ee7b7',
    skill: {
      name: 'Triple Sweep',
      desc: 'Serang musuh 3 kali cepat, total 210/360/630 physical damage.',
      type: 'active', cooldown: 7, manaCost: 70,
      effect: (hero, targets) => {
        const dmg = [70, 120, 210][hero.star - 1];
        for (let i = 0; i < 3; i++) targets.forEach(t => t.takeDamage(dmg, 'physical'));
      }
    }
  },
  balmond: {
    id: 'balmond', name: 'Balmond', cost: 1, tier: 'B1',
    race: ['orc'], class: ['fighter'],
    hp: [680, 1224, 2448], atk: [60, 108, 216], atkSpeed: 0.6,
    armor: 35, magicRes: 15, range: 1, moveSpeed: 290,
    emoji: '👹',
    color: '#fca5a5',
    skill: {
      name: 'Soul Lock',
      desc: 'Kumpulkan energi dan hantam area, memberikan 200/350/600 physical damage + slow 30%.',
      type: 'active', cooldown: 9, manaCost: 80,
      effect: (hero, targets) => {
        const dmg = [200, 350, 600][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'physical'); t.applyCC('slow', 2, 0.3); });
      }
    }
  },
  odette: {
    id: 'odette', name: 'Odette', cost: 1, tier: 'B1',
    race: ['human'], class: ['mage'],
    hp: [400, 720, 1440], atk: [55, 99, 198], atkSpeed: 0.6,
    armor: 12, magicRes: 18, range: 3, moveSpeed: 300,
    emoji: '🦢',
    color: '#c4b5fd',
    skill: {
      name: 'Swan Song',
      desc: 'Pancarkan gelombang suara ke semua musuh, memberikan 180/300/540 magic damage dan slow.',
      type: 'active', cooldown: 9, manaCost: 85,
      effect: (hero, targets) => {
        const dmg = [180, 300, 540][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'magic'); t.applyCC('slow', 2, 0.25); });
      }
    }
  },
  aulus: {
    id: 'aulus', name: 'Aulus', cost: 1, tier: 'B1',
    race: ['orc'], class: ['fighter'],
    hp: [600, 1080, 2160], atk: [65, 117, 234], atkSpeed: 0.65,
    armor: 30, magicRes: 10, range: 1, moveSpeed: 300,
    emoji: '🪓',
    color: '#fdba74',
    skill: {
      name: 'Aulu\'s Spirit',
      desc: 'Tingkatkan attack speed 40/60/100% selama 4 detik dan tambah 80/140/250 damage.',
      type: 'active', cooldown: 10, manaCost: 80,
      effect: (hero, targets) => {
        const bonus = [0.4, 0.6, 1.0][hero.star - 1];
        hero.applyBuff('atkSpeed', bonus, 4);
      }
    }
  },
  fredrinn: {
    id: 'fredrinn', name: 'Fredrinn', cost: 1, tier: 'B1',
    race: ['crystal'], class: ['fighter', 'tank'],
    hp: [700, 1260, 2520], atk: [58, 104, 208], atkSpeed: 0.55,
    armor: 38, magicRes: 18, range: 1, moveSpeed: 285,
    emoji: '💎',
    color: '#67e8f9',
    skill: {
      name: 'Crystal Shard',
      desc: 'Keluarkan kristal yang memberikan 200/350/600 physical damage dan dapatkan shield 200/350/600.',
      type: 'active', cooldown: 8, manaCost: 75,
      effect: (hero, targets) => {
        const dmg = [200, 350, 600][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'physical'));
        hero.applyBuff('shield', dmg, 5);
      }
    }
  },
  lesley: {
    id: 'lesley', name: 'Lesley', cost: 1, tier: 'B1',
    race: ['human'], class: ['marksman'],
    hp: [420, 756, 1512], atk: [60, 108, 216], atkSpeed: 0.75,
    armor: 12, magicRes: 10, range: 4, moveSpeed: 305,
    emoji: '🎯',
    color: '#a3e635',
    skill: {
      name: 'Ultimate Snipe',
      desc: 'Bidik musuh dengan HP terendah, tembakkan peluru yang memberikan 350/600/1050 physical damage.',
      type: 'active', cooldown: 9, manaCost: 80,
      effect: (hero, targets) => {
        const dmg = [350, 600, 1050][hero.star - 1];
        const target = targets.sort((a,b) => a.currentHp - b.currentHp)[0];
        if (target) target.takeDamage(dmg, 'physical');
      }
    }
  },
  irithel: {
    id: 'irithel', name: 'Irithel', cost: 1, tier: 'B1',
    race: ['beast'], class: ['marksman'],
    hp: [450, 810, 1620], atk: [58, 104, 208], atkSpeed: 0.7,
    armor: 14, magicRes: 10, range: 4, moveSpeed: 310,
    emoji: '🐯',
    color: '#fbbf24',
    skill: {
      name: 'Heavy Crossfire',
      desc: 'Tembakkan panah besar ke area musuh, 250/420/756 physical damage ke semua musuh di area.',
      type: 'active', cooldown: 8, manaCost: 75,
      effect: (hero, targets) => {
        const dmg = [250, 420, 756][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'physical'));
      }
    }
  },
  gatotkaca: {
    id: 'gatotkaca', name: 'Gatotkaca', cost: 1, tier: 'B1',
    race: ['human'], class: ['tank', 'fighter'],
    hp: [720, 1296, 2592], atk: [50, 90, 180], atkSpeed: 0.5,
    armor: 42, magicRes: 22, range: 1, moveSpeed: 280,
    emoji: '⚡',
    color: '#fbbf24',
    skill: {
      name: 'Unbreakable',
      desc: 'Aktifkan armor baja, kurangi 50/65/80% damage selama 3 detik dan pantulkan 20% damage ke attacker.',
      type: 'active', cooldown: 10, manaCost: 85,
      effect: (hero, targets) => {
        const red = [0.5, 0.65, 0.8][hero.star - 1];
        hero.applyBuff('damageReduction', red, 3);
      }
    }
  },
  terizla: {
    id: 'terizla', name: 'Terizla', cost: 1, tier: 'B1',
    race: ['human'], class: ['fighter'],
    hp: [650, 1170, 2340], atk: [68, 122, 244], atkSpeed: 0.55,
    armor: 30, magicRes: 12, range: 1, moveSpeed: 285,
    emoji: '🔨',
    color: '#94a3b8',
    skill: {
      name: 'Execution Strike',
      desc: 'Hantam musuh 2x, masing-masing 175/300/525 physical damage. Damage meningkat jika HP musuh rendah.',
      type: 'active', cooldown: 8, manaCost: 75,
      effect: (hero, targets) => {
        const baseDmg = [175, 300, 525][hero.star - 1];
        targets.forEach(t => {
          const bonus = t.currentHp < t.maxHp * 0.5 ? 1.5 : 1;
          t.takeDamage(baseDmg * 2 * bonus, 'physical');
        });
      }
    }
  },
  floryn: {
    id: 'floryn', name: 'Floryn', cost: 1, tier: 'B1',
    race: ['elf'], class: ['support'],
    hp: [400, 720, 1440], atk: [45, 81, 162], atkSpeed: 0.6,
    armor: 15, magicRes: 20, range: 3, moveSpeed: 300,
    emoji: '🌻',
    color: '#86efac',
    skill: {
      name: 'Flower Heal',
      desc: 'Heal semua ally dengan HP terendah sebesar 200/350/600 HP.',
      type: 'active', cooldown: 7, manaCost: 70,
      effect: (hero, allies) => {
        const heal = [200, 350, 600][hero.star - 1];
        const sorted = allies.sort((a,b) => (a.maxHp-a.currentHp)-(b.maxHp-b.currentHp)).slice(0,3);
        sorted.forEach(a => a.heal(heal));
      }
    }
  },

  // ==================== TIER B2 (Cost 2) ====================
  lancelot: {
    id: 'lancelot', name: 'Lancelot', cost: 2, tier: 'B2',
    race: ['human'], class: ['assassin'],
    hp: [520, 936, 1872], atk: [95, 171, 342], atkSpeed: 0.9,
    armor: 18, magicRes: 10, range: 1, moveSpeed: 340,
    emoji: '🗡️',
    color: '#e2e8f0',
    skill: {
      name: 'Thorned Rose',
      desc: 'Dash ke musuh dan serang 3 kali, total 360/630/1134 physical damage. Immune saat dash.',
      type: 'active', cooldown: 8, manaCost: 80,
      effect: (hero, targets) => {
        const dmg = [120, 210, 378][hero.star - 1];
        targets.forEach(t => { for(let i=0;i<3;i++) t.takeDamage(dmg, 'physical'); });
      }
    }
  },
  helcurt: {
    id: 'helcurt', name: 'Helcurt', cost: 2, tier: 'B2',
    race: ['abyss'], class: ['assassin'],
    hp: [540, 972, 1944], atk: [100, 180, 360], atkSpeed: 0.85,
    armor: 20, magicRes: 10, range: 1, moveSpeed: 335,
    emoji: '🌑',
    color: '#475569',
    skill: {
      name: 'Dark Night Falls',
      desc: 'Silentkan semua musuh selama 2/2.5/3 detik, lalu serang musuh paling dekat dengan 400/700/1260 physical damage.',
      type: 'active', cooldown: 10, manaCost: 90,
      effect: (hero, targets) => {
        const dur = [2, 2.5, 3][hero.star - 1];
        const dmg = [400, 700, 1260][hero.star - 1];
        targets.forEach(t => { t.applyCC('silence', dur); t.takeDamage(dmg * 0.5, 'physical'); });
      }
    }
  },
  valir: {
    id: 'valir', name: 'Valir', cost: 2, tier: 'B2',
    race: ['abyss'], class: ['mage'],
    hp: [480, 864, 1728], atk: [80, 144, 288], atkSpeed: 0.65,
    armor: 15, magicRes: 25, range: 3, moveSpeed: 300,
    emoji: '🔥',
    color: '#ef4444',
    skill: {
      name: 'Hellfire',
      desc: 'Pancarkan api ke area musuh, 300/525/945 magic damage dan burn 3 detik.',
      type: 'active', cooldown: 8, manaCost: 80,
      effect: (hero, targets) => {
        const dmg = [300, 525, 945][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'magic'); t.applyCC('burn', 3, 50); });
      }
    }
  },
  moskov: {
    id: 'moskov', name: 'Moskov', cost: 2, tier: 'B2',
    race: ['orc'], class: ['marksman'],
    hp: [480, 864, 1728], atk: [90, 162, 324], atkSpeed: 0.8,
    armor: 15, magicRes: 10, range: 4, moveSpeed: 310,
    emoji: '💥',
    color: '#f97316',
    skill: {
      name: 'Spear of Misery',
      desc: 'Lemparan tombak yang menembus musuh, 350/612/1102 physical damage + knockback.',
      type: 'active', cooldown: 8, manaCost: 80,
      effect: (hero, targets) => {
        const dmg = [350, 612, 1102][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'physical'); t.applyCC('knockback', 1); });
      }
    }
  },
  carmilla: {
    id: 'carmilla', name: 'Carmilla', cost: 2, tier: 'B2',
    race: ['undead'], class: ['support', 'tank'],
    hp: [620, 1116, 2232], atk: [70, 126, 252], atkSpeed: 0.6,
    armor: 30, magicRes: 20, range: 1, moveSpeed: 295,
    emoji: '🧛',
    color: '#dc2626',
    skill: {
      name: 'Crimson Bat',
      desc: 'Terbangkan diri dan turun ke musuh yang paling dekat dengan ally, rantai mereka bersama. Semua damage dibagi.',
      type: 'active', cooldown: 10, manaCost: 85,
      effect: (hero, targets) => {
        const dmg = [200, 350, 630][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'magic'));
        hero.applyBuff('shield', 300, 4);
      }
    }
  },
  angela: {
    id: 'angela', name: 'Angela', cost: 2, tier: 'B2',
    race: ['elf'], class: ['support'],
    hp: [450, 810, 1620], atk: [65, 117, 234], atkSpeed: 0.6,
    armor: 20, magicRes: 25, range: 3, moveSpeed: 295,
    emoji: '💖',
    color: '#f9a8d4',
    skill: {
      name: 'Puppet On A String',
      desc: 'Ikat musuh, perlambat mereka 40% dan drain 120/210/378 HP per detik selama 3 detik.',
      type: 'active', cooldown: 9, manaCost: 80,
      effect: (hero, targets) => {
        const drain = [120, 210, 378][hero.star - 1];
        targets.forEach(t => { t.applyCC('slow', 3, 0.4); t.applyCC('drain', 3, drain); });
      }
    }
  },
  johnson: {
    id: 'johnson', name: 'Johnson', cost: 2, tier: 'B2',
    race: ['mech'], class: ['tank'],
    hp: [850, 1530, 3060], atk: [60, 108, 216], atkSpeed: 0.5,
    armor: 50, magicRes: 25, range: 1, moveSpeed: 275,
    emoji: '🚗',
    color: '#facc15',
    skill: {
      name: 'Car Crash',
      desc: 'Transform jadi mobil, hajar musuh dalam garis lurus 350/612/1102 physical damage + stun 2 detik.',
      type: 'active', cooldown: 10, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [350, 612, 1102][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'physical'); t.applyCC('stun', 2); });
      }
    }
  },
  badang: {
    id: 'badang', name: 'Badang', cost: 2, tier: 'B2',
    race: ['human'], class: ['fighter'],
    hp: [700, 1260, 2520], atk: [85, 153, 306], atkSpeed: 0.65,
    armor: 28, magicRes: 12, range: 1, moveSpeed: 295,
    emoji: '🌪️',
    color: '#a3e635',
    skill: {
      name: 'Fist Crack',
      desc: 'Pecahkan angin, lempar musuh ke dinding. 300/525/945 physical damage + stun.',
      type: 'active', cooldown: 8, manaCost: 80,
      effect: (hero, targets) => {
        const dmg = [300, 525, 945][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'physical'); t.applyCC('stun', 1.5); });
      }
    }
  },
  kimmy: {
    id: 'kimmy', name: 'Kimmy', cost: 2, tier: 'B2',
    race: ['mech'], class: ['marksman', 'mage'],
    hp: [470, 846, 1692], atk: [80, 144, 288], atkSpeed: 0.85,
    armor: 14, magicRes: 18, range: 4, moveSpeed: 305,
    emoji: '🔬',
    color: '#818cf8',
    skill: {
      name: 'Chemical Refinement',
      desc: 'Tembakkan cairan kimia ke area musuh, 280/490/882 magic damage ke semua musuh dalam area.',
      type: 'active', cooldown: 7, manaCost: 75,
      effect: (hero, targets) => {
        const dmg = [280, 490, 882][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'magic'));
      }
    }
  },
  dyrroth: {
    id: 'dyrroth', name: 'Dyrroth', cost: 2, tier: 'B2',
    race: ['abyss'], class: ['fighter'],
    hp: [650, 1170, 2340], atk: [90, 162, 324], atkSpeed: 0.7,
    armor: 25, magicRes: 12, range: 1, moveSpeed: 310,
    emoji: '😈',
    color: '#7c3aed',
    skill: {
      name: 'Abysm Strike',
      desc: 'Tebas musuh dengan kekuatan abysm, 350/612/1102 physical damage + kurangi armor 30% selama 3 detik.',
      type: 'active', cooldown: 8, manaCost: 80,
      effect: (hero, targets) => {
        const dmg = [350, 612, 1102][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'physical'); t.applyBuff('armorReduction', 0.3, 3); });
      }
    }
  },
  jawhead: {
    id: 'jawhead', name: 'Jawhead', cost: 2, tier: 'B2',
    race: ['mech'], class: ['tank', 'fighter'],
    hp: [780, 1404, 2808], atk: [75, 135, 270], atkSpeed: 0.55,
    armor: 42, magicRes: 20, range: 1, moveSpeed: 285,
    emoji: '🦷',
    color: '#22d3ee',
    skill: {
      name: 'Smart Missiles',
      desc: 'Tembakkan rudal ke semua musuh, 200/350/630 magic damage masing-masing.',
      type: 'active', cooldown: 8, manaCost: 80,
      effect: (hero, targets) => {
        const dmg = [200, 350, 630][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'magic'));
      }
    }
  },
  harith: {
    id: 'harith', name: 'Harith', cost: 2, tier: 'B2',
    race: ['elf'], class: ['mage'],
    hp: [490, 882, 1764], atk: [85, 153, 306], atkSpeed: 0.7,
    armor: 15, magicRes: 28, range: 3, moveSpeed: 310,
    emoji: '🌙',
    color: '#a78bfa',
    skill: {
      name: 'Chrono Dash',
      desc: 'Leap ke musuh, berikan shield ke diri sendiri 200/350/630, dan 300/525/945 magic damage.',
      type: 'active', cooldown: 8, manaCost: 80,
      effect: (hero, targets) => {
        const dmg = [300, 525, 945][hero.star - 1];
        const shield = [200, 350, 630][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'magic'));
        hero.applyBuff('shield', shield, 4);
      }
    }
  },
  wanwan: {
    id: 'wanwan', name: 'Wanwan', cost: 2, tier: 'B2',
    race: ['beast'], class: ['marksman'],
    hp: [460, 828, 1656], atk: [88, 158, 316], atkSpeed: 0.82,
    armor: 14, magicRes: 10, range: 4, moveSpeed: 320,
    emoji: '🏹',
    color: '#4ade80',
    skill: {
      name: 'Tiger Pace',
      desc: 'Tembakkan panah ke semua musuh secara bersamaan, 250/437/787 physical damage masing-masing.',
      type: 'active', cooldown: 7, manaCost: 75,
      effect: (hero, targets) => {
        const dmg = [250, 437, 787][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'physical'));
      }
    }
  },

  // ==================== TIER B3 (Cost 3) ====================
  gusion: {
    id: 'gusion', name: 'Gusion', cost: 3, tier: 'B3',
    race: ['human'], class: ['assassin'],
    hp: [600, 1080, 2160], atk: [130, 234, 468], atkSpeed: 0.95,
    armor: 22, magicRes: 15, range: 1, moveSpeed: 350,
    emoji: '🔱',
    color: '#818cf8',
    skill: {
      name: 'Incandescence',
      desc: 'Lempar belati ke musuh lalu dash ke posisi belati, 500/875/1575 physical damage total.',
      type: 'active', cooldown: 7, manaCost: 80,
      effect: (hero, targets) => {
        const dmg = [500, 875, 1575][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'physical'));
      }
    }
  },
  ling: {
    id: 'ling', name: 'Ling', cost: 3, tier: 'B3',
    race: ['human'], class: ['assassin'],
    hp: [580, 1044, 2088], atk: [135, 243, 486], atkSpeed: 1.0,
    armor: 20, magicRes: 12, range: 1, moveSpeed: 355,
    emoji: '🌸',
    color: '#e2e8f0',
    skill: {
      name: 'Tempest of Blades',
      desc: 'Leap ke udara, jatuhkan pedang ke arena. 600/1050/1890 physical damage ke semua musuh.',
      type: 'active', cooldown: 10, manaCost: 100,
      effect: (hero, targets) => {
        const dmg = [600, 1050, 1890][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'physical'));
        hero.applyBuff('damageReduction', 0.5, 3);
      }
    }
  },
  pharsa: {
    id: 'pharsa', name: 'Pharsa', cost: 3, tier: 'B3',
    race: ['beast'], class: ['mage'],
    hp: [520, 936, 1872], atk: [110, 198, 396], atkSpeed: 0.65,
    armor: 18, magicRes: 30, range: 4, moveSpeed: 295,
    emoji: '🦅',
    color: '#818cf8',
    skill: {
      name: 'Feathered Air Strike',
      desc: 'Tembakkan bombardemen dari udara, 450/787/1417 magic damage per hit ke area besar.',
      type: 'active', cooldown: 10, manaCost: 95,
      effect: (hero, targets) => {
        const dmg = [450, 787, 1417][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'magic'));
      }
    }
  },
  cecilion: {
    id: 'cecilion', name: 'Cecilion', cost: 3, tier: 'B3',
    race: ['undead'], class: ['mage'],
    hp: [500, 900, 1800], atk: [115, 207, 414], atkSpeed: 0.6,
    armor: 15, magicRes: 30, range: 4, moveSpeed: 290,
    emoji: '🎩',
    color: '#dc2626',
    skill: {
      name: 'Bats Feast',
      desc: 'Keluarkan sekawan kelelawar yang menyerang semua musuh, 400/700/1260 magic damage + lifesteal.',
      type: 'active', cooldown: 9, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [400, 700, 1260][hero.star - 1];
        let totalHeal = 0;
        targets.forEach(t => { t.takeDamage(dmg, 'magic'); totalHeal += dmg * 0.3; });
        hero.heal(totalHeal);
      }
    }
  },
  diggie: {
    id: 'diggie', name: 'Diggie', cost: 3, tier: 'B3',
    race: ['beast'], class: ['support'],
    hp: [560, 1008, 2016], atk: [80, 144, 288], atkSpeed: 0.6,
    armor: 25, magicRes: 20, range: 3, moveSpeed: 295,
    emoji: '⏰',
    color: '#fbbf24',
    skill: {
      name: 'Time Journey',
      desc: 'Berikan Time Journey ke semua ally, kebal CC selama 2/3/4 detik dan heal 300/525/945.',
      type: 'active', cooldown: 12, manaCost: 100,
      effect: (hero, allies) => {
        const dur = [2, 3, 4][hero.star - 1];
        const heal = [300, 525, 945][hero.star - 1];
        allies.forEach(a => { a.applyBuff('ccImmune', dur); a.heal(heal); });
      }
    }
  },
  hylos: {
    id: 'hylos', name: 'Hylos', cost: 3, tier: 'B3',
    race: ['beast'], class: ['tank'],
    hp: [950, 1710, 3420], atk: [75, 135, 270], atkSpeed: 0.5,
    armor: 55, magicRes: 30, range: 1, moveSpeed: 275,
    emoji: '🐎',
    color: '#8b5cf6',
    skill: {
      name: 'Ring of Punishment',
      desc: 'Aktifkan ring yang memberikan 150/262/472 magic damage per detik ke semua musuh selama 4 detik.',
      type: 'active', cooldown: 10, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [150, 262, 472][hero.star - 1];
        targets.forEach(t => t.applyCC('dot', 4, dmg));
      }
    }
  },
  thamuz: {
    id: 'thamuz', name: 'Thamuz', cost: 3, tier: 'B3',
    race: ['abyss'], class: ['fighter'],
    hp: [750, 1350, 2700], atk: [120, 216, 432], atkSpeed: 0.75,
    armor: 30, magicRes: 15, range: 1, moveSpeed: 300,
    emoji: '🌋',
    color: '#ef4444',
    skill: {
      name: 'Cauterant Inferno',
      desc: 'Semprotkan lava ke musuh terdekat, 500/875/1575 physical damage + burn 4 detik.',
      type: 'active', cooldown: 9, manaCost: 85,
      effect: (hero, targets) => {
        const dmg = [500, 875, 1575][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'physical'); t.applyCC('burn', 4, 80); });
      }
    }
  },
  argus: {
    id: 'argus', name: 'Argus', cost: 3, tier: 'B3',
    race: ['abyss'], class: ['fighter'],
    hp: [700, 1260, 2520], atk: [125, 225, 450], atkSpeed: 0.8,
    armor: 28, magicRes: 12, range: 1, moveSpeed: 310,
    emoji: '😇',
    color: '#7c3aed',
    skill: {
      name: 'Eternal Evil',
      desc: 'Aktifkan mode immortal selama 4/5/6 detik: tidak bisa mati, attack speed +80%, lifesteal +50%.',
      type: 'active', cooldown: 12, manaCost: 100,
      effect: (hero, targets) => {
        const dur = [4, 5, 6][hero.star - 1];
        hero.applyBuff('immortal', dur);
        hero.applyBuff('atkSpeed', 0.8, dur);
        hero.applyBuff('lifesteal', 0.5, dur);
      }
    }
  },
  miya: {
    id: 'miya', name: 'Miya', cost: 3, tier: 'B3',
    race: ['elf'], class: ['marksman'],
    hp: [520, 936, 1872], atk: [115, 207, 414], atkSpeed: 0.9,
    armor: 16, magicRes: 12, range: 4, moveSpeed: 315,
    emoji: '🌙',
    color: '#bfdbfe',
    skill: {
      name: 'Moon Arrow',
      desc: 'Jadikan semua panah menjadi panah bulan, attack speed +80/110/160% dan setiap serangan slow 40%.',
      type: 'active', cooldown: 8, manaCost: 80,
      effect: (hero, targets) => {
        const bonus = [0.8, 1.1, 1.6][hero.star - 1];
        hero.applyBuff('atkSpeed', bonus, 5);
        hero.applyBuff('slowOnHit', 0.4, 5);
      }
    }
  },
  hanzo: {
    id: 'hanzo', name: 'Hanzo', cost: 3, tier: 'B3',
    race: ['orc'], class: ['assassin'],
    hp: [560, 1008, 2016], atk: [120, 216, 432], atkSpeed: 0.85,
    armor: 22, magicRes: 10, range: 1, moveSpeed: 340,
    emoji: '🍶',
    color: '#dc2626',
    skill: {
      name: 'Ame no Habakiri',
      desc: 'Keluarkan roh untuk menyerang musuh, 600/1050/1890 physical damage. Tubuh asli tidak bisa diserang.',
      type: 'active', cooldown: 10, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [600, 1050, 1890][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'physical'));
        hero.applyBuff('invulnerable', 3);
      }
    }
  },
  claude: {
    id: 'claude', name: 'Claude', cost: 3, tier: 'B3',
    race: ['human'], class: ['marksman'],
    hp: [540, 972, 1944], atk: [110, 198, 396], atkSpeed: 0.88,
    armor: 18, magicRes: 12, range: 4, moveSpeed: 320,
    emoji: '🐒',
    color: '#fb923c',
    skill: {
      name: 'Battle Mirror Image',
      desc: 'Keluarkan Dexter (monyet) ke medan perang yang ikut menyerang. Total DPS +100/150/220%.',
      type: 'active', cooldown: 10, manaCost: 90,
      effect: (hero, targets) => {
        const bonus = [1.0, 1.5, 2.2][hero.star - 1];
        hero.applyBuff('cloneAttack', bonus, 6);
      }
    }
  },
  silvanna: {
    id: 'silvanna', name: 'Silvanna', cost: 3, tier: 'B3',
    race: ['human'], class: ['fighter', 'mage'],
    hp: [650, 1170, 2340], atk: [110, 198, 396], atkSpeed: 0.72,
    armor: 30, magicRes: 22, range: 1, moveSpeed: 305,
    emoji: '⚡',
    color: '#a78bfa',
    skill: {
      name: 'Imperial Justice',
      desc: 'Tangkap musuh dalam circle, 400/700/1260 magic damage dan blok musuh keluar 3 detik.',
      type: 'active', cooldown: 10, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [400, 700, 1260][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'magic'); t.applyCC('imprisoned', 3); });
      }
    }
  },
  vexana: {
    id: 'vexana', name: 'Vexana', cost: 3, tier: 'B3',
    race: ['undead'], class: ['mage'],
    hp: [510, 918, 1836], atk: [112, 201, 402], atkSpeed: 0.62,
    armor: 16, magicRes: 28, range: 4, moveSpeed: 290,
    emoji: '💀',
    color: '#4b5563',
    skill: {
      name: 'Nether Snare',
      desc: 'Panggil zombie untuk mengejar musuh, 450/787/1417 magic damage + charm musuh 2.5 detik.',
      type: 'active', cooldown: 9, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [450, 787, 1417][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'magic'); t.applyCC('charm', 2.5); });
      }
    }
  },

  // ==================== TIER B4 (Cost 4) ====================
  benedetta: {
    id: 'benedetta', name: 'Benedetta', cost: 4, tier: 'B4',
    race: ['human'], class: ['assassin'],
    hp: [680, 1224, 2448], atk: [175, 315, 630], atkSpeed: 1.05,
    armor: 25, magicRes: 15, range: 1, moveSpeed: 365,
    emoji: '🌹',
    color: '#f43f5e',
    skill: {
      name: 'Alecto: Final Blow',
      desc: 'Dash panjang melewati musuh, 700/1225/2205 physical damage. Immune saat skill aktif.',
      type: 'active', cooldown: 8, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [700, 1225, 2205][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'physical'));
        hero.applyBuff('immune', 2);
      }
    }
  },
  lunox: {
    id: 'lunox', name: 'Lunox', cost: 4, tier: 'B4',
    race: ['human'], class: ['mage'],
    hp: [600, 1080, 2160], atk: [160, 288, 576], atkSpeed: 0.7,
    armor: 20, magicRes: 35, range: 4, moveSpeed: 305,
    emoji: '🌟',
    color: '#fbbf24',
    skill: {
      name: 'Chaos: Darkening',
      desc: 'Aktifkan mode chaos/order. Mode chaos: 600/1050/1890 magic damage ke semua musuh. Mode order: heal ally 400.',
      type: 'active', cooldown: 8, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [600, 1050, 1890][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'magic'));
      }
    }
  },
  kagura: {
    id: 'kagura', name: 'Kagura', cost: 4, tier: 'B4',
    race: ['elf'], class: ['mage'],
    hp: [580, 1044, 2088], atk: [165, 297, 594], atkSpeed: 0.72,
    armor: 18, magicRes: 38, range: 4, moveSpeed: 308,
    emoji: '🌸',
    color: '#ec4899',
    skill: {
      name: 'Yin Yang Overturn',
      desc: 'Manipulasi payung untuk menarik musuh dan berikan 650/1137/2047 magic damage ke semua musuh.',
      type: 'active', cooldown: 9, manaCost: 95,
      effect: (hero, targets) => {
        const dmg = [650, 1137, 2047][hero.star - 1];
        targets.forEach(t => { t.applyCC('pull', 1); t.takeDamage(dmg, 'magic'); });
      }
    }
  },
  lylia: {
    id: 'lylia', name: 'Lylia', cost: 4, tier: 'B4',
    race: ['elf'], class: ['mage'],
    hp: [560, 1008, 2016], atk: [158, 284, 568], atkSpeed: 0.68,
    armor: 15, magicRes: 40, range: 4, moveSpeed: 300,
    emoji: '🎀',
    color: '#6ee7b7',
    skill: {
      name: 'Black Shoes\' Devotion',
      desc: 'Boom bom ke area musuh, 550/962/1732 magic damage. Jika terkena semua 3 bom, +50% damage.',
      type: 'active', cooldown: 9, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [550, 962, 1732][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg * 1.5, 'magic'));
      }
    }
  },
  atlas: {
    id: 'atlas', name: 'Atlas', cost: 4, tier: 'B4',
    race: ['mech'], class: ['tank'],
    hp: [1050, 1890, 3780], atk: [85, 153, 306], atkSpeed: 0.48,
    armor: 60, magicRes: 35, range: 1, moveSpeed: 270,
    emoji: '🤖',
    color: '#0ea5e9',
    skill: {
      name: 'Fatal Links',
      desc: 'Rantai semua musuh bersama dan tarik ke tengah, 450/787/1417 magic damage + stun 2 detik.',
      type: 'active', cooldown: 12, manaCost: 110,
      effect: (hero, targets) => {
        const dmg = [450, 787, 1417][hero.star - 1];
        targets.forEach(t => { t.applyCC('pull', 2); t.takeDamage(dmg, 'magic'); t.applyCC('stun', 2); });
      }
    }
  },
  baxia: {
    id: 'baxia', name: 'Baxia', cost: 4, tier: 'B4',
    race: ['beast'], class: ['tank'],
    hp: [980, 1764, 3528], atk: [80, 144, 288], atkSpeed: 0.5,
    armor: 58, magicRes: 28, range: 1, moveSpeed: 272,
    emoji: '🐢',
    color: '#4ade80',
    skill: {
      name: 'Tortoise\'s Puissance',
      desc: 'Gulung seperti bola ke semua musuh, 350/612/1102 physical damage + kurangi enemy healing 50%.',
      type: 'active', cooldown: 10, manaCost: 95,
      effect: (hero, targets) => {
        const dmg = [350, 612, 1102][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'physical'); t.applyBuff('antiheal', 0.5, 5); });
      }
    }
  },
  khufra: {
    id: 'khufra', name: 'Khufra', cost: 4, tier: 'B4',
    race: ['abyss'], class: ['tank'],
    hp: [1000, 1800, 3600], atk: [88, 158, 316], atkSpeed: 0.5,
    armor: 55, magicRes: 30, range: 1, moveSpeed: 270,
    emoji: '🏺',
    color: '#d4a017',
    skill: {
      name: 'Tyrant\'s Rage',
      desc: 'Menggelinding dan membesar, tumbuk musuh 500/875/1575 physical damage + stun 2.5 detik.',
      type: 'active', cooldown: 10, manaCost: 95,
      effect: (hero, targets) => {
        const dmg = [500, 875, 1575][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'physical'); t.applyCC('stun', 2.5); });
      }
    }
  },
  uranus: {
    id: 'uranus', name: 'Uranus', cost: 4, tier: 'B4',
    race: ['mech'], class: ['tank'],
    hp: [1100, 1980, 3960], atk: [75, 135, 270], atkSpeed: 0.48,
    armor: 62, magicRes: 38, range: 1, moveSpeed: 268,
    emoji: '⚛️',
    color: '#06b6d4',
    skill: {
      name: 'Ionic Edge',
      desc: 'Lempar ion ke semua musuh, 300/525/945 magic damage per hit. Regen HP 200/350/630 per detik 4 detik.',
      type: 'active', cooldown: 9, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [300, 525, 945][hero.star - 1];
        const regen = [200, 350, 630][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'magic'));
        hero.applyBuff('regen', regen, 4);
      }
    }
  },
  xborg: {
    id: 'xborg', name: 'X.Borg', cost: 4, tier: 'B4',
    race: ['mech'], class: ['fighter'],
    hp: [820, 1476, 2952], atk: [145, 261, 522], atkSpeed: 0.8,
    armor: 35, magicRes: 20, range: 2, moveSpeed: 305,
    emoji: '🔥',
    color: '#ef4444',
    skill: {
      name: 'Last Insanity',
      desc: 'Ledakkan armor dan tembakkan api ke semua musuh, 600/1050/1890 physical damage.',
      type: 'active', cooldown: 10, manaCost: 95,
      effect: (hero, targets) => {
        const dmg = [600, 1050, 1890][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'physical'));
      }
    }
  },
  roger: {
    id: 'roger', name: 'Roger', cost: 4, tier: 'B4',
    race: ['beast'], class: ['fighter', 'marksman'],
    hp: [750, 1350, 2700], atk: [140, 252, 504], atkSpeed: 0.85,
    armor: 28, magicRes: 15, range: 3, moveSpeed: 325,
    emoji: '🐺',
    color: '#f97316',
    skill: {
      name: 'Wolf Transformation',
      desc: 'Transform jadi serigala besar, attack +80% dan gerak ke musuh paling dekat, 500/875/1575 damage.',
      type: 'active', cooldown: 10, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [500, 875, 1575][hero.star - 1];
        hero.applyBuff('atkBoost', 0.8, 6);
        targets.forEach(t => t.takeDamage(dmg, 'physical'));
      }
    }
  },
  yss: {
    id: 'yss', name: 'Yi Sun-shin', cost: 4, tier: 'B4',
    race: ['human'], class: ['marksman', 'assassin'],
    hp: [660, 1188, 2376], atk: [155, 279, 558], atkSpeed: 0.88,
    armor: 22, magicRes: 12, range: 4, moveSpeed: 330,
    emoji: '⛵',
    color: '#0ea5e9',
    skill: {
      name: 'Mountain Shocker',
      desc: 'Panggil kapal perang tembaki semua musuh 3x, total 600/1050/1890 physical damage.',
      type: 'active', cooldown: 10, manaCost: 95,
      effect: (hero, targets) => {
        const dmg = [200, 350, 630][hero.star - 1];
        for (let i = 0; i < 3; i++) targets.forEach(t => t.takeDamage(dmg, 'physical'));
      }
    }
  },
  popol: {
    id: 'popol', name: 'Popol & Kupa', cost: 4, tier: 'B4',
    race: ['beast'], class: ['marksman', 'support'],
    hp: [700, 1260, 2520], atk: [138, 248, 496], atkSpeed: 0.82,
    armor: 20, magicRes: 12, range: 4, moveSpeed: 315,
    emoji: '🐾',
    color: '#6ee7b7',
    skill: {
      name: 'We Are Angry!',
      desc: 'Popol dan Kupa menyerang bersamaan, triple damage selama 4 detik + Kupa immune.',
      type: 'active', cooldown: 10, manaCost: 90,
      effect: (hero, targets) => {
        hero.applyBuff('tripleAtk', 3, 4);
      }
    }
  },

  // ==================== TIER B5 (Cost 5) ====================
  fanny: {
    id: 'fanny', name: 'Fanny', cost: 5, tier: 'B5',
    race: ['human'], class: ['assassin'],
    hp: [780, 1404, 2808], atk: [220, 396, 792], atkSpeed: 1.1,
    armor: 28, magicRes: 15, range: 1, moveSpeed: 380,
    emoji: '🦋',
    color: '#c084fc',
    skill: {
      name: 'Cut Throat',
      desc: 'Zip ke musuh dengan kecepatan tinggi, serang 5x cepat. Total 1100/1925/3465 physical damage.',
      type: 'active', cooldown: 8, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [220, 385, 693][hero.star - 1];
        targets.forEach(t => { for(let i=0;i<5;i++) t.takeDamage(dmg, 'physical'); });
      }
    }
  },
  karina: {
    id: 'karina', name: 'Karina', cost: 5, tier: 'B5',
    race: ['elf'], class: ['assassin'],
    hp: [750, 1350, 2700], atk: [215, 387, 774], atkSpeed: 1.05,
    armor: 25, magicRes: 18, range: 1, moveSpeed: 375,
    emoji: '⚫',
    color: '#6b7280',
    skill: {
      name: 'Eradicate',
      desc: 'Dash ke musuh dengan HP terendah, 900/1575/2835 magic damage. Jika musuh mati, reset cooldown.',
      type: 'active', cooldown: 6, manaCost: 80,
      effect: (hero, targets) => {
        const dmg = [900, 1575, 2835][hero.star - 1];
        const target = targets.sort((a,b) => a.currentHp - b.currentHp)[0];
        if (target) {
          target.takeDamage(dmg, 'magic');
          if (target.currentHp <= 0) hero.skillCooldown = 0;
        }
      }
    }
  },
  selena: {
    id: 'selena', name: 'Selena', cost: 5, tier: 'B5',
    race: ['abyss'], class: ['assassin', 'mage'],
    hp: [720, 1296, 2592], atk: [210, 378, 756], atkSpeed: 1.0,
    armor: 22, magicRes: 22, range: 2, moveSpeed: 370,
    emoji: '🌙',
    color: '#4f46e5',
    skill: {
      name: 'Primal Darkness',
      desc: 'Tembakkan abyssal tentacles, stun semua musuh 2 detik dan 800/1400/2520 magic damage.',
      type: 'active', cooldown: 9, manaCost: 95,
      effect: (hero, targets) => {
        const dmg = [800, 1400, 2520][hero.star - 1];
        targets.forEach(t => { t.applyCC('stun', 2); t.takeDamage(dmg, 'magic'); });
      }
    }
  },
  grock: {
    id: 'grock', name: 'Grock', cost: 5, tier: 'B5',
    race: ['orc'], class: ['tank', 'fighter'],
    hp: [1250, 2250, 4500], atk: [150, 270, 540], atkSpeed: 0.55,
    armor: 70, magicRes: 40, range: 1, moveSpeed: 275,
    emoji: '🗿',
    color: '#78716c',
    skill: {
      name: 'Wild Charge',
      desc: 'Hantam dengan kekuatan penuh, 800/1400/2520 physical damage dan ciptakan dinding batu 5 detik.',
      type: 'active', cooldown: 11, manaCost: 105,
      effect: (hero, targets) => {
        const dmg = [800, 1400, 2520][hero.star - 1];
        targets.forEach(t => { t.takeDamage(dmg, 'physical'); t.applyCC('stun', 1.5); });
        hero.applyBuff('damageReduction', 0.4, 4);
      }
    }
  },
  aldous: {
    id: 'aldous', name: 'Aldous', cost: 5, tier: 'B5',
    race: ['human'], class: ['fighter'],
    hp: [950, 1710, 3420], atk: [200, 360, 720], atkSpeed: 0.7,
    armor: 38, magicRes: 20, range: 1, moveSpeed: 318,
    emoji: '👊',
    color: '#ea580c',
    skill: {
      name: '1000 Kills',
      desc: 'Serang musuh dengan tinju penuh power. 1000/1750/3150 physical damage. +10 stack per kill.',
      type: 'active', cooldown: 8, manaCost: 90,
      effect: (hero, targets) => {
        const baseDmg = [1000, 1750, 3150][hero.star - 1];
        const stackBonus = (hero.stacks || 0) * 10;
        targets.forEach(t => t.takeDamage(baseDmg + stackBonus, 'physical'));
      }
    }
  },
  karrie: {
    id: 'karrie', name: 'Karrie', cost: 5, tier: 'B5',
    race: ['elf'], class: ['marksman'],
    hp: [760, 1368, 2736], atk: [205, 369, 738], atkSpeed: 1.0,
    armor: 20, magicRes: 15, range: 4, moveSpeed: 335,
    emoji: '💫',
    color: '#06b6d4',
    skill: {
      name: 'Speedy Lightwheel',
      desc: 'Tembakkan lightwheel ke semua musuh, 750/1312/2362 true damage. Bypass armor dan magic resistance.',
      type: 'active', cooldown: 8, manaCost: 90,
      effect: (hero, targets) => {
        const dmg = [750, 1312, 2362][hero.star - 1];
        targets.forEach(t => t.takeDamage(dmg, 'true'));
      }
    }
  }
};

// Hero pool quantities (for shop randomization)
const HERO_POOL = {
  B1: 45, // 45 copies each
  B2: 30,
  B3: 25,
  B4: 15,
  B5: 10
};

// Probability by player level
const SHOP_ODDS = {
  1:  [100, 0, 0, 0, 0],
  2:  [100, 0, 0, 0, 0],
  3:  [75, 25, 0, 0, 0],
  4:  [55, 30, 15, 0, 0],
  5:  [45, 33, 20, 2, 0],
  6:  [30, 35, 25, 10, 0],
  7:  [19, 30, 35, 15, 1],
  8:  [15, 20, 35, 25, 5],
  9:  [10, 15, 30, 30, 15],
  10: [5, 10, 20, 40, 25]
};

export { HERO_DATA, HERO_POOL, SHOP_ODDS };
