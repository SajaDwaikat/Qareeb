import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as SQLite from "expo-sqlite";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

import { db as firebaseDb } from "@/lib/firebase";
import useApprovedProperties from "@/hooks/useApprovedProperties";

import MyListingCard from "../../components/owner/MyListingCard";
import FilterButton from "../../components/owner/FilterButton";
import Header from "../../components/ui/Header";

const FIREBASE_COLLECTION = "properties";

type ListingStatus = "Available" | "Full" | "Pending";

type ListingType = {
  id: string;
  ownerId?: string;
  title: string;
  location: string;
  price: number;
  image: any;
  imageKey: string;
  imageUrl?: string;
  status: ListingStatus;
  category: string;
  completion: string;
  views: number;
  likes: number;
  archived: number;
  source?: string;
};

const IMAGES: Record<string, any> = {
  modern: require("../../assets/images/modern apartment interior.png"),
  nablusModern: require("../../assets/images/nablus -modern.png"),
  nablus2: require("../../assets/images/nablus2.png"),
  nablusHouse: require("../../assets/images/nablus house.png"),
};

const getLocalImage = (imageKey?: string) => {
  if (imageKey && IMAGES[imageKey]) {
    return IMAGES[imageKey];
  }

  return IMAGES.modern;
};

const getFirebaseImageUrl = (item: any) => {
  if (typeof item.imageUrl === "string" && item.imageUrl.length > 0) {
    return item.imageUrl;
  }

  if (typeof item.image === "string" && item.image.length > 0) {
    return item.image;
  }

  if (typeof item.coverImage === "string" && item.coverImage.length > 0) {
    return item.coverImage;
  }

  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0];
  }

  return "";
};

const getStatusFromFirebase = (item: any): ListingStatus => {
  const approvalStatus = String(
    item.approvalStatus ?? item.approval ?? ""
  ).toLowerCase();

  const availabilityStatus = String(
    item.availabilityStatus ?? item.status ?? ""
  ).toLowerCase();

  if (approvalStatus === "pending") {
    return "Pending";
  }

  if (availabilityStatus === "full") {
    return "Full";
  }

  return "Available";
};

const mapRowToListing = (item: any): ListingType => {
  const imageUrl = item.imageUrl ?? "";
  const imageKey = item.imageKey ?? "modern";

  return {
    id: item.id,
    ownerId: item.ownerId ?? "",
    title: item.title ?? "",
    location: item.location ?? "",
    price: Number(item.price ?? 0),

    imageKey,
    imageUrl,
    image:
      imageUrl && imageUrl.length > 0
        ? { uri: imageUrl }
        : getLocalImage(imageKey),

    status: item.status ?? "Available",
    category: item.category ?? item.type ?? "Student",
    completion: item.completion ?? "100%",
    views: Number(item.views ?? 0),
    likes: Number(item.likes ?? 0),
    archived: Number(item.archived ?? 0),
    source: item.source ?? "local",
  };
};

const mapFirebaseToSQLiteItem = (item: any): Omit<ListingType, "image"> => {
  const imageUrl = getFirebaseImageUrl(item);
  const status = getStatusFromFirebase(item);

  return {
    id: item.id,
    ownerId: item.ownerId ?? "",
    title: item.title ?? "",
    location: item.location ?? "",
    price: Number(item.price ?? 0),
    imageKey: item.imageKey ?? "modern",
    imageUrl,
    status,
    category: item.category ?? item.type ?? "Student",
    completion: item.completion ?? "100%",
    views: Number(item.views ?? 0),
    likes: Number(item.likes ?? 0),
    archived: item.isArchived || item.archived ? 1 : 0,
    source: "firebase-approved",
  };
};

const addColumnIfMissing = async (
  database: SQLite.SQLiteDatabase,
  columnName: string,
  columnDefinition: string
) => {
  const columns = await database.getAllAsync<{ name: string }>(
    "PRAGMA table_info(listings);"
  );

  const exists = columns.some((column) => column.name === columnName);

  if (!exists) {
    await database.execAsync(
      `ALTER TABLE listings ADD COLUMN ${columnName} ${columnDefinition};`
    );
  }
};

