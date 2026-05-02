import React from "react";
import { View, FlatList } from "react-native";
import ServiceCard from "../components/ServiceCard";

const services = [
  { id: "1", name: "Wash & Fold" },
  { id: "2", name: "Dry Cleaning" },
  { id: "3", name: "Ethnic Wear" },
  { id: "4", name: "Couture Care" },
];

export default function ServiceScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#f8f9fa" }}>
      <FlatList
        data={services}
        numColumns={2}
        renderItem={({ item }) => (
          <ServiceCard
            title={item.name}
            onPress={() => navigation.navigate("Items", { service: item })}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
