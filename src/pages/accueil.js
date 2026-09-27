/* Page d'accueil — version éditoriale : l'univers d'abord, puis les portes d'entrée. */
const { esc, html, img, wa, ext, icon, fil } = require("../lib");
const { riche, enteteSection, temoin } = require("../components");

module.exports = function accueil({ site, accueil: a, sac, temoignages }) {
  const h = a.hero;

  /* ---------- Hero : composition éditoriale ---------- */
  const hero = html`
<section class="hero">
  <div class="conteneur hero__grille">
    <div class="hero__texte">
      <p class="surtitre">${esc(h.surtitre)}</p>
      <h1 class="hero__titre">${riche(h.titre)}</h1>
      <p class="hero__intro">${esc(h.texte)}</p>
      <div class="actions">
        <a class="btn" href="${h.ctaPrincipal.url}">${esc(h.ctaPrincipal.label)} ${icon.fleche}</a>
        <a class="lien" href="${h.ctaSecondaire.url}">${esc(h.ctaSecondaire.label)}</a>
      </div>
    </div>
    <div class="hero__visuel">
      <figure class="hero__portrait photo">
        <span class="hero__cercle" aria-hidden="true"></span>
        ${img(h.photo, { alt: h.photoAlt, sizes: "(min-width: 900px) 40vw, 80vw", eager: true })}
      </figure>
      <p class="hero__legende">${esc(h.legende)}</p>
    </div>
  </div>
  ${fil("a", "hero__fil")}
</section>`;

  /* ---------- L'univers : quatre piliers ---------- */
  const id = a.identite;
  const identite = html`
<section class="section identite">
  <div class="conteneur identite__grille">
    <div class="identite__tete">
      <p class="surtitre">${esc(id.surtitre)}</p>
      <h2 data-reveal>${riche(id.titre)}</h2>
      <p class="chapo" data-reveal>${esc(id.texte)}</p>
    </div>
    <ul class="piliers">
      ${id.piliers.map((p) => html`<li data-reveal><h3 class="piliers__nom">${esc(p.nom)}</h3><p>${esc(p.texte)}</p></li>`)}
    </ul>
  </div>
</section>`;

  /* ---------- Repères (preuves) ---------- */
  const preuves = html`
<section class="section section--ivoire preuves">
  <div class="conteneur">
    ${enteteSection({ surtitre: a.preuves.surtitre, titre: a.preuves.titre })}
    <ul class="reperes-chiffres">
      ${site.chiffres.map((c) => html`<li data-reveal><strong data-compteur>${esc(c.valeur)}</strong><span>${esc(c.libelle)}</span></li>`)}
    </ul>
    <div class="presse"><p>Ils en ont parlé</p><ul>${site.presse.map((p) => `<li>${esc(p)}</li>`)}</ul></div>
  </div>
</section>`;

  /* ---------- L'écosystème ---------- */
  const u = a.univers;
  const univers = html`
<section class="section univers">
  <div class="conteneur">
    ${enteteSection({ surtitre: u.surtitre, titre: u.titre })}
    <ol class="univers__liste">
      ${u.liste.map(
        (x, i) => html`<li class="univers__item" data-reveal>
          <a class="univers__lien" href="${x.url}">
            <span class="index">${String(i + 1).padStart(2, "0")}</span>
            <span class="univers__nom">${esc(x.nom)}</span>
            <span class="univers__desc">${esc(x.texte)}</span>
            <span class="univers__cta">${esc(x.cta)} ${icon.fleche}</span>
            <span class="univers__vignette photo" aria-hidden="true">${img(x.photo, { alt: "", sizes: "(min-width: 900px) 220px, 96px" })}</span>
          </a>
        </li>`
      )}
    </ol>
  </div>
</section>`;

  /* ---------- Mazidath ---------- */
  const m = a.mazidath;
  const mazidath = html`
<section class="section section--creme mazidath">
  <div class="conteneur mazidath__grille">
    <figure class="mazidath__photo photo" data-reveal>${img(m.photo, { alt: m.photoAlt, sizes: "(min-width: 900px) 42vw, 92vw", pos: "55% 25%" })}</figure>
    <div class="mazidath__texte">
      <p class="surtitre">${esc(m.surtitre)}</p>
      <h2 data-reveal>${riche(m.titre)}</h2>
      <p class="chapo" data-reveal>${esc(m.texte)}</p>
      <a class="lien" href="${m.cta.url}">${esc(m.cta.label)} ${icon.fleche}</a>
    </div>
  </div>
</section>`;

  /* ---------- Speak & Conquer ---------- */
  const speak = html`
<section class="section section--bleu speak">
  ${fil("b", "speak__fil")}
  <div class="conteneur">
    <div class="speak__tete">
      <div>
        <p class="surtitre surtitre--or">Accompagnement individuel</p>
        <h2 data-reveal>Speak <em>&amp;</em> Conquer</h2>
      </div>
      <p class="speak__accroche" data-reveal>${esc(sac.description)}</p>
    </div>
    <ul class="offres" data-defile>
      ${sac.formules.map(
        (f) => html`<li class="offre" data-reveal>
          <p class="offre__nom">${esc(f.nom)}</p>
          <p class="offre__duree">${esc(f.duree)} · ${f.seances} séances</p>
          <p class="offre__prix">${esc(f.prixFcfa)}<small>${esc(f.prixEur)}</small></p>
          <p class="offre__public">${esc(f.public)}</p>
          <a class="lien lien--clair" href="/programmes/speak-and-conquer/#formule-${f.id}">Voir la formule ${icon.fleche}</a>
        </li>`
      )}
    </ul>
    <p class="speak__cta"><a class="btn btn--clair" href="/programmes/speak-and-conquer/">Choisir mon accompagnement ${icon.fleche}</a></p>
  </div>
</section>`;

  /* ---------- Le livre ---------- */
  const l = a.livre;
  const citationLivre = temoignages.liste.find((t) => t.vedetteLivre);
  const livre = html`
<section class="section livre">
  <div class="conteneur livre__grille">
    <div class="livre__texte">
      <p class="surtitre">${esc(l.surtitre)}</p>
      <h2 data-reveal>${riche(l.titre)}</h2>
      <p class="chapo" data-reveal>${esc(l.texte)}</p>
      ${citationLivre ? html`<blockquote class="citation-courte" data-reveal><p>${esc(citationLivre.texte)}</p><footer>${esc(citationLivre.nom)}, ${esc(citationLivre.fonction.replace(/ de « .* »$/, " du livre"))}</footer></blockquote>` : ""}
      <a class="btn" href="${l.cta.url}">${esc(l.cta.label)} ${icon.fleche}</a>
    </div>
    <figure class="livre__couverture photo" data-reveal>${img(l.photo, { alt: "Le livre Chroniques d'une voix qui s'est révélée, Tome 1", sizes: "(min-width: 900px) 40vw, 92vw" })}</figure>
  </div>
</section>`;

  /* ---------- Programmes signatures ---------- */
  const signatures = html`
<section class="section section--ivoire signatures">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Programmes signatures", titre: "Des scènes pour <em>révéler</em> de nouvelles voix." })}
    <div class="signatures__grille">
      <article class="signature" data-reveal>
        <figure class="signature__photo photo">${img("2mpc-public", { alt: "Le public de Deux Minutes Pour Convaincre à l'Azalaï Hôtel de Cotonou", sizes: "(min-width: 900px) 46vw, 92vw" })}</figure>
        <p class="index">Concours · Cotonou</p>
        <h3 class="signature__titre">Deux Minutes Pour Convaincre</h3>
        <p>Deux orateurs, une même thématique, deux thèses opposées. Aucun texte préparé, et 120 secondes chacun pour convaincre.</p>
        <p class="chrono"><span>02:00</span> 3ème édition en mars 2027</p>
        <a class="lien" href="/evenements/#deux-minutes-pour-convaincre">Découvrir l'édition ${icon.fleche}</a>
      </article>
      <article class="signature signature--voix" data-reveal>
        <p class="signature__nombre" aria-hidden="true">300</p>
        <p class="index">Initiative d'impact · 2027</p>
        <h3 class="signature__titre">300 Voix</h3>
        <p>Transmettre les outils de la prise de parole à 300 élèves et étudiants, directement dans leurs établissements : prendre la parole, argumenter, oser, improviser.</p>
        <a class="lien" href="/evenements/#300-voix">Découvrir 300 Voix ${icon.fleche}</a>
      </article>
    </div>
  </div>
</section>`;

  /* ---------- Témoignages ---------- */
  const vedette = temoignages.liste.find((t) => t.vedette);
  const choisir = (f) => temoignages.liste.find((t) => t !== vedette && f(t));
  const autres = [
    choisir((t) => t.vedetteProgramme),
    choisir((t) => t.categorie === "livre" && !t.vedetteLivre),
    choisir((t) => t.categorie === "partenaires")
  ].filter(Boolean);
  const temoins = html`
<section class="section temoignages">
  <div class="conteneur">
    ${enteteSection({ surtitre: a.temoignages.surtitre, titre: a.temoignages.titre })}
    <figure class="temoin-vedette" data-reveal>
      <blockquote><p>${esc(vedette.texte)}</p></blockquote>
      <figcaption>${img(vedette.photo, { alt: "", sizes: "72px" })}<span><b>${esc(vedette.nom)}</b>${esc(vedette.fonction)}</span></figcaption>
    </figure>
    <ul class="temoins" data-defile>${autres.map((x) => temoin(x, temoignages.categories))}</ul>
  </div>
</section>`;

  /* ---------- Réseaux ---------- */
  const reseaux = html`
<section class="section section--creme reseaux">
  <div class="conteneur reseaux__grille">
    <div>
      <p class="surtitre">${esc(a.reseaux.surtitre)}</p>
      <h2 data-reveal>${riche(a.reseaux.titre)}</h2>
      <p class="texte-doux">Coulisses, conseils, extraits de scène : plus de 70 000 personnes suivent La Muse Éloquente.</p>
    </div>
    <ul class="reseaux__liste">
      ${site.reseaux.map(
        (r) => html`<li><a href="${r.url}"${ext(r.url)}>
          <span class="reseaux__nom">${esc(r.nom)}</span>
          <span class="reseaux__compte">${esc(r.compte)}</span>
          ${icon.externe}
        </a></li>`
      )}
    </ul>
  </div>
</section>`;

  /* ---------- Appel final ---------- */
  const f = a.final;
  const final = html`
<section class="section section--bleu final">
  ${fil("c", "final__fil")}
  <div class="conteneur final__in">
    <h2 data-reveal>${riche(f.titre)}</h2>
    <p>${esc(f.texte)}</p>
    <div class="actions actions--centre">
      <a class="btn btn--clair" href="${f.ctaPrincipal.url}">${esc(f.ctaPrincipal.label)} ${icon.fleche}</a>
      <a class="btn btn--ligne-claire" href="${wa(site, f.ctaSecondaire.whatsapp)}"${ext("https:")}>${icon.whatsapp} ${esc(f.ctaSecondaire.label)}</a>
    </div>
  </div>
</section>`;

  return [hero, identite, preuves, univers, mazidath, speak, livre, signatures, temoins, reseaux, final].join("\n");
};
