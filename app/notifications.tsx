import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import NotificationCard from "@/components/notifications/NotificationCard";
import { AppColors } from "@/constants/theme";
import { useNotifications } from "@/hooks/useNotifications";
import { AppNotification } from "@/types/notification";

export default function NotificationsScreen() {
  const {
    notifications,
    loading,
    refreshing,
    error,
    refresh,
    markAsRead,
  } = useNotifications();

  const handlePress = async (notification: AppNotification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Notifications"
        
      />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator animating color={AppColors.primary} />
            <Text style={styles.stateText}>Loading notifications...</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationCard notification={item} onPress={handlePress} />
            )}
            refreshing={refreshing}
            onRefresh={refresh}
            contentContainerStyle={[
              styles.listContent,
              notifications.length === 0 && styles.emptyListContent,
            ]}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>
                  {error ?? "No notifications yet"}
                </Text>
                <Text style={styles.emptyText}>
                  Updates about bookings and property approvals will appear here.
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.screenBackground,
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.screenBackground,
  },
  listContent: {
    padding: 16,
    paddingBottom: 112,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  stateText: {
    marginTop: 12,
    color: AppColors.secondaryText,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: AppColors.darkText,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    color: AppColors.secondaryText,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: "center",
  },
});
