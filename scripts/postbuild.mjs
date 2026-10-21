// GitHub Pages has no server-side routing. Serving index.html as 404.html makes
// direct visits to /features, /install, etc. load the app, which then shows the right page.
import { copyFileSync, writeFileSync } from "node:fs";
copyFileSync("dist/index.html", "dist/404.html");
writeFileSync("dist/.nojekyll", "");
console.log("postbuild: wrote dist/404.html and dist/.nojekyll");
