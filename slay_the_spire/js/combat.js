/**
 * ============================================================================
 * SLAY THE SPIRE - MASTER COMBAT ENGINE & STATE MACHINE (10-HERO PASSIVES)
 * ============================================================================
 * Mengelola alur giliran, kalkulasi damage/block yang akurat, sistem status
 * effects, pengundian dan pembuangan kartu, handling kartu X-Cost, Ethereal,
 * Exhaust, split mekanik monster, serta integrasi 10 karakter dengan 2 pasif unik.
 */

class CombatEngine {
  constructor() {
    this.isActive = false;
    this.turn = 0;
    this.isPlayerTurn = false;
    this.energy = 3;
    this.maxEnergy = 3;
    this.encounterType = 'NORMAL';
    this.enemies = [];
    this.drawPile = [];
    this.hand = [];
    this.discardPile = [];
    this.exhaustPile = [];
    this.selectedCard = null;

    // Counters untuk pasif karakter
    this.characterPassives = {
      cardsPlayedTotal: 0,
      attacksPlayedTotal: 0,
      firstAttackThisTurn: true,
      exhaustedThisTurn: false
    };

    // Status tempur pemain
    this.player = {
      block: 0,
      activeSkillCooldown: 0,
      status: {
        strength: 0,
        dexterity: 0,
        vulnerable: 0,
        weak: 0,
        frail: 0,
        metallicize: 0,
        demonForm: 0,
        barricade: 0,
        flameBarrier: 0,
        noDraw: false,
        doubleDamageNext: false,
        feelNoPain: 0,
        rupture: 0,
        lightningOrbs: 0,
        wrathStance: 0,
        calmStance: 0
      }
    };
  }

  addCombatLog(msg, type = 'info') {
    if (window.spireApp && typeof window.spireApp.addCombatLogEntry === 'function') {
      window.spireApp.addCombatLogEntry(msg, type);
    }
  }

