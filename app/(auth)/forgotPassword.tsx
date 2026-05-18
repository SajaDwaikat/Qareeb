import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {router} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/AuthCard";
import { auth } from "../../lib/firebase";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Success",
        "Password reset email sent successfully!"
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#2563eb" />
        </View>

        <Text style={styles.title}>Reset Your Password</Text>

        <Text style={styles.subtitle}>
          Enter the email address associated with your sanctuary account and
          we'll send you a secure link to reset your password.
        </Text>

        <Text style={styles.label}>EMAIL ADDRESS</Text>

        <TextInput
          placeholder="name@example.com"
          placeholderTextColor="#b0b0b0"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          title="Send Reset Link →"
          onPress={handleResetPassword}
        />

        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#2563eb"
            style={{ marginTop: 2 }}
          />

          <Text style={styles.infoText}>
            If you don't receive an email within 5 minutes, please check your
            spam folder or ensure the email address entered is correct.
          </Text>
        </View>

        <TouchableOpacity 
        style={styles.footerLink}
          onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.footerText}>‹ Return to login</Text>
        </TouchableOpacity>
      </Card>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f8fc",
    paddingHorizontal: 18,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    marginBottom: 10,
  },

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
  },

  card: {
    borderRadius: 35,
    padding: 24,
    backgroundColor: "#fff",
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 38,
    fontWeight: "300",
    color: "#333",
    lineHeight: 42,
    marginBottom: 18,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 26,
    color: "#666",
    marginBottom: 28,
  },

  label: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: "700",
    color: "#666",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#f3f3f3",
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 60,
    fontSize: 16,
    color: "#333",
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderRadius: 22,
    padding: 16,
    marginTop: 30,
    gap: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#6b7280",
  },

  footerLink: {
    alignItems: "center",
    marginTop: 28,
  },

  footerText: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 14,
  },
});