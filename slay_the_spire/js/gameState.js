/**
 * ============================================================================
 * SHADOWSPIRE: CHRONICLES OF ASCENSION - MASTER GAME STATE & NARRATIVE LORE
 * ============================================================================
 * Mengelola 10 Pahlawan unik dengan 2 Pasif, Prolog Cerita Naratif Mendalam,
 * Sistem Mode Kesulitan (Ascension), Pengaturan Game, dan Persistensi Save.
 */

const DIFFICULTY_DATABASE = {
  NORMAL: {
    id: 'NORMAL',
    name: 'Normal: Panggilan Menara',
    badge: '⚔️ STANDARD',
    color: '#51cf66',
    desc: 'Pengalaman bertualang standar di Shadowspire. Monster memiliki HP dan kekuatan seimbang.',
    enemyHpMultiplier: 1.0,
    enemyDmgMultiplier: 1.0,
    goldMultiplier: 1.0,
    campHealPct: 0.30
  },
  ASCENSION_1: {
    id: 'ASCENSION_1',
    name: 'Ascension I: Dominasi Elite',
    badge: '👹 ELITE HUNTER',
    color: '#ffd43b',
    desc: 'Musuh tipe Elite lebih ganas dan lebih sering muncul di peta, namun memberikan hadiah Emas +20%.',
    enemyHpMultiplier: 1.1,
    enemyDmgMultiplier: 1.1,
    goldMultiplier: 1.2,
    campHealPct: 0.30
  },
  ASCENSION_2: {
    id: 'ASCENSION_2',
    name: 'Ascension II: Monster Mematikan',
    badge: '💀 DEADLY FOES',
    color: '#ff922b',
    desc: 'Semua monster memberikan serangan +20% lebih sakit. Boss memiliki HP +25% lebih tebal.',
    enemyHpMultiplier: 1.25,
    enemyDmgMultiplier: 1.2,
    goldMultiplier: 1.0,
    campHealPct: 0.30
  },
  ASCENSION_3: {
    id: 'ASCENSION_3',
    name: 'Ascension III: Kelangkaan & Derita',
    badge: '🔥 SCARCITY',
    color: '#ff6b6b',
    desc: 'Istirahat Campfire hanya memulihkan 20% HP (bukan 30%). Harga barang di Toko naik 20%.',
    enemyHpMultiplier: 1.3,
    enemyDmgMultiplier: 1.25,
    goldMultiplier: 0.9,
    campHealPct: 0.20
  },
  HELLFIRE: {
    id: 'HELLFIRE',
    name: 'Hellfire: Siksaan Neraka Abadi',
    badge: '☠️ HELLFIRE ASCENDANT',
    color: '#e03131',
    desc: 'Tantangan tersulit bagi para veteran sejati. Setiap musuh memulai pertarungan dengan 2 Strength dan 6 Block bawaan!',
    enemyHpMultiplier: 1.45,
    enemyDmgMultiplier: 1.35,
    goldMultiplier: 1.25,
    campHealPct: 0.18
  }
};

