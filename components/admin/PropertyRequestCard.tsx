import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";

interface Props {
  item: any;
  onAccept: (id: string) => Promise<void>;
  onReject: (id: string) => void;
  onDetails: (id: string) => void;
}

export default function PropertyRequestCard({
  item,
  onAccept,
  onReject,
  onDetails,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>

      <Text style={styles.location}>
        {item.location}
      </Text>

      <View style={styles.buttons}>
        <Pressable
          style={[styles.button, styles.details]}
          onPress={() => onDetails(item.id)}
        >
          <Text style={styles.text}>Details</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.accept]}
          onPress={async () => {
            try {
              await onAccept(item.id);

              Alert.alert(
                "Success",
                "Request accepted successfully."
              );
              
            } catch (error) {
              Alert.alert(
                "Error",
                "Something went wrong."
              );
            }
          }}
        >
          <Text style={styles.text}>Accept</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.reject]}
          onPress={async () => {
            try {
              await onReject(item.id);

              Alert.alert(
                "Success",
                "Request rejected successfully."
              );
              
            } catch (error) {
              Alert.alert(
                "Error",
                "Something went wrong."
              );
            }
          }}
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
    marginTop: 14,
  },

  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },

  details: {
    backgroundColor: "#3498db",
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