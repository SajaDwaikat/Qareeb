import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import StatCard from "@/components/admin/StatCard";
import PropertyRequestCard from "@/components/admin/PropertyRequestCard";
import usePendingProperties from "@/hooks/usePendingProperties";
import { approveProperty, rejectProperty } from "@/services/propertyService";  
import useAdminStats from "@/hooks/useAdminStats";

export default function AdminDashboardScreen() {
  const { requests } = usePendingProperties();

  const { stats } = useAdminStats();

  const handleAccept = async (id: string) => {
    await approveProperty(id);
  };

  const handleReject = async (id: string) => {
    await rejectProperty(id);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Admin Dashboard
      </Text>

      <View style={styles.statsRow}>
        <StatCard title="Users" value={stats.users} icon="account-group" />
        <StatCard title="Properties" value={stats.properties} icon="home-city" />
      </View>

      <View style={styles.statsRow}>
        <StatCard title="Owners" value={stats.owners} icon="home-account" />
        <StatCard title="Renters" value={stats.renters} icon="account" />
      </View>

      <Text variant="titleLarge" style={styles.section}>
        Property Requests
      </Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyRequestCard
            item={item}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    fontWeight: "bold",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
});