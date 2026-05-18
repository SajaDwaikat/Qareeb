import { Timestamp } from "firebase/firestore";
import { NOTIFICATION_TYPES } from "@/constants/notifications";

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export type AppNotification = {
  id: string;
  receiverId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedId?: string;
  isRead: boolean;
  createdAt: Timestamp;
};

export type CreateNotificationInput = {
  receiverId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedId?: string;
};
