import {StyleSheet,ScrollView,Image,View,Text,} from "react-native";
import Header from "@/components/ui/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import {MaterialCommunityIcons,Ionicons,} from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import OwnerCard from "@/components/owner/OwnerCardprop";
import Button from "@/components/ui/Button";
import { useLocalSearchParams } from "expo-router";
import usePropertyDetails from "@/hooks/usePropertyDetails";
import { router } from "expo-router";
import Rating from "@/components/property/Rating";

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const { property, loading } = usePropertyDetails(id);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!property) {
    return <Text>Property not found</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Property Details" />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
     <View style={styles.imageWrapper}>
  <Image
    source={{ uri: property.image }}
    style={styles.propertyImage}
  />

</View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{property.title}</Text>

          <View style={styles.locationRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color="#777"
            />

            <Text style={styles.location}>
              {property.location}
            </Text>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>MONTHLY RENT</Text>
            <Text style={styles.priceText}>{property.price} NIS</Text>
          </View>

          <View style={styles.labelsContainer}>
            <View style={styles.labelBox}>
              <View style={styles.labelContent}>
                <MaterialCommunityIcons
                  name="bed"
                  size={18}
                  color="#333"
                />
                <Text style={styles.labelText}>
                  {property.beds} Beds
                </Text>
              </View>
            </View>

            <View style={styles.labelBox}>
              <View style={styles.labelContent}>
                <MaterialCommunityIcons
                  name="door"
                  size={18}
                  color="#333"
                />
                <Text style={styles.labelText}>
                  {property.rooms} Rooms
                </Text>
              </View>
            </View>

            <View style={styles.labelBox}>
              <View style={styles.labelContent}>
                <MaterialCommunityIcons
                  name="school-outline"
                  size={18}
                  color="#333"
                />
                <Text style={styles.labelText}>
                  {property.type}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>
            Description
          </Text>
          <Text style={styles.descriptionText}>
            {property.description}
          </Text>
        </View>

        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>
            Location
          </Text>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: property.latitude,
              longitude: property.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: property.latitude,
                longitude: property.longitude,
              }}
              title={property.title}
              description={property.location}
            />
          </MapView>
        </View>

        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>
            Additional Services
          </Text>

          <View style={styles.servicesContainer}>
            <View style={styles.serviceBox}>
              <MaterialCommunityIcons
                name="wifi"
                size={20}
                color="#333"
              />
              <Text style={styles.serviceText}>Wi-Fi</Text>
            </View>

            <View style={styles.serviceBox}>
              <MaterialCommunityIcons
                name="car"
                size={20}
                color="#333"
              />
              <Text style={styles.serviceText}>Parking</Text>
            </View>

            <View style={styles.serviceBox}>
              <MaterialCommunityIcons
                name="snowflake"
                size={20}
                color="#333"
              />
              <Text style={styles.serviceText}>AC</Text>
            </View>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.sectionTitle}>Rating</Text>

          <View style={styles.ratingHeader}>
            <Ionicons
              name="star"
              size={18}
              color="#f5a623"
            />

            <Text style={styles.ratingValue}>
              {Number(property.rating || 0).toFixed(1)}
            </Text>
          </View>

          <Rating property={property} />
        </View>

        <OwnerCard
          ownerName={property.ownerName}
          ownerImage={property.ownerImage}
          ownerSince={property.ownerSince}
        />

        <Button
          title="Book Now"
          onPress={() =>
            router.push({
              pathname: "/booking",
              params: {
                propertyId: property.id,
                title: property.title,
                location: property.location,
                price: String(property.price),
                image: property.image,
                ownerId: property.ownerId ?? "",
              },
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F6F8",
  },

  propertyImage: {
    width: "100%",
    height: 250,
    borderRadius: 20,
  },

  infoContainer: {
    marginTop: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },

  location: {
    fontSize: 14,
    color: "#777",
  },

  priceBox: {
    backgroundColor: "#D7ECFF",
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 22,
    marginTop: 8,
    marginBottom: 20,
    alignItems: "flex-end",
  },

  priceLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1c6ea4",
    letterSpacing: 0.6,
    marginBottom: 2,
  },

  priceText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0B6FB3",
  },

  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  labelBox: {
    backgroundColor: "#F2F4F6",
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  labelContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  labelText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },

  descriptionSection: {
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },

  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#555",
  },

  servicesSection: {
    marginTop: 28,
  },

  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  serviceBox: {
    backgroundColor: "#F2F4F6",
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  serviceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  ratingContainer: {
    marginTop: 20,
  },

  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },

  ratingValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  mapSection: {
    marginTop: 28,
  },

  map: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    marginTop: 10,
  },
  imageWrapper: {
  position: "relative",
},

editIcon: {
  position: "absolute",
  top: 14,
  right: 14,
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#0B6FB3",
  justifyContent: "center",
  alignItems: "center",
},
});
