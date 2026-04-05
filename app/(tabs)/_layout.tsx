import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
  headerShown: false,

  tabBarActiveTintColor: "#007AFF",   // 🔥 الأزرق
  tabBarInactiveTintColor: "#888",   // الرمادي

  tabBarStyle: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    height: 70,
    borderRadius: 25,
    backgroundColor: "#f2f2f2",
    elevation: 10,
  },

  tabBarLabelStyle: {
    fontSize: 10,
    marginBottom: 5,
  },
}}
    >

        {/* HOME */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "HOME",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />
    

      {/* LISTINGS */}
      <Tabs.Screen
        name="listings"
        options={{
          tabBarLabel: "LISTINGS",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" size={22}color={color} />
          ),
        }}
      />

      {/* FAVORITES */}
      <Tabs.Screen
        name="favourites"
        options={{
          tabBarLabel: "FAVORITES",
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={22} color={color} />
          ),
        }}
      />

      {/* ALERTS */}
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: "ALERTS",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={22} color={color} />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "PROFILE",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}