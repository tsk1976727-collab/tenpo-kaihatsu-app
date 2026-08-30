(() => {
  if (window.matchMedia?.('(display-mode: standalone)').matches) return;

  let deferredPrompt = null;
  let installButton = null;

  const ensureButton = () => {
    if (installButton || !deferredPrompt) return;
    installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.textContent = 'インストール';
    installButton.setAttribute('aria-label', '店舗開発NAVIをインストール');
    Object.assign(installButton.style, {
      position: 'fixed',
      top: 'calc(12px + env(safe-area-inset-top))',
      right: '12px',
      zIndex: '2147483647',
      border: '0',
      borderRadius: '14px',
      padding: '11px 16px',
      background: '#ffffff',
      color: '#14556a',
      fontWeight: '900',
      fontSize: '14px',
      boxShadow: '0 8px 24px rgba(0,0,0,.18)',
      cursor: 'pointer'
    });
    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      installButton.disabled = true;
      try {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
      } finally {
        deferredPrompt = null;
        installButton?.remove();
        installButton = null;
      }
    });
    document.body.appendChild(installButton);
  };

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ensureButton, { once: true });
    } else {
      ensureButton();
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installButton?.remove();
    installButton = null;
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js', { scope: './' }).catch(() => {});
    });
  }
})();
