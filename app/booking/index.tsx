import React, { useState } from "react";
import {View,Text,StyleSheet,TextInput,Pressable,ScrollView,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Booking() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <Text style={styles.title}>Book Your Apartment</Text>
        <Text style={styles.subtitle}>
          Secure your stay in Nablus with our seamless booking process
        </Text>

        <View style={styles.card}>
          <View style={styles.image} />
          <View>
            <Text style={styles.cardTitle}>
              Luxury Skyline Suite
            </Text>
            <Text style={styles.location}>
              📍 Rafidia, Nablus
            </Text>
            <Text style={styles.price}>
              ₪4,500 <Text style={styles.per}>/ month</Text>
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          1  Personal Details
        </Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          placeholder="+970 59-XXXXXXX"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
        />

        <Text style={styles.sectionTitle}>
          2  Identity Verification
        </Text>

        <Text style={styles.label}>ID Number</Text>
        <TextInput
          placeholder="Enter ID or Passport Number"
          value={idNumber}
          onChangeText={setIdNumber}
          style={styles.input}
        />

        <View style={styles.uploadBox}>
          <Text style={styles.uploadText}>Upload Photo of ID</Text>
          <Text style={styles.uploadSub}>PNG, JPG up to 10MB</Text>
        </View>

        <Text style={styles.sectionTitle}>
          3  Stay Details
        </Text>

        <Text style={styles.label}>Stay Duration</Text>
        <View style={styles.input}>
          <Text style={{ color: "#999" }}>
            Select duration
          </Text>
        </View>

        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          placeholder="Any specific requirements..."
          value={notes}
          onChangeText={setNotes}
          style={[styles.input, { height: 90 }]}
          multiline
        />

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>
            Confirm Booking →
          </Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
  },

  subtitle: {
    color: "#777",
    marginBottom: 15,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    alignItems: "center",
  },

  image: {
    width: 70,
    height: 70,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginRight: 10,
  },

  cardTitle: {
    fontWeight: "700",
  },

  location: {
    color: "#777",
    fontSize: 12,
  },

  price: {
    color: "#007AFF",
    fontWeight: "800",
  },

  per: {
    color: "#777",
    fontSize: 12,
  },

  sectionTitle: {
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 10,
  },

  label: {
    marginBottom: 5,
    color: "#444",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
  },

  uploadBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  uploadText: {
    fontWeight: "600",
  },

  uploadSub: {
    fontSize: 12,
    color: "#777",
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});