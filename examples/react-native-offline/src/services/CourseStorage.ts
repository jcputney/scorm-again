import * as FileSystem from "expo-file-system/legacy";
import { Asset } from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { unzip } from "react-native-zip-archive";
import { BUILT_IN_COURSE_ID, BUILT_IN_COURSE_TITLE } from "../constants";

const BUILT_IN_COURSE_ASSET_HASH_KEY = "@built_in_course_asset_hash";
const SCORM_AGAIN_ASSET_HASH_KEY = "@scorm_again_asset_hash";
// Required at module level: Metro treats a require inside try/catch as optional,
// so a missing zip would bundle and only fail at runtime. Run
// `npm run prepare-assets` to create both zips.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const BUILT_IN_COURSE_ZIP = require("../../assets/courses/minimal-test.zip");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SCORM_AGAIN_ZIP = require("../../assets/scorm-again/scorm-again.zip");
export const COURSES_DIR = `${FileSystem.documentDirectory}courses/`;
export const SCORM_AGAIN_DIR = `${FileSystem.documentDirectory}scorm-again/`;

export interface Course {
  id: string;
  title: string;
  path: string;
  launchFile: string;
  isBuiltIn: boolean;
  downloadedAt?: Date;
}

export interface StorageInfo {
  used: number;
  available: number;
}

export class CourseStorage {
  private static instance: CourseStorage;
  private initialized = false;

  private constructor() {}

  static getInstance(): CourseStorage {
    if (!CourseStorage.instance) {
      CourseStorage.instance = new CourseStorage();
    }
    return CourseStorage.instance;
  }

  /**
   * Initialize the storage - creates directories and extracts bundled assets
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Create courses directory
      await FileSystem.makeDirectoryAsync(COURSES_DIR, {
        intermediates: true,
      }).catch(() => {});

      // Create scorm-again directory
      await FileSystem.makeDirectoryAsync(SCORM_AGAIN_DIR, {
        intermediates: true,
      }).catch(() => {});

      // Extract built-in course from bundled zip
      await this.extractBuiltInCourseIfNeeded();

      // Extract scorm-again from bundled zip
      await this.extractScormAgainIfNeeded();

      this.initialized = true;
    } catch (error) {
      console.error("Error initializing CourseStorage:", error);
      throw error;
    }
  }

  /**
   * Extract the built-in course from bundled zip asset
   */
  private async extractBuiltInCourseIfNeeded(): Promise<void> {
    const courseDir = `${COURSES_DIR}${BUILT_IN_COURSE_ID}/`;

    try {
      // The hash changes whenever prepare-assets packs different files
      const asset = Asset.fromModule(BUILT_IN_COURSE_ZIP);
      const storedHash = await AsyncStorage.getItem(BUILT_IN_COURSE_ASSET_HASH_KEY);
      const index = await FileSystem.getInfoAsync(`${courseDir}index.html`);
      if (asset.hash && storedHash === asset.hash && index.exists) {
        return;
      }

      console.log("Extracting built-in course from bundled zip...");
      await asset.downloadAsync();
      if (!asset.localUri) {
        throw new Error("Failed to load built-in course zip asset");
      }

      // Start from an empty folder so files removed from the course do not linger
      await FileSystem.deleteAsync(courseDir, { idempotent: true });
      await FileSystem.makeDirectoryAsync(courseDir, { intermediates: true });
      await unzip(asset.localUri, courseDir);

      if (asset.hash) {
        await AsyncStorage.setItem(BUILT_IN_COURSE_ASSET_HASH_KEY, asset.hash);
      }
      console.log("Built-in course extracted successfully");
    } catch (error) {
      console.error("Error extracting built-in course:", error);
    }
  }

  /**
   * Extract scorm-again.min.js, the bridge script and version.txt from the bundled zip asset
   */
  private async extractScormAgainIfNeeded(): Promise<void> {
    try {
      // The hash changes whenever prepare-assets packs a different build
      const asset = Asset.fromModule(SCORM_AGAIN_ZIP);
      const storedHash = await AsyncStorage.getItem(SCORM_AGAIN_ASSET_HASH_KEY);
      const bundle = await FileSystem.getInfoAsync(`${SCORM_AGAIN_DIR}scorm-again.min.js`);
      if (asset.hash && storedHash === asset.hash && bundle.exists) {
        return;
      }

      console.log("Extracting scorm-again from bundled zip...");
      await asset.downloadAsync();
      if (!asset.localUri) {
        throw new Error("Failed to load scorm-again zip asset");
      }

      await unzip(asset.localUri, SCORM_AGAIN_DIR);

      if (asset.hash) {
        await AsyncStorage.setItem(SCORM_AGAIN_ASSET_HASH_KEY, asset.hash);
      }
      console.log("scorm-again extracted successfully");
    } catch (error) {
      console.error("Error extracting scorm-again:", error);
    }
  }

