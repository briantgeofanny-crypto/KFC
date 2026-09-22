/**
 * ============================================================================
 * SHADOWSPIRE: CHRONICLES OF ASCENSION - MASTER MYSTERY EVENTS(NODE ❓)
  * ============================================================================
 * Koleksi peristiwa naratif interaktif yang penuh dilema moral, tawaran iblis,
 * jebakan reruntuhan purba, dan pertukaran artefak legendaris di Shadowspire.
 */

const EVENT_DATABASE = {
  // --------------------------------------------------------------------------
  // 1. THE ABYSSAL POOL & LEVIATHAN
  // --------------------------------------------------------------------------
  abyssal_pool: {
    id: 'abyssal_pool',
    title: 'Telaga Tenang Leviathan',
    imageIcon: '🐟✨',
    story: `
      Engkau memasuki sebuah ruangan batu berkubah yang sunyi. Di tengah telaga air bercahaya, seekor ikan raksasa purba mengambang dengan tenang.
      
      Di atas altar batu di hadapan makhluk tersebut, terdapat tiga persembahan yang belum tersentuh:
      Buah Delima Darah yang segar, Roti Keabadian berlapis madu kosmik, dan Kotak Berduri dengan segel runik terkutuk.
    `,
    options: [
      {
        text: '[Buah Delima] Memakan buah segar: Pulihkan 33% dari Max HP Anda.',
        execute(gameState) {
          const healAmt = Math.floor(gameState.player.maxHp * 0.33);
          gameState.heal(healAmt);
          return {
            text: `Rasa manis buah delima mengalirkan kehangatan ke dalam tubuhmu. Memulihkan ${healAmt} HP!`,
            done: true
          };
        }
      },
      {
        text: '[Roti Keabadian] Menelan roti mistis: Tingkatkan +6 Max HP secara permanen.',
        execute(gameState) {
          gameState.player.maxHp += 6;
          gameState.player.currentHp += 6;
          return {
            text: `Tenaga murni meresap ke dalam tulangmu. Max HP meningkat +6 secara permanen!`,
            done: true
          };
        }
      },
      {
        text: '[Kotak Berduri] Membuka paksa kotak: Peroleh Relic Acak, namun terkena duri beracun (-8 HP).',
        execute(gameState) {
          gameState.takeDamage(8);
          const relic = window.getRandomRelic(gameState.relics);
          if (relic) gameState.addRelic(relic);
          return {
            text: `Duri kotak merobek telapak tanganmu (-8 HP)! Namun di dalamnya tersimpan Relic berharga: ${relic ? relic.name : 'Vajra'}.`,
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 2. THE GOLDEN IDOL OF GREED
  // --------------------------------------------------------------------------
  golden_idol: {
    id: 'golden_idol',
    name: 'The Golden Idol',
    title: 'Berhala Emas Keserakahan',
    imageIcon: '🗿💰',
    story: `
      Di atas tiang batu berlumut di tengah ruangan bundar, bertengger Berhala Emas bermata safir yang memancarkan pendar kemilau luar biasa.
      
      Namun lantai di sekitarnya dipenuhi celah perangkap mekanik dan suara gemeretak katrol batu besar dari langit-langit yang siap runtuh menimpa siapapun yang mencoba memindahkannya.
    `,
    options: [
      {
        text: '[Ambil Berhala] Ambil Golden Idol (+25% bonus Gold), picu batu longsor (-14 HP).',
        execute(gameState) {
          gameState.takeDamage(14);
          const idol = window.RELIC_DATABASE.golden_idol;
          if (idol) gameState.addRelic(new window.Relic(idol));
          return {
            text: `Saat jarimu mencengkeram berhala, sebongkah batu raksasa menghantam pundakmu (-14 HP)! Tetapi kini Berhala Emas berada dalam ranselmu.`,
            done: true
          };
        }
      },
      {
        text: '[Tukarkan Kartu] Letakkan 1 kartu dari deck sebagai penyeimbang beban untuk mengambil berhala tanpa terluka.',
        execute(gameState) {
          const idol = window.RELIC_DATABASE.golden_idol;
          if (idol) gameState.addRelic(new window.Relic(idol));
          return {
            text: `Mekanisme perangkap berhasil dikelabui! Pilih 1 kartu untuk dikorbankan.`,
            action: 'REMOVE_CARD',
            done: true
          };
        }
      },
      {
        text: '[Tinggalkan] Tinggalkan ruangan dengan selamat.',
        execute() {
          return {
            text: `Engkau menahan godaan nafsu serakah dan melangkah pergi tanpa cedera.`,
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 3. THE SHINING ALTAR OF PURITY
  // --------------------------------------------------------------------------
  shining_altar: {
    id: 'shining_altar',
    title: 'Altar Cahaya Pengudusan',
    imageIcon: '⛪✨',
    story: `
      Cahaya matahari yang menyilaukan menembus celah atap menara yang hancur, jatuh tepat ke atas altar marmer putih murni.
      
      Sebuah prasasti bertuliskan bahasa kuno membisikkan:
      "Serahkan beban masa lalumu, atau bakar darah kotormu untuk menerima karunia ketajaman abadi."
    `,
    options: [
      {
        text: '[Bakar Dosa] Buang 1 kartu dari deck Anda secara permanen.',
        execute() {
          return {
            text: `Cahaya menyucikan jiwamu dan membakar habis salah satu memorimu. Pilih 1 kartu untuk dihapus.`,
            action: 'REMOVE_CARD',
            done: true
          };
        }
      },
      {
        text: '[Tempa Senjata] Tingkatkan 1 kartu di deck Anda menjadi (+).',
        execute() {
          return {
            text: `Percikan sinar fajar memperkuat salah satu senjatamu!`,
            action: 'UPGRADE_CARD',
            done: true
          };
        }
      },
      {
        text: '[Berdoa Khusyuk] Pulihkan 10 HP.',
        execute(gameState) {
          gameState.heal(10);
          return {
            text: `Doa ketenangan memulihkan 10 HP pahlawanmu.`,
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 4. THE LIVING WALL (DINDING BERWAJAH MANUSIA)
  // --------------------------------------------------------------------------
  living_wall: {
    id: 'living_wall',
    title: 'Dinding Berwajah Manusia',
    imageIcon: '🗿👁️',
    story: `
      Dinding batu di lorong ini bergeliat secara mengerikan. Tiga wajah manusia timbul dari permukaan batu dan memandangimu dengan tatapan lapar:
      
      Wajah Kiri: "Beri aku serpihan jiwamu, kan kubakar kartu terburukmu."
      Wajah Tengah: "Beri aku darah segarmu, kan kuperkuat kekuatan senjatamu."
      Wajah Kanan: "Beri aku emasmu, kan kuberi kau permata penyembuh."
    `,
    options: [
      {
        text: '[Wajah Kiri] Buang 1 kartu dari deck Anda.',
        execute() {
          return {
            text: `Wajah kiri menelan kartu yang kamu pilih dengan tawa mengerikan.`,
            action: 'REMOVE_CARD',
            done: true
          };
        }
      },
      {
        text: '[Wajah Tengah] Korbankan 4 HP untuk memperkuat 1 kartu (Upgrade +).',
        execute(gameState) {
          gameState.takeDamage(4);
          return {
            text: `Darahmu dihisap dinding (-4 HP). Salah satu senjatamu ditempa menjadi lebih mematikan!`,
            action: 'UPGRADE_CARD',
            done: true
          };
        }
      },
      {
        text: '[Wajah Kanan] Bayar 35 Gold untuk memulihkan 18 HP.',
        execute(gameState) {
          if (gameState.spendGold(35)) {
            gameState.heal(18);
            return {
              text: `Engkau melemparkan 35 Gold ke mulut wajah kanan. Tubuhmu diselimuti aura penyembuh (+18 HP)!`,
              done: true
            };
          } else {
            return {
              text: `Emasmu tidak mencukupi untuk memuaskan wajah serakah tersebut.`,
              done: true
            };
          }
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 5. THE BEGGING HERMIT (PERTAPA PENGEMBARA)
  // --------------------------------------------------------------------------
  begging_hermit: {
    id: 'begging_hermit',
    title: 'Pertapa Pengembara Buta',
    imageIcon: '🧙‍♂️🪙',
    story: `
      Seorang kakek tua berjubah robek duduk bersila di samping tumpukan abu dingin. Matanya buta diselubungi perban kotor, namun ia dapat mencium aroma kantung emas yang tergantung di pinggangmu.
      
      "Bagi sedikit rezeki untuk pengelana tua ini, anak muda... Aku akan membalas budimu dengan berkah tersembunyi."
    `,
    options: [
      {
        text: '[Beri Sedekah Dermawan] Berikan 75 Gold. Dapatkan Relic acak dari kantungnya.',
        execute(gameState) {
          if (gameState.spendGold(75)) {
            const relic = window.getRandomRelic(gameState.relics);
            if (relic) gameState.addRelic(relic);
            return {
              text: `Pertapa itu tersenyum lebar dan merogoh jubahnya. Memberikan ${relic ? relic.name : 'Vajra'} kepadamu!`,
              done: true
            };
          } else {
            return {
              text: `Engkau tidak memiliki 75 Gold untuk diberikan.`,
              done: true
            };
          }
        }
      },
      {
        text: '[Beri Beberapa Keping] Berikan 20 Gold. Pulihkan 12 HP.',
        execute(gameState) {
          if (gameState.spendGold(20)) {
            gameState.heal(12);
            return {
              text: `Pertapa itu meniupkan serbuk wangi ke wajahmu. Luka-lukamu membaik (+12 HP)!`,
              done: true
            };
          } else {
            return {
              text: `Emasmu tidak cukup.`,
              done: true
            };
          }
        }
      },
      {
        text: '[Tolak & Lewati] Abaikan permintaannya dan terus berjalan.',
        execute() {
          return {
            text: `Engkau melangkah melewatinya dalam hening. Pertapa itu hanya menghela napas panjang.`,
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 6. THE FORGOTTEN LABORATORY
  // --------------------------------------------------------------------------
  forgotten_lab: {
    id: 'forgotten_lab',
    title: 'Laboratorium Alkemis Terbengkalai',
    imageIcon: '🧪⚗️',
    story: `
      Meja-meja kayu lapuk dipenuhi botol erlenmeyer berdebu, pembakar spirtus kuno, dan catatan penelitian yang ditulis terburu-buru.
      
      Dua tabung kaca besar masih tertutup rapat dengan cairan misterius yang berpendar di dalamnya.
    `,
    options: [
      {
        text: '[Ambil Seluruh Ramuan] Dapatkan 2 Ramuan Tempur acak.',
        execute(gameState) {
          const p1 = window.getRandomPotion();
          const p2 = window.getRandomPotion();
          gameState.addPotion(p1);
          gameState.addPotion(p2);
          return {
            text: `Engkau memasukkan dua tabung ramuan ke dalam sabukmu: ${p1.name} dan ${p2.name}!`,
            done: true
          };
        }
      },
      {
        text: '[Bakar Catatan] Pelajari resep rahasia lalu bakar mejanya: Tingkatkan 1 kartu di deck (+).',
        execute() {
          return {
            text: `Engkau mempelajari diagram alkimia kuno dan memperkuat salah satu kartumu!`,
            action: 'UPGRADE_CARD',
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 7. THE CURSED FORGE OF HELLFIRE
  // --------------------------------------------------------------------------
  cursed_forge: {
    id: 'cursed_forge',
    title: 'Perapian Besi Neraka Terkutuk',
    imageIcon: '🔥🔨',
    story: `
      Sebuah paron hitam raksasa berdiri di atas kolam magma cair. Api biru neraka terus berkobar tanpa kayu bakar.
      
      Di atas paron terukir tulisan darah:
      "Tempa senjatamu di dalam kobaran neraka, atau terima kutukan bagi yang mencari jalan pintas."
    `,
    options: [
      {
        text: '[Tempa Tanpa Sarung Tangan] Korbankan 12 HP untuk memperkuat 2 kartu sekaligus (+).',
        execute(gameState) {
          gameState.takeDamage(12);
          return {
            text: `Panas membakar kedua tanganmu (-12 HP)! Namun dua senjatamu kini memancarkan api destruktif!`,
            action: 'UPGRADE_CARD',
            done: true
          };
        }
      },
      {
        text: '[Padamkan Api] Dinginkan paron dengan air suci untuk memulihkan 8 HP.',
        execute(gameState) {
          gameState.heal(8);
          return {
            text: `Uap dingin meredakan lelahmu. Pulih 8 HP!`,
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 8. THE ABYSSAL TOME OF ANCIENTS
  // --------------------------------------------------------------------------
  ancient_tome: {
    id: 'ancient_tome',
    title: 'Kitab Terlarang Abyssal',
    imageIcon: '📖🔮',
    story: `
      Di atas podium tengkorak melayang sebuah kitab tebal berikat kulit iblis yang berdenyut seirama detak jantung.
      
      Halaman-halaman buku itu berbisik menggoda pikiranmu dengan rahasia kekuasaan mutlak di luar nalar manusia.
    `,
    options: [
      {
        text: '[Baca Halaman Pertama] Kehilangan 5 HP: Dapatkan 1 kartu Rare acak.',
        execute(gameState) {
          gameState.takeDamage(5);
          const rareCard = new window.Card(window.CARD_DATABASE.bludgeon, false);
          gameState.addCard(rareCard);
          return {
            text: `Mata batinmu terbakar oleh aksara terlarang (-5 HP)! Engkau memperoleh kartu langka: ${rareCard.name}!`,
            done: true
          };
        }
      },
      {
        text: '[Tutup Kitab] Menghempaskan sampul kitab dan melangkah menjauh.',
        execute() {
          return {
            text: `Engkau menolak bisikan iblis dan menjaga kewarasan pikiranmu.`,
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 9. THE GOLDEN FOUNTAIN OF RESTORATION
  // --------------------------------------------------------------------------
  golden_fountain: {
    id: 'golden_fountain',
    title: 'Mata Air Emas Pemulihan',
    imageIcon: '⛲💎',
    story: `
      Pancuran marmer megah mengalirkan air jernih berkilau yang beraroma mint dan madu hutan.
      
      Rasa haus dan lelah selama mendaki lantai dungeon seketika menguap hanya dengan menghirup udaranya.
    `,
    options: [
      {
        text: '[Minum Puas] Pulihkan 25% dari Max HP Anda.',
        execute(gameState) {
          const heal = Math.floor(gameState.player.maxHp * 0.25);
          gameState.heal(heal);
          return {
            text: `Air yang segar mengalir membasahi tenggorokanmu. Pulihkan ${heal} HP!`,
            done: true
          };
        }
      },
      {
        text: '[Basuh Perlengkapan] Bersihkan perlengkapan perang: Buang 1 kartu dari deck.',
        execute() {
          return {
            text: `Air mata air melarutkan karat dan kotoran pada perlengkapanmu. Pilih 1 kartu untuk dihapus.`,
            action: 'REMOVE_CARD',
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 10. THE GRAVEROBBER'S STASH
  // --------------------------------------------------------------------------
  graverobber_stash: {
    id: 'graverobber_stash',
    title: 'Timbunan Harta Penjarah Makam',
    imageIcon: '⚰️💰',
    story: `
      Engkau menemukan perkemahan darurat milik penjarah makam yang telah tewas terbunuh oleh jebakan panah beracun.
      
      Kantung jarahannya tergeletak bersimbah darah di samping jasadnya yang mulai mengering.
    `,
    options: [
      {
        text: '[Geledah Kantung Emas] Ambil 85 Gold. Terkena goresan panah beracun (-6 HP).',
        execute(gameState) {
          gameState.takeDamage(6);
          gameState.addGold(85);
          return {
            text: `Engkau mengantongi 85 Gold, namun tergores panah beracun di bawah peti (-6 HP)!`,
            done: true
          };
        }
      },
      {
        text: '[Kuburkan Jasadnya] Kuburkan sang penjarah dengan hormat: Pulihkan 8 HP.',
        execute(gameState) {
          gameState.heal(8);
          return {
            text: `Arwah sang penjarah berterima kasih atas ketenangan terakhirnya. Pulihkan 8 HP.`,
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 11. THE PHANTASM OF THE CHESSMASTER
  // --------------------------------------------------------------------------
  chessmaster_specter: {
    id: 'chessmaster_specter',
    title: 'Papan Catur Sang Arwah Pecatur',
    imageIcon: '♟️👻',
    story: 'Di sebuah ruangan berlantai ubin hitam putih, arwah seorang grandmaster catur menantangmu dalam satu ronde permainan takdir. Bidang catur melayang dengan bidak-bidak berukir tengkorak kristal.',
    options: [
      {
        text: '[Langkah Menyerang] Mengorbankan bidak ratu: Bayar 4 HP, peroleh kartu Rare acak.',
        execute(gameState) {
          gameState.takeDamage(4);
          const card = new window.Card(window.CARD_DATABASE.bludgeon, false);
          gameState.addCard(card);
          return {
            text: 'Skakmat! Arwah pecatur menghormati agresivitasmu dan memberimu kartu langka!',
            done: true
          };
        }
      },
      {
        text: '[Langkah Bertahan] Membangun benteng pertahanan: Pulihkan 12 HP.',
        execute(gameState) {
          gameState.heal(12);
          return {
            text: 'Ketenangan strategi memulihkan semangat juangmu (+12 HP)!',
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 12. THE ASTRAL TELESCOPE OF OMENS
  // --------------------------------------------------------------------------
  astral_telescope: {
    id: 'astral_telescope',
    title: 'Teleskop Astral Bintang Kematian',
    imageIcon: '🔭✨',
    story: 'Sebuah teleskop perunggu raksasa mengarah ke kubah langit gelap yang dipenuhi nebula merah menyala. Di lensa teleskop terlihat kilatan masa depan lantai-lantai menara berikutnya.',
    options: [
      {
        text: '[Amati Rasi Bintang] Tingkatkan 1 kartu di deck Anda (+).',
        execute() {
          return {
            text: 'Bintang-bintang membisikkan cara menyempurnakan senjatamu!',
            action: 'UPGRADE_CARD',
            done: true
          };
        }
      },
      {
        text: '[Ambil Lensa Safir] Copot lensa safir berharga: Dapatkan 65 Gold, namun tergores pecahan kaca (-5 HP).',
        execute(gameState) {
          gameState.takeDamage(5);
          gameState.addGold(65);
          return {
            text: 'Lensa safir terjual seharga 65 Gold, meski tanganmu tergores kaca tajam (-5 HP).',
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 13. THE WEEPING STONE STATUE
  // --------------------------------------------------------------------------
  weeping_statue: {
    id: 'weeping_statue',
    title: 'Patung Malaikat Menangis Air Emas',
    imageIcon: '🗿💧',
    story: 'Patung marmer seorang dewi meneteskan air mata berwarna emas cair yang mengering menjadi kepingan uang logam mulia.',
    options: [
      {
        text: '[Tampung Air Mata] Dapatkan 50 Gold.',
        execute(gameState) {
          gameState.addGold(50);
          return {
            text: 'Engkau menampung 50 Gold tetesan air mata emas sang dewi.',
            done: true
          };
        }
      },
      {
        text: '[Hapus Air Matanya] Menyeka pipi patung: Pulihkan 15 HP.',
        execute(gameState) {
          gameState.heal(15);
          return {
            text: 'Sentuhan empatimu dibalas dengan kehangatan penyembuh (+15 HP)!',
            done: true
          };
        }
      }
    ]
  },


  // --------------------------------------------------------------------------
  // 14. THE VAMPIRE COVEN RITE
  // --------------------------------------------------------------------------
  vampire_coven: {
    id: 'vampire_coven',
    title: 'Perkumpulan Vampir Darah Malam',
    imageIcon: '🧛🩸',
    story: 'Sekelompok vampir bangsawan berkulit pucat mengundangmu minum anggur merah kental. "Bergabunglah dalam kutukan kami, fana... Serahkan kesehatan rapuhmu demi taring pengisap darah."',
    options: [
      {
        text: '[Terima Kutukan] Kehilangan 25% Max HP. Peroleh 3 kartu Vampiric Bite.',
        execute(gameState) {
          const hpLoss = Math.floor(gameState.player.maxHp * 0.25);
          gameState.player.maxHp -= hpLoss;
          gameState.player.currentHp = Math.min(gameState.player.currentHp, gameState.player.maxHp);
          gameState.addCard(new window.Card(window.CARD_DATABASE.vampiric_bite));
          gameState.addCard(new window.Card(window.CARD_DATABASE.vampiric_bite));
          gameState.addCard(new window.Card(window.CARD_DATABASE.vampiric_bite));
          return {
            text: `Taring menembus lehermu! Max HP berkurang -${hpLoss}, namun darah vampir mengalir di tubuhmu!`,
            done: true
          };
        }
      },
      {
        text: '[Tolak Tawaran] Menghunus pedang dan melangkah pergi.',
        execute() {
          return {
            text: 'Para vampir mencemoohmu dari balik cangkir anggur perak mereka.',
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 15. THE MUSHROOM GROVE OF MADNESS
  // --------------------------------------------------------------------------
  mushroom_grove: {
    id: 'mushroom_grove',
    title: 'Hutan Jamur Halusinasi Biru',
    imageIcon: '🍄✨',
    story: 'Hutan jamur berpendar neon biru membentang di dalam gua basah. Aroma manis spora membuat kepalamu melayang penuh ilusi ketenangan.',
    options: [
      {
        text: '[Hirup Spora Dalam-Dalam] Dapatkan Relic acak. Terkena kutukan Parasit.',
        execute(gameState) {
          const relic = window.getRandomRelic(gameState.relics);
          if (relic) gameState.addRelic(relic);
          gameState.addCard(new window.Card(window.CARD_DATABASE.wound));
          return {
            text: `Spora menginfeksi paru-parumu! Menemukan Relic: ${relic ? relic.name : 'Vajra'}, namun memperoleh kartu Luka!`,
            done: true
          };
        }
      },
      {
        text: '[Makan Tudung Jamur] Pulihkan 20 HP.',
        execute(gameState) {
          gameState.heal(20);
          return {
            text: 'Rasa gurih jamur menyembuhkan tubuhmu secara ajaib (+20 HP)!',
            done: true
          };
        }
      }
    ]
  },


  // --------------------------------------------------------------------------
  // 16. THE ABYSSAL MIRROR OF DOPPELGANGER
  // --------------------------------------------------------------------------
  doppelganger_mirror: {
    id: 'doppelganger_mirror',
    title: 'Cermin Pantulan Doppelganger',
    imageIcon: '🪞👥',
    story: 'Sebuah cermin perak antik berdiri di tengah lorong sempit. Bayanganmu di dalam cermin tersenyum dingin dan menawarkan kesepakatan: "Serahkan sebagian ingatanmu, kan kuberikan kembaranku untuk membantumu."',
    options: [
      {
        text: '[Gandakan Kartu Terbaik] Pilih 1 kartu untuk digandakan salinannya.',
        execute(gameState) {
          if (gameState.deck.length > 0) {
            const copyCard = gameState.deck[0].clone();
            gameState.addCard(copyCard);
            return {
              text: `Cermin bersinar terang! Kartu ${copyCard.name} berhasil digandakan ke dalam deck!`,
              done: true
            };
          }
          return { text: 'Deck kosong.', done: true };
        }
      },
      {
        text: '[Pecahkan Cermin] Menghancurkan cermin: Dapatkan 40 Gold, terkena pecahan (-4 HP).',
        execute(gameState) {
          gameState.takeDamage(4);
          gameState.addGold(40);
          return {
            text: 'Cermin pecah berantakan! Mengumpulkan 40 Gold di balik bingkai, namun jarimu terluka (-4 HP).',
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 17. THE SERPENT GOLD SANCTUARY
  // --------------------------------------------------------------------------
  serpent_gold: {
    id: 'serpent_gold',
    title: 'Sarang Ular Penimbun Emas',
    imageIcon: '🐍🪙',
    story: 'Seekor ular raksasa melingkari tumpukan ribuan keping koin emas berkilau. Matanya tertutup rapat dalam tidur lelap di atas hartanya.',
    options: [
      {
        text: '[Raup Segenggam Emas] Dapatkan 120 Gold. Ular terbangun dan mematukmu (-12 HP).',
        execute(gameState) {
          gameState.takeDamage(12);
          gameState.addGold(120);
          return {
            text: 'Engkau meraup 120 Gold! Ular terbangun dan mematuk pahamu sebelum engkau sempat kabur (-12 HP)!',
            done: true
          };
        }
      },
      {
        text: '[Ambil Perlahan Diam-Diam] Dapatkan 35 Gold tanpa suara.',
        execute(gameState) {
          gameState.addGold(35);
          return {
            text: 'Engkau mengambil 35 Gold dengan hati-hati dan melangkah pergi tanpa membangunkan ular.',
            done: true
          };
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 18. THE DEAD ADVENTURER CAMP
  // --------------------------------------------------------------------------
  dead_adventurer: {
    id: 'dead_adventurer',
    title: 'Tenda Petualang yang Telah Gugur',
    imageIcon: '⛺💀',
    story: 'Sisa tenda compang-camping dan ransel petualang yang telah menjadi kerangka tergeletak di samping api unggun yang padam bertahun-tahun silam.',
    options: [
      {
        text: '[Geledah Ransel] Ambil Relic acak dari ranselnya.',
        execute(gameState) {
          const relic = window.getRandomRelic(gameState.relics);
          if (relic) gameState.addRelic(relic);
          return {
            text: `Engkau menemukan peninggalan berharga: ${relic ? relic.name : 'Vajra'}!`,
            done: true
          };
        }
      },
      {
        text: '[Gali Makam Layak] Pulihkan 10 HP sebagai penghormatan.',
        execute(gameState) {
          gameState.heal(10);
          return {
            text: 'Rasa damai menyelimuti hatimu setelah menguburkan kerangka sang pendahulu (+10 HP).',
            done: true
          };
        }
      }
    ]
  },

};

function getRandomEvent() {
  const events = Object.values(EVENT_DATABASE);
  const picked = events[Math.floor(Math.random() * events.length)];
  return picked;
}

window.EVENT_DATABASE = EVENT_DATABASE;
window.getRandomEvent = getRandomEvent;
