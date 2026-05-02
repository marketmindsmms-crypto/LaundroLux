import React from "react";
import { View, Text, Button } from "react-native";

export default function ScheduleScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Pickup: Tomorrow 6 PM</Text>
      <Text>Delivery: Standard (24 hrs)</Text>

      <Button title="Continue" onPress={() => navigation.navigate("Review")} />
    </View>
  );
}
