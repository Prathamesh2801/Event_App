import { View, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundVideoBanner from "../components/BackgroundVideoBanner";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "./LoadingScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchSpecificUserId } from "../constants/api/eventApi";
import RegistrationDetails from "../components/RegistrationDetails";

export default function PersonalInfoScreen({ navigation }) {
  // Separate loading states for different operations
  const [dataLoading, setDataLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Combined loading state - show loading screen until BOTH video and data are ready
  const isLoading = dataLoading ||  !videoLoaded || !userData;

  // Callback function to handle when video is loaded
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  async function fetchPersonalDetails() {
    try {
      setDataLoading(true);
      const eventId = await AsyncStorage.getItem("eventId");
      const userId = await AsyncStorage.getItem("userId");
      const resp = await fetchSpecificUserId(userId, eventId);

      if (resp.Status && resp.Data) {
        setUserData(resp.Data);
      } else {
        console.log("Failed to fetch user data:", resp.Message);
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    fetchPersonalDetails();
  }, []);

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
        <TouchableOpacity
          style={styles.fixedBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <BlurView intensity={30} style={styles.container}>
          <View style={styles.content}>
            {userData && (
              <RegistrationDetails
                title="Personal Information"
                userData={userData}
              />
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
    backgroundColor: "black", // Fallback background color
  },
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
  content: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
});
