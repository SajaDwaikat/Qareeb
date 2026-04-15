import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PropertyCard({
  property,
  showFavorite = false,
  isFavorite = false,
  onToggleFavorite,
}: any) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };

  return (
    <View style={styles.card}>
      
      <View>
        <Image source={{ uri: property.image }} style={styles.image} />

        <View style={styles.rating}>
          <Ionicons name="star" size={14} color="#f5a623" />
          <Text style={styles.ratingText}>
            {property.rating || 4.5}
          </Text>
        </View>

        {showFavorite && (
          <Pressable
            style={styles.favorite}
            onPress={onToggleFavorite}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={18}
              color={isFavorite ? "red" : "#333"}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.price}>
          ₪{property.price}
          <Text style={styles.per}> / month</Text>
        </Text>

        <Text style={styles.title}>{property.title}</Text>

        <View style={styles.rowInline}>
          <Ionicons name="location-outline" size={14} color="#777" />
          <Text style={styles.location}>
            {property.location || "Nablus"}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowInline}>
            <Ionicons name="bed-outline" size={14} color="#555" />
            <Text style={styles.detail}>
              {property.beds || 2} Rooms
            </Text>
          </View>

          <View style={styles.rowInline}>
            <Ionicons name="water-outline" size={14} color="#555" />
            <Text style={styles.detail}>
              {property.baths || 2} Baths
            </Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>View Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,

    marginBottom: 10,
  },

  image: {
    width: "100%",
    height: 190, 
  },

  rating: {
    position: "absolute",
    top: 12,
    right: 12, 
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  ratingText: {
    fontSize: 12,
    fontWeight: "700",
  },

  content: {
    padding: 16,
  },

  price: {
    fontSize: 18,
    fontWeight: "900",
    color: "#007AFF",
  },

  per: {
    fontSize: 12,
    color: "#777",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
    color: "#222",
  },

  location: {
    color: "#777",
    marginTop: 4,
    fontSize: 13,
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
    gap: 14,
  },

  detail: {
    fontSize: 12,
    color: "#555",
  },
  rowInline: {
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
},

  button: {
    marginTop: 16,
    backgroundColor: "#0A66C2",
    paddingVertical: 14,
    borderRadius: 30, 
    alignItems: "center",
  },

  favorite: {
  position: "absolute",
  top: 12,
  left: 12,
  backgroundColor: "#fff",
  width: 32,
  height: 32,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
},

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});