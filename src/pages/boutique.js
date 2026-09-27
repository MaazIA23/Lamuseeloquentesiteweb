/* Page Boutique : livre et ebooks. Une fiche produit par entrée de content/boutique.json. */
const { esc, html, img, wa, ext, icon } = require("../lib");
const { pageHero, appelFinal } = require("../components");

module.exports = function boutique({ site, boutique: b }) {
  const hero = pageHero({
    ariane: "Boutique",
    surtitre: "Transmettre",
    titre: ["Livre", "& ebooks"],
    texte: "Des ressources pour progresser à votre rythme : un récit pour vous inspirer, des méthodes pour vous entraîner.",
    photo: "livre-chroniques",
    photoAlt: "Le livre Chroniques d'une voix qui s'est révélée",
    pos: "40% 50%"
  });

  const fiches = html`
<section class="section">
  <div class="conteneur fiches">
    ${b.produits.map((p, i) => {
      const achat = p.achat.url
        ? `<a class="btn btn--or" href="${p.achat.url}"${ext(p.achat.url)}>${esc(p.achat.label)} ${icon.fleche}</a>`
        : `<a class="btn btn--or" href="${wa(site, p.achat.whatsapp)}"${ext("https:")}>${icon.whatsapp} ${esc(p.achat.label)} sur WhatsApp</a>`;
      return html`
    <article class="fiche${i % 2 ? " fiche--inverse" : ""}" id="${p.slug}">
      <figure class="fiche__img" data-reveal>${img(p.photo, { alt: `${p.type} « ${p.titre} »`, sizes: "(min-width: 900px) 40vw, 92vw" })}</figure>
      <div class="fiche__texte">
        <p class="surtitre">${esc(p.type)}</p>
        <h2 data-reveal>${esc(p.titre)}</h2>
        <p class="fiche__sous-titre">${esc(p.sousTitre)}</p>
        <p class="chapo" data-reveal>${esc(p.resume)}</p>
        <dl class="fiche__infos">
          <div><dt>Formats</dt><dd>${p.formats.map(esc).join(" · ")}</dd></div>
          ${p.avis ? `<div><dt>Avis</dt><dd>${esc(p.avis)}</dd></div>` : ""}
        </dl>
        <div class="fiche__achat">
          ${p.prix ? `<p class="fiche__prix">${esc(p.prix)}${p.prixBarre ? ` <s>${esc(p.prixBarre)}</s>` : ""}</p>` : ""}
          ${achat}
        </div>
        ${p.achat.url ? `<p class="fiche__note">Paiement sécurisé sur la boutique La Muse Éloquente.</p>` : ""}
      </div>
    </article>`;
    })}
  </div>
</section>`;

  const final = appelFinal(site, {
    titre: "Aller plus loin",
    texte: "L'ebook « Le secret d'une belle diction » est inclus dans les trois formules du programme Speak & Conquer.",
    cta: { label: "Découvrir Speak & Conquer", url: "/programmes/speak-and-conquer/" }
  });

  return [hero, fiches, final].join("\n");
};
