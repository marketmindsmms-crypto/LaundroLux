import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Namaste, Arjun 👋</Text>

      <TouchableOpacity
        style={styles.aiCard}
        onPress={() => navigation.navigate("AI")}
      >
        <Text style={styles.title}>🤖 AI Quick Book</Text>
        <Text style={{ color: "#ccc" }}>Describe your laundry</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.manualCard}
        onPress={() => navigation.navigate("Services")}
      >
        <Text style={[styles.title, { color: "#333" }]}>🧺 Manual Booking</Text>
        <Text>Customize every detail</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  greeting: { fontSize: 22, fontWeight: "bold", marginBottom: 24, color: "#111" },
  aiCard: {
    backgroundColor: "#002366",
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  manualCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 4 },
});
