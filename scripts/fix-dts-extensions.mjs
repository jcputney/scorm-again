import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

let filesChanged = 0;
let specifiersRewritten = 0;
let warnings = 0;

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(file);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".d.ts")) continue;

    const original = readFileSync(file, "utf8");
    const updated = original.replace(
      /(\bfrom\s+|\bimport\s*\(\s*)(["'])(\.{1,2}\/[^"'\r\n]*)\2/g,
      (match, prefix, quote, specifier) => {
        if (specifier.endsWith(".js")) return match;

        const resolved = resolve(dirname(file), specifier);
        let suffix;
        if (existsSync(`${resolved}.d.ts`)) {
          suffix = ".js";
        } else if (existsSync(join(resolved, "index.d.ts"))) {
          suffix = "/index.js";
        } else {
          console.warn(
            `Warning: ${file}: unresolved specifier ${quote}${specifier}${quote}`,
          );
          warnings++;
          return match;
        }

        specifiersRewritten++;
        return `${prefix}${quote}${specifier}${suffix}${quote}`;
      },
    );

    if (updated !== original) {
      writeFileSync(file, updated);
      filesChanged++;
    }
  }
}

walk(fileURLToPath(new URL("../dist/types", import.meta.url)));
console.log(
  `fix-dts-extensions: ${filesChanged} files changed, ${specifiersRewritten} specifiers rewritten, ${warnings} warnings`,
);
process.exitCode = warnings ? 1 : 0;
