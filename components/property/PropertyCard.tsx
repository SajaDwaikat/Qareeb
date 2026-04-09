import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

export default function PropertyCard({ property }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/property/[id]",
          params: { id: property.id },
        })
      }
      style={{
        width: 260,
        height:250,
        marginRight: 15,
        borderRadius: 25,
        overflow: "hidden",
        backgroundColor: "#fff",
        elevation: 6,
      }}
    >

        
      <Image
        source={{
          uri:
            property.image ||
            "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.25)",
          justifyContent: "space-between",
          padding: 12,
        }}
      >
        <View
          style={{
            alignSelf: "flex-end",
            backgroundColor: "#fff",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "600" }}>
            ⭐ {property.rating}
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
            }}
            numberOfLines={1}
          >
            {property.title}
          </Text>

          <Text style={{ color: "#fff", marginTop: 4 }}>
            ₪{property.price} / month
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}