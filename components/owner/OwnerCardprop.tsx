import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type OwnerCardProps = {
  ownerName: string;
  ownerImage: string;
  ownerSince: string;
};

export default function OwnerCard({
  ownerName,
  ownerImage,
  ownerSince,
}: OwnerCardProps) {
  return (
    <View style={styles.card}>

      <Text style={styles.listedBy}>
        LISTED BY
      </Text>

      <View style={styles.ownerRow}>
        <Image
          source={{ uri: ownerImage }}
          style={styles.ownerImage}
        />

        <View>
          <Text style={styles.ownerName}>
            {ownerName}
          </Text>

          <Text style={styles.ownerSince}>
            Verified Host since {ownerSince}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <MaterialCommunityIcons
          name="message-outline"
          size={20}
          color="#333"
        />

        <Text style={styles.buttonText}>
          Send Message
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <MaterialCommunityIcons
          name="phone-outline"
          size={20}
          color="#333"
        />

        <Text style={styles.buttonText}>
          Contact Owner
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 22,
    marginTop: 30,
  },

  listedBy: {
    fontSize: 14,
    letterSpacing: 2,
    color: "#777",
    marginBottom: 22,
  },

  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },

  ownerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  ownerName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },

  ownerSince: {
    marginTop: 4,
    fontSize: 15,
    color: "#777",
  },

  button: {
    backgroundColor: "#F3F4F6",
    borderRadius: 22,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});