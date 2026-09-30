/* Page À propos : récit « De l'ombre à la scène », en chapitres. */
const { esc, html, img, icon } = require("../lib");
const { riche, pageHero, appelFinal } = require("../components");

module.exports = function aPropos({ site, apropos: p, boutique }) {
  const hero = pageHero({ ariane: "À propos", ...p.hero, pos: "50% 18%" });

  const sommaire = html`
<nav class="sommaire" aria-label="Chapitres">
  <ol class="conteneur">
    ${p.chapitres.map((c, i) => `<li><a href="#${c.id}"><span class="index">${String(i + 1).padStart(2, "0")}</span> ${esc(c.surtitre)}</a></li>`)}
    <li><a href="#aujourdhui"><span class="index">${String(p.chapitres.length + 1).padStart(2, "0")}</span> Aujourd'hui</a></li>
  </ol>
</nav>`;

  const chapitres = p.chapitres
    .map(
      (c, i) => html`
<section class="section chapitre${i % 2 ? " chapitre--inverse" : ""}" id="${c.id}">
  <div class="conteneur chapitre__grille">
    <figure class="chapitre__photo photo" data-reveal>${img(c.photo, { alt: c.photoAlt, sizes: "(min-width: 900px) 40vw, 92vw", pos: c.photoPos || "50% 25%" })}</figure>
    <div class="chapitre__texte">
      <p class="surtitre surtitre--nu"><span class="index">${String(i + 1).padStart(2, "0")}</span>${esc(c.surtitre)}</p>
      <h2 data-reveal>${riche(c.titre)}</h2>
      ${c.paragraphes.map((t, j) => `<p${j === 0 ? ' class="chapo"' : ""} data-reveal>${esc(t)}</p>`)}
      ${c.lien && c.lien.url ? `<a class="lien" href="${c.lien.url}" target="_blank" rel="noopener">${esc(c.lien.label)} ${icon.externe}</a>` : ""}
      ${c.citation ? html`<blockquote class="chapitre__citation" data-reveal><p>${esc(c.citation.texte)}</p><footer>${esc(c.citation.auteur)}</footer></blockquote>` : ""}
    </div>
  </div>
</section>`
    )
    .join("\n");

  const v = p.convictions;
  const convictions = html`
<section class="section section--bleu convictions" id="convictions">
  <div class="conteneur">
    <div class="entete-section">
      <p class="surtitre surtitre--or">${esc(v.surtitre)}</p>
      <h2 data-reveal>${esc(v.titre)}</h2>
    </div>
    <ul class="valeurs">
      ${v.valeurs.map((x) => html`<li data-reveal><h3>${esc(x.nom)}</h3><ul>${x.points.map((pt) => `<li>${esc(pt)}</li>`)}</ul></li>`)}
    </ul>
  </div>
</section>`;

  const bibliographie = html`
<section class="section section--creme" id="bibliographie">
  <div class="conteneur">
    <div class="entete-section entete-section--ligne">
      <div><p class="surtitre">Bibliographie</p><h2 data-reveal>Écrire la parole.</h2></div>
      <a class="lien" href="/boutique/">Voir la boutique ${icon.fleche}</a>
    </div>
    <ul class="biblio">
      ${boutique.produits.map(
        (b) => html`<li data-reveal><a href="/boutique/#${b.slug}">
          <span class="biblio__img photo">${img(b.photo, { alt: `Couverture de « ${b.titre} »`, sizes: "(min-width: 900px) 28vw, 80vw" })}</span>
          <span class="biblio__type">${esc(b.type)} · ${esc(b.formats.join(", "))}</span>
          <span class="biblio__titre">${esc(b.titre)}</span>
          <span class="biblio__sous-titre">${esc(b.sousTitre)}</span>
        </a></li>`
      )}
    </ul>
  </div>
</section>`;

  const a = p.aujourdhui;
  const aujourdhui = html`
<section class="section" id="aujourdhui">
  <div class="conteneur chapitre__grille">
    <div class="chapitre__texte">
      <p class="surtitre surtitre--nu"><span class="index">${String(p.chapitres.length + 1).padStart(2, "0")}</span>${esc(a.surtitre)}</p>
      <h2 data-reveal>${esc(a.titre)}</h2>
      <p class="chapo" data-reveal>${esc(a.texte)}</p>
      <dl class="mission" data-reveal>
        <div><dt>Mission</dt><dd>${esc(a.mission)}</dd></div>
        <div><dt>Vision</dt><dd>${esc(a.vision)}</dd></div>
        <div><dt>${esc(p.formation.titre)}</dt><dd>${esc(p.formation.texte)}</dd></div>
      </dl>
      <div class="actions">
        <a class="btn" href="/travailler-avec-moi/">Travailler avec Mazidath ${icon.fleche}</a>
        <a class="lien" href="/programmes/speak-and-conquer/">Choisir mon accompagnement</a>
      </div>
    </div>
    <figure class="chapitre__photo photo" data-reveal>${img(a.photo, { alt: a.photoAlt, sizes: "(min-width: 900px) 40vw, 92vw" })}</figure>
  </div>
</section>`;

  const final = appelFinal(site, {
    titre: "Et votre <em>voix</em> ?",
    texte: "Que vous prépariez une soutenance, une prise de poste ou un grand événement, parlons-en.",
    cta: { label: "Parler de mon projet", url: "/travailler-avec-moi/#devis" },
    whatsapp: "Bonjour Mazidath, j'ai lu votre parcours et j'aimerais échanger avec vous."
  });

  return [hero, sommaire, chapitres, aujourdhui, convictions, bibliographie, final].join("\n");
};
