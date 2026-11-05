// Inscription Speak & Conquer et création du paiement FedaPay. Traitement : netlify/lib/speak-and-conquer.js
import "../lib/require-esm.mjs";
import { inscrire } from "../lib/speak-and-conquer.js";
import { adapter } from "../lib/v2.js";

export default adapter(inscrire);
