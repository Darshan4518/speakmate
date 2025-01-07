import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ListRenderItem,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Message, useTeacherStore } from "@/store/useTeacherStore";
import axios from "axios";
import * as Speech from "expo-speech";
import SkeletonMessage from "@/components/SkeletanMessage";
import EmptyMessageList from "@/components/EmptyMessageList";

const API_URL = "http://192.168.63.129:3000";

export default function ChatHistoryScreen() {
  const { messages, addMessage, clearMessages, deleteMessage } =
    useTeacherStore();
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(0.3);
    }
  }, [isLoading]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    addMessage({ role: "user", content: input });
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, { message: input });
      const aiMessage: string = response.data.message;
      addMessage({ role: "assistant", content: aiMessage });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = useCallback((content: string) => {
    Speech.speak(content, {
      language: "en",
      pitch: 1,
      rate: 0.9,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
    });
  }, []);

  const handleStopSpeech = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.role === "user" ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      <View style={styles.avatarContainer}>
        <Ionicons
          name={item.role === "user" ? "person-circle" : "logo-android"}
          size={24}
          color={item.role === "user" ? "#7C3AED" : "#10B981"}
        />
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageSender}>
            {item.role === "user" ? "You" : "AI Assistant"}
          </Text>
          <Text style={styles.messageTime}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
        <Text
          style={[
            styles.messageText,
            item.role === "user"
              ? styles.userMessageText
              : styles.assistantMessageText,
          ]}
        >
          {item.content}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteMessage(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
        </TouchableOpacity>
        {item.role === "assistant" && (
          <TouchableOpacity
            style={styles.micButton}
            onPress={() =>
              isSpeaking ? handleStopSpeech() : handleSpeech(item.content)
            }
          >
            <Ionicons
              name={isSpeaking ? "stop-circle-outline" : "mic-outline"}
              size={16}
              color="#10B981"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.headerTitle}>SpeakeMate AI </Text>
        <TouchableOpacity onPress={clearMessages}>
          <Text style={{ color: "white" }}>Clear</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {messages.length === 0 ? (
          <EmptyMessageList />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            ListFooterComponent={() =>
              isLoading ? <SkeletonMessage fadeAnim={fadeAnim} /> : null
            }
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#6B7280"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={isLoading}
          >
            <Ionicons name="send" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
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
    maxWidth: "80%",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  messageSender: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  messageTime: {
    color: "#6B7280",
    fontSize: 12,
  },
  messageText: {
    fontSize: 16,
  },
  userMessage: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  assistantMessage: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  assistantMessageText: {
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    backgroundColor: "#000000",
  },
  input: {
    flex: 1,
    backgroundColor: "#1F2937",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "#FFFFFF",
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#4B5563",
  },
  actionButtons: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 8,
  },
  deleteButton: {
    padding: 4,
    marginBottom: 4,
  },
  micButton: {
    padding: 4,
  },
});
