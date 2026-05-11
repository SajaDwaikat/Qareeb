import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FlatList,
  KeyboardAvoidingView,
  View,
  Platform,
} from "react-native";

import ChatMessage from "@/components/property/ChatMessage";
import ChatInput from "@/components/property/ChatInput";
import TypingIndicator from "@/components/property/TypingIndicator";

import { fakeAI } from "@/services/fakeAI";
import { searchHousing } from "@/services/housingSearch";
import { buildPrompt } from "@/utils/promptBuilder";
import { Property } from "@/types/property";
type Message = {
  id: string;
  text: string;
  isUser: boolean;
  properties?: Property[];
};

export default function ChatScreen() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList<Message>>(null);

  // auto scroll
  useEffect(() => {
    flatListRef.current?.scrollToEnd({
      animated: true,
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const userText = text;

      // USER MESSAGE

      const userMsg = {
        id: Math.random().toString(),
        text: userText,
        isUser: true,
      };

      setMessages((prev) => [
        ...prev,
        userMsg,
      ]);

      setText("");

      // ======================
      // FAKE AI
      // ======================

      const ai =
        await fakeAI(userText);

      console.log(ai);

      // ======================
      // FIREBASE SEARCH
      // ======================

      const results =
        await searchHousing(
          ai.filters
        );

      console.log(results);

      // ======================
      // AI MESSAGE
      // ======================

      const aiMsg = {
        id: Math.random().toString(),
        text: ai.reply,
        isUser: false,
        properties: results,
      };

      setMessages((prev) => [
        ...prev,
        aiMsg,
      ]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
      keyboardVerticalOffset={90}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={({ item }) => (
            <ChatMessage
              message={item.text}
              isUser={item.isUser}
              properties={item.properties}
            />
          )}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 120,
          }}
        />

        {loading && <TypingIndicator />}

        {/* input */}
        <View
          style={{
            paddingBottom: 90,
            backgroundColor: "#f5f5f5",
          }}
        >
          <ChatInput
            value={text}
            onChange={setText}
            onSend={sendMessage}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}