import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
} from "@/services/notificationService";
import { AppNotification } from "@/types/notification";

export function useNotifications() {
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setReceiverId(currentUser?.uid ?? null);
    });

    return unsubscribe;
  }, []);

  const loadNotifications = useCallback(
    async (isRefresh = false) => {
      if (!receiverId) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);
        const data = await getNotifications(receiverId);
        setNotifications(data);
      } catch (loadError) {
        console.log("Notifications error:", loadError);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [receiverId]
  );

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    await markNotificationAsRead(id);

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  return {
    notifications,
    loading,
    refreshing,
    error,
    refresh: () => loadNotifications(true),
    markAsRead,
  };
}

export function useUnreadNotificationsCount() {
  const [count, setCount] = useState(0);

  const refreshUnreadCount = useCallback(async (receiverId?: string) => {
    const uid = receiverId ?? auth.currentUser?.uid;

    if (!uid) {
      setCount(0);
      return;
    }

    try {
      const unreadCount = await getUnreadCount(uid);
      setCount(unreadCount);
    } catch (error) {
      console.log("Unread notifications error:", error);
      setCount(0);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      refreshUnreadCount(currentUser?.uid);
    });

    return unsubscribe;
  }, [refreshUnreadCount]);

  return { count, refreshUnreadCount };
}
