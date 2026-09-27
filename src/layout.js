/* Structure commune : <head> SEO, en-tête, menu mobile, pied de page. */
const { esc, html, imgUrl, wa, ext, icon } = require("./lib");

function head(site, page) {
  const titre = page.titre ? esc(page.titre) : esc(site.nom);
  const url = site.url + page.chemin;
  const image = site.url + imgUrl(page.image || site.imagePartage, 1600);
  return html`<!doctype html>
<html lang="${site.langue}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${esc(page.description || site.description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="${esc(site.nom)}">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${esc(page.description || site.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#272A5D">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/pictogramme-32.png">
<link rel="apple-touch-icon" href="/assets/brand/pictogramme-180.png">
<link rel="preload" href="/assets/fonts/anton-normal-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/montserrat-normal-300_700-latin.woff2" as="font" type="font/woff2" crossorigin>
${page.preload ? `<link rel="preload" as="image" href="${imgUrl(page.preload, 960)}" imagesrcset="${page.preloadSrcset || ""}" fetchpriority="high">` : ""}
<link rel="stylesheet" href="/assets/site.css?v=${page.version}">
<script>document.documentElement.classList.add("js");</script>
${(page.jsonld || []).map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`)}
</head>`;
}

function header(site, page) {
  const nav = site.navigation
    .map((n) => `<a href="${n.url}"${page.chemin.startsWith(n.url) ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`)
    .join("");
  return html`
<a class="evitement" href="#contenu">Aller au contenu</a>
<header class="entete${page.enteteSombre ? " entete--sombre" : ""}" data-entete>
  <div class="conteneur entete__in">
    <a class="marque" href="/" aria-label="${esc(site.nom)}, accueil">
      <img src="/assets/brand/pictogramme-180.png" width="44" height="44" alt="">
      <span>La Muse <b>Éloquente</b></span>
    </a>
    <nav class="entete__nav" aria-label="Navigation principale">${nav}</nav>
    <a class="btn btn--petit entete__cta" href="${site.ctaNavigation.url}">${esc(site.ctaNavigation.label)}</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu-mobile" data-burger>
      <span></span><span></span><span class="sr">Ouvrir le menu</span>
    </button>
  </div>
</header>
<div class="menu-mobile" id="menu-mobile" hidden data-menu>
  <nav aria-label="Menu mobile">
    <a href="/">Accueil</a>
    ${site.navigation.map((n) => `<a href="${n.url}">${esc(n.label)}</a>`)}
  </nav>
  <div class="menu-mobile__bas">
    <a class="btn btn--or" href="${site.ctaNavigation.url}">Réserver Speak &amp; Conquer</a>
    <a class="btn btn--ligne-claire" href="${wa(site, "Bonjour Mazidath, je vous contacte depuis votre site.")}"${ext("https:")}>${icon.whatsapp} WhatsApp</a>
    <p class="menu-mobile__devise">${esc(site.devise)}</p>
  </div>
</div>`;
}

function footer(site) {
  return html`
<footer class="pied">
  <div class="conteneur pied__grille">
    <div class="pied__marque">
      <img src="/assets/brand/logo-vertical.webp" width="300" height="393" alt="Logo La Muse Éloquente" loading="lazy">
      <p>${esc(site.devise)}</p>
    </div>
    <nav class="pied__col" aria-label="Plan du site">
      <h2>Le site</h2>
      <a href="/">Accueil</a>
      ${site.navigation.map((n) => `<a href="${n.url}">${esc(n.label)}</a>`)}
    </nav>
    <div class="pied__col">
      <h2>Contact</h2>
      ${site.contact.email ? `<a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a>` : ""}
      <a href="${wa(site)}"${ext("https:")}>WhatsApp <span class="nowrap">${esc(site.contact.whatsappAffiche)}</span></a>
      <a href="/travailler-avec-moi/#devis">Demande de devis</a>
    </div>
    <div class="pied__col">
      <h2>Réseaux</h2>
      ${site.reseaux.map((r) => `<a href="${r.url}"${ext(r.url)}>${esc(r.nom)}</a>`)}
    </div>
  </div>
  <div class="conteneur pied__bas">
    <p>© ${new Date().getFullYear()} ${esc(site.nom)} · ${esc(site.fondatrice)}</p>
    <p><a href="/mentions-legales/">Mentions légales</a> · <a href="/cgv/">CGV</a></p>
  </div>
</footer>`;
}

/** Barre d'action fixe sur mobile (apparaît après le premier écran). */
const barreMobile = (b) =>
  b
    ? `<div class="barre-mobile" data-barre hidden><p>${b.texte}</p><a class="btn btn--or btn--petit" href="${b.url}">${esc(b.label)}</a></div>`
    : "";

function layout(site, page, body) {
  return html`${head(site, page)}
<body class="${page.classe || ""}">
${header(site, page)}
<main id="contenu">
${body}
</main>
${footer(site)}
${barreMobile(page.barreMobile)}
<script src="/assets/site.js?v=${page.version}" defer></script>
</body>
</html>
`;
}

module.exports = { layout };
