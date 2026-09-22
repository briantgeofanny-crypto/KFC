/**
 * ============================================================================
 * SHADOWSPIRE: CHRONICLES OF ASCENSION - MASTER APPLICATION & UI CONTROLLER
 * ============================================================================
 * Mengendalikan alur lengkap: Intro Splash -> Menu Utama -> Pemilihan Difficulty ->
 * Pemilihan 10 Pahlawan -> Prolog Cerita Naratif -> Peta Exordium -> Arena Tempur.
 * Dilengkapi pengaturan volume audio, toggle screen shake, dan transisi curtain halus.
 */

class SpireApp {
  constructor() {
    this.currentScreen = 'INTRO_SPLASH_SCREEN';
    this.selectedHeroKey = 'ironclad';
    this.selectedDifficultyKey = 'NORMAL';
    this.selectedCard = null;
    this.draggedCardElement = null;
    this.hoveredEnemy = null;
    this.isDragging = false;
  }

  init() {
    const canvas = document.getElementById('vfxCanvas');
    if (canvas && window.spireVfx) {
      window.spireVfx.init(canvas);
    }

    this.setupGlobalEvents();

    // Cek apakah ada save file aktif untuk tombol Lanjutkan
    const hasSave = window.gameState ? window.gameState.loadRun() : false;
    const btnContinue = document.getElementById('btnContinueFromMain');
    if (btnContinue) {
      btnContinue.style.display = hasSave ? 'flex' : 'none';
    }

    // Inisialisasi bahasa (i18n)
    if (window.i18n) {
      window.i18n.applyTranslations();
      const currentLang = window.i18n.getLanguage();
      const btns = document.querySelectorAll('.lang-btn');
      btns.forEach(b => {
        if (b.dataset.lang === currentLang) b.classList.add('active');
        else b.classList.remove('active');
      });
    }

    // Layar awal adalah Intro Splash Screen
    this.switchScreen('INTRO_SPLASH_SCREEN');
  }

  setupGlobalEvents() {
    window.addEventListener('mousemove', (e) => {
      if (this.selectedCard && window.spireVfx) {
        window.spireVfx.updateTargeting(e.clientX, e.clientY, this.hoveredEnemy !== null);
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (this.selectedCard) {
        this.handleCardRelease(e);
      }
    });

    window.addEventListener('contextmenu', (e) => {
      if (this.selectedCard) {
        e.preventDefault();
        this.cancelCardSelection();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (this.currentScreen === 'INTRO_SPLASH_SCREEN') {
        this.enterFromSplashScreen();
        return;
      }

      
      const bossOverlay = document.getElementById('bossCinematicOverlay');
      if (bossOverlay && bossOverlay.classList.contains('active')) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          this.dismissBossCinematic();
          return;
        }
      }

      if (e.key === 'Escape') {
        this.cancelCardSelection();
        this.closeAllModals();
      } else if (e.key === 'e' || e.key === 'E') {
        if (this.currentScreen === 'COMBAT_SCREEN' && window.spireCombat && window.spireCombat.isPlayerTurn) {
          window.spireCombat.endTurn();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (this.currentScreen === 'COMBAT_SCREEN' && window.spireCombat && window.spireCombat.isPlayerTurn) {
          window.spireCombat.useActiveSkill();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        if (this.currentScreen === 'COMBAT_SCREEN' || this.currentScreen === 'CAMPFIRE_SCREEN' || this.currentScreen === 'SHOP_SCREEN') {
          this.openMapScreen();
        }
      } else if (e.key === 'd' || e.key === 'D') {
        this.openDeckViewerModal('VIEW');
      } else if (e.key >= '1' && e.key <= '9') {
        if (this.currentScreen === 'COMBAT_SCREEN' && window.spireCombat && window.spireCombat.isPlayerTurn) {
          const cardIdx = parseInt(e.key) - 1;
          if (cardIdx >= 0 && cardIdx < window.spireCombat.hand.length) {
            const targetCard = window.spireCombat.hand[cardIdx];
            const cardElem = document.getElementById(targetCard.uid);
            if (cardElem) {
              if (targetCard.target === window.TARGET_TYPES.ENEMY) {
                this.startCardDrag(targetCard, cardElem, { clientX: window.innerWidth / 2, clientY: window.innerHeight * 0.85 });
              } else {
                window.spireCombat.playCard(targetCard.uid, null);
              }
            }
          }
        }
      }
    });
  }

  // ==========================================
  // 1. INTRO SPLASH & MAIN MENU FLOW
  // ==========================================
  enterFromSplashScreen() {
    if (this.currentScreen !== 'INTRO_SPLASH_SCREEN') return;
    if (window.spireAudio) {
      window.spireAudio.init();
      window.spireAudio.playEndTurn();
    }
    this.switchScreen('MAIN_MENU_SCREEN');
  }

  goToDifficultySelect() {
    if (window.spireAudio) window.spireAudio.playClick();
    this.renderDifficultyCards();
    this.switchScreen('DIFFICULTY_SCREEN');
  }

  renderDifficultyCards() {
    const grid = document.getElementById('difficultyCardsGrid');
    if (!grid || !window.DIFFICULTY_DATABASE) return;
    grid.innerHTML = '';

    Object.values(window.DIFFICULTY_DATABASE).forEach(diff => {
      const isSel = diff.id === this.selectedDifficultyKey;
      const card = document.createElement('div');
      card.className = `difficulty-card-option ${isSel ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="difficulty-badge" style="background: rgba(0,0,0,0.4); border: 1px solid ${diff.color}; color: ${diff.color};">${diff.badge}</div>
        <h3 class="difficulty-title" style="color: ${diff.color};">${diff.name}</h3>
        <p class="difficulty-desc">${diff.desc}</p>
        <button type="button" class="diff-select-action-btn ${isSel ? 'active-select' : ''}">
          ${isSel ? '✓ MODE TERPILIH (Lanjut ➔)' : 'Pilih Mode Ini ➔'}
        </button>
      `;

      card.addEventListener('click', (e) => {
        this.selectedDifficultyKey = diff.id;
        this.confirmDifficultyAndProceed();
      });

      const btn = card.querySelector('.diff-select-action-btn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectedDifficultyKey = diff.id;
          this.confirmDifficultyAndProceed();
        });
      }

      grid.appendChild(card);
    });

    const confirmBtn = document.getElementById('btnConfirmDifficulty');
    if (confirmBtn && window.DIFFICULTY_DATABASE[this.selectedDifficultyKey]) {
      const curDiff = window.DIFFICULTY_DATABASE[this.selectedDifficultyKey];
      confirmBtn.innerHTML = `Pilih Pahlawan (${curDiff.name.split(':')[0]}) ➔`;
    }
  }

  confirmDifficultyAndProceed() {
    try {
      if (window.spireAudio) window.spireAudio.playClick();
      this.selectedHeroKey = this.selectedHeroKey || 'ironclad';
      this.switchScreen('HERO_SELECT_SCREEN');
      this.renderHeroSelectorTabs();
      this.renderHeroShowcase(this.selectedHeroKey);
    } catch (err) {
      console.error('Error transitioning to hero select:', err);
      this.performScreenSwitch('HERO_SELECT_SCREEN');
    }
  }

  renderHeroSelectorTabs() {
    const container = document.getElementById('heroSelectorNav');
    if (!container || !window.CHARACTER_DATABASE) return;
    container.innerHTML = '';

    Object.values(window.CHARACTER_DATABASE).forEach(hero => {
      const tab = document.createElement('button');
      const isAnime = (hero.id === 'shadow_monarch' || hero.id === 'limitless_sorcerer');
      tab.className = `hero-tab-btn tab-${hero.id} ${hero.id === this.selectedHeroKey ? 'active' : ''}`;
      tab.innerHTML = `
        <span class="hero-tab-icon">${hero.avatarIcon}</span>
        <span>${hero.name}</span>
        ${isAnime ? `<span class="hero-anime-new-tag">ANIME</span>` : ''}
      `;
      tab.addEventListener('click', () => {
        this.selectedHeroKey = hero.id;
        if (window.spireAudio) window.spireAudio.playClick();
        this.renderHeroSelectorTabs();
        this.renderHeroShowcase(hero.id);
      });
      container.appendChild(tab);
    });
  }

