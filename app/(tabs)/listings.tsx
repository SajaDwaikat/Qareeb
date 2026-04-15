import React, { useState, useMemo, useCallback, useEffect } from "react";
import {View,Text,StyleSheet,TextInput,FlatList,Pressable,ActivityIndicator,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useFirebaseProperties from "@/hooks/useFirebaseProperties";
import PropertyCard from "@/components/property/PropertyCard";
import Header from "@/components/ui/Header";

import {collection,addDoc,deleteDoc,query,where,getDocs,} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { Alert } from "react-native";


const TABS = ["All", "Student", "Family"];

const filterProperties = (
  properties: any[],
  selectedTab: string,
  search: string
) => {
  const searchValue = search.trim().toLowerCase();

  const isNumber = searchValue !== "" && !isNaN(Number(searchValue));

  return properties.filter((item) => {
    const title = item.title?.toLowerCase() || "";
    const location = item.location?.toLowerCase() || "";
    const type = item.type?.toLowerCase() || "";

    const matchesTab =
      selectedTab === "All" ||
      type === selectedTab.toLowerCase();

    const matchesSearch =
      searchValue === "" ||
      (isNumber
        ? item.price <= Number(searchValue)
        : title.includes(searchValue) ||
          location.includes(searchValue) ||
          type.includes(searchValue));

    return matchesTab && matchesSearch;
  });
};




export default function Listings() {
  const { properties, loading } = useFirebaseProperties();

  const [selectedTab, setSelectedTab] = useState("All");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const fetchFavorites = async () => {
    if (!userId) return;

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    const favIds = snapshot.docs.map(
      (doc) => doc.data().propertyId
    );

    setFavorites(favIds);
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

const toggleFavorite = useCallback(async (propertyId: string) => {
  if (!userId) return;

  const isFav = favorites.includes(propertyId);

  Alert.alert(
    isFav ? "Remove Favorite" : "Add to Favorites",
    isFav
      ? "Are you sure you want to remove this property from favorites?"
      : "Do you want to add this property to your favorites?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          const q = query(
            collection(db, "favorites"),
            where("userId", "==", userId),
            where("propertyId", "==", propertyId)
          );

          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            snapshot.forEach(async (docItem) => {
              await deleteDoc(docItem.ref);
            });
          } else {
            await addDoc(collection(db, "favorites"), {
              userId,
              propertyId,
            });
          }

          fetchFavorites(); 
        },
      },
    ]
  );
}, [userId, favorites]);
  const filteredProperties = useMemo(() => {
    return filterProperties(properties, selectedTab, search);
  }, [properties, selectedTab, search]);


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

      {/* Title */}
      <Text style={styles.title}>Find your space in Nablus</Text>
      <Text style={styles.subtitle}>
        Explore the best places around you
      </Text>

      {/* 🔍 Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search by location or price..."
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
              setSearch("");
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
            <Text style={styles.emptyText}>No properties found</Text>
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    marginHorizontal: 20,
    elevation: 2,
  },

  input: {
    flex: 1,
    paddingHorizontal: 5,
    color: "#000",
  },

  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
  },

  activeTab: {
    backgroundColor: "#007AFF",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "500",
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