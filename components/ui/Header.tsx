import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function Header({title}: {title: string}) {
  const router = useRouter();

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0169d8" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
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

})