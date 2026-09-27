/* Page Accompagnements : Speak & Conquer. Contenu : content/programmes/speak-and-conquer.json */
const { esc, html, img, wa, ext, icon } = require("../lib");
const { pageHero, enteteSection, appelFinal, temoin } = require("../components");

const cellule = (v) =>
  v === true ? `<span class="oui">${icon.check}<span class="sr">Inclus</span></span>` :
  v === false ? `<span class="non">${icon.tiret}<span class="sr">Non inclus</span></span>` : esc(v);

module.exports = function speakAndConquer({ site, sac: p, temoignages }) {
  // FedaPay (FCFA, Mobile Money et cartes) dès qu'une clé publique est renseignée dans content/site.json ;
  // Chariow reste le moyen de paiement international, et le seul tant que la clé est vide.
  const cle = site.paiement && site.paiement.fedapay.clePublique;
  const bouton = (f) =>
    cle
      ? html`<div class="formule__payer">
          <button class="btn btn--plein" type="button" data-fedapay data-montant="${f.prixNum}" data-description="Speak &amp; Conquer · Formule ${esc(f.nom)}">Payer ${esc(f.prixFcfa)} ${icon.fleche}</button>
          <p class="formule__moyens">Mobile Money (MTN, Moov, Celtiis) ou carte bancaire</p>
          <a class="lien" href="${f.paiement.url}"${ext(f.paiement.url)}>${esc(site.paiement.international.libelle)}</a>
        </div>`
      : `<a class="btn btn--plein" href="${f.paiement.url}"${ext(f.paiement.url)} data-offre="${f.id}">Choisir la formule ${esc(f.nom)} ${icon.fleche}</a>`;
  const scriptFedapay = cle
    ? html`<script src="https://cdn.fedapay.com/checkout.js?v=1.1.7"></script>
<script>
document.querySelectorAll("[data-fedapay]").forEach(function (b) {
  FedaPay.init(b, {
    public_key: ${JSON.stringify(cle)},
    environment: ${JSON.stringify(site.paiement.fedapay.environnement)},
    transaction: { amount: +b.dataset.montant, description: b.dataset.description },
    currency: { iso: "XOF" },
    onComplete: function (r) { if (r.reason === FedaPay.CHECKOUT_COMPLETED) location.href = "/merci-paiement/"; }
  });
});
</script>`
    : "";
  const texteReglement = cle
    ? "En FCFA par Mobile Money ou carte via FedaPay, ou depuis l'international par carte."
    : "Le paiement se fait sur la boutique sécurisée de La Muse Éloquente.";
  const hero = pageHero({
    ariane: "Accompagnements",
    surtitre: "Accompagnement individuel",
    titre: "Speak <em>&</em> Conquer",
    texte: `${p.sousAccroche} ${p.description}`,
    photo: p.photo,
    photoAlt: "Portrait de Mazidath Bello, fondatrice de La Muse Éloquente",
    pos: "50% 12%",
    actions: `<a class="btn" href="#formules">Choisir mon accompagnement ${icon.fleche}</a><a class="lien" href="${wa(site, "Bonjour Mazidath, j'ai une question sur Speak & Conquer.")}"${ext("https:")}>Poser une question</a>`
  });

  const faits = html`
<section class="faits-bande">
  <ul class="conteneur faits">
    <li><strong>3</strong><span>formules, de 3 à 8 semaines</span></li>
    <li><strong>60 min</strong><span>par séance individuelle</span></li>
    <li><strong>50 000</strong><span>FCFA, première formule</span></li>
    <li><strong>1</strong><span>communauté privée</span></li>
  </ul>
</section>`;

  const transformation = html`
<section class="section">
  <div class="conteneur">
    ${enteteSection({ surtitre: "La transformation", titre: "Ce qui change, <em>concrètement</em>." })}
    <ul class="avant-apres">
      ${p.avantApres.map(
        (x) => html`<li data-reveal>
          <p class="avant-apres__avant"><span>Avant</span>« ${esc(x.avant)} »</p>
          <span class="avant-apres__fleche" aria-hidden="true">${icon.fleche}</span>
          <p class="avant-apres__apres"><span>Après</span>« ${esc(x.apres)} »</p>
        </li>`
      )}
    </ul>
  </div>
</section>`;

  const pourQui = html`
<section class="section section--ivoire">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Pour qui ?", titre: "Un accompagnement pour chaque étape de votre parcours." })}
    <ul class="trio">
      ${p.pourQui.map((x, i) => html`<li data-reveal><span class="index">${String(i + 1).padStart(2, "0")}</span><h3>${esc(x.titre)}</h3><p>${esc(x.texte)}</p></li>`)}
    </ul>
  </div>
</section>`;

  const methode = html`
<section class="section">
  <div class="conteneur methode">
    <div class="methode__tete">
      <p class="surtitre">Méthode</p>
      <h2 data-reveal>${esc(p.methode.titre)}</h2>
      <p class="texte-doux">${esc(p.methode.texte)}</p>
      <figure class="methode__photo photo" data-reveal>${img("attestation-tristan-kounde", { alt: "Mazidath Bello remet une attestation devant le roll-up Speak & Conquer", sizes: "(min-width: 900px) 32vw, 92vw", pos: "50% 22%" })}</figure>
    </div>
    <ol class="methode__etapes">
      ${p.methode.etapes.map((e, i) => html`<li data-reveal><span class="index">${String(i + 1).padStart(2, "0")}</span><h3>${esc(e.nom)}</h3><p>${esc(e.texte)}</p></li>`)}
    </ol>
  </div>
</section>`;

  const competences = html`
<section class="section section--creme">
  <div class="conteneur competences">
    <div>
      <p class="surtitre">Objectifs</p>
      <h2 data-reveal>Ce que vous allez maîtriser.</h2>
    </div>
    <ul class="competences__liste">
      ${p.competences.map((c) => html`<li data-reveal>${icon.check}<span>${esc(c)}</span></li>`)}
    </ul>
  </div>
</section>`;

  const formules = html`
<section class="section section--bleu formules" id="formules">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Formules et tarifs", titre: "Choisir mon <em>accompagnement</em>.", texte: "Paiement en ligne sécurisé. Après votre achat, je vous contacte pour planifier vos séances.", centre: true, or: true })}
    <ul class="formules-detail" data-defile>
      ${p.formules.map(
        (f) => html`<li class="formule${f.miseEnAvant ? " formule--avant" : ""}" id="formule-${f.id}" data-reveal>
          <div class="formule__tete">
            <p class="formule__nom">${esc(f.nom)}</p>
            <p class="formule__duree">${esc(f.duree)} · ${f.seances} séances de 60 min</p>
            <p class="formule__prix">${esc(f.prixFcfa)}</p>
            <p class="formule__eur">${esc(f.prixEur)}</p>
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
          ${bouton(f)}
        </li>`
      )}
    </ul>

    <div class="comparatif" data-reveal>
      <table>
        <caption>Comparer les formules</caption>
        <thead><tr><th scope="col"><span class="sr">Critère</span></th>${p.formules.map((f) => `<th scope="col">${esc(f.nom)}</th>`)}</tr></thead>
        <tbody>
          ${p.comparatif.map((r) => html`<tr><th scope="row">${esc(r.ligne)}</th><td>${cellule(r.etudiant)}</td><td>${cellule(r.standard)}</td><td>${cellule(r.prestige)}</td></tr>`)}
          <tr class="comparatif__prix"><th scope="row">Tarif</th>${p.formules.map((f) => `<td>${esc(f.prixFcfa)}</td>`)}</tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`;

  const avis = temoignages.liste.filter((t) => t.categorie === "accompagnement");
  const temoins = avis.length
    ? html`
<section class="section">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Témoignage", titre: "Ce que l'accompagnement <em>change</em>." })}
    ${avis
      .filter((x) => x.vedetteProgramme)
      .map((x) => html`<figure class="temoin-vedette" data-reveal>
        <blockquote><p>${esc(x.texte)}</p></blockquote>
        <figcaption><span class="temoin__initiale" aria-hidden="true">${esc(x.nom.charAt(0))}</span><span><b>${esc(x.nom)}</b>${esc(x.fonction)}</span></figcaption>
      </figure>`)}
    ${avis.filter((x) => !x.vedetteProgramme).length ? `<ul class="temoins" data-defile>${avis.filter((x) => !x.vedetteProgramme).map((x) => temoin(x)).join("")}</ul>` : ""}
  </div>
</section>`
    : "";

  const reservation = html`
<section class="section">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Réservation", titre: "Trois étapes pour commencer." })}
    <ol class="etapes">
      <li data-reveal><span class="index">01</span><h3>Choisissez votre formule</h3><p>Étudiant, Standard ou Prestige, selon votre objectif et votre échéance.</p></li>
      <li data-reveal><span class="index">02</span><h3>Réglez en ligne</h3><p>${texteReglement}</p></li>
      <li data-reveal><span class="index">03</span><h3>Planifions vos séances</h3><p>Je vous contacte après votre achat pour fixer vos rendez-vous.</p></li>
    </ol>
  </div>
</section>`;

  const faq = html`
<section class="section section--ivoire">
  <div class="conteneur faq">
    <div>
      <p class="surtitre">Questions fréquentes</p>
      <h2 data-reveal>Vous vous demandez peut-être…</h2>
    </div>
    <div class="faq__liste">
      ${p.faq.map((q) => html`<details class="faq__item"><summary>${esc(q.q)} ${icon.plus}</summary><p>${esc(q.r)}</p></details>`)}
    </div>
  </div>
</section>`;

  const final = appelFinal(site, {
    titre: "Prendre la parole, <em>autrement</em>.",
    texte: "Une hésitation sur la formule ? Écrivez-moi, je vous oriente.",
    cta: { label: "Choisir mon accompagnement", url: "#formules" },
    whatsapp: "Bonjour Mazidath, j'hésite entre les formules Speak & Conquer."
  });

  return [hero, faits, transformation, pourQui, methode, competences, formules, temoins, reservation, faq, final, scriptFedapay].join("\n");
};
