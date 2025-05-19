import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
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


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={props => <AnimatedTabBar {...props} />} 
      screenOptions={{
        headerShown: false,
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
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="EventRegister">
          <Stack.Screen
            name="EventRegister"
            component={EventRegistrationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserRegister"
            component={UserRegistrationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ErrorPage"
            component={ErrorPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyTabs"
            component={MyTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}

