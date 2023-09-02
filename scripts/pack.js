import AdmZip from "adm-zip";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { dirname, parse, resolve } from "path";

try {
  const __dirname = resolve(dirname(""));
  const { base } = parse(__dirname);
  const { version, version_name } = JSON.parse(readFileSync(resolve(__dirname, "dist", "manifest.json"), "utf8"));

  const outdir = "release";
  const filename = `${base}-v${version_name || version}.zip`;
  const zip = new AdmZip();
  zip.addLocalFolder("dist");
  if (!existsSync(outdir)) {
    mkdirSync(outdir);
  }
  zip.writeZip(`${outdir}/${filename}`);

  console.log(`Success! Created a ${filename} file under ${outdir} directory. You can upload this file to web store.`);
} catch (e) {
  console.log(e);
  console.error("Error! Failed to generate a zip file.");
}
