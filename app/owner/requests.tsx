import React, { useEffect, useState } from "react";
import { createNotification } from "@/services/notificationService";
import { NOTIFICATION_TYPES } from "@/constants/notifications";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/ui/Header";
import { db } from "../../lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

type RequestItem = {
  id: string;
  name: string;
  userId?: string;
  apartmentName: string;
  status: string;
  createdAt?: any;
  propertyId?: string;
  phone?: string;
  location?: string;
  price?: string;
};

export default function RequestsScreen() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestsQuery = query(
      collection(db, "bookings"),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const data: RequestItem[] = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<RequestItem, "id">),
        }));

        setRequests(data);
        setLoading(false);
      },
      (error) => {
        console.log("Error fetching requests:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const handleApprove = async (item: RequestItem) => {
    try {
      await updateDoc(doc(db, "bookings", item.id), {
        status: "approved",
      });

      if (item.userId) {
        try {
          await createNotification({
            receiverId: item.userId,
            title: "Booking approved",
            message: `Your booking request for ${item.apartmentName || "the property"
              } has been approved.`,
            type: NOTIFICATION_TYPES.BOOKING_APPROVED,
            relatedId: item.id,
          });
        } catch (notificationError) {
          console.log(
            "BOOKING APPROVAL NOTIFICATION ERROR:",
            notificationError
          );
        }
      }

      Alert.alert("Success", "Request approved");
    } catch (error) {
      console.log("Approve error:", error);
      Alert.alert("Error", "Failed to approve request");
    }

  };

  const handleCancel = async (item: RequestItem) => {
    try {
      await updateDoc(doc(db, "bookings", item.id), {
        status: "cancelled",
      });

      Alert.alert("Done", "Request cancelled");
    } catch (error) {
      console.log("Cancel error:", error);
      Alert.alert("Error", "Failed to cancel request");
    }
  };

  const formatDate = (createdAt: any) => {
    if (!createdAt?.seconds) return "No date";
    return new Date(createdAt.seconds * 1000).toLocaleDateString();
  };

  return (
    <View style={styles.screen}>
      <Header title="Requests" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subHeader}>
          Review booking requests and approve or cancel them
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2F80ED" />
            <Text style={styles.loadingText}>Loading requests...</Text>
          </View>
        ) : requests.length === 0 ? (
          <Text style={styles.emptyText}>No requests found</Text>
        ) : (
          requests.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.title}>
                {item.apartmentName || "No apartment name"}
              </Text>

              <Text style={styles.text}>
                Requested by: {item.name || "Unknown"}
              </Text>

              <Text style={styles.text}>
                Date: {formatDate(item.createdAt)}
              </Text>

              {item.location ? (
                <Text style={styles.text}>Location: {item.location}</Text>
              ) : null}

              {item.phone ? (
                <Text style={styles.text}>Phone: {item.phone}</Text>
              ) : null}

              {item.price ? (
                <Text style={styles.text}>Price: {item.price}</Text>
              ) : null}

              <Text style={styles.status}>Pending</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => handleApprove(item)}

                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancel(item)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  subHeader: {
    fontSize: 14,
    color: "#667085",
    marginBottom: 20,
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#667085",
  },
  emptyText: {
    fontSize: 15,
    color: "#667085",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EAECEF",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#475467",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D97706",
    marginTop: 8,
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#2F80ED",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});