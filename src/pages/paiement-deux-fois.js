/* Page privée (non référencée) : paiement en deux fois de Speak & Conquer, sur demande.
   Formules Standard et Prestige : moitié avant le démarrage, moitié à mi-parcours.
   Les montants viennent de content/programmes/speak-and-conquer.json (« versements »). */
const { esc, html, icon } = require("../lib");
const { pageHero } = require("../components");
const { fenetreInscription } = require("./speak-and-conquer");

module.exports = function paiementDeuxFois({ site, sac: p }) {
  const parFormule = ["standard", "prestige"].map((id) => ({
    f: p.formules.find((x) => x.id === id),
    v: (p.versements || []).filter((x) => x.formule === id).sort((a, b) => a.etape - b.etape),
  }));
  const hero = pageHero({
    ariane: "Accompagnements",
    surtitre: "Speak & Conquer",
    titre: "Paiement en <em>deux fois</em>",
    texte: "Pour les formules Standard et Prestige, sur accord préalable : la moitié avant le démarrage, la seconde moitié à mi-parcours. Après le premier versement, vous recevez par e-mail le lien pour réserver vos séances.",
    photo: p.photo,
    photoAlt: "Portrait de Mazidath Bello, fondatrice de La Muse Éloquente",
    pos: p.photoPos || "50% 12%",
  });
  const cartes = html`
<section class="section section--bleu formules" id="formules">
  <div class="conteneur">
    <ul class="formules-detail deux-fois">
      ${parFormule.map(({ f, v }) => html`<li class="formule${f.miseEnAvant ? " formule--avant" : ""}">
        <div class="formule__tete">
          <p class="formule__nom">${esc(f.nom)}</p>
          <p class="formule__duree">${esc(f.duree)} · ${f.seances} séances de 60 min</p>
          <p class="formule__prix">${esc(f.prixFcfa)}</p>
          <p class="formule__public">en deux versements de ${esc(v[0].prixFcfa)}</p>
        </div>
        <div class="formule__corps">
          ${v.map((x) => html`<div class="formule__payer deux-fois__etape">
            <p class="formule__label">${x.etape === 1 ? "Avant le démarrage" : "À mi-parcours"}</p>
            <button class="btn ${x.etape === 1 ? "btn--plein" : "btn--clair"}" type="button" data-fedapay="${x.id}" data-nom="${esc(f.nom)} · ${esc(x.libelle)}" data-prix="${esc(x.prixFcfa)}">${esc(x.libelle)} · ${esc(x.prixFcfa).replace(/ /g, "&nbsp;")} ${icon.fleche}</button>
          </div>`)}
          <p class="formule__moyens">Mobile Money (MTN, Moov, Celtiis) ou carte bancaire</p>
          <p class="formule__cgv">En payant, vous acceptez les <a href="/cgv/">conditions générales de vente</a>.</p>
        </div>
      </li>`)}
    </ul>
  </div>
</section>`;
  return [hero, cartes, fenetreInscription()].join("\n");
};
