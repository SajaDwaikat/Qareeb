import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function PropertyCard({ property }: any) {
  return (

    
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "/property/[id]",
          params: { id: property.id },
        })
      }

      
      style={{
        width: 220,
        height: 260,
        backgroundColor: "#eee",
        borderRadius: 20,
        padding: 15,
        paddingBottom: 25,
        marginRight: 15,
        marginBottom: 10,
        justifyContent: "flex-end",
      }}
    >
      <View>
        <Text style={{ fontWeight: "bold" }}>{property.title}</Text>
        <Text>₪{property.price}</Text>
        <Text>⭐ {property.rating}</Text>
      </View>
    </TouchableOpacity>
  );
}