import React, { useCallback, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import {View,  Text,  StyleSheet,  Pressable,  ScrollView,  Image,Alert,  ActivityIndicator,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

type ArchivedListing = {
  id: string;
  title: string;
  location: string;
  price: number;
  image: any;
  imageKey: string;
  status: "Available" | "Full" | "Pending";
  category: string;
  completion: string;
  views: number;
  likes: number;
  archived: number;
};

const IMAGES: Record<string, any> = {
  modern: require("../assets/images/modern apartment interior.png"),
  nablusModern: require("../assets/images/nablus -modern.png"),
  nablus2: require("../assets/images/nablus2.png"),
  nablusHouse: require("../assets/images/nablus house.png"),
};

export default function ArchivePage() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [archivedListings, setArchivedListings] = useState<ArchivedListing[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const database = await SQLite.openDatabaseAsync("my_listings_offline.db");

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS listings (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          location TEXT NOT NULL,
          price INTEGER NOT NULL,
          imageKey TEXT NOT NULL,
          status TEXT NOT NULL,
          category TEXT NOT NULL,
          completion TEXT NOT NULL,
          views INTEGER NOT NULL,
          likes INTEGER NOT NULL,
          archived INTEGER NOT NULL DEFAULT 0
        );
      `);

      if (!cancelled) {
        setDb(database);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const reloadArchivedListings = useCallback(async () => {
    if (!db) return;

    try {
      setLoading(true);

      const rows = await db.getAllAsync<any>(
        "SELECT * FROM listings WHERE archived = 1 ORDER BY CAST(id AS INTEGER) DESC;"
      );

      const mappedRows: ArchivedListing[] = rows.map((item) => ({
        id: item.id,
        title: item.title,
        location: item.location,
        price: item.price,
        imageKey: item.imageKey,
        image: IMAGES[item.imageKey] ?? IMAGES.modern,
        status: item.status,
        category: item.category,
        completion: item.completion,
        views: item.views,
        likes: item.likes,
        archived: item.archived,
      }));

      setArchivedListings(mappedRows);
    } catch (error) {
      console.log("Error fetching archived listings:", error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    void reloadArchivedListings();
  }, [reloadArchivedListings]);

  useFocusEffect(
    useCallback(() => {
      void reloadArchivedListings();
    }, [reloadArchivedListings])
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this archived listing?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!db) return;

            try {
              await db.runAsync("DELETE FROM listings WHERE id = ?;", id);
              await reloadArchivedListings();
            } catch (error) {
              console.log("Error deleting listing:", error);
            }
          },
        },
      ]
    );
  };

  const handleRestore = async (id: string) => {
    if (!db) return;

    try {
      await db.runAsync("UPDATE listings SET archived = 0 WHERE id = ?;", id);
      await reloadArchivedListings();
      router.replace("/(owner-tabs)/my-listings");
    } catch (error) {
      console.log("Error restoring listing:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F80ED" />
        <Text style={styles.loadingText}>Loading archived listings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#344054" />
        </Pressable>

        <View>
          <Text style={styles.title}>Archive</Text>
          <Text style={styles.subtitle}>
            View your archived property listings
          </Text>
        </View>
      </View>

      {archivedListings.length > 0 ? (
        archivedListings.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.imageWrapper}>
              <Image source={item.image} style={styles.image} />

              <View style={styles.topBadges}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>

                <View style={styles.archivedBadge}>
                  <Text style={styles.archivedText}>Archived</Text>
                </View>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>

              <View style={styles.completionBadge}>
                <Text style={styles.completionText}>{item.completion}</Text>
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={15} color="#667085" />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>

              <Text style={styles.price}>
                {item.price.toLocaleString()} ₪
                <Text style={styles.perMonth}> / month</Text>
              </Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="eye-outline" size={16} color="#667085" />
                  <Text style={styles.metaText}>{item.views}</Text>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons name="heart-outline" size={16} color="#667085" />
                  <Text style={styles.metaText}>{item.likes}</Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.restoreButton}
                  onPress={() => handleRestore(item.id)}
                >
                  <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.restoreText}>Restore</Text>
                </Pressable>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#DC2626" />
                </Pressable>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyBox}>
          <Ionicons name="archive-outline" size={34} color="#98A2B3" />
          <Text style={styles.emptyTitle}>No archived listings yet</Text>
          <Text style={styles.emptyText}>
            Listings you archive will appear here.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#667085",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
    marginTop: 8,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E4E7EC",
  },

  title: {
    fontSize: 27,
    fontWeight: "600",
    color: "#10203A",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: "#667085",
    lineHeight: 22,
    maxWidth: 280,
  },

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

  archivedBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  archivedText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
  },

  statusBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    backgroundColor: "#FFF6E8",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D97706",
  },

  completionBadge: {
    position: "absolute",
    top: 14,
    right: 14,
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

  content: {
    padding: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },

  locationRow: {
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
    gap: 10,
  },

  restoreButton: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    backgroundColor: "#2FA7B9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  restoreText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  deleteButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F3D1D1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    marginTop: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 12,
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    color: "#667085",
    textAlign: "center",
    lineHeight: 20,
  },
});