  // Memulai pertarungan baru
  startCombat(encounterType, enemiesList) {
    this.isActive = true;
    this.encounterType = encounterType;
    this.enemies = enemiesList || [];
    this.turn = 0;
    this.maxEnergy = 3;
    this.energy = this.maxEnergy;

    const names = (this.enemies || []).map(e => e.name).join(', ');
    this.addCombatLog(`Pertempuran dimulai menghadapi: ${names || 'Monster'}!`, 'turn-header');

    this.characterPassives = {
      cardsPlayedTotal: 0,
      attacksPlayedTotal: 0,
      firstAttackThisTurn: true,
      exhaustedThisTurn: false
    };

    // Inisialisasi tumpukan kartu dari master deck (dengan pengaman starter deck)
    if (!window.gameState.deck || window.gameState.deck.length === 0) {
      const charDef = (window.gameState && window.gameState.getCharacterDef) ? window.gameState.getCharacterDef() : { starterDeck: ['strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'bash'] };
      const starterIds = charDef.starterDeck || ['strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'bash'];
      window.gameState.deck = starterIds.map(defId => {
        const baseDef = (window.CARD_DATABASE && window.CARD_DATABASE[defId]) ? window.CARD_DATABASE[defId] : (window.CARD_DATABASE ? window.CARD_DATABASE.strike : null);
        return (baseDef && window.Card) ? new window.Card(baseDef, false) : null;
      }).filter(Boolean);
      if (window.gameState && window.gameState.saveRun) window.gameState.saveRun();
    }

    this.drawPile = (window.gameState.deck || []).map(c => c.clone());
    this.shuffle(this.drawPile);
    this.hand = [];
    this.discardPile = [];
    this.exhaustPile = [];

    // Reset status pemain
    this.player.block = 0;
    this.player.activeSkillCooldown = 0;
    this.player.status = {
      strength: 0,
      dexterity: 0,
      vulnerable: 0,
      weak: 0,
      frail: 0,
      metallicize: 0,
      demonForm: 0,
      barricade: 0,
      flameBarrier: 0,
      noDraw: false,
      doubleDamageNext: false,
      feelNoPain: 0,
      rupture: 0,
      lightningOrbs: 0,
      wrathStance: 0,
      calmStance: 0
    };

    // ==========================================
    // TRIGGER PASIF 10 KARAKTER (ON COMBAT START)
    // ==========================================
    const charKey = window.gameState.character || 'ironclad';

    // 1. The Defect: Cracked Core (+1 Lightning Orb)
    if (charKey === 'defect') {
      this.player.status.lightningOrbs = 1;
      this.showCombatText('Lightning Orb Ready! (Cracked Core)', 'player', '#22b8cf');
    }

    // 2. The Watcher: Pure Water (Add Miracle card)
    if (charKey === 'watcher') {
      this.hand.push(new window.Card(window.CARD_DATABASE.miracle));
      this.showCombatText('+Miracle Card (Pure Water)', 'player', '#da77f2');
    }

    // 3. The Berserker: Blood Rite (Lose 3 HP, Gain +2 Strength)
    if (charKey === 'berserker') {
      window.gameState.takeDamage(3);
      this.player.status.strength += 2;
      this.showCombatText('Blood Rite: -3 HP & +2 STR!', 'player', '#ff2a2a');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
    }

    // 4. The Shadowblade: Smoke Screen (Gain 10 Block, apply 1 Vulnerable to all)
    if (charKey === 'shadowblade') {
      this.player.block += 10;
      this.enemies.forEach(e => {
        if (!e.isDead) this.applyEnemyStatus(e, 'vulnerable', 1);
      });
      this.showCombatText('Smoke Screen (+10 Block & Vuln!)', 'player', '#343a40');
      if (window.spireAudio) window.spireAudio.playBlock();
    }

    // Trigger Relic onCombatStart
    if (window.gameState && window.gameState.relics) {
      window.gameState.relics.forEach(relic => {
        relic.trigger('onCombatStart', this);
      });
    }

    // Musuh tentukan intent putaran pertama
    this.enemies.forEach(enemy => {
      enemy.determineIntent(this);
    });

    // Mulai giliran pertama pemain
    this.startPlayerTurn();
  }

  // Mulai giliran pemain
  startPlayerTurn() {
    this.turn++;
    this.isPlayerTurn = true;
    this.characterPassives.firstAttackThisTurn = true;
    this.characterPassives.exhaustedThisTurn = false;
    this.addCombatLog(`⚔️ Giliran ${this.turn} dimulai (Energi: ${this.maxEnergy})`, 'turn-header');

    const charKey = window.gameState.character || 'ironclad';

    // Kurangi cooldown Jurus Aktif pahlawan di awal giliran
    if (this.player.activeSkillCooldown > 0) {
      this.player.activeSkillCooldown--;
    }

    // Pasif Sung Jin-woo: Shadow Domain (6 Dark Damage ke semua musuh)
    if (charKey === 'shadow_monarch') {
      this.enemies.forEach(e => {
        if (!e.isDead && !e.hasEscaped) this.dealDamageToEnemy(e, 6);
      });
      this.showCombatText('🌑 Shadow Domain (-6 Dark DMG)', 'player', '#9775fa');
    }

    // Pasif Satoru Gojo: Infinity Barrier (+8 Block di awal giliran)
    if (charKey === 'limitless_sorcerer') {
      this.gainPlayerBlock(8);
      this.showCombatText('🛡️ Infinity Barrier (+8 Block)', 'player', '#00f0ff');
    }

    // 5. The Chronomancer: Temporal Stash (Retain up to 8 Block across turns)
    if (charKey === 'chronomancer' && this.player.status.barricade <= 0) {
      this.player.block = Math.min(8, this.player.block);
      if (this.player.block > 0) {
        this.showCombatText(`Retained ${this.player.block} Block (Temporal Stash)`, 'player', '#ffd43b');
      }
    } else if (this.player.status.barricade <= 0) {
      this.player.block = 0;
    }

    this.player.status.flameBarrier = 0;
    this.player.status.noDraw = false;

    // Kurangi durasi status debuff pemain
    if (this.player.status.vulnerable > 0) this.player.status.vulnerable--;
    if (this.player.status.weak > 0) this.player.status.weak--;
    if (this.player.status.frail > 0) this.player.status.frail--;

    // Efek Demon Form (+Strength tiap awal giliran)
    if (this.player.status.demonForm > 0) {
      this.player.status.strength += this.player.status.demonForm;
      this.showCombatText(`+${this.player.status.demonForm} STR (Demon Form)`, 'player', '#ff4d4d');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      this.triggerVfx('fire_burst', 'player');
    }

    // Efek Pasif Defect Lightning Orbs: 3 damage ke musuh acak di awal giliran
    if (this.player.status.lightningOrbs > 0) {
      const living = this.enemies.filter(e => !e.isDead && !e.hasEscaped);
      if (living.length > 0) {
        const randEnemy = living[Math.floor(Math.random() * living.length)];
        const orbDmg = this.player.status.lightningOrbs * 3;
        this.dealDamageToEnemy(randEnemy, orbDmg);
        this.showCombatText(`${orbDmg} Lightning Orb!`, randEnemy, '#22b8cf');
        if (window.spireAudio) window.spireAudio.playAttackSlash(false);
      }
    }

    // Trigger Relic onTurnStart
    if (window.gameState && window.gameState.relics) {
      window.gameState.relics.forEach(relic => {
        relic.trigger('onTurnStart', this);
      });
    }

    // Kembalikan energi ke maksimal
    this.energy = this.maxEnergy;

    // Tarik kartu: The Silent menarik 7 kartu di Turn 1 (Ring of the Snake), lainnya 5 kartu
    let cardsToDraw = 5;
    if (charKey === 'silent' && this.turn === 1) {
      cardsToDraw = 7;
      this.showCombatText('+2 Cards (Ring of the Snake)', 'player', '#51cf66');
    }
    this.drawCards(cardsToDraw);

    if (window.spireApp) {
      window.spireApp.renderCombatUI();
    }
  }

  // Tarik N kartu dari draw pile ke tangan
  drawCards(count) {
    if (this.player.status.noDraw) return;

    for (let i = 0; i < count; i++) {
      if (this.hand.length >= 10) break;

      if (this.drawPile.length === 0) {
        if (this.discardPile.length === 0) break;
        this.drawPile = this.discardPile;
        this.discardPile = [];
        this.shuffle(this.drawPile);
      }

      const card = this.drawPile.pop();
      if (card) {
        this.hand.push(card);
        if (window.spireAudio) window.spireAudio.playCardDraw();
      }
    }

    if (window.spireApp) {
      window.spireApp.renderHand();
      window.spireApp.renderPiles();
    }
  }

  // ==========================================
  // HERO ACTIVE SKILL / JURUS AKTIF SISTEM
  // ==========================================
  useActiveSkill() {
    if (!this.isActive || !this.isPlayerTurn) return false;
    const charDef = window.gameState ? window.gameState.getCharacterDef() : null;
    if (!charDef || !charDef.activeSkill) {
      this.showCombatText('Karakter tidak memiliki jurus aktif!', 'player', '#ff6b6b');
      return false;
    }

    if (this.player.activeSkillCooldown > 0) {
      this.showCombatText(`JURUS COOLDOWN (${this.player.activeSkillCooldown}T)!`, 'player', '#ffd43b');
      if (window.spireAudio) window.spireAudio.playClick();
      return false;
    }

    const skill = charDef.activeSkill;
    const cost = skill.cost || 0;
    if (this.energy < cost) {
      this.showCombatText('ENERGI TIDAK CUKUP!', 'player', '#ff6b6b');
      if (window.spireAudio) window.spireAudio.playClick();
      return false;
    }

    // Spend energy & set cooldown
    this.energy -= cost;
    this.player.activeSkillCooldown = skill.cooldown || 2;

    // Sfx & Screen Shake
    if (window.spireAudio && window.spireAudio.playActiveSkillSound) {
      window.spireAudio.playActiveSkillSound();
    } else if (window.spireAudio) {
      window.spireAudio.playPowerBuff();
    }

    if (window.spireVfx) {
      window.spireVfx.triggerScreenShake('medium');
    }

    // Execute skill effect
    if (typeof skill.execute === 'function') {
      skill.execute(this, this.player);
    }

    this.addCombatLog(`[HERO SKILL] ${charDef.name} melepaskan jurus: ${skill.name}!`, 'player-action');

    // Re-render UI
    if (window.spireApp) {
      window.spireApp.renderCombatUI();
    }
    return true;
  }

  // Mainkan kartu dari tangan
  playCard(cardUid, targetEnemy = null) {
    if (typeof targetEnemy === 'string') {
      targetEnemy = this.enemies.find(e => e.uid === targetEnemy || e.id === targetEnemy) || null;
    }
    if (!this.isPlayerTurn) return false;

    const cardIdx = this.hand.findIndex(c => c.uid === cardUid);
    if (cardIdx === -1) return false;
    const card = this.hand[cardIdx];

    if (card.cost === -2) {
      this.showCombatText('This Card is Unplayable!', 'player', '#adb5bd');
      if (window.spireAudio) window.spireAudio.playClick();
      return false;
    }

    if (card.cost !== -1 && card.cost > this.energy) {
      this.showCombatText('Not Enough Energy!', 'player', '#ff6b6b');
      if (window.spireAudio) window.spireAudio.playClick();
      return false;
    }

    if (card.target === window.TARGET_TYPES.ENEMY) {
      if (!targetEnemy || targetEnemy.isDead || targetEnemy.hasEscaped) {
        this.showCombatText('Select a Living Enemy!', 'player', '#ffdd57');
        return false;
      }
    }

    // Potong energi
    if (card.cost !== -1) {
      this.energy -= card.cost;
    }

    // Pindahkan dari tangan
    this.hand.splice(cardIdx, 1);
    this.addCombatLog(`🃏 Memainkan ${card.name}${targetEnemy ? ` ke ${targetEnemy.name}` : ''}`, 'player-action');

    const charKey = window.gameState.character || 'ironclad';

    // ANIMASI PENYERANGAN DINAMIS & LUWES (ANTI-KAKU)
    if (card.type === window.CARD_TYPES.ATTACK) {
      if (window.spireApp) {
        window.spireApp.triggerPlayerAttackAnim(targetEnemy, card);
      }

      this.characterPassives.attacksPlayedTotal++;

      // 6. The Paladin: Divine Smite (Setiap serangan ke-3: +5 Holy Damage & 2 Vulnerable)
      if (charKey === 'paladin' && (this.characterPassives.attacksPlayedTotal % 3 === 0)) {
        if (targetEnemy) {
          this.dealDamageToEnemy(targetEnemy, 5);
          this.applyEnemyStatus(targetEnemy, 'vulnerable', 2);
          this.showCombatText('DIVINE SMITE! (+5 Holy & Vuln)', targetEnemy, '#ffd43b');
          if (window.spireAudio) window.spireAudio.playPowerBuff();
          this.triggerVfx('shockwave_ring', targetEnemy);
        }
      }
    } else if (card.type === window.CARD_TYPES.SKILL) {
      if (window.spireApp) {
        window.spireApp.triggerPlayerShieldAnim();
      }

      // 7. The Paladin: Aegis Blessing (Skill memberikan +2 Block tambahan)
      if (charKey === 'paladin') {
        this.gainPlayerBlock(2);
        this.showCombatText('+2 Block (Aegis Blessing)', 'player', '#fab005');
      }
    } else if (card.type === window.CARD_TYPES.POWER) {
      if (window.spireApp) {
        window.spireApp.triggerPlayerPowerAnim();
      }

      // 8. The Defect: Capacitor Overload (Power memberikan +4 Block)
      if (charKey === 'defect') {
        this.gainPlayerBlock(4);
        this.showCombatText('+4 Block (Capacitor Overload)', 'player', '#22b8cf');
      }
    }

    // 9. The Chronomancer: Time Warp (Setiap 10 kartu: +1 Energy & tarik 1 kartu)
    this.characterPassives.cardsPlayedTotal++;
    if (charKey === 'chronomancer' && (this.characterPassives.cardsPlayedTotal % 10 === 0)) {
      this.energy += 1;
      this.drawCards(1);
      this.showCombatText('TIME WARP! (+1 Energy & Draw)', 'player', '#ffd43b');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
    }

    // Gremlin Nob Enrage trigger saat pemain memainkan Skill
    if (card.type === window.CARD_TYPES.SKILL) {
      this.enemies.forEach(enemy => {
        if (!enemy.isDead && enemy.status.enrage > 0) {
          enemy.status.strength += enemy.status.enrage;
          this.showCombatText(`Enrage! +${enemy.status.enrage} STR`, enemy, '#ff0000');
          if (window.spireAudio) window.spireAudio.playPowerBuff();
        }
      });
    }

    // Eksekusi efek kartu
    card.play(this, targetEnemy);

    // Penanganan kartu setelah dimainkan: Power vs Exhaust vs Discard
    if (card.type === window.CARD_TYPES.POWER) {
      // Power kartu aktif permanen
    } else if (card.exhaust) {
      this.exhaustPile.push(card);
      this.characterPassives.exhaustedThisTurn = true;
      this.showCombatText('Exhausted', 'player', '#ced4da');
      if (this.player.status.feelNoPain > 0) {
        this.gainPlayerBlock(this.player.status.feelNoPain);
      }
    } else {
      this.discardPile.push(card);
    }

    // Trigger Relic onCardPlay
    if (window.gameState && window.gameState.relics) {
      window.gameState.relics.forEach(relic => {
        relic.trigger('onCardPlay', this, card);
      });
    }

    if (card.type === window.CARD_TYPES.ATTACK) {
      this.characterPassives.firstAttackThisTurn = false;
      if (this.player.status.doubleDamageNext) {
        this.player.status.doubleDamageNext = false;
      }
    }

    // Cek kemenangan
    if (this.checkCombatVictory()) {
      this.handleCombatVictory();
      return true;
    }

    // Perbarui intent musuh
    this.enemies.forEach(enemy => {
      if (!enemy.isDead && !enemy.hasEscaped) enemy.determineIntent(this);
    });

    if (window.spireApp) {
      window.spireApp.renderCombatUI();
    }
    return true;
  }

  // Akhiri giliran pemain
  endTurn() {
    if (!this.isPlayerTurn) return;
    this.isPlayerTurn = false;
    if (window.spireAudio) window.spireAudio.playEndTurn();

    const charKey = window.gameState.character || 'ironclad';

    // 10. The Necromancer: Bone Armor (Jika ada kartu di-Exhaust giliran ini, +5 Block)
    if (charKey === 'necromancer' && this.characterPassives.exhaustedThisTurn) {
      this.gainPlayerBlock(5);
      this.showCombatText('+5 Block (Bone Armor)', 'player', '#22b8cf');
    }

    // Trigger efek kartu di tangan saat akhir giliran (Burn, Regret)
    this.hand.forEach(c => {
      if (typeof c.baseDef.onTurnEndInHand === 'function') {
        c.baseDef.onTurnEndInHand.call(c, this);
      }
    });

    // Trigger Metallicize
    if (this.player.status.metallicize > 0) {
      this.gainPlayerBlock(this.player.status.metallicize);
      this.showCombatText(`+${this.player.status.metallicize} Block (Metallicize)`, 'player', '#4dabf7');
      if (window.spireAudio) window.spireAudio.playBlock();
    }

    // Trigger Relic onTurnEnd
    if (window.gameState && window.gameState.relics) {
      window.gameState.relics.forEach(relic => {
        relic.trigger('onTurnEnd', this);
      });
    }

    // Buang sisa kartu ke discard (atau exhaust jika Ethereal)
    for (let i = this.hand.length - 1; i >= 0; i--) {
      const card = this.hand[i];
      if (card.ethereal) {
        this.exhaustPile.push(card);
        this.characterPassives.exhaustedThisTurn = true;
        this.showCombatText('Ethereal Exhaust', 'player', '#ced4da');
        if (this.player.status.feelNoPain > 0) {
          this.gainPlayerBlock(this.player.status.feelNoPain);
        }
      } else {
        this.discardPile.push(card);
      }
    }
    this.hand = [];
    this.processPlayerStatusEndTurn();

    if (window.spireApp) {
      window.spireApp.renderCombatUI();
    }

    setTimeout(() => {
      this.executeEnemyTurn();
    }, 600);
  }

  // Eksekusi giliran seluruh musuh
  async executeEnemyTurn() {
    const livingEnemies = this.enemies.filter(e => !e.isDead && !e.hasEscaped);

    for (const enemy of livingEnemies) {
      if (enemy.isDead || enemy.hasEscaped || !this.isActive) continue;

      enemy.block = 0;
      if (enemy.status.vulnerable > 0) enemy.status.vulnerable--;
      if (enemy.status.weak > 0) enemy.status.weak--;

      // Proses Poison Tick Musuh
      if (enemy.status.poison > 0) {
        const pDmg = enemy.status.poison;
        enemy.takeDamage(pDmg);
        this.showCombatText(`${pDmg} Poison`, enemy, '#51cf66');
        enemy.status.poison = Math.max(0, enemy.status.poison - 1);
        if (enemy.isDead) {
          if (this.checkCombatVictory()) {
            this.handleCombatVictory();
            return;
          }
          continue;
        }
      }

      if (window.spireApp) {
        window.spireApp.highlightEnemyAction(enemy);
      }

      enemy.executeTurn(this);

      if (window.gameState.player.currentHp <= 0) {
        if (this.checkFairyPotion()) {
          // Diselamatkan oleh Fairy!
        } else {
          this.handleCombatDefeat();
          return;
        }
      }

      await new Promise(r => setTimeout(r, 700));
    }

    if (!this.isActive) return;

    this.enemies.forEach(enemy => {
      if (!enemy.isDead && !enemy.hasEscaped) enemy.determineIntent(this);
    });

    this.startPlayerTurn();
  }

  // Kalkulasi Damage Serangan Pemain (dengan Pasif Demonic Fury & Shadow Step)
  calcDamage(baseDamage, isAttack = true) {
    let dmg = baseDamage + (this.player.status.strength || 0);

    const charKey = window.gameState.character || 'ironclad';

    // Pasif Ironclad: Demonic Fury (+3 bonus damage saat HP <= 50%)
    if (charKey === 'ironclad' && window.gameState.player.currentHp <= Math.floor(window.gameState.player.maxHp * 0.5)) {
      dmg += 3;
    }

    // Pasif Shadowblade: Shadow Step (1.5x damage pada serangan pertama tiap giliran)
    if (charKey === 'shadowblade' && this.characterPassives.firstAttackThisTurn && isAttack) {
      dmg = Math.floor(dmg * 1.5);
    }

    // Stance Watcher: Wrath (2x attack damage)
    if (this.player.status.wrathStance > 0 && isAttack) {
      dmg *= 2;
    }

    if (dmg < 0) dmg = 0;

    if (isAttack && this.player.status.doubleDamageNext) {
      dmg *= 2;
    }

    if (isAttack && this.player.status.weak > 0) {
      dmg = Math.floor(dmg * 0.75);
    }

    return Math.max(0, dmg);
  }

  // Kalkulasi Block Pemain
  calcBlock(baseBlock) {
    let blk = baseBlock + (this.player.status.dexterity || 0);
    if (blk < 0) blk = 0;

    if (this.player.status.frail > 0) {
      blk = Math.floor(blk * 0.75);
    }

    return Math.max(0, blk);
  }

  // Berikan Damage ke Satu Musuh
  dealDamageToEnemy(enemy, rawDamage) {
    if (!enemy || enemy.isDead || enemy.hasEscaped) return;

    let finalDamage = rawDamage;
    if (enemy.status.vulnerable > 0) {
      finalDamage = Math.floor(finalDamage * 1.5);
    }

    const unblocked = enemy.takeDamage(finalDamage);
    this.addCombatLog(`🗡️ ${finalDamage} damage ke ${enemy.name} (${unblocked} tembus HP, ${finalDamage - unblocked} tertahan Block)`, 'player-action');

    if (enemy.isDead) {
      if (window.spireAudio && window.spireAudio.playEnemyDeath) window.spireAudio.playEnemyDeath();
      this.addCombatLog(`☠️ ${enemy.name} telah dikalahkan!`, 'relic-proc');
    }

    // Pasif The Silent: Toxic Coat (Serangan yang menembus Block memberikan 1 Poison)
    const charKey = window.gameState.character || 'ironclad';
    if (charKey === 'silent' && unblocked > 0) {
      this.applyEnemyStatus(enemy, 'poison', 1);
      this.showCombatText('+1 Poison (Toxic Coat)', enemy, '#51cf66');
    }

    // Pasif The Necromancer: Soul Harvest (Saat musuh mati, pulihkan 5 HP & +1 Max HP)
    if (charKey === 'necromancer' && enemy.isDead) {
      window.gameState.player.maxHp += 1;
      this.healPlayer(5);
      this.showCombatText('Soul Harvest: +5 HP & +1 Max HP!', 'player', '#22b8cf');
    }

    if (this.checkCombatVictory()) {
      this.handleCombatVictory();
      return;
    }

    // Tampilkan floating text
    this.showCombatText(
      finalDamage.toString(),
      enemy,
      unblocked > 0 ? '#ff3838' : '#74c0fc',
      enemy.status.vulnerable > 0
    );

    // Sharp Hide (The Guardian)
    if (enemy.status.sharpHide > 0) {
      this.dealDamageToPlayer(enemy.status.sharpHide, null);
      this.showCombatText(`${enemy.status.sharpHide} Thorn Damage!`, 'player', '#ffa94d');
    }

    window.spireVfx.triggerScreenShake(finalDamage >= 15 ? 'heavy' : 'medium');
  }

  // Berikan Damage ke Seluruh Musuh
  dealDamageToAllEnemies(rawDamage) {
    this.enemies.forEach(enemy => {
      if (!enemy.isDead && !enemy.hasEscaped) {
        this.dealDamageToEnemy(enemy, rawDamage);
      }
    });
  }

  // Berikan Damage ke Pemain
  dealDamageToPlayer(rawDamage, sourceEnemy = null) {
    let unblocked = rawDamage;
    if (this.player.status.vulnerable > 0 && sourceEnemy) {
      unblocked = Math.floor(unblocked * 1.5);
    }

    // Retaliasi Flame Barrier
    if (sourceEnemy && this.player.status.flameBarrier > 0 && !sourceEnemy.isDead) {
      sourceEnemy.takeDamage(this.player.status.flameBarrier);
      this.showCombatText(`${this.player.status.flameBarrier} Retaliate!`, sourceEnemy, '#ff922b');
      this.triggerVfx('fire_burst', sourceEnemy);
    }

    // Potong Block Pemain
    if (this.player.block > 0) {
      if (this.player.block >= unblocked) {
        this.player.block -= unblocked;
        unblocked = 0;
        if (window.spireAudio && window.spireAudio.playFullBlockDeflect) {
          window.spireAudio.playFullBlockDeflect();
        } else if (window.spireAudio) {
          window.spireAudio.playBlock();
        }
        this.addCombatLog(`🛡️ Serangan tertangkis sempurna oleh perisai!`, 'relic-proc');
      } else {
        unblocked -= this.player.block;
        this.player.block = 0;
      }
    }

    if (unblocked > 0) {
      // Trigger Torii Relic
      if (window.gameState && window.gameState.relics) {
        window.gameState.relics.forEach(relic => {
          unblocked = relic.trigger('onDamageReceived', this, unblocked);
        });
      }

      window.gameState.takeDamage(unblocked);
      this.showCombatText(unblocked.toString(), 'player', '#ff0000', true);
      window.spireVfx.triggerScreenShake('heavy');
      this.addCombatLog(`💔 ${sourceEnemy ? sourceEnemy.name : 'Musuh'} menghasilkan ${unblocked} damage ke HP!`, 'enemy-action');

      // Pasif Berserker: Pain Fueled (Tarik 1 kartu saat terkena unblocked damage)
      const charKey = window.gameState.character || 'ironclad';
      if (charKey === 'berserker' && sourceEnemy) {
        this.drawCards(1);
        this.showCombatText('Pain Fueled: +1 Card Drawn!', 'player', '#ff4d4d');
      }

      // Trigger Rupture
      if (!sourceEnemy && this.player.status.rupture > 0) {
        this.applyPlayerStatus('strength', this.player.status.rupture);
      }
    } else {
      this.showCombatText('Blocked!', 'player', '#4dabf7');
    }

    if (window.spireApp) {
      window.spireApp.renderTopHud();
      window.spireApp.renderPlayerCombat();
    }
  }

  gainPlayerBlock(amount) {
    this.player.block += amount;
    this.showCombatText(`+${amount} Block`, 'player', '#4dabf7');
    if (window.spireApp) {
      window.spireApp.renderCombatUI();
    }
  }

  healPlayer(amount) {
    const healed = window.gameState.heal(amount);
    if (healed > 0) {
      this.showCombatText(`+${healed} HP`, 'player', '#51cf66');
    }
    if (window.spireApp) {
      window.spireApp.renderTopHud();
    }
  }

  applyPlayerStatus(statusName, amount) {
    this.player.status[statusName] = (this.player.status[statusName] || 0) + amount;
    this.showCombatText(`+${amount} ${statusName.toUpperCase()}`, 'player', '#ffd43b');
  }

  applyEnemyStatus(enemy, statusName, amount) {
    if (!enemy || enemy.isDead || enemy.hasEscaped) return;
    enemy.status[statusName] = (enemy.status[statusName] || 0) + amount;
    this.showCombatText(`+${amount} ${statusName.toUpperCase()}`, enemy, '#ffd43b');
  }

  damagePlayer(amount) {
    this.dealDamageToPlayer(amount);
  }

  channelOrb(orbType = 'LIGHTNING') {
    const key = orbType.toLowerCase() + 'Orbs';
    this.player.status[key] = (this.player.status[key] || 0) + 1;
    this.showCombatText(`+1 ${orbType} Orb`, 'player', '#74c0fc');
    if (window.spireAudio) window.spireAudio.playPowerBuff();
  }

  evokeOrb(bonus = 0) {
    if ((this.player.status.lightningOrbs || 0) > 0) {
      this.player.status.lightningOrbs--;
      this.dealDamageToAllEnemies(8 + bonus);
      this.showCombatText(`⚡ EVOKE LIGHTNING! (${8 + bonus} AoE)`, 'player', '#ffd43b');
    } else if ((this.player.status.frostOrbs || 0) > 0) {
      this.player.status.frostOrbs--;
      this.gainPlayerBlock(5 + bonus);
      this.showCombatText(`❄️ EVOKE FROST! (+${5 + bonus} BLK)`, 'player', '#74c0fc');
    } else if ((this.player.status.plasmaOrbs || 0) > 0) {
      this.player.status.plasmaOrbs--;
      this.player.energy = Math.min(this.player.maxEnergy + 2, this.player.energy + 2);
      this.showCombatText('🔮 EVOKE PLASMA! (+2 Energy)', 'player', '#da77f2');
    }
  }

  changePlayerStance(stanceName) {
    this.enterStance(stanceName);
  }

  getRandomLivingEnemy() {
    const living = this.enemies.filter(e => !e.isDead && !e.hasEscaped && e.currentHp > 0);
    if (living.length === 0) return null;
    return living[Math.floor(Math.random() * living.length)];
  }

  upgradeHandCards(all = false) {
    const unupgraded = this.hand.filter(c => !c.isUpgraded);
    if (unupgraded.length === 0) return;

    if (all) {
      unupgraded.forEach(c => c.upgrade());
    } else {
      const picked = unupgraded[Math.floor(Math.random() * unupgraded.length)];
      picked.upgrade();
    }
    if (window.spireApp) {
      window.spireApp.renderHand();
    }
  }

  checkFairyPotion() {
    const fairyIdx = window.gameState.potions.findIndex(p => p && p.id === 'fairy_potion');
    if (fairyIdx !== -1) {
      window.gameState.potions[fairyIdx] = null;
      const reviveHp = Math.floor(window.gameState.player.maxHp * 0.3);
      window.gameState.player.currentHp = reviveHp;
      this.showCombatText('SAVED BY FAIRY!', 'player', '#f06595', true);
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      this.triggerVfx('heal_sparkle', 'player');
      window.gameState.saveRun();
      return true;
    }
    return false;
  }

  checkCombatVictory() {
    if (!this.enemies || this.enemies.length === 0) return false;
    return this.enemies.every(e => e.isDead || e.hasEscaped);
  }

  handleCombatVictory() {
    this.isActive = false;
    if (window.spireAudio) window.spireAudio.playVictory();

    // Trigger Relic onCombatEnd
    if (window.gameState && window.gameState.relics) {
      window.gameState.relics.forEach(relic => {
        relic.trigger('onCombatEnd', this, true);
      });
    }

    // Pasif The Ironclad: Burning Blood (+6 HP end of battle)
    const charKey = window.gameState.character || 'ironclad';
    if (charKey === 'ironclad') {
      this.healPlayer(6);
      this.showCombatText('Burning Blood: +6 HP', 'player', '#51cf66');
    }

    window.gameState.stats.monstersSlain += this.enemies.length;
    if (this.encounterType === 'ELITE') window.gameState.stats.elitesSlain++;
    if (this.encounterType === 'BOSS') window.gameState.stats.bossesSlain++;
    window.gameState.stats.floorsCleared++;

    setTimeout(() => {
      if (window.spireApp) {
        window.spireApp.showCombatRewards(this.encounterType);
      }
    }, 900);
  }

  handleCombatDefeat() {
    this.isActive = false;
    window.gameState.clearSave();
    if (window.spireApp) {
      window.spireApp.showGameOverScreen(false);
    }
  }

  showCombatText(text, target, color = '#ff4d4d', isCrit = false) {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (target === 'player') {
      const pElem = document.getElementById('playerAvatar');
      if (pElem) {
        const rect = pElem.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + 30;
      }
    } else if (target === 'all') {
      x = window.innerWidth * 0.65;
      y = window.innerHeight * 0.4;
    } else if (target && target.uid) {
      const eElem = document.getElementById(target.uid);
      if (eElem) {
        const rect = eElem.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + 30;
      }
    }

    window.spireVfx.showFloatingText(text, x, y, color, isCrit);
  }

  triggerVfx(type, target) {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (target === 'player') {
      const pElem = document.getElementById('playerAvatar');
      if (pElem) {
        const rect = pElem.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    } else if (target === 'all') {
      x = window.innerWidth * 0.7;
      y = window.innerHeight * 0.45;
    } else if (target && target.uid) {
      const eElem = document.getElementById(target.uid);
      if (eElem) {
        const rect = eElem.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    }

    if (type === 'slash') window.spireVfx.createSlash(x, y, false);
    else if (type === 'heavy_slice' || type === 'impact') window.spireVfx.createSlash(x, y, true);
    else if (type === 'shield') window.spireVfx.createShieldBurst(x, y);
    else if (type === 'fire_burst') window.spireVfx.createFireBurst(x, y);
    else if (type === 'shockwave_ring') window.spireVfx.createShockwave(x, y);
    else if (type === 'cleave_sweep') {
      window.spireVfx.createShockwave(x, y);
      window.spireVfx.createSlash(x - 60, y, true);
      window.spireVfx.createSlash(x + 60, y, true);
    }
  }


  // ==========================================================================
  // ADVANCED STANCE & STATUS LIFECYCLE MANAGEMENT
  // ==========================================================================

  enterStance(stanceName) {
    const prevCalm = this.player.status.calmStance > 0;
    const prevWrath = this.player.status.wrathStance > 0;

    if (stanceName === 'WRATH') {
      this.player.status.wrathStance = 2;
      this.player.status.calmStance = 0;
      this.player.status.divinityStance = 0;
      this.showCombatText('ENTERED WRATH (2x Dmg)!', 'player', '#ff2a2a');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      this.triggerVfx('fire_burst', 'player');
    } else if (stanceName === 'CALM') {
      this.player.status.calmStance = 1;
      this.player.status.wrathStance = 0;
      this.player.status.divinityStance = 0;
      this.showCombatText('ENTERED CALM (Zen)', 'player', '#74c0fc');
      if (window.spireAudio) window.spireAudio.playBlock();
      this.triggerVfx('shield', 'player');
    } else if (stanceName === 'DIVINITY') {
      this.player.status.divinityStance = 3;
      this.player.status.calmStance = 0;
      this.player.status.wrathStance = 0;
      this.showCombatText('ASCENDED TO DIVINITY (3x Dmg)!', 'player', '#ffd43b');
      if (window.spireAudio) window.spireAudio.playPowerBuff();
      this.triggerVfx('shockwave_ring', 'player');
    }

    // Jika keluar dari Calm, peroleh +2 Energy
    if (prevCalm && stanceName !== 'CALM') {
      this.energy += 2;
      this.showCombatText('+2 Energy (Calm Exit)', 'player', '#74c0fc');
    }

    // Passive Watcher: Flow State (deal 5 damage to random enemy on stance shift)
    if (window.gameState && window.gameState.character === 'watcher') {
      const living = this.enemies.filter(e => !e.isDead && !e.hasEscaped);
      if (living.length > 0) {
        const randEnemy = living[Math.floor(Math.random() * living.length)];
        this.dealDamageToEnemy(randEnemy, 5);
        this.showCombatText('Flow State (5 Dmg)', randEnemy, '#da77f2');
      }
    }
  }

  processEnemyPoisonTicks() {
    this.enemies.forEach(e => {
      if (!e.isDead && !e.hasEscaped && e.status && e.status.poison > 0) {
        const pDmg = e.status.poison;
        e.takeDamage(pDmg);
        this.showCombatText(`${pDmg} Poison Tick`, e, '#51cf66');
        e.status.poison = Math.max(0, e.status.poison - 1);
        if (e.isDead) {
          this.checkCombatVictory();
        }
      }
    });
  }

  processPlayerStatusEndTurn() {
    // Kurangi durasi Vulnerable, Weak, Frail pemain
    if (this.player.status.vulnerable > 0) this.player.status.vulnerable--;
    if (this.player.status.weak > 0) this.player.status.weak--;
    if (this.player.status.frail > 0) this.player.status.frail--;

    // Demon Form (+STR)
    if (this.player.status.demonForm > 0) {
      this.applyPlayerStatus('strength', this.player.status.demonForm);
      this.showCombatText(`+${this.player.status.demonForm} STR (Demon Form)`, 'player', '#ff2a2a');
    }

    // Sun Radiance
    if (this.player.status.sunRadiance > 0) {
      this.dealDamageToAllEnemies(this.player.status.sunRadiance);
      this.gainPlayerBlock(4);
      this.showCombatText(`Sun Radiance!`, 'player', '#ffd43b');
    }

    // Blasphemy Doom
    if (this.player.status.blasphemyDoom > 0) {
      this.dealDamageToPlayer(9999, null);
      this.showCombatText('DOOM CONSUMED YOU (Blasphemy)!', 'player', '#ff0000');
    }
  }

  logCombatAction(actor, actionType, details) {
    if (!this.combatHistory) this.combatHistory = [];
    this.combatHistory.push({
      turn: this.turn,
      actor: actor,
      action: actionType,
      details: details,
      timestamp: Date.now()
    });
    if (this.combatHistory.length > 50) this.combatHistory.shift();
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
}

window.spireCombat = new CombatEngine();
