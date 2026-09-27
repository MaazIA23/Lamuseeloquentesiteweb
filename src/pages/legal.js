/* Pages légales, merci et 404. Les informations manquantes sont signalées « À compléter ». */
const { esc, html, icon } = require("../lib");

const val = (v) => (v ? esc(v) : `<mark class="a-completer">À compléter</mark>`);

const pageTexte = (titre, corps) => html`
<section class="section page-texte">
  <div class="conteneur conteneur--etroit">
    <nav class="fil-ariane fil-ariane--sombre" aria-label="Fil d'Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><span>${esc(titre)}</span></nav>
    <h1>${esc(titre)}</h1>
    <div class="prose">${corps}</div>
  </div>
</section>`;

const bloc = (label, valeur) => `<li><b>${esc(label)} :</b> ${valeur}</li>`;

const mentions = ({ legal: l, site }) =>
  pageTexte(
    "Mentions légales",
    html`
<h2>Éditeur du site</h2>
<p>Le présent site, accessible à l'adresse ${esc(site.url.replace("https://", ""))} (ci-après « le Site »), est édité par ${esc(l.editeur.nom)}.</p>
<ul class="prose__liste">
  ${bloc("Forme juridique", esc(l.editeur.formeJuridique))}
  ${bloc("Siège social", esc(l.editeur.siege))}
  ${bloc("Numéro d'immatriculation", esc(l.editeur.rccm))}
  ${bloc("Représentante légale", esc(l.editeur.responsable))}
  ${bloc("E-mail", `<a href="mailto:${l.editeur.email}">${esc(l.editeur.email)}</a>`)}
  ${bloc("WhatsApp", esc(site.contact.whatsappAffiche))}
</ul>
<h2>Direction de la publication</h2>
<p>${esc(l.editeur.directricePublication)}.</p>
<h2>Hébergeur du site</h2>
<ul class="prose__liste">
  ${bloc("Hébergeur", esc(l.hebergeur.nom))}
  ${bloc("Adresse", esc(l.hebergeur.adresse))}
  ${bloc("Site web", `<a href="${l.hebergeur.site}">${esc(l.hebergeur.site.replace("https://", ""))}</a>`)}
</ul>
<h2>Objet du site</h2>
<p>Le Site présente l'univers de La Muse Éloquente et de sa fondatrice, Mazidath Bello, et permet notamment de découvrir ses accompagnements, interventions et événements, d'acheter un programme d'accompagnement, un livre ou un ebook, et de demander un devis.</p>
<h2>Propriété intellectuelle</h2>
<p>Sauf mention contraire, l'ensemble des éléments du Site (textes, visuels, logos, photographies, vidéos, structure) est la propriété exclusive de La Muse Éloquente ou utilisé avec autorisation. Toute reproduction, représentation, modification ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.</p>
<p>Crédits photographiques : BH Studio, Giresse Frames, Harold Photo Studio.</p>
<h2>Liens hypertextes</h2>
<p>Le Site peut contenir des liens vers d'autres sites (boutique en ligne, réseaux sociaux, plateforme de réservation, solution de paiement). La Muse Éloquente n'est pas responsable de leur contenu ni de leur fonctionnement.</p>
<h2>Responsabilité</h2>
<p>Les informations publiées sur le Site le sont à titre indicatif. La Muse Éloquente ne garantit pas leur exhaustivité et ne saurait être tenue responsable des dommages directs ou indirects liés à l'utilisation du Site.</p>
<h2>Données personnelles</h2>
<p>Les modalités de collecte et de traitement des données personnelles sont détaillées dans la <a href="/confidentialite/">politique de confidentialité</a>.</p>
<h2>Droit applicable</h2>
<p>Les présentes mentions légales sont régies par le droit béninois. En cas de litige, les tribunaux compétents de Cotonou seront seuls compétents, sauf disposition légale contraire.</p>`
  );

