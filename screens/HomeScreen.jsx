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
import { Platform } from "react-native";
import { useEffect as useNotificationEffect } from "react";
import { initializeFirebaseMessaging } from "../helper/notifications";
import usePushNotification, {
  checkNotificationStatus,
} from "../helper/pushNotification";
import { fetchUCEventsPN } from "../constants/api/HomeScreenAPI";

export default function HomeScreen({ navigation }) {
  const [eventLogo, setEventLogo] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [apiError, setApiError] = useState(false);

  // Combined loading state - show loading screen until both video and data are ready
  const isLoading = dataLoading || !videoLoaded || !fontsLoaded;

  // Format time from 24-hour to 12-hour format
  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour12 = parseInt(hours) % 12 || 12;
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString; // Return original if formatting fails
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Calculate time ago for notifications
  const getTimeAgo = (createdAt) => {
    try {
      const now = new Date();
      const created = new Date(createdAt);
      const diffInMinutes = Math.floor((now - created) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } catch (error) {
      return 'Recently';
    }
  };

  // Check if schedule is upcoming (today or future)
  const isUpcomingSchedule = (startDate, startTime) => {
    try {
      const now = new Date();
      const scheduleDateTime = new Date(`${startDate} ${startTime}`);
      return scheduleDateTime >= now;
    } catch (error) {
      return true; // Show by default if parsing fails
    }
  };

  // Get next upcoming schedule
  const getNextUpcomingSchedule = () => {
    const upcoming = schedules
      .filter(schedule => isUpcomingSchedule(schedule.Start_Date, schedule.Start_Time))
      .sort((a, b) => {
        const dateTimeA = new Date(`${a.Start_Date} ${a.Start_Time}`);
        const dateTimeB = new Date(`${b.Start_Date} ${b.Start_Time}`);
        return dateTimeA - dateTimeB;
      });
    
    return upcoming.length > 0 ? upcoming[0] : null;
  };

  async function fetchLocalDetails() {
    try {
      setDataLoading(true);
      setApiError(false);
      
      const eventId = await AsyncStorage.getItem("eventId");
      const eventlogo = await AsyncStorage.getItem("eventLogo");
      const userId = await AsyncStorage.getItem("userId");
      
      console.log("fetched event ID from local Storage : ", eventId);
      console.log("fetched user ID from local Storage : ", userId);
      
      setEventLogo(`${API_BASE_URL}/uploads/event_logos/${eventlogo}`);

      // Fetch data from API
      if (eventId && userId) {
        try {
          const apiResponse = await fetchUCEventsPN(eventId, userId);
          console.log("API Response:", apiResponse);
          
          if (apiResponse.Status) {
            setNotifications(apiResponse.Data.Notifications || []);
            setSchedules(apiResponse.Data.Schedules || []);
          } else {
            setApiError(true);
            console.error("API returned error status");
          }
        } catch (apiError) {
          console.error("Error fetching API data:", apiError);
          setApiError(true);
          // Set empty arrays as fallback
          setNotifications([]);
          setSchedules([]);
        }
      }
    } catch (error) {
      console.error("Error fetching event settings:", error);
      setApiError(true);
    } finally {
      setDataLoading(false);
    }
  }

  useLayoutEffect(() => {
    fetchLocalDetails();
  }, []);
  // Initialize Firebase Messaging and push notifications
  useNotificationEffect(() => {
    const initMessaging = async () => {
      try {
        const messaging = await initializeFirebaseMessaging();
        if (messaging) {
          console.log('Firebase Messaging initialized successfully');
        }
      } catch (error) {
        console.error('Error initializing Firebase Messaging:', error);
      }
    };

    initMessaging();
  }, []);

  // Initialize push notifications for native platform
  if (Platform.OS !== 'web') {
    usePushNotification();
  }

  // Check notification status when screen focuses (less frequent)
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Refresh data when screen comes into focus
      fetchLocalDetails();
      
      // Only check notification status occasionally to avoid spam
      const checkNotifications = async () => {
        const lastCheck = await AsyncStorage.getItem("last_notification_check");
        const now = Date.now();

        // Only check every 24 hours or on first visit
        if (!lastCheck || now - parseInt(lastCheck) > 24 * 60 * 60 * 1000) {
          setTimeout(() => {
            checkNotificationStatus();
            AsyncStorage.setItem("last_notification_check", now.toString());
          }, 3000); // Delay to avoid overwhelming the user
        }
      };

      checkNotifications();
    });

    return unsubscribe;
  }, [navigation]);

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

  // Handle notification settings tap
  const handleNotificationSettings = async () => {
    await checkNotificationStatus();
    navigation.navigate("NotificationPage");
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

  const nextUpcomingSchedule = getNextUpcomingSchedule();

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
              onPress={() => navigation.navigate("PersonalPage")}
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
              onPress={handleNotificationSettings}
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
              onPress={() => navigation.navigate("QrPage")}
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
            {/* Latest Updates Section */}
            {notifications.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Latest Updates</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("NotificationPage")}
                  >
                    <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
                </View>

                {notifications.slice(0, 3).map((notification) => (
                  <View key={notification.Notification_ID} style={styles.updateCard}>
                    <Text style={styles.updateTitle}>{notification.Title}</Text>
                    <Text style={styles.updateDescription}>
                      {notification.Message}
                    </Text>
                    <Text style={styles.timeAgo}>
                      {getTimeAgo(notification.Created_AT)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Upcoming Event Section */}
            {nextUpcomingSchedule && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Upcoming Event</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Schedule")}
                  >
                    <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.eventCard}>
                  <View style={styles.eventTimeContainer}>
                    <Text style={styles.eventTime}>
                      {formatTime(nextUpcomingSchedule.Start_Time)}
                    </Text>
                    <Text style={styles.eventDate}>
                      {formatDate(nextUpcomingSchedule.Start_Date)}
                    </Text>
                  </View>
                  <View style={styles.eventInfoContainer}>
                    <Text style={styles.eventTitle}>{nextUpcomingSchedule.Title}</Text>
                    <View style={styles.locationContainer}>
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#64748B"
                      />
                      <Text style={styles.locationText}>
                        {nextUpcomingSchedule.Location || 'Location TBD'}
                      </Text>
                    </View>
                    {nextUpcomingSchedule.Speaker && (
                      <View style={styles.speakerContainer}>
                        <Ionicons
                          name="person-outline"
                          size={14}
                          color="#64748B"
                        />
                        <Text style={styles.speakerText}>
                          {nextUpcomingSchedule.Speaker}
                        </Text>
                      </View>
                    )}
                  </View>
                 
                </View>
              </View>
            )}

            {/* No Data Messages */}
            {notifications.length === 0 && schedules.length === 0 && !apiError && (
              <View style={styles.noDataContainer}>
                <Ionicons name="information-circle-outline" size={48} color="#9CA3AF" />
                <Text style={styles.noDataTitle}>No Updates Available</Text>
                <Text style={styles.noDataText}>
                  Check back later for notifications and upcoming events.
                </Text>
              </View>
            )}

            {apiError && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                <Text style={styles.errorTitle}>Unable to Load Data</Text>
                <Text style={styles.errorText}>
                  Please check your connection and try again.
                </Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={fetchLocalDetails}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}
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
    marginBottom: 12,
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
    alignItems: "center",
  },
  eventTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  eventDate: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
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
    marginBottom: 2,
  },
  locationText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 4,
  },
  speakerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  speakerText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 4,
  },
  bookmarkButton: {
    padding: 4,
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 40,
  },
  noDataTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    color: "#E5E7EB",
    textAlign: "center",
    lineHeight: 20,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#E5E7EB",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});