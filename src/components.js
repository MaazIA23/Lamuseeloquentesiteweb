/* Blocs réutilisés par plusieurs pages. Les titres issus du contenu peuvent
   contenir <em>…</em> (contenu éditorial de confiance) : ils passent par `riche`. */
const { esc, html, img, wa, ext, icon, fil } = require("./lib");

/** Texte éditorial : échappe tout sauf <em> et <br>. */
const riche = (s = "") => esc(s).replace(/&lt;(\/?)em&gt;/g, "<$1em>").replace(/&lt;br&gt;/g, "<br>");

/** En-tête de section : surtitre + titre (+ texte). */
const enteteSection = ({ surtitre, titre, texte, centre = false, or = false }) => html`
<div class="entete-section${centre ? " entete-section--centre" : ""}">
  ${surtitre ? `<p class="surtitre${or ? " surtitre--or" : ""}">${esc(surtitre)}</p>` : ""}
  <h2 data-reveal>${riche(titre)}</h2>
  ${texte ? `<p>${esc(texte)}</p>` : ""}
</div>`;

/** Hero des pages internes : texte à gauche, photo éditoriale à droite. */
const pageHero = ({ ariane, surtitre, titre, texte, photo, photoAlt, actions = "", pos = "50% 20%" }) => html`
<section class="page-hero">
  <div class="conteneur page-hero__grille">
    <div class="page-hero__texte">
      <nav class="fil-ariane" aria-label="Fil d'Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><span>${esc(ariane)}</span></nav>
      <p class="surtitre">${esc(surtitre)}</p>
      <h1 class="page-hero__titre">${riche([].concat(titre).join(" "))}</h1>
      <p class="page-hero__intro">${esc(texte)}</p>
      ${actions ? `<div class="actions">${actions}</div>` : ""}
    </div>
    ${photo ? `<figure class="page-hero__photo photo">${img(photo, { alt: photoAlt, sizes: "(min-width: 900px) 38vw, 88vw", eager: true, pos })}</figure>` : ""}
  </div>
  ${fil("a", "page-hero__fil")}
</section>`;

/** Appel final bleu. */
const appelFinal = (site, { titre, texte, cta, whatsapp }) => html`
<section class="section section--bleu final">
  ${fil("c", "final__fil")}
  <div class="conteneur final__in">
    <h2 data-reveal>${riche(titre)}</h2>
    <p>${esc(texte)}</p>
    <div class="actions actions--centre">
      <a class="btn btn--clair" href="${cta.url}"${ext(cta.url)}>${esc(cta.label)} ${icon.fleche}</a>
      ${whatsapp ? `<a class="btn btn--ligne-claire" href="${wa(site, whatsapp)}"${ext("https:")}>${icon.whatsapp} Écrire sur WhatsApp</a>` : ""}
    </div>
  </div>
</section>`;

/** Carte témoignage. */
const temoin = (x, categories) => html`
<li class="temoin" data-reveal>
  ${categories && categories[x.categorie] ? `<p class="temoin__categorie">${esc(categories[x.categorie])}</p>` : ""}
  <blockquote><p>${esc(x.texte)}</p></blockquote>
  <p class="temoin__auteur">${x.photo ? img(x.photo, { alt: "", sizes: "56px" }) : `<span class="temoin__initiale" aria-hidden="true">${esc(x.nom.charAt(0))}</span>`}<span><b>${esc(x.nom)}</b>${esc(x.fonction)}${x.traduction ? `<small class="temoin__trad">${esc(x.traduction)}</small>` : ""}</span></p>
</li>`;

/** Vidéo YouTube en « façade » : miniature + bouton lecture, le lecteur ne se charge qu'au clic. */
const video = (v, cls = "") =>
  v && v.youtubeId
    ? html`<figure class="video ${v.format === "vertical" ? "video--vertical " : ""}${cls}" data-reveal>
  <button class="video__lancer" type="button" data-youtube="${esc(v.youtubeId)}" aria-label="Lire la vidéo : ${esc(v.titre)}">
    ${v.couverture ? img(v.couverture, { alt: "", sizes: v.format === "vertical" ? "360px" : "(min-width: 900px) 46vw, 92vw" }) : `<img src="https://i.ytimg.com/vi/${esc(v.youtubeId)}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async">`}
    <span class="video__bouton" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>
  </button>
  <figcaption>${esc(v.titre)}</figcaption>
</figure>`
    : "";

module.exports = { riche, enteteSection, pageHero, appelFinal, temoin, video };
