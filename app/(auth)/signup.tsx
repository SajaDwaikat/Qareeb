import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function Signup() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
      <Text>Signup Screen</Text>

      <Pressable
        onPress={() => router.replace("/(tabs)/home")}
        style={{
          marginTop: 20,
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "#fff" }}>Signup</Text>
      </Pressable>

    </View>
  );
}