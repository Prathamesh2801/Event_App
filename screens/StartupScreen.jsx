// screens/StartupScreen.jsx
import  { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "./LoadingScreen";

export default function StartupScreen({ navigation }) {
  useEffect(() => {
    const checkStorageAndNavigate = async () => {
      try {
        const eventId = await AsyncStorage.getItem("eventId");
        const userId = await AsyncStorage.getItem("userId");

        if (eventId && userId) {
          navigation.replace("MyTabs", { eventId });
        } else if (eventId && !userId) {
          navigation.replace("UserRegister", { eventId });
        } else {
          navigation.replace("EventRegister");
        }
      } catch (e) {
        navigation.replace("EventRegister");
      }
    };

    checkStorageAndNavigate();
  }, []);

  return <LoadingScreen />;
}
