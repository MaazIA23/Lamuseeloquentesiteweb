// Retour du paiement Speak & Conquer : vérification FedaPay, e-mails, lien de l'agenda. Traitement : netlify/lib/speak-and-conquer.js
import "../lib/require-esm.mjs";
import { statut } from "../lib/speak-and-conquer.js";
import { adapter } from "../lib/v2.js";

export default adapter(statut);
