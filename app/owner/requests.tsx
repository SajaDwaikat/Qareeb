import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/ui/Header";

const initialRequests = [
  {
    id: "1",
    userName: "Noor Hamadneh",
    propertyTitle: "Shared Room for Female Students",
    date: "18 May 2026",
    status: "Pending",
  },
  {
    id: "2",
    userName: "Huda Yaseen",
    propertyTitle: "Family Flat near University",
    date: "17 May 2026",
    status: "Pending",
  },
];

export default function RequestsScreen() {
  const [requests, setRequests] = useState(initialRequests);

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Approved" } : item
      )
    );
    Alert.alert("Success", "Request approved");
  };

  const handleCancel = (id: string) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Cancelled" } : item
      )
    );
    Alert.alert("Done", "Request cancelled");
  };

  return (
    <View style={styles.screen}>
      <Header title="Requests" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subHeader}>
          Review booking requests and approve or cancel them
        </Text>

        {requests.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.title}>{item.propertyTitle}</Text>
            <Text style={styles.text}>Requested by: {item.userName}</Text>
            <Text style={styles.text}>Date: {item.date}</Text>
            <Text style={styles.status}>{item.status}</Text>

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
        ))}
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