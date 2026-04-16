import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  title: string;
  value: number;
  icon: any;
}

export default function StatCard({ title, value, icon }: Props) {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons name={icon} size={28} color="#0A66C2" />

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  title: {
    color: "#777",
    marginTop: 4,
  },
});