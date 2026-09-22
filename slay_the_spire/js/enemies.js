                                                                                                                                                                        
                                                                                                                                                                        /**
 * ============================================================================
 * SHADOWSPIRE: CHRONICLES OF ASCENSION - MASTER BESTIARY & MONSTER AI ENGINE
 * ============================================================================
 * Koleksi makhluk kegelapan dan bos penjaga Shadowspire dengan model visual SVG
 * beranimasi, state machine AI telegrafis otentik, dan sistem intent prediktif.
 */

const INTENT_TYPES = {
  ATTACK: 'ATTACK',
  DEFEND: 'DEFEND',
  BUFF: 'BUFF',
  DEBUFF: 'DEBUFF',
  ATTACK_DEFEND: 'ATTACK_DEFEND',
  ATTACK_DEBUFF: 'ATTACK_DEBUFF',
  UNKNOWN: 'UNKNOWN',
  SLEEP: 'SLEEP'
};

class MonsterEntity {
  constructor(def, floorNum = 1) {
    this.uid = 'enemy_' + Math.random().toString(36).substr(2, 9);
    this.id = def.id;
    this.name = def.name;
    this.lore = def.lore || '';
    this.isElite = def.isElite || false;
    this.isBoss = def.isBoss || false;

    // Difficulty scaling
    const diff = (window.gameState && window.gameState.getDifficultyDef) ? window.gameState.getDifficultyDef() : { enemyHpMultiplier: 1, enemyDmgMultiplier: 1 };

    const baseHp = def.hpMin + Math.floor(Math.random() * (def.hpMax - def.hpMin + 1));
    this.maxHp = Math.floor(baseHp * (diff.enemyHpMultiplier || 1));
    this.currentHp = this.maxHp;
    this.block = 0;

    // Inisialisasi status debuff & buff
    this.status = {
      strength: 0,
      vulnerable: 0,
      weak: 0,
      ritual: 0,
      enrage: 0,
      sharpHide: 0,
      metallicize: 0,
      poison: 0,
      curlUp: def.curlUp || 0,
      hasCurled: false,
      asleep: def.startsAsleep || false
    };

    // Hellfire difficulty modifier
    if (diff.id === 'HELLFIRE') {
      this.status.strength += 2;
      this.block += 6;
    }

    this.turnCount = 0;
    this.aiState = def.initialAiState || 'DEFAULT';
    this.intent = {
      type: INTENT_TYPES.UNKNOWN,
      damage: 0,
      hits: 1,
      icon: '❓',
      description: 'Bersiap mengambil tindakan...'
    };

    this.avatarSvg = def.avatarSvg;
    this.baseDef = def;
    this.isDead = false;
    this.hasEscaped = false;
  }

  takeDamage(amount) {
    let unblocked = amount;
    if (this.block > 0) {
      if (this.block >= unblocked) {
        this.block -= unblocked;
        unblocked = 0;
        if (window.spireAudio) window.spireAudio.playBlock();
      } else {
        unblocked -= this.block;
        this.block = 0;
      }
    }

    if (unblocked > 0) {
      this.currentHp = Math.max(0, this.currentHp - unblocked);
      if (this.currentHp <= 0) {
        this.isDead = true;
      }

      // Curl Up passive (Carapace Beetle)
      if (this.status.curlUp > 0 && !this.status.hasCurled && !this.isDead) {
        this.block += this.status.curlUp;
        this.status.hasCurled = true;
        if (window.spireCombat) {
          window.spireCombat.showCombatText(`Curl Up (+${this.status.curlUp} Block)`, this, '#4dabf7');
        }
      }

      // Bangun dari tidur jika diserang (Crystalline Scarab)
      if (this.status.asleep && !this.isDead) {
        this.status.asleep = false;
        if (window.spireCombat) {
          window.spireCombat.showCombatText('Terbangun dari Tidur!', this, '#ff6b6b');
        }
      }
    }
    return unblocked;
  }

  determineIntent(combat) {
    if (this.isDead || this.hasEscaped) return;
    if (typeof this.baseDef.determineIntent === 'function') {
      this.baseDef.determineIntent.call(this, combat);
    }
  }

  executeTurn(combat) {
    if (this.isDead || this.hasEscaped) return;
    this.turnCount++;

    // Pasif Ritual (+Strength tiap giliran)
    if (this.status.ritual > 0) {
      this.status.strength += this.status.ritual;
      combat.showCombatText(`+${this.status.ritual} STR (Ritual)`, this, '#ff4d4d');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
    }

    // Pasif Metallicize musuh
    if (this.status.metallicize > 0) {
      this.block += this.status.metallicize;
      combat.showCombatText(`+${this.status.metallicize} Block`, this, '#4dabf7');
    }

    // Eksekusi aksi AI utama
    if (typeof this.baseDef.executeTurn === 'function') {
      this.baseDef.executeTurn.call(this, combat);
    }

    // Eksekusi Poison Tick di akhir giliran
    if (this.status.poison > 0) {
      const poisonDmg = this.status.poison;
      this.takeDamage(poisonDmg);
      combat.showCombatText(`${poisonDmg} Poison!`, this, '#51cf66');
      this.status.poison--;
    }
  }

