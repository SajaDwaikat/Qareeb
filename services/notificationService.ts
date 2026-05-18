import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  AppNotification,
  CreateNotificationInput,
} from "@/types/notification";

const NOTIFICATIONS_COLLECTION = "notifications";
const USERS_COLLECTION = "user";

export async function createNotification(
  input: CreateNotificationInput
): Promise<string> {
  const notificationRef = doc(collection(db, NOTIFICATIONS_COLLECTION));

  await setDoc(notificationRef, {
    id: notificationRef.id,
    receiverId: input.receiverId,
    title: input.title,
    message: input.message,
    type: input.type,
    ...(input.relatedId ? { relatedId: input.relatedId } : {}),
    isRead: false,
    createdAt: serverTimestamp(),
  });

  return notificationRef.id;
}

export async function getNotifications(
  receiverId: string
): Promise<AppNotification[]> {
  const notificationsQuery = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where("receiverId", "==", receiverId)
  );

  const snapshot = await getDocs(notificationsQuery);

  return snapshot.docs
    .map((notificationDoc) => ({
      ...(notificationDoc.data() as AppNotification),
      id: notificationDoc.id,
    }))
    .sort((a, b) => getCreatedAtMillis(b) - getCreatedAtMillis(a));
}

export async function getUnreadCount(receiverId: string): Promise<number> {
  const unreadQuery = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where("receiverId", "==", receiverId),
    where("isRead", "==", false)
  );

  const snapshot = await getDocs(unreadQuery);

  return snapshot.size;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, id);

  await updateDoc(notificationRef, {
    isRead: true,
  });
}

export async function getAdminReceiverIds(): Promise<string[]> {
  const adminsQuery = query(
    collection(db, USERS_COLLECTION),
    where("role", "==", "Admin")
  );

  const snapshot = await getDocs(adminsQuery);

  return snapshot.docs.map((adminDoc) => adminDoc.id);
}

function getCreatedAtMillis(notification: AppNotification): number {
  return notification.createdAt?.toMillis?.() ?? 0;
}
