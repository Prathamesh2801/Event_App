import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  ScrollView,
  FlatList 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundVideoBanner from "../components/BackgroundVideoBanner";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "./LoadingScreen";
import { useEffect, useState } from "react";

export default function NotificationScreen({ navigation }) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Dummy notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Wi-Fi Password Updated",
      message: "The conference Wi-Fi password has been updated to 'TechConf2024'",
      timeAgo: "5 min ago",
      type: "info"
    },
    {
      id: 2,
      title: "Lunch Schedule Change",
      message: "Lunch break has been extended by 30 minutes today",
      timeAgo: "20 min ago",
      type: "warning"
    },
    {
      id: 3,
      title: "New Workshop Added",
      message: "A new workshop on 'Cloud Security' has been added to Room C at 3 PM",
      timeAgo: "1 hour ago",
      type: "success"
    },
    {
      id: 4,
      title: "Keynote Speaker Change",
      message: "Due to unforeseen circumstances, the keynote speaker has been changed",
      timeAgo: "2 hours ago",
      type: "info"
    },
    {
      id: 5,
      title: "Networking Session",
      message: "Join us for an exclusive networking session at the rooftop lounge",
      timeAgo: "3 hours ago",
      type: "success"
    }
  ]);

  const isLoading = !videoLoaded;

  // Callback function to handle when video is loaded
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return { name: 'warning', color: '#F59E0B' };
      case 'success':
        return { name: 'checkmark-circle', color: '#10B981' };
      case 'info':
      default:
        return { name: 'information-circle', color: '#3B82F6' };
    }
  };

  const renderNotificationItem = ({ item }) => {
    const iconData = getNotificationIcon(item.type);
    
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
            <Text style={styles.notificationTitle}>{item.title}</Text>
          </View>
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
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
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off" size={64} color="rgba(255,255,255,0.6)" />
                <Text style={styles.emptyText}>No notifications yet</Text>
                <Text style={styles.emptySubtext}>We'll notify you when something important happens</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  timeAgo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
});