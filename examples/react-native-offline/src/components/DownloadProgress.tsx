import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { CourseDownloader } from '../services/CourseDownloader';

interface DownloadProgressProps {
  bytesWritten: number;
  totalBytes: number;
  percentage: number;
  onCancel: () => void;
  style?: ViewStyle;
}

export default function DownloadProgress({
  bytesWritten,
  totalBytes,
  percentage,
  onCancel,
  style,
}: DownloadProgressProps) {
  const progressWidth = Math.min(Math.max(percentage, 0), 100);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.infoContainer}>
        <Text style={styles.statusText}>Downloading...</Text>
        <Text style={styles.percentageText}>{percentage.toFixed(1)}%</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progressWidth}%` }]} />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.bytesText}>
          {CourseDownloader.formatBytes(bytesWritten)} of{' '}
          {CourseDownloader.formatBytes(totalBytes)}
        </Text>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f95dc',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2f95dc',
    borderRadius: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bytesText: {
    fontSize: 14,
    color: '#666',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ff4444',
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
