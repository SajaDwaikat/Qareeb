import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  item: any;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export default function PropertyRequestCard({
  item,
  onAccept,
  onReject,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.location}>{item.location}</Text>

      <View style={styles.buttons}>
        <Pressable
          style={[styles.button, styles.accept]}
          onPress={() => onAccept(item.id)}
        >
          <Text style={styles.text}>Accept</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.reject]}
          onPress={() => onReject(item.id)}
        >
          <Text style={styles.text}>Reject</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  location: {
    color: "#777",
    marginTop: 4,
  },
  buttons: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  accept: {
    backgroundColor: "#2ecc71",
  },
  reject: {
    backgroundColor: "#e74c3c",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});