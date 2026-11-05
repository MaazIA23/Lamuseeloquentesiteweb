// Les fonctions .mjs sont empaquetées en ESM. Ce module, importé en premier par chacune :
// - fournit require aux modules CommonJS embarqués ;
// - charge @netlify/blobs par un vrai import, pour que Netlify l'embarque avec la fonction.
import { createRequire } from "node:module";
import * as blobs from "@netlify/blobs";

if (typeof globalThis.require === "undefined") globalThis.require = createRequire(import.meta.url);
globalThis.__lmeBlobs ??= blobs;
