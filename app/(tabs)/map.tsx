import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { api } from "../../convex/_generated/api";

export default function MapScreen() {
  const { user } = useUser();

  // Early return if no user
  if (!user) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  // Only fetch items if user exists
  const items = useQuery(api.bucketlist.listBucketListItems, { clerkId: user.id }) ?? [];

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: items[0]?.locationLat || 20,
          longitude: items[0]?.locationLng || 0,
          latitudeDelta: 80,
          longitudeDelta: 80,
        }}
      >
        {items.map(
          (item) =>
            item.locationLat &&
            item.locationLng && (
              <Marker
                key={item._id}
                coordinate={{
                  latitude: item.locationLat,
                  longitude: item.locationLng,
                }}
                title={item.title}
                description={item.description}
                pinColor={item.completed ? "green" : "blue"}
              />
            )
        )}
      </MapView>
    </View>
  );
}
