import Server, { STATES } from "@dr.pogodin/react-native-static-server";
import * as FileSystem from "expo-file-system/legacy";
import { STATIC_SERVER_PORT } from "../constants";

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

      // The course runs in an iframe because many course wrappers declare their own
      // global API variable, and SCORM content searches parent windows for the API.
      await FileSystem.writeAsStringAsync(`${docDir}player.html`, `<!doctype html>
<html><head><meta name="viewport" content="width=device-width, initial-scale=1">
<style>html,body{margin:0;width:100%;height:100%}iframe{width:100%;height:100%;border:0;display:block}</style>
</head><body><iframe id="course" title="Course"></iframe><script>
(function () {
  var match = /(?:^|&)course=([^&]*)/.exec(window.location.search.slice(1));
  var course = match ? decodeURIComponent(match[1].replace(/\\+/g, ' ')) : '';
  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    if (window.API_1484_11 || window.API || tries >= 200) {
      clearInterval(timer);
      document.getElementById('course').src = course;
    }
  }, 50);
})();
</script></body></html>`);

      // Remove file:// prefix for the server - serve from Documents root
      const rootPath = docDir.replace("file://", "").replace(/\/$/, "");

      console.log("Starting static server with root path:", rootPath);

      // Create a single server serving from the Documents directory
      this.server = new Server({
        fileDir: rootPath,
        port: STATIC_SERVER_PORT, // Fixed so the origin, and its localStorage, stays the same
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

  getPlayerUrl(courseId: string, launchFile: string): string {
    if (!this.origin) {
      throw new Error("Static server not running");
    }
    return `${this.origin}/player.html?course=${encodeURIComponent(`courses/${courseId}/${launchFile}`)}`;
  }

  /**
   * Get the server origin
   */
  getOrigin(): string | null {
    return this.origin;
  }
}

export default StaticServerService.getInstance();
