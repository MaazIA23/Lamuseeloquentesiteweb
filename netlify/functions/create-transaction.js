/*
 * Crée une transaction FedaPay pour une formule Speak & Conquer et renvoie l'URL de paiement.
 * Même principe que le site Deux Minutes Pour Convaincre :
 *   - FEDAPAY_SECRET_KEY : clé secrète (variable d'environnement Netlify, jamais dans le code)
 *   - FEDAPAY_ENV        : "live" (défaut) ou "sandbox" pour les tests
 * Le montant n'est jamais fourni par le navigateur : il est lu dans content/programmes/speak-and-conquer.json.
 */
const programme = require("../../content/programmes/speak-and-conquer.json");

function apiBase() {
  return (process.env.FEDAPAY_ENV || "live") === "sandbox" ? "https://sandbox-api.fedapay.com" : "https://api.fedapay.com";
}

async function fedapayRequest(path, method, secretKey, body) {
  const res = await fetch(`${apiBase()}/v1${path}`, {
    method,
    headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data && data.message) || `Erreur FedaPay (HTTP ${res.status})`);
  return data;
}

const reponse = (statusCode, body) => ({ statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return reponse(405, { error: "Méthode non autorisée" });

  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch { return reponse(400, { error: "Requête invalide" }); }

  const formule = programme.formules.find((f) => f.id === payload.formule);
  if (!formule || !Number.isFinite(formule.prixNum)) return reponse(400, { error: "Formule inconnue." });

  const secretKey = process.env.FEDAPAY_SECRET_KEY;
  if (!secretKey) {
    console.error("FEDAPAY_SECRET_KEY manquante dans les variables d'environnement.");
    return reponse(500, { error: "Le paiement en ligne est momentanément indisponible." });
  }

  const siteUrl = process.env.URL || `https://${event.headers.host}`;
  try {
    const created = await fedapayRequest("/transactions", "POST", secretKey, {
      description: `Speak & Conquer - Formule ${formule.nom}`,
      amount: formule.prixNum,
      currency: { iso: "XOF" },
      callback_url: `${siteUrl}/merci-paiement/`
    });
    const id = created["v1/transaction"] && created["v1/transaction"].id;
    if (!id) throw new Error("Réponse FedaPay inattendue lors de la création de la transaction.");
    const token = await fedapayRequest(`/transactions/${id}/token`, "POST", secretKey);
    if (!token.url) throw new Error("Réponse FedaPay inattendue lors de la génération du lien de paiement.");
    return reponse(200, { url: token.url });
  } catch (err) {
    console.error("Erreur FedaPay:", err.message);
    return reponse(502, { error: "Impossible de créer le paiement. Merci de réessayer." });
  }
};
