// app/(tabs)/index.tsx
import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, Image } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { BarChart } from "react-native-chart-kit";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const screenWidth = Dimensions.get("window").width - 32; // padding adjustment

export default function Index() {
  const { user, isLoaded } = useUser();

  // Queries to get actual data from Convex
  const completedItems = useQuery(api.bucketlist.completedItems, { clerkId: user?.id }) ?? [];
  const allItems = useQuery(api.bucketlist.listBucketListItems, { clerkId: user?.id }) ?? [];
  const pendingItems = allItems.filter(item => !item.completed);

  if (!isLoaded) return <Text>Loading...</Text>;
  if (!user) return <Text>No user signed in</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back! 👋</Text>
        <Text style={styles.subtitle}>Here’s a summary of your activity:</Text>
      </View>

      {/* Dashboard Cards */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Completed Tasks</Text>
          <Text style={styles.cardValue}>{completedItems.length}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pending Tasks</Text>
          <Text style={styles.cardValue}>{pendingItems.length}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bucket List Items</Text>
          <Text style={styles.cardValue}>{allItems.length}</Text>
        </View>
      </View>

      {/* Bar Chart */}
      <View style={{ marginVertical: 16 }}>
        <Text style={styles.chartTitle}>Tasks Overview</Text>
        <BarChart
          data={{
            labels: ["Completed", "Pending", "Bucket List"],
            datasets: [{ data: [completedItems.length, pendingItems.length, allItems.length] }],
          }}
          width={screenWidth}
          height={220}
          fromZero
          chartConfig={{
            backgroundGradientFrom: "#f3f4f6",
            backgroundGradientTo: "#f3f4f6",
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
            barPercentage: 0.6,
          }}
          style={{ borderRadius: 12 }}
        />
      </View>

      {/* Fun Quote / Image */}
      <View style={styles.funContainer}>
        <Image
          source={{ uri: "https://source.unsplash.com/300x150/?nature,travel" }}
          style={styles.funImage}
        />
        <Text style={styles.funQuote}>
          "Adventure is worthwhile in itself." – Amelia Earhart
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  content: { padding: 16 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  cardsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, color: "#6b7280", marginBottom: 8 },
  cardValue: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  chartTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#111827" },
  funContainer: { marginVertical: 16, alignItems: "center" },
  funImage: { width: screenWidth, height: 150, borderRadius: 12, marginBottom: 8 },
  funQuote: { fontStyle: "italic", color: "#4b5563", fontSize: 14, textAlign: "center" },
});
