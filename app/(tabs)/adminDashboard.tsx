import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import StatCard from "../../components/admin/StatCard";
import PropertyRequestCard from "../../components/admin/PropertyRequestCard";

export default function AdminDashboardScreen() {
 
  const stats = {
    users: 120,
    owners: 40,
    renters: 80,
    properties: 55,
  };

  const requests = [
    { id: 1, title: "Apartment in Nablus", location: "Rafidia" },
    { id: 2, title: "Villa", location: "Beit Wazan" },
  ];

  const handleAccept = (id) => {
    console.log("Accepted:", id);
  };

  const handleReject = (id) => {
    console.log("Rejected:", id);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Admin Dashboard
      </Text>

      {/* 📊 Stats */}
      <View style={styles.statsRow}>
        <StatCard title="Users" value={stats.users} icon="account-group"/>
        <StatCard title="Properties" value={stats.properties} icon="home-city"/>
      </View>

      <View style={styles.statsRow}>
        <StatCard title="Owners" value={stats.owners} icon="home-account" />
        <StatCard title="Renters" value={stats.renters} icon="account" />
      </View>

      {/* 🏠 Requests */}
      <Text variant="titleLarge" style={styles.section}>
        Property Requests
      </Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
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
    padding: 15,
  },
  header: {
    marginTop: 40,
    marginBottom: 15,
    fontWeight: "bold",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
});