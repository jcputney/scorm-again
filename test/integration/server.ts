import { setup, SetupResult } from "./setup.js";

// This script is used by Playwright to start the server
// It will keep running until terminated by Playwright after tests complete
async function startServer() {
  let servers: SetupResult | null = null;

  try {
    console.log("Starting servers for Playwright tests...");
    servers = await setup();

    // Log when the servers are ready
    console.log("Server setup complete and ready for Playwright tests");
    console.log(`  - HTTP Server: http://localhost:3000`);
    console.log(`  - Mock LMS: ${servers.mockLms.url}`);

    // Handle process termination signals to gracefully shut down both servers
    const shutdown = async () => {
      console.log("Shutting down servers...");
      if (servers) {
        if (servers.httpServer && !servers.httpServer.killed) {
          servers.httpServer.kill();
          console.log("HTTP server process killed");
        }
        await servers.mockLms.stop();
        console.log("Mock LMS server stopped");
      }
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    console.log("Servers are running and ready for tests");

    // Keep the process alive by setting an interval that does nothing
    // This prevents the Node.js process from exiting after starting the server
    setInterval(() => {}, 1000);
  } catch (err) {
    console.error("Failed to start servers:", err);
    process.exit(1);
  }
}

// Start the server
startServer().then(
  () => {
    console.log("Servers started successfully");
  },
  (err) => {
    console.error("Error starting servers:", err);
    process.exit(1);
  },
);
