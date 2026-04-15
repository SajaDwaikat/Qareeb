import React, { useMemo, useState } from "react";
import {View,Text,StyleSheet,TextInput,Pressable,ScrollView,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MyListingCard from "../../components/owner/MyListingCard";
import FilterButton from "../../components/owner/FilterButton";

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

export default function MyListings() {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest First");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [listings, setListings] = useState<ListingType[]>([
    {
      id: "1",
      title: "Modern Studio near KAU",
      location: "Al-Jamia District",
      price: 1200,
      image: require("../../assets/images/modern apartment interior.png"),
      status: "Available",
      category: "Student",
      completion: "85%",
      views: 124,
      likes: 18,
    },
    {
      id: "2",
      title: "Shared Room for Students",
      location: "Al-Safa",
      price: 600,
      image: require("../../assets/images/nablus -modern.png"),
      status: "Full",
      category: "Single",
      completion: "60%",
      views: 89,
      likes: 12,
    },
    {
      id: "3",
      title: "Family Apartment 3BR",
      location: "Al-Rawdah",
      price: 3500,
      image: require("../../assets/images/nablus2.png"),
      status: "Pending",
      category: "Family",
      completion: "45%",
      views: 45,
      likes: 5,
    },
    {
      id: "4",
      title: "Student Room in Rafidia",
      location: "Rafidia",
      price: 900,
      image: require("../../assets/images/nablus house.png"),
      status: "Incomplete",
      category: "Student",
      completion: "40%",
      views: 68,
      likes: 7,
    },
    {
      id: "5",
      title: "Private Studio in Nablus",
      location: "City Center",
      price: 1500,
      image: require("../../assets/images/modern apartment interior.png"),
      status: "Available",
      category: "Single",
      completion: "95%",
      views: 201,
      likes: 33,
    },
    {
      id: "6",
      title: "Family Flat near University",
      location: "Rafidia",
      price: 2800,
      image: require("../../assets/images/nablus2.png"),
      status: "Pending",
      category: "Family",
      completion: "70%",
      views: 92,
      likes: 14,
    },
  ]);

  const handleDelete = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  const handleArchive = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
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

  const filters = ["All", "Available", "Full", "Pending", "Incomplete"];
  const sortOptions = [
    "Newest First",
    "Oldest First",
    "Highest Price",
    "Lowest Price",
    "Most Viewed",
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Listings</Text>
        <Text style={styles.subtitle}>
          Manage and monitor all your property listings
        </Text>
      </View>

      <View style={styles.searchRow}>
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
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  headerRow: {
    marginBottom: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 27,
    fontWeight: "600",
    color: "#10203A",
    marginBottom: 6,
    textAlign: "center",
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 15,
    color: "#667085",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
    fontWeight: "400",
  },

  searchRow: {
    marginBottom: 18,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 14,
    marginBottom: 12,
    height: 56,
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