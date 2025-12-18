import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { CourseCard } from "@/src/components/CourseCard";
import courseStorage, { Course } from "@/src/services/CourseStorage";
import networkStatus from "@/src/services/NetworkStatus";

export default function LibraryScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCourses = useCallback(async () => {
    try {
      const loadedCourses = await courseStorage.listCourses();
      setCourses(loadedCourses);
    } catch (error) {
      console.error("Error loading courses:", error);
      Alert.alert("Error", "Failed to load courses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadCourses();
    setIsRefreshing(false);
  }, [loadCourses]);

  const handleCoursePress = useCallback(
    (course: Course) => {
      router.push(`/player/${course.id}`);
    },
    [router],
  );

  const handleCourseLongPress = useCallback(
    (course: Course) => {
      if (course.isBuiltIn) {
        return;
      }

      Alert.alert(
        "Delete Course",
        `Are you sure you want to delete "${course.title}"? This will remove all course files from your device.`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await courseStorage.deleteCourse(course.id);
                await loadCourses();
                Alert.alert("Success", "Course deleted successfully");
              } catch (error) {
                console.error("Error deleting course:", error);
                Alert.alert(
                  "Error",
                  "Failed to delete course. Please try again.",
                );
              }
            },
          },
        ],
      );
    },
    [loadCourses],
  );

  useEffect(() => {
    // Start network monitoring
    networkStatus.startMonitoring();
    setIsOnline(networkStatus.getStatus());

    const unsubscribe = networkStatus.addListener((online) => {
      setIsOnline(online);
    });

    // Load courses
    loadCourses();

    return () => {
      unsubscribe();
      networkStatus.stopMonitoring();
    };
  }, [loadCourses]);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="book" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Courses Available</Text>
      <Text style={styles.emptySubtitle}>
        Download courses from the Downloads tab to get started.
      </Text>
    </View>
  );

  const renderCourseCard = ({ item }: { item: Course }) => (
    <CourseCard
      course={item}
      onPress={() => handleCoursePress(item)}
      onLongPress={() => handleCourseLongPress(item)}
      isOnline={isOnline}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f95dc" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Course Library</Text>
        <View style={styles.networkStatus}>
          <FontAwesome
            name={isOnline ? "wifi" : "wifi"}
            size={16}
            color={isOnline ? "#4caf50" : "#ff9800"}
          />
          <Text
            style={[
              styles.networkText,
              { color: isOnline ? "#4caf50" : "#ff9800" },
            ]}
          >
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      <FlatList
        data={courses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          courses.length === 0 ? styles.emptyListContainer : styles.listContent
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#2f95dc"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  networkStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  networkText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
});
