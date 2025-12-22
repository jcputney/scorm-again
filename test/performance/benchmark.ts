import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Runs the performance tests and extracts the metrics from the console output
 * @returns Promise that resolves with the extracted metrics
 */
async function runPerformanceTests(): Promise<Record<string, number>> {
  return new Promise((resolve, reject) => {
    const metrics: Record<string, number> = {};
    const vitestProcess = spawn("yarn", [
      "run",
      "vitest",
      "run",
      "test/performance/PerformanceTests.spec.ts",
      "test/performance/StressTests.spec.ts",
      "--reporter",
      "default",
    ]);

    vitestProcess.stdout.on("data", (data) => {
      const output = data.toString();
      const lines = output.split("\n");

      for (const line of lines) {
        // Extract metrics from console.log output in the tests
        const match = line.match(/Average time for (.+): (\d+\.\d+) ms/);
        if (match) {
          const [, metricName, metricValue] = match;
          metrics[metricName.trim()] = parseFloat(metricValue);
        }

        // Extract metrics from stress tests
        const stressMatch = line.match(/Time for (\d+) (.+): (\d+\.\d+) ms/);
        if (stressMatch) {
          const [, concurrency, operationType, metricValue] = stressMatch;
          metrics[`${concurrency} ${operationType}`] = parseFloat(metricValue);
        }
      }
    });

    vitestProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    vitestProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Performance tests exited with code ${code}`));
      } else {
        resolve(metrics);
      }
    });
  });
}

/**
 * Loads the previous benchmark results from the JSON file
 * @returns Previous benchmark results or null if the file doesn't exist
 */
function loadPreviousBenchmark(): Record<string, number> | null {
  const benchmarkPath = path.join(__dirname, "../../reports/performance-benchmark.json");

  if (fs.existsSync(benchmarkPath)) {
    try {
      const data = fs.readFileSync(benchmarkPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading previous benchmark:", error);
      return null;
    }
  }

  return null;
}

/**
 * Saves the current benchmark results to the JSON file
 * @param metrics Current benchmark results
 */
function saveBenchmark(metrics: Record<string, number>): void {
  const reportsDir = path.join(__dirname, "../../reports");
  const benchmarkPath = path.join(reportsDir, "performance-benchmark.json");

  // Ensure reports directory exists
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(benchmarkPath, JSON.stringify(metrics, null, 2), "utf8");
  console.log(`Benchmark saved to ${benchmarkPath}`);
}

/**
 * Compares current benchmark results with previous results and detects regressions
 * @param current Current benchmark results
 * @param previous Previous benchmark results
 * @returns Object containing regression information
 */
function detectRegressions(
  current: Record<string, number>,
  previous: Record<string, number> | null,
): {
  regressions: Array<{ metric: string; previous: number; current: number; percentChange: number }>;
  hasSignificantRegression: boolean;
} {
  const regressions = [] as Array<{
    metric: string;
    previous: number;
    current: number;
    percentChange: number;
  }>;
  let hasSignificantRegression = false;

  if (!previous) {
    return { regressions, hasSignificantRegression };
  }

  // Define threshold for significant regression (20% slower)
  const significantRegressionThreshold = 1.2;

  for (const [metric, currentValue] of Object.entries(current)) {
    const previousValue = previous[metric];

    if (previousValue && currentValue > previousValue * significantRegressionThreshold) {
      const percentChange = ((currentValue - previousValue) / previousValue) * 100;
      regressions.push({
        metric,
        previous: previousValue,
        current: currentValue,
        percentChange,
      });

      if (percentChange > 20) {
        hasSignificantRegression = true;
      }
    }
  }

  return { regressions, hasSignificantRegression };
}

/**
 * Saves regression details to a JSON file for GitHub Actions to use
 * @param regressions Array of regression details
 */
function saveRegressionDetails(
  regressions: Array<{ metric: string; previous: number; current: number; percentChange: number }>,
): void {
  const reportsDir = path.join(__dirname, "../../reports");
  const regressionPath = path.join(reportsDir, "performance-regressions.json");

  // Ensure reports directory exists
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const regressionDetails = {
    timestamp: new Date().toISOString(),
    regressions,
    summary: `${regressions.length} performance regression(s) detected`,
    details: regressions
      .map(
        ({ metric, previous, current, percentChange }) =>
          `${metric}: ${previous.toFixed(3)}ms → ${current.toFixed(3)}ms (${percentChange.toFixed(2)}% slower)`,
      )
      .join("\n"),
  };

  fs.writeFileSync(regressionPath, JSON.stringify(regressionDetails, null, 2), "utf8");
  console.log(`Regression details saved to ${regressionPath}`);
}

/**
 * Main function that runs the benchmark, compares with previous results, and reports regressions
 */
async function main() {
  try {
    console.log("Running performance benchmark...");
    const metrics = await runPerformanceTests();

    // Load previous benchmark for comparison
    const previous = loadPreviousBenchmark();

    // Save current benchmark
    saveBenchmark(metrics);

    // Detect regressions
    const { regressions, hasSignificantRegression } = detectRegressions(metrics, previous);

    if (regressions.length > 0) {
      console.log("\nPerformance regressions detected:");
      for (const { metric, previous, current, percentChange } of regressions) {
        console.log(
          `  ${metric}: ${previous.toFixed(3)}ms → ${current.toFixed(3)}ms (${percentChange.toFixed(2)}% slower)`,
        );
      }

      // Save regression details for GitHub Actions
      saveRegressionDetails(regressions);

      if (hasSignificantRegression) {
        console.error("\n⚠️ SIGNIFICANT PERFORMANCE REGRESSION DETECTED ⚠️");
        process.exit(1);
      }
    } else {
      console.log("\nNo performance regressions detected.");
    }
  } catch (error) {
    console.error("Error running benchmark:", error);
    process.exit(1);
  }
}

// Run the benchmark
main().then(
  () => {
    console.log("Benchmark completed successfully.");
  },
  (error) => {
    console.error("Error during benchmark:", error);
    process.exit(1);
  },
);
