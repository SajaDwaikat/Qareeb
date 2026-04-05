import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
      <Text>Property ID: {id}</Text>

      <Pressable
  onPress={() =>
    router.push({
      pathname: "/booking",
    })
  }

        style={{
          marginTop: 20,
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 10,
        }}


        
      >
        <Text style={{ color: "#fff" }}>Book Now</Text>
      </Pressable>

    </View>
  );
}