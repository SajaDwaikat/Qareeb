import React from "react";
import { Card, Icon, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";

export default function StatCard({ title, value, icon }) {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.row} >
        <View style={styles.iconContainer}>
          <Icon source={icon} size={32} />
          <Text variant="titleMedium">{title}</Text>
        </View>
        <View>
        
        <Text variant="headlineMedium" style={styles.value}>
          {value}
        </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    flex: 1,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "#DBE1FF",
  },
   row: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    marginTop: 10,
    fontWeight: "bold",
    marginLeft: 30,
  },
});