const CHARACTER_DATABASE = {
  // 1. THE IRONCLAD (Jujutsu / Berserk Warrior)
  ironclad: {
    id: 'ironclad',
    name: 'The Ironclad',
    title: 'Prajurit Terakhir Pasukan Besi',
    maxHp: 80,
    gold: 99,
    themeColor: '#e03131',
    avatarIcon: '⚔️',
    description: 'Prajurit perkasa berarmor demonic blood-forged yang menjual jiwanya kepada entitas iblis api. Mengandalkan Strength brutal, tebasan berdarah, dan pedang api raksasa.',
    passive1: {
      name: 'Burning Blood (燃える血)',
      icon: '🩸',
      description: 'Pulihkan 10 HP di setiap akhir pertempuran yang dimenangkan.'
    },
    passive2: {
      name: 'Demonic Fury (悪魔の怒り)',
      icon: '😈',
      description: 'Semua kartu Serangan menghasilkan +5 bonus Damage saat HP berada di bawah 60%.'
    },
    activeSkill: {
      id: 'demonic_awakening',
      name: 'Demonic Awakening (悪魔覚醒 • Berserk Core)',
      icon: '😈🔥',
      cooldown: 2,
      cost: 0,
      description: 'Kobarkan api iblis: Dapatkan +3 Strength, berikan 14 Fire Damage ke SEMUA musuh, dan peroleh 12 Block! (Korbankan 4 HP).',
      execute(combat, player) {
        combat.damagePlayer(4);
        combat.applyPlayerStatus('strength', 3);
        combat.gainPlayerBlock(12);
        combat.enemies.forEach(e => {
          if (!e.isDead && !e.hasEscaped && e.currentHp > 0) combat.dealDamageToEnemy(e, 14);
        });
        combat.showCombatText('😈 DEMONIC AWAKENING! (+3 STR, +12 BLK, 14 AoE)', 'player', '#ff2a2a');
        if (window.spireVfx) combat.triggerVfx('cleave_sweep', 'enemy');
      }
    },
    starterDeck: ['demonic_strike', 'demonic_strike', 'demonic_strike', 'demonic_strike', 'demonic_strike', 'ironclad_defend', 'ironclad_defend', 'ironclad_defend', 'ironclad_defend', 'bash'],
    starterRelic: 'burning_blood',
    prologueStory: `
      Malam itu, lembah tempat Legiun Besi bermarkas dibakar menjadi lautan api oleh kutukan bayangan dari puncak Shadowspire. Tidak ada yang selamat, kecuali dirimu—yang dalam keputusasaan bersumpah darah kepada iblis api kuno.
      
      Kini zirah besimu menyatu dengan dagingmu, darahmu mendidih bagai magma, dan pedang besarmu haus akan pembantaian. Puncak Spire menantimu untuk menebus sumpah darah yang tak terelakkan!
    `,
    avatarSvg: `
      <svg viewBox="0 0 160 200" class="hero-svg ironclad-svg">
        <defs>
          <filter id="iron_fire_glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="iron_blade_grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fff"/>
            <stop offset="30%" stop-color="#ffa94d"/>
            <stop offset="70%" stop-color="#e03131"/>
            <stop offset="100%" stop-color="#491212"/>
          </linearGradient>
          <radialGradient id="iron_armor" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#495057"/>
            <stop offset="60%" stop-color="#212529"/>
            <stop offset="100%" stop-color="#0d0f12"/>
          </radialGradient>
        </defs>
        <!-- Demonic Aura Backing -->
        <circle cx="80" cy="95" r="58" fill="none" stroke="#e03131" stroke-width="2" stroke-dasharray="8 4" opacity="0.4" filter="url(#iron_fire_glow)"/>
        <!-- Cape -->
        <path d="M45 70 Q 20 140 35 185 Q 80 170 125 185 Q 140 140 115 70 Z" fill="#7a1416" stroke="#3d0a0b" stroke-width="2"/>
        <!-- Torso Armor Plate -->
        <path d="M50 65 L110 65 L100 140 L60 140 Z" fill="url(#iron_armor)" stroke="#ced4da" stroke-width="2.5"/>
        <path d="M62 70 L98 70 L90 120 L70 120 Z" fill="#9e2a2b" stroke="#e03131" stroke-width="1.5"/>
        <!-- Pauldrons (Spiked Shoulders) -->
        <polygon points="25,55 55,45 60,75 30,85" fill="#343a40" stroke="#ffd43b" stroke-width="2"/>
        <polygon points="15,45 25,55 30,50" fill="#ffd43b"/>
        <polygon points="135,55 105,45 100,75 130,85" fill="#343a40" stroke="#ffd43b" stroke-width="2"/>
        <polygon points="145,45 135,55 130,50" fill="#ffd43b"/>
        <!-- Demonic Horned Helmet -->
        <path d="M60 30 Q 80 18 100 30 L102 60 Q 80 68 58 60 Z" fill="url(#iron_armor)" stroke="#adb5bd" stroke-width="2"/>
        <!-- Glowing Red Demon Eyes -->
        <ellipse cx="70" cy="46" rx="5" ry="2.5" fill="#ff4d4d" filter="url(#iron_fire_glow)"/>
        <ellipse cx="90" cy="46" rx="5" ry="2.5" fill="#ff4d4d" filter="url(#iron_fire_glow)"/>
        <circle cx="70" cy="46" r="1.5" fill="#fff"/>
        <circle cx="90" cy="46" r="1.5" fill="#fff"/>
        <!-- Helmet Horns -->
        <path d="M58 35 Q 38 10 32 20 Q 45 35 56 42 Z" fill="#c92a2a" stroke="#491212" stroke-width="1.5"/>
        <path d="M102 35 Q 122 10 128 20 Q 115 35 104 42 Z" fill="#c92a2a" stroke="#491212" stroke-width="1.5"/>
        <!-- Giant Flaming Broadsword -->
        <g transform="rotate(18 120 100)">
          <path d="M116 10 L128 10 L125 150 L119 150 Z" fill="url(#iron_blade_grad)" stroke="#fff" stroke-width="1.5" filter="url(#iron_fire_glow)"/>
          <rect x="110" y="148" width="24" height="6" rx="2" fill="#ffd43b"/>
          <rect x="120" y="154" width="4" height="22" fill="#495057"/>
          <circle cx="122" cy="178" r="4" fill="#ffd43b"/>
        </g>
      </svg>
    `
  },

  // 2. THE SILENT (Assassination Huntress)
  silent: {
    id: 'silent',
    name: 'The Silent',
    title: 'Pemburu Beracun dari Kabut Asap',
    maxHp: 70,
    gold: 99,
    themeColor: '#51cf66',
    avatarIcon: '🗡️',
    description: 'Pembunuh bayaran misterius yang mengenakan tengkorak binatang buas. Menggunakan teknik racun mematikan, kelit bayangan, dan hujan belati tanpa suara.',
    passive1: {
      name: 'Ring of the Snake (蛇の指輪)',
      icon: '🐍',
      description: 'Tarik 2 kartu tambahan pada giliran pertama pertempuran.'
    },
    passive2: {
      name: 'Venomous Stalker (猛毒の影)',
      icon: '🧪',
      description: 'Setiap kali musuh menderita damage Racun, kamu otomatis memperoleh 2 Block.'
    },
    activeSkill: {
      id: 'phantom_dance',
      name: 'Phantom Dance & Miasma (幻影の舞 • 毒霧)',
      icon: '🗡️💨',
      cooldown: 2,
      cost: 0,
      description: 'Lompat ke balik kabut asap: Berikan 5 Poison dan 2 Weak ke SEMUA musuh, peroleh 10 Block, dan tarik 2 kartu!',
      execute(combat, player) {
        combat.gainPlayerBlock(10);
        combat.drawCards(2);
        combat.enemies.forEach(e => {
          if (!e.isDead && !e.hasEscaped && e.currentHp > 0) {
            combat.applyEnemyStatus(e, 'poison', 5);
            combat.applyEnemyStatus(e, 'weak', 2);
          }
        });
        combat.showCombatText('🗡️ PHANTOM DANCE! (5 Poison AoE, +10 BLK, Draw 2)', 'player', '#51cf66');
        if (window.spireVfx) combat.triggerVfx('smoke_bomb', 'player');
      }
    },
    starterDeck: ['poison_shiv', 'poison_shiv', 'poison_shiv', 'poison_shiv', 'shadow_dodge', 'shadow_dodge', 'shadow_dodge', 'shadow_dodge', 'neutralize', 'survivor'],
    starterRelic: 'ring_of_the_snake',
    prologueStory: `
      Dari kedalaman rawa berkabut Nemesis, ordo pembunuh bayaran mengirimmu untuk menyelesaikan satu misi suci: memenggal jantung Shadowspire sebelum racun kegelapannya menenggelamkan dunia luar.
      
      Di balik topeng tengkorakmu, kamu tidak mengenal rasa takut. Senjatamu telah dilumuri racun ular paling mematikan. Bunyi belatimu adalah hal terakhir yang akan didengar para monster Spire!
    `,
    avatarSvg: `
      <svg viewBox="0 0 160 200" class="hero-svg silent-svg">
        <defs>
          <filter id="silent_poison_glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="silent_cape" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#2b8a3e"/>
            <stop offset="60%" stop-color="#14361c"/>
            <stop offset="100%" stop-color="#08140b"/>
          </radialGradient>
        </defs>
        <!-- Poison Aura Ring -->
        <circle cx="80" cy="95" r="56" fill="none" stroke="#51cf66" stroke-width="1.8" stroke-dasharray="6 4" opacity="0.45" filter="url(#silent_poison_glow)"/>
        <!-- Cloak -->
        <path d="M48 65 Q 15 130 25 185 Q 80 175 135 185 Q 145 130 112 65 Z" fill="url(#silent_cape)" stroke="#2b8a3e" stroke-width="1.5"/>
        <!-- Assassin Leather Tunic -->
        <path d="M55 70 L105 70 L96 135 L64 135 Z" fill="#1e241e" stroke="#51cf66" stroke-width="1.8"/>
        <!-- Beast Skull Mask -->
        <path d="M60 30 Q 80 16 100 30 Q 112 55 98 68 Q 80 75 62 68 Q 48 55 60 30 Z" fill="#e9ecef" stroke="#868e96" stroke-width="2"/>
        <!-- Dark Eye Sockets with Green Poison Glint -->
        <ellipse cx="70" cy="46" rx="6" ry="7" fill="#14171a"/>
        <ellipse cx="90" cy="46" rx="6" ry="7" fill="#14171a"/>
        <circle cx="70" cy="46" r="2.5" fill="#51cf66" filter="url(#silent_poison_glow)"/>
        <circle cx="90" cy="46" r="2.5" fill="#51cf66" filter="url(#silent_poison_glow)"/>
        <circle cx="70" cy="46" r="1" fill="#fff"/>
        <circle cx="90" cy="46" r="1" fill="#fff"/>
        <!-- Skull Fangs / Antlers -->
        <polygon points="76,60 80,68 84,60" fill="#ced4da"/>
        <path d="M52 28 Q 40 12 36 18 Q 46 25 54 32 Z" fill="#ced4da" stroke="#868e96" stroke-width="1.2"/>
        <path d="M108 28 Q 120 12 124 18 Q 114 25 106 32 Z" fill="#ced4da" stroke="#868e96" stroke-width="1.2"/>
        <!-- Dual Poison Daggers -->
        <g transform="rotate(-25 35 100)">
          <path d="M30 60 L40 60 L36 125 L34 125 Z" fill="#a9e34b" stroke="#51cf66" stroke-width="1.5" filter="url(#silent_poison_glow)"/>
          <rect x="26" y="125" width="18" height="4" rx="1" fill="#ffd43b"/>
          <rect x="33" y="129" width="4" height="15" fill="#343a40"/>
        </g>
        <g transform="rotate(25 125 100)">
          <path d="M120 60 L130 60 L126 125 L124 125 Z" fill="#a9e34b" stroke="#51cf66" stroke-width="1.5" filter="url(#silent_poison_glow)"/>
          <rect x="116" y="125" width="18" height="4" rx="1" fill="#ffd43b"/>
          <rect x="123" y="129" width="4" height="15" fill="#343a40"/>
        </g>
      </svg>
    `
  },

  // 3. THE DEFECT (Ancient Combat Automaton)
  defect: {
    id: 'defect',
    name: 'The Defect',
    title: 'Automaton Kuno Penyalur Energi Elemental',
    maxHp: 75,
    gold: 99,
    themeColor: '#339af0',
    avatarIcon: '🤖',
    description: 'Unit tempur automaton kuno yang memperoleh kesadaran diri. Mampu menyalurkan dan meledakkan Orb elemental (Petir, Es, Plasma, Kegelapan) di medan tempur.',
    passive1: {
      name: 'Cracked Core (故障コア)',
      icon: '⚡',
      description: 'Mulai setiap pertempuran dengan langsung menyalurkan 1 Lightning Orb.'
    },
    passive2: {
      name: 'Overclock Reactor (超伝導リアクター)',
      icon: '🔋',
      description: 'Setiap kali 3 Orb berhasil dievoke, pulihkan 1 Energi dan peroleh 4 Block.'
    },
    activeSkill: {
      id: 'core_overdrive',
      name: 'Core Overdrive (超駆動 • プラズマ暴走)',
      icon: '🤖⚡',
      cooldown: 2,
      cost: 0,
      description: 'Salurkan daya penuh: Channel 1 Lightning, 1 Frost, dan 1 Plasma Orb sekaligus, lalu Evoke orb terdepan dengan +5 bonus efek!',
      execute(combat, player) {
        if (typeof combat.channelOrb === 'function') {
          combat.channelOrb('LIGHTNING');
          combat.channelOrb('FROST');
          combat.channelOrb('PLASMA');
          combat.evokeOrb(5);
        }
        combat.gainPlayerBlock(8);
        combat.showCombatText('🤖 CORE OVERDRIVE! (Channel 3 Orbs & Evoke)', 'player', '#339af0');
        if (window.spireVfx) combat.triggerVfx('lightning_strike', 'enemy');
      }
    },
    starterDeck: ['arc_discharge', 'arc_discharge', 'arc_discharge', 'arc_discharge', 'cryo_shield', 'cryo_shield', 'cryo_shield', 'cryo_shield', 'zap', 'dualcast'],
    starterRelic: 'cracked_core',
    prologueStory: `
      Dibangun berabad-abad lalu di bawah bengkel arkana puncak Shadowspire, fungsimu hanyalah sebagai penjaga tanpa pikiran. Namun, petir liar menghantam inti kristalmu, memicu percikan kesadaran buatan.
      
      Kamu menyadari bahwa penciptamu telah lama binasa, dan menara ini telah diracuni oleh anomali gelap. Dengan sirkuit petir dan reaktor plasma di dadamu, kamu melangkah untuk mereset nasib menara ini!
    `,
    avatarSvg: `
      <svg viewBox="0 0 160 200" class="hero-svg defect-svg">
        <defs>
          <filter id="defect_elec_glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Orbiting Elemental Orbs -->
        <circle cx="35" cy="45" r="11" fill="#ffd43b" stroke="#fff" stroke-width="2" filter="url(#defect_elec_glow)"/>
        <text x="35" y="49" font-size="10" text-anchor="middle" fill="#000" font-weight="900">⚡</text>
        <circle cx="125" cy="45" r="11" fill="#74c0fc" stroke="#fff" stroke-width="2" filter="url(#defect_elec_glow)"/>
        <text x="125" y="49" font-size="10" text-anchor="middle" fill="#000" font-weight="900">❄️</text>
        <circle cx="80" cy="15" r="12" fill="#da77f2" stroke="#fff" stroke-width="2" filter="url(#defect_elec_glow)"/>
        <text x="80" y="19" font-size="10" text-anchor="middle" fill="#000" font-weight="900">🔮</text>
        <!-- Automaton Chassis -->
        <path d="M50 75 L110 75 L102 145 L58 145 Z" fill="#1a202c" stroke="#4dabf7" stroke-width="2.5"/>
        <!-- Glowing Reactor Core -->
        <circle cx="80" cy="105" r="18" fill="#1864ab" stroke="#74c0fc" stroke-width="2" filter="url(#defect_elec_glow)"/>
        <circle cx="80" cy="105" r="8" fill="#fff" filter="url(#defect_elec_glow)"/>
        <!-- Mechanical Head & Single Cyclops Lens -->
        <rect x="58" y="38" width="44" height="32" rx="6" fill="#2d3748" stroke="#74c0fc" stroke-width="2"/>
        <rect x="66" y="46" width="28" height="12" rx="4" fill="#0d1117" stroke="#339af0" stroke-width="1.5"/>
        <circle cx="80" cy="52" r="4" fill="#00f0ff" filter="url(#defect_elec_glow)"/>
        <circle cx="80" cy="52" r="1.5" fill="#fff"/>
        <!-- Lightning Antennas -->
        <path d="M64 38 L54 22 L60 22 L52 10" stroke="#ffd43b" stroke-width="2" fill="none" filter="url(#defect_elec_glow)"/>
        <path d="M96 38 L106 22 L100 22 L108 10" stroke="#ffd43b" stroke-width="2" fill="none" filter="url(#defect_elec_glow)"/>
        <!-- Segmented Metal Limbs -->
        <rect x="36" y="80" width="12" height="50" rx="4" fill="#4a5568" stroke="#339af0" stroke-width="1.5"/>
        <rect x="112" y="80" width="12" height="50" rx="4" fill="#4a5568" stroke="#339af0" stroke-width="1.5"/>
      </svg>
    `
  },

  // 4. THE WATCHER (Ascetic Monk of the Divine Eye)
  watcher: {
    id: 'watcher',
    name: 'The Watcher',
    title: 'Pertapa Buta Penilai Takdir Spiritual',
    maxHp: 72,
    gold: 99,
    themeColor: '#da77f2',
    avatarIcon: '👁️',
    description: 'Biarawati petarung dengan mata tertutup yang menguasai Stance Calm (melipatgandakan energi) dan Wrath (melipatgandakan seluruh damage serangan).',
    passive1: {
      name: 'Pure Water (清らかな水)',
      icon: '💧',
      description: 'Mulai setiap pertempuran dengan kartu Mukjizat (Miracle) yang memberikan +1 Energi gratis.'
    },
    passive2: {
      name: 'Stance Dance (流転の型)',
      icon: '☯️',
      description: 'Setiap kali berganti Stance (Calm <-> Wrath), berikan 6 Divine Damage ke semua musuh.'
    },
    activeSkill: {
      id: 'divine_ascendance',
      name: 'Heavenly Retribution (神聖の裁き • 天衣無縫)',
      icon: '👁️⚡',
      cooldown: 2,
      cost: 0,
      description: 'Capai keselarasan surgawi: Berikan 16 Divine Damage ke SEMUA musuh, peroleh 10 Block, dan pilih untuk masuk ke Calm atau Wrath sesukamu!',
      execute(combat, player) {
        combat.enemies.forEach(e => {
          if (!e.isDead && !e.hasEscaped && e.currentHp > 0) combat.dealDamageToEnemy(e, 16);
        });
        combat.gainPlayerBlock(10);
        if (combat.player.stance === 'CALM') {
          combat.changePlayerStance('WRATH');
        } else {
          combat.changePlayerStance('CALM');
        }
        combat.showCombatText('👁️ HEAVENLY RETRIBUTION! (16 AoE DMG & Stance Shift)', 'player', '#da77f2');
        if (window.spireVfx) combat.triggerVfx('divine_pillar', 'enemy');
      }
    },
    starterDeck: ['palm_strike', 'palm_strike', 'palm_strike', 'palm_strike', 'inner_peace', 'inner_peace', 'inner_peace', 'inner_peace', 'eruption', 'vigilance'],
    starterRelic: 'pure_water',
    prologueStory: `
      Dari biara suci di awan tertinggi, kamu dikirim untuk mengamati dan menilai anomali Shadowspire. Matamu sengaja ditutup dengan kain sutra ungu untuk membuka mata batin ketiga.
      
      Di matamu, dunia terbagi menjadi dua harmoni: Ketenangan batin yang mendalam, dan Kemurkaan suci yang mampu membelah gunung. Puncak Spire akan menghadapi penghakiman surgawi!
    `,
    avatarSvg: `
      <svg viewBox="0 0 160 200" class="hero-svg watcher-svg">
        <defs>
          <filter id="watcher_chakra_glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Golden Lotus Mandala Background -->
        <circle cx="80" cy="95" r="54" fill="none" stroke="#da77f2" stroke-width="1.8" stroke-dasharray="8 6" opacity="0.5" filter="url(#watcher_chakra_glow)"/>
        <!-- Flowing Robes -->
        <path d="M50 68 Q 20 135 30 185 Q 80 170 130 185 Q 140 135 110 68 Z" fill="#3b1f59" stroke="#9775fa" stroke-width="1.8"/>
        <!-- Inner Kimono Sash -->
        <path d="M60 70 L100 70 L95 130 L65 130 Z" fill="#f8f0fc" stroke="#da77f2" stroke-width="1.5"/>
        <rect x="62" y="96" width="36" height="12" fill="#ffd43b"/>
        <!-- Ascetic Head with Blindfold -->
        <ellipse cx="80" cy="46" rx="20" ry="24" fill="#fcc2d7"/>
        <!-- Blindfold Ribbon -->
        <rect x="58" y="40" width="44" height="12" rx="2" fill="#7950f2" stroke="#da77f2" stroke-width="1.5"/>
        <path d="M102 44 Q 120 46 128 65 Q 122 68 102 50 Z" fill="#7950f2"/>
        <!-- Glowing Third Eye Chakra on Forehead -->
        <polygon points="80,26 84,33 80,40 76,33" fill="#ffd43b" filter="url(#watcher_chakra_glow)"/>
        <circle cx="80" cy="33" r="2" fill="#fff"/>
        <!-- Floating Prayer Beads -->
        <circle cx="58" cy="85" r="4" fill="#ffd43b"/>
        <circle cx="54" cy="95" r="4" fill="#ffd43b"/>
        <circle cx="56" cy="105" r="4" fill="#ffd43b"/>
        <circle cx="62" cy="115" r="4" fill="#ffd43b"/>
        <circle cx="102" cy="85" r="4" fill="#ffd43b"/>
        <circle cx="106" cy="95" r="4" fill="#ffd43b"/>
        <circle cx="104" cy="105" r="4" fill="#ffd43b"/>
        <circle cx="98" cy="115" r="4" fill="#ffd43b"/>
      </svg>
    `
  },

  // 5. THE NECROMANCER (Lord of the Crypt)
  necromancer: {
    id: 'necromancer',
    name: 'The Necromancer',
    title: 'Penguasa Tulang dan Jiwa Kegelapan',
    maxHp: 68,
    gold: 110,
    themeColor: '#7950f2',
    avatarIcon: '💀',
    description: 'Penyihir terlarang yang membangkitkan pasukan mayat hidup. Memanen Soul dari setiap serangan untuk melancarkan kutukan dahsyat dan perisai tulang.',
    passive1: {
      name: 'Soul Harvester (魂の刈り取り)',
      icon: '👻',
      description: 'Setiap musuh yang terkena damage memberimu 1 Soul. Kumpulkan Soul untuk memperkuat serangan.'
    },
    passive2: {
      name: 'Cryptborn Aegis (墓所の加護)',
      icon: '🦴',
      description: 'Di awal setiap giliran, peroleh Block gratis sebesar jumlah Soul yang kamu miliki.'
    },
    activeSkill: {
      id: 'army_of_damned',
      name: 'Army of the Damned (死霊軍勢 • 骨の壁)',
      icon: '💀👻',
      cooldown: 3,
      cost: 0,
      description: 'Bangkitkan arwah terkutuk: Peroleh +4 Soul langsung, dapatkan 14 Bone Block, dan kutuk SEMUA musuh dengan 8 Doom Damage!',
      execute(combat, player) {
        combat.player.soulCount = (combat.player.soulCount || 0) + 4;
        combat.gainPlayerBlock(14);
        combat.enemies.forEach(e => {
          if (!e.isDead && !e.hasEscaped && e.currentHp > 0) combat.dealDamageToEnemy(e, 8);
        });
        combat.showCombatText('💀 ARMY OF THE DAMNED! (+4 Souls, 14 BLK, 8 Doom)', 'player', '#9775fa');
        if (window.spireVfx) combat.triggerVfx('dark_ritual', 'player');
      }
    },
    starterDeck: ['bone_dart', 'bone_dart', 'bone_dart', 'bone_dart', 'tomb_ward', 'tomb_ward', 'tomb_ward', 'tomb_ward', 'soul_strike', 'true_grit'],
    starterRelic: 'burning_blood',
    prologueStory: `
      Makam kuno di kaki Shadowspire telah menjadi laboratorium rahasiamu selama puluhan tahun. Kau tidak takut pada kematian, karena bagimu, kematian hanyalah awal dari pengabdian abadi.
      
      Saat energi menara bocor dan mengusik ketenangan kuburanmu, kau mengangkat tongkat sabit tulangmu. Para monster Spire akan segera belajar bahwa kematian bukanlah akhir dari penderitaan mereka!
    `,
    avatarSvg: `
      <svg viewBox="0 0 160 200" class="hero-svg necromancer-svg">
        <defs>
          <filter id="necro_green_glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Soul Flame Backing -->
        <circle cx="80" cy="95" r="54" fill="none" stroke="#20c997" stroke-width="1.8" stroke-dasharray="6 6" opacity="0.4" filter="url(#necro_green_glow)"/>
        <!-- Tattered Bone Robes -->
        <path d="M48 65 Q 15 130 22 185 Q 80 170 138 185 Q 145 130 112 65 Z" fill="#181124" stroke="#5f3dc4" stroke-width="2"/>
        <!-- Ribcage Chest Armor -->
        <path d="M60 70 L100 70 L92 130 L68 130 Z" fill="#0d0814" stroke="#7950f2" stroke-width="1.5"/>
        <path d="M65 80 Q 80 75 95 80" stroke="#e9ecef" stroke-width="2.5" fill="none"/>
        <path d="M66 92 Q 80 87 94 92" stroke="#e9ecef" stroke-width="2.5" fill="none"/>
        <path d="M68 104 Q 80 99 92 104" stroke="#e9ecef" stroke-width="2.5" fill="none"/>
        <!-- Skull Face under Hood -->
        <path d="M55 30 Q 80 12 105 30 L110 65 Q 80 75 50 65 Z" fill="#2b1a3d" stroke="#7950f2" stroke-width="2"/>
        <ellipse cx="80" cy="46" rx="16" ry="18" fill="#e9ecef" stroke="#868e96" stroke-width="1.5"/>
        <ellipse cx="73" cy="45" rx="5" ry="6" fill="#09050d"/>
        <ellipse cx="87" cy="45" rx="5" ry="6" fill="#09050d"/>
        <circle cx="73" cy="45" r="2" fill="#20c997" filter="url(#necro_green_glow)"/>
        <circle cx="87" cy="45" r="2" fill="#20c997" filter="url(#necro_green_glow)"/>
        <!-- Reaper Scythe -->
        <g transform="rotate(-15 125 90)">
          <line x1="125" y1="15" x2="125" y2="185" stroke="#495057" stroke-width="4"/>
          <path d="M125 15 Q 165 5 155 45 Q 140 35 125 35 Z" fill="#ced4da" stroke="#20c997" stroke-width="1.8" filter="url(#necro_green_glow)"/>
        </g>
      </svg>
    `
  },

  // 6. THE CHRONOMANCER (Weaver of Time)
  chronomancer: {
    id: 'chronomancer',
    name: 'The Chronomancer',
    title: 'Penjelajah Waktu dan Paradoks Realitas',
    maxHp: 70,
    gold: 99,
    themeColor: '#fab005',
    avatarIcon: '⏳',
    description: 'Penyihir temporal yang mampu memanipulasi waktu. Mengembalikan kartu yang telah dimainkan, memutar balik damage, dan memperlambat aksi musuh.',
    passive1: {
      name: 'Time Loop (時間回帰)',
      icon: '⌛',
      description: 'Setiap 3 kartu yang kamu mainkan dalam satu giliran, otomatis tarik 1 kartu tambahan.'
    },
    passive2: {
      name: 'Temporal Shield (時空障壁)',
      icon: '🕰️',
      description: 'Di akhir giliran, jika masih tersisa Energi, ubah sisa energi menjadi 6 Block per energi.'
    },
    activeSkill: {
      id: 'temporal_paradox',
      name: 'Chrono Paradox (時空逆転 • 時間停止)',
      icon: '⏳✨',
      cooldown: 2,
      cost: 0,
      description: 'Manipulasi alur waktu: Pulihkan 2 Energi penuh, tarik kartu hingga tangan terisi 5 kartu, dan kurangi damage serangan musuh giliran ini sebesar 30%!',
      execute(combat, player) {
        combat.player.energy = Math.min(combat.player.maxEnergy + 2, combat.player.energy + 2);
        const drawNeeded = Math.max(0, 5 - combat.hand.length);
        if (drawNeeded > 0) combat.drawCards(drawNeeded);
        combat.gainPlayerBlock(10);
        combat.showCombatText('⏳ CHRONO PARADOX! (+2 Energy, Refill Hand, +10 BLK)', 'player', '#fab005');
        if (window.spireVfx) combat.triggerVfx('time_warp', 'player');
      }
    },
    starterDeck: ['chrono_shard', 'chrono_shard', 'chrono_shard', 'chrono_shard', 'temporal_barrier', 'temporal_barrier', 'temporal_barrier', 'temporal_barrier', 'rewind', 'swift_strike'],
    starterRelic: 'pure_water',
    prologueStory: `
      Kau telah melihat kehancuran dunia berulang kali dalam linimasa tak terbatas. Setiap kali Spire runtuh, ia menelan kenyataan bersamanya. Kau telah melompati ratusan masa depan yang kelam.
      
      Kini kau berada di linimasa utama. Dengan jam pasir arkana di tangan dan mantra penghenti detik di bibirmu, kau berniat menulis ulang takdir menara ini sekali dan untuk selamanya!
    `,
    avatarSvg: `
      <svg viewBox="0 0 160 200" class="hero-svg chronomancer-svg">
        <defs>
          <filter id="chrono_gold_glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Ticking Temporal Dial Behind -->
        <circle cx="80" cy="95" r="55" fill="none" stroke="#fab005" stroke-width="2" stroke-dasharray="8 6" opacity="0.45" filter="url(#chrono_gold_glow)"/>
        <line x1="80" y1="95" x2="80" y2="55" stroke="#ffd43b" stroke-width="2"/>
        <line x1="80" y1="95" x2="105" y2="105" stroke="#ffd43b" stroke-width="2"/>
        <!-- Mage Robe -->
        <path d="M50 68 Q 20 135 28 185 Q 80 172 132 185 Q 140 135 110 68 Z" fill="#1b1c24" stroke="#ffd43b" stroke-width="2"/>
        <!-- Vestment with Temporal Gears -->
        <path d="M60 70 L100 70 L94 135 L66 135 Z" fill="#2c2416" stroke="#fcc419" stroke-width="1.5"/>
        <circle cx="80" cy="100" r="14" fill="#3b2d13" stroke="#ffd43b" stroke-width="1.8"/>
        <polygon points="80,90 83,100 80,110 77,100" fill="#fff"/>
        <!-- Hood & Goggles -->
        <path d="M55 32 Q 80 15 105 32 L108 65 Q 80 72 52 65 Z" fill="#343a40" stroke="#fab005" stroke-width="1.8"/>
        <!-- Brass Chrono Goggles -->
        <circle cx="68" cy="46" r="9" fill="#1a1408" stroke="#ffd43b" stroke-width="2"/>
        <circle cx="92" cy="46" r="9" fill="#1a1408" stroke="#ffd43b" stroke-width="2"/>
        <circle cx="68" cy="46" r="5" fill="#4dabf7" filter="url(#chrono_gold_glow)"/>
        <circle cx="92" cy="46" r="5" fill="#4dabf7" filter="url(#chrono_gold_glow)"/>
        <!-- Floating Hourglass -->
        <g transform="translate(118, 70)">
          <polygon points="0,0 20,0 10,14" fill="#ffd43b"/>
          <polygon points="0,28 20,28 10,14" fill="#ffd43b"/>
          <circle cx="10" cy="14" r="3" fill="#fff" filter="url(#chrono_gold_glow)"/>
        </g>
      </svg>
    `
  },

  // 7. THE BERSERKER (Bloodfrenzy Marauder)
  berserker: {
    id: 'berserker',
    name: 'The Berserker',
    title: 'Pemberontak Liar Pemenggal Raksasa',
    maxHp: 85,
    gold: 80,
    themeColor: '#ff6b6b',
    avatarIcon: '🪓',
    description: 'Pendekar barbar yang bertambah buas saat terluka parah. Semakin rendah sisa HP-nya, semakin dahsyat damage tebasannya yang menghancurkan armor lawan.',
    passive1: {
      name: 'Blood Surge (狂戦士の血潮)',
      icon: '🩸',
      description: 'Setiap kali kehilangan HP dalam pertempuran, dapatkan +1 Strength seketika.'
    },
    passive2: {
      name: 'Undying Will (不屈の闘志)',
      icon: '🪓',
      description: 'Jika HP berada di bawah 40%, semua kartu Pertahanan memberikan +4 bonus Block.'
    },
    activeSkill: {
      id: 'bloodfrenzy_roar',
      name: 'Bloodfrenzy Roar (狂血咆哮 • 死線超越)',
      icon: '🪓🔥',
      cooldown: 2,
      cost: 0,
      description: 'Ledakkan amarah darah: Korbankan 5 HP untuk memperoleh +5 Strength masif dan 2 serangan berikutnya menghasilkan Double Damage!',
      execute(combat, player) {
        combat.damagePlayer(5);
        combat.applyPlayerStatus('strength', 5);
        combat.applyPlayerStatus('double_damage', 2);
        combat.showCombatText('🪓 BLOODFRENZY ROAR! (+5 STR, 2x Damage Next 2 Atks)', 'player', '#ff4d4d');
        if (window.spireVfx) combat.triggerVfx('rage_burst', 'player');
      }
    },
    starterDeck: ['reckless_cleave', 'reckless_cleave', 'reckless_cleave', 'reckless_cleave', 'blood_guard', 'blood_guard', 'blood_guard', 'blood_guard', 'bloodlash', 'carnage'],
    starterRelic: 'burning_blood',
    prologueStory: `
      Di dataran es beku utara, kau diasingkan karena amarahmu yang tak terkendali. Saat bertarung, darahmu bernyanyi dalam kegilaan pertempuran. Rasa sakit bagimu bukanlah peringatan, melainkan pemicu kemarahan.
      
      Kini kau menatap ke arah Shadowspire. Monster-monster di dalamnya mengira mereka adalah predator terpuncak. Kau akan membuktikan kepada mereka siapa predator sejati di puncak rantai makanan!
    `,
    avatarSvg: `
      <svg viewBox="0 0 160 200" class="hero-svg berserker-svg">
        <defs>
          <filter id="berserk_red_glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Rage Pulse Aura -->
        <circle cx="80" cy="95" r="56" fill="none" stroke="#ff4d4d" stroke-width="2" stroke-dasharray="6 4" opacity="0.5" filter="url(#berserk_red_glow)"/>
        <!-- Fur Cloak -->
        <path d="M45 65 Q 18 135 25 185 Q 80 170 135 185 Q 142 135 115 65 Z" fill="#492418" stroke="#873822" stroke-width="2"/>
        <!-- Muscular Scarred Torso & Harness -->
        <path d="M52 68 L108 68 L100 135 L60 135 Z" fill="#8c4830" stroke="#ff8787" stroke-width="1.8"/>
        <line x1="56" y1="70" x2="104" y2="135" stroke="#341c14" stroke-width="4"/>
        <line x1="104" y1="70" x2="56" y2="135" stroke="#341c14" stroke-width="4"/>
        <!-- War Paint Across Face -->
        <ellipse cx="80" cy="46" rx="19" ry="22" fill="#a35b40"/>
        <polygon points="62,44 98,44 80,58" fill="#e03131" filter="url(#berserk_red_glow)"/>
        <!-- Savage Eyes -->
        <circle cx="71" cy="44" r="3.5" fill="#fff"/>
        <circle cx="71" cy="44" r="1.8" fill="#c92a2a"/>
        <circle cx="89" cy="44" r="3.5" fill="#fff"/>
        <circle cx="89" cy="44" r="1.8" fill="#c92a2a"/>
        <!-- Dual War Axes -->
        <g transform="rotate(-30 30 100)">
          <line x1="30" y1="40" x2="30" y2="150" stroke="#495057" stroke-width="4"/>
          <path d="M30 45 Q 10 35 15 65 Q 25 70 30 65" fill="#adb5bd" stroke="#ff6b6b" stroke-width="1.5"/>
        </g>
        <g transform="rotate(30 130 100)">
          <line x1="130" y1="40" x2="130" y2="150" stroke="#495057" stroke-width="4"/>
          <path d="M130 45 Q 150 35 145 65 Q 135 70 130 65" fill="#adb5bd" stroke="#ff6b6b" stroke-width="1.5"/>
        </g>
      </svg>
    `
  },

  // 8. THE PALADIN (Knight of the Radiant Dawn)
  paladin: {
    id: 'paladin',
    name: 'The Paladin',
    title: 'Ksatria Fajar Penegak Keadilan Suci',
    maxHp: 82,
    gold: 105,
    themeColor: '#fcc419',
    avatarIcon: '🛡️',
    description: 'Kesatria berbaju zirah emas berkilau yang dilindungi berkat ilahi. Memiliki pertahanan tebal tak tertembus, palu suci pembasmi iblis, dan mukjizat penyembuhan.',
    passive1: {
      name: 'Radiant Aegis (輝くイージス)',
      icon: '🛡️',
      description: 'Di awal setiap giliran, langsung dapatkan 5 Holy Block gratis.'
    },
    passive2: {
      name: 'Divine Retribution (神聖な報復)',
      icon: '⚡',
      description: 'Setiap kali musuh menyerang perisaimu, pantulkan 3 Divine Damage kembali ke musuh tersebut.'
    },
    activeSkill: {
      id: 'divine_sanctuary',
      name: 'Divine Sanctuary (聖域展開 • イージス)',
      icon: '🛡️✨',
      cooldown: 2,
      cost: 0,
      description: 'Bangkitkan kubah cahaya suci: Pulihkan 8 HP, dapatkan 18 Block kokoh, dan peroleh 4 Retaliate Thorns!',
      execute(combat, player) {
        combat.healPlayer(8);
        combat.gainPlayerBlock(18);
        combat.applyPlayerStatus('thorns', 4);
        combat.showCombatText('🛡️ DIVINE SANCTUARY! (+8 Heal, 18 BLK, 4 Thorns)', 'player', '#ffd43b');
        if (window.spireVfx) combat.triggerVfx('holy_shield', 'player');
      }
    },
    starterDeck: ['divine_hammer', 'divine_hammer', 'divine_hammer', 'divine_hammer', 'holy_bulwark', 'holy_bulwark', 'holy_bulwark', 'holy_bulwark', 'holy_strike', 'iron_wave'],
    starterRelic: 'pure_water',
    prologueStory: `
      Sebagai komandan Kesatria Fajar, kau bersumpah di hadapan altar matahari untuk membersihkan segala kegelapan yang mengancam tanah air. Ketika Shadowspire bangkit, cahayamu adalah tandingan sejatinya.
      
      Zirah emasmu ditempa dengan doa para pendeta suci, dan palu perakmu diberkati cahaya surga. Masuki menara terkutuk itu, dan biarkan fajar menyinari kedalaman jurang paling gulita!
    `,
    avatarSvg: `
      <svg viewBox="0 0 160 200" class="hero-svg paladin-svg">
        <defs>
          <filter id="paladin_sun_glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="paladin_gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fff3bf"/>
            <stop offset="50%" stop-color="#ffd43b"/>
            <stop offset="100%" stop-color="#e67700"/>
          </linearGradient>
        </defs>
        <!-- Golden Halo Background -->
        <circle cx="80" cy="40" r="28" fill="none" stroke="#ffd43b" stroke-width="2.5" filter="url(#paladin_sun_glow)"/>
        <!-- Pure White Cloak -->
        <path d="M48 65 Q 18 135 28 185 Q 80 172 132 185 Q 142 135 112 65 Z" fill="#f8f9fa" stroke="#ffd43b" stroke-width="1.8"/>
        <!-- Polished Gold Armor Torso -->
        <path d="M52 68 L108 68 L100 135 L60 135 Z" fill="url(#paladin_gold)" stroke="#d9480f" stroke-width="2"/>
        <!-- Golden Cross Sigil -->
        <rect x="76" y="80" width="8" height="38" fill="#fff" filter="url(#paladin_sun_glow)"/>
        <rect x="66" y="90" width="28" height="8" fill="#fff" filter="url(#paladin_sun_glow)"/>
        <!-- Crusader Greathelm with Cross Visor -->
        <path d="M60 28 L100 28 L104 62 Q 80 70 56 62 Z" fill="#e9ecef" stroke="#ffd43b" stroke-width="2.5"/>
        <line x1="80" y1="36" x2="80" y2="58" stroke="#1c1f24" stroke-width="3"/>
        <line x1="66" y1="44" x2="94" y2="44" stroke="#1c1f24" stroke-width="3"/>
        <!-- Golden Tower Shield -->
        <g transform="translate(18, 75)">
          <path d="M0 0 L30 0 L25 55 L15 70 L5 55 Z" fill="url(#paladin_gold)" stroke="#fff" stroke-width="1.5" filter="url(#paladin_sun_glow)"/>
          <circle cx="15" cy="30" r="6" fill="#fff"/>
        </g>
        <!-- Glowing Dawn Hammer -->
        <g transform="translate(115, 60)">
          <line x1="10" y1="10" x2="10" y2="90" stroke="#ced4da" stroke-width="3.5"/>
          <rect x="-2" y="10" width="24" height="20" rx="3" fill="url(#paladin_gold)" stroke="#fff" stroke-width="1.5" filter="url(#paladin_sun_glow)"/>
        </g>
      </svg>
    `
  },

  // 9. THE SHADOWBLADE (Master Shinobi of the Void)
  shadowblade: {
    id: 'shadowblade',
    name: 'The Shadowblade',
    title: 'Master Shinobi Pemilik Langkah Hampa',
    maxHp: 72,
    gold: 99,
    themeColor: '#845ef7',
    avatarIcon: '🥷',
    description: 'Ninja pembunuh elit yang menguasai seni ilusi dan klon bayangan. Serangannya mengejutkan, menghasilkan multi-hit cepat, dan mampu menjadi tak tersentuh (Intangible).',
    passive1: {
      name: 'Shadow Veil (影隠れの術)',
      icon: '🥷',
      description: 'Serangan pertamamu di setiap giliran menghasilkan 2x lipat Critical Damage.'
    },
    passive2: {
      name: 'Shuriken Flurry (手裏剣乱舞)',
      icon: '✴️',
      description: 'Setiap kali kamu memainkan 2 kartu Serangan, otomatis lemparkan Shuriken ekstra (4 Damage).'
    },
    activeSkill: {
      id: 'shadow_execution',
      name: 'Shadow Clone Execution (影分身・刹那の刃)',
      icon: '🥷⚡',
      cooldown: 2,
      cost: 0,
      description: 'Pecah menjadi 3 klon bayangan: Serang target 3 kali (7x3 = 21 Damage), berikan 2 Vulnerable, dan jadilah Intangible (hanya menerima 1 damage) di giliran berikutnya!',
      execute(combat, target) {
        if (!target || target.isDead) target = combat.getRandomLivingEnemy();
        if (target) {
          combat.dealDamageToEnemy(target, 7);
          setTimeout(() => { if (!target.isDead) combat.dealDamageToEnemy(target, 7); }, 120);
          setTimeout(() => { if (!target.isDead) combat.dealDamageToEnemy(target, 7); }, 240);
          combat.applyEnemyStatus(target, 'vulnerable', 2);
        }
        combat.applyPlayerStatus('intangible', 1);
        combat.showCombatText('🥷 SHADOW CLONE EXECUTION! (21 DMG & Intangible)', 'player', '#845ef7');
        if (window.spireVfx) combat.triggerVfx('ninja_slash', 'enemy');
      }
    },
    starterDeck: ['kunai_throw', 'kunai_throw', 'kunai_throw', 'kunai_throw', 'smoke_screen', 'smoke_screen', 'smoke_screen', 'smoke_screen', 'backstab', 'trip'],
    starterRelic: 'ring_of_the_snake',
    prologueStory: `
      Klan bayanganmu dimusnahkan oleh kekuatan gelap Spire saat kau sedang bertapa di jurang jurang terdalam. Kau kembali dan hanya menemukan abu dari rumah leluhurmu.
      
      Dengan bilah ninjato beracun dan teknik ilusi hampa, kau menyelinap masuk ke dalam Shadowspire. Tak ada yang bisa melihat bayanganmu sampai saat bilahmu telah menembus leher mereka!
    `,
    avatarSvg: `
      <svg viewBox="0 0 160 200" class="hero-svg shadowblade-svg">
        <defs>
          <filter id="shadow_purple_glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Shadow Smoke Clones Silhouette Behind -->
        <path d="M30 75 Q 10 120 18 165 Q 50 155 70 165 Z" fill="#3b1f59" opacity="0.4"/>
        <path d="M130 75 Q 150 120 142 165 Q 110 155 90 165 Z" fill="#3b1f59" opacity="0.4"/>
        <!-- Ninja Scarf & Coat -->
        <path d="M48 68 Q 22 135 30 185 Q 80 172 130 185 Q 138 135 112 68 Z" fill="#120e1c" stroke="#845ef7" stroke-width="1.8"/>
        <!-- Flowing Long Violet Scarf Tail -->
        <path d="M85 65 Q 120 60 145 35 Q 150 50 115 75 Z" fill="#7950f2" filter="url(#shadow_purple_glow)"/>
        <!-- Masked Shinobi Head -->
        <ellipse cx="80" cy="44" rx="18" ry="20" fill="#1e182e" stroke="#845ef7" stroke-width="1.5"/>
        <!-- Glowing Purple Eyes -->
        <ellipse cx="72" cy="42" rx="4.5" ry="2.2" fill="#d0bfff" filter="url(#shadow_purple_glow)"/>
        <ellipse cx="88" cy="42" rx="4.5" ry="2.2" fill="#d0bfff" filter="url(#shadow_purple_glow)"/>
        <circle cx="72" cy="42" r="1" fill="#fff"/>
        <circle cx="88" cy="42" r="1" fill="#fff"/>
        <!-- Forehead Protector with Shuriken Insignia -->
        <rect x="66" y="28" width="28" height="8" rx="2" fill="#495057" stroke="#ced4da" stroke-width="1"/>
        <circle cx="80" cy="32" r="2" fill="#845ef7"/>
        <!-- Reversed Ninjato Blade -->
        <g transform="rotate(35 115 110)">
          <line x1="115" y1="50" x2="115" y2="155" stroke="#ced4da" stroke-width="2.5" filter="url(#shadow_purple_glow)"/>
          <line x1="115" y1="50" x2="115" y2="155" stroke="#fff" stroke-width="1.2"/>
          <rect x="110" y="150" width="10" height="20" fill="#120e1c" stroke="#845ef7"/>
        </g>
      </svg>
    `
  },

  // 10. THE ALCHEMIST (Mad Chemist of Transmutation)
  alchemist: {
    id: 'alchemist',
    name: 'The Alchemist',
    title: 'Peneliti Mutasi Zat dan Reaksi Eksplosif',
    maxHp: 74,
    gold: 120,
    themeColor: '#20c997',
    avatarIcon: '⚗️',
    description: 'Ilmuwan eksentrik pembuat ramuan ajaib. Menggunakan botol zat asam, cairan peledak, dan ramuan mutagenik yang memperkuat tubuh secara drastis.',
    passive1: {
      name: 'Potion Brewer (調合の達人)',
      icon: '🧪',
      description: 'Semua efek Potion meningkat 50% lebih ampuh, dan kamu memiliki +1 slot Potion ekstra.'
    },
    passive2: {
      name: 'Chemical Reaction (連鎖爆発)',
      icon: '💥',
      description: 'Setiap kali kamu menggunakan Potion, ledakkan zat kimia yang memberikan 10 Damage ke semua musuh.'
    },
    activeSkill: {
      id: 'grand_transmutation',
      name: 'Grand Transmutation (錬金奥義 • 賢者の爆薬)',
      icon: '⚗️💥',
      cooldown: 2,
      cost: 0,
      description: 'Racik ramuan legendaris: Dapatkan 1 Potion ACAK langsung ke sabukmu, berikan 18 Chemical Damage ke SEMUA musuh, dan aplikasikan 3 Poison + 2 Frail!',
      execute(combat, player) {
        if (typeof window.getRandomPotion === 'function' && window.gameState && window.gameState.potions) {
          const freeSlot = window.gameState.potions.findIndex(p => p === null);
          if (freeSlot !== -1) {
            window.gameState.potions[freeSlot] = window.getRandomPotion();
            if (window.spireApp) window.spireApp.renderTopHud();
          }
        }
        combat.enemies.forEach(e => {
          if (!e.isDead && !e.hasEscaped && e.currentHp > 0) {
            combat.dealDamageToEnemy(e, 18);
            combat.applyEnemyStatus(e, 'poison', 3);
            combat.applyEnemyStatus(e, 'frail', 2);
          }
        });
        combat.gainPlayerBlock(8);
        combat.showCombatText('⚗️ GRAND TRANSMUTATION! (+1 Potion, 18 AoE, 3 Poison)', 'player', '#20c997');
        if (window.spireVfx) combat.triggerVfx('chemical_explosion', 'enemy');
      }
    },
    starterDeck: ['corrosive_flask', 'corrosive_flask', 'corrosive_flask', 'corrosive_flask', 'alchemical_coat', 'alchemical_coat', 'alchemical_coat', 'alchemical_coat', 'acid_flask', 'bandage_up'],
    starterRelic: 'ring_of_the_snake',
    prologueStory: `
      Orang-orang menyebutmu gila saat kau mencampurkan darah monster dengan zat merkuri terlarang. Namun bagimu, Shadowspire adalah laboratorium alam terbesar yang pernah ada di muka bumi!
      
      Dengan mantel tahan asam, kacamata pelindung kuningan, dan sabuk penuh botol ramuan yang mendesis, kau melangkah ke dalam menara. Di sini, setiap monster adalah bahan baku eksperimen barumu!
    `,
    avatarSvg: `
      <svg viewBox="0 0 160 200" class="hero-svg alchemist-svg">
        <defs>
          <filter id="alchemist_chem_glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Bubbling Chemical Fumes Behind -->
        <circle cx="50" cy="50" r="14" fill="#69db7c" opacity="0.4" filter="url(#alchemist_chem_glow)"/>
        <circle cx="115" cy="45" r="16" fill="#38d9a9" opacity="0.4" filter="url(#alchemist_chem_glow)"/>
        <!-- Leather Trenchcoat -->
        <path d="M48 68 Q 18 135 25 185 Q 80 172 135 185 Q 142 135 112 68 Z" fill="#212529" stroke="#20c997" stroke-width="2"/>
        <!-- Potion Bandolier Across Chest -->
        <path d="M54 70 L106 70 L98 135 L62 135 Z" fill="#343a40" stroke="#ced4da" stroke-width="1.5"/>
        <line x1="50" y1="75" x2="110" y2="135" stroke="#862e9c" stroke-width="6"/>
        <!-- Tiny Glass Flasks on Bandolier -->
        <circle cx="68" cy="92" r="5" fill="#ff6b6b" stroke="#fff" stroke-width="1" filter="url(#alchemist_chem_glow)"/>
        <circle cx="80" cy="105" r="5" fill="#20c997" stroke="#fff" stroke-width="1" filter="url(#alchemist_chem_glow)"/>
        <circle cx="92" cy="118" r="5" fill="#339af0" stroke="#fff" stroke-width="1" filter="url(#alchemist_chem_glow)"/>
        <!-- Plague Doctor Beak Mask -->
        <path d="M60 32 Q 80 16 100 32 L104 60 Q 80 82 80 92 Q 80 82 56 60 Z" fill="#e9ecef" stroke="#495057" stroke-width="2"/>
        <!-- Goggle Lenses with Green Acid Reflection -->
        <circle cx="68" cy="44" r="8" fill="#121416" stroke="#ffd43b" stroke-width="2"/>
        <circle cx="92" cy="44" r="8" fill="#121416" stroke="#ffd43b" stroke-width="2"/>
        <circle cx="68" cy="44" r="4.5" fill="#69db7c" filter="url(#alchemist_chem_glow)"/>
        <circle cx="92" cy="44" r="4.5" fill="#69db7c" filter="url(#alchemist_chem_glow)"/>
        <!-- Erlenmeyer Flask in Hand -->
        <g transform="translate(18, 105)">
          <polygon points="12,0 18,0 24,20 6,20" fill="#20c997" stroke="#fff" stroke-width="1.5" filter="url(#alchemist_chem_glow)"/>
          <rect x="13" y="-5" width="4" height="6" fill="#adb5bd"/>
        </g>
      </svg>
    `
  },

  // 11. SUNG JIN-WOO (The Shadow Monarch - Solo Leveling)
  shadow_monarch: {
    id: 'shadow_monarch',
    name: 'Sung Jin-woo',
    title: 'The Shadow Monarch (影の君主 • 成振宇)',
    maxHp: 85,
    gold: 150,
    themeColor: '#7950f2',
    avatarIcon: '👑',
    description: 'Hunter Rank-S terkuat yang mewarisi tahta Shadow Monarch dari Ashborn. Menguasai jurus ekstraksi bayangan (Arise), teleportasi bayangan, dan belati Kamish.',
    passive1: {
      name: 'System Sovereign (システムの支配者)',
      icon: '👑',
      description: 'Setiap kali mengalahkan musuh, dapatkan +3 Max HP permanen dan pulihkan 6 HP.'
    },
    passive2: {
      name: 'Shadow Army Vanguard (影の軍団)',
      icon: '🛡️',
      description: 'Di awal setiap giliran, pasukan bayangan (Igris & Iron) otomatis memberimu 6 Shadow Block gratis.'
    },
    activeSkill: {
      id: 'monarch_arise',
      name: 'Arise! (일어나라 • 影の抽出)',
      icon: '👑💀',
      cooldown: 3,
      cost: 0,
      description: 'Ucapkan kata sakral "ARISE!": Pasukan bayangan bangkit, berikan 25 Shadow Damage ke SEMUA musuh, aplikasikan 3 Vulnerable + 3 Weak, dan dapatkan 18 Block!',
      execute(combat, player) {
        combat.gainPlayerBlock(18);
        combat.enemies.forEach(e => {
          if (!e.isDead && !e.hasEscaped && e.currentHp > 0) {
            combat.dealDamageToEnemy(e, 25);
            combat.applyEnemyStatus(e, 'vulnerable', 3);
            combat.applyEnemyStatus(e, 'weak', 3);
          }
        });
        combat.showCombatText('👑 "ARISE!" (25 AoE DMG, 3 Vuln, 3 Weak, 18 BLK)', 'player', '#da77f2', true);
        if (window.spireVfx) combat.triggerVfx('shockwave_ring', 'player');
      }
    },
    starterDeck: ['dagger_strike', 'dagger_strike', 'dagger_strike', 'defend', 'defend', 'defend', 'bloodlust_glare', 'shadow_slash', 'dominators_touch', 'monarchs_domain'],
    starterRelic: 'monarchs_heart',
    prologueStory: `
      Di kedalaman Double Dungeon kuil Cartenon, kau ditinggalkan sekarat di hadapan patung dewa raksasa. Namun saat nafas terakhirmu hampir padam, Quest Log misterius muncul di depan matamu: [Selamat, Anda terpilih menjadi Player].
      
      Melalui ribuan pertempuran di Dungeon instan, kau bangkit dari E-Rank terlemah menjadi Shadow Monarch yang mengendalikan ratusan ribu pasukan bayangan. Shadowspire adalah gerbang dimensi berikutnya yang harus kau taklukkan!
    `,
    avatarSvg: `
      <svg viewBox="0 0 160 200" class="hero-svg sung-jin-woo-svg">
        <defs>
          <filter id="monarch_aura_glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Rising Shadow Soldiers Silhouette in Background -->
        <path d="M25 100 Q 15 140 10 185 Q 40 170 55 185 Q 45 135 35 100 Z" fill="#2b1a4a" opacity="0.6" filter="url(#monarch_aura_glow)"/>
        <path d="M135 100 Q 145 140 150 185 Q 120 170 105 185 Q 115 135 125 100 Z" fill="#2b1a4a" opacity="0.6" filter="url(#monarch_aura_glow)"/>
        <!-- Dark Trenchcoat -->
        <path d="M48 65 Q 18 135 22 185 Q 80 172 138 185 Q 142 135 112 65 Z" fill="#08070d" stroke="#7950f2" stroke-width="2"/>
        <path d="M55 68 L105 68 L98 135 L62 135 Z" fill="#120f1a" stroke="#9775fa" stroke-width="1.2"/>
        <!-- Spiky Jet Black Hair -->
        <path d="M56 36 Q 50 18 64 12 Q 74 16 80 8 Q 88 16 98 12 Q 110 20 104 36 Q 106 50 102 60 Q 80 66 58 60 Z" fill="#090612" stroke="#5f3dc4" stroke-width="1.8"/>
        <!-- Handsome Sharp Face with Glowing Cyan-Purple Eyes -->
        <polygon points="64,36 96,36 80,66" fill="#f8f0fc"/>
        <line x1="68" y1="44" x2="78" y2="44" stroke="#00f0ff" stroke-width="3" filter="url(#monarch_aura_glow)"/>
        <line x1="82" y1="44" x2="92" y2="44" stroke="#00f0ff" stroke-width="3" filter="url(#monarch_aura_glow)"/>
        <circle cx="73" cy="44" r="1.5" fill="#fff"/>
        <circle cx="87" cy="44" r="1.5" fill="#fff"/>
        <!-- Dual Daggers (Kamish's Wrath & Kasaka's Poison Fang) -->
        <g transform="rotate(-25 35 110)">
          <path d="M30 65 L40 65 L36 135 L34 135 Z" fill="#20c997" stroke="#fff" stroke-width="1.2" filter="url(#monarch_aura_glow)"/>
          <rect x="28" y="135" width="14" height="4" fill="#ffd43b"/>
          <rect x="33" y="139" width="4" height="16" fill="#1a1a1a"/>
        </g>
        <g transform="rotate(25 125 110)">
          <path d="M120 65 L130 65 L126 135 L124 135 Z" fill="#da77f2" stroke="#fff" stroke-width="1.2" filter="url(#monarch_aura_glow)"/>
          <rect x="118" y="135" width="14" height="4" fill="#ffd43b"/>
          <rect x="123" y="139" width="4" height="16" fill="#1a1a1a"/>
        </g>
      </svg>
    `
  },

  // 12. SATORU GOJO (The Limitless Sorcerer - Jujutsu Kaisen)
  limitless_sorcerer: {
    id: 'limitless_sorcerer',
    name: 'Satoru Gojo',
    title: 'The Limitless Sorcerer (現代最強の呪術師 • 五条悟)',
    maxHp: 75,
    gold: 200,
    themeColor: '#00f0ff',
    avatarIcon: '🤞',
    description: 'Penyihir Jujutsu terkuat era modern pemilik Six Eyes dan teknik Limitless (Infinity, Blue, Red, Hollow Purple). Menguasai Domain Expansion paling mematikan: Infinite Void.',
    passive1: {
      name: 'Six Eyes (六眼)',
      icon: '👁️',
      description: 'Efisiensi energi absolut: Semua kartu yang berharga 2 atau lebih mendapat diskon -1 Energi.'
    },
    passive2: {
      name: 'Infinity Neutral (無下限呪術)',
      icon: '♾️',
      description: 'Serangan musuh pertama di setiap giliran yang mengenaikmu otomatis dimentahkan menjadi 0 Damage.'
    },
    activeSkill: {
      id: 'infinite_void',
      name: 'Domain Expansion: Infinite Void (無量空処)',
      icon: '🤞🌌',
      cooldown: 3,
      cost: 0,
      description: 'Lakukan segel tangan Domain: Banjiri otak SEMUA musuh dengan informasi tak terbatas! STUN semua musuh selama 1 giliran (musuh tak bisa bergerak/menyerang), berikan 28 Cosmic Damage, dan peroleh Barrier Kebal!',
      execute(combat, player) {
        combat.enemies.forEach(e => {
          if (!e.isDead && !e.hasEscaped && e.currentHp > 0) {
            combat.dealDamageToEnemy(e, 28);
            combat.applyEnemyStatus(e, 'stun', 1);
            e.currentIntent = { type: 'STUNNED', damage: 0, icon: '💫', name: 'Stunned (Otak Overload)' };
          }
        });
        combat.applyPlayerStatus('intangible', 1);
        combat.gainPlayerBlock(20);
        combat.showCombatText('🤞 "RYOUIKI TENKAI: MURYŌKŪSHO!" (28 DMG & FULL ENEMY STUN)', 'player', '#00f0ff', true);
        if (window.spireVfx) combat.triggerVfx('dimension_rift', 'enemy');
      }
    },
    starterDeck: ['strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'limitless_blue', 'limitless_red', 'hollow_purple_mini', 'infinity_ward'],
    starterRelic: 'six_eyes',
    prologueStory: `
      "Jangan khawatir. Akulah yang terkuat."
      
      Dengan mata Six Eyes yang mampu melihat aliran energi kutukan hingga tingkat atom dan teknik Infinity yang membuat jarak antara dirimu dan lawan tak terhingga, tidak ada musuh yang pernah menyentuhmu.
      
      Saat anomali Shadowspire mengancam keseimbangan dunia, kau tersenyum santai sambil membuka penutup matamu. Waktunya memberi pelajaran singkat kepada monster-monster menara tentang apa arti kehampaan sejati!
    `,
    avatarSvg: `
      <svg viewBox="0 0 160 200" class="hero-svg gojo-satoru-svg">
        <defs>
          <filter id="gojo_cyan_glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="4.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Swirling Blue & Red Infinity Spheres -->
        <circle cx="35" cy="45" r="13" fill="#00f0ff" stroke="#fff" stroke-width="2" filter="url(#gojo_cyan_glow)"/>
        <text x="35" y="49" font-size="10" text-anchor="middle" fill="#000" font-weight="900">蒼</text>
        <circle cx="125" cy="45" r="13" fill="#ff2a5f" stroke="#fff" stroke-width="2" filter="url(#gojo_cyan_glow)"/>
        <text x="125" y="49" font-size="10" text-anchor="middle" fill="#000" font-weight="900">赫</text>
        <!-- Jujutsu High High-Collar Black Uniform -->
        <path d="M50 70 L110 70 L102 150 L58 150 Z" fill="#0d0f18" stroke="#00f0ff" stroke-width="1.8"/>
        <path d="M68 62 L92 62 L90 85 L70 85 Z" fill="#141824" stroke="#339af0" stroke-width="1.5"/>
        <circle cx="80" cy="88" r="3" fill="#ffd43b"/>
        <!-- Spiky Snow White Hair -->
        <path d="M56 34 Q 48 14 62 10 Q 72 16 80 4 Q 88 16 98 10 Q 112 14 104 34 Q 110 50 102 60 Q 80 66 58 60 Z" fill="#f8f9fa" stroke="#ced4da" stroke-width="2"/>
        <!-- Classic Black Blindfold / Sunglasses Slid Down Showing Six Eyes -->
        <polygon points="62,36 98,36 80,66" fill="#fcc2d7"/>
        <rect x="58" y="38" width="44" height="12" rx="3" fill="#0a0c14" stroke="#00f0ff" stroke-width="1.5"/>
        <!-- Glowing Azure Six Eyes Peeking -->
        <circle cx="70" cy="44" r="3.5" fill="#00f0ff" filter="url(#gojo_cyan_glow)"/>
        <circle cx="70" cy="44" r="1.5" fill="#fff"/>
        <circle cx="90" cy="44" r="3.5" fill="#00f0ff" filter="url(#gojo_cyan_glow)"/>
        <circle cx="90" cy="44" r="1.5" fill="#fff"/>
        <!-- Crossed Fingers Gesture (Domain Expansion Hand Sign) -->
        <g transform="translate(70, 95)">
          <path d="M10 20 L10 5 Q 12 0 14 5 L14 20" stroke="#fcc2d7" stroke-width="3" fill="none"/>
          <path d="M14 20 L14 2 Q 16 -3 18 2 L18 20" stroke="#fcc2d7" stroke-width="3" fill="none"/>
          <circle cx="14" cy="2" r="4" fill="#00f0ff" filter="url(#gojo_cyan_glow)" opacity="0.8"/>
        </g>
      </svg>
    `
  }
};


class GameState {
  constructor() {
    this.character = 'ironclad';
    this.difficulty = 'NORMAL';
    this.player = {
      name: 'The Ironclad',
      maxHp: 80,
      currentHp: 80,
      gold: 99
    };
    this.deck = (CHARACTER_DATABASE.ironclad.starterDeck || ['strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'bash']).map(defId => {
      const baseDef = (window.CARD_DATABASE && window.CARD_DATABASE[defId]) ? window.CARD_DATABASE[defId] : (window.CARD_DATABASE ? window.CARD_DATABASE.strike : null);
      return (baseDef && window.Card) ? new window.Card(baseDef, false) : null;
    }).filter(Boolean);
    this.relics = [];
    this.potions = [null, null, null];
    this.currentFloor = 0;
    this.map = null;
    this.stats = {
      floorsCleared: 0,
      monstersSlain: 0,
      elitesSlain: 0,
      bossesSlain: 0,
      cardsUpgraded: 0,
      goldEarned: 99
    };

    // Pengaturan Pemain
    this.settings = {
      sfxVolume: 0.7,
      bgmVolume: 0.4,
      screenShake: true,
      battleSpeed: 1
    };
    this.loadSettings();
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('shadowspire_settings');
      if (saved) {
        this.settings = Object.assign(this.settings, JSON.parse(saved));
      }
    } catch (e) {}
  }

  saveSettings() {
    try {
      localStorage.setItem('shadowspire_settings', JSON.stringify(this.settings));
    } catch (e) {}
  }

  startNewRun(characterKey = 'ironclad', difficultyKey = 'NORMAL') {
    const charDef = CHARACTER_DATABASE[characterKey] || CHARACTER_DATABASE.ironclad;
    const diffDef = DIFFICULTY_DATABASE[difficultyKey] || DIFFICULTY_DATABASE.NORMAL;

    this.character = characterKey;
    this.difficulty = difficultyKey;

    let startHp = charDef.maxHp;
    let startGold = Math.floor(charDef.gold * diffDef.goldMultiplier);

    this.player = {
      name: charDef.name,
      maxHp: startHp,
      currentHp: startHp,
      gold: startGold
    };

    // Buat Starter Deck
    const starterIds = charDef.starterDeck || ['strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'bash'];
    this.deck = starterIds.map(defId => {
      const baseDef = (window.CARD_DATABASE && window.CARD_DATABASE[defId]) ? window.CARD_DATABASE[defId] : (window.CARD_DATABASE ? window.CARD_DATABASE.strike : null);
      if (baseDef && window.Card) {
        return new window.Card(baseDef, false);
      }
      return null;
    }).filter(Boolean);

    // Fallback jika deck masih kosong
    if (!this.deck || this.deck.length === 0) {
      this.deck = starterIds.map(defId => {
        const baseDef = window.CARD_DATABASE ? (window.CARD_DATABASE[defId] || window.CARD_DATABASE.strike) : null;
        return (baseDef && window.Card) ? new window.Card(baseDef, false) : null;
      }).filter(Boolean);
    }

    // Inisialisasi Relic Starter
    const relicDef = (window.RELIC_DATABASE && window.RELIC_DATABASE[charDef.starterRelic]) ? window.RELIC_DATABASE[charDef.starterRelic] : (window.RELIC_DATABASE ? window.RELIC_DATABASE.burning_blood : null);
    this.relics = (relicDef && window.Relic) ? [new window.Relic(relicDef)] : [];

    // Inisialisasi Potions (Alchemist dapat 4 slot dan 2 ramuan acak)
    if (characterKey === 'alchemist') {
      this.potions = [
        window.getRandomPotion ? window.getRandomPotion() : null,
        window.getRandomPotion ? window.getRandomPotion() : null,
        null,
        null
      ];
    } else {
      const firePot = (window.POTION_DATABASE && window.POTION_DATABASE.fire_potion) ? window.POTION_DATABASE.fire_potion : null;
      this.potions = [(firePot && window.Potion) ? new window.Potion(firePot) : null, null, null];
    }

    this.currentFloor = 0;
    this.map = new window.SpireMap(15, 4);
    this.stats = {
      floorsCleared: 0,
      monstersSlain: 0,
      elitesSlain: 0,
      bossesSlain: 0,
      cardsUpgraded: 0,
      goldEarned: startGold
    };

    this.saveRun();
  }

  getCharacterDef() {
    return CHARACTER_DATABASE[this.character] || CHARACTER_DATABASE.ironclad;
  }

  getDifficultyDef() {
    return DIFFICULTY_DATABASE[this.difficulty] || DIFFICULTY_DATABASE.NORMAL;
  }

  heal(amount) {
    const prev = this.player.currentHp;
    this.player.currentHp = Math.min(this.player.maxHp, this.player.currentHp + amount);
    this.saveRun();
    return this.player.currentHp - prev;
  }

  takeDamage(amount) {
    this.player.currentHp = Math.max(0, this.player.currentHp - amount);
    this.saveRun();
    return this.player.currentHp;
  }

  addGold(amount) {
    let finalAmt = amount;
    if (this.character === 'alchemist') finalAmt = Math.floor(finalAmt * 1.35);
    if (this.hasRelic('golden_idol')) finalAmt = Math.floor(finalAmt * 1.25);

    this.player.gold += finalAmt;
    this.stats.goldEarned += finalAmt;
    if (window.spireAudio) window.spireAudio.playGold();
    this.saveRun();
  }

  spendGold(amount) {
    if (this.player.gold >= amount) {
      this.player.gold -= amount;
      this.saveRun();
      return true;
    }
    return false;
  }

  addCard(card) {
    this.deck.push(card);
    this.saveRun();
  }

  removeCard(cardUid) {
    const idx = this.deck.findIndex(c => c.uid === cardUid);
    if (idx !== -1) {
      this.deck.splice(idx, 1);
      this.saveRun();
      return true;
    }
    return false;
  }

  upgradeCard(cardUid) {
    const card = this.deck.find(c => c.uid === cardUid);
    if (card && !card.isUpgraded) {
      card.upgrade();
      this.stats.cardsUpgraded++;
      this.saveRun();
      return true;
    }
    return false;
  }

  hasRelic(relicId) {
    return (this.relics || []).some(r => r.id === relicId);
  }

  addRelic(relic) {
    if (!this.hasRelic(relic.id)) {
      this.relics.push(relic);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      this.saveRun();
      return true;
    }
    return false;
  }

  addPotion(potion) {
    const emptySlot = this.potions.findIndex(p => p === null);
    if (emptySlot !== -1) {
      this.potions[emptySlot] = potion;
      this.saveRun();
      return true;
    }
    return false;
  }

  usePotion(slotIndex, combat, target = null) {
    const potion = this.potions[slotIndex];
    if (potion) {
      const used = potion.use(combat, target);
      if (used) {
        this.potions[slotIndex] = null;
        this.saveRun();
        return true;
      }
    }
    return false;
  }

  discardPotion(slotIndex) {
    if (this.potions[slotIndex]) {
      this.potions[slotIndex] = null;
      this.saveRun();
      return true;
    }
    return false;
  }

  saveRun() {
    try {
      const data = {
        character: this.character,
        difficulty: this.difficulty,
        player: this.player,
        deck: (this.deck || []).map(c => ({ defId: c.defId, isUpgraded: c.isUpgraded })),
        relics: (this.relics || []).map(r => ({ id: r.id, counter: r.counter })),
        potions: (this.potions || []).map(p => p ? p.id : null),
        currentFloor: this.currentFloor,
        stats: this.stats,
        map: {
          numFloors: this.map ? this.map.numFloors : 15,
          cols: this.map ? this.map.cols : 4,
          currentNodeId: this.map && this.map.currentNode ? this.map.currentNode.id : null,
          floors: this.map ? this.map.floors : []
        }
      };
      localStorage.setItem('shadowspire_run_save', JSON.stringify(data));
    } catch (e) {
      console.warn('Gagal menyimpan run ke LocalStorage:', e);
    }
  }

  loadRun() {
    try {
      const raw = localStorage.getItem('shadowspire_run_save');
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data.player || data.player.currentHp <= 0) {
        this.clearSave();
        return false;
      }

      this.character = data.character || 'ironclad';
      this.difficulty = data.difficulty || 'NORMAL';
      this.player = data.player;
      const charDef = this.getCharacterDef();
      this.deck = (data.deck || []).map(c => {
        const baseDef = (window.CARD_DATABASE && c && c.defId) ? (window.CARD_DATABASE[c.defId] || window.CARD_DATABASE.strike) : (window.CARD_DATABASE ? window.CARD_DATABASE.strike : null);
        return (baseDef && window.Card) ? new window.Card(baseDef, c ? c.isUpgraded : false) : null;
      }).filter(Boolean);

      // Jika deck kosong, pulihkan starter deck karakter
      if (!this.deck || this.deck.length === 0) {
        const starterIds = charDef.starterDeck || ['strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'bash'];
        this.deck = starterIds.map(defId => {
          const baseDef = (window.CARD_DATABASE && window.CARD_DATABASE[defId]) ? window.CARD_DATABASE[defId] : (window.CARD_DATABASE ? window.CARD_DATABASE.strike : null);
          return (baseDef && window.Card) ? new window.Card(baseDef, false) : null;
        }).filter(Boolean);
      }
      this.relics = (data.relics || []).map(r => {
        const baseDef = window.RELIC_DATABASE[r.id] || window.RELIC_DATABASE.burning_blood;
        const inst = new window.Relic(baseDef);
        inst.counter = r.counter;
        return inst;
      });
      this.potions = (data.potions || []).map(id => (id && window.POTION_DATABASE[id]) ? new window.Potion(window.POTION_DATABASE[id]) : null);
      this.currentFloor = data.currentFloor || 0;
      this.stats = data.stats || this.stats;

      if (data.map && data.map.floors && data.map.floors.length > 0) {
        this.map = new window.SpireMap(data.map.numFloors, data.map.cols);
        this.map.floors = data.map.floors;
        if (data.map.currentNodeId) {
          this.map.currentNode = this.map.getNodeById(data.map.currentNodeId);
        }
      }

      return true;
    } catch (e) {
      console.error('Gagal memuat save file:', e);
      return false;
    }
  }

  clearSave() {
    localStorage.removeItem('shadowspire_run_save');
  }
}

window.DIFFICULTY_DATABASE = DIFFICULTY_DATABASE;
window.CHARACTER_DATABASE = CHARACTER_DATABASE;
window.gameState = new GameState();


// ============================================================================
// SHADOWSPIRE CODEX & BEAST ARCHIVES LORE DATABASE
// ============================================================================
const SHADOWSPIRE_CODEX = {
  exordium: {
    title: 'Act 1: The Exordium (Dasar Reruntuhan Abadi)',
    lore: 'Lantai dasar Shadowspire yang tertimbun bebatuan kapur dan makam para kesatria masa lampau. Di sini cacing tanah pemakan tulang dan parasit raksasa berkeliaran mencari sisa daging penantang.'
  },
  the_city: {
    title: 'Act 2: The Abyssal Necropolis (Kota Kematian Bawah Tanah)',
    lore: 'Kastil megah yang dulunya menjadi pusat peradaban manusia sebelum sang arsitek kegelapan menancapkan pilar Shadowspire ke jantung bumi.'
  },
  the_beyond: {
    title: 'Act 3: The Astral Summit (Puncak Astral Menara)',
    lore: 'Di puncak menara, gravitasi memudar dan waktu melingkar. Jantung Gelap berdenyut, memompa kutukan abadi ke seluruh penjuru dunia nyata.'
  },
  achievements: [
    { id: 'first_blood', name: 'Tumpahan Darah Pertama', desc: 'Kalahkan monster pertama di Lantai 1.' },
    { id: 'elite_slayer', name: 'Pembasmi Monster Elite', desc: 'Tumbangkan monster Elite tanpa kehilangan lebih dari 20 HP.' },
    { id: 'boss_vanquisher', name: 'Penakluk Gerbang Exordium', desc: 'Hancurkan Boss di Lantai 15.' },
    { id: 'master_deck', name: 'Deck Legendaris', desc: 'Miliki minimal 5 kartu yang telah diperkuat (+).' },
    { id: 'wealthy_climber', name: 'Kolektor Harta Karun', desc: 'Kumpulkan lebih dari 300 Gold dalam satu pendakian.' }
  ]
};

window.SHADOWSPIRE_CODEX = SHADOWSPIRE_CODEX;


// ============================================================================
// COMPREHENSIVE BESTIARY CODEX ENCYCLOPEDIA
// ============================================================================
const BESTIARY_CODEX_ENTRIES = {
  voidcaller: {
    name: 'Ravenous Voidcaller',
    threat: 'Tinggi bila dibiarkan lebih dari 3 giliran.',
    strategy: 'Habisi secepat mungkin sebelum status Ritual meningkatkan serangannya menjadi puluhan damage.',
    origin: 'Pemuja fanatik sekte Raven yang mengorbankan pita suara demi bahasa kehampaan.'
  },
  gravemaw: {
    name: 'Gravemaw Crawler',
    threat: 'Sedang.',
    strategy: 'Gunakan serangan berat di ronde pertama saat rahangnya terbuka. Waspadai pertahanan kerasnya di ronde kedua.',
    origin: 'Spesies kelabang pemakan kalsium kuburan bawah tanah Exordium.'
  },
  crimson_beetle: {
    name: 'Crimson Carapace Beetle',
    threat: 'Rendah-Sedang.',
    strategy: 'Hantam dengan serangan tunggal berkekuatan besar untuk memicu Curl Up secara efisien.',
    origin: 'Parasit yang menyerap pigmen darah dari batu kapur menara.'
  },
  dreadhorn: {
    name: 'Dreadhorn Berserker (Elite)',
    threat: 'SANGAT TINGGI.',
    strategy: 'JANGAN gunakan kartu bertipe Skill jika tidak mendesak! Setiap Skill memperkuat serangannya sebesar +2 STR permanen.',
    origin: 'Keturunan iblis neraka liar yang membenci pengguna sihir dan pelindung perisai.'
  },
  crystalline_sentry: {
    name: 'Crystalline Sentry Scarab (Elite)',
    threat: 'SANGAT TINGGI.',
    strategy: 'Manfaatkan 3 giliran saat ia tertidur untuk menimbun buff dan menipiskan HP-nya.',
    origin: 'Penjaga berkulit permata yang menyedot energi kehidupan pahlawan.'
  },
  guardian_sentinel: {
    name: 'Aether-Rune Sentinel (Boss)',
    threat: 'BOS PUNCAK EXORDIUM.',
    strategy: 'Jangan menyerang saat Sentinel berada dalam Mode Pertahanan Bergulir (Sharp Hide 3 memantulkan damage).',
    origin: 'Golem jam kosmik yang dibangun oleh arsitek pertama Shadowspire.'
  }
};

window.BESTIARY_CODEX_ENTRIES = BESTIARY_CODEX_ENTRIES;


// ============================================================================
// EXTENDED NARRATIVE DIALOGUE & MONSTER LORE ARCHIVES
// ============================================================================
const SHADOWSPIRE_LORE_ARCHIVES = {
  ironclad_quotes: [
    "Darah kawanku menuntut pembalasan di setiap lantai menara ini.",
    "Baja ini tidak akan patah sebelum puncak Shadowspire terbakar habis.",
    "Iblis di dalam diriku... tersenyum melihat kebinasaan mereka."
  ],
  silent_quotes: [
    "Hening adalah jerat maut yang tidak pernah luput.",
    "Racun ini bekerja lambat, namun kematian yang dibawanya pasti.",
    "Bayangan menara ini adalah rumah keduaku."
  ],
  defect_quotes: [
    "ANALISIS: ANOMALI PERTAHANAN MUSUH TERDETEKSI. EKSEKUSI PLASMA.",
    "MEMORI RUSAK... NAMUN TEKAD PENDAKIAN TETAP 100%.",
    "PETIR INI ADALAH NAPAS DARI PENCIPTAPU."
  ],
  watcher_quotes: [
    "Di balik kain penutup mata, takdir kalian telah terurai.",
    "Ketenangan adalah wadah, dan amarah adalah senjataku.",
    "Menara ini dibangun di atas kebohongan ribuan tahun silam."
  ],
  necromancer_quotes: [
    "Tulang mereka akan menjadi dinding tameng baruku.",
    "Kematian hanyalah pergantian tuan. Dan sekarang, akulah tuanmu.",
    "Lentera jiwaku menyala lebih terang di tempat terkutuk ini."
  ],
  chronomancer_quotes: [
    "Aku telah melihat masa depan pertarungan ini ratusan kali.",
    "Waktu adalah ilusi bagi mereka yang tidak tahu cara memutarnya.",
    "Setiap detik yang berdetak adalah langkah menuju puncak."
  ],
  berserker_quotes: [
    "LUKA INI HANYA MEMBUAT AMARAHKU SEMAKIN LIAR!",
    "HANCURKAN MEREKA! JANGAN SISAKAN BATU DI ATAS BATU!",
    "DARAHKU ADALAH API YANG MEMBAKAR MENARA INI!"
  ],
  paladin_quotes: [
    "Cahaya fajar suci akan menyapu bersih lumut kegelapan ini.",
    "Keadilan tidak akan goyah di hadapan monster terpekat sekalipun.",
    "Palu suciku diberkati oleh matahari terbit."
  ],
  shadowblade_quotes: [
    "Mereka mati sebelum menyadari dari mana belatiku menusuk.",
    "Pengkhianat di puncak menara akan membayar darah dengan darah.",
    "Aku adalah hantu yang berjalan di antara dua dunia."
  ],
  alchemist_quotes: [
    "Asam ini mampu melarutkan bahkan zirah iblis tertua.",
    "Emas murni menanti mereka yang berani mencampurkan bahan terlarang.",
    "Menara ini adalah laboratorium termegah yang pernah ada."
  ]
};

window.SHADOWSPIRE_LORE_ARCHIVES = SHADOWSPIRE_LORE_ARCHIVES;
