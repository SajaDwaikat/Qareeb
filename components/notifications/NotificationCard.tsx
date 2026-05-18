import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text, TouchableRipple } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "@/constants/theme";
import {
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPES,
} from "@/constants/notifications";
import { AppNotification } from "@/types/notification";

type NotificationCardProps = {
  notification: AppNotification;
  onPress: (notification: AppNotification) => void;
};

const notificationIcons = {
  [NOTIFICATION_TYPES.BOOKING_REQUEST]: "calendar-outline",
  [NOTIFICATION_TYPES.BOOKING_APPROVED]: "checkmark-circle-outline",
  [NOTIFICATION_TYPES.PROPERTY_SUBMITTED]: "home-outline",
  [NOTIFICATION_TYPES.PROPERTY_APPROVED]: "shield-checkmark-outline",
} as const;

export default function NotificationCard({
  notification,
  onPress,
}: NotificationCardProps) {
  const iconName = notificationIcons[notification.type];

  return (
    <Card
      mode="contained"
      style={[
        styles.card,
        notification.isRead ? styles.readCard : styles.unreadCard,
      ]}
    >
      <TouchableRipple
        borderless
        onPress={() => onPress(notification)}
        style={styles.touchable}
      >
        <View style={styles.content}>
          <View
            style={[
              styles.iconBox,
              notification.isRead ? styles.readIconBox : styles.unreadIconBox,
            ]}
          >
            <Ionicons
              name={iconName}
              size={22}
              color={notification.isRead ? AppColors.secondaryText : "#FFFFFF"}
            />
          </View>

          <View style={styles.textContent}>
            <View style={styles.titleRow}>
              <Text numberOfLines={1} style={styles.title}>
                {notification.title}
              </Text>
              {!notification.isRead && <View style={styles.unreadDot} />}
            </View>

            <Text numberOfLines={2} style={styles.message}>
              {notification.message}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.type}>
                {NOTIFICATION_TYPE_LABELS[notification.type]}
              </Text>
              <Text style={styles.time}>{formatCreatedAt(notification)}</Text>
            </View>
          </View>
        </View>
      </TouchableRipple>
    </Card>
  );
}

function formatCreatedAt(notification: AppNotification) {
  const date = notification.createdAt?.toDate?.();

  if (!date) return "Just now";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  readCard: {
    backgroundColor: AppColors.cardBackground,
  },
  unreadCard: {
    backgroundColor: AppColors.primaryLight,
  },
  touchable: {
    borderRadius: 8,
  },
  content: {
    flexDirection: "row",
    padding: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  unreadIconBox: {
    backgroundColor: AppColors.primary,
  },
  readIconBox: {
    backgroundColor: AppColors.screenBackground,
  },
  textContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    color: AppColors.darkText,
    fontSize: 15,
    fontWeight: "700",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
    marginLeft: 8,
  },
  message: {
    color: AppColors.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
  },
  type: {
    color: AppColors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  time: {
    color: AppColors.muted,
    fontSize: 12,
  },
});
