/*
 * Optimisation des photos.
 * Déposez les originaux dans /photos puis lancez : npm run images
 * Chaque photo est déclinée en WebP (480, 960, 1600 px de large, sans agrandir)
 * dans /assets/img, et ses dimensions sont notées dans assets/img/manifest.json
 * pour que le site produise des images responsives (srcset) sans décalage de mise en page.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "photos");
const OUT = path.join(ROOT, "assets", "img");
const WIDTHS = [480, 960, 1600];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = {};
  const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();

  for (const file of files) {
    const name = path.parse(file).name;
    const input = sharp(path.join(SRC, file)).rotate();
    const { width, height } = await input.metadata();
    const widths = WIDTHS.filter((w) => w < width).concat(width > WIDTHS.at(-1) ? [] : [width]);
    const unique = [...new Set(widths.map((w) => Math.min(w, WIDTHS.at(-1))))];

    for (const w of unique) {
      const dest = path.join(OUT, `${name}-${w}.webp`);
      if (!fs.existsSync(dest)) {
        await sharp(path.join(SRC, file)).rotate().resize({ width: w }).webp({ quality: 74 }).toFile(dest);
      }
    }
    manifest[name] = { width, height, widths: unique };
    console.log(`✓ ${name} → ${unique.join(", ")} px`);
  }

  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
})();
