import { useAuth, useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { useQuery, useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../convex/_generated/api";

export default function Profile() {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();

  // Mutations
  const generateUploadUrl = useMutation(api.bucketlist.generateUploadUrl);
  const saveItemImage = useMutation(api.profile.saveItemImage);
  const updateProfileImage = useMutation(api.profile.updateProfileImage);

  // State
  const [avatar, setAvatar] = useState<string | null>(null);
  const [itemImages, setItemImages] = useState<{ [key: string]: string }>({});

  // Queries
  const completedItems = useQuery(api.bucketlist.completedItems, { clerkId: user?.id ?? "" }) ?? [];
  const allItems = useQuery(api.bucketlist.listBucketListItems, { clerkId: user?.id ?? "" }) ?? [];


  if (!isLoaded) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (!user) return <Text>No user signed in</Text>;

  // Upload avatar
  const handleAvatarUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (result.canceled) return;

      const fileUri = result.assets[0].uri;
      setAvatar(fileUri);

      const uploadUrl = await generateUploadUrl();
      const blob = await fetch(fileUri).then(res => res.blob());

      await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": blob.type }, body: blob });

      const storageId = uploadUrl.split("?")[0].split("/").pop();
      await updateProfileImage({ storageId, photoUrl: fileUri });
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  // Upload item image
  const handleItemUpload = async (itemId: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (result.canceled) return;

      const fileUri = result.assets[0].uri;
      setItemImages(prev => ({ ...prev, [itemId]: fileUri }));

      const uploadUrl = await generateUploadUrl();
      const blob = await fetch(fileUri).then(res => res.blob());

      await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": blob.type }, body: blob });

      const storageId = uploadUrl.split("?")[0].split("/").pop();
      await saveItemImage({ itemId, storageId, photoUrl: fileUri });
    } catch (error) {
      console.error("Error uploading item image:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6", padding: 16 }}>
      {/* Sign Out */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 20 }}>
        <TouchableOpacity onPress={() => signOut()}>
          <Text style={{ fontWeight: "600", fontSize: 16, color: "#111827" }}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar + Completed Stats */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity
          onPress={handleAvatarUpload}
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: "#e5e7eb",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            marginRight: 16,
            marginTop: -20,
          }}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={{ width: 110, height: 110, borderRadius: 55 }} />
          ) : (
            <Feather name="camera" size={28} color="#6b7280" />
          )}
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700", fontSize: 16, color: "#b45309", flexWrap: "wrap" }}>
            {completedItems.length} out of {allItems.length} experiences complete
          </Text>
        </View>
      </View>

      {/* Greeting */}
      <Text style={{ fontWeight: "bold", fontSize: 24, color: "#111827", marginBottom: 16 }}>
        Hello, {user.fullName} 👋
      </Text>

      {/* Completed Items List */}
      <FlatList
        data={completedItems}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#111827", marginBottom: 4 }}>{item.title}</Text>
            {item.description && (
              <Text style={{ color: "#6b7280", marginBottom: 4, fontSize: 13 }}>{item.description}</Text>
            )}
            {item.location && (
              <Text style={{ color: "#6b7280", marginBottom: 8, fontSize: 12 }}>{item.location}</Text>
            )}
            <TouchableOpacity onPress={() => handleItemUpload(item._id)}>
              <Image
                source={{ uri: itemImages[item._id] || item.photoUrl }}
                style={{ width: "100%", aspectRatio: 1, borderRadius: 8, marginTop: 4 }}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
