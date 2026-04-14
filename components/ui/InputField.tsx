import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type InputFieldProps = {
  label: string;
  icon: any;
  placeholder: string;
  secure?: boolean;
  rightElement?: React.ReactNode;
  value?: string;
  onChangeText?: (text: string) => void;
  
};
export default function InputField({
  label,
  icon,
  placeholder,
  secure,
  rightElement,
  value,
  onChangeText,
}: InputFieldProps) {
  return (
    <>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {rightElement}
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={18} color="#9ca3af" />
        <TextInput
          secureTextEntry={secure}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 14,
    color: "#555",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#111",
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});