import * as FileSystem from 'expo-file-system';
import { unzip } from 'react-native-zip-archive';
import { ADL_DOWNLOAD_URL } from '../constants';

export interface DownloadProgress {
  bytesWritten: number;
  totalBytes: number;
  percentage: number;
}

export interface DownloadedCourse {
  id: string;
  name: string;
  path: string;
  size: number;
  downloadedAt: Date;
}

export class CourseDownloader {
  private downloadResumable: FileSystem.DownloadResumable | null = null;
  private coursesDirectory: string;
  private tempDirectory: string;

  constructor() {
    this.coursesDirectory = `${FileSystem.documentDirectory}courses/`;
    this.tempDirectory = `${FileSystem.documentDirectory}temp/`;
  }

  /**
   * Initialize directories if they don't exist
   */
  private async ensureDirectories(): Promise<void> {
    await FileSystem.makeDirectoryAsync(this.coursesDirectory, {
      intermediates: true,
    }).catch(() => {
      // Directory already exists
    });

    await FileSystem.makeDirectoryAsync(this.tempDirectory, {
      intermediates: true,
    }).catch(() => {
      // Directory already exists
    });
  }

  /**
   * Download and extract the ADL Golf Examples
   * @param onProgress Callback for download progress updates
   * @returns List of extracted course IDs
   */
  async downloadADLExamples(
    onProgress: (progress: DownloadProgress) => void
  ): Promise<string[]> {
    try {
      await this.ensureDirectories();

      // Download the main zip file
      const mainZipPath = `${this.tempDirectory}AllGolfExamples.zip`;
      const extractedMainPath = `${this.tempDirectory}extracted/`;

      // Create download resumable
      this.downloadResumable = FileSystem.createDownloadResumable(
        ADL_DOWNLOAD_URL,
        mainZipPath,
        {},
        (downloadProgress) => {
          const progress: DownloadProgress = {
            bytesWritten: downloadProgress.totalBytesWritten,
            totalBytes: downloadProgress.totalBytesExpectedToWrite,
            percentage:
              downloadProgress.totalBytesExpectedToWrite > 0
                ? (downloadProgress.totalBytesWritten /
                    downloadProgress.totalBytesExpectedToWrite) *
                  100
                : 0,
          };
          onProgress(progress);
        }
      );

      // Download the file
      const downloadResult = await this.downloadResumable.downloadAsync();
      if (!downloadResult) {
        throw new Error('Download failed');
      }

      // Extract the main zip
      await FileSystem.makeDirectoryAsync(extractedMainPath, {
        intermediates: true,
      }).catch(() => {
        // Directory already exists
      });

      await unzip(mainZipPath, extractedMainPath);

      // Find all nested zip files
      const extractedFiles = await FileSystem.readDirectoryAsync(
        extractedMainPath
      );
      const courseZips = extractedFiles.filter((file) => file.endsWith('.zip'));

      // Extract each course zip
      const courseIds: string[] = [];
      for (const zipFile of courseZips) {
        const courseId = zipFile.replace('.zip', '');
        const zipPath = `${extractedMainPath}${zipFile}`;
        const coursePath = `${this.coursesDirectory}${courseId}/`;

        await FileSystem.makeDirectoryAsync(coursePath, {
          intermediates: true,
        }).catch(() => {
          // Directory already exists
        });

        await unzip(zipPath, coursePath);
        courseIds.push(courseId);

        // Save metadata
        await this.saveCourseMetadata(courseId, zipFile);
      }

      // Cleanup temp files
      await this.cleanupTemp();

      return courseIds;
    } catch (error) {
      // Cleanup on error
      await this.cleanupTemp();
      throw error;
    } finally {
      this.downloadResumable = null;
    }
  }

