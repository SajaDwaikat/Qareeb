import React, { useState } from "react";
import { View,Text,StyleSheet,TextInput,FlatList,Pressable,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useProperties from "@/hooks/useProperties";
import PropertyCard from "@/components/property/PropertyCard";
import { Alert } from "react-native";


export default function Listings() {
const { properties } = useProperties();
  const [selectedTab, setSelectedTab] = useState("All");
  const [search, setSearch] = useState(""); 

  const [favorites, setFavorites] = useState<string[]>([]);


const toggleFavorite = (id: string) => {
  setFavorites((prev) => {
    const isFav = prev.includes(id);

    if (!isFav) {
      Alert.alert("❤️ Added", "Added to favorites");
    }

    return isFav
      ? prev.filter((f) => f !== id)
      : [...prev, id];
  });
};

const filteredProperties = properties.filter((item) => {
  const searchValue = search.trim().toLowerCase();
  const isNumber = !isNaN(Number(searchValue));

  const matchesTab =
    selectedTab === "All" ||
    item.type === selectedTab.toLowerCase();

  const matchesSearch =
    searchValue === "" ||
    (isNumber
      ? item.price <= Number(searchValue) 
      : item.title.toLowerCase().includes(searchValue)); 

  return matchesTab && matchesSearch;
});

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.logo}>🔍 Nablus Live</Text>
      </View>

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
        {["All", "Student", "Family"].map((tab) => (
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
    keyExtractor={(item) => item.id.toString()}
    showsVerticalScrollIndicator={false}
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
  contentContainerStyle={styles.listContent}

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

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },

  logo: {
    fontWeight: "700",
    fontSize: 16,
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

  emptyContainer: {
  alignItems: "center",
  marginTop: 50,
},

emptyText: {
  fontSize: 16,
  color: "#999",
},

  cardWrapper: {
    marginBottom: 16,
  },
});