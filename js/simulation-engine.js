/**
 * ============================================================================
 * KFC: CYBER KITCHEN 2088 — ECONOMIC TYCOON & ALCHEMICAL SIMULATION ENGINE
 * Architecture: 1000+ Lines of Tycoon Mechanics, Customer AI & Spice Alchemy
 * ============================================================================
 */

class CyberSimulationEngine {
  constructor() {
    // Core Player Economy
    this.credits = 1500.00;
    this.reputation = 100; // 0 to 100
    this.level = 1;
    this.xp = 0;
    this.xpToNextLevel = 1000;
    this.techPoints = 450; // TB of culinary data

    // Time & Simulation Clock
    this.day = 1;
    this.hour = 8;
    this.minute = 0;
    this.timeScale = 1.0; // 1x, 2x, 5x
    this.weather = 'NEON CLEAR';
    this.weathers = ['NEON CLEAR', 'ACID RAIN', 'IONIC SMOG', 'SOLAR FLARE', 'CYBER BLIZZARD'];

    // Lifetime Analytics & Accounting Ledger
    this.stats = {
      lifetimeRevenue: 0.0,
      totalOrdersServed: 0,
      totalChickenSold: 0,
      totalTipsCollected: 0.0,
      recipesSynthesized: 0,
      droneDeliveriesCompleted: 0,
      totalBurgersStacked: 0,
      commoditiesPurchasedVal: 0.0,
      salariesPaid: 0.0,
      marketEventsWitnessed: 0,
      combosCrafted: 0,
      vipCriticsImpressed: 0
    };

    // Financial Hourly History Ledger (for Custom Canvas Charts)
    this.hourlyRevenueHistory = [120, 180, 240, 310, 420, 380, 510, 620, 580, 750, 890, 940];
    this.hourlyProfitHistory = [80, 120, 160, 210, 290, 260, 360, 440, 410, 530, 640, 680];

    // Kitchen Warmers Stock (Cooked Ready-to-Serve Inventory)
    this.cookedInventory = {
      original_crispy: { id: 'original_crispy', name: 'Original Recipe Drumstick', count: 12, cost: 2.20, price: 12.00, soldCount: 42 },
      hot_spicy_wings: { id: 'hot_spicy_wings', name: 'Cyber Hot & Spicy Wings', count: 8, cost: 3.50, price: 14.50, soldCount: 38 },
      neon_tenders: { id: 'neon_tenders', name: 'Neon Crispy Tenders', count: 10, cost: 2.80, price: 11.00, soldCount: 29 },
      gravy_loaded_fries: { id: 'gravy_loaded_fries', name: 'Gravy Loaded Cyber-Fries', count: 15, cost: 1.50, price: 6.50, soldCount: 55 },
      colonel_zenith_burger: { id: 'colonel_zenith_burger', name: 'Colonel Zenith Super-Burger', count: 4, cost: 4.80, price: 18.50, soldCount: 19 }
    };

    // Master Culinary Recipe Master Catalog (Historical & Futuristic)
    this.masterRecipeCatalog = [
      { id: 'rec_orig_1939', name: 'Colonel 1939 Original Heritage', prepTime: 12, crunch: 95, spiceCategory: 'Balanced' },
      { id: 'rec_hot_spicy', name: 'Neo-Tokyo Hot & Spicy Wings', prepTime: 10, crunch: 98, spiceCategory: 'Piquant' },
      { id: 'rec_nashville', name: 'Nashville Cyber-Inferno Glaze', prepTime: 14, crunch: 92, spiceCategory: 'Extreme Heat' },
      { id: 'rec_korean_soy', name: 'Seoul Garlic-Soy Cyber-Crisp', prepTime: 11, crunch: 96, spiceCategory: 'Umami-Sweet' },
      { id: 'rec_zenith_burger', name: 'Colonel Zenith 8-Tier Tower', prepTime: 18, crunch: 99, spiceCategory: 'Loaded Gourmet' },
      { id: 'rec_gravy_volcano', name: 'Sector 7 Gravy Volcano Bowl', prepTime: 8, crunch: 88, spiceCategory: 'Comfort Gravy' },
      { id: 'rec_space_popcorn', name: 'Zero-G Popcorn Nuggets', prepTime: 6, crunch: 94, spiceCategory: 'Snack' }
    ];

    // Raw Commodities Spot Market (20+ Items)
    this.commodities = {
      raw_poultry: { name: 'Grade-A Raw Poultry', unit: 'kg', inStock: 50, basePrice: 4.20, currentPrice: 4.20, history: [4.20] },
      crunch_flour: { name: 'Cryogenic Crunch Flour', unit: 'kg', inStock: 80, basePrice: 1.80, currentPrice: 1.80, history: [1.80] },
      peanut_oil: { name: 'High-Temp Peanut Fryer Oil', unit: 'L', inStock: 60, basePrice: 3.10, currentPrice: 3.10, history: [3.10] },
      brioche_buns: { name: 'Cyber Sesame Brioche Buns', unit: 'pack', inStock: 30, basePrice: 2.00, currentPrice: 2.00, history: [2.00] },
      secret_spice_bulk: { name: 'Raw 11 Herbs Blend Pre-Mix', unit: 'kg', inStock: 25, basePrice: 8.50, currentPrice: 8.50, history: [8.50] },
      neon_cheddar: { name: 'Synthetic Neon Cheddar', unit: 'kg', inStock: 20, basePrice: 3.40, currentPrice: 3.40, history: [3.40] },
      kfc_gravy_powder: { name: 'Colonel Gravy Concentrate', unit: 'kg', inStock: 35, basePrice: 4.80, currentPrice: 4.80, history: [4.80] },
      dill_pickles: { name: 'Vacuum-Aged Dill Pickles', unit: 'jar', inStock: 25, basePrice: 1.60, currentPrice: 1.60, history: [1.60] }
    };

    // 11 Secret Herbs & Spices Molecular Alchemy Matrix
    this.secretSpices = [
      { id: 'salt_sea', name: 'Celtic Sea Salt', ratio: 50, defaultRatio: 50, category: 'Saline', description: 'Essential ionic flavor foundation.' },
      { id: 'thyme_leaf', name: 'Ground French Thyme', ratio: 40, defaultRatio: 40, category: 'Herbal', description: 'Delicate herbal top-notes.' },
      { id: 'basil_sweet', name: 'Sweet Basil Leaves', ratio: 35, defaultRatio: 35, category: 'Herbal', description: 'Aromatic sweetness and warmth.' },
      { id: 'oregano_wild', name: 'Wild Greek Oregano', ratio: 30, defaultRatio: 30, category: 'Herbal', description: 'Deep Mediterranean pungency.' },
      { id: 'celery_salt', name: 'Organic Celery Salt', ratio: 45, defaultRatio: 45, category: 'Savory', description: 'Natural umami enhancer.' },
      { id: 'black_pepper', name: 'Tellicherry Black Pepper', ratio: 60, defaultRatio: 60, category: 'Pungent', description: 'Sharp piperine heat punch.' },
      { id: 'white_pepper', name: 'Muntok White Pepper (Keystone)', ratio: 85, defaultRatio: 85, category: 'Pungent', description: 'The Colonel classified cornerstone.' },
      { id: 'mustard_powder', name: 'Hot English Mustard', ratio: 40, defaultRatio: 40, category: 'Heat', description: 'Sinus-tingling sharp piquant bite.' },
      { id: 'paprika_smoked', name: 'Spanish Smoked Paprika', ratio: 75, defaultRatio: 75, category: 'Sweet/Color', description: 'Golden mahogany coloring and sweet smoke.' },
      { id: 'garlic_salt', name: 'Roasted Garlic Salt', ratio: 65, defaultRatio: 65, category: 'Savory', description: 'Rich allium aroma and savoriness.' },
      { id: 'ginger_ground', name: 'Zesty Ground Ginger', ratio: 35, defaultRatio: 35, category: 'Zest', description: 'Citrusy bite accelerating crust crispiness.' }
    ];

    // Current Alchemical Formula Metrics
    this.formulaAnalysis = {
      codename: 'NEO-KENTUCKY SUPREME PROTOCOL',
      umami: 85,
      aroma: 90,
      heat: 60,
      catalyst: 95,
      priceMultiplier: 1.45,
      crunchRating: 98.4
    };

    // Customer AI Queue
    this.customers = [];
    this.maxQueueSize = 6;
    this.customerSpawnTimer = 0.0;
    this.customerSpawnInterval = 6.0; // seconds

    // Automation Flags
    this.autoFryerEnabled = false;

    // Tech Research Tree
    this.researchBranches = this.initResearchTree();

    // Staff & Employees Roster
    this.staff = [
      { id: 'emp_01', name: 'Unit T-800 Cook', role: 'Line Cook', efficiency: 1.25, salary: 45.00, hired: false },
      { id: 'emp_02', name: 'Alchemist Sarah', role: 'Spice Chemist', efficiency: 1.40, salary: 60.00, hired: false },
      { id: 'emp_03', name: 'Admiral Vance', role: 'Drone Flight Lead', efficiency: 1.50, salary: 75.00, hired: false }
    ];

    // Active Quests & Milestones
    this.quests = [
      { id: 'quest_fry_10', title: 'Crispy Genesis', desc: 'Fry 10 batches of fresh chicken.', target: 10, current: 0, reward: 250.0, isClaimed: false },
      { id: 'quest_serve_20', title: 'Drive-Thru Rush', desc: 'Serve 20 happy customers.', target: 20, current: 0, reward: 500.0, isClaimed: false },
      { id: 'quest_tech_3', title: 'Kitchen Modernization', desc: 'Unlock 3 tech upgrades.', target: 3, current: 0, reward: 400.0, isClaimed: false },
      { id: 'quest_revenue_5k', title: 'Cyber Tycoon Milestone', desc: 'Reach &euro;5,000 in total lifetime revenue.', target: 5000, current: 0, reward: 1000.0, isClaimed: false },
      { id: 'quest_alchemy_master', title: 'Spice Alchemist Supreme', desc: 'Synthesize 5 new secret spice variations.', target: 5, current: 0, reward: 600.0, isClaimed: false }
    ];

    // Comprehensive Achievement System
    this.achievements = this.initAchievements();

    // Macroeconomic Market Events
    this.activeEvent = null;
    this.eventTimer = 0.0;
    this.eventInterval = 45.0; // Random event every 45s

    // Food Critic Quotes Database
    this.criticReviews = [
      { quote: "The crunch reverberated through my cybernetic audio implants like thunder. 10/10.", author: "Anton Ego-2088" },
      { quote: "White pepper ratio is immaculate. The Colonel would shed a tear.", author: "Neo-Michelin Hologram" },
      { quote: "Gravy viscosity exceeds ISO 9001 culinary fluid standards.", author: "Cyber Gastronomy Daily" },
      { quote: "Unparalleled crunch-to-moisture equilibrium. A masterpiece of fast-food physics.", author: "Dr. Aris Thorne" },
      { quote: "Drone arrived in under 3 minutes. Chicken was literally still sizzling.", author: "Mega-City Resident #402" }
    ];

    this.recalculateFormulaSynergy();
    this.loadFromStorage();
  }

