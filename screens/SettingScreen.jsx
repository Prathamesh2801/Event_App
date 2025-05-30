import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import BackgroundVideoBanner from "../components/BackgroundVideoBanner";
import { useLayoutEffect, useState } from "react";
import { fetchEvents } from "../constants/api/eventApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "./LoadingScreen";

export default function SettingScreen({ navigation }) {
  const [eventSettings, setEventSettings] = useState({
    IsPoll: "0",
    IsFaceRec: "0",
    loading: true,
  });
  const [loading, setLoading] = useState(true);
  const fetchEventSettings = async () => {
    try {
      setLoading(true)
      const eventId = await AsyncStorage.getItem("eventId");
      const resp = await fetchEvents(eventId);
      if (resp && resp.Status && resp.Data && resp.Data.event) {
        setEventSettings({
          IsPoll: resp.Data.event.IsPoll || "0",
          IsFaceRec: resp.Data.event.IsFaceRec || "0",
          loading: false,
        });
      } else {
        setEventSettings((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error("Error fetching event settings:", error);
      setEventSettings((prev) => ({ ...prev, loading: false }));
    }finally{
      setLoading(false)
    }
  };

  useLayoutEffect(() => {
    fetchEventSettings();
  }, []);


  const handleSettingPress = (settingName) => {
    // Handle navigation or actions based on setting
    console.log(`Pressed ${settingName}`);
    // You can add navigation logic here

    if(settingName=== 'Polls'){
      navigation.navigate('PollPage')
    }
    else if(settingName === 'Notifications'){
      navigation.navigate('NotificationPage')
    }
  };
  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      // For web, use window.confirm
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        try {
          await AsyncStorage.multiRemove([
            "eventId",
            "userId",
            "eventName",
            "eventLogo",
          ]);
          navigation.navigate("EventRegister");
          console.log("User logged out");
        } catch (error) {
          console.error("Logout error:", error);
        }
      }
    } else {
      // For native platforms, use Alert
      Alert.alert("Logout", "Are you sure you want to logout?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                "eventId",
                "userId",
                "eventName",
                "eventLogo",
              ]);
              navigation.navigate("EventRegister");
              console.log("User logged out");
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
        },
      ]);
    }
  };

  const SettingItem = ({ iconName, title, onPress, showChevron = true }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.settingText}>{title}</Text>
      </View>
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#FFFFFF"
          opacity={0.7}
        />
      )}
    </TouchableOpacity>
  );

    if (loading) {
      return <LoadingScreen />;
    }

  return (
    <View style={styles.rootContainer}>
      <BackgroundVideoBanner />
      <SafeAreaView style={styles.wrapper}>
        <TouchableOpacity
          style={styles.fixedBackButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <BlurView intensity={30} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Account Settings</Text>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Always visible settings */}
            <SettingItem
              iconName="ticket-outline"
              title="My Ticket"
              onPress={() => handleSettingPress("My Ticket")}
            />

            {/* Conditionally visible settings based on API response */}
            {!eventSettings.loading && eventSettings.IsPoll === "1" && (
              <SettingItem
                iconName="bar-chart-outline"
                title="Polls"
                onPress={() => handleSettingPress("Polls")}
              />
            )}

            <SettingItem
              iconName="notifications-outline"
              title="Notifications"
              onPress={() => handleSettingPress("Notifications")}
            />

            {!eventSettings.loading && eventSettings.IsFaceRec === "1" && (
              <SettingItem
                iconName="scan-outline"
                title="Face ID"
                onPress={() => handleSettingPress("Face ID")}
              />
            )}

            <SettingItem
              iconName="log-out-outline"
              title="Log Out"
              onPress={handleLogout}
              showChevron={false}
            />
          </ScrollView>
        </BlurView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
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
  fixedBackButton: {
    position: "absolute",
    top: 40, // adjust based on your safe area, or use useSafeAreaInsets
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)", // optional for visibility
    padding: 8,
    borderRadius: 20,
  },

  container: {
    height: "85%",
    width: "100%",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    flexGrow: 1,
    gap: 6,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 12,
    marginVertical: 4,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    flex: 1,
  },
});
