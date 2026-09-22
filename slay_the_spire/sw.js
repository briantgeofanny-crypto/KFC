/**
 * ============================================================================
 * SHADOWSPIRE: CHRONICLES OF ASCENSION - SERVICE WORKER (OFFLINE ENGINE)
 * ============================================================================
 * Menyediakan dukungan offline penuh, caching instan seluruh aset game,
 * dan sinkronisasi pembaruan otomatis untuk Progressive Web App (PWA).
 */

const CACHE_NAME = 'shadowspire-cache-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/spire-theme.css?v=2',
  './css/spire-cards.css?v=2',
  './css/spire-combat.css?v=2',
  './css/spire-map.css?v=2',
  './css/spire-modals.css?v=2',
  './js/i18n.js?v=5',
  './js/audio.js?v=5',
  './js/vfx.js?v=5',
  './js/cards.js?v=5',
  './js/relics.js?v=5',
  './js/potions.js?v=5',
  './js/enemies.js?v=5',
  './js/events.js?v=5',
  './js/map.js?v=5',
  './js/gameState.js?v=5',
  './js/combat.js?v=5',
  './js/app.js?v=5',
  './js/pwa.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.png',
  './icons/favicon.ico'
];

// 1. Install Event: Pra-unduh dan cache semua aset inti game
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(CORE_ASSETS).catch((err) => {
          console.warn('[ServiceWorker] Some assets could not be pre-cached:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Bersihkan cache versi lama dan ambil kendali klien
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Cache-First dengan Network Fallback & Runtime Caching
self.addEventListener('fetch', (event) => {
  // Hanya proses request GET
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Abaikan request dari skema yang bukan http/https (misal chrome-extension)
  if (!requestUrl.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // Kembalikan aset dari cache langsung
        return cachedResponse;
      }

      // Jika belum ada di cache, ambil dari jaringan
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // Cache runtime untuk font Google atau aset eksternal
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback jika offline dan meminta halaman navigasi
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html', { ignoreSearch: true });
        }
      });
    })
  );
});
