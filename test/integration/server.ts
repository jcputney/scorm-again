import { setup } from "./setup";

// This script is used by Playwright to start the server
// It will keep running until terminated by Playwright after tests complete
async function startServer() {
  try {
    console.log("Starting server for Playwright tests...");
    const serverProcess = await setup();

    // Log when the server is ready
    console.log("Server setup complete and ready for Playwright tests");

    // Handle process termination signals to gracefully shut down the server
    process.on("SIGINT", () => {
      console.log("Shutting down server...");
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill();
        console.log("Server process killed");
      }
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.log("Shutting down server...");
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill();
        console.log("Server process killed");
      }
      process.exit(0);
    });

    console.log("Server is running and ready for tests");

    // Keep the process alive by setting an interval that does nothing
    // This prevents the Node.js process from exiting after starting the server
    setInterval(() => {}, 1000);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Start the server
startServer();