  renderHeroShowcase(heroKey = 'ironclad') {
    const stage = document.getElementById('heroShowcaseStage');
    if (!stage) return;

    const hKey = (heroKey && window.CHARACTER_DATABASE && window.CHARACTER_DATABASE[heroKey])
      ? heroKey
      : (this.selectedHeroKey || 'ironclad');

    const hero = (window.CHARACTER_DATABASE && window.CHARACTER_DATABASE[hKey])
      ? window.CHARACTER_DATABASE[hKey]
      : (window.CHARACTER_DATABASE ? Object.values(window.CHARACTER_DATABASE)[0] : null);

    if (!hero) return;

    const deckTagsHtml = (hero.starterDeck || []).map(cardId => {
      const cardDef = window.CARD_DATABASE ? window.CARD_DATABASE[cardId] : null;
      const name = cardDef ? cardDef.name : cardId;
      return `<span class="showcase-card-tag">${name}</span>`;
    }).join('');

    const p1 = hero.passive1 || { name: 'Pasif 1', icon: '✨', description: 'Efek pasif pertama.' };
    const p2 = hero.passive2 || { name: 'Pasif 2', icon: '🔥', description: 'Efek pasif kedua.' };

    stage.innerHTML = `
      <div class="showcase-avatar-col">
        <div class="showcase-hero-svg-wrap anim-idle">${hero.avatarSvg || '<span style="font-size:64px;">⚔️</span>'}</div>
        <div class="showcase-hero-pedestal"></div>
        <div class="showcase-anim-bar">
          <div class="showcase-anim-label">${window.t ? window.t('hero_preview_title', 'PREVIEW AKSI HERO:') : 'PREVIEW AKSI HERO:'}</div>
          <div class="showcase-anim-btns">
            <button class="showcase-anim-btn active" data-anim="idle" onclick="spireApp.playHeroPreviewAnimation('idle')">${window.t ? window.t('hero_anim_idle', '🧍 Siaga') : '🧍 Siaga'}</button>
            <button class="showcase-anim-btn" data-anim="run" onclick="spireApp.playHeroPreviewAnimation('run')">${window.t ? window.t('hero_anim_run', '🏃 Lari') : '🏃 Lari'}</button>
            <button class="showcase-anim-btn" data-anim="attack" onclick="spireApp.playHeroPreviewAnimation('attack')">${window.t ? window.t('hero_anim_attack', '⚔️ Serang') : '⚔️ Serang'}</button>
            <button class="showcase-anim-btn" data-anim="magic" onclick="spireApp.playHeroPreviewAnimation('magic')">${window.t ? window.t('hero_anim_magic', '✨ Sihir') : '✨ Sihir'}</button>
          </div>
        </div>
      </div>

      <div class="showcase-info-col">
        <div class="showcase-hero-header">
          <h2 class="showcase-hero-name" style="color: ${hero.themeColor || '#fff'}">${hero.name}</h2>
          <div class="showcase-hero-title">${hero.title}</div>
        </div>
        <div class="showcase-hero-desc">${hero.description}</div>
        
        <div class="showcase-stats-row">
          <div class="showcase-stat-pill hp">❤️ ${hero.maxHp} HP</div>
          <div class="showcase-stat-pill gold">💰 ${hero.gold} Gold</div>
        </div>

        <div class="showcase-passives-list">
          <div class="showcase-passive-card">
            <div class="showcase-passive-icon">${p1.icon}</div>
            <div class="showcase-passive-body">
              <div class="showcase-passive-header-row">
                <span class="showcase-passive-badge">${window.t ? window.t('hero_passive_1', 'PASIF 1') : 'PASIF 1'}</span>
                <span class="showcase-passive-title">${p1.name}</span>
              </div>
              <div class="showcase-passive-desc">${p1.description}</div>
            </div>
          </div>

          <div class="showcase-passive-card passive-two">
            <div class="showcase-passive-icon">${p2.icon}</div>
            <div class="showcase-passive-body">
              <div class="showcase-passive-header-row">
                <span class="showcase-passive-badge badge-two">${window.t ? window.t('hero_passive_2', 'PASIF 2') : 'PASIF 2'}</span>
                <span class="showcase-passive-title">${p2.name}</span>
              </div>
              <div class="showcase-passive-desc">${p2.description}</div>
            </div>
          </div>

          ${hero.activeSkill ? `
            <div class="showcase-passive-card active-skill-card">
              <div class="showcase-passive-icon">${hero.activeSkill.icon || '⚡'}</div>
              <div class="showcase-passive-body">
                <div class="showcase-passive-header-row">
                  <span class="showcase-passive-badge badge-active-skill">${window.t ? window.t('hero_active_skill', 'JURUS AKTIF [R]') : 'JURUS AKTIF [R]'}</span>
                  <span class="showcase-passive-title">${hero.activeSkill.name}</span>
                </div>
                <div class="showcase-passive-desc">${hero.activeSkill.description} (Cooldown: ${hero.activeSkill.cooldown}T)</div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="showcase-deck-col">
        <div class="showcase-deck-heading">${window.t ? window.t('hero_starter_deck', '🃏 Starter Deck') : '🃏 Starter Deck'} (${(hero.starterDeck || []).length} Kartu)</div>
        <div class="showcase-deck-tags">${deckTagsHtml}</div>
      </div>
    `;
  }

  playHeroPreviewAnimation(animType) {
    const wrap = document.querySelector('.showcase-hero-svg-wrap');
    const btns = document.querySelectorAll('.showcase-anim-btn');
    if (!wrap) return;

    btns.forEach(b => {
      if (b.dataset.anim === animType) b.classList.add('active');
      else b.classList.remove('active');
    });

    wrap.classList.remove('anim-idle', 'anim-run', 'anim-attack', 'anim-magic');
    void wrap.offsetWidth;
    wrap.classList.add(`anim-${animType}`);

    if (window.spireAudio) {
      if (animType === 'run') {
        if (window.spireAudio.playClick) window.spireAudio.playClick();
      } else if (animType === 'attack') {
        if (window.spireAudio.playAttackSlash) window.spireAudio.playAttackSlash(true);
      } else if (animType === 'magic') {
        if (window.spireAudio.playActiveSkillSound) window.spireAudio.playActiveSkillSound();
        else if (window.spireAudio.playPowerBuff) window.spireAudio.playPowerBuff();
      } else {
        if (window.spireAudio.playClick) window.spireAudio.playClick();
      }
    }
  }

  setLanguage(langCode) {
    if (window.spireAudio && window.spireAudio.playClick) window.spireAudio.playClick();
    if (window.i18n) {
      window.i18n.setLanguage(langCode);
    }
  }

  goToPrologueScreen() {
    if (window.spireAudio) window.spireAudio.playPowerBuff();
    const hero = window.CHARACTER_DATABASE[this.selectedHeroKey || 'ironclad'];
    if (!hero) return;

    const badge = document.getElementById('prologueHeroBadge');
    const title = document.getElementById('prologueTitle');
    const subtitle = document.getElementById('prologueSubtitle');
    const art = document.getElementById('prologueHeroArt');
    const textElem = document.getElementById('prologueText');

    if (badge) badge.textContent = hero.avatarIcon;
    if (title) title.textContent = `Prolog: ${hero.name}`;
    if (subtitle) subtitle.textContent = hero.title;
    if (art) art.innerHTML = hero.avatarSvg;
    if (textElem) textElem.textContent = hero.prologueStory.trim();

    this.switchScreen('PROLOGUE_SCREEN');
  }

  startNewGameFromPrologue() {
    try {
      if (window.spireAudio) window.spireAudio.playAttackSlash(true);
      window.gameState.startNewRun(this.selectedHeroKey || 'ironclad', this.selectedDifficultyKey || 'NORMAL');
      this.openMapScreen();
    } catch (err) {
      console.error('Error starting new game from prologue:', err);
      this.openMapScreen();
    }
  }

  continueRun() {
    if (window.spireAudio) window.spireAudio.playClick();
    if (window.gameState.loadRun()) {
      this.openMapScreen();
    } else {
      this.goToDifficultySelect();
    }
  }

  // ==========================================
  // 2. CINEMATIC SCENE TRANSITION SWITCHER
  // ==========================================
  switchScreen(screenName) {
    this.performScreenSwitch(screenName);
    const curtain = document.getElementById('sceneTransitionCurtain');
    if (curtain) {
      curtain.classList.add('curtain-closed');
      setTimeout(() => {
        curtain.classList.remove('curtain-closed');
      }, 120);
    }
  }

  performScreenSwitch(screenName) {
    this.currentScreen = screenName;
    const screens = document.querySelectorAll('.screen-view');
    screens.forEach(s => {
      s.classList.remove('active');
      s.style.display = 'none';
    });

    const target = document.getElementById(screenName);
    if (target) {
      target.classList.add('active');
      target.style.display = 'flex';
    }

    if (screenName === 'HERO_SELECT_SCREEN') {
      try {
        this.renderHeroSelectorTabs();
        this.renderHeroShowcase(this.selectedHeroKey || 'ironclad');
      } catch (e) {
        console.error('Error rendering hero components in performScreenSwitch:', e);
      }
    }

    this.renderTopHud();

    if (screenName === 'COMBAT_SCREEN' && window.spireAudio) {
      window.spireAudio.startBgm();
    }
  }

  // ==========================================
  // 3. SETTINGS & EXIT MODALS
  // ==========================================
  openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = 'flex';
  }

  openExitModal() {
    const modal = document.getElementById('exitModal');
    if (modal) modal.style.display = 'flex';
  }

  confirmExitGame() {
    this.closeAllModals();
    this.switchScreen('MAIN_MENU_SCREEN');
    try {
      window.close();
    } catch (e) {
      // Ignored if browser prevents window.close
    }
  }

  confirmExitOrAbandon() {
    if (confirm('Apakah Anda ingin keluar dari pendakian dan kembali ke Menu Utama? Progres Anda tersimpan.')) {
      this.closeAllModals();
      this.switchScreen('MAIN_MENU_SCREEN');
    }
  }

  updateSfxVolume(val) {
    if (window.spireAudio) {
      window.spireAudio.sfxVolume = val / 100;
    }
    window.gameState.settings.sfxVolume = val / 100;
    window.gameState.saveSettings();
  }

  updateBgmVolume(val) {
    if (window.spireAudio) {
      window.spireAudio.bgmVolume = val / 100;
      if (window.spireAudio.bgmGain) {
        window.spireAudio.bgmGain.gain.setValueAtTime(window.spireAudio.bgmVolume * 0.18, window.spireAudio.ctx.currentTime);
      }
    }
    window.gameState.settings.bgmVolume = val / 100;
    window.gameState.saveSettings();
  }

  toggleScreenShake() {
    const btn = document.getElementById('toggleShakeBtn');
    window.gameState.settings.screenShake = !window.gameState.settings.screenShake;
    if (btn) {
      btn.className = `toggle-setting-btn ${window.gameState.settings.screenShake ? 'active' : ''}`;
      btn.textContent = window.gameState.settings.screenShake ? 'Aktif' : 'Nonaktif';
    }
    window.gameState.saveSettings();
  }

  toggleBattleSpeed() {
    const btn = document.getElementById('toggleSpeedBtn');
    window.gameState.settings.battleSpeed = window.gameState.settings.battleSpeed === 1 ? 2 : 1;
    if (btn) {
      btn.textContent = window.gameState.settings.battleSpeed === 2 ? 'Cepat (2x)' : 'Normal (1x)';
      btn.className = `toggle-setting-btn ${window.gameState.settings.battleSpeed === 2 ? 'active' : ''}`;
    }
    window.gameState.saveSettings();
  }

  resetSaveData() {
    if (confirm('PERINGATAN: Seluruh progres petualangan yang tersimpan akan dihapus permanen. Lanjutkan?')) {
      window.gameState.clearSave();
      alert('Data save berhasil direset.');
      this.closeAllModals();
      this.switchScreen('MAIN_MENU_SCREEN');
    }
  }

  // ==========================================
  // 4. TOP HUD BAR
  // ==========================================
  renderTopHud() {
    const hud = document.getElementById('topHud');
    if (!hud || !window.gameState) return;

    if (this.currentScreen === 'INTRO_SPLASH_SCREEN' || this.currentScreen === 'MAIN_MENU_SCREEN' || 
        this.currentScreen === 'DIFFICULTY_SCREEN' || this.currentScreen === 'HERO_SELECT_SCREEN' || 
        this.currentScreen === 'PROLOGUE_SCREEN' || this.currentScreen === 'GAME_OVER_SCREEN') {
      hud.style.display = 'none';
      return;
    }
    hud.style.display = 'flex';

    const p = window.gameState.player;
    const charDef = window.gameState.getCharacterDef();

    const heroIcon = document.getElementById('hudHeroIcon');
    const heroName = document.getElementById('hudHeroName');
    if (heroIcon) heroIcon.textContent = charDef.avatarIcon;
    if (heroName) heroName.textContent = charDef.name;

    const hpText = document.getElementById('hudHpText');
    const hpFill = document.getElementById('hudHpFill');
    const blockBadge = document.getElementById('hudBlockBadge');

    if (hpText) hpText.textContent = `${p.currentHp} / ${p.maxHp}`;
    if (hpFill) {
      const pct = Math.max(0, Math.min(100, (p.currentHp / p.maxHp) * 100));
      hpFill.style.width = `${pct}%`;
    }

    if (blockBadge) {
      const currentBlock = (this.currentScreen === 'COMBAT_SCREEN' && window.spireCombat)
        ? window.spireCombat.player.block
        : 0;
      if (currentBlock > 0) {
        blockBadge.style.display = 'inline-flex';
        blockBadge.innerHTML = `🛡️ ${currentBlock}`;
      } else {
        blockBadge.style.display = 'none';
      }
    }

    const goldText = document.getElementById('hudGoldText');
    if (goldText) goldText.textContent = `${p.gold}`;

    const floorText = document.getElementById('hudFloorText');
    if (floorText) {
      const flr = (window.gameState.map && window.gameState.map.currentNode)
        ? window.gameState.map.currentNode.floor + 1
        : 1;
      const flrLabel = window.t ? window.t('hud_floor', 'Floor') : 'Floor';
      floorText.textContent = `${flrLabel} ${flr} (Exordium)`;
    }

    const relicContainer = document.getElementById('hudRelics');
    if (relicContainer) {
      relicContainer.innerHTML = '';
      (window.gameState.relics || []).forEach(relic => {
        const relicElem = document.createElement('div');
        relicElem.className = 'relic-badge';
        relicElem.innerHTML = `
          <span class="relic-icon">${relic.icon}</span>
          ${relic.counter !== null && relic.counter !== undefined ? `<span class="relic-counter">${relic.counter}</span>` : ''}
          <div class="tooltip-box">
            <strong>${relic.name}</strong>
            <p>${relic.description}</p>
          </div>
        `;
        relicContainer.appendChild(relicElem);
      });
    }

    const potionBelt = document.getElementById('hudPotions');
    if (potionBelt) {
      potionBelt.innerHTML = '';
      (window.gameState.potions || []).forEach((potion, idx) => {
        const slot = document.createElement('div');
        slot.className = `potion-slot ${potion ? 'has-potion' : 'empty'}`;
        if (potion) {
          slot.innerHTML = `
            <span class="potion-icon">${potion.icon}</span>
            <div class="tooltip-box">
              <strong>${potion.name}</strong>
              <p>${potion.description}</p>
              ${this.currentScreen === 'COMBAT_SCREEN' ? `<button class="potion-use-btn" onclick="spireApp.usePotion(${idx})">Gunakan</button>` : ''}
              <button class="potion-discard-btn" onclick="spireApp.discardPotion(${idx})">Buang</button>
            </div>
          `;
        } else {
          slot.innerHTML = `<span class="empty-flask">🧪</span>`;
        }
        potionBelt.appendChild(slot);
      });
    }

    const deckCount = document.getElementById('hudDeckCount');
    if (deckCount && window.gameState.deck) {
      deckCount.textContent = window.gameState.deck.length;
    }
  }

  // ==========================================
  // 5. COMBAT ANIMATIONS & TARGETING
  // ==========================================
  triggerPlayerAttackAnim(targetEnemy = null, card = null) {
    const pElem = document.getElementById('playerAvatar');
    const combatScreen = document.getElementById('COMBAT_SCREEN');
    if (!pElem) return;

    const isEpicAnime = card && (
      (card.damage && card.damage >= 15) || 
      ['black_flash', 'getsuga_tenshou', 'serious_punch', 'hinokami_kagura', 'bludgeon'].includes(card.defId)
    );

    const animClass = isEpicAnime ? 'action-epic-anime-slash' : 'action-lunge-player';
    pElem.classList.remove('action-lunge-player', 'action-epic-anime-slash');
    void pElem.offsetWidth;
    pElem.classList.add(animClass);
    setTimeout(() => pElem.classList.remove('action-lunge-player', 'action-epic-anime-slash'), isEpicAnime ? 540 : 440);

    // Screen flash & anime flare on heavy attacks
    if (isEpicAnime && combatScreen) {
      combatScreen.classList.remove('anime-screen-flash');
      void combatScreen.offsetWidth;
      combatScreen.classList.add('anime-screen-flash');
      setTimeout(() => combatScreen.classList.remove('anime-screen-flash'), 300);
      if (window.spireVfx) window.spireVfx.triggerScreenShake('heavy');
    }

    if (targetEnemy && window.spireVfx) {
      const eElem = document.getElementById(targetEnemy.uid);
      if (eElem) {
        const pRect = pElem.getBoundingClientRect();
        const eRect = eElem.getBoundingClientRect();
        const pX = pRect.left + pRect.width * 0.75;
        const pY = pRect.top + pRect.height * 0.45;
        const eX = eRect.left + eRect.width * 0.45;
        const eY = eRect.top + eRect.height * 0.5;
        window.spireVfx.createBladeTrail(pX, pY, eX, eY);

        eElem.classList.remove('action-recoil-enemy');
        void eElem.offsetWidth;
        eElem.classList.add('action-recoil-enemy');
        setTimeout(() => eElem.classList.remove('action-recoil-enemy'), 520);
      }
    }
  }

  triggerPlayerShieldAnim() {
    const pElem = document.getElementById('playerAvatar');
    if (pElem) {
      pElem.classList.remove('action-shield-pulse');
      void pElem.offsetWidth;
      pElem.classList.add('action-shield-pulse');
      setTimeout(() => pElem.classList.remove('action-shield-pulse'), 460);
    }
  }

  triggerPlayerPowerAnim() {
    const pElem = document.getElementById('playerAvatar');
    if (pElem) {
      pElem.classList.remove('action-power-surge');
      void pElem.offsetWidth;
      pElem.classList.add('action-power-surge');
      setTimeout(() => pElem.classList.remove('action-power-surge'), 560);

      const pRect = pElem.getBoundingClientRect();
      window.spireVfx.createPowerPillar(pRect.left + pRect.width / 2, pRect.bottom - 10);
    }
  }

  // ==========================================
  // 6. MAP SCREEN
  // ==========================================
  openMapScreen() {
    if (!window.gameState.deck || window.gameState.deck.length === 0) {
      const charDef = (window.gameState && window.gameState.getCharacterDef) ? window.gameState.getCharacterDef() : { starterDeck: ['strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'bash'] };
      const starterIds = charDef.starterDeck || ['strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'bash'];
      window.gameState.deck = starterIds.map(defId => {
        const baseDef = (window.CARD_DATABASE && window.CARD_DATABASE[defId]) ? window.CARD_DATABASE[defId] : (window.CARD_DATABASE ? window.CARD_DATABASE.strike : null);
        return (baseDef && window.Card) ? new window.Card(baseDef, false) : null;
      }).filter(Boolean);
      window.gameState.saveRun();
    }
    if (!window.gameState.map || !window.gameState.map.floors || window.gameState.map.floors.length === 0) {
      window.gameState.map = new window.SpireMap(15, 4);
    }
    this.switchScreen('MAP_SCREEN');

    const combatBanner = document.getElementById('mapCombatActiveBanner');
    const actSubtitle = document.getElementById('mapActSubtitle');
    if (window.spireCombat && window.spireCombat.isActive) {
      if (combatBanner) combatBanner.style.display = 'block';
      if (actSubtitle) actSubtitle.textContent = '⚔️ Pertempuran sedang berlangsung! Selesaikan pertempuran sebelum melanjutkan.';
    } else {
      if (combatBanner) combatBanner.style.display = 'none';
      if (actSubtitle) actSubtitle.textContent = 'Pilih jalur yang ingin kamu tempuh menuju puncak Shadowspire';
    }

    this.renderMap();
    this.renderTopHud();
  }

  returnToActiveCombat() {
    if (window.spireAudio) window.spireAudio.playAttackSlash(false);
    this.switchScreen('COMBAT_SCREEN');
    this.renderCombatUI();
  }

  renderMap() {
    const mapContainer = document.getElementById('mapNodesContainer');
    const rowsWrapper = document.getElementById('mapRowsWrapper') || mapContainer;
    const svgOverlay = document.getElementById('mapLinesSvg');
    if (!mapContainer || !window.gameState) return;

    if (!window.gameState.map || !window.gameState.map.floors || window.gameState.map.floors.length === 0) {
      window.gameState.map = new window.SpireMap(15, 4);
    }

    rowsWrapper.innerHTML = '';
    if (svgOverlay) svgOverlay.innerHTML = '';

    const floors = window.gameState.map.floors;
    const totalFloors = floors.length;
    const isCombatActive = window.spireCombat && window.spireCombat.isActive;

    for (let f = totalFloors - 1; f >= 0; f--) {
      const floorRow = document.createElement('div');
      floorRow.className = `map-floor-row floor-${f}`;

      const floorLabel = document.createElement('div');
      floorLabel.className = 'floor-number-label';
      floorLabel.textContent = `${f + 1}`;
      floorRow.appendChild(floorLabel);

      floors[f].forEach(node => {
        const nodeElem = document.createElement('button');
        nodeElem.id = node.id;
        nodeElem.className = `map-node node-${node.type.id}`;
        if (node.visited) nodeElem.classList.add('visited');
        if (node.available && !isCombatActive) nodeElem.classList.add('available');
        if (window.gameState.map.currentNode && window.gameState.map.currentNode.id === node.id) {
          nodeElem.classList.add('current');
        }

        nodeElem.innerHTML = `
          <span class="node-icon">${node.type.icon}</span>
          <span class="node-title">${node.type.name}</span>
        `;

        nodeElem.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleNodeClick(node.id);
        });

        floorRow.appendChild(nodeElem);
      });

      rowsWrapper.appendChild(floorRow);
    }

    // Gambar garis koneksi segera & perbarui setelah layout settle
    this.drawMapConnections();
    setTimeout(() => {
      this.drawMapConnections();
      const scrollWrapper = document.getElementById('mapScrollWrapper');
      if (scrollWrapper) {
        const targetNode = document.querySelector('.map-node.current') || document.querySelector('.map-node.available');
        if (targetNode) {
          targetNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          scrollWrapper.scrollTop = scrollWrapper.scrollHeight;
        }
      }
    }, 60);
    setTimeout(() => this.drawMapConnections(), 250);
  }

  drawMapConnections() {
    const svgOverlay = document.getElementById('mapLinesSvg');
    const nodesContainer = document.getElementById('mapNodesContainer');
    const rowsWrapper = document.getElementById('mapRowsWrapper');
    if (!svgOverlay || !nodesContainer || !window.gameState.map) return;

    svgOverlay.innerHTML = '';
    const w = nodesContainer.offsetWidth || 580;
    const h = Math.max(
      nodesContainer.scrollHeight,
      nodesContainer.offsetHeight,
      rowsWrapper ? rowsWrapper.scrollHeight : 0,
      rowsWrapper ? rowsWrapper.offsetHeight : 0,
      1400
    );
    svgOverlay.setAttribute('width', w);
    svgOverlay.setAttribute('height', h);
    svgOverlay.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svgOverlay.style.width = `${w}px`;
    svgOverlay.style.height = `${h}px`;

    window.gameState.map.floors.forEach(floor => {
      floor.forEach(node => {
        const parentElem = document.getElementById(node.id);
        if (!parentElem) return;

        const parentRow = parentElem.closest('.map-floor-row');
        const pX = parentElem.offsetLeft + parentElem.offsetWidth / 2;
        const pY = (parentRow ? parentRow.offsetTop : 0) + parentElem.offsetTop + parentElem.offsetHeight / 2;

        (node.children || []).forEach(childId => {
          const childElem = document.getElementById(childId);
          if (!childElem) return;

          const childRow = childElem.closest('.map-floor-row');
          const cX = childElem.offsetLeft + childElem.offsetWidth / 2;
          const cY = (childRow ? childRow.offsetTop : 0) + childElem.offsetTop + childElem.offsetHeight / 2;

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const midY = (pY + cY) / 2;
          const d = `M ${pX} ${pY} C ${pX} ${midY}, ${cX} ${midY}, ${cX} ${cY}`;
          path.setAttribute('d', d);

          let lineClass = 'map-line';
          const isParentVisited = parentElem.classList.contains('visited') || node.visited;
          const isChildVisited = childElem.classList.contains('visited');
          const isChildAvailable = childElem.classList.contains('available');
          const isParentCurrent = parentElem.classList.contains('current') || (window.gameState.map.currentNode && window.gameState.map.currentNode.id === node.id);

          if (isParentVisited && isChildVisited) {
            lineClass = 'map-line visited';
          } else if (isChildAvailable && (isParentCurrent || isParentVisited)) {
            lineClass = 'map-line available-path';
          } else if (isChildAvailable) {
            lineClass = 'map-line available-path';
          } else if (!window.gameState.map.currentNode && (parentElem.classList.contains('available') || node.available)) {
            lineClass = 'map-line available-path';
          }
          path.setAttribute('class', lineClass);
          svgOverlay.appendChild(path);
        });
      });
    });
  }

  handleNodeClick(nodeId) {
    if (!window.gameState || !window.gameState.map) return;

    // Kunci pemilihan node jika pertempuran masih berlangsung
    if (window.spireCombat && window.spireCombat.isActive) {
      if (window.spireAudio) window.spireAudio.playClick();
      this.returnToActiveCombat();
      if (window.spireCombat.showCombatText) {
        window.spireCombat.showCombatText('Selesaikan pertempuran saat ini terlebih dahulu!', 'player', '#ff6b6b');
      }
      return;
    }

    const targetNode = window.gameState.map.getNodeById(nodeId);
    if (!targetNode || !targetNode.available) {
      return;
    }

    const selected = window.gameState.map.selectNode(nodeId);
    if (!selected) return;

    if (window.spireAudio) window.spireAudio.playClick();
    window.gameState.saveRun();

    try {
      switch (selected.type.id) {
        case 'monster':
          this.startCombatEncounter('NORMAL');
          break;
        case 'elite':
          this.startCombatEncounter('ELITE');
          break;
        case 'boss':
          this.startCombatEncounter('BOSS');
          break;
        case 'rest':
          this.openCampfireScreen();
          break;
        case 'shop':
          this.openShopScreen();
          break;
        case 'event':
          this.openEventScreen();
          break;
        case 'chest':
          this.openChestScreen();
          break;
        default:
          this.startCombatEncounter('NORMAL');
      }
    } catch (err) {
      console.error('Error handling node action:', err);
      this.startCombatEncounter('NORMAL');
    }
  }

  // ==========================================
  // 7. COMBAT ARENA
  // ==========================================
  startCombatEncounter(type = 'NORMAL') {
    try {
      const currentFloorNum = (window.gameState && window.gameState.map && window.gameState.map.currentNode)
        ? window.gameState.map.currentNode.floor + 1
        : 1;
      const enemies = window.createEncounter(type, currentFloorNum);

      if (type === 'BOSS' && enemies && enemies.length > 0) {
        this.playBossCinematicIntro(enemies[0], () => {
          this.switchScreen('COMBAT_SCREEN');
          window.spireCombat.startCombat(type, enemies);
          this.renderCombatUI();
          this.spawnAnimeEmbers();
        });
      } else {
        this.switchScreen('COMBAT_SCREEN');
        window.spireCombat.startCombat(type, enemies);
        this.renderCombatUI();
        this.spawnAnimeEmbers();
      }
    } catch (err) {
      console.error('Error starting combat encounter:', err);
      this.switchScreen('COMBAT_SCREEN');
      this.renderCombatUI();
      this.spawnAnimeEmbers();
    }
  }

  // ==========================================
  // CINEMATIC ANIME BOSS INTRO ENGINE
  // ==========================================
  playBossCinematicIntro(boss, onComplete) {
    const overlay = document.getElementById('bossCinematicOverlay');
    if (!overlay) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    this.onBossCinematicComplete = onComplete;

    // Sfx & BGM build-up
    if (window.spireAudio) {
      window.spireAudio.playBossCinematicHorn();
      window.spireAudio.playBossThunderBoom();
      setTimeout(() => {
        if (window.spireAudio.playBossHeartbeat) window.spireAudio.playBossHeartbeat();
      }, 650);
    }

    // Set boss elements
    const avatarContainer = document.getElementById('bossCinematicAvatar');
    const titleElem = document.getElementById('bossCinematicTitle');
    const subtitleElem = document.getElementById('bossCinematicSubtitle');
    const dialogueElem = document.getElementById('bossDialogueText');
    const loreElem = document.getElementById('bossLoreQuote');
    const alertBadge = document.getElementById('bossAlertBadge');
    const watermarkKanji = document.getElementById('bossWatermarkKanji');

    if (avatarContainer && boss.avatarSvg) avatarContainer.innerHTML = boss.avatarSvg;
    if (titleElem) titleElem.textContent = boss.name || 'APEX BOSS';
    
    // Custom Boss Lore Dialogue & Kanji Watermark
    if (boss.id === 'guardian_sentinel') {
      if (watermarkKanji) watermarkKanji.textContent = '古代の番人';
      if (subtitleElem) subtitleElem.textContent = 'AETHER-RUNE SENTINEL • PENJAGA MEKANIKAL PURBA';
      if (alertBadge) alertBadge.textContent = '⚠️ CALAMITY CLASS // BOS PUNCAK ACT 1 ⚠️';
      if (dialogueElem) dialogueElem.textContent = '“PENYUSUP TERDETEKSI... MEMULAI PROTOKOL PEMBASMIAN LEVEL ALPHA! SELURUH GERBANG HARUS DILINDUNGI!”';
      if (loreElem) loreElem.textContent = 'Detik jam abadi berdentang di sekeliling golem purba ini saat bilah kristal energi kosmik dihunus.';
    } else if (boss.id === 'slime_behemoth') {
      if (watermarkKanji) watermarkKanji.textContent = '深淵の魔獣';
      if (subtitleElem) subtitleElem.textContent = 'SLIME BEHEMOTH • SANG PEMAKAN SEGALA';
      if (alertBadge) alertBadge.textContent = '⚠️ HAZARD BIO-TITAN // BOS PUNCAK ACT 1 ⚠️';
      if (dialogueElem) dialogueElem.textContent = '“GUOOOAAARRR...! DAGING DAN TULANGMU AKAN MELELEH KE DALAM KEABADIAN ASAM KAMI!”';
      if (loreElem) loreElem.textContent = 'Tanah bergetar hebat saat cairan korosif ribuan tahun menggelegak membentuk wujud titan lapar.';
    } else if (boss.id === 'corrupted_archangel') {
      if (watermarkKanji) watermarkKanji.textContent = '堕落の熾天使';
      if (subtitleElem) subtitleElem.textContent = 'FALLEN SERAPH OF THE VOID • PENGHAKIMAN KIAMAT';
      if (alertBadge) alertBadge.textContent = '⚠️ CATACLYSMIC CELESTIAL ENTITY ⚠️';
      if (dialogueElem) dialogueElem.textContent = '“MENGAPA KAU MASIH MERANGKAK KE ATAS, MAKHLUK FANA? DI PUNCAK INI HANYA ADA KEPADAMURAMAN ABADI!”';
      if (loreElem) loreElem.textContent = 'Enam sayap hitam berlumur darah membentang lebar saat halo kiamat membakar langit-langit menara.';
    } else {
      if (watermarkKanji) watermarkKanji.textContent = '決戦';
      if (subtitleElem) subtitleElem.textContent = `${boss.name} • CALAMITY CLASS`;
      if (alertBadge) alertBadge.textContent = '⚠️ PERTEMPURAN HIDUP DAN MATI ⚠️';
      if (dialogueElem) dialogueElem.textContent = '“Jiwamu tidak akan pernah melangkah melewati lantai ini hidup-hidup!”';
      if (loreElem) loreElem.textContent = boss.lore || 'Aura mengerikan merambati seluruh dungeon.';
    }

    overlay.classList.add('active');

    // Trigger Screen Shake
    if (window.spireVfx) window.spireVfx.triggerScreenShake('heavy');

    // Auto-engage fallback after 8.5s
    clearTimeout(this.bossCinematicTimer);
    this.bossCinematicTimer = setTimeout(() => {
      this.dismissBossCinematic();
    }, 8500);
  }

  dismissBossCinematic() {
    clearTimeout(this.bossCinematicTimer);
    const overlay = document.getElementById('bossCinematicOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    if (typeof this.onBossCinematicComplete === 'function') {
      const cb = this.onBossCinematicComplete;
      this.onBossCinematicComplete = null;
      cb();
    }
  }

  spawnAnimeEmbers() {
    const container = document.getElementById('animeEmberField');
    if (!container) return;
    container.innerHTML = '';
    const emberCount = 18;
    for (let i = 0; i < emberCount; i++) {
      const p = document.createElement('div');
      p.className = 'ember-particle';
      const size = Math.floor(Math.random() * 5) + 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${(Math.random() * 4).toFixed(1)}s`;
      p.style.animationDuration = `${(Math.random() * 3 + 3).toFixed(1)}s`;
      container.appendChild(p);
    }
  }

  renderCombatUI() {
    this.renderTopHud();
    this.renderPlayerCombat();
    this.renderEnemies();
    this.renderEnergyOrb();
    this.renderHand();
    this.renderPiles();
  }

  renderPlayerCombat() {
    const blockBadge = document.getElementById('playerCombatBlock');
    const statusBox = document.getElementById('playerStatuses');
    const playerAvatar = document.getElementById('playerAvatar');

    const heroAura = document.getElementById('playerHeroAura');
    if (heroAura && window.gameState) {
      const charKey = window.gameState.character || 'ironclad';
      const auraColors = {
        ironclad: 'rgba(255, 40, 40, 0.45)',
        silent: 'rgba(130, 60, 240, 0.4)',
        defect: 'rgba(0, 240, 255, 0.45)',
        watcher: 'rgba(255, 212, 59, 0.45)',
        necromancer: 'rgba(32, 201, 151, 0.45)',
        berserker: 'rgba(255, 90, 90, 0.5)',
        paladin: 'rgba(255, 230, 110, 0.5)',
        shadowblade: 'rgba(180, 40, 255, 0.45)',
        chronomancer: 'rgba(116, 192, 252, 0.45)',
        alchemist: 'rgba(81, 207, 102, 0.45)',
        shadow_monarch: 'rgba(121, 80, 242, 0.55)',
        limitless_sorcerer: 'rgba(0, 240, 255, 0.55)'
      };
      const col = auraColors[charKey] || 'rgba(255, 212, 59, 0.4)';
      heroAura.style.background = `radial-gradient(ellipse at center, ${col} 0%, transparent 70%)`;
    }

    if (playerAvatar && window.gameState) {
      const charDef = window.gameState.getCharacterDef();
      if (charDef && charDef.avatarSvg) {
        playerAvatar.innerHTML = charDef.avatarSvg;
      }
    }

    // Render Hero Active Skill Button
    const skillBtn = document.getElementById('heroActiveSkillBtn');
    const skillIcon = document.getElementById('heroSkillIcon');
    const skillName = document.getElementById('heroSkillName');
    const skillCdOverlay = document.getElementById('heroSkillCooldownOverlay');
    const skillCdText = document.getElementById('heroSkillCooldownText');
    const charDef = window.gameState ? window.gameState.getCharacterDef() : null;

    if (skillBtn && charDef && charDef.activeSkill && window.spireCombat) {
      const skill = charDef.activeSkill;
      if (skillIcon) skillIcon.textContent = skill.icon || '⚡';
      if (skillName) skillName.textContent = skill.name;

      const cd = window.spireCombat.player.activeSkillCooldown || 0;
      const energyCost = skill.cost || 0;
      const hasEnergy = window.spireCombat.energy >= energyCost;

      skillBtn.title = `[R] ${skill.name}\n${skill.description}\nCooldown: ${skill.cooldown}T | Biaya: ${energyCost} Energi`;

      if (cd > 0) {
        skillBtn.classList.remove('skill-ready');
        skillBtn.classList.add('skill-on-cooldown');
        if (skillCdOverlay) skillCdOverlay.style.display = 'flex';
        if (skillCdText) skillCdText.textContent = `${cd}T`;
      } else if (!hasEnergy) {
        skillBtn.classList.remove('skill-ready');
        skillBtn.classList.remove('skill-on-cooldown');
        if (skillCdOverlay) skillCdOverlay.style.display = 'flex';
        if (skillCdText) skillCdText.textContent = 'NO MANA';
      } else {
        skillBtn.classList.add('skill-ready');
        skillBtn.classList.remove('skill-on-cooldown');
        if (skillCdOverlay) skillCdOverlay.style.display = 'none';
        if (skillCdText) skillCdText.textContent = 'READY';
      }
    }

    if (blockBadge && window.spireCombat) {
      const blk = window.spireCombat.player.block;
      if (blk > 0) {
        blockBadge.style.display = 'inline-flex';
        blockBadge.innerHTML = `🛡️ ${blk}`;
      } else {
        blockBadge.style.display = 'none';
      }
    }

    if (statusBox && window.spireCombat) {
      statusBox.innerHTML = '';
      const s = window.spireCombat.player.status;
      const statuses = [
        { name: 'Kekuatan (Strength)', val: s.strength, icon: '🗡️', color: '#ff4d4d', desc: `Meningkatkan output damage kartu Serangan Anda sebesar ${s.strength}.` },
        { name: 'Ketangkasan (Dexterity)', val: s.dexterity, icon: '🥾', color: '#51cf66', desc: `Meningkatkan perolehan Block dari kartu Pertahanan sebesar ${s.dexterity}.` },
        { name: 'Rentan (Vulnerable)', val: s.vulnerable, icon: '💔', color: '#ff6b6b', desc: `Menerima 50% lebih banyak damage dari serangan selama ${s.vulnerable} giliran.` },
        { name: 'Lemah (Weak)', val: s.weak, icon: '🥀', color: '#ffd43b', desc: `Output damage serangan fisik Anda berkurang 25% selama ${s.weak} giliran.` },
        { name: 'Rapuh (Frail)', val: s.frail, icon: '🧱', color: '#ffa94d', desc: `Perolehan Block berkurang 25% selama ${s.frail} giliran.` },
        { name: 'Pelat Baja (Metallicize)', val: s.metallicize, icon: '⚙️', color: '#74c0fc', desc: `Memperoleh +${s.metallicize} Block di setiap akhir giliran Anda.` },
        { name: 'Bentuk Iblis (Demon Form)', val: s.demonForm, icon: '😈', color: '#d6336c', desc: `Memperoleh +${s.demonForm} Kekuatan di setiap awal giliran Anda.` },
        { name: 'Barikade (Barricade)', val: s.barricade, icon: '🏰', color: '#a0aec0', desc: 'Block tidak berkurang atau hilang saat pergantian giliran.' },
        { name: 'Bola Petir (Lightning Orbs)', val: s.lightningOrbs, icon: '⚡', color: '#22b8cf', desc: `Menghasilkan ${s.lightningOrbs * 3} damage pasif ke musuh acak di awal tiap giliran.` }
      ];

      statuses.forEach(st => {
        if (st.val > 0) {
          const badge = document.createElement('div');
          badge.className = 'combat-status-badge';
          badge.style.borderColor = st.color;
          badge.innerHTML = `
            <span>${st.icon}</span>
            <strong>${st.val}</strong>
            <div class="tooltip-box">
              <strong style="color: ${st.color};">${st.name}: ${st.val}</strong>
              <p style="margin: 3px 0 0 0; font-size: 11px; color: #ced4da;">${st.desc}</p>
            </div>
          `;
          statusBox.appendChild(badge);
        }
      });
    }
  }

  renderEnemies() {
    const container = document.getElementById('enemiesContainer');
    if (!container || !window.spireCombat) return;
    container.innerHTML = '';

    window.spireCombat.enemies.forEach(enemy => {
      if (enemy.isDead || enemy.hasEscaped) return;

      const enemyCard = document.createElement('div');
      enemyCard.id = enemy.uid;
      enemyCard.className = `enemy-entity ${enemy.isBoss ? 'boss' : ''} ${enemy.isElite ? 'elite' : ''}`;

      const intent = enemy.intent;
      let threatClass = '';
      let threatCalcHtml = '';

      if (intent.damage > 0) {
        const totalDmg = intent.damage * (intent.hits || 1);
        const playerBlock = (window.spireCombat && window.spireCombat.player) ? window.spireCombat.player.block : 0;
        const playerHp = (window.gameState && window.gameState.player) ? window.gameState.player.currentHp : 80;
        const unblocked = Math.max(0, totalDmg - playerBlock);

        if (unblocked >= playerHp) {
          threatClass = 'lethal-threat';
        }

        threatCalcHtml = `
          <div class="intent-tooltip-math">
            <div>⚡ Serangan: <strong>${intent.damage}${intent.hits > 1 ? ` x ${intent.hits} = ${totalDmg}` : ''}</strong></div>
            <div>🛡️ Perisai Anda: <strong>${playerBlock}</strong></div>
            <div class="${unblocked > 0 ? 'intent-threat-warning' : ''}">
              ${unblocked > 0 ? `⚠️ ${unblocked} damage akan menembus HP!` : '✓ Tertahan sempurna oleh perisai!'}
            </div>
            ${unblocked >= playerHp ? '<div style="color:#ff0000;font-weight:900;margin-top:2px;">☠️ BAHAYA: SERANGAN MEMATIKAN!</div>' : ''}
          </div>
        `;
      }

      const intentHtml = `
        <div class="enemy-intent-box ${threatClass}">
          <span class="intent-icon">${intent.icon}</span>
          ${intent.damage > 0 ? `<span class="intent-damage">${intent.damage}${intent.hits > 1 ? ` x ${intent.hits}` : ''}</span>` : ''}
          <div class="tooltip-box">
            <strong>${intent.type}</strong>
            <div class="intent-tooltip-detail">${intent.description}</div>
            ${threatCalcHtml}
          </div>
        </div>
      `;

      const s = enemy.status;
      const enemyStatusList = [
        { key: 'strength', val: s.strength, name: 'Kekuatan (Strength)', icon: '🗡️', color: '#ff6b6b', desc: `Meningkatkan damage serangan sebesar ${s.strength}.` },
        { key: 'vulnerable', val: s.vulnerable, name: 'Rentan (Vulnerable)', icon: '💔', color: '#ffa8a8', desc: `Menerima 50% lebih banyak damage serangan fisik (${s.vulnerable} giliran).` },
        { key: 'weak', val: s.weak, name: 'Lemah (Weak)', icon: '🥀', color: '#ffd43b', desc: `Output damage serangan berkurang 25% (${s.weak} giliran).` },
        { key: 'poison', val: s.poison, name: 'Racun (Poison)', icon: '🧪', color: '#51cf66', desc: `Menerima ${s.poison} damage di awal giliran, lalu berkurang 1.` },
        { key: 'ritual', val: s.ritual, name: 'Ritual Purba', icon: '✨', color: '#f06595', desc: `Memperoleh +${s.ritual} Kekuatan di setiap akhir giliran.` },
        { key: 'enrage', val: s.enrage, name: 'Murka (Enrage)', icon: '👹', color: '#ff0000', desc: `Mendapat +${s.enrage} Kekuatan tiap kali pemain memainkan kartu Skill!` },
        { key: 'sharpHide', val: s.sharpHide, name: 'Kulit Duri (Thorns)', icon: '🌵', color: '#f59f00', desc: `Memberikan ${s.sharpHide} damage balasan tiap kali diserang.` },
        { key: 'asleep', val: s.asleep ? 1 : 0, name: 'Tertidur (Asleep)', icon: '💤', color: '#adb5bd', desc: 'Tidur pulas dan tidak bergerak sampai terkena serangan.' }
      ];

      let statusesHtml = '';
      enemyStatusList.forEach(st => {
        if (st.val > 0) {
          statusesHtml += `
            <div class="enemy-status-badge" style="border-color: ${st.color};">
              <span>${st.icon}</span>
              <span>${st.val > 1 || st.key !== 'asleep' ? st.val : ''}</span>
              <div class="tooltip-box">
                <strong style="color:${st.color};">${st.name}</strong>
                <p style="margin:2px 0 0 0;font-size:11px;color:#ced4da;">${st.desc}</p>
              </div>
            </div>
          `;
        }
      });

      const hpPct = Math.max(0, Math.min(100, (enemy.currentHp / enemy.maxHp) * 100));

      enemyCard.innerHTML = `
        ${intentHtml}
        <div class="enemy-sprite-wrapper">${enemy.avatarSvg}</div>
        <div class="enemy-info-bar">
          <div class="enemy-name">${enemy.name}</div>
          <div class="enemy-hp-track">
            <div class="enemy-hp-fill" style="width: ${hpPct}%;"></div>
            <span class="enemy-hp-text">${enemy.currentHp} / ${enemy.maxHp}</span>
            ${enemy.block > 0 ? `<span class="enemy-block-pill">🛡️ ${enemy.block}</span>` : ''}
          </div>
          <div class="enemy-statuses">${statusesHtml}</div>
        </div>
      `;

      enemyCard.addEventListener('mouseenter', () => {
        this.hoveredEnemy = enemy;
        if (this.selectedCard) {
          enemyCard.classList.add('targeted');
          window.spireVfx.updateTargeting(window.innerWidth, window.innerHeight, true);
          if (this.selectedCard.type === window.CARD_TYPES.ATTACK) {
            this.showTargetGhostDamage(enemy, this.selectedCard);
          }
        }
      });

      enemyCard.addEventListener('mouseleave', () => {
        if (this.hoveredEnemy === enemy) {
          this.hoveredEnemy = null;
        }
        enemyCard.classList.remove('targeted');
        this.clearTargetGhostDamage();
      });

      enemyCard.addEventListener('click', () => {
        if (this.selectedCard) {
          this.executeSelectedCard(enemy);
        }
      });

      container.appendChild(enemyCard);
    });
  }

  highlightEnemyAction(enemy) {
    const elem = document.getElementById(enemy.uid);
    if (elem) {
      elem.classList.add('action-lunge');
      setTimeout(() => elem.classList.remove('action-lunge'), 400);
    }
  }

  renderEnergyOrb() {
    const orbText = document.getElementById('energyCount');
    const orbElem = document.getElementById('energyOrb');
    if (orbText && window.spireCombat) {
      orbText.textContent = `${window.spireCombat.energy}/${window.spireCombat.maxEnergy}`;
    }
    if (orbElem) {
      orbElem.classList.remove('pulse-glow');
      void orbElem.offsetWidth;
      orbElem.classList.add('pulse-glow');
    }
  }

  renderPiles() {
    const drawCount = document.getElementById('drawPileCount');
    const discardCount = document.getElementById('discardPileCount');
    const exhaustCount = document.getElementById('exhaustPileCount');

    if (drawCount && window.spireCombat) drawCount.textContent = window.spireCombat.drawPile.length;
    if (discardCount && window.spireCombat) discardCount.textContent = window.spireCombat.discardPile.length;
    if (exhaustCount && window.spireCombat) exhaustCount.textContent = window.spireCombat.exhaustPile.length;
  }

  renderHand() {
    const handContainer = document.getElementById('combatHand');
    if (!handContainer || !window.spireCombat) return;
    handContainer.innerHTML = '';

    const hand = window.spireCombat.hand;
    const total = hand.length;

    hand.forEach((card, idx) => {
      const cardElem = document.createElement('div');
      cardElem.id = card.uid;
      cardElem.className = `spire-card card-${card.type.toLowerCase()} rarity-${card.rarity.toLowerCase()}`;
      if (card.isUpgraded) cardElem.classList.add('upgraded');
      if (card.cost > window.spireCombat.energy && card.cost !== -1) {
        cardElem.classList.add('unplayable');
      } else if (card.cost !== -2) {
        cardElem.classList.add('playable-ready');
      }

      const mid = (total - 1) / 2;
      const angle = (idx - mid) * 3.8;
      const offsetY = Math.abs(idx - mid) * 7;
      cardElem.style.transform = `rotate(${angle}deg) translateY(${offsetY}px)`;

      // Generate keyword sidebar if card has keywords
      let keywordsHtml = '';
      if (typeof card.getKeywords === 'function') {
        const kws = card.getKeywords();
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

      cardElem.innerHTML = typeof card.renderHtml === 'function'
        ? card.renderHtml(window.spireCombat)
        : `
          <div class="card-energy-crystal">${card.cost === -1 ? 'X' : (card.cost === -2 ? '✕' : card.cost)}</div>
          <div class="card-title-banner">${card.name}</div>
          <div class="card-art-frame"><span class="card-art-icon">${card.artIcon}</span></div>
          <div class="card-type-tag">${card.type}</div>
          <div class="card-description">${card.getDescription(window.spireCombat)}</div>
          <div class="card-rarity-gem"></div>
        `;

      cardElem.addEventListener('mouseenter', () => {
        if (!this.selectedCard && window.spireAudio) {
          window.spireAudio.playCardHover();
        }
      });

      // 3D Card tilt dynamic response
      cardElem.addEventListener('mousemove', (e) => {
        if (this.selectedCard) return;
        const rect = cardElem.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = -(y / (rect.height / 2)) * 14;
        const rotY = (x / (rect.width / 2)) * 14;
        cardElem.style.transform = `translateY(-50px) scale(1.18) perspective(600px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`;
      });

      cardElem.addEventListener('mouseleave', () => {
        if (!this.selectedCard || this.selectedCard.uid !== card.uid) {
          cardElem.style.transform = `rotate(${angle}deg) translateY(${offsetY}px)`;
        }
      });

      cardElem.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        this.startCardDrag(card, cardElem, e);
      });

      handContainer.appendChild(cardElem);
    });
  }

  startCardDrag(card, cardElem, event) {
    if (!window.spireCombat.isPlayerTurn) return;
    if (card.cost === -2) {
      window.spireCombat.showCombatText('Unplayable Card!', 'player', '#ced4da');
      return;
    }
    if (card.cost > window.spireCombat.energy && card.cost !== -1) {
      window.spireCombat.showCombatText('Not Enough Energy!', 'player', '#ff6b6b');
      if (window.spireAudio) window.spireAudio.playClick();
      return;
    }

    // Jika mengklik kartu yang sama, batalkan seleksi (toggle)
    if (this.selectedCard && this.selectedCard.uid === card.uid) {
      this.cancelCardSelection();
      return;
    }

    if (this.selectedCard) {
      this.cancelCardSelection();
    }

    this.selectedCard = card;
    this.draggedCardElement = cardElem;
    this.dragStartX = event.clientX || window.innerWidth / 2;
    this.dragStartY = event.clientY || window.innerHeight * 0.85;
    cardElem.classList.add('card-selected');

    const rect = cardElem.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + 20;

    if (window.spireVfx) {
      window.spireVfx.startTargeting(startX, startY);
    }
  }

  handleCardRelease(event) {
    if (!this.selectedCard) return;

    const card = this.selectedCard;
    const dist = Math.hypot(event.clientX - (this.dragStartX || 0), event.clientY - (this.dragStartY || 0));

    // Jika berupa klik biasa (jarak geser kecil)
    if (dist < 15) {
      // Kartu non-target (Self / All) langsung dieksekusi saat diklik
      if (card.target !== window.TARGET_TYPES.ENEMY) {
        this.executeSelectedCard(null);
      }
      // Kartu penarget musuh tetap berstatus TERPILIH agar pemain dapat mengklik musuh
      return;
    }

    // Jika berupa drag-and-drop
    if (card.target === window.TARGET_TYPES.ENEMY) {
      let targetEnemy = this.hoveredEnemy;
      if (!targetEnemy) {
        const el = document.elementFromPoint(event.clientX, event.clientY);
        const enemyEl = el ? el.closest('.enemy-entity') : null;
        if (enemyEl) {
          targetEnemy = window.spireCombat.enemies.find(en => en.uid === enemyEl.id);
        }
      }

      if (targetEnemy && !targetEnemy.isDead && !targetEnemy.hasEscaped) {
        this.executeSelectedCard(targetEnemy);
      } else {
        this.cancelCardSelection();
      }
    } else {
      if (event.clientY < window.innerHeight * 0.75) {
        this.executeSelectedCard(null);
      } else {
        this.cancelCardSelection();
      }
    }
  }

  executeSelectedCard(targetEnemy = null) {
    if (!this.selectedCard) return;

    this.clearTargetGhostDamage();
    const card = this.selectedCard;
    window.spireCombat.playCard(card.uid, targetEnemy);
    this.cancelCardSelection();
  }

  cancelCardSelection() {
    this.clearTargetGhostDamage();
    if (this.draggedCardElement) {
      this.draggedCardElement.classList.remove('card-selected');
    }
    this.selectedCard = null;
    this.draggedCardElement = null;
    this.hoveredEnemy = null;
    if (window.spireVfx) {
      window.spireVfx.stopTargeting();
    }

    document.querySelectorAll('.enemy-entity').forEach(e => e.classList.remove('targeted'));
  }

  showTargetGhostDamage(enemy, card) {
    if (!enemy || !card || enemy.isDead || enemy.hasEscaped || !window.spireCombat) return;
    const enemyElem = document.getElementById(enemy.uid);
    if (!enemyElem) return;

    this.clearTargetGhostDamage();

    const baseDmg = (card.isUpgraded && card.baseDef.upgradedDamage !== undefined) ? card.baseDef.upgradedDamage : (card.damage || 0);
    const predDmg = window.spireCombat.calcDamage(baseDmg);
    const finalDmg = (enemy.status.vulnerable > 0) ? Math.floor(predDmg * 1.5) : predDmg;

    // Calculate block damage vs HP damage
    const blockDmg = Math.min(enemy.block, finalDmg);
    const hpDmg = Math.max(0, finalDmg - enemy.block);
    const newHp = Math.max(0, enemy.currentHp - hpDmg);

    // Render ghost preview bar inside HP track
    const hpTrack = enemyElem.querySelector('.enemy-hp-track');
    if (hpTrack) {
      const currentPct = (enemy.currentHp / enemy.maxHp) * 100;
      const newPct = (newHp / enemy.maxHp) * 100;
      const ghostWidth = currentPct - newPct;

      const ghostBar = document.createElement('div');
      ghostBar.className = 'enemy-hp-ghost';
      ghostBar.id = 'activeGhostBar';
      ghostBar.style.left = `${newPct}%`;
      ghostBar.style.width = `${ghostWidth}%`;
      hpTrack.appendChild(ghostBar);
    }

    // Render floating ghost preview badge
    const badge = document.createElement('div');
    badge.className = 'ghost-damage-badge';
    badge.id = 'activeGhostBadge';
    badge.innerHTML = `💥 -${finalDmg} (${blockDmg > 0 ? `${blockDmg}🛡️ ` : ''}${hpDmg > 0 ? `${hpDmg}❤️` : '0❤️'})`;
    enemyElem.appendChild(badge);
  }

  clearTargetGhostDamage() {
    const bar = document.getElementById('activeGhostBar');
    if (bar) bar.remove();
    const badge = document.getElementById('activeGhostBadge');
    if (badge) badge.remove();
  }

  toggleCombatLog() {
    const drawer = document.getElementById('combatLogDrawer');
    if (!drawer) return;
    if (drawer.style.display === 'none' || !drawer.style.display) {
      drawer.style.display = 'flex';
      const feed = document.getElementById('combatLogFeed');
      if (feed) feed.scrollTop = feed.scrollHeight;
    } else {
      drawer.style.display = 'none';
    }
  }

  addCombatLogEntry(message, type = 'player-action') {
    const feed = document.getElementById('combatLogFeed');
    if (!feed) return;
    const entry = document.createElement('div');
    entry.className = `combat-log-entry ${type}`;
    entry.textContent = message;
    feed.appendChild(entry);
    feed.scrollTop = feed.scrollHeight;
  }

  usePotion(idx) {
    const potion = window.gameState.potions[idx];
    if (!potion || !window.spireCombat.isActive) return;

    let target = null;
    if (potion.target === 'ENEMY') {
      const living = window.spireCombat.enemies.filter(e => !e.isDead && !e.hasEscaped);
      target = living[0] || null;
      if (!target) return;
    }

    if (window.spireAudio && window.spireAudio.playPotionDrink) {
      window.spireAudio.playPotionDrink();
    }
    window.gameState.usePotion(idx, window.spireCombat, target);
    this.renderCombatUI();
  }

  discardPotion(idx) {
    window.gameState.discardPotion(idx);
    this.renderTopHud();
  }

  showCombatRewards(encounterType = 'NORMAL') {
    this.switchScreen('REWARDS_SCREEN');
    const container = document.getElementById('rewardItemsList');
    if (!container) return;
    container.innerHTML = '';

    const baseGold = encounterType === 'BOSS' ? 100 : (encounterType === 'ELITE' ? 35 : 18);
    const goldAmt = baseGold + Math.floor(Math.random() * 14);

    const goldReward = document.createElement('div');
    goldReward.className = 'reward-row';
    goldReward.innerHTML = `
      <span class="reward-icon">💰</span>
      <span class="reward-title">${goldAmt} Gold</span>
      <button class="reward-claim-btn">Klaim</button>
    `;
    goldReward.querySelector('button').addEventListener('click', () => {
      window.gameState.addGold(goldAmt);
      goldReward.remove();
      this.checkAllRewardsClaimed();
    });
    container.appendChild(goldReward);

    const cardReward = document.createElement('div');
    cardReward.className = 'reward-row';
    cardReward.innerHTML = `
      <span class="reward-icon">🃏</span>
      <span class="reward-title">Pilih 1 dari 3 Kartu Baru</span>
      <button class="reward-claim-btn">Buka</button>
    `;
    cardReward.querySelector('button').addEventListener('click', () => {
      this.openCardChoiceModal();
      cardReward.remove();
    });
    container.appendChild(cardReward);

    if (encounterType === 'ELITE' || encounterType === 'BOSS' || Math.random() < 0.16) {
      const relic = window.getRandomRelic(window.gameState.relics);
      if (relic) {
        const relicReward = document.createElement('div');
        relicReward.className = 'reward-row';
        relicReward.innerHTML = `
          <span class="reward-icon">${relic.icon}</span>
          <span class="reward-title">Relic: ${relic.name}</span>
          <button class="reward-claim-btn">Ambil</button>
        `;
        relicReward.querySelector('button').addEventListener('click', () => {
          window.gameState.addRelic(relic);
          relicReward.remove();
          this.renderTopHud();
          this.checkAllRewardsClaimed();
        });
        container.appendChild(relicReward);
      }
    }

    if (Math.random() < 0.40) {
      const potion = window.getRandomPotion();
      const potionReward = document.createElement('div');
      potionReward.className = 'reward-row';
      potionReward.innerHTML = `
        <span class="reward-icon">${potion.icon}</span>
        <span class="reward-title">Potion: ${potion.name}</span>
        <button class="reward-claim-btn">Ambil</button>
      `;
      potionReward.querySelector('button').addEventListener('click', () => {
        window.gameState.addPotion(potion);
        potionReward.remove();
        this.renderTopHud();
        this.checkAllRewardsClaimed();
      });
      container.appendChild(potionReward);
    }
  }

  checkAllRewardsClaimed() {
    const container = document.getElementById('rewardItemsList');
    if (container && container.children.length === 0) {
      this.openMapScreen();
    }
  }

  openCardChoiceModal() {
    const modal = document.getElementById('cardChoiceModal');
    const container = document.getElementById('cardChoiceContainer');
    if (!modal || !container) return;

    container.innerHTML = '';
    const cards = window.getRandomCardReward(3);

    cards.forEach(card => {
      let keywordsHtml = '';
      if (typeof card.getKeywords === 'function') {
        const kws = card.getKeywords();
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

      const cardElem = document.createElement('div');
      cardElem.className = `spire-card card-${card.type.toLowerCase()} rarity-${card.rarity.toLowerCase()}`;
      cardElem.innerHTML = typeof card.renderHtml === 'function' ? card.renderHtml(null) : cardElem.innerHTML;

      cardElem.addEventListener('click', () => {
        window.gameState.addCard(card);
        if (window.spireAudio) window.spireAudio.playCardDraw();
        modal.style.display = 'none';
        this.renderTopHud();
        this.checkAllRewardsClaimed();
      });

      container.appendChild(cardElem);
    });

    modal.style.display = 'flex';
  }

  skipCardChoice() {
    const modal = document.getElementById('cardChoiceModal');
    if (modal) modal.style.display = 'none';
    this.checkAllRewardsClaimed();
  }

  openCampfireScreen() {
    this.switchScreen('CAMPFIRE_SCREEN');
    if (window.spireAudio) window.spireAudio.playCampfire();
  }

  chooseCampfireRest() {
    const diff = window.gameState.getDifficultyDef();
    const healAmt = Math.floor(window.gameState.player.maxHp * (diff.campHealPct || 0.3));
    window.gameState.heal(healAmt);
    this.renderTopHud();
    if (window.spireAudio) window.spireAudio.playCampfire();
    this.openMapScreen();
  }

  chooseCampfireSmith() {
    this.openDeckViewerModal('UPGRADE');
  }

  openShopScreen() {
    this.switchScreen('SHOP_SCREEN');
    this.renderShopItems();
  }

  renderShopItems() {
    const cardsRow = document.getElementById('shopCardsContainer');
    const relicsRow = document.getElementById('shopRelicsContainer');
    const purgeBtn = document.getElementById('shopPurgeBtn');
    if (!cardsRow || !relicsRow) return;

    cardsRow.innerHTML = '';
    relicsRow.innerHTML = '';

    const shopCards = window.getRandomCardReward(4);
    shopCards.forEach((card, i) => {
      const price = i === 0 ? 45 : (card.rarity === 'RARE' ? 140 : 75);
      const cardWrap = document.createElement('div');
      cardWrap.className = 'shop-card-wrapper';

      cardWrap.innerHTML = `
        <div class="spire-card card-${card.type.toLowerCase()} rarity-${card.rarity.toLowerCase()}">
          ${typeof card.renderHtml === 'function' ? card.renderHtml(null) : `
            <div class="card-energy-crystal">${card.cost}</div>
            <div class="card-title-banner">${card.name}</div>
            <div class="card-art-frame"><span class="card-art-icon">${card.artIcon}</span></div>
            <div class="card-type-tag">${card.type}</div>
            <div class="card-description">${card.getDescription()}</div>
            <div class="card-rarity-gem"></div>
          `}
        </div>
        <button class="shop-buy-btn" ${window.gameState.player.gold < price ? 'disabled' : ''}>
          💰 ${price} Gold
        </button>
      `;

      cardWrap.querySelector('button').addEventListener('click', () => {
        if (window.gameState.spendGold(price)) {
          window.gameState.addCard(card);
          cardWrap.innerHTML = `<div class="sold-out-badge">TERJUAL</div>`;
          this.renderTopHud();
        }
      });

      cardsRow.appendChild(cardWrap);
    });

    const shopRelic = window.getRandomRelic(window.gameState.relics);
    if (shopRelic) {
      const relicPrice = 160;
      const relicWrap = document.createElement('div');
      relicWrap.className = 'shop-relic-item';
      relicWrap.innerHTML = `
        <div class="shop-relic-icon">${shopRelic.icon}</div>
        <div class="shop-relic-info">
          <strong>${shopRelic.name}</strong>
          <p>${shopRelic.description}</p>
        </div>
        <button class="shop-buy-btn" ${window.gameState.player.gold < relicPrice ? 'disabled' : ''}>
          💰 ${relicPrice} Gold
        </button>
      `;
      relicWrap.querySelector('button').addEventListener('click', () => {
        if (window.gameState.spendGold(relicPrice)) {
          window.gameState.addRelic(shopRelic);
          relicWrap.innerHTML = `<div class="sold-out-badge">TERJUAL</div>`;
          this.renderTopHud();
        }
      });
      relicsRow.appendChild(relicWrap);
    }

    if (purgeBtn) {
      const purgeCost = 75;
      purgeBtn.textContent = `Bakar 1 Kartu (${purgeCost} Gold)`;
      purgeBtn.disabled = window.gameState.player.gold < purgeCost;
      purgeBtn.onclick = () => {
        if (window.gameState.spendGold(purgeCost)) {
          this.openDeckViewerModal('REMOVE');
          purgeBtn.disabled = true;
          purgeBtn.textContent = 'Jasa Terpakai';
        }
      };
    }
  }

  openEventScreen() {
    this.switchScreen('EVENT_SCREEN');
    const evt = window.getRandomEvent();
    const title = document.getElementById('eventTitle');
    const icon = document.getElementById('eventIcon');
    const story = document.getElementById('eventStory');
    const optionsContainer = document.getElementById('eventOptionsList');

    if (title) title.textContent = evt.title;
    if (icon) icon.textContent = evt.imageIcon;
    if (story) story.textContent = evt.story;

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      evt.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'event-choice-btn';
        btn.textContent = opt.text;

        btn.addEventListener('click', () => {
          const res = opt.execute(window.gameState);
          if (res.action === 'REMOVE_CARD') {
            this.openDeckViewerModal('REMOVE', () => this.openMapScreen());
          } else if (res.action === 'UPGRADE_CARD') {
            this.openDeckViewerModal('UPGRADE', () => this.openMapScreen());
          } else {
            story.textContent = res.text;
            optionsContainer.innerHTML = `
              <button class="event-choice-btn" onclick="spireApp.openMapScreen()">Lanjutkan Petualangan</button>
            `;
          }
          this.renderTopHud();
        });

        optionsContainer.appendChild(btn);
      });
    }
  }

  openChestScreen() {
    this.switchScreen('CHEST_SCREEN');
    const chestReward = document.getElementById('chestRewardArea');
    if (!chestReward) return;

    chestReward.innerHTML = `
      <div class="chest-box" onclick="spireApp.openChestReward()">
        <span class="chest-emoji">🎁</span>
        <p>Klik untuk membuka peti harta karun kuno!</p>
      </div>
    `;
  }

  openChestReward() {
    const chestReward = document.getElementById('chestRewardArea');
    const relic = window.getRandomRelic(window.gameState.relics);
    const gold = 50 + Math.floor(Math.random() * 30);
    window.gameState.addGold(gold);
    if (relic) window.gameState.addRelic(relic);

    if (window.spireAudio) window.spireAudio.playVictory();

    if (chestReward) {
      chestReward.innerHTML = `
        <div class="chest-opened-content">
          <h3>Peti Terbuka!</h3>
          <p>Mendapatkan 💰 <strong>${gold} Gold</strong></p>
          ${relic ? `<p>Mendapatkan Relic: ${relic.icon} <strong>${relic.name}</strong> (${relic.description})</p>` : ''}
          <button class="spire-btn primary-btn" onclick="spireApp.openMapScreen()">Lanjutkan ke Peta</button>
        </div>
      `;
    }
    this.renderTopHud();
  }

  openDeckViewerModal(mode = 'VIEW', callbackOnDone = null) {
    const modal = document.getElementById('deckViewerModal');
    const grid = document.getElementById('deckViewerGrid');
    const title = document.getElementById('deckViewerTitle');
    if (!modal || !grid) return;

    if (title) {
      if (mode === 'UPGRADE') title.textContent = 'Pilih Kartu untuk Diperkuat (Smith)';
      else if (mode === 'REMOVE') title.textContent = 'Pilih Kartu untuk Dibuang Permanen';
      else title.textContent = `Seluruh Kartu di Deck (${window.gameState.deck.length} Kartu)`;
    }

    grid.innerHTML = '';
    window.gameState.deck.forEach(card => {
      const cardElem = document.createElement('div');
      cardElem.className = `spire-card card-${card.type.toLowerCase()} rarity-${card.rarity.toLowerCase()} ${card.isUpgraded ? 'upgraded' : ''}`;
      cardElem.innerHTML = typeof card.renderHtml === 'function' ? card.renderHtml(null) : cardElem.innerHTML;

      if (mode === 'UPGRADE') {
        if (card.isUpgraded) {
          cardElem.classList.add('unplayable');
        } else {
          cardElem.addEventListener('click', () => {
            window.gameState.upgradeCard(card.uid);
            if (window.spireAudio) window.spireAudio.playPowerBuff();
            modal.style.display = 'none';
            if (callbackOnDone) callbackOnDone();
            else this.openMapScreen();
          });
        }
      } else if (mode === 'REMOVE') {
        cardElem.addEventListener('click', () => {
          window.gameState.removeCard(card.uid);
          if (window.spireAudio) window.spireAudio.playCardDraw();
          modal.style.display = 'none';
          if (callbackOnDone) callbackOnDone();
          else this.renderTopHud();
        });
      }

      grid.appendChild(cardElem);
    });

    modal.style.display = 'flex';
  }

  openPileViewerModal(pileType = 'draw') {
    const modal = document.getElementById('deckViewerModal');
    const grid = document.getElementById('deckViewerGrid');
    const title = document.getElementById('deckViewerTitle');
    if (!modal || !grid || !window.spireCombat.isActive) return;

    let pile = window.spireCombat.drawPile;
    if (pileType === 'discard') pile = window.spireCombat.discardPile;
    if (pileType === 'exhaust') pile = window.spireCombat.exhaustPile;

    if (title) {
      title.textContent = `Tumpukan ${pileType.toUpperCase()} (${pile.length} Kartu)`;
    }

    grid.innerHTML = '';
    pile.forEach(card => {
      const cardElem = document.createElement('div');
      cardElem.className = `spire-card card-${card.type.toLowerCase()} rarity-${card.rarity.toLowerCase()} ${card.isUpgraded ? 'upgraded' : ''}`;
      cardElem.innerHTML = typeof card.renderHtml === 'function' ? card.renderHtml(null) : cardElem.innerHTML;
      grid.appendChild(cardElem);
    });

    modal.style.display = 'flex';
  }

  closeAllModals() {
    const modals = document.querySelectorAll('.spire-modal-backdrop');
    modals.forEach(m => m.style.display = 'none');
  }

  showGameOverScreen(isVictory = false) {
    this.switchScreen('GAME_OVER_SCREEN');
    const title = document.getElementById('gameOverTitle');
    const statsContainer = document.getElementById('gameOverStats');
    if (title) {
      title.textContent = isVictory ? 'VICTORY ACHIEVED!' : 'DEFEAT...';
      title.style.color = isVictory ? '#ffd43b' : '#ff4d4d';
    }

    if (statsContainer && window.gameState) {
      const s = window.gameState.stats;
      statsContainer.innerHTML = `
        <div class="stat-line"><span>Lantai Dicapai:</span> <strong>${s.floorsCleared}</strong></div>
        <div class="stat-line"><span>Monster Dikalahkan:</span> <strong>${s.monstersSlain}</strong></div>
        <div class="stat-line"><span>Elite Dibantai:</span> <strong>${s.elitesSlain}</strong></div>
        <div class="stat-line"><span>Boss Dihancurkan:</span> <strong>${s.bossesSlain}</strong></div>
        <div class="stat-line"><span>Kartu Ditingkatkan:</span> <strong>${s.cardsUpgraded}</strong></div>
        <div class="stat-line"><span>Total Emas Terkumpul:</span> <strong>${s.goldEarned} Gold</strong></div>
      `;
    }
  }
}

window.spireApp = new SpireApp();

window.addEventListener('DOMContentLoaded', () => {
  window.spireApp.init();
});
