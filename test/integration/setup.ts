import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as child_process from "child_process";
import extract from "extract-zip";
import { fileURLToPath } from "url";

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES_DIR = path.join(__dirname, "modules");
const MODULES_URL = "https://cdn.noverant.com/AllGolfExamples.zip";
const MODULES_ZIP = path.join(MODULES_DIR, "AllGolfExamples.zip");
const SERVER_PORT = 3000;

/**
 * Checks if the test modules are already downloaded and extracted
 * @returns {boolean} True if modules are already available
 */
function modulesExist(): boolean {
  // Check if the modules directory exists and has content
  if (!fs.existsSync(MODULES_DIR)) {
    return false;
  }

  // Check if there are extracted modules (at least one directory other than the zip file)
  const files = fs.readdirSync(MODULES_DIR);
  const directories = files.filter((file) => {
    const filePath = path.join(MODULES_DIR, file);
    return fs.statSync(filePath).isDirectory();
  });

  return directories.length > 0;
}

/**
 * Downloads the test modules from the specified URL
 * @returns {Promise<void>}
 */
function downloadModules(): Promise<void> {
  console.log("Downloading test modules...");

  // Create modules directory if it doesn't exist
  if (!fs.existsSync(MODULES_DIR)) {
    fs.mkdirSync(MODULES_DIR, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(MODULES_ZIP);

    https
      .get(MODULES_URL, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download modules: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log("Download completed");
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlinkSync(MODULES_ZIP);
        reject(err);
      });
  });
}

/**
 * Extracts the downloaded zip file
 * @returns {Promise<void>}
 */
async function extractModules(): Promise<void> {
  console.log("Extracting test modules...");

  try {
    await extract(MODULES_ZIP, { dir: MODULES_DIR });
    console.log("Extraction completed");

    // Extract any nested zip files (golf examples are in separate zip files)
    const files = fs.readdirSync(MODULES_DIR);
    for (const file of files) {
      if (file.endsWith(".zip") && file !== "AllGolfExamples.zip") {
        const zipPath = path.join(MODULES_DIR, file);
        const extractDir = path.join(MODULES_DIR, file.replace(".zip", ""));

        if (!fs.existsSync(extractDir)) {
          fs.mkdirSync(extractDir, { recursive: true });
        }

        await extract(zipPath, { dir: extractDir });
        console.log(`Extracted ${file}`);
      }
    }
  } catch (err) {
    console.error("Extraction failed:", err);
    throw err;
  }
}

/**
 * Starts a lightweight web server for the test modules using http-server
 * @returns {child_process.ChildProcess} The HTTP server process
 */
function startServer(): child_process.ChildProcess {
  console.log("Starting http-server...");

  // Create a root directory for the server that includes modules, wrappers, and dist
  const serverRoot = path.join(__dirname, "../../");

  // Start http-server with the appropriate options
  const serverProcess = child_process.spawn(
    "npx",
    [
      "http-server",
      serverRoot,
      "-p",
      SERVER_PORT.toString(),
      "--cors",
      "-c-1", // Disable caching
      // "-o", // Don't open browser
      "-s", // Silent mode (no logging)
    ],
    {
      stdio: ["ignore", "pipe", "pipe"],
      detached: false,
    },
  );

  // Log server output
  serverProcess.stdout.on("data", (data) => {
    console.log(`[http-server] ${data.toString().trim()}`);
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(`[http-server error] ${data.toString().trim()}`);
  });

  // Handle server process exit
  serverProcess.on("exit", (code, signal) => {
    if (code !== null) {
      console.log(`http-server exited with code ${code}`);
    } else if (signal !== null) {
      console.log(`http-server was killed with signal ${signal}`);
    }
  });

  // Wait a moment to ensure the server is up
  return serverProcess;
}

/**
 * Main setup function
 */
export async function setup(): Promise<child_process.ChildProcess> {
  try {
    if (!modulesExist()) {
      await downloadModules();
      await extractModules();
    } else {
      console.log("Test modules already exist, skipping download");
    }

    // Start the server
    const serverProcess = startServer();

    // Wait for the server to be ready
    await new Promise<void>((resolve) => {
      // Give the server a moment to start up
      setTimeout(() => {
        console.log("Server is now ready to accept connections");
        resolve();
      }, 1000);
    });

    return serverProcess;
  } catch (err) {
    console.error("Setup failed:", err);
    throw err;
  }
}

/**
 * Run setup if this file is executed directly
 */
// Check if this module is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setup().catch((err) => {
    console.error("Setup failed:", err);
    process.exit(1);
  });
}
