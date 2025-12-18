import * as FileSystem from 'expo-file-system';

export class StorageService {
  private static instance: StorageService;
  private coursesDirectory: string;

  private constructor() {
    this.coursesDirectory = `${FileSystem.documentDirectory}courses/`;
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async getTotalStorageUsed(): Promise<number> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.coursesDirectory);
      if (!dirInfo.exists) {
        return 0;
      }

      // Get all course directories
      const contents = await FileSystem.readDirectoryAsync(this.coursesDirectory);
      let totalSize = 0;

      for (const item of contents) {
        const itemPath = `${this.coursesDirectory}${item}`;
        const size = await this.getDirectorySize(itemPath);
        totalSize += size;
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating storage:', error);
      return 0;
    }
  }

  private async getDirectorySize(directory: string): Promise<number> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        return 0;
      }

      const contents = await FileSystem.readDirectoryAsync(directory);
      let totalSize = 0;

      for (const item of contents) {
        const itemPath = `${directory}/${item}`;
        const info = await FileSystem.getInfoAsync(itemPath);

        if (info.isDirectory) {
          totalSize += await this.getDirectorySize(itemPath);
        } else if (info.size) {
          totalSize += info.size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error(`Error calculating directory size for ${directory}:`, error);
      return 0;
    }
  }

  async clearAllCourses(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.coursesDirectory);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(this.coursesDirectory, { idempotent: true });
      }
      // Recreate the directory
      await FileSystem.makeDirectoryAsync(this.coursesDirectory, {
        intermediates: true,
      });
    } catch (error) {
      console.error('Error clearing courses:', error);
      throw error;
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

export default StorageService.getInstance();
