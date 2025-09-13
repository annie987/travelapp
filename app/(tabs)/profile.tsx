// ===== PROFILE COMPONENT (Profile.tsx) =====
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { useQuery, useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../convex/_generated/api";

export default function Profile() {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();

  // -------------------------
  // Mutations
  // -------------------------
  const generateUploadUrl = useMutation(api.profile.generateUploadUrl);

  const updateProfileImageMutation = useMutation(api.profile.updateProfileImage, {
    onSuccess: (permanentUrl) => {
      setAvatar(permanentUrl);
      api.profile.getProfileImage.invalidate({ clerkId: user?.id });
    },
  });

  const saveItemImageMutation = useMutation(api.profile.saveItemImage, {
    onSuccess: (permanentUrl, { itemId }) => {
      setItemImages((prev) => ({ ...prev, [itemId]: permanentUrl }));
      api.bucketlist.listBucketListItems.invalidate({ clerkId: user?.id });
    },
  });

  // -------------------------
  // State
  // -------------------------
  const [avatar, setAvatar] = useState<string>("");
  const [itemImages, setItemImages] = useState<{ [key: string]: string }>({});
  const [isUploading, setIsUploading] = useState(false);
  const lastValidAvatar = useRef<string>(""); 
  // -------------------------
  // Queries
  // -------------------------
  const completedItems = useQuery(api.bucketlist.completedItems, { clerkId: user?.id ?? "" }) ?? [];
  const allItems = useQuery(api.bucketlist.listBucketListItems, { clerkId: user?.id ?? "" }) ?? [];
  const userProfile = useQuery(api.profile.getProfileImage, { clerkId: user?.id ?? "" });
  console.log("User profile query result:", userProfile);

  // Set initial avatar from query
  useEffect(() => {
    if (!isUploading && userProfile?.image && userProfile.image !== avatar) {
      setAvatar(userProfile.image);
    }
  }, [userProfile?.image, isUploading]);

  if (!isLoaded) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (!user) return <Text>No user signed in</Text>;

  // -------------------------
  // Handlers
  // -------------------------
  const handleAvatarUpload = async () => {
    try {
      setIsUploading(true);
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
  
      if (result.canceled) return;
  
      const fileUri = result.assets[0].uri;
      setAvatar(fileUri); // instant preview
      lastValidAvatar.current = fileUri; // update last known good
  
      const uploadUrl = await generateUploadUrl();
  
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        type: result.assets[0].mimeType || "image/jpeg",
        name: result.assets[0].fileName || `avatar_${Date.now()}.jpg`,
      } as any);
  
      const uploadResponse = await fetch(uploadUrl, { method: "POST", body: formData });
      if (!uploadResponse.ok) throw new Error(`Upload failed: ${uploadResponse.statusText}`);
  
      const { storageId } = await uploadResponse.json();
  
      // Update profile with permanent URL
      const permanentUrl = await updateProfileImageMutation({ storageId });
  
      setAvatar(permanentUrl); // set permanent image
      lastValidAvatar.current = permanentUrl; // update last known good
  
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setAvatar(lastValidAvatar.current); // revert to last known good
    } finally {
      setIsUploading(false);
    }
  };
  

  const handleItemUpload = async (itemId: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const fileUri = result.assets[0].uri;
      setItemImages((prev) => ({ ...prev, [itemId]: fileUri }));

      const uploadUrl = await generateUploadUrl();

      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        type: result.assets[0].mimeType || "image/jpeg",
        name: result.assets[0].fileName || `item_${Date.now()}.jpg`,
      } as any);

      const uploadResponse = await fetch(uploadUrl, { method: "POST", body: formData });
      if (!uploadResponse.ok) throw new Error(`Upload failed: ${uploadResponse.statusText}`);

      const { storageId } = await uploadResponse.json();
      console.log(`Item ${itemId} storageId:`, storageId);

      const permanentUrl = await saveItemImageMutation({ itemId, storageId });
      console.log(`Item ${itemId} permanent URL:`, permanentUrl);

    } catch (err) {
      console.error("Error uploading item image:", err);
    }
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6", padding: 16 }}>
      {/* Sign Out */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 20 }}>
        <TouchableOpacity onPress={signOut}>
          <Text style={{ fontWeight: "600", fontSize: 16, color: "#111827" }}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar + Completed Stats */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
      <TouchableOpacity
          onPress={handleAvatarUpload}
          disabled={isUploading}
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
            opacity: isUploading ? 0.6 : 1,
          }}
        >
          {isUploading ? (
            <ActivityIndicator size="large" color="#6b7280" />
          ) : avatar ? (
            <Image
              source={{ uri: avatar }}
              style={{ width: 110, height: 110, borderRadius: 55 }}
              onError={() => setAvatar(lastValidAvatar.current)} // fallback if URL fails
            />
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
              {(itemImages[item._id] || item.photoUrl) ? (
                <Image
                  source={{ uri: itemImages[item._id] || item.photoUrl }}
                  style={{ width: "100%", aspectRatio: 1, borderRadius: 8, marginTop: 4 }}
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                    borderRadius: 8,
                    marginTop: 4,
                    backgroundColor: "#f3f4f6",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: "#e5e7eb",
                    borderStyle: "dashed",
                  }}
                >
                  <Feather name="camera" size={32} color="#9ca3af" />
                  <Text style={{ color: "#9ca3af", marginTop: 8 }}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
