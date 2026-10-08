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
