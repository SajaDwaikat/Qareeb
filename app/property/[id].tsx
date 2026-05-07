import {View,Text,Image,StyleSheet,Pressable,ActivityIndicator,} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import useFirebaseProperties from "@/hooks/useFirebaseProperties";

export default function PropertyDetails() {

  
  const { id } = useLocalSearchParams();
  const { properties, loading } = useFirebaseProperties();

  const property = properties.find(
    (item) => item.id?.toString() === id
  );

  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.center}>
        <Text>Property not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <Image source={{ uri: property.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{property.title}</Text>

        <Text style={styles.price}>
          ₪{property.price} / month
        </Text>

        <Text style={styles.location}>
          📍 {property.location}
        </Text>

        <Text>⭐ {property.rating}</Text>

        <Text>🛏 {property.beds} Rooms</Text>
        <Text>🛁 {property.baths} Baths</Text>

        <Pressable
  style={styles.bookButton}
  onPress={() =>
    router.push({
      pathname: "/booking",
      params: {
        propertyId: property.id,

        title: property.title,

        location: property.location,

        price: property.price,

        image: property.image,
      },
    })
  }
>
  <Text style={styles.bookButtonText}>
    Book Now
  </Text>
</Pressable>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  image: {
    width: "100%",
    height: 250,
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  price: {
    fontSize: 18,
    color: "#007AFF",
    marginTop: 6,
  },

  location: {
    marginTop: 6,
    color: "#777",
  },

 bookButton: {
  backgroundColor: "#007AFF",
  paddingVertical: 16,
  borderRadius: 16,
  alignItems: "center",
  marginTop: 20,
},

bookButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
},

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});