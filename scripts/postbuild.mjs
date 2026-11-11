// GitHub Pages has no server-side routing. We write a real index.html for each
// route (served with HTTP 200, so Google can index them) and keep 404.html as a
// fallback for any other path.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Titles must match the pageHead() title in each src/routes/*.tsx file, so the
// static HTML crawlers read and the browser tab the router sets agree.
const routes = {
  features: "Features | KezPos",
  install: "Download & Install | KezPos",
  privacy: "Privacy Policy | KezPos",
  terms: "Terms of Service | KezPos",
  "reset-password": "Reset your password | KezPos",
  verify: "Confirm your email | KezPos",
};

const base = readFileSync("dist/index.html", "utf8");

for (const [route, title] of Object.entries(routes)) {
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
