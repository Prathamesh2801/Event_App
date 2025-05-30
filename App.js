//App.js
import { StyleSheet, View, Platform } from "react-native";
import EventRegistrationScreen from "./screens/EventRegistrationScreen";
import UserRegistrationScreen from "./screens/UserRegistrationScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeFirebase, onMessageListener } from "./firebaseConfig";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import messaging from "@react-native-firebase/messaging";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./screens/HomeScreen";
import SettingScreen from "./screens/SettingScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import { Ionicons } from "@expo/vector-icons";
import ErrorPage from "./screens/ErrorPage";
import Toast from "react-native-toast-message";
import AnimatedTabBar from "./components/AnimatedTabBar";

import StartupScreen from "./screens/StartupScreen";
import QrScreen from "./screens/QrScreen";
import PersonalInfoScreen from "./screens/PersonalInfoScreen";

import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { initPushNotification } from "./helper/pushNotification";

import NotificationScreen from "./screens/NotificationScreen";
import PollScreen from "./screens/PollScreen";
import { AVPlaybackStatus, Audio } from "expo-av";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={(props) => <AnimatedTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Tab.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

function AppNavigation() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack.Navigator initialRouteName="Startup">
          <Stack.Screen
            name="Startup"
            component={StartupScreen}
            options={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen
            name="EventRegister"
            component={EventRegistrationScreen}
            options={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen
            name="UserRegister"
            component={UserRegistrationScreen}
            options={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen
            name="ErrorPage"
            component={ErrorPage}
            options={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen
            name="QrPage"
            component={QrScreen}
            options={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen
            name="PersonalPage"
            component={PersonalInfoScreen}
            options={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen
            name="NotificationPage"
            component={NotificationScreen}
            options={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen
            name="PollPage"
            component={PollScreen}
            options={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen
            name="MyTabs"
            component={MyTabs}
            options={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
        </Stack.Navigator>
      </View>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    const initNotifications = async () => {
      if (Platform.OS === "web") {
        // Initialize Firebase for web
        try {
          const token = await initializeFirebase();
          if (token) {
            console.log("Web FCM token:", token);
          }

          // Handle foreground messages in web
          onMessageListener()
            .then((payload) => {
              console.log("📨 Received foreground message:", payload);

              if (Notification.permission === "granted") {
                const { title, body } = payload.notification;

                new Notification(title || "New Message", {
                  body: body || "You have a new notification",
                  icon: "/icon.png", // optional but recommended
                });
              } else {
                console.warn("Notifications not allowed by user");
              }
            })
            .catch((err) => console.log("Failed to receive message:", err));
        } catch (error) {
          console.error("Web notification error:", error);
        }
      } else {
        try {
          // Initialize push notifications for native platforms
          await initPushNotification();

          // Get messaging instance using getApp
          if (messaging().isDeviceRegisteredForRemoteMessages) {
            // Handle background messages in native platforms
            messaging().setBackgroundMessageHandler(async (remoteMessage) => {
              console.log(
                "Handled in background:",
                remoteMessage?.notification
              );
            });
          } else {
            await messaging().registerDeviceForRemoteMessages();
          }
        } catch (error) {
          console.error("Native notification error:", error);
        }
      }
    };

    initNotifications();
    Audio.setIsEnabledAsync(false);
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
