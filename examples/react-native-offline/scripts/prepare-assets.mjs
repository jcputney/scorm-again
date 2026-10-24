// Packs the files the app bundles as assets:
// - assets/scorm-again/scorm-again.zip: dist/scorm-again.min.js, the docs bridge
//   script and the library version
// - assets/courses/minimal-test.zip: the built-in course in course/minimal-test
// The app extracts each zip again when its hash changes, so the zips must be
// byte-for-byte the same when their contents are.
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { zipSync } from "fflate";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const root = path.resolve(scriptDir, "../../..");
let bundle;
try {
  bundle = await readFile(path.join(root, "dist/scorm-again.min.js"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.error("dist/scorm-again.min.js not found. Run `npm ci && npm run build` in the repository root first.");
  process.exit(1);
}
const bridge = await readFile(path.join(root, "docs-site/examples/mobile-bridge.js"));
const { version } = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
async function writeZip(relativePath, entries) {
  const output = path.join(appDir, relativePath);
  await mkdir(path.dirname(output), { recursive: true });
  // A fixed timestamp keeps the zip, and so its hash, stable between runs.
  await writeFile(output, zipSync(entries, { mtime: new Date(2000, 0, 1) }));
  console.log(`Wrote ${relativePath}`);
}
await writeZip("assets/scorm-again/scorm-again.zip", {
  "scorm-again.min.js": bundle,
  "mobile-bridge.js": bridge,
  "version.txt": new TextEncoder().encode(version),
});
const courseDir = path.join(appDir, "course/minimal-test");
const entries = {};
async function collect(directory, prefix = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = prefix + entry.name;
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(filename, name + "/");
    else if (entry.isFile()) entries[name] = await readFile(filename);
  }
}
await collect(courseDir);
await writeZip("assets/courses/minimal-test.zip", entries);
