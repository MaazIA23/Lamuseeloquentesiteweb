/* Page « Présentatrice » : dossier de candidature télé (non référencée, partagée par lien). */
const { esc, html, img, icon } = require("../lib");
const { riche, pageHero, enteteSection, video } = require("../components");

module.exports = function presentatrice({ site, evenements }) {
  const deuxMin = evenements.liste.find((e) => e.slug === "deux-minutes-pour-convaincre");
  const mail = site.contact.email;

  const hero = pageHero({
    ariane: "Présentatrice",
    surtitre: "Présentatrice · Animatrice · Maîtresse de cérémonie",
    titre: "Mazidath <em>Bello</em>",
    texte: "Devant la caméra depuis 2017, au micro depuis quinze ans, chanteuse à ses heures : une voix qui sait écouter, relancer, et faire vivre le débat. Basée à Lyon, mobile en Île-de-France.",
    photo: "portrait-gris",
    photoAlt: "Portrait de Mazidath Bello en tailleur gris",
    pos: "50% 30%",
    actions: `<a class="btn" href="#extraits">Voir mes extraits ${icon.fleche}</a><a class="lien" href="mailto:${mail}">Me contacter</a>`
  });

  const chiffres = [
    ["2017", "premiers pas devant la caméra"],
    ["15+", "ans de prise de parole en public"],
    ["20", "conférences internationales"],
    ["+70K", "abonnés sur les réseaux"]
  ];
  const reperes = html`
<section class="section section--ivoire">
  <div class="conteneur">
    <ul class="reperes-chiffres">${chiffres.map(([v, l]) => `<li data-reveal><strong>${esc(v)}</strong><span>${esc(l)}</span></li>`)}</ul>
  </div>
</section>`;

  const etapes = [
    ["2017", "Miss Emploi", "Premier projet télévisé : mes premiers pas de présentatrice."],
    ["2018", "Ma première émission", "Animatrice sur une web TV."],
    ["Télévision nationale du Bénin", "« On utilise le mot »", "Une chronique hebdomadaire de deux minutes sur les expressions françaises nées au Bénin, et ce qu'elles disent de nous."],
    ["Web TV", "« Mon style vous parle »", "Animatrice d'une émission consacrée aux mots et à ce qu'ils révèlent."],
    ["Réseaux sociaux", "Créatrice de contenu", "Plus de 70 000 abonnés, des vidéos virales et des lives où je présente et anime en direct."],
    ["Depuis 2025", "Deux Minutes Pour Convaincre", "Créatrice d'un concours de débat oratoire à Cotonou : deux orateurs, deux thèses opposées, cent vingt secondes pour emporter la salle."]
  ];
  const parcours = html`
<section class="section">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Parcours à l'écran", titre: "De la chronique au <em>plateau</em>." })}
    <ol class="pres-frise">
      ${etapes.map(([quand, titre, texte]) => html`<li data-reveal><p class="pres-frise__quand">${esc(quand)}</p><h3>${esc(titre)}</h3><p>${esc(texte)}</p></li>`)}
    </ol>
  </div>
</section>`;

  const atouts = [
    ["Faire vivre le débat", "J'ai créé un concours entièrement construit sur la confrontation de deux points de vue. Distribuer la parole, tenir le temps, relancer : c'est mon terrain."],
    ["Écouter et relancer", "Quinze ans de scène, des cérémonies, des tables rondes : je sais laisser la place aux autres et faire émerger ce qu'ils ont de plus intéressant à dire."],
    ["Curieuse du monde", "Du Palais des Nations à Genève aux expressions du français du Bénin, en passant par une conférence internationale à Dakar devant des chefs d'État."],
    ["La musique dans la voix", "Je chante : j'ai participé à The Voice Afrique (2019-2020), sorti un single et un duo avec Khaled Kelani, dont le clip est à voir plus bas. La culture urbaine et la pop culture font partie de mon quotidien."]
  ];
  const pourquoi = html`
<section class="section section--creme">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Ce que j'apporte", titre: "Une animatrice qui donne la <em>parole</em>." })}
    <ul class="pres-atouts">
      ${atouts.map(([t, p]) => html`<li data-reveal><h3>${esc(t)}</h3><p>${esc(p)}</p></li>`)}
    </ul>
  </div>
</section>`;

  const liens = [
    ["« On utilise le mot »", "Extrait de la chronique · télévision nationale du Bénin", "https://www.facebook.com/share/v/1GiqLTvWX2/"],
    ["« Mon style vous parle »", "Extrait de l'émission · web TV", "https://www.facebook.com/share/v/1CEXudawh2/"],
    ["Présentation en live", "Animation en direct · TikTok", "https://vm.tiktok.com/ZN8hS3fBE/"],
    ["Vidéo virale n°1", "TikTok", "https://vm.tiktok.com/ZN8hAMFDT/"],
    ["Vidéo virale n°2", "TikTok", "https://vm.tiktok.com/ZN8hAdeLp/"],
    ["Vidéo virale n°3", "TikTok", "https://vm.tiktok.com/ZN8hAFLf2/"],
    ["La Dictée Solidaire", "Coordination et prise de parole · 1ère édition, 2023", "https://www.facebook.com/share/v/1Cw1BCMmXr/"]
  ];
  const extraits = html`
<section class="section section--bleu" id="extraits">
  <div class="conteneur">
    ${enteteSection({ surtitre: "Extraits", titre: "À l'<em>écran</em>.", or: true })}
    <div class="pres-extraits">
      <div class="pres-videos">
        ${video({ youtubeId: "0cqRRXrHSR4", titre: "Clip en duo avec Khaled Kelani", couverture: "portrait-gris" })}
        ${deuxMin && deuxMin.video ? video({ ...deuxMin.video, titre: "Deux Minutes Pour Convaincre · Cotonou" }) : ""}
      </div>
      <ul class="pres-liens">
        ${liens.map(([t, s, u]) => `<li><a href="${u}" target="_blank" rel="noopener"><strong>${esc(t)}</strong><span>${esc(s)}</span>${icon.externe}</a></li>`)}
      </ul>
    </div>
  </div>
</section>`;

  const contact = html`
<section class="section">
  <div class="conteneur pres-contact">
    <figure class="photo" data-reveal>${img("lecture-chroniques", { alt: "Mazidath Bello lisant son livre « Chroniques d'une voix qui s'est révélée »", sizes: "(min-width: 900px) 36vw, 92vw", pos: "50% 35%" })}</figure>
    <div>
      <p class="surtitre">Contact</p>
      <h2 data-reveal>${riche("Prête pour le <em>plateau</em>.")}</h2>
      <p class="chapo">Autrice de « Chroniques d'une voix qui s'est révélée », fondatrice de La Muse Éloquente et de Deux Minutes Pour Convaincre.</p>
      <ul class="pres-coord">
        <li><span>Email</span><a href="mailto:${mail}">${esc(mail)}</a></li>
        <li><span>Téléphone</span><a href="tel:+${site.contact.whatsapp}">${esc(site.contact.whatsappAffiche)}</a></li>
        <li><span>Localisation</span><p>Basée à Lyon · mobile en Île-de-France</p></li>
        <li><span>Site</span><a href="/">lamuseeloquente.fr</a></li>
      </ul>
    </div>
  </div>
</section>`;

  return [hero, reperes, parcours, pourquoi, extraits, contact].join("\n");
};
