import { Tabs } from "expo-router";

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="admin-dashboard"
        options={{
          title: "Dashboard",
        }}
      />
    </Tabs>
  );
}