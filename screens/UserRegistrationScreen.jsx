import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { useLayoutEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { fetchSpecificUserId } from "../constants/api/eventApi";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundVideoBanner from "../components/BackgroundVideoBanner";
import CustomButton from "../components/CustomButton";

export default function UserRegistrationScreen({ navigation, route }) {
  const { event = {}, eventId = "" } = route.params || {};
  const [eventName, setEventName] = useState("");
  const [eventLogo, setEventLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  useLayoutEffect(() => {
    setEventName(event.Event_Name);
    setEventLogo(`${API_BASE_URL}/uploads/event_logos/${event.Event_Logo}`);
  }, [event]);

  async function pressHandler() {
    if (!userId.trim()) {
      Toast.show({
        type: "error",
        text1: "User ID Not Found",
        text2: "Please Enter Your User Id",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetchSpecificUserId(userId, eventId);
      if (response.Status === true && response.Data) {
        Toast.show({
          type: "success",
          text1: "Welcome User To : ",
          text2: response.Data.User_ID,
        });
        await AsyncStorage.setItem("eventId", eventId);
        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("eventName", event.Event_Name);
        await AsyncStorage.setItem("eventLogo", event.Event_Logo);

        return navigation.navigate("MyTabs", {
          event: response.Data.event || event,
          eventId: eventId,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "User Not Found !",
          text2: "Please Check the User Id",
        });
        setUserId("");
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "User Not Found !",
        text2: "Please Check the User Id",
      });
      setUserId("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackgroundVideoBanner />
      {Platform.OS === 'web' ? (
        <SafeAreaView style={styles.rootOuterContainer}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingVertical: 16,
              minHeight: '100%',
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.rootInnerContainer, { minHeight: '100vh' }]}>
              <View style={styles.container}>
                <Image
                  source={{ uri: eventLogo }}
                  style={{ width: 150, height: 150 }}
                />
                <Text style={styles.primaryText}>{eventName}</Text>
                <Text style={styles.secondaryText}>Sign in to your account</Text>
                <TextInput
                  style={styles.inputText}
                  onChangeText={setUserId}
                  value={userId}
                  placeholder="User Id : "
                  editable={!loading}
                />
                {loading ? (
                  <ActivityIndicator size="large" color={Colors.accent500} />
                ) : (
                  <CustomButton
                    text="Submit"
                    onPress={pressHandler}
                    color="#efab0d"
                    rippleColor="rgba(0,0,0,0.1)"
                    size="medium"
                    borderRadius={30}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.rootOuterContainer}>
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "center",
                  paddingVertical: 16,
                }}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.rootInnerContainer}>
                  <View style={styles.container}>
                    <Image
                      source={{ uri: eventLogo }}
                      style={{ width: 150, height: 150 }}
                    />
                    <Text style={styles.primaryText}>{eventName}</Text>
                    <Text style={styles.secondaryText}>Sign in to your account</Text>
                    <TextInput
                      style={styles.inputText}
                      onChangeText={setUserId}
                      value={userId}
                      placeholder="User Id : "
                      editable={!loading}
                    />
                    {loading ? (
                      <ActivityIndicator size="large" color={Colors.accent500} />
                    ) : (
                      <CustomButton
                        text="Submit"
                        onPress={pressHandler}
                        color="#efab0d"
                        rippleColor="rgba(0,0,0,0.1)"
                        size="medium"
                        borderRadius={30}
                      />
                    )}
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  rootOuterContainer: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      height: '100vh',
    }),
  },
  rootInnerContainer: {
    flex: 1,
    padding: 16,
    ...(Platform.OS === 'web' && {
      display: 'flex',
      minHeight: '100%',
    }),
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === 'web' ? {
      gap: 30,
      minHeight: 400,
    } : {
      gap: 30,
    }),
  },
  primaryText: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
  },
  secondaryText: {
    color: "white",
    fontSize: 20,
  },
  inputText: {
    width: "80%",
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    ...(Platform.OS === 'web' && {
      maxWidth: 400,
      fontSize: 16,
      outlineStyle: 'none',
      cursor: 'text',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
    }),
  },
  inputErrorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    marginBottom: 8,
  },
});
