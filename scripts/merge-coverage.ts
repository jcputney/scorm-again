/**
 * Coverage Merge Script
 *
 * Merges LCOV coverage data from Vitest (unit tests) and Playwright (E2E tests)
 * into a unified report.
 *
 * Usage: npx tsx scripts/merge-coverage.ts
 */
import * as fs from "fs";
import * as path from "path";

const rootDir = process.cwd();

// Input LCOV files
const unitLcov = path.resolve(rootDir, "./coverage/unit/lcov.info");
const e2eLcov = path.resolve(rootDir, "./coverage/e2e/lcov.info");
const mergedDir = path.resolve(rootDir, "./coverage/merged");
const mergedLcov = path.resolve(mergedDir, "lcov.info");

// Ensure output directory exists
if (!fs.existsSync(mergedDir)) {
  fs.mkdirSync(mergedDir, { recursive: true });
}

// Check which files exist
const existingFiles: string[] = [];
if (fs.existsSync(unitLcov)) {
  existingFiles.push(unitLcov);
  console.log("Found unit test coverage: coverage/unit/lcov.info");
} else {
  console.log("No unit test coverage found");
}

if (fs.existsSync(e2eLcov)) {
  existingFiles.push(e2eLcov);
  console.log("Found E2E test coverage: coverage/e2e/lcov.info");
} else {
  console.log("No E2E test coverage found");
}

if (existingFiles.length === 0) {
  console.error("\nNo coverage data found. Run tests with coverage first:");
  console.error("  npm run test:coverage      # Unit tests");
  console.error("  npm run test:coverage:e2e  # E2E tests");
  process.exit(1);
}

// Read and concatenate LCOV files
// LCOV format is designed to be concatenated - records are separated by "end_of_record"
console.log("\nMerging coverage files...");
let mergedContent = "";
for (const file of existingFiles) {
  const content = fs.readFileSync(file, "utf-8");
  mergedContent += content;
  if (!content.endsWith("\n")) {
    mergedContent += "\n";
  }
}

// Write merged LCOV
fs.writeFileSync(mergedLcov, mergedContent);

// Parse LCOV to generate summary
interface FileCoverage {
  lines: { hit: number; total: number };
  functions: { hit: number; total: number };
  branches: { hit: number; total: number };
}

const coverage = new Map<string, FileCoverage>();
let currentFile = "";

for (const line of mergedContent.split("\n")) {
  if (line.startsWith("SF:")) {
    currentFile = line.substring(3);
    if (!coverage.has(currentFile)) {
      coverage.set(currentFile, {
        lines: { hit: 0, total: 0 },
        functions: { hit: 0, total: 0 },
        branches: { hit: 0, total: 0 },
      });
    }
  } else if (line.startsWith("LF:")) {
    const cov = coverage.get(currentFile);
    if (cov) cov.lines.total = parseInt(line.substring(3), 10);
  } else if (line.startsWith("LH:")) {
    const cov = coverage.get(currentFile);
    if (cov) cov.lines.hit = parseInt(line.substring(3), 10);
  } else if (line.startsWith("FNF:")) {
    const cov = coverage.get(currentFile);
    if (cov) cov.functions.total = parseInt(line.substring(4), 10);
  } else if (line.startsWith("FNH:")) {
    const cov = coverage.get(currentFile);
    if (cov) cov.functions.hit = parseInt(line.substring(4), 10);
  } else if (line.startsWith("BRF:")) {
    const cov = coverage.get(currentFile);
    if (cov) cov.branches.total = parseInt(line.substring(4), 10);
  } else if (line.startsWith("BRH:")) {
    const cov = coverage.get(currentFile);
    if (cov) cov.branches.hit = parseInt(line.substring(4), 10);
  }
}

// Calculate totals
let totalLines = { hit: 0, total: 0 };
let totalFunctions = { hit: 0, total: 0 };
let totalBranches = { hit: 0, total: 0 };

for (const [, cov] of coverage) {
  totalLines.hit += cov.lines.hit;
  totalLines.total += cov.lines.total;
  totalFunctions.hit += cov.functions.hit;
  totalFunctions.total += cov.functions.total;
  totalBranches.hit += cov.branches.hit;
  totalBranches.total += cov.branches.total;
}

const pct = (hit: number, total: number) =>
  total > 0 ? ((hit / total) * 100).toFixed(2) : "0.00";

console.log("\n" + "=".repeat(60));
console.log("Combined Coverage Summary (Unit + E2E)");
console.log("=".repeat(60));
console.log(`Files:     ${coverage.size}`);
console.log(
  `Lines:     ${pct(totalLines.hit, totalLines.total)}% (${totalLines.hit}/${totalLines.total})`,
);
console.log(
  `Functions: ${pct(totalFunctions.hit, totalFunctions.total)}% (${totalFunctions.hit}/${totalFunctions.total})`,
);
console.log(
  `Branches:  ${pct(totalBranches.hit, totalBranches.total)}% (${totalBranches.hit}/${totalBranches.total})`,
);
console.log("=".repeat(60));

console.log("\nCoverage report generated:");
console.log(`  LCOV: coverage/merged/lcov.info`);
console.log("\nUpload to Codecov with:");
console.log("  codecov -f coverage/merged/lcov.info");
