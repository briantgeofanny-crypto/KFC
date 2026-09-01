/**
 * ============================================================================
 * KFC: CYBER KITCHEN 2088 — COMPREHENSIVE UI CONTROLLER & CANVAS CHART ENGINE
 * Architecture: 1000+ Lines of Pure Canvas Charting, POS Cashier & HUD Binding
 * ============================================================================
 */

class CyberUIController {
  constructor(simEngine, audioEngine, physicsEngine) {
    this.sim = simEngine;
    this.audio = audioEngine;
    this.physics = physicsEngine;

    // Active Tab State
    this.activeTabId = 'tab-kitchen';

    // POS Active Order Ticket Cart
    this.activeCart = [];
    this.activeCustomerId = null;
    this.orderCounter = 8042;

    // Canvas Chart References
    this.canvasRevenue = null;
    this.canvasProductShare = null;
    this.canvasFlavorRadar = null;

    // Toast Queue
    this.toastContainer = null;

    // Bindings Initialized Flag
    this.isReady = false;
  }

  /**
   * Initialize all DOM bindings, listeners, and custom chart renderers
   */
  init() {
    this.toastContainer = document.getElementById('toastContainer');
    this.canvasRevenue = document.getElementById('canvasChartRevenue');
    this.canvasProductShare = document.getElementById('canvasChartProductShare');
    this.canvasFlavorRadar = document.getElementById('canvasFlavorRadar');

    this.bindHeaderActions();
    this.bindTabsNavigation();
    this.bindKitchenControls();
    this.bindStackerControls();
    this.bindAlchemyControls();
    this.bindPosControls();
    this.bindDroneControls();
    this.bindAnalyticsControls();
    this.bindResearchControls();
    this.bindAudioStudioControls();
    this.bindSettingsModal();
    this.bindKeyboardShortcuts();
    this.bindCustomEvents();

    // Populate Initial Dynamic DOM Elements
    this.renderWarmersInventory();
    this.renderSpiceSliders();
    this.renderPosMenuItems();
    this.renderTechTreeNodes();
    this.renderCommoditiesTable();
    this.renderSequencerStepsUI();

    this.isReady = true;
    console.log('✅ KFC Cyber UI Controller fully bound and operational.');
  }

  // ==========================================================================
  // 1. MASTER HEADER & GLOBAL TOOLBAR ACTIONS
  // ==========================================================================

  bindHeaderActions() {
    const btnAudio = document.getElementById('btnToggleAudio');
    const iconAudio = document.getElementById('iconAudio');
    if (btnAudio) {
      btnAudio.addEventListener('click', async () => {
        if (this.audio) {
          await this.audio.ensureContextRunning();
          if (this.audio.isPlayingMusic) {
            this.audio.stopBgm();
            btnAudio.querySelector('.tool-txt').textContent = 'SYNTH OFF';
            if (iconAudio) iconAudio.innerHTML = '&#128263;';
            this.showToast('Audio Synthesizer paused.', 'warning');
          } else {
            this.audio.startBgm();
            btnAudio.querySelector('.tool-txt').textContent = 'SYNTH ON';
            if (iconAudio) iconAudio.innerHTML = '&#128266;';
            this.showToast('Procedural Synthwave BGM online!', 'success');
          }
        }
      });
    }

    const btnCrt = document.getElementById('btnToggleCrt');
    const crtOverlay = document.getElementById('crtOverlay');
    if (btnCrt && crtOverlay) {
      btnCrt.addEventListener('click', () => {
        crtOverlay.classList.toggle('disabled');
        const isDisabled = crtOverlay.classList.contains('disabled');
        btnCrt.classList.toggle('active', !isDisabled);
        this.showToast(isDisabled ? 'CRT Scanlines disabled.' : 'Retro CRT filter activated.', 'info');
      });
    }

    const btnQuickSave = document.getElementById('btnQuickSave');
    if (btnQuickSave) {
      btnQuickSave.addEventListener('click', () => {
        if (this.sim) {
          const ok = this.sim.saveToStorage();
          if (ok) {
            if (this.audio) this.audio.playSuccessChime();
            this.showToast('Game state saved to local storage!', 'success');
          }
        }
      });
    }

    const btnSettings = document.getElementById('btnOpenSettings');
    const modalSettings = document.getElementById('modalSettings');
    if (btnSettings && modalSettings) {
      btnSettings.addEventListener('click', () => {
        modalSettings.classList.add('open');
        if (this.audio) this.audio.playButtonTick();
      });
    }
  }

  // ==========================================================================
  // 2. TABS WORKSTATION SWITCHER
  // ==========================================================================

