/* Page Événements : l'écosystème La Muse Éloquente → Deux Minutes Pour Convaincre, 300 Voix, masterclass. */
const { esc, html, img, ext, icon } = require("../lib");
const { pageHero, enteteSection, appelFinal, temoin } = require("../components");

module.exports = function evenements({ site, evenements: ev, temoignages }) {
  const deuxMin = ev.liste.find((e) => e.slug === "deux-minutes-pour-convaincre");
  const voix = ev.liste.find((e) => e.slug === "300-voix");
  const autres = ev.liste.filter((e) => e.type === "masterclass");

  const hero = pageHero({
    ariane: "Événements",
    surtitre: "L'écosystème La Muse Éloquente",
    titre: "Des scènes pour <em>révéler</em> de nouvelles voix",
    texte: "Concours, programme d'impact, masterclass : les initiatives de La Muse Éloquente font de la parole un levier d'influence, de leadership et d'opportunités, au Bénin et au-delà.",
    photo: "2mpc-laureats",
    photoAlt: "Remise des prix de la 2ème édition de Deux Minutes Pour Convaincre",
    pos: "50% 40%",
    actions: `<a class="btn" href="#deux-minutes-pour-convaincre">Découvrir l'édition ${icon.fleche}</a><a class="lien" href="#300-voix">300 Voix</a>`
  });

  const arbre = html`
<nav class="ecosysteme conteneur" aria-label="Écosystème">
  <p class="ecosysteme__racine">La Muse Éloquente</p>
  <ul>
    <li><a href="#deux-minutes-pour-convaincre">Deux Minutes Pour Convaincre<small>Programme signature</small></a></li>
    <li><a href="#300-voix">300 Voix<small>Initiative d'impact</small></a></li>
    <li><a href="#masterclass">Masterclass<small>Transmission</small></a></li>
  </ul>
</nav>`;

  const concept = html`
<section class="section" id="deux-minutes-pour-convaincre">
  <div class="conteneur chapitre__grille">
    <div class="chapitre__texte">
      <p class="surtitre">Programme signature · Concours d'improvisation oratoire</p>
      <h2 data-reveal>${esc(deuxMin.titre)}</h2>
      <p class="chapo" data-reveal>Deux orateurs. Une même thématique, deux thèses opposées. Aucun texte préparé, et exactement 120 secondes chacun pour convaincre le jury et le public.</p>
      <p data-reveal>Étudiants, entrepreneurs, juristes, journalistes, passionnés de la langue française : chaque édition célèbre l'éloquence, la répartie et le débat d'idées, dans le respect et l'élégance.</p>
      <p class="chrono"><span>02:00</span> pour convaincre</p>
      <a class="lien" href="${deuxMin.siteOfficiel}"${ext(deuxMin.siteOfficiel)}>Site officiel du concours ${icon.externe}</a>
    </div>
    <figure class="chapitre__photo photo" data-reveal>${img("2mpc-scene", { alt: "Un orateur sur la scène de Deux Minutes Pour Convaincre", sizes: "(min-width: 900px) 40vw, 92vw" })}</figure>
  </div>
</section>`;

  const resultats = html`
<section class="section section--ivoire">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Deux éditions", titre: "Une scène qui <em>grandit</em>." })}
    <ul class="reperes-chiffres reperes-chiffres--quatre">
      ${deuxMin.resultats.map((c) => html`<li data-reveal><strong>${esc(c.valeur)}</strong><span>${esc(c.libelle)}</span></li>`)}
    </ul>
    <ol class="frise">
      ${deuxMin.editions.map(
        (e) => html`<li class="${e.aVenir ? "frise--avenir" : ""}" data-reveal>
          <p class="frise__label">${esc(e.label)}</p>
          <p class="frise__date">${esc(e.dateAffichee)}</p>
          <p class="frise__lieu">${esc(e.lieu)}</p>
          ${e.aVenir ? `<ul class="frise__points">${deuxMin.edition2027.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>` : ""}
        </li>`
      )}
    </ol>
  </div>
</section>`;

  const laureats = html`
<section class="section">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Palmarès", titre: "Les voix <em>révélées</em>.", texte: deuxMin.leadershipFeminin })}
    <ul class="laureats" data-defile>
      ${deuxMin.laureats.map(
        (l) => html`<li data-reveal>
          <figure class="photo">${img(l.photo, { alt: `${l.nom}, ${l.titre}`, sizes: "(min-width: 900px) 20vw, 60vw", pos: "50% 25%" })}</figure>
          <p class="laureats__titre">${esc(l.titre)}</p>
          <p class="laureats__nom">${esc(l.nom)}</p>
          <p class="laureats__edition">${esc(l.edition)}</p>
        </li>`
      )}
    </ul>
  </div>
</section>`;

  const galerie = html`
<section class="section section--creme">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Temps forts", titre: "En images." })}
    <div class="galerie">
      ${[
        ["2mpc-public", "Le public réuni à l'Azalaï Hôtel de Cotonou"],
        ["scene-promotrice", "Mazidath Bello prononce le mot de bienvenue"],
        ["attestation-ezechielle-bouet", "Ezéchielle Bouet, gagnante de la 1ère édition"],
        ["dedicace-livre", "Dédicace du livre de Mazidath Bello"],
        ["attestation-mireine-yahoungo", "Remise d'attestation à une oratrice de la 1ère édition"]
      ].map(([n, alt], i) => `<figure class="galerie__${i + 1} photo" data-reveal>${img(n, { alt, sizes: i === 0 ? "(min-width: 900px) 60vw, 92vw" : "(min-width: 900px) 30vw, 46vw" })}</figure>`)}
    </div>
  </div>
</section>`;

  const partenaires = html`
<section class="section section--ivoire">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Partenaires", titre: "Une aventure <em>collective</em>.", texte: "Une vingtaine de partenaires ont accompagné la 2ème édition." })}
    <ul class="logos">
      ${deuxMin.partenaires.map(([nom, f]) => `<li><img src="/assets/partenaires/${f}.webp" alt="${esc(nom)}" loading="lazy" decoding="async"></li>`)}
    </ul>
  </div>
</section>`;

  const avis = html`
<section class="section">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Ils y étaient", titre: "Ce qu'ils en disent." })}
    <ul class="temoins" data-defile>${temoignages.liste.filter((t) => ["participants", "partenaires", "evenements"].includes(t.categorie)).slice(0, 6).map((x) => temoin(x, temoignages.categories))}</ul>
  </div>
</section>`;

  const trois = html`
<section class="section section--bleu voix" id="300-voix">
  <div class="conteneur voix__grille">
    <div class="voix__texte">
      <p class="surtitre surtitre--or">Initiative d'impact · 2027</p>
      <h2 data-reveal>${esc(voix.titre)}</h2>
      <p class="voix__accroche" data-reveal>${esc(voix.accroche)}</p>
      <p data-reveal>${esc(voix.resume)}</p>
      <ul class="voix__piliers">
        ${voix.transmission.map((t) => html`<li data-reveal><h3>${esc(t.titre)}</h3><p>${esc(t.texte)}</p></li>`)}
      </ul>
      <div class="actions">
        <a class="btn btn--clair" href="/travailler-avec-moi/#devis">Accueillir une session ${icon.fleche}</a>
        <a class="lien lien--clair" href="/travailler-avec-moi/#devis">Soutenir le programme</a>
      </div>
    </div>
    <div class="voix__visuel">
      <p class="voix__nombre" aria-hidden="true">300</p>
      <ul class="voix__lignes">${voix.lignes.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
      <figure class="voix__photo photo" data-reveal>${img(voix.photo, { alt: "Une participante prend la parole lors d'une masterclass de La Muse Éloquente", sizes: "(min-width: 900px) 34vw, 92vw", pos: "50% 30%" })}</figure>
    </div>
  </div>
</section>`;

  const rdv = html`
<section class="section" id="masterclass">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Transmission", titre: "Masterclass." })}
    ${autres.map(
      (e) => html`
    <article class="rdv" data-reveal>
      <div class="rdv__photos">
        ${e.photos.slice(0, 3).map((ph, i) => `<figure class="photo">${img(ph, { alt: i === 0 ? `Mazidath Bello pendant la masterclass « ${e.titre} »` : "Remise d'attestation de participation à la masterclass", sizes: "(min-width: 900px) 22vw, 46vw", pos: "50% 30%" })}</figure>`)}
      </div>
      <div class="rdv__texte">
        <p class="rdv__meta"><span class="pastille">Masterclass</span> ${esc(e.dateAffichee)} · ${esc(e.lieu)}</p>
        <h3>${esc(e.titre)}</h3>
        <p>${esc(e.resume)}</p>
        <a class="lien" href="/travailler-avec-moi/#masterclass">Organiser une masterclass ${icon.fleche}</a>
      </div>
    </article>`
    )}
  </div>
</section>`;

  const final = appelFinal(site, {
    titre: "Rendez-vous en <em>mars 2027</em>.",
    texte: "La 3ème édition de Deux Minutes Pour Convaincre se prépare à Cotonou. Candidats, partenaires, établissements : rejoignez l'aventure.",
    cta: { label: "Découvrir l'édition", url: deuxMin.siteOfficiel },
    whatsapp: "Bonjour, je souhaite devenir partenaire de Deux Minutes Pour Convaincre."
  });

  return [hero, arbre, concept, resultats, laureats, galerie, partenaires, avis, trois, rdv, final].join("\n");
};
