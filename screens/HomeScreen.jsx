import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/colors";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <LinearGradient
      style={styles.rootInnerContainer}
      colors={[Colors.primary500, Colors.primary600, Colors.primary700]}
    >
      <SafeAreaView style={styles.wrapper}>
        <BlurView intensity={50} style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Main Menu Cards Grid */}
            <View style={styles.menuGrid}>
              <TouchableOpacity style={styles.menuCard}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#D0E1FF" }]}
                >
                  <Ionicons name="calendar" size={24} color="#3B82F6" />
                </View>
                <Text style={styles.menuCardText}>Schedule</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuCard}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#D7F9EB" }]}
                >
                  <Ionicons name="person" size={24} color="#10B981" />
                </View>
                <Text style={styles.menuCardText}>Personal Info</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuCard}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#FFE9D6" }]}
                >
                  <Ionicons name="notifications" size={24} color="#F97316" />
                </View>
                <Text style={styles.menuCardText}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuCard}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#E9E1FD" }]}
                >
                  <MaterialIcons
                    name="qr-code-scanner"
                    size={24}
                    color="#8B5CF6"
                  />
                </View>
                <Text style={styles.menuCardText}>QR Code</Text>
              </TouchableOpacity>
            </View>

            {/* Latest Updates Section */}
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

            {/* Upcoming Event Section */}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  rootInnerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    width: "100%",
  },
  container: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    padding: 16,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  menuCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 16,
    padding: 16,
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
    marginBottom: 8,
  },
  menuCardText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
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
    backgroundColor: "rgba(255, 255, 255, 0.85)",
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
    backgroundColor: "rgba(255, 255, 255, 0.85)",
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
