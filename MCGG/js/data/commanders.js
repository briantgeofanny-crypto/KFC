// ============================================================
// MAGIC CHESS GOGO - COMMANDER DATA
// 8 GoGo Commanders with unique skills and ultimates
// ============================================================

const COMMANDER_DATA = {
  gogo: {
    id: 'gogo', name: 'GoGo', emoji: '⭐',
    color: '#fbbf24', bgGradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    description: 'Commander serba bisa dengan kemampuan mendukung semua lineup.',
    lore: 'Bocah ajaib yang memiliki kekuatan luar biasa dan semangat tak terbatas!',
    passive: {
      name: 'Magic Power',
      desc: 'Semua hero mendapatkan +10% damage.'
    },
    skills: [
      {
        name: 'GoGo Punch!',
        desc: 'Serang musuh terkuat dengan pukulan ajaib, 300 magic damage + stun 1 detik.',
        icon: '👊', cooldown: 15, manaCost: 0,
        effect: 'stun_strongest'
      },
      {
        name: 'Super Boost',
        desc: 'Berikan semua ally +20% attack speed selama 5 detik.',
        icon: '⚡', cooldown: 20, manaCost: 0,
        effect: 'boost_atkspeed'
      }
    ],
    ultimate: {
      name: 'GOGO ULTIMATE!',
      desc: 'Pancarkan energi ke seluruh map, 500 damage ke semua musuh dan heal semua ally 300 HP.',
      icon: '✨', cooldown: 40,
      effect: 'ultimate_gogo'
    },
    stats: { hp: 1500, atk: 120, armor: 30, moveSpeed: 320 }
  },

  leomord: {
    id: 'leomord', name: 'Leomord', emoji: '🦁',
    color: '#f97316', bgGradient: 'linear-gradient(135deg, #ea580c, #c2410c)',
    description: 'Commander fighter dengan kemampuan melee yang menakutkan.',
    lore: 'Ksatria singa yang tak terkalahkan dari kerajaan masa lalu.',
    passive: {
      name: 'Battle Roar',
      desc: 'Semua Fighter mendapatkan +15% physical attack.'
    },
    skills: [
      {
        name: 'Phantom Stomp',
        desc: 'Hantam tanah keras, stun musuh di area 2 detik dan 250 physical damage.',
        icon: '⚔️', cooldown: 12, manaCost: 0,
        effect: 'aoe_stun'
      },
      {
        name: 'Valor Cavalry',
        desc: 'Charge ke musuh terjauh, 400 physical damage dan knock back.',
        icon: '🏇', cooldown: 18, manaCost: 0,
        effect: 'charge_knockback'
      }
    ],
    ultimate: {
      name: 'Phantom Cavalry',
      desc: 'Panggil pasukan phantom untuk menyerang semua musuh, 800 physical damage + slow 50% selama 4 detik.',
      icon: '⚔️', cooldown: 40,
      effect: 'ultimate_leomord'
    },
    stats: { hp: 1800, atk: 150, armor: 40, moveSpeed: 310 }
  },

  freya: {
    id: 'freya', name: 'Freya', emoji: '⚡',
    color: '#818cf8', bgGradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    description: 'Commander valkyrie yang menguasai kekuatan petir dan serangan cepat.',
    lore: 'Valkyrie perkasa yang turun dari langit untuk memimpin pertempuran.',
    passive: {
      name: 'Sacred Orb',
      desc: 'Semua Marksman mendapatkan +12% attack speed.'
    },
    skills: [
      {
        name: 'Spirit Combo',
        desc: 'Serang musuh terdekat 3 kali cepat, 150 physical damage per hit.',
        icon: '⚡', cooldown: 10, manaCost: 0,
        effect: 'triple_strike'
      },
      {
        name: 'Jump Strike',
        desc: 'Leap ke udara dan turun ke area musuh, 350 physical damage + knockup 1.5 detik.',
        icon: '🦅', cooldown: 16, manaCost: 0,
        effect: 'leap_strike'
      }
    ],
    ultimate: {
      name: 'Valkyrie\'s Force',
      desc: 'Aktifkan kekuatan Valkyrie penuh, berikan +30% damage ke semua ally selama 6 detik dan tembakkan petir 600 damage.',
      icon: '⚡', cooldown: 40,
      effect: 'ultimate_freya'
    },
    stats: { hp: 1600, atk: 140, armor: 28, moveSpeed: 340 }
  },

  sun: {
    id: 'sun', name: 'Sun', emoji: '🐒',
    color: '#fbbf24', bgGradient: 'linear-gradient(135deg, #f59e0b, #92400e)',
    description: 'Commander monkey king yang menciptakan klon untuk membingungkan musuh.',
    lore: 'Raja kera legenda yang menguasai seni ilusi dan pertempuran.',
    passive: {
      name: 'Doppelganger',
      desc: 'Setiap 30 detik, munculkan klon Sun yang menyerang musuh dengan 50% stats.'
    },
    skills: [
      {
        name: 'Clone Attack',
        desc: 'Munculkan 2 klon yang menyerang musuh selama 5 detik.',
        icon: '🐒', cooldown: 15, manaCost: 0,
        effect: 'spawn_clones'
      },
      {
        name: 'Staff Sweep',
        desc: 'Putar tongkat mengenai semua musuh sekitar, 300 physical damage + slow.',
        icon: '🪄', cooldown: 14, manaCost: 0,
        effect: 'aoe_slow'
      }
    ],
    ultimate: {
      name: 'Simian God',
      desc: 'Transform jadi dewa kera, munculkan 3 klon kuat selama 8 detik. Setiap klon memberikan 200 damage per detik.',
      icon: '🐒', cooldown: 40,
      effect: 'ultimate_sun'
    },
    stats: { hp: 1550, atk: 130, armor: 25, moveSpeed: 330 }
  },

  hanabi: {
    id: 'hanabi', name: 'Hanabi', emoji: '🌸',
    color: '#ec4899', bgGradient: 'linear-gradient(135deg, #db2777, #9d174d)',
    description: 'Commander marksman dengan kemampuan bounce shot yang mematikan.',
    lore: 'Pewaris sejati klan Scarlet Shadow yang menguasai seni tersembunyi.',
    passive: {
      name: 'Ninjutsu: Equinox',
      desc: 'Semua Marksman mendapatkan +10% physical attack dan shield setiap ronde.'
    },
    skills: [
      {
        name: 'Petal Barrage',
        desc: 'Tembakkan kelopak yang bounce ke musuh lain, 200 physical damage per musuh.',
        icon: '🌸', cooldown: 12, manaCost: 0,
        effect: 'bounce_shot'
      },
      {
        name: 'Soul Shackle',
        desc: 'Ikat semua musuh yang diserang Hanabi, slow 40% selama 3 detik.',
        icon: '⛓️', cooldown: 18, manaCost: 0,
        effect: 'chain_slow'
      }
    ],
    ultimate: {
      name: 'Higanbana',
      desc: 'Lempar bunga raksasa ke tengah musuh, 700 magic damage ke semua musuh dalam radius besar + stun 2 detik.',
      icon: '🌺', cooldown: 40,
      effect: 'ultimate_hanabi'
    },
    stats: { hp: 1400, atk: 160, armor: 20, moveSpeed: 345 }
  },

  cyclops: {
    id: 'cyclops', name: 'Cyclops', emoji: '👁️',
    color: '#a78bfa', bgGradient: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    description: 'Commander mage dengan kekuatan planet yang menghancurkan.',
    lore: 'Penyihir bermata satu yang menggunakan kekuatan bintang-bintang.',
    passive: {
      name: 'Planetary Movement',
      desc: 'Semua Mage mendapatkan +15% magic power.'
    },
    skills: [
      {
        name: 'Starfall Strike',
        desc: 'Panggil bintang jatuh ke area musuh, 350 magic damage + slow 30%.',
        icon: '⭐', cooldown: 12, manaCost: 0,
        effect: 'starfall'
      },
      {
        name: 'Comets Bounce',
        desc: 'Lempar komet yang bounce ke 3 musuh terdekat, 200 magic damage per hit.',
        icon: '☄️', cooldown: 15, manaCost: 0,
        effect: 'comet_bounce'
      }
    ],
    ultimate: {
      name: 'Cyclone Orb',
      desc: 'Ciptakan orb raksasa yang berputar mengelilingi arena, 1000 magic damage ke semua musuh.',
      icon: '🌀', cooldown: 40,
      effect: 'ultimate_cyclops'
    },
    stats: { hp: 1350, atk: 170, armor: 18, moveSpeed: 300 }
  },

  gord: {
    id: 'gord', name: 'Gord', emoji: '🔮',
    color: '#0ea5e9', bgGradient: 'linear-gradient(135deg, #0284c7, #075985)',
    description: 'Commander mage dengan beam damage paling tinggi.',
    lore: 'Ilmuwan jenius yang menguasai kekuatan mystic di level tertinggi.',
    passive: {
      name: 'Mystic Projectile',
      desc: 'Semua Mage mendapatkan +20% magic penetration.'
    },
    skills: [
      {
        name: 'Mystic Gush',
        desc: 'Tembakkan beam mystic selama 2 detik ke musuh, 400 magic damage total.',
        icon: '🔵', cooldown: 14, manaCost: 0,
        effect: 'beam_shot'
      },
      {
        name: 'Mystic Projectile',
        desc: 'Lempar proyektil besar, 280 magic damage + slow 30%.',
        icon: '💎', cooldown: 12, manaCost: 0,
        effect: 'projectile_slow'
      }
    ],
    ultimate: {
      name: 'Mystic Favor',
      desc: 'Panggil portal ajaib, tembakkan beam ke semua musuh. 1200 magic damage total ke seluruh area.',
      icon: '🌀', cooldown: 40,
      effect: 'ultimate_gord'
    },
    stats: { hp: 1300, atk: 180, armor: 15, moveSpeed: 295 }
  },

  natan: {
    id: 'natan', name: 'Natan', emoji: '⏳',
    color: '#34d399', bgGradient: 'linear-gradient(135deg, #10b981, #047857)',
    description: 'Commander dari masa depan yang memanipulasi waktu dan ruang.',
    lore: 'Penjaga dari masa depan yang melakukan perjalanan balik untuk menyelamatkan semesta.',
    passive: {
      name: 'Entropy',
      desc: 'Setiap serangan Natan memiliki 30% chance untuk merefleksikan ke musuh terdekat.'
    },
    skills: [
      {
        name: 'Superposition',
        desc: 'Munculkan klon Natan yang menyerang dengan 100% stats selama 4 detik.',
        icon: '⏳', cooldown: 16, manaCost: 0,
        effect: 'superposition_clone'
      },
      {
        name: 'Interference',
        desc: 'Ciptakan area gangguan waktu, semua musuh dalam area -40% attack speed 3 detik.',
        icon: '🌀', cooldown: 14, manaCost: 0,
        effect: 'time_interference'
      }
    ],
    ultimate: {
      name: 'The Light',
      desc: 'Balikkan waktu di area pertempuran, semua ally restore 50% HP yang hilang dan semua musuh terkena 800 magic damage.',
      icon: '✨', cooldown: 40,
      effect: 'ultimate_natan'
    },
    stats: { hp: 1450, atk: 155, armor: 22, moveSpeed: 325 }
  }
};

export { COMMANDER_DATA };