  calcAttackDamage(baseDmg) {
    const diff = (window.gameState && window.gameState.getDifficultyDef) ? window.gameState.getDifficultyDef() : { enemyDmgMultiplier: 1 };
    let dmg = Math.floor((baseDmg + (this.status.strength || 0)) * (diff.enemyDmgMultiplier || 1));
    if (this.status.weak > 0) {
      dmg = Math.floor(dmg * 0.75);
    }
    return Math.max(0, dmg);
  }
}

// ============================================================================
// MASTER BESTIARY DATABASE (ORISINAL SHADOWSPIRE)
// ============================================================================
const BESTIARY_DATABASE = {

  // --------------------------------------------------------------------------
  // 1. RAVENOUS VOIDCALLER (Pengganti Cultist)
  // --------------------------------------------------------------------------
  voidcaller: {
    id: 'voidcaller',
    name: 'Ravenous Voidcaller',
    lore: 'Penyihir fanatik bertopeng paruh gagak obsidian yang memuja kehampaan purba. Melakukan ritual pemanggilan kekuatan void yang melipatgandakan serangannya tiap ronde.',
    hpMin: 48,
    hpMax: 54,
    avatarSvg: `
      <svg viewBox="0 0 130 160" class="enemy-svg voidcaller-svg">
        <!-- Obsidian Feathered Robes -->
        <path d="M 30 50 Q 15 105 25 150 Q 65 142 105 150 Q 115 105 100 50 Z" fill="#161824" stroke="#495057" stroke-width="2"/>
        <path d="M 40 40 Q 65 15 90 40 Q 100 75 65 80 Q 30 75 40 40 Z" fill="#2b2d42" stroke="#111" stroke-width="2"/>
        <!-- Raven Beak Mask -->
        <polygon points="55,45 75,45 65,85" fill="#f8f9fa" stroke="#333" stroke-width="2"/>
        <circle cx="58" cy="48" r="3.5" fill="#e03131"/>
        <circle cx="72" cy="48" r="3.5" fill="#e03131"/>
        <!-- Void Staff -->
        <line x1="105" y1="20" x2="115" y2="145" stroke="#495057" stroke-width="4" stroke-linecap="round"/>
        <circle cx="105" cy="18" r="10" fill="#7950f2" stroke="#e03131" stroke-width="2">
          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `,
    determineIntent(combat) {
      if (this.turnCount === 0) {
        this.intent = {
          type: INTENT_TYPES.BUFF,
          damage: 0,
          hits: 1,
          icon: '✨',
          description: 'Membacakan mantra ritual: memperoleh +3 Ritual (tambah Strength tiap giliran).'
        };
      } else {
        const dmg = this.calcAttackDamage(6);
        this.intent = {
          type: INTENT_TYPES.ATTACK,
          damage: dmg,
          hits: 1,
          icon: '⚔️',
          description: `Menembakkan sambaran Void Bolt sebesar ${dmg} damage.`
        };
      }
    },
    executeTurn(combat) {
      if (this.turnCount === 1) {
        this.status.ritual += 3;
        combat.showCombatText('Ritual Diaktifkan! (+3 Ritual)', this, '#da77f2');
        if (window.spireAudio) window.spireAudio.playPowerBuff();
      } else {
        const dmg = this.calcAttackDamage(6);
        combat.dealDamageToPlayer(dmg, this);
        if (window.spireAudio) window.spireAudio.playAttackSlash(false);
        combat.triggerVfx('slash', 'player');
      }
    }
  },

  // --------------------------------------------------------------------------
  // 2. GRAVEMAW CRAWLER (Pengganti Jaw Worm)
  // --------------------------------------------------------------------------
  gravemaw: {
    id: 'gravemaw',
    name: 'Gravemaw Crawler',
    lore: 'Kelabang raksasa berkulit kitin berduri tajam yang hidup dari memakan bebatuan dan mayat di liang kubur Exordium.',
    hpMin: 40,
    hpMax: 44,
    avatarSvg: `
      <svg viewBox="0 0 140 140" class="enemy-svg gravemaw-svg">
        <!-- Armored Chitin Segments -->
        <ellipse cx="70" cy="80" rx="45" ry="32" fill="#5c3d2e" stroke="#2b1810" stroke-width="3"/>
        <ellipse cx="85" cy="70" rx="35" ry="26" fill="#84563c" stroke="#2b1810" stroke-width="2"/>
        <ellipse cx="100" cy="60" rx="25" ry="20" fill="#b07d62" stroke="#2b1810" stroke-width="2"/>
        <!-- Mandible Jaws -->
        <path d="M 115 50 Q 135 40 130 65 Q 120 60 115 50 Z" fill="#e9ecef" stroke="#333" stroke-width="1.5"/>
        <path d="M 115 70 Q 135 80 130 55 Q 120 60 115 70 Z" fill="#e9ecef" stroke="#333" stroke-width="1.5"/>
        <!-- Glowing Red Eye Slits -->
        <circle cx="105" cy="55" r="3" fill="#ff2a2a"/>
      </svg>
    `,
    determineIntent(combat) {
      if (this.turnCount === 0) {
        const dmg = this.calcAttackDamage(11);
        this.intent = {
          type: INTENT_TYPES.ATTACK,
          damage: dmg,
          hits: 1,
          icon: '⚔️',
          description: `Menerjang dengan rahang pemotong sebesar ${dmg} damage.`
        };
      } else {
        const rand = Math.random();
        if (rand < 0.45) {
          this.intent = {
            type: INTENT_TYPES.DEFEND,
            damage: 0,
            hits: 1,
            icon: '🛡️',
            description: 'Mengeraskan cangkang: memperoleh 6 Block dan +3 Strength.'
          };
        } else if (rand < 0.8) {
          const dmg = this.calcAttackDamage(7);
          this.intent = {
            type: INTENT_TYPES.ATTACK_DEFEND,
            damage: dmg,
            hits: 1,
            icon: '⚔️🛡️',
            description: `Menyerang sebesar ${dmg} damage dan memperoleh 5 Block.`
          };
        } else {
          const dmg = this.calcAttackDamage(12);
          this.intent = {
            type: INTENT_TYPES.ATTACK,
            damage: dmg,
            hits: 1,
            icon: '⚔️',
            description: `Tebasan rahang mematikan sebesar ${dmg} damage.`
          };
        }
      }
    },
    executeTurn(combat) {
      if (this.intent.type === INTENT_TYPES.ATTACK) {
        const dmg = this.calcAttackDamage(this.intent.damage);
        combat.dealDamageToPlayer(dmg, this);
        if (window.spireAudio) window.spireAudio.playAttackSlash(true);
        combat.triggerVfx('slash', 'player');
      } else if (this.intent.type === INTENT_TYPES.DEFEND) {
        this.block += 6;
        this.status.strength += 3;
        combat.showCombatText('+6 Block & +3 STR', this, '#ffd43b');
        if (window.spireAudio) window.spireAudio.playPowerBuff();
      } else if (this.intent.type === INTENT_TYPES.ATTACK_DEFEND) {
        const dmg = this.calcAttackDamage(7);
        combat.dealDamageToPlayer(dmg, this);
        this.block += 5;
        combat.showCombatText('+5 Block', this, '#4dabf7');
        if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      }
    }
  },

  // --------------------------------------------------------------------------
  // 3. CRIMSON CARAPACE BEETLE (Pengganti Red Louse)
  // --------------------------------------------------------------------------
  crimson_beetle: {
    id: 'crimson_beetle',
    name: 'Crimson Carapace Beetle',
    lore: 'Kumbang parasit bertanduk tajam yang menghisap darah dari dinding menara. Jika diserang, tubuhnya otomatis menggulung menjadi bola perisai keras.',
    hpMin: 10,
    hpMax: 15,
    curlUp: 4,
    avatarSvg: `
      <svg viewBox="0 0 110 110" class="enemy-svg beetle-svg">
        <ellipse cx="55" cy="55" rx="35" ry="28" fill="#c92a2a" stroke="#491212" stroke-width="3"/>
        <line x1="20" y1="55" x2="90" y2="55" stroke="#212529" stroke-width="3"/>
        <!-- Horn Spikes -->
        <polygon points="55,20 60,35 50,35" fill="#f8f9fa"/>
        <circle cx="75" cy="45" r="3" fill="#ffe066"/>
      </svg>
    `,
    determineIntent(combat) {
      const dmg = this.calcAttackDamage(5 + Math.floor(Math.random() * 3));
      this.intent = {
        type: INTENT_TYPES.ATTACK,
        damage: dmg,
        hits: 1,
        icon: '⚔️',
        description: `Menanduk keras sebesar ${dmg} damage.`
      };
    },
    executeTurn(combat) {
      const dmg = this.calcAttackDamage(this.intent.damage);
      combat.dealDamageToPlayer(dmg, this);
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('impact', 'player');
    }
  },

  // --------------------------------------------------------------------------
  // 4. TOXIC CARAPACE BEETLE (Pengganti Green Louse)
  // --------------------------------------------------------------------------
  toxic_beetle: {
    id: 'toxic_beetle',
    name: 'Toxic Carapace Beetle',
    lore: 'Varian kumbang beracun yang menyemprotkan cairan asam pembusuk untuk memperlemah kekuatan pukulan musuh.',
    hpMin: 11,
    hpMax: 17,
    curlUp: 5,
    avatarSvg: `
      <svg viewBox="0 0 110 110" class="enemy-svg beetle-toxic-svg">
        <ellipse cx="55" cy="55" rx="35" ry="28" fill="#2f9e44" stroke="#081c15" stroke-width="3"/>
        <line x1="20" y1="55" x2="90" y2="55" stroke="#081c15" stroke-width="3"/>
        <polygon points="55,20 60,35 50,35" fill="#ffd43b"/>
        <circle cx="75" cy="45" r="3" fill="#ff6b6b"/>
      </svg>
    `,
    determineIntent(combat) {
      if (Math.random() < 0.4) {
        this.intent = {
          type: INTENT_TYPES.DEBUFF,
          damage: 0,
          hits: 1,
          icon: '🥀',
          description: 'Menyemprotkan ludah racun: mengaplikasikan 2 Weak ke pemain.'
        };
      } else {
        const dmg = this.calcAttackDamage(6);
        this.intent = {
          type: INTENT_TYPES.ATTACK,
          damage: dmg,
          hits: 1,
          icon: '⚔️',
          description: `Serangan capit racun sebesar ${dmg} damage.`
        };
      }
    },
    executeTurn(combat) {
      if (this.intent.type === INTENT_TYPES.DEBUFF) {
        combat.applyPlayerStatus('weak', 2);
        combat.showCombatText('+2 WEAK', 'player', '#ffd43b');
      } else {
        const dmg = this.calcAttackDamage(6);
        combat.dealDamageToPlayer(dmg, this);
        if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      }
    }
  },

  // --------------------------------------------------------------------------
  // 5. CAUSTIC OOZE AMALGAM (Pengganti Acid Slime M)
  // --------------------------------------------------------------------------
  caustic_ooze: {
    id: 'caustic_ooze',
    name: 'Caustic Ooze Amalgam',
    lore: 'Gumpalan lendir asam purba yang menelan peralatan perang dan tengkorak para penantang terdahulu.',
    hpMin: 28,
    hpMax: 32,
    avatarSvg: `
      <svg viewBox="0 0 120 110" class="enemy-svg ooze-svg">
        <path d="M 20 85 Q 10 40 45 35 Q 75 15 95 45 Q 115 75 95 90 Q 60 105 20 85 Z" fill="#40c057" stroke="#2b8a3e" stroke-width="3"/>
        <circle cx="45" cy="55" r="5" fill="#f8f9fa"/>
        <circle cx="75" cy="55" r="5" fill="#f8f9fa"/>
        <circle cx="47" cy="55" r="2.5" fill="#111"/>
        <circle cx="77" cy="55" r="2.5" fill="#111"/>
      </svg>
    `,
    determineIntent(combat) {
      if (Math.random() < 0.5) {
        const dmg = this.calcAttackDamage(8);
        this.intent = {
          type: INTENT_TYPES.ATTACK,
          damage: dmg,
          hits: 1,
          icon: '⚔️',
          description: `Menghantamkan cairan korosif sebesar ${dmg} damage.`
        };
      } else {
        const dmg = this.calcAttackDamage(5);
        this.intent = {
          type: INTENT_TYPES.ATTACK_DEBUFF,
          damage: dmg,
          hits: 1,
          icon: '⚔️🥀',
          description: `Meludahi pemain sebesar ${dmg} damage dan memberi kartu Slimed ke tumpukan discard.`
        };
      }
    },
    executeTurn(combat) {
      const dmg = this.calcAttackDamage(this.intent.damage);
      combat.dealDamageToPlayer(dmg, this);
      if (this.intent.type === INTENT_TYPES.ATTACK_DEBUFF) {
        combat.discardPile.push(new window.Card(window.CARD_DATABASE.slimed));
        combat.showCombatText('+Slimed Card', 'player', '#51cf66');
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
    }
  },

  // --------------------------------------------------------------------------
  // 6. SPOREFIEND STALKER (Pengganti Fungi Beast)
  // --------------------------------------------------------------------------
  sporefiend: {
    id: 'sporefiend',
    name: 'Sporefiend Stalker',
    lore: 'Makhluk karnivora berjamur yang melepaskan spora beracun saat terluka, mengaplikasikan Vulnerable pada setiap mangsanya.',
    hpMin: 22,
    hpMax: 28,
    avatarSvg: `
      <svg viewBox="0 0 120 120" class="enemy-svg sporefiend-svg">
        <ellipse cx="60" cy="70" rx="35" ry="30" fill="#a61e4d" stroke="#491212" stroke-width="3"/>
        <!-- Mushroom Caps on Back -->
        <circle cx="45" cy="40" r="14" fill="#f06595" stroke="#c2255c" stroke-width="2"/>
        <circle cx="75" cy="35" r="16" fill="#f06595" stroke="#c2255c" stroke-width="2"/>
        <circle cx="60" cy="75" r="4" fill="#fff"/>
      </svg>
    `,
    determineIntent(combat) {
      const dmg = this.calcAttackDamage(6);
      this.intent = {
        type: INTENT_TYPES.ATTACK,
        damage: dmg,
        hits: 1,
        icon: '⚔️',
        description: `Gigitan spora sebesar ${dmg} damage.`
      };
    },
    executeTurn(combat) {
      const dmg = this.calcAttackDamage(6);
      combat.dealDamageToPlayer(dmg, this);
      this.status.strength += 1;
      combat.showCombatText('+1 STR (Spore Growing)', this, '#ff6b6b');
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
    }
  },

  // --------------------------------------------------------------------------
  // 7. DREADHORN BERSERKER (ELITE - Pengganti Gremlin Nob)
  // --------------------------------------------------------------------------
  dreadhorn: {
    id: 'dreadhorn',
    name: 'Dreadhorn Berserker',
    isElite: true,
    lore: 'Raksasa bertanduk iblis berdarah panas yang sangat membenci pengguna sihir dan kartu bertahan. Setiap kali pemain menggunakan Skill, amarahnya melonjak drastis (+2 STR).',
    hpMin: 82,
    hpMax: 86,
    avatarSvg: `
      <svg viewBox="0 0 150 170" class="enemy-svg dreadhorn-svg">
        <!-- Giant Muscular Body -->
        <polygon points="40,50 110,50 120,150 30,150" fill="#9c1414" stroke="#491212" stroke-width="3"/>
        <!-- Huge Devil Horns -->
        <path d="M 45 40 Q 15 10 20 0 Q 35 20 50 35 Z" fill="#f8f9fa" stroke="#333" stroke-width="2"/>
        <path d="M 105 40 Q 135 10 130 0 Q 115 20 100 35 Z" fill="#f8f9fa" stroke="#333" stroke-width="2"/>
        <!-- Spiked Club -->
        <line x1="120" y1="60" x2="145" y2="160" stroke="#ced4da" stroke-width="8" stroke-linecap="round"/>
        <!-- Glowing Angry Eyes -->
        <circle cx="65" cy="55" r="4" fill="#ffd43b"/>
        <circle cx="85" cy="55" r="4" fill="#ffd43b"/>
      </svg>
    `,
    initialAiState: 'BELLOW',
    determineIntent(combat) {
      if (this.aiState === 'BELLOW') {
        this.intent = {
          type: INTENT_TYPES.BUFF,
          damage: 0,
          hits: 1,
          icon: '👹',
          description: 'Mengaum menggetarkan gua: memperoleh status Enrage (+2 STR setiap pemain memainkan kartu SKILL)!'
        };
      } else {
        const dmg = this.calcAttackDamage(this.turnCount % 2 === 0 ? 14 : 8);
        this.intent = {
          type: INTENT_TYPES.ATTACK,
          damage: dmg,
          hits: 1,
          icon: '⚔️',
          description: `Hantaman gada berduri sebesar ${dmg} damage.`
        };
      }
    },
    executeTurn(combat) {
      if (this.aiState === 'BELLOW') {
        this.status.enrage += 2;
        combat.showCombatText('ENRAGE ACTIVE (+2 STR per Skill!)', this, '#ff0000');
        this.aiState = 'ATTACKING';
        if (window.spireAudio) window.spireAudio.playPowerBuff();
      } else {
        const dmg = this.calcAttackDamage(this.intent.damage);
        combat.dealDamageToPlayer(dmg, this);
        if (window.spireAudio) window.spireAudio.playAttackSlash(true);
        combat.triggerVfx('heavy_slice', 'player');
      }
    }
  },

  // --------------------------------------------------------------------------
  // 8. CRYSTALLINE SENTRY SCARAB (ELITE - Pengganti Lagavulin)
  // --------------------------------------------------------------------------
  crystalline_sentry: {
    id: 'crystalline_sentry',
    name: 'Crystalline Sentry Scarab',
    isElite: true,
    lore: 'Kepompong kristal purba bertameng 8 Metallicize yang sedang hibernasi. Jika dibangunkan, ia akan menghancurkan 2 STR dan 2 DEX pemain secara permanen.',
    hpMin: 109,
    hpMax: 111,
    startsAsleep: true,
    avatarSvg: `
      <svg viewBox="0 0 150 160" class="enemy-svg sentry-svg">
        <polygon points="75,20 130,70 110,140 40,140 20,70" fill="#1864ab" stroke="#74c0fc" stroke-width="3"/>
        <polygon points="75,35 115,75 100,125 50,125 35,75" fill="#1c7ed6" stroke="#fff" stroke-width="1.5"/>
        <circle cx="75" cy="75" r="8" fill="#ffd43b"/>
      </svg>
    `,
    determineIntent(combat) {
      if (this.status.asleep) {
        this.intent = {
          type: INTENT_TYPES.SLEEP,
          damage: 0,
          hits: 1,
          icon: '💤',
          description: 'Sedang tertidur lelap (+8 Metallicize). Akan terbangun bila menerima serangan.'
        };
      } else {
        if (this.turnCount % 3 === 0) {
          this.intent = {
            type: INTENT_TYPES.DEBUFF,
            damage: 0,
            hits: 1,
            icon: '💔',
            description: 'Menghisap esensi pahlawan: -2 Strength & -2 Dexterity permanen!'
          };
        } else {
          const dmg = this.calcAttackDamage(18);
          this.intent = {
            type: INTENT_TYPES.ATTACK,
            damage: dmg,
            hits: 1,
            icon: '⚔️',
            description: `Tebasan kristal es sebesar ${dmg} damage.`
          };
        }
      }
    },
    executeTurn(combat) {
      if (this.status.asleep) {
        this.block += 8;
        combat.showCombatText('Zzz... (+8 Block)', this, '#74c0fc');
        if (this.turnCount >= 3) {
          this.status.asleep = false;
        }
      } else {
        if (this.intent.type === INTENT_TYPES.DEBUFF) {
          combat.player.status.strength = (combat.player.status.strength || 0) - 2;
          combat.player.status.dexterity = (combat.player.status.dexterity || 0) - 2;
          combat.showCombatText('-2 STR & -2 DEX!', 'player', '#ff4d4d');
          if (window.spireAudio) window.spireAudio.playPowerBuff();
        } else {
          const dmg = this.calcAttackDamage(18);
          combat.dealDamageToPlayer(dmg, this);
          if (window.spireAudio) window.spireAudio.playAttackSlash(true);
          combat.triggerVfx('heavy_slice', 'player');
        }
      }
    }
  },

  // --------------------------------------------------------------------------
  // 9. AETHER-RUNE SENTINEL (BOSS - Pengganti The Guardian)
  // --------------------------------------------------------------------------
  guardian_sentinel: {
    id: 'guardian_sentinel',
    name: 'Aether-Rune Sentinel',
    isBoss: true,
    lore: 'Golem penjaga puncak gerbang Exordium yang ditempa dari batu obsidian dan roda gigi aether. Dapat bertransformasi menjadi mode bola berduri tajam (Sharp Hide 3) saat HP-nya terpukul banyak.',
    hpMin: 240,
    hpMax: 250,
    avatarSvg: `
      <svg viewBox="0 0 160 180" class="enemy-svg guardian-svg">
        <!-- Giant Obsidian Core & Brass Gears -->
        <polygon points="80,15 145,55 145,135 80,175 15,135 15,55" fill="#212529" stroke="#ffd43b" stroke-width="3"/>
        <circle cx="80" cy="95" r="35" fill="#c92a2a" stroke="#fff" stroke-width="2"/>
        <line x1="80" y1="60" x2="80" y2="130" stroke="#ffd43b" stroke-width="3"/>
        <line x1="45" y1="95" x2="115" y2="95" stroke="#ffd43b" stroke-width="3"/>
      </svg>
    `,
    initialAiState: 'OFFENSIVE',
    determineIntent(combat) {
      if (this.aiState === 'DEFENSIVE') {
        this.intent = {
          type: INTENT_TYPES.DEFEND,
          damage: 0,
          hits: 1,
          icon: '🛡️🌵',
          description: 'Mode Pertahanan Bergulir: memperoleh 20 Block dan Sharp Hide 3 (memantulkan 3 damage per serangan).'
        };
      } else {
        if (this.turnCount % 2 === 0) {
          const dmg = this.calcAttackDamage(10);
          this.intent = {
            type: INTENT_TYPES.ATTACK,
            damage: dmg,
            hits: 2,
            icon: '⚔️⚔️',
            description: `Hantaman ganda beruntun sebesar ${dmg} x 2 (${dmg * 2}) damage.`
          };
        } else {
          const dmg = this.calcAttackDamage(32);
          this.intent = {
            type: INTENT_TYPES.ATTACK,
            damage: dmg,
            hits: 1,
            icon: '⚔️💥',
            description: `Meriam energi dahsyat sebesar ${dmg} damage!`
          };
        }
      }
    },
    executeTurn(combat) {
      if (this.aiState === 'DEFENSIVE') {
        this.block += 20;
        this.status.sharpHide = 3;
        combat.showCombatText('+20 Block & Sharp Hide 3', this, '#ffd43b');
        this.aiState = 'OFFENSIVE';
      } else {
        this.status.sharpHide = 0;
        if (this.intent.hits === 2) {
          const dmg = this.calcAttackDamage(10);
          combat.dealDamageToPlayer(dmg, this);
          combat.dealDamageToPlayer(dmg, this);
          if (window.spireAudio) window.spireAudio.playAttackSlash(true);
        } else {
          const dmg = this.calcAttackDamage(32);
          combat.dealDamageToPlayer(dmg, this);
          if (window.spireAudio) window.spireAudio.playAttackSlash(true);
          combat.triggerVfx('shockwave_ring', 'player');
        }
      }
    }
  },

  // --------------------------------------------------------------------------
  // 10. THE PRIMORDIAL ACID BEHEMOTH (BOSS - Pengganti Slime Boss)
  // --------------------------------------------------------------------------
  slime_behemoth: {
    id: 'slime_behemoth',
    name: 'The Primordial Acid Behemoth',
    isBoss: true,
    lore: 'Raksasa lendir asam seukuran kastil. Bila HP-nya turun ke bawah 50%, ia akan membelah diri menjadi dua Caustic Ooze berukuran besar!',
    hpMin: 140,
    hpMax: 150,
    avatarSvg: `
      <svg viewBox="0 0 170 160" class="enemy-svg behemoth-svg">
        <path d="M 20 120 Q 10 30 85 20 Q 160 30 150 120 Q 85 155 20 120 Z" fill="#2b8a3e" stroke="#081c15" stroke-width="4"/>
        <circle cx="60" cy="70" r="10" fill="#ffd43b"/>
        <circle cx="110" cy="70" r="10" fill="#ffd43b"/>
        <circle cx="62" cy="70" r="4" fill="#000"/>
        <circle cx="112" cy="70" r="4" fill="#000"/>
      </svg>
    `,
    determineIntent(combat) {
      if (this.turnCount % 3 === 0) {
        this.intent = {
          type: INTENT_TYPES.BUFF,
          damage: 0,
          hits: 1,
          icon: '🫧',
          description: 'Mempersiapkan bantingan maut: mengumpulkan asam pekat.'
        };
      } else {
        const dmg = this.calcAttackDamage(35);
        this.intent = {
          type: INTENT_TYPES.ATTACK,
          damage: dmg,
          hits: 1,
          icon: '⚔️💥',
          description: `Bantingan lendir purba sebesar ${dmg} damage!`
        };
      }
    },
    executeTurn(combat) {
      if (this.intent.type === INTENT_TYPES.BUFF) {
        combat.showCombatText('Asam Berbusa Menggelegak!', this, '#51cf66');
      } else {
        const dmg = this.calcAttackDamage(35);
        combat.dealDamageToPlayer(dmg, this);
        combat.discardPile.push(new window.Card(window.CARD_DATABASE.slimed));
        combat.discardPile.push(new window.Card(window.CARD_DATABASE.slimed));
        combat.showCombatText('+2 Slimed Cards', 'player', '#51cf66');
        if (window.spireAudio) window.spireAudio.playAttackSlash(true);
        combat.triggerVfx('fire_burst', 'player');
      }
    }
  },

  // --------------------------------------------------------------------------
  // 11. OBSIDIAN GARGOYLE
  // --------------------------------------------------------------------------
  obsidian_gargoyle: {
    id: 'obsidian_gargoyle',
    name: 'Obsidian Stone Gargoyle',
    lore: 'Patung gargoyle batu obsidian hidup yang bertengger di kubah menara. Mampu mengubah kulitnya menjadi batu granit keras tak tertembus saat diserang.',
    hpMin: 42,
    hpMax: 48,
    avatarSvg: `
      <svg viewBox="0 0 140 140" class="enemy-svg gargoyle-svg">
        <path d="M 70 60 Q 20 20 5 60 Q 30 80 70 70 Z" fill="#343a40" stroke="#212529" stroke-width="2"/>
        <path d="M 70 60 Q 120 20 135 60 Q 110 80 70 70 Z" fill="#343a40" stroke="#212529" stroke-width="2"/>
        <polygon points="50,45 90,45 80,105 60,105" fill="#495057" stroke="#212529" stroke-width="2"/>
        <polygon points="55,30 62,45 50,45" fill="#ced4da"/>
        <polygon points="85,30 90,45 78,45" fill="#ced4da"/>
        <circle cx="63" cy="52" r="3" fill="#f59f00"/>
        <circle cx="77" cy="52" r="3" fill="#f59f00"/>
      </svg>
    `,
    determineIntent(combat) {
      if (this.turnCount % 2 === 0) {
        const dmg = this.calcAttackDamage(14);
        this.intent = {
          type: INTENT_TYPES.ATTACK,
          damage: dmg,
          hits: 1,
          icon: '⚔️',
          description: `Tukikan cakar batu tajam sebesar ${dmg} damage.`
        };
      } else {
        this.intent = {
          type: INTENT_TYPES.DEFEND,
          damage: 0,
          hits: 1,
          icon: '🛡️🗿',
          description: 'Membatu: memperoleh 12 Block dan +2 Strength.'
        };
      }
    },
    executeTurn(combat) {
      if (this.intent.type === INTENT_TYPES.ATTACK) {
        const dmg = this.calcAttackDamage(14);
        combat.dealDamageToPlayer(dmg, this);
        if (window.spireAudio) window.spireAudio.playAttackSlash(true);
        combat.triggerVfx('heavy_slice', 'player');
      } else {
        this.block += 12;
        this.status.strength += 2;
        combat.showCombatText('+12 Block & +2 STR (Petrify)', this, '#ced4da');
        if (window.spireAudio) window.spireAudio.playBlock();
      }
    }
  },

  // --------------------------------------------------------------------------
  // 12. NETHER KNIGHT (ELITE)
  // --------------------------------------------------------------------------
  nether_knight: {
    id: 'nether_knight',
    name: 'Nether Halberdier Knight',
    isElite: true,
    lore: 'Kesatria arwah berzirah hitam pekat yang mengayunkan tombak berbilah kutukan. Setiap tebasannya meremukkan sendi pahlawan.',
    hpMin: 78,
    hpMax: 84,
    avatarSvg: `
      <svg viewBox="0 0 140 160" class="enemy-svg nether-knight-svg">
        <polygon points="45,40 95,40 85,135 55,135" fill="#1c1c24" stroke="#7048e8" stroke-width="2.5"/>
        <polygon points="50,20 90,20 85,42 55,42" fill="#2b2b36" stroke="#7048e8" stroke-width="2"/>
        <line x1="60" y1="32" x2="80" y2="32" stroke="#9775fa" stroke-width="3" stroke-linecap="round"/>
        <line x1="110" y1="10" x2="120" y2="150" stroke="#ced4da" stroke-width="4" stroke-linecap="round"/>
        <polygon points="105,15 125,10 115,45" fill="#da77f2"/>
      </svg>
    `,
    determineIntent(combat) {
      if (this.turnCount % 3 === 0) {
        const dmg = this.calcAttackDamage(8);
        this.intent = {
          type: INTENT_TYPES.ATTACK_DEBUFF,
          damage: dmg,
          hits: 2,
          icon: '⚔️🧱',
          description: `Tebasan ganda halberd ${dmg} x 2 dan mengaplikasikan 2 Frail.`
        };
      } else {
        const dmg = this.calcAttackDamage(16);
        this.intent = {
          type: INTENT_TYPES.ATTACK,
          damage: dmg,
          hits: 1,
          icon: '⚔️💥',
          description: `Hantaman tombak kutukan sebesar ${dmg} damage.`
        };
      }
    },
    executeTurn(combat) {
      if (this.intent.type === INTENT_TYPES.ATTACK_DEBUFF) {
        const dmg = this.calcAttackDamage(8);
        combat.dealDamageToPlayer(dmg, this);
        combat.dealDamageToPlayer(dmg, this);
        combat.applyPlayerStatus('frail', 2);
        combat.showCombatText('+2 FRAIL APPLIED', 'player', '#ff922b');
        if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      } else {
        const dmg = this.calcAttackDamage(16);
        combat.dealDamageToPlayer(dmg, this);
        if (window.spireAudio) window.spireAudio.playAttackSlash(true);
        combat.triggerVfx('heavy_slice', 'player');
      }
    }
  },

  // --------------------------------------------------------------------------
  // 13. CORRUPTED ARCHANGEL (BOSS OF ACT 2)
  // --------------------------------------------------------------------------
  corrupted_archangel: {
    id: 'corrupted_archangel',
    name: 'Fallen Seraph of the Void',
    isBoss: true,
    lore: 'Malaikat agung bersayap enam yang tercemar oleh void di lantai tertinggi Shadowspire. Memiliki lingkaran halo darah yang memancarkan pilar penghakiman suci-gelap.',
    hpMin: 280,
    hpMax: 300,
    avatarSvg: `
      <svg viewBox="0 0 170 190" class="enemy-svg archangel-svg">
        <path d="M 85 80 Q 20 20 0 70 Q 40 90 85 85 Z" fill="#1a080c" stroke="#e03131" stroke-width="2"/>
        <path d="M 85 80 Q 150 20 170 70 Q 130 90 85 85 Z" fill="#1a080c" stroke="#e03131" stroke-width="2"/>
        <path d="M 85 95 Q 15 80 5 130 Q 50 120 85 100 Z" fill="#2b1016" stroke="#c92a2a" stroke-width="2"/>
        <path d="M 85 95 Q 155 80 165 130 Q 120 120 85 100 Z" fill="#2b1016" stroke="#c92a2a" stroke-width="2"/>
        <polygon points="75,60 95,60 90,165 80,165" fill="#f8f9fa" stroke="#333" stroke-width="2"/>
        <ellipse cx="85" cy="35" rx="28" ry="9" fill="none" stroke="#ff2a2a" stroke-width="3" stroke-dasharray="6 3"/>
        <circle cx="85" cy="52" r="12" fill="#fff" stroke="#333" stroke-width="1.5"/>
      </svg>
    `,
    determineIntent(combat) {
      if (this.turnCount % 4 === 0) {
        const dmg = this.calcAttackDamage(40);
        this.intent = {
          type: INTENT_TYPES.ATTACK,
          damage: dmg,
          hits: 1,
          icon: '⚔️⚡🔥',
          description: `Penghakiman Kiamat Seraph sebesar ${dmg} damage!`
        };
      } else if (this.turnCount % 2 === 0) {
        const dmg = this.calcAttackDamage(9);
        this.intent = {
          type: INTENT_TYPES.ATTACK,
          damage: dmg,
          hits: 3,
          icon: '⚔️⚔️⚔️',
          description: `Tiga Sambaran Sayap Malam ${dmg} x 3 (${dmg * 3}) damage.`
        };
      } else {
        this.intent = {
          type: INTENT_TYPES.DEFEND,
          damage: 0,
          hits: 1,
          icon: '🛡️✨',
          description: 'Aegis Sayap Suci: Memperoleh 25 Block dan +2 Strength.'
        };
      }
    },
    executeTurn(combat) {
      if (this.intent.type === INTENT_TYPES.DEFEND) {
        this.block += 25;
        this.status.strength += 2;
        combat.showCombatText('+25 Block & +2 STR (Seraph Wings)', this, '#ffd43b');
        if (window.spireAudio) window.spireAudio.playPowerBuff();
      } else if (this.intent.hits === 3) {
        const dmg = this.calcAttackDamage(9);
        for (let i = 0; i < 3; i++) combat.dealDamageToPlayer(dmg, this);
        if (window.spireAudio) window.spireAudio.playAttackSlash(true);
        combat.triggerVfx('cleave_sweep', 'player');
      } else {
        const dmg = this.calcAttackDamage(40);
        combat.dealDamageToPlayer(dmg, this);
        if (window.spireAudio) window.spireAudio.playAttackSlash(true);
        combat.triggerVfx('shockwave_ring', 'player');
        if (window.spireVfx) window.spireVfx.triggerScreenShake('heavy');
      }
    }
  }
};

// Generator Pertarungan Sesuai Lantai dan Tipe
function createEncounter(type = 'NORMAL', floorNum = 1) {
  if (type === 'BOSS') {
    const bossKeys = ['guardian_sentinel', 'slime_behemoth'];
    const chosen = bossKeys[Math.floor(Math.random() * bossKeys.length)];
    return [new MonsterEntity(BESTIARY_DATABASE[chosen], floorNum)];
  }

  if (type === 'ELITE') {
    const eliteKeys = ['dreadhorn', 'crystalline_sentry'];
    const chosen = eliteKeys[Math.floor(Math.random() * eliteKeys.length)];
    return [new MonsterEntity(BESTIARY_DATABASE[chosen], floorNum)];
  }

  // Pertarungan Biasa (Normal Encounter)
  if (floorNum === 1) {
    const easy = ['voidcaller', 'gravemaw', 'crimson_beetle'];
    const chosen = easy[Math.floor(Math.random() * easy.length)];
    return [new MonsterEntity(BESTIARY_DATABASE[chosen], floorNum)];
  }

  if (Math.random() < 0.35) {
    // 2 Monster sekaligus
    return [
      new MonsterEntity(BESTIARY_DATABASE.crimson_beetle, floorNum),
      new MonsterEntity(BESTIARY_DATABASE.toxic_beetle, floorNum)
    ];
  }

  const pool = ['voidcaller', 'gravemaw', 'caustic_ooze', 'sporefiend'];
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return [new MonsterEntity(BESTIARY_DATABASE[chosen], floorNum)];
}

window.INTENT_TYPES = INTENT_TYPES;
window.BESTIARY_DATABASE = BESTIARY_DATABASE;
window.ENEMY_DATABASE = BESTIARY_DATABASE;
window.MonsterEntity = MonsterEntity;
window.createEncounter = createEncounter;
