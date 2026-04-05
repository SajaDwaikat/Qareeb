import { View, Text, Image, FlatList } from "react-native";
import useProperties from "@/hooks/useProperties";
import PropertyCard from "@/components/property/PropertyCard";

export default function Home() {
  const { featured } = useProperties();

  return (
    <View style={{ flex: 1 }}>

      {/* 🔥 Background Map/Image */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />

    
      <Text
        style={{
          marginTop: 50,
          marginLeft: 16,
          fontSize: 18,
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        Nablus Horizon
      </Text>

      {/* 🔥 Cards (BOTTOM OVERLAY) */}
      <View
        style={{
          position: "absolute",
          bottom: 100,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            marginLeft: 16,
            marginBottom: 10,
            paddingHorizontal: 10,
          }}
        >
          FEATURED IN NABLUS
        </Text>

        <FlatList
          data={featured}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PropertyCard property={item} />
          )}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>
    </View>
  );
}