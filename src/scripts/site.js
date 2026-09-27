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
