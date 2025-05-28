//HomeScreen.jsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

import * as Font from "expo-font";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundVideoBanner from "../components/BackgroundVideoBanner";
import { API_BASE_URL } from "../config";
import LoadingScreen from "./LoadingScreen";
import usePushNotification  from "../helper/pushNotification";

export default function HomeScreen({ navigation }) {
  const [eventLogo, setEventLogo] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Combined loading state - show loading screen until both video and data are ready
  const isLoading = dataLoading || !videoLoaded || !fontsLoaded;

  async function fetchLocalDetails() {
    try {
      setDataLoading(true);
      const eventId = await AsyncStorage.getItem("eventId");
      const eventlogo = await AsyncStorage.getItem("eventLogo");
      const userId = await AsyncStorage.getItem("userId");
      console.log("fetched event ID from local Storage : ", eventId);
      console.log("fetched user ID from local Storage : ", userId);
      setEventLogo(`${API_BASE_URL}/uploads/event_logos/${eventlogo}`);
    } catch (error) {
      console.error("Error fetching event settings:", error);
    } finally {
      setDataLoading(false);
    }
  }

  useLayoutEffect(() => {
    fetchLocalDetails();
  }, []);
  usePushNotification(); // Initialize push notifications

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        ...Ionicons.font,
        ...MaterialIcons.font,
      });
      setFontsLoaded(true);
    } catch (error) {
      console.error("Error loading fonts:", error);
      setFontsLoaded(true); // Set to true even on error to prevent infinite loading
    }
  };

  useEffect(() => {
    loadFonts();
  }, []);

  // Callback function to handle when video is loaded
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  // Show loading screen until everything is ready
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <BackgroundVideoBanner onVideoLoaded={handleVideoLoaded} />
        <LoadingScreen />
      </View>
    );
  }

  return (
    <View style={styles.rootInnerContainer}>
      <BackgroundVideoBanner onVideoLoaded={handleVideoLoaded} />
      <SafeAreaView style={styles.wrapper}>
        <BlurView intensity={30} tint="light" style={styles.container}>
          <Image source={{ uri: eventLogo }} width={100} height={100} />
          <View style={styles.menuGrid}>
            <TouchableOpacity
              style={[styles.menuCard, { backgroundColor: "#bbf4f7a7" }]}
              onPress={() => navigation.navigate("Schedule")}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#D0E1FF" }]}
              >
                <Ionicons name="calendar" size={18} color="#3B82F6" />
              </View>
              <Text style={styles.menuCardText}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuCard, { backgroundColor: "#c2eee0" }]}
              onPress={() => navigation.replace("PersonalPage")}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#D7F9EB" }]}
              >
                <Ionicons name="person" size={18} color="#10B981" />
              </View>
              <Text style={styles.menuCardText}>Personal Info</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuCard, { backgroundColor: "#e9d2c2" }]}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#FFE9D6" }]}
              >
                <Ionicons name="notifications" size={18} color="#F97316" />
              </View>
              <Text style={styles.menuCardText}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuCard, { backgroundColor: "#ccc7d8eb" }]}
              onPress={() => navigation.replace("QrPage")}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#E9E1FD" }]}
              >
                <MaterialIcons
                  name="qr-code-scanner"
                  size={18}
                  color="#8B5CF6"
                />
              </View>
              <Text style={styles.menuCardText}>QR Code</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Latest Updates</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.updateCard}>
                <Text style={styles.updateTitle}>Wi-Fi Password Updated</Text>
                <Text style={styles.updateDescription}>
                  The conference Wi-Fi password has been updated to
                  "TechConf2024"
                </Text>
                <Text style={styles.timeAgo}>5 min ago</Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Event</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.eventCard}>
                <View style={styles.eventTimeContainer}>
                  <Text style={styles.eventTime}>09:00 AM</Text>
                </View>
                <View style={styles.eventInfoContainer}>
                  <Text style={styles.eventTitle}>Opening Keynote</Text>
                  <View style={styles.locationContainer}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#64748B"
                    />
                    <Text style={styles.locationText}>Main Hall</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.bookmarkButton}>
                  <Ionicons name="bookmark-outline" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </BlurView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "black", // Fallback background color
  },
  rootInnerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    width: "100%",
    backgroundColor: "transparent",
  },
  container: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
    padding: 16,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  scrollContent: {
    padding: 12,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginTop: 10,
    padding: 16,
    paddingBottom: 0,
  },
  menuCard: {
    width: "38%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuCardText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#141a23",
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  seeAllText: {
    fontSize: 14,
    color: "#E5E7EB",
  },
  updateCard: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 16,
  },
  updateTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  updateDescription: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 6,
  },
  timeAgo: {
    fontSize: 12,
    color: "#6B7280",
  },
  eventCard: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  eventTimeContainer: {
    marginRight: 12,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  eventInfoContainer: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 4,
  },
  bookmarkButton: {
    padding: 4,
  },
});
