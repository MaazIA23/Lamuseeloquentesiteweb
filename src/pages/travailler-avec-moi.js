/* Page Interventions (URL historique /travailler-avec-moi/) : quatre univers + formulaire de devis (Netlify Forms). */
const { esc, html, img, wa, ext, icon } = require("../lib");
const { riche, pageHero, enteteSection } = require("../components");

const ctaParUnivers = { individus: null, entreprises: "Parler de mon projet", evenements: "Demander une prestation", organisations: "Parler de mon projet" };

module.exports = function travaillerAvecMoi({ site, pro: p }) {
  const hero = pageHero({
    ariane: "Interventions",
    ...p.hero,
    pos: "50% 20%",
    actions: `<a class="btn" href="#devis">Parler de mon projet ${icon.fleche}</a><a class="lien" href="#univers">Voir les interventions</a>`
  });

  const sommaire = html`
<nav class="sommaire" id="univers" aria-label="Univers d'intervention">
  <ol class="conteneur">${p.univers.map((u, i) => `<li><a href="#${u.id}"><span class="index">${String(i + 1).padStart(2, "0")}</span> ${esc(u.nom)}</a></li>`)}</ol>
</nav>`;

  const offre = (o, u) => html`
    <article class="offre-pro" id="${o.id}">
      <figure class="offre-pro__photo photo" data-reveal>${img(o.photo, { alt: "", sizes: "(min-width: 900px) 34vw, 92vw", pos: "50% 30%" })}</figure>
      <div class="offre-pro__texte">
        <h3 class="offre-pro__nom" data-reveal>${esc(o.nom)}</h3>
        <p class="offre-pro__probleme" data-reveal>${esc(o.probleme)}</p>
        <p class="chapo" data-reveal>${esc(o.valeur)}</p>
        <dl class="offre-pro__infos">
          <div><dt>Format</dt><dd>${esc(o.format)}</dd></div>
          <div><dt>Pour qui</dt><dd>${esc(o.public)}</dd></div>
          ${o.themes ? `<div><dt>Thèmes</dt><dd><ul>${o.themes.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></dd></div>` : ""}
          ${o.exemples && o.exemples.length ? `<div><dt>Référence</dt><dd>${o.exemples.map(esc).join("<br>")}</dd></div>` : ""}
        </dl>
        <div class="actions">
          ${o.lien
            ? `<a class="btn" href="${o.lien.url}">${esc(o.lien.label)} ${icon.fleche}</a>`
            : `<a class="btn" href="#devis" data-type="${esc(o.nom)}">${esc(ctaParUnivers[u.id] || "Parler de mon projet")} ${icon.fleche}</a>`}
        </div>
      </div>
    </article>`;

  const univers = p.univers
    .map(
      (u, i) => html`
<section class="section univers-pro${i % 2 ? " section--ivoire" : ""}" id="${u.id}">
  <div class="conteneur">
    <div class="univers-pro__tete">
      <span class="index">${String(i + 1).padStart(2, "0")}</span>
      <h2 data-reveal>${esc(u.nom)}</h2>
      <p class="texte-doux">${esc(u.intro)}</p>
    </div>
    <div class="univers-pro__offres">${u.offres.map((o) => offre(o, u))}</div>
  </div>
</section>`
    )
    .join("\n");

  const processus = html`
<section class="section section--creme">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Méthode", titre: "Comment nous travaillons." })}
    <ol class="etapes">
      ${p.processus.map((e, i) => html`<li data-reveal><span class="index">${String(i + 1).padStart(2, "0")}</span><h3>${esc(e.titre)}</h3><p>${esc(e.texte)}</p></li>`)}
    </ol>
  </div>
</section>`;

  const f = p.formulaire;
  const devis = html`
<section class="section section--bleu devis" id="devis">
  <div class="conteneur devis__grille">
    <div class="devis__intro">
      <p class="surtitre surtitre--or">Demande de devis</p>
      <h2 data-reveal>${riche(f.titre)}</h2>
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
      <div class="champ-duo">
        <div class="champ">
          <label for="d-type">Type de prestation *</label>
          <select id="d-type" name="type" required>
            <option value="">Choisir…</option>
            ${f.types.map((t) => `<option>${esc(t)}</option>`)}
          </select>
        </div>
        <div class="champ">
          <label for="d-budget">Budget indicatif</label>
          <select id="d-budget" name="budget">
            <option value="">Choisir…</option>
            ${f.budgets.map((b) => `<option>${esc(b)}</option>`)}
          </select>
        </div>
      </div>
      <div class="champ-duo">
        <div class="champ"><label for="d-date">Date envisagée</label><input id="d-date" name="date" type="text" placeholder="ex. mars 2027"></div>
        <div class="champ"><label for="d-lieu">Lieu ou format</label><input id="d-lieu" name="lieu" placeholder="ex. Cotonou, Paris, en ligne"></div>
      </div>
      <div class="champ"><label for="d-public">Public et nombre de participants</label><input id="d-public" name="public"></div>
      <div class="champ"><label for="d-message">Votre projet *</label><textarea id="d-message" name="message" rows="5" required></textarea></div>
      <button class="btn btn--plein" type="submit">Envoyer ma demande ${icon.fleche}</button>
      <p class="formulaire__note">Vos informations servent uniquement à répondre à votre demande.</p>
    </form>
  </div>
</section>`;

  return [hero, sommaire, univers, processus, devis].join("\n");
};