const confidentialite = ({ legal: l }) =>
  pageTexte(
    "Politique de confidentialité",
    html`
<p>La présente politique décrit comment La Muse Éloquente traite les données personnelles collectées via le Site. En utilisant le Site et en communiquant vos données, vous acceptez cette politique.</p>
<h2>Données collectées</h2>
<ul class="prose__liste">
  <li>Données d'identité et coordonnées : nom, prénom, organisation, adresse e-mail, téléphone ou WhatsApp.</li>
  <li>Données liées à une demande de devis : type de prestation, date, lieu, public, budget indicatif, description du projet.</li>
  <li>Données liées aux commandes et réservations : formule choisie, montant, date, référence de paiement, créneaux réservés.</li>
</ul>
<h2>Finalités</h2>
<ul class="prose__liste">
  <li>Répondre à vos demandes et établir des devis.</li>
  <li>Gérer les commandes, les paiements et la planification des séances.</li>
  <li>Vous adresser les informations liées à votre accompagnement (confirmation, rappel, informations pratiques).</li>
</ul>
<h2>Base légale</h2>
<p>Les traitements reposent sur l'exécution d'un contrat ou de mesures précontractuelles (devis, commande, accompagnement), sur votre consentement pour les champs facultatifs, et sur le respect d'obligations légales (facturation, comptabilité).</p>
<h2>Destinataires</h2>
<p>Les données sont destinées à La Muse Éloquente et à ses prestataires techniques, uniquement pour les besoins des services : hébergement (Netlify), paiement (FedaPay, Chariow), réservation (Cal.com). Elles ne sont ni vendues ni cédées à des tiers.</p>
<h2>Durée de conservation</h2>
<p>Les données sont conservées pendant la durée nécessaire aux finalités poursuivies : durée de la relation commerciale pour les accompagnements, durée légale de conservation comptable pour les commandes, et au plus trois ans après le dernier contact pour les demandes de devis sans suite.</p>
<h2>Cookies</h2>
<p>Le Site n'utilise pas de cookies publicitaires. Les polices de caractères sont hébergées sur le Site lui-même. Les vidéos YouTube ne sont chargées, dans leur version sans cookies, que lorsque vous choisissez de les lire.</p>
<h2>Vos droits</h2>
<p>Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et, dans certains cas, de portabilité de vos données. Pour les exercer, écrivez à <a href="mailto:${l.editeur.email}">${esc(l.editeur.email)}</a> ou à l'adresse : ${esc(l.editeur.siege)}. Une preuve d'identité peut être demandée.</p>
<h2>Sécurité</h2>
<p>La Muse Éloquente met en œuvre des mesures techniques et organisationnelles raisonnables pour protéger vos données contre l'accès non autorisé, la perte, l'altération ou la divulgation.</p>`
  );

const cgv = ({ legal: l, site, sac }) => {
  const c = l.cgv;
  return pageTexte(
    "Conditions générales de vente",
    html`
<p>Les présentes conditions générales de vente (CGV) s'appliquent à toute commande passée auprès de ${esc(l.editeur.nom)}, ${esc(l.editeur.formeJuridique.toLowerCase())} immatriculée sous le ${esc(l.editeur.rccm)}, dont le siège est situé ${esc(l.editeur.siege)}. Toute commande implique l'acceptation sans réserve des présentes CGV.</p>

<h2>1. Offres concernées</h2>
<p>Les présentes CGV concernent le programme d'accompagnement individuel Speak &amp; Conquer, le livre « Chroniques d'une voix qui s'est révélée » et les ebooks de La Muse Éloquente. Les prestations sur devis (conférences, formations, masterclass, maîtrise de cérémonie, prestations pour les marques) font l'objet d'une proposition commerciale et de conditions particulières.</p>

<h2>2. Prix et paiement</h2>
<p>Les prix sont indiqués en francs CFA (FCFA), toutes taxes comprises. Les équivalences en euros sont données à titre indicatif. Le paiement s'effectue en ligne, en totalité, au moment de la commande : par Mobile Money ou carte bancaire via FedaPay, ou par carte depuis l'international via la boutique en ligne de La Muse Éloquente (Chariow).</p>

<h2>3. Programme Speak &amp; Conquer</h2>
<p>Chaque formule comprend un nombre de séances individuelles de 60 minutes, à utiliser dans un délai de validité courant à compter de la date de paiement :</p>
<ul class="prose__liste">
  ${c.validite.map((v) => `<li><b>${esc(v.formule)}</b> : ${v.seances} séances, à utiliser dans un délai de ${esc(v.delai)}.</li>`)}
</ul>
<p>Après le paiement, le client réserve ses séances en ligne, une par une, selon les disponibilités proposées. Les séances se déroulent en visioconférence ou en présentiel, selon ce qui est convenu. Les séances non utilisées à l'issue du délai de validité sont perdues et ne donnent lieu à aucun remboursement, sauf accord écrit de La Muse Éloquente.</p>

<h2>4. Report et annulation d'une séance</h2>
<ul class="prose__liste">
  <li>Le client peut reporter ou annuler une séance gratuitement jusqu'à ${esc(c.delaiReport)} avant l'heure prévue, via le lien reçu lors de la réservation.</li>
  <li>Toute séance annulée moins de ${esc(c.delaiReport)} à l'avance, ou à laquelle le client ne se présente pas, est considérée comme effectuée, sauf cas de force majeure dûment justifié.</li>
  <li>En cas de retard du client, la séance se termine à l'heure initialement prévue.</li>
  <li>Si La Muse Éloquente doit annuler ou reporter une séance, un nouveau créneau est proposé au client, sans frais et sans réduction du délai de validité.</li>
</ul>

<h2>5. Rétractation et remboursement</h2>
<ul class="prose__liste">
  <li><b>Avant la première séance</b> : le client peut demander le remboursement intégral de sa formule dans un délai de ${esc(c.delaiRetractation)} suivant le paiement, par écrit à <a href="mailto:${l.editeur.email}">${esc(l.editeur.email)}</a>.</li>
  <li><b>Après la première séance</b> : en demandant à commencer l'accompagnement, le client reconnaît que la prestation a débuté. La formule n'est alors plus remboursable ; les séances restantes demeurent utilisables pendant le délai de validité.</li>
  <li><b>Ebooks</b> : s'agissant de contenus numériques fournis immédiatement après le paiement, le client renonce expressément à son droit de rétractation dès le téléchargement. Aucun remboursement n'est possible, sauf fichier défectueux.</li>
  <li><b>Livre papier</b> : un exemplaire défectueux ou endommagé à la livraison est échangé sur simple demande, accompagnée d'une photo, dans les 7 jours suivant la réception.</li>
</ul>
<p>Les remboursements acceptés sont effectués par le même moyen de paiement que celui utilisé lors de la commande, dans un délai de 14 jours.</p>

<h2>6. Obligations des parties</h2>
<p>La Muse Éloquente s'engage à fournir un accompagnement personnalisé et exigeant. Il s'agit d'une obligation de moyens : les progrès dépendent aussi de l'implication et de la pratique du client entre les séances.</p>

<h2>7. Propriété intellectuelle</h2>
<p>Les supports remis dans le cadre des accompagnements, le livre et les ebooks sont protégés par le droit d'auteur. Ils sont réservés à un usage strictement personnel et ne peuvent être reproduits, partagés ou revendus.</p>

<h2>8. Données personnelles</h2>
<p>Le traitement des données personnelles est décrit dans la <a href="/confidentialite/">politique de confidentialité</a>.</p>

<h2>9. Droit applicable et litiges</h2>
<p>Les présentes CGV sont régies par le droit béninois. En cas de différend, les parties rechercheront d'abord une solution amiable. À défaut, les tribunaux compétents de Cotonou seront seuls compétents, sous réserve des dispositions protectrices applicables au consommateur dans son pays de résidence.</p>

<h2>Contact</h2>
<p><a href="mailto:${l.editeur.email}">${esc(l.editeur.email)}</a> · WhatsApp ${esc(site.contact.whatsappAffiche)}</p>`
  );
};

