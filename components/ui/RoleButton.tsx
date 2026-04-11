import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RoleButton({
  role,
  selected,
  onPress,
}: {
  role: any;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.roleButton, selected && styles.roleSelected]}
      onPress={onPress}
    >
      <Ionicons
        name={role.icon}
        size={20}
        color={selected ? "#0169d8" : "#777"}
        style={{ marginBottom: 5 }}
      />

      <Text
        style={[
          styles.roleText,
          selected && styles.roleTextSelected,
        ]}
      >
        {role.name.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  roleButton: {
    flex: 1,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#f2f2f2",
    marginHorizontal: 5,
    paddingVertical: 12,
    alignItems: "center",
  },
  roleSelected: {
    borderColor: "#0169d8",
    backgroundColor: "#e6f0ff",
  },
  roleText: {
    fontSize: 12,
    color: "#777",
    fontWeight: "600",
  },
  roleTextSelected: {
    color: "#0169d8",
    fontWeight: "bold",
  },
});