  /**
   * Get the path to the shared bridge script from the docs
   */
  getBridgePath(): string {
    return `${SCORM_AGAIN_DIR}mobile-bridge.js`;
  }

  /**
   * Get the scorm-again version that prepare-assets packed, or null if unknown
   */
  async getScormAgainVersion(): Promise<string | null> {
    await this.initialize();
    try {
      return (await FileSystem.readAsStringAsync(`${SCORM_AGAIN_DIR}version.txt`)).trim();
    } catch {
      return null;
    }
  }

  /**
   * Read the SCORM version from the course manifest's schemaversion.
   * Defaults to 2004 when the manifest does not say.
   */
  async getCourseScormVersion(courseId: string): Promise<"1.2" | "2004"> {
    await this.initialize();
    try {
      const manifest = await FileSystem.readAsStringAsync(`${COURSES_DIR}${courseId}/imsmanifest.xml`);
      const match = manifest.match(/<(?:[\w.-]+:)?schemaversion\b[^>]*>([^<]*)<\/(?:[\w.-]+:)?schemaversion\s*>/i);
      if (match) {
        return match[1].includes("1.2") ? "1.2" : "2004";
      }
      console.warn("No schemaversion in course manifest:", courseId);
    } catch {
      console.warn("Unable to read course manifest:", courseId);
    }
    return "2004";
  }

  /**
   * Get the path to the scorm-again.js file (full bundle with SCORM 1.2 + 2004)
   */
  async getScormAgainPath(): Promise<string> {
    await this.initialize();
    return `${SCORM_AGAIN_DIR}scorm-again.min.js`;
  }