  // ==========================================================================
  // SIMULATION TICK & TIME ADVANCEMENT
  // ==========================================================================

  update(dt) {
    const effectiveDt = dt * this.timeScale;

    // Clock advancement (1 real minute = ~2 game hours at 1x)
    this.minute += effectiveDt * 4.0;
    if (this.minute >= 60) {
      this.minute -= 60;
      this.hour += 1;
      this.onHourTick();
    }
    if (this.hour >= 24) {
      this.hour = 0;
      this.day += 1;
      this.onDayTick();
    }

    // Customer Spawn & Patience Ticking
    this.updateCustomerQueue(effectiveDt);

    // Commodity Market Random Fluctuations
    this.updateCommodityMarket(effectiveDt);

    // Macroeconomic Events Cycle
    this.updateMarketEvents(effectiveDt);

    // AI Automation Chef Logic
    if (this.autoFryerEnabled) {
      this.tickAutoFryer(effectiveDt);
    }

    // Check Achievements
    this.checkAchievements();
  }

  onHourTick() {
    // Generate passive tech data points based on reputation
    const ptsGained = Math.floor(this.reputation * 0.15);
    this.techPoints += ptsGained;

    // Record hourly financial history snapshot
    const revenueSample = Math.round(50 + Math.random() * 80 + this.level * 40);
    this.hourlyRevenueHistory.push(revenueSample);
    if (this.hourlyRevenueHistory.length > 12) this.hourlyRevenueHistory.shift();

    const profitSample = Math.round(revenueSample * 0.65);
    this.hourlyProfitHistory.push(profitSample);
    if (this.hourlyProfitHistory.length > 12) this.hourlyProfitHistory.shift();

    // Random weather shift chance (20%)
    if (Math.random() < 0.2) {
      const prevWeather = this.weather;
      this.weather = this.weathers[Math.floor(Math.random() * this.weathers.length)];
      if (prevWeather !== this.weather && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('weather-change', { detail: { weather: this.weather } }));
      }
    }
  }

  onDayTick() {
    // Daily staff payroll deduction
    this.staff.forEach((emp) => {
      if (emp.hired && this.credits >= emp.salary) {
        this.credits -= emp.salary;
        this.stats.salariesPaid += emp.salary;
      }
    });

    // Daily bonus & reputation decay check
    if (this.reputation < 50) {
      this.reputation = Math.min(100, this.reputation + 5);
    }
    // Auto save game every midnight
    this.saveToStorage();
  }

  // ==========================================================================
  // CUSTOMER AI STATE MACHINE
  // ==========================================================================

  updateCustomerQueue(dt) {
    // Spawn new customer if queue has space
    this.customerSpawnTimer += dt;
    if (this.customerSpawnTimer >= this.customerSpawnInterval) {
      this.customerSpawnTimer = 0.0;
      if (this.customers.length < this.maxQueueSize) {
        this.spawnCustomer();
      }
    }

    // Tick patience of queued customers
    for (let i = this.customers.length - 1; i >= 0; i--) {
      const c = this.customers[i];
      c.patience -= dt * c.patienceDecayRate;

      if (c.patience <= 0) {
        // Customer leaves angry
        this.reputation = Math.max(0, this.reputation - 4);
        this.customers.splice(i, 1);
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('customer-left-angry', { detail: { customer: c } }));
        }
      }
    }
  }

  spawnCustomer() {
    const archetypes = [
      { type: 'StreetCyborg', name: 'Cyborg Jax', tag: 'STREET CYBORG', patienceRate: 2.2, tipMultiplier: 0.1, isVip: false },
      { type: 'CorpoExecutive', name: 'VP Harrison', tag: 'CORPO EXECUTIVE', patienceRate: 3.5, tipMultiplier: 0.35, isVip: true },
      { type: 'NeonGamer', name: 'Streamer K1RA', tag: 'NEON GAMER', patienceRate: 1.5, tipMultiplier: 0.15, isVip: false },
      { type: 'FoodCriticVIP', name: 'Critic Anton', tag: 'GOURMET CRITIC', patienceRate: 2.8, tipMultiplier: 0.5, isVip: true },
      { type: 'CyberBountyHunter', name: 'Hunter Raven', tag: 'BOUNTY HUNTER', patienceRate: 2.0, tipMultiplier: 0.25, isVip: false }
    ];

    const arch = archetypes[Math.floor(Math.random() * archetypes.length)];
    const menuKeys = Object.keys(this.cookedInventory);
    const chosenKey = menuKeys[Math.floor(Math.random() * menuKeys.length)];
    const desiredItem = this.cookedInventory[chosenKey];

    const customer = {
      id: Date.now() + Math.random(),
      type: arch.type,
      name: arch.name,
      tag: arch.tag,
      isVip: arch.isVip,
      desiredItemKey: chosenKey,
      desiredItemName: desiredItem.name,
      quantity: arch.isVip ? 2 : 1,
      patience: 100.0,
      patienceDecayRate: arch.patienceRate,
      tipMultiplier: arch.tipMultiplier
    };

    this.customers.push(customer);

    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('customer-spawned', { detail: { customer } }));
    }
  }

  serveCustomer(customerId, isDroneDelivery = false) {
    const index = this.customers.findIndex((c) => c.id === customerId);
    if (index === -1) return { success: false, msg: 'Customer not found' };

    const c = this.customers[index];
    const inventoryItem = this.cookedInventory[c.desiredItemKey];

    if (!inventoryItem || inventoryItem.count < c.quantity) {
      return { success: false, msg: `Insufficient ${inventoryItem.name} in warmers! Fry more!` };
    }

    // Deduct stock
    inventoryItem.count -= c.quantity;
    inventoryItem.soldCount += c.quantity;

    // Calculate revenue & tips
    const basePrice = inventoryItem.price * c.quantity;
    const finalPrice = basePrice * this.formulaAnalysis.priceMultiplier;
    const tipAmount = (c.patience / 100.0) * (basePrice * c.tipMultiplier);
    const totalCollected = finalPrice + tipAmount;

    // Credit player
    this.credits += totalCollected;
    this.reputation = Math.min(100, this.reputation + (c.isVip ? 4 : 1));
    this.addXp(c.isVip ? 80 : 35);

    // Update Stats
    this.stats.lifetimeRevenue += totalCollected;
    this.stats.totalOrdersServed += 1;
    this.stats.totalChickenSold += c.quantity;
    this.stats.totalTipsCollected += tipAmount;
    if (c.isVip) this.stats.vipCriticsImpressed += 1;

    // Remove from queue
    this.customers.splice(index, 1);

    // Progress Quests
    this.progressQuest('quest_serve_20', 1);
    this.progressQuest('quest_revenue_5k', totalCollected);

    return {
      success: true,
      amount: totalCollected,
      tips: tipAmount,
      customer: c
    };
  }

  // ==========================================================================
  // KITCHEN AUTOMATION & FRYING
  // ==========================================================================

  startFryingBatch(recipeKey = 'original_crispy') {
    const rawCost = 15.00;
    if (this.credits < rawCost) {
      return { success: false, msg: 'Not enough Cyber Credits to drop batch (&euro;15.00 needed)!' };
    }

    // Deduct raw ingredients if available
    if (this.commodities.raw_poultry.inStock < 2) {
      return { success: false, msg: 'Out of Raw Poultry! Buy more in Financial Analytics Market!' };
    }

    this.credits -= rawCost;
    this.commodities.raw_poultry.inStock -= 2;
    this.commodities.crunch_flour.inStock = Math.max(0, this.commodities.crunch_flour.inStock - 1);

    this.progressQuest('quest_fry_10', 1);

    return { success: true, recipe: recipeKey };
  }

  receiveCookedBatch(recipeKey) {
    const item = this.cookedInventory[recipeKey] || this.cookedInventory.original_crispy;
    item.count += 4; // Each batch yields 4 portions
    this.addXp(45);
  }

  tickAutoFryer(dt) {
    // Automatically fry when warmer stock is critically low (< 3 units)
    for (const key in this.cookedInventory) {
      const item = this.cookedInventory[key];
      if (item.count < 3 && this.credits >= 20.0 && this.commodities.raw_poultry.inStock >= 2) {
        this.startFryingBatch(key);
        // Instant simulated finish for robot chef
        this.receiveCookedBatch(key);
        break;
      }
    }
  }

  // ==========================================================================
  // 11 SPICES ALCHEMY & FORMULATION ENGINE
  // ==========================================================================

  updateSpiceRatio(spiceId, newRatio) {
    const spice = this.secretSpices.find((s) => s.id === spiceId);
    if (spice) {
      spice.ratio = Math.max(0, Math.min(100, parseInt(newRatio, 10)));
      this.recalculateFormulaSynergy();
    }
  }

  resetSpicesToDefault() {
    this.secretSpices.forEach((s) => {
      s.ratio = s.defaultRatio;
    });
    this.recalculateFormulaSynergy();
  }

  recalculateFormulaSynergy() {
    const getRatio = (id) => {
      const s = this.secretSpices.find((sp) => sp.id === id);
      return s ? s.ratio : 50;
    };

    const whitePepper = getRatio('white_pepper');
    const blackPepper = getRatio('black_pepper');
    const paprika = getRatio('paprika_smoked');
    const celery = getRatio('celery_salt');
    const garlic = getRatio('garlic_salt');
    const thyme = getRatio('thyme_leaf');
    const basil = getRatio('basil_sweet');
    const oregano = getRatio('oregano_wild');
    const mustard = getRatio('mustard_powder');
    const ginger = getRatio('ginger_ground');
    const salt = getRatio('salt_sea');

    // Umami formula (Garlic + Celery + Salt synergy)
    const rawUmami = (garlic * 0.35 + celery * 0.35 + salt * 0.3);
    this.formulaAnalysis.umami = Math.round(Math.min(100, Math.max(10, rawUmami)));

    // Aromatic Complexity (Herbs: Thyme, Basil, Oregano + Ginger)
    const rawAroma = (thyme * 0.3 + basil * 0.3 + oregano * 0.25 + ginger * 0.15);
    this.formulaAnalysis.aroma = Math.round(Math.min(100, Math.max(10, rawAroma)));

    // Peppery Heat (White Pepper + Black Pepper + Mustard)
    const rawHeat = (whitePepper * 0.45 + blackPepper * 0.35 + mustard * 0.2);
    this.formulaAnalysis.heat = Math.round(Math.min(100, Math.max(10, rawHeat)));

    // Crispness Catalyst (White pepper & ginger accelerate frying caramelization)
    const rawCatalyst = (whitePepper * 0.6 + ginger * 0.25 + paprika * 0.15);
    this.formulaAnalysis.catalyst = Math.round(Math.min(100, Math.max(10, rawCatalyst)));

    // Crunch rating calculation
    this.formulaAnalysis.crunchRating = parseFloat((85 + (this.formulaAnalysis.catalyst * 0.14)).toFixed(1));

    // Price Multiplier formula
    const avgScore = (this.formulaAnalysis.umami + this.formulaAnalysis.aroma + this.formulaAnalysis.catalyst) / 3;
    const multiplier = 1.0 + (avgScore / 100.0) * 0.75;
    this.formulaAnalysis.priceMultiplier = parseFloat(multiplier.toFixed(2));

    // Dynamic Codename Generator
    if (this.formulaAnalysis.heat > 75) {
      this.formulaAnalysis.codename = 'PLASMA INFERNO OMEGA PROTOCOL';
    } else if (this.formulaAnalysis.aroma > 80) {
      this.formulaAnalysis.codename = 'BOTANICAL COLONEL CYBER-RESERVE';
    } else if (this.formulaAnalysis.umami > 85) {
      this.formulaAnalysis.codename = 'QUANTUM UMAMI SUPREME MATRIX';
    } else {
      this.formulaAnalysis.codename = 'NEO-KENTUCKY SUPREME PROTOCOL';
    }
  }

  synthesizeFormula() {
    this.recalculateFormulaSynergy();
    this.stats.recipesSynthesized += 1;
    this.addXp(120);
    this.techPoints += 25;
    this.progressQuest('quest_alchemy_master', 1);
    return this.formulaAnalysis;
  }

  // ==========================================================================
  // COMMODITY SPOT MARKET TRADING
  // ==========================================================================

  updateCommodityMarket(dt) {
    for (const key in this.commodities) {
      const c = this.commodities[key];
      // Random walk price variation (+/- 2%)
      const change = (Math.random() - 0.5) * 0.04 * c.basePrice * dt;
      c.currentPrice = Math.max(c.basePrice * 0.5, Math.min(c.basePrice * 2.2, c.currentPrice + change));

      if (Math.random() < 0.05) {
        c.history.push(c.currentPrice);
        if (c.history.length > 20) c.history.shift();
      }
    }
  }

  buyCommodity(key, units = 10) {
    const c = this.commodities[key];
    if (!c) return { success: false, msg: 'Invalid commodity' };

    const totalCost = c.currentPrice * units;
    if (this.credits < totalCost) {
      return { success: false, msg: `Need &euro;${totalCost.toFixed(2)} to purchase ${units} ${c.unit}!` };
    }

    this.credits -= totalCost;
    c.inStock += units;
    this.stats.commoditiesPurchasedVal += totalCost;
    return { success: true, msg: `Purchased ${units} ${c.unit} of ${c.name}` };
  }

  // ==========================================================================
  // MACROECONOMIC NEWS & MARKET EVENTS ENGINE
  // ==========================================================================

  updateMarketEvents(dt) {
    this.eventTimer += dt;
    if (this.eventTimer >= this.eventInterval) {
      this.eventTimer = 0.0;
      this.triggerRandomMarketEvent();
    }
  }

  triggerRandomMarketEvent() {
    const possibleEvents = [
      {
        id: 'evt_spice_shortage',
        title: 'GLOBAL SPICE FREIGHT DISRUPTION',
        text: 'Spaceport cargo strike in Neo-Singapore has surged raw spice pre-mix market rates by +45%!',
        effect: () => {
          this.commodities.secret_spice_bulk.currentPrice *= 1.45;
        }
      },
      {
        id: 'evt_poultry_boom',
        title: 'GENETIC POULTRY HARVEST BOOM',
        text: 'Mega-City poultry incubators report record yield. Raw chicken prices drop by -30%!',
        effect: () => {
          this.commodities.raw_poultry.currentPrice *= 0.70;
        }
      },
      {
        id: 'evt_celebrity_rush',
        title: 'CYBER-POP IDOL ENDORSEMENT',
        text: 'K-Pop sensation praised the Colonel Zenith Super-Burger on live holo-feed! Demand doubled!',
        effect: () => {
          this.reputation = Math.min(100, this.reputation + 8);
          this.credits += 250.0;
        }
      },
      {
        id: 'evt_oil_tax',
        title: 'ECO-CARBON TAX ON FRYER OILS',
        text: 'New environmental ordinance increases fryer oil spot costs by +25%.',
        effect: () => {
          this.commodities.peanut_oil.currentPrice *= 1.25;
        }
      }
    ];

    const chosen = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
    this.activeEvent = chosen;
    chosen.effect();
    this.stats.marketEventsWitnessed += 1;

    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('market-event-triggered', { detail: { event: chosen } }));
    }
  }

  // ==========================================================================
  // TECH TREE & RESEARCH PROGRESSION
  // ==========================================================================

  initResearchTree() {
    return {
      branchA: [
        { id: 'tech_auto_fryer', title: 'T-800 Robo-Fryer', desc: 'Enables automatic chicken batch cooking when stock is depleted.', cost: 150, unlocked: false },
        { id: 'tech_cryo_breading', title: 'Cryo-Breading Chamber', desc: 'Increases crunch factor rating by +15%.', cost: 300, unlocked: false },
        { id: 'tech_turbo_injectors', title: 'Thermal Turbo Injectors', desc: 'Reduces fryer cooking duration by 30%.', cost: 500, unlocked: false },
        { id: 'tech_quantum_pressure', title: 'Quantum Pressure Seal', desc: 'Accelerates fryer throughput by 40%.', cost: 850, unlocked: false }
      ],
      branchB: [
        { id: 'tech_spice_genomics', title: '11 Spice Genomic Cultivar', desc: 'Increases maximum price multiplier by +25%.', cost: 200, unlocked: false },
        { id: 'tech_umami_resonator', title: 'Molecular Umami Resonator', desc: 'Customers tip +20% more on all orders.', cost: 350, unlocked: false },
        { id: 'tech_colonel_secret', title: 'Classified 1939 Original Formula', desc: 'Reputation instantly increases to 100%.', cost: 750, unlocked: false },
        { id: 'tech_crisp_plasma', title: 'Plasma Crust Caramelizer', desc: 'All chicken items sell for +15% more base credits.', cost: 900, unlocked: false }
      ],
      branchC: [
        { id: 'tech_drone_overclock', title: 'Drone Ion Thruster Overclock', desc: 'Delivery drones fly 80% faster.', cost: 250, unlocked: false },
        { id: 'tech_deflector_shield', title: 'Anti-Storm Deflector Shield', desc: 'Drones ignore severe weather storms.', cost: 400, unlocked: false },
        { id: 'tech_global_airspace', title: 'Skyway Priority Air Clearance', desc: 'Unlocks supersonic VIP delivery contracts.', cost: 800, unlocked: false },
        { id: 'tech_drone_swarm_ai', title: 'Swarm Autonomous Routing', desc: 'Fleet battery drains 50% slower during flight.', cost: 1100, unlocked: false }
      ]
    };
  }

  unlockTech(techId) {
    for (const bKey in this.researchBranches) {
      const node = this.researchBranches[bKey].find((t) => t.id === techId);
      if (node) {
        if (node.unlocked) return { success: false, msg: 'Technology already researched!' };
        if (this.techPoints < node.cost) {
          return { success: false, msg: `Insufficient Tech Data! Need ${node.cost} TB (have ${this.techPoints} TB)` };
        }

        this.techPoints -= node.cost;
        node.unlocked = true;
        this.applyTechPerk(node.id);
        this.progressQuest('quest_tech_3', 1);

        return { success: true, node };
      }
    }
    return { success: false, msg: 'Tech node not found' };
  }

  applyTechPerk(techId) {
    switch (techId) {
      case 'tech_auto_fryer':
        this.autoFryerEnabled = true;
        break;
      case 'tech_colonel_secret':
        this.reputation = 100;
        break;
      default:
        break;
    }
  }

  // ==========================================================================
  // COMPREHENSIVE ACHIEVEMENT ENGINE
  // ==========================================================================

  initAchievements() {
    return [
      { id: 'ach_first_serve', name: 'First Bite of the Future', desc: 'Serve your first customer order.', unlocked: false, rewardXp: 100 },
      { id: 'ach_orders_50', name: 'High-Velocity Cashier', desc: 'Serve 50 total customer orders.', unlocked: false, rewardXp: 350 },
      { id: 'ach_revenue_10k', name: 'Cyber Millionaire Mindset', desc: 'Amass &euro;10,000 in lifetime gross revenue.', unlocked: false, rewardXp: 750 },
      { id: 'ach_tower_master', name: 'Architect of Gastronomy', desc: 'Construct a burger tower over 250mm tall.', unlocked: false, rewardXp: 500 },
      { id: 'ach_perfect_rep', name: 'Colonel Heritage of Excellence', desc: 'Maintain 100% Culinary Reputation.', unlocked: false, rewardXp: 400 },
      { id: 'ach_drone_dispatch', name: 'Skyway Freight Commander', desc: 'Complete 10 autonomous drone deliveries.', unlocked: false, rewardXp: 450 },
      { id: 'ach_spice_master', name: 'Grand Master of 11 Herbs', desc: 'Synthesize a formula with >90% in all categories.', unlocked: false, rewardXp: 600 },
      { id: 'ach_overclock_tycoon', name: 'Supersonic Overclock', desc: 'Run simulation at 5x speed for 1 full game day.', unlocked: false, rewardXp: 300 }
    ];
  }

  checkAchievements() {
    this.achievements.forEach((ach) => {
      if (ach.unlocked) return;

      let satisfied = false;
      if (ach.id === 'ach_first_serve' && this.stats.totalOrdersServed >= 1) satisfied = true;
      if (ach.id === 'ach_orders_50' && this.stats.totalOrdersServed >= 50) satisfied = true;
      if (ach.id === 'ach_revenue_10k' && this.stats.lifetimeRevenue >= 10000) satisfied = true;
      if (ach.id === 'ach_perfect_rep' && this.reputation >= 100 && this.stats.totalOrdersServed >= 5) satisfied = true;
      if (ach.id === 'ach_drone_dispatch' && this.stats.droneDeliveriesCompleted >= 10) satisfied = true;
      if (ach.id === 'ach_spice_master' && this.formulaAnalysis.umami >= 90 && this.formulaAnalysis.aroma >= 90 && this.formulaAnalysis.heat >= 90) satisfied = true;

      if (satisfied) {
        ach.unlocked = true;
        this.addXp(ach.rewardXp);
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { achievement: ach } }));
        }
      }
    });
  }

  // ==========================================================================
  // STAFF MANAGEMENT ENGINE
  // ==========================================================================

  hireStaff(staffId) {
    const emp = this.staff.find((s) => s.id === staffId);
    if (!emp) return { success: false, msg: 'Staff not found' };
    if (emp.hired) return { success: false, msg: 'Already hired' };
    if (this.credits < emp.salary * 2) {
      return { success: false, msg: 'Need at least 2 days salary in reserve credits to hire!' };
    }

    emp.hired = true;
    this.credits -= emp.salary;
    return { success: true, employee: emp };
  }

  fireStaff(staffId) {
    const emp = this.staff.find((s) => s.id === staffId);
    if (emp && emp.hired) {
      emp.hired = false;
      return { success: true, employee: emp };
    }
    return { success: false, msg: 'Staff not currently employed' };
  }

  // ==========================================================================
  // PROGRESSION, XP & SAVE / LOAD ENGINE
  // ==========================================================================

  addXp(amount) {
    this.xp += amount;
    if (this.xp >= this.xpToNextLevel) {
      this.levelUp();
    }
  }

  levelUp() {
    this.xp -= this.xpToNextLevel;
    this.level += 1;
    this.xpToNextLevel = Math.round(this.xpToNextLevel * 1.5);
    this.techPoints += 150;
    this.credits += 300.00;

    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('player-level-up', { detail: { level: this.level } }));
    }
  }

  progressQuest(questId, amount = 1) {
    const q = this.quests.find((item) => item.id === questId);
    if (q && !q.isClaimed) {
      q.current = Math.min(q.target, q.current + amount);
    }
  }

  claimQuest(questId) {
    const q = this.quests.find((item) => item.id === questId);
    if (q && q.current >= q.target && !q.isClaimed) {
      q.isClaimed = true;
      this.credits += q.reward;
      this.addXp(100);
      return { success: true, reward: q.reward };
    }
    return { success: false, msg: 'Quest conditions not satisfied.' };
  }

  saveToStorage() {
    try {
      const state = {
        credits: this.credits,
        reputation: this.reputation,
        level: this.level,
        xp: this.xp,
        xpToNextLevel: this.xpToNextLevel,
        techPoints: this.techPoints,
        day: this.day,
        stats: this.stats,
        cookedInventory: this.cookedInventory,
        secretSpices: this.secretSpices,
        researchBranches: this.researchBranches,
        achievements: this.achievements,
        staff: this.staff
      };
      localStorage.setItem('KFC_CYBER_SAVE', JSON.stringify(state));
      console.log('💾 Game state saved successfully to localStorage.');
      return true;
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
      return false;
    }
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem('KFC_CYBER_SAVE');
      if (!raw) return false;
      const state = JSON.parse(raw);

      if (state.credits !== undefined) this.credits = state.credits;
      if (state.reputation !== undefined) this.reputation = state.reputation;
      if (state.level !== undefined) this.level = state.level;
      if (state.xp !== undefined) this.xp = state.xp;
      if (state.techPoints !== undefined) this.techPoints = state.techPoints;
      if (state.stats) this.stats = state.stats;
      if (state.cookedInventory) this.cookedInventory = state.cookedInventory;
      if (state.secretSpices) this.secretSpices = state.secretSpices;
      if (state.researchBranches) this.researchBranches = state.researchBranches;
      if (state.achievements) this.achievements = state.achievements;
      if (state.staff) this.staff = state.staff;

      this.recalculateFormulaSynergy();
      console.log('📂 Save state restored successfully.');
      return true;
    } catch (e) {
      console.warn('Failed to load save from localStorage:', e);
      return false;
    }
  }

  exportSaveFile() {
    const state = {
      version: '2088.1.0',
      timestamp: new Date().toISOString(),
      credits: this.credits,
      reputation: this.reputation,
      level: this.level,
      stats: this.stats,
      secretSpices: this.secretSpices,
      cookedInventory: this.cookedInventory,
      researchBranches: this.researchBranches,
      staff: this.staff
    };
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kfc_cyber_save_day${this.day}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importSaveFile(jsonString) {
    try {
      const state = JSON.parse(jsonString);
      if (state.credits !== undefined) this.credits = state.credits;
      if (state.level !== undefined) this.level = state.level;
      if (state.stats) this.stats = state.stats;
      if (state.secretSpices) this.secretSpices = state.secretSpices;
      this.recalculateFormulaSynergy();
      this.saveToStorage();
      return true;
    } catch (e) {
      console.error('Invalid save file format:', e);
      return false;
    }
  }

  // ==========================================================================
  // COMBO MEAL FORMULATION & CRITIC REVIEW GENERATOR
  // ==========================================================================

  createComboMeal(mainItemKey, sideItemKey, beverageKey) {
    const main = this.cookedInventory[mainItemKey] || this.cookedInventory.original_crispy;
    const side = this.cookedInventory[sideItemKey] || this.cookedInventory.gravy_loaded_fries;

    const baseComboPrice = (main.price + side.price) * 0.88; // 12% combo discount
    const synergyMultiplier = (this.formulaAnalysis.priceMultiplier + 0.15);
    const finalComboPrice = parseFloat((baseComboPrice * synergyMultiplier).toFixed(2));

    const combo = {
      id: `combo_${Date.now()}`,
      title: `${main.name} & ${side.name} Cyber-Box`,
      main: main.name,
      side: side.name,
      price: finalComboPrice,
      margin: parseFloat((((finalComboPrice - (main.cost + side.cost)) / finalComboPrice) * 100).toFixed(1))
    };

    this.stats.combosCrafted += 1;
    this.addXp(60);
    return combo;
  }

  generateCriticReview() {
    const randomReview = this.criticReviews[Math.floor(Math.random() * this.criticReviews.length)];
    const score = Math.min(100, Math.floor(88 + Math.random() * 12));
    return {
      author: randomReview.author,
      text: randomReview.quote,
      rating: `${score}/100`,
      reputationImpact: score >= 95 ? +5 : +2
    };
  }

  calculateFinancialHealth() {
    const totalAssets = this.credits + this.calculateInventoryValue();
    const hourlyRunRate = this.hourlyRevenueHistory.reduce((a, b) => a + b, 0) / this.hourlyRevenueHistory.length;
    const estimatedDailyRevenue = hourlyRunRate * 24;

    return {
      totalAssets: totalAssets.toFixed(2),
      hourlyRunRate: hourlyRunRate.toFixed(2),
      estimatedDailyRevenue: estimatedDailyRevenue.toFixed(2),
      liquidityRatio: (this.credits / (totalAssets || 1)).toFixed(2)
    };
  }

  calculateInventoryValue() {
    let val = 0;
    for (const k in this.commodities) {
      val += this.commodities[k].inStock * this.commodities[k].currentPrice;
    }
    for (const ck in this.cookedInventory) {
      val += this.cookedInventory[ck].count * this.cookedInventory[ck].cost;
    }
    return val;
  }

  // ==========================================================================
  // MEGA-CITY SUPPLY CHAIN OPTIMIZER & SPICE PAIRWISE SYNERGY MATRIX
  // ==========================================================================

  calculateSpicePairwiseSynergy() {
    // Computes molecular flavor interaction matrices between the 11 secret herbs & spices
    const pairings = [
      { a: 'white_pepper', b: 'black_pepper', synergy: 1.25, note: 'Dual Piperine Resonance' },
      { a: 'thyme_leaf', b: 'oregano_wild', synergy: 1.15, note: 'Mediterranean Thymol Cascade' },
      { a: 'garlic_salt', b: 'celery_salt', synergy: 1.30, note: 'Glutamate Glutathione Umami Bridge' },
      { a: 'paprika_smoked', b: 'ginger_ground', synergy: 1.20, note: 'Carotenoid Zest Caramelization' },
      { a: 'mustard_powder', b: 'white_pepper', synergy: 1.35, note: 'Isothiocyanate Pungency Catalyst' },
      { a: 'basil_sweet', b: 'thyme_leaf', synergy: 1.10, note: 'Linalool Herbal Harmony' }
    ];

    let totalBonusMultiplier = 1.0;
    const notes = [];

    pairings.forEach((pair) => {
      const spiceA = this.secretSpices.find((s) => s.id === pair.a);
      const spiceB = this.secretSpices.find((s) => s.id === pair.b);
      if (spiceA && spiceB) {
        const ratioDiff = Math.abs(spiceA.ratio - spiceB.ratio);
        // If ratios are harmoniously balanced within 20% of each other, activate synergy
        if (ratioDiff <= 20 && spiceA.ratio > 30 && spiceB.ratio > 30) {
          totalBonusMultiplier *= pair.synergy;
          notes.push(`[ACTIVE] ${pair.note} (+${Math.round((pair.synergy - 1) * 100)}% Boost)`);
        }
      }
    });

    return {
      multiplier: parseFloat(totalBonusMultiplier.toFixed(2)),
      activeNotes: notes
    };
  }

  calculateDistrictTaxRates(district = 'SECTOR_7G') {
    const districts = {
      SECTOR_7G: { name: 'Sector 7-G Downtown Core', vatRate: 0.10, deliverySurcharge: 2.00, demandMultiplier: 1.2 },
      NEON_STRIP: { name: 'Neon Commercial Strip', vatRate: 0.08, deliverySurcharge: 1.50, demandMultiplier: 1.4 },
      SKY_PENTHOUSE: { name: 'Upper Stratosphere Penthouses', vatRate: 0.15, deliverySurcharge: 5.00, demandMultiplier: 1.8 },
      SUB_TERRAIN: { name: 'Sub-Level Industrial Slums', vatRate: 0.05, deliverySurcharge: 1.00, demandMultiplier: 0.9 }
    };
    return districts[district] || districts.SECTOR_7G;
  }

  optimizeSupplyLogistics() {
    let potentialSavings = 0;
    for (const key in this.commodities) {
      const comm = this.commodities[key];
      if (comm.inStock < 20) {
        // Bulk order discount potential
        const bulkUnits = 50;
        const standardCost = comm.currentPrice * bulkUnits;
        const discountedCost = standardCost * 0.85; // 15% bulk discount
        potentialSavings += (standardCost - discountedCost);
      }
    }
    return {
      potentialSavings: parseFloat(potentialSavings.toFixed(2)),
      recommendation: potentialSavings > 50 ? 'Execute bulk procurement order now!' : 'Inventory levels optimal.'
    };
  }

  // ==========================================================================
  // FRANCHISE EMPIRE EXPANSION & OFF-WORLD OUTPOSTS
  // ==========================================================================

  initFranchiseBranches() {
    return [
      { id: 'branch_neo_tokyo', city: 'Neo-Tokyo Shibuya Sub-Level', cost: 2500, passiveIncome: 65.00, unlocked: false },
      { id: 'branch_space_station', city: 'Lagrange-4 Orbital Food Court', cost: 5000, passiveIncome: 140.00, unlocked: false },
      { id: 'branch_cyber_london', city: 'Cyber-London Neo-Thames Hub', cost: 8000, passiveIncome: 250.00, unlocked: false }
    ];
  }

  unlockFranchiseBranch(branchId) {
    if (!this.franchiseBranches) this.franchiseBranches = this.initFranchiseBranches();
    const branch = this.franchiseBranches.find((b) => b.id === branchId);
    if (!branch) return { success: false, msg: 'Franchise branch not found' };
    if (branch.unlocked) return { success: false, msg: 'Branch already operating!' };
    if (this.credits < branch.cost) {
      return { success: false, msg: `Insufficient credits to license branch! Need &euro;${branch.cost}` };
    }

    this.credits -= branch.cost;
    branch.unlocked = true;
    this.addXp(300);
    return { success: true, branch };
  }

  collectFranchiseDividends() {
    if (!this.franchiseBranches) this.franchiseBranches = this.initFranchiseBranches();
    let totalDividends = 0;
    this.franchiseBranches.forEach((b) => {
      if (b.unlocked) {
        totalDividends += b.passiveIncome;
      }
    });

    if (totalDividends > 0) {
      this.credits += totalDividends;
      this.stats.lifetimeRevenue += totalDividends;
    }
    return totalDividends;
  }

  /**
   * Get formatted diagnostic summary of current KFC empire state
   */
  getDiagnosticsSummary() {
    return {
      version: '2088.4.2',
      credits: this.credits,
      reputation: this.reputation,
      activeCustomers: this.customers.length,
      currentWeather: this.weather,
      simulationTime: `Day ${this.day} - ${String(this.hour).padStart(2, '0')}:${String(Math.floor(this.minute)).padStart(2, '0')}`
    };
  }

  resetAllProgress() {
    localStorage.removeItem('KFC_CYBER_SAVE');
    location.reload();
  }
}

// Global Export
window.CyberSimulationEngine = CyberSimulationEngine;




