import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EmptyMessageList = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Ionicons name="chatbubbles-outline" size={80} color="#4B5563" />
      <Text style={styles.text}>No conversation yet</Text>
      <Text style={styles.subText}>
        Start a conversation with SpeakeMate AI
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B5563",
    marginTop: 20,
  },
  subText: {
    fontSize: 16,
    color: "#4B5563",
    marginTop: 10,
    textAlign: "center",
  },
});

export default EmptyMessageList;