  /**
   * Parse the launch file from an imsmanifest.xml
   */
  private async parseLaunchFileFromManifest(
    manifestPath: string
  ): Promise<string | null> {
    try {
      const manifestContent = await FileSystem.readAsStringAsync(manifestPath);

      // Look for resource with href to an HTML file
      const resourceMatch = manifestContent.match(
        /<resource[^>]*href\s*=\s*["']([^"']+\.html?)["'][^>]*>/i
      );
      if (resourceMatch && resourceMatch[1]) {
        return resourceMatch[1];
      }

      // Alternative: look for adlcp:scormType="sco" resources
      const scoMatch = manifestContent.match(
        /<resource[^>]*adlcp:scormType\s*=\s*["']sco["'][^>]*href\s*=\s*["']([^"']+)["'][^>]*>/i
      );
      if (scoMatch && scoMatch[1]) {
        return scoMatch[1];
      }

      // Try reverse order (href before scormType)
      const scoMatch2 = manifestContent.match(
        /<resource[^>]*href\s*=\s*["']([^"']+\.html?)["'][^>]*adlcp:scormType\s*=\s*["']sco["'][^>]*>/i
      );
      if (scoMatch2 && scoMatch2[1]) {
        return scoMatch2[1];
      }

      return null;
    } catch (error) {
      console.error("Error parsing manifest:", error);
      return null;
    }
  }

  /**
   * Find the launch file for a course directory
   */
  private async findLaunchFile(coursePath: string): Promise<string | null> {
    // First, check for index.html at root
    const indexPath = `${coursePath}index.html`;
    const indexExists = await FileSystem.getInfoAsync(indexPath);
    if (indexExists.exists) {
      return "index.html";
    }

    // Check for imsmanifest.xml and parse it
    const manifestPath = `${coursePath}imsmanifest.xml`;
    const manifestExists = await FileSystem.getInfoAsync(manifestPath);
    if (manifestExists.exists) {
      const launchFile = await this.parseLaunchFileFromManifest(manifestPath);
      if (launchFile) {
        // Verify the file exists
        const launchPath = `${coursePath}${launchFile}`;
        const launchExists = await FileSystem.getInfoAsync(launchPath);
        if (launchExists.exists) {
          return launchFile;
        }
      }
    }

    // Fallback: look for common launch files
    const commonFiles = [
      "shared/launchpage.html",
      "launch.html",
      "start.html",
      "player.html",
    ];
    for (const file of commonFiles) {
      const filePath = `${coursePath}${file}`;
      const exists = await FileSystem.getInfoAsync(filePath);
      if (exists.exists) {
        return file;
      }
    }

    return null;
  }

  /**
   * Get all available courses (built-in + downloaded)
   */
  async listCourses(): Promise<Course[]> {
    await this.initialize();
    const courses: Course[] = [];

    // Check for built-in course
    const builtInPath = `${COURSES_DIR}${BUILT_IN_COURSE_ID}/`;
    const builtInLaunchFile = await this.findLaunchFile(builtInPath);

    if (builtInLaunchFile) {
      courses.push({
        id: BUILT_IN_COURSE_ID,
        title: BUILT_IN_COURSE_TITLE,
        path: builtInPath,
        launchFile: builtInLaunchFile,
        isBuiltIn: true,
      });
    }

    // Get downloaded courses from the courses directory
    try {
      const directories = await FileSystem.readDirectoryAsync(COURSES_DIR);

      for (const dir of directories) {
        if (dir === BUILT_IN_COURSE_ID) continue; // Already added

        const coursePath = `${COURSES_DIR}${dir}/`;
        const launchFile = await this.findLaunchFile(coursePath);

        if (launchFile) {
          // Try to get metadata
          let title = dir;
          let downloadedAt: Date | undefined;

          const metadataPath = `${coursePath}metadata.json`;
          const metadataExists = await FileSystem.getInfoAsync(metadataPath);

          if (metadataExists.exists) {
            try {
              const metadataContent =
                await FileSystem.readAsStringAsync(metadataPath);
              const metadata = JSON.parse(metadataContent);
              title = metadata.name || metadata.title || dir;
              downloadedAt = metadata.downloadedAt
                ? new Date(metadata.downloadedAt)
                : undefined;
            } catch {
              // Ignore metadata parse errors
            }
          }

          courses.push({
            id: dir,
            title,
            path: coursePath,
            launchFile,
            isBuiltIn: false,
            downloadedAt,
          });
        }
      }
    } catch (error) {
      console.error("Error listing courses:", error);
    }

    return courses;
  }

  /**
   * Get path to a specific course
   */
  async getCoursePath(courseId: string): Promise<string> {
    await this.initialize();
    const coursePath = `${COURSES_DIR}${courseId}/`;
    const launchFile = await this.findLaunchFile(coursePath);

    if (!launchFile) {
      throw new Error(`Course not found: ${courseId}`);
    }

    return coursePath;
  }

  /**
   * Get the launch file for a specific course
   */
  async getCourseLaunchFile(courseId: string): Promise<string> {
    await this.initialize();
    const coursePath = `${COURSES_DIR}${courseId}/`;
    const launchFile = await this.findLaunchFile(coursePath);

    if (!launchFile) {
      throw new Error(`Course not found or has no launch file: ${courseId}`);
    }

    return launchFile;
  }

  /**
   * Check if course exists
   */
  async courseExists(courseId: string): Promise<boolean> {
    await this.initialize();
    const coursePath = `${COURSES_DIR}${courseId}/`;
    const launchFile = await this.findLaunchFile(coursePath);
    return launchFile !== null;
  }

  /**
   * Delete a downloaded course (cannot delete built-in courses)
   */
  async deleteCourse(courseId: string): Promise<void> {
    if (courseId === BUILT_IN_COURSE_ID) {
      throw new Error("Cannot delete built-in course");
    }

    const coursePath = `${COURSES_DIR}${courseId}/`;
    await FileSystem.deleteAsync(coursePath, { idempotent: true });
  }

  /**
   * Get storage usage info
   */
  async getStorageInfo(): Promise<StorageInfo> {
    await this.initialize();
    let used = 0;

    try {
      const directories = await FileSystem.readDirectoryAsync(COURSES_DIR);

      for (const dir of directories) {
        const coursePath = `${COURSES_DIR}${dir}`;
        used += await this.getDirectorySize(coursePath);
      }
    } catch (error) {
      console.error("Error calculating storage usage:", error);
    }

    let available = 0;
    try {
      available = await FileSystem.getFreeDiskStorageAsync();
    } catch (error) {
      console.error("Error getting available storage:", error);
    }

    return { used, available };
  }

  /**
   * Calculate directory size recursively
   */
  private async getDirectorySize(dirPath: string): Promise<number> {
    let totalSize = 0;

    try {
      const items = await FileSystem.readDirectoryAsync(dirPath);

      for (const item of items) {
        const itemPath = `${dirPath}/${item}`;
        const info = await FileSystem.getInfoAsync(itemPath);

        if (info.exists) {
          if (info.isDirectory) {
            totalSize += await this.getDirectorySize(itemPath);
          } else if ("size" in info) {
            totalSize += info.size || 0;
          }
        }
      }
    } catch (error) {
      console.error("Error getting directory size:", error);
    }

    return totalSize;
  }

  /**
   * Force re-extraction of bundled assets (for debugging/updates)
   */
  async forceReExtract(): Promise<void> {
    await AsyncStorage.removeItem(BUILT_IN_COURSE_ASSET_HASH_KEY);
    await AsyncStorage.removeItem(SCORM_AGAIN_ASSET_HASH_KEY);
    this.initialized = false;
    await this.initialize();
  }
}

export default CourseStorage.getInstance();
