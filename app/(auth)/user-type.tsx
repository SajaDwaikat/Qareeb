import { View, Text, Pressable, TouchableOpacity, StyleSheet} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import Header from "@/components/ui/Header";
import { set } from "react-hook-form";
import Card from "@/components/ui/AuthCard";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
export default function UserType() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const roles: {
    name: string;
    icon: IconName;
    description: string;
  }[]=[
    {
      name: "User",
      icon: "person-outline",
      description:
        "Searching for affordable dorms and shared apartments near An-Najah University.",
    },
    {
      name: "Property Owner",
      icon: "key-outline",
      description:
        "Manage your listings, verify tenants, and optimize your rental income.",
    },

  ];
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <Header title="Qareeb"/>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Nablus</Text>
        <Text style={styles.subtitle}>
          Select your profile to personalize your experience with housing and
          transportation.
        </Text>

        {roles.map((role) => (
          <TouchableOpacity
            key={role.name}
            onPress={() => setSelectedRole(role.name)}
          >
            <Card 
              style={[
                styles.card,
                selectedRole === role.name && styles.cardSelected,
              ]}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name={role.icon} size={22} color="#0169d8" />
                </View>

                <Text style={styles.cardTitle}>{role.name}</Text>
                <Text style={styles.cardDescription}>{role.description}</Text>
              </Card>
          </TouchableOpacity>
        ))}
        <Button title="Continue" onPress={() => router.replace("/(auth)/signup")} />
      </View> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 30,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },

  card: {
    marginBottom: 50,
    alignItems: "center",
  },

  cardSelected: {
    borderColor: "#0169d88f",
    borderWidth: 2,
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e6f0ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  cardTitle:{
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
});