/*
 * Génère le site statique dans /dist à partir de /content (textes) et /src (gabarits).
 * Usage : npm run build
 */
const fs = require("fs");
const path = require("path");
const { layout } = require("../src/layout");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, "content", p), "utf8"));

const data = {
  site: read("site.json"),
  accueil: read("accueil.json"),
  sac: read("programmes/speak-and-conquer.json"),
  boutique: read("boutique.json"),
  temoignages: read("temoignages.json"),
  evenements: read("evenements.json"),
  apropos: read("a-propos.json"),
  pro: read("travailler-avec-moi.json"),
  legal: read("legal.json")
};
const { site } = data;
const version = Date.now().toString(36);
const prixNum = (s) => Number(String(s).replace(/[^\d,]/g, "").replace(",", "."));

/* ---------- Données structurées ---------- */
const personne = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.fondatrice,
  alternateName: site.nom,
  jobTitle: "Fondatrice de La Muse Éloquente, oratrice, maîtresse de cérémonie et formatrice en prise de parole",
  knowsLanguage: ["fr", "en"],
  url: site.url,
  image: `${site.url}/assets/img/portrait-bleu-accoudee-960.webp`,
  sameAs: site.reseaux.map((r) => r.url),
  award: "Lauréate du concours d'éloquence du Groupe Gema (2024)"
};
const organisation = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.nom,
  url: site.url,
  logo: `${site.url}/assets/brand/logo-vertical.webp`,
  slogan: site.devise,
  founder: { "@type": "Person", name: site.fondatrice },
  email: site.contact.email || undefined,
  sameAs: site.reseaux.map((r) => r.url)
};
const cours = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Speak & Conquer",
  description: data.sac.description,
  inLanguage: "fr",
  provider: { "@type": "Organization", name: site.nom, sameAs: site.url },
  offers: data.sac.formules.map((f) => ({
    "@type": "Offer",
    name: `Speak & Conquer · ${f.nom}`,
    price: f.prixNum,
    priceCurrency: "XOF",
    url: `${site.url}/programmes/speak-and-conquer/#formule-${f.id}`,
    category: f.duree
  })),
  hasCourseInstance: data.sac.formules.map((f) => ({
    "@type": "CourseInstance",
    courseMode: "Online",
    courseWorkload: `${f.seances} séances de 60 minutes sur ${f.duree}`
  }))
};
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: data.sac.faq.map((q) => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.r } }))
};

