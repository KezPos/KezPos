// GitHub Pages has no server-side routing. We write a real index.html for each
// route (served with HTTP 200, so Google can index them) and keep 404.html as a
// fallback for any other path.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const routes = {
  features: "Features",
  install: "Install",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  "reset-password": "Reset password",
  verify: "Verify",
};

const base = readFileSync("dist/index.html", "utf8");

for (const [route, label] of Object.entries(routes)) {
  const title = `${label} - KezPos`;
  const html = base
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1https://kezpos.co.ke/${route}$2`);
  mkdirSync(`dist/${route}`, { recursive: true });
  writeFileSync(`dist/${route}/index.html`, html);
}

copyFileSync("dist/index.html", "dist/404.html");
writeFileSync("dist/.nojekyll", "");
console.log("postbuild: wrote route pages, dist/404.html and dist/.nojekyll");
