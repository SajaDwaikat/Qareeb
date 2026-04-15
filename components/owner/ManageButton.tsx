import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ManageButtonProps = {
  title: string;
  icon: any;
  filled?: boolean;
  backgroundColor?: string;
  onPress: () => void;
};

export default function ManageButton({
  title,
  icon,
  filled = false,
  backgroundColor,
  onPress,
}: ManageButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        filled ? styles.primaryButton : styles.secondaryButton,
        !filled && backgroundColor ? { backgroundColor } : null,
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Ionicons
          name={icon}
          size={18}
          color={filled ? "#FFFFFF" : "#4B5563"}
          style={styles.icon}
        />

        <Text
          style={[
            styles.text,
            filled ? styles.primaryText : styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButton: {
    backgroundColor: "#2F80ED",
  },

  secondaryButton: {
    backgroundColor: "#DCEAF5",
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    marginRight: 8,
  },

  text: {
    fontSize: 13,
    fontWeight: "600",
  },

  primaryText: {
    color: "#FFFFFF",
  },

  secondaryText: {
    color: "#4B5563",
  },
});