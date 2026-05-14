import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stayLoggedIn = await AsyncStorage.getItem("stayLoggedIn");

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && stayLoggedIn) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/splash");
        }

        setLoading(false);
      });

      return unsubscribe;
    };

    init();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}