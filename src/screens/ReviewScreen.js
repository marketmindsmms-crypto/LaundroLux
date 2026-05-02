import React from "react";
import { View, Text, Button } from "react-native";

export default function ReviewScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Items: Shirt x2</Text>
      <Text>Total: ₹100</Text>

      <Button title="Place Order" onPress={() => alert("Order Placed")} />
    </View>
  );
}
