/**
 * ============================================================================
 * SHADOWSPIRE: CHRONICLES OF ASCENSION - MASTER RELIC ENCYCLOPEDIA & ARTIFACTS
 * ============================================================================
 * Koleksi peninggalan purba (Relics) autentik Shadowspire dengan event hooks otomatis:
 * onCombatStart, onTurnStart, onTurnEnd, onCardPlay, onDamageReceived, onCombatEnd.
 * Mendukung 10 relic starter untuk 10 pahlawan serta artefak langka.
 */

const RELIC_RARITIES = {
  STARTER: 'STARTER',
  COMMON: 'COMMON',
  UNCOMMON: 'UNCOMMON',
  RARE: 'RARE',
  BOSS: 'BOSS',
  SHOP: 'SHOP',
  EVENT: 'EVENT'
};

const RELIC_DATABASE = {
  // ==========================================================================
  // 10 STARTER RELICS (1 PER HERO ARCHETYPE)
  // ==========================================================================

  // 1. The Ironclad
  burning_blood: {
    id: 'burning_blood',
    name: 'Burning Blood',
    rarity: RELIC_RARITIES.STARTER,
    icon: '🩸',
    description: 'At the end of combat, heal 6 HP.',
    lore: 'A vial of hot demon blood bound to the Ironclad soul.',
    onCombatEnd(combat, relicInst, victory) {
      if (victory) {
        combat.healPlayer(6);
        if (window.spireAudio) window.spireAudio.playPowerBuff();
        combat.triggerVfx('heal_sparkle', 'player');
      }
    }
  },

  // 2. The Silent
  ring_of_snake: {
    id: 'ring_of_snake',
    name: 'Ring of the Snake',
    rarity: RELIC_RARITIES.STARTER,
    icon: '🐍💍',
    description: 'At the start of combat, draw 2 additional cards.',
    lore: 'A coiled jade viper talisman blessed by the bog huntresses.',
    onCombatStart(combat) {
      combat.drawCards(2);
      combat.showCombatText('+2 Cards (Snake Ring)', 'player', '#51cf66');
    }
  },

  // 3. The Defect
  cracked_core: {
    id: 'cracked_core',
    name: 'Cracked Core',
    rarity: RELIC_RARITIES.STARTER,
    icon: '⚡🔷',
    description: 'At the start of combat, Channel 1 Lightning Orb.',
    lore: 'The damaged memory matrix of an ancient automaton that continuously leaks ambient plasma.',
    onCombatStart(combat) {
      combat.player.status.lightningOrbs = (combat.player.status.lightningOrbs || 0) + 1;
      combat.showCombatText('Lightning Orb Ready!', 'player', '#22b8cf');
    }
  },

  // 4. The Watcher
  pure_water: {
    id: 'pure_water',
    name: 'Pure Water',
    rarity: RELIC_RARITIES.STARTER,
    icon: '💧✨',
    description: 'At the start of combat, add a Miracle card into your hand.',
    lore: 'Distilled dew from the sacred lotus cliffs of the monks.',
    onCombatStart(combat) {
      combat.hand.push(new window.Card(window.CARD_DATABASE.miracle));
      combat.showCombatText('+Miracle Card in Hand', 'player', '#da77f2');
    }
  },

  // 5. The Necromancer
  bone_pendant: {
    id: 'bone_pendant',
    name: 'Bone Pendant',
    rarity: RELIC_RARITIES.STARTER,
    icon: '💀📿',
    description: 'Whenever you Exhaust a card, gain 2 Block.',
    lore: 'Carved from the femur of the First Lich, resonating with spent spirits.',
    onCardPlay(combat, card) {
      if (card && card.exhaust) {
        combat.gainPlayerBlock(2);
        combat.showCombatText('+2 Block (Bone Pendant)', 'player', '#22b8cf');
      }
    }
  },

  // 6. The Chronomancer
  hourglass_core: {
    id: 'hourglass_core',
    name: 'Hourglass Core',
    rarity: RELIC_RARITIES.STARTER,
    icon: '⏳⚙️',
    description: 'At the start of combat, gain 1 Energy.',
    lore: 'A miniature temporal vortex captured inside brass chronometer gearing.',
    onCombatStart(combat) {
      combat.energy += 1;
      combat.showCombatText('+1 Energy (Hourglass Core)', 'player', '#ffd43b');
    }
  },

  // 7. The Berserker
  berserk_amulet: {
    id: 'berserk_amulet',
    name: 'Berserker Amulet',
    rarity: RELIC_RARITIES.STARTER,
    icon: '🪓🔥',
    description: 'Start combat with 2 Strength and lose 3 HP.',
    lore: 'Imbued with the undying fury of slaughtered bloodlines.',
    onCombatStart(combat) {
      window.gameState.takeDamage(3);
      combat.player.status.strength += 2;
      combat.showCombatText('+2 STR & -3 HP (Amulet)', 'player', '#ff2a2a');
    }
  },

  // 8. The Paladin
  sun_emblem: {
    id: 'sun_emblem',
    name: 'Sun Emblem',
    rarity: RELIC_RARITIES.STARTER,
    icon: '☀️🛡️',
    description: 'Whenever you play a Skill card, gain 2 additional Block.',
    lore: 'A sanctified solar crest radiating perpetual defensive warmth.',
    onCardPlay(combat, card) {
      if (card && card.type === window.CARD_TYPES.SKILL) {
        combat.gainPlayerBlock(2);
        combat.showCombatText('+2 Block (Sun Emblem)', 'player', '#fab005');
      }
    }
  },

  // 9. The Shadowblade
  shadow_cloak: {
    id: 'shadow_cloak',
    name: 'Shadow Cloak',
    rarity: RELIC_RARITIES.STARTER,
    icon: '🌑🗡️',
    description: 'Start combat with 10 Block.',
    lore: 'Woven from astral silk that conceals the bearer in opening salvos.',
    onCombatStart(combat) {
      combat.gainPlayerBlock(10);
      combat.showCombatText('+10 Block (Shadow Cloak)', 'player', '#ced4da');
    }
  },

  // 10. The Alchemist
  alchemist_pouch: {
    id: 'alchemist_pouch',
    name: 'Alchemist Pouch',
    rarity: RELIC_RARITIES.STARTER,
    icon: '🧪🪙',
    description: 'Start combat with 1 random combat potion ready to throw.',
    lore: 'A reinforced leather bandolier holding volatile transmutative vials.',
    onCombatStart(combat) {
      const p = window.getRandomPotion();
      if (p) {
        window.gameState.addPotion(p);
        combat.showCombatText(`+Potion: ${p.name}`, 'player', '#20c997');
      }
    }
  },

  // 11. Sung Jin-woo (Shadow Monarch)
  monarchs_heart: {
    id: 'monarchs_heart',
    name: 'Monarch\'s Heart (君主の心臓)',
    rarity: RELIC_RARITIES.STARTER,
    icon: '👑💜',
    description: 'At start of combat, gain +2 Strength. Whenever an enemy dies, heal 8 HP.',
    lore: 'The Black Heart of Ashborn beating inside the Shadow Monarch with infinite mana.',
    onCombatStart(combat) {
      combat.applyPlayerStatus('strength', 2);
      combat.showCombatText('+2 STR (Monarch Heart)', 'player', '#9775fa');
    },
    onEnemyDeath(combat, enemy) {
      window.gameState.heal(8);
      combat.showCombatText('+8 HP (Shadow Extraction)', 'player', '#20c997');
    }
  },

  // 12. Satoru Gojo (Limitless Sorcerer)
  six_eyes: {
    id: 'six_eyes',
    name: 'Six Eyes (六眼)',
    rarity: RELIC_RARITIES.STARTER,
    icon: '👁️✨',
    description: 'Draw 1 additional card at the start of every turn. Infinity barrier grants 8 Block at start of combat.',
    lore: 'The ocular jujutsu trait that allows atomic manipulation of cursed energy at near-zero consumption.',
    onCombatStart(combat) {
      combat.gainPlayerBlock(8);
      combat.drawCards(1);
      combat.showCombatText('+1 Card & +8 BLK (Six Eyes)', 'player', '#00f0ff');
    }
  },

  // ==========================================================================
  // COMMON & UNCOMMON RELICS
  // ==========================================================================

  vajra: {
    id: 'vajra',
    name: 'Vajra',
    rarity: RELIC_RARITIES.COMMON,
    icon: '⚡',
    description: 'At the start of each combat, gain 1 Strength.',
    lore: 'An ancient ritual weapon carved from divine thunderbolt.',
    onCombatStart(combat) {
      combat.applyPlayerStatus('strength', 1);
      combat.showCombatText('+1 STR (Vajra)', 'player', '#ff4d4d');
    }
  },

  anchor: {
    id: 'anchor',
    name: 'Anchor',
    rarity: RELIC_RARITIES.COMMON,
    icon: '⚓',
    description: 'Start each combat with 10 Block.',
    lore: 'Heavy iron anchor ensuring you weather opening onslaughts.',
    onCombatStart(combat) {
      combat.gainPlayerBlock(10);
      if (window.spireAudio) window.spireAudio.playBlock();
      combat.showCombatText('+10 Block (Anchor)', 'player', '#4da6ff');
    }
  },

  oddly_smooth_stone: {
    id: 'oddly_smooth_stone',
    name: 'Oddly Smooth Stone',
    rarity: RELIC_RARITIES.COMMON,
    icon: '🪨',
    description: 'At the start of combat, gain 1 Dexterity.',
    lore: 'Comfortable to hold in palm, imparting steady balance.',
    onCombatStart(combat) {
      combat.applyPlayerStatus('dexterity', 1);
      combat.showCombatText('+1 DEX (Smooth Stone)', 'player', '#51cf66');
    }
  },

  bag_of_marbles: {
    id: 'bag_of_marbles',
    name: 'Bag of Marbles',
    rarity: RELIC_RARITIES.COMMON,
    icon: '🔮',
    description: 'At the start of combat, apply 1 Vulnerable to ALL enemies.',
    lore: 'Scattered across the dungeon flagstones, making foes stumble.',
    onCombatStart(combat) {
      combat.enemies.forEach(e => {
        if (!e.isDead && !e.hasEscaped) combat.applyEnemyStatus(e, 'vulnerable', 1);
      });
      combat.showCombatText('Vulnerable! (Marbles)', 'all', '#ff6b6b');
    }
  },

  bag_of_preparation: {
    id: 'bag_of_preparation',
    name: 'Bag of Preparation',
    rarity: RELIC_RARITIES.COMMON,
    icon: '🎒',
    description: 'At the start of combat, draw 2 additional cards.',
    lore: 'Packed carefully before descending into the Spire.',
    onCombatStart(combat) {
      combat.drawCards(2);
      combat.showCombatText('+2 Cards (Bag of Prep)', 'player', '#ffdd57');
    }
  },

  lantern: {
    id: 'lantern',
    name: 'Lantern',
    rarity: RELIC_RARITIES.COMMON,
    icon: '🏮',
    description: 'Gain 1 Energy on the first turn of each combat.',
    lore: 'Illuminates the gloomy dungeon with reassuring warmth.',
    onCombatStart(combat) {
      combat.energy += 1;
      combat.showCombatText('+1 Energy (Lantern)', 'player', '#ffd43b');
    }
  },

  meat_on_the_bone: {
    id: 'meat_on_the_bone',
    name: 'Meat on the Bone',
    rarity: RELIC_RARITIES.UNCOMMON,
    icon: '🍖',
    description: 'If your HP is at or below 50% at the end of combat, heal 12 HP.',
    lore: 'Hearty dried marrow devoured ravenously when near death.',
    onCombatEnd(combat, relicInst, victory) {
      if (victory && window.gameState.player.currentHp <= Math.floor(window.gameState.player.maxHp * 0.5)) {
        combat.healPlayer(12);
        if (window.spireAudio) window.spireAudio.playPowerBuff();
        combat.triggerVfx('heal_sparkle', 'player');
        combat.showCombatText('+12 HP (Meat on Bone)', 'player', '#51cf66');
      }
    }
  },

  orichalcum: {
    id: 'orichalcum',
    name: 'Orichalcum',
    rarity: RELIC_RARITIES.COMMON,
    icon: '🔷',
    description: 'If you end your turn without Block, gain 6 Block.',
    lore: 'Mythical self-hardening ore that coats the defenseless.',
    onTurnEnd(combat) {
      if (combat.player.block === 0) {
        combat.gainPlayerBlock(6);
        if (window.spireAudio) window.spireAudio.playBlock();
        combat.showCombatText('+6 Block (Orichalcum)', 'player', '#4da6ff');
      }
    }
  },

  happy_flower: {
    id: 'happy_flower',
    name: 'Happy Flower',
    rarity: RELIC_RARITIES.COMMON,
    icon: '🌻',
    counter: 0,
    description: 'Every 3 turns, gain 1 Energy.',
    lore: 'Blooms rhythmically amid the suffocating dark.',
    onTurnStart(combat, relicInstance) {
      relicInstance.counter = (relicInstance.counter || 0) + 1;
      if (relicInstance.counter >= 3) {
        relicInstance.counter = 0;
        combat.energy += 1;
        combat.showCombatText('+1 Energy (Happy Flower)', 'player', '#ffd43b');
        if (window.spireAudio) window.spireAudio.playPowerBuff();
      }
    }
  },

  pen_nib: {
    id: 'pen_nib',
    name: 'Pen Nib',
    rarity: RELIC_RARITIES.COMMON,
    icon: '✒️',
    counter: 0,
    description: 'Every 10th Attack deals double damage.',
    lore: 'Sharper than a sword, writing the final epitaph of your adversaries.',
    onCardPlay(combat, card, relicInstance) {
      if (card.type === window.CARD_TYPES.ATTACK) {
        relicInstance.counter = (relicInstance.counter || 0) + 1;
        if (relicInstance.counter >= 10) {
          relicInstance.counter = 0;
          combat.player.status.doubleDamageNext = true;
          combat.showCombatText('Double Damage Ready! (Pen Nib)', 'player', '#ff922b');
        }
      }
    }
  },

  torii: {
    id: 'torii',
    name: 'Torii',
    rarity: RELIC_RARITIES.RARE,
    icon: '⛩️',
    description: 'Whenever you would receive 5 or less unblocked attack damage, reduce it to 1.',
    lore: 'A sacred miniature wooden gateway warding off minor lacerations.',
    onDamageReceived(combat, relicInst, damage) {
      if (damage > 1 && damage <= 5) {
        combat.showCombatText('Torii: Reduced to 1!', 'player', '#74c0fc');
        return 1;
      }
      return damage;
    }
  },

  golden_idol: {
    id: 'golden_idol',
    name: 'Golden Idol',
    rarity: RELIC_RARITIES.EVENT,
    icon: '🗿',
    description: 'Enemies drop 25% more Gold.',
    lore: 'A heavy, cursed idol radiating magnetic avarice.',
    onCombatEnd() {}
  },

  preserved_insect: {
    id: 'preserved_insect',
    name: 'Preserved Insect',
    rarity: RELIC_RARITIES.UNCOMMON,
    icon: '🦗',
    description: 'Enemies in Elite combats have 25% less Max HP.',
    lore: 'An ancient petrified beetle whose musk weakens giant horrors.',
    onCombatStart(combat) {
      if (combat.encounterType === 'ELITE') {
        combat.enemies.forEach(e => {
          e.maxHp = Math.floor(e.maxHp * 0.75);
          e.currentHp = Math.min(e.currentHp, e.maxHp);
        });
        combat.showCombatText('Elite HP -25% (Insect)', 'all', '#51cf66');
      }
    }
  },

  fossilized_helix: {
    id: 'fossilized_helix',
    name: 'Fossilized Helix',
    rarity: RELIC_RARITIES.RARE,
    icon: '🐚',
    description: 'Prevent the first time you would lose HP in each combat.',
    lore: 'An indestructible prehistoric ammonite shell.',
    onCombatStart(combat) {
      combat.player.status.buffer = 1;
      combat.showCombatText('Buffer Active (Helix)', 'player', '#74c0fc');
    }
  },

  bronze_scales: {
    id: 'bronze_scales',
    name: 'Bronze Scales',
    rarity: RELIC_RARITIES.COMMON,
    icon: '🐉',
    description: 'Start each combat with 3 Thorns (deal 3 retaliate damage when attacked).',
    lore: 'Hardened scales taken from a wyvern that shred assailants on impact.',
    onCombatStart(combat) {
      combat.player.status.flameBarrier = (combat.player.status.flameBarrier || 0) + 3;
      combat.showCombatText('+3 Thorns (Bronze Scales)', 'player', '#ffd43b');
    }
  },

  regal_pillow: {
    id: 'regal_pillow',
    name: 'Regal Pillow',
    rarity: RELIC_RARITIES.COMMON,
    icon: '🛌',
    description: 'Heal an additional 15 HP when resting at Campfires.',
    lore: 'Plush velvet stuffed with swan feathers found inside a ruined royal manor.'
  },

  eternal_feather: {
    id: 'eternal_feather',
    name: 'Eternal Feather',
    rarity: RELIC_RARITIES.UNCOMMON,
    icon: '🪶',
    description: 'For every 5 cards in your deck, heal 3 HP whenever you enter a Rest Site.',
    lore: 'A glowing plume that softly warms tired wanderers.'
  },

  // ==========================================================================
  // BOSS RELICS (POWERFUL ENERGY ENHANCERS WITH DRAWBACKS)
  // ==========================================================================

  cursed_key: {
    id: 'cursed_key',
    name: 'Cursed Key',
    rarity: RELIC_RARITIES.BOSS,
    icon: '🗝️☠️',
    description: 'Gain 1 Energy at the start of each turn. Whenever you open a non-boss chest, obtain a Curse.',
    lore: 'Kunci berkarat yang mengeluarkan derap energi gelap, namun menarik kutukan dari setiap peti harta.',
    onTurnStart(combat) {
      combat.energy += 1;
      combat.showCombatText('+1 Energy (Cursed Key)', 'player', '#ffd43b');
    }
  },

  philosophers_stone: {
    id: 'philosophers_stone',
    name: "Philosopher's Stone",
    rarity: RELIC_RARITIES.BOSS,
    icon: '💎🔥',
    description: 'Gain 1 Energy at the start of each turn. ALL enemies start with 1 Strength.',
    lore: 'Batu merah transmutasi yang melipatgandakan energi bearer, namun memancarkan aura permusuhan yang memperkuat lawan.',
    onCombatStart(combat) {
      combat.enemies.forEach(e => {
        if (!e.isDead && !e.hasEscaped) {
          e.status.strength = (e.status.strength || 0) + 1;
        }
      });
      combat.showCombatText('Enemies +1 STR (Stone Aura)', 'all', '#ff6b6b');
    },
    onTurnStart(combat) {
      combat.energy += 1;
      combat.showCombatText('+1 Energy (Stone)', 'player', '#ffd43b');
    }
  },

  velvet_choker: {
    id: 'velvet_choker',
    name: 'Velvet Choker',
    rarity: RELIC_RARITIES.BOSS,
    icon: '📿🎀',
    description: 'Gain 1 Energy at the start of each turn. You cannot play more than 6 cards per turn.',
    lore: 'Kalung beludru mewah yang menjerat leher, membatasi kecepatan ayunan tangan pahlawan.',
    onTurnStart(combat) {
      combat.energy += 1;
      combat.showCombatText('+1 Energy (Choker)', 'player', '#ffd43b');
    }
  },

  sozu: {
    id: 'sozu',
    name: 'Sozu Sacred Flask',
    rarity: RELIC_RARITIES.BOSS,
    icon: '🎋💧',
    description: 'Gain 1 Energy at the start of each turn. You can no longer obtain or brew potions.',
    lore: 'Pancuran bambu suci yang menyucikan raga dari segala zat adiktif ramuan.',
    onTurnStart(combat) {
      combat.energy += 1;
      combat.showCombatText('+1 Energy (Sozu)', 'player', '#ffd43b');
    }
  },

  runic_dome: {
    id: 'runic_dome',
    name: 'Runic Dome',
    rarity: RELIC_RARITIES.BOSS,
    icon: '🏛️🔮',
    description: 'Gain 1 Energy at the start of each turn. You can no longer see enemy intents.',
    lore: 'Kubah runik hampa yang mengaburkan pandangan firasat pahlawan di medan laga.',
    onTurnStart(combat) {
      combat.energy += 1;
      combat.showCombatText('+1 Energy (Runic Dome)', 'player', '#ffd43b');
    }
  },

  fusion_hammer: {
    id: 'fusion_hammer',
    name: 'Fusion Forge Hammer',
    rarity: RELIC_RARITIES.BOSS,
    icon: '🔨⚡',
    description: 'Gain 1 Energy at the start of each turn. You can no longer Smith at Rest Sites.',
    lore: 'Palu fusi terlarang yang melenyapkan kebutuhan akan tempa biasa demi cadangan energi abadi.',
    onTurnStart(combat) {
      combat.energy += 1;
      combat.showCombatText('+1 Energy (Fusion Hammer)', 'player', '#ffd43b');
    }
  },

  coffee_dripper: {
    id: 'coffee_dripper',
    name: 'Coffee Dripper',
    rarity: RELIC_RARITIES.BOSS,
    icon: '☕🔥',
    description: 'Gain 1 Energy at the start of each turn. You can no longer Rest at Rest Sites.',
    lore: 'Tetesan kopi hitam pekat yang mencegah rasa kantuk selamanya.',
    onTurnStart(combat) {
      combat.energy += 1;
      combat.showCombatText('+1 Energy (Dripper)', 'player', '#ffd43b');
    }
  },

  // ==========================================================================
  // SHOP & TACTICAL RELICS
  // ==========================================================================

  membership_card: {
    id: 'membership_card',
    name: 'Guild Membership Card',
    rarity: RELIC_RARITIES.SHOP,
    icon: '💳🪙',
    description: 'Gain a 50% discount on all purchases in the Merchant Shop.',
    lore: 'Kartu keanggotaan rahasia sindikat saudagar bayangan Shadowspire.',
    onCombatStart() {}
  },

  sling_of_courage: {
    id: 'sling_of_courage',
    name: 'Sling of Courage',
    rarity: RELIC_RARITIES.SHOP,
    icon: '🪨✨',
    description: 'Start Elite combats with 2 additional Strength.',
    lore: 'Ketapel kecil berbatu kristal yang memberikan keberanian saat menghadapi monster raksasa.',
    onCombatStart(combat) {
      if (combat.encounterType === 'ELITE') {
        combat.applyPlayerStatus('strength', 2);
        combat.showCombatText('+2 STR (Sling vs Elite)', 'player', '#ff4d4d');
      }
    }
  },

  hand_drill: {
    id: 'hand_drill',
    name: 'Pneumatic Hand Drill',
    rarity: RELIC_RARITIES.SHOP,
    icon: '🔩⚙️',
    description: 'Whenever you break an enemy Block with an attack, apply 2 Vulnerable.',
    lore: 'Bor mekanik putar yang mengebor titik retak perisai baja lawan.',
    onCombatStart() {}
  },

  strange_spoon: {
    id: 'strange_spoon',
    name: 'Strange Spoon',
    rarity: RELIC_RARITIES.SHOP,
    icon: '🥄🌀',
    description: 'Cards which Exhaust when played have a 50% chance to be discarded instead.',
    lore: 'Sendok ajaib yang membelokkan partikel kartu yang seharusnya terbakar habis.',
    onCombatStart() {}
  },

  // ==========================================================================
  // RARE COMBAT ARTIFACTS
  // ==========================================================================

  dead_branch: {
    id: 'dead_branch',
    name: 'Dead Branch',
    rarity: RELIC_RARITIES.RARE,
    icon: '🪵✨',
    description: 'Whenever you Exhaust a card, add a random card to your hand.',
    lore: 'Ranting kayu keramat dari Pohon Dunia yang menumbuhkan tunas baru dari abu pembakaran.',
    onCardPlay(combat, card) {
      if (card && card.exhaust) {
        const randomCard = window.getRandomCardReward(1)[0];
        if (randomCard && combat.hand.length < 10) {
          combat.hand.push(randomCard);
          combat.showCombatText(`+Branch: ${randomCard.name}`, 'player', '#51cf66');
          if (window.spireAudio) window.spireAudio.playCardDraw();
        }
      }
    }
  },

  ice_cream: {
    id: 'ice_cream',
    name: 'Ice Cream Core',
    rarity: RELIC_RARITIES.RARE,
    icon: '🍨❄️',
    description: 'Energy is now conserved between turns.',
    lore: 'Gumpalan es magis yang menjaga energi tersisa tetap dingin dan dapat dipakai pada giliran berikutnya.',
    onTurnEnd(combat) {
      combat.player.status.retainEnergy = combat.energy;
    },
    onTurnStart(combat) {
      if (combat.player.status.retainEnergy > 0) {
        combat.energy += combat.player.status.retainEnergy;
        combat.showCombatText(`+${combat.player.status.retainEnergy} Retained Energy!`, 'player', '#74c0fc');
        combat.player.status.retainEnergy = 0;
      }
    }
  },

  shuriken: {
    id: 'shuriken',
    name: 'Ninja Shuriken',
    rarity: RELIC_RARITIES.UNCOMMON,
    icon: '🥷⭐',
    counter: 0,
    description: 'Every time you play 3 Attacks in a single turn, gain 1 Strength.',
    lore: 'Bintang lempar tersembunyi yang mengasah ketajaman teknik tempur beruntun.',
    onCardPlay(combat, card, relicInstance) {
      if (card.type === window.CARD_TYPES.ATTACK) {
        relicInstance.counter = (relicInstance.counter || 0) + 1;
        if (relicInstance.counter >= 3) {
          relicInstance.counter = 0;
          combat.applyPlayerStatus('strength', 1);
          combat.showCombatText('+1 STR (Shuriken Combo)!', 'player', '#ff4d4d');
          if (window.spireAudio) window.spireAudio.playPowerBuff();
        }
      }
    },
    onTurnEnd(combat, relicInstance) {
      relicInstance.counter = 0;
    }
  },

  kunai: {
    id: 'kunai',
    name: 'Ninja Kunai',
    rarity: RELIC_RARITIES.UNCOMMON,
    icon: '🗡️⭐',
    counter: 0,
    description: 'Every time you play 3 Attacks in a single turn, gain 1 Dexterity.',
    lore: 'Belati lempar presisi yang melatih kelincahan gerak menghindar sang pahlawan.',
    onCardPlay(combat, card, relicInstance) {
      if (card.type === window.CARD_TYPES.ATTACK) {
        relicInstance.counter = (relicInstance.counter || 0) + 1;
        if (relicInstance.counter >= 3) {
          relicInstance.counter = 0;
          combat.applyPlayerStatus('dexterity', 1);
          combat.showCombatText('+1 DEX (Kunai Combo)!', 'player', '#51cf66');
          if (window.spireAudio) window.spireAudio.playPowerBuff();
        }
      }
    },
    onTurnEnd(combat, relicInstance) {
      relicInstance.counter = 0;
    }
  },

  ornamental_fan: {
    id: 'ornamental_fan',
    name: 'Ornamental Silk Fan',
    rarity: RELIC_RARITIES.UNCOMMON,
    icon: '🪭💨',
    counter: 0,
    description: 'Every time you play 3 Attacks in a single turn, gain 4 Block.',
    lore: 'Kipas sutra hias berbingkai baja yang menciptakan hembusan angin perisai.',
    onCardPlay(combat, card, relicInstance) {
      if (card.type === window.CARD_TYPES.ATTACK) {
        relicInstance.counter = (relicInstance.counter || 0) + 1;
        if (relicInstance.counter >= 3) {
          relicInstance.counter = 0;
          combat.gainPlayerBlock(4);
          combat.showCombatText('+4 Block (Fan Combo)!', 'player', '#74c0fc');
          if (window.spireAudio) window.spireAudio.playBlock();
        }
      }
    },
    onTurnEnd(combat, relicInstance) {
      relicInstance.counter = 0;
    }
  },

  thread_and_needle: {
    id: 'thread_and_needle',
    name: 'Thread and Needle',
    rarity: RELIC_RARITIES.RARE,
    icon: '🧵🪡',
    description: 'At the start of combat, gain 4 Plated Armor (gain 4 Block at end of turn; reduces by 1 when unblocked damage is taken).',
    lore: 'Benang perak ajaib yang otomatis merajut perisai pelindung di akhir giliran.',
    onCombatStart(combat) {
      combat.player.status.platedArmor = 4;
      combat.showCombatText('+4 Plated Armor!', 'player', '#ced4da');
    },
    onTurnEnd(combat) {
      if (combat.player.status.platedArmor > 0) {
        combat.gainPlayerBlock(combat.player.status.platedArmor);
        combat.showCombatText(`+${combat.player.status.platedArmor} Block (Thread)`, 'player', '#ced4da');
      }
    }
  },

  incense_burner: {
    id: 'incense_burner',
    name: 'Incense Burner',
    rarity: RELIC_RARITIES.RARE,
    icon: '🪔💨',
    counter: 0,
    description: 'Every 6 turns, gain 1 Intangible (reduce all damage taken to 1).',
    lore: 'Pedupaan mistis yang mengepulkan asap hampa, menjadikan raga tembus pandang.',
    onTurnStart(combat, relicInstance) {
      relicInstance.counter = (relicInstance.counter || 0) + 1;
      if (relicInstance.counter >= 6) {
        relicInstance.counter = 0;
        combat.player.status.intangible = 1;
        combat.showCombatText('INTANGIBLE ACTIVE! (All Dmg = 1)', 'player', '#da77f2');
        if (window.spireAudio) window.spireAudio.playPowerBuff();
      }
    }
  },


  // ==========================================================================
  // EXTENDED ARTIFACTS & RELIC VAULT
  // ==========================================================================

  pantograph: {
    id: 'pantograph',
    name: 'Brass Pantograph',
    rarity: RELIC_RARITIES.UNCOMMON,
    icon: '📐✨',
    description: 'At the start of Boss combats, heal 25 HP.',
    lore: 'Alat ukur presisi perunggu yang memulihkan energi sebelum pertempuran penentuan.',
    onCombatStart(combat) {
      if (combat.encounterType === 'BOSS') {
        combat.healPlayer(25);
        combat.showCombatText('+25 HP (Pantograph vs Boss)', 'player', '#51cf66');
      }
    }
  },

  singing_bowl: {
    id: 'singing_bowl',
    name: 'Tibetan Singing Bowl',
    rarity: RELIC_RARITIES.UNCOMMON,
    icon: '🥣🎶',
    description: 'When adding cards to deck, you may choose +2 Max HP instead.',
    lore: 'Mangkuk tembaga suci yang mengeluarkan resonansi penyembuh batin.',
    onCombatStart() {}
  },

  tungsten_rod: {
    id: 'tungsten_rod',
    name: 'Tungsten Rod',
    rarity: RELIC_RARITIES.RARE,
    icon: '🥢🛡️',
    description: 'Whenever you would lose HP, lose 1 less HP.',
    lore: 'Batangan logam wolfram terpadat yang membatalkan sedikit dampak setiap benturan.',
    onDamageReceived(combat, relicInst, damage) {
      if (damage > 0) return Math.max(0, damage - 1);
      return damage;
    }
  },

  calipers: {
    id: 'calipers',
    name: 'Clockwork Calipers',
    rarity: RELIC_RARITIES.RARE,
    icon: '🗜️⚙️',
    description: 'At the start of your turn, lose 15 Block instead of all Block.',
    lore: 'Alat jepit roda gigi yang mempertahankan sebagian besar tameng pertahanan.',
    onTurnStart() {}
  },

  gambling_chip: {
    id: 'gambling_chip',
    name: 'Gambling Chip',
    rarity: RELIC_RARITIES.RARE,
    icon: '🎰🃏',
    description: 'At the start of combat, discard any number of cards and draw that many.',
    lore: 'Keping koin taruhan yang memungkinkan penyusunan tangan pembuka terbaik.',
    onCombatStart(combat) {
      combat.showCombatText('Gambling Chip Ready', 'player', '#ffd43b');
    }
  },


  // ==========================================================================
  // SACRED VAULT EXPANSION
  // ==========================================================================

  du_vu_doll: {
    id: 'du_vu_doll',
    name: 'Du-Vu Voodoo Doll',
    rarity: RELIC_RARITIES.RARE,
    icon: '🪆💀',
    description: 'For every Curse in your deck, start combat with 1 additional Strength.',
    lore: 'Boneka jerami santet yang menyalurkan setiap kutukan di ransel menjadi kekuatan pukulan.',
    onCombatStart(combat) {
      const curses = (window.gameState.deck || []).filter(c => c.type === window.CARD_TYPES.CURSE).length;
      if (curses > 0) {
        combat.applyPlayerStatus('strength', curses);
        combat.showCombatText(`+${curses} STR (Du-Vu Doll)`, 'player', '#ff4d4d');
      }
    }
  },

  charons_ashes: {
    id: 'charons_ashes',
    name: "Charon's Ashes",
    rarity: RELIC_RARITIES.RARE,
    icon: '🏺🔥',
    description: 'Whenever you Exhaust a card, deal 3 damage to ALL enemies.',
    lore: 'Guci abu pembawa arwah yang melepaskan bara neraka setiap kali kartu dihanguskan.',
    onCardPlay(combat, card) {
      if (card && card.exhaust) {
        combat.dealDamageToAllEnemies(3);
        combat.showCombatText('3 Ash Damage!', 'all', '#ff6b6b');
        combat.triggerVfx('fire_burst', 'all');
      }
    }
  },

  magic_flower: {
    id: 'magic_flower',
    name: 'Magic Flower',
    rarity: RELIC_RARITIES.RARE,
    icon: '🌸✨',
    description: 'Healing is 50% more effective during combat.',
    lore: 'Bunga berkelopak tujuh warna yang mempercepat regenerasi sel daging pahlawan.',
    onCombatStart() {}
  },

  torii_gate_shrine: {
    id: 'torii_gate_shrine',
    name: 'Sanctified Torii Shrine',
    rarity: RELIC_RARITIES.RARE,
    icon: '⛩️✨',
    description: 'Whenever you would take 5 or less unblocked attack damage, reduce it to 1.',
    lore: 'Pintu gerbang kuil suci penangkal tebasan minor.',
    onCombatStart() {}
  },

  specimen_flask: {
    id: 'specimen_flask',
    name: 'The Toxic Specimen',
    rarity: RELIC_RARITIES.RARE,
    icon: '🧪🪱',
    description: 'Whenever an enemy dies, transfer its Poison to a random enemy.',
    lore: 'Spesimen cacing parasit yang berpindah ke inang baru saat inang lama mati keracunan.',
    onCombatStart() {}
  },

  turnip_relic: {
    id: 'turnip_relic',
    name: 'Holy Turnip',
    rarity: RELIC_RARITIES.RARE,
    icon: '🧅🛡️',
    description: 'You can no longer become Frail.',
    lore: 'Umbi suci bergizi tinggi yang menjaga kekuatan perisai tetap optimal.',
    onCombatStart() {}
  },

  ginger_relic: {
    id: 'ginger_relic',
    name: 'Medicinal Ginger',
    rarity: RELIC_RARITIES.RARE,
    icon: '🫚✨',
    description: 'You can no longer become Weak.',
    lore: 'Rimpang jahe penghangat lambung yang menangkal kelemahan otot pahlawan.',
    onCombatStart() {}
  },

  // ==========================================================================
  // RELIC SPESIAL REFERENSI ANIME LEGENDARIS
  // ==========================================================================

  sukuna_finger: {
    id: 'sukuna_finger',
    name: 'Cursed Demon Finger',
    rarity: RELIC_RARITIES.RARE,
    icon: '👹🖐️',
    description: 'Start combat with +2 Strength, but lose 3 HP.',
    lore: 'Jari beracun raja kutukan kuno yang memancarkan energi kutukan jahat (Jujutsu Kaisen nod).',
    onCombatStart(combat) {
      combat.player.status.strength = (combat.player.status.strength || 0) + 2;
      window.gameState.takeDamage(3);
      combat.showCombatText('Cursed Finger (+2 STR, -3 HP)', 'player', '#ff2a2a');
      if (window.spireAudio && window.spireAudio.playRelicTrigger) window.spireAudio.playRelicTrigger();
    }
  },

  straw_hat: {
    id: 'straw_hat',
    name: 'Straw Hat of Will',
    rarity: RELIC_RARITIES.UNCOMMON,
    icon: '👒🍖',
    description: 'Whenever you take unblocked damage, gain 4 Block.',
    lore: 'Topi jerami legendaris yang menyimpan tekad membara sang penakluk samudra (One Piece nod).',
    onDamageReceived(combat, relicInst, unblockedDmg) {
      if (unblockedDmg > 0) {
        combat.gainPlayerBlock(4);
        combat.showCombatText('Willpower (+4 Block)', 'player', '#ffd43b');
        if (window.spireAudio && window.spireAudio.playRelicTrigger) window.spireAudio.playRelicTrigger();
      }
      return unblockedDmg;
    }
  },

  behelit_relic: {
    id: 'behelit_relic',
    name: 'Crimson Behelit',
    rarity: RELIC_RARITIES.RARE,
    icon: '🥚🩸',
    description: 'When HP drops below 35%, immediately gain 2 Energy and 3 Strength.',
    lore: 'Telur penguasa takdir yang menangis darah saat keputusasaan melanda (Berserk nod).',
    onDamageReceived(combat, relicInst, unblockedDmg) {
      if (unblockedDmg > 0 && !relicInst.usedInCombat) {
        const p = window.gameState.player;
        if (p && p.currentHp <= Math.floor(p.maxHp * 0.35)) {
          relicInst.usedInCombat = true;
          combat.energy += 2;
          combat.player.status.strength = (combat.player.status.strength || 0) + 3;
          combat.showCombatText('ECLIPSE! (+2 Energy, +3 STR)', 'player', '#ff0000', true);
          if (window.spireAudio && window.spireAudio.playRelicTrigger) window.spireAudio.playRelicTrigger();
          window.spireVfx.triggerScreenShake('heavy');
        }
      }
      return unblockedDmg;
    },
    onCombatStart(combat, relicInst) {
      if (relicInst) relicInst.usedInCombat = false;
    }
  }

};

class Relic {
  constructor(relicDef) {
    this.id = relicDef.id;
    this.name = relicDef.name;
    this.rarity = relicDef.rarity;
    this.icon = relicDef.icon;
    this.description = relicDef.description;
    this.lore = relicDef.lore || '';
    this.counter = relicDef.counter !== undefined ? 0 : null;
    this.baseDef = relicDef;
  }

  trigger(hookName, combat, extraArg = null) {
    if (typeof this.baseDef[hookName] === 'function') {
      return this.baseDef[hookName](combat, this, extraArg);
    }
    return extraArg;
  }
}

function getRandomRelic(existingRelics = []) {
  const existingIds = new Set(existingRelics.map(r => r.id));
  const pool = Object.values(RELIC_DATABASE).filter(r => r.rarity !== RELIC_RARITIES.STARTER && !existingIds.has(r.id));
  if (pool.length === 0) return null;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return new Relic(picked);
}

window.RELIC_RARITIES = RELIC_RARITIES;
window.RELIC_DATABASE = RELIC_DATABASE;
window.Relic = Relic;
window.getRandomRelic = getRandomRelic;
