import { useUser } from '@clerk/clerk-expo';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { api } from '../../convex/_generated/api';

export default function TabLayout() {
    const { user } = useUser();
    const syncUser = useMutation(api.users.syncUser); // or syncUser if you want updates

    useEffect(() => {
        const runSync = async () => {
            if (!user) return;

            try {
                await syncUser({
                    clerkId: user.id,
                    email: user.primaryEmailAddress?.emailAddress || "",
                    fullname: user.fullName || "",
                    image: user.imageUrl || "",
                    username: user.username || user.id, // fallback if username is missing
                });
            } catch (err) {
                console.error("Error syncing user to Convex:", err);
            }
        };

        runSync();
    }, [user, syncUser]);

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='bucketlist'
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome5 name="list-alt" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='map'
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome5 name="map-marked-alt" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MaterialCommunityIcons name="face-woman-profile" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
