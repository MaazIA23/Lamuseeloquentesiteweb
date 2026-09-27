# La Muse Éloquente — site officiel

Site de Mazidath Bello, La Muse Éloquente : prise de parole, éloquence, formation,
conférences, maîtrise de cérémonie, livres et événements.

Site statique, rapide et sans dépendance côté visiteur. Les textes, tarifs et produits
sont dans des fichiers de contenu séparés du code.

## Structure

```
content/                 Tout le contenu éditable (JSON)
  site.json               Coordonnées, navigation, réseaux, chiffres, presse
  accueil.json            Textes de la page d'accueil
  programmes/
    speak-and-conquer.json  Programme, formules, tarifs, liens d'achat, FAQ
  boutique.json           Livre et ebooks
  temoignages.json        Témoignages
  evenements.json         Événements (2MPC, masterclass…)

photos/                  Photos originales (déposez les nouvelles ici)
assets/
  img/                   Photos optimisées (générées : npm run images)
  brand/                 Logo et pictogramme (favicon)
  fonts/                 Anton et Montserrat auto-hébergées (licence OFL)

src/
  lib.js                 Utilitaires (images responsives, liens, icônes, fil doré)
  layout.js              En-tête, menu mobile, pied de page, balises SEO
  pages/                 Un gabarit par page
  styles/                Design system : tokens → base → composants → sections
  scripts/site.js        Menu, apparitions au défilement, barre d'action mobile

scripts/
  build.js               Génère le site dans dist/ (+ sitemap.xml, robots.txt)
  images.js              Optimise les photos (WebP 480/960/1600 px)

docs/                    Audit de l'existant, analyse de la charte graphique
```

## Modifier le site

| Je veux… | Fichier |
|---|---|
| Changer un tarif ou un lien d'achat Speak & Conquer | `content/programmes/speak-and-conquer.json` |
| Ajouter un produit à la boutique | `content/boutique.json` (copier un bloc) |
| Ajouter un témoignage | `content/temoignages.json` |
| Changer le téléphone, l'email, un réseau | `content/site.json` |
| Changer une photo | déposer le fichier dans `photos/`, lancer `npm run images`, puis mettre son nom (sans extension) dans le contenu |

Puis :

```bash
npm install        # une seule fois
npm run images     # si de nouvelles photos ont été ajoutées
npm run build      # génère dist/
npm run dev        # aperçu local sur http://localhost:4321
```

## Mise en ligne

Hébergement prévu : **Netlify** (configuration dans `netlify.toml`). Chaque push sur la
branche principale reconstruit et publie le site automatiquement.

## Réservation et paiement

Chaque formule déclare son moyen de paiement dans le contenu :

```json
"paiement": { "fournisseur": "chariow", "url": "https://…" }
```

Aujourd'hui, les boutons mènent à la boutique **Chariow** existante (paiement déjà
opérationnel). L'architecture permet de brancher ensuite, sans refonte :
- **Stripe Checkout** (cartes, international) ou **FedaPay** (Mobile Money, Bénin) via une
  fonction serveur Netlify qui crée la session de paiement et confirme le paiement ;
- **Cal.com / Calendly** (synchronisés avec Google Agenda) pour choisir les créneaux après paiement.

## Identité visuelle

Tokens issus de la charte graphique (voir `docs/charte/analyse-charte.md`) :
bleu `#272A5D`, or `#B48028`, dégradé doré `#E7C26D → #B8822B → #7F5A24`,
titres **Anton**, textes **Montserrat** (substitut libre de Gotham).
