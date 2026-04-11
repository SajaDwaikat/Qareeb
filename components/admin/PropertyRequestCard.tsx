import * as React from "react";
import { Card, Text, Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";

export default function PropertyRequestCard({ item, onAccept, onReject }) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{item.title}</Text>
        <Text>{item.location}</Text>

        <View style={styles.row}>
          <Button
            mode="contained"
            onPress={() => onAccept(item.id)}
            style={styles.accept}
          >
            Accept
          </Button>

          <Button
            mode="contained"
            onPress={() => onReject(item.id)}
            style={styles.reject}
          >
            Reject
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  accept: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "#4CAF50",
  },
  reject: {
    flex: 1,
    marginLeft: 5,
    color: "#ffffff",
    backgroundColor: "#f44336",
  },
});