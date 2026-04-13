import React, { useState, useMemo, useCallback } from "react";
import {View,Text,StyleSheet,TextInput,FlatList,Pressable,ActivityIndicator,Alert,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useFirebaseProperties from "@/hooks/useFirebaseProperties";
import PropertyCard from "@/components/property/PropertyCard";
import Header from "@/components/ui/Header";


const TABS = ["All", "Student", "Family"];
const filterProperties = (
  properties: any[],
  selectedTab: string,
  search: string
) => {
  const searchValue = search.trim().toLowerCase();
  const isNumber = searchValue !== "" && !isNaN(Number(searchValue));

  return properties.filter((item) => {
    const matchesTab =
      selectedTab === "All" ||
      item.type === selectedTab.toLowerCase();

    const matchesSearch =
      searchValue === "" ||
      (isNumber
        ? item.price <= Number(searchValue)
        : item.title.toLowerCase().includes(searchValue) ||
          item.location.toLowerCase().includes(searchValue));

    return matchesTab && matchesSearch;
  });
};


export default function Listings() {
  const { properties, loading } = useFirebaseProperties();

  const [selectedTab, setSelectedTab] = useState("All");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredProperties = useMemo(() => {
    return filterProperties(properties, selectedTab, search);
  }, [properties, selectedTab, search]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);

      if (!isFav) {
        Alert.alert("❤️ Added", "Added to favorites");
      }

      return isFav
        ? prev.filter((f) => f !== id)
        : [...prev, id];
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <Header title="Qareeb" />

      <Text style={styles.title}>Find your space in Nablus</Text>
      <Text style={styles.subtitle}>
        From student dorms in Rafidia to family estates.
      </Text>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search by area or property type..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => {
              setSelectedTab(tab);
              setSearch(""); // reset search
            }}
            style={[
              styles.tab,
              selectedTab === tab && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeText,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <PropertyCard
              property={item}
              showFavorite={true}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No results found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    paddingHorizontal: 20,
  },

  subtitle: {
    color: "#777",
    marginBottom: 10,
    paddingHorizontal: 20,
  },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 3,
    marginBottom: 5,
    marginHorizontal: 20,
  },

  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: "#000",
  },

  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  tab: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
  },

  activeTab: {
    backgroundColor: "#007AFF",
  },

  tabText: {
    fontSize: 14,
  },

  activeText: {
    color: "#fff",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  cardWrapper: {
    marginBottom: 16,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },

  emptyText: {
    fontSize: 16,
    color: "#999",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});