// Inscriptions Speak & Conquer payées par FedaPay.
// 1. inscrire : coordonnées de l'élève + formule → transaction FedaPay, inscription gardée dans Netlify Blobs.
// 2. statut   : au retour du paiement, vérification auprès de FedaPay ; si le paiement est approuvé,
//               e-mail de bienvenue (avec le lien de l'agenda) à l'élève et notification à La Muse Éloquente, une seule fois.
// Variables Netlify : FEDAPAY_SECRET_KEY, FEDAPAY_ENV ("sandbox" pour les tests), plus celles de lib/emails.js.
const crypto = require("crypto");
const programme = require("../../content/programmes/speak-and-conquer.json");
const { site, SITE_URL, echappe, emailValide, destinataireAdmin, gabarit, tableau, envoyer } = require("./emails");

const reponse = (statusCode, body) => ({ statusCode, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify(body) });
const magasin = () => (globalThis.__lmeBlobs || require("@netlify/blobs")).getStore({ name: "speak-and-conquer", consistency: "strong" });
const apiBase = () => ((process.env.FEDAPAY_ENV || "live") === "sandbox" ? "https://sandbox-api.fedapay.com" : "https://api.fedapay.com");
const lienAgenda = () => site.reservation && site.reservation.seances;

async function fedapay(chemin, method, body) {
  const cle = process.env.FEDAPAY_SECRET_KEY;
  if (!cle) throw new Error("FEDAPAY_SECRET_KEY manquante dans les variables d'environnement.");
  const res = await fetch(`${apiBase()}/v1${chemin}`, {
    method,
    headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data && data.message) || `Erreur FedaPay (HTTP ${res.status})`);
  return data;
}

// Formule complète, ou versement d'un paiement en deux fois (Standard et Prestige, sur demande).
const PAGE_DEUX_FOIS = "/programmes/speak-and-conquer/paiement-en-deux-fois/";
function offre(id) {
  const f = programme.formules.find((x) => x.id === id);
  if (f) return { ...f, etape: 0 };
  const v = (programme.versements || []).find((x) => x.id === id);
  const base = v && programme.formules.find((x) => x.id === v.formule);
  if (!v || !base) return null;
  return { ...base, id: v.id, nom: `${base.nom} (${v.libelle})`, formuleNom: base.nom, libelle: v.libelle, prixNum: v.prixNum, prixFcfa: v.prixFcfa, etape: v.etape };
}
const fcfa = (n) => `${Number(n).toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")} FCFA`;

const nettoyer = (s, max = 80) => String(s || "").replace(/\s+/g, " ").trim().slice(0, max);

