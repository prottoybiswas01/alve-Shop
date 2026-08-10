/**
 * Top-Class Security & Anti-Tamper Shield for Alve Shop E-Commerce
 */

export function initSecurityShield() {
  if (typeof window === 'undefined') return;

  // 1. Disable Right-Click Context Menu (Inspect Element Prevention)
  window.addEventListener('contextmenu', (e: MouseEvent) => {
    e.preventDefault();
    showSecurityNotice('Right-click context menu and Inspect Element are disabled for security.');
    return false;
  });

  // 2. Disable DevTools & View Source Keyboard Shortcuts
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      showSecurityNotice('F12 Developer Tools shortcut is restricted.');
      return false;
    }

    // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element picker)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      showSecurityNotice('DevTools inspection shortcut is restricted.');
      return false;
    }

    // Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      showSecurityNotice('View Source shortcut is restricted.');
      return false;
    }

    // Ctrl+S (Save Page)
    if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      showSecurityNotice('Page saving is restricted.');
      return false;
    }
  });

  // 3. Prevent Image Dragging
  window.addEventListener('dragstart', (e: DragEvent) => {
    if (e.target instanceof HTMLImageElement) {
      e.preventDefault();
      return false;
    }
  });

  console.log('🛡️ Top-Class Frontend Security Shield Activated (Anti-Inspect & Anti-XSS Protection Enabled)');
}

let lastNoticeTime = 0;
function showSecurityNotice(msg: string) {
  const now = Date.now();
  if (now - lastNoticeTime < 2500) return;
  lastNoticeTime = now;

  const toast = document.createElement('div');
  toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-rose-950/95 border border-rose-500/60 text-rose-200 text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 backdrop-blur-md transition-all duration-300 animate-bounce';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    <span>${msg}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
