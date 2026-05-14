import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as SQLite from "expo-sqlite";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import MyListingCard from "../../components/owner/MyListingCard";
import FilterButton from "../../components/owner/FilterButton";
import Header from "../../components/ui/Header";

type ListingType = {
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
  modern: require("../../assets/images/modern apartment interior.png"),
  nablusModern: require("../../assets/images/nablus -modern.png"),
  nablus2: require("../../assets/images/nablus2.png"),
  nablusHouse: require("../../assets/images/nablus house.png"),
};

const initialListings = [
  {
    id: "1",
    title: "Modern Studio near KAU",
    location: "Al-Jamia District",
    price: 1200,
    imageKey: "modern",
    status: "Available",
    category: "Student",
    completion: "85%",
    views: 124,
    likes: 18,
    archived: 0,
  },
  {
    id: "2",
    title: "Shared Room for Students",
    location: "Al-Safa",
    price: 600,
    imageKey: "nablusModern",
    status: "Full",
    category: "Single",
    completion: "60%",
    views: 89,
    likes: 12,
    archived: 0,
  },
  {
    id: "3",
    title: "Family Apartment 3BR",
    location: "Al-Rawdah",
    price: 3500,
    imageKey: "nablus2",
    status: "Pending",
    category: "Family",
    completion: "45%",
    views: 45,
    likes: 5,
    archived: 0,
  },
  {
    id: "4",
    title: "Student Room in Rafidia",
    location: "Rafidia",
    price: 900,
    imageKey: "nablusHouse",
    status: "Available",
    category: "Student",
    completion: "40%",
    views: 68,
    likes: 7,
    archived: 0,
  },
  {
    id: "5",
    title: "Private Studio in Nablus",
    location: "City Center",
    price: 1500,
    imageKey: "modern",
    status: "Available",
    category: "Single",
    completion: "95%",
    views: 201,
    likes: 33,
    archived: 0,
  },
  {
    id: "6",
    title: "Family Flat near University",
    location: "Rafidia",
    price: 2800,
    imageKey: "nablus2",
    status: "Pending",
    category: "Family",
    completion: "70%",
    views: 92,
    likes: 14,
    archived: 0,
  },
];

export default function MyListings() {
  const { filter } = useLocalSearchParams();

  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [listings, setListings] = useState<ListingType[]>([]);

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest First");
  const [showSortMenu, setShowSortMenu] = useState(false);

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

      const row = await database.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM listings;"
      );

      if ((row?.count ?? 0) === 0) {
        for (const item of initialListings) {
          await database.runAsync(
            `
            INSERT INTO listings
            (id, title, location, price, imageKey, status, category, completion, views, likes, archived)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `,
            item.id,
            item.title,
            item.location,
            item.price,
            item.imageKey,
            item.status,
            item.category,
            item.completion,
            item.views,
            item.likes,
            item.archived
          );
        }
      }

      if (!cancelled) {
        setDb(database);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const reload = useCallback(async () => {
    if (!db) return;

    const rows = await db.getAllAsync<any>(
      "SELECT * FROM listings WHERE archived = 0 ORDER BY CAST(id AS INTEGER) DESC;"
    );

    const mappedRows: ListingType[] = rows.map((item) => ({
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

    setListings(mappedRows);
  }, [db]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload])
  );

  useEffect(() => {
    if (typeof filter === "string" && filter.length > 0) {
      setSelectedFilter(filter);
    }
  }, [filter]);

  const handleDelete = async (id: string) => {
    if (!db) return;

    await db.runAsync("DELETE FROM listings WHERE id = ?;", id);
    await reload();
  };

  const handleArchive = async (id: string) => {
    if (!db) return;

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

      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(value) ||
          item.location.toLowerCase().includes(value) ||
          item.status.toLowerCase().includes(value) ||
          item.category.toLowerCase().includes(value)
      );
    }

    if (sortBy === "Newest First") {
      result = result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    if (sortBy === "Oldest First") {
      result = result.sort((a, b) => Number(a.id) - Number(b.id));
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
});