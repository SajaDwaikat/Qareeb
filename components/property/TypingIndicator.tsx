import React, {useEffect,useState,} from "react";

import {View,Text,} from "react-native";

export default function TypingIndicator() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 500);

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <View
      style={{
        paddingHorizontal: 16,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          alignSelf: "flex-start",
          backgroundColor: "#ffffff",
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
          }}
        >
          {dots}
        </Text>
      </View>
    </View>
  );
}