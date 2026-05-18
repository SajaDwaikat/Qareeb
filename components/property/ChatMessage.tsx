import React from "react";
import { View } from "react-native";
import { Text, Avatar } from "react-native-paper";
import PropertyCard from "./PropertyCard";

interface Props {
  message: string;
  isUser: boolean;
  properties?: any[];
}

export default function ChatMessage({
  message,
  isUser,
  properties
}: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: isUser
          ? "flex-end"
          : "flex-start",
        marginVertical: 6,
        paddingHorizontal: 10,
      }}
    >
      {/* Avatar AI */}
      {!isUser && (
        <Avatar.Text
          size={32}
          label="AI"
          style={{ marginRight: 8 }}
        />
      )}

      {/* Bubble */}
      <View
        style={{
          maxWidth: "75%",
          backgroundColor: isUser
            ? "#DCF8C5"
            : "#fff",
          padding: 12,
          borderRadius: 16,
          borderTopLeftRadius: isUser
            ? 16
            : 4,
          borderTopRightRadius: isUser
            ? 4
            : 16,
          elevation: 2,
        }}
      >
        <Text>{message}</Text>
        {
          properties?.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))
        }

      </View>
    </View>
  );
}