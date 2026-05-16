import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const docRef = doc(db, "user", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();

            if (userData.role === "User") {
              router.replace("/(tabs)/home");

            } else if (userData.role === "Property Owner") {
              router.replace("/(owner-tabs)/owner-dashboard");

            } else {
              router.replace("/(admin-tabs)/admin-dashboard");
            }
          } else {
            router.replace("/splash");
          }

        } else {
          router.replace("/splash");
        }

      } catch (error) {
        console.log(error);
        router.replace("/splash");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}