/**

 * ============================================================================
 * SHADOWSPIRE: CHRONICLES OF ASCENSION - MASTER CARD ENCYCLOPEDIA
 * ============================================================================
 * Ensiklopedia lengkap kartu orisinal Shadowspire untuk 10 arketipe pahlawan,
 * kartu Colorless, serta Status & Curse.
 * Setiap kartu memiliki scaling dinamis, sistem upgrade (+), metadata visual,
 * trigger audio synthesizer, dan eksekusi presisi.
 */

const CARD_TYPES = {
  ATTACK: 'ATTACK',
  SKILL: 'SKILL',
  POWER: 'POWER',
  STATUS: 'STATUS',
  CURSE: 'CURSE'
};

const CARD_RARITIES = {
  BASIC: 'BASIC',
  COMMON: 'COMMON',
  UNCOMMON: 'UNCOMMON',
  RARE: 'RARE',
  SPECIAL: 'SPECIAL',
  CURSE: 'CURSE'
};

const TARGET_TYPES = {
  ENEMY: 'ENEMY',
  ALL_ENEMIES: 'ALL_ENEMIES',
  SELF: 'SELF',
  NONE: 'NONE'
};

const CARD_DATABASE = {
  // ==========================================================================
  // 1. KARTU DASAR & CORE WARRIOR (THE IRONCLAD & UNIVERSAL)
  // ==========================================================================

  
  // ==========================================================================
  // SUNG JIN-WOO & SATORU GOJO SIGNATURE CARDS
  // ==========================================================================
  dagger_strike: {
    id: 'dagger_strike',
    name: 'Dagger Rush',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.ENEMY,
    damage: 9,
    upgradedDamage: 13,
    description: 'Deal !D! damage. If target HP < 50%, deal double damage.',
    upgradedDesc: 'Deal !D! damage. If target HP < 50%, deal double damage.',
    lore: 'Tusukan belati beruntun yang mengincar celah terlemah musuh.',
    artIcon: '🗡️⚡',
    artTheme: 'sukuna_cleave',
    execute(combat, target) {
      let dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      if (target && target.currentHp <= (target.maxHp * 0.5)) {
        dmg *= 2;
        combat.showCombatText('CRITICAL EXECUTE (x2)!', 'player', '#ff2a2a');
      }
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('slash', target);
    }
  },

  bloodlust_glare: {
    id: 'bloodlust_glare',
    name: 'Bloodlust Glare',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    block: 6,
    upgradedBlock: 9,
    description: 'Apply 2 Weak and 2 Vulnerable to ALL enemies. Gain !B! Block.',
    upgradedDesc: 'Apply 2 Weak and 2 Vulnerable to ALL enemies. Gain !B! Block.',
    lore: 'Tekanan niat membunuh sang Penguasa Bayangan yang membekukan darah musuh.',
    artIcon: '👁️🩸',
    artTheme: 'black_flash',
    execute(combat) {
      combat.gainPlayerBlock(combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block));
      combat.enemies.forEach(e => {
        if ((!e.isDead && !e.hasEscaped && e.currentHp > 0)) {
          e.status.weak = (e.status.weak || 0) + 2;
          e.status.vulnerable = (e.status.vulnerable || 0) + 2;
        }
      });
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('shockwave_ring', 'player');
    }
  },

  shadow_slash: {
    id: 'shadow_slash',
    name: 'Shadow Mutilation',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 14,
    upgradedDamage: 18,
    block: 6,
    upgradedBlock: 9,
    exhaust: true,
    description: 'Deal !D! damage. Gain !B! Block. Exhaust.',
    upgradedDesc: 'Deal !D! damage. Gain !B! Block. Exhaust.',
    lore: 'Tebasan bayangan beruntun yang merobek zirah dan meninggalkan pelindung kabut.',
    artIcon: '🌑⚔️',
    artTheme: 'shadow_arise',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.dealDamageToEnemy(target, dmg);
      combat.gainPlayerPlayerBlock ? combat.gainPlayerPlayerBlock(blk) : combat.gainPlayerBlock(blk);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('heavy_slice', target);
    }
  },

  dominators_touch: {
    id: 'dominators_touch',
    name: "Ruler's Hand",
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    block: 8,
    upgradedBlock: 12,
    description: 'Draw 3 cards. Gain !B! Block.',
    upgradedDesc: 'Draw 3 cards. Gain !B! Block.',
    lore: 'Mengendalikan gravitasi tak terlihat untuk menarik kartu takdir.',
    artIcon: '✋🌌',
    artTheme: 'shadow_arise',
    execute(combat) {
      combat.drawCards(3);
      combat.gainPlayerBlock(combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block));
      if (window.spireAudio) window.spireAudio.playCardDraw();
    }
  },

  monarchs_domain: {
    id: 'monarchs_domain',
    name: "Monarch's Realm",
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    description: 'At start of each turn, deal 6 damage to all enemies and gain +1 Strength.',
    upgradedDesc: 'At start of each turn, deal 9 damage to all enemies and gain +1 Strength.',
    lore: 'Membentangkan domain bayangan abadi di mana seluruh musuh ditelan kegelapan.',
    artIcon: '👑🌑',
    artTheme: 'domain_expansion',
    execute(combat) {
      combat.applyPlayerStatus('strength', 1);
      combat.showCombatText('👑 MONARCH REALM EXPANDED!', 'player', '#9775fa');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
    }
  },

  limitless_blue: {
    id: 'limitless_blue',
    name: 'Technique Blue: Lapse',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    description: 'Draw 2 cards. Target deals -3 damage on their next attack.',
    upgradedDesc: 'Draw 3 cards. Target deals -4 damage on their next attack.',
    lore: 'Menciptakan ruang hampa negatif yang menyedot energi lawan.',
    artIcon: '🌀🔵',
    artTheme: 'hollow_purple',
    execute(combat, target) {
      combat.drawCards(this.isUpgraded ? 3 : 2);
      if (target) {
        target.status.weak = (target.status.weak || 0) + (this.isUpgraded ? 3 : 2);
      }
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('shockwave_ring', target);
    }
  },

  limitless_red: {
    id: 'limitless_red',
    name: 'Technique Red: Reversal',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 15,
    upgradedDamage: 20,
    block: 8,
    upgradedBlock: 12,
    description: 'Deal !D! damage. Gain !B! Block.',
    upgradedDesc: 'Deal !D! damage. Gain !B! Block.',
    lore: 'Membalikkan cursed energy menjadi gaya tolak masif yang melontarkan musuh.',
    artIcon: '🔴💥',
    artTheme: 'sun_breathing',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.dealDamageToEnemy(target, dmg);
      combat.gainPlayerBlock(blk);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('heavy_slice', target);
    }
  },

  hollow_purple_mini: {
    id: 'hollow_purple_mini',
    name: 'Hollow Technique: Purple',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 28,
    upgradedDamage: 38,
    exhaust: true,
    description: 'Deal !D! Piercing damage to ALL enemies (Ignores Block). Exhaust.',
    upgradedDesc: 'Deal !D! Piercing damage to ALL enemies (Ignores Block). Exhaust.',
    lore: 'Tabrakan antara Blue dan Red melahirkan massa imajiner yang menghapus keberadaan.',
    artIcon: '🟣⚡',
    artTheme: 'hollow_purple',
    execute(combat) {
      const baseDmg = this.isUpgraded ? this.upgradedDamage : this.damage;
      const dmg = combat.calcDamage(baseDmg);
      combat.enemies.forEach(e => {
        if ((!e.isDead && !e.hasEscaped && e.currentHp > 0)) {
          // Piercing ignores block
          e.currentHp = Math.max(0, e.currentHp - dmg);
          combat.triggerVfx('heavy_slice', e);
        }
      });
      combat.showCombatText(`🟣 HOLLOW PURPLE (${dmg} PIERCING)!`, 'player', '#da77f2');
      if (window.spireAudio) window.spireAudio.playBlackFlash();
      if (window.spireVfx) window.spireVfx.triggerScreenShake('heavy');
    }
  },

  six_eyes_focus: {
    id: 'six_eyes_focus',
    name: 'Six Eyes Focus',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    description: 'Gain 1 Energy. Draw 1 card.',
    upgradedDesc: 'Gain 2 Energy. Draw 1 card.',
    lore: 'Mata pusaka Six Eyes memfokuskan pemrosesan informasi tanpa batas.',
    artIcon: '👁️✨',
    artTheme: 'chidori_spark',
    execute(combat) {
      combat.energy += this.isUpgraded ? 2 : 1;
      combat.drawCards(1);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.showCombatText('+Energy (Six Eyes Focus)', 'player', '#00f0ff');
    }
  },

  infinity_ward: {
    id: 'infinity_ward',
    name: 'Limitless: Infinity',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    block: 16,
    upgradedBlock: 22,
    description: 'Gain !B! Block. Retain.',
    upgradedDesc: 'Gain !B! Block. Retain.',
    lore: 'Ruang tanpa batas di antara Gojo dan musuh menghentikan setiap serangan.',
    artIcon: '🛡️♾️',
    artTheme: 'dead_calm',
    execute(combat) {
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.gainPlayerBlock(blk);
      if (window.spireAudio) window.spireAudio.playBlock();
      combat.triggerVfx('shield', 'player');
    }
  },

  strike: {
    id: 'strike',
    name: 'Abyssal Cleave',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.ENEMY,
    damage: 6,
    upgradedDamage: 9,
    description: 'Deal !D! damage.',
    upgradedDesc: 'Deal !D! damage.',
    lore: 'Tebasan lurus pedang baja yang dilapisi aura kegelapan Shadowspire.',
    artIcon: '⚔️💥',
    artTheme: 'abyssal-strike',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target);
    }
  },

  defend: {
    id: 'defend',
    name: 'Aegis Ward',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.SELF,
    block: 5,
    upgradedBlock: 8,
    description: 'Gain !B! Block.',
    upgradedDesc: 'Gain !B! Block.',
    lore: 'Membentangkan perisai besi bertatahkan rune pelindung untuk menahan serangan.',
    artIcon: '🛡️✨',
    artTheme: 'aegis-ward',
    execute(combat) {
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.gainPlayerBlock(blk);
      if (window.spireAudio) window.spireAudio.playBlock();
      combat.triggerVfx('shield', 'player');
    }
  },

  bash: {
    id: 'bash',
    name: 'Skullcrusher Smite',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.ENEMY,
    damage: 8,
    upgradedDamage: 10,
    vulnerable: 2,
    upgradedVulnerable: 3,
    description: 'Deal !D! damage. Apply !V! Vulnerable.',
    upgradedDesc: 'Deal !D! damage. Apply !V! Vulnerable.',
    lore: 'Hantaman gada mematikan yang meretakkan tulang perisai musuh.',
    artIcon: '🔨💥',
    artTheme: 'skullcrusher',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const v = this.isUpgraded ? this.upgradedVulnerable : this.vulnerable;
      combat.dealDamageToEnemy(target, dmg);
      combat.applyEnemyStatus(target, 'vulnerable', v);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('heavy_slice', target);
    }
  },

  cleave: {
    id: 'cleave',
    name: 'Whirlwind Sever',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 8,
    upgradedDamage: 11,
    description: 'Deal !D! damage to ALL enemies.',
    upgradedDesc: 'Deal !D! damage to ALL enemies.',
    lore: 'Ayunan berputar 360 derajat yang memotong barisan musuh di sekitar.',
    artIcon: '🌀⚔️',
    artTheme: 'whirlwind-sever',
    execute(combat) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToAllEnemies(dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('cleave_sweep', 'all');
    }
  },

  iron_wave: {
    id: 'iron_wave',
    name: 'Blood Iron Surge',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 5,
    upgradedDamage: 7,
    block: 5,
    upgradedBlock: 7,
    description: 'Gain !B! Block. Deal !D! damage.',
    upgradedDesc: 'Gain !B! Block. Deal !D! damage.',
    lore: 'Maju menerjang dengan perisai terlebih dahulu sebelum menusuk dengan belati.',
    artIcon: '🛡️🗡️',
    artTheme: 'iron-surge',
    execute(combat, target) {
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.gainPlayerBlock(blk);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playBlock();
      combat.triggerVfx('shield', 'player');
      combat.triggerVfx('slash', target);
    }
  },

  pommel_strike: {
    id: 'pommel_strike',
    name: 'Hilt Pummel',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 9,
    upgradedDamage: 10,
    drawCards: 1,
    upgradedDraw: 2,
    description: 'Deal !D! damage. Draw 1 card.',
    upgradedDesc: 'Deal !D! damage. Draw 2 cards.',
    lore: 'Hantaman pangkal gagang pedang ke dahi musuh untuk mengacaukan konsentrasinya.',
    artIcon: '🥊📜',
    artTheme: 'hilt-pummel',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const count = this.isUpgraded ? this.upgradedDraw : this.drawCards;
      combat.dealDamageToEnemy(target, dmg);
      combat.drawCards(count);
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('impact', target);
    }
  },

  twin_strike: {
    id: 'twin_strike',
    name: 'Twin Fang Slash',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 5,
    upgradedDamage: 7,
    description: 'Deal !D! damage twice.',
    upgradedDesc: 'Deal !D! damage twice.',
    lore: 'Sepasang sabetan menyilang dengan kecepatan tinggi menembus titik lemah musuh.',
    artIcon: '⚔️⚔️',
    artTheme: 'twin-fang',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('slash', target);
    }
  },

  heavy_blade: {
    id: 'heavy_blade',
    name: 'Executioner Greatsword',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 14,
    upgradedDamage: 14,
    strMultiplier: 3,
    upgradedStrMultiplier: 5,
    description: 'Deal !D! damage. Strength affects this card 3 times.',
    upgradedDesc: 'Deal !D! damage. Strength affects this card 5 times.',
    lore: 'Pedang algojo raksasa yang membutuhkan tenaga luar biasa untuk dihantamkan.',
    artIcon: '🗡️💪',
    artTheme: 'executioner-blade',
    execute(combat, target) {
      const mult = this.isUpgraded ? this.upgradedStrMultiplier : this.strMultiplier;
      const bonusStr = (combat.player.status.strength || 0) * (mult - 1);
      const base = (this.isUpgraded ? this.upgradedDamage : this.damage) + bonusStr;
      const dmg = combat.calcDamage(base);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('heavy_slice', target);
    }
  },

  body_slam: {
    id: 'body_slam',
    name: 'Shield Titan Charge',
    cost: 1,
    upgradedCost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    description: 'Deal damage equal to your current Block.',
    upgradedDesc: 'Deal damage equal to your current Block.',
    lore: 'Menggunakan seluruh massa perisai baja untuk menabrak musuh.',
    artIcon: '🛡️🏃‍♂️',
    artTheme: 'shield-charge',
    execute(combat, target) {
      const dmg = combat.calcDamage(combat.player.block, true);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('impact', target);
    }
  },

  clash: {
    id: 'clash',
    name: 'Blade Symphony',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 14,
    upgradedDamage: 18,
    description: 'Can only be played if every card in your hand is an Attack. Deal !D! damage.',
    upgradedDesc: 'Can only be played if every card in your hand is an Attack. Deal !D! damage.',
    lore: 'Ketika pertahanan dilupakan demi serangan total yang sempurna.',
    artIcon: '⚔️⚡',
    artTheme: 'blade-symphony',
    execute(combat, target) {
      const allAttacks = combat.hand.every(c => c.type === CARD_TYPES.ATTACK);
      if (!allAttacks) {
        combat.showCombatText('Only Attacks Allowed!', 'player', '#ff6b6b');
        return;
      }
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('heavy_slice', target);
    }
  },

  clothesline: {
    id: 'clothesline',
    name: 'Jawbreaker Impact',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 12,
    upgradedDamage: 14,
    weak: 2,
    upgradedWeak: 3,
    description: 'Deal !D! damage. Apply !W! Weak.',
    upgradedDesc: 'Deal !D! damage. Apply !W! Weak.',
    lore: 'Bantingan lengan keras ke leher lawan yang menghentikan momentum mereka.',
    artIcon: '🥊🥀',
    artTheme: 'jawbreaker',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const w = this.isUpgraded ? this.upgradedWeak : this.weak;
      combat.dealDamageToEnemy(target, dmg);
      combat.applyEnemyStatus(target, 'weak', w);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('impact', target);
    }
  },

  headbutt: {
    id: 'headbutt',
    name: 'Iron Skull Bash',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 9,
    upgradedDamage: 12,
    description: 'Deal !D! damage. Put a card from your discard pile on top of your draw pile.',
    upgradedDesc: 'Deal !D! damage. Put a card from your discard pile on top of your draw pile.',
    lore: 'Sundulan kepala bertopeng besi yang memunculkan kembali ingatan taktik lama.',
    artIcon: '💀💥',
    artTheme: 'skull-bash',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (combat.discardPile.length > 0) {
        const retrieved = combat.discardPile.pop();
        combat.drawPile.push(retrieved);
        combat.showCombatText(`Prepared: ${retrieved.name}`, 'player', '#ffd43b');
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('impact', target);
    }
  },

  thunderclap: {
    id: 'thunderclap',
    name: 'Stormclap Shock',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 4,
    upgradedDamage: 7,
    vulnerable: 1,
    description: 'Deal !D! damage and apply 1 Vulnerable to ALL enemies.',
    upgradedDesc: 'Deal !D! damage and apply 1 Vulnerable to ALL enemies.',
    lore: 'Tepukan gelombang kejut petir yang memekakkan telinga seluruh musuh.',
    artIcon: '⚡📢',
    artTheme: 'stormclap',
    execute(combat) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToAllEnemies(dmg);
      combat.enemies.forEach(e => {
        if (!e.isDead && !e.hasEscaped) combat.applyEnemyStatus(e, 'vulnerable', 1);
      });
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('shockwave_ring', 'all');
    }
  },

  shrug_it_off: {
    id: 'shrug_it_off',
    name: 'Deflective Parry',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    block: 8,
    upgradedBlock: 11,
    description: 'Gain !B! Block. Draw 1 card.',
    upgradedDesc: 'Gain !B! Block. Draw 1 card.',
    lore: 'Menangkis tebasan musuh dengan acuh sambil bersiap melancarkan serangan balasan.',
    artIcon: '🛡️🃏',
    artTheme: 'deflective-parry',
    execute(combat) {
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.gainPlayerBlock(blk);
      combat.drawCards(1);
      if (window.spireAudio) window.spireAudio.playBlock();
      combat.triggerVfx('shield', 'player');
    }
  },

  armaments: {
    id: 'armaments',
    name: 'Forge Blessing',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    block: 5,
    upgradedBlock: 5,
    description: 'Gain !B! Block. Upgrade a card in your hand for combat.',
    upgradedDesc: 'Gain !B! Block. Upgrade ALL cards in your hand for combat.',
    lore: 'Percikan api perapian suci memperkuat ketajaman senjata di medan tempur.',
    artIcon: '🔨🛡️',
    artTheme: 'forge-blessing',
    execute(combat) {
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.gainPlayerBlock(blk);
      combat.upgradeHandCards(this.isUpgraded);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  warcry: {
    id: 'warcry',
    name: 'Battle Cry',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    drawCards: 1,
    upgradedDraw: 2,
    exhaust: true,
    description: 'Draw 1 card. Put a card from your hand onto the top of your draw pile. Exhaust.',
    upgradedDesc: 'Draw 2 cards. Put a card from your hand onto the top of your draw pile. Exhaust.',
    lore: 'Pekikan perang yang memompa adrenalin dan menata fokus pikiran.',
    artIcon: '📣⚡',
    artTheme: 'battle-cry',
    execute(combat) {
      combat.drawCards(this.isUpgraded ? 2 : 1);
      if (combat.hand.length > 0) {
        const backCard = combat.hand.pop();
        combat.drawPile.push(backCard);
      }
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  carnage: {
    id: 'carnage',
    name: 'Abyssal Carnage',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 20,
    upgradedDamage: 28,
    ethereal: true,
    description: 'Ethereal. Deal !D! damage.',
    upgradedDesc: 'Ethereal. Deal !D! damage.',
    lore: 'Haus darah tanpa batas yang akan menguap bila tidak segera dieksekusi.',
    artIcon: '🩸⚔️',
    artTheme: 'abyssal-carnage',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('heavy_slice', target);
    }
  },

  uppercut: {
    id: 'uppercut',
    name: 'Gauntlet Uppercut',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 13,
    upgradedDamage: 13,
    weak: 1,
    upgradedWeak: 2,
    vulnerable: 1,
    upgradedVulnerable: 2,
    description: 'Deal !D! damage. Apply !W! Weak. Apply !V! Vulnerable.',
    upgradedDesc: 'Deal !D! damage. Apply !W! Weak. Apply !V! Vulnerable.',
    lore: 'Pukulan tinju berpelindung besi ke rahang musuh yang membuatnya linglung.',
    artIcon: '🥊⚡',
    artTheme: 'gauntlet-uppercut',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const w = this.isUpgraded ? this.upgradedWeak : this.weak;
      const v = this.isUpgraded ? this.upgradedVulnerable : this.vulnerable;
      combat.dealDamageToEnemy(target, dmg);
      combat.applyEnemyStatus(target, 'weak', w);
      combat.applyEnemyStatus(target, 'vulnerable', v);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('impact', target);
    }
  },

  whirlwind: {
    id: 'whirlwind',
    name: 'Blade Cyclone',
    cost: -1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 5,
    upgradedDamage: 8,
    description: 'Deal !D! damage to ALL enemies X times.',
    upgradedDesc: 'Deal !D! damage to ALL enemies X+1 times.',
    lore: 'Badai puting beliung baja yang menyapu bersih seisi arena tempur.',
    artIcon: '🌪️⚔️',
    artTheme: 'blade-cyclone',
    execute(combat) {
      const energyUsed = combat.energy;
      combat.energy = 0;
      const hits = this.isUpgraded ? (energyUsed + 1) : energyUsed;
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      for (let i = 0; i < hits; i++) {
        combat.dealDamageToAllEnemies(dmg);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('cleave_sweep', 'all');
    }
  },

  flame_barrier: {
    id: 'flame_barrier',
    name: 'Infernal Cloak',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    block: 12,
    upgradedBlock: 16,
    flameDamage: 4,
    upgradedFlameDamage: 6,
    description: 'Gain !B! Block. Whenever you are attacked this turn, deal 4 damage back.',
    upgradedDesc: 'Gain !B! Block. Whenever you are attacked this turn, deal 6 damage back.',
    lore: 'Menyelimuti tubuh dengan mantel lidah api neraka yang membakar penyerang.',
    artIcon: '🔥🛡️',
    artTheme: 'infernal-cloak',
    execute(combat) {
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.gainPlayerBlock(blk);
      combat.player.status.flameBarrier = this.isUpgraded ? this.upgradedFlameDamage : this.flameDamage;
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('fire_burst', 'player');
    }
  },

  shockwave: {
    id: 'shockwave',
    name: 'Tremor Roar',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    weak: 3,
    upgradedWeak: 5,
    vulnerable: 3,
    upgradedVulnerable: 5,
    exhaust: true,
    description: 'Apply !W! Weak and !V! Vulnerable to ALL enemies. Exhaust.',
    upgradedDesc: 'Apply !W! Weak and !V! Vulnerable to ALL enemies. Exhaust.',
    lore: 'Auman menggelegar yang meremukkan moral dan kewaspadaan seluruh lawan.',
    artIcon: '📢🌋',
    artTheme: 'tremor-roar',
    execute(combat) {
      const w = this.isUpgraded ? this.upgradedWeak : this.weak;
      const v = this.isUpgraded ? this.upgradedVulnerable : this.vulnerable;
      combat.enemies.forEach(e => {
        if (!e.isDead && !e.hasEscaped) {
          combat.applyEnemyStatus(e, 'weak', w);
          combat.applyEnemyStatus(e, 'vulnerable', v);
        }
      });
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('shockwave_ring', 'all');
    }
  },

  battle_trance: {
    id: 'battle_trance',
    name: 'Berserk Trance',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    drawCards: 3,
    upgradedDraw: 4,
    description: 'Draw 3 cards. You cannot draw additional cards this turn.',
    upgradedDesc: 'Draw 4 cards. You cannot draw additional cards this turn.',
    lore: 'Fokus instan yang menyempitkan pandangan demi melihat peluang terbaik.',
    artIcon: '🧘‍♂️✨',
    artTheme: 'berserk-trance',
    execute(combat) {
      combat.drawCards(this.isUpgraded ? 4 : 3);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  disarm: {
    id: 'disarm',
    name: 'Tendon Slice',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    strReduction: 2,
    upgradedStrReduction: 3,
    exhaust: true,
    description: 'Enemy loses 2 Strength permanently. Exhaust.',
    upgradedDesc: 'Enemy loses 3 Strength permanently. Exhaust.',
    lore: 'Memotong tendon pergelangan tangan musuh sehingga senjata mereka terasa berat.',
    artIcon: '✂️🩸',
    artTheme: 'tendon-slice',
    execute(combat, target) {
      const red = this.isUpgraded ? this.upgradedStrReduction : this.strReduction;
      target.status.strength = (target.status.strength || 0) - red;
      combat.showCombatText(`-${red} STR!`, target, '#ff6b6b');
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target);
    }
  },

  entrench: {
    id: 'entrench',
    name: 'Fortress Lockdown',
    cost: 2,
    upgradedCost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    description: 'Double your current Block.',
    upgradedDesc: 'Double your current Block.',
    lore: 'Menancapkan pasak pertahanan ke bumi dan melipatgandakan tameng baja.',
    artIcon: '🏰🔒',
    artTheme: 'fortress-lockdown',
    execute(combat) {
      combat.player.block = combat.player.block * 2;
      combat.showCombatText(`Block Doubled! (${combat.player.block})`, 'player', '#74c0fc');
      if (window.spireAudio) window.spireAudio.playBlock();
      combat.triggerVfx('shield', 'player');
    }
  },

  demon_form: {
    id: 'demon_form',
    name: 'Archdemon Avatar',
    cost: 3,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    strGain: 2,
    upgradedStrGain: 3,
    description: 'At the start of each turn, gain 2 Strength.',
    upgradedDesc: 'At the start of each turn, gain 3 Strength.',
    lore: 'Melepaskan belenggu kemanusiaan dan merangkul wujud iblis penghancur abadi.',
    artIcon: '😈🔥',
    artTheme: 'demon-avatar',
    execute(combat) {
      const gain = this.isUpgraded ? this.upgradedStrGain : this.strGain;
      combat.player.status.demonForm = (combat.player.status.demonForm || 0) + gain;
      combat.showCombatText(`Demon Form (+${gain} STR/Turn)`, 'player', '#ff2a2a');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('fire_burst', 'player');
    }
  },

  barricade: {
    id: 'barricade',
    name: 'Eternal Rampart',
    cost: 3,
    upgradedCost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    description: 'Block is not removed at the start of your turn.',
    upgradedDesc: 'Block is not removed at the start of your turn.',
    lore: 'Mendirikan benteng kokoh yang tak lekang oleh waktu.',
    artIcon: '🏰🛡️',
    artTheme: 'eternal-rampart',
    execute(combat) {
      combat.player.status.barricade = 1;
      combat.showCombatText('Barricade Active!', 'player', '#ced4da');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('shield', 'player');
    }
  },

  bludgeon: {
    id: 'bludgeon',
    name: 'Cataclysm Hammer',
    cost: 3,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 32,
    upgradedDamage: 42,
    description: 'Deal !D! damage.',
    upgradedDesc: 'Deal !D! damage.',
    lore: 'Hantaman godam raksasa dengan momentum kataklismik penghancur bumi.',
    artIcon: '🔨💥',
    artTheme: 'cataclysm-hammer',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('impact', target);
      if (window.spireVfx) window.spireVfx.triggerScreenShake('heavy');
    }
  },

  feed: {
    id: 'feed',
    name: 'Soul Devour',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 10,
    upgradedDamage: 12,
    hpGain: 3,
    upgradedHpGain: 4,
    exhaust: true,
    description: 'Deal !D! damage. If this kills the enemy, permanently gain +3 Max HP. Exhaust.',
    upgradedDesc: 'Deal !D! damage. If this kills the enemy, permanently gain +4 Max HP. Exhaust.',
    lore: 'Memakan esensi vital lawan yang sekarat untuk memperkokoh raga selamanya.',
    artIcon: '🩸🍖',
    artTheme: 'soul-devour',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const wasDead = target.isDead;
      combat.dealDamageToEnemy(target, dmg);
      if (!wasDead && target.isDead) {
        const gain = this.isUpgraded ? this.upgradedHpGain : this.hpGain;
        window.gameState.player.maxHp += gain;
        window.gameState.player.currentHp += gain;
        combat.showCombatText(`+${gain} Max HP Gained!`, 'player', '#51cf66');
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('fire_burst', target);
    }
  },

  // ==========================================================================
  // 2. KARTU SPESIALISASI 10 HERO
  // ==========================================================================

  // The Silent
  neutralize: {
    id: 'neutralize',
    name: 'Venomous Needle',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.ENEMY,
    damage: 3,
    upgradedDamage: 4,
    weak: 1,
    upgradedWeak: 2,
    description: 'Deal !D! damage. Apply !W! Weak.',
    upgradedDesc: 'Deal !D! damage. Apply !W! Weak.',
    lore: 'Jarum beracun yang ditusukkan tepat ke titik simpul urat musuh.',
    artIcon: '🗡️🧪',
    artTheme: 'venomous-needle',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const w = this.isUpgraded ? this.upgradedWeak : this.weak;
      combat.dealDamageToEnemy(target, dmg);
      combat.applyEnemyStatus(target, 'weak', w);
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target);
    }
  },

  survivor: {
    id: 'survivor',
    name: 'Acrobatic Evade',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.SELF,
    block: 8,
    upgradedBlock: 11,
    description: 'Gain !B! Block. Discard 1 card.',
    upgradedDesc: 'Gain !B! Block. Discard 1 card.',
    lore: 'Berguling lincah menghindari sabetan maut sambil membuang beban perlengkapan.',
    artIcon: '🤸‍♀️🛡️',
    artTheme: 'acrobatic-evade',
    execute(combat) {
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.gainPlayerBlock(blk);
      if (combat.hand.length > 0) {
        const discarded = combat.hand.pop();
        combat.discardPile.push(discarded);
      }
      if (window.spireAudio) window.spireAudio.playBlock();
      combat.triggerVfx('shield', 'player');
    }
  },

  poisoned_stab: {
    id: 'poisoned_stab',
    name: 'Viper Blade',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 6,
    upgradedDamage: 8,
    poison: 3,
    upgradedPoison: 4,
    description: 'Deal !D! damage. Apply 3 Poison.',
    upgradedDesc: 'Deal !D! damage. Apply 4 Poison.',
    lore: 'Belati yang direndam dalam bisa ular kobra berkepala dua.',
    artIcon: '🐍🗡️',
    artTheme: 'viper-blade',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const p = this.isUpgraded ? this.upgradedPoison : this.poison;
      combat.dealDamageToEnemy(target, dmg);
      combat.applyEnemyStatus(target, 'poison', p);
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target);
    }
  },

  blade_dance: {
    id: 'blade_dance',
    name: 'Dance of Daggers',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    description: 'Add 3 Shivs (0 Cost: 4 Dmg) into your hand.',
    upgradedDesc: 'Add 4 Shivs (0 Cost: 4 Dmg) into your hand.',
    lore: 'Menarik serangkaian belati lempar tersembunyi dari balik lipatan jubah rawa.',
    artIcon: '🗡️✨',
    artTheme: 'dance-of-daggers',
    execute(combat) {
      const count = this.isUpgraded ? 4 : 3;
      for (let i = 0; i < count; i++) {
        combat.hand.push(new window.Card(window.CARD_DATABASE.shiv));
      }
      combat.showCombatText(`+${count} Shivs in Hand!`, 'player', '#51cf66');
      if (window.spireAudio) window.spireAudio.playCardDraw();
    }
  },

  shiv: {
    id: 'shiv',
    name: 'Throwing Shiv',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.SPECIAL,
    target: TARGET_TYPES.ENEMY,
    damage: 4,
    upgradedDamage: 6,
    exhaust: true,
    description: 'Deal !D! damage. Exhaust.',
    upgradedDesc: 'Deal !D! damage. Exhaust.',
    lore: 'Belati lempar ringan siap saji.',
    artIcon: '🗡️',
    artTheme: 'shiv',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target);
    }
  },

  // The Defect
  zap: {
    id: 'zap',
    name: 'Plasma Bolt',
    cost: 1,
    upgradedCost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.SELF,
    description: 'Channel 1 Lightning Orb.',
    upgradedDesc: 'Channel 1 Lightning Orb.',
    lore: 'Mengeluarkan kilatan plasma atmosferik yang berputar di sekitar chasis.',
    artIcon: '⚡🌐',
    artTheme: 'plasma-bolt',
    execute(combat) {
      combat.player.status.lightningOrbs = (combat.player.status.lightningOrbs || 0) + 1;
      combat.showCombatText('+1 Lightning Orb (Plasma)', 'player', '#ffd43b');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('shockwave_ring', 'player');
    }
  },

  dualcast: {
    id: 'dualcast',
    name: 'Overcharge Pulse',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 8,
    upgradedDamage: 12,
    description: 'Trigger all Lightning Orbs twice. Deal !D! damage.',
    upgradedDesc: 'Trigger all Lightning Orbs twice. Deal !D! damage.',
    lore: 'Mendorong kapasitor melampaui batas untuk melepaskan gelombang petir ganda.',
    artIcon: '⚡⚡',
    artTheme: 'overcharge-pulse',
    execute(combat) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToAllEnemies(dmg);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('cleave_sweep', 'all');
    }
  },

  ball_lightning: {
    id: 'ball_lightning',
    name: 'Volt Sphere',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 10,
    description: 'Deal !D! damage. Channel 1 Lightning Orb.',
    upgradedDesc: 'Deal !D! damage. Channel 1 Lightning Orb.',
    lore: 'Melepaskan bola petir bertekanan tinggi yang menyengat musuh lalu mengorbit di sisimu.',
    artIcon: '⚡🔮',
    artTheme: 'volt-sphere',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      combat.player.status.lightningOrbs = (combat.player.status.lightningOrbs || 0) + 1;
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('impact', target);
    }
  },

  // The Watcher
  miracle: {
    id: 'miracle',
    name: 'Miracle of Light',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.SPECIAL,
    target: TARGET_TYPES.SELF,
    energyGain: 1,
    upgradedEnergyGain: 2,
    exhaust: true,
    description: 'Retain. Gain 1 Energy. Exhaust.',
    upgradedDesc: 'Retain. Gain 2 Energy. Exhaust.',
    lore: 'Setetes embun spiritual yang mengalirkan energi murni ke seluruh cakra.',
    artIcon: '💧✨',
    artTheme: 'miracle-light',
    execute(combat) {
      combat.energy += this.isUpgraded ? this.upgradedEnergyGain : this.energyGain;
      combat.showCombatText(`+${this.isUpgraded ? 2 : 1} Energy!`, 'player', '#74c0fc');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  eruption: {
    id: 'eruption',
    name: 'Infernal Surge',
    cost: 2,
    upgradedCost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.ENEMY,
    damage: 9,
    upgradedDamage: 9,
    description: 'Deal !D! damage. Enter Wrath (Attacks deal 2x damage).',
    upgradedDesc: 'Deal !D! damage. Enter Wrath (Attacks deal 2x damage).',
    lore: 'Menyerahkan ketenangan batin kepada kobaran amarah kosmik penghancur.',
    artIcon: '🌋🔥',
    artTheme: 'infernal-surge',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      combat.player.status.wrathStance = 2;
      combat.showCombatText('WRATH STANCE ACTIVE! (2x Dmg)', 'player', '#ff2a2a');
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('fire_burst', 'player');
    }
  },

  vigilance: {
    id: 'vigilance',
    name: 'Serene Ward',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.SELF,
    block: 8,
    upgradedBlock: 12,
    description: 'Gain !B! Block. Enter Calm.',
    upgradedDesc: 'Gain !B! Block. Enter Calm.',
    lore: 'Napas melambat laksana danau tenang di puncak gunung salju.',
    artIcon: '🧘‍♀️🛡️',
    artTheme: 'serene-ward',
    execute(combat) {
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.gainPlayerBlock(blk);
      combat.player.status.calmStance = 1;
      combat.player.status.wrathStance = 0;
      combat.showCombatText('ENTERED CALM STANCE', 'player', '#74c0fc');
      if (window.spireAudio) window.spireAudio.playBlock();
      combat.triggerVfx('shield', 'player');
    }
  },

  // The Necromancer
  soul_strike: {
    id: 'soul_strike',
    name: 'Nether Scythe',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 10,
    description: 'Deal !D! damage. Exhaust a card in your hand to gain 4 Block.',
    upgradedDesc: 'Deal !D! damage. Exhaust a card in your hand to gain 6 Block.',
    lore: 'Tebasan sabit maut yang mengorbankan artefak di tangan demi perisai arwah.',
    artIcon: '👻🗡️',
    artTheme: 'nether-scythe',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (combat.hand.length > 0) {
        const exh = combat.hand.pop();
        combat.exhaustPile.push(exh);
        combat.gainPlayerBlock(this.isUpgraded ? 6 : 4);
        combat.showCombatText(`Exhausted ${exh.name} for Block`, 'player', '#22b8cf');
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('impact', target);
    }
  },

  // The Chronomancer
  rewind: {
    id: 'rewind',
    name: 'Chrono Shift',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.SELF,
    block: 6,
    upgradedBlock: 9,
    description: 'Gain !B! Block. Return top card of discard pile to hand.',
    upgradedDesc: 'Gain !B! Block. Return top card of discard pile to hand.',
    lore: 'Memutar kembali jarum jam untuk mengambil kembali taktik yang telah digunakan.',
    artIcon: '⏪⏳',
    artTheme: 'chrono-shift',
    execute(combat) {
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.gainPlayerBlock(blk);
      if (combat.discardPile.length > 0) {
        const card = combat.discardPile.pop();
        combat.hand.push(card);
        combat.showCombatText(`Chrono Rewind: ${card.name}!`, 'player', '#ffd43b');
      }
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  // The Berserker
  bloodlash: {
    id: 'bloodlash',
    name: 'Berserker Flail',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.ENEMY,
    damage: 10,
    upgradedDamage: 14,
    description: 'Lose 1 HP. Deal !D! damage.',
    upgradedDesc: 'Lose 1 HP. Deal !D! damage.',
    lore: 'Cambuk rantai berlumur darah liar yang menghancurkan mangsa dengan mengorbankan setetes luka.',
    artIcon: '🩸🪓',
    artTheme: 'berserker-flail',
    execute(combat, target) {
      window.gameState.takeDamage(1);
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('heavy_slice', target);
    }
  },

  // The Paladin
  holy_strike: {
    id: 'holy_strike',
    name: 'Dawnbreaker',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 10,
    block: 4,
    upgradedBlock: 6,
    description: 'Deal !D! damage. Gain !B! Block.',
    upgradedDesc: 'Deal !D! damage. Gain !B! Block.',
    lore: 'Hantaman palu perang fajar suci yang menyinari sudut tergelap dungeon.',
    artIcon: '🔨✨',
    artTheme: 'dawnbreaker',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.dealDamageToEnemy(target, dmg);
      combat.gainPlayerBlock(blk);
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('impact', target);
      combat.triggerVfx('shield', 'player');
    }
  },

  // The Shadowblade
  backstab: {
    id: 'backstab',
    name: 'Shadow Ambush',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.ENEMY,
    damage: 11,
    upgradedDamage: 15,
    exhaust: true,
    description: 'Innate. Deal !D! damage. Exhaust.',
    upgradedDesc: 'Innate. Deal !D! damage. Exhaust.',
    lore: 'Menikam dari titik buta sebelum musuh sempat menarik senjatanya.',
    artIcon: '🗡️🌑',
    artTheme: 'shadow-ambush',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('heavy_slice', target);
    }
  },

  // The Alchemist
  acid_flask: {
    id: 'acid_flask',
    name: 'Corrosive Vial',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    target: TARGET_TYPES.ENEMY,
    damage: 5,
    upgradedDamage: 8,
    vulnerable: 2,
    weak: 1,
    description: 'Deal !D! damage. Apply 2 Vulnerable and 1 Weak.',
    upgradedDesc: 'Deal !D! damage. Apply 2 Vulnerable and 1 Weak.',
    lore: 'Melempar tabung kaca berisi asam vitriol korosif yang melarutkan zirah musuh.',
    artIcon: '🧪💥',
    artTheme: 'corrosive-vial',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      combat.applyEnemyStatus(target, 'vulnerable', 2);
      combat.applyEnemyStatus(target, 'weak', 1);
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('fire_burst', target);
    }
  },

  // ==========================================================================
  // 3. KARTU COLORLESS, STATUS & CURSES
  // ==========================================================================

  bandage_up: {
    id: 'bandage_up',
    name: 'Herbal Salve',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    healAmount: 4,
    upgradedHeal: 6,
    exhaust: true,
    description: 'Heal 4 HP. Exhaust.',
    upgradedDesc: 'Heal 6 HP. Exhaust.',
    lore: 'Membalut luka tergores dengan salep herbal penyembuh.',
    artIcon: '🩹🌿',
    artTheme: 'herbal-salve',
    execute(combat) {
      const heal = this.isUpgraded ? this.upgradedHeal : this.healAmount;
      combat.healPlayer(heal);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('heal_sparkle', 'player');
    }
  },

  trip: {
    id: 'trip',
    name: 'Leg Sweep Trap',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    upgradedTarget: TARGET_TYPES.ALL_ENEMIES,
    vulnerable: 2,
    description: 'Apply 2 Vulnerable.',
    upgradedDesc: 'Apply 2 Vulnerable to ALL enemies.',
    lore: 'Jebakan kawat berduri yang membuat lawan tersandung jatuh.',
    artIcon: '🕸️⛓️',
    artTheme: 'leg-sweep',
    execute(combat, target) {
      if (this.isUpgraded) {
        combat.enemies.forEach(e => {
          if (!e.isDead && !e.hasEscaped) combat.applyEnemyStatus(e, 'vulnerable', 2);
        });
      } else {
        combat.applyEnemyStatus(target, 'vulnerable', 2);
      }
      if (window.spireAudio) window.spireAudio.playClick();
    }
  },

  swift_strike: {
    id: 'swift_strike',
    name: 'Gale Slash',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 10,
    description: 'Deal !D! damage.',
    upgradedDesc: 'Deal !D! damage.',
    lore: 'Sabetan secepat kilat angin puyuh.',
    artIcon: '⚡🗡️',
    artTheme: 'gale-slash',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target);
    }
  },

  true_grit: {
    id: 'true_grit',
    name: 'Iron Will',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    block: 7,
    upgradedBlock: 9,
    description: 'Gain !B! Block. Exhaust a random card in hand.',
    upgradedDesc: 'Gain !B! Block. Exhaust a card in hand.',
    lore: 'Mengabaikan rasa sakit dan mengorbankan perlengkapan yang tidak esensial.',
    artIcon: '🛡️🔥',
    artTheme: 'iron-will',
    execute(combat) {
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.gainPlayerBlock(blk);
      if (combat.hand.length > 0) {
        const exh = combat.hand.pop();
        combat.exhaustPile.push(exh);
        combat.showCombatText(`Exhausted ${exh.name}`, 'player', '#ced4da');
      }
      if (window.spireAudio) window.spireAudio.playBlock();
      combat.triggerVfx('shield', 'player');
    }
  },

  // Status & Curses
  slimed: {
    id: 'slimed',
    name: 'Slimed',
    cost: 1,
    type: CARD_TYPES.STATUS,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.NONE,
    exhaust: true,
    description: 'Exhaust.',
    upgradedDesc: 'Exhaust.',
    lore: 'Lendir asam lengket yang melapisi zirahmu.',
    artIcon: '🟢',
    artTheme: 'status-slime',
    execute(combat) {
      combat.showCombatText('Wiped Slime Away', 'player', '#51cf66');
      if (window.spireAudio) window.spireAudio.playClick();
    }
  },

  wound: {
    id: 'wound',
    name: 'Grievous Wound',
    cost: -2,
    type: CARD_TYPES.STATUS,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.NONE,
    description: 'Unplayable.',
    upgradedDesc: 'Unplayable.',
    lore: 'Luka robek dalam yang membuat tubuhmu melemah.',
    artIcon: '🩸',
    artTheme: 'status-wound',
    execute() {}
  },

  burn: {
    id: 'burn',
    name: 'Searing Burn',
    cost: -2,
    type: CARD_TYPES.STATUS,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.NONE,
    burnDamage: 2,
    upgradedBurnDamage: 4,
    description: 'Unplayable. At the end of turn, take 2 damage.',
    upgradedDesc: 'Unplayable. At the end of turn, take 4 damage.',
    lore: 'Bara api neraka yang membakar daging.',
    artIcon: '🔥',
    artTheme: 'status-burn',
    onTurnEndInHand(combat) {
      const dmg = this.isUpgraded ? this.upgradedBurnDamage : this.burnDamage;
      combat.dealDamageToPlayer(dmg, null);
      combat.showCombatText(`${dmg} Burn Damage!`, 'player', '#ff4d4d');
    },
    execute() {}
  },

  // --------------------------------------------------------------------------
  // THE NECROMANCER EXPANSION
  // --------------------------------------------------------------------------
  bone_spear: {
    id: 'bone_spear',
    name: 'Ossified Spear',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 8,
    upgradedDamage: 11,
    description: 'Deal !D! damage. If a card was Exhausted this turn, deal !D! damage again.',
    upgradedDesc: 'Deal !D! damage. If a card was Exhausted this turn, deal !D! damage again.',
    lore: 'Tombak tajam yang diasah dari tulang belulang pahlawan masa lampau.',
    artIcon: '🦴🗡️',
    artTheme: 'bone-spear',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (combat.exhaustPile.length > 0) {
        combat.dealDamageToEnemy(target, dmg);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target);
    }
  },

  corpse_explosion: {
    id: 'corpse_explosion',
    name: 'Corpse Detonation',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    poison: 6,
    upgradedPoison: 9,
    description: 'Apply 6 Poison. When this enemy dies, deal its Max HP to ALL enemies.',
    upgradedDesc: 'Apply 9 Poison. When this enemy dies, deal its Max HP to ALL enemies.',
    lore: 'Membubuhi mayat musuh dengan gas pembusuk yang meledak dahsyat saat terbelah.',
    artIcon: '💀💥',
    artTheme: 'corpse-explosion',
    execute(combat, target) {
      const p = this.isUpgraded ? this.upgradedPoison : this.poison;
      combat.applyEnemyStatus(target, 'poison', p);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('fire_burst', target);
    }
  },

  lich_form: {
    id: 'lich_form',
    name: 'Lich Ascension',
    cost: 3,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    description: 'Whenever you Exhaust a card, gain 3 Block and draw 1 card.',
    upgradedDesc: 'Whenever you Exhaust a card, gain 4 Block and draw 1 card.',
    lore: 'Memasuki wujud mayat hidup abadi yang merayakan kehancuran materi fana.',
    artIcon: '👑💀',
    artTheme: 'lich-form',
    execute(combat) {
      combat.player.status.lichForm = this.isUpgraded ? 4 : 3;
      combat.showCombatText('Lich Ascension Active!', 'player', '#20c997');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  // --------------------------------------------------------------------------
  // THE CHRONOMANCER EXPANSION
  // --------------------------------------------------------------------------
  time_dilation: {
    id: 'time_dilation',
    name: 'Temporal Stasis',
    cost: 2,
    upgradedCost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    weak: 3,
    description: 'Apply 3 Weak. Retain up to 2 cards in hand.',
    upgradedDesc: 'Apply 3 Weak. Retain up to 3 cards in hand.',
    lore: 'Membekukan gelembung waktu di sekitar musuh sehingga gerakannya melambat drastis.',
    artIcon: '⏳❄️',
    artTheme: 'time-dilation',
    execute(combat, target) {
      combat.applyEnemyStatus(target, 'weak', 3);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  paradox_bolt: {
    id: 'paradox_bolt',
    name: 'Paradox Singularity',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 8,
    upgradedDamage: 11,
    description: 'Deal !D! damage. If you played 3 or more cards this turn, gain 1 Energy.',
    upgradedDesc: 'Deal !D! damage. If you played 3 or more cards this turn, gain 1 Energy.',
    lore: 'Tembakan energi paradoks yang menghadiahi kelincahan rangkaian mantra.',
    artIcon: '🌀⚡',
    artTheme: 'paradox-bolt',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (combat.cardsPlayedThisTurn >= 3) {
        combat.energy += 1;
        combat.showCombatText('+1 Energy (Paradox)!', 'player', '#ffd43b');
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target);
    }
  },

  chrono_loop: {
    id: 'chrono_loop',
    name: 'Infinite Eon Loop',
    cost: 3,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    description: 'At the start of your turn, draw 1 extra card and retain 4 Block.',
    upgradedDesc: 'Innate. At the start of your turn, draw 1 extra card and retain 4 Block.',
    lore: 'Melingkarkan garis waktu saat ini dengan masa depan dalam harmoni tak terbatas.',
    artIcon: '♾️⏳',
    artTheme: 'chrono-loop',
    execute(combat) {
      combat.player.status.chronoLoop = 1;
      combat.showCombatText('Infinite Eon Loop Active!', 'player', '#ffd43b');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  // --------------------------------------------------------------------------
  // THE BERSERKER EXPANSION
  // --------------------------------------------------------------------------
  reckless_swing: {
    id: 'reckless_swing',
    name: 'Raging Cleave',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 12,
    upgradedDamage: 16,
    description: 'Take 2 damage. Deal !D! damage.',
    upgradedDesc: 'Take 2 damage. Deal !D! damage.',
    lore: 'Tebasan liar yang tidak mempedulikan luka goresan sendiri demi menghabisi lawan.',
    artIcon: '🪓🩸',
    artTheme: 'raging-cleave',
    execute(combat, target) {
      window.gameState.takeDamage(2);
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, dmg);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('heavy_slice', target);
    }
  },

  undying_wrath: {
    id: 'undying_wrath',
    name: 'Undying Wrath',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    description: 'Whenever you take unblocked damage, gain +2 Strength.',
    upgradedDesc: 'Whenever you take unblocked damage, gain +3 Strength.',
    lore: 'Setiap tetes darah yang tumpah menyulut api amarah primal yang tak terpadamkan.',
    artIcon: '💢🔥',
    artTheme: 'undying-wrath',
    execute(combat) {
      const bonus = this.isUpgraded ? 3 : 2;
      combat.player.status.undyingWrath = (combat.player.status.undyingWrath || 0) + bonus;
      combat.showCombatText('Undying Wrath (+ STR on hit)!', 'player', '#ff0000');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('fire_burst', 'player');
    }
  },

  // --------------------------------------------------------------------------
  // THE PALADIN EXPANSION
  // --------------------------------------------------------------------------
  radiant_smite: {
    id: 'radiant_smite',
    name: 'Solar Smite',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 15,
    upgradedDamage: 20,
    block: 8,
    upgradedBlock: 12,
    description: 'Deal !D! Holy damage. Gain !B! Block. Apply 1 Vulnerable.',
    upgradedDesc: 'Deal !D! Holy damage. Gain !B! Block. Apply 2 Vulnerable.',
    lore: 'Palu fajar yang dihantamkan dengan berkat doa keadilan ordo matahari.',
    artIcon: '🔨☀️',
    artTheme: 'solar-smite',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      const v = this.isUpgraded ? 2 : 1;
      combat.dealDamageToEnemy(target, dmg);
      combat.gainPlayerBlock(blk);
      combat.applyEnemyStatus(target, 'vulnerable', v);
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('impact', target);
      combat.triggerVfx('shield', 'player');
    }
  },

  sun_devotion: {
    id: 'sun_devotion',
    name: 'Sun Dawn Radiance',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    description: 'At the end of your turn, deal 5 Holy damage to ALL enemies and gain 4 Block.',
    upgradedDesc: 'At the end of your turn, deal 7 Holy damage to ALL enemies and gain 6 Block.',
    lore: 'Cahaya fajar menyelimuti tubuh pahlawan, memancarkan gelombang kesucian tiada henti.',
    artIcon: '☀️🛡️',
    artTheme: 'sun-devotion',
    execute(combat) {
      combat.player.status.sunRadiance = this.isUpgraded ? 7 : 5;
      combat.showCombatText('Sun Radiance Active!', 'player', '#ffd43b');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  // --------------------------------------------------------------------------
  // THE SHADOWBLADE EXPANSION
  // --------------------------------------------------------------------------
  assassinate: {
    id: 'assassinate',
    name: 'Death Sentence',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 22,
    upgradedDamage: 30,
    description: 'Deal !D! damage. If the enemy is Vulnerable, refund 2 Energy.',
    upgradedDesc: 'Deal !D! damage. If the enemy is Vulnerable, refund 2 Energy.',
    lore: 'Serangan titik vital yang mengeksekusi musuh yang sedang lengah seketika.',
    artIcon: '🗡️☠️',
    artTheme: 'death-sentence',
    execute(combat, target) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const isVuln = target.status && target.status.vulnerable > 0;
      combat.dealDamageToEnemy(target, dmg);
      if (isVuln) {
        combat.energy += 2;
        combat.showCombatText('Energy Refunded (Assassinate)!', 'player', '#ffd43b');
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('heavy_slice', target);
    }
  },

  smoke_veil: {
    id: 'smoke_veil',
    name: 'Vanish in Shadows',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    block: 10,
    upgradedBlock: 14,
    description: 'Gain !B! Block. Next turn, draw 1 additional card.',
    upgradedDesc: 'Gain !B! Block. Next turn, draw 2 additional cards.',
    lore: 'Melempar bom asap pekat lalu menghilang dalam bayangan pilar.',
    artIcon: '💨🌑',
    artTheme: 'smoke-veil',
    execute(combat) {
      const blk = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.gainPlayerBlock(blk);
      combat.player.status.extraDrawNext = (combat.player.status.extraDrawNext || 0) + (this.isUpgraded ? 2 : 1);
      if (window.spireAudio) window.spireAudio.playBlock();
      combat.triggerVfx('shield', 'player');
    }
  },

  // --------------------------------------------------------------------------
  // THE ALCHEMIST EXPANSION
  // --------------------------------------------------------------------------
  transmute_matter: {
    id: 'transmute_matter',
    name: 'Philosopher Catalyst',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    description: 'Transform a random card in hand into a random Rare card for this combat. Gain 12 Gold.',
    upgradedDesc: 'Transform a random card in hand into an Upgraded Rare card. Gain 18 Gold.',
    lore: 'Mengubah struktur atomik logam biasa menjadi emas dan mantra sihir bermutu tinggi.',
    artIcon: '⚗️🪙',
    artTheme: 'transmute-catalyst',
    execute(combat) {
      window.gameState.addGold(this.isUpgraded ? 18 : 12);
      if (combat.hand.length > 0) {
        const pool = Object.values(CARD_DATABASE).filter(c => c.rarity === CARD_RARITIES.RARE);
        const rand = pool[Math.floor(Math.random() * pool.length)];
        combat.hand[0] = new window.Card(rand, this.isUpgraded);
        combat.showCombatText('Transmuted into !', 'player', '#ffd43b');
      }
      if (window.spireAudio) window.spireAudio.playGold();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  alchemical_fire: {
    id: 'alchemical_fire',
    name: 'Greek Fire Ampoule',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 10,
    upgradedDamage: 14,
    description: 'Deal !D! damage to ALL enemies. Apply 2 Poison and 1 Vulnerable.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Apply 3 Poison and 2 Vulnerable.',
    lore: 'Api kimia cair yang tidak dapat dipadamkan oleh air sekalipun.',
    artIcon: '🧪🔥',
    artTheme: 'greek-fire',
    execute(combat) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToAllEnemies(dmg);
      combat.enemies.forEach(e => {
        if (!e.isDead && !e.hasEscaped) {
          combat.applyEnemyStatus(e, 'poison', this.isUpgraded ? 3 : 2);
          combat.applyEnemyStatus(e, 'vulnerable', this.isUpgraded ? 2 : 1);
        }
      });
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('fire_burst', 'all');
    }
  },


  // --------------------------------------------------------------------------
  // ADDITIONAL ARCHETYPE MASTER CARDS (SILENT & DEFECT)
  // --------------------------------------------------------------------------
  noxious_fumes: {
    id: 'noxious_fumes',
    name: 'Miasma Vapors',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    poisonGain: 2,
    upgradedPoisonGain: 3,
    description: 'At the start of your turn, apply 2 Poison to ALL enemies.',
    upgradedDesc: 'At the start of your turn, apply 3 Poison to ALL enemies.',
    lore: 'Uap kabut beracun yang terus menguar dari jubah rawa, meracuni seisi ruangan pertempuran.',
    artIcon: '💨🧪',
    artTheme: 'miasma-vapors',
    execute(combat) {
      const p = this.isUpgraded ? this.upgradedPoisonGain : this.poisonGain;
      combat.player.status.noxiousFumes = (combat.player.status.noxiousFumes || 0) + p;
      combat.showCombatText(`Miasma Active (+${p} Poison/Turn)`, 'player', '#51cf66');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  footwork: {
    id: 'footwork',
    name: 'Shadow Footwork',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    dexGain: 2,
    upgradedDexGain: 3,
    description: 'Gain 2 Dexterity.',
    upgradedDesc: 'Gain 3 Dexterity.',
    lore: 'Langkah kaki seringan bulu angsa yang meningkatkan efektivitas seluruh kartu pertahanan.',
    artIcon: '🩰✨',
    artTheme: 'shadow-footwork',
    execute(combat) {
      const d = this.isUpgraded ? this.upgradedDexGain : this.dexGain;
      combat.applyPlayerStatus('dexterity', d);
      combat.showCombatText(`+${d} Dexterity!`, 'player', '#51cf66');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  envenom: {
    id: 'envenom',
    name: 'Envenom Blades',
    cost: 2,
    upgradedCost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    description: 'Whenever an Attack deals unblocked damage, apply 1 Poison.',
    upgradedDesc: 'Whenever an Attack deals unblocked damage, apply 1 Poison.',
    lore: 'Melumasi seluruh mata pedang dengan bisa ular viper yang paling pekat.',
    artIcon: '🗡️🐍',
    artTheme: 'envenom-blades',
    execute(combat) {
      combat.player.status.envenom = 1;
      combat.showCombatText('Envenom Active!', 'player', '#51cf66');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  after_image: {
    id: 'after_image',
    name: 'Mirage Afterimage',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    description: 'Whenever you play a card, gain 1 Block.',
    upgradedDesc: 'Innate. Whenever you play a card, gain 1 Block.',
    lore: 'Meninggalkan bayangan semu setiap kali bergerak cepat di medan laga.',
    artIcon: '👤✨',
    artTheme: 'mirage-afterimage',
    execute(combat) {
      combat.player.status.afterImage = (combat.player.status.afterImage || 0) + 1;
      combat.showCombatText('Afterimage Active (+1 Block per card)!', 'player', '#74c0fc');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  defragment: {
    id: 'defragment',
    name: 'Defragment Matrix',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    focusGain: 1,
    upgradedFocusGain: 2,
    description: 'Gain 1 Focus (Increases Orb effectiveness).',
    upgradedDesc: 'Gain 2 Focus (Increases Orb effectiveness).',
    lore: 'Menata ulang sektor memori logika chasis untuk meningkatkan resonansi orb plasma.',
    artIcon: '💾⚡',
    artTheme: 'defragment-matrix',
    execute(combat) {
      const f = this.isUpgraded ? this.upgradedFocusGain : this.focusGain;
      combat.player.status.focus = (combat.player.status.focus || 0) + f;
      combat.showCombatText(`+${f} Focus!`, 'player', '#22b8cf');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  electrodynamics: {
    id: 'electrodynamics',
    name: 'Electrodynamics Grid',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    description: 'Lightning Orbs now hit ALL enemies. Channel 2 Lightning Orbs.',
    upgradedDesc: 'Lightning Orbs now hit ALL enemies. Channel 3 Lightning Orbs.',
    lore: 'Membangun jejaring konduktor elektromagnetik yang menyalurkan sambaran petir ke setiap makhluk hidup.',
    artIcon: '⚡🌐',
    artTheme: 'electrodynamics',
    execute(combat) {
      const orbs = this.isUpgraded ? 3 : 2;
      combat.player.status.electrodynamics = 1;
      combat.player.status.lightningOrbs = (combat.player.status.lightningOrbs || 0) + orbs;
      combat.showCombatText(`Electrodynamics! +${orbs} Lightning Orbs`, 'player', '#ffd43b');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('shockwave_ring', 'player');
    }
  },

  echo_form: {
    id: 'echo_form',
    name: 'Echo Chronoform',
    cost: 3,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    ethereal: true,
    description: 'Ethereal. The first card you play each turn is played twice.',
    upgradedDesc: 'The first card you play each turn is played twice.',
    lore: 'Mendobrak hukum kausalitas untuk menduplikasi tindakan pertama di setiap garis waktu.',
    artIcon: '👥✨',
    artTheme: 'echo-form',
    execute(combat) {
      combat.player.status.echoForm = 1;
      combat.showCombatText('Echo Form Active! (First card 2x)', 'player', '#da77f2');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  hyperbeam: {
    id: 'hyperbeam',
    name: 'Positron Hyperbeam',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 26,
    upgradedDamage: 34,
    focusLoss: 3,
    description: 'Deal !D! damage to ALL enemies. Lose 3 Focus.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Lose 3 Focus.',
    lore: 'Menembakkan meriam laser positron yang meluluhlantakkan arena, namun menguras reaktor.',
    artIcon: '💥⚡',
    artTheme: 'hyperbeam',
    execute(combat) {
      const dmg = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToAllEnemies(dmg);
      combat.player.status.focus = (combat.player.status.focus || 0) - this.focusLoss;
      combat.showCombatText('-3 Focus (Hyperbeam Drain)', 'player', '#ff6b6b');
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('shockwave_ring', 'all');
      if (window.spireVfx) window.spireVfx.triggerScreenShake('heavy');
    }
  },

  // --------------------------------------------------------------------------
  // ADDITIONAL MASTER CARDS (WATCHER & UNIVERSAL COLORLESS)
  // --------------------------------------------------------------------------
  ragnarok: {
    id: 'ragnarok',
    name: 'Ragnarok Starfall',
    cost: 3,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 5,
    upgradedDamage: 6,
    hits: 5,
    upgradedHits: 6,
    description: 'Deal !D! damage to a random enemy 5 times.',
    upgradedDesc: 'Deal !D! damage to a random enemy 6 times.',
    lore: 'Memanggil hujan meteorit kosmik yang membombardir medan pertempuran tanpa ampun.',
    artIcon: '☄️💥',
    artTheme: 'ragnarok-starfall',
    execute(combat) {
      const hits = this.isUpgraded ? this.upgradedHits : this.hits;
      const baseDmg = this.isUpgraded ? this.upgradedDamage : this.damage;
      for (let i = 0; i < hits; i++) {
        const living = combat.enemies.filter(e => !e.isDead && !e.hasEscaped);
        if (living.length === 0) break;
        const target = living[Math.floor(Math.random() * living.length)];
        const dmg = combat.calcDamage(baseDmg);
        combat.dealDamageToEnemy(target, dmg);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('cleave_sweep', 'all');
    }
  },

  scrawl: {
    id: 'scrawl',
    name: 'Omniscient Scrawl',
    cost: 1,
    upgradedCost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    exhaust: true,
    description: 'Draw until your hand is full (10 cards). Exhaust.',
    upgradedDesc: 'Draw until your hand is full (10 cards). Exhaust.',
    lore: 'Menuliskan ribuan aksara takdir dalam sekejap mata untuk memanggil seluruh solusi.',
    artIcon: '📜✨',
    artTheme: 'omniscient-scrawl',
    execute(combat) {
      const needed = 10 - combat.hand.length;
      if (needed > 0) combat.drawCards(needed);
      combat.showCombatText('Hand Filled! (Scrawl)', 'player', '#ffd43b');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('buff_ring', 'player');
    }
  },

  blasphemy: {
    id: 'blasphemy',
    name: 'Sacrilegious Divinity',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    retain: true,
    exhaust: true,
    description: 'Enter Divinity (Gain 3 Energy, Attacks deal 3x damage). DIE NEXT TURN. Exhaust.',
    upgradedDesc: 'Innate. Enter Divinity. DIE NEXT TURN. Exhaust.',
    lore: 'Menyentuh esensi pencipta semesta secara ilegal. Kekuatan mutlak yang dibayar dengan kematian seketika.',
    artIcon: '👁️☠️',
    artTheme: 'sacrilegious-divinity',
    execute(combat) {
      combat.energy += 3;
      combat.player.status.divinityStance = 3;
      combat.player.status.blasphemyDoom = 1;
      combat.showCombatText('DIVINITY ACTIVE! (3x Dmg - WIN THIS TURN!)', 'player', '#ffd43b');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('shockwave_ring', 'player');
      if (window.spireVfx) window.spireVfx.triggerScreenShake('heavy');
    }
  },


  tomb_chill: {
    id: 'tomb_chill',
    name: 'Tomb Frostbite',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Apply 2 Weak. Deal !D! frost damage.',
    upgradedDesc: 'Apply 3 Weak. Deal !D! frost damage.',
    lore: 'Hawa dingin dari liang kubur kuno.',
    artIcon: '❄️💀',
    artTheme: 'tomb_chill',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  death_knell: {
    id: 'death_knell',
    name: 'Death Knell Chime',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 14,
    upgradedDamage: 18,
    block: 18,
    upgradedBlock: 24,
    description: 'Deal !D! damage to ALL enemies. If any die, draw 2 cards.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. If any die, draw 3 cards.',
    lore: 'Dentang lonceng kematian mengiringi kepergian arwah.',
    artIcon: '🔔☠️',
    artTheme: 'death_knell',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  bone_armor_card: {
    id: 'bone_armor_card',
    name: 'Ossified Carapace',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Gain !B! Block. Exhaust 1 card in hand.',
    upgradedDesc: 'Gain !B! Block. Exhaust 1 card in hand.',
    lore: 'Merajut perisai dari serpihan tulang sisa pertempuran.',
    artIcon: '🦴🛡️',
    artTheme: 'bone_armor_card',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  grave_mist: {
    id: 'grave_mist',
    name: 'Grave Mist Veil',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Gain !B! Block. Next turn, gain 1 Energy.',
    upgradedDesc: 'Gain !B! Block. Next turn, gain 2 Energy.',
    lore: 'Kabut pemakaman yang menyamarkan keberadaan pahlawan.',
    artIcon: '🌫️💀',
    artTheme: 'grave_mist',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  soul_siphon: {
    id: 'soul_siphon',
    name: 'Soul Siphon Drain',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 9,
    upgradedDamage: 12,
    block: 13,
    upgradedBlock: 17,
    description: 'Deal !D! damage. Heal 2 HP.',
    upgradedDesc: 'Deal !D! damage. Heal 4 HP.',
    lore: 'Menghisap serpihan jiwa segar untuk menyembuhkan luka.',
    artIcon: '👻🩸',
    artTheme: 'soul_siphon',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  temporal_strike: {
    id: 'temporal_strike',
    name: 'Eon Slash',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Deal !D! damage. Retain this card.',
    upgradedDesc: 'Deal !D! damage. Retain this card.',
    lore: 'Tebasan yang menembus celah dimensi waktu.',
    artIcon: '⏳🗡️',
    artTheme: 'temporal_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  stasis_bubble: {
    id: 'stasis_bubble',
    name: 'Stasis Field',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 12,
    upgradedDamage: 16,
    block: 16,
    upgradedBlock: 21,
    description: 'Gain !B! Block. Retain your hand this turn.',
    upgradedDesc: 'Gain !B! Block. Retain your hand this turn.',
    lore: 'Gelembung waktu yang menahan seluruh kartu agar tidak terbuang.',
    artIcon: '🔮⏳',
    artTheme: 'stasis_bubble',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  accelerate_turn: {
    id: 'accelerate_turn',
    name: 'Chrono Acceleration',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Draw 2 cards. Next turn, draw 1 less card.',
    upgradedDesc: 'Draw 3 cards. Next turn, draw 1 less card.',
    lore: 'Mempercepat laju detak jantung demi tarikan kartu seketika.',
    artIcon: '⏩🃏',
    artTheme: 'accelerate_turn',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  quantum_leap: {
    id: 'quantum_leap',
    name: 'Quantum Warp',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 2 Energy. Exhaust.',
    upgradedDesc: 'Gain 3 Energy. Exhaust.',
    lore: 'Melompat melompati beberapa detik krusial pertempuran.',
    artIcon: '🌌⚡',
    artTheme: 'quantum_leap',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  entropy_burst: {
    id: 'entropy_burst',
    name: 'Entropy Cataclysm',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 16,
    upgradedDamage: 21,
    block: 22,
    upgradedBlock: 29,
    description: 'Deal !D! damage to ALL enemies. Apply 2 Weak.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Apply 3 Weak.',
    lore: 'Ledakan entropi waktu yang merapuhkan materi musuh.',
    artIcon: '💥⌛',
    artTheme: 'entropy_burst',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  blood_frenzy: {
    id: 'blood_frenzy',
    name: 'Blood Frenzy Thrash',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Deal !D! damage twice. Lose 2 HP.',
    upgradedDesc: 'Deal !D! damage twice. Lose 1 HP.',
    lore: 'Amarah membabi buta tanpa menghiraukan luka tubuh.',
    artIcon: '🩸🪓',
    artTheme: 'blood_frenzy',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  pain_absorb: {
    id: 'pain_absorb',
    name: 'Pain Conversion',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 6,
    upgradedDamage: 8,
    block: 9,
    upgradedBlock: 12,
    description: 'Gain !B! Block. If you took damage this turn, gain +2 Strength.',
    upgradedDesc: 'Gain !B! Block. If you took damage this turn, gain +3 Strength.',
    lore: 'Mengubah rasa perih menjadi tenaga pengoyak baja.',
    artIcon: '💢💪',
    artTheme: 'pain_absorb',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  titan_rampage: {
    id: 'titan_rampage',
    name: 'Titan Colossus Smash',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 22,
    upgradedDamage: 29,
    block: 30,
    upgradedBlock: 40,
    description: 'Deal !D! damage. If HP is below 50%, deal 35 damage instead.',
    upgradedDesc: 'Deal !D! damage. If HP is below 50%, deal 45 damage instead.',
    lore: 'Bantingan raksasa saat berada di ambang sakratulmaut.',
    artIcon: '🪓💥',
    artTheme: 'titan_rampage',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  furious_blow: {
    id: 'furious_blow',
    name: 'Furious Cleave',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Deal !D! damage to ALL enemies. Gain 1 Strength this turn.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Gain 2 Strength this turn.',
    lore: 'Ayunan kapak berantai yang memicu gelora kemarahan.',
    artIcon: '🪓🌪️',
    artTheme: 'furious_blow',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  crushing_retaliate: {
    id: 'crushing_retaliate',
    name: 'Spiteful Counter',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 14,
    upgradedDamage: 18,
    block: 18,
    upgradedBlock: 24,
    description: 'Gain 8 Block. Deal !D! damage.',
    upgradedDesc: 'Gain 11 Block. Deal !D! damage.',
    lore: 'Menahan hantaman lalu membalas dengan kepalan besi.',
    artIcon: '🛡️🥊',
    artTheme: 'crushing_retaliate',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  sun_lance: {
    id: 'sun_lance',
    name: 'Solar Javelin',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 9,
    upgradedDamage: 12,
    block: 12,
    upgradedBlock: 16,
    description: 'Deal !D! Holy damage. Apply 1 Vulnerable.',
    upgradedDesc: 'Deal !D! Holy damage. Apply 2 Vulnerable.',
    lore: 'Lembing sinar matahari yang membakar zirah lawan.',
    artIcon: '☀️🗡️',
    artTheme: 'sun_lance',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  solar_shield: {
    id: 'solar_shield',
    name: 'Aegis of the Sun',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Gain !B! Block. Gain 1 Dexterity this turn.',
    upgradedDesc: 'Gain !B! Block. Gain 2 Dexterity this turn.',
    lore: 'Tameng emas berkah fajar yang meningkatkan kelincahan tangkisan.',
    artIcon: '☀️🛡️',
    artTheme: 'solar_shield',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  divine_grace: {
    id: 'divine_grace',
    name: 'Sanctuary Blessing',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 10,
    upgradedDamage: 13,
    block: 14,
    upgradedBlock: 18,
    description: 'Gain !B! Block. Heal 2 HP.',
    upgradedDesc: 'Gain !B! Block. Heal 3 HP.',
    lore: 'Berkat doa kesucian yang menutup luka berdarah.',
    artIcon: '✨💖',
    artTheme: 'divine_grace',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  judgment_hammer: {
    id: 'judgment_hammer',
    name: 'Pillar of Judgment',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 18,
    upgradedDamage: 24,
    block: 24,
    upgradedBlock: 32,
    description: 'Deal !D! damage. If enemy is Vulnerable, deal double damage.',
    upgradedDesc: 'Deal !D! damage. If enemy is Vulnerable, deal double damage.',
    lore: 'Godam cahaya yang menghakimi musuh yang lengah.',
    artIcon: '🔨⚡',
    artTheme: 'judgment_hammer',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  blessing_of_light: {
    id: 'blessing_of_light',
    name: 'Solar Benediction',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever you play an Attack, gain 1 Block.',
    upgradedDesc: 'Whenever you play an Attack, gain 2 Block.',
    lore: 'Setiap sabetan pedang suci disertai perisai fajar otomatis.',
    artIcon: '☀️✨',
    artTheme: 'blessing_of_light',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  shadow_strike: {
    id: 'shadow_strike',
    name: 'Phantom Edge',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Deal !D! damage. If this is your first attack, gain 1 Energy.',
    upgradedDesc: 'Deal !D! damage. If this is your first attack, gain 2 Energy.',
    lore: 'Sabetan belati dari kegelapan yang mengembalikan momentum.',
    artIcon: '🗡️🌑',
    artTheme: 'shadow_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  phantom_step: {
    id: 'phantom_step',
    name: 'Phantom Acrobatics',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Gain !B! Block. Draw 1 card.',
    upgradedDesc: 'Gain !B! Block. Draw 2 cards.',
    lore: 'Menghilang dari pandangan dan muncul di posisi tak terduga.',
    artIcon: '🌑🤸',
    artTheme: 'phantom_step',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  poisoned_darts: {
    id: 'poisoned_darts',
    name: 'Viper Dart Volley',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 4,
    upgradedDamage: 5,
    block: 6,
    upgradedBlock: 8,
    description: 'Deal !D! damage to ALL enemies. Apply 2 Poison.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Apply 3 Poison.',
    lore: 'Hujan jarum beracun yang menyebar ke seluruh barisan lawan.',
    artIcon: '🎯🧪',
    artTheme: 'poisoned_darts',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  death_mark: {
    id: 'death_mark',
    name: 'Mark of the Assassin',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Apply 3 Vulnerable and 2 Weak. Exhaust.',
    upgradedDesc: 'Apply 4 Vulnerable and 3 Weak. Exhaust.',
    lore: 'Menandai titik mematikan pada leher musuh.',
    artIcon: '🎯☠️',
    artTheme: 'death_mark',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  blade_flurry: {
    id: 'blade_flurry',
    name: 'Thousand Shadow Cuts',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 3,
    upgradedDamage: 4,
    block: 4,
    upgradedBlock: 5,
    description: 'Deal !D! damage 6 times.',
    upgradedDesc: 'Deal !D! damage 8 times.',
    lore: 'Rentetan tusukan bayangan yang merobek pertahanan seketika.',
    artIcon: '🗡️⚡',
    artTheme: 'blade_flurry',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  explosive_flask: {
    id: 'explosive_flask',
    name: 'Alchemical Conflagration',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 11,
    upgradedDamage: 14,
    block: 15,
    upgradedBlock: 20,
    description: 'Deal !D! damage to ALL enemies. Apply 2 Vulnerable.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Apply 3 Vulnerable.',
    lore: 'Labu kimia meledak yang menyemburkan api asam ke seluruh arena.',
    artIcon: '🧪💥',
    artTheme: 'explosive_flask',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  mercury_spray: {
    id: 'mercury_spray',
    name: 'Liquid Quicksilver',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Deal !D! damage. Apply 2 Weak.',
    upgradedDesc: 'Deal !D! damage. Apply 3 Weak.',
    lore: 'Semprotan raksa cair yang memperlambat refleks saraf target.',
    artIcon: '🧪🥀',
    artTheme: 'mercury_spray',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  philosophers_brew: {
    id: 'philosophers_brew',
    name: 'Elixir of the Sages',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 2 Strength this combat. Take 3 damage.',
    upgradedDesc: 'Gain 3 Strength this combat. Take 3 damage.',
    lore: 'Meminum ramuan rahasia yang meningkatkan densitas otot seketika.',
    artIcon: '🧪💪',
    artTheme: 'philosophers_brew',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  acid_rain: {
    id: 'acid_rain',
    name: 'Vitriol Downpour',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Apply 5 Poison and 2 Vulnerable to ALL enemies.',
    upgradedDesc: 'Apply 7 Poison and 3 Vulnerable to ALL enemies.',
    lore: 'Hujan asam vitriol pekat yang melelehkan baju zirah musuh.',
    artIcon: '🌧️🧪',
    artTheme: 'acid_rain',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  gold_barrier: {
    id: 'gold_barrier',
    name: 'Transmuted Aurum Plate',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 9,
    upgradedDamage: 12,
    block: 13,
    upgradedBlock: 17,
    description: 'Gain !B! Block. If you have over 100 Gold, gain 4 extra Block.',
    upgradedDesc: 'Gain !B! Block. If you have over 100 Gold, gain 6 extra Block.',
    lore: 'Memanfaatkan resonansi emas di ransel menjadi perisai logam mulia.',
    artIcon: '💰🛡️',
    artTheme: 'gold_barrier',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  infernal_blade: {
    id: 'infernal_blade',
    name: 'Hellfire Claymore',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 9,
    upgradedDamage: 12,
    block: 13,
    upgradedBlock: 17,
    description: 'Deal !D! fire damage.',
    upgradedDesc: 'Deal !D! fire damage.',
    lore: 'Pedang bara neraka yang membakar kulit.',
    artIcon: '🔥🗡️',
    artTheme: 'infernal_blade',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  fiend_fire: {
    id: 'fiend_fire',
    name: 'Fiendfire Torrent',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Exhaust your hand. Deal !D! damage for each card exhausted.',
    upgradedDesc: 'Exhaust your hand. Deal !D! damage for each card exhausted.',
    lore: 'Membakar seluruh kartu di tangan menjadi kobaran api pembasmi.',
    artIcon: '🔥💀',
    artTheme: 'fiend_fire',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  wild_slash: {
    id: 'wild_slash',
    name: 'Feral Frenzy',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 10,
    upgradedDamage: 13,
    block: 14,
    upgradedBlock: 18,
    description: 'Deal !D! damage. Put a Wound in draw pile.',
    upgradedDesc: 'Deal !D! damage. Put a Wound in draw pile.',
    lore: 'Cakaran buas yang meninggalkan luka menganga.',
    artIcon: '🐾🩸',
    artTheme: 'wild_slash',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  reaper_scythe: {
    id: 'reaper_scythe',
    name: 'Death Reaper Scythe',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 4,
    upgradedDamage: 5,
    block: 6,
    upgradedBlock: 8,
    description: 'Deal !D! damage to ALL enemies. Heal HP equal to unblocked damage dealt.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Heal HP equal to unblocked damage dealt.',
    lore: 'Sabit pencabut nyawa yang menyerap sari kehidupan.',
    artIcon: '🌾☠️',
    artTheme: 'reaper_scythe',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  immolate_hell: {
    id: 'immolate_hell',
    name: 'Hellfire Conflagration',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 21,
    upgradedDamage: 28,
    block: 28,
    upgradedBlock: 37,
    description: 'Deal !D! damage to ALL enemies. Add a Burn to discard pile.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Add a Burn to discard pile.',
    lore: 'Ledakan api neraka dahsyat yang menyisakan abu panas.',
    artIcon: '🌋💥',
    artTheme: 'immolate_hell',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  impervious_wall: {
    id: 'impervious_wall',
    name: 'Impervious Bastion',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 30,
    upgradedDamage: 40,
    block: 40,
    upgradedBlock: 54,
    description: 'Gain !B! Block. Exhaust.',
    upgradedDesc: 'Gain !B! Block. Exhaust.',
    lore: 'Tembok baja tak tertembus yang menahan badai serangan terberat.',
    artIcon: '🛡️🏰',
    artTheme: 'impervious_wall',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  limit_break_might: {
    id: 'limit_break_might',
    name: 'Ascendant Limit Break',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Double your Strength. Exhaust.',
    upgradedDesc: 'Double your Strength.',
    lore: 'Melompati batas fisik fana demi kekuatan penghancur dewa.',
    artIcon: '💪⚡',
    artTheme: 'limit_break_might',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  offering_blood: {
    id: 'offering_blood',
    name: 'Sacrificial Blood Rite',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Lose 6 HP. Gain 2 Energy. Draw 3 cards. Exhaust.',
    upgradedDesc: 'Lose 6 HP. Gain 2 Energy. Draw 5 cards. Exhaust.',
    lore: 'Meneteskan darah sendiri ke atas altar demi berkah seketika.',
    artIcon: '🩸✨',
    artTheme: 'offering_blood',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  combust_aura: {
    id: 'combust_aura',
    name: 'Combust Soul',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'At the end of your turn, lose 1 HP and deal 5 damage to ALL enemies.',
    upgradedDesc: 'At the end of your turn, lose 1 HP and deal 7 damage to ALL enemies.',
    lore: 'Jiwa yang terbakar terus memercikkan api ke sekitar.',
    artIcon: '🔥💥',
    artTheme: 'combust_aura',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  dark_embrace_power: {
    id: 'dark_embrace_power',
    name: 'Dark Embrace',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever a card is Exhausted, draw 1 card.',
    upgradedDesc: 'Whenever a card is Exhausted, draw 1 card.',
    lore: 'Rangkulan kegelapan yang menyambut kepunahan kartu dengan ilham baru.',
    artIcon: '🌑📜',
    artTheme: 'dark_embrace_power',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  rupture_spite: {
    id: 'rupture_spite',
    name: 'Vengeful Rupture',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever you lose HP from a card, gain 1 Strength.',
    upgradedDesc: 'Whenever you lose HP from a card, gain 2 Strength.',
    lore: 'Darah yang tertumpah mempercepat detak amarah.',
    artIcon: '🩸💪',
    artTheme: 'rupture_spite',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  brutality_rush: {
    id: 'brutality_rush',
    name: 'Brutality Surge',
    cost: 0,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'At the start of your turn, lose 1 HP and draw 1 extra card.',
    upgradedDesc: 'Innate. At the start of your turn, lose 1 HP and draw 1 extra card.',
    lore: 'Kekejaman batin yang mengorbankan raga demi keunggulan taktik.',
    artIcon: '💢🃏',
    artTheme: 'brutality_rush',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  berserk_energy: {
    id: 'berserk_energy',
    name: 'Primal Berserk',
    cost: 0,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 2 Vulnerable. At the start of your turn, gain 1 Energy.',
    upgradedDesc: 'Gain 1 Vulnerable. At the start of your turn, gain 1 Energy.',
    lore: 'Membuka seluruh celah pertahanan demi ledakan tenaga tak terbatas.',
    artIcon: '⚡🪓',
    artTheme: 'berserk_energy',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  blade_torrent: {
    id: 'blade_torrent',
    name: 'Thousand Daggers Torrent',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Deal !D! damage to ALL enemies.',
    upgradedDesc: 'Deal !D! damage to ALL enemies.',
    lore: 'Banjir belati melayang yang menembus baju besi.',
    artIcon: '🗡️🌧️',
    artTheme: 'blade_torrent',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  choke_wire: {
    id: 'choke_wire',
    name: 'Garrote Wire Choke',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 12,
    upgradedDamage: 16,
    block: 15,
    upgradedBlock: 20,
    description: 'Deal !D! damage. Whenever you play a card this turn, enemy loses 3 HP.',
    upgradedDesc: 'Deal !D! damage. Whenever you play a card this turn, enemy loses 5 HP.',
    lore: 'Jeratan kawat tipis yang mencekik setiap kali pahlawan bergerak.',
    artIcon: '⛓️🩸',
    artTheme: 'choke_wire',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  corrosive_spit: {
    id: 'corrosive_spit',
    name: 'Caustic Bile Spit',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Deal !D! damage. Apply 2 Poison.',
    upgradedDesc: 'Deal !D! damage. Apply 3 Poison.',
    lore: 'Ludahan cairan asam yang melarutkan daging.',
    artIcon: '🧪🟢',
    artTheme: 'corrosive_spit',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  eviscerate_rend: {
    id: 'eviscerate_rend',
    name: 'Eviscerate Rend',
    cost: 3,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 9,
    upgradedBlock: 12,
    description: 'Costs 1 less for each card discarded this turn. Deal !D! damage 3 times.',
    upgradedDesc: 'Costs 1 less for each card discarded this turn. Deal !D! damage 3 times.',
    lore: 'Sobekan ganda mematikan saat tangan bergerak cepat.',
    artIcon: '🗡️⚡',
    artTheme: 'eviscerate_rend',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  finisher_strike: {
    id: 'finisher_strike',
    name: 'Coup de Grace',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 6,
    upgradedDamage: 8,
    block: 8,
    upgradedBlock: 10,
    description: 'Deal !D! damage for each Attack played this turn.',
    upgradedDesc: 'Deal !D! damage for each Attack played this turn.',
    lore: 'Serangan pemungkas penutup kombo beruntun.',
    artIcon: '🗡️💥',
    artTheme: 'finisher_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  skewer_thrust: {
    id: 'skewer_thrust',
    name: 'Skewer Impale',
    cost: -1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Deal !D! damage X times.',
    upgradedDesc: 'Deal !D! damage X+1 times.',
    lore: 'Tusukan tombak beruntun menghabiskan sisa seluruh energi.',
    artIcon: '🍢⚔️',
    artTheme: 'skewer_thrust',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  predator_leap: {
    id: 'predator_leap',
    name: 'Apex Predator Leap',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 15,
    upgradedDamage: 20,
    block: 20,
    upgradedBlock: 27,
    description: 'Deal !D! damage. Next turn, draw 2 additional cards.',
    upgradedDesc: 'Deal !D! damage. Next turn, draw 2 additional cards.',
    lore: 'Terkaman predator puncak yang membuka jalan bagi ronde berikutnya.',
    artIcon: '🐯🩸',
    artTheme: 'predator_leap',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  venom_spray: {
    id: 'venom_spray',
    name: 'Noxious Spray',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 5,
    upgradedDamage: 6,
    block: 0,
    upgradedBlock: 0,
    description: 'Deal !D! damage and apply 2 Poison to ALL enemies.',
    upgradedDesc: 'Deal !D! damage and apply 3 Poison to ALL enemies.',
    lore: 'Semprotan kabut racun ke seluruh penjuru.',
    artIcon: '🧪💨',
    artTheme: 'venom_spray',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  crippling_cloud: {
    id: 'crippling_cloud',
    name: 'Crippling Miasma',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Apply 4 Poison and 2 Weak to ALL enemies. Exhaust.',
    upgradedDesc: 'Apply 7 Poison and 2 Weak to ALL enemies. Exhaust.',
    lore: 'Awan beracun yang melumpuhkan sendi musuh.',
    artIcon: '☁️☠️',
    artTheme: 'crippling_cloud',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  catalyst_surge: {
    id: 'catalyst_surge',
    name: 'Deadly Catalyst',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: "Double an enemy's Poison. Exhaust.",
    upgradedDesc: "Triple an enemy's Poison. Exhaust.",
    lore: 'Zat katalis yang mempercepat reaksi racun secara eksponensial.',
    artIcon: '🧪⚡',
    artTheme: 'catalyst_surge',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  deflect_parry: {
    id: 'deflect_parry',
    name: 'Parrying Buckler',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 4,
    upgradedDamage: 5,
    block: 7,
    upgradedBlock: 9,
    description: 'Gain !B! Block.',
    upgradedDesc: 'Gain !B! Block.',
    lore: 'Tangkisan refleks perisai kecil.',
    artIcon: '🛡️⚡',
    artTheme: 'deflect_parry',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  dodge_and_roll: {
    id: 'dodge_and_roll',
    name: 'Acrobatic Roll',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 4,
    upgradedDamage: 5,
    block: 6,
    upgradedBlock: 8,
    description: 'Gain !B! Block. Next turn, gain !B! Block.',
    upgradedDesc: 'Gain !B! Block. Next turn, gain !B! Block.',
    lore: 'Berguling menghindari hantaman dan bersiap di posisi aman.',
    artIcon: '🤸🛡️',
    artTheme: 'dodge_and_roll',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  blur_mist: {
    id: 'blur_mist',
    name: 'Phantom Blur',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 5,
    upgradedDamage: 6,
    block: 8,
    upgradedBlock: 10,
    description: 'Gain !B! Block. Block is not removed at start of next turn.',
    upgradedDesc: 'Gain !B! Block. Block is not removed at start of next turn.',
    lore: 'Gerakan menyatu dengan kabut sehingga pertahanan tetap utuh.',
    artIcon: '🌫️🛡️',
    artTheme: 'blur_mist',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  calculated_gamble: {
    id: 'calculated_gamble',
    name: 'Tactical Gambit',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Discard your hand, then draw that many cards. Exhaust.',
    upgradedDesc: 'Discard your hand, then draw that many cards.',
    lore: 'Membuang kartu buruk demi menarik strategi baru.',
    artIcon: '🎲🃏',
    artTheme: 'calculated_gamble',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  adrenaline_rush: {
    id: 'adrenaline_rush',
    name: 'Adrenaline Shot',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 1 Energy. Draw 2 cards. Exhaust.',
    upgradedDesc: 'Gain 2 Energy. Draw 2 cards. Exhaust.',
    lore: 'Suntikan pemicu adrenalin yang memacu detak jantung seketika.',
    artIcon: '💉⚡',
    artTheme: 'adrenaline_rush',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  storm_of_steel: {
    id: 'storm_of_steel',
    name: 'Iron Storm',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Discard your hand. Add 1 Shiv to hand for each card discarded.',
    upgradedDesc: 'Discard your hand. Add 1 Upgraded Shiv to hand for each card discarded.',
    lore: 'Mengubah seluruh perbekalan menjadi rentetan belati terbang.',
    artIcon: '🗡️🌪️',
    artTheme: 'storm_of_steel',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  grand_finale: {
    id: 'grand_finale',
    name: 'The Grand Finale',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 50,
    upgradedDamage: 67,
    block: 60,
    upgradedBlock: 81,
    description: 'Can only be played if your draw pile is empty. Deal !D! damage to ALL enemies.',
    upgradedDesc: 'Can only be played if your draw pile is empty. Deal !D! damage to ALL enemies.',
    lore: 'Aksi penutup spektakuler saat seluruh deck habis ditarik.',
    artIcon: '🎭💥',
    artTheme: 'grand_finale',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  glacier_ice: {
    id: 'glacier_ice',
    name: 'Glacier Barrier',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Gain !B! Block. Channel 2 Frost Orbs.',
    upgradedDesc: 'Gain !B! Block. Channel 2 Frost Orbs.',
    lore: 'Gletser es abadi yang memberikan perisai pasif.',
    artIcon: '❄️🏔️',
    artTheme: 'glacier_ice',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  blizzard_storm: {
    id: 'blizzard_storm',
    name: 'Howling Blizzard',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 2,
    upgradedDamage: 2,
    block: 3,
    upgradedBlock: 4,
    description: 'Deal !D! damage to ALL enemies for each Frost channeled this combat.',
    upgradedDesc: 'Deal !D! damage to ALL enemies for each Frost channeled this combat.',
    lore: 'Badai salju yang kian mematikan seiring bertambahnya es.',
    artIcon: '❄️🌪️',
    artTheme: 'blizzard_storm',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  coolheaded_chill: {
    id: 'coolheaded_chill',
    name: 'Cryo Coolheaded',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Channel 1 Frost Orb. Draw 1 card.',
    upgradedDesc: 'Channel 1 Frost Orb. Draw 2 cards.',
    lore: 'Mendinginkan prosesor sembari menarik kartu baru.',
    artIcon: '❄️📜',
    artTheme: 'coolheaded_chill',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  leap_jump: {
    id: 'leap_jump',
    name: 'Thruster Leap',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 9,
    upgradedDamage: 12,
    block: 12,
    upgradedBlock: 16,
    description: 'Gain !B! Block.',
    upgradedDesc: 'Gain !B! Block.',
    lore: 'Melompat tinggi dengan pendorong roket darurat.',
    artIcon: '🚀🛡️',
    artTheme: 'leap_jump',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  turbo_battery: {
    id: 'turbo_battery',
    name: 'Overclock Turbo',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 2 Energy. Add a Void to discard pile.',
    upgradedDesc: 'Gain 3 Energy. Add a Void to discard pile.',
    lore: 'Memaksa suplai daya melampaui kapasitas baterai.',
    artIcon: '⚡🔋',
    artTheme: 'turbo_battery',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  aggregate_cells: {
    id: 'aggregate_cells',
    name: 'Power Grid Aggregate',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 1 Energy for every 4 cards in your draw pile.',
    upgradedDesc: 'Gain 1 Energy for every 3 cards in your draw pile.',
    lore: 'Menghubungkan sel-sel baterai dari seluruh tumpukan kartu.',
    artIcon: '🔋🌐',
    artTheme: 'aggregate_cells',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  rainbow_pulse: {
    id: 'rainbow_pulse',
    name: 'Prismatic Spectrum',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Channel 1 Lightning, 1 Frost, and 1 Dark Orb. Exhaust.',
    upgradedDesc: 'Channel 1 Lightning, 1 Frost, and 1 Dark Orb.',
    lore: 'Menembakkan tiga frekuensi spektrum plasma sekaligus.',
    artIcon: '🌈✨',
    artTheme: 'rainbow_pulse',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  reboot_system: {
    id: 'reboot_system',
    name: 'System Hard Reboot',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Shuffle all cards into draw pile. Draw 4 cards. Exhaust.',
    upgradedDesc: 'Shuffle all cards into draw pile. Draw 6 cards. Exhaust.',
    lore: 'Memulai ulang sistem secara paksa dan mengocok seluruh memori.',
    artIcon: '🔄💻',
    artTheme: 'reboot_system',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  seek_protocol: {
    id: 'seek_protocol',
    name: 'Search Protocol Alpha',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Choose 1 card from draw pile and add to hand. Exhaust.',
    upgradedDesc: 'Choose 2 cards from draw pile and add to hand. Exhaust.',
    lore: 'Memilih algoritma kartu yang paling dibutuhkan secara presisi.',
    artIcon: '🔍📁',
    artTheme: 'seek_protocol',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  meteor_strike: {
    id: 'meteor_strike',
    name: 'Cosmic Meteor Strike',
    cost: 5,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 24,
    upgradedDamage: 32,
    block: 30,
    upgradedBlock: 40,
    description: 'Deal !D! damage. Channel 3 Plasma Orbs.',
    upgradedDesc: 'Deal !D! damage. Channel 3 Plasma Orbs.',
    lore: 'Hantaman meteor plasma raksasa yang menyisakan generator energi.',
    artIcon: '☄️⚡',
    artTheme: 'meteor_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  crush_joints: {
    id: 'crush_joints',
    name: 'Joint Breaker',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 8,
    upgradedDamage: 10,
    block: 10,
    upgradedBlock: 13,
    description: 'Deal !D! damage. If previous card was a Skill, apply 1 Vulnerable.',
    upgradedDesc: 'Deal !D! damage. If previous card was a Skill, apply 2 Vulnerable.',
    lore: 'Menghantam persendian musuh setelah gerakan bertahan.',
    artIcon: '🥋💥',
    artTheme: 'crush_joints',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  sash_whip: {
    id: 'sash_whip',
    name: 'Silk Sash Whip',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 8,
    upgradedDamage: 10,
    block: 10,
    upgradedBlock: 13,
    description: 'Deal !D! damage. If previous card was an Attack, apply 1 Weak.',
    upgradedDesc: 'Deal !D! damage. If previous card was an Attack, apply 2 Weak.',
    lore: 'Sabetan selempang sutra yang mengaburkan pandangan musuh.',
    artIcon: '🧣✨',
    artTheme: 'sash_whip',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  wheel_kick: {
    id: 'wheel_kick',
    name: 'Crescent Wheel Kick',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 15,
    upgradedDamage: 20,
    block: 20,
    upgradedBlock: 27,
    description: 'Deal !D! damage. Draw 2 cards.',
    upgradedDesc: 'Deal !D! damage. Draw 2 cards.',
    lore: 'Tendangan melingkar bulan sabit yang memulihkan momentum.',
    artIcon: '🌙🥋',
    artTheme: 'wheel_kick',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  spirit_shield: {
    id: 'spirit_shield',
    name: 'Astral Spirit Shield',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 3 Block for each card in hand.',
    upgradedDesc: 'Gain 4 Block for each card in hand.',
    lore: 'Tameng spiritual yang memadat seiring banyaknya konsentrasi pikiran.',
    artIcon: '🧘‍♀️🛡️',
    artTheme: 'spirit_shield',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  deus_ex_machina: {
    id: 'deus_ex_machina',
    name: 'Heavenly Intervention',
    cost: -2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Unplayable. When drawn, add 2 Miracles to hand. Exhaust.',
    upgradedDesc: 'Unplayable. When drawn, add 3 Miracles to hand. Exhaust.',
    lore: 'Intervensi langit saat terdesak.',
    artIcon: '☀️💧',
    artTheme: 'deus_ex_machina',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  apotheosis: {
    id: 'apotheosis',
    name: 'Divine Apotheosis',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Upgrade ALL cards for the rest of combat. Exhaust.',
    upgradedDesc: 'Upgrade ALL cards for the rest of combat. Exhaust.',
    lore: 'Mencapai pencerahan ilahi yang memperkuat seluruh taktik di deck.',
    artIcon: '✨👑',
    artTheme: 'apotheosis',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  master_of_strategy: {
    id: 'master_of_strategy',
    name: 'Grand Tactician',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Draw 3 cards. Exhaust.',
    upgradedDesc: 'Draw 4 cards. Exhaust.',
    lore: 'Membaca medan pertempuran lima langkah lebih maju.',
    artIcon: '♟️📜',
    artTheme: 'master_of_strategy',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  secret_weapon: {
    id: 'secret_weapon',
    name: 'Hidden Sleeve Armament',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Choose an Attack from your draw pile and put it into your hand. Exhaust.',
    upgradedDesc: 'Choose an Attack from your draw pile and put it into your hand.',
    lore: 'Menarik senjata rahasia dari balik lengan jubah.',
    artIcon: '🗡️🔍',
    artTheme: 'secret_weapon',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  secret_technique: {
    id: 'secret_technique',
    name: 'Secret Technique Scroll',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Choose a Skill from your draw pile and put it into your hand. Exhaust.',
    upgradedDesc: 'Choose a Skill from your draw pile and put it into your hand.',
    lore: 'Membuka gulungan teknik rahasia penangkal bahaya.',
    artIcon: '📜🔍',
    artTheme: 'secret_technique',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  dramatic_entrance: {
    id: 'dramatic_entrance',
    name: 'Theatrical Shock Entry',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 8,
    upgradedDamage: 10,
    block: 12,
    upgradedBlock: 16,
    description: 'Innate. Deal !D! damage to ALL enemies. Exhaust.',
    upgradedDesc: 'Innate. Deal !D! damage to ALL enemies. Exhaust.',
    lore: 'Mendobrak pintu medan perang dengan ledakan dramatis.',
    artIcon: '🎭💥',
    artTheme: 'dramatic_entrance',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  soul_shield_nec: {
    id: 'soul_shield_nec',
    name: 'Sepulcher Bulwark',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Gain !B! Block. If you have any Exhausted cards, gain 3 extra Block.',
    upgradedDesc: 'Gain !B! Block. If you have any Exhausted cards, gain 5 extra Block.',
    lore: 'Perisai makam batu yang menyerap serpihan arwah.',
    artIcon: '⚰️🛡️',
    artTheme: 'soul_shield_nec',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  plague_strike: {
    id: 'plague_strike',
    name: 'Pestilence Cleave',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Deal !D! damage. Apply 2 Poison.',
    upgradedDesc: 'Deal !D! damage. Apply 3 Poison.',
    lore: 'Tebasan pedang berkarat yang menyebarkan wabah penyakit.',
    artIcon: '🗡️☣️',
    artTheme: 'plague_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  grave_call: {
    id: 'grave_call',
    name: 'Call of the Crypt',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Choose an Exhausted card and return it to your hand. Exhaust.',
    upgradedDesc: 'Choose an Exhausted card and return it to your hand.',
    lore: 'Membangkitkan kembali kartu yang telah dikorbankan.',
    artIcon: '💀📜',
    artTheme: 'grave_call',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  death_cloud: {
    id: 'death_cloud',
    name: 'Funerary Shroud',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'At the end of your turn, deal damage to ALL enemies equal to exhausted cards.',
    upgradedDesc: 'At the end of your turn, deal damage to ALL enemies equal to exhausted cards x 2.',
    lore: 'Kain kafan kematian yang membalaskan dendam arwah.',
    artIcon: '👻🌫️',
    artTheme: 'death_cloud',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  vampiric_bite: {
    id: 'vampiric_bite',
    name: 'Grave Vampire Bite',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.SPECIAL,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 9,
    upgradedBlock: 12,
    description: 'Deal !D! damage. Heal 2 HP. Exhaust.',
    upgradedDesc: 'Deal !D! damage. Heal 3 HP. Exhaust.',
    lore: 'Gigitan predator malam pengisap darah segar.',
    artIcon: '🧛🩸',
    artTheme: 'vampiric_bite',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  time_anchor: {
    id: 'time_anchor',
    name: 'Chrono Anchor',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Gain !B! Block. Next turn, gain 1 Energy.',
    upgradedDesc: 'Gain !B! Block. Next turn, gain 2 Energy.',
    lore: 'Menancapkan jangkar waktu untuk memanen energi esok hari.',
    artIcon: '⚓⏳',
    artTheme: 'time_anchor',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  temporal_flurry: {
    id: 'temporal_flurry',
    name: 'Eon Flurry',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 3,
    upgradedDamage: 4,
    block: 4,
    upgradedBlock: 5,
    description: 'Deal !D! damage 3 times.',
    upgradedDesc: 'Deal !D! damage 4 times.',
    lore: 'Rentetan tebasan kilat yang melintasi dimensi temporal.',
    artIcon: '⏳⚔️',
    artTheme: 'temporal_flurry',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  rewind_turn: {
    id: 'rewind_turn',
    name: 'Epoch Rewind',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 10 Block. Draw 2 cards. Exhaust.',
    upgradedDesc: 'Gain 15 Block. Draw 3 cards. Exhaust.',
    lore: 'Memundurkan alur pertempuran ke kondisi optimal.',
    artIcon: '⏪🔮',
    artTheme: 'rewind_turn',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  chrono_blast: {
    id: 'chrono_blast',
    name: 'Chrono Supernova',
    cost: 3,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 24,
    upgradedDamage: 32,
    block: 32,
    upgradedBlock: 43,
    description: 'Deal !D! damage to ALL enemies. Retain this card.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Retain this card.',
    lore: 'Ledakan supernova waktu yang menghancurkan seisi arena.',
    artIcon: '💥🌌',
    artTheme: 'chrono_blast',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  dilation_ward: {
    id: 'dilation_ward',
    name: 'Dilation Aegis',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 9,
    upgradedDamage: 12,
    block: 13,
    upgradedBlock: 17,
    description: 'Gain !B! Block. If you played an Attack this turn, gain 1 Energy.',
    upgradedDesc: 'Gain !B! Block. If you played an Attack this turn, gain 1 Energy.',
    lore: 'Tameng dilatasi yang menyelaraskan ritme gerak pahlawan.',
    artIcon: '🛡️⌛',
    artTheme: 'dilation_ward',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  blood_sacrifice: {
    id: 'blood_sacrifice',
    name: 'Crimson Offering',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Lose 3 HP. Gain 2 Strength for this combat.',
    upgradedDesc: 'Lose 3 HP. Gain 3 Strength for this combat.',
    lore: 'Pengorbanan darah liar yang memperkuat kepalan tinju.',
    artIcon: '🩸💪',
    artTheme: 'blood_sacrifice',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  fury_swipes: {
    id: 'fury_swipes',
    name: 'Berserker Claws',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 4,
    upgradedDamage: 5,
    block: 6,
    upgradedBlock: 8,
    description: 'Deal !D! damage 3 times. Lose 1 HP.',
    upgradedDesc: 'Deal !D! damage 3 times. Lose 1 HP.',
    lore: 'Cakaran amarah tanpa belas kasihan.',
    artIcon: '🐾🩸',
    artTheme: 'fury_swipes',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  death_defiance: {
    id: 'death_defiance',
    name: 'Undying Defiance',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'When your HP drops below 30%, gain 15 Block and 2 Strength.',
    upgradedDesc: 'When your HP drops below 40%, gain 20 Block and 3 Strength.',
    lore: 'Naluri bertahan hidup liar yang meledak di ambang maut.',
    artIcon: '🪓🛡️',
    artTheme: 'death_defiance',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  blood_surge: {
    id: 'blood_surge',
    name: 'Hemorrhage Strike',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 11,
    upgradedDamage: 14,
    block: 15,
    upgradedBlock: 20,
    description: 'Lose 2 HP. Deal !D! damage. Apply 2 Vulnerable.',
    upgradedDesc: 'Lose 2 HP. Deal !D! damage. Apply 3 Vulnerable.',
    lore: 'Serangan tusuk yang memancarkan darah ke mata musuh.',
    artIcon: '🗡️🩸',
    artTheme: 'blood_surge',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  rampage_rage: {
    id: 'rampage_rage',
    name: 'Rancor Crescendo',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 8,
    upgradedDamage: 10,
    block: 8,
    upgradedBlock: 10,
    description: 'Deal !D! damage. Every time this card is played, increase its damage by 5.',
    upgradedDesc: 'Deal !D! damage. Every time this card is played, increase its damage by 8.',
    lore: 'Amarah dendam yang kian berlipat setiap kali dilepaskan.',
    artIcon: '📈🪓',
    artTheme: 'rampage_rage',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  dawn_lance: {
    id: 'dawn_lance',
    name: 'Spear of the Dawn',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 9,
    upgradedDamage: 12,
    block: 12,
    upgradedBlock: 16,
    description: 'Deal !D! Holy damage. Gain 3 Block.',
    upgradedDesc: 'Deal !D! Holy damage. Gain 5 Block.',
    lore: 'Tombak cahaya fajar pembersih kejahatan.',
    artIcon: '☀️🗡️',
    artTheme: 'dawn_lance',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  sacred_aegis: {
    id: 'sacred_aegis',
    name: 'Sacred Bastion',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 15,
    upgradedDamage: 20,
    block: 20,
    upgradedBlock: 27,
    description: 'Gain !B! Block. Apply 1 Weak to attacking enemies.',
    upgradedDesc: 'Gain !B! Block. Apply 2 Weak to attacking enemies.',
    lore: 'Benteng suci pelindung penganut ajaran fajar.',
    artIcon: '🛡️⛪',
    artTheme: 'sacred_aegis',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  holy_wrath: {
    id: 'holy_wrath',
    name: 'Solar Judgment Strike',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 16,
    upgradedDamage: 21,
    block: 22,
    upgradedBlock: 29,
    description: 'Deal !D! Holy damage to ALL enemies. Heal 3 HP.',
    upgradedDesc: 'Deal !D! Holy damage to ALL enemies. Heal 5 HP.',
    lore: 'Hukuman langit yang memulihkan kesucian pahlawan.',
    artIcon: '☀️💥',
    artTheme: 'holy_wrath',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  lay_on_hands: {
    id: 'lay_on_hands',
    name: 'Hand of Mercy',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Heal 5 HP. Exhaust.',
    upgradedDesc: 'Heal 8 HP. Exhaust.',
    lore: 'Sentuhan telapak tangan yang menyejukkan luka parah.',
    artIcon: '✋💖',
    artTheme: 'lay_on_hands',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  sun_blessing: {
    id: 'sun_blessing',
    name: 'Aura of Sun Dawn',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever you play a Skill, deal 3 damage to ALL enemies.',
    upgradedDesc: 'Whenever you play a Skill, deal 5 damage to ALL enemies.',
    lore: 'Pancaran aura suci yang menyengat musuh saat bertahan.',
    artIcon: '☀️✨',
    artTheme: 'sun_blessing',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  shadow_strike_2: {
    id: 'shadow_strike_2',
    name: 'Midnight Dagger',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 6,
    upgradedDamage: 8,
    block: 9,
    upgradedBlock: 12,
    description: 'Deal !D! damage. Exhaust.',
    upgradedDesc: 'Deal !D! damage. Exhaust.',
    lore: 'Belati bayangan malam siap saji.',
    artIcon: '🗡️🌑',
    artTheme: 'shadow_strike_2',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  phantom_slash: {
    id: 'phantom_slash',
    name: 'Void Severance',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 10,
    upgradedDamage: 13,
    block: 14,
    upgradedBlock: 18,
    description: 'Deal !D! damage. If in shadow, deal double damage.',
    upgradedDesc: 'Deal !D! damage. If in shadow, deal double damage.',
    lore: 'Tebasan hampa yang merobek bayangan musuh.',
    artIcon: '🌑🗡️',
    artTheme: 'phantom_slash',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  smoke_screen_skill: {
    id: 'smoke_screen_skill',
    name: 'Dense Smoke Pellet',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Gain !B! Block. Apply 1 Vulnerable to ALL enemies.',
    upgradedDesc: 'Gain !B! Block. Apply 2 Vulnerable to ALL enemies.',
    lore: 'Butiran bom asap yang membutakan seluruh musuh.',
    artIcon: '💨🌑',
    artTheme: 'smoke_screen_skill',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  assassins_focus: {
    id: 'assassins_focus',
    name: 'Shadow Meditation',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Next turn, your first Attack deals double damage.',
    upgradedDesc: 'Next turn, your first Attack deals triple damage.',
    lore: 'Meditasi dalam kegelapan untuk mencari satu celah mematikan.',
    artIcon: '🧘‍♂️🌑',
    artTheme: 'assassins_focus',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  death_strike: {
    id: 'death_strike',
    name: 'Oblivion Execution',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 25,
    upgradedDamage: 33,
    block: 35,
    upgradedBlock: 47,
    description: 'Deal !D! damage. Exhaust.',
    upgradedDesc: 'Deal !D! damage. Exhaust.',
    lore: 'Eksekusi pamungkas tanpa ampun.',
    artIcon: '☠️🗡️',
    artTheme: 'death_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  volatile_concoction: {
    id: 'volatile_concoction',
    name: 'Volatile Salve',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Gain !B! Block. Deal 4 damage to a random enemy.',
    upgradedDesc: 'Gain !B! Block. Deal 6 damage to a random enemy.',
    lore: 'Campuran bahan kimia yang meletup saat digosokkan ke perisai.',
    artIcon: '🧪💥',
    artTheme: 'volatile_concoction',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  gold_transmute: {
    id: 'gold_transmute',
    name: 'Lead to Gold',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 15 Gold. Exhaust.',
    upgradedDesc: 'Gain 25 Gold. Exhaust.',
    lore: 'Mengubah serpihan timbal menjadi kepingan emas murni.',
    artIcon: '🪙⚗️',
    artTheme: 'gold_transmute',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  toxic_bomb: {
    id: 'toxic_bomb',
    name: 'Sulfuric Vials',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 6,
    upgradedDamage: 8,
    block: 9,
    upgradedBlock: 12,
    description: 'Deal !D! damage and apply 2 Poison to ALL enemies.',
    upgradedDesc: 'Deal !D! damage and apply 3 Poison to ALL enemies.',
    lore: 'Botol belerang beracun yang pecah di tengah musuh.',
    artIcon: '🧪💣',
    artTheme: 'toxic_bomb',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  panacea_draught: {
    id: 'panacea_draught',
    name: 'Universal Panacea',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 1 Artifact (negates next debuff). Exhaust.',
    upgradedDesc: 'Gain 2 Artifact. Exhaust.',
    lore: 'Ramuan penyembuh segala racun dan kutukan.',
    artIcon: '🧪🛡️',
    artTheme: 'panacea_draught',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  chrysalis_flask: {
    id: 'chrysalis_flask',
    name: 'Alchemical Evolution',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'At the start of your turn, add a random 0-cost card to your hand.',
    upgradedDesc: 'Innate. At the start of your turn, add a random 0-cost card to hand.',
    lore: 'Reaktor mikro yang terus memproduksi formula baru.',
    artIcon: '⚗️✨',
    artTheme: 'chrysalis_flask',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  sneaky_strike: {
    id: 'sneaky_strike',
    name: 'Sneaky Ambush',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 12,
    upgradedDamage: 16,
    block: 16,
    upgradedBlock: 21,
    description: 'Deal !D! damage. If you have discarded a card this turn, refund 2 Energy.',
    upgradedDesc: 'Deal !D! damage. If you have discarded a card this turn, refund 2 Energy.',
    lore: 'Serangan mendadak yang memanfaatkan kelengahan lawan.',
    artIcon: '🗡️💨',
    artTheme: 'sneaky_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  dagger_spray: {
    id: 'dagger_spray',
    name: 'Dagger Fan Volley',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 4,
    upgradedDamage: 5,
    block: 6,
    upgradedBlock: 8,
    description: 'Deal !D! damage to ALL enemies twice.',
    upgradedDesc: 'Deal !D! damage to ALL enemies twice.',
    lore: 'Hembusan kipas belati tajam yang menyambar ke seluruh ruangan.',
    artIcon: '🗡️🌀',
    artTheme: 'dagger_spray',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  masterful_stab: {
    id: 'masterful_stab',
    name: 'Masterpiece Thrust',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 12,
    upgradedDamage: 16,
    block: 16,
    upgradedBlock: 21,
    description: 'Costs 1 more each time you lose HP. Deal !D! damage.',
    upgradedDesc: 'Costs 1 more each time you lose HP. Deal !D! damage.',
    lore: 'Tusukan sempurna yang menuntut kesucian raga tanpa luka.',
    artIcon: '🗡️✨',
    artTheme: 'masterful_stab',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  choke_hold: {
    id: 'choke_hold',
    name: 'Suffocating Grip',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 12,
    upgradedDamage: 16,
    block: 16,
    upgradedBlock: 21,
    description: 'Deal !D! damage. Whenever you play a card, deal 3 damage.',
    upgradedDesc: 'Deal !D! damage. Whenever you play a card, deal 5 damage.',
    lore: 'Cengkeraman leher yang kian mencekik saat bergerak.',
    artIcon: '✊🩸',
    artTheme: 'choke_hold',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  riddle_with_holes: {
    id: 'riddle_with_holes',
    name: 'Thousand Needle Flurry',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 3,
    upgradedDamage: 4,
    block: 4,
    upgradedBlock: 5,
    description: 'Deal !D! damage 5 times.',
    upgradedDesc: 'Deal !D! damage 5 times.',
    lore: 'Menghujani tubuh musuh dengan lubang tusukan jarum.',
    artIcon: '🗡️🎯',
    artTheme: 'riddle_with_holes',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  streamline_laser: {
    id: 'streamline_laser',
    name: 'Streamlined Laser',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 15,
    upgradedDamage: 20,
    block: 20,
    upgradedBlock: 27,
    description: 'Deal !D! damage. Reduces in cost by 1 each time played.',
    upgradedDesc: 'Deal !D! damage. Reduces in cost by 1 each time played.',
    lore: 'Algoritma penembakan yang kian efisien seiring pemakaian.',
    artIcon: '⚡🔫',
    artTheme: 'streamline_laser',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  sunder_beam: {
    id: 'sunder_beam',
    name: 'Sunder Core Blast',
    cost: 3,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 24,
    upgradedDamage: 32,
    block: 32,
    upgradedBlock: 43,
    description: 'Deal !D! damage. If this kills the enemy, gain 3 Energy.',
    upgradedDesc: 'Deal !D! damage. If this kills the enemy, gain 3 Energy.',
    lore: 'Tembakan pemusnah yang menyerap kembali energi inti musuh.',
    artIcon: '💥⚡',
    artTheme: 'sunder_beam',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  rip_and_tear: {
    id: 'rip_and_tear',
    name: 'Rip and Tear Claws',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 9,
    upgradedBlock: 12,
    description: 'Deal !D! damage to a random enemy twice.',
    upgradedDesc: 'Deal !D! damage to a random enemy twice.',
    lore: 'Cakaran mekanik berputar berkecepatan tinggi.',
    artIcon: '⚙️🐾',
    artTheme: 'rip_and_tear',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  thunder_strike: {
    id: 'thunder_strike',
    name: 'Thunder Tempest',
    cost: 3,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 9,
    upgradedBlock: 12,
    description: 'Deal !D! damage to a random enemy for each Lightning channeled.',
    upgradedDesc: 'Deal !D! damage to a random enemy for each Lightning channeled.',
    lore: 'Puncak badai petir yang menumpahkan seluruh muatan plasma.',
    artIcon: '⚡⛈️',
    artTheme: 'thunder_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  melter_beam: {
    id: 'melter_beam',
    name: 'Melter Arc',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 10,
    upgradedDamage: 13,
    block: 14,
    upgradedBlock: 18,
    description: 'Remove all Block from an enemy. Deal !D! damage.',
    upgradedDesc: 'Remove all Block from an enemy. Deal !D! damage.',
    lore: 'Sinar panas ekstrem yang mencairkan seluruh tameng musuh.',
    artIcon: '🔥⚡',
    artTheme: 'melter_beam',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  flying_sleeves: {
    id: 'flying_sleeves',
    name: 'Dancing Silk Sleeves',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 4,
    upgradedDamage: 5,
    block: 6,
    upgradedBlock: 8,
    description: 'Retain. Deal !D! damage twice.',
    upgradedDesc: 'Retain. Deal !D! damage twice.',
    lore: 'Lengan baju sutra yang menari dan memukul bertubi-tubi.',
    artIcon: '🥋✨',
    artTheme: 'flying_sleeves',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  sands_of_time: {
    id: 'sands_of_time',
    name: 'Sands of Eternity',
    cost: 4,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 20,
    upgradedDamage: 27,
    block: 26,
    upgradedBlock: 35,
    description: 'Retain. Costs 1 less for each turn retained. Deal !D! damage.',
    upgradedDesc: 'Retain. Costs 1 less for each turn retained. Deal !D! damage.',
    lore: 'Pasir waktu yang kian mematikan seiring berlalunya ronde.',
    artIcon: '⏳🏖️',
    artTheme: 'sands_of_time',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  carve_reality: {
    id: 'carve_reality',
    name: 'Reality Rend',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 6,
    upgradedDamage: 8,
    block: 8,
    upgradedBlock: 10,
    description: 'Deal !D! damage. Add a Smite (1 Cost: 12 Dmg) to hand.',
    upgradedDesc: 'Deal !D! damage. Add an Upgraded Smite to hand.',
    lore: 'Menyobek kain realitas dan memanggil senjata dimensi lain.',
    artIcon: '🗡️🌌',
    artTheme: 'carve_reality',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  reach_heaven: {
    id: 'reach_heaven',
    name: 'Stairway to Heaven',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 10,
    upgradedDamage: 13,
    block: 15,
    upgradedBlock: 20,
    description: 'Deal !D! damage. Shuffle Through Violence into draw pile.',
    upgradedDesc: 'Deal !D! damage. Shuffle Through Violence into draw pile.',
    lore: 'Menapaki tangga langit menuju serangan kekerasan mutlak.',
    artIcon: '☁️🗡️',
    artTheme: 'reach_heaven',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  vault_ascend: {
    id: 'vault_ascend',
    name: 'Temporal Vault',
    cost: 3,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Take an extra turn after this one. End your turn. Exhaust.',
    upgradedDesc: 'Take an extra turn after this one. End your turn. Exhaust.',
    lore: 'Melompati giliran musuh sepenuhnya untuk menyerang kembali.',
    artIcon: '⏳👑',
    artTheme: 'vault_ascend',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  bone_shards_spray: {
    id: 'bone_shards_spray',
    name: 'Bone Shards Volley',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 5,
    upgradedDamage: 6,
    block: 8,
    upgradedBlock: 10,
    description: 'Deal !D! damage to ALL enemies. Exhaust 1 card in hand.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Exhaust 1 card in hand.',
    lore: 'Hamburan serpihan tulang tajam menusuk seluruh lawan.',
    artIcon: '🦴💥',
    artTheme: 'bone_shards_spray',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  death_whisper: {
    id: 'death_whisper',
    name: 'Death Whisper',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Apply 2 Vulnerable and 1 Weak. Exhaust.',
    upgradedDesc: 'Apply 3 Vulnerable and 2 Weak. Exhaust.',
    lore: 'Bisikan maut dari liang kubur yang meruntuhkan tekad.',
    artIcon: '👻💬',
    artTheme: 'death_whisper',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  soul_shield_crypt: {
    id: 'soul_shield_crypt',
    name: 'Crypt Wall',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 9,
    upgradedDamage: 12,
    block: 13,
    upgradedBlock: 17,
    description: 'Gain !B! Block.',
    upgradedDesc: 'Gain !B! Block.',
    lore: 'Tembok batu nisan pelindung raga.',
    artIcon: '🪦🛡️',
    artTheme: 'soul_shield_crypt',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  life_drain: {
    id: 'life_drain',
    name: 'Essence Siphon',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 14,
    upgradedDamage: 18,
    block: 18,
    upgradedBlock: 24,
    description: 'Deal !D! damage. Heal 4 HP. Exhaust.',
    upgradedDesc: 'Deal !D! damage. Heal 6 HP. Exhaust.',
    lore: 'Menyedot saripati kehidupan lawan untuk memulihkan raga.',
    artIcon: '🩸👻',
    artTheme: 'life_drain',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  lich_blast: {
    id: 'lich_blast',
    name: 'Nether Ray',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 18,
    upgradedDamage: 24,
    block: 24,
    upgradedBlock: 32,
    description: 'Deal !D! dark damage to ALL enemies. Exhaust.',
    upgradedDesc: 'Deal !D! dark damage to ALL enemies. Exhaust.',
    lore: 'Pancaran sinar kematian yang menyapu bersih seisi ruangan.',
    artIcon: '💀⚡',
    artTheme: 'lich_blast',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  chrono_slash: {
    id: 'chrono_slash',
    name: 'Chrono Rapier',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Deal !D! damage. Draw 1 card.',
    upgradedDesc: 'Deal !D! damage. Draw 2 cards.',
    lore: 'Tusukan pedang anggar yang memutar mundur waktu.',
    artIcon: '🤺⏳',
    artTheme: 'chrono_slash',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  time_dilation_bubble: {
    id: 'time_dilation_bubble',
    name: 'Temporal Shield',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Gain !B! Block. Retain 1 card in hand.',
    upgradedDesc: 'Gain !B! Block. Retain 1 card in hand.',
    lore: 'Tameng energi waktu pelindung ingatan.',
    artIcon: '🛡️⌛',
    artTheme: 'time_dilation_bubble',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  clockwork_strike: {
    id: 'clockwork_strike',
    name: 'Pendulum Blade',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 9,
    upgradedDamage: 12,
    block: 12,
    upgradedBlock: 16,
    description: 'Deal !D! damage.',
    upgradedDesc: 'Deal !D! damage.',
    lore: 'Ayun tebasan seirama detak pendulum jam gadang.',
    artIcon: '⏱️🗡️',
    artTheme: 'clockwork_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  stasis_cage: {
    id: 'stasis_cage',
    name: 'Stasis Prison',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Apply 3 Weak and 2 Vulnerable. Exhaust.',
    upgradedDesc: 'Apply 4 Weak and 3 Vulnerable. Exhaust.',
    lore: 'Mengurung lawan dalam sangkar waktu yang beku.',
    artIcon: '🔒⏳',
    artTheme: 'stasis_cage',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  singularity_blast: {
    id: 'singularity_blast',
    name: 'Eon Collapse',
    cost: 3,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 28,
    upgradedDamage: 37,
    block: 38,
    upgradedBlock: 51,
    description: 'Deal !D! damage. Gain 1 Energy next turn.',
    upgradedDesc: 'Deal !D! damage. Gain 2 Energy next turn.',
    lore: 'Runtuhnya sebuah eon waktu menjadi satu ledakan.',
    artIcon: '💥⌛',
    artTheme: 'singularity_blast',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  cleave_rage: {
    id: 'cleave_rage',
    name: 'Raging Cleaver',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 6,
    upgradedDamage: 8,
    block: 9,
    upgradedBlock: 12,
    description: 'Deal !D! damage to ALL enemies. Lose 1 HP.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Lose 1 HP.',
    lore: 'Tebasan parang amarah ke seluruh barisan musuh.',
    artIcon: '🪓🌪️',
    artTheme: 'cleave_rage',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  blood_shield: {
    id: 'blood_shield',
    name: 'Blood Clot Armor',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Lose 1 HP. Gain !B! Block.',
    upgradedDesc: 'Lose 1 HP. Gain !B! Block.',
    lore: 'Membekukan darah luka menjadi pelat perisai pelindung.',
    artIcon: '🩸🛡️',
    artTheme: 'blood_shield',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  wild_cleave: {
    id: 'wild_cleave',
    name: 'Savage Hack',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 16,
    upgradedDamage: 21,
    block: 22,
    upgradedBlock: 29,
    description: 'Deal !D! damage. Gain 2 Strength this turn.',
    upgradedDesc: 'Deal !D! damage. Gain 3 Strength this turn.',
    lore: 'Ayunan kapak membabi buta pemantik kekuatan otot.',
    artIcon: '🪓💪',
    artTheme: 'wild_cleave',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  iron_rage: {
    id: 'iron_rage',
    name: 'Boiling Blood',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Take 3 damage. Draw 3 cards.',
    upgradedDesc: 'Take 2 damage. Draw 3 cards.',
    lore: 'Darah yang mendidih memicu reaksi cepat.',
    artIcon: '🩸🃏',
    artTheme: 'iron_rage',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  titan_slam: {
    id: 'titan_slam',
    name: 'Colossal Impact',
    cost: 3,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 30,
    upgradedDamage: 40,
    block: 42,
    upgradedBlock: 56,
    description: 'Deal !D! damage. Apply 2 Vulnerable.',
    upgradedDesc: 'Deal !D! damage. Apply 3 Vulnerable.',
    lore: 'Hantaman raksasa penghancur batuan dungeon.',
    artIcon: '🔨💥',
    artTheme: 'titan_slam',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  radiant_slash: {
    id: 'radiant_slash',
    name: 'Sunblade Slash',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Deal !D! Holy damage.',
    upgradedDesc: 'Deal !D! Holy damage.',
    lore: 'Tebasan pedang fajar berlumur berkah dewa.',
    artIcon: '☀️🗡️',
    artTheme: 'radiant_slash',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  blessed_armor: {
    id: 'blessed_armor',
    name: 'Sanctified Plate',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Gain !B! Block.',
    upgradedDesc: 'Gain !B! Block.',
    lore: 'Baju zirah berlapis berkat fajar suci.',
    artIcon: '🛡️✨',
    artTheme: 'blessed_armor',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  holy_hammer_smash: {
    id: 'holy_hammer_smash',
    name: 'Dawn Judicator',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 16,
    upgradedDamage: 21,
    block: 22,
    upgradedBlock: 29,
    description: 'Deal !D! Holy damage. Gain 6 Block.',
    upgradedDesc: 'Deal !D! Holy damage. Gain 9 Block.',
    lore: 'Palu penghakiman fajar yang memberi perlindungan.',
    artIcon: '🔨☀️',
    artTheme: 'holy_hammer_smash',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  divine_favor: {
    id: 'divine_favor',
    name: 'Grace of Heaven',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Heal 4 HP. Gain 1 Strength this combat. Exhaust.',
    upgradedDesc: 'Heal 6 HP. Gain 2 Strength this combat. Exhaust.',
    lore: 'Tetesan rahmat langit yang memulihkan raga dan tekad.',
    artIcon: '✨💖',
    artTheme: 'divine_favor',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  solar_pillar: {
    id: 'solar_pillar',
    name: 'Pillar of Light',
    cost: 3,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 22,
    upgradedDamage: 29,
    block: 30,
    upgradedBlock: 40,
    description: 'Deal !D! Holy damage to ALL enemies. Gain 8 Block.',
    upgradedDesc: 'Deal !D! Holy damage to ALL enemies. Gain 12 Block.',
    lore: 'Pilar cahaya raksasa yang menyinari seisi menara.',
    artIcon: '☀️🏛️',
    artTheme: 'solar_pillar',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  shadow_jab: {
    id: 'shadow_jab',
    name: 'Stiletto Thrust',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 5,
    upgradedDamage: 6,
    block: 8,
    upgradedBlock: 10,
    description: 'Deal !D! damage.',
    upgradedDesc: 'Deal !D! damage.',
    lore: 'Tusukan belati stiletto ringan.',
    artIcon: '🗡️💨',
    artTheme: 'shadow_jab',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  phantom_cloak: {
    id: 'phantom_cloak',
    name: 'Astral Shroud',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Gain !B! Block.',
    upgradedDesc: 'Gain !B! Block.',
    lore: 'Jubah hampa penangkal serangan lawan.',
    artIcon: '🌑🛡️',
    artTheme: 'phantom_cloak',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  smoke_grenade: {
    id: 'smoke_grenade',
    name: 'Noxious Pellet',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Apply 2 Weak and 1 Vulnerable.',
    upgradedDesc: 'Apply 3 Weak and 2 Vulnerable.',
    lore: 'Butiran asap pengabur pandangan musuh.',
    artIcon: '💨👁️',
    artTheme: 'smoke_grenade',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  assassins_blade: {
    id: 'assassins_blade',
    name: 'Nightfall Edge',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 15,
    upgradedDamage: 20,
    block: 20,
    upgradedBlock: 27,
    description: 'Deal !D! damage. If target has Vulnerable, deal 25 damage instead.',
    upgradedDesc: 'Deal !D! damage. If target has Vulnerable, deal 32 damage instead.',
    lore: 'Pedang algojo malam pemutus urat leher.',
    artIcon: '🗡️🌙',
    artTheme: 'assassins_blade',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  eclipse_strike: {
    id: 'eclipse_strike',
    name: 'Eclipse Oblivion',
    cost: 3,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 28,
    upgradedDamage: 37,
    block: 38,
    upgradedBlock: 51,
    description: 'Deal !D! damage. Gain 2 Energy next turn.',
    upgradedDesc: 'Deal !D! damage. Gain 3 Energy next turn.',
    lore: 'Gerhana hitam yang melenyapkan musuh ke kehampaan.',
    artIcon: '🌑💥',
    artTheme: 'eclipse_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  acid_grenade: {
    id: 'acid_grenade',
    name: 'Vitriol Grenade',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Deal !D! damage. Apply 2 Poison.',
    upgradedDesc: 'Deal !D! damage. Apply 3 Poison.',
    lore: 'Granat kaca berisi asam pembakar zirah.',
    artIcon: '🧪💥',
    artTheme: 'acid_grenade',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  healing_tonic: {
    id: 'healing_tonic',
    name: 'Herbal Draught',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Heal 3 HP. Gain 4 Block. Exhaust.',
    upgradedDesc: 'Heal 5 HP. Gain 6 Block. Exhaust.',
    lore: 'Minuman herbal penutup luka gores.',
    artIcon: '🧪🌿',
    artTheme: 'healing_tonic',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  transmute_potion: {
    id: 'transmute_potion',
    name: 'Distillation Flask',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 1 random combat potion. Exhaust.',
    upgradedDesc: 'Gain 1 random combat potion.',
    lore: 'Menyuling ramuan tempur segar dari uap menara.',
    artIcon: '⚗️🧪',
    artTheme: 'transmute_potion',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  mercury_blade: {
    id: 'mercury_blade',
    name: 'Quicksilver Dagger',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Deal !D! damage. Apply 1 Weak.',
    upgradedDesc: 'Deal !D! damage. Apply 2 Weak.',
    lore: 'Belati berlapis air raksa yang membius lawan.',
    artIcon: '🗡️🧪',
    artTheme: 'mercury_blade',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  philosophers_catalyst: {
    id: 'philosophers_catalyst',
    name: 'Alchemical Pinnacle',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'At the end of your turn, apply 3 Poison to ALL enemies and gain 10 Gold.',
    upgradedDesc: 'At the end of your turn, apply 5 Poison to ALL enemies and gain 15 Gold.',
    lore: 'Puncak ilmu transmutasi abadi.',
    artIcon: '🪙✨',
    artTheme: 'philosophers_catalyst',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  dark_shackles: {
    id: 'dark_shackles',
    name: 'Shackles of the Damned',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.ENEMY,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Enemy loses 9 Strength this turn only. Exhaust.',
    upgradedDesc: 'Enemy loses 15 Strength this turn only. Exhaust.',
    lore: 'Rantai besi gelap yang mengikat tenaga penyerang sesaat.',
    artIcon: '⛓️🌑',
    artTheme: 'dark_shackles',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  blind_strike: {
    id: 'blind_strike',
    name: 'Blinding Smite',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Apply 2 Weak to ALL enemies. Exhaust.',
    upgradedDesc: 'Apply 3 Weak to ALL enemies. Exhaust.',
    lore: 'Kilatan cahaya yang membutakan seisi ruangan.',
    artIcon: '✨👁️',
    artTheme: 'blind_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  trip_wire: {
    id: 'trip_wire',
    name: 'Tripwire Entanglement',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Apply 2 Vulnerable to ALL enemies. Exhaust.',
    upgradedDesc: 'Apply 3 Vulnerable to ALL enemies. Exhaust.',
    lore: 'Jebakan kawat baja yang meruntuhkan kuda-kuda musuh.',
    artIcon: '🕸️⚡',
    artTheme: 'trip_wire',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  good_instincts: {
    id: 'good_instincts',
    name: 'Intuitive Defense',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 6,
    upgradedDamage: 8,
    block: 9,
    upgradedBlock: 12,
    description: 'Gain !B! Block.',
    upgradedDesc: 'Gain !B! Block.',
    lore: 'Naluri bertarung alami tanpa berpikir panjang.',
    artIcon: '🛡️🧠',
    artTheme: 'good_instincts',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  finesse_dodge: {
    id: 'finesse_dodge',
    name: 'Finesse Step',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 4,
    upgradedDamage: 5,
    block: 7,
    upgradedBlock: 9,
    description: 'Gain !B! Block. Draw 1 card.',
    upgradedDesc: 'Gain !B! Block. Draw 1 card.',
    lore: 'Gerakan menghindar anggun yang menyegarkan konsentrasi.',
    artIcon: '🩰🃏',
    artTheme: 'finesse_dodge',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  flash_of_steel: {
    id: 'flash_of_steel',
    name: 'Steel Flash',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.ENEMY,
    damage: 3,
    upgradedDamage: 4,
    block: 6,
    upgradedBlock: 8,
    description: 'Deal !D! damage. Draw 1 card.',
    upgradedDesc: 'Deal !D! damage. Draw 1 card.',
    lore: 'Kilasan pedang secepat kilat.',
    artIcon: '⚡🗡️',
    artTheme: 'flash_of_steel',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  mind_blast: {
    id: 'mind_blast',
    name: 'Mind Blast Wave',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.ENEMY,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Innate. Deal damage equal to the number of cards in your draw pile.',
    upgradedDesc: 'Innate. Costs 1. Deal damage equal to number of cards in draw pile.',
    lore: 'Gelombang psikis yang meledakkan seluruh pengetahuan deck.',
    artIcon: '🧠💥',
    artTheme: 'mind_blast',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  panache_rhythm: {
    id: 'panache_rhythm',
    name: 'Panache Flourish',
    cost: 0,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Every time you play 5 cards in a single turn, deal 10 damage to ALL enemies.',
    upgradedDesc: 'Every time you play 5 cards in a single turn, deal 14 damage to ALL enemies.',
    lore: 'Irama pertarungan cepat yang memicu ledakan aura.',
    artIcon: '💃💥',
    artTheme: 'panache_rhythm',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  sadistic_nature: {
    id: 'sadistic_nature',
    name: 'Sadistic Delight',
    cost: 0,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever you apply a debuff to an enemy, they take 5 damage.',
    upgradedDesc: 'Whenever you apply a debuff to an enemy, they take 7 damage.',
    lore: 'Menikmati penderitaan musuh dengan hantaman luka tambahan.',
    artIcon: '😈🩸',
    artTheme: 'sadistic_nature',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  hand_of_greed: {
    id: 'hand_of_greed',
    name: 'Greed Midas Touch',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.ENEMY,
    damage: 20,
    upgradedDamage: 27,
    block: 25,
    upgradedBlock: 33,
    description: 'Deal !D! damage. If this kills a non-boss enemy, gain 20 Gold.',
    upgradedDesc: 'Deal !D! damage. If this kills a non-boss enemy, gain 25 Gold.',
    lore: 'Sentuhan rakus yang membekukan mayat menjadi patung emas.',
    artIcon: '✋💰',
    artTheme: 'hand_of_greed',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  reckless_charge: {
    id: 'reckless_charge',
    name: 'Reckless Onslaught',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Deal !D! damage. Shuffle a Dazed into your draw pile.',
    upgradedDesc: 'Deal !D! damage. Shuffle a Dazed into your draw pile.',
    lore: 'Serangan seruduk membabi buta.',
    artIcon: '🏃‍♂️💥',
    artTheme: 'reckless_charge',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  havoc_strike: {
    id: 'havoc_strike',
    name: 'Havoc Eruption',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Play the top card of your draw pile and Exhaust it.',
    upgradedDesc: 'Play the top card of your draw pile and Exhaust it. Cost 0.',
    lore: 'Kekacauan yang meledakkan kartu teratas deck.',
    artIcon: '🌪️💥',
    artTheme: 'havoc_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  intimidate_roar: {
    id: 'intimidate_roar',
    name: 'Intimidating Glare',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Apply 1 Weak to ALL enemies. Exhaust.',
    upgradedDesc: 'Apply 2 Weak to ALL enemies. Exhaust.',
    lore: 'Tatapan dingin predator yang menciutkan nyali.',
    artIcon: '👁️🦁',
    artTheme: 'intimidate_roar',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  burning_pact: {
    id: 'burning_pact',
    name: 'Burning Contract',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Exhaust 1 card. Draw 2 cards.',
    upgradedDesc: 'Exhaust 1 card. Draw 3 cards.',
    lore: 'Membakar kartu tak terpakai untuk menarik strategi baru.',
    artIcon: '📜🔥',
    artTheme: 'burning_pact',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  sever_soul: {
    id: 'sever_soul',
    name: 'Soul Severance',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 16,
    upgradedDamage: 21,
    block: 22,
    upgradedBlock: 29,
    description: 'Exhaust all non-Attack cards in your hand. Deal !D! damage.',
    upgradedDesc: 'Exhaust all non-Attack cards in your hand. Deal !D! damage.',
    lore: 'Menghunus pedang dan membakar seluruh pertahanan.',
    artIcon: '🗡️👻',
    artTheme: 'sever_soul',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  finisher_flurry: {
    id: 'finisher_flurry',
    name: 'Coup de Grace Flurry',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 6,
    upgradedDamage: 8,
    block: 8,
    upgradedBlock: 10,
    description: 'Deal !D! damage for each Attack played this turn.',
    upgradedDesc: 'Deal !D! damage for each Attack played this turn.',
    lore: 'Rangkaian tikaman penutup kombo mematikan.',
    artIcon: '🗡️🩸',
    artTheme: 'finisher_flurry',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  distraction_smoke: {
    id: 'distraction_smoke',
    name: 'Distraction Smoke',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Add a random Skill to your hand. It costs 0 this turn. Exhaust.',
    upgradedDesc: 'Add a random Skill to hand. It costs 0. Costs 0.',
    lore: 'Trik pengalih perhatian dari saku rahasia.',
    artIcon: '💨🎭',
    artTheme: 'distraction_smoke',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  expertise_draw: {
    id: 'expertise_draw',
    name: 'Infiltration Expertise',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Draw cards until you have 6 cards in hand.',
    upgradedDesc: 'Draw cards until you have 7 cards in hand.',
    lore: 'Keahlian menyusup yang memulihkan inventaris tangan.',
    artIcon: '🎒📜',
    artTheme: 'expertise_draw',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  piercing_wail_cry: {
    id: 'piercing_wail_cry',
    name: 'Screeching Wail',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'ALL enemies lose 6 Strength this turn. Exhaust.',
    upgradedDesc: 'ALL enemies lose 8 Strength this turn. Exhaust.',
    lore: 'Jeritan melengking yang melemahkan ayunan pedang musuh.',
    artIcon: '📢🦇',
    artTheme: 'piercing_wail_cry',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  corpse_bloom: {
    id: 'corpse_bloom',
    name: 'Rotten Blossom',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Apply 9 Poison. Exhaust.',
    upgradedDesc: 'Apply 12 Poison. Exhaust.',
    lore: 'Bunga bangkai beracun yang ditancapkan ke dada musuh.',
    artIcon: '🌺☠️',
    artTheme: 'corpse_bloom',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  darkness_orb: {
    id: 'darkness_orb',
    name: 'Shadow Singularity',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Channel 1 Dark Orb.',
    upgradedDesc: 'Channel 1 Dark Orb. Trigger Dark Orb.',
    lore: 'Menghisap cahaya di sekitar chasis menjadi bola materi gelap.',
    artIcon: '🌑⚡',
    artTheme: 'darkness_orb',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  fusion_core_cell: {
    id: 'fusion_core_cell',
    name: 'Nuclear Fusion Cell',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Channel 1 Plasma Orb.',
    upgradedDesc: 'Channel 1 Plasma Orb. Costs 1.',
    lore: 'Reaktor fusi mikro yang memproduksi 1 Energy setiap ronde.',
    artIcon: '⚛️⚡',
    artTheme: 'fusion_core_cell',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  chaos_matrix: {
    id: 'chaos_matrix',
    name: 'Chaos Transceiver',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Channel 1 random Orb.',
    upgradedDesc: 'Channel 2 random Orbs.',
    lore: 'Pemancar sinyal acak yang memanggil elemen tak terduga.',
    artIcon: '🎲🌐',
    artTheme: 'chaos_matrix',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  overclock_drive: {
    id: 'overclock_drive',
    name: 'Overclock Overdrive',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Draw 2 cards. Add a Burn into discard pile.',
    upgradedDesc: 'Draw 3 cards. Add a Burn into discard pile.',
    lore: 'Mendorong prosesor ke titik leleh.',
    artIcon: '💻🔥',
    artTheme: 'overclock_drive',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  fission_purge: {
    id: 'fission_purge',
    name: 'Reactor Core Fission',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Remove all Orbs. Gain 1 Energy and draw 1 card for each Orb removed. Exhaust.',
    upgradedDesc: 'Trigger passive of all Orbs, then remove all. Gain 1 Energy & 1 card per orb. Exhaust.',
    lore: 'Meledakkan seluruh orb plasma untuk cadangan daya darurat.',
    artIcon: '☢️💥',
    artTheme: 'fission_purge',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  evaluate_insight: {
    id: 'evaluate_insight',
    name: 'Evaluate Insight',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 6,
    upgradedDamage: 8,
    block: 10,
    upgradedBlock: 13,
    description: 'Gain !B! Block. Shuffle an Insight into draw pile.',
    upgradedDesc: 'Gain !B! Block. Shuffle an Insight into draw pile.',
    lore: 'Menilai kelemahan lawan dan merencanakan wawasan baru.',
    artIcon: '🧘‍♀️📜',
    artTheme: 'evaluate_insight',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  prostrate_mantra: {
    id: 'prostrate_mantra',
    name: 'Prostrate Devotion',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 4,
    upgradedDamage: 5,
    block: 6,
    upgradedBlock: 8,
    description: 'Gain !B! Block. Gain 2 Mantra.',
    upgradedDesc: 'Gain !B! Block. Gain 3 Mantra.',
    lore: 'Bersujud khusyuk mengumpulkan tenaga mantra dewa.',
    artIcon: '🙇‍♂️✨',
    artTheme: 'prostrate_mantra',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  worship_rite: {
    id: 'worship_rite',
    name: 'Devout Worship',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Retain. Gain 5 Mantra.',
    upgradedDesc: 'Retain. Gain 5 Mantra. Costs 1.',
    lore: 'Ibadah sakral yang mendekatkan jiwa ke gerbang Divinity.',
    artIcon: '🙏☀️',
    artTheme: 'worship_rite',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  swivel_turn: {
    id: 'swivel_turn',
    name: 'Swivel Pivot',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 8,
    upgradedDamage: 10,
    block: 11,
    upgradedBlock: 14,
    description: 'Gain !B! Block. Next Attack costs 0.',
    upgradedDesc: 'Gain !B! Block. Next Attack costs 0.',
    lore: 'Berputar lincah membelakangi serangan lalu membalas gratis.',
    artIcon: '🔄🥋',
    artTheme: 'swivel_turn',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  wish_divine: {
    id: 'wish_divine',
    name: 'Divine Wish',
    cost: 3,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Choose one: Gain 6 Plated Armor, 3 Strength, or 25 Gold. Exhaust.',
    upgradedDesc: 'Choose one: Gain 8 Plated Armor, 4 Strength, or 30 Gold. Exhaust.',
    lore: 'Permohonan suci kepada bintang fajar.',
    artIcon: '⭐👑',
    artTheme: 'wish_divine',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  flame_barrier_fire: {
    id: 'flame_barrier_fire',
    name: 'Blazing Inferno Shield',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 12,
    upgradedDamage: 16,
    block: 16,
    upgradedBlock: 21,
    description: 'Gain !B! Block. Whenever attacked this turn, deal 4 damage back.',
    upgradedDesc: 'Gain !B! Block. Whenever attacked this turn, deal 6 damage back.',
    lore: 'Tameng bara api yang membalas setiap serangan.',
    artIcon: '🔥🛡️',
    artTheme: 'flame_barrier_fire',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  power_through_iron: {
    id: 'power_through_iron',
    name: 'Power Through',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 15,
    upgradedDamage: 20,
    block: 20,
    upgradedBlock: 27,
    description: 'Add 2 Wounds into hand. Gain !B! Block.',
    upgradedDesc: 'Add 2 Wounds into hand. Gain !B! Block.',
    lore: 'Menerobos rintangan dengan mengorbankan luka fisik.',
    artIcon: '🏃‍♂️🩸',
    artTheme: 'power_through_iron',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  ghostly_armor_plate: {
    id: 'ghostly_armor_plate',
    name: 'Ethereal Plate',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 10,
    upgradedDamage: 13,
    block: 13,
    upgradedBlock: 17,
    description: 'Ethereal. Gain !B! Block.',
    upgradedDesc: 'Ethereal. Gain !B! Block.',
    lore: 'Zirah arwah hampa yang sirna di akhir giliran.',
    artIcon: '👻🛡️',
    artTheme: 'ghostly_armor_plate',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  dual_wield_mirage: {
    id: 'dual_wield_mirage',
    name: 'Dual Wield Duplication',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Choose an Attack or Power in hand. Create a copy of it.',
    upgradedDesc: 'Choose an Attack or Power in hand. Create 2 copies of it.',
    lore: 'Menduplikasi senjata atau aura kekuatan di tangan.',
    artIcon: '🗡️✨',
    artTheme: 'dual_wield_mirage',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  dropkick_strike: {
    id: 'dropkick_strike',
    name: 'Dropkick Combo',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 5,
    upgradedDamage: 6,
    block: 8,
    upgradedBlock: 10,
    description: 'Deal !D! damage. If enemy is Vulnerable, gain 1 Energy and draw 1 card.',
    upgradedDesc: 'Deal !D! damage. If enemy is Vulnerable, gain 1 Energy and draw 1 card.',
    lore: 'Tendangan melayang yang mengeksploitasi kelengahan musuh.',
    artIcon: '🦵💥',
    artTheme: 'dropkick_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  blood_boil: {
    id: 'blood_boil',
    name: 'Hemokinesis Boil',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 15,
    upgradedDamage: 20,
    block: 20,
    upgradedBlock: 27,
    description: 'Lose 2 HP. Deal !D! damage.',
    upgradedDesc: 'Lose 2 HP. Deal !D! damage.',
    lore: 'Mendidihkan darah sendiri untuk serangan mematikan.',
    artIcon: '🩸💥',
    artTheme: 'blood_boil',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  reckless_swing_strike: {
    id: 'reckless_swing_strike',
    name: 'Wild Flail',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 12,
    upgradedDamage: 16,
    block: 16,
    upgradedBlock: 21,
    description: 'Deal !D! damage. Add a Dazed to draw pile.',
    upgradedDesc: 'Deal !D! damage. Add a Dazed to draw pile.',
    lore: 'Ayunan gada liar yang membuat pusing pahlawan.',
    artIcon: '🔨💫',
    artTheme: 'reckless_swing_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  clash_blade: {
    id: 'clash_blade',
    name: 'Iron Clash',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 14,
    upgradedDamage: 18,
    block: 18,
    upgradedBlock: 24,
    description: 'Can only be played if every card in hand is Attack. Deal !D! damage.',
    upgradedDesc: 'Can only be played if every card in hand is Attack. Deal !D! damage.',
    lore: 'Adu pedang frontal tanpa tameng sama sekali.',
    artIcon: '⚔️💥',
    artTheme: 'clash_blade',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  heavy_cleave: {
    id: 'heavy_cleave',
    name: 'Colossal Cleave',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 12,
    upgradedDamage: 16,
    block: 16,
    upgradedBlock: 21,
    description: 'Deal !D! damage to ALL enemies. Apply 1 Vulnerable.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Apply 2 Vulnerable.',
    lore: 'Tebasan raksasa yang meruntuhkan barisan lawan.',
    artIcon: '🗡️🌪️',
    artTheme: 'heavy_cleave',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  sentinel_block: {
    id: 'sentinel_block',
    name: 'Sentinel Guard',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 5,
    upgradedDamage: 6,
    block: 8,
    upgradedBlock: 10,
    description: 'Gain !B! Block. If this card is exhausted, gain 2 Energy.',
    upgradedDesc: 'Gain !B! Block. If this card is exhausted, gain 3 Energy.',
    lore: 'Penjaga yang melepaskan energi saat dikorbankan.',
    artIcon: '🛡️⚡',
    artTheme: 'sentinel_block',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  backflip_dodge: {
    id: 'backflip_dodge',
    name: 'Backflip Evade',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 5,
    upgradedDamage: 6,
    block: 8,
    upgradedBlock: 10,
    description: 'Gain !B! Block. Draw 2 cards.',
    upgradedDesc: 'Gain !B! Block. Draw 2 cards.',
    lore: 'Lompatan salto ke belakang sembari menarik senjata baru.',
    artIcon: '🤸‍♀️🃏',
    artTheme: 'backflip_dodge',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  acrobatics_draw: {
    id: 'acrobatics_draw',
    name: 'Acrobatic Leap',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Draw 3 cards. Discard 1 card.',
    upgradedDesc: 'Draw 4 cards. Discard 1 card.',
    lore: 'Kelincahan akrobatik untuk menata kartu di tangan.',
    artIcon: '🤸‍♀️📜',
    artTheme: 'acrobatics_draw',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  outmaneuver_plan: {
    id: 'outmaneuver_plan',
    name: 'Outmaneuver Ambush',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Next turn, gain 2 Energy.',
    upgradedDesc: 'Next turn, gain 3 Energy.',
    lore: 'Merencanakan manuver pengepungan untuk ronde berikutnya.',
    artIcon: '♟️⚡',
    artTheme: 'outmaneuver_plan',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  concentrate_focus: {
    id: 'concentrate_focus',
    name: 'Concentrate Mind',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Discard 3 cards. Gain 2 Energy.',
    upgradedDesc: 'Discard 2 cards. Gain 2 Energy.',
    lore: 'Memfokuskan pikiran dengan membuang beban berlebih.',
    artIcon: '🧠⚡',
    artTheme: 'concentrate_focus',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  nightmare_copy: {
    id: 'nightmare_copy',
    name: 'Nightmare Mirage',
    cost: 3,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Choose a card. Next turn, add 3 copies of it to your hand. Exhaust.',
    upgradedDesc: 'Choose a card. Next turn, add 3 copies of it to hand. Costs 2.',
    lore: 'Mimpi buruk yang membiakkan kartu pilihan pahlawan.',
    artIcon: '🌑👥',
    artTheme: 'nightmare_copy',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  charge_battery_pulse: {
    id: 'charge_battery_pulse',
    name: 'Battery Recharger',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COMMON,
    target: TARGET_TYPES.SELF,
    damage: 7,
    upgradedDamage: 9,
    block: 10,
    upgradedBlock: 13,
    description: 'Gain !B! Block. Next turn, gain 1 Energy.',
    upgradedDesc: 'Gain !B! Block. Next turn, gain 1 Energy.',
    lore: 'Mengisi ulang sel daya sambil mempertahankan diri.',
    artIcon: '🔋🛡️',
    artTheme: 'charge_battery_pulse',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  chill_frost: {
    id: 'chill_frost',
    name: 'Cryogenic Chill',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Channel 1 Frost Orb for each enemy in combat. Exhaust.',
    upgradedDesc: 'Innate. Channel 1 Frost Orb for each enemy. Exhaust.',
    lore: 'Membekukan seluruh ruangan dengan gas nitrogen cair.',
    artIcon: '❄️🌬️',
    artTheme: 'chill_frost',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ALL_ENEMIES' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  recycle_card: {
    id: 'recycle_card',
    name: 'Recycle Matter',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Exhaust a card. Gain Energy equal to its cost.',
    upgradedDesc: 'Exhaust a card. Gain Energy equal to its cost. Costs 0.',
    lore: 'Mendaur ulang kartu tak terpakai menjadi tenaga energi murni.',
    artIcon: '♻️⚡',
    artTheme: 'recycle_card',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  aggregate_burst: {
    id: 'aggregate_burst',
    name: 'Substation Aggregate',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 1 Energy for every 4 cards in draw pile.',
    upgradedDesc: 'Gain 1 Energy for every 3 cards in draw pile.',
    lore: 'Menyalurkan daya dari gardu induksi bawah tanah.',
    artIcon: '⚡🔌',
    artTheme: 'aggregate_burst',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  creative_ai_power: {
    id: 'creative_ai_power',
    name: 'Sentient Neural Network',
    cost: 3,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'At the start of your turn, add a random Power card to your hand.',
    upgradedDesc: 'Innate. At start of turn, add a random Power card to hand.',
    lore: 'Jaringan kecerdasan buatan yang terus menciptakan protokol baru.',
    artIcon: '🧠💻',
    artTheme: 'creative_ai_power',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  study_scroll: {
    id: 'study_scroll',
    name: 'Scripture Study',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'At the end of your turn, shuffle an Insight into your draw pile.',
    upgradedDesc: 'Costs 1. At end of turn, shuffle an Insight into draw pile.',
    lore: 'Mempelajari kitab suci setiap ronde demi pencerahan.',
    artIcon: '📜👁️',
    artTheme: 'study_scroll',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  mental_fortress_power: {
    id: 'mental_fortress_power',
    name: 'Mental Fortress',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever you change Stances, gain 4 Block.',
    upgradedDesc: 'Whenever you change Stances, gain 6 Block.',
    lore: 'Benteng pikiran yang memperkokoh pertahanan setiap beralih stance.',
    artIcon: '🏰🧘‍♀️',
    artTheme: 'mental_fortress_power',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  like_water_power: {
    id: 'like_water_power',
    name: 'Fluid Like Water',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'At the end of your turn, if you are in Calm, gain 5 Block.',
    upgradedDesc: 'At the end of your turn, if you are in Calm, gain 7 Block.',
    lore: 'Menyerupai air yang mengalir tenang menutupi seluruh celah.',
    artIcon: '💧🛡️',
    artTheme: 'like_water_power',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  rushdown_power: {
    id: 'rushdown_power',
    name: 'Rushdown Flurry',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever you enter Wrath, draw 2 cards.',
    upgradedDesc: 'Costs 0. Whenever you enter Wrath, draw 2 cards.',
    lore: 'Serbuan cepat yang menarik kartu baru saat amarah meledak.',
    artIcon: '🌋🃏',
    artTheme: 'rushdown_power',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  master_reality_power: {
    id: 'master_reality_power',
    name: 'Master of Reality',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever a card is created during combat, Upgrade it.',
    upgradedDesc: 'Costs 0. Whenever a card is created during combat, Upgrade it.',
    lore: 'Menguasai realitas sehingga seluruh kartu ciptaan langsung ter-upgrade.',
    artIcon: '🌌✨',
    artTheme: 'master_reality_power',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  panacea_pure: {
    id: 'panacea_pure',
    name: 'Panacea Essence',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Gain 1 Artifact (negate next debuff). Exhaust.',
    upgradedDesc: 'Gain 2 Artifact. Exhaust.',
    lore: 'Zat murni pembersih segala pengaruh buruk.',
    artIcon: '🧪✨',
    artTheme: 'panacea_pure',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  chrysalis_meta: {
    id: 'chrysalis_meta',
    name: 'Chrysalis Metamorphosis',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Shuffle 3 random Skills into draw pile. They cost 0 this combat. Exhaust.',
    upgradedDesc: 'Shuffle 5 random Skills into draw pile. Cost 0. Exhaust.',
    lore: 'Metamorfosis kepompong sutra yang melahirkan ribuan keajaiban.',
    artIcon: '🐛✨',
    artTheme: 'chrysalis_meta',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  metamorphosis_strike: {
    id: 'metamorphosis_strike',
    name: 'Beast Metamorphosis',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Shuffle 3 random Attacks into draw pile. They cost 0 this combat. Exhaust.',
    upgradedDesc: 'Shuffle 5 random Attacks into draw pile. Cost 0. Exhaust.',
    lore: 'Transformasi buas pembawa senjata acak tanpa batas.',
    artIcon: '🐺🗡️',
    artTheme: 'metamorphosis_strike',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  magnetism_field: {
    id: 'magnetism_field',
    name: 'Magnetic Field Coil',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'At start of turn, add a random Colorless card to hand.',
    upgradedDesc: 'Innate. At start of turn, add a random Colorless card to hand.',
    lore: 'Koil medan magnet yang menarik partikel sihir netral.',
    artIcon: '🧲🔮',
    artTheme: 'magnetism_field',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  the_bomb_detonator: {
    id: 'the_bomb_detonator',
    name: 'The Clockwork Bomb',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'At the end of 3 turns, deal 30 damage to ALL enemies.',
    upgradedDesc: 'At the end of 3 turns, deal 40 damage to ALL enemies.',
    lore: 'Bom jam putar berkekuatan ledak kataklismik.',
    artIcon: '💣⏱️',
    artTheme: 'the_bomb_detonator',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  hand_of_fate: {
    id: 'hand_of_fate',
    name: 'Fateful Hand',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Choose 1 card in hand. Retain it. Exhaust.',
    upgradedDesc: 'Choose 1 card in hand. Retain it.',
    lore: 'Tangan takdir yang menahan kartu penting untuk momen tepat.',
    artIcon: '✋⏳',
    artTheme: 'hand_of_fate',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  discovery_tome: {
    id: 'discovery_tome',
    name: 'Discovery of Ancient Lore',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Choose 1 of 3 random cards to add to hand. It costs 0 this turn. Exhaust.',
    upgradedDesc: 'Choose 1 of 3 cards. It costs 0 this turn.',
    lore: 'Menemukan lembaran mantra kuno di sela batuan menara.',
    artIcon: '📖🔍',
    artTheme: 'discovery_tome',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  enlightenment_zen: {
    id: 'enlightenment_zen',
    name: 'Zen Enlightenment',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Reduce the cost of all cards in your hand to 1 for this turn.',
    upgradedDesc: 'Reduce the cost of all cards in your hand to 1 for the rest of combat.',
    lore: 'Pencerahan zen yang menyederhanakan pemakaian energi.',
    artIcon: '🧘‍♂️✨',
    artTheme: 'enlightenment_zen',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  impatience_haste: {
    id: 'impatience_haste',
    name: 'Impatience Haste',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'If you have no Attacks in hand, draw 2 cards.',
    upgradedDesc: 'If you have no Attacks in hand, draw 3 cards.',
    lore: 'Ketidaksabaran yang memicu refleks tarikan kartu.',
    artIcon: '⌛🃏',
    artTheme: 'impatience_haste',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  purity_cleanse: {
    id: 'purity_cleanse',
    name: 'Spiritual Purity',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Choose and Exhaust up to 3 cards in your hand. Exhaust.',
    upgradedDesc: 'Choose and Exhaust up to 5 cards in your hand. Exhaust.',
    lore: 'Pembersihan spiritual yang menghanguskan kartu sampah dari tangan.',
    artIcon: '✨🔥',
    artTheme: 'purity_cleanse',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  transmutation_flux: {
    id: 'transmutation_flux',
    name: 'Elemental Transmutation',
    cost: -1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Add X random Colorless cards into hand. Exhaust.',
    upgradedDesc: 'Add X Upgraded random Colorless cards into hand. Exhaust.',
    lore: 'Fluks transmutasi yang mengubah energi menjadi mantra.',
    artIcon: '⚗️🌈',
    artTheme: 'transmutation_flux',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  violence_frenzy: {
    id: 'violence_frenzy',
    name: 'Burst of Violence',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Place 3 random Attacks from your draw pile into your hand. Exhaust.',
    upgradedDesc: 'Place 4 random Attacks from your draw pile into hand. Exhaust.',
    lore: 'Ledakan agresi yang menarik senjata langsung ke tangan siap tempur.',
    artIcon: '🗡️🩸',
    artTheme: 'violence_frenzy',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  apotheosis_divine: {
    id: 'apotheosis_divine',
    name: 'Ascendant Apotheosis',
    cost: 2,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Upgrade ALL cards for the rest of combat. Exhaust.',
    upgradedDesc: 'Costs 1. Upgrade ALL cards for rest of combat. Exhaust.',
    lore: 'Pengangkatan derajat senjata dan taktik pahlawan ke tingkat ilahi.',
    artIcon: '👑✨',
    artTheme: 'apotheosis_divine',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  mayhem_entropy: {
    id: 'mayhem_entropy',
    name: 'Unbridled Mayhem',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'At the start of your turn, play the top card of your draw pile.',
    upgradedDesc: 'Costs 1. At start of turn, play top card of draw pile.',
    lore: 'Kekacauan mutlak yang otomatis mengeksekusi kartu teratas.',
    artIcon: '🌪️🃏',
    artTheme: 'mayhem_entropy',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  sadistic_thrill: {
    id: 'sadistic_thrill',
    name: 'Sadistic Symphony',
    cost: 0,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever you apply a debuff to an enemy, they take 5 damage.',
    upgradedDesc: 'Whenever you apply a debuff to an enemy, they take 7 damage.',
    lore: 'Setiap kutukan dan racun yang menempel menyengat tubuh lawan.',
    artIcon: '🎶🩸',
    artTheme: 'sadistic_thrill',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  dark_embrace_soul: {
    id: 'dark_embrace_soul',
    name: 'Abyssal Rebirth',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever a card is Exhausted, draw 1 card.',
    upgradedDesc: 'Costs 1. Whenever a card is Exhausted, draw 1 card.',
    lore: 'Kelahiran kembali dari abu kartu yang musnah.',
    artIcon: '🌑🦅',
    artTheme: 'dark_embrace_soul',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  evolve_endure: {
    id: 'evolve_endure',
    name: 'Adaptive Evolution',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever you draw a Status card, draw 1 card.',
    upgradedDesc: 'Whenever you draw a Status card, draw 2 cards.',
    lore: 'Adaptasi tubuh yang mengubah racun dan luka menjadi pemicu refleks.',
    artIcon: '🧬🛡️',
    artTheme: 'evolve_endure',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  fire_breathing_flame: {
    id: 'fire_breathing_flame',
    name: 'Dragon Breath',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever you draw a Status or Curse, deal 6 damage to ALL enemies.',
    upgradedDesc: 'Whenever you draw a Status or Curse, deal 10 damage to ALL enemies.',
    lore: 'Napas naga yang menyemburkan api saat tubuh terinfeksi.',
    artIcon: '🐲🔥',
    artTheme: 'fire_breathing_flame',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  feel_no_pain_iron: {
    id: 'feel_no_pain_iron',
    name: 'Calloused Skin',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever a card is Exhausted, gain 3 Block.',
    upgradedDesc: 'Whenever a card is Exhausted, gain 4 Block.',
    lore: 'Kulit kapalan yang memadat menjadi perisai setiap ada kartu yang gugur.',
    artIcon: '🛡️🦴',
    artTheme: 'feel_no_pain_iron',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  rupture_blood: {
    id: 'rupture_blood',
    name: 'Vindictive Rage',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever you lose HP from a card, gain 1 Strength.',
    upgradedDesc: 'Whenever you lose HP from a card, gain 2 Strength.',
    lore: 'Dendam kesumat yang memperkuat urat nadi saat darah sendiri tumpah.',
    artIcon: '🩸💪',
    artTheme: 'rupture_blood',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  juggernaut_armor: {
    id: 'juggernaut_armor',
    name: 'Juggernaut Momentum',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Whenever you gain Block, deal 5 damage to a random enemy.',
    upgradedDesc: 'Whenever you gain Block, deal 7 damage to a random enemy.',
    lore: 'Gelombang kejut kinetik yang terlontar setiap perisai ditegakkan.',
    artIcon: '🛡️⚡',
    artTheme: 'juggernaut_armor',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  combust_hell: {
    id: 'combust_hell',
    name: 'Hellfire Immolation',
    cost: 1,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'At end of turn, lose 1 HP and deal 5 damage to ALL enemies.',
    upgradedDesc: 'At end of turn, lose 1 HP and deal 7 damage to ALL enemies.',
    lore: 'Tubuh pahlawan terbakar bara neraka yang memercik ke seluruh penjuru.',
    artIcon: '🔥🌋',
    artTheme: 'combust_hell',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  dark_ritual_rite: {
    id: 'dark_ritual_rite',
    name: 'Shadow Pact',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 0,
    upgradedDamage: 0,
    block: 0,
    upgradedBlock: 0,
    description: 'Lose 3 HP. Gain 2 Energy. Exhaust.',
    upgradedDesc: 'Lose 2 HP. Gain 2 Energy. Exhaust.',
    lore: 'Perjanjian darah hitam yang memberikan tenaga instan.',
    artIcon: '🌑🩸',
    artTheme: 'dark_ritual_rite',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  trip_kick: {
    id: 'trip_kick',
    name: 'Leg Sweep Kick',
    cost: 0,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.ENEMY,
    damage: 4,
    upgradedDamage: 5,
    block: 6,
    upgradedBlock: 8,
    description: 'Deal !D! damage. Apply 1 Vulnerable.',
    upgradedDesc: 'Deal !D! damage. Apply 2 Vulnerable.',
    lore: 'Tendangan sapuan kaki yang membuat monster goyah.',
    artIcon: '🦵💥',
    artTheme: 'trip_kick',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('ENEMY' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  swift_evade: {
    id: 'swift_evade',
    name: 'Swift Retreat',
    cost: 0,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.COLORLESS,
    target: TARGET_TYPES.SELF,
    damage: 5,
    upgradedDamage: 6,
    block: 8,
    upgradedBlock: 10,
    description: 'Gain !B! Block. Exhaust.',
    upgradedDesc: 'Gain !B! Block.',
    lore: 'Gerakan mundur cepat menghindari serangan mendadak.',
    artIcon: '🏃‍♂️🛡️',
    artTheme: 'swift_evade',
    execute(combat, target) {
      if (this.damage > 0) {
        const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
        if ('SELF' === 'ALL_ENEMIES') combat.dealDamageToAllEnemies(d);
        else if (target) combat.dealDamageToEnemy(target, d);
      }
      if (this.block > 0) {
        const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
        combat.gainPlayerBlock(b);
      }
      if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      combat.triggerVfx('slash', target || 'player');
    }
  },

  // ==========================================================================
  // KARTU SPESIAL REFERENSI ANIME LEGENDARIS (SHADOWSPIRE ANIME EDITION)
  // ==========================================================================

  black_flash: {
    id: 'black_flash',
    name: 'Kokusen: Black Flash',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 12,
    upgradedDamage: 16,
    description: 'Deal !D! damage. If 3rd card played this turn, deal 2x damage with spatial lightning!',
    upgradedDesc: 'Deal !D! damage. If 3rd card played this turn, deal 2x damage with spatial lightning!',
    lore: 'Distorsi ruang 0.000001 detik yang melepaskan petir hitam pekat (Jujutsu Kaisen nod).',
    artIcon: '⚡🖤',
    artTheme: 'black_flash',
    execute(combat, target) {
      let d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const isBlackFlash = (combat.characterPassives && combat.characterPassives.cardsPlayedTotal % 3 === 0);
      if (isBlackFlash) {
        d *= 2;
        combat.showCombatText('KOKUSEN! ⚡ BLACK FLASH!', target, '#212529', true);
        if (window.spireAudio && window.spireAudio.playBlackFlash) window.spireAudio.playBlackFlash();
        window.spireVfx.triggerScreenShake('heavy');
      } else {
        if (window.spireAudio && window.spireAudio.playAnimeSlash) window.spireAudio.playAnimeSlash();
      }
      combat.dealDamageToEnemy(target, d);
      combat.triggerVfx('heavy_slice', target);
    }
  },

  getsuga_tenshou: {
    id: 'getsuga_tenshou',
    name: 'Getsuga: Moon Fang',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ALL_ENEMIES,
    damage: 18,
    upgradedDamage: 24,
    description: 'Deal !D! damage to ALL enemies. Apply 1 Vulnerable.',
    upgradedDesc: 'Deal !D! damage to ALL enemies. Apply 2 Vulnerable.',
    lore: 'Tebasan sabit bulan raksasa bermandikan energi kegelapan void (Bleach nod).',
    artIcon: '🌙⚔️',
    artTheme: 'getsuga_tenshou',
    execute(combat) {
      const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToAllEnemies(d);
      combat.enemies.forEach(e => {
        if (!e.isDead && !e.hasEscaped) combat.applyEnemyStatus(e, 'vulnerable', this.isUpgraded ? 2 : 1);
      });
      combat.showCombatText('GETSUGA TENSHOU!', 'all', '#e03131', true);
      if (window.spireAudio && window.spireAudio.playAnimeSlash) window.spireAudio.playAnimeSlash();
      combat.triggerVfx('cleave_sweep', 'all');
      window.spireVfx.triggerScreenShake('heavy');
    }
  },

  hinokami_kagura: {
    id: 'hinokami_kagura',
    name: 'Hinokami: Sun Dance',
    cost: 1,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.UNCOMMON,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    upgradedDamage: 9,
    vulnerable: 1,
    upgradedVulnerable: 2,
    description: 'Deal !D! damage 2 times. Apply !V! Vulnerable.',
    upgradedDesc: 'Deal !D! damage 2 times. Apply !V! Vulnerable.',
    lore: 'Tarian pedang matahari suci pemusnah iblis kegelapan (Demon Slayer nod).',
    artIcon: '☀️🔥',
    artTheme: 'hinokami',
    execute(combat, target) {
      const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      const v = this.isUpgraded ? this.upgradedVulnerable : this.vulnerable;
      combat.dealDamageToEnemy(target, d);
      combat.dealDamageToEnemy(target, d);
      combat.applyEnemyStatus(target, 'vulnerable', v);
      combat.showCombatText('HINOKAMI KAGURA!', target, '#ff922b');
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      combat.triggerVfx('fire_burst', target);
    }
  },

  arise_shadow: {
    id: 'arise_shadow',
    name: 'Shadow Monarch: ARISE',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    block: 10,
    upgradedBlock: 14,
    description: 'Gain !B! Block. Gain 1 Strength. Exhaust.',
    upgradedDesc: 'Gain !B! Block. Gain 2 Strength. Exhaust.',
    exhaust: true,
    lore: 'Perintah mutlak sang Penguasa Bayangan untuk membangkitkan arwah tempur (Solo Leveling nod).',
    artIcon: '👑👥',
    artTheme: 'arise',
    execute(combat) {
      const b = combat.calcBlock(this.isUpgraded ? this.upgradedBlock : this.block);
      combat.gainPlayerBlock(b);
      combat.applyPlayerStatus('strength', this.isUpgraded ? 2 : 1);
      combat.showCombatText('ARISE!', 'player', '#7950f2', true);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('shockwave_ring', 'player');
    }
  },

  za_warudo: {
    id: 'za_warudo',
    name: 'The World: Time Stop',
    cost: 1,
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.SPECIAL,
    target: TARGET_TYPES.SELF,
    description: 'Gain 2 Energy. Draw 2 cards. Next Attack deals 2x damage. Exhaust.',
    upgradedDesc: 'Gain 3 Energy. Draw 3 cards. Next Attack deals 2x damage. Exhaust.',
    exhaust: true,
    lore: 'Waktu membeku di seluruh arena tempur... ZA WARUDO! (JoJo nod).',
    artIcon: '⏳⏱️',
    artTheme: 'za_warudo',
    execute(combat) {
      combat.energy += this.isUpgraded ? 3 : 2;
      combat.drawCards(this.isUpgraded ? 3 : 2);
      combat.player.status.doubleDamageNext = true;
      combat.showCombatText('ZA WARUDO! (Time Stopped)', 'player', '#ffd43b', true);
      if (window.spireAudio && window.spireAudio.playTimeStop) window.spireAudio.playTimeStop();
      window.spireVfx.triggerScreenShake('medium');
    }
  },

  serious_punch: {
    id: 'serious_punch',
    name: 'Serious Punch',
    cost: 2,
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.ENEMY,
    damage: 28,
    upgradedDamage: 38,
    description: 'Deal !D! massive damage. Shakes the Spire.',
    upgradedDesc: 'Deal !D! massive damage. Shakes the Spire.',
    lore: 'Satu pukulan sungguh-sungguh pemecah atmosfer tanpa ampun (One Punch Man nod).',
    artIcon: '🥊💥',
    artTheme: 'serious_punch',
    execute(combat, target) {
      const d = combat.calcDamage(this.isUpgraded ? this.upgradedDamage : this.damage);
      combat.dealDamageToEnemy(target, d);
      combat.showCombatText('SERIOUS PUNCH!!', target, '#ff0000', true);
      if (window.spireAudio) window.spireAudio.playHeavyBludgeon();
      window.spireVfx.triggerScreenShake('heavy');
      combat.triggerVfx('heavy_slice', target);
    }
  },

  domain_expansion: {
    id: 'domain_expansion',
    name: 'Domain Expansion: Void',
    cost: 2,
    type: CARD_TYPES.POWER,
    rarity: CARD_RARITIES.RARE,
    target: TARGET_TYPES.SELF,
    description: 'At the start of your turn, gain 1 Energy and draw 1 extra card.',
    upgradedDesc: 'At the start of your turn, gain 1 Energy and draw 1 extra card.',
    lore: 'Ryouiki Tenkai. Membuka penghalang domain yang menjamin dominasi absolut di medan laga (JJK nod).',
    artIcon: '⛩️🌌',
    artTheme: 'domain_expansion',
    execute(combat) {
      combat.applyPlayerStatus('demonForm', 1);
      combat.energy += 1;
      combat.drawCards(1);
      combat.showCombatText('RYOUIKI TENKAI!', 'player', '#da77f2', true);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      combat.triggerVfx('shockwave_ring', 'player');
    }
  },
  // ============================================================================
  // THEMATIC STARTER CARDS FOR 10 HEROES
  // ============================================================================
  demonic_strike: {
    id: 'demonic_strike',
    name: 'Demonic Strike',
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.ENEMY,
    damage: 8,
    description: 'Berikan 8 damage api. Jika HP <= 50%, berikan 13 damage.',
    theme: 'dragon_strike',
    upgrade: {
      damage: 11,
      description: 'Berikan 11 damage api. Jika HP <= 50%, berikan 17 damage.'
    },
    execute(combat, target) {
      const isBloodied = combat.player.currentHp <= (combat.player.maxHp * 0.5);
      const dmg = this.isUpgraded ? (isBloodied ? 17 : 11) : (isBloodied ? 13 : 8);
      combat.dealDamageToEnemy(target, dmg);
      if (isBloodied) combat.showCombatText('🩸 Blood Fury!', 'player', '#ff4d4d');
    }
  },

  ironclad_defend: {
    id: 'ironclad_defend',
    name: 'Iron Bastion',
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.SELF,
    block: 6,
    description: 'Dapatkan 6 Block. Peroleh 1 Thorns (duri pantul) giliran ini.',
    theme: 'defend',
    upgrade: {
      block: 9,
      description: 'Dapatkan 9 Block. Peroleh 2 Thorns giliran ini.'
    },
    execute(combat) {
      combat.gainPlayerBlock(this.isUpgraded ? 9 : 6);
      combat.applyPlayerStatus('thorns', this.isUpgraded ? 2 : 1);
    }
  },

  poison_shiv: {
    id: 'poison_shiv',
    name: 'Poison Shiv',
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.ENEMY,
    damage: 5,
    description: 'Tusukkan belati beracun: Berikan 5 damage dan 2 Poison.',
    theme: 'dagger_slash',
    upgrade: {
      damage: 7,
      description: 'Tusukkan belati beracun: Berikan 7 damage dan 3 Poison.'
    },
    execute(combat, target) {
      combat.dealDamageToEnemy(target, this.isUpgraded ? 7 : 5);
      combat.applyEnemyStatus(target, 'poison', this.isUpgraded ? 3 : 2);
    }
  },

  shadow_dodge: {
    id: 'shadow_dodge',
    name: 'Shadow Dodge',
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.SELF,
    block: 6,
    description: 'Dapatkan 6 Block. Tarik 1 kartu tambahan di giliran depan.',
    theme: 'defend',
    upgrade: {
      block: 9,
      description: 'Dapatkan 9 Block. Tarik 1 kartu tambahan di giliran depan.'
    },
    execute(combat) {
      combat.gainPlayerBlock(this.isUpgraded ? 9 : 6);
      combat.applyPlayerStatus('draw_next_turn', 1);
      combat.showCombatText('Shadow Evasion (+1 Draw Next Turn)', 'player', '#74c0fc');
    }
  },

  arc_discharge: {
    id: 'arc_discharge',
    name: 'Arc Discharge',
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    description: 'Lepaskan sengatan busur petir: 7 damage. Channel 1 Lightning Orb.',
    theme: 'limitless_blue',
    upgrade: {
      damage: 10,
      description: 'Lepaskan sengatan busur petir: 10 damage. Channel 1 Lightning Orb.'
    },
    execute(combat, target) {
      combat.dealDamageToEnemy(target, this.isUpgraded ? 10 : 7);
      if (typeof combat.channelOrb === 'function') combat.channelOrb('LIGHTNING');
    }
  },

  cryo_shield: {
    id: 'cryo_shield',
    name: 'Cryo Shield',
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.SELF,
    block: 6,
    description: 'Dapatkan 6 Block. Channel 1 Frost Orb (menambah Block tiap turn).',
    theme: 'defend',
    upgrade: {
      block: 9,
      description: 'Dapatkan 9 Block. Channel 1 Frost Orb.'
    },
    execute(combat) {
      combat.gainPlayerBlock(this.isUpgraded ? 9 : 6);
      if (typeof combat.channelOrb === 'function') combat.channelOrb('FROST');
    }
  },

  palm_strike: {
    id: 'palm_strike',
    name: 'Divine Palm',
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.ENEMY,
    damage: 6,
    description: 'Hantaman telapak suci: 6 damage. Jika dalam Wrath, damage menjadi 2x lipat (12 damage).',
    theme: 'strike',
    upgrade: {
      damage: 9,
      description: 'Hantaman telapak suci: 9 damage. Jika dalam Wrath, damage menjadi 2x lipat (18 damage).'
    },
    execute(combat, target) {
      let d = this.isUpgraded ? 9 : 6;
      if (combat.player.stance === 'WRATH') d *= 2;
      combat.dealDamageToEnemy(target, d);
    }
  },

  inner_peace: {
    id: 'inner_peace',
    name: 'Inner Sanctuary',
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.SELF,
    block: 6,
    description: 'Dapatkan 6 Block. Masuki sikap Calm (Tenang).',
    theme: 'defend',
    upgrade: {
      block: 9,
      description: 'Dapatkan 9 Block. Masuki sikap Calm (Tenang).'
    },
    execute(combat) {
      combat.gainPlayerBlock(this.isUpgraded ? 9 : 6);
      if (typeof combat.changePlayerStance === 'function') combat.changePlayerStance('CALM');
    }
  },

  bone_dart: {
    id: 'bone_dart',
    name: 'Bone Dart',
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.ENEMY,
    damage: 6,
    description: 'Tembak serpihan tulang tajam: 6 damage. Jika ada Soul, konsumsi 1 Soul untuk +4 damage.',
    theme: 'dagger_slash',
    upgrade: {
      damage: 9,
      description: 'Tembak serpihan tulang tajam: 9 damage. Jika ada Soul, konsumsi 1 Soul untuk +6 damage.'
    },
    execute(combat, target) {
      let extra = 0;
      if ((combat.player.soulCount || 0) > 0) {
        combat.player.soulCount--;
        extra = this.isUpgraded ? 6 : 4;
        combat.showCombatText('-1 Soul (+Bonus DMG!)', 'player', '#b197fc');
      }
      combat.dealDamageToEnemy(target, (this.isUpgraded ? 9 : 6) + extra);
    }
  },

  tomb_ward: {
    id: 'tomb_ward',
    name: 'Tomb Ward',
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.SELF,
    block: 6,
    description: 'Kumpulkan energi pemakaman: Dapatkan 6 Block dan 1 Soul.',
    theme: 'defend',
    upgrade: {
      block: 9,
      description: 'Kumpulkan energi pemakaman: Dapatkan 9 Block dan 2 Soul.'
    },
    execute(combat) {
      combat.gainPlayerBlock(this.isUpgraded ? 9 : 6);
      combat.player.soulCount = (combat.player.soulCount || 0) + (this.isUpgraded ? 2 : 1);
      combat.showCombatText(`+${this.isUpgraded ? 2 : 1} Soul`, 'player', '#9775fa');
    }
  },

  chrono_shard: {
    id: 'chrono_shard',
    name: 'Chrono Shard',
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.ENEMY,
    damage: 6,
    description: 'Serang melintasi linimasa: 6 damage. Jika giliran ganjil (T1, T3, T5...), tarik 1 kartu.',
    theme: 'strike',
    upgrade: {
      damage: 9,
      description: 'Serang melintasi linimasa: 9 damage. Jika giliran ganjil, tarik 1 kartu.'
    },
    execute(combat, target) {
      combat.dealDamageToEnemy(target, this.isUpgraded ? 9 : 6);
      if ((combat.turnNumber || 1) % 2 === 1) {
        combat.drawCards(1);
        combat.showCombatText('Temporal Echo (+1 Card)', 'player', '#ffd43b');
      }
    }
  },

  temporal_barrier: {
    id: 'temporal_barrier',
    name: 'Temporal Barrier',
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.SELF,
    block: 6,
    description: 'Dapatkan 6 Block. Mempercepat aksi: Kartu berikutnya giliran ini gratis (0 Energi).',
    theme: 'defend',
    upgrade: {
      block: 9,
      description: 'Dapatkan 9 Block. Kartu berikutnya giliran ini gratis (0 Energi).'
    },
    execute(combat) {
      combat.gainPlayerBlock(this.isUpgraded ? 9 : 6);
      combat.player.nextCardFree = true;
      combat.showCombatText('Time Skip (Next Card: 0 Energy)', 'player', '#74c0fc');
    }
  },

  reckless_cleave: {
    id: 'reckless_cleave',
    name: 'Reckless Cleave',
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.ENEMY,
    damage: 10,
    description: 'Tebasan kalap membabi buta: Berikan 10 damage besar. Terima 1 self-damage.',
    theme: 'strike',
    upgrade: {
      damage: 14,
      description: 'Tebasan kalap membabi buta: Berikan 14 damage besar. Terima 1 self-damage.'
    },
    execute(combat, target) {
      combat.dealDamageToEnemy(target, this.isUpgraded ? 14 : 10);
      combat.damagePlayer(1);
      combat.showCombatText('Blood Toll (-1 HP)', 'player', '#ff6b6b');
    }
  },

  blood_guard: {
    id: 'blood_guard',
    name: 'Blood Fortitude',
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.SELF,
    block: 5,
    description: 'Dapatkan 5 Block. Jika HP <= 50%, tekad menguat: dapatkan 9 Block.',
    theme: 'defend',
    upgrade: {
      block: 8,
      description: 'Dapatkan 8 Block. Jika HP <= 50%, dapatkan 13 Block.'
    },
    execute(combat) {
      const isLow = combat.player.currentHp <= (combat.player.maxHp * 0.5);
      const blk = isLow ? (this.isUpgraded ? 13 : 9) : (this.isUpgraded ? 8 : 5);
      combat.gainPlayerBlock(blk);
      if (isLow) combat.showCombatText('Berserk Resilience (+Extra Block)', 'player', '#ff6b6b');
    }
  },

  divine_hammer: {
    id: 'divine_hammer',
    name: 'Divine Hammer',
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.ENEMY,
    damage: 7,
    description: 'Hantam dengan palu suci: 7 Holy damage. Pulihkan 2 HP jika musuh bersiap menyerang.',
    theme: 'strike',
    upgrade: {
      damage: 10,
      description: 'Hantam dengan palu suci: 10 Holy damage. Pulihkan 3 HP jika musuh bersiap menyerang.'
    },
    execute(combat, target) {
      combat.dealDamageToEnemy(target, this.isUpgraded ? 10 : 7);
      if (target && target.currentIntent && target.currentIntent.type === 'ATTACK') {
        combat.healPlayer(this.isUpgraded ? 3 : 2);
        combat.showCombatText('Holy Absolution (+Heal)', 'player', '#51cf66');
      }
    }
  },

  holy_bulwark: {
    id: 'holy_bulwark',
    name: 'Holy Bulwark',
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.SELF,
    block: 7,
    description: 'Dapatkan 7 Block suci dan 1 Retaliate (pantulkan 1 damage saat terpukul).',
    theme: 'defend',
    upgrade: {
      block: 10,
      description: 'Dapatkan 10 Block suci dan 2 Retaliate.'
    },
    execute(combat) {
      combat.gainPlayerBlock(this.isUpgraded ? 10 : 7);
      combat.applyPlayerStatus('thorns', this.isUpgraded ? 2 : 1);
    }
  },

  kunai_throw: {
    id: 'kunai_throw',
    name: 'Twin Kunai',
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.ENEMY,
    damage: 4,
    description: 'Lempar sepasang kunai cepat: 4 damage sebanyak 2 kali (8 total damage).',
    theme: 'dagger_slash',
    upgrade: {
      damage: 6,
      description: 'Lempar sepasang kunai cepat: 6 damage sebanyak 2 kali (12 total damage).'
    },
    execute(combat, target) {
      const d = this.isUpgraded ? 6 : 4;
      combat.dealDamageToEnemy(target, d);
      setTimeout(() => {
        if (target && !target.isDead && target.currentHp > 0) {
          combat.dealDamageToEnemy(target, d);
        }
      }, 140);
    }
  },

  smoke_screen: {
    id: 'smoke_screen',
    name: 'Smoke Veil',
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.SELF,
    block: 6,
    description: 'Ledakkan bom asap: Dapatkan 6 Block dan berikan 1 Weak ke musuh.',
    theme: 'defend',
    upgrade: {
      block: 9,
      description: 'Ledakkan bom asap: Dapatkan 9 Block dan berikan 2 Weak ke musuh.'
    },
    execute(combat, target) {
      combat.gainPlayerBlock(this.isUpgraded ? 9 : 6);
      if (target) combat.applyEnemyStatus(target, 'weak', this.isUpgraded ? 2 : 1);
    }
  },

  corrosive_flask: {
    id: 'corrosive_flask',
    name: 'Corrosive Acid',
    type: CARD_TYPES.ATTACK,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.ENEMY,
    damage: 5,
    description: 'Lempar botol zat asam: 5 damage, 2 Poison, dan 1 Vulnerable.',
    theme: 'limitless_red',
    upgrade: {
      damage: 7,
      description: 'Lempar botol zat asam: 7 damage, 3 Poison, dan 2 Vulnerable.'
    },
    execute(combat, target) {
      combat.dealDamageToEnemy(target, this.isUpgraded ? 7 : 5);
      combat.applyEnemyStatus(target, 'poison', this.isUpgraded ? 3 : 2);
      combat.applyEnemyStatus(target, 'vulnerable', this.isUpgraded ? 2 : 1);
    }
  },

  alchemical_coat: {
    id: 'alchemical_coat',
    name: 'Alchemist Coat',
    type: CARD_TYPES.SKILL,
    rarity: CARD_RARITIES.BASIC,
    cost: 1,
    target: TARGET_TYPES.SELF,
    block: 6,
    description: 'Dapatkan 6 Block dan 2 Plated Armor (Block menetap antar giliran).',
    theme: 'defend',
    upgrade: {
      block: 9,
      description: 'Dapatkan 9 Block dan 3 Plated Armor.'
    },
    execute(combat) {
      combat.gainPlayerBlock(this.isUpgraded ? 9 : 6);
      combat.applyPlayerStatus('plated_armor', this.isUpgraded ? 3 : 2);
    }
  },

};

const KEYWORD_GLOSSARY = {
  vulnerable: {
    name: 'Vulnerable (Rentan)',
    icon: '💔',
    color: '#ff6b6b',
    desc: 'Target menerima 50% lebih banyak damage dari kartu Serangan.'
  },
  weak: {
    name: 'Weak (Lemah)',
    icon: '🥀',
    color: '#ffd43b',
    desc: 'Target memberikan 25% lebih sedikit damage Serangan.'
  },
  frail: {
    name: 'Frail (Rapuh)',
    icon: '🧱',
    color: '#ffa94d',
    desc: 'Memperoleh 25% lebih sedikit Block dari kartu Pertahanan.'
  },
  strength: {
    name: 'Strength (Kekuatan)',
    icon: '🗡️',
    color: '#ff4d4d',
    desc: 'Meningkatkan damage dari kartu Serangan sebesar nilai Kekuatan.'
  },
  dexterity: {
    name: 'Dexterity (Ketangkasan)',
    icon: '🥾',
    color: '#51cf66',
    desc: 'Meningkatkan Block dari kartu Pertahanan sebesar nilai Ketangkasan.'
  },
  poison: {
    name: 'Poison (Racun)',
    icon: '🧪',
    color: '#51cf66',
    desc: 'Di awal giliran, target terkena damage sebesar Racun, lalu berkurang 1.'
  },
  exhaust: {
    name: 'Exhaust (Hangus)',
    icon: '🔥',
    color: '#ced4da',
    desc: 'Kartu dikeluarkan dari pertempuran setelah dimainkan hingga pertempuran selesai.'
  },
  ethereal: {
    name: 'Ethereal (Fana)',
    icon: '👻',
    color: '#ced4da',
    desc: 'Jika kartu ini masih berada di tangan saat akhir giliran, kartu akan otomatis Exhaust.'
  },
  innate: {
    name: 'Innate (Bawaan)',
    icon: '🌟',
    color: '#ffd43b',
    desc: 'Selalu terambil dan berada di tangan pada giliran pertama pertarungan.'
  },
  retain: {
    name: 'Retain (Pertahankan)',
    icon: '📌',
    color: '#74c0fc',
    desc: 'Kartu tidak akan dibuang ke discard pile saat akhir giliran.'
  },
  metallicize: {
    name: 'Metallicize (Pelat Baja)',
    icon: '⚙️',
    color: '#74c0fc',
    desc: 'Di akhir setiap giliran, secara otomatis memperoleh Block.'
  },
  barricade: {
    name: 'Barricade (Barikade)',
    icon: '🏰',
    color: '#a0aec0',
    desc: 'Block tidak hilang atau berkurang saat pergantian giliran.'
  }
};


// ============================================================================
// SHADOWSPIRE ANIME ADAPTATION: MASTER ANIME DICTIONARY & SVG VECTOR ART ENGINE
// ============================================================================

const ANIME_CARD_DATA = {
  dagger_strike: {
    animeName: "Dagger Rush (短剣術)",
    animeOrigin: "Solo Leveling",
    animeQuote: "“Menghujam titik vital musuh dengan kecepatan sonik!” — Sung Jin-woo",
    artTheme: "sukuna_cleave"
  },
  bloodlust_glare: {
    animeName: "Bloodlust (殺気 • Sakki)",
    animeOrigin: "Solo Leveling",
    animeQuote: "“Niat membunuh yang begitu pekat hingga membuat musuh tercekik ketakutan.” — Sung Jin-woo",
    artTheme: "black_flash"
  },
  shadow_slash: {
    animeName: "Shadow Mutilation (影の乱舞)",
    animeOrigin: "Solo Leveling",
    animeQuote: "“Tebasan beruntun dari dalam kegelapan tak berujung.” — Sung Jin-woo",
    artTheme: "shadow_arise"
  },
  dominators_touch: {
    animeName: "Ruler's Hand (支配者の手)",
    animeOrigin: "Solo Leveling",
    animeQuote: "“Kekuatan psikokinesis tak terlihat yang mengendalikan ruang gravitasi.” — Sung Jin-woo",
    artTheme: "shadow_arise"
  },
  monarchs_domain: {
    animeName: "Monarch's Realm (君主の領域)",
    animeOrigin: "Solo Leveling",
    animeQuote: "“Di dalam wilayah bayanganku, kekuatanku dan pasukanku bertambah tanpa batas!” — Sung Jin-woo",
    artTheme: "domain_expansion"
  },
  limitless_blue: {
    animeName: "Technique Blue: Lapse (術式順転・蒼)",
    animeOrigin: "Jujutsu Kaisen",
    animeQuote: "“Gaya tarik magnetis kehampaan yang membelokkan ruang dan meremukkan pertahanan.” — Satoru Gojo",
    artTheme: "hollow_purple"
  },
  limitless_red: {
    animeName: "Technique Red: Reversal (術式反転・赫)",
    animeOrigin: "Jujutsu Kaisen",
    animeQuote: "“Gaya tolak divergen yang meledakkan apapun di hadapannya menjadi debu!” — Satoru Gojo",
    artTheme: "sun_breathing"
  },
  hollow_purple_mini: {
    animeName: "Hollow Technique: Purple (虚式・茈)",
    animeOrigin: "Jujutsu Kaisen",
    animeQuote: "“Massa imajiner yang menghapus keberadaan materi dari lembar realitas!” — Satoru Gojo",
    artTheme: "hollow_purple"
  },
  six_eyes_focus: {
    animeName: "Six Eyes Analysis (六眼・精密掌握)",
    animeOrigin: "Jujutsu Kaisen",
    animeQuote: "“Membaca aliran cursed energy hingga ke partikel terkecil di alam semesta.” — Satoru Gojo",
    artTheme: "chidori_spark"
  },
  infinity_ward: {
    animeName: "Limitless: Infinity (無下限の術式)",
    animeOrigin: "Jujutsu Kaisen",
    animeQuote: "“Makin dekat seranganmu, makin lambat hingga kau takkan pernah menyentuhku.” — Satoru Gojo",
    artTheme: "dead_calm"
  },

  // --- CORE & IRONCLAD (Jujutsu Kaisen, Bleach, Demon Slayer, Fate, Dragon Ball) ---
  strike: {
    animeName: "Dismantle (解 • Kai)",
    animeOrigin: "Jujutsu Kaisen",
    animeQuote: "“Menyesuaikan dengan kepadatan kutukan lawan... Segalanya terbelah dalam sekejap.” — Ryomen Sukuna",
    artTheme: "sukuna_cleave"
  },
  defend: {
    animeName: "Dead Calm (凪 • Nagi)",
    animeOrigin: "Demon Slayer",
    animeQuote: "“Bentuk Kesebelas: Ketenangan Mutlak. Tak ada tebasan yang mampu menembus riak air ini.” — Giyu Tomioka",
    artTheme: "dead_calm"
  },
  bash: {
    animeName: "Black Flash (黒閃 • Kokusen)",
    animeOrigin: "Jujutsu Kaisen",
    animeQuote: "“Distorsi ruang dalam 0.000001 detik. Percikan kilat hitam meluluhlantakkan zirah terkeras!” — Yuji Itadori",
    artTheme: "black_flash"
  },
  cleave: {
    animeName: "Hinokami: Enbu (円舞 • Flame Dance)",
    animeOrigin: "Demon Slayer",
    animeQuote: "“Napas Matahari... Kobaran api membara membakar seluruh musuh tanpa sisa!” — Tanjiro Kamado",
    artTheme: "sun_breathing"
  },
  iron_wave: {
    animeName: "Blood Iron Wave (鉄血破)",
    animeOrigin: "Berserk",
    animeQuote: "“Ayunkan pedang raksasa ini bersamaan dengan perisai baja yang menolak maut.” — Guts",
    artTheme: "sword_slash"
  },
  pommel_strike: {
    animeName: "Goryusen Hilt Strike (五龍閃)",
    animeOrigin: "Rurouni Kenshin",
    animeQuote: "“Hantaman gagang pedang secepat kilat yang meremukkan nafas lawan.” — Kenshin Himura",
    artTheme: "sword_slash"
  },
  twin_strike: {
    animeName: "Starburst Stream (スターバースト・ストリーム)",
    animeOrigin: "Sword Art Online",
    animeQuote: "“Dua pedang bergerak melampaui batas kecepatan sistem. Tebasan ganda tak terhentikan!” — Kirito",
    artTheme: "sword_slash"
  },
  heavy_blade: {
    animeName: "Getsuga Tensho (月牙天衝)",
    animeOrigin: "Bleach",
    animeQuote: "“Tekanan spiritual terkonsentrasi di ujung bilah pedang. Tebaskan kehancuran yang menembus langit!” — Ichigo Kurosaki",
    artTheme: "getsuga_tensho"
  },
  body_slam: {
    animeName: "Titan Charge (鎧の巨人・突進)",
    animeOrigin: "Attack on Titan",
    animeQuote: "“Seluruh lapisan perisai baja ditabrakkan dengan massa raksasa tak tergoyahkan!” — Reiner Braun",
    artTheme: "susanoo_ribs"
  },
  clash: {
    animeName: "Blade Symphony (千の剣)",
    animeOrigin: "Fate/stay night",
    animeQuote: "“Hanya bagi mereka yang bertarung murni dengan pedang terhunus. Hancurkan lawanmu!” — Archer",
    artTheme: "unlimited_blades"
  },
  clothesline: {
    animeName: "Lightning Lariat (雷我爆弾)",
    animeOrigin: "Naruto Shippuden",
    animeQuote: "“Hantaman lengan berbungkus petir yang melemahkan seluruh otot dan saraf musuh!” — Raikage A",
    artTheme: "chidori_spark"
  },
  headbutt: {
    animeName: "Tanjiro Headbutt (岩の頭突き)",
    animeOrigin: "Demon Slayer",
    animeQuote: "“Dahi sekeras batu karang gunung! Mengembalikan kartu takdir ke puncak dek.” — Tanjiro Kamado",
    artTheme: "black_flash"
  },
  thunderclap: {
    animeName: "Thunderclap & Flash (霹靂一閃)",
    animeOrigin: "Demon Slayer",
    animeQuote: "“Satu bentuk jurus yang dilatih sampai mencapai taraf dewa petir!” — Zenitsu Agatsuma",
    artTheme: "chidori_spark"
  },
  shrug_it_off: {
    animeName: "Tekkai: Iron Mass (鉄塊)",
    animeOrigin: "One Piece",
    animeQuote: "“Mengeraskan tubuh laksana besi tempa. Serangan musuh memantul tanpa arti.” — Rob Lucci",
    artTheme: "shield_barrier"
  },
  armaments: {
    animeName: "Projection: Kanshou & Bakuya (干将・莫耶)",
    animeOrigin: "Fate/stay night",
    animeQuote: "“Struktur dasar dianalisis, bahan diperkuat, pedang ditingkatkan ke wujud puncaknya.” — Shirou Emiya",
    artTheme: "unlimited_blades"
  },
  carnage: {
    animeName: "Berserk Frenzy (狂戦士の甲冑)",
    animeOrigin: "Berserk",
    animeQuote: "“Zirah berserk menelan rasa sakit dan mengubah darah menjadi tebasan brutal!” — Guts",
    artTheme: "sukuna_cleave"
  },
  uppercut: {
    animeName: "Dragon Fist (龍拳 • Ryuken)",
    animeOrigin: "Dragon Ball Z",
    animeQuote: "“Naga emas meledak dari pukulan ke atas, meremukkan perisai dan melemahkan lawan!” — Son Goku",
    artTheme: "dragon_strike"
  },
  whirlwind: {
    animeName: "Sanzen Sekai (三千世界 • Three Thousand Worlds)",
    animeOrigin: "One Piece",
    animeQuote: "“Di sembilan gunung dan delapan lautan, tak ada satu pun yang tak dapat kutebas!” — Roronoa Zoro",
    artTheme: "whirlwind"
  },
  flame_barrier: {
    animeName: "Flame Domain: Purgatory (煉獄 • Rengoku)",
    animeOrigin: "Demon Slayer",
    animeQuote: "“Bakar hatimu! Dinding api membara membalas setiap tebasan yang menyentuhnya!” — Kyojuro Rengoku",
    artTheme: "sun_breathing"
  },
  shockwave: {
    animeName: "Shinra Tensei (神羅天征 • Almighty Push)",
    animeOrigin: "Naruto Shippuden",
    animeQuote: "“Rasakan kepedihan dunia. Gelombang gravitasi mutlak yang membuat semua musuh rentan dan lemah!” — Pain",
    artTheme: "black_flash"
  },
  battle_trance: {
    animeName: "Ultra Instinct: Omen (身勝手の極意)",
    animeOrigin: "Dragon Ball Super",
    animeQuote: "“Pikiran tenang, tubuh bergerak sendiri melampaui kehendak sadar untuk menarik kartu takdir.” — Son Goku",
    artTheme: "kaio_ken"
  },
  disarm: {
    animeName: "Chain Jail (束縛する中指の鎖)",
    animeOrigin: "Hunter x Hunter",
    animeQuote: "“Rantai sumpah yang mengunci kekuatan fisik dan melucuti senjata lawan secara paksa.” — Kurapika",
    artTheme: "shadow_arise"
  },
  entrench: {
    animeName: "Susanoo: Complete Armor (完成体・須佐能乎)",
    animeOrigin: "Naruto Shippuden",
    animeQuote: "“Lipat gandakan perlindungan dewa perang! Tiada serangan yang mampu menggoyahkan benteng ini.” — Madara Uchiha",
    artTheme: "susanoo_ribs"
  },
  demon_form: {
    animeName: "Domain Expansion: Malevolent Shrine (伏魔御廚子)",
    animeOrigin: "Jujutsu Kaisen",
    animeQuote: "“Rentangkan domain tanpa penghalang. Tiada tempat bersembunyi dari pembantaian abadi!” — Ryomen Sukuna",
    artTheme: "domain_expansion"
  },
  barricade: {
    animeName: "Rho Aias (ロー・アイアス • Seven Rings)",
    animeOrigin: "Fate/stay night",
    animeQuote: "“Tujuh kelopak perisai konseptual yang menangkis tombak takdir dan kutukan maut selamanya.” — Archer",
    artTheme: "shield_barrier"
  },
  bludgeon: {
    animeName: "United States of Smash (スマッシュ)",
    animeOrigin: "My Hero Academia",
    animeQuote: "“Keluarkan setiap tetes tenaga yang tersisa di jiwamu! FAREWELL, SYMBOL OF PEACE!” — All Might",
    artTheme: "black_flash"
  },
  feed: {
    animeName: "Shadow Extraction: ARISE (起きろ)",
    animeOrigin: "Solo Leveling",
    animeQuote: "“Kematianmu hanyalah awal. Bangkitlah dari kegelapan dan jadilah kekuatanku selamanya!” — Sung Jin-woo",
    artTheme: "shadow_arise"
  },
  limit_break: {
    animeName: "Kaio-ken x20 (界王拳)",
    animeOrigin: "Dragon Ball Z",
    animeQuote: "“Meski otot dan nadiku terkoyak, kekuatanku melesat menembus batas dewata!” — Son Goku",
    artTheme: "kaio_ken"
  },
  impervious: {
    animeName: "Susanoo: Absolute Shield (絶対防御)",
    animeOrigin: "Naruto Shippuden",
    animeQuote: "“Perisai tulang chakra raksasa yang menolak seluruh kerusakan fisik di giliran ini.” — Itachi Uchiha",
    artTheme: "susanoo_ribs"
  },
  reaper: {
    animeName: "Bankai: Minazuki (皆尽 • All Things' End)",
    animeOrigin: "Bleach",
    animeQuote: "“Darah yang mengalir di medan perang dicairkan dan memulihkan kembali tubuh sang pendekar pedang.” — Retsu Unohana",
    artTheme: "getsuga_tensho"
  },

  // --- THE SILENT (Solo Leveling, Naruto, Demon Slayer, Hunter x Hunter) ---
  neutralize: {
    animeName: "Gentle Fist: Tenketsu Strike (八卦・空掌)",
    animeOrigin: "Naruto Shippuden",
    animeQuote: "“Tusukan jarum cakra yang mengunci titik aliran energi musuh dalam satu sentuhan.” — Neji Hyuga",
    artTheme: "chidori_spark"
  },
  survivor: {
    animeName: "Substitution Jutsu (変わり身の術)",
    animeOrigin: "Naruto",
    animeQuote: "“Bayangan menipu penglihatan musuh. Saat bilah mereka menusuk, yang tertinggal hanyalah kayu lapuk.” — Kakashi Hatake",
    artTheme: "shadow_arise"
  },
  backstab: {
    animeName: "Dagger Rush: Mutilation (短剣術)",
    animeOrigin: "Solo Leveling",
    animeQuote: "“Menyelinap di balik punggung tanpa suara. Dua belati bayangan merobek titik vital seketika!” — Sung Jin-woo",
    artTheme: "sukuna_cleave"
  },
  dagger_spray: {
    animeName: "Gate of Babylon: Dagger Rain (王の財宝)",
    animeOrigin: "Fate/Zero",
    animeQuote: "“Buka gerbang perbendaharaan emas! Hujan belati menembus seluruh musuh sekaligus!” — Gilgamesh",
    artTheme: "unlimited_blades"
  },
  poisoned_stab: {
    animeName: "Dance of the Bee Sting: True Flutter (蜂牙ノ舞)",
    animeOrigin: "Demon Slayer",
    animeQuote: "“Ujung pedang tipis menyuntikkan racun bunga wisteria mematikan ke dalam pembuluh darah musuh.” — Shinobu Kocho",
    artTheme: "alchemist_flask"
  },
  noxious_fumes: {
    animeName: "Hydra: Poison Dragon Mist (毒竜)",
    animeOrigin: "One Piece",
    animeQuote: "“Kabut racun korosif yang merayap di setiap tarikan nafas lawan di awal setiap putaran.” — Magellan",
    artTheme: "alchemist_flask"
  },
  corpse_explosion: {
    animeName: "C4 Karura: Ultimate Art (芸術は爆発だ)",
    animeOrigin: "Naruto Shippuden",
    animeQuote: "“Ledakan mikroskopis yang meremukkan tubuh musuh dan menyapu kawan-kawannya. KATSU!” — Deidara",
    artTheme: "black_flash"
  },
  catalyst: {
    animeName: "Nen Multiplication: Chain Chemical (倍加)",
    animeOrigin: "Hunter x Hunter",
    animeQuote: "“Lipat gandakan efek racun di tubuh musuh hingga dua kali lipat dalam hitungan detik!” — Killua Zoldyck",
    artTheme: "alchemist_flask"
  },
  nightmare: {
    animeName: "Infinite Tsukuyomi (無限月読)",
    animeOrigin: "Naruto Shippuden",
    animeQuote: "“Gantungkan musuh dalam ilusi mimpi abadi dan duplikasi kartu terbaikmu untuk putaran berikutnya.” — Madara Uchiha",
    artTheme: "domain_expansion"
  },
  wraith_form: {
    animeName: "Kamui: Intangibility (神威)",
    animeOrigin: "Naruto Shippuden",
    animeQuote: "“Memindahkan sebagian tubuh ke dimensi lain. Seluruh serangan musuh menembus tubuhmu tanpa jejak!” — Obito Uchiha",
    artTheme: "shadow_arise"
  },

  // --- THE DEFECT (Jujutsu Kaisen, Toaru Railgun, Bleach, Dragon Ball) ---
  zap: {
    animeName: "Chidori: One Thousand Birds (千鳥)",
    animeOrigin: "Naruto",
    animeQuote: "“Kilatan listrik berkicau bagai seribu burung. Bangkitkan Lightning Orb seketika!” — Sasuke Uchiha",
    artTheme: "chidori_spark"
  },
  dualcast: {
    animeName: "Hollow Purple (虚式 • 茈)",
    animeOrigin: "Jujutsu Kaisen",
    animeQuote: "“Kekuatan tolakan biru dan tarikan merah bertabrakan... Melahirkan massa imajiner yang melenyapkan materi!” — Satoru Gojo",
    artTheme: "hollow_purple"
  },
  ball_lightning: {
    animeName: "Kirin: Thunder Dragon (麒麟)",
    animeOrigin: "Naruto Shippuden",
    animeQuote: "“Naga petir alam yang menyambar dengan kecepatan cahaya, membakar musuh dan memanggil orb listrik!” — Sasuke Uchiha",
    artTheme: "chidori_spark"
  },
  electrodynamics: {
    animeName: "Super Electromagnetic Railgun (超電磁砲)",
    animeOrigin: "A Certain Scientific Railgun",
    animeQuote: "“Tembakan koin berkecepatan 3 Mach yang menghantarkan sengatan petir ke seluruh musuh di arena!” — Mikoto Misaka",
    artTheme: "chidori_spark"
  },
  glacier: {
    animeName: "Daiguren Hyorinmaru (大紅蓮氷輪丸)",
    animeOrigin: "Bleach",
    animeQuote: "“Naga es raksasa yang membekukan atmosfer dan membentuk perisai gletser kokoh.” — Toshiro Hitsugaya",
    artTheme: "dead_calm"
  },
  biased_cognition: {
    animeName: "Geass: Absolute Command (絶対遵守のギアス)",
    animeOrigin: "Code Geass",
    animeQuote: "“Tingkatkan kapasitas fokus otak ke tingkat dewa, meski harus membayar harga mahal di akhir pertarungan.” — Lelouch vi Britannia",
    artTheme: "domain_expansion"
  },
  echo_form: {
    animeName: "Multi Shadow Clone (多重影分身の術)",
    animeOrigin: "Naruto",
    animeQuote: "“Setiap jurus yang kau lepaskan pertama kali akan diduplikasi secara identik oleh bayanganmu!” — Naruto Uzumaki",
    artTheme: "shadow_arise"
  },
  rainbow: {
    animeName: "Final Flash (ファイナルフラッシュ)",
    animeOrigin: "Dragon Ball Z",
    animeQuote: "“Pusatkan seluruh jenis energi alam dan lepaskan berkas cahaya pelangi penghancur!” — Vegeta",
    artTheme: "hollow_purple"
  },

  // --- THE WATCHER (Fate, Hunter x Hunter, Dragon Ball, One Piece) ---
  eruption: {
    animeName: "Dragon Dive (竜星群 • Dragon Dive)",
    animeOrigin: "Hunter x Hunter",
    animeQuote: "“Ledakan amarah tak terbendung! Masuki Wrath Stance dan lipat gandakan daya serangmu!” — Zeno Zoldyck",
    artTheme: "dragon_strike"
  },
  vigilance: {
    animeName: "Calm Mind: Katakuri Foresight (見聞色・未来視)",
    animeOrigin: "One Piece",
    animeQuote: "“Hati yang hening membuka penglihatan masa depan. Dapatkan perlindungan dan masuki Calm Stance.” — Katakuri",
    artTheme: "dead_calm"
  },
  ragnarok: {
    animeName: "Unlimited Blade Works (無限の剣製)",
    animeOrigin: "Fate/stay night",
    animeQuote: "“I am the bone of my sword... Langit terracotta menurunkan hujan ribuan pedang baja!” — Shirou Emiya",
    artTheme: "unlimited_blades"
  },
  blasphemy: {
    animeName: "Night Guy: Eighth Gate (夜ガイ・死門)",
    animeOrigin: "Naruto Shippuden",
    animeQuote: "“Naga merah menyala memutar ruang! Kemenangan mutlak atau kematian terhormat di akhir putaran!” — Might Guy",
    artTheme: "dragon_strike"
  },
  vault: {
    animeName: "The World: Time Stop (ザ・ワールド • 時よ止まれ)",
    animeOrigin: "JoJo's Bizarre Adventure",
    animeQuote: "“Waktu dunia terhenti seketika! Lewati giliran musuh dan mulailah giliranmu kembali!” — DIO",
    artTheme: "time_chronos"
  },
  alpha: {
    animeName: "Maximum: Uzumaki (極ノ番・うずまき)",
    animeOrigin: "Jujutsu Kaisen",
    animeQuote: "“Mengembunkan ribuan roh kutukan menjadi satu benih kehancuran absolut.” — Suguru Geto",
    artTheme: "hollow_purple"
  },
  omega: {
    animeName: "Super Spirit Bomb (超元気玉 • Genki Dama)",
    animeOrigin: "Dragon Ball Z",
    animeQuote: "“Seluruh energi kehidupan alam semesta dihimpun menjadi satu bola raksasa pemusnah kegelapan!” — Son Goku",
    artTheme: "hollow_purple"
  },

  // --- 6 HERO BARU & EXTENDED ARTIFACTS ---
  soul_strike: {
    animeName: "Soul Cutter: Zangetsu (斬月)",
    animeOrigin: "Bleach",
    animeQuote: "“Tebasan pemotong rantai jiwa yang menyerap energi arwah lawan.” — Ichigo Kurosaki",
    artTheme: "getsuga_tensho"
  },
  rewind: {
    animeName: "Bites the Dust: Rewind (負けて死ね)",
    animeOrigin: "JoJo's Bizarre Adventure",
    animeQuote: "“Waktu berputar mundur ke masa di mana takdir kemenangan masih bisa diraih.” — Yoshikage Kira",
    artTheme: "time_chronos"
  },
  holy_strike: {
    animeName: "Excalibur: Sword of Promised Victory (約束された勝利の剣)",
    animeOrigin: "Fate/stay night",
    animeQuote: "“Berkas cahaya suci yang mengumpulkan harapan umat manusia menembus benteng iblis!” — Saber / Artoria",
    artTheme: "excalibur_holy"
  },
  bloodlash: {
    animeName: "Blood Manipulation: Piercing Blood (穿血)",
    animeOrigin: "Jujutsu Kaisen",
    animeQuote: "“Darah bertekanan tinggi ditembakkan bagai peluru sonik yang menembus pertahanan lawan.” — Choso",
    artTheme: "sukuna_cleave"
  },
  acid_flask: {
    animeName: "Transmutation: Corrosive Acid (錬金術)",
    animeOrigin: "Fullmetal Alchemist",
    animeQuote: "“Memecah ikatan atomik logam menjadi asam korosif yang melarutkan zirah musuh.” — Edward Elric",
    artTheme: "alchemist_flask"
  },
  bandage_up: {
    animeName: "Creation Rebirth: Mitotic Regeneration (創造再生)",
    animeOrigin: "Naruto Shippuden",
    animeQuote: "“Sel-sel tubuh membelah secara instan, menyembuhkan luka fatal dalam hitungan detik.” — Tsunade Senju",
    artTheme: "dead_calm"
  }
};

// SVG Vector Art Generator (High-End Anime Visuals)
function getAnimeCardSvg(card) {
  const theme = card.artTheme || (ANIME_CARD_DATA[card.defId] ? ANIME_CARD_DATA[card.defId].artTheme : null);
  const type = card.type;
  
  if (theme === 'sukuna_cleave') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><linearGradient id="sc_g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff1a1a"/><stop offset="50%" stop-color="#ff0055"/><stop offset="100%" stop-color="#2a000d"/></linearGradient><filter id="sc_glo"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#08040d"/><circle cx="80" cy="43" r="38" fill="#1c030c" opacity="0.9"/><path d="M12 78 L148 8" stroke="url(#sc_g1)" stroke-width="5" stroke-linecap="round" filter="url(#sc_glo)"/><path d="M12 78 L148 8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M38 10 L122 76" stroke="url(#sc_g1)" stroke-width="3.5" stroke-linecap="round" filter="url(#sc_glo)"/><path d="M5 45 L155 40" stroke="#ff2a5f" stroke-width="1.5" stroke-dasharray="6 3"/><circle cx="95" cy="30" r="2.5" fill="#ffd43b"/><circle cx="65" cy="55" r="2" fill="#ff6b6b"/><circle cx="120" cy="20" r="1.5" fill="#fff"/></svg>`;
  }
  if (theme === 'dead_calm') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><linearGradient id="dc_w" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#00f2fe"/><stop offset="100%" stop-color="#4facfe"/></linearGradient><filter id="dc_glo"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#030c18"/><ellipse cx="80" cy="48" rx="65" ry="24" fill="none" stroke="url(#dc_w)" stroke-width="2" opacity="0.85" filter="url(#dc_glo)"/><ellipse cx="80" cy="48" rx="42" ry="15" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.9"/><ellipse cx="80" cy="48" rx="18" ry="7" fill="none" stroke="#00f2fe" stroke-width="1"/><path d="M72 18 C76 10, 84 10, 88 18 C90 22, 80 32, 80 32 C80 32, 70 22, 72 18 Z" fill="#00f2fe" filter="url(#dc_glo)"/><circle cx="80" cy="48" r="3" fill="#fff"/></svg>`;
  }
  if (theme === 'black_flash') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="bf_glo"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#020004"/><circle cx="80" cy="43" r="28" fill="#180006"/><path d="M80 43 L95 12 L82 32 L135 18 L88 45 L140 70 L80 50 L95 82 L72 52 L35 78 L65 42 L18 35 L70 38 Z" fill="#e03131" filter="url(#bf_glo)"/><path d="M80 43 L95 12 L82 32 L135 18 L88 45 L140 70 L80 50 L95 82 L72 52 L35 78 L65 42 L18 35 L70 38 Z" fill="#fff" stroke="#ff0044" stroke-width="1.2"/><circle cx="80" cy="43" r="6" fill="#000" stroke="#ff0044" stroke-width="2"/></svg>`;
  }
  if (theme === 'sun_breathing') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><radialGradient id="sb_sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff"/><stop offset="35%" stop-color="#ffd43b"/><stop offset="70%" stop-color="#ff6b6b"/><stop offset="100%" stop-color="#c92a2a"/></radialGradient><filter id="sb_glo"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#140402"/><circle cx="80" cy="43" r="26" fill="url(#sb_sun)" filter="url(#sb_glo)"/><path d="M20 72 Q 80 5 140 72 Q 80 32 20 72 Z" fill="#ffa94d" opacity="0.85" filter="url(#sb_glo)"/><path d="M35 66 Q 80 18 125 66 Q 80 40 35 66 Z" fill="#fff" opacity="0.95"/><circle cx="50" cy="30" r="2.5" fill="#ffd43b"/><circle cx="110" cy="25" r="2" fill="#ffd43b"/></svg>`;
  }
  if (theme === 'hollow_purple') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><radialGradient id="hp_core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#e599f7"/><stop offset="65%" stop-color="#845ef7"/><stop offset="100%" stop-color="#1e0c40"/></radialGradient><filter id="hp_glo"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#04010a"/><circle cx="80" cy="43" r="26" fill="url(#hp_core)" filter="url(#hp_glo)"/><ellipse cx="80" cy="43" rx="44" ry="16" fill="none" stroke="#ff0077" stroke-width="2.2" transform="rotate(-25 80 43)" opacity="0.9"/><ellipse cx="80" cy="43" rx="44" ry="16" fill="none" stroke="#00e5ff" stroke-width="2.2" transform="rotate(35 80 43)" opacity="0.9"/><circle cx="80" cy="43" r="8" fill="#fff" filter="url(#hp_glo)"/></svg>`;
  }
  if (theme === 'getsuga_tensho') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><linearGradient id="gt_rei" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff0055"/><stop offset="50%" stop-color="#050505"/><stop offset="100%" stop-color="#ff0033"/></linearGradient><filter id="gt_glo"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#080205"/><path d="M15 75 Q 80 10 145 25 Q 75 35 15 75 Z" fill="#000" stroke="#ff0044" stroke-width="3" filter="url(#gt_glo)"/><path d="M22 68 Q 78 20 135 30 Q 75 40 22 68 Z" fill="#ff0055" opacity="0.8"/><circle cx="95" cy="28" r="2.5" fill="#fff"/></svg>`;
  }
  if (theme === 'shadow_arise') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><linearGradient id="sa_g" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0b0318"/><stop offset="100%" stop-color="#5f3dc4"/></linearGradient><filter id="sa_glo"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#06020c"/><path d="M20 86 Q 40 40 60 70 Q 80 20 100 65 Q 120 30 140 86 Z" fill="url(#sa_g)"/><path d="M68 45 L78 45" stroke="#00f0ff" stroke-width="3.5" stroke-linecap="round" filter="url(#sa_glo)"/><path d="M86 45 L96 45" stroke="#00f0ff" stroke-width="3.5" stroke-linecap="round" filter="url(#sa_glo)"/><circle cx="73" cy="45" r="1.5" fill="#fff"/><circle cx="91" cy="45" r="1.5" fill="#fff"/><path d="M50 78 L80 18 L110 78" stroke="#7950f2" stroke-width="2" fill="none" opacity="0.7"/></svg>`;
  }
  if (theme === 'chidori_spark') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="ch_glo"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#020814"/><circle cx="80" cy="43" r="20" fill="#1864ab" opacity="0.6"/><path d="M80 43 L60 15 L72 32 L35 25 L65 43 L20 58 L68 52 L55 78 L80 55 L105 82 L90 52 L140 60 L95 43 L130 25 L92 32 L110 12 Z" fill="#00e5ff" filter="url(#ch_glo)"/><path d="M80 43 L60 15 L72 32 L35 25 L65 43 L20 58 L68 52 L55 78 L80 55 L105 82 L90 52 L140 60 L95 43 L130 25 L92 32 L110 12 Z" fill="#fff" stroke="#38d9a9" stroke-width="1"/><circle cx="80" cy="43" r="7" fill="#fff" filter="url(#ch_glo)"/></svg>`;
  }
  if (theme === 'susanoo_ribs' || theme === 'shield_barrier') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="su_glo"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#0d0414"/><path d="M80 12 C45 12 35 45 35 72 L125 72 C125 45 115 12 80 12 Z" fill="none" stroke="#f06595" stroke-width="3.5" filter="url(#su_glo)"/><path d="M45 32 C65 24 95 24 115 32" stroke="#ff8787" stroke-width="2.5" fill="none"/><path d="M40 50 C65 40 95 40 120 50" stroke="#ff8787" stroke-width="2.5" fill="none"/><path d="M80 12 L80 72" stroke="#fff" stroke-width="2"/></svg>`;
  }
  if (theme === 'unlimited_blades') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><linearGradient id="ubw_sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#4a1805"/><stop offset="100%" stop-color="#9a3412"/></linearGradient></defs><rect width="160" height="86" fill="url(#ubw_sky)"/><circle cx="125" cy="22" r="18" fill="none" stroke="#78350f" stroke-width="3" stroke-dasharray="4 3"/><path d="M0 65 Q 80 50 160 65 L160 86 L0 86 Z" fill="#291205"/><line x1="45" y1="35" x2="45" y2="72" stroke="#fff" stroke-width="3"/><line x1="38" y1="42" x2="52" y2="42" stroke="#ffd43b" stroke-width="2.5"/><line x1="85" y1="20" x2="85" y2="68" stroke="#fff" stroke-width="3"/><line x1="77" y1="28" x2="93" y2="28" stroke="#ffd43b" stroke-width="2.5"/><line x1="125" y1="38" x2="125" y2="74" stroke="#fff" stroke-width="3"/><line x1="118" y1="45" x2="132" y2="45" stroke="#ffd43b" stroke-width="2.5"/></svg>`;
  }
  if (theme === 'kaio_ken') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="kk_glo"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#120101"/><circle cx="80" cy="43" r="28" fill="#e03131" filter="url(#kk_glo)"/><path d="M40 82 Q 60 20 80 10 Q 100 20 120 82 Z" fill="#ff6b6b" opacity="0.8" filter="url(#kk_glo)"/><path d="M60 82 Q 70 35 80 22 Q 90 35 100 82 Z" fill="#fff" opacity="0.9"/><circle cx="80" cy="50" r="12" fill="#ffd43b"/></svg>`;
  }
  if (theme === 'excalibur_holy') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="ex_glo"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#080e18"/><path d="M80 5 L85 68 L80 75 L75 68 Z" fill="#fff" filter="url(#ex_glo)"/><line x1="60" y1="62" x2="100" y2="62" stroke="#ffd43b" stroke-width="4"/><line x1="80" y1="62" x2="80" y2="82" stroke="#fab005" stroke-width="4"/><circle cx="80" cy="62" r="3" fill="#22b8cf"/><circle cx="80" cy="35" r="25" fill="none" stroke="#ffd43b" stroke-width="1.5" stroke-dasharray="6 3"/><circle cx="80" cy="35" r="35" fill="none" stroke="#ffe066" stroke-width="1" opacity="0.6"/></svg>`;
  }
  if (theme === 'domain_expansion') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="de_glo"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#04020a"/><circle cx="80" cy="43" r="34" fill="#15051e" stroke="#7950f2" stroke-width="2.5" filter="url(#de_glo)"/><circle cx="80" cy="43" r="24" fill="none" stroke="#e64980" stroke-width="1.5" stroke-dasharray="8 4"/><circle cx="80" cy="43" r="14" fill="#000" stroke="#ffd43b" stroke-width="2"/><circle cx="80" cy="43" r="5" fill="#ff0055"/></svg>`;
  }
  if (theme === 'alchemist_flask') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="al_glo"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#05140b"/><polygon points="80,12 110,65 50,65" fill="none" stroke="#51cf66" stroke-width="2" filter="url(#al_glo)"/><circle cx="80" cy="43" r="18" fill="#082b17" stroke="#20c997" stroke-width="1.5"/><path d="M74 24 L86 24 L86 34 L96 56 C98 62 90 66 80 66 C70 66 62 62 64 56 L74 34 Z" fill="#51cf66" opacity="0.85" filter="url(#al_glo)"/><circle cx="80" cy="54" r="3" fill="#fff"/><circle cx="74" cy="48" r="2" fill="#ffd43b"/></svg>`;
  }
  if (theme === 'time_chronos') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="tc_glo"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#080816"/><circle cx="80" cy="43" r="32" fill="#10142a" stroke="#ffd43b" stroke-width="2.5" filter="url(#tc_glo)"/><circle cx="80" cy="43" r="26" fill="none" stroke="#74c0fc" stroke-width="1.2" stroke-dasharray="4 2"/><line x1="80" y1="43" x2="80" y2="22" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="80" y1="43" x2="98" y2="43" stroke="#ffd43b" stroke-width="2" stroke-linecap="round"/><circle cx="80" cy="43" r="3.5" fill="#ffd43b"/></svg>`;
  }
  if (theme === 'dragon_strike') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="dr_glo"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#140602"/><path d="M20 75 Q 50 15 80 40 Q 110 65 140 15" fill="none" stroke="#ffa94d" stroke-width="5" stroke-linecap="round" filter="url(#dr_glo)"/><path d="M20 75 Q 50 15 80 40 Q 110 65 140 15" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><polygon points="140,15 125,18 135,28" fill="#ff6b6b"/><circle cx="132" cy="18" r="2" fill="#ffd43b"/></svg>`;
  }

  // Fallbacks by Card Type
  if (type === 'ATTACK') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="atk_glo"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#140507"/><path d="M25 68 L135 18" stroke="#ff6b6b" stroke-width="4.5" stroke-linecap="round" filter="url(#atk_glo)"/><path d="M25 68 L135 18" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="80" cy="43" r="22" fill="none" stroke="#e03131" stroke-width="1.5" stroke-dasharray="6 3"/></svg>`;
  }
  if (type === 'SKILL') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="skl_glo"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#040c18"/><polygon points="80,14 125,32 125,62 80,78 35,62 35,32" fill="#0a2540" stroke="#339af0" stroke-width="2.5" filter="url(#skl_glo)"/><circle cx="80" cy="45" r="10" fill="#fff" opacity="0.85"/></svg>`;
  }
  if (type === 'POWER') {
    return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="pwr_glo"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#140e02"/><circle cx="80" cy="43" r="26" fill="#2d1c04" stroke="#ffd43b" stroke-width="2.5" filter="url(#pwr_glo)"/><polygon points="80,20 86,37 103,43 86,49 80,66 74,49 57,43 74,37" fill="#fff" filter="url(#pwr_glo)"/></svg>`;
  }
  return `<svg viewBox="0 0 160 86" class="anime-art-svg"><defs><filter id="crs_glo"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="160" height="86" fill="#0c0712"/><circle cx="80" cy="43" r="24" fill="#211226" stroke="#be4bdb" stroke-width="2" filter="url(#crs_glo)"/><path d="M68 35 L92 51 M92 35 L68 51" stroke="#ff6b6b" stroke-width="3" stroke-linecap="round"/></svg>`;
}

class Card {
  constructor(cardDef, isUpgraded = false) {
    this.uid = 'card_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    this.defId = cardDef.id;
    this.baseDef = cardDef;
    this.name = isUpgraded ? (cardDef.name + '+') : cardDef.name;
    this.cost = (isUpgraded && cardDef.upgradedCost !== undefined) ? cardDef.upgradedCost : cardDef.cost;
    this.type = cardDef.type;
    this.rarity = cardDef.rarity;
    this.target = (isUpgraded && cardDef.upgradedTarget !== undefined) ? cardDef.upgradedTarget : cardDef.target;
    this.damage = (isUpgraded && cardDef.upgradedDamage !== undefined) ? cardDef.upgradedDamage : (cardDef.damage !== undefined ? cardDef.damage : null);
    this.block = (isUpgraded && cardDef.upgradedBlock !== undefined) ? cardDef.upgradedBlock : (cardDef.block !== undefined ? cardDef.block : null);
    this.exhaust = cardDef.exhaust || false;
    this.ethereal = cardDef.ethereal || false;
    this.isUpgraded = isUpgraded;
    this.artIcon = cardDef.artIcon || '🃏';

    // Anime Metadata
    const animeEntry = ANIME_CARD_DATA[this.defId] || {};
    this.animeName = animeEntry.animeName || this.generateProceduralAnimeName();
    this.animeOrigin = animeEntry.animeOrigin || 'Shadowspire Chronicles';
    this.animeQuote = animeEntry.animeQuote || cardDef.lore || this.generateProceduralAnimeQuote();
    this.artTheme = animeEntry.artTheme || cardDef.artTheme || this.deduceArtTheme();
  }

  generateProceduralAnimeName() {
    const base = this.baseDef.name || 'Artsy Strike';
    if (this.type === 'ATTACK') return `${base} (斬撃)`;
    if (this.type === 'SKILL') return `${base} (奥義)`;
    if (this.type === 'POWER') return `${base} (領域)`;
    return base;
  }

  generateProceduralAnimeQuote() {
    if (this.baseDef.lore) return this.baseDef.lore;
    if (this.type === 'ATTACK') return "“Kekuatan mutlak ini akan membelah nasibmu di menara Shadowspire.”";
    if (this.type === 'SKILL') return "“Ketenangan batin adalah perisai paling kokoh dari serangan musuh.”";
    if (this.type === 'POWER') return "“Aura membara melingkupi jiwa, membangkitkan takdir sejati sang pendekar.”";
    return "“Kekuatan kuno yang tak terjelaskan merayap di dalam dekmu.”";
  }

  deduceArtTheme() {
    const text = (this.name + ' ' + (this.baseDef.description || '')).toLowerCase();
    if (text.includes('cleave') || text.includes('dismantle') || text.includes('slash') || text.includes('cut')) return 'sukuna_cleave';
    if (text.includes('fire') || text.includes('flame') || text.includes('burn')) return 'sun_breathing';
    if (text.includes('lightning') || text.includes('thunder') || text.includes('zap') || text.includes('spark')) return 'chidori_spark';
    if (text.includes('water') || text.includes('ice') || text.includes('calm') || text.includes('defend')) return 'dead_calm';
    if (text.includes('purple') || text.includes('void') || text.includes('dark')) return 'hollow_purple';
    if (text.includes('shadow') || text.includes('soul') || text.includes('arise')) return 'shadow_arise';
    if (text.includes('blade') || text.includes('sword')) return 'unlimited_blades';
    if (text.includes('time') || text.includes('clock') || text.includes('turn')) return 'time_chronos';
    if (text.includes('poison') || text.includes('acid') || text.includes('flask')) return 'alchemist_flask';
    if (text.includes('holy') || text.includes('divine') || text.includes('light')) return 'excalibur_holy';
    return this.type;
  }

  upgrade() {
    if (this.isUpgraded) return;
    this.isUpgraded = true;
    this.name = this.baseDef.name + '+';
    if (this.baseDef.upgradedCost !== undefined) this.cost = this.baseDef.upgradedCost;
    if (this.baseDef.upgradedTarget !== undefined) this.target = this.baseDef.upgradedTarget;
    if (this.baseDef.upgradedDamage !== undefined) this.damage = this.baseDef.upgradedDamage;
    if (this.baseDef.upgradedBlock !== undefined) this.block = this.baseDef.upgradedBlock;
  }

  getAnimeTitle() {
    return this.isUpgraded ? (this.animeName + '+') : this.animeName;
  }

  getStoryQuote() {
    return this.animeQuote || this.baseDef.lore || '';
  }

  getArtSvg() {
    return getAnimeCardSvg(this);
  }

  getDescription(combat = null) {
    let desc = this.isUpgraded ? (this.baseDef.upgradedDesc || this.baseDef.description) : this.baseDef.description;
    const baseDmg = this.isUpgraded ? (this.baseDef.upgradedDamage || this.damage) : this.damage;
    const baseBlk = this.isUpgraded ? (this.baseDef.upgradedBlock || this.block) : this.block;
    let effectiveDmg = baseDmg;
    let effectiveBlk = baseBlk;

    if (combat && combat.calcDamage && effectiveDmg !== null && effectiveDmg !== undefined) {
      effectiveDmg = combat.calcDamage(effectiveDmg);
    }
    if (combat && combat.calcBlock && effectiveBlk !== null && effectiveBlk !== undefined) {
      effectiveBlk = combat.calcBlock(effectiveBlk);
    }

    if (effectiveDmg !== null && effectiveDmg !== undefined) {
      let dmgClass = '';
      if (baseDmg !== null && effectiveDmg > baseDmg) dmgClass = 'stat-boosted';
      else if (baseDmg !== null && effectiveDmg < baseDmg) dmgClass = 'stat-reduced';
      desc = desc.replaceAll('!D!', `<strong class="${dmgClass}">${effectiveDmg}</strong>`);
    }
    if (effectiveBlk !== null && effectiveBlk !== undefined) {
      let blkClass = '';
      if (baseBlk !== null && effectiveBlk > baseBlk) blkClass = 'stat-boosted';
      else if (baseBlk !== null && effectiveBlk < baseBlk) blkClass = 'stat-reduced';
      desc = desc.replaceAll('!B!', `<strong class="${blkClass}">${effectiveBlk}</strong>`);
    }
    if (this.baseDef.vulnerable !== undefined) {
      const v = this.isUpgraded ? (this.baseDef.upgradedVulnerable || this.baseDef.vulnerable) : this.baseDef.vulnerable;
      desc = desc.replaceAll('!V!', `<strong>${v}</strong>`);
    }
    if (this.baseDef.weak !== undefined) {
      const w = this.isUpgraded ? (this.baseDef.upgradedWeak || this.baseDef.weak) : this.baseDef.weak;
      desc = desc.replaceAll('!W!', `<strong>${w}</strong>`);
    }

    // Safety cleanups for any remaining tokens
    desc = desc.replaceAll('!D!', `<strong class="stat-boosted">${this.damage || 6}</strong>`);
    desc = desc.replaceAll('!B!', `<strong class="stat-boosted">${this.block || 5}</strong>`);
    desc = desc.replaceAll('!V!', `<strong>2</strong>`);
    desc = desc.replaceAll('!W!', `<strong>2</strong>`);
    desc = desc.replaceAll('!M!', `<strong>1</strong>`);

    return desc;
  }

  getKeywords() {
    const text = ((this.name || '') + ' ' + (this.baseDef.description || '') + ' ' + (this.baseDef.upgradedDesc || '')).toLowerCase();
    const found = [];
    Object.keys(KEYWORD_GLOSSARY).forEach(k => {
      if (text.includes(k) || (k === 'exhaust' && this.exhaust) || (k === 'ethereal' && this.ethereal)) {
        found.push(KEYWORD_GLOSSARY[k]);
      }
    });
    return found;
  }

  renderHtml(combat = null) {
    const costText = this.cost === -1 ? 'X' : (this.cost === -2 ? '✕' : this.cost);
    const displayName = this.getAnimeTitle();
    const artSvg = this.getArtSvg();
    const descHtml = this.getDescription(combat);
    const storyQuote = this.getStoryQuote();
    const originBadge = this.animeOrigin ? `<span class="card-anime-badge">${this.animeOrigin}</span>` : '';

    let keywordsHtml = '';
    if (typeof this.getKeywords === 'function') {
      const kws = this.getKeywords();
      if (kws && kws.length > 0) {
        keywordsHtml = `
          <div class="card-keywords-sidebar">
            ${kws.map(k => `
              <div class="keyword-tooltip-pill" style="border-color: ${k.color};">
                <div class="keyword-header" style="color: ${k.color};">
                  <span>${k.icon}</span>
                  <span>${k.name}</span>
                </div>
                <div class="keyword-desc">${k.desc}</div>
              </div>
            `).join('')}
          </div>
        `;
      }
    }

    return `
      <div class="card-energy-crystal">${costText}</div>
      <div class="card-header-wrap">
        <div class="card-title-banner" title="${displayName}">${displayName}</div>
        ${originBadge}
      </div>
      <div class="card-art-frame">${artSvg}</div>
      <div class="card-type-tag">${this.type} • ${this.rarity}</div>
      <div class="card-description">${descHtml}</div>
      <div class="card-story-quote" title="${storyQuote}">
        <span class="quote-mark">“</span>${storyQuote}<span class="quote-mark">”</span>
      </div>
      <div class="card-rarity-gem"></div>
      ${keywordsHtml}
    `;
  }

  play(combat, target = null) {
    if (typeof this.baseDef.execute === 'function') {
      this.baseDef.execute.call(this, combat, target);
    }
  }

  clone() {
    return new Card(this.baseDef, this.isUpgraded);
  }
}

function getRandomCardReward(count = 3) {
  const pool = Object.values(CARD_DATABASE).filter(c => c.rarity !== CARD_RARITIES.BASIC && c.type !== CARD_TYPES.STATUS && c.type !== CARD_TYPES.CURSE);
  const results = [];
  for (let i = 0; i < count; i++) {
    const picked = pool[Math.floor(Math.random() * pool.length)];
    results.push(new Card(picked, false));
  }
  return results;
}

window.CARD_TYPES = CARD_TYPES;
window.CARD_RARITIES = CARD_RARITIES;
window.TARGET_TYPES = TARGET_TYPES;
window.CARD_DATABASE = CARD_DATABASE;
window.Card = Card;
window.getRandomCardReward = getRandomCardReward;
window.KEYWORD_GLOSSARY = KEYWORD_GLOSSARY;
