// @vitest-environment node
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}
// Scan balanced delimiters while ignoring strings and comments. Returning offsets keeps
// diagnostics tied to the original Markdown, including embedded native strings.
function properties(text: string, start: number): { name: string; offset: number }[] {
  const result: { name: string; offset: number }[] = [];
  let depth = 0;
  let quote = "";
  let itemStart = start + 1;
  for (let i = start; i < text.length; i++) {
    const char = text[i]!;
    if (quote) {
      if (char === "\\") i++;
      else if (char === quote) quote = "";
      continue;
    }
    if (text.startsWith("//", i)) {
      i = text.indexOf("\n", i);
      if (i < 0) break;
      continue;
    }
    if (text.startsWith("/*", i)) {
      const end = text.indexOf("*/", i + 2);
      if (end < 0) break;
      i = end + 1;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if ("{[(".includes(char)) depth++;
    if ("}])".includes(char)) depth--;
    if ((char === "," && depth === 1) || depth === 0) {
      const item = text
        .slice(itemStart, i)
        .replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (comment) => " ".repeat(comment.length));
      const match = /^\s*(?:([\w$]+)|["']([^"']+)["'])\s*(?=:|\(|,|$)/.exec(item);
      if (match)
        result.push({ name: match[1] || match[2]!, offset: itemStart + match[0].search(/\S/) });
      itemStart = i + 1;
    }
    if (depth === 0) break;
  }
  return result;
}
const defaults = readFileSync(join(root, "src/constants/default_settings.ts"), "utf8");
const types = readFileSync(join(root, "src/types/api_types.ts"), "utf8");
const settings = new Set(
  properties(defaults, defaults.indexOf("{", defaults.indexOf("export const DefaultSettings"))).map(
    ({ name }) => name,
  ),
);
const settingsBody = /export type Settings\s*=\s*\{([\s\S]*?)^};/m.exec(types)![1]!;
for (const match of settingsBody.matchAll(/^\s*(\w+)\??\s*:/gm)) settings.add(match[1]!);
const events = new Set<string>();
for (const path of files(join(root, "src")).filter((path) => path.endsWith(".ts"))) {
  const source = readFileSync(path, "utf8");
  // Read every string in the first argument, so `ok ? "A" : "B"` yields both names.
  for (const call of source.matchAll(/\bprocessListeners\s*\(([^,)]*)/g))
    for (const match of call[1]!.matchAll(/["'`]([A-Za-z][\w.]*)/g))
      events.add(match[1]!.split(".")[0]!);
  if (/Scorm(?:12|2004)API\.ts$/.test(path)) {
    for (const match of source.matchAll(
      /this\.(?:initialize|terminate|getValue|setValue|commit|getLastError|getErrorString|getDiagnostic)\s*\(\s*["'](\w+)["']/g,
    ))
      events.add(match[1]!);
    // Navigation maps supply action/eventName to processListeners.
    for (const match of source.matchAll(/:\s*["'](Sequence\w+)["']/g)) events.add(match[1]!);
  }
}
// The offline sync events PR adds this emission. Remove the entry when it lands.
const pendingOfflineSyncEvents = new Set(["OfflineDataSyncing"]);

type Block = { file: string; text: string; line: number };
const blocks: Block[] = [];
for (const path of [
  ...files(join(root, "docs-site/docs")).filter((path) => /\.md$/i.test(path)),
  join(root, "README.md"),
]) {
  const lines = readFileSync(path, "utf8").split("\n");
  let fence: string | undefined;
  let start = 0;
  let csharp = false;
  let body: string[] = [];
  for (const [index, line] of lines.entries()) {
    if (!fence) {
      const match = /^\s*(`{3,}|~{3,})/.exec(line);
      if (match) {
        fence = match[1]!;
        csharp = /(?:csharp|cs|c#)\s*$/i.test(line);
        start = index + 2;
        body = [];
      }
    } else if (new RegExp(`^\\s*${fence[0]}{${fence.length},}\\s*$`).test(line)) {
      // C# interpolated strings escape JavaScript braces. Preserve character offsets.
      const raw = body.join("\n");
      const text = csharp ? raw.replace(/\{\{/g, "{ ").replace(/\}\}/g, " }") : raw;
      blocks.push({ file: relative(root, path), text, line: start });
      fence = undefined;
    } else body.push(line);
  }
}
function location(block: Block, offset: number, message: string) {
  return `${block.file}:${block.line + block.text.slice(0, offset).split("\n").length - 1}: ${message}`;
}
function matches(pattern: RegExp, message: string): string[] {
  return blocks.flatMap((block) =>
    [...block.text.matchAll(pattern)].map((match) => location(block, match.index!, message)),
  );
}
function check(violations: string[], detail = "") {
  expect(
    violations,
    `${violations.length} violations\n${violations.join("\n")}\n${detail}`,
  ).toEqual([]);
}

describe("documentation code snippets", () => {
  it("uses the real browser globals", () => {
    check(
      matches(
        /\b(?:window\s*\.\s*ScormAgain\b|ScormAgain\s*\.\s*\w+)/g,
        "ScormAgain is not a browser global",
      ),
    );
  });
  it("exposes SCORM 2004 as API_1484_11", () => {
    check(
      matches(
        /\bwindow\.API\s*=\s*new\s+[\w.]*Scorm2004API\s*\(/gi,
        "SCORM 2004 requires window.API_1484_11",
      ),
    );
  });
  it("uses settings derived from DefaultSettings and Settings", () => {
    const violations: string[] = [];
    for (const block of blocks) {
      for (const match of block.text.matchAll(
        /\bnew\s+[\w.]*Scorm(?:12|2004)API\s*\(\s*(?=\{)/gi,
      )) {
        const offset = match.index! + match[0].length;
        for (const property of properties(block.text, offset)) {
          if (!settings.has(property.name))
            violations.push(location(block, property.offset, `unknown setting ${property.name}`));
        }
      }
    }
    check(violations);
  });
  it("uses events derived from source emissions and API wrappers", () => {
    const violations: string[] = [];
    for (const block of blocks) {
      // Instances of either API class are checked whatever the variable is called.
      const instances = new Set(
        Array.from(
          block.text.matchAll(
            /\b(?:const|let|var)\s+(\w+)\s*=\s*new\s+[\w.]*Scorm(?:12|2004)API\s*\(/g,
          ),
          (instance) => instance[1]!,
        ),
      );
      for (const match of block.text.matchAll(/\b([\w.]+)\s*\.on\s*\(\s*(["'])(.*?)\2/g)) {
        if (!/api/i.test(match[1]!) && !instances.has(match[1]!)) continue;
        // EventService supports space-separated names and trailing CMI prefix wildcards.
        for (const listener of match[3]!.trim().split(/\s+/).filter(Boolean)) {
          const name = listener.split(".")[0]!;
          if (!events.has(name) && !pendingOfflineSyncEvents.has(name))
            violations.push(location(block, match.index!, `unknown event ${listener}`));
        }
      }
    }
    check(violations, `Derived events: ${[...events].sort().join(", ")}`);
  });
  it("puts the log level before the message in onLogMessage callbacks", () => {
    check(
      matches(
        /\bonLogMessage\s*:\s*(?:function\s*\w*\s*\(\s*|(?:async\s*)?\(?\s*)(?:message|msg|text|logMessage)\b(?=\s*(?:[,):]|=>))/g,
        "onLogMessage takes (level, message)",
      ),
    );
  });
});