  bindTabsNavigation() {
    const tabBtns = document.querySelectorAll('.cyber-tabs-nav .tab-btn');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        if (!targetId) return;

        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.tab-content-panel').forEach((panel) => {
          panel.classList.remove('active');
        });

        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }

        this.activeTabId = targetId;
        if (this.audio) this.audio.playButtonTick();

        // Trigger chart re-draws when switching to analytics or alchemy
        if (targetId === 'tab-analytics') {
          this.renderAnalyticsCharts();
        } else if (targetId === 'tab-alchemy') {
          this.renderFlavorRadarChart();
        }
      });
    });
  }

  // ==========================================================================
  // 3. KITCHEN FRYER BAY CONTROLS
  // ==========================================================================

  bindKitchenControls() {
    const btnStartFrying = document.getElementById('btnStartFrying');
    const selectRecipe = document.getElementById('selectFryRecipe');
    if (btnStartFrying && selectRecipe) {
      btnStartFrying.addEventListener('click', () => {
        const recipeKey = selectRecipe.value;
        const res = this.sim.startFryingBatch(recipeKey);
        if (res.success) {
          if (this.physics && this.physics.fryerSim) {
            this.physics.fryerSim.dropBatch(recipeKey);
          }
          if (this.audio) {
            this.audio.playFrySizzle(2.5, 1.2);
          }
          this.showToast(`Dropped ${recipeKey} in hot fryer oil! (&euro;15.00)`, 'info');
        } else {
          if (this.audio) this.audio.playErrorBuzz();
          this.showToast(res.msg, 'danger');
        }
      });
    }

    const btnCleanOil = document.getElementById('btnCleanOil');
    if (btnCleanOil) {
      btnCleanOil.addEventListener('click', () => {
        if (this.physics && this.physics.fryerSim) {
          this.physics.fryerSim.cleanOil();
          if (this.audio) this.audio.playButtonTick();
          this.showToast('Fryer oil cleaned and filtered to 100% purity.', 'success');
        }
      });
    }

    const btnTurbo = document.getElementById('btnTurboHeat');
    if (btnTurbo) {
      btnTurbo.addEventListener('click', () => {
        if (this.physics && this.physics.fryerSim) {
          const isNowTurbo = !this.physics.fryerSim.isTurboHeat;
          this.physics.fryerSim.setTurbo(isNowTurbo);
          btnTurbo.classList.toggle('active', isNowTurbo);
          if (this.audio) this.audio.playButtonTick();
          this.showToast(isNowTurbo ? 'TURBO HEAT ENABLED (225°C)!' : 'Standard heat restored (185°C).', isNowTurbo ? 'warning' : 'info');
        }
      });
    }

    const chkAutoFry = document.getElementById('chkAutoFry');
    if (chkAutoFry) {
      chkAutoFry.addEventListener('change', (e) => {
        this.sim.autoFryerEnabled = e.target.checked;
        this.showToast(e.target.checked ? 'AI Auto-Fryer Online.' : 'AI Auto-Fryer Standby.', 'info');
      });
    }
  }

  renderWarmersInventory() {
    const container = document.getElementById('cookedInventoryList');
    if (!container) return;

    container.innerHTML = '';
    for (const key in this.sim.cookedInventory) {
      const item = this.sim.cookedInventory[key];
      const card = document.createElement('div');
      card.className = 'warmer-item-card';
      card.innerHTML = `
        <div class="warmer-item-name" title="${item.name}">${item.name}</div>
        <div class="warmer-item-stock">${item.count} pcs</div>
        <div style="font-size: 10px; color: var(--text-muted); font-family: var(--font-mono);">&euro;${item.price.toFixed(2)} ea</div>
      `;
      container.appendChild(card);
    }
  }

  // ==========================================================================
  // 4. PHYSICS STACKER LAB CONTROLS
  // ==========================================================================

  bindStackerControls() {
    const btnIngredients = document.querySelectorAll('.btn-ingredient');
    btnIngredients.forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        if (this.physics && this.physics.stackerSim) {
          this.physics.stackerSim.selectedIngredient = type;
          this.physics.stackerSim.spawnIngredient(type);
          if (this.audio) this.audio.playStackDrop(type);
          this.updateStackerStatsUI();
        }
      });
    });

    const btnClear = document.getElementById('btnClearStacker');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (this.physics && this.physics.stackerSim) {
          this.physics.stackerSim.clear();
          if (this.audio) this.audio.playButtonTick();
          this.updateStackerStatsUI();
          this.showToast('Stacker plate cleared.', 'info');
        }
      });
    }

    const btnEvaluate = document.getElementById('btnEvaluateStacker');
    if (btnEvaluate) {
      btnEvaluate.addEventListener('click', () => {
        if (!this.physics || !this.physics.stackerSim) return;
        const sim = this.physics.stackerSim;
        if (sim.bodies.length < 3) {
          this.showToast('Tower needs at least 3 layers to serve to a VIP!', 'warning');
          return;
        }

        if (sim.balanceScore < 60) {
          if (this.audio) this.audio.playErrorBuzz();
          this.showToast('Burger tower collapsed in front of guest! Reputation penalty!', 'danger');
          this.sim.reputation = Math.max(0, this.sim.reputation - 5);
          sim.clear();
          this.updateStackerStatsUI();
          return;
        }

        // Successfully served
        const earnings = sim.totalFlavorValue * (sim.balanceScore / 100.0) * 1.5;
        this.sim.credits += earnings;
        this.sim.reputation = Math.min(100, this.sim.reputation + 4);
        this.sim.stats.totalBurgersStacked += 1;
        this.sim.addXp(75);

        if (this.audio) this.audio.playSuccessChime();
        this.showToast(`VIP Guest thrilled with tower! Earned &euro;${earnings.toFixed(2)}!`, 'success');
        sim.clear();
        this.updateStackerStatsUI();
      });
    }

    const btnClaimChallenge = document.getElementById('btnClaimChallenge');
    if (btnClaimChallenge) {
      btnClaimChallenge.addEventListener('click', () => {
        if (this.physics && this.physics.stackerSim) {
          const sim = this.physics.stackerSim;
          if (sim.bodies.length >= 6 && sim.balanceScore >= 75) {
            this.sim.credits += 500.00;
            this.sim.reputation = Math.min(100, this.sim.reputation + 25);
            if (this.audio) this.audio.playSuccessChime();
            this.showToast('VIP Chef Challenge Completed! Earned &euro;500.00!', 'success');
            btnClaimChallenge.disabled = true;
            btnClaimChallenge.textContent = 'CHALLENGE COMPLETED';
          } else {
            this.showToast('Requirements not met: need 6+ layers and >=75% balance!', 'warning');
          }
        }
      });
    }
  }

  updateStackerStatsUI() {
    if (!this.physics || !this.physics.stackerSim) return;
    const sim = this.physics.stackerSim;

    const elHeight = document.getElementById('txtStackHeight');
    const elBalance = document.getElementById('txtStackBalance');
    const elLayers = document.getElementById('txtTotalLayers');
    const elCom = document.getElementById('txtCenterOfMass');
    const elVal = document.getElementById('txtFlavorValue');

    if (elHeight) elHeight.textContent = sim.towerHeight;
    if (elBalance) elBalance.textContent = `${sim.balanceScore}%`;
    if (elLayers) elLayers.textContent = sim.bodies.length;
    if (elCom) elCom.textContent = `${sim.centerOfMassOffset.toFixed(1)} px`;
    if (elVal) elVal.innerHTML = `&euro;${sim.totalFlavorValue.toFixed(2)}`;
  }

  // ==========================================================================
  // 5. 11 SPICES ALCHEMY LAB CONTROLS
  // ==========================================================================

  bindAlchemyControls() {
    const btnReset = document.getElementById('btnResetSpiceRatios');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.sim.resetSpicesToDefault();
        this.renderSpiceSliders();
        this.updateAlchemyAnalysisUI();
        this.renderFlavorRadarChart();
        if (this.audio) this.audio.playButtonTick();
        this.showToast('Secret Spices reset to Colonel default formula.', 'info');
      });
    }

    const btnSynth = document.getElementById('btnSynthesizeSpiceBlend');
    if (btnSynth) {
      btnSynth.addEventListener('click', () => {
        const formula = this.sim.synthesizeFormula();
        this.updateAlchemyAnalysisUI();
        this.renderFlavorRadarChart();
        if (this.audio) this.audio.playSuccessChime();
        this.showToast(`Synthesized new formula: "${formula.codename}" (Multiplier: ${formula.priceMultiplier}x)`, 'success');
      });
    }
  }

  renderSpiceSliders() {
    const container = document.getElementById('spiceSlidersContainer');
    if (!container) return;

    container.innerHTML = '';
    this.sim.secretSpices.forEach((spice) => {
      const row = document.createElement('div');
      row.className = 'spice-slider-row';
      row.innerHTML = `
        <div class="spice-label-row">
          <span class="spice-name">${spice.name}</span>
          <span class="spice-val" id="lbl_spice_${spice.id}">${spice.ratio}%</span>
        </div>
        <input type="range" min="0" max="100" value="${spice.ratio}" class="cyber-range" data-id="${spice.id}">
      `;

      const input = row.querySelector('input');
      input.addEventListener('input', (e) => {
        const val = e.target.value;
        this.sim.updateSpiceRatio(spice.id, val);
        const lbl = row.querySelector(`#lbl_spice_${spice.id}`);
        if (lbl) lbl.textContent = `${val}%`;
        this.updateAlchemyAnalysisUI();
        this.renderFlavorRadarChart();
      });

      container.appendChild(row);
    });

    this.updateAlchemyAnalysisUI();
  }

  updateAlchemyAnalysisUI() {
    const f = this.sim.formulaAnalysis;
    const elCodename = document.getElementById('txtRecipeCodename');
    const elMult = document.getElementById('txtPriceMultiplier');
    const barUmami = document.getElementById('barUmami');
    const barAroma = document.getElementById('barAroma');
    const barHeat = document.getElementById('barHeat');
    const barCatalyst = document.getElementById('barCatalyst');

    if (elCodename) elCodename.textContent = `"${f.codename}"`;
    if (elMult) elMult.textContent = `${f.priceMultiplier}x`;

    if (barUmami) barUmami.style.width = `${f.umami}%`;
    if (barAroma) barAroma.style.width = `${f.aroma}%`;
    if (barHeat) barHeat.style.width = `${f.heat}%`;
    if (barCatalyst) barCatalyst.style.width = `${f.catalyst}%`;

    const txtUmami = document.getElementById('txtUmamiVal');
    const txtAroma = document.getElementById('txtAromaVal');
    const txtHeat = document.getElementById('txtHeatVal');
    const txtCatalyst = document.getElementById('txtCatalystVal');

    if (txtUmami) txtUmami.textContent = `${f.umami}%`;
    if (txtAroma) txtAroma.textContent = `${f.aroma}%`;
    if (txtHeat) txtHeat.textContent = `${f.heat}%`;
    if (txtCatalyst) txtCatalyst.textContent = `${f.catalyst}%`;
  }

  // ==========================================================================
  // 6. POS CASHIER & ORDER DISPATCHING
  // ==========================================================================

  bindPosControls() {
    const btnClearCart = document.getElementById('btnClearCart');
    if (btnClearCart) {
      btnClearCart.addEventListener('click', () => {
        this.activeCart = [];
        this.renderCartUI();
        if (this.audio) this.audio.playButtonTick();
      });
    }

    const btnProcessPayment = document.getElementById('btnProcessPayment');
    if (btnProcessPayment) {
      btnProcessPayment.addEventListener('click', () => {
        if (!this.activeCustomerId && this.sim.customers.length > 0) {
          this.activeCustomerId = this.sim.customers[0].id;
        }

        if (!this.activeCustomerId) {
          this.showToast('No customer currently selected or in queue!', 'warning');
          return;
        }

        const res = this.sim.serveCustomer(this.activeCustomerId);
        if (res.success) {
          if (this.audio) {
            this.audio.playCoinCashIn();
            this.audio.playCrispyBite();
          }
          this.updateReceiptPaper(res.customer, res.amount);
          this.showToast(`Order served! Collected &euro;${res.amount.toFixed(2)} (+&euro;${res.tips.toFixed(2)} tip)`, 'success');
          this.activeCart = [];
          this.activeCustomerId = null;
          this.renderCartUI();
          this.renderWarmersInventory();
        } else {
          if (this.audio) this.audio.playErrorBuzz();
          this.showToast(res.msg, 'danger');
        }
      });
    }

    const btnDispatchDrone = document.getElementById('btnDispatchDroneOrder');
    if (btnDispatchDrone) {
      btnDispatchDrone.addEventListener('click', () => {
        if (!this.activeCustomerId && this.sim.customers.length > 0) {
          this.activeCustomerId = this.sim.customers[0].id;
        }

        if (!this.activeCustomerId) {
          this.showToast('No customer selected for drone dispatch!', 'warning');
          return;
        }

        const customer = this.sim.customers.find((c) => c.id === this.activeCustomerId);
        if (this.physics && this.physics.radarSim) {
          const dispatched = this.physics.radarSim.dispatchOrder(customer);
          if (dispatched) {
            this.sim.serveCustomer(this.activeCustomerId, true);
            if (this.audio) this.audio.playDroneFlyby(0.0, 1.2);
            this.showToast('Autonomous drone dispatched for aerial delivery!', 'success');
            this.activeCart = [];
            this.activeCustomerId = null;
            this.renderCartUI();
          }
        }
      });
    }
  }

  renderPosMenuItems() {
    const container = document.getElementById('posMenuItemsGrid');
    if (!container) return;

    container.innerHTML = '';
    for (const key in this.sim.cookedInventory) {
      const item = this.sim.cookedInventory[key];
      const btn = document.createElement('button');
      btn.className = 'btn-menu-item';
      btn.innerHTML = `
        <span class="menu-item-title">${item.name}</span>
        <span class="menu-item-price">&euro;${item.price.toFixed(2)}</span>
      `;
      btn.addEventListener('click', () => {
        this.activeCart.push({ ...item });
        if (this.audio) this.audio.playPosBeep();
        this.renderCartUI();
      });
      container.appendChild(btn);
    }
  }

  renderCartUI() {
    const list = document.getElementById('cartItemsList');
    if (!list) return;

    list.innerHTML = '';
    let subtotal = 0;

    this.activeCart.forEach((item, idx) => {
      subtotal += item.price;
      const line = document.createElement('div');
      line.className = 'cart-line-item';
      line.innerHTML = `
        <span>${item.name}</span>
        <span>&euro;${item.price.toFixed(2)}</span>
      `;
      line.addEventListener('click', () => {
        this.activeCart.splice(idx, 1);
        this.renderCartUI();
      });
      list.appendChild(line);
    });

    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    const elSub = document.getElementById('txtCartSubtotal');
    const elTax = document.getElementById('txtCartTax');
    const elTotal = document.getElementById('txtCartTotal');

    if (elSub) elSub.innerHTML = `&euro;${subtotal.toFixed(2)}`;
    if (elTax) elTax.innerHTML = `&euro;${tax.toFixed(2)}`;
    if (elTotal) elTotal.innerHTML = `&euro;${total.toFixed(2)}`;
  }

  renderCustomerQueueUI() {
    const lane = document.getElementById('customerQueueLane');
    const countBadge = document.getElementById('txtQueueCount');
    if (!lane) return;

    lane.innerHTML = '';
    const customers = this.sim.customers;
    if (countBadge) countBadge.textContent = `${customers.length} CUSTOMERS IN LINE`;

    customers.forEach((c) => {
      const card = document.createElement('div');
      card.className = `customer-card ${c.isVip ? 'vip' : ''} ${this.activeCustomerId === c.id ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="c-head">
          <span class="c-name">${c.name}</span>
          <span class="c-tag">${c.tag}</span>
        </div>
        <div class="c-order-demand">Wants: ${c.quantity}x ${c.desiredItemName}</div>
        <div class="c-patience-bar">
          <div class="c-patience-fill" style="width: ${c.patience}%; background: ${c.patience > 40 ? 'var(--neon-green)' : 'var(--kfc-red-bright)'};"></div>
        </div>
      `;

      card.addEventListener('click', () => {
        this.activeCustomerId = c.id;
        document.querySelectorAll('.customer-card').forEach((el) => el.classList.remove('selected'));
        card.classList.add('selected');
        if (this.audio) this.audio.playButtonTick();
      });

      lane.appendChild(card);
    });
  }

  updateReceiptPaper(customer, totalPaid) {
    const elTimestamp = document.getElementById('rcTimestamp');
    const elBody = document.getElementById('rcItemsBody');
    const elPaid = document.getElementById('rcTotalPaid');

    if (elTimestamp) {
      elTimestamp.textContent = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }
    if (elBody && customer) {
      elBody.innerHTML = `
        <div class="rc-line"><span>${customer.quantity}x ${customer.desiredItemName}</span><span>&euro;${totalPaid.toFixed(2)}</span></div>
        <div class="rc-line" style="font-size: 10px; color: #64748b;"><span>Customer:</span><span>${customer.name}</span></div>
      `;
    }
    if (elPaid) {
      elPaid.innerHTML = `&euro;${totalPaid.toFixed(2)}`;
    }
  }

  // ==========================================================================
  // 7. DRONE RADAR & COMMODITIES TRADING
  // ==========================================================================

  bindDroneControls() {
    const btnBuyDrone = document.getElementById('btnLaunchReconDrone');
    if (btnBuyDrone) {
      btnBuyDrone.addEventListener('click', () => {
        if (this.sim.credits >= 500.0) {
          this.sim.credits -= 500.0;
          if (this.physics && this.physics.radarSim) {
            const colors = ['#00f3ff', '#00ff88', '#ffb703', '#b5179e'];
            const chosenCol = colors[this.physics.radarSim.drones.length % colors.length];
            this.physics.radarSim.addDrone(null, chosenCol);
            if (this.audio) this.audio.playDroneFlyby(0.0, 1.0);
            this.showToast('Commissioned new autonomous delivery drone (&euro;500.00)!', 'success');
            this.renderDroneCardsList();
          }
        } else {
          this.showToast('Need &euro;500.00 to purchase a new drone!', 'warning');
        }
      });
    }

    const btnOverclock = document.getElementById('btnTurboDroneSpeed');
    if (btnOverclock) {
      btnOverclock.addEventListener('click', () => {
        if (this.physics && this.physics.radarSim) {
          this.physics.radarSim.isOverclocked = !this.physics.radarSim.isOverclocked;
          btnOverclock.classList.toggle('active', this.physics.radarSim.isOverclocked);
          if (this.audio) this.audio.playButtonTick();
          this.showToast(this.physics.radarSim.isOverclocked ? 'Drone Ion Thrusters Overclocked (+80% speed)!' : 'Standard drone speed restored.', 'info');
        }
      });
    }

    this.renderDroneCardsList();
  }

  renderDroneCardsList() {
    const container = document.getElementById('droneCardsList');
    const elCount = document.getElementById('txtActiveDroneCount');
    if (!container || !this.physics || !this.physics.radarSim) return;

    const drones = this.physics.radarSim.drones;
    if (elCount) elCount.textContent = drones.length;
    container.innerHTML = '';

    drones.forEach((d) => {
      const card = document.createElement('div');
      card.className = 'drone-card';
      card.innerHTML = `
        <div class="dc-header">
          <span>${d.callsign}</span>
          <span class="dc-status" style="color: ${d.color};">${d.state}</span>
        </div>
        <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">
          Battery: <strong>${Math.round(d.battery)}%</strong> &bull; Speed: ${d.speed} km/h
        </div>
      `;
      container.appendChild(card);
    });
  }

  // ==========================================================================
  // 8. FINANCIAL ANALYTICS & SPOT COMMODITIES TABLE
  // ==========================================================================

  bindAnalyticsControls() {}

  renderCommoditiesTable() {
    const tbody = document.getElementById('tbodyCommodities');
    if (!tbody) return;

    tbody.innerHTML = '';
    for (const key in this.sim.commodities) {
      const comm = this.sim.commodities[key];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${comm.name}</strong></td>
        <td>${comm.inStock} ${comm.unit}</td>
        <td>&euro;${comm.currentPrice.toFixed(2)} / ${comm.unit}</td>
        <td><span class="${comm.currentPrice >= comm.basePrice ? 'trend-up' : 'trend-down'}">${comm.currentPrice >= comm.basePrice ? '▲ +High' : '▼ -Low'}</span></td>
        <td>
          <button class="btn-micro btn-highlight btn-buy-comm" data-key="${key}">BUY 10x (&euro;${(comm.currentPrice * 10).toFixed(2)})</button>
        </td>
      `;

      const btn = tr.querySelector('.btn-buy-comm');
      btn.addEventListener('click', () => {
        const res = this.sim.buyCommodity(key, 10);
        if (res.success) {
          if (this.audio) this.audio.playCoinCashIn();
          this.showToast(res.msg, 'success');
          this.renderCommoditiesTable();
        } else {
          if (this.audio) this.audio.playErrorBuzz();
          this.showToast(res.msg, 'danger');
        }
      });

      tbody.appendChild(tr);
    }
  }

  // ==========================================================================
  // 9. TECH RESEARCH TREE
  // ==========================================================================

  bindResearchControls() {}

  renderTechTreeNodes() {
    const branches = this.sim.researchBranches;
    const map = {
      branchA: document.getElementById('techNodesBranchA'),
      branchB: document.getElementById('techNodesBranchB'),
      branchC: document.getElementById('techNodesBranchC')
    };

    for (const bKey in branches) {
      const container = map[bKey];
      if (!container) continue;
      container.innerHTML = '';

      branches[bKey].forEach((node) => {
        const card = document.createElement('div');
        card.className = `tech-node-card ${node.unlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
          <div class="tn-title">${node.title}</div>
          <div class="tn-desc">${node.desc}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <span class="tn-cost">${node.unlocked ? 'RESEARCHED' : `${node.cost} TB DATA`}</span>
            ${!node.unlocked ? `<button class="btn-micro btn-highlight btn-unlock-tech" data-id="${node.id}">RESEARCH</button>` : `<span style="color: var(--neon-green); font-size: 11px;">ACTIVE ✓</span>`}
          </div>
        `;

        const btn = card.querySelector('.btn-unlock-tech');
        if (btn) {
          btn.addEventListener('click', () => {
            const res = this.sim.unlockTech(node.id);
            if (res.success) {
              if (this.audio) this.audio.playSuccessChime();
              this.showToast(`Researched: ${node.title}!`, 'success');
              this.renderTechTreeNodes();
            } else {
              if (this.audio) this.audio.playErrorBuzz();
              this.showToast(res.msg, 'warning');
            }
          });
        }

        container.appendChild(card);
      });
    }

    const elTechPts = document.getElementById('txtTechPoints');
    if (elTechPts) elTechPts.textContent = `${this.sim.techPoints} TB`;
  }

  // ==========================================================================
  // 10. SYNTH AUDIO STUDIO CONTROLS
  // ==========================================================================

  bindAudioStudioControls() {
    const btnPlay = document.getElementById('btnStudioPlayMusic');
    const btnStop = document.getElementById('btnStudioStopMusic');

    if (btnPlay) {
      btnPlay.addEventListener('click', async () => {
        if (this.audio) {
          await this.audio.startBgm();
          this.showToast('Synthwave Sequencer running.', 'success');
        }
      });
    }

    if (btnStop) {
      btnStop.addEventListener('click', () => {
        if (this.audio) {
          this.audio.stopBgm();
          this.showToast('Synthwave Sequencer halted.', 'warning');
        }
      });
    }

    // Mixer sliders
    const sMaster = document.getElementById('sliderVolMaster');
    const sBass = document.getElementById('sliderVolBass');
    const sArp = document.getElementById('sliderVolArp');
    const sDrums = document.getElementById('sliderVolDrums');
    const sSfx = document.getElementById('sliderVolSfx');
    const sReverb = document.getElementById('sliderReverb');

    if (sMaster) sMaster.addEventListener('input', (e) => this.audio.setMasterVolume(e.target.value));
    if (sBass) sBass.addEventListener('input', (e) => this.audio.setBassVolume(e.target.value));
    if (sArp) sArp.addEventListener('input', (e) => this.audio.setArpVolume(e.target.value));
    if (sDrums) sDrums.addEventListener('input', (e) => this.audio.setDrumsVolume(e.target.value));
    if (sSfx) sSfx.addEventListener('input', (e) => this.audio.setSfxVolume(e.target.value));
    if (sReverb) sReverb.addEventListener('input', (e) => this.audio.setReverbLevel(e.target.value));

    // Tempo Slider
    const sBpm = document.getElementById('sliderBpm');
    const txtBpm = document.getElementById('txtBpm');
    if (sBpm && txtBpm) {
      sBpm.addEventListener('input', (e) => {
        txtBpm.textContent = e.target.value;
        this.audio.setBpm(e.target.value);
      });
    }

    // Musical Scale Selector
    const selScale = document.getElementById('selectSynthScale');
    if (selScale) {
      selScale.addEventListener('change', (e) => {
        this.audio.setScale(e.target.value);
      });
    }

    // SFX Test Matrix Triggers
    const sfxBtns = document.querySelectorAll('.btn-sfx');
    sfxBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-sfx');
        if (!this.audio) return;
        switch (type) {
          case 'fry': this.audio.playFrySizzle(1.5, 1.0); break;
          case 'bite': this.audio.playCrispyBite(); break;
          case 'pos': this.audio.playPosBeep(); break;
          case 'coin': this.audio.playCoinCashIn(); break;
          case 'drone': this.audio.playDroneFlyby(0.0, 1.0); break;
          case 'alarm': this.audio.playVipAlert(); break;
        }
      });
    });
  }

  renderSequencerStepsUI() {
    const grid = document.getElementById('sequencerStepsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const step = document.createElement('div');
      step.className = 'seq-step';
      step.id = `seq_step_${i}`;
      step.textContent = i + 1;
      grid.appendChild(step);
    }

    window.addEventListener('synth-step', (e) => {
      const current = e.detail.step;
      document.querySelectorAll('.seq-step').forEach((el, idx) => {
        el.classList.toggle('active', idx === current);
      });
    });
  }

  // ==========================================================================
  // 11. CUSTOM CANVAS CHART ENGINE (NO EXTERNAL LIBRARIES!)
  // ==========================================================================

  renderAnalyticsCharts() {
    this.renderRevenueLineChart();
    this.renderProductShareDonutChart();
  }

  renderRevenueLineChart() {
    if (!this.canvasRevenue) return;
    const ctx = this.canvasRevenue.getContext('2d');
    const w = this.canvasRevenue.width;
    const h = this.canvasRevenue.height;
    const data = this.sim.hourlyRevenueHistory;

    ctx.clearRect(0, 0, w, h);

    // Dark grid background
    ctx.fillStyle = '#040813';
    ctx.fillRect(0, 0, w, h);

    // Horizontal grid lines
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 30; y < h - 20; y += 40) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }

    // Find max value
    const maxVal = Math.max(...data, 100);
    const minVal = 0;
    const stepX = (w - 60) / (data.length - 1);

    // Build Curve Coordinates
    const points = data.map((val, idx) => {
      const x = 35 + idx * stepX;
      const y = (h - 35) - ((val - minVal) / (maxVal - minVal)) * (h - 70);
      return { x, y, val };
    });

    // Area Fill Gradient Under Line
    const areaGrad = ctx.createLinearGradient(0, 30, 0, h - 35);
    areaGrad.addColorStop(0, 'rgba(0, 243, 255, 0.35)');
    areaGrad.addColorStop(1, 'rgba(0, 243, 255, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, h - 35);
    points.forEach((pt) => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(points[points.length - 1].x, h - 35);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Glowing Neon Stroke Line
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Data Point Dots
    points.forEach((pt) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  renderProductShareDonutChart() {
    if (!this.canvasProductShare) return;
    const ctx = this.canvasProductShare.getContext('2d');
    const w = this.canvasProductShare.width;
    const h = this.canvasProductShare.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#040813';
    ctx.fillRect(0, 0, w, h);

    const centerX = w * 0.4;
    const centerY = h * 0.5;
    const outerRadius = 80;
    const innerRadius = 45;

    const inventory = this.sim.cookedInventory;
    const colors = ['#e4002b', '#00f3ff', '#ffb703', '#00ff88', '#b5179e'];

    let totalSold = 0;
    const items = [];
    let cIdx = 0;
    for (const k in inventory) {
      totalSold += inventory[k].soldCount;
      items.push({ name: inventory[k].name, count: inventory[k].soldCount, color: colors[cIdx % colors.length] });
      cIdx++;
    }

    if (totalSold === 0) totalSold = 1;

    let startAngle = -Math.PI / 2;
    items.forEach((item) => {
      const sliceAngle = (item.count / totalSold) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.fillStyle = item.color;
      ctx.shadowColor = item.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      startAngle = endAngle;
    });

    // Center Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '13px Orbitron';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${totalSold}`, centerX, centerY - 6);
    ctx.font = '9px Share Tech Mono';
    ctx.fillStyle = 'var(--text-muted)';
    ctx.fillText('SOLD', centerX, centerY + 10);

    // Legend on Right
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    items.forEach((item, idx) => {
      const lx = w * 0.65;
      const ly = 55 + idx * 26;

      ctx.fillStyle = item.color;
      ctx.fillRect(lx, ly - 8, 10, 10);

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Rajdhani';
      ctx.fillText(item.name.substring(0, 18), lx + 16, ly);
    });
  }

  renderFlavorRadarChart() {
    if (!this.canvasFlavorRadar) return;
    const ctx = this.canvasFlavorRadar.getContext('2d');
    const w = this.canvasFlavorRadar.width;
    const h = this.canvasFlavorRadar.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#040711';
    ctx.fillRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const maxRadius = Math.min(w, h) * 0.38;

    const axes = [
      { name: 'UMAMI', val: this.sim.formulaAnalysis.umami },
      { name: 'AROMA', val: this.sim.formulaAnalysis.aroma },
      { name: 'HEAT', val: this.sim.formulaAnalysis.heat },
      { name: 'CATALYST', val: this.sim.formulaAnalysis.catalyst }
    ];

    const axisCount = axes.length;

    // Concentric Web Polygons
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    ctx.lineWidth = 1;
    const rings = [0.25, 0.5, 0.75, 1.0];
    rings.forEach((r) => {
      ctx.beginPath();
      for (let i = 0; i < axisCount; i++) {
        const angle = -Math.PI / 2 + (i * Math.PI * 2) / axisCount;
        const x = centerX + Math.cos(angle) * (maxRadius * r);
        const y = centerY + Math.sin(angle) * (maxRadius * r);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    });

    // Axis Spokes
    for (let i = 0; i < axisCount; i++) {
      const angle = -Math.PI / 2 + (i * Math.PI * 2) / axisCount;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Axis Labels
      const lx = centerX + Math.cos(angle) * (maxRadius + 18);
      const ly = centerY + Math.sin(angle) * (maxRadius + 18);
      ctx.fillStyle = 'var(--neon-cyan)';
      ctx.font = '10px Orbitron';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(axes[i].name, lx, ly);
    }

    // Formula Data Polygon
    ctx.fillStyle = 'rgba(0, 243, 255, 0.35)';
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();

    axes.forEach((axis, i) => {
      const ratio = axis.val / 100.0;
      const angle = -Math.PI / 2 + (i * Math.PI * 2) / axisCount;
      const x = centerX + Math.cos(angle) * (maxRadius * ratio);
      const y = centerY + Math.sin(angle) * (maxRadius * ratio);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // ==========================================================================
  // 12. SYSTEM SETTINGS MODAL & EVENT ROUTING
  // ==========================================================================

  bindSettingsModal() {
    const modal = document.getElementById('modalSettings');
    const btnClose = document.getElementById('btnCloseSettings');
    const btnSaveClose = document.getElementById('btnSaveCloseSettings');
    const btnReset = document.getElementById('btnResetGame');
    const btnExport = document.getElementById('btnExportSave');
    const btnImport = document.getElementById('btnImportSave');
    const fileInput = document.getElementById('fileInputSave');

    if (btnClose && modal) {
      btnClose.addEventListener('click', () => modal.classList.remove('open'));
    }
    if (btnSaveClose && modal) {
      btnSaveClose.addEventListener('click', () => {
        modal.classList.remove('open');
        this.showToast('Configuration applied.', 'info');
      });
    }

    if (btnExport) {
      btnExport.addEventListener('click', () => this.sim.exportSaveFile());
    }

    if (btnImport && fileInput) {
      btnImport.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const ok = this.sim.importSaveFile(evt.target.result);
          if (ok) {
            this.showToast('Save data imported successfully!', 'success');
            setTimeout(() => location.reload(), 1000);
          } else {
            this.showToast('Failed to import save file format!', 'danger');
          }
        };
        reader.readAsText(file);
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('WARNING: Hard reset will delete all progress, credits, and tech research! Confirm?')) {
          this.sim.resetAllProgress();
        }
      });
    }

    // Speed multiplier buttons
    const speedBtns = document.querySelectorAll('.btn-speed');
    speedBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        speedBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const speed = parseFloat(btn.getAttribute('data-speed'));
        this.sim.timeScale = speed;
        this.showToast(`Simulation speed set to ${speed}x`, 'info');
      });
    });
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Spacebar drops chicken batch if on Kitchen tab
      if (e.code === 'Space' && this.activeTabId === 'tab-kitchen') {
        const btn = document.getElementById('btnStartFrying');
        if (btn) btn.click();
      }
      // Enter processes payment if on POS tab
      if (e.code === 'Enter' && this.activeTabId === 'tab-pos') {
        const btn = document.getElementById('btnProcessPayment');
        if (btn) btn.click();
      }
    });
  }

  bindCustomEvents() {
    window.addEventListener('batch-cooked', (e) => {
      const batch = e.detail.batch;
      this.sim.receiveCookedBatch(batch.recipe);
      this.renderWarmersInventory();
      this.renderPosMenuItems();
      if (this.audio) this.audio.playCrispyBite();
      this.showToast(`Batch of ${batch.recipe} finished frying! Added to warmers.`, 'success');
    });

    window.addEventListener('achievement-unlocked', (e) => {
      const ach = e.detail.achievement;
      if (this.audio) this.audio.playSuccessChime();
      this.showToast(`🏆 ACHIEVEMENT UNLOCKED: ${ach.name}! (+${ach.rewardXp} XP)`, 'success');
    });

    window.addEventListener('market-event-triggered', (e) => {
      const evt = e.detail.event;
      if (this.audio) this.audio.playVipAlert();
      this.showToast(`🚨 MARKET EVENT: ${evt.title}!`, 'warning');
      const ticker = document.getElementById('systemNewsTicker');
      if (ticker) ticker.textContent = `[BREAKING NEWS] ${evt.text}`;
      this.renderCommoditiesTable();
    });

    window.addEventListener('drone-log', (e) => {
      const box = document.getElementById('droneTerminalLogs');
      if (box) {
        const line = document.createElement('div');
        line.className = 't-line';
        line.textContent = e.detail.msg;
        box.appendChild(line);
        box.scrollTop = box.scrollHeight;
      }
    });
  }

  // ==========================================================================
  // 13. TOAST NOTIFICATIONS & HUD TICK UPDATES
  // ==========================================================================

  showToast(message, type = 'info') {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  updateLiveHud() {
    // Top HUD Resource readouts
    const elCred = document.getElementById('valCredits');
    const elRep = document.getElementById('valRep');
    const elLvl = document.getElementById('valLevel');
    const elClock = document.getElementById('valClock');
    const elWeather = document.getElementById('valWeather');

    if (elCred) elCred.textContent = this.sim.credits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (elRep) elRep.textContent = `${this.sim.reputation} / 100`;
    if (elLvl) elLvl.textContent = `LVL ${this.sim.level} (${this.sim.xp}/${this.sim.xpToNextLevel} XP)`;
    if (elClock) elClock.textContent = `DAY ${this.sim.day} • ${String(this.sim.hour).padStart(2, '0')}:${String(Math.floor(this.sim.minute)).padStart(2, '0')}`;
    if (elWeather) elWeather.textContent = this.sim.weather;

    // Fryer HUD
    if (this.physics && this.physics.fryerSim) {
      const elOilTemp = document.getElementById('txtOilTemp');
      const elOilPurity = document.getElementById('txtOilPurity');
      const elCrunch = document.getElementById('txtCrunchScore');

      if (elOilTemp) elOilTemp.innerHTML = `${this.physics.fryerSim.temperature.toFixed(1)} &deg;C`;
      if (elOilPurity) elOilPurity.textContent = `${Math.round(this.physics.fryerSim.oilPurity * 100)}%`;
      if (elCrunch) elCrunch.textContent = `${this.sim.formulaAnalysis.crunchRating}%`;
    }

    // Analytics lifetime values
    const elRev = document.getElementById('txtAnalyticsRevenue');
    const elChick = document.getElementById('txtAnalyticsChickenCount');
    const elOrders = document.getElementById('txtShiftOrders');
    const elTips = document.getElementById('txtShiftTips');

    if (elRev) elRev.innerHTML = `&euro;${this.sim.stats.lifetimeRevenue.toFixed(2)}`;
    if (elChick) elChick.textContent = `${this.sim.stats.totalChickenSold} PCS`;
    if (elOrders) elOrders.textContent = `${this.sim.stats.totalOrdersServed}`;
    if (elTips) elTips.innerHTML = `&euro;${this.sim.stats.totalTipsCollected.toFixed(2)}`;

    // Customer queue lane update
    this.renderCustomerQueueUI();
  }
}

// Global Export
window.CyberUIController = CyberUIController;
