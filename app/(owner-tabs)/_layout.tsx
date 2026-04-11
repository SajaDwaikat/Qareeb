import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function OwnerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#98A2B3",
        tabBarStyle: {
          height: 74,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 0,
          backgroundColor: "#FFFFFF",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="owner-dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="my-listings"
        options={{
          title: "My Listings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add-listing"
        options={{
          title: "Add Listing",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}