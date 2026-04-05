import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function UserType() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}>
      
      <Pressable onPress={() => router.push("/(auth)/login")}>
        <Text>Login</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/signup")}>
        <Text>Signup</Text>
      </Pressable>

    </View>
  );
}