# Quanta Login Helper 2.0.1

Unofficial BITS Quanta helper for desktop Firefox 140+ and current desktop Chrome. Not affiliated with BITS, Google, or Mozilla.

## Firefox update (2.0.1)

Open the extension popup. If it says site access is missing, click Allow Quanta and Google login access and accept the browser prompt. Save your preferred college email if more than one account is listed. Reload the chooser. The popup shows a local last-attempt status to help diagnose a stopped login. The helper now tolerates Firefox denying page storage and retries cards that become visible after initial rendering. Live Firefox account selection is still awaiting user verification.

## What changed

The old version selected its author's hard-coded email on every Google sign-in page. This version checks an exact Google SAML continuation endpoint, BITS identity-provider ID and Quanta RelayState origin/path before inspecting account cards. It never selects an account on ordinary Gmail or other websites' Google sign-ins. It never enters passwords or handles MFA.

On Quanta's login page it clicks the existing Login via BITS Gmail link. Opening Quanta's home or dashboard follows the site's normal redirects; the extension does not force a logged-in page into login. Error pages, logout flags and rapid repeated clicks are left alone. A 30-second per-tab cooldown prevents immediate loops; after a failed login, disable the helper to troubleshoot manually.

Without a preferred email, only one visible account matching f20 + six digits + @campus.bits-pilani.ac.in is selected. Two matching accounts are left for you to choose. A preferred email may be any account at a campus subdomain ending in .bits-pilani.ac.in; if it is absent, the helper does nothing. New campus names work automatically. No account is bundled for the author.

## Chrome: install now

1. Remove the old extension first so its script cannot keep selecting your account.
2. Extract quanta-login-chrome-2.0.1.zip into a permanent folder; keep that folder in place.
3. Open chrome://extensions, turn on Developer mode, select Load unpacked, and choose that folder.
4. Open the extension's toolbar popup or its extension options. Optionally save your college email.
5. Open Quanta's login page. Sign in to your college Google account manually first if it is not listed.

The unpacked extension remains registered after Chrome restarts as long as its folder stays in place and browser/organization policy allows developer extensions. Friends can use the same package and save their own settings. For ordinary installation use a Chrome Web Store listing.

## Firefox: permanent installation requires signing

The supplied Firefox ZIP is a submission package, not a signed installable add-on. Renaming it to .xpi does not sign it.

1. Sign in at https://addons.mozilla.org/developers/ and submit quanta-login-firefox-2.0.1.zip.
2. Choose self-distribution (unlisted) to get a Mozilla-signed .xpi for your friend group, or choose distribution on addons.mozilla.org for a public listing. Follow validation/review steps.
3. Download the signed .xpi. In Firefox open about:addons, select the gear menu, then Install Add-on From File and select it. Share that signed file with friends, or share the public listing link.
4. Open the extension options and save your preferred college email if needed. Enable site access to Quanta and accounts.google.com if Firefox asks.
5. Restart Firefox and verify the signed add-on remains installed.

For a quick test only: extract the Firefox ZIP, open about:debugging#/runtime/this-firefox, choose Load Temporary Add-on and select manifest.json. This temporary install WILL disappear when Firefox restarts. That behavior cannot be fixed inside the extension. A signed installation solves it.

The Firefox add-on ID is a generic stable project identifier. Keep it unchanged after signing and distribution. Self-distributed updates require new signed packages; automatic self-hosted updates are not configured.

## Chrome Web Store submission

Sign in at https://chrome.google.com/webstore/devconsole and complete developer registration. Create a new item and upload quanta-login-chrome-2.0.1.zip. Supply the store listing, category, actual browser screenshots, privacy disclosures, and any required reviewer information. Choose an unlisted listing for link sharing if available, or public visibility. Submit for review. No store submission or signing has been performed here.

Suggested listing title: Quanta Login Helper

Suggested short description: Select your college Google account only during BITS Quanta login. Independent, unofficial helper.

Suggested detailed description: Automatically opens BITS Gmail login on Quanta and selects your existing college Google account only when the login flow explicitly returns to Quanta. Set a preferred campus email, or leave it blank to select only a single matching student account. Multiple accounts remain a manual choice. Includes an enable switch. Settings stay in your browser; no passwords, tracking, remote code, or developer servers. Google and BITS continue to handle authentication and MFA. Independent student utility, not affiliated with BITS or Google.

Permission explanation: storage saves the enable switch and optional preferred email locally. Quanta page access finds its SAML login button. Google Accounts page access reads visible account identifiers only after verifying the Quanta SAML return URL. No history, cookies, tabs, background service, or network interception permission is used.

Use PRIVACY.md as the basis for the privacy policy; publish it at a public URL if the store requires one. Review store questionnaires against the actual behavior: the extension reads account emails locally but sends no data to the developer. Do not claim the extension has no access to account emails.

## Verification and limits

28 automated routing/account-selection/content-script checks passed, including non-Quanta sign-in, deceptive hostnames, wrong identity provider, password screens, multiple accounts, missing preferred email, disable switch, logout, dashboard and click cooldown. JavaScript syntax checks passed. No third-party runtime dependencies or remote code.

The public Quanta login page was checked and still presents Login via BITS Gmail. An authenticated browser login, Firefox/Chrome installation, store validation and signed-install persistence have NOT been tested here. Google's live DOM may change; the extension deliberately leaves login manual when its known account-card markers are missing. The identity-provider ID is based on the supplied sign-in URL and may need updating if BITS changes providers. Transient authentication token values from your link are not bundled.

Before publishing, test in both browsers: Quanta with one account; two campus accounts; a preferred account; another site's Google login; missing account; MFA; disabled helper; logout; restart. Take genuine screenshots for the store. If Quanta authentication fails manually, the helper cannot fix the school's login service.

## Source

extension contains the readable extension. manifest.json is the Firefox manifest; manifest.chrome.json is the Chrome variant and must be named manifest.json in a Chrome package. The two ZIPs contain the appropriate manifest at their root. Icons are original generated geometric Q artwork. No build step or remote libraries are needed to edit the extension.

Official references:
- https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/
- https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/
- https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/
- https://developer.chrome.com/docs/webstore/publish


## Development

Run `node tests/test.cjs` (Node 20+). Run `python3 tools/package.py` to create Firefox and Chrome ZIPs in `dist/`. Only the extension directory is included in packages. No dependencies are required. Live authenticated browser testing and store validation are still required before release.
