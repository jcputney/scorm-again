import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import type { Course } from "../services/CourseStorage";

interface CourseCardProps {
  course: Course;
  onPress: () => void;
  onLongPress?: () => void;
  isOnline: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onPress,
  onLongPress,
  isOnline,
}) => {
  const canDelete = !course.isBuiltIn;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={canDelete ? onLongPress : undefined}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <FontAwesome name="book" size={32} color="#2f95dc" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>

          <View style={styles.badges}>
            {!isOnline && (
              <View style={[styles.badge, styles.offlineBadge]}>
                <FontAwesome name="wifi" size={12} color="#fff" />
                <Text style={styles.badgeText}>Offline</Text>
              </View>
            )}

            {course.isBuiltIn && (
              <View style={[styles.badge, styles.builtInBadge]}>
                <FontAwesome name="star" size={12} color="#fff" />
                <Text style={styles.badgeText}>Built-in</Text>
              </View>
            )}

            {course.downloadedAt && (
              <View style={[styles.badge, styles.downloadedBadge]}>
                <FontAwesome name="check-circle" size={12} color="#fff" />
                <Text style={styles.badgeText}>Downloaded</Text>
              </View>
            )}
          </View>

          {course.downloadedAt && (
            <Text style={styles.metadata}>
              Downloaded:{" "}
              {new Date(course.downloadedAt).toLocaleDateString()}
            </Text>
          )}
        </View>

        <View style={styles.chevronContainer}>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </View>
      </View>

      {canDelete && Platform.OS === "ios" && (
        <Text style={styles.longPressHint}>Long press to delete</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  offlineBadge: {
    backgroundColor: "#ff9800",
  },
  builtInBadge: {
    backgroundColor: "#4caf50",
  },
  downloadedBadge: {
    backgroundColor: "#2196f3",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
  metadata: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  longPressHint: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
    paddingBottom: 8,
    fontStyle: "italic",
  },
});
