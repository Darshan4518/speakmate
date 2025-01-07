import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SkeletonMessageProps {
  fadeAnim: Animated.Value;
}

const SkeletonMessage: React.FC<SkeletonMessageProps> = ({ fadeAnim }) => {
  return (
    <View style={styles.messageContainer}>
      <View style={styles.avatarContainer}>
        <Ionicons name="logo-android" size={24} color="#10B981" />
      </View>
      <View style={styles.messageContent}>
        <Animated.View
          style={[styles.skeletonLine, styles.shortLine, { opacity: fadeAnim }]}
        />
        <Animated.View
          style={[styles.skeletonLine, styles.longLine, { opacity: fadeAnim }]}
        />
        <Animated.View
          style={[
            styles.skeletonLine,
            styles.mediumLine,
            { opacity: fadeAnim },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
    backgroundColor: "#1F2937",
    borderRadius: 20,
    padding: 12,
  },
  skeletonLine: {
    height: 15,
    borderRadius: 4,
    backgroundColor: "#4B5563",
    marginBottom: 8,
  },
  shortLine: {
    width: "20%",
  },
  mediumLine: {
    width: "60%",
  },
  longLine: {
    width: "80%",
  },
});

export default SkeletonMessage;