const merci = ({ site }) => html`
<section class="section section--bleu page-message">
  <div class="conteneur final__in">
    <p class="surtitre surtitre--or">Demande envoyée</p>
    <h1>Merci !</h1>
    <p>Votre message est bien arrivé. Je reviens vers vous rapidement.</p>
    <div class="actions actions--centre">
      <a class="btn btn--or" href="/">Retour à l'accueil ${icon.fleche}</a>
      <a class="btn btn--ligne-claire" href="/programmes/speak-and-conquer/">Découvrir Speak &amp; Conquer</a>
    </div>
  </div>
</section>`;

const merciPaiement = ({ site }) => html`
<section class="section section--bleu page-message">
  <div class="conteneur final__in">
    <p class="surtitre surtitre--or">Paiement confirmé</p>
    <h1>Bienvenue dans Speak &amp; Conquer</h1>
    <p>Merci pour votre confiance. Votre paiement est bien enregistré : réservez dès maintenant votre première séance dans mon agenda. Vous pourrez y revenir pour réserver les suivantes.</p>
    <div class="actions actions--centre">
      <a class="btn btn--clair" href="${site.reservation.seances}" target="_blank" rel="noopener">Réserver ma première séance ${icon.fleche}</a>
      <a class="btn btn--ligne-claire" href="https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent("Bonjour Mazidath, je viens de m'inscrire à Speak & Conquer.")}" target="_blank" rel="noopener">${icon.whatsapp} Écrire sur WhatsApp</a>
    </div>
    <p class="page-message__note">Gardez précieusement ce lien : ${esc(site.reservation.seances.replace("https://", ""))}</p>
  </div>
</section>`;

const introuvable = () => html`
<section class="section section--bleu page-message">
  <div class="conteneur final__in">
    <p class="surtitre surtitre--or">Erreur 404</p>
    <h1>Silence dans la salle</h1>
    <p>Cette page n'existe pas, ou plus. Reprenons la parole depuis l'accueil.</p>
    <div class="actions actions--centre"><a class="btn btn--or" href="/">Retour à l'accueil ${icon.fleche}</a></div>
  </div>
</section>`;

module.exports = { mentions, confidentialite, cgv, merci, merciPaiement, introuvable };
