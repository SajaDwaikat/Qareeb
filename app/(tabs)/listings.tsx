import { View, Text, FlatList } from "react-native";

const dummyData = [
  { id: "1", title: "Apartment in Rafidia", price: 3000 },
  { id: "2", title: "Studio in City Center", price: 2000 },
  { id: "3", title: "Villa in Nablus", price: 6000 },
  { id: "4", title: "Small Flat", price: 1500 },
];

export default function Listings() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Listings
      </Text>

      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#f2f2f2",
              padding: 15,
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {item.title}
            </Text>

            <Text style={{ color: "#007AFF", marginTop: 5 }}>
              ₪{item.price}
            </Text>
          </View>
        )}
      />
    </View>
  );
}