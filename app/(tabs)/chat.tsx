import React, { useState } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

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

      console.log("USER TEXT:", userText);
console.log("AI RAW RESPONSE:", aiResponse);

      let filters;

      try {
        filters = JSON.parse(aiResponse);
      } catch (e) {
        filters = {};
      }

console.log("PARSED FILTERS:", filters);
console.log("FINAL FILTERS TO SEARCH:", filters);

      const properties = await searchHousing(filters);
      console.log("FOUND PROPERTIES:", properties);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        message:
          properties.length > 0
            ? "تم العثور على نتائج مناسبة"
            : "لا توجد نتائج مطابقة",
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingVertical: 10,
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

      <View
        style={{
          paddingBottom: 90,
        }}
      >
        <View
          style={{
            paddingTop: 16,
            marginTop: 50,
          }}
        />
        <ChatInput 
          value={input}
          onChange={setInput}
          onSend={handleSend}
        />
      </View>
    </KeyboardAvoidingView>
  );
}