async function inscrire(event) {
  if (event.httpMethod !== "POST") return reponse(405, { error: "Méthode non autorisée" });
  let p;
  try { p = JSON.parse(event.body || "{}"); } catch { return reponse(400, { error: "Requête invalide." }); }
  if (p.siteWeb) return reponse(400, { error: "Requête invalide." });
  const formule = offre(p.formule);
  if (!formule || !Number.isFinite(formule.prixNum)) return reponse(400, { error: "Formule inconnue." });
  const eleve = { prenom: nettoyer(p.prenom, 60), nom: nettoyer(p.nom, 60), email: nettoyer(p.email, 120).toLowerCase(), whatsapp: nettoyer(p.whatsapp, 30), pays: nettoyer(p.pays, 60) };
  if (!eleve.prenom || !eleve.nom) return reponse(400, { error: "Merci d'indiquer votre prénom et votre nom." });
  if (!emailValide(eleve.email)) return reponse(400, { error: "Merci d'indiquer une adresse e-mail valide : vous y recevrez le lien de réservation de vos séances." });
  if (!/^[+\d][\d\s().-]{6,}$/.test(eleve.whatsapp)) return reponse(400, { error: "Merci d'indiquer votre numéro WhatsApp, avec l'indicatif du pays." });

  const id = crypto.randomBytes(12).toString("hex");
  let transaction;
  try {
    const cree = await fedapay("/transactions", "POST", {
      description: `Speak & Conquer - Formule ${formule.nom} - ${eleve.prenom} ${eleve.nom}`,
      amount: formule.prixNum,
      currency: { iso: "XOF" },
      callback_url: `${process.env.URL || SITE_URL}/merci-paiement/?inscription=${id}`,
      customer: { firstname: eleve.prenom, lastname: eleve.nom, email: eleve.email },
    });
    transaction = cree["v1/transaction"];
    if (!transaction || !transaction.id) throw new Error("Réponse FedaPay inattendue lors de la création de la transaction.");
  } catch (err) {
    console.error("Speak & Conquer, création du paiement :", err.message);
    return reponse(502, { error: /FEDAPAY_SECRET_KEY/.test(err.message) ? "Le paiement en ligne est momentanément indisponible." : "Impossible de créer le paiement. Merci de réessayer." });
  }
  await magasin().setJSON(`inscriptions/${id}`, {
    id, formule: formule.id, montant: formule.prixNum, eleve, transactionId: transaction.id, statut: "attente", creeLe: new Date().toISOString(),
  });
  try {
    const jeton = await fedapay(`/transactions/${transaction.id}/token`, "POST");
    if (!jeton.url) throw new Error("Réponse FedaPay inattendue lors de la génération du lien de paiement.");
    return reponse(200, { url: jeton.url });
  } catch (err) {
    console.error("Speak & Conquer, lien de paiement :", err.message);
    return reponse(502, { error: "Impossible de créer le paiement. Merci de réessayer." });
  }
}

function emails(ins) {
  const f = offre(ins.formule) || { nom: ins.formule, seances: "", duree: "", etape: 0 };
  const e = ins.eleve;
  const agenda = lienAgenda();
  const site = process.env.URL || SITE_URL;
  const montant = fcfa(ins.montant);
  let client, admin;
  if (f.etape === 2) {
    client = {
      subject: `Second versement reçu · Speak & Conquer · Formule ${f.formuleNom}`,
      ...gabarit(`Merci ${echappe(e.prenom)}, votre parcours est entièrement réglé.`, [
        `Votre second versement de <strong>${montant}</strong> pour la formule <strong>${echappe(f.formuleNom)}</strong> de Speak &amp; Conquer est bien enregistré.`,
        "Vous pouvez continuer à réserver vos prochaines séances dans mon agenda, avec le même lien que d'habitude.",
      ], { bouton: agenda ? { texte: "Réserver ma prochaine séance", lien: agenda } : null, mention: "Vous recevez cet e-mail suite à votre paiement sur" }),
    };
    admin = { titre: "Second versement reçu", intro: `<strong>${echappe(e.prenom)} ${echappe(e.nom)}</strong> vient de régler le second versement de la formule <strong>${echappe(f.formuleNom)}</strong>. Son parcours est entièrement payé.` };
  } else {
    const deuxFois = f.etape === 1;
    client = {
      subject: `Bienvenue dans Speak & Conquer · Formule ${deuxFois ? f.formuleNom : f.nom}`,
      ...gabarit(`Bienvenue ${echappe(e.prenom)}, l'aventure commence.`, [
        `Votre ${deuxFois ? "premier versement" : "paiement"} pour la formule <strong>${echappe(deuxFois ? f.formuleNom : f.nom)}</strong> de Speak &amp; Conquer est bien enregistré${f.seances ? ` : ${f.seances} séances individuelles de 60 minutes, sur ${echappe(f.duree)}` : ""}.`,
        ...(deuxFois ? [`Vous avez choisi le paiement en deux fois : le second versement de <strong>${montant}</strong> sera à régler à mi-parcours. Je vous enverrai le lien le moment venu.`] : []),
        "Réservez dès maintenant votre première séance dans mon agenda. Gardez précieusement cet e-mail : le même lien vous servira pour réserver les séances suivantes.",
        "Une question avant notre première rencontre ? Répondez simplement à cet e-mail.",
      ], { bouton: agenda ? { texte: "Réserver ma première séance", lien: agenda } : null, mention: "Vous recevez cet e-mail suite à votre inscription sur" }),
    };
    admin = deuxFois
      ? { titre: "Nouvelle inscription (paiement en deux fois)", intro: `<strong>${echappe(e.prenom)} ${echappe(e.nom)}</strong> vient de régler le premier versement de la formule <strong>${echappe(f.formuleNom)}</strong>. Le lien de votre agenda lui a été envoyé par e-mail.`, suite: `À mi-parcours, envoyez-lui le lien du second versement : ${site}${PAGE_DEUX_FOIS}` }
      : { titre: "Nouvelle inscription Speak &amp; Conquer", intro: `<strong>${echappe(e.prenom)} ${echappe(e.nom)}</strong> vient de payer la formule <strong>${echappe(f.nom)}</strong>. Le lien de votre agenda lui a été envoyé par e-mail.` };
  }
  return [
    { to: [e.email], reply_to: destinataireAdmin(), ...client },
    {
      to: [destinataireAdmin()],
      reply_to: e.email,
      subject: `${admin.titre.replace("&amp;", "&")} · ${f.nom} · ${e.prenom} ${e.nom}`,
      ...gabarit(admin.titre, [admin.intro, ...(admin.suite ? [admin.suite] : []), "Répondez à cet e-mail pour lui écrire directement."], {
        ...tableau([
          ["Formule", `${f.nom} (${f.seances} séances)`], ["Montant", montant],
          ["Prénom et nom", `${e.prenom} ${e.nom}`], ["E-mail", e.email], ["WhatsApp", e.whatsapp], ["Pays", e.pays],
          ["Référence FedaPay", ins.transactionId], ["Payé le", new Date(ins.payeLe || Date.now()).toLocaleString("fr-FR", { timeZone: "Africa/Porto-Novo" })],
        ]),
        signature: false, mention: "Notification automatique du site",
      }),
    },
  ];
}