const evenementsLd = data.evenements.liste.find((e) => e.slug === "deux-minutes-pour-convaincre").editions
  .filter((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date))
  .map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Deux Minutes Pour Convaincre · ${e.label}`,
    startDate: e.date,
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: e.lieu, address: "Cotonou, Bénin" },
    organizer: { "@type": "Organization", name: site.nom, url: site.url }
  }));
const legal = require("../src/pages/legal");
const noindexLegal = !data.legal.valide;

/* ---------- Pages ---------- */
const pages = [
  {
    chemin: "/",
    gabarit: require("../src/pages/accueil"),
    titre: data.accueil.seo.titre,
    description: data.accueil.seo.description,
    preload: data.accueil.hero.photo,
    classe: "page-accueil",
    jsonld: [personne, organisation],
    barreMobile: { texte: "<b>Un projet ?</b> Parlons-en", label: "Me contacter", url: "/travailler-avec-moi/#devis" }
  },
  {
    chemin: "/programmes/speak-and-conquer/",
    gabarit: require("../src/pages/speak-and-conquer"),
    titre: data.sac.seo.titre,
    description: data.sac.seo.description,
    image: data.sac.photo,
    classe: "page-programme",
    jsonld: [cours, faqLd],
    barreMobile: { texte: `<b>3 formules</b> dès ${data.sac.formules[0].prixFcfa}`, label: "Choisir", url: "#formules" }
  },
  {
    chemin: "/a-propos/",
    gabarit: require("../src/pages/a-propos"),
    titre: data.apropos.seo.titre,
    description: data.apropos.seo.description,
    image: data.apropos.hero.photo,
    jsonld: [personne],
    barreMobile: { texte: "<b>Travailler avec Mazidath</b>", label: "Me contacter", url: "/travailler-avec-moi/#devis" }
  },
  {
    chemin: "/travailler-avec-moi/",
    gabarit: require("../src/pages/travailler-avec-moi"),
    titre: data.pro.seo.titre,
    description: data.pro.seo.description,
    image: data.pro.hero.photo,
    jsonld: [organisation],
    barreMobile: { texte: "<b>Un projet ?</b> Parlons-en", label: "Demander un devis", url: "#devis" }
  },
  {
    chemin: "/evenements/",
    gabarit: require("../src/pages/evenements"),
    titre: "Événements · Deux Minutes Pour Convaincre, 300 Voix et masterclass",
    description: "Deux Minutes Pour Convaincre, le concours d'improvisation oratoire créé par La Muse Éloquente à Cotonou, le programme d'impact 300 Voix et les masterclass de prise de parole de Mazidath Bello.",
    image: "2mpc-laureats",
    jsonld: evenementsLd
  },
  {
    chemin: "/boutique/",
    gabarit: require("../src/pages/boutique"),
    titre: "Boutique · Le livre et les ebooks de La Muse Éloquente",
    description: "Chroniques d'une voix qui s'est révélée, Le secret d'une belle diction, Décrochez votre alternance dès le premier entretien : le livre et les ebooks de Mazidath Bello.",
    image: "livre-chroniques",
    jsonld: data.boutique.produits.filter((p) => p.prix).map((p) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.titre,
      description: p.resume,
      image: `${site.url}/assets/img/${p.photo}-960.webp`,
      brand: { "@type": "Brand", name: site.nom },
      offers: { "@type": "Offer", price: /FCFA/.test(p.prix) ? Number(p.prix.replace(/\D/g, "")) : prixNum(p.prix), priceCurrency: /FCFA/.test(p.prix) ? "XOF" : "EUR", url: p.achat.url, availability: "https://schema.org/InStock" }
    }))
  },
  {
    chemin: "/presentatrice/",
    gabarit: require("../src/pages/presentatrice"),
    titre: "Mazidath Bello · Présentatrice, animatrice, maîtresse de cérémonie",
    description: "Parcours télé, extraits et contact de Mazidath Bello, présentatrice et animatrice.",
    image: "portrait-gris",
    noindex: true
  },
  { chemin: "/mentions-legales/", gabarit: legal.mentions, titre: "Mentions légales · La Muse Éloquente", noindex: noindexLegal },
  { chemin: "/confidentialite/", gabarit: legal.confidentialite, titre: "Confidentialité · La Muse Éloquente", noindex: noindexLegal },
  { chemin: "/cgv/", gabarit: legal.cgv, titre: "Conditions générales de vente · La Muse Éloquente", noindex: noindexLegal },
  { chemin: "/merci/", gabarit: legal.merci, titre: "Merci · La Muse Éloquente", noindex: true, enteteSombre: true },
  { chemin: "/merci-paiement/", gabarit: legal.merciPaiement, titre: "Paiement confirmé · La Muse Éloquente", noindex: true },
  { chemin: "/404.html", gabarit: legal.introuvable, titre: "Page introuvable · La Muse Éloquente", noindex: true, enteteSombre: true }
];

/* ---------- Écriture ---------- */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

for (const page of pages) {
  const body = page.gabarit(data);
  const out = layout(site, { ...page, version }, body);
  const fichier = page.chemin.endsWith(".html") ? path.join(DIST, page.chemin) : path.join(DIST, page.chemin, "index.html");
  fs.mkdirSync(path.dirname(fichier), { recursive: true });
  fs.writeFileSync(fichier, out);
  console.log(`✓ ${page.chemin}`);
}

// Assets : images et marque copiées telles quelles, CSS/JS concaténés.
fs.cpSync(path.join(ROOT, "assets"), path.join(DIST, "assets"), { recursive: true, filter: (s) => !s.endsWith("manifest.json") });
const css = fs.readdirSync(path.join(ROOT, "src/styles")).sort().map((f) => fs.readFileSync(path.join(ROOT, "src/styles", f), "utf8")).join("\n");
fs.writeFileSync(path.join(DIST, "assets/site.css"), css);
fs.copyFileSync(path.join(ROOT, "src/scripts/site.js"), path.join(DIST, "assets/site.js"));

// SEO technique
fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .filter((p) => !p.noindex)
    .map((p) => `  <url><loc>${site.url}${p.chemin}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`\nSite généré dans dist/ (${pages.length} pages).`);
