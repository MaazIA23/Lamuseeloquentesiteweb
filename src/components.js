/* Blocs réutilisés par plusieurs pages. */
const { esc, html, img, wa, ext, icon, fil } = require("./lib");

/** En-tête de section : surtitre + titre (+ texte). */
const enteteSection = ({ surtitre, titre, texte, centre = false, or = false }) => html`
<div class="entete-section${centre ? " entete-section--centre" : ""}">
  ${surtitre ? `<p class="surtitre${or ? " surtitre--or" : ""}">${esc(surtitre)}</p>` : ""}
  <h2 data-reveal>${esc(titre)}</h2>
  ${texte ? `<p>${esc(texte)}</p>` : ""}
</div>`;

/** Hero des pages internes, sur fond bleu, avec photo en arche. */
const pageHero = ({ ariane, surtitre, titre, texte, photo, photoAlt, actions = "", pos = "50% 20%" }) => html`
<section class="section section--bleu page-hero">
  ${fil("b", "page-hero__fil")}
  <div class="conteneur page-hero__grille">
    <div class="page-hero__texte">
      <nav class="fil-ariane" aria-label="Fil d'Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><span>${esc(ariane)}</span></nav>
      <p class="surtitre surtitre--or">${esc(surtitre)}</p>
      <h1 class="page-hero__titre">${[].concat(titre).map((l) => `<span class="ligne"><span>${esc(l)}</span></span>`).join(" ")}</h1>
      <p class="page-hero__intro">${esc(texte)}</p>
      ${actions ? `<div class="actions">${actions}</div>` : ""}
    </div>
    ${photo ? `<figure class="page-hero__photo">${img(photo, { alt: photoAlt, sizes: "(min-width: 900px) 34vw, 80vw", eager: true, pos })}</figure>` : ""}
  </div>
</section>`;

/** Appel final bleu. */
const appelFinal = (site, { titre, texte, cta, whatsapp }) => html`
<section class="section section--bleu final">
  <div class="conteneur final__in">
    <h2 data-reveal>${esc(titre)}</h2>
    <p>${esc(texte)}</p>
    <div class="actions actions--centre">
      <a class="btn btn--or" href="${cta.url}">${esc(cta.label)} ${icon.fleche}</a>
      ${whatsapp ? `<a class="btn btn--ligne-claire" href="${wa(site, whatsapp)}"${ext("https:")}>${icon.whatsapp} Écrire sur WhatsApp</a>` : ""}
    </div>
  </div>
</section>`;

module.exports = { enteteSection, pageHero, appelFinal };
