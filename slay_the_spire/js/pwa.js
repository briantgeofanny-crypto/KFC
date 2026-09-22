/**
 * ============================================================================
 * SHADOWSPIRE: CHRONICLES OF ASCENSION - PWA & INSTALLATION CONTROLLER
 * ============================================================================
 * Mengatur registrasi Service Worker, event instalasi aplikasi (beforeinstallprompt),
 * panduan instalasi iOS Safari, dan deteksi status offline/online.
 */

(function () {
  'use strict';

  class PWAController {
    constructor() {
      this.deferredPrompt = null;
      this.isStandalone = false;
      this.isIos = false;
    }

    init() {
      this.checkPlatform();
      this.registerServiceWorker();
      this.setupInstallListeners();
      this.setupConnectivityListeners();
    }

    checkPlatform() {
      // Deteksi apakah sedang dibuka di mode standalone (sudah di-install)
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = window.navigator.standalone === true;
      this.isStandalone = isStandaloneMedia || isIosStandalone;

      // Deteksi iOS Safari
      const userAgent = window.navigator.userAgent.toLowerCase();
      this.isIos = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;

      if (this.isStandalone) {
        document.documentElement.classList.add('app-standalone-mode');
        this.hideInstallButtons();
      } else {
        // Jika iOS dan belum standalone, tombol install tetap relevan untuk panduan manual
        if (this.isIos) {
          this.showInstallButtons();
        }
      }
    }

    registerServiceWorker() {
      if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('./sw.js')
            .then((registration) => {
              console.log('[PWA] Service Worker terdaftar dengan scope:', registration.scope);

              // Cek jika ada pembaruan
              registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker) {
                  installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                      this.showToast('Versi baru game tersedia! Silakan muat ulang untuk memperbarui.');
                    }
                  };
                }
              };
            })
            .catch((error) => {
              console.warn('[PWA] Gagal mendaftarkan Service Worker:', error);
            });
        });
      }
    }

    setupInstallListeners() {
      // Event beforeinstallprompt untuk Chrome, Edge, Android, Opera
      window.addEventListener('beforeinstallprompt', (e) => {
        // Cegah infobar default browser agar kita bisa memicu dari tombol game yang indah
        e.preventDefault();
        this.deferredPrompt = e;
        this.showInstallButtons();
        console.log('[PWA] beforeinstallprompt ditangkap. Tombol pasang aplikasi diaktifkan.');
      });

      // Event ketika aplikasi berhasil di-install
      window.addEventListener('appinstalled', () => {
        console.log('[PWA] ShadowSpire berhasil di-install sebagai aplikasi!');
        this.deferredPrompt = null;
        this.hideInstallButtons();
        this.showToast('🎉 ShadowSpire berhasil dipasang di perangkat Anda!');
      });
    }

    setupConnectivityListeners() {
      window.addEventListener('online', () => {
        this.showToast('🟢 Koneksi internet tersambung kembali');
      });

      window.addEventListener('offline', () => {
        this.showToast('⚡ Mode Offline aktif: Game tetap dapat dimainkan sepenuhnya');
      });
    }

    showInstallButtons() {
      const btnMain = document.getElementById('btnInstallAppMain');
      const btnSettings = document.getElementById('btnInstallAppSettings');

      if (btnMain) btnMain.style.display = 'flex';
      if (btnSettings) btnSettings.style.display = 'flex';
    }

    hideInstallButtons() {
      const btnMain = document.getElementById('btnInstallAppMain');
      const btnSettings = document.getElementById('btnInstallAppSettings');

      if (btnMain) btnMain.style.display = 'none';
      if (btnSettings) btnSettings.style.display = 'none';
    }

    async promptInstall() {
      // Jika diakses via file:/// beritahu user
      if (window.location.protocol === 'file:') {
        alert(
          'Fitur pemasangan aplikasi (PWA) memerlukan koneksi lokal/web.\n\n' +
          'Silakan jalankan game melalui file "START_SPIRE.bat" atau buka via http://localhost:8080!'
        );
        return;
      }

      // Jika ada event deferredPrompt
      if (this.deferredPrompt) {
        try {
          this.deferredPrompt.prompt();
          const choiceResult = await this.deferredPrompt.userChoice;
          if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] Pengguna menyetujui pemasangan aplikasi');
            this.showToast('Memasang ShadowSpire ke perangkat...');
          } else {
            console.log('[PWA] Pengguna membatalkan pemasangan');
          }
          this.deferredPrompt = null;
        } catch (err) {
          console.error('[PWA] Error saat memicu instalasi:', err);
        }
        return;
      }

      // Jika di iOS Safari
      if (this.isIos) {
        this.openIosInstallModal();
        return;
      }

      // Jika sudah terpasang
      if (this.isStandalone) {
        alert('ShadowSpire sudah terpasang sebagai aplikasi mandiri!');
        return;
      }

      // Jika browser desktop belum memicu prompt otomatis
      alert(
        'Untuk memasang aplikasi ini di browser Anda:\n\n' +
        '1. Periksa ikon "Pasang Aplikasi" (Install) di bilah alamat URL browser (ujung kanan atas).\n' +
        '2. Atau buka Menu Browser (titik tiga ⋮) -> pilih "Pasang ShadowSpire" / "Install ShadowSpire".'
      );
    }

    openIosInstallModal() {
      const modal = document.getElementById('iosInstallGuideModal');
      if (modal) {
        modal.style.display = 'flex';
      } else {
        alert(
          'Cara pasang di iPhone / iPad:\n\n' +
          '1. Ketuk tombol "Bagikan" (ikon kotak panah ke atas) di Safari.\n' +
          '2. Gulir ke bawah lalu pilih "Tambah ke Layar Utama" (Add to Home Screen).\n' +
          '3. Ketuk "Tambah" di pojok kanan atas.'
        );
      }
    }

    showToast(message) {
      let toast = document.getElementById('pwaToastNotification');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'pwaToastNotification';
        toast.className = 'pwa-toast-notification';
        document.body.appendChild(toast);
      }

      toast.textContent = message;
      toast.classList.add('active');

      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.classList.remove('active');
      }, 4000);
    }
  }

  window.spirePwa = new PWAController();
  window.addEventListener('DOMContentLoaded', () => {
    window.spirePwa.init();
  });
})();
