import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

try {
  const packageJsonContent = JSON.parse(readFileSync(resolve("package.json"), "utf8"));

  const manifestPath = resolve("public", "manifest.json");
  const manifestContent = JSON.parse(readFileSync(manifestPath, "utf8"));

  if (packageJsonContent.version.includes("-")) {
    manifestContent.version = packageJsonContent.version.split("-")[0];
    manifestContent.version_name = packageJsonContent.version;
  } else {
    manifestContent.version = packageJsonContent.version;
    manifestContent.version_name = undefined;
  }

  writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 4));

  console.log("Success! Version in manifest.json updated.");
} catch (error) {
  console.error("Error! Failed to update manifest.json:", error);
}
