import * as fs from "node:fs";
import * as path from "node:path";
import { unzipSync } from "fflate";

/** Extract trusted test fixtures without following destination links or overwriting files. */
export function extractZip(archive: string, destination: string): void {
  const root = path.resolve(destination);
  fs.mkdirSync(root, { recursive: true });
  const rootStat = fs.lstatSync(root);
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
    throw new Error("ZIP destination must be a real directory");
  }

  const entries = Object.entries(unzipSync(fs.readFileSync(archive)));
  // Validate all names before writing any archive contents. Treat backslashes and
  // drive/stream separators as unsafe on every platform, not just Windows.
  for (const [name] of entries) {
    const parts = name.replace(/\/$/, "").split("/");
    if (/[\\:\0]/.test(name) || parts.some((part) => !part || part === "." || part === "..")) {
      throw new Error("Unsafe ZIP entry path");
    }
  }

  for (const [name, data] of entries) {
    const parts = name.replace(/\/$/, "").split("/");
    const directories = name.endsWith("/") ? parts : parts.slice(0, -1);
    let directory = root;
    for (const part of directories) {
      directory = path.join(directory, part);
      try {
        fs.mkdirSync(directory);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      }
      const stat = fs.lstatSync(directory);
      if (stat.isSymbolicLink() || !stat.isDirectory()) {
        throw new Error("ZIP entry parent must be a real directory");
      }
    }
    if (!name.endsWith("/")) {
      // Exclusive creation also rejects dangling file symlinks and hard links.
      // ZIP symlink attributes are intentionally not materialized as links.
      fs.writeFileSync(path.join(root, ...parts), data, { flag: "wx" });
    }
  }
}
