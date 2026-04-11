import { View, Text, Pressable, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import useProperties from "@/hooks/useProperties";

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const { properties } = useProperties();

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Property not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>

      
      <Image
        source={{ uri: property.image }}
        style={{ width: "100%", height: 250 }}
      />

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {property.title}
        </Text>

        <Text style={{ marginTop: 10, fontSize: 16 }}>
          ₪{property.price} / month
        </Text>

        <Text style={{ marginTop: 10 }}>
          ⭐ {property.rating}
        </Text>

      
        <Pressable
          onPress={() => router.push("/booking")}
          style={{
            marginTop: 20,
            backgroundColor: "#007AFF",
            padding: 15,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Book Now
          </Text>
        </Pressable>
      </View>

    </View>
  );
}