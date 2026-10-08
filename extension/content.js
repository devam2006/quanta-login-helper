(() => {
  "use strict";
  if (window.top !== window) return;
  const api = globalThis.browser || globalThis.chrome;
  let observer, timer, clicked = false;
  const stop = () => { observer?.disconnect(); clearTimeout(timer); };
  async function start() {
    const settings = await api.storage.local.get({ enabled: true, preferredEmail: "" });
    if (!settings.enabled) return;
    const onQuanta = location.origin === "https://quanta.bits-pilani.ac.in";
    if (!onQuanta && !Quanta.quantaFlow(location.href)) return;
    // Respect explicit logout and error pages; only automate the ordinary login page.
    if (onQuanta && (location.pathname !== "/login/index.php" || new URL(location.href).searchParams.has("logout"))) return;
    function attempt() {
      if (clicked) return;
      let target;
      if (onQuanta) {
        if (document.querySelector('[role="alert"], .alert-danger, .loginerrors')) return;
        target = [...document.querySelectorAll('a.login-identityprovider-btn')].find(el => {
          try {
            const url = new URL(el.href, location.href);
            return /Login via BITS Gmail/i.test(el.textContent.replace(/\s+/g, " ")) && url.origin === location.origin && url.pathname === "/auth/saml2/login.php";
          } catch { return false; }
        });
      } else {
        if (!Quanta.quantaFlow(location.href)) { stop(); return; }
        const cards = [...document.querySelectorAll('[data-identifier], [data-email]')]
          .map(el => ({ email: el.getAttribute('data-identifier') || el.getAttribute('data-email') || '', card: el.closest('[role="link"], [role="button"], a, button') }))
          .filter(x => x.card && x.card.getClientRects().length && x.card.getAttribute('aria-disabled') !== 'true');
        const email = Quanta.choose(cards.map(x => x.email), settings.preferredEmail);
        target = cards.find(x => x.email.trim().toLowerCase() === email)?.card;
      }
      if (target && target.getClientRects().length) {
        // Prevent reload/back-navigation loops, scoped to this tab and origin.
        const key = 'quanta-helper-last-click';
        try {
          const previous = Number(sessionStorage.getItem(key));
          if (Date.now() - previous < 30000) { stop(); return; }
          sessionStorage.setItem(key, String(Date.now()));
        } catch { stop(); return; }
        clicked = true; stop(); target.click();
      }
    }
    observer = new MutationObserver(attempt);
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-email', 'data-identifier', 'aria-disabled'] });
    timer = setTimeout(stop, 20000);
    addEventListener('pagehide', stop, { once: true });
    api.storage.onChanged.addListener((changes, area) => { if (area === 'local' && (changes.enabled || changes.preferredEmail)) stop(); });
    attempt();
  }
  start().catch(() => {});
})();
