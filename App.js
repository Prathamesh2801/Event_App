//App.js
import { StyleSheet, View } from "react-native";
import EventRegistrationScreen from "./screens/EventRegistrationScreen";
import UserRegistrationScreen from "./screens/UserRegistrationScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./screens/HomeScreen";
import SettingScreen from "./screens/SettingScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import { Ionicons } from "@expo/vector-icons";
import ErrorPage from "./screens/ErrorPage";
import Toast from "react-native-toast-message";
import AnimatedTabBar from "./components/AnimatedTabBar";
import BackgroundVideoBanner from "./components/BackgroundVideoBanner";
import StartupScreen from "./screens/StartupScreen";
import QrScreen from "./screens/QrScreen";
import PersonalInfoScreen from "./screens/PersonalInfoScreen";
import messaging from "@react-native-firebase/messaging";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { initPushNotification } from "./helper/pushNotification";
import NotificationScreen from "./screens/NotificationScreen";
import PollScreen from "./screens/PollScreen";

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
    initPushNotification();
  }, []);

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Handled in background:", remoteMessage?.notification);
  });
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
