// usePushNotification.js
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOPIC_STORAGE_KEY = "subscribed_topics";

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log("✅ Authorization status:", authStatus);
    return true;
  } else {
    // console.warn("⛔ Permission not granted for FCM", authStatus);
    return false;
  }
};

export async function initPushNotification() {
  const hasPermission = await requestUserPermission();
  if (hasPermission) {
    const token = await messaging().getToken();
    console.log("📲 FCM Token:", token);

    await unsubscribeFromAllTopics();
    const eventId = await AsyncStorage.getItem("eventId");
    console.log('Notification eventid', eventId)
    await subscribeToTopic(eventId);
  }
}

const unsubscribeFromAllTopics = async () => {
  try {
    const topicsString = await AsyncStorage.getItem(TOPIC_STORAGE_KEY);
    const topics = topicsString ? JSON.parse(topicsString) : [];

    for (const topic of topics) {
      await messaging().unsubscribeFromTopic(topic);
      // console.log("🔕 Unsubscribed from topic:", topic);
    }

    await AsyncStorage.removeItem(TOPIC_STORAGE_KEY);
  } catch (err) {
    console.error("⚠️ Failed to unsubscribe from topics:", err);
  }
};

const subscribeToTopic = async (topicName) => {
  try {
    await messaging().subscribeToTopic(topicName);
    // console.log("🔔 Subscribed to topic:", topicName);

    await AsyncStorage.setItem(TOPIC_STORAGE_KEY, JSON.stringify([topicName]));
  } catch (err) {
    // console.error("⚠️ Failed to subscribe to topic:", err);
  }
};

export default function usePushNotification() {
  useEffect(() => {
    // ✅ Add this line to show prompt and init FCM
    initPushNotification();

    // Listen to foreground messages
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        Alert.alert("📬 FCM Notification", JSON.stringify(remoteMessage));
      }
    );

    // App opened from background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("📖 Opened from background:", remoteMessage?.notification);
    });

    // App opened from quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "🛌 Opened from quit state:",
            remoteMessage?.notification
          );
        }
      });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);
}
