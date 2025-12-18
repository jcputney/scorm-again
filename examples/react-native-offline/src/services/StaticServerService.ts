import Server, { STATES } from "@dr.pogodin/react-native-static-server";
import * as FileSystem from "expo-file-system";

export class StaticServerService {
  private static instance: StaticServerService;
  private server: Server | null = null;
  private origin: string | null = null;
  private starting: boolean = false;

  private constructor() {}

  static getInstance(): StaticServerService {
    if (!StaticServerService.instance) {
      StaticServerService.instance = new StaticServerService();
    }
    return StaticServerService.instance;
  }

  /**
   * Start the static server if not already running
   * Serves from the Documents directory root
   */
  async start(): Promise<void> {
    if (this.starting) {
      // Wait for startup to complete
      while (this.starting) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return;
    }

    if (this.isRunning()) {
      console.log("Static server already running at:", this.origin);
      return;
    }

    this.starting = true;

    try {
      // Get the document directory path without file:// prefix
      const docDir = FileSystem.documentDirectory;
      if (!docDir) {
        throw new Error("Document directory not available");
      }

      // Remove file:// prefix for the server - serve from Documents root
      const rootPath = docDir.replace("file://", "").replace(/\/$/, "");

      console.log("Starting static server with root path:", rootPath);

      // Create a single server serving from the Documents directory
      this.server = new Server({
        fileDir: rootPath,
        port: 0, // Auto-select available port
        hostname: "127.0.0.1",
        stopInBackground: false, // Keep running when app goes to background
      });

      // Start the server
      this.origin = await this.server.start();

      console.log("Static server started at:", this.origin);
    } catch (error) {
      console.error("Failed to start static server:", error);
      this.origin = null;
      throw error;
    } finally {
      this.starting = false;
    }
  }

  /**
   * Stop the static server
   */
  async stop(): Promise<void> {
    try {
      if (this.server) {
        await this.server.stop();
        this.server = null;
      }
    } catch (error) {
      console.error("Error stopping server:", error);
    } finally {
      this.origin = null;
    }
  }

  /**
   * Check if server is running
   */
  isRunning(): boolean {
    return this.server?.state === STATES.ACTIVE;
  }

  /**
   * Get the URL for a specific course
   * @param courseId The course ID
   * @param launchFile The launch file path within the course
   * @returns The HTTP URL to load in WebView
   */
  getCourseUrl(courseId: string, launchFile: string): string {
    if (!this.origin) {
      throw new Error("Static server not running");
    }
    // URL format: http://127.0.0.1:PORT/courses/courseId/launchFile
    return `${this.origin}/courses/${courseId}/${launchFile}`;
  }

  /**
   * Get the base URL for a specific course (for relative asset loading)
   * @param courseId The course ID
   * @returns The base HTTP URL for the course
   */
  getCourseBaseUrl(courseId: string): string {
    if (!this.origin) {
      throw new Error("Static server not running");
    }
    return `${this.origin}/courses/${courseId}/`;
  }

  /**
   * Get the URL to the scorm-again.js file
   * @returns The HTTP URL to the scorm-again script
   */
  getScormAgainUrl(): string {
    if (!this.origin) {
      throw new Error("Static server not running");
    }
    return `${this.origin}/scorm-again/scorm2004.min.js`;
  }

  /**
   * Get the server origin
   */
  getOrigin(): string | null {
    return this.origin;
  }
}

export default StaticServerService.getInstance();
