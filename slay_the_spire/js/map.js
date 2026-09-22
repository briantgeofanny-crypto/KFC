/**
 * Slay the Spire - Procedural Map Generator
 * Menghasilkan peta 15 lantai Act 1 dengan percabangan rute yang terhubung
 */

const NODE_TYPES = {
  START: { id: 'start', name: 'Start', icon: '🚪' },
  MONSTER: { id: 'monster', name: 'Monster', icon: '⚔️' },
  ELITE: { id: 'elite', name: 'Elite', icon: '👹' },
  REST: { id: 'rest', name: 'Rest Site', icon: '🏕️' },
  SHOP: { id: 'shop', name: 'Merchant', icon: '💰' },
  EVENT: { id: 'event', name: 'Unknown', icon: '❓' },
  CHEST: { id: 'chest', name: 'Treasure', icon: '💎' },
  BOSS: { id: 'boss', name: 'Boss', icon: '👑' }
};

class SpireMap {
  constructor(numFloors = 15, cols = 4) {
    this.numFloors = numFloors;
    this.cols = cols;
    this.floors = [];
    this.currentNode = null;
    this.generateMap();
  }

  generateMap() {
    this.floors = [];

    // Buat grid kosong
    for (let f = 0; f < this.numFloors; f++) {
      const floorNodes = [];
      const nodeCount = (f === this.numFloors - 1) ? 1 : Math.floor(Math.random() * 2) + 3; // 3-4 nodes per floor, 1 boss
      
      const availableCols = [0, 1, 2, 3];
      // Acak kolom terpilih
      availableCols.sort(() => Math.random() - 0.5);
      const chosenCols = (f === this.numFloors - 1) ? [1.5] : availableCols.slice(0, nodeCount).sort((a, b) => a - b);

      chosenCols.forEach(col => {
        let type = NODE_TYPES.MONSTER;

        // Penentuan tipe node berdasarkan lantai
        if (f === 0) {
          type = NODE_TYPES.MONSTER; // Lantai 1 selalu monster normal
        } else if (f === this.numFloors - 1) {
          type = NODE_TYPES.BOSS; // Lantai 15 Boss
        } else if (f === this.numFloors - 2) {
          type = NODE_TYPES.REST; // Lantai 14 selalu Campfire sebelum Boss
        } else if (f === 8) {
          type = NODE_TYPES.CHEST; // Lantai 9 selalu Treasure
        } else if (f === 5) {
          type = (Math.random() < 0.6) ? NODE_TYPES.REST : NODE_TYPES.ELITE;
        } else {
          // Weighted random untuk lantai lainnya
          const roll = Math.random() * 100;
          if (roll < 45) type = NODE_TYPES.MONSTER;
          else if (roll < 65) type = NODE_TYPES.EVENT;
          else if (roll < 80) type = NODE_TYPES.REST;
          else if (roll < 92) type = NODE_TYPES.SHOP;
          else type = NODE_TYPES.ELITE;
        }

        floorNodes.push({
          id: `node_${f}_${Math.floor(col * 10)}`,
          floor: f,
          col: col,
          type: type,
          children: [], // id koneksi ke lantai atasnya
          parents: [],
          visited: false,
          available: (f === 0)
        });
      });

      this.floors.push(floorNodes);
    }

    // Hubungkan node antar lantai berurutan
    for (let f = 0; f < this.numFloors - 1; f++) {
      const currentNodes = this.floors[f];
      const nextNodes = this.floors[f + 1];

      // Pastikan setiap node di lantai saat ini memiliki minimal 1 koneksi ke lantai berikutnya
      currentNodes.forEach(cNode => {
        // Cari node terdekat di lantai atasnya
        const candidates = nextNodes.filter(nNode => Math.abs(nNode.col - cNode.col) <= 1.5);
        if (candidates.length > 0) {
          candidates.forEach(candidate => {
            cNode.children.push(candidate.id);
            candidate.parents.push(cNode.id);
          });
        } else {
          // Fallback ke node terdekat jika tidak ada
          let closest = nextNodes[0];
          let minDiff = Math.abs(nextNodes[0].col - cNode.col);
          nextNodes.forEach(cand => {
            const diff = Math.abs(cand.col - cNode.col);
            if (diff < minDiff) {
              minDiff = diff;
              closest = cand;
            }
          });
          cNode.children.push(closest.id);
          closest.parents.push(cNode.id);
        }
      });

      // Pastikan setiap node di lantai atas memiliki minimal 1 parent (tidak ada node yatim piatu)
      nextNodes.forEach(nNode => {
        if (nNode.parents.length === 0) {
          let closest = currentNodes[0];
          let minDiff = Math.abs(currentNodes[0].col - nNode.col);
          currentNodes.forEach(cand => {
            const diff = Math.abs(cand.col - nNode.col);
            if (diff < minDiff) {
              minDiff = diff;
              closest = cand;
            }
          });
          closest.children.push(nNode.id);
          nNode.parents.push(closest.id);
        }
      });
    }
  }

  getNodeById(id) {
    for (const floor of this.floors) {
      for (const node of floor) {
        if (node.id === id) return node;
      }
    }
    return null;
  }

  // Pilih node berikutnya untuk dimasuki
  selectNode(nodeId) {
    const targetNode = this.getNodeById(nodeId);
    if (!targetNode || !targetNode.available) return null;

    // Tandai node lama dan perbarui ketersediaan
    if (this.currentNode) {
      this.currentNode.visited = true;
    }
    this.currentNode = targetNode;
    targetNode.visited = true;

    // Reset ketersediaan semua node
    this.floors.forEach(floor => {
      floor.forEach(n => { n.available = false; });
    });

    // Aktifkan anak-anak yang terhubung
    targetNode.children.forEach(childId => {
      const child = this.getNodeById(childId);
      if (child) child.available = true;
    });

    return targetNode;
  }
}

window.NODE_TYPES = NODE_TYPES;
window.SpireMap = SpireMap;
