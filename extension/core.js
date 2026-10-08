/* Shared, fail-closed Quanta routing and account selection. */
(() => {
  "use strict";
  const student = email => /^f20\d{6}@[a-z0-9-]+\.bits-pilani\.ac\.in$/i.test(email);
  const college = email => /^[^\s@]+@[a-z0-9-]+\.bits-pilani\.ac\.in$/i.test(email);
  function quantaFlow(raw) {
    try {
      const outer = new URL(raw);
      if (outer.origin !== "https://accounts.google.com") return false;
      // Only Google's account chooser, never password, consent or MFA screens.
      if (!/^\/(?:v\d+\/signin\/accountchooser|signin\/v\d+\/identifier|AccountChooser)\/?$/.test(outer.pathname)) return false;
      const next = new URL(outer.searchParams.get("continue"));
      if (next.origin !== "https://accounts.google.com" || next.pathname !== "/o/saml2/continue") return false;
      if (next.searchParams.get("idpid") !== "C042gmm8v") return false;
      const relay = new URL(next.searchParams.get("RelayState"));
      return relay.origin === "https://quanta.bits-pilani.ac.in" && relay.pathname === "/auth/saml2/login.php";
    } catch { return false; }
  }
  function choose(emails, preferred = "") {
    const unique = [...new Set(emails.map(x => x.trim().toLowerCase()))];
    if (preferred) return unique.find(x => x === preferred.toLowerCase() && college(x)) || null;
    const matches = unique.filter(student);
    return matches.length === 1 ? matches[0] : null;
  }
  globalThis.Quanta = Object.freeze({ student, college, quantaFlow, choose });
})();
