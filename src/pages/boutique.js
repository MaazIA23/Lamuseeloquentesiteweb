/* Page Boutique : boutique éditoriale, classée par catégorie. Contenu : content/boutique.json */
const { esc, html, img, wa, ext, icon } = require("../lib");
const { pageHero, appelFinal } = require("../components");

module.exports = function boutique({ site, boutique: b }) {
  const hero = pageHero({
    ariane: "Boutique",
    surtitre: "Lire, s'entraîner, progresser",
    titre: "La <em>boutique</em>",
    texte: "Un livre pour comprendre comment une voix se révèle, des outils pour s'entraîner à son rythme.",
    photo: "livre-chroniques",
    photoAlt: "Le livre Chroniques d'une voix qui s'est révélée",
    pos: "40% 50%"
  });

  const bouton = (p) =>
    p.achat.url
      ? `<a class="btn" href="${p.achat.url}"${ext(p.achat.url)}>${esc(p.achat.label)} ${icon.fleche}</a>`
      : `<a class="btn" href="${wa(site, p.achat.whatsapp)}"${ext("https:")}>${icon.whatsapp} ${esc(p.achat.label)}</a>`;

  const fiche = (p, i) => html`
    <article class="fiche${i % 2 ? " fiche--inverse" : ""}${p.categorie === "livres" ? " fiche--livre" : ""}" id="${p.slug}">
      <figure class="fiche__img photo" data-reveal>${img(p.photo, { alt: `${p.type} « ${p.titre} »`, sizes: "(min-width: 900px) 40vw, 92vw" })}</figure>
      <div class="fiche__texte">
        <p class="surtitre">${esc(p.type)}</p>
        <h2 data-reveal>${esc(p.titre)}</h2>
        <p class="fiche__sous-titre">${esc(p.sousTitre)}</p>
        ${p.accroche ? `<p class="fiche__accroche" data-reveal>${esc(p.accroche)}</p>` : ""}
        <p class="chapo" data-reveal>${esc(p.resume)}</p>
        ${p.decouvrir ? `<div class="fiche__bloc"><p class="fiche__label">Ce que vous allez découvrir</p><ul class="fiche__liste">${p.decouvrir.map((d) => `<li>${icon.check}<span>${esc(d)}</span></li>`).join("")}</ul></div>` : ""}
        <dl class="fiche__infos">
          ${p.pourQui ? `<div><dt>Pour qui</dt><dd>${esc(p.pourQui)}</dd></div>` : ""}
          <div><dt>Formats</dt><dd>${p.formats.map(esc).join(" · ")}</dd></div>
          ${p.avis ? `<div><dt>Avis</dt><dd>${esc(p.avis)}</dd></div>` : ""}
        </dl>
        <div class="fiche__achat">
          ${p.prix ? `<p class="fiche__prix">${esc(p.prix)}${p.prixBarre ? ` <s>${esc(p.prixBarre)}</s>` : ""}</p>` : ""}
          ${bouton(p)}
        </div>
        ${p.achat.url ? `<p class="fiche__note">Paiement sécurisé sur la boutique La Muse Éloquente.</p>` : ""}
      </div>
    </article>`;

  let n = 0;
  const rayons = b.categories
    .map((c, ci) => {
      const produits = b.produits.filter((p) => p.categorie === c.id);
      if (!produits.length) return "";
      return html`
<section class="section rayon${ci % 2 ? " section--ivoire" : ""}" id="${c.id}">
  <div class="conteneur">
    <p class="rayon__titre"><span class="index">${String(ci + 1).padStart(2, "0")}</span> ${esc(c.nom)}</p>
    <div class="fiches">${produits.map((p) => fiche(p, n++))}</div>
  </div>
</section>`;
    })
    .join("\n");

  const final = appelFinal(site, {
    titre: "Aller plus <em>loin</em>.",
    texte: "L'ebook « Le secret d'une belle diction » est inclus dans les trois formules de Speak & Conquer.",
    cta: { label: "Choisir mon accompagnement", url: "/programmes/speak-and-conquer/" }
  });

  return [hero, rayons, final].join("\n");
};
