import React, { useState } from "react";
import {View,  Text,  StyleSheet,  Image,  Pressable,  Alert,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type ListingType = {
  id: string;
  title: string;
  location: string;
  price: number;
  image: any;
  status: "Available" | "Full" | "Pending" | "Incomplete";
  category: string;
  completion: string;
  views: number;
  likes: number;
};

type Props = {
  property: ListingType;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
};

export default function MyListingCard({
  property,
  onDelete,
  onArchive,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(property.id),
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push("/Prop/add");
  };

  const handleViewDetails = () => {
    router.push("/property/probrityDetails");
  };

  const getStatusStyle = () => {
    if (property.status === "Available") {
      return {
        bg: "#EAF8EF",
        color: "#16A34A",
      };
    }

    if (property.status === "Full") {
      return {
        bg: "#FDECEC",
        color: "#DC2626",
      };
    }

    if (property.status === "Pending") {
      return {
        bg: "#FFF6E8",
        color: "#D97706",
      };
    }

    return {
      bg: "#FDEFC7",
      color: "#B7791F",
    };
  };

  const statusStyle = getStatusStyle();

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={property.image} style={styles.image} />

        <View style={styles.topBadges}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{property.category}</Text>
          </View>

          <View style={styles.completionBadge}>
            <Text style={styles.completionText}>{property.completion}</Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyle.bg },
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {property.status}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{property.title}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={15} color="#667085" />
          <Text style={styles.locationText}>{property.location}</Text>
        </View>

        <Text style={styles.price}>
          {property.price.toLocaleString()} ₪
          <Text style={styles.perMonth}> / month</Text>
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="eye-outline" size={16} color="#667085" />
            <Text style={styles.metaText}>{property.views}</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="heart-outline" size={16} color="#667085" />
            <Text style={styles.metaText}>{property.likes}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.viewButton} onPress={handleViewDetails}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </Pressable>

          <Pressable style={styles.iconButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={18} color="#D97706" />
          </Pressable>

          <Pressable style={styles.iconButton} onPress={handleDelete}>
            <Ionicons name="close-circle-outline" size={18} color="#DC2626" />
          </Pressable>

          <View style={styles.menuWrapper}>
            <Pressable
              style={styles.iconButton}
              onPress={() => setShowMenu(!showMenu)}
            >
              <Ionicons name="ellipsis-horizontal" size={18} color="#667085" />
            </Pressable>

            {showMenu && (
              <View style={styles.menuBox}>
                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    onArchive(property.id);
                  }}
                >
                  <Ionicons name="archive-outline" size={16} color="#344054" />
                  <Text style={styles.menuText}>Archive</Text>
                </Pressable>

                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                >
                  <Ionicons name="trash-outline" size={16} color="#344054" />
                  <Text style={styles.menuText}>Delete</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E4E7EC",
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 190,
  },

  topBadges: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  categoryBadge: {
    backgroundColor: "#2D9CDB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  categoryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  completionBadge: {
    backgroundColor: "#F4FAEE",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  completionText: {
    color: "#5E8E56",
    fontSize: 12,
    fontWeight: "700",
  },

  statusBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  locationText: {
    fontSize: 14,
    color: "#667085",
    marginLeft: 6,
  },

  price: {
    fontSize: 18,
    fontWeight: "800",
    color: "#219EBC",
    marginBottom: 14,
  },

  perMonth: {
    fontSize: 14,
    color: "#667085",
    fontWeight: "500",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 14,
    gap: 16,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaText: {
    fontSize: 13,
    color: "#667085",
    marginLeft: 4,
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  viewButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  viewButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },

  menuWrapper: {
    position: "relative",
  },

  menuBox: {
    position: "absolute",
    right: 0,
    bottom: 48,
    width: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 20,
    elevation: 8,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },

  menuText: {
    fontSize: 14,
    color: "#344054",
    fontWeight: "500",
  },
});