import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type StatCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: any;
  iconColor: string;
  iconBg: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  iconBg,
}: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View
        style={[
          styles.statIconWrapper,
          { backgroundColor: iconBg },
        ]}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>

      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E4E7EC",
  },

  statIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  statTitle: {
    fontSize: 15,
    color: "#667085",
    marginBottom: 8,
  },

  statValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 6,
  },

  statSubtitle: {
    fontSize: 13,
    color: "#16A34A",
  },
});