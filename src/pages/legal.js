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

const mentions = ({ legal: l }) =>
  pageTexte(
    "Mentions légales",
    html`
<h2>Éditeur du site</h2>
<p>${esc(l.editeur.nom)}, représentée par ${esc(l.editeur.responsable)}.<br>
Forme juridique : ${val(l.editeur.formeJuridique)}<br>
RCCM : ${val(l.editeur.rccm)} · IFU : ${val(l.editeur.ifu)}<br>
Adresse : ${val(l.editeur.adresse)}<br>
Contact : <a href="mailto:${l.editeur.email}">${esc(l.editeur.email)}</a></p>
<p>Directrice de la publication : ${esc(l.editeur.responsable)}.</p>
<h2>Hébergement</h2>
<p>${esc(l.hebergeur.nom)}, ${esc(l.hebergeur.adresse)} · <a href="${l.hebergeur.site}">${esc(l.hebergeur.site.replace("https://", ""))}</a></p>
<h2>Propriété intellectuelle</h2>
<p>Le logo, la charte graphique, les textes, les photographies et les ebooks présentés sur ce site sont la propriété de La Muse Éloquente ou de leurs auteurs. Toute reproduction sans autorisation écrite est interdite.</p>
<p>Crédits photographiques : BH Studio, Giresse Frames, Harold Photo Studio.</p>
<h2>Données personnelles</h2>
<p>Voir la <a href="/confidentialite/">politique de confidentialité</a>.</p>`
  );

const confidentialite = ({ legal: l }) =>
  pageTexte(
    "Politique de confidentialité",
    html`
<h2>Données collectées</h2>
<p>Lorsque vous remplissez le formulaire de demande de devis, nous recevons les informations que vous saisissez : nom, organisation, email, téléphone et description de votre projet. Elles servent uniquement à répondre à votre demande et ne sont ni vendues ni cédées.</p>
<p>Les achats se font sur la boutique en ligne de La Muse Éloquente (Chariow), qui traite les données de paiement selon sa propre politique de confidentialité.</p>
<h2>Cookies et mesure d'audience</h2>
<p>Ce site n'utilise pas de cookies publicitaires. Les polices de caractères sont hébergées sur le site lui-même : aucune donnée n'est transmise à un service tiers lors de votre visite.</p>
<h2>Vos droits</h2>
<p>Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à <a href="mailto:${l.editeur.email}">${esc(l.editeur.email)}</a>.</p>`
  );

const cgv = ({ legal: l, site }) =>
  pageTexte(
    "Conditions générales de vente",
    html`
<p class="avertissement">Document en cours de validation.</p>
<h2>Objet</h2>
<p>Les présentes conditions encadrent la vente des programmes d'accompagnement (Speak &amp; Conquer), des ebooks et du livre proposés par ${esc(l.editeur.nom)}.</p>
<h2>Commande et paiement</h2>
<p>Les commandes et paiements s'effectuent en ligne sur la boutique sécurisée de La Muse Éloquente (<a href="${site.boutique.url}">${esc(site.boutique.url.replace("https://", ""))}</a>). Les prix sont indiqués toutes taxes comprises, dans la devise affichée au moment de l'achat.</p>
<h2>Programmes d'accompagnement</h2>
<p>Après l'achat d'une formule Speak &amp; Conquer, La Muse Éloquente contacte le client pour planifier les séances individuelles. Le nombre et la durée des séances correspondent à la formule choisie.</p>
<p>Report et annulation de séance : ${val("")}</p>
<h2>Produits numériques</h2>
<p>Les ebooks sont livrés sous forme de fichier numérique après paiement.</p>
<h2>Rétractation et remboursement</h2>
<p>${val("")}</p>
<h2>Contact</h2>
<p><a href="mailto:${l.editeur.email}">${esc(l.editeur.email)}</a></p>`
  );

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

const introuvable = () => html`
<section class="section section--bleu page-message">
  <div class="conteneur final__in">
    <p class="surtitre surtitre--or">Erreur 404</p>
    <h1>Silence dans la salle</h1>
    <p>Cette page n'existe pas, ou plus. Reprenons la parole depuis l'accueil.</p>
    <div class="actions actions--centre"><a class="btn btn--or" href="/">Retour à l'accueil ${icon.fleche}</a></div>
  </div>
</section>`;

module.exports = { mentions, confidentialite, cgv, merci, introuvable };
