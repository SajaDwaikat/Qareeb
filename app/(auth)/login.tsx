import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function Login() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
      <Text>Login Screen</Text>

      <Pressable
        onPress={() => router.replace("/(tabs)/home")}
        style={{
          marginTop: 20,
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "#fff" }}>Login</Text>
      </Pressable>

    </View>
  );
}