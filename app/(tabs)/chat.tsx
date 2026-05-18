import React, { useState } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  StyleSheet,
  Keyboard,
  Pressable,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ChatMessage from "@/components/property/ChatMessage";
import ChatInput from "@/components/property/ChatInput";
import TypingIndicator from "@/components/property/TypingIndicator";

import { searchHousing } from "@/services/housingSearch";
import { askAI } from "@/services/openRouter";
import { buildPrompt } from "@/utils/promptBuilder";
type Message = {
  id: string;
  message: string;
  role: "user" | "ai";
  properties?: any[];
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      message: input,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    const userText = input;
    setInput("");
    setLoading(true);

    try {
      const prompt = buildPrompt(userText);

      const aiResponse = await askAI(prompt);

      let filters;

      try {
        filters = JSON.parse(aiResponse);
      } catch (e) {
        filters = {};
      }

      const properties = await searchHousing(filters);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        message:
          properties.length > 0
            ? "تم العثور على نتائج مناسبة "
            : "لا توجد نتائج مطابقة ",
        role: "ai",
        properties,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: "صار خطأ، حاول مرة ثانية",
          role: "ai",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={Keyboard.dismiss}
    >
      <LinearGradient
        colors={["#EAF4FF", "#F8FBFF", "#FFFFFF"]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : "height"
          }
          keyboardVerticalOffset={90}
        >
          {/* Hero Section */}
          {messages.length === 0 && (
            <View style={styles.heroContainer}>
              <View style={styles.robotCircle}>
                <MaterialCommunityIcons
                  name="robot-happy-outline"
                  size={80}
                  color="#0B6FB3"
                />
              </View>

              <Text style={styles.heroTitle}>
                Qareeb Chat
              </Text>

              <Text style={styles.heroSubtitle}>
                قريب منك دائمًا
              </Text>

              <Text style={styles.heroDescription}>
                أنا هون لمساعدتك تلاقي السكن المناسب
                حسب السعر، الموقع، والخدمات اللي
                بدك ياها
              </Text>

              <View style={styles.exampleBox}>
                <Text style={styles.exampleText}>
                  مثال:
                </Text>

                <Text style={styles.exampleMessage}>
                  "بدي ستوديو قريب من الجامعة
                  بسعر أقل من 1000"
                </Text>
              </View>
            </View>
          )}

          <FlatList

            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}

            data={messages}
            keyExtractor={(item) => item.id}

            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
            renderItem={({ item }) => (
              <ChatMessage
                message={item.message}
                isUser={item.role === "user"}
                properties={item.properties}
              />
            )}
          />

          {loading && <TypingIndicator />}

          <View style={styles.inputContainer}>
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={handleSend}
            />
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  heroContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 30,
  },

  robotCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#DDEFFF",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#0B6FB3",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 8,
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0B6FB3",
    marginTop: 22,
  },

  heroSubtitle: {
    fontSize: 18,
    color: "#444",
    marginTop: 6,
    fontWeight: "600",
  },

  heroDescription: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 26,
    marginTop: 18,
    paddingHorizontal: 10,
  },

  exampleBox: {
    marginTop: 26,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 20,
    width: "100%",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  exampleText: {
    color: "#0B6FB3",
    fontWeight: "700",
    marginBottom: 6,
  },

  exampleMessage: {
    color: "#444",
    fontSize: 14,
    lineHeight: 22,
  },

  inputContainer: {
    paddingHorizontal: 16,
    paddingBottom: 90,
    paddingTop: 10,
    backgroundColor: "transparent",
  },
});