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
  evenements: read("evenements.json")
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
  jobTitle: "Coach en prise de parole, présentatrice et maîtresse de cérémonie",
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
    price: prixNum(f.prixEur),
    priceCurrency: "EUR",
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
    barreMobile: { texte: `<b>Speak &amp; Conquer</b> dès ${data.sac.formules[0].prixEur}`, label: "Réserver", url: "/programmes/speak-and-conquer/#formules" }
  },
  {
    chemin: "/programmes/speak-and-conquer/",
    gabarit: require("../src/pages/speak-and-conquer"),
    titre: data.sac.seo.titre,
    description: data.sac.seo.description,
    image: data.sac.photo,
    classe: "page-programme",
    enteteSombre: true,
    jsonld: [cours, faqLd],
    barreMobile: { texte: `<b>3 formules</b> dès ${data.sac.formules[0].prixEur}`, label: "Voir les formules", url: "#formules" }
  }
];

/* ---------- Écriture ---------- */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

for (const page of pages) {
  const body = page.gabarit(data);
  const out = layout(site, { ...page, version }, body);
  const dir = path.join(DIST, page.chemin);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), out);
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
    .map((p) => `  <url><loc>${site.url}${p.chemin}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`\nSite généré dans dist/ (${pages.length} pages).`);
