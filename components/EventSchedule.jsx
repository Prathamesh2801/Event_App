"use client";

import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { format } from "date-fns";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";
import { fetchScheduleForUser } from "../constants/api/eventApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BlurView } from "expo-blur";

const EventSchedule = ({ eventId, userId }) => {
  const navigation = useNavigation();
  const [activeDay, setActiveDay] = useState("");
  const [scheduleData, setScheduleData] = useState([]);
  const [dayTabs, setDayTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [eventName, setEventName] = useState("");
  const [viewMode, setViewMode] = useState("all"); // "all" or "favorites"

  useEffect(() => {
    loadScheduleData();
  }, [eventId, userId]);

  useFocusEffect(
    useCallback(() => {
      loadScheduleData(); // for when returning to this screen
    }, [eventId, userId])
  );
  // Filter data when active day changes or view mode changes
  useEffect(() => {
    if (scheduleData.length === 0) {
      setFilteredData([]);
      return;
    }

    let filtered = scheduleData;

    // Filter by day if active day is set
    if (activeDay) {
      filtered = filtered.filter((item) => {
        return formatDateForComparison(item.Start_Date) === activeDay;
      });
    }

    // Filter by favorites if in favorites mode
    if (viewMode === "favorites") {
      filtered = filtered.filter((item) => favorites[item.ID]);
    }

    setFilteredData(filtered);
  }, [activeDay, scheduleData, favorites, viewMode]);

  const formatDateForComparison = (dateString) => {
    // Format date as YYYY-MM-DD for comparison
    return dateString;
  };

  const formatDateForDisplay = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d"); // e.g., "May 23"
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      let data = [];
      // For testing, use your sam ple data if the API fails
      try {
        data = await fetchScheduleForUser(eventId, userId);
        setEventName(await AsyncStorage.getItem("eventName"));
      } catch (error) {
        console.error("Error fetching schedule (user):", error);
      }

      setScheduleData(data);

      // Generate day tabs from the data
      const uniqueDays = [
        ...new Set(
          data.map((item) => formatDateForComparison(item.Start_Date))
        ),
      ];
      const tabs = uniqueDays.map((day) => ({
        id: day,
        label: formatDateForDisplay(day),
      }));

      setDayTabs(tabs);

      // Set the first day as active if we have days
      if (tabs.length > 0 && !activeDay) {
        setActiveDay(tabs[0].id);
      }
    } catch (error) {
      console.error("Failed to load schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const hasFavorites = () => {
    return Object.values(favorites).some((value) => value === true);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  const renderDayTab = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.dayTab, activeDay === item.id && styles.activeDayTab]}
      onPress={() => setActiveDay(item.id)}
    >
      <Text
        style={[
          styles.dayTabText,
          activeDay === item.id && styles.activeDayTabText,
        ]}
      >
        Day {index + 1} ({item.label})
      </Text>
    </TouchableOpacity>
  );

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleCard}>
      {/* Header row with time and bookmark */}
      <View style={styles.cardHeader}>
        {item.End_Time && (
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={16} color="white" />
            <Text style={styles.timeText}>
              {formatTime(item.Start_Time)} - {formatTime(item.End_Time)}
            </Text>
          </View>
        )}
        <TouchableOpacity onPress={() => toggleFavorite(item.ID)}>
          <Ionicons
            name={favorites[item.ID] ? "bookmark" : "bookmark-outline"}
            size={24}
            color={favorites[item.ID] ? "#8A2BE2" : "#666"}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.sessionTitle}>{item.Title}</Text>

        {item.Location && (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#b50a0a" />
            <Text style={styles.locationText}>{item.Location}</Text>
          </View>
        )}

        {item.Speaker && (
          <View style={styles.speakerRow}>
            <Text style={styles.speakerName}>{item.Speaker}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
    
      {/* Header */}
      <View intensity={30} tint="light" style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{eventName || "Event"}</Text>
        <Text></Text>
      </View>

      {/* Day tabs */}
      {dayTabs.length > 0 && (
        <View style={styles.dayTabsWrapper}>
          <FlatList
            data={dayTabs}
            renderItem={renderDayTab}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayTabsContainer}
          />
        </View>
      )}

      {/* Schedule content */}
      <View style={styles.scheduleContainer}>
        <BlurView intensity={30} tint="light" style={styles.blurContainer}>
          {/* View toggle buttons */}
          <View style={styles.viewToggleContainer}>
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === "all" && styles.activeViewToggleButton,
              ]}
              onPress={() => setViewMode("all")}
            >
              <Text
                style={[
                  styles.viewToggleText,
                  viewMode === "all" && styles.activeViewToggleText,
                ]}
              >
                All Sessions
              </Text>
            </TouchableOpacity>

            {hasFavorites() && (
              <TouchableOpacity
                style={[
                  styles.viewToggleButton,
                  viewMode === "favorites" && styles.activeViewToggleButton,
                ]}
                onPress={() => setViewMode("favorites")}
              >
                <Text
                  style={[
                    styles.viewToggleText,
                    viewMode === "favorites" && styles.activeViewToggleText,
                  ]}
                >
                  Favorites
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredData}
            renderItem={renderScheduleItem}
            keyExtractor={(item) => item.ID.toString()}
            contentContainerStyle={styles.scheduleList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {viewMode === "favorites"
                    ? "No favorite sessions yet. Bookmark sessions to see them here."
                    : "No sessions available for this day"}
                </Text>
              </View>
            }
          />
        </BlurView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor: "#fff",
  },
  backButton: {
    padding: 4,
    // position: "absolute",
    // top: 40, // adjust based on your safe area, or use useSafeAreaInsets
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)", // optional for visibility
    padding: 8,
    borderRadius: 20,
 
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color:"#ffffff"
  },
  dayTabsWrapper: {
    // backgroundColor: "#fff",
  },
  dayTabsContainer: {
    // paddingVertical: 10,
    paddingHorizontal: 8,
  },
  dayTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeDayTab: {
    backgroundColor: "#8A2BE2",
  },
  dayTabText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 13,
  },
  activeDayTabText: {
    color: "#fff",
  },
  scheduleContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 8,
    paddingTop: 5,
    paddingHorizontal: 16,
  },
  blurContainer: {
    height: "98%",
    width: "100%",
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  viewToggleContainer: {
    flexDirection: "row",

    marginLeft: 8,
    padding: 6,
  },
  viewToggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  activeViewToggleButton: {
    backgroundColor: "#8A2BE2",
  },
  viewToggleText: {
    fontWeight: "bold",
    color: "#666",
  },
  activeViewToggleText: {
    color: "#fff",
  },
  scheduleList: {
    paddingTop: 5,
    padding: 20,
  },
  scheduleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 20,
    borderColor: "#6f0dca",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeBadge: {
    backgroundColor: "#6f0dca",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "space-around",
  },
  timeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  cardContent: {
    flex: 1,
    marginLeft: 20,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f1e1e",
    marginVertical: 5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  speakerRow: {
    alignItems: "flex-end",
  },
  speakerName: {
    fontSize: 14,
    color: "#262525",
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default EventSchedule;
