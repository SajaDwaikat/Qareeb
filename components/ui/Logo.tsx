import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const Logo = ({ title = "Nablus Live", icon = "business-outline" }) => {
  return (
    <View style={styles.logoRow}>
      <View style={styles.logoCircle}>
        <LinearGradient
          colors={["#1c6ea4", "#3aa0ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientCircle}
        >
          <Ionicons name={icon as any} size={28} color="#fff" />
        </LinearGradient>
      </View>

      <Text style={styles.brand}>{title}</Text>
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logoCircle: {
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },

  gradientCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  brand: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0169d8",
  },
});