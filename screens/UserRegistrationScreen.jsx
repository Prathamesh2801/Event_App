import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { useLayoutEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { fetchSpecificUserId } from "../constants/api/eventApi";
import Toast from "react-native-toast-message";

export default function UserRegistrationScreen({ navigation, route }) {
  const { event, eventId } = route.params;
  const [eventName, setEventName] = useState("");
  const [eventLogo, setEventLogo] = useState("");
  const [eventIdError, setEventIdError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  useLayoutEffect(() => {
    setEventName(event.Event_Name);
    setEventLogo(`${API_BASE_URL}/uploads/event_logos/${event.Event_Logo}`);
  }, [event]);

  async function pressHandler() {
    setEventIdError("");

    if (!userId.trim()) {
      Toast.show({
        type: "error",
        text1: "User ID Not Found",
        text2: "Please Enter the User Id",
      });
      setEventIdError("Please enter an User ID.");
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

    
        return navigation.navigate("MyTabs", {
          event: response.Data.event,
          eventId: eventId,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "User Not Found !",
          text2: "Please Check the User Id",
        });
        return navigation.navigate("ErrorPage", {
          message: "User not found for ID: " + eventId,
          status: "404 Not Found",
          action: true
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "User Not Found !",
        text2: "Please Check the User Id",
      });
      return navigation.navigate("ErrorPage", {
        message:
          "There was a problem fetching the user details. Please try again.",
        status: "500 Server Error",
        action: true
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.rootOuterContainer}>
      <LinearGradient
        style={styles.rootInnerContainer}
        colors={[Colors.primary500, Colors.primary600, Colors.primary700]}
      >
        <View style={styles.container}>
          <Image source={{ uri: eventLogo }} width={150} height={150} />
          <Text style={styles.primaryText}>{eventName}</Text>
          <Text style={styles.secondaryText}> Sign in to your accounts</Text>
          <TextInput
            style={[
              styles.inputText,
              eventIdError ? styles.inputErrorBorder : null,
            ]}
            onChangeText={(text) => {
              setUserId(text);
              if (text.trim()) setEventIdError("");
            }}
            value={userId}
            placeholder="User Id : "
            editable={!loading}
          />

          {eventIdError ? (
            <Text style={styles.errorText}>{eventIdError}</Text>
          ) : null}
          {loading ? (
            <ActivityIndicator size="large" color={Colors.accent500} />
          ) : (
            <Button
              title="Submit"
              color={Colors.accent500}
              onPress={pressHandler}
              disabled={loading}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootOuterContainer: {
    flex: 1,
  },
  rootInnerContainer: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    height: "70%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
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
