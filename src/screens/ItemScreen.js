import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import QuantitySelector from "../components/QuantitySelector";

export default function ItemScreen({ navigation }) {
  const [qty, setQty] = useState(0);

  return (
    <View style={{ padding: 20 }}>
      <Text>Shirt</Text>
      <QuantitySelector value={qty} setValue={setQty} />

      <Text>Total: ₹{qty * 50}</Text>

      <Button
        title="Continue"
        onPress={() => navigation.navigate("Schedule")}
      />
    </View>
  );
}
