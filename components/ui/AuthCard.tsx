import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp} from "react-native";

export default function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
  elevation: 3,
  },
});