/* Page Événements : Deux Minutes Pour Convaincre + autres rendez-vous. */
const { esc, html, img, ext, icon } = require("../lib");
const { pageHero, enteteSection, appelFinal } = require("../components");

module.exports = function evenements({ site, evenements: ev, temoignages }) {
  const deuxMin = ev.liste.find((e) => e.slug === "deux-minutes-pour-convaincre");
  const autres = ev.liste.filter((e) => e !== deuxMin);
  const prochaine = deuxMin.editions.find((e) => e.aVenir);

  const hero = pageHero({
    ariane: "Événements",
    surtitre: "Faire vivre la parole",
    titre: ["Événements", "& initiatives"],
    texte: "Concours, masterclass, rencontres : des scènes pour révéler de nouvelles voix, au Bénin et au-delà.",
    photo: "2mpc-laureats",
    photoAlt: "Remise des prix de la 2ème édition de Deux Minutes Pour Convaincre",
    pos: "50% 40%",
    actions: `<a class="btn btn--or" href="#deux-minutes-pour-convaincre">Deux Minutes Pour Convaincre ${icon.fleche}</a>`
  });

  const concept = html`
<section class="section" id="deux-minutes-pour-convaincre">
  <div class="conteneur chapitre__grille">
    <div class="chapitre__texte">
      <p class="surtitre">Concours d'improvisation oratoire</p>
      <h2 data-reveal>${esc(deuxMin.titre)}</h2>
      <p class="chapo" data-reveal>Deux orateurs. Une même thématique, deux thèses opposées. Aucun texte préparé, et exactement 120 secondes chacun pour convaincre le jury et le public.</p>
      <p data-reveal>Étudiants, entrepreneurs, juristes, journalistes, passionnés de la langue française : chaque édition célèbre l'éloquence, la répartie et le débat d'idées, dans le respect et l'élégance.</p>
      <p class="chrono" aria-label="120 secondes"><span>02:00</span> pour convaincre</p>
      <a class="btn" href="${deuxMin.siteOfficiel}"${ext(deuxMin.siteOfficiel)}>Site officiel du concours ${icon.externe}</a>
    </div>
    <figure class="chapitre__photo" data-reveal>${img("2mpc-scene", { alt: "Un orateur sur la scène de Deux Minutes Pour Convaincre", sizes: "(min-width: 900px) 42vw, 92vw" })}</figure>
  </div>
</section>`;

  const editions = html`
<section class="section section--bleu">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Les éditions", titre: "Une scène qui grandit", or: true })}
    <ol class="frise">
      ${deuxMin.editions.map(
        (e) => html`<li class="${e.aVenir ? "frise--avenir" : ""}" data-reveal>
          <p class="frise__label">${esc(e.label)}</p>
          <p class="frise__date">${esc(e.dateAffichee)}</p>
          <p class="frise__lieu">${esc(e.lieu)}</p>
          ${e.aVenir ? `<span class="pastille">À venir</span>` : ""}
        </li>`
      )}
    </ol>
  </div>
</section>`;

  const galerie = html`
<section class="section">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Temps forts", titre: "En images" })}
    <div class="galerie">
      ${[
        ["2mpc-public", "Le public réuni à l'Azalaï Hôtel de Cotonou"],
        ["scene-promotrice", "Mazidath Bello prononce le mot de bienvenue"],
        ["attestation-ezechielle-bouet", "Ezéchielle Bouet, gagnante de la 1ère édition"],
        ["dedicace-livre", "Dédicace du livre de Mazidath Bello"],
        ["attestation-mireine-yahoungo", "Remise d'attestation à une oratrice de la 1ère édition"]
      ].map(([n, alt], i) => `<figure class="galerie__${i + 1}" data-reveal>${img(n, { alt, sizes: i === 0 ? "(min-width: 900px) 60vw, 92vw" : "(min-width: 900px) 30vw, 46vw" })}</figure>`)}
    </div>
  </div>
</section>`;

  const temoins = temoignages.liste.filter((t) => t.contexte === "evenement");
  const avis = html`
<section class="section section--creme">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Ils y étaient", titre: "Ce qu'ils en disent" })}
    <ul class="temoins" data-defile>
      ${temoins.map(
        (x) => html`<li class="temoin" data-reveal>
          <blockquote><p>${esc(x.texte)}</p></blockquote>
          <p class="temoin__auteur">${img(x.photo, { alt: "", sizes: "56px" })}<span><b>${esc(x.nom)}</b>${esc(x.fonction)}</span></p>
        </li>`
      )}
    </ul>
  </div>
</section>`;

  const rdv = html`
<section class="section">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Masterclass & rencontres", titre: "Les autres rendez-vous" })}
    ${autres.map(
      (e) => html`
    <article class="rdv" data-reveal>
      <div class="rdv__photos">
        ${e.photos.slice(0, 3).map((ph, i) => `<figure>${img(ph, { alt: i === 0 ? `Mazidath Bello pendant la masterclass « ${e.titre} »` : "Remise d'attestation de participation à la masterclass", sizes: "(min-width: 900px) 22vw, 46vw", pos: "50% 30%" })}</figure>`)}
      </div>
      <div class="rdv__texte">
        <p class="rdv__meta"><span class="pastille pastille--claire">${esc(e.type)}</span> ${esc(e.dateAffichee)} · ${esc(e.lieu)}</p>
        <h3>${esc(e.titre)}</h3>
        <p>${esc(e.resume)}</p>
        <a class="lien" href="/travailler-avec-moi/#masterclass">Organiser une masterclass ${icon.fleche}</a>
      </div>
    </article>`
    )}
  </div>
</section>`;

  const final = appelFinal(site, {
    titre: `Rendez-vous en ${prochaine ? prochaine.dateAffichee.toLowerCase() : "2027"}`,
    texte: "La 3ème édition de Deux Minutes Pour Convaincre se prépare à Cotonou. Candidats, partenaires, sponsors : suivez l'aventure.",
    cta: { label: "Suivre le concours", url: deuxMin.siteOfficiel },
    whatsapp: "Bonjour, je souhaite devenir partenaire de Deux Minutes Pour Convaincre."
  });

  return [hero, concept, editions, galerie, avis, rdv, final].join("\n");
};
