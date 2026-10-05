import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "acorn";

// Checks that every top-level dist/*.js bundle parses as ES5 (IE11 support).
const dist = fileURLToPath(new URL("../dist", import.meta.url));
const files = readdirSync(dist).filter((name) => name.endsWith(".js"));
let failures = 0;

for (const name of files) {
  try {
    parse(readFileSync(join(dist, name), "utf8"), { ecmaVersion: 5, sourceType: "script" });
  } catch (error) {
    console.error(`check-es5: dist/${name} is not ES5: ${error.message}`);
    failures++;
  }
}

console.log(`check-es5: ${files.length} files checked, ${failures} not ES5`);
process.exitCode = files.length && !failures ? 0 : 1;
