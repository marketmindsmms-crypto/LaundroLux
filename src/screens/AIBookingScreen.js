import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { post } from "../api/client";

export default function AIBookingScreen({ navigation }) {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState(null);

  const handleParse = async () => {
    try {
      const res = await post("/ai/parse", { input });
      setParsed(res);
    } catch (err) {
      console.error("AI Parse failed:", err);
      alert("Failed to reach AI service");
    }
  };

  const handleConfirm = async () => {
    try {
      const orderPayload = {
        user_id: "user-123",
        pickup_time: parsed.pickup_time,
        delivery_time: "2026-05-04T18:00:00",
        items: [
          {
            item_id: "uuid-shirt",
            quantity: 5,
            unit_price: 50,
            total_price: 250,
          },
        ],
        total_price: 250,
      };

      const res = await post("/orders", orderPayload);

      if (res.success) {
        alert("Order Created! ID: " + res.orderId);
        navigation.navigate("Home");
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Failed to create order");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 Tell me your request</Text>

      <TextInput
        placeholder="e.g. Wash 5 shirts tomorrow evening..."
        value={input}
        onChangeText={setInput}
        style={styles.input}
        multiline
      />

      <TouchableOpacity style={styles.btn} onPress={handleParse}>
        <Text style={styles.btnText}>Parse Intent</Text>
      </TouchableOpacity>

      {parsed && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧺 Order Summary</Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>Items:</Text> {parsed.items?.map(i => `${i.name} x${i.quantity}`).join(", ")}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>Pickup:</Text> {parsed.pickup_time || "Not specified"}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>Service:</Text> {parsed.delivery_type || "Standard"}
          </Text>

          <TouchableOpacity style={[styles.btn, styles.confirmBtn]} onPress={handleConfirm}>
            <Text style={styles.btnText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 22, fontWeight: "bold", color: "#111", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  btn: {
    backgroundColor: "#D4AF37",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  card: {
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#002366", marginBottom: 12 },
  cardText: { fontSize: 15, marginBottom: 8, color: "#444" },
  bold: { fontWeight: "bold", color: "#111" },
  confirmBtn: {
    backgroundColor: "#002366",
    marginTop: 20,
  }
});
