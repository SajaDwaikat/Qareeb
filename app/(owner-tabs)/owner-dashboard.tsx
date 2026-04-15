import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {ImageBackground,Pressable,ScrollView,StyleSheet,Text,View,} from "react-native";
import { router } from "expo-router";
import StatCard from "../../components/owner/statCard";
import RecentListingCard from "../../components/owner/RecentListingCard";
import AlertCard from "../../components/owner/AlertCard";
export default function OwnerDashboard() {
  
  const stats = [ {
      id: "1",
      title: "Total Listings",
      value: 12,
      subtitle: "+2 this month",
      icon: "business-outline",
      iconColor: "#2F80ED",
      iconBg: "#EAF4FF",
    },
    {
      id: "2",
      title: "Available",
      value: 7,
      subtitle: "Available now",
      icon: "checkmark-circle-outline",
      iconColor: "#16A34A",
      iconBg: "#EAF8EF",
    },
    {
      id: "3",
      title: "Full",
      value: 3,
      subtitle: "Currently occupied",
      icon: "close-circle-outline",
      iconColor: "#EF4444",
      iconBg: "#FDECEC",
    },
    {
      id: "4",
      title: "Views",
      value: 1847,
      subtitle: "+12% this week",
      icon: "eye-outline",
      iconColor: "#2F80ED",
      iconBg: "#EAF4FF",
    },
    {
      id: "5",
      title: "Incomplete",
      value: 2,
      subtitle: "Need more details",
      icon: "alert-circle-outline",
      iconColor: "#F59E0B",
      iconBg: "#FFF7E8",
    },
    {
      id: "6",
      title: "Pending Verification",
      value: 1,
      subtitle: "Waiting review",
      icon: "time-outline",
      iconColor: "#8B5CF6",
      iconBg: "#F3E8FF",
    },];
  const alerts = [ {
      id: "1",
      text: "3 listings are missing images",
      icon: "image-outline",
      color: "#F59E0B",
      bg: "#FFF8EC",
    },
    {
      id: "2",
      text: "2 listings have short descriptions",
      icon: "document-text-outline",
      color: "#3B82F6",
      bg: "#F3F8FF",
    },
    {
      id: "3",
      text: "1 listing is missing Google Maps location",
      icon: "location-outline",
      color: "#F97316",
      bg: "#FFF6F1",
    },
    {
      id: "4",
      text: "1 listing is missing contact info",
      icon: "call-outline",
      color: "#14B8A6",
      bg: "#EFFCF9",
    },
  ];
  const manageItems = [{
      id: "1",
      title: "Add New Property",
      icon: "add-circle-outline",
      route: "/Prop/add",
      filled: true,
    },
    {
      id: "2",
      title: "Incomplete Listings",
      icon: "list-outline",
      route: "/(owner-tabs)/my-listings",
      filled: false,
      backgroundColor: "#DCEAF5",
    },
    {
      id: "3",
      title: "Unverified Listings",
      icon: "shield-checkmark-outline",
      route: "/(owner-tabs)/my-listings",
      filled: false,
      backgroundColor: "#F3F4F6",
    },];
  const recentListings = [{
      id: "1",
      title: "Student Studio in Rafidia",
      location: "Rafidia - Near An-Najah University",
      price: "₪ 1,200 / month",
      views: 124,
      likes: 21,
      status: "Available",
      statusBg: "#EAF8EF",
      statusColor: "#16A34A",
      image: require("../../assets/images/modern apartment interior.png"),
    },
    {
      id: "2",
      title: "Shared Room for Female Students",
      location: "Al-Jamia Street - Nablus",
      price: "₪ 850 / month",
      views: 89,
      likes: 14,
      status: "Full",
      statusBg: "#FDECEC",
      statusColor: "#DC2626",
      image: require("../../assets/images/nablus -modern.png"),
    },
    {
      id: "3",
      title: "Family Apartment in Rafidia",
      location: "Rafidia - Nablus",
      price: "₪ 2,400 / month",
      views: 156,
      likes: 31,
      status: "Pending",
      statusBg: "#FFF6E8",
      statusColor: "#D97706",
      image: require("../../assets/images/nablus2.png"),
    },
    {
      id: "4",
      title: "Single Room near Old Campus",
      location: "City Center - Nablus",
      price: "₪ 700 / month",
      views: 73,
      likes: 9,
      status: "Available",
      statusBg: "#EAF8EF",
      statusColor: "#16A34A",
      image: require("../../assets/images/nablus house.png"),
    },
  ];
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false} >
      <ImageBackground
        source={require("../../assets/images/owner-hero.png")}
        style={styles.hero}
        imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Ionicons name="business-outline" size={14} color="#FFFFFF" />
              <Text style={styles.heroBadgeText}>Owner Space</Text>
            </View>
            <View style={styles.heroIconCircle}>
              <Ionicons
                name="notifications-outline"
                size={16}
                color="#FFFFFF"  />
            </View>
          </View>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Owner Dashboard</Text>
            <Text style={styles.heroSubtitle}>
              Manage your listings, requests, and property performance with ease
            </Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.statsContainer}>
        {stats.map((item) => (
          <StatCard
            key={item.id}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={item.icon}
            iconColor={item.iconColor}
            iconBg={item.iconBg}
          />
        ))}
      </View>
      <Text style={styles.sectionTitle}>Improvement Alerts</Text>
      <View style={styles.alertsContainer}>
        {alerts.map((item) => (
          <AlertCard
            key={item.id}
            text={item.text}
            icon={item.icon}
            color={item.color}
            bg={item.bg}
          />  ))}
      </View>
      <Text style={styles.sectionTitle}>Manage</Text>
      <View style={styles.manageContainer}>
        {manageItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push(item.route as any)}
            style={[
              styles.manageButton,
              item.filled
                ? styles.managePrimaryButton
                : { backgroundColor: item.backgroundColor },
            ]}>
            <Ionicons
              name={item.icon as any}
              size={16}
              color={item.filled ? "#FFFFFF" : "#4B5563"}
              style={styles.manageIcon}
            />
            <Text
              style={[
                styles.manageText,
                item.filled
                  ? styles.managePrimaryText
                  : styles.manageSecondaryText,
              ]}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Recent Listings</Text>
      <Text style={styles.recentSubtitle}>
        Your most recent property listings
      </Text>
      {recentListings.map((item) => (
        <RecentListingCard
          key={item.id}
          title={item.title}
          location={item.location}
          price={item.price}
          views={item.views}
          likes={item.likes}
          status={item.status}
          statusBg={item.statusBg}
          statusColor={item.statusColor}
          image={item.image}
        /> ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  hero: {
    height: 240,
    margin: 16,
    marginBottom: 18,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  heroImage: {
    borderRadius: 28,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.42)",
    padding: 18,
    justifyContent: "space-between",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  heroIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: "rgba(255,255,255,0.95)",
    textAlign: "center",
    maxWidth: 290,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginTop: 8,
    marginHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 18,
    paddingHorizontal: 20,
  },

  alertsContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },

  manageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EAECEF",
    marginBottom: 24,
    marginHorizontal: 20,
  },

  manageButton: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  managePrimaryButton: {
    backgroundColor: "#2F80ED",
  },

  manageIcon: {
    marginRight: 8,
  },

  manageText: {
    fontSize: 13,
    fontWeight: "600",
  },

  managePrimaryText: {
    color: "#FFFFFF",
  },

  manageSecondaryText: {
    color: "#4B5563",
  },
  recentSubtitle: {
    fontSize: 14,
    color: "#667085",
    marginBottom: 14,
    marginHorizontal: 20,
  },
});