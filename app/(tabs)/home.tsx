import {View,Text,FlatList,StyleSheet,Image,Dimensions,ActivityIndicator,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import PropertyCard from "@/components/property/PropertyCard";
import useApprovedProperties from "@/hooks/useApprovedProperties";

const { width, height } = Dimensions.get("window");
export default function Home() {
  const tabHeight = useBottomTabBarHeight();


  const {
    properties: approvedProperties,
    loading: approvedLoading,
  } = useApprovedProperties();

  const topRatedProperties =
  [...approvedProperties]

    .filter(
      (property) =>
        Number(property.rating || 0) >= 4.6
    )

    .sort(
      (a, b) =>
        Number(b.rating || 0) -
        Number(a.rating || 0)
    );

  if ( approvedLoading) {
    return (
      <View style={styles.loader}>
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

        <View style={[styles.section, { bottom: tabHeight + 120 }]}>
          <Text style={styles.badge}>TOP PROPERTIES</Text>
        
          <FlatList
            data={approvedProperties}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
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

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

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
    flex: 1,
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

  cardWrapper: {
    width: width * 0.78,
    marginRight: 16,
  },
});