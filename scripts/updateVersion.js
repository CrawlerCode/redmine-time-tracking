import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

try {
  const packageJsonContent = JSON.parse(readFileSync(resolve("package.json"), "utf8"));

  const manifestPath = resolve("public", "manifest.json");
  const manifestContent = JSON.parse(readFileSync(manifestPath, "utf8"));

  manifestContent.version = packageJsonContent.version;

  writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 4));

  console.log("Success! Version in manifest.json updated.");
} catch (error) {
  console.error("Error! Failed to update manifest.json:", error);
}
