import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type AlertCardProps = {
  text: string;
  icon: any;
  color: string;
  bg: string;
};

export default function AlertCard({
  text,
  icon,
  color,
  bg,
}: AlertCardProps) {
  return (
    <View style={styles.alertCard}>
      <View
        style={[
          styles.alertIconWrapper,
          { backgroundColor: bg },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={color}
        />
      </View>

      <Text style={styles.alertText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alertCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  alertIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  alertText: {
    flex: 1,
    fontSize: 14,
    color: "#344054",
    lineHeight: 20,
  },
});