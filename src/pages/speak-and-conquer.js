/* Page programme : Speak & Conquer. Tout le contenu vient de content/programmes/speak-and-conquer.json */
const { esc, html, img, wa, ext, icon, fil } = require("../lib");

const cellule = (v) =>
  v === true ? `<span class="oui">${icon.check}<span class="sr">Inclus</span></span>` :
  v === false ? `<span class="non">${icon.tiret}<span class="sr">Non inclus</span></span>` : esc(v);

module.exports = function speakAndConquer({ site, sac: p }) {
  const hero = html`
<section class="section section--bleu page-hero">
  ${fil("b", "page-hero__fil")}
  <div class="conteneur page-hero__grille">
    <div class="page-hero__texte">
      <nav class="fil-ariane" aria-label="Fil d'Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><span>Programmes</span></nav>
      <p class="surtitre surtitre--or">Programme d'accompagnement</p>
      <h1 class="page-hero__titre">Speak <span class="texte-or">&amp;</span> Conquer</h1>
      <p class="page-hero__intro"><b>${esc(p.sousAccroche)}</b> ${esc(p.description)}</p>
      <div class="actions">
        <a class="btn btn--or" href="#formules">Voir les formules ${icon.fleche}</a>
        <a class="btn btn--ligne-claire" href="${wa(site, "Bonjour Mazidath, j'ai une question sur le programme Speak & Conquer.")}"${ext("https:")}>${icon.whatsapp} Poser une question</a>
      </div>
    </div>
    <figure class="page-hero__photo">
      ${img(p.photo, { alt: "Portrait de Mazidath Bello, fondatrice de La Muse Éloquente", sizes: "(min-width: 900px) 34vw, 80vw", eager: true })}
    </figure>
  </div>
  <ul class="conteneur faits">
    <li><strong>3</strong><span>formules</span></li>
    <li><strong>60 min</strong><span>par séance individuelle</span></li>
    <li><strong>3 à 8</strong><span>semaines d'accompagnement</span></li>
    <li><strong>1</strong><span>communauté privée</span></li>
  </ul>
</section>`;

  const pourQui = html`
<section class="section">
  <div class="conteneur">
    <div class="entete-section">
      <p class="surtitre">Pour qui ?</p>
      <h2 data-reveal>Un programme pour chaque étape de votre parcours</h2>
    </div>
    <ul class="trio">
      ${p.pourQui.map((x) => html`<li data-reveal><h3>${esc(x.titre)}</h3><p>${esc(x.texte)}</p></li>`)}
    </ul>
  </div>
</section>`;

  const competences = html`
<section class="section section--creme">
  <div class="conteneur competences">
    <div class="competences__tete">
      <p class="surtitre">Objectifs</p>
      <h2 data-reveal>Ce que vous allez maîtriser</h2>
      <figure data-reveal>${img("attestation-tristan-kounde", { alt: "Mazidath Bello remet une attestation à Tristan Kounde devant le roll-up Speak & Conquer", sizes: "(min-width: 900px) 30vw, 90vw", pos: "50% 25%" })}</figure>
    </div>
    <ul class="competences__liste">
      ${p.competences.map((c) => html`<li data-reveal>${icon.check}<span>${esc(c)}</span></li>`)}
    </ul>
  </div>
</section>`;

  const deroule = html`
<section class="section">
  <div class="conteneur">
    <div class="entete-section">
      <p class="surtitre">Déroulé</p>
      <h2 data-reveal>Comment se passe l'accompagnement</h2>
    </div>
    <ol class="etapes">
      ${p.etapes.map((e, i) => html`<li data-reveal><span class="etapes__num">${String(i + 1).padStart(2, "0")}</span><h3>${esc(e.titre)}</h3><p>${esc(e.texte)}</p></li>`)}
    </ol>
  </div>
</section>`;

  const formules = html`
<section class="section section--bleu formules" id="formules">
  <div class="conteneur">
    <div class="entete-section entete-section--centre">
      <p class="surtitre surtitre--or">Formules et tarifs</p>
      <h2 data-reveal>Choisissez votre formule</h2>
      <p>Paiement en ligne sécurisé sur la boutique La Muse Éloquente. Après votre achat, je vous contacte pour planifier vos séances.</p>
    </div>
    <ul class="formules-detail" data-defile>
      ${p.formules.map(
        (f) => html`<li class="formule${f.miseEnAvant ? " formule--avant" : ""}" id="formule-${f.id}" data-reveal>
          <div class="formule__tete">
            <p class="formule__nom">${esc(f.nom)}</p>
            <p class="formule__duree">${esc(f.duree)} · ${f.seances} séances</p>
            <p class="formule__prix">${esc(f.prixEur)}</p>
            <p class="formule__public">${esc(f.public)}</p>
          </div>
          <div class="formule__corps">
            <p class="formule__label">Inclus</p>
            <ul>${f.inclus.map((i) => `<li>${icon.check}<span>${esc(i)}</span></li>`)}</ul>
            <details>
              <summary>Ce que vous allez travailler ${icon.plus}</summary>
              <ul class="formule__maitrise">${f.maitrise.map((i) => `<li>${esc(i)}</li>`)}</ul>
            </details>
          </div>
          <a class="btn btn--or btn--plein" href="${f.paiement.url}"${ext(f.paiement.url)} data-offre="${f.id}">Réserver la formule ${esc(f.nom)}</a>
        </li>`
      )}
    </ul>

    <div class="comparatif" data-reveal>
      <table>
        <caption>Comparer les formules</caption>
        <thead><tr><th scope="col"><span class="sr">Critère</span></th>${p.formules.map((f) => `<th scope="col">${esc(f.nom)}</th>`)}</tr></thead>
        <tbody>
          ${p.comparatif.map((r) => html`<tr><th scope="row">${esc(r.ligne)}</th><td>${cellule(r.etudiant)}</td><td>${cellule(r.standard)}</td><td>${cellule(r.prestige)}</td></tr>`)}
          <tr class="comparatif__prix"><th scope="row">Tarif</th>${p.formules.map((f) => `<td>${esc(f.prixEur)}</td>`)}</tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`;

  const reservation = html`
<section class="section">
  <div class="conteneur">
    <div class="entete-section">
      <p class="surtitre">Réservation</p>
      <h2 data-reveal>Trois étapes pour commencer</h2>
    </div>
    <ol class="etapes etapes--trois">
      <li data-reveal><span class="etapes__num">01</span><h3>Choisissez votre formule</h3><p>Étudiant, Standard ou Prestige, selon votre objectif et votre échéance.</p></li>
      <li data-reveal><span class="etapes__num">02</span><h3>Réglez en ligne</h3><p>Le paiement se fait sur la boutique sécurisée de La Muse Éloquente.</p></li>
      <li data-reveal><span class="etapes__num">03</span><h3>Planifions vos séances</h3><p>Je vous contacte après votre achat pour fixer vos rendez-vous.</p></li>
    </ol>
  </div>
</section>`;

  const faq = html`
<section class="section section--creme">
  <div class="conteneur faq">
    <div class="entete-section">
      <p class="surtitre">Questions fréquentes</p>
      <h2 data-reveal>Vous vous demandez peut-être…</h2>
    </div>
    <div class="faq__liste">
      ${p.faq.map((q) => html`<details class="faq__item"><summary>${esc(q.q)} ${icon.plus}</summary><p>${esc(q.r)}</p></details>`)}
    </div>
  </div>
</section>`;

  const final = html`
<section class="section section--bleu final">
  <div class="conteneur final__in">
    <h2 data-reveal>Prête, prêt à prendre la parole ?</h2>
    <p>Une hésitation sur la formule ? Écrivez-moi, je vous oriente.</p>
    <div class="actions actions--centre">
      <a class="btn btn--or" href="#formules">Choisir ma formule ${icon.fleche}</a>
      <a class="btn btn--ligne-claire" href="${wa(site, "Bonjour Mazidath, j'hésite entre les formules Speak & Conquer.")}"${ext("https:")}>${icon.whatsapp} Écrire sur WhatsApp</a>
    </div>
  </div>
</section>`;

  return [hero, pourQui, competences, deroule, formules, reservation, faq, final].join("\n");
};
