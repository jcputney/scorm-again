// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { strToU8, zipSync } from "fflate";
import { extractZip } from "./extract_zip";

describe("test fixture ZIP extraction", () => {
  let temporary: string;
  let archive: string;
  let destination: string;

  beforeEach(() => {
    temporary = fs.mkdtempSync(path.join(os.tmpdir(), "scorm-zip-test-"));
    archive = path.join(temporary, "fixture.zip");
    destination = path.join(temporary, "extracted");
  });

  afterEach(() => fs.rmSync(temporary, { recursive: true, force: true }));

  it("extracts nested course archives, Unicode paths and binary data", () => {
    const nested = zipSync({ "lesson/你好.txt": strToU8("lesson") });
    fs.writeFileSync(archive, zipSync({ "course.zip": nested, "empty/": new Uint8Array() }));
    extractZip(archive, destination);
    extractZip(path.join(destination, "course.zip"), path.join(destination, "course"));
    expect(fs.readFileSync(path.join(destination, "course.zip"))).toEqual(Buffer.from(nested));
    expect(fs.readFileSync(path.join(destination, "course/lesson/你好.txt"), "utf8")).toBe(
      "lesson",
    );
    expect(fs.statSync(path.join(destination, "empty")).isDirectory()).toBe(true);
  });

  it.each([
    "../escape.txt",
    "/absolute.txt",
    "folder/../../escape.txt",
    "C:/escape.txt",
    "..\\escape.txt",
  ])("rejects unsafe entry %s before extracting files", (name) => {
    fs.writeFileSync(archive, zipSync({ "safe.txt": strToU8("safe"), [name]: strToU8("bad") }));
    expect(() => extractZip(archive, destination)).toThrow("Unsafe ZIP entry path");
    expect(fs.readdirSync(destination)).toEqual([]);
  });

  it.each(["file", "directory"])("rejects pre-existing %s symlinks", (kind) => {
    const outside = path.join(temporary, "outside");
    fs.mkdirSync(outside);
    fs.writeFileSync(path.join(outside, "target.txt"), "unchanged");
    fs.mkdirSync(destination);
    const name = kind === "file" ? "target.txt" : "linked/target.txt";
    fs.symlinkSync(
      kind === "file" ? path.join(outside, "target.txt") : outside,
      path.join(destination, kind === "file" ? "target.txt" : "linked"),
      kind === "file" ? "file" : "dir",
    );
    fs.writeFileSync(archive, zipSync({ [name]: strToU8("overwrite") }));
    expect(() => extractZip(archive, destination)).toThrow();
    expect(fs.readFileSync(path.join(outside, "target.txt"), "utf8")).toBe("unchanged");
  });

  it("rejects an existing file instead of overwriting it", () => {
    fs.mkdirSync(destination);
    fs.writeFileSync(path.join(destination, "target.txt"), "unchanged");
    fs.writeFileSync(archive, zipSync({ "target.txt": strToU8("overwrite") }));
    expect(() => extractZip(archive, destination)).toThrow();
    expect(fs.readFileSync(path.join(destination, "target.txt"), "utf8")).toBe("unchanged");
  });
});
