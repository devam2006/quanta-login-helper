const api = globalThis.browser || globalThis.chrome;
const enabled = document.querySelector('#enabled'), email = document.querySelector('#email'), status = document.querySelector('#status');
api.storage.local.get({ enabled: true, preferredEmail: '' }).then(s => { enabled.checked = s.enabled; email.value = s.preferredEmail; }).catch(() => { status.textContent = 'Could not load settings.'; });
document.querySelector('form').addEventListener('submit', async event => {
  event.preventDefault();
  const value = email.value.trim().toLowerCase();
  if (value && !Quanta.college(value)) { status.textContent = 'Use a campus email ending in .bits-pilani.ac.in.'; return; }
  try { await api.storage.local.set({ enabled: enabled.checked, preferredEmail: value }); status.textContent = 'Saved. Reload the login page to apply.'; }
  catch { status.textContent = 'Could not save settings. Please try again.'; }
});

const origins = ['https://quanta.bits-pilani.ac.in/*', 'https://accounts.google.com/*'];
const access = document.querySelector('#access'), grant = document.querySelector('#grant'), result = document.querySelector('#result');
async function showAccess() {
  try {
    const allowed = await api.permissions.contains({ origins });
    access.textContent = allowed ? 'Site access is ready.' : 'Site access is missing. Allow both sites, then reload the login page.';
    grant.hidden = allowed;
  } catch { access.textContent = 'Check site access in your browser extension settings.'; }
}
grant.addEventListener('click', () => {
  // Keep request directly in the user gesture for Firefox.
  api.permissions.request({ origins }).then(showAccess).catch(() => { access.textContent = 'Access was not granted. Check the browser extension permissions.'; });
});
api.storage.local.get({ lastResult: '' }).then(s => { result.textContent = s.lastResult ? 'Last attempt: ' + s.lastResult : 'No login status yet. If the chooser stays open, check site access and your preferred email.'; });
showAccess();
