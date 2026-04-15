import { router } from "expo-router";
import { SafeAreaFrameContext, SafeAreaView } from "react-native-safe-area-context";
import {ScrollView, StyleSheet, Text, View, Pressable, TouchableOpacity} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import Card from "@/components/ui/AuthCard";
import InputField from "@/components/ui/InputField";
import Button from "../../components/ui/Button";
import { useState } from "react";
import Checkbox from "expo-checkbox";
import { Linking } from "react-native";
import Logo from "@/components/ui/Logo";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth, db } from "../../lib/firebase";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";





const size = 60;
export default function Login() {
  const {role} = useLocalSearchParams();
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [errors, setErrors] = React.useState({
      email: "",
      password: "",
    });

  const handleLogin = async () => {
    let newErrors: any = {};

    if (!email) {
      newErrors.email = "Email is required"; 
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Enter a valid email address";
      }
    }
    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0){
      setErrors(newErrors);
      return;
    }



    try {

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;


      const docRef = doc(db, "user", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        if (userData.role === "User") {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(owner-tabs)/owner-dashboard");
        }
      } else {
        console.log("No user data found");
      }

    } catch (error: any) {
      console.log("ERROR CODE:", error.code);

      let errorMessage = "Login failed. Try again.";

      switch (error.code) {
        case "auth/user-not-found":
        case "auth/invalid-credential":
          errorMessage = "No account found with this email";
          break;

        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;


    } catch (error: any) {
      console.log("ERROR CODE:", error.code);

      let errorMessage = "Login failed. Try again.";

      switch (error.code) {
        case "auth/user-not-found":
        case "auth/invalid-credential":
          errorMessage = "No account found with this email";
          break;

        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;

        case "auth/invalid-email":
          errorMessage = "Invalid email format";
          break;
      }

      setErrors({
        email: "",
        password: errorMessage,
      });
    }
  }  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView contentContainerStyle={styles.container}>

        <Logo title="Qareeb" icon="business-outline" />

     
        <View style={styles.header}>
          <Text style={styles.title}>
            Welcome back to the{""}
            <Text style={styles.highlight}> heart</Text> of the city.
          </Text>
        </View>

        <Card>
          <Text style={styles.title}>Account Login</Text> 
          <Text style={styles.subtitle}>
            Enter your credentials to access your personalized dashboard and explore the best of Nablus.
          </Text>
            <InputField
                label="Email"
                icon="mail-outline"
                placeholder="email@example.com"
                value = {email}
                onChangeText={setEmail}
                
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <InputField
                label="Password"
                icon="lock-closed-outline"
                placeholder="••••••••"
                secure
                value= {password}
                onChangeText={setPassword}
                error = {errors.password}
                rightElement={
                  <Pressable onPress={() => router.replace("/(auth)/forgotPassword")}>
                    <Text style={{ color: "#0169d8", fontSize: 12 }}>
                      Forgot Password?
                    </Text>
                  </Pressable>
                }
             />
             {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

              <View style={styles.rememberRow}>
                <Checkbox
                    value={stayLoggedIn}
                    onValueChange={setStayLoggedIn}
                    color={stayLoggedIn ? "#1c6ea4" : undefined}
                    style={styles.checkbox}
                />
                  <Text style={styles.rememberText}>Stay logged in</Text>
              </View>

              <Button title="Log In" onPress={handleLogin} />
        
              <Text style={styles.divider}> OR CONTINUE WITH</Text>        

              <View style={styles.socialRow}>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => Linking.openURL("https://accounts.google.com")}
                >
                  <Ionicons name="logo-google" size={20} color="#1877F2" />
                  <Text> Google </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.socialButton}
                    onPress={() => Linking.openURL("https://www.facebook.com")}>
                    <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                  <Text> Facebook </Text>
                </TouchableOpacity>
              </View>  
    
              <Pressable
                  onPress={() => router.replace("/(auth)/signup")}
                  >
                  <Text style={styles.footer}>
                      Don't have an account?{" "}
                    <Text style={styles.signup}>Sign up</Text>
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
    flexGrow:1,
    paddingTop: 15,
    paddingHorizontal: 40,
    backgroundColor: "#f9fafb",
  },

  errorText:{
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },

  header:{
    marginTop:10,
    marginBottom:20,
  },

  title:{
    fontSize:24,
    fontWeight:"600",
    color: "#222",
  },

  highlight: {
    color: "#0169d8",
    fontWeight: "700",
  },

  subtitle:{
    paddingTop:10,
    fontSize:10,
    color: "#777",
  },

  rememberRow:{
    flexDirection:"row",
    alignItems:"center",
    marginTop:20,
  },

  checkbox:{
    marginRight: 6, 
    borderColor: "#c2c2c2",
    borderWidth: 1.5,  
  },

  rememberText:{
    fontSize: 12,
    color: "#666",
  },

  divider:{
    textAlign:"center",
    marginVertical:15,
    color:"#aaa",
    fontSize:11,
  },

  socialRow:{
    flexDirection:"row",
    justifyContent:"space-around",
    marginVertical:10,
  },

  socialButton:{
    flex:1,
    backgroundColor:"#f1f2f4",
    padding:10,
    borderRadius:20,
    alignItems:"center",
    marginHorizontal:5,
  },

  footer:{
    textAlign:"center",
    marginTop:15,
    color:"#777",
    fontSize:12,
  },

  signup:{
    color: "#0169d8",
    fontWeight:"600",
  },

  copy:{
    textAlign:"center",
    marginTop:30,
    color:"#aaa",
    fontSize:10,
  }

})