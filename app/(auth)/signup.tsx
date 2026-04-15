import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {ScrollView, StyleSheet, Text, View, Pressable} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import { router, useLocalSearchParams } from "expo-router";
import Header from "@/components/ui/Header";
import Card from "@/components/ui/AuthCard";
import Logo from "@/components/ui/Logo";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const {role} = useLocalSearchParams();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [PhoneNum, setPhone] = React.useState("");

  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = async () => {
    let newErrors: any = {};

    if (!name) newErrors.name = "Full name is required";

    if (!email) {
      newErrors.email = "Email is required";
    } 
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    if (!PhoneNum) newErrors.phone = "Phone number is required";

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "user", user.uid), {
        name,
        email,
        PhoneNum,
        createdAt: new Date(),
      });

      if (role === "User"){
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(owner-tabs)/owner-dashboard");
      }


    } catch (error: any) {
      let message = "Something went wrong";
      if (error.code === "auth/email-already-in-use") {
        message = "Email already in use";
      }
      setErrors((prev) => ({ ...prev, email: message }));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <Logo icon="business-outline" />

          <Text style={styles.title}>Welcome to Qareeb</Text>

          <Text style={styles.subtitle}>
            Your architectural portal to housing and luxury transport in the
            heart of Palestine.
          </Text>
        </View>

        <Card>
          <Text style={styles.signup}> Sign Up</Text>
          <InputField
            label="Full Name"
            icon="person-outline"
            placeholder="Username"
            onChangeText={setName}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <InputField
            label="Email"
            icon="mail-outline"
            placeholder="email@example.com"
            onChangeText={setEmail}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <InputField
            label="Phone Number"
            icon="call-outline"
            placeholder="Phone Number"
            onChangeText={setPhone}
          />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

          <InputField
            label="Password"
            icon="lock-closed-outline"
            placeholder="••••••••"
            secure
            value={password}
            onChangeText={setPassword}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <InputField
            label="Confirm Password"
            icon="shield-checkmark-outline"
            placeholder="••••••••"
            secure
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {errors.confirmPassword ? (<Text style={styles.errorText}>{errors.confirmPassword}</Text>) : null}

         <Button title="Sign Up" onPress={handleSignup} />

          <Pressable
            onPress={() => router.replace("/(auth)/login")}
            >
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text style={styles.loginText}>Login</Text>
            </Text>
          </Pressable>
        </Card>
        <Text style={styles.copy}>
          © 2026 Qareeb. All rights reserved.
        </Text>
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
    marginTop: 10,
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

  signup:{
    fontSize: 20,
    fontWeight: 400,
    textAlign: "center",
    color: "#000000",
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

  errorText: {
  color: "#ff3b30",
  fontSize: 12,
  marginTop: 5,
  marginBottom: 10,
  marginLeft: 5,
},
copy:{
    textAlign:"center",
    marginTop:30,
    color:"#aaa",
    fontSize:10,
  },
});

