import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundVideoBanner from "../components/BackgroundVideoBanner";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "./LoadingScreen";
import { useCallback, useEffect, useState } from "react";
import { fetchAllNotifications } from "../constants/api/Notification";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function NotificationScreen({ navigation }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [notifications, setNotifications] = useState([]);

  async function getAllNotifications() {
    const eventId = await AsyncStorage.getItem("eventId");
    const resp = await fetchAllNotifications(eventId);
    console.log("Fetched Notifications:", resp);
    setNotifications(resp);
  }

  useEffect(() => {
    getAllNotifications();
  }, []);
  useFocusEffect(
    useCallback(() => {
      getAllNotifications();
    }, [])
  );
  const isLoading = !videoLoaded;

  // Callback function to handle when video is loaded
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "warning":
        return { name: "warning", color: "#F59E0B" };
      case "success":
        return { name: "checkmark-circle", color: "#10B981" };
      case "info":
        return { name: "information-circle", color: "#3B82F6" };
      case "error":
        return { name: "close-circle", color: "#EF4444" };
      default:
        return { name: "alert-circle", color: "#9CA3AF" }; // neutral default
    }
  };

  const renderNotificationItem = ({ item }) => {
    const iconData = getNotificationIcon(item.Type);
    const timeAgo = dayjs(item.Created_AT).fromNow();

    return (
      <TouchableOpacity style={styles.notificationCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconTitleContainer}>
            <Ionicons
              name={iconData.name}
              size={20}
              color={iconData.color}
              style={styles.notificationIcon}
            />
            <Text style={styles.notificationTitle}>{item.Title}</Text>
          </View>
        </View>
        <Text style={styles.notificationMessage}>{item.Message}</Text>
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </TouchableOpacity>
    );
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
    <View style={styles.rootContainer}>
      <BackgroundVideoBanner onVideoLoaded={handleVideoLoaded} />

      <SafeAreaView style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification</Text>
          <View style={styles.placeholder} />
        </View>

        <BlurView intensity={30} tint="light" style={styles.container}>
          <View style={styles.content}>
            {notifications.length > 0 ? (
              <FlatList
                data={notifications}
                renderItem={renderNotificationItem}
                keyExtractor={(item) => item.Notification_ID.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="notifications-off"
                  size={64}
                  color="rgba(255,255,255,0.6)"
                />
                <Text style={styles.emptyText}>No notifications yet</Text>
                <Text style={styles.emptySubtext}>
                  We'll notify you when something important happens
                </Text>
              </View>
            )}
          </View>
        </BlurView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  rootContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  placeholder: {
    width: 40, // Same width as back button to center the title
  },
  container: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  iconTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  notificationIcon: {
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  timeAgo: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginLeft:'70%'
    
  },
  notificationMessage: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
    marginBottom:10
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 20,
  },
});
