import React, { useEffect, useState } from "react";
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
import { auth, db } from "../../lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";

type RequestItem = {
  id: string;
  userName: string;
  propertyTitle: string;
  status: "Pending" | "Approved" | "Cancelled";
  createdAt?: any;
};

export default function RequestsScreen() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setLoading(false);
      return;
    }

    const requestsQuery = query(
      collection(db, "bookingRequests"),
      where("ownerId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
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

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "bookingRequests", id), {
        status: "Approved",
      });

      Alert.alert("Success", "Request approved");
    } catch (error) {
      console.log("Approve error:", error);
      Alert.alert("Error", "Failed to approve request");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await updateDoc(doc(db, "bookingRequests", id), {
        status: "Cancelled",
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
              <Text style={styles.title}>{item.propertyTitle}</Text>
              <Text style={styles.text}>Requested by: {item.userName}</Text>
              <Text style={styles.text}>Date: {formatDate(item.createdAt)}</Text>
              <Text
                style={[
                  styles.status,
                  item.status === "Approved" && styles.approvedStatus,
                  item.status === "Cancelled" && styles.cancelledStatus,
                ]}
              >
                {item.status}
              </Text>

              {item.status === "Pending" && (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleApprove(item.id)}
                  >
                    <Text style={styles.buttonText}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancel(item.id)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  approvedStatus: {
    color: "#16A34A",
  },
  cancelledStatus: {
    color: "#DC2626",
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