import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Button({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={["#1c6ea4", "#3aa0ff"]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }} 
        style={styles.button}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
  },
  button: {
    padding: 25,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 25,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});