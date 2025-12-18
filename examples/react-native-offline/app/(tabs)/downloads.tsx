import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  CourseDownloader,
  DownloadProgress as DownloadProgressType,
  DownloadedCourse,
} from '@/src/services/CourseDownloader';
import DownloadProgress from '@/src/components/DownloadProgress';
import { useThemeColor } from '@/components/Themed';

export default function DownloadsScreen() {
  const [downloader] = useState(() => new CourseDownloader());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] =
    useState<DownloadProgressType | null>(null);
  const [downloadedCourses, setDownloadedCourses] = useState<
    DownloadedCourse[]
  >([]);
  const [totalStorage, setTotalStorage] = useState(0);
  const [availableStorage, setAvailableStorage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Load downloaded courses and storage info
  const loadData = useCallback(async () => {
    try {
      const [courses, total, available] = await Promise.all([
        downloader.getDownloadedCourses(),
        downloader.getTotalStorageUsed(),
        downloader.getAvailableStorage(),
      ]);

      setDownloadedCourses(courses);
      setTotalStorage(total);
      setAvailableStorage(available);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert(
        'Error',
        'Failed to load downloaded courses. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [downloader]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
  }, [loadData]);

  // Download ADL Golf Examples
  const handleDownload = useCallback(async () => {
    if (isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadProgress({ bytesWritten: 0, totalBytes: 0, percentage: 0 });

      const courseIds = await downloader.downloadADLExamples((progress) => {
        setDownloadProgress(progress);
      });

      // Success
      Alert.alert(
        'Download Complete',
        `Successfully downloaded ${courseIds.length} courses.`,
        [{ text: 'OK', onPress: () => loadData() }]
      );
    } catch (error: any) {
      console.error('Download failed:', error);

      // Check if it was cancelled
      if (error?.message?.includes('cancelled')) {
        Alert.alert('Download Cancelled', 'The download was cancelled.');
      } else {
        Alert.alert(
          'Download Failed',
          error?.message || 'An unexpected error occurred. Please try again.'
        );
      }
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  }, [isDownloading, downloader, loadData]);

  // Cancel download
  const handleCancelDownload = useCallback(async () => {
    Alert.alert(
      'Cancel Download',
      'Are you sure you want to cancel the download?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await downloader.cancelDownload();
            } catch (error) {
              console.error('Failed to cancel download:', error);
            }
          },
        },
      ]
    );
  }, [downloader]);

  // Delete course
  const handleDeleteCourse = useCallback(
    (course: DownloadedCourse) => {
      Alert.alert(
        'Delete Course',
        `Are you sure you want to delete "${course.name}"? This action cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await downloader.deleteCourse(course.id);
                await loadData();
                Alert.alert('Success', 'Course deleted successfully.');
              } catch (error) {
                console.error('Failed to delete course:', error);
                Alert.alert(
                  'Error',
                  'Failed to delete course. Please try again.'
                );
              }
            },
          },
        ]
      );
    },
    [downloader, loadData]
  );

  // Format date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#2f95dc" />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Downloads</Text>
        <Text style={styles.subtitle}>
          Manage your downloaded SCORM courses
        </Text>
      </View>

      {/* Download Button */}
      {!isDownloading && (
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
          activeOpacity={0.8}
        >
          <FontAwesome name="download" size={20} color="#fff" />
          <Text style={styles.downloadButtonText}>
            Download ADL Golf Examples
          </Text>
        </TouchableOpacity>
      )}

      {/* Download Progress */}
      {isDownloading && downloadProgress && (
        <DownloadProgress
          bytesWritten={downloadProgress.bytesWritten}
          totalBytes={downloadProgress.totalBytes}
          percentage={downloadProgress.percentage}
          onCancel={handleCancelDownload}
          style={styles.progressContainer}
        />
      )}

      {/* Storage Info */}
      <View style={styles.storageCard}>
        <View style={styles.storageRow}>
          <FontAwesome name="hdd-o" size={20} color="#666" />
          <Text style={styles.storageLabel}>Storage Used:</Text>
          <Text style={styles.storageValue}>
            {CourseDownloader.formatBytes(totalStorage)}
          </Text>
        </View>
        <View style={styles.storageRow}>
          <FontAwesome name="database" size={20} color="#666" />
          <Text style={styles.storageLabel}>Available:</Text>
          <Text style={styles.storageValue}>
            {CourseDownloader.formatBytes(availableStorage)}
          </Text>
        </View>
      </View>

      {/* Downloaded Courses */}
      <View style={styles.coursesSection}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Downloaded Courses ({downloadedCourses.length})
        </Text>

        {downloadedCourses.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome name="folder-open-o" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No courses downloaded yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Download the ADL Golf Examples to get started
            </Text>
          </View>
        ) : (
          downloadedCourses.map((course) => (
            <View key={course.id} style={styles.courseCard}>
              <View style={styles.courseInfo}>
                <View style={styles.courseHeader}>
                  <FontAwesome name="book" size={20} color="#2f95dc" />
                  <Text style={styles.courseName}>{course.name}</Text>
                </View>
                <View style={styles.courseDetails}>
                  <View style={styles.courseDetailRow}>
                    <FontAwesome name="calendar" size={14} color="#999" />
                    <Text style={styles.courseDetailText}>
                      {formatDate(course.downloadedAt)}
                    </Text>
                  </View>
                  <View style={styles.courseDetailRow}>
                    <FontAwesome name="archive" size={14} color="#999" />
                    <Text style={styles.courseDetailText}>
                      {CourseDownloader.formatBytes(course.size)}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCourse(course)}
                activeOpacity={0.7}
              >
                <FontAwesome name="trash-o" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  downloadButton: {
    backgroundColor: '#2f95dc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  storageCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  storageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  storageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  coursesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  courseInfo: {
    flex: 1,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  courseDetails: {
    marginLeft: 32,
  },
  courseDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  courseDetailText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 12,
    marginLeft: 12,
  },
});
