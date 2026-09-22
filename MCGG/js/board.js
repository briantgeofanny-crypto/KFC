// ============================================================
// MAGIC CHESS GOGO - BOARD MANAGER
// Board rendering, hero placement, drag/drop, bench
// ============================================================

export class Board {
  constructor(game) {
    this.game = game;
    this.ROWS = 4;
    this.COLS = 8;
    this.BENCH_SLOTS = 9;

    // Board state: 2D array [row][col] = Hero or null
    this.allyGrid = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(null));
    this.enemyGrid = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(null));
    this.bench = Array(this.BENCH_SLOTS).fill(null);

    // DOM references
    this.allyGridEl = document.getElementById('ally-grid');
    this.enemyGridEl = document.getElementById('enemy-grid');
    this.benchEl = document.getElementById('bench-row');

    this.selectedHero = null;
    this.dragSource = null;

    this.initGrid();
  }

  initGrid() {
    this.renderAllyGrid();
    this.renderEnemyGrid();
    this.renderBench();
  }

  // ==================== RENDERING ====================

  renderAllyGrid() {
    if (!this.allyGridEl) return;
    this.allyGridEl.innerHTML = '';

    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLS; col++) {
        const cell = this.createCell(row, col, 'ally');
        const hero = this.allyGrid[row][col];
        if (hero) {
          hero.position = { row, col };
          hero.isOnBoard = true;
          const el = hero.createElement();
          el.addEventListener('click', (e) => { e.stopPropagation(); this.onHeroClick(hero, 'ally', row, col); });
          el.addEventListener('mouseenter', () => this.showTooltip(hero, el));
          el.addEventListener('mouseleave', () => this.hideTooltip());
          cell.appendChild(el);
          cell.classList.add('has-hero');
        }
        this.allyGridEl.appendChild(cell);
      }
    }
  }

  renderEnemyGrid() {
    if (!this.enemyGridEl) return;
    this.enemyGridEl.innerHTML = '';
    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLS; col++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        const hero = this.enemyGrid[row][col];
        if (hero) {
          hero.team = 'enemy';
          const el = hero.createElement();
          el.draggable = false;
          el.style.cursor = 'default';
          el.addEventListener('mouseenter', () => this.showTooltip(hero, el));
          el.addEventListener('mouseleave', () => this.hideTooltip());
          cell.appendChild(el);
          cell.classList.add('has-hero');
        }
        this.enemyGridEl.appendChild(cell);
      }
    }
  }

  renderBench() {
    if (!this.benchEl) return;
    this.benchEl.innerHTML = '';
    for (let i = 0; i < this.BENCH_SLOTS; i++) {
      const cell = document.createElement('div');
      cell.className = 'board-cell bench-cell';
      cell.dataset.bench = i;

      this.setupDropTarget(cell, null, null, i);

      const hero = this.bench[i];
      if (hero) {
        hero.position = { bench: i };
        hero.isOnBoard = false;
        hero.isBench = true;
        const el = hero.createElement();
        el.addEventListener('click', (e) => { e.stopPropagation(); this.onHeroClick(hero, 'bench', null, null, i); });
        el.addEventListener('mouseenter', () => this.showTooltip(hero, el));
        el.addEventListener('mouseleave', () => this.hideTooltip());
        cell.appendChild(el);
        cell.classList.add('has-hero');
      }
      this.benchEl.appendChild(cell);
    }
  }

  createCell(row, col, team) {
    const cell = document.createElement('div');
    cell.className = 'board-cell';
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.dataset.team = team;

    if (team === 'ally') {
      this.setupDropTarget(cell, row, col, null);
      cell.addEventListener('click', () => this.onCellClick(row, col));
    }

    return cell;
  }

  // ==================== DRAG & DROP ====================

  setupDropTarget(cell, row, col, benchIdx) {
    cell.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      cell.classList.add('drag-over');
    });

    cell.addEventListener('dragleave', () => {
      cell.classList.remove('drag-over');
    });

    cell.addEventListener('drop', (e) => {
      e.preventDefault();
      cell.classList.remove('drag-over');
      const heroInstanceId = e.dataTransfer.getData('heroInstance');
      if (!heroInstanceId) return;

      const hero = this.findHeroByInstance(heroInstanceId);
      if (!hero) return;

      if (benchIdx !== null && benchIdx !== undefined) {
        this.moveHeroToBench(hero, benchIdx);
      } else {
        this.moveHeroToBoard(hero, row, col);
      }
    });
  }

  findHeroByInstance(instanceId) {
    // Search board
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (this.allyGrid[r][c]?.instanceId === instanceId) return this.allyGrid[r][c];
      }
    }
    // Search bench
    for (let i = 0; i < this.BENCH_SLOTS; i++) {
      if (this.bench[i]?.instanceId === instanceId) return this.bench[i];
    }
    return null;
  }

  // ==================== HERO MANAGEMENT ====================

  moveHeroToBoard(hero, row, col) {
    const maxOnBoard = this.game.playerLevel;
    const currentOnBoard = this.getBoardHeroes().length;

    // Remove from current position
    this.removeHeroFromCurrentPos(hero);

    // Check if target cell is occupied
    const existing = this.allyGrid[row][col];
    if (existing) {
      // Swap
      if (hero.position?.bench !== undefined) {
        this.bench[hero.position.bench] = null;
        this.placeHeroOnBench(existing, hero.position.bench);
      } else if (hero.position) {
        this.allyGrid[hero.position.row][hero.position.col] = existing;
        existing.position = { row: hero.position.row, col: hero.position.col };
      } else {
        this.placeHeroOnBench(existing);
      }
    } else {
      // Check board cap
      const newOnBoard = currentOnBoard + (hero.isOnBoard ? 0 : 1);
      if (newOnBoard > maxOnBoard && !hero.isOnBoard) {
        this.game.showNotification('⚠️ Board is full! Upgrade your level.', 'error');
        this.placeHeroOnBench(hero);
        this.renderBench();
        return;
      }
    }

    this.allyGrid[row][col] = hero;
    hero.position = { row, col };
    hero.isOnBoard = true;
    hero.isBench = false;
    hero.team = 'player';

    this.renderAllyGrid();
    this.renderBench();
    this.game.onBoardChanged();
  }

  moveHeroToBench(hero, benchIdx) {
    this.removeHeroFromCurrentPos(hero);

    const existing = this.bench[benchIdx];
    if (existing && hero.position?.bench !== undefined) {
      // Swap bench positions
      this.bench[hero.position.bench] = existing;
      existing.position = { bench: hero.position.bench };
    } else if (existing) {
      this.moveHeroToBoard(existing, hero.position?.row ?? 0, hero.position?.col ?? 0);
    }

    this.bench[benchIdx] = hero;
    hero.position = { bench: benchIdx };
    hero.isOnBoard = false;
    hero.isBench = true;

    this.renderAllyGrid();
    this.renderBench();
    this.game.onBoardChanged();
  }

  placeHeroOnBench(hero, preferredIdx = null) {
    if (preferredIdx !== null && !this.bench[preferredIdx]) {
      this.bench[preferredIdx] = hero;
      hero.position = { bench: preferredIdx };
      hero.isOnBoard = false;
      hero.isBench = true;
      return true;
    }
    // Find first empty bench slot
    for (let i = 0; i < this.BENCH_SLOTS; i++) {
      if (!this.bench[i]) {
        this.bench[i] = hero;
        hero.position = { bench: i };
        hero.isOnBoard = false;
        hero.isBench = true;
        return true;
      }
    }
    this.game.showNotification('❌ Bench is full!', 'error');
    return false;
  }

  removeHeroFromCurrentPos(hero) {
    if (hero.position?.bench !== undefined) {
      this.bench[hero.position.bench] = null;
    } else if (hero.position) {
      this.allyGrid[hero.position.row][hero.position.col] = null;
    }
  }

  addHeroToCollection(hero) {
    // Try star upgrade first
    const upgraded = this.tryStarUpgrade(hero);
    if (upgraded) return;

    // Place on bench
    const placed = this.placeHeroOnBench(hero);
    if (placed) {
      this.renderBench();
      this.game.onBoardChanged();
    } else {
      // Sell the hero
      this.game.economy.addGold(hero.cost);
      this.game.showNotification(`💰 ${hero.name} sold for ${hero.cost}G (bench full)`, 'gold');
    }
  }

  tryStarUpgrade(newHero) {
    // Collect all heroes of same id at 1★ for 2★, or 2★ for 3★
    const targetStar = newHero.star;
    const allSameHeroes = this.getAllHeroesById(newHero.id).filter(h => h.star === targetStar);

    if (allSameHeroes.length >= 2) { // need 2 more (already have 2, this is 3rd)
      // Remove 2 existing copies
      const toRemove = allSameHeroes.slice(0, 2);
      for (const h of toRemove) this.removeHeroFromGame(h);

      // Upgrade new hero
      newHero.upgradeToStar(targetStar + 1);

      // Place upgraded hero
      this.placeHeroOnBench(newHero);
      this.renderAllyGrid();
      this.renderBench();

      this.game.showNotification(`⭐ ${newHero.name} upgraded to ${newHero.star}★!`, 'gold');
      this.game.onBoardChanged();

      // Check if this triggers another upgrade
      if (newHero.star < 3) this.tryStarUpgrade(newHero);
      return true;
    }
    return false;
  }

  getAllHeroesById(heroId) {
    const heroes = [];
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (this.allyGrid[r][c]?.id === heroId) heroes.push(this.allyGrid[r][c]);
      }
    }
    for (let i = 0; i < this.BENCH_SLOTS; i++) {
      if (this.bench[i]?.id === heroId) heroes.push(this.bench[i]);
    }
    return heroes;
  }

  removeHeroFromGame(hero) {
    this.removeHeroFromCurrentPos(hero);
  }

  sellHero(hero) {
    this.removeHeroFromCurrentPos(hero);
    const goldReturn = hero.cost * hero.star;
    this.game.economy.addGold(goldReturn);
    this.game.showNotification(`💰 Sold ${hero.name} for ${goldReturn}G`, 'gold');
    this.renderAllyGrid();
    this.renderBench();
    this.game.onBoardChanged();
  }

  // ==================== QUERIES ====================

  getBoardHeroes() {
    const heroes = [];
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (this.allyGrid[r][c]) heroes.push(this.allyGrid[r][c]);
      }
    }
    return heroes;
  }

  getBenchHeroes() {
    return this.bench.filter(Boolean);
  }

  getAllAllyHeroes() {
    return [...this.getBoardHeroes(), ...this.getBenchHeroes()];
  }

  // ==================== CLICK HANDLERS ====================

  onHeroClick(hero, location, row, col, benchIdx) {
    if (this.selectedHero === hero) {
      this.selectedHero = null;
      this.game.showHeroDetail(null);
      return;
    }
    this.selectedHero = hero;
    this.game.showHeroDetail(hero);
  }

  onCellClick(row, col) {
    if (!this.selectedHero) return;
    // If we have a selected hero, move it here
    this.moveHeroToBoard(this.selectedHero, row, col);
    this.selectedHero = null;
    this.game.showHeroDetail(null);
  }

  // ==================== TOOLTIP ====================

  showTooltip(hero, anchorEl) {
    let tooltip = document.getElementById('hero-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'hero-tooltip';
      tooltip.className = 'hero-tooltip';
      document.body.appendChild(tooltip);
    }
    tooltip.innerHTML = hero.getTooltipHTML();
    tooltip.style.display = 'block';

    const rect = anchorEl.getBoundingClientRect();
    let x = rect.right + 10;
    let y = rect.top;

    if (x + 260 > window.innerWidth) x = rect.left - 270;
    if (y + 400 > window.innerHeight) y = window.innerHeight - 410;
    if (y < 10) y = 10;

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  hideTooltip() {
    const tooltip = document.getElementById('hero-tooltip');
    if (tooltip) tooltip.style.display = 'none';
  }

  // ==================== ENEMY BOARD ====================

  setEnemyBoard(enemyHeroes) {
    this.enemyGrid = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(null));
    // Place enemy heroes in top rows
    let placed = 0;
    for (const hero of enemyHeroes) {
      if (placed >= this.ROWS * this.COLS) break;
      const row = Math.floor(placed / this.COLS);
      const col = placed % this.COLS;
      this.enemyGrid[row][col] = hero;
      hero.team = 'enemy';
      placed++;
    }
    this.renderEnemyGrid();
  }

  clearEnemyBoard() {
    this.enemyGrid = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(null));
    if (this.enemyGridEl) this.enemyGridEl.innerHTML = '';
    this.renderEnemyGrid();
  }

  // ==================== BATTLE POSITIONS ====================

  getBattlePositions() {
    const ally = [];
    const enemy = [];

    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (this.allyGrid[r][c]) {
          ally.push({ hero: this.allyGrid[r][c], row: r, col: c });
        }
        if (this.enemyGrid[r][c]) {
          enemy.push({ hero: this.enemyGrid[r][c], row: r, col: c });
        }
      }
    }

    return { ally, enemy };
  }

  // ==================== RESET FOR NEXT ROUND ====================

  resetForNewRound() {
    // Restore all board heroes to full HP
    this.getBoardHeroes().forEach(h => h.resetStats());
    // Clear enemy board
    this.clearEnemyBoard();
    // Re-render
    this.renderAllyGrid();
  }
}
