// Déclenchée par Netlify à chaque envoi de formulaire (Netlify Forms).
// Formulaire « devis » : notification détaillée à La Muse Éloquente + accusé de réception à la personne.
const { echappe, emailValide, destinataireAdmin, gabarit, tableau, envoyer } = require("../lib/emails");

exports.handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body || "{}");
    if (!payload || payload.form_name !== "devis") return { statusCode: 200, body: "ignoré" };
    const d = payload.data || {};
    if (d["site-web"]) return { statusCode: 200, body: "robot" };
    const email = String(d.email || "").trim();
    const nom = String(d.nom || "").trim();
    const prenom = nom.split(/\s+/)[0] || "";
    const messages = [];

    const t = tableau([
      ["Nom", nom], ["Organisation", d.organisation], ["E-mail", email], ["Téléphone / WhatsApp", d.telephone],
      ["Prestation", d.type], ["Budget indicatif", d.budget], ["Date envisagée", d.date], ["Lieu ou format", d.lieu],
      ["Public", d.public], ["Projet", d.message],
    ]);
    messages.push({
      to: [destinataireAdmin()],
      ...(emailValide(email) ? { reply_to: email } : {}),
      subject: `Nouvelle demande de devis · ${d.type || "Prestation"} · ${nom || email}`,
      ...gabarit("Nouvelle demande de devis", [
        `<strong>${echappe(nom || "Une personne")}</strong>${d.organisation ? ` (${echappe(d.organisation)})` : ""} vient d'envoyer une demande depuis le site.`,
        "Répondez directement à cet e-mail pour lui écrire.",
      ], { ...t, signature: false, mention: "Notification automatique du site" }),
    });

    if (emailValide(email)) {
      messages.push({
        to: [email],
        reply_to: destinataireAdmin(),
        subject: "Votre demande est bien arrivée · La Muse Éloquente",
        ...gabarit(prenom ? `Merci ${echappe(prenom)}, votre demande est bien arrivée.` : "Votre demande est bien arrivée.", [
          `J'ai bien reçu votre demande${d.type ? ` pour une prestation « ${echappe(d.type)} »` : ""}. Je l'étudie avec attention et je reviens vers vous personnellement dans les meilleurs délais.`,
          "Si votre projet est urgent, vous pouvez aussi me répondre directement à cet e-mail.",
        ], { bouton: { texte: "Découvrir mes interventions", lien: "https://lamuseeloquente.fr/travailler-avec-moi/" } }),
      });
    }
    const { envoyes } = await envoyer(messages);
    return { statusCode: 200, body: `${envoyes} e-mail(s) envoyé(s)` };
  } catch (err) {
    console.error("submission-created :", err.message);
    return { statusCode: 200, body: "erreur" };
  }
};
