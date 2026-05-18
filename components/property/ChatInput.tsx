import React from "react";
import { View } from "react-native";
import { TextInput, IconButton } from "react-native-paper";
interface Props {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
}: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="اكتب سؤالك..."
        style={{ flex: 1 }}
        mode="outlined"
      />

      <IconButton
        icon="send"
        size={24}
        onPress={onSend}
      />
    </View>
  );
}