async function statut(event) {
  const id = String((event.queryStringParameters || {}).inscription || "");
  if (!/^[0-9a-f]{24}$/.test(id)) return reponse(400, { error: "Inscription inconnue." });
  const store = magasin();
  const lu = await store.getWithMetadata(`inscriptions/${id}`, { type: "json" });
  if (!lu || !lu.data) return reponse(404, { error: "Inscription inconnue." });
  let ins = lu.data;
  let statutFedapay = null;
  if (ins.statut !== "payee") {
    try {
      const t = (await fedapay(`/transactions/${ins.transactionId}`, "GET"))["v1/transaction"];
      statutFedapay = t && t.status;
      if (statutFedapay === "approved" && Number(t.amount) === Number(ins.montant)) {
        const payee = { ...ins, statut: "payee", payeLe: t.approved_at || new Date().toISOString() };
        // Écriture conditionnelle : si deux onglets vérifient en même temps, un seul envoie les e-mails.
        const res = await store.setJSON(`inscriptions/${id}`, payee, { onlyIfMatch: lu.etag });
        if (res.modified) {
          ins = payee;
          const { envoyes } = await envoyer(emails(ins));
          if (!envoyes) console.error(`Speak & Conquer : e-mails non envoyés pour l'inscription ${id}.`);
        } else {
          ins = (await store.get(`inscriptions/${id}`, { type: "json" })) || payee;
        }
      }
    } catch (err) {
      console.error("Speak & Conquer, vérification du paiement :", err.message);
    }
  }
  if (ins.statut !== "payee") {
    const echec = ["declined", "canceled", "cancelled", "refunded", "expired"].includes(statutFedapay);
    return reponse(200, { statut: echec ? "echec" : "attente" });
  }
  const f = offre(ins.formule) || {};
  return reponse(200, { statut: "payee", prenom: ins.eleve.prenom, email: ins.eleve.email, formule: f.nom, seances: f.seances, agenda: lienAgenda() });
}

module.exports = { inscrire, statut, emails };
