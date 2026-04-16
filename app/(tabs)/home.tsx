import React from "react";
import {View,Text,FlatList,StyleSheet,Image,Dimensions,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import PropertyCard from "@/components/property/PropertyCard";
import { ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useApprovedProperties from "@/hooks/useApprovedProperties";


const { width, height } = Dimensions.get("window");
export default function Home() {
  const { properties, loading } = useApprovedProperties();
  const tabHeight = useBottomTabBarHeight();

 if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

  return (
    
    <View style={styles.root}>
     
      <Image
        source={require("../../assets/images/nablus-map.png")}
        style={styles.bg}
      />

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        
<View style={styles.header}>
  <Ionicons name="location-sharp" size={20} color="#007AFF" />
  <Text style={styles.headerText}>Nablus Horizon</Text>
</View>
       
        <View style={styles.centerText}>
          <Text style={styles.title}>Qareeb</Text>
          <Text style={styles.subtitle}>
            Discover your perfect home in Nablus
          </Text>
        </View>

        
        <View style={[styles.section, { bottom: tabHeight + 100 }]}>
          <Text style={styles.badge}>FEATURED IN NABLUS</Text>

          <FlatList
            data={properties}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
           renderItem={({ item }) => (
  <View style={{ width: width * 0.78, marginRight: 16 }}>
    <PropertyCard property={item} />
  </View>
)}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  root: { flex: 1 },

  bg: {
    position: "absolute",
    width,
    height,
  },

  overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0,0,0,0.25)",
  pointerEvents: "none", 
},

safe: {
   flex: 1
   },


header: {
  marginTop: 10,
  marginHorizontal: 16,
  padding: 14,
  borderRadius: 18,
  backgroundColor: "#fff",
  flexDirection: "row",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
},

headerText: {
  fontSize: 18,
  fontWeight: "800",
  color: "#222",
  marginLeft: 8, 
},

  
  centerText: {
    position: "absolute",
    top: height * 0.15,
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  subtitle: {
    color: "#fff",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
    opacity: 0.95,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  
  section: {
    position: "absolute",
    width: "100%",
  },

  badge: {
    marginLeft: 16,
    marginBottom: 10,
    backgroundColor: "#4da6ff",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "700",
    alignSelf: "flex-start",
  },


  card: {
    width: width * 0.78,
    backgroundColor: "#fff",
    borderRadius: 22,
    marginRight: 16,
    overflow: "hidden",
    elevation: 6,
  },

  cardImage: {
    width: "100%",
    height: 170,
  },

  rating: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },

  cardContent: {
    padding: 14,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
  },

  price: {
    fontSize: 20,
    fontWeight: "900",
    color: "#007AFF",
    marginTop: 6,
  },

  month: {
    fontSize: 12,
    color: "#777",
  },

  row: {
    flexDirection: "row",
    marginTop: 8,
    gap: 12,
  },

  detail: {
    fontSize: 12,
    color: "#555",
  },
});
