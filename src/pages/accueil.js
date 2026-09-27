/* Page d'accueil — architecture « La Scène » + aiguillage (validée). */
const { esc, html, img, wa, ext, icon, fil } = require("../lib");

module.exports = function accueil({ site, accueil: a, sac, boutique, temoignages }) {
  const h = a.hero;
  const titre = h.titre
    .map((l, i) => `<span class="ligne"><span style="--i:${i}"${i === h.titre.length - 1 ? ' class="texte-or"' : ""}>${esc(l)}</span></span>`)
    .join(" ");

  const hero = html`
<section class="hero">
  <div class="conteneur hero__grille">
    <div class="hero__texte">
      <p class="surtitre">${esc(h.surtitre)}</p>
      <h1 class="hero__titre">${titre}</h1>
      <p class="hero__intro">${esc(h.texte)}</p>
      <div class="actions">
        <a class="btn" href="${h.ctaPrincipal.url}">${esc(h.ctaPrincipal.label)} ${icon.fleche}</a>
        <a class="btn btn--ligne" href="${h.ctaSecondaire.url}">${esc(h.ctaSecondaire.label)}</a>
      </div>
    </div>
    <figure class="hero__portrait">
      <span class="hero__anneau" aria-hidden="true"></span>
      ${img(h.photo, { alt: h.photoAlt, sizes: "(min-width: 900px) 42vw, 86vw", eager: true })}
      <figcaption><b>${esc(site.fondatrice)}</b> Fondatrice de La Muse Éloquente</figcaption>
    </figure>
  </div>
  ${fil("a", "hero__fil")}
</section>`;

  const aiguillage = html`
<nav class="aiguillage conteneur" aria-labelledby="aiguillage-titre">
  <p class="aiguillage__titre" id="aiguillage-titre">${esc(a.aiguillage.titre)}</p>
  <ul>
    ${a.aiguillage.choix.map(
      (c) => html`<li><a href="${c.url}"><span><b>${esc(c.label)}</b><small>${esc(c.detail)}</small></span>${icon.fleche}</a></li>`
    )}
  </ul>
</nav>`;

  const preuves = html`
<section class="preuves" aria-label="Quelques repères">
  <div class="conteneur">
    <ul class="chiffres">
      ${site.chiffres.map((c) => html`<li data-reveal><strong>${esc(c.valeur)}</strong><span>${esc(c.libelle)}</span></li>`)}
    </ul>
    <div class="presse"><p>Ils en ont parlé</p><ul>${site.presse.map((p) => `<li>${esc(p)}</li>`)}</ul></div>
  </div>
</section>`;

  const m = a.muse;
  const muse = html`
<section class="section muse">
  <div class="conteneur muse__grille">
    <figure class="muse__photo" data-reveal>
      ${img(m.photo, { alt: m.photoAlt, sizes: "(min-width: 900px) 40vw, 92vw", pos: "72% 30%" })}
    </figure>
    <div class="muse__texte">
      <p class="surtitre">${esc(m.surtitre)}</p>
      <h2 data-reveal>${esc(m.titre)}</h2>
      ${m.paragraphes.map((p, i) => `<p${i === 0 ? ' class="chapo"' : ""} data-reveal>${esc(p)}</p>`)}
      <ol class="reperes">
        ${m.reperes.map((r) => html`<li data-reveal><time>${esc(r.annee)}</time><span>${esc(r.texte)}</span></li>`)}
      </ol>
      <a class="lien" href="${m.cta.url}">${esc(m.cta.label)} ${icon.fleche}</a>
    </div>
  </div>
</section>`;

  const u = a.univers;
  const univers = html`
<section class="section univers">
  <div class="conteneur">
    <div class="entete-section">
      <p class="surtitre">${esc(u.surtitre)}</p>
      <h2 data-reveal>${esc(u.titre)}</h2>
    </div>
    <ul class="univers__liste">
      ${u.liste.map(
        (x) => html`<li data-reveal><a class="univers__ligne" href="${x.url}">
          <span class="univers__vignette">${img(x.photo, { alt: "", sizes: "160px" })}</span>
          <span class="univers__verbe">${esc(x.verbe)}</span>
          <span class="univers__desc">${esc(x.texte)}</span>
          <span class="univers__fleche">${icon.fleche}</span>
        </a></li>`
      )}
    </ul>
  </div>
</section>`;

  const formules = sac.formules;
  const speak = html`
<section class="section section--bleu speak" id="speak-and-conquer">
  ${fil("b", "speak__fil")}
  <div class="conteneur">
    <div class="speak__tete">
      <div>
        <p class="surtitre surtitre--or">Programme d'accompagnement</p>
        <h2 class="speak__titre" data-reveal>Speak <span class="texte-or">&amp;</span> Conquer</h2>
      </div>
      <p class="speak__accroche" data-reveal>${esc(sac.sousAccroche)} ${esc(sac.description)}</p>
    </div>
    <ul class="formules-apercu" data-defile>
      ${formules.map(
        (f) => html`<li class="formule-carte" data-reveal>
          <p class="formule-carte__nom">${esc(f.nom)}</p>
          <p class="formule-carte__duree">${esc(f.duree)} · ${f.seances} séances de 60 min</p>
          <p class="formule-carte__prix">${esc(f.prixEur)}</p>
          <ul>${f.inclus.slice(0, 3).map((i) => `<li>${icon.check}<span>${esc(i)}</span></li>`)}</ul>
          <a class="btn btn--or btn--plein" href="/programmes/speak-and-conquer/#formule-${f.id}">Choisir ${esc(f.nom)}</a>
        </li>`
      )}
    </ul>
    <p class="speak__lien"><a class="lien lien--clair" href="/programmes/speak-and-conquer/">Tout savoir sur le programme ${icon.fleche}</a></p>
  </div>
</section>`;

  const citation = html`
<section class="section citation">
  <div class="conteneur citation__in">
    <p class="citation__guillemet" aria-hidden="true">«</p>
    <blockquote data-reveal><p>${esc(a.citation.texte)}</p></blockquote>
    <p class="citation__source">Mazidath Bello, <cite>${esc(a.citation.source)}</cite></p>
  </div>
  ${fil("c", "citation__fil")}
</section>`;

  const b = a.boutique;
  const shop = html`
<section class="section section--creme boutique-apercu">
  <div class="conteneur">
    <div class="entete-section entete-section--ligne">
      <div><p class="surtitre">${esc(b.surtitre)}</p><h2 data-reveal>${esc(b.titre)}</h2></div>
      <a class="lien" href="${b.cta.url}">${esc(b.cta.label)} ${icon.fleche}</a>
    </div>
    <ul class="produits" data-defile>
      ${boutique.produits.map(
        (p) => html`<li class="produit" data-reveal>
          <a href="/boutique/#${p.slug}">
            <span class="produit__img">${img(p.photo, { alt: `${p.type} ${p.titre}`, sizes: "(min-width: 900px) 30vw, 80vw" })}</span>
            <span class="produit__type">${esc(p.type)}</span>
            <span class="produit__titre">${esc(p.titre)}</span>
            <span class="produit__prix">${p.prix ? `${esc(p.prix)}${p.prixBarre ? ` <s>${esc(p.prixBarre)}</s>` : ""}` : "Papier et e-book"}</span>
          </a>
        </li>`
      )}
    </ul>
  </div>
</section>`;

  const e = a.evenement;
  const evenement = html`
<section class="section evenement">
  <div class="conteneur evenement__grille">
    <div class="evenement__photos">
      <figure class="ev-1" data-reveal>${img(e.photos[0], { alt: "Le public de Deux Minutes Pour Convaincre à l'Azalaï Hôtel de Cotonou", sizes: "(min-width: 900px) 34vw, 90vw" })}</figure>
      <figure class="ev-2" data-reveal>${img(e.photos[1], { alt: "Remise des prix aux lauréats de la 2ème édition", sizes: "(min-width: 900px) 22vw, 60vw" })}</figure>
    </div>
    <div class="evenement__texte">
      <p class="surtitre">${esc(e.surtitre)}</p>
      <h2 data-reveal>${esc(e.titre)}</h2>
      <p class="chapo" data-reveal>${esc(e.texte)}</p>
      <p class="chrono" aria-label="120 secondes"><span>02:00</span> pour convaincre</p>
      <ul class="editions">
        ${e.editions.map((x) => html`<li><b>${esc(x.label)}</b><span>${esc(x.date)} · ${esc(x.lieu)}</span></li>`)}
      </ul>
      <a class="btn btn--ligne" href="${e.cta.url}">${esc(e.cta.label)}</a>
    </div>
  </div>
</section>`;

  const t = a.temoignages;
  const temoins = html`
<section class="section section--creme temoignages">
  <div class="conteneur">
    <div class="entete-section">
      <p class="surtitre">${esc(t.surtitre)}</p>
      <h2 data-reveal>${esc(t.titre)}</h2>
    </div>
    <ul class="temoins" data-defile>
      ${temoignages.liste.map(
        (x) => html`<li class="temoin" data-reveal>
          <blockquote><p>${esc(x.texte)}</p></blockquote>
          <p class="temoin__auteur">${img(x.photo, { alt: "", sizes: "56px" })}<span><b>${esc(x.nom)}</b>${esc(x.fonction)}</span></p>
        </li>`
      )}
    </ul>
  </div>
</section>`;

  const reseaux = html`
<section class="section reseaux">
  <div class="conteneur">
    <div class="entete-section">
      <p class="surtitre">${esc(a.reseaux.surtitre)}</p>
      <h2 data-reveal>${esc(a.reseaux.titre)}</h2>
    </div>
    <ul class="reseaux__grille">
      ${site.reseaux.map(
        (r) => html`<li data-reveal><a href="${r.url}"${ext(r.url)}>
          <span class="reseaux__nom">${esc(r.nom)}</span>
          <span class="reseaux__compte">${esc(r.compte)}</span>
          <span class="reseaux__contenu">${esc(r.contenu)}</span>
          ${icon.externe}
        </a></li>`
      )}
    </ul>
  </div>
</section>`;

  const f = a.final;
  const final = html`
<section class="section section--bleu final">
  <div class="conteneur final__in">
    <h2 data-reveal>${esc(f.titre)}</h2>
    <p>${esc(f.texte)}</p>
    <div class="actions actions--centre">
      <a class="btn btn--or" href="${f.ctaPrincipal.url}">${esc(f.ctaPrincipal.label)} ${icon.fleche}</a>
      <a class="btn btn--ligne-claire" href="${wa(site, f.ctaSecondaire.whatsapp)}"${ext("https:")}>${icon.whatsapp} ${esc(f.ctaSecondaire.label)}</a>
    </div>
  </div>
</section>`;

  return [hero, aiguillage, preuves, muse, univers, speak, citation, shop, evenement, temoins, reseaux, final].join("\n");
};
