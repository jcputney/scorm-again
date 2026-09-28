import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scorm-again-package-"));
const namedExports = {
  "./scorm12": "Scorm12API",
  "./scorm2004": "Scorm2004API",
  "./cross-frame-api": "CrossFrameAPI",
  "./cross-frame-lms": "CrossFrameLMS",
};

function run(command, args, cwd) {
  // File capture also works when a sandbox restricts subprocess pipes.
  const stdout = path.join(tmp, "stdout");
  const stderr = path.join(tmp, "stderr");
  const fds = [fs.openSync(stdout, "w"), fs.openSync(stderr, "w")];
  try {
    execFileSync(command, args, {
      cwd,
      stdio: ["ignore", ...fds],
      env: { ...process.env, npm_config_cache: path.join(tmp, "npm-cache") },
    });
    return fs.readFileSync(stdout, "utf8");
  } catch (error) {
    throw new Error(fs.readFileSync(stderr, "utf8").trim() || error.message);
  } finally {
    for (const fd of fds) fs.closeSync(fd);
  }
}

function check(consumer, subpath, source, expected, label = "keys") {
  let actual;
  try {
    const code = `try { ${source} } catch (error) {
      console.error(error.message); process.exitCode = 1;
    }`;
    actual = JSON.parse(run(process.execPath, [...consumer.flags, "-e", code], consumer.dir));
    assert.deepStrictEqual(actual, expected, `expected ${label}=${JSON.stringify(expected)}`);
    console.log(`PASS ${consumer.kind} ${subpath}`);
  } catch (error) {
    process.exitCode = 1;
    const detail = error.message.replace(/\s+/g, " ");
    console.log(
      `FAIL ${consumer.kind} ${subpath}: actual ${label}=${JSON.stringify(actual) ?? "unavailable"}; ${detail}`,
    );
  }
}

try {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const subpaths = Object.keys(pkg.exports).map((subpath) => {
    if (subpath === "." || subpath === "./min") {
      return [subpath, Object.values(namedExports).sort()];
    }
    const mapping = Object.entries(namedExports).find(([prefix]) => subpath.startsWith(prefix));
    if (!mapping) throw new Error(`No expected exports mapped for ${subpath}`);
    return [subpath, [mapping[1]]];
  });
  const [{ filename }] = JSON.parse(
    run("npm", ["pack", "--json", "--pack-destination", tmp], root),
  );
  const tarball = path.join(tmp, filename);

  for (const kind of ["CJS", "ESM"]) {
    const dir = path.join(tmp, kind.toLowerCase());
    fs.mkdirSync(dir);
    fs.writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify({
        name: `smoke-${kind.toLowerCase()}`,
        private: true,
        ...(kind === "ESM" ? { type: "module" } : {}),
      }),
    );
    run("npm", ["install", "--no-audit", "--no-fund", "--no-save", tarball], dir);
    const consumer = { kind, dir, flags: kind === "ESM" ? ["--input-type=module"] : [] };
    const load = (spec) =>
      `${kind === "CJS" ? "require" : "await import"}(${JSON.stringify(spec)})`;

    for (const [subpath, expected] of subpaths) {
      const spec = subpath === "." ? pkg.name : pkg.name + subpath.slice(1);
      check(
        consumer,
        subpath,
        `const mod = ${load(spec)};
         console.log(JSON.stringify(Object.keys(mod).filter(key => typeof mod[key] === "function").sort()));`,
        expected,
      );
    }
    check(
      consumer,
      './scorm12 lmsInitialize("")',
      `const { Scorm12API } = ${load("scorm-again/scorm12")};
       console.log(JSON.stringify(new Scorm12API({ logLevel: 5 }).lmsInitialize("")));`,
      "true",
      "result",
    );
  }
} catch (error) {
  process.exitCode = 1;
  console.error(`FAIL setup package: ${error.message.replace(/\s+/g, " ")}`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
