// E-mails du site (demandes de devis, inscriptions Speak & Conquer), envoyés via Resend.
// Variables d'environnement Netlify (jamais dans le code) :
//   RESEND_API_KEY           clé API Resend
//   NOTIFICATION_FROM_EMAIL  expéditeur sur un domaine vérifié dans Resend (ex. contact@lamuseeloquente.fr)
//   NOTIFICATION_TO_EMAIL    adresse qui reçoit les notifications (par défaut : l'e-mail de contact du site)
const site = require("../../content/site.json");

// Adresse réelle du site fournie par Netlify (le domaine de content/site.json peut ne pas être encore branché).
const SITE_URL = process.env.URL || site.url;
const echappe = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const emailValide = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(e || "").trim());

function expediteur() {
  const from = process.env.NOTIFICATION_FROM_EMAIL;
  if (!process.env.RESEND_API_KEY || !from || from.endsWith("@resend.dev")) return null;
  return `La Muse Éloquente <${from.replace(/^.*<|>$/g, "")}>`;
}
const destinataireAdmin = () => process.env.NOTIFICATION_TO_EMAIL || site.contact.email;

const RESEAUX = (site.reseaux || []).filter((r) => r.url);

// Gabarit aux couleurs de La Muse Éloquente : bandeau en image, corps neutre lisible en mode sombre.
function gabarit(titre, paragraphes, options = {}) {
  const { bouton, blocs = "", texteBlocs = "", mention, signature = true } = options;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"></head>
<body style="margin:0;padding:0;background:#f4f1ea">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f1ea"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e1d2">
  <tr><td style="padding:0;line-height:0;background:#272A5D"><img src="${SITE_URL}/assets/img/email/entete-lme.jpg" width="600" alt="La Muse Éloquente · Éloquence &amp; Impact" style="display:block;width:100%;max-width:600px;height:auto;border:0"></td></tr>
  <tr><td style="padding:30px 32px 8px;font-family:Arial,Helvetica,sans-serif;color:#1d1f33">
    <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;font-weight:700;color:#272A5D">${titre}</h1>
    ${paragraphes.map((p) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#1d1f33;text-align:justify">${p}</p>`).join("")}
  </td></tr>
  ${blocs}
  ${bouton ? `<tr><td style="padding:8px 32px 10px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:999px;background:#B48028"><a href="${bouton.lien}" style="display:inline-block;padding:15px 30px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px">${bouton.texte} →</a></td></tr></table></td></tr>` : ""}
  ${signature ? `<tr><td style="padding:18px 32px 8px;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.45;font-style:italic;color:#B48028">Mazidath Bello<br><span style="font-size:15px;color:#6b6f85">Fondatrice de La Muse Éloquente</span></td></tr>` : ""}
  <tr><td align="center" style="padding:22px 32px 6px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1d1f33;border-top:1px solid #efe9dc">
    ${RESEAUX.map((r) => `<a href="${r.url}" style="color:#272A5D;text-decoration:none;font-weight:700;margin:0 7px">${r.nom}</a>`).join(" · ")}
  </td></tr>
  <tr><td style="padding:12px 32px 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#6b6f85;text-align:center">
    ${mention || "Vous recevez cet e-mail suite à votre demande sur"} <a href="${SITE_URL}" style="color:#272A5D">${SITE_URL.replace("https://", "")}</a>.
  </td></tr>
</table></td></tr></table></body></html>`;
  const text = [titre, "", ...paragraphes.map((p) => p.replace(/<br>/g, "\n").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&")), texteBlocs, bouton ? `\n${bouton.texte} : ${bouton.lien}` : "", signature ? "\nMazidath Bello\nFondatrice de La Muse Éloquente" : "", "", ...RESEAUX.map((r) => `${r.nom} : ${r.url}`), SITE_URL].join("\n");
  return { html, text };
}

// Tableau « champ : valeur » pour les notifications internes.
function tableau(lignes) {
  const l = lignes.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "");
  return {
    blocs: `<tr><td style="padding:0 32px 14px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #efe9dc;border-radius:12px">
${l.map(([k, v], i) => `<tr><td style="padding:10px 14px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b6f85;width:38%;vertical-align:top;${i ? "border-top:1px solid #efe9dc;" : ""}">${echappe(k)}</td><td style="padding:10px 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1d1f33;${i ? "border-top:1px solid #efe9dc;" : ""}white-space:pre-wrap">${echappe(v)}</td></tr>`).join("\n")}
</table></td></tr>`,
    texteBlocs: "\n" + l.map(([k, v]) => `${k} : ${v}`).join("\n"),
  };
}

async function envoyer(messages) {
  const from = expediteur();
  if (!from) {
    console.error("Envoi impossible : RESEND_API_KEY ou NOTIFICATION_FROM_EMAIL (domaine vérifié) manquant.");
    return { envoyes: 0 };
  }
  const res = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(messages.map((m) => ({ from, ...m }))),
  });
  if (!res.ok) {
    console.error("Échec d'envoi Resend :", res.status, await res.text().catch(() => ""));
    return { envoyes: 0 };
  }
  return { envoyes: messages.length };
}

module.exports = { SITE_URL, site, echappe, emailValide, destinataireAdmin, gabarit, tableau, envoyer };
