import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type FilterButtonProps = {
  title: string;
  active: boolean;
  onPress: () => void;
};

export default function FilterButton({
  title,
  active,
  onPress,
}: FilterButtonProps) {
  return (
    <Pressable
      style={[styles.button, active && styles.buttonActive]}
      onPress={onPress}
    >
      <Text style={[styles.text, active && styles.textActive]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    marginRight: 10,
  },

  buttonActive: {
    backgroundColor: "#2FA7B9",
    borderColor: "#2FA7B9",
  },

  text: {
    color: "#667085",
    fontSize: 15,
    fontWeight: "600",
  },

  textActive: {
    color: "#FFFFFF",
  },
});