export default function MyListings() {
  const { filter } = useLocalSearchParams();

  const { properties: approvedProperties } = useApprovedProperties();

  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [listings, setListings] = useState<ListingType[]>([]);

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest First");
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const setupDatabase = async () => {
      const database = await SQLite.openDatabaseAsync(
        "my_listings_offline.db"
      );

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS listings (
          id TEXT PRIMARY KEY NOT NULL,
          ownerId TEXT,
          title TEXT NOT NULL,
          location TEXT NOT NULL,
          price INTEGER NOT NULL,
          imageKey TEXT,
          imageUrl TEXT,
          status TEXT NOT NULL,
          category TEXT,
          completion TEXT,
          views INTEGER DEFAULT 0,
          likes INTEGER DEFAULT 0,
          archived INTEGER NOT NULL DEFAULT 0,
          source TEXT DEFAULT 'local'
        );
      `);

      await addColumnIfMissing(database, "ownerId", "TEXT");
      await addColumnIfMissing(database, "imageUrl", "TEXT");
      await addColumnIfMissing(database, "source", "TEXT DEFAULT 'local'");

      if (!cancelled) {
        setDb(database);
      }
    };

    void setupDatabase();

    return () => {
      cancelled = true;
    };
  }, []);

  const reload = useCallback(async () => {
    if (!db) return;

    const rows = await db.getAllAsync<any>(
      "SELECT * FROM listings WHERE archived = 0;"
    );

    const mappedRows = rows.map(mapRowToListing);

    setListings(mappedRows);
  }, [db]);

  const syncApprovedFromFirebaseToSQLite = useCallback(async () => {
    if (!db) return;

    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    const firebaseItems = approvedProperties
      .map((item: any) => mapFirebaseToSQLiteItem(item))
      .filter((item) => {
        const belongsToCurrentOwner =
          !item.ownerId || !userId || item.ownerId === userId;

        return (
          belongsToCurrentOwner &&
          item.status === "Available" &&
          item.archived === 0
        );
      });

    await db.runAsync(
      "DELETE FROM listings WHERE source = ?;",
      "firebase-approved"
    );

    for (const item of firebaseItems) {
      await db.runAsync(
        `
        INSERT OR REPLACE INTO listings
        (
          id,
          ownerId,
          title,
          location,
          price,
          imageKey,
          imageUrl,
          status,
          category,
          completion,
          views,
          likes,
          archived,
          source
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
        item.id,
        item.ownerId ?? "",
        item.title,
        item.location,
        item.price,
        item.imageKey,
        item.imageUrl ?? "",
        item.status,
        item.category,
        item.completion,
        item.views,
        item.likes,
        item.archived,
        item.source ?? "firebase-approved"
      );
    }

    await reload();
  }, [db, approvedProperties, reload]);

  useEffect(() => {
    if (!db) return;

    void reload();
  }, [db, reload]);

  useEffect(() => {
    if (!db) return;

    void syncApprovedFromFirebaseToSQLite();
  }, [db, syncApprovedFromFirebaseToSQLite]);

  useFocusEffect(
    useCallback(() => {
      void reload();
      void syncApprovedFromFirebaseToSQLite();
    }, [reload, syncApprovedFromFirebaseToSQLite])
  );

  useEffect(() => {
    if (typeof filter === "string" && filter.length > 0) {
      setSelectedFilter(filter);
    }
  }, [filter]);

  const handleDelete = async (id: string) => {
    if (!db) return;

    try {
      await deleteDoc(doc(firebaseDb, FIREBASE_COLLECTION, id));
    } catch (error) {
      console.log("Firebase delete skipped:", error);
    }

    await db.runAsync("DELETE FROM listings WHERE id = ?;", id);
    await reload();
  };

  const handleArchive = async (id: string) => {
    if (!db) return;

    try {
      await updateDoc(doc(firebaseDb, FIREBASE_COLLECTION, id), {
        isArchived: true,
      });
    } catch (error) {
      console.log("Firebase archive skipped:", error);
    }

    await db.runAsync("UPDATE listings SET archived = 1 WHERE id = ?;", id);
    await reload();
  };

  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (selectedFilter !== "All") {
      result = result.filter((item) => item.status === selectedFilter);
    }

    if (search.trim()) {
      const value = search.toLowerCase();

      result = result.filter((item) => {
        const title = item.title.toLowerCase();
        const location = item.location.toLowerCase();
        const status = item.status.toLowerCase();
        const category = item.category.toLowerCase();
        const price = item.price.toString();

        return (
          title.includes(value) ||
          location.includes(value) ||
          status.includes(value) ||
          category.includes(value) ||
          price.includes(value)
        );
      });
    }

    if (sortBy === "Newest First") {
      result = result.sort((a, b) => b.id.localeCompare(a.id));
    }

    if (sortBy === "Oldest First") {
      result = result.sort((a, b) => a.id.localeCompare(b.id));
    }

    if (sortBy === "Highest Price") {
      result = result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "Lowest Price") {
      result = result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "Most Viewed") {
      result = result.sort((a, b) => b.views - a.views);
    }

    return result;
  }, [listings, search, selectedFilter, sortBy]);

  const filters = ["All", "Available", "Full", "Pending"];

  const sortOptions = [
    "Newest First",
    "Oldest First",
    "Highest Price",
    "Lowest Price",
    "Most Viewed",
  ];

  return (
    <View style={styles.screen}>
      <Header title="My Listings" />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchRow}>
          <View style={styles.topActionRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#98A2B3" />

              <TextInput
                placeholder="Search listings..."
                placeholderTextColor="#98A2B3"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
            </View>

            <Pressable
              style={styles.archiveButton}
              onPress={() => router.push("/archive")}
            >
              <Ionicons name="archive-outline" size={18} color="#344054" />
              <Text style={styles.archiveButtonText}>Archive</Text>
            </Pressable>
          </View>

          <View style={styles.sortWrapper}>
            <Pressable
              style={styles.sortButton}
              onPress={() => setShowSortMenu(!showSortMenu)}
            >
              <Text style={styles.sortButtonText}>{sortBy}</Text>
              <Ionicons name="chevron-down" size={16} color="#344054" />
            </Pressable>

            {showSortMenu && (
              <View style={styles.sortMenu}>
                {sortOptions.map((item) => (
                  <Pressable
                    key={item}
                    style={styles.sortItem}
                    onPress={() => {
                      setSortBy(item);
                      setShowSortMenu(false);
                    }}
                  >
                    <Text style={styles.sortItemText}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {filters.map((item) => (
            <FilterButton
              key={item}
              title={item}
              active={selectedFilter === item}
              onPress={() => setSelectedFilter(item)}
            />
          ))}
        </ScrollView>

        <View style={styles.cardsContainer}>
          {filteredListings.map((item) => (
            <MyListingCard
              key={item.id}
              property={item}
              onDelete={handleDelete}
              onArchive={handleArchive}
            />
          ))}

          {filteredListings.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No listings found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },

  searchRow: {
    marginTop: 4,
    marginBottom: 22,
  },

  topActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 14,
    height: 56,
  },

  archiveButton: {
    height: 56,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  archiveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#111827",
  },

  sortWrapper: {
    position: "relative",
    zIndex: 20,
  },

  sortButton: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sortButtonText: {
    color: "#344054",
    fontSize: 15,
    fontWeight: "500",
  },

  sortMenu: {
    position: "absolute",
    top: 60,
    right: 0,
    left: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    overflow: "hidden",
  },

  sortItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  sortItemText: {
    color: "#344054",
    fontSize: 14,
  },

  filtersRow: {
    paddingBottom: 14,
    paddingRight: 6,
  },

  cardsContainer: {
    marginTop: 4,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },

  emptyText: {
    fontSize: 15,
    color: "#98A2B3",
    fontWeight: "500",
  },
});