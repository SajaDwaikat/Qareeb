import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {ScrollView, StyleSheet, Text, View, Pressable} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RoleButton from "../../components/ui/RoleButton";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import { router } from "expo-router";
import Header from "@/components/ui/Header";
import Card from "@/components/ui/AuthCard";


export default function Signup() {
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  const roles = [
    { name: "User", icon: "person-outline" },
    { name: "Owner", icon: "business-outline" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <Header title="Digital Sanctuary "/>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Ionicons name="business-outline" size={28} color="#0169d8" />
          </View>

          <Text style={styles.title}>Welcome to Nablus Live</Text>

          <Text style={styles.subtitle}>
            Your architectural portal to housing and luxury transport in the
            heart of Palestine.
          </Text>
        </View>

        <Card>
          <InputField
            label="Full Name"
            icon="person-outline"
            placeholder="Username"
          />

          <InputField
            label="Email"
            icon="mail-outline"
            placeholder="email@example.com"
          />

          <InputField
            label="Phone Number"
            icon="call-outline"
            placeholder="Phone Number"
          />

          <Text style={styles.label}>Account Category</Text>
          <View style={styles.roleContainer}>
            {roles.map((role) => (
              <RoleButton
                key={role.name}
                role={role}
                selected={selectedRole === role.name}
                onPress={() => setSelectedRole(role.name)}
              />
            ))}
          </View>

          <InputField
            label="Password"
            icon="lock-closed-outline"
            placeholder="••••••••"
            secure
          />

          <InputField
            label="Confirm Password"
            icon="shield-checkmark-outline"
            placeholder="••••••••"
            secure
          />

         <Button title="Sign Up" onPress={() => router.replace("/(auth)/login")} />

          <Pressable
            onPress={() => router.replace("/(auth)/login")}
            >
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text style={styles.loginText}>Login</Text>
            </Text>
          </Pressable>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },

  header: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },

  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#e6f0ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1c1c1c",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#6b6b6b",
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  label: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 14,
    color: "#555",
  },

  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  signupText: {
    color: "#fff",
    fontWeight: "bold",
  },

  footerText: {
    textAlign: "center",
    marginTop: 15,
    color: "#777",
  },

  loginText: {
    color: "#0169d8",
    fontWeight: "bold",
  },
});
