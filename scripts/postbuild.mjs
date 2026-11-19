// GitHub Pages has no server-side routing. We write a real index.html for each
// route (served with HTTP 200, so Google can index them) and keep 404.html as a
// fallback for any other path. Titles and descriptions come from src/seo.json,
// the same file the routes read, so they cannot drift apart.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const seo = JSON.parse(readFileSync("src/seo.json", "utf8"));
const base = readFileSync("dist/index.html", "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

// Replace the content="" of a meta tag, whatever order its attributes are in.
const setMeta = (html, attr, name, value) =>
  html.replace(
    new RegExp(`(<meta[^>]*${attr}="${name}"[^>]*content=")[^"]*(")`),
    (_, a, b) => `${a}${esc(value)}${b}`,
  );

function build(html, { title, description }, url) {
  let out = html.replace(/<title>.*?<\/title>/, () => `<title>${esc(title)}</title>`);
  out = setMeta(out, "name", "description", description);
  out = setMeta(out, "property", "og:title", title);
  out = setMeta(out, "property", "og:description", description);
  out = setMeta(out, "property", "og:url", url);
  out = setMeta(out, "name", "twitter:title", title);
  out = setMeta(out, "name", "twitter:description", description);
  return out.replace(/(<link rel="canonical" href=")[^"]*(")/, (_, a, b) => `${a}${url}${b}`);
}

// Homepage: make dist/index.html match seo.json too.
writeFileSync("dist/index.html", build(base, seo["/"], "https://kezpos.co.ke/"));

for (const [route, page] of Object.entries(seo)) {
  if (route === "/") continue;
  mkdirSync(`dist/${route}`, { recursive: true });
  writeFileSync(`dist/${route}/index.html`, build(base, page, `https://kezpos.co.ke/${route}`));
}

copyFileSync("dist/index.html", "dist/404.html");
writeFileSync("dist/.nojekyll", "");
console.log("postbuild: wrote route pages, dist/404.html and dist/.nojekyll");
