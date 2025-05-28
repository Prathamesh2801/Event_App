"use client";

import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundVideoBanner from "../components/BackgroundVideoBanner";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchSpecificUserId } from "../constants/api/eventApi";
import RegistrationDetails from "../components/RegistrationDetails";
import { API_BASE_URL } from "../config";

export default function QrScreen({ navigation }) {
  const [dataLoading, setDataLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const isLoading = dataLoading || !videoLoaded || !qrImageUrl;

  // Callback function to handle when video is loaded
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  async function fetchQrDetails() {
    try {
      setDataLoading(true);
      const eventId = await AsyncStorage.getItem("eventId");
      const userId = await AsyncStorage.getItem("userId");
      const resp = await fetchSpecificUserId(userId, eventId);

      if (resp.Status && resp.Data) {
        setUserData(resp.Data);

        // Construct the full QR image URL
        if (resp.Data.QRPath) {
          const qrUrl = `${API_BASE_URL}/${resp.Data.QRPath}`;
          setQrImageUrl(qrUrl);
        }
      } else {
        console.log("Failed to fetch user data:", resp.Message);
      }
    } catch (error) {
      console.log("Error fetching QR details:", error);
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    fetchQrDetails();
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
          onPress={() => navigation.replace("MyTabs")}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <BlurView intensity={30} style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>My QR Code</Text>
              <Text style={styles.subtitle}>
                Show this QR code at the event check-in
              </Text>
            </View>

            <View style={styles.qrContainer}>
              {qrImageUrl ? (
                <Image
                  source={{ uri: qrImageUrl }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.qrPlaceholder}>
                  <Text style={styles.qrPlaceholderText}>
                    QR Code not available
                  </Text>
                </View>
              )}
            </View>

            {userData && (
              <RegistrationDetails
                title="Registration Details"
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
    top: 40,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
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
  header: {
    alignItems: "center",
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
    textAlign: "center",
  },
  qrContainer: {
    width: 200,
    height: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    padding: 10,
  },
  qrImage: {
    width: "100%",
    height: "100%",
  },
  qrPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qrPlaceholderText: {
    color: "#666",
    fontSize: 14,
  },
});
