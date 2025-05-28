// Enhanced pushNotification.jsx
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { Alert, Platform, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOPIC_STORAGE_KEY = "subscribed_topics";
const NOTIFICATION_PERMISSION_ASKED = "notification_permission_asked";

const requestUserPermission = async () => {
  try {
    // Request Firebase messaging permission
    const authStatus = await messaging().requestPermission();
    const firebaseEnabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log("Firebase permission:", authStatus);

    return firebaseEnabled;
  } catch (error) {
    console.error("Permission request error:", error);
    return false;
  }
};

const showPermissionModal = () => {
  return new Promise((resolve) => {
    Alert.alert(
      "🔔 Enable Notifications",
      "Stay updated with important event announcements, schedule changes, and reminders. We'll only send you relevant information about this event.",
      [
        {
          text: "Not Now",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Enable Notifications",
          onPress: () => resolve(true),
        },
      ],
      { cancelable: false }
    );
  });
};

const showAndroidOptimizationModal = () => {
  return new Promise((resolve) => {
    Alert.alert(
      "📱 Enable Background Notifications",
      "To receive notifications when the app is closed or in background:\n\n🔋 For better notification delivery:\n• Go to App Settings\n• Find 'Battery' or 'Power Management'\n• Select 'Don't optimize' or 'Allow background activity'\n• Enable 'Auto-start' if available\n\n📲 This ensures you never miss important event updates!",
      [
        {
          text: "Maybe Later",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Open Settings",
          onPress: () => {
            if (Platform.OS === 'android') {
              Linking.openSettings();
            }
            resolve(true);
          },
        },
      ],
      { cancelable: false }
    );
  });
};

export async function initPushNotification() {
  try {
    // Check if we've already asked for permission
    const hasAskedBefore = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_ASKED);
    
    if (!hasAskedBefore) {
      // Show our custom modal first
      const userWantsNotifications = await showPermissionModal();
      
      if (!userWantsNotifications) {
        await AsyncStorage.setItem(NOTIFICATION_PERMISSION_ASKED, "declined");
        return false;
      }
    }

    const hasPermission = await requestUserPermission();
    
    if (hasPermission) {
      const token = await messaging().getToken();
      console.log("📲 FCM Token:", token);

      // Store that we've successfully got permissions
      await AsyncStorage.setItem(NOTIFICATION_PERMISSION_ASKED, "granted");

      await unsubscribeFromAllTopics();
      const eventId = await AsyncStorage.getItem("eventId");
      console.log('Notification eventid', eventId);
      
      if (eventId) {
        await subscribeToTopic(eventId);
      }

      // Show Android-specific instructions if needed
      if (Platform.OS === 'android' && hasAskedBefore !== "granted") {
        setTimeout(() => {
          showAndroidOptimizationModal();
        }, 1500);
      }

      return true;
    } else {
      await AsyncStorage.setItem(NOTIFICATION_PERMISSION_ASKED, "denied");
      
      // Show manual settings instructions
      Alert.alert(
        "Notifications Disabled",
        "To enable notifications, please go to your device Settings > Apps > [App Name] > Notifications and turn them on.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }
  } catch (error) {
    console.error("Push notification initialization error:", error);
    return false;
  }
}

// Function to check and re-request permissions if needed
export async function checkNotificationStatus() {
  try {
    const firebaseStatus = await messaging().hasPermission();
    
    const hasPermissions = 
      firebaseStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      firebaseStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!hasPermissions) {
      const shouldAsk = await new Promise((resolve) => {
        Alert.alert(
          "🔔 Stay Updated!",
          "Enable notifications to receive:\n• Event schedule changes\n• Important announcements\n• Last-minute updates\n• Networking opportunities\n\nDon't miss out on key information!",
          [
            { text: "Not Now", style: "cancel", onPress: () => resolve(false) },
            { text: "Enable Notifications", onPress: () => resolve(true) }
          ]
        );
      });

      if (shouldAsk) {
        return await initPushNotification();
      }
    } else {
      // Permissions are granted, but show Android optimization tip
      if (Platform.OS === 'android') {
        const hasShownOptimizationTip = await AsyncStorage.getItem('android_optimization_tip_shown');
        if (!hasShownOptimizationTip) {
          setTimeout(() => {
            showAndroidOptimizationModal();
            AsyncStorage.setItem('android_optimization_tip_shown', 'true');
          }, 1000);
        }
      }
    }

    return hasPermissions;
  } catch (error) {
    console.error("Check notification status error:", error);
    return false;
  }
}

const unsubscribeFromAllTopics = async () => {
  try {
    const topicsString = await AsyncStorage.getItem(TOPIC_STORAGE_KEY);
    const topics = topicsString ? JSON.parse(topicsString) : [];

    for (const topic of topics) {
      await messaging().unsubscribeFromTopic(topic);
      console.log("🔕 Unsubscribed from topic:", topic);
    }

    await AsyncStorage.removeItem(TOPIC_STORAGE_KEY);
  } catch (err) {
    console.error("⚠️ Failed to unsubscribe from topics:", err);
  }
};

const subscribeToTopic = async (topicName) => {
  try {
    if (!topicName) {
      console.warn("No topic name provided for subscription");
      return;
    }

    await messaging().subscribeToTopic(topicName);
    console.log("🔔 Subscribed to topic:", topicName);

    await AsyncStorage.setItem(TOPIC_STORAGE_KEY, JSON.stringify([topicName]));
  } catch (err) {
    console.error("⚠️ Failed to subscribe to topic:", err);
  }
};

export default function usePushNotification() {
  useEffect(() => {
    // Initialize push notifications when component mounts
    initPushNotification();

    // Listen to foreground messages
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        console.log("📬 Foreground message:", remoteMessage);
        
        // Show a more user-friendly alert
        if (remoteMessage.notification) {
          Alert.alert(
            remoteMessage.notification.title || "New Notification",
            remoteMessage.notification.body || "You have a new message",
            [{ text: "OK" }]
          );
        }
      }
    );

    // App opened from background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("📖 Opened from background:", remoteMessage?.notification);
      // Handle navigation based on notification data if needed
      if (remoteMessage?.data?.screen) {
        // Navigate to specific screen
        console.log("Navigate to:", remoteMessage.data.screen);
      }
    });

    // App opened from quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("🛌 Opened from quit state:", remoteMessage?.notification);
          // Handle navigation based on notification data if needed
          if (remoteMessage?.data?.screen) {
            console.log("Navigate to:", remoteMessage.data.screen);
          }
        }
      });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  return null;
}