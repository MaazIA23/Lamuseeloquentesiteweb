/* Page Travailler avec moi : prestations + formulaire de demande de devis (Netlify Forms). */
const { esc, html, img, wa, ext, icon } = require("../lib");
const { pageHero, enteteSection } = require("../components");

module.exports = function travaillerAvecMoi({ site, pro: p }) {
  const hero = pageHero({
    ariane: "Travailler avec moi",
    ...p.hero,
    pos: "50% 20%",
    actions: `<a class="btn btn--or" href="#devis">Parler de votre projet ${icon.fleche}</a><a class="btn btn--ligne-claire" href="#offres">Voir les prestations</a>`
  });

  const index = html`
<nav class="sommaire conteneur" id="offres" aria-label="Prestations">
  <ol>${p.offres.map((o) => `<li><a href="#${o.id}">${esc(o.nom)}</a></li>`)}</ol>
</nav>`;

  const offres = html`
<section class="section offres-pro">
  <div class="conteneur">
    ${p.offres.map(
      (o, i) => html`
    <article class="offre-pro" id="${o.id}">
      <figure class="offre-pro__photo" data-reveal>${img(o.photo, { alt: "", sizes: "(min-width: 900px) 36vw, 92vw", pos: "50% 30%" })}</figure>
      <div class="offre-pro__texte">
        <p class="surtitre"><span class="chapitre__num">${String(i + 1).padStart(2, "0")}</span> Prestation</p>
        <h2 data-reveal>${esc(o.nom)}</h2>
        <p class="offre-pro__probleme" data-reveal>${esc(o.probleme)}</p>
        <p class="chapo" data-reveal>${esc(o.valeur)}</p>
        <dl class="offre-pro__infos">
          <div><dt>Format</dt><dd>${esc(o.format)}</dd></div>
          <div><dt>Pour qui</dt><dd>${esc(o.public)}</dd></div>
          ${o.themes ? `<div><dt>Thèmes</dt><dd><ul>${o.themes.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></dd></div>` : ""}
          ${o.exemples && o.exemples.length ? `<div><dt>Exemple</dt><dd>${o.exemples.map(esc).join("<br>")}</dd></div>` : ""}
        </dl>
        <div class="actions">
          <a class="btn" href="#devis" data-type="${esc(o.nom)}">Demander un devis ${icon.fleche}</a>
          ${o.lien ? `<a class="lien" href="${o.lien.url}">${esc(o.lien.label)} ${icon.fleche}</a>` : ""}
        </div>
      </div>
    </article>`
    )}
  </div>
</section>`;

  const processus = html`
<section class="section section--creme">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Méthode", titre: "Comment nous travaillons" })}
    <ol class="etapes">
      ${p.processus.map((e, i) => html`<li data-reveal><span class="etapes__num">${String(i + 1).padStart(2, "0")}</span><h3>${esc(e.titre)}</h3><p>${esc(e.texte)}</p></li>`)}
    </ol>
  </div>
</section>`;

  const f = p.formulaire;
  const devis = html`
<section class="section section--bleu devis" id="devis">
  <div class="conteneur devis__grille">
    <div class="devis__intro">
      <p class="surtitre surtitre--or">Demande de devis</p>
      <h2 data-reveal>${esc(f.titre)}</h2>
      <p>${esc(f.texte)}</p>
      <ul class="devis__contact">
        ${site.contact.email ? `<li><span>Email</span><a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a></li>` : ""}
        <li><span>WhatsApp</span><a href="${wa(site, "Bonjour Mazidath, je souhaite vous parler d'un projet.")}"${ext("https:")}>${esc(site.contact.whatsappAffiche)}</a></li>
      </ul>
    </div>
    <form class="formulaire" name="devis" method="POST" action="/merci/" data-netlify="true" netlify-honeypot="site-web">
      <input type="hidden" name="form-name" value="devis">
      <p class="sr"><label>Ne pas remplir <input name="site-web" tabindex="-1" autocomplete="off"></label></p>
      <div class="champ-duo">
        <div class="champ"><label for="d-nom">Nom et prénom *</label><input id="d-nom" name="nom" autocomplete="name" required></div>
        <div class="champ"><label for="d-orga">Organisation</label><input id="d-orga" name="organisation" autocomplete="organization"></div>
      </div>
      <div class="champ-duo">
        <div class="champ"><label for="d-email">Email *</label><input id="d-email" name="email" type="email" autocomplete="email" required></div>
        <div class="champ"><label for="d-tel">Téléphone / WhatsApp</label><input id="d-tel" name="telephone" type="tel" autocomplete="tel"></div>
      </div>
      <div class="champ">
        <label for="d-type">Type de prestation *</label>
        <select id="d-type" name="type" required>
          <option value="">Choisir…</option>
          ${f.types.map((t) => `<option>${esc(t)}</option>`)}
        </select>
      </div>
      <div class="champ-duo">
        <div class="champ"><label for="d-date">Date envisagée</label><input id="d-date" name="date" type="text" placeholder="ex. mars 2027"></div>
        <div class="champ"><label for="d-lieu">Lieu / format</label><input id="d-lieu" name="lieu" placeholder="ex. Cotonou, en ligne…"></div>
      </div>
      <div class="champ"><label for="d-public">Public et nombre de participants</label><input id="d-public" name="public"></div>
      <div class="champ"><label for="d-message">Votre projet *</label><textarea id="d-message" name="message" rows="5" required></textarea></div>
      <button class="btn btn--or btn--plein" type="submit">Envoyer ma demande ${icon.fleche}</button>
      <p class="formulaire__note">Vos informations servent uniquement à répondre à votre demande.</p>
    </form>
  </div>
</section>`;

  return [hero, index, offres, processus, devis].join("\n");
};
