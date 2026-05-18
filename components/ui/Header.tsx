import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useUnreadNotificationsCount } from "@/hooks/useNotifications";

export default function Header({
  title,
  showBackButton = true,
}: {
  title: string;
  showBackButton?: boolean;
}) {
  
  const router = useRouter();
  const { count, refreshUnreadCount } = useUnreadNotificationsCount();


  useFocusEffect(
    useCallback(() => {
      refreshUnreadCount();
    }, [refreshUnreadCount])
  );

  return (
    <View style={styles.container}>
        {showBackButton && (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#0169d8" />
            </TouchableOpacity>
        )}

        <Text style={styles.title}>{title}</Text>

        

        <TouchableOpacity
          onPress={() => router.push("/notifications")}
          style={styles.notificationButton}
          accessibilityLabel="Open notifications"
        >
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#0169d8"
            />

            {count > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {count > 9 ? "9+" : count}
                </Text>
              </View>
            )}
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    backButton: {
        position: "absolute",
        left: 15,
        top: "50%",
        transform: [{ translateY: -12 }],
    },

    title:{
        fontSize: 20,
        fontWeight: "700",
        color: "#0169d8",
        alignItems: "center",
        
    },
    notificationButton: {
        position: "absolute",
        right: 15,
        top: "50%",
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ translateY: -22 }],
    },
    badge: {
        position: "absolute",
        top: 6,
        right: 5,
        minWidth: 17,
        height: 17,
        borderRadius: 9,
        backgroundColor: "#EF4444",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
        borderWidth: 1,
        borderColor: "#fff",
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "700",
    },

})
