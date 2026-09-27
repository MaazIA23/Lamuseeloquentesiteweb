/* La Muse Éloquente — interactions légères (aucune dépendance). */
(() => {
  const doc = document.documentElement;
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu mobile ---------- */
  const burger = document.querySelector("[data-burger]");
  const menu = document.querySelector("[data-menu]");
  const fermer = () => {
    burger.setAttribute("aria-expanded", "false");
    burger.querySelector(".sr").textContent = "Ouvrir le menu";
    menu.hidden = true;
    document.body.classList.remove("menu-ouvert");
  };
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const ouvert = burger.getAttribute("aria-expanded") === "true";
      if (ouvert) return fermer();
      burger.setAttribute("aria-expanded", "true");
      burger.querySelector(".sr").textContent = "Fermer le menu";
      menu.hidden = false;
      document.body.classList.add("menu-ouvert");
      menu.querySelector("a")?.focus({ preventScroll: true });
    });
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) fermer(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { fermer(); burger.focus(); } });
    window.matchMedia("(min-width: 1000px)").addEventListener("change", (m) => m.matches && fermer());
  }

  /* ---------- En-tête : filet au défilement ---------- */
  const entete = document.querySelector("[data-entete]");
  const surDefilement = () => entete?.classList.toggle("est-defile", window.scrollY > 8);
  surDefilement();
  window.addEventListener("scroll", surDefilement, { passive: true });

  /* ---------- Apparitions & fil doré ---------- */
  const cibles = document.querySelectorAll("[data-reveal], .fil");
  if (reduit || !("IntersectionObserver" in window)) {
    cibles.forEach((el) => el.classList.add("est-visible"));
  } else {
    const io = new IntersectionObserver(
      (entrees) => entrees.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("est-visible"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    cibles.forEach((el) => io.observe(el));
    // Filet de sécurité : rien ne doit rester invisible (impression, capture, navigateur lent).
    window.addEventListener("beforeprint", () => cibles.forEach((el) => el.classList.add("est-visible")));
  }

  /* ---------- Chiffres : apparition progressive ---------- */
  // « +70K », « 15+ », « +10M » comptent depuis zéro ; les années (2024) restent fixes.
  const compteurs = document.querySelectorAll("[data-compteur]");
  if (!reduit && "IntersectionObserver" in window) {
    const ioc = new IntersectionObserver((entrees) => entrees.forEach((e) => {
      if (!e.isIntersecting) return;
      ioc.unobserve(e.target);
      const el = e.target, final = el.textContent;
      const m = final.match(/^(\D*)(\d+)(\D*)$/);
      if (!m || +m[2] >= 1000) return;
      const cible = +m[2], debut = performance.now(), duree = 1400;
      const pas = (t) => {
        const k = Math.min(1, (t - debut) / duree), v = Math.round(cible * (1 - Math.pow(1 - k, 3)));
        el.textContent = m[1] + v + m[3];
        if (k < 1) requestAnimationFrame(pas); else el.textContent = final;
      };
      requestAnimationFrame(pas);
    }), { threshold: 0.6 });
    compteurs.forEach((el) => ioc.observe(el));
  }

  /* ---------- Consentement cookies (conservé 6 mois dans le navigateur) ---------- */
  const CLE = "lme-cookies", DUREE = 182 * 24 * 3600 * 1000;
  const lireChoix = () => {
    try {
      const c = JSON.parse(localStorage.getItem(CLE) || "null");
      return c && Date.now() - c.date < DUREE ? c.choix : null;
    } catch (e) { return null; }
  };
  let choix = lireChoix();
  const bandeau = document.querySelector("[data-cookies]");
  const afficherBandeau = (oui) => {
    if (!bandeau) return;
    bandeau.hidden = !oui;
    document.body.classList.toggle("cookies-ouvert", oui);
  };
  const enregistrer = (valeur) => {
    choix = valeur;
    try { localStorage.setItem(CLE, JSON.stringify({ choix: valeur, date: Date.now() })); } catch (e) {}
    afficherBandeau(false);
    if (valeur === "oui") document.querySelectorAll(".video__accord").forEach((a) => a.remove());
  };
  if (!choix) afficherBandeau(true);
  document.querySelectorAll("[data-cookies-choix]").forEach((b) => b.addEventListener("click", () => enregistrer(b.dataset.cookiesChoix)));
  document.querySelectorAll("[data-cookies-ouvrir]").forEach((b) => b.addEventListener("click", () => {
    afficherBandeau(true);
    bandeau && bandeau.querySelector("button").focus();
  }));

  /* ---------- Vidéos YouTube : le lecteur ne se charge qu'au clic, et avec accord ---------- */
  const lire = (btn) => {
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.youtube}?autoplay=1&rel=0`;
    f.title = btn.getAttribute("aria-label") || "Vidéo";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.allowFullscreen = true;
    btn.replaceWith(f);
  };
  document.querySelectorAll("[data-youtube]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (choix === "oui") return lire(btn);
      const cadre = btn.parentElement;
      if (cadre.querySelector(".video__accord")) return;
      const accord = document.createElement("div");
      accord.className = "video__accord";
      accord.innerHTML = `<p>Cette vidéo est hébergée par YouTube, qui peut déposer des cookies.</p>
        <button class="btn btn--petit btn--clair" type="button">Accepter et lire</button>
        <a class="lien" href="https://www.youtube.com/watch?v=${btn.dataset.youtube}" target="_blank" rel="noopener">Voir sur YouTube</a>`;
      accord.querySelector("button").addEventListener("click", () => { enregistrer("oui"); lire(btn); });
      cadre.appendChild(accord);
      accord.querySelector("button").focus();
    });
  });

  /* ---------- Paiement FedaPay (Speak & Conquer) ---------- */
  document.querySelectorAll("[data-fedapay]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const note = btn.parentElement.querySelector("[data-fedapay-note]");
      const texte = note ? note.textContent : "";
      btn.disabled = true;
      if (note) note.textContent = "Redirection vers le paiement sécurisé…";
      fetch("/.netlify/functions/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formule: btn.dataset.fedapay })
      })
        .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
          if (ok && data.url) { location.href = data.url; return; }
          throw new Error(data && data.error);
        })
        .catch((err) => {
          btn.disabled = false;
          if (note) note.textContent = (err && err.message) || "Impossible de contacter le service de paiement. Merci de réessayer.";
          setTimeout(() => { if (note) note.textContent = texte; }, 8000);
        });
    });
  });

  /* ---------- Barre d'action mobile ---------- */
  const barre = document.querySelector("[data-barre]");
  const premier = document.querySelector("main > section");
  const fin = document.querySelector(".final, .pied");
  if (barre && premier && "IntersectionObserver" in window) {
    barre.hidden = false;
    let apresHero = false, finVisible = false;
    const maj = () => barre.classList.toggle("est-visible", apresHero && !finVisible);
    new IntersectionObserver(([e]) => { apresHero = !e.isIntersecting; maj(); }).observe(premier);
    if (fin) new IntersectionObserver(([e]) => { finVisible = e.isIntersecting; maj(); }).observe(fin);
  }

  doc.classList.add("pret");
})();
