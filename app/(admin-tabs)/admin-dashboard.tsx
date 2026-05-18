import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { router } from "expo-router";
import Button from "../../components/ui/Button";
import Header from "@/components/ui/Header";

import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import StatCard from "@/components/admin/StatCard";
import PropertyRequestCard from "@/components/admin/PropertyRequestCard";

import usePendingProperties from "@/hooks/usePendingProperties";
import useAdminStats from "@/hooks/useAdminStats";
import { signOut } from "firebase/auth";


import {
  approveProperty,
  rejectProperty,
} from "@/services/propertyService";

export default function AdminDashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  
  const { requests, setRequests } = usePendingProperties();
  const { stats } = useAdminStats();

  useEffect(() => {
    checkAdmin();
  }, []);
  

  const checkAdmin = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        router.replace("/(auth)/login");
        return;
      }

      const docRef = doc(db, "user", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        router.replace("/(auth)/login");
        return;
      }

      const userData = docSnap.data();

      if (userData.role !== "Admin") {
        router.replace("/(tabs)/home");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const handleDetails = (id: string) => {
    router.push({
      pathname: "/property/[id]",
      params: { id },
    });
  };

 const handleAccept = async (id: string) => {
  await approveProperty(id);

  setRequests((prev) =>
    prev.filter((item) => item.id !== id)
  );
};

const handleReject = async (id: string) => {
  await rejectProperty(id);

  setRequests((prev) =>
    prev.filter((item) => item.id !== id)
  );
};
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isAdmin) return null;


  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/user-type");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };


  return (

    <View>

      <View style={styles.header}>
        <Header
          title="Admin Dashboard"
          showBackButton={false}
        />
      </View>



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

      <FlatList style={{ paddingHorizontal: 20 }}
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyRequestCard
            item={item}
            onAccept={handleAccept}
            onReject={handleReject}
            onDetails={handleDetails}
          />
        )}
      />


      <View style={{ marginHorizontal: 20 }}>
        <Button
          title="Log Out"
          onPress={handleLogout}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  header: {

    width: "100%",
    backgroundColor: "#fff",
    paddingTop: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 20,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
});