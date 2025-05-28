"use client";

import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import EventSchedule from "../components/EventSchedule";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BackgroundVideoBanner from "../components/BackgroundVideoBanner";
import LoadingScreen from "./LoadingScreen";

const ScheduleScreen = () => {
  const [eventId, setEventId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load event ID and user ID from AsyncStorage
    const loadUserData = async () => {
      try {
        setLoading(true);
        const storedEventId = await AsyncStorage.getItem("eventId");
        const storedUserId = await AsyncStorage.getItem("userId");

        console.log("fetched event ID from local Storage : ", storedEventId);
        console.log("fetched user ID from local Storage : ", storedUserId);

        if (storedEventId) setEventId(storedEventId);
        if (storedUserId) setUserId(storedUserId);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <BackgroundVideoBanner />
      <View style={styles.container}>
        {eventId && userId ? (
          <EventSchedule eventId={eventId} userId={userId} />
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Event ID or User ID not found. Please login again.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});

export default ScheduleScreen;
