import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {ImageBackground,ScrollView,StyleSheet,Text,View,ActivityIndicator,} from "react-native";
import { router } from "expo-router";
import StatCard from "../../components/owner/statCard";
import RecentListingCard from "../../components/owner/RecentListingCard";
import AlertCard from "../../components/owner/AlertCard";
import ManageButton from "../../components/owner/ManageButton";
import useOwnerDashboard from "../../hooks/useOwnerDashboard";

export default function OwnerDashboard() {
  const ownerId = "user1";
  const { dashboardData, loading, error } = useOwnerDashboard(ownerId);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F80ED" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const stats = [
    {
      id: "1",
      title: "Total Listings",
      value: dashboardData?.totalListings || 0,
      subtitle: "Your total properties",
      icon: "business-outline",
      iconColor: "#2F80ED",
      iconBg: "#EAF4FF",
    },
    {
      id: "2",
      title: "Available",
      value: dashboardData?.available || 0,
      subtitle: "Available now",
      icon: "checkmark-circle-outline",
      iconColor: "#16A34A",
      iconBg: "#EAF8EF",
    },
    {
      id: "3",
      title: "Full",
      value: dashboardData?.full || 0,
      subtitle: "Currently occupied",
      icon: "close-circle-outline",
      iconColor: "#EF4444",
      iconBg: "#FDECEC",
    },
    {
      id: "4",
      title: "Unverified",
      value: dashboardData?.unverified || 0,
      subtitle: "Waiting admin approval",
      icon: "time-outline",
      iconColor: "#8B5CF6",
      iconBg: "#F3E8FF",
    },
  ];

  const alerts = [
    {
      id: "1",
      text: "Check your listings and complete missing details",
      icon: "alert-circle-outline",
      color: "#F59E0B",
      bg: "#FFF8EC",
    },
    {
      id: "2",
      text: "Some listings may still be waiting admin approval",
      icon: "shield-checkmark-outline",
      color: "#3B82F6",
      bg: "#F3F8FF",
    },
  ];

  const manageItems = [
    {
      id: "1",
      title: "Add New Property",
      icon: "add-circle-outline",
      route: "/Prop/add",
      filled: true,
    },
    {
      id: "2",
      title: "Unverified Listings",
      icon: "list-outline",
      route: "/(owner-tabs)/my-listings",
      filled: false,
      backgroundColor: "#DCEAF5",
    },
  ];

  const recentListings =
    dashboardData?.recentListings?.map((item: any) => ({
      id: item.id,
      title: item.title || "No title",
      location: item.location || "Nablus",
      price: `₪ ${item.price || 0} / month`,
      views: item.views || 0,
      likes: item.likes || 0,
      status:
        item.availabilityStatus === "full"
          ? "Full"
          : item.status === "approved"
          ? "Available"
          : "Pending",
      statusBg:
        item.availabilityStatus === "full"
          ? "#FDECEC"
          : item.status === "approved"
          ? "#EAF8EF"
          : "#FFF6E8",
      statusColor:
        item.availabilityStatus === "full"
          ? "#DC2626"
          : item.status === "approved"
          ? "#16A34A"
          : "#D97706",
      image:
        item.images && item.images.length > 0
          ? { uri: item.images[0] }
          : require("../../assets/images/modern apartment interior.png"),
    })) || [];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={require("../../assets/images/owner-hero.png")}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
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
                color="#FFFFFF"
              />
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
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Manage</Text>

      <View style={styles.manageContainer}>
        {manageItems.map((item) => (
          <ManageButton
            key={item.id}
            title={item.title}
            icon={item.icon}
            filled={item.filled}
            backgroundColor={item.backgroundColor}
            onPress={() => router.push(item.route as any)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Recent Listings</Text>

      <Text style={styles.recentSubtitle}>
        Your most recent property listings
      </Text>

      {recentListings.map((item: any) => (
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
        />
      ))}
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#667085",
  },

  errorText: {
    fontSize: 15,
    color: "#DC2626",
    textAlign: "center",
    paddingHorizontal: 20,
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

  recentSubtitle: {
    fontSize: 14,
    color: "#667085",
    marginBottom: 14,
    marginHorizontal: 20,
  },
});