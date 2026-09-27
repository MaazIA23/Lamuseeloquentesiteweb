/* Petites fonctions partagées par tous les gabarits. */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "assets/img/manifest.json"), "utf8"));

/** Échappe le texte injecté dans le HTML. */
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Concatène des fragments en ignorant les valeurs vides. */
const html = (strings, ...values) =>
  strings.reduce((out, s, i) => out + s + (i < values.length ? [].concat(values[i] ?? "").filter((v) => v !== false).join("") : ""), "");

/** Image responsive à partir du manifeste généré par `npm run images`. */
function img(name, { alt = "", sizes = "100vw", cls = "", eager = false, pos = "" } = {}) {
  const m = manifest[name];
  if (!m) throw new Error(`Image inconnue : ${name} (lancez npm run images)`);
  const srcset = m.widths.map((w) => `/assets/img/${name}-${w}.webp ${w}w`).join(", ");
  const fallback = m.widths[Math.min(1, m.widths.length - 1)];
  const style = pos ? ` style="object-position:${pos}"` : "";
  return `<img src="/assets/img/${name}-${fallback}.webp" srcset="${srcset}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ""}${style} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

const imgUrl = (name, w = 1600) => {
  const m = manifest[name];
  const best = m.widths.filter((x) => x <= w).at(-1) || m.widths[0];
  return `/assets/img/${name}-${best}.webp`;
};

/** Lien WhatsApp pré-rempli. */
const wa = (site, message = "") => `https://wa.me/${site.contact.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

/** Lien externe : nouvel onglet sécurisé. */
const ext = (url) => (/^https?:/.test(url) ? ' target="_blank" rel="noopener"' : "");

const icon = {
  fleche: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  externe: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  tiret: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  plus: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  whatsapp: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.3 14.8L2.4 21.6l4.7-1.2A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.4 1 2.5.1.2 1.7 2.6 4.2 3.7 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>'
};

/** Le fil doré ondulé de la charte : se dessine quand il entre à l'écran. */
const fil = (variante = "a", cls = "") => {
  const d = {
    a: "M-20 150 C 180 40, 380 210, 640 120 S 1120 10, 1460 110",
    b: "M-20 60 C 260 190, 520 10, 760 90 S 1180 200, 1460 70",
    c: "M-20 110 C 300 10, 560 190, 820 110 S 1260 30, 1460 140"
  }[variante];
  return `<svg class="fil ${cls}" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${d}" pathLength="1"/></svg>`;
};

module.exports = { ROOT, manifest, esc, html, img, imgUrl, wa, ext, icon, fil };
