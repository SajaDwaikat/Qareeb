import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="admin-dashboard"
        options={{
          title: "Dashboard",
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: "ALERTS",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}