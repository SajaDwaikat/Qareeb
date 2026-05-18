import React from "react";
import {View,Text,Image,StyleSheet,Pressable,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
export default function FavoritePropertyCard({
  property,
  onRemove,
}: any) {
  return (
    <View style={styles.card}>
      <View>
        <Image
          source={{ uri: property.image }}
          style={styles.image}
        />

        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>
            ₪{property.price}/mo
          </Text>
        </View>

        <Pressable
          style={styles.heart}
          onPress={() => onRemove(property.favoriteId)}
        >
          <Ionicons
            name="heart"
            size={18}
            color="#D83A56"
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {property.title}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={13}
            color="#777"
          />

          <Text style={styles.location}>
            {property.location}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 160,
  },

  priceBadge: {
    position: "absolute",
    left: 10,
    bottom: 10,
    backgroundColor: "#0A66C2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  priceText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    padding: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 4,
  },

  location: {
    fontSize: 12,
    color: "#777",
  },
});