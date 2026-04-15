
import { useEffect } from "react";
import { router } from "expo-router";

export default function Splash() {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/(auth)/user-type");
    }, 1000);
  }, []);

  return null;
}