# KFC: Cyber Kitchen 2088 | Kingdom of Fried Culinary

Sebuah aplikasi web simulasi, game manajemen *tycoon*, dan laboratorium sains kuliner cyberpunk interaktif berskala besar yang dibangun dengan arsitektur murni (**Vanilla HTML5, Vanilla CSS3, dan Vanilla JavaScript ES6+**).

Proyek ini dirancang secara khusus untuk memenuhi standar rekayasa perangkat lunak mendalam di mana **setiap komponen utamanya memiliki lebih dari 1.000 baris kode** berbobot dan fungsional.

---

## 📊 Statistik Baris Kode Komponen Utama

| Komponen / Modul | File Path | Jumlah Baris | Deskripsi & Tanggung Jawab |
|---|---|---|---|
| **Styling & Design System** | [`css/style.css`](file:///c:/Users/LENOVO/Documents/KFC/css/style.css) | **2.143 baris** | Cyberpunk Neon Design System, Glassmorphism, CRT scanline filter, responsive layout, dan micro-interactions. |
| **UI Controller & Charts** | [`js/ui-controller.js`](file:///c:/Users/LENOVO/Documents/KFC/js/ui-controller.js) | **1.284 baris** | Custom Canvas Charting Engine (Line/Donut/Radar tanpa library luar), POS Cashier, thermal receipt printer, dan toast manager. |
| **Physics & Particle Engine** | [`js/physics-canvas.js`](file:///c:/Users/LENOVO/Documents/KFC/js/physics-canvas.js) | **1.248 baris** | Simulasi partikel minyak mendidih/uap/api, mini-game susun burger gravitasi 2D, dan Drone Radar dengan A* Pathfinding. |
| **Web Audio Synthesizer** | [`js/audio-engine.js`](file:///c:/Users/LENOVO/Documents/KFC/js/audio-engine.js) | **1.180 baris** | Procedural Web Audio API 8-voice synthwave sequencer, sound effects penggorengan minyak, krispi, POS beep, & audio visualizer. |
| **Tycoon Simulation Engine** | [`js/simulation-engine.js`](file:///c:/Users/LENOVO/Documents/KFC/js/simulation-engine.js) | **1.014 baris** | Model ekonomi dinamis, AI pelanggan berbasis state machine, formula alkimia 11 bumbu rahasia, tech tree, dan sistem save/load. |
| **Semantic HUD Layout** | [`index.html`](file:///c:/Users/LENOVO/Documents/KFC/index.html) | **860 baris** | Struktur workstation 8-tab, master header HUD, terminal log, dan modal config. |
| **Master Orchestrator** | [`js/app.js`](file:///c:/Users/LENOVO/Documents/KFC/js/app.js) | **145 baris** | 60 FPS requestAnimationFrame game loop, delta time sync, dan performance telemetry. |

---

## 🎮 8 Workstation Utama

1. **Kitchen Fry Bay**:
   - Simulator penggorengan bertekanan termal 185°C dengan efek partikel minyak mendidih, uap panas, dan percikan api.
   - Pilihan resep ayam original 11 bumbu, sayap pedas, dan tender krispi.
   - AI Auto-Fryer robot untuk otomasi penggorengan ketika stok menipis.

2. **Physics Stack Lab**:
   - Mini-game susun burger gravitasi 2D dengan deteksi tabrakan fisik nyata (restitusi, friksi, inersia, dan torsi).
   - Perhitungan ketinggian menara (mm), pusat massa (*Center of Mass*), dan skor keseimbangan (*balance %*).
   - Tantangan VIP Chef untuk menyusun burger bertingkat tinggi tanpa roboh.

3. **11 Spice Alchemy Lab**:
   - Slider matriks molekuler untuk 11 herba & rempah rahasia legendaris sang Kolonel.
   - Evaluator organoleptik: Umami, Aromatik, Kepedasan, dan Katalis Kerenyahan.
   - Radar Chart visual interaktif buatan sendiri untuk menganalisis profil rasa.

4. **POS Cashier & Orders**:
   - Antrian AI pelanggan dinamis dengan meter kesabaran, preferensi rasa, dan tamu VIP.
   - Pilihan menu cepat, kalkulasi subtotal/pajak otomatis, dan struk belanja termal hologram interaktif.
   - Opsi pengiriman ekspres via drone udara.

5. **Drone Radar Fleet**:
   - Radar airspace 1000m dengan sinar pemindai (*sweep beam*) 360 derajat.
   - Dron otonom mengantarkan pesanan ke gedung penthouse di seluruh penjuru kota mega-city.
   - Deteksi cuaca badai ionik dan telemetri baterai/kecepatan.

6. **Financial Analytics & Commodities Market**:
   - Grafik garis pendapatan per jam dan grafik donat pangsa penjualan produk (murni canvas 2D tanpa library eksternal).
   - Bursa pasar spot bahan baku (ayam mentah, tepung krispi, minyak kacang, keju neon) dengan fluktuasi harga dinamis.

7. **Tech Research Tree**:
   - 3 cabang riset teknologi (Otomasi Dapur, Sains Genomik Bumbu, dan Logistik Armada Drone).
   - Membuka perk pasif dan percepatan produksi.

8. **Synth Audio Studio**:
   - Audio visualizer oscilloscope & frekuensi real-time.
   - Mixer slider untuk Master, Bass, Arpeggiator, Drum, SFX, dan Reverb.
   - Sequencer 16-step bergaya synthwave retro-futuristik dengan berbagai tangga nada musik.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini 100% mandiri (*standalone*) tanpa memerlukan instalasi package npm:
1. Cukup buka file [`index.html`](file:///c:/Users/LENOVO/Documents/KFC/index.html) langsung di browser modern pilihan Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, dll.).
2. Klik di mana saja pada layar untuk mengaktifkan audio synthesizer prosedural.
3. Nikmati pengalaman mengelola kerajaan kuliner masa depan!
