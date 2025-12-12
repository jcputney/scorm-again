import { Server, createServer, IncomingMessage, ServerResponse } from "http";

export interface CMIData {
  cmi: Record<string, unknown>;
  adl?: Record<string, unknown>;
}

export interface CommitRecord {
  timestamp: number;
  learnerId: string;
  scoId: string;
  data: CMIData;
  method: "xhr" | "beacon";
}

export interface MockLmsServer {
  server: Server;
  port: number;
  url: string;
  storage: Map<string, CMIData>;
  commitHistory: CommitRecord[];
  getStoredData: (learnerId: string, scoId: string) => CMIData | undefined;
  getCommitHistory: () => CommitRecord[];
  reset: () => void;
  stop: () => Promise<void>;
}

/**
 * Parse request body from IncomingMessage
 */
function parseBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

/**
 * Send JSON response
 */
function sendJson(res: ServerResponse, data: unknown, statusCode: number = 200): void {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-SCO-ID",
  });
  res.end(JSON.stringify(data));
}

/**
 * Creates and starts a mock LMS server for integration testing.
 *
 * The server provides endpoints for:
 * - POST /lms/commit - Receives and stores CMI data
 * - GET /lms/initialize/:learnerId/:scoId - Returns stored CMI data
 * - POST /lms/reset - Clears all stored data
 * - GET /lms/history - Returns commit history for inspection
 *
 * @param port - Port to run the server on (default: 3001)
 * @returns MockLmsServer instance with control methods
 */
export async function createMockLmsServer(port: number = 3001): Promise<MockLmsServer> {
  const storage = new Map<string, CMIData>();
  const commitHistory: CommitRecord[] = [];

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || "/", `http://localhost:${port}`);
    const pathname = url.pathname;
    const method = req.method || "GET";

    // Handle CORS preflight
    if (method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-SCO-ID",
      });
      res.end();
      return;
    }

    try {
      // POST /lms/commit - Receive CMI data from API
      if (method === "POST" && pathname === "/lms/commit") {
        const bodyText = await parseBody(req);
        let data: CMIData;

        // Handle different content types
        if (bodyText.startsWith("{")) {
          data = JSON.parse(bodyText);
        } else {
          // Try URL-encoded format
          const params = new URLSearchParams(bodyText);
          data = { cmi: Object.fromEntries(params) };
        }

        // Extract learner ID and SCO ID from the data
        const cmiCore = data.cmi?.core as Record<string, unknown> | undefined;
        const learnerId =
          (data.cmi?.learner_id as string) || (cmiCore?.student_id as string) || "unknown";
        const scoId =
          (url.searchParams.get("scoId") as string) ||
          (req.headers["x-sco-id"] as string) ||
          "default";

        // Determine commit method
        const contentType = req.headers["content-type"] || "";
        const commitMethod: "xhr" | "beacon" = contentType.includes("text/plain")
          ? "beacon"
          : "xhr";

        // Store the data
        const storageKey = `${learnerId}_${scoId}`;

        // Merge with existing data if present
        const existingData = storage.get(storageKey);
        if (existingData) {
          data = {
            cmi: { ...existingData.cmi, ...data.cmi },
            adl: { ...existingData.adl, ...data.adl },
          };
        }
        storage.set(storageKey, data);

        // Record in history
        commitHistory.push({
          timestamp: Date.now(),
          learnerId,
          scoId,
          data,
          method: commitMethod,
        });

        sendJson(res, { result: "true", errorCode: 0 });
        return;
      }

      // GET /lms/initialize/:learnerId/:scoId - Return stored CMI data
      const initMatch = pathname.match(/^\/lms\/initialize\/([^/]+)\/([^/]+)$/);
      if (method === "GET" && initMatch) {
        const learnerId = decodeURIComponent(initMatch[1]);
        const scoId = decodeURIComponent(initMatch[2]);
        const storageKey = `${learnerId}_${scoId}`;
        const data = storage.get(storageKey);

        if (data) {
          sendJson(res, { result: "true", errorCode: 0, data });
        } else {
          // Return default initial data
          sendJson(res, {
            result: "true",
            errorCode: 0,
            data: {
              cmi: {
                learner_id: learnerId,
                learner_name: "Test Learner",
                completion_status: "not attempted",
                success_status: "unknown",
                entry: "ab-initio",
                credit: "credit",
                mode: "normal",
              },
            },
          });
        }
        return;
      }

      // POST /lms/reset - Clear all stored data
      if (method === "POST" && pathname === "/lms/reset") {
        storage.clear();
        commitHistory.length = 0;
        sendJson(res, { result: "true" });
        return;
      }

      // GET /lms/history - Return commit history
      if (method === "GET" && pathname === "/lms/history") {
        sendJson(res, commitHistory);
        return;
      }

      // GET /lms/storage - Return all stored data (for debugging)
      if (method === "GET" && pathname === "/lms/storage") {
        const entries: Record<string, CMIData> = {};
        storage.forEach((value, key) => {
          entries[key] = value;
        });
        sendJson(res, entries);
        return;
      }

      // 404 for unknown routes
      sendJson(res, { error: "Not found" }, 404);
    } catch (error) {
      console.error("[MockLMS] Error:", error);
      sendJson(res, { result: "false", errorCode: 101 }, 500);
    }
  });

  // Start the server
  await new Promise<void>((resolve) => {
    server.listen(port, () => {
      console.log(`[MockLMS] Server running on port ${port}`);
      resolve();
    });
  });

  return {
    server,
    port,
    url: `http://localhost:${port}`,
    storage,
    commitHistory,
    getStoredData: (learnerId: string, scoId: string) => {
      return storage.get(`${learnerId}_${scoId}`);
    },
    getCommitHistory: () => [...commitHistory],
    reset: () => {
      storage.clear();
      commitHistory.length = 0;
    },
    stop: () => {
      return new Promise((resolve) => {
        server.close(() => {
          console.log("[MockLMS] Server stopped");
          resolve();
        });
      });
    },
  };
}

// Singleton instance for shared use across tests
let sharedInstance: MockLmsServer | null = null;

export async function getSharedMockLmsServer(port: number = 3001): Promise<MockLmsServer> {
  if (!sharedInstance) {
    sharedInstance = await createMockLmsServer(port);
  }
  return sharedInstance;
}

export async function stopSharedMockLmsServer(): Promise<void> {
  if (sharedInstance) {
    await sharedInstance.stop();
    sharedInstance = null;
  }
}