  /**
   * Save course metadata
   */
  private async saveCourseMetadata(
    courseId: string,
    originalName: string
  ): Promise<void> {
    const coursePath = `${this.coursesDirectory}${courseId}/`;
    const fileInfo = await FileSystem.getInfoAsync(coursePath);

    const metadata: DownloadedCourse = {
      id: courseId,
      name: originalName.replace('.zip', ''),
      path: coursePath,
      size: (fileInfo as FileSystem.FileInfo).size || 0,
      downloadedAt: new Date(),
    };

    await FileSystem.writeAsStringAsync(
      `${coursePath}metadata.json`,
      JSON.stringify(metadata)
    );
  }

  /**
   * Cleanup temporary files
   */
  private async cleanupTemp(): Promise<void> {
    try {
      const tempInfo = await FileSystem.getInfoAsync(this.tempDirectory);
      if (tempInfo.exists) {
        await FileSystem.deleteAsync(this.tempDirectory, { idempotent: true });
      }
    } catch (error) {
      // Ignore cleanup errors
      console.warn('Failed to cleanup temp directory:', error);
    }
  }

  /**
   * Cancel ongoing download
   */
  async cancelDownload(): Promise<void> {
    if (this.downloadResumable) {
      await this.downloadResumable.cancelAsync();
      this.downloadResumable = null;
      await this.cleanupTemp();
    }
  }

  /**
   * Check if download is in progress
   */
  isDownloading(): boolean {
    return this.downloadResumable !== null;
  }

  /**
   * Get list of downloaded courses
   */
  async getDownloadedCourses(): Promise<DownloadedCourse[]> {
    try {
      await this.ensureDirectories();
      const courses: DownloadedCourse[] = [];

      const directories = await FileSystem.readDirectoryAsync(
        this.coursesDirectory
      );

      for (const dir of directories) {
        const metadataPath = `${this.coursesDirectory}${dir}/metadata.json`;
        const metadataInfo = await FileSystem.getInfoAsync(metadataPath);

        if (metadataInfo.exists) {
          const metadataContent = await FileSystem.readAsStringAsync(
            metadataPath
          );
          const metadata = JSON.parse(metadataContent) as DownloadedCourse;

          // Recalculate size
          const coursePath = `${this.coursesDirectory}${dir}/`;
          const size = await this.getDirectorySize(coursePath);
          metadata.size = size;

          courses.push({
            ...metadata,
            downloadedAt: new Date(metadata.downloadedAt),
          });
        }
      }

      return courses.sort(
        (a, b) => b.downloadedAt.getTime() - a.downloadedAt.getTime()
      );
    } catch (error) {
      console.error('Failed to get downloaded courses:', error);
      return [];
    }
  }

  /**
   * Get total size of a directory recursively
   */
  private async getDirectorySize(dirPath: string): Promise<number> {
    try {
      let totalSize = 0;
      const items = await FileSystem.readDirectoryAsync(dirPath);

      for (const item of items) {
        const itemPath = `${dirPath}${item}`;
        const info = await FileSystem.getInfoAsync(itemPath);

        if (info.exists) {
          if (info.isDirectory) {
            totalSize += await this.getDirectorySize(`${itemPath}/`);
          } else {
            totalSize += (info as FileSystem.FileInfo).size || 0;
          }
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to get directory size:', error);
      return 0;
    }
  }

  /**
   * Delete a downloaded course
   */
  async deleteCourse(courseId: string): Promise<void> {
    const coursePath = `${this.coursesDirectory}${courseId}/`;
    await FileSystem.deleteAsync(coursePath, { idempotent: true });
  }

  /**
   * Get total storage used by all courses
   */
  async getTotalStorageUsed(): Promise<number> {
    try {
      const courses = await this.getDownloadedCourses();
      return courses.reduce((total, course) => total + course.size, 0);
    } catch (error) {
      console.error('Failed to get total storage:', error);
      return 0;
    }
  }

  /**
   * Get available device storage
   */
  async getAvailableStorage(): Promise<number> {
    try {
      const info = await FileSystem.getFreeDiskStorageAsync();
      return info;
    } catch (error) {
      console.error('Failed to get available storage:', error);
      return 0;
    }
  }

  /**
   * Format bytes to human-readable string
   */
  static formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
