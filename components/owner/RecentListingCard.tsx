import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type RecentListingCardProps = {
  title: string;
  location: string;
  price: string;
  views: number;
  likes: number;
  status: string;
  statusBg: string;
  statusColor: string;
  image: any;
};

export default function RecentListingCard({
  title,
  location,
  price,
  views,
  likes,
  status,
  statusBg,
  statusColor,
  image,
}: RecentListingCardProps) {
  return (
    <Pressable style={styles.listingCard}>
      <Image source={image} style={styles.listingImage} />

      <View style={styles.listingContent}>
        <Text style={styles.listingTitle}>{title}</Text>
        <Text style={styles.listingLocation}>{location}</Text>
        <Text style={styles.listingPrice}>{price}</Text>

        <View style={styles.listingMetaRow}>
          <Text style={styles.listingMetaText}>Views: {views}</Text>
          <Text style={styles.listingMetaText}>Likes: {likes}</Text>
        </View>
      </View>

      <View style={styles.listingRightSide}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusBg },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: statusColor },
            ]}
          >
            {status}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color="#98A2B3"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    flexDirection: "row",
    marginBottom: 14,
    marginHorizontal: 20,
  },

  listingImage: {
    width: 82,
    height: 82,
    borderRadius: 16,
    marginRight: 12,
  },

  listingContent: {
    flex: 1,
    justifyContent: "center",
  },

  listingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },

  listingLocation: {
    fontSize: 14,
    color: "#667085",
    marginBottom: 6,
  },

  listingPrice: {
    fontSize: 14,
    color: "#2F80ED",
    fontWeight: "600",
    marginBottom: 8,
  },

  listingMetaRow: {
    flexDirection: "row",
  },

  listingMetaText: {
    fontSize: 13,
    color: "#667085",
    marginRight: 14,
  },

  listingRightSide: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});