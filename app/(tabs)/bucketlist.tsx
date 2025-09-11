import { useUser } from "@clerk/clerk-expo";
import { Fontisto } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { api } from "../../convex/_generated/api";
import { styles } from "@/styles/auth.styles";

export default function BucketList() {
  const { user } = useUser();
  const router = useRouter();

  if (!user) return <Text>Loading...</Text>;

  const items = useQuery(api.bucketlist.listBucketListItems, { clerkId: user.id }) ?? [];
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    if (items.length !== localItems.length) setLocalItems(items);
  }, [items]);

  const createItem = useMutation(api.bucketlist.createBucketListItem);
  const deleteItem = useMutation(api.bucketlist.deleteBucketListItem);
  const checkItem = useMutation(api.bucketlist.checkBucketListItem);

  // Form state
  const [formVisible, setFormVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [plannedDate, setPlannedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);
  const [mapPickerVisible, setMapPickerVisible] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;

    await createItem({
      title,
      description: description || undefined,
      category: category || undefined,
      location: location || undefined,
      locationLat: locationLat || undefined,
      locationLng: locationLng || undefined,
      plannedDate: plannedDate ? plannedDate.toISOString().split("T")[0] : undefined,
    });

    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setPlannedDate(null);
    setLocationLat(null);
    setLocationLng(null);
    setFormVisible(false);
  };

  const handleDelete = async (itemId: string) => {
    await deleteItem({ itemId });
    setLocalItems(prev => prev.filter(item => item._id !== itemId));
  };

  const handleCheck = async (itemId: string) => {
    setLocalItems(prev =>
      prev.map(item =>
        item._id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
    await checkItem({ itemId });
  };

  const completedCount = localItems.filter(item => item.completed).length;
  const pendingCount = localItems.filter(item => !item.completed).length;

  const formFields = [
    { label: "Title *", value: title, setter: setTitle, placeholder: "Enter bucket list title" },
    { label: "Description", value: description, setter: setDescription, placeholder: "Optional: add details" },
    { label: "Category", value: category, setter: setCategory, placeholder: "e.g., Adventure, Culture" },
    { label: "Location", value: location, setter: setLocation, placeholder: "e.g., Paris, Tokyo" },
    { label: "Planned Date", value: plannedDate, setter: setPlannedDate, placeholder: "YYYY-MM-DD" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Dashboard Cards */}
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Completed</Text>
            <Text style={styles.cardValue}>{completedCount}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pending</Text>
            <Text style={styles.cardValue}>{pendingCount}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total</Text>
            <Text style={styles.cardValue}>{localItems.length}</Text>
          </View>
        </View>

        {/* Bucket List Items */}
        <FlatList
          data={localItems}
          keyExtractor={item => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Checkbox
                value={item.completed}
                onValueChange={() => handleCheck(item._id)}
                color={item.completed ? "#003366" : undefined}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={[
                    styles.listItemTitle,
                    item.completed && { textDecorationLine: "line-through" },
                  ]}
                >
                  {item.title}
                </Text>
                {item.description && <Text style={styles.listItemDescription}>{item.description}</Text>}
                {item.category && <Text style={styles.detailText}>Category: {item.category}</Text>}
                {item.location && <Text style={styles.detailText}>Location: {item.location}</Text>}
                {item.plannedDate && <Text style={styles.detailText}>Planned Date: {item.plannedDate}</Text>}
              </View>
              <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.trashButton}>
                <Fontisto name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => setFormVisible(!formVisible)}
        style={styles.floatingButton}
      >
        <Fontisto name={formVisible ? "angle-down" : "plus-a"} size={24} color="#fff" />
      </TouchableOpacity>

      {/* Floating Form Panel */}
      {formVisible && (
        <View style={styles.formPanel}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {formFields.map(field => (
              <View key={field.label} style={styles.formRow}>
                <Text style={styles.label}>{field.label}</Text>
                {field.label === "Planned Date" ? (
                  <>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      style={styles.input}
                    >
                      <Text style={{ color: plannedDate ? "#003366" : "#666" }}>
                        {plannedDate ? plannedDate.toISOString().split("T")[0] : field.placeholder}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={showDatePicker}
                      mode="date"
                      onConfirm={date => { setPlannedDate(date); setShowDatePicker(false); }}
                      onCancel={() => setShowDatePicker(false)}
                    />
                  </>
                ) : (
                  <TextInput
                    placeholder={field.placeholder}
                    placeholderTextColor="#666"
                    value={field.value as any}
                    onChangeText={field.setter as any}
                    style={styles.input}
                  />
                )}
              </View>
            ))}

            <TouchableOpacity
              onPress={() => setMapPickerVisible(true)}
              style={[styles.button, { backgroundColor: "#0059b3", marginBottom: 12 }]}
            >
              <Text style={styles.buttonText}>
                {locationLat && locationLng ? "Change Location" : "Pick Location on Map"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAdd} style={styles.button}>
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Map Picker Modal */}
      <Modal visible={mapPickerVisible} animationType="slide">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: locationLat || 20,
            longitude: locationLng || 0,
            latitudeDelta: 80,
            longitudeDelta: 80,
          }}
          onLongPress={e => {
            const coord = e.nativeEvent.coordinate;
            setLocationLat(coord.latitude);
            setLocationLng(coord.longitude);
          }}
        >
          {locationLat && locationLng && <Marker coordinate={{ latitude: locationLat, longitude: locationLng }} />}
        </MapView>
        <TouchableOpacity style={styles.mapDoneButton} onPress={() => setMapPickerVisible(false)}>
          <Text style={styles.mapDoneText}>Done</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
