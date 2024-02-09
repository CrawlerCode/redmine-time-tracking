import AdmZip from "adm-zip";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { resolve } from "path";

try {
  const { version, version_name } = JSON.parse(readFileSync(resolve("dist", "manifest.json"), "utf8"));

  const name = "redmine-time-tracking";
  const outDir = "release";
  const filename = `${name}-v${version_name || version}.zip`;

  const zip = new AdmZip();
  zip.addLocalFolder("dist");
  if (!existsSync(outDir)) {
    mkdirSync(outDir);
  }
  zip.writeZip(`${outDir}/${filename}`);

  console.log(`Success! Created a ${filename} file under ${outDir} directory. You can upload this file to web store.`);
} catch (e) {
  console.log(e);
  console.error("Error! Failed to generate a zip file.");
}
