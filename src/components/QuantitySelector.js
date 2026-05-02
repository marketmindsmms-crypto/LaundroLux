import React from "react";
import { View, Text, Button } from "react-native";

export default function QuantitySelector({ value, setValue }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Button title="-" onPress={() => setValue(Math.max(0, value - 1))} />
      <Text style={{ marginHorizontal: 10 }}>{value}</Text>
      <Button title="+" onPress={() => setValue(value + 1)} />
    </View>